// Capturas del carrusel de la landing con la app ACTUAL. Datos de ejemplo (Ana, el caso de la landing).
// Las respuestas de IA se simulan con textos reales de lo que devuelve hoy la IA.
const { abrir, BASE } = require('./base');
const fs = require('fs');

const solo = process.argv[2]; // opcional: nombre de una escena
const OUT = 'scripts/capturas-carrusel/salida';
fs.mkdirSync(OUT, { recursive: true });

const MAPA = {
  nombre: 'Ana García',
  fecha: '1996-05-14',
  numero: 5,
  arcanoId: 'el-hierofante',
  arcanoNombre: 'El Hierofante',
  signoId: 'tauro',
  signoNombre: 'Tauro',
  numeroExpresion: 3,
  numeroAlma: 7,
  numeroPersonalidad: 5,
  arquetipo: 'Buscas vínculos con sentido y estabilidad: no quieres emoción pasajera, quieres a alguien que se quede.',
  superpoder: 'Lealtad profunda: cuando amas, construyes con paciencia y no sueltas a la primera dificultad.',
  puntoCiego: 'Confundir constancia con aguantar: te cuesta irte de lo que ya no te nutre.',
  consejo: 'Antes de dar otra oportunidad, pregúntate si lo que sostienes es amor o costumbre.',
  proposito: 'Aprender a elegir vínculos que te devuelvan lo que tú das.',
  deseos: 'Sentirte segura y elegida, sin tener que pedirlo dos veces.',
  imagen: 'Te ven serena y fiable; a veces tu calma se malinterpreta como falta de interés.',
  version: 2,
};

