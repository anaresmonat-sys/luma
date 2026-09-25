import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await ctx.addInitScript(() => {
  localStorage.setItem('luma_diario_contador', '1');
  localStorage.setItem('luma_diario_ultimo_patron', 'Ese silencio se convirtió en pantalla para tus propios miedos, y terminaste creyéndote una historia que él nunca contó.');
  localStorage.setItem('luma_edad_confirmada', '1'); localStorage.setItem('luma_plan_activo', '1');
});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:3000/app/diario', { waitUntil: 'networkidle' });
await p.getByText('Ansiosa').first().click();
await p.locator('textarea').fill('Hoy me sentí insegura porque no me contestó en todo el día. Me dio vueltas toda la tarde y pensé que ya no le importo.');
await p.waitForTimeout(800);
await p.evaluate(() => { for (const e of document.querySelectorAll('*')) { if (e.scrollHeight > e.clientHeight + 20 && getComputedStyle(e).overflowY !== 'visible') e.scrollTop = 140; } });
await p.waitForTimeout(500);
await p.screenshot({ path: 'docs/revisiones/carrusel-diario-nuevo.png' });
await b.close();
