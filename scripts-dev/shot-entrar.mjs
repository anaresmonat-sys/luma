import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:3000/entrar', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
await p.screenshot({ path: 'docs/revisiones/entrar-375.png' });
console.log('saved entrar-375');

await p.locator('input[type="email"]').fill('valentina@ejemplo.com');
await p.locator('button:has-text("Enviarme mi enlace de acceso")').click();
await p.waitForTimeout(1000);
await p.screenshot({ path: 'docs/revisiones/entrar-enviado.png' });
console.log('saved entrar-enviado');

await b.close();
