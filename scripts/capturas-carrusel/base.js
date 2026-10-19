// Ayudantes para las capturas del carrusel (tamaño 375x812 @2x = 750x1624, igual que las actuales).
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3000';

async function abrir(extraInit, vp) {
  // vp = { width, height }: algunas escenas largas se capturan con una pantalla algo mayor (misma proporción 9:19.5)
  // para que quepan enteras; la imagen final siempre sale a 750x1624.
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({
    viewport: vp || { width: 375, height: 812 },
    deviceScaleFactor: vp ? 750 / vp.width : 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
    locale: 'es-ES',
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('luma_edad_confirmada', '1');
    } catch (e) {}
  });
  if (extraInit) await ctx.addInitScript(extraInit);
  const page = await ctx.newPage();
  return { browser, ctx, page };
}

module.exports = { abrir, BASE };
