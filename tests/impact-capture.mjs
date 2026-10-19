import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [url, output, label = 'capture'] = process.argv.slice(2);
if (!url?.startsWith('http://127.0.0.1:') || !output) throw new Error('Supply a loopback URL and output directory');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
const records = [];
try {
  for (const [width, height] of [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 812]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    const responses = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); responses.push({url:r.url(),status:r.status()}); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2300);
    await page.evaluate(() => window.scrollTo(0,0));
    const geometry = await page.evaluate(() => {
      const box = selector => {
        const e = document.querySelector(selector);
        if (!e) return null;
        const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
        return { x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,display:s.display,opacity:s.opacity,font:s.fontFamily,fontSize:s.fontSize,transform:s.transform };
      };
      return { viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollX,scrollY,
        hero:box('.hero'),copy:box('.copy, .hero-copy'),figure:box('.figure'),monogram:box('.monogram, .impact-name'),headline:box('h1'),
        controls:[...document.querySelectorAll('a, button')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim(),x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),
        fonts:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})),
        imageLoaded:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete && i.naturalWidth>0})),
        paints:performance.getEntriesByType('paint').map(p=>({name:p.name,time:p.startTime})) };
    });
    const stem = `${label}-${width}`;
    await page.screenshot({ path:path.join(output,`${stem}.png`) });
    await page.screenshot({ path:path.join(output,`${stem}-full.png`),fullPage:true });
    records.push({width,height,errors,responses,geometry,screenshot:`${stem}.png`});
    await page.close();
  }
} finally {
  await browser.close();
  fs.writeFileSync(path.join(output,`${label}-measurements.json`),JSON.stringify({url,records},null,2));
}
console.log(JSON.stringify(records.map(r=>({width:r.width,errors:r.errors,scrollWidth:r.geometry.scrollWidth,copy:r.geometry.copy,monogram:r.geometry.monogram})),null,2));
console.log('capture-script-sha256',crypto.createHash('sha256').update(fs.readFileSync(import.meta.filename)).digest('hex'));
