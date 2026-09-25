import { chromium } from 'playwright';

const b = await chromium.launch();
for (const ancho of [375, 360]) {
  const p = await b.newPage({ viewport: { width: ancho, height: 812 }, deviceScaleFactor: 2 });
  await p.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  // Oculta los elementos fijos (enlace "Saltar al contenido" y barra pegajosa): en una captura de
  // sección se arrastran encima y no forman parte de la sección que se está midiendo.
  await p.addStyleTag({ content: '.fixed{display:none !important}' });
  await p.locator('#sinergia').scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);

  if (ancho === 375) await p.locator('#sinergia').screenshot({ path: 'docs/revisiones/landing-sinergia-375-antes.png' });

  await p.locator('select').nth(0).selectOption('aries');
  await p.locator('select').nth(1).selectOption('leo');
  await p.locator('button:has-text("Calcular sinergia")').click();
  await p.waitForTimeout(1600);

  if (ancho === 375) await p.locator('#sinergia').screenshot({ path: 'docs/revisiones/landing-sinergia-375-despues.png' });

  const medidas = await p.evaluate(() => ({
    desborde_horizontal: document.documentElement.scrollWidth - window.innerWidth,
    porcentaje: document.querySelector('#sinergia [aria-live=polite] p:nth-of-type(2)')?.textContent,
  }));
  console.log(ancho, JSON.stringify(medidas));
  await p.close();
}
await b.close();
