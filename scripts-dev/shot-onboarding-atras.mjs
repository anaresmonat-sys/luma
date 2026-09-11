import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:3000/onboarding', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);

// responder pregunta 1
await p.locator('button:has-text("Tengo dudas con mi pareja")').click();
await p.waitForTimeout(500);
// responder pregunta 2
await p.locator('button:has-text("Cuando tarda en responder")').click();
await p.waitForTimeout(500);
// estamos en reconocimiento-1; volvemos atras dos veces para llegar a pregunta 1
await p.locator('button[aria-label="Atrás"]').click();
await p.waitForTimeout(500);
await p.locator('button[aria-label="Atrás"]').click();
await p.waitForTimeout(1500);

await p.screenshot({ path: 'docs/revisiones/onboarding-atras-check.png' });
console.log('saved onboarding-atras-check.png');

await b.close();
