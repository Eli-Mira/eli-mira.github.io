import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.env.REDLINE_PREVIEW_URL || 'http://127.0.0.1:4179/';
assert.match(url, /^http:\/\/127\.0\.0\.1:\d+\//, 'Only exercise the local reference');
const output = process.env.REDLINE_EVIDENCE || path.resolve(import.meta.dirname, '../evidence/browser');
fs.mkdirSync(output, { recursive: true });
const results = [];
const consoleErrors = [];
const requests = [];
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });

async function check(id, run) {
  try { await run(); results.push({ id, status: 'passed' }); }
  catch (error) { results.push({ id, status: 'failed', message: error.message }); throw error; }
}

/**
 * Driver-level WebGL performance notes are not page defects. They appear
 * because this suite reads canvas pixels back to compare frames, which stalls
 * the GPU pipeline. Anything the page itself logs is still recorded.
 */
const DRIVER_NOISE = /GL Driver Message|\.WebGL-|GPU stall due to ReadPixels/i;

function observe(page) {
  page.on('pageerror', error => consoleErrors.push(error.message));
  page.on('console', message => {
    if (!['error', 'warning'].includes(message.type())) return;
    if (DRIVER_NOISE.test(message.text())) return;
    consoleErrors.push(`${message.type()}: ${message.text()}`);
  });
  page.on('request', request => requests.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) consoleErrors.push(`HTTP ${response.status()}: ${response.url()}`); });
}

