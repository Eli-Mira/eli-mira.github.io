#!/usr/bin/env node
/**
 * Writes the released-tree manifest used by the byte-integrity test.
 *
 * Run this only when a release is intended: it records the exact bytes that
 * were reviewed, so any later edit to a released file fails the test until
 * the manifest is deliberately regenerated.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashFile } from './file-hash.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'tests/released-manifest.json');

const SKIP = new Set(['node_modules', 'dist', '.git', '.scratch', 'artifacts', 'evidence']);
const manifest = {};

function walk(relative = '') {
  const absolute = path.join(root, relative);
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      walk(next);
      continue;
    }
    if (!/\.(jsx?|mjs|css|html|json|svg|woff2|ttf|ico|txt|md|yml)$/.test(entry.name)) continue;
    const key = next.split(path.sep).join('/');
    // The manifest cannot record its own hash, so it is left out of itself.
    if (key === path.relative(root, output).split(path.sep).join('/')) continue;
    manifest[key] = hashFile(path.join(root, next));
  }
}

walk();
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${Object.keys(manifest).length} files written to ${path.relative(root, output)}`);
