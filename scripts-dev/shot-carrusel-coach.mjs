import { chromium } from 'playwright';
const RESPUESTA = 'Entiendo, es una etapa que engancha mucho porque el contraste entre el inicio intenso y este silencio actual te deja buscando explicaciones todo el tiempo. Lo que noto es que él bajó el ritmo, eso es un hecho, pero tu mente lo está llenando con interpretaciones que solo generan ansiedad, y ese es el verdadero riesgo aquí: no tanto lo que él hace, sino cómo te afecta la espera. ¿Qué pasaría si esta semana decides no revisar el chat cada rato y esperas a ver cómo se comporta él por su cuenta?';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
// La captura muestra el chat de quien ya tiene su plan: la bandera de prueba usada no se lee.
await ctx.addInitScript(() => {
  localStorage.setItem('luma_plan_activo', '1');
  localStorage.setItem('luma_edad_confirmada', '1');
  const leer = Storage.prototype.getItem;
  Storage.prototype.getItem = function (k) { return k === 'luma_prueba_gratis_usada' ? null : leer.call(this, k); };
});
const p = await ctx.newPage();
// Respuesta de ejemplo fija: no gasta crédito de IA y deja la captura repetible.
await p.route('**/api/coach', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ texto: RESPUESTA }) }));
await p.goto('http://127.0.0.1:3000/app/coach', { waitUntil: 'networkidle' });
await p.getByLabel('Mensaje para LUMA').fill('Estoy conociendo a un chico y al principio me escribía muchísimo. Ahora tarda horas en responder y estoy obsesionada mirando el móvil.');
await p.getByLabel('Enviar mensaje').click();
await p.waitForTimeout(2500);
await p.evaluate(() => {
  for (const e of document.querySelectorAll('p,div,span')) {
    if (e.children.length === 0 && /primer resultado es gratis/.test(e.textContent || '')) (e.closest('div[class*="rounded"]') || e).style.display = 'none';
  }
});
await p.waitForTimeout(400);
await p.screenshot({ path: 'docs/revisiones/carrusel-coach-nuevo.png' });
await b.close();
