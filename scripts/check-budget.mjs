#!/usr/bin/env node
/**
 * Checks the built site against the size budget.
 *
 * Only the sizes are read, and only the scripts and the styles are gzipped,
 * because those are the two the budget is stated in. Reading every file
 * into memory to measure it would cost more than the measurement.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve(import.meta.dirname, '../dist');
assert.ok(fs.existsSync(path.join(root, 'index.html')), 'Run npm run build before checking budgets');

const files = [];
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else files.push(path.relative(root, file).split(path.sep).join('/'));
  }
}
visit(root);

const sizeOf = file => fs.statSync(path.join(root, file)).size;
const gzipOf = file => gzipSync(fs.readFileSync(path.join(root, file))).length;

const total = files.reduce((sum, file) => sum + sizeOf(file), 0);
const js = files.filter(file => file.endsWith('.js')).reduce((sum, file) => sum + gzipOf(file), 0);
const css = files.filter(file => file.endsWith('.css')).reduce((sum, file) => sum + gzipOf(file), 0);
const fonts = files.filter(file => file.endsWith('.woff2')).reduce((sum, file) => sum + sizeOf(file), 0);
const images = files.filter(file => /\.(?:svg|ico|png|webp|avif)$/.test(file)).reduce((sum, file) => sum + sizeOf(file), 0);

assert.ok(total < 1_500_000, `Entire raw build: ${total}`);
assert.ok(js < 300_000, `All JavaScript gzip bytes: ${js}`);
assert.ok(css < 100_000, `CSS gzip bytes: ${css}`);
assert.ok(fonts < 100_000, `WOFF2 font bytes: ${fonts}`);
assert.ok(images < 500_000, `Image bytes: ${images}`);
assert.ok(!files.some(file => file.endsWith('.ttf')), 'Raw font sources must not ship');

console.log(JSON.stringify({
  status: 'passed',
  totalRawBuildBytes: total,
  allJavaScriptGzipBytes: js,
  cssGzipBytes: css,
  woff2Bytes: fonts,
  imageBytes: images,
  note: 'Raw build footprint is not the browser transfer measurement. All JS includes the optional lazy module.',
}, null, 2));