async function ready(page) {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  // The entrance sequence runs on load; let it settle before measuring.
  await page.waitForTimeout(1200);
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  observe(page);
  await ready(page);

  await check('desktop-headline-and-navigation', async () => {
    assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
    assert.match(await page.getByRole('heading', { level: 1 }).innerText(), /BUILT BY HUMAN\.\s*AMPLIFIED BY AI\./);
    assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').count(), 5);
    assert.equal(await page.locator('dialog').isVisible(), false);
  });

  await check('destination-strip-links-to-existing-sections', async () => {
    const links = page.locator('.destinations a');
    assert.equal(await links.count(), 6);
    for (const href of await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) {
      assert.equal(await page.locator(href).count(), 1, `Missing target: ${href}`);
    }
  });

  await check('section-index-labels-follow-the-brief-architecture', async () => {
    const labels = (await page.locator('.section-index').allInnerTexts()).map(label => label.toLowerCase());
    assert.equal(labels.length, 5);
    for (const [index, name] of [['01', 'operations'], ['02', 'neural lab'], ['03', 'system profile'], ['04', 'origin'], ['05', 'transmission']]) {
      assert.ok(labels.some(label => label.includes(index) && label.includes(name)), `Missing section ${index} ${name}: ${JSON.stringify(labels)}`);
    }
  });

  await check('hero-depth-field-renders-real-pixels', async () => {
    const canvas = page.locator('canvas.impact-scene');
    await canvas.waitFor({ state: 'attached' });
    await page.waitForFunction(() => document.querySelector('canvas.impact-scene')?.dataset.render === 'live', null, { timeout: 15000 });
    const painted = await canvas.evaluate(node => {
      const copy = document.createElement('canvas');
      copy.width = node.width;
      copy.height = node.height;
      copy.getContext('2d').drawImage(node, 0, 0);
      const { data } = copy.getContext('2d').getImageData(0, 0, copy.width, copy.height);
      let lit = 0;
      for (let index = 3; index < data.length; index += 4) if (data[index] > 8) lit += 1;
      return { lit, total: data.length / 4 };
    });
    assert.ok(painted.lit > 500, `Depth field painted only ${painted.lit} pixels`);
  });

  await check('pause-freezes-canvas-pixels', async () => {
    await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
    await page.waitForTimeout(200);
    const canvas = page.locator('canvas.impact-scene');
    const image = await canvas.evaluate(node => node.toDataURL());
    await page.waitForTimeout(300);
    assert.equal(await canvas.evaluate(node => node.toDataURL()), image);
    assert.equal(await page.getByRole('button', { name: 'Resume motion', exact: true }).getAttribute('aria-pressed'), 'true');
  });

  await check('resume-restarts-canvas-drawing', async () => {
    const canvas = page.locator('canvas.impact-scene');
    const before = await canvas.evaluate(node => node.toDataURL());
    await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
    await page.waitForTimeout(400);
    assert.notEqual(await canvas.evaluate(node => node.toDataURL()), before);
  });

  await check('boot-dialog-is-optional-and-skippable', async () => {
    await page.getByRole('button', { name: 'Replay title sequence' }).click();
    assert.equal(await page.getByRole('dialog').isVisible(), true);
    await page.getByRole('button', { name: 'Skip sequence' }).click();
    assert.equal(await page.locator('dialog').isVisible(), false);
    assert.match(await page.evaluate(() => document.activeElement.textContent), /Replay title sequence/);
  });

  for (const name of ['UpgradeAtlas', 'EliLain Intel', 'Gesture Control', 'DevSquad', 'Arcane Swipe']) {
    await check(`project-selection-${name}`, async () => {
      await page.getByRole('tab', { name: new RegExp(name) }).click();
      assert.equal(await page.getByRole('tabpanel').getByRole('heading', { level: 3 }).innerText(), name);
      assert.equal(await page.getByRole('tab', { selected: true }).count(), 1);
    });
  }

  await check('project-panel-is-wired-to-its-tab', async () => {
    const tab = page.getByRole('tab', { selected: true });
    const id = await tab.getAttribute('id');
    assert.equal(await page.getByRole('tabpanel').getAttribute('aria-labelledby'), id);
    assert.equal(await tab.getAttribute('aria-controls'), 'project-panel');
  });

  await check('project-keyboard-selection', async () => {
    await page.getByRole('tab', { selected: true }).focus();
    await page.keyboard.press('End');
    const last = await page.getByRole('tab', { selected: true }).innerText();
    await page.keyboard.press('Home');
    const first = await page.getByRole('tab', { selected: true }).innerText();
    assert.match(first, /Gesture Control/);
    assert.notEqual(first, last);
  });

  await check('project-detail-shows-evidence-and-boundary', async () => {
    await page.getByRole('tab', { name: /Gesture Control/ }).click();
    const detail = page.getByRole('tabpanel');
    assert.match(await detail.innerText(), /Architecture/i);
    assert.match(await detail.innerText(), /contracts\.py/);
    assert.match(await detail.innerText(), /does not claim/i);
  });

  await page.locator('#projects').screenshot({ path: path.join(output, 'desktop-projects.png') });

  await check('lain-loads-only-on-request', async () => {
    assert.equal(requests.some(request => request.includes('LainConsole-')), false);
    await page.getByRole('button', { name: 'Open Lain interface' }).click();
    await page.getByRole('button', { name: 'Idle', exact: true }).waitFor();
    assert.equal(requests.some(request => request.includes('LainConsole-')), true);
  });

  for (const [label, id] of [['Booting', 'booting'], ['Idle', 'idle'], ['Processing', 'processing'], ['Speaking', 'speaking'], ['Disconnected', 'disconnected']]) {
    await check(`lain-state-${id}`, async () => {
      const button = page.getByRole('button', { name: label, exact: true });
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.ascii').getAttribute('data-state'), id);
      assert.ok((await page.locator('.lain-message').innerText()).length > 30);
    });
  }

  await check('signal-graph-renders-and-has-a-text-equivalent', async () => {
    await page.waitForFunction(() => [...document.querySelectorAll('canvas')].some(node => node.dataset.render === 'live'), null, { timeout: 15000 });
    const entries = await page.locator('.signal-list li').count();
    assert.equal(entries, 5);
    assert.match(await page.locator('.signal-list').innerText(), /MediaPipe/);
  });

  await page.locator('#neural-lab').screenshot({ path: path.join(output, 'desktop-lain.png') });

  await check('scrolled-sections-are-visible-after-reveal', async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1400);
    const opacities = await page.locator('[data-reveal-item]').evaluateAll(nodes => nodes.map(node => Number(getComputedStyle(node).opacity)));
    for (const opacity of opacities) assert.ok(opacity > 0.95, `Revealed content stuck at opacity ${opacity}`);
  });

  await check('pause-releases-content-that-has-not-been-revealed', async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
    const opacities = await page.locator('[data-reveal-item]').evaluateAll(nodes => nodes.map(node => Number(getComputedStyle(node).opacity)));
    for (const opacity of opacities) assert.ok(opacity > 0.95, `Paused content stranded at opacity ${opacity}`);
    await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
  });

  for (const [width, height] of [[1440, 900], [1366, 650], [1024, 900], [768, 1024], [390, 844], [320, 812]]) {
    await check(`layout-${width}x${height}`, async () => {
      await page.setViewportSize({ width, height });
      await ready(page);
      const geometry = await page.evaluate(() => ({
        width: innerWidth,
        document: document.documentElement.scrollWidth,
        heading: document.querySelector('h1').getBoundingClientRect().right,
        monogram: document.querySelector('.impact-name').getBoundingClientRect().right,
      }));
      assert.ok(geometry.document <= geometry.width, JSON.stringify(geometry));
      assert.ok(geometry.heading <= geometry.width + 2, JSON.stringify(geometry));
      assert.ok(geometry.monogram <= geometry.width + 2, JSON.stringify(geometry));
      if (width === 1440) { await page.screenshot({ path: path.join(output, 'desktop-home.png') }); await page.screenshot({ path: path.join(output, 'desktop-full.png'), fullPage: true }); }
      if (width === 390) { await page.screenshot({ path: path.join(output, 'mobile-home.png'), fullPage: false }); await page.screenshot({ path: path.join(output, 'mobile-full.png'), fullPage: true }); }
    });
  }

  await check('mobile-menu-escape-and-anchor', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page);
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.click();
    assert.equal(await page.getByRole('button', { name: 'Close', exact: true }).getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert.equal(await menu.evaluate(element => element === document.activeElement), true);
    await menu.click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About', exact: true }).click();
    await page.waitForTimeout(1200);
    assert.ok(page.url().endsWith('#origin'), page.url());
    // Choosing a destination closes the menu.
    assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
  });

  await check('primary-action-sweeps-a-fill-on-hover', async () => {
    const cta = page.locator('.hero-copy .action.primary');
    const fill = () => cta.evaluate(node => getComputedStyle(node, '::before').transform);
    const before = await fill();
    await cta.hover();
    await page.waitForTimeout(600);
    const after = await fill();
    assert.notEqual(before, after, 'The action fill did not move on hover');
  });

  await check('navigation-links-draw-an-underline-on-hover', async () => {
    // The navigation collapses below 768px, so this runs at desktop width.
    await page.setViewportSize({ width: 1440, height: 900 });
    await ready(page);
    const link = page.locator('.navigation a').first();
    const rule = () => link.evaluate(node => getComputedStyle(node, '::after').transform);
    const before = await rule();
    await link.hover();
    await page.waitForTimeout(500);
    assert.notEqual(before, await rule(), 'The navigation underline did not appear on hover');
  });

  await check('the-reading-progress-bar-tracks-the-scroll', async () => {
    const bar = page.locator('[data-progress-fill]');
    assert.equal(await bar.count(), 1);
    const width = () => bar.evaluate(node => node.getBoundingClientRect().width);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    const atTop = await width();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    const atBottom = await width();
    assert.ok(atBottom > atTop + 20, `Progress did not advance: ${atTop} -> ${atBottom}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
  });

  await check('the-signal-graph-renders-lit-nodes-and-links', async () => {
    await page.evaluate(() => document.querySelector('#neural-lab')?.scrollIntoView());
    await page.waitForTimeout(1200);
    const painted = await page.evaluate(() => {
      const canvas = document.querySelector('.signal-graph-canvas canvas');
      if (!canvas) return { lit: 0, total: 0 };
      const copy = document.createElement('canvas');
      copy.width = canvas.width;
      copy.height = canvas.height;
      copy.getContext('2d').drawImage(canvas, 0, 0);
      const { data } = copy.getContext('2d').getImageData(0, 0, copy.width, copy.height);
      let lit = 0;
      for (let index = 3; index < data.length; index += 4) if (data[index] > 10) lit += 1;
      return { lit, total: data.length / 4 };
    });
    assert.ok(painted.lit > 200, `Signal graph drew only ${painted.lit} lit pixels`);
  });

  await check('contact-channels-match-the-published-site', async () => {
    const links = await page.locator('.contact-list a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
    assert.deepEqual(links, [
      'https://github.com/Eli-Mira',
      'https://linkedin.com/in/eli-mira',
      'mailto:3emad2lden@gmail.com',
    ]);
  });

  await check('skip-link-is-the-first-focusable-element', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await ready(page);
    await page.keyboard.press('Tab');
    assert.match(await page.evaluate(() => document.activeElement.textContent), /Skip to content/);
    assert.equal(await page.getByRole('main').count(), 1);
  });

  await check('reduced-motion-is-static', async () => {
    const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    observe(reduced);
    await ready(reduced);
    assert.equal(await reduced.getByRole('button', { name: 'Motion reduced' }).isDisabled(), true);
    await reduced.waitForTimeout(400);
    const canvas = reduced.locator('canvas.impact-scene');
    const image = await canvas.evaluate(node => node.toDataURL());
    await reduced.waitForTimeout(400);
    assert.equal(await canvas.evaluate(node => node.toDataURL()), image);
    const opacity = await reduced.locator('.impact-name').evaluate(node => Number(getComputedStyle(node).opacity));
    assert.equal(opacity, 1);
    // Nothing may be left hidden when motion is reduced.
    const hidden = await reduced.evaluate(() => [...document.querySelectorAll('[data-reveal-item]')]
      .filter(node => Number(getComputedStyle(node).opacity) < 0.99).length);
    assert.equal(hidden, 0, `${hidden} elements stayed hidden under reduced motion`);
    await reduced.close();
  });

  await check('pause-freezes-the-scene-and-releases-hidden-content', async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
    await page.waitForTimeout(500);
    assert.equal(await page.locator('canvas.impact-scene').evaluate(node => node.dataset.render), 'held');
    assert.equal(await page.getByRole('button', { name: 'Resume motion', exact: true }).getAttribute('aria-pressed'), 'true');
    // Pausing must never strand content at zero opacity.
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal-item]')]
      .filter(node => Number(getComputedStyle(node).opacity) < 0.99).length);
    assert.equal(hidden, 0, `${hidden} elements stayed hidden while paused`);
    await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
  });

  await check('normal-flows-have-clean-console-and-local-only-requests', async () => {
    assert.deepEqual(consoleErrors, []);
    assert.ok(requests.every(request => request.startsWith(new URL(url).origin + '/')), 'A request left the local origin');
  });

  await check('failed-lazy-module-has-a-usable-error-boundary', async () => {
    const failure = await browser.newPage();
    await failure.route('**/LainConsole-*.js', route => route.abort());
    await ready(failure);
    await failure.getByRole('button', { name: 'Open Lain interface' }).click();
    await failure.getByRole('alert').waitFor();
    assert.match(await failure.getByRole('alert').innerText(), /rest of the portfolio is still available/);
    assert.equal(await failure.getByRole('button', { name: 'Reload preview' }).isVisible(), true);
    await failure.close();
  });
} finally {
  await browser.close();
  const report = {
    url,
    browser: browser.version(),
    results,
    passed: results.filter(result => result.status === 'passed').length,
    failed: results.filter(result => result.status === 'failed').length,
    normalFlowConsoleErrors: consoleErrors,
    networkOrigins: [...new Set(requests.map(request => new URL(request).origin))],
    note: 'The deliberately aborted lazy-chunk case is a separate expected-failure context, not a normal-flow console-clean claim. WebGL driver performance notes are excluded because this suite reads canvas pixels back to compare frames.',
  };
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
