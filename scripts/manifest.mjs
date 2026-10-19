import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Writes a SHA-256 manifest for a directory tree.
 *
 * Usage: node scripts/manifest.mjs <directory> <output.json>
 *
 * The manifest is the record a byte-integrity test compares against. It is
 * written with forward slashes so the same file works on any platform.
 */
const [directory, output] = process.argv.slice(2);

if (!directory || !output) {
  console.error('Usage: node scripts/manifest.mjs <directory> <output.json>');
  process.exit(1);
}

const base = path.resolve(directory);
const manifest = {};

function walk(relative = '') {
  const absolute = path.join(base, relative);
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      walk(next);
      continue;
    }
    const key = next.split(path.sep).join('/');
    manifest[key] = crypto.createHash('sha256').update(fs.readFileSync(path.join(base, next))).digest('hex');
  }
}

walk();
fs.writeFileSync(path.resolve(output), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${Object.keys(manifest).length} files written to ${output}`);
