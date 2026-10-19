#!/usr/bin/env node
/**
 * Serves the built site with the headers from public/_headers applied.
 *
 * GitHub Pages reads that file and sets the headers on a real deployment, but
 * the local preview server ignores it. Serving the site this way lets the
 * browser suite run against the same Content-Security-Policy the live site
 * sends, so a policy that breaks the page is caught here rather than after
 * it is published.
 *
 * Usage: node scripts/serve-with-headers.mjs [port]
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'dist');
const port = Number(process.argv[2] ?? 4180);

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

/** Reads public/_headers into a map of path pattern to headers. */
function readHeaders() {
  const file = path.join(site, '_headers');
  if (!fs.existsSync(file)) return [];
  const rules = [];
  let current = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: trimmed, headers: {} };
      rules.push(current);
      continue;
    }
    const match = trimmed.match(/^([A-Za-z0-9-]+):\s*(.*)$/);
    if (match && current) current.headers[match[1]] = match[2];
  }
  return rules;
}

const rules = readHeaders();

function headersFor(urlPath) {
  const headers = {};
  for (const rule of rules) {
    if (rule.pattern !== '/*' && urlPath !== rule.pattern) continue;
    Object.assign(headers, rule.headers);
  }
  return headers;
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requested = decodeURIComponent(url.pathname);
  let file = path.join(site, requested);

  // A path that tries to climb out of the site is refused, the same way a
  // real static host refuses it.
  if (!file.startsWith(site)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    ...headersFor(requested),
  });
  response.end(fs.readFileSync(file));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`serving ${site} with headers on http://127.0.0.1:${port}/`);
});
