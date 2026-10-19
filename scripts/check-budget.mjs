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
    else files.push({ file: path.relative(root, file), bytes: fs.readFileSync(file) });
  }
}
visit(root);
const total = files.reduce((sum, item) => sum + item.bytes.length, 0);
const js = files.filter(item => item.file.endsWith('.js')).reduce((sum, item) => sum + gzipSync(item.bytes).length, 0);
const css = files.filter(item => item.file.endsWith('.css')).reduce((sum, item) => sum + gzipSync(item.bytes).length, 0);
const fonts = files.filter(item => item.file.endsWith('.woff2')).reduce((sum, item) => sum + item.bytes.length, 0);
const images = files.filter(item => /\.(?:svg|ico|png|webp|avif)$/.test(item.file)).reduce((sum, item) => sum + item.bytes.length, 0);
assert.ok(total < 1_500_000, `Entire raw build: ${total}`);
assert.ok(js < 300_000, `All JavaScript gzip bytes: ${js}`);
assert.ok(css < 100_000, `CSS gzip bytes: ${css}`);
assert.ok(fonts < 100_000, `WOFF2 font bytes: ${fonts}`);
assert.ok(images < 500_000, `Image bytes: ${images}`);
assert.equal(files.some(item => item.file.endsWith('.ttf')), false, 'Raw font sources must not ship');
console.log(JSON.stringify({ status: 'passed', totalRawBuildBytes: total, allJavaScriptGzipBytes: js, cssGzipBytes: css, woff2Bytes: fonts, imageBytes: images, note: 'Raw build footprint is not the browser transfer measurement. All JS includes the optional lazy module.' }, null, 2));
