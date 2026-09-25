import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
await p.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: '.fixed{display:none !important}' });
// Deja correr las animaciones de entrada (whileInView) recorriendo la página.
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(600);
// Deja la calculadora ya usada, para que la captura muestre también el estado con resultado.
await p.locator('select').nth(0).selectOption('libra');
await p.locator('select').nth(1).selectOption('piscis');
await p.locator('button:has-text("Calcular sinergia")').click();
await p.waitForTimeout(1500);
await p.screenshot({ path: 'docs/revisiones/landing-375.png', fullPage: true });
const m = await p.evaluate(() => ({ desborde: document.documentElement.scrollWidth - window.innerWidth, alto: document.documentElement.scrollHeight }));
console.log(JSON.stringify(m));
await b.close();
