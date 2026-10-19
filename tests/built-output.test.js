import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

/**
 * Checks the built output.
 *
 * These run after the build, because the thing being checked is what was
 * actually produced: the script hash the policy allows has to match the
 * script that is really in the page, or the policy is wrong in a way no
 * source-level check would notice.
 */
const root = path.resolve(import.meta.dirname, '..');
const built = path.join(root, 'dist');
const htmlFile = path.join(built, 'index.html');
const headersFile = path.join(built, '_headers');

const present = fs.existsSync(htmlFile) && fs.existsSync(headersFile);
const options = { skip: present ? false : 'The build output is not there. Run npm run build first.' };

const html = present ? fs.readFileSync(htmlFile, 'utf8') : '';
const headers = present ? fs.readFileSync(headersFile, 'utf8') : '';

test('the built page sends the headers the source declares', options, () => {
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
});

test('the policy allows every inline script that is really in the page', options, () => {
  const policy = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1] ?? '';
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(inline.length > 0, 'The page should have the inline failsafe script');

  for (const [, body] of inline) {
    const digest = crypto.createHash('sha256').update(body, 'utf8').digest('base64');
    assert.ok(
      policy.includes(`'sha256-${digest}'`),
      `The policy does not allow the inline script ${digest}. Update the hash in public/_headers.`,
    );
  }
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
