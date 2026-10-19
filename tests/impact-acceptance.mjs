import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const [url, output, mode = 'react'] = process.argv.slice(2);
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+\//);
assert.ok(output);
fs.mkdirSync(output,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const results=[]; const details={}; const errors=[];
const sel=mode==='react'?{copy:'.hero-copy',name:'.impact-name',tabs:'.project-tabs',pause:'.motion-toggle',ascii:'.lain-badge button'}:{copy:'.copy',name:'.monogram',tabs:'.tabs',pause:'#pause-toggle',ascii:'#toggle-lain'};
async function check(id, fn) { try { await fn(); results.push({id,status:'passed'}); } catch(e) { results.push({id,status:'failed',message:e.message}); } }
async function load(page) { await page.goto(url,{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(250); }
async function motion(page) { return page.evaluate(() => ({figure:getComputedStyle(document.querySelector('.figure')).transform,slash:getComputedStyle(document.querySelector('.impact-slash')).transform,box:(()=>{const r=document.querySelector('.figure').getBoundingClientRect();return {x:r.x,y:r.y}})(),canvas:document.querySelector('canvas')?.toDataURL(),animations:document.getAnimations().filter(a=>a.playState==='running').map(a=>a.animationName)})); }
async function point(page,x,y) { await page.mouse.move(x,y); await page.waitForTimeout(160); }
function observe(page) { page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);}); }
try {
  const page=await browser.newPage({viewport:{width:1440,height:900}}); observe(page); await load(page);
  await check('49-percent-desktop-copy-split',async()=>{const b=await page.locator(sel.copy).boundingBox();details.desktopCopy=b;assert.ok(Math.abs(b.x/1440-.49)<.005,JSON.stringify(b));assert.ok(Math.abs(b.width/1440-.48)<.005,JSON.stringify(b));});
  await check('pointer-causes-real-transform-and-bounding-box-movement',async()=>{await point(page,220,300);const a=await motion(page);await point(page,500,450);const b=await motion(page);details.parallax={before:a,after:b};assert.notEqual(a.figure,'none');assert.notEqual(b.figure,'none');assert.notEqual(a.figure,b.figure);assert.ok(Math.abs(a.box.x-b.box.x)>.5 || Math.abs(a.box.y-b.box.y)>.5);assert.notEqual(a.slash,b.slash);});
  await check('pause-freezes-CSS-JS-and-canvas',async()=>{await page.locator(sel.pause).click();await page.waitForTimeout(180);const a=await motion(page);await point(page,200,600);await point(page,550,250);const b=await motion(page);details.paused={before:a,after:b};assert.equal(a.figure,b.figure);assert.equal(a.slash,b.slash);assert.equal(a.canvas,b.canvas);assert.deepEqual(b.animations,[]);assert.equal(await page.locator(sel.pause).getAttribute('aria-pressed'),'true');});
  await check('resume-re-enables-real-motion',async()=>{await page.locator(sel.pause).click();await point(page,200,400);const a=await motion(page);await point(page,500,450);const b=await motion(page);assert.notEqual(a.figure,b.figure);});
  await check('dynamic-reduced-motion-keeps-monogram-visible-and-disables-motion',async()=>{await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);await point(page,210,400);const a=await motion(page);await point(page,550,220);const b=await motion(page);assert.equal(a.figure,b.figure);assert.equal(a.slash,b.slash);assert.equal(a.canvas,b.canvas);assert.deepEqual(b.animations,[]);assert.equal(await page.locator(sel.name).evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await page.locator(sel.pause).isDisabled(),true);});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await check('ASCII-control-name-expanded-and-visible-state-match',async()=>{const button=page.locator(sel.ascii);assert.equal(await button.count(),1);for(const expanded of ['true','false']){await button.click();assert.equal(await button.getAttribute('aria-expanded'),expanded);const id=await button.getAttribute('aria-controls');assert.ok(id);assert.equal(await page.locator(`[id="${id}"]`).isVisible(),expanded==='true');assert.match(await button.innerText(),expanded==='true'?/Hide/i:/Show/i);}});
  await check('tabs-reciprocal-IDs-roving-focus-arrows-home-end-and-panel',async()=>{
    const tabs=page.locator(`${sel.tabs} [role=tab]`);const n=await tabs.count();assert.ok(n>=3);
    for(let i=0;i<n;i++){const t=tabs.nth(i);await t.click();const id=await t.getAttribute('aria-controls');const panel=page.locator(`[id="${id}"]`);assert.equal(await panel.isVisible(),true);assert.equal(await panel.getAttribute('aria-labelledby'),await t.getAttribute('id'));assert.equal(await page.getByRole('tabpanel').count(),1);assert.equal(await page.locator(`${sel.tabs} [tabindex="0"]`).count(),1);}
    await tabs.first().focus();await page.keyboard.press('Home');assert.equal(await tabs.first().getAttribute('aria-selected'),'true');await page.keyboard.press('ArrowDown');assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');assert.equal(await tabs.nth(1).evaluate(e=>e===document.activeElement),true);await page.keyboard.press('End');assert.equal(await tabs.last().getAttribute('aria-selected'),'true');await page.keyboard.press('Home');await page.keyboard.press('Tab');assert.equal(await page.getByRole('tabpanel').evaluate(e=>e===document.activeElement),true);
  });
  await check('skip-first-main-landmark-and-nav-targets',async()=>{await load(page);await page.keyboard.press('Tab');assert.match(await page.evaluate(()=>document.activeElement.textContent),/Skip/);assert.equal(await page.getByRole('main').count(),1);assert.equal(await page.locator('main[role="banner"]').count(),0);assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('nav a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);});
  await check('web-fonts-loaded-and-artwork-decodes',async()=>{details.fonts=await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})));for(const family of ['Barlow Condensed','Archivo Black','Manrope'])assert.ok(details.fonts.some(f=>f.family.replaceAll('"','')===family&&f.status==='loaded'),family);assert.equal(await page.locator('.figure').evaluate(i=>i.complete&&i.naturalWidth>0),true);});
  for(const width of [1440,1024,768,390,320]) await check(`layout-${width}-no-content-clipping-and-visible-identity`,async()=>{
    await page.setViewportSize({width,height:900});await load(page);await page.evaluate(()=>window.scrollTo(0,0));
    const g=await page.evaluate(({copy,name})=>{const rect=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,display:getComputedStyle(e).display,opacity:getComputedStyle(e).opacity}};return {document:document.documentElement.scrollWidth,viewport:innerWidth,copy:rect(copy),name:rect(name),figure:rect('.figure'),hero:rect('.hero'),h1:rect('h1')};},sel);details[`layout${width}`]=g;assert.ok(g.document<=width,JSON.stringify(g));assert.ok(g.copy.left>=0&&g.copy.right<=width+1);assert.ok(g.h1.left>=-1&&g.h1.right<=width+1);assert.notEqual(g.figure.display,'none');assert.equal(g.name.opacity,'1');assert.ok(g.name.left>=-1&&g.name.right<=width+1);assert.ok(g.copy.bottom<g.name.top || g.copy.left>g.name.right || g.copy.right<g.name.left,'copy/monogram overlap');
  });
  await check('touch-input-does-not-drive-parallax-or-block-scrolling',async()=>{
    const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});observe(touch);await load(touch);const a=await motion(touch);const cdp=await touch.context().newCDPSession(touch);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:700}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y:300}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.waitForTimeout(250);const b=await motion(touch);assert.equal(a.figure,b.figure);assert.equal(a.slash,b.slash);assert.ok(await touch.evaluate(()=>scrollY>0));await touch.close();
  });
  await check('font-failure-fallback-remains-readable-and-nonoverflowing',async()=>{const fallback=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await fallback.route('**/*.woff2',r=>r.abort());await load(fallback);assert.equal(await fallback.getByRole('heading',{level:1}).isVisible(),true);assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await fallback.screenshot({path:path.join(output,'font-fallback-mobile.png')});await fallback.close();});
  await check('clean-browser-errors',async()=>assert.deepEqual(errors,[]));
} finally { await browser.close(); }
const report={url,mode,timestamp:new Date().toISOString(),testSha256:crypto.createHash('sha256').update(fs.readFileSync(import.meta.filename)).digest('hex'),results,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length,details,errors};
fs.writeFileSync(path.join(output,'acceptance.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({mode,passed:report.passed,failed:report.failed,results},null,2));
process.exitCode=report.failed?1:0;
