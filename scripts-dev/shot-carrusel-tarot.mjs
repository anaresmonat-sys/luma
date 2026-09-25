import { chromium } from 'playwright';
const c = (i, id, n, nombre) => ({ numero: n, nombre, invertida: false, cita: '', imagen: `/tarot/${i}-${id}.webp` });
const hoy = new Date();
const guardadas = {
  amor: { cartas: [c(6, 'los-enamorados', 'VI', 'Los Enamorados')], texto: 'x' },
  ruptura: { cartas: [c(17, 'la-estrella', 'XVII', 'La Estrella')], texto: 'x' },
  decision: { cartas: [c(11, 'la-justicia', 'XI', 'La Justicia')], texto: 'x' },
  autoconocimiento: { cartas: [c(19, 'el-sol', 'XIX', 'El Sol')], texto: 'x' },
  'carta-del-dia': { cartas: [c(1, 'el-mago', 'I', 'El Mago')], texto: 'x', fecha: `${hoy.getFullYear()}-${hoy.getMonth()}-${hoy.getDate()}` },
};
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await ctx.addInitScript((g) => {
  localStorage.setItem('luma_tiradas_guardadas', JSON.stringify(g));
  localStorage.setItem('luma_ultima_tirada', 'ruptura');
  localStorage.setItem('luma_edad_confirmada', '1');
}, guardadas);
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:3000/app/tarot', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
console.log('url', p.url());
await p.screenshot({ path: 'docs/revisiones/carrusel-tarot-nuevo.png' });
await b.close();
