import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { EXTRA_HEADERS, POLICY } from '../scripts/policy.mjs';

const root = path.resolve(import.meta.dirname, '..');
const policy = POLICY.replace('%SCRIPT_HASHES%', '');

test('the policy does not allow inline or evaluated script', () => {
  assert.ok(!/script-src[^;]*'unsafe-inline'/.test(policy), 'script-src must not allow unsafe-inline');
  assert.ok(!/script-src[^;]*'unsafe-eval'/.test(policy), 'script-src must not allow unsafe-eval');
  assert.match(policy, /script-src[^;]*'self'/);
});

test('the policy closes the doors that matter on a static site', () => {
  assert.match(policy, /base-uri 'none'/);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /form-action 'none'/);
  assert.match(policy, /default-src 'none'/);
});

test('the policy allows the font, image and connection sources the site uses', () => {
  assert.match(policy, /font-src[^;]*'self'/);
  assert.match(policy, /img-src[^;]*'self'/);
  assert.match(policy, /connect-src[^;]*'self'/);
});

test('the headers go with it', () => {
  const headers = EXTRA_HEADERS.join('\n');
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Referrer-Policy:/);
  assert.match(headers, /Permissions-Policy:/);
  assert.match(headers, /Cross-Origin-Opener-Policy: same-origin/);
});

test('the page has no inline event handlers', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const handlers = html.match(/\son[a-z]+\s*=/gi);
  assert.equal(handlers, null, `Inline event handlers found: ${handlers?.join(', ')}`);
});

test('every link that opens a new tab disowns the opener', () => {
  const files = [];
  const walk = relative => {
    for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      const next = path.join(relative, entry.name);
      if (entry.isDirectory()) walk(next);
      else if (/\.(jsx?|mjs)$/.test(entry.name)) files.push(next);
    }
  };
  walk('src');

  const offenders = [];
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    if (/target:\s*'_blank'|target="_blank"/.test(source) && !/noopener/.test(source)) {
      offenders.push(file);
    }
  }
  assert.deepEqual(offenders, [], `These open a new tab without noopener: ${offenders.join(', ')}`);
});
