import { chromium } from 'playwright';
const [url, out, sel, w = '375'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,400)); });
const el = await p.$(sel);
if (!el) { console.log('NOT FOUND', sel); process.exit(1); }
await el.scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
await el.screenshot({ path: out });
await b.close();
console.log('saved', out);
