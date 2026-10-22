// Pruebas de recorrido (extremo a extremo): abren la web de verdad en un navegador con tamaño de móvil.
// Por defecto se prueban contra http://localhost:3000 (hay que tener la app arrancada). Para probar la web publicada:
//   E2E_BASE_URL=https://www.tuluma.app npm run test:e2e
// No crean compras ni cuentas: solo comprueban que lo público funciona y que lo privado está cerrado.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium, type Browser, type BrowserContext } from 'playwright';

const BASE = (process.env.E2E_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

let navegador: Browser;
let movil: BrowserContext;

beforeAll(async () => {
  navegador = await chromium.launch({ channel: 'chrome' });
  movil = await navegador.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  // Sin esto la puerta de edad tapa la pantalla que se quiere comprobar.
  await movil.addInitScript(() => window.localStorage.setItem('luma_edad_confirmada', '1'));
}, 60_000);

afterAll(async () => {
  await navegador?.close();
});

async function abrir(ruta: string) {
  const pagina = await movil.newPage();
  const respuesta = await pagina.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });
  return { pagina, respuesta };
}

describe('páginas públicas', () => {
  it('la landing carga, con titular, precios en US$ y sin desbordes laterales', async () => {
    const { pagina, respuesta } = await abrir('/');
    expect(respuesta?.status()).toBe(200);
    await pagina.waitForSelector('h1');
    expect((await pagina.locator('h1').innerText()).length).toBeGreaterThan(10);
    expect(await pagina.locator('body').innerText()).toContain('US$9,99');
    const ancho = await pagina.evaluate(() => ({ contenido: document.documentElement.scrollWidth, ventana: window.innerWidth }));
    expect(ancho.contenido).toBeLessThanOrEqual(ancho.ventana);
    await pagina.close();
  }, 30_000);

  it('la pantalla de planes muestra los dos precios en US$ y la nota de moneda', async () => {
    const { pagina, respuesta } = await abrir('/paywall');
    expect(respuesta?.status()).toBe(200);
    await pagina.waitForSelector('text=Empezar mis 3 días gratis');
    const texto = await pagina.locator('body').innerText();
    expect(texto).toContain('US$9,99');
    expect(texto).toContain('US$89,99');
    expect(texto).toContain('Precios en dólares (US$)');
    expect(texto).toContain('sigues con tu prueba hasta el día 3');
    await pagina.close();
  }, 30_000);

  it('Entrar pide el correo y avisa si el enlace ya no sirve', async () => {
    const { pagina } = await abrir('/entrar?error=enlace');
    await pagina.waitForSelector('input[type="email"]');
    await pagina.waitForSelector('text=Ese enlace ya no es válido');
    await pagina.close();
  }, 30_000);

  it('el enlace del correo NO se gasta al abrirlo: muestra el botón «Entrar a LUMA»', async () => {
    const { pagina } = await abrir('/auth/callback?token_hash=prueba&type=email&next=/app');
    await pagina.waitForSelector('button:has-text("Entrar a LUMA")');
    expect(pagina.url()).toContain('/auth/callback');
    await pagina.close();
  }, 30_000);

  it.each(['/privacidad', '/terminos', '/cookies', '/reembolsos', '/aviso-ia'])('%s carga', async (ruta) => {
    const { pagina, respuesta } = await abrir(ruta);
    expect(respuesta?.status()).toBe(200);
    await pagina.close();
  }, 30_000);
});

describe('lo privado está cerrado', () => {
  it.each(['/api/cancelar-plan', '/api/pedir-reembolso', '/api/cuenta/eliminar'])('POST %s sin sesión devuelve 401', async (ruta) => {
    const r = await movil.request.post(BASE + ruta);
    expect(r.status()).toBe(401);
  });

  it('el webhook de Hotmart rechaza avisos sin la clave', async () => {
    const r = await movil.request.post(BASE + '/api/webhooks/hotmart', { data: { event: 'PURCHASE_APPROVED' } });
    // Sin la clave nunca debe aceptarlo (en producción responde 401; en local, sin clave configurada, falla cerrado con 500).
    expect(r.status()).not.toBe(200);
  });

  it('el panel de administración no se ve sin sesión', async () => {
    const { pagina } = await abrir('/admin/ventas');
    expect(await pagina.locator('body').innerText()).not.toContain('Peticiones de reembolso');
    await pagina.close();
  }, 30_000);
});

describe('seguridad y buscadores', () => {
  it('las cabeceras de seguridad están puestas', async () => {
    const r = await movil.request.get(BASE + '/');
    const h = r.headers();
    expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
  });

  it('robots, sitemap y versión responden', async () => {
    expect((await movil.request.get(BASE + '/robots.txt')).status()).toBe(200);
    expect((await movil.request.get(BASE + '/sitemap.xml')).status()).toBe(200);
    const v = await movil.request.get(BASE + '/api/version');
    expect(v.status()).toBe(200);
    expect(await v.json()).toHaveProperty('commit');
  });
});
