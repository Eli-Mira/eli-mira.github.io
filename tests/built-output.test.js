import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

/**
 * Checks the built output.
 *
 * These run after the build, because the thing being checked is what was
 * actually produced: the policy has to allow the script that is really in
 * the page, and the header file has to say the same thing, or one of them
 * is a claim nobody checked.
 */
const root = path.resolve(import.meta.dirname, '..');
const built = path.join(root, 'dist');
const htmlFile = path.join(built, 'index.html');
const headersFile = path.join(built, '_headers');

const present = fs.existsSync(htmlFile) && fs.existsSync(headersFile);
const options = { skip: present ? false : 'The build output is not there. Run npm run build first.' };

const html = present ? fs.readFileSync(htmlFile, 'utf8') : '';
const headers = present ? fs.readFileSync(headersFile, 'utf8') : '';

const delivered = () => html.match(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*content="([^"]+)"/)?.[1] ?? '';

test('the built page carries the policy as a meta tag', options, () => {
  // GitHub Pages does not read the _headers file, so the meta tag is the
  // one that actually reaches the browser.
  assert.ok(delivered(), 'The built page has no content security policy');
});

test('the policy allows every inline script that is really in the page', options, () => {
  const policy = delivered();
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(inline.length > 0, 'The page should have the inline failsafe script');

  for (const [, body] of inline) {
    const digest = crypto.createHash('sha256').update(body, 'utf8').digest('base64');
    assert.ok(
      policy.includes(`'sha256-${digest}'`),
      `The policy does not allow the inline script ${digest}. The build should have filled it in.`,
    );
  }
});

test('the header file says the same thing as the page', options, () => {
  const header = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1]?.trim();
  assert.ok(header, 'The header file has no content security policy');
  assert.equal(header, `${delivered()}; frame-ancestors 'none'`,
    'The header file and the page disagree about the policy');
});

test('the header file carries the directives a meta tag cannot', options, () => {
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Referrer-Policy:/);
  assert.match(headers, /Permissions-Policy:/);
  assert.match(headers, /Cross-Origin-Opener-Policy: same-origin/);
});

test('the built site has a robots file and a sitemap', options, () => {
  assert.ok(fs.existsSync(path.join(built, 'robots.txt')), 'robots.txt is missing from the build');
  assert.ok(fs.existsSync(path.join(built, 'sitemap.xml')), 'sitemap.xml is missing from the build');
});

test('the reference build asks not to be indexed and the published one does', options, () => {
  const robots = fs.readFileSync(path.join(built, 'robots.txt'), 'utf8');
  const blocked = /Disallow: \//.test(robots);
  const meta = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
  assert.equal(blocked, /noindex/i.test(meta),
    'robots.txt and the robots meta tag disagree about whether the site may be indexed');
});
