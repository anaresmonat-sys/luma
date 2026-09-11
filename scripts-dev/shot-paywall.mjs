import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });

// Directo, sin pasar por onboarding (sin localStorage) — version no personalizada
await p.goto('http://127.0.0.1:3000/paywall', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);
await p.screenshot({ path: 'docs/revisiones/paywall-sin-datos.png' });
console.log('saved paywall-sin-datos');

// Completar el onboarding rapido para poblar localStorage
await p.goto('http://127.0.0.1:3000/onboarding', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.locator('button:has-text("Tengo dudas con mi pareja")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Cuando tarda en responder")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Continuar")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Entender un mensaje")').click();
await p.waitForTimeout(500);
await p.locator("button:has-text(\"Ser 'la intensa'\")").click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Continuar")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Fijar mi ritmo")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("En la noche, antes de dormir")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Prefiero no decirlo")').click();
await p.waitForTimeout(500);
await p.locator('button:has-text("Continuar")').click();
await p.waitForTimeout(500);
// loading (4-6s) + espera adicional
await p.waitForTimeout(6500);

await p.locator('a:has-text("Ver mi plan completo")').click();
await p.waitForTimeout(900);
await p.screenshot({ path: 'docs/revisiones/paywall-375.png', fullPage: true });
console.log('saved paywall-375 (personalizado, full page)');

// Verificar seleccion de plan mensual
await p.locator('button:has-text("Mensual")').click();
await p.waitForTimeout(500);
await p.screenshot({ path: 'docs/revisiones/paywall-mensual-seleccionado.png', fullPage: true });
console.log('saved paywall-mensual-seleccionado');

// Verificar estado confirmado (CTA simulado)
await p.locator('button:has-text("Empezar mis 3 días gratis")').click();
await p.waitForTimeout(600);
await p.screenshot({ path: 'docs/revisiones/paywall-confirmado.png' });
console.log('saved paywall-confirmado');

await b.close();
