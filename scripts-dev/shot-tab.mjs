import { chromium } from 'playwright';
const [url, out, tabs = '1', w = '375', h = '400'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle' });
for (let i = 0; i < +tabs; i++) {
  await p.keyboard.press('Tab');
  await p.waitForTimeout(150);
}
await p.screenshot({ path: out });
await b.close();
console.log('saved', out);
