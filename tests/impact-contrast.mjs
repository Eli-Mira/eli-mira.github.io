import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
const [url,output]=process.argv.slice(2);
assert.match(url||'',/^http:\/\/127\.0\.0\.1:\d+\//);
const luminance=rgb=>rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);
const rgb=s=>s.startsWith('#')?s.slice(1).match(/../g).map(x=>parseInt(x,16)):s.match(/[\d.]+/g).slice(0,3).map(Number);
const ratio=(a,b)=>{const x=luminance(rgb(a)),y=luminance(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
assert.equal(ratio('#000000','#ffffff'),21);
assert.equal(ratio('#ffffff','#ffffff'),1);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
const pairs=await page.evaluate(()=>{
  const selectors=['.sub, .hero-intro','.panel-lead, .section-head p','.tabs small, .project-tabs small','.status','.btn.primary, .action.primary','.toggle-lain:hover, .lain-badge button','.footer a, .footer-contact'];
  return selectors.flatMap(selector=>{
    const e=document.querySelector(selector);if(!e)return [];
    const style=getComputedStyle(e);let node=e;let background='';
    while(node){const bg=getComputedStyle(node).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent'){background=bg;break;}node=node.parentElement;}
    return [{selector,foreground:style.color,background:background||'rgb(9, 9, 12)',fontSize:style.fontSize,fontWeight:style.fontWeight,note:'Computed solid ancestor background; overlapping artwork/opacity not evaluated by this pair check.'}];
  });
});
await browser.close();
const computed=pairs.map(p=>({...p,ratio:ratio(p.foreground,p.background),AA_normal:ratio(p.foreground,p.background)>=4.5}));
const correctionPairs=[['#BCB5BB','#09090C'],['#b5a5af','#17171D'],['#A8A4A8','#09090C'],['#F2F0EF','#C31632'],['#FF3347','#09090C'],['#FF3347','#C31632']].map(([foreground,background])=>({foreground,background,ratio:ratio(foreground,background),AA_normal:ratio(foreground,background)>=4.5}));
fs.writeFileSync(output,JSON.stringify({url,computed,correctionPairs,limits:'This checks exact solid pairs, not full WCAG conformance. Gradient/image overlaps require screenshot inspection or pixel sampling.'},null,2));
console.log(JSON.stringify({computed,correctionPairs},null,2));
process.exitCode=computed.some(p=>!p.AA_normal)?1:0;
