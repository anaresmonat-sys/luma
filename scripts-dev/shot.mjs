import { chromium } from 'playwright';
const [url, out, w = '375', h = '900'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
// disparar los reveal whileInView recorriendo la página
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
});
// Neutraliza elementos position:fixed con transform (skip-link, headers sticky):
// Chromium puede "congelarlos" en una posición intermedia al compositar una
// captura fullPage de una página muy larga (visto antes con headers sticky).
// Nunca lo ve un usuario real (nadie hace scroll así) — es un artefacto de captura.
await p.addStyleTag({ content: 'a[href="#contenido"] { display: none !important; }' });
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log('saved', out);
