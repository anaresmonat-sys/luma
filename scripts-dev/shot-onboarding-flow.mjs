import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:3000/onboarding', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);

async function shot(name) {
  await p.waitForTimeout(900);
  await p.screenshot({ path: `docs/revisiones/onboarding-${name}.png` });
  console.log('saved', name);
}

// 1. motivo
await shot('01-motivo');
await p.locator('button:has-text("Tengo dudas con mi pareja")').click();
await p.waitForTimeout(500);

// 2. momento
await shot('02-momento');
await p.locator('button:has-text("Cuando tarda en responder")').click();
await p.waitForTimeout(500);

// 3. reconocimiento-1
await shot('03-reconocimiento-1');
await p.locator('button:has-text("Continuar")').click();
await p.waitForTimeout(500);

// 4. ayuda
await shot('04-ayuda');
await p.locator('button:has-text("Entender un mensaje")').click();
await p.waitForTimeout(500);

// 5. temor
await shot('05-temor');
await p.locator("button:has-text(\"Ser 'la intensa'\")").click();
await p.waitForTimeout(500);

// 6. reconocimiento-2
await shot('06-reconocimiento-2');
await p.locator('button:has-text("Continuar")').click();
await p.waitForTimeout(500);

// 7. slider compromiso
await shot('07-slider');
await p.locator('button:has-text("Fijar mi ritmo")').click();
await p.waitForTimeout(500);

// 8. hora
await shot('08-hora');
await p.locator('button:has-text("En la noche, antes de dormir")').click();
await p.waitForTimeout(500);

// 9. atribucion (skip)
await shot('09-atribucion');
await p.locator('button:has-text("Prefiero no decirlo")').click();
await p.waitForTimeout(500);

// 10. reconocimiento final
await shot('10-reconocimiento-final');
await p.locator('button:has-text("Continuar")').click();
await p.waitForTimeout(500);

// 11. loading (captura a mitad)
await shot('11-loading');
await p.waitForTimeout(6500);

// 12. plan listo
await shot('12-plan-listo');

await b.close();
console.log('done');