const ESCENAS = {
  async inicio({ page }) {
    await page.goto(BASE + '/app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    // Sesión de ejemplo: el saludo lleva el apodo y el avatar su inicial.
    await page.evaluate(() => {
      const p = [...document.querySelectorAll('p')].find((x) => /^Buenas? /i.test((x.textContent || '').trim()));
      if (p) p.textContent = 'Buenas tardes, Ana';
      const av = document.querySelector('a[href="/app/mas"]');
      if (av) {
        const sp = av.querySelector('span');
        if (sp) sp.innerHTML = '<span style="font-weight:700;font-size:13px;line-height:1;color:var(--on-accent)">A</span>';
      }
    });
    await page.waitForTimeout(400);
  },

  async descifrar({ page }) {
    await page.route('**/api/descifrar', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          analisis: [
            { id: 'vemos', emoji: '👀', color: 'var(--an-eye)', titulo: 'Lo que vemos', texto: 'Dice «no quiero nada serio» y a la vez propone verte el finde: te ofrece cercanía sin compromiso, y cuando preguntas la hora te pide que no lo agobies.' },
            { id: 'riesgo', emoji: '⚠️', color: 'var(--an-risk)', titulo: 'Posible riesgo', texto: 'Si aceptas planes sin saber qué son, puedes acabar esperando su aviso toda la tarde. Fíjate si lo claro lo pones siempre tú.' },
            { id: 'responder', emoji: '💬', color: 'var(--accent)', titulo: 'Qué responder', texto: '«Me gusta verte, pero necesito saber a qué hora. Si no puedes confirmarlo, prefiero quedar otro día.»' },
            { id: 'pregunta', emoji: '🤔', color: 'var(--an-question)', titulo: 'Pregunta para ti', texto: '¿Estoy aceptando menos de lo que quiero por miedo a perderlo?' },
          ],
        }),
      })
    );
    await page.goto(BASE + '/app/descifrar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /Probar con un ejemplo/ }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Analizar', exact: true }).click();
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      const h = [...document.querySelectorAll('p')].find((x) => /Lo que hemos detectado/.test(x.textContent || ''));
      if (h) h.scrollIntoView({ block: 'start', behavior: 'instant' });
      window.scrollBy(0, -170);
    });
    await page.waitForTimeout(500);
  },

  async coach({ page }) {
    await page.route('**/api/coach', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          texto:
            'Gracias por contármelo, Ana. Que haya vuelto a escribirte después de tres días de silencio puede removerte mucho, y es normal que dudes.\n\nAntes de contestar, pregúntate qué necesitas tú: ¿saber qué quiere él, o sentirte tranquila con lo que respondas? Si respondes desde la ansiedad, tiende a salir un mensaje largo y explicativo. Uno corto y sereno suele cuidarte más.\n\nSi quieres, lo redactamos juntas.',
        }),
      })
    );
    await page.goto(BASE + '/app/coach', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    // Salta la presentación si aparece
    const saltar = page.getByRole('button', { name: /Prefiero saltarme esto/ });
    if (await saltar.count()) {
      await saltar.first().click();
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => {
      const el = document.querySelector('[placeholder^="Cuéntame"]');
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
      Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, 'Él me escribió hoy después de tres días sin decir nada. No sé si contestarle o hacerme la dura.');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('button[aria-label="Enviar mensaje"]').click());
    await page.waitForTimeout(2500);
  },

  // Sinergia Leo + Sagitario: texto REAL devuelto por la IA (guardado en compat-leo-sagitario.json).
  async compatibilidad({ page }) {
    const cuerpo = fs.readFileSync('scripts/capturas-carrusel/compat-leo-sagitario.json', 'utf8');
    await page.route('**/api/compatibilidad', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: cuerpo }));
    await page.goto(BASE + '/app/compatibilidad?tu=leo&su=sagitario', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /Calcular/.test(b.textContent)).click());
    await page.waitForTimeout(2500);
    // El resultado queda arriba: porcentaje, química y fricción a la vista.
    await page.evaluate(() => {
      const el = [...document.querySelectorAll('p,span,div')].find((x) => /DE SINERGIA/i.test((x.textContent || '').trim()) && x.children.length === 0);
      if (el) { const r = el.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - 170, behavior: 'instant' }); }
    });
    await page.waitForTimeout(500);
  },

  async 'tarot-temas'({ page }) {
    await page.goto(BASE + '/app/tarot', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);
  },

  async tarot({ page }) {
    // Cartas fijas (semilla 9): Sota de Copas, As de Oros (invertida) y 10 de Oros.
    await page.addInitScript(() => {
      let a = 9;
      Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    });
    await page.route('**/api/tarot', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          texto:
            [
              'La Sota de Copas habla de un mensaje o un gesto que llega con ilusión, y de tu parte más sensible abriéndose otra vez. El As de Oros invertido te pide no dar por hecha una base que todavía no está firme.',
              'El 10 de Oros muestra lo que de verdad quieres: un vínculo con raíces y calma, que dure. La pregunta es si lo que vives hoy te acerca a eso o solo te hace esperar.',
              'Pregúntate: ¿qué paso pequeño me acerca a esa estabilidad sin forzarla?',
            ].join(String.fromCharCode(10).repeat(2)),
        }),
      })
    );
    await page.goto(BASE + '/app/tarot', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /Amor/.test(b.textContent)).click());
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      const el = document.querySelector('textarea');
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, '¿Qué necesito comprender sobre lo que siento por él?');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /Sacar mis cartas/.test(b.textContent)).click());
    await page.waitForTimeout(2500);
  },

  async 'mapa-poder'({ page }) {
    await page.addInitScript((m) => localStorage.setItem('luma_mapa_poder', JSON.stringify(m)), MAPA);
    await page.goto(BASE + '/app/mapa-poder', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  },

  async diario({ page }) {
    await page.route('**/api/diario', (r) =>
      r.request().method() === 'POST'
        ? r.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              patron: 'Tres de tus últimas cuatro entradas hablan de esperar su mensaje. Cuando te sientes tranquila es porque ya decidiste tú qué hacer.',
              registros: 4,
            }),
          })
        : r.continue()
    );
    await page.goto(BASE + '/app/diario', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find((b) => /Ansiosa/.test(b.textContent)).click();
      const el = document.querySelector('textarea');
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, 'Hoy volví a mirar el móvil cada cinco minutos esperando que me escribiera. Me di cuenta y respiré antes de contestar.');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(400);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => (b.textContent || '').trim() === 'Guardar').click());
    await page.waitForTimeout(2200);
  },
};

(async () => {
  for (const nombre of Object.keys(ESCENAS)) {
    if (solo && solo !== nombre) continue;
    const { browser, ctx, page } = await abrir();
    await ctx.route('**/api/mi-plan', (rt) => rt.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ activo: true }) }));
    try {
      // Hora fija de tarde para el saludo
      await page.clock.setFixedTime(new Date('2026-10-19T17:30:00'));
      await ESCENAS[nombre]({ page, ctx });
      await page.screenshot({ path: `${OUT}/${nombre}.png` });
      console.log('✔', nombre);
    } catch (e) {
      console.log('✘', nombre, String(e).slice(0, 200));
      await page.screenshot({ path: `${OUT}/${nombre}-ERROR.png` }).catch(() => {});
    }
    await browser.close();
  }
})();
