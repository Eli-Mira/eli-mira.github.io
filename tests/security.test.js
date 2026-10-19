import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const headersFile = path.join(root, 'public/_headers');
const indexFile = path.join(root, 'index.html');

const headers = fs.existsSync(headersFile) ? fs.readFileSync(headersFile, 'utf8') : '';

function headerValue(name) {
  const match = headers.match(new RegExp(`^\\s*${name}:\\s*(.+)$`, 'im'));
  return match ? match[1].trim() : null;
}

const policy = headerValue('Content-Security-Policy') ?? '';

test('the site sends a content security policy', () => {
  assert.ok(policy, 'public/_headers must set a Content-Security-Policy');
});

test('the policy does not allow inline or evaluated script', () => {
  assert.ok(!policy.includes("'unsafe-inline'") || !/script-src[^;]*'unsafe-inline'/.test(policy),
    'script-src must not allow unsafe-inline');
  assert.ok(!/script-src[^;]*'unsafe-eval'/.test(policy), 'script-src must not allow unsafe-eval');
  assert.ok(/script-src[^;]*'self'/.test(policy), 'script-src must allow the site\'s own scripts');
});

test('the policy closes the doors that matter on a static site', () => {
  assert.match(policy, /base-uri 'none'/);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /form-action 'none'/);
  assert.match(policy, /default-src 'none'/);
});

test('the policy allows the font, image and connection sources the site uses', () => {
  assert.match(policy, /font-src[^;]*'self'/);
  assert.match(policy, /img-src[^;]*'self'/);
  assert.match(policy, /connect-src[^;]*'self'/);
});

test('the site sends the headers that stop the usual attacks', () => {
  assert.equal(headerValue('X-Content-Type-Options'), 'nosniff');
  assert.equal(headerValue('X-Frame-Options'), 'DENY');
  assert.ok(headerValue('Referrer-Policy'), 'a Referrer-Policy must be set');
  assert.ok(headerValue('Permissions-Policy'), 'a Permissions-Policy must be set');
  assert.equal(headerValue('Cross-Origin-Opener-Policy'), 'same-origin');
});

test('the page has no inline event handlers', () => {
  const html = fs.readFileSync(indexFile, 'utf8');
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
