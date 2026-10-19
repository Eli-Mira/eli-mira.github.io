import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');

/**
 * Byte integrity.
 *
 * The manifest is the record of a known-good state, and the changed set is the
 * explicit list of files allowed to differ from it. Two arrangements are used:
 *
 *   - the working project: the manifest is the phase-1 baseline, the files
 *     that this phase changed are listed as exceptions, and the baseline tree
 *     is checked to still match its own manifest;
 *   - the published repository: the manifest is the released tree, so any
 *     change to a released file fails until the manifest is deliberately
 *     regenerated.
 *
 * REDLINE_MANIFEST, REDLINE_BASELINE and REDLINE_CHANGED point at them.
 */
const phaseManifest = path.resolve(root, '../evidence/improvement-20261019/before-manifest.json');
const releasedManifest = path.resolve(root, 'tests/released-manifest.json');

const manifestPath = process.env.REDLINE_MANIFEST
  ? path.resolve(root, process.env.REDLINE_MANIFEST)
  : fs.existsSync(phaseManifest) ? phaseManifest : releasedManifest;

const baselinePath = process.env.REDLINE_BASELINE
  ? path.resolve(root, process.env.REDLINE_BASELINE)
  : null;

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const changed = new Set(
  (process.env.REDLINE_CHANGED ?? '')
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean),
);
const added = new Set(
  (process.env.REDLINE_ADDED ?? '')
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean),
);

const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

/** The same file selection the release manifest uses, so the two agree. */
const SKIP = new Set(['node_modules', 'dist', '.git', '.scratch', 'artifacts', 'evidence']);
const SOURCE = /\.(jsx?|mjs|css|html|json|svg|woff2|ttf|ico|txt|md|yml)$/;

function treeFiles(relative = '') {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) return [];
  const found = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      found.push(...treeFiles(next));
      continue;
    }
    if (!SOURCE.test(entry.name)) continue;
    found.push(next.split(path.sep).join('/'));
  }
  return found;
}

test('The recorded baseline still matches its manifest', { skip: !baselinePath }, () => {
  for (const [file, hash] of Object.entries(manifest)) {
    assert.equal(sha(path.join(baselinePath, file)), hash, `Baseline changed: ${file}`);
  }
});

test('Every file in the manifest is present in the tree', () => {
  for (const file of Object.keys(manifest)) {
    assert.ok(fs.existsSync(path.join(root, file)), `Missing from the tree: ${file}`);
  }
});

test('Everything outside the declared change scope is byte-identical to the baseline', () => {
  const protectedEntries = Object.entries(manifest).filter(([file]) => !changed.has(file));
  assert.ok(protectedEntries.length > 0, 'Must protect the complete baseline outside the explicit change scope');
  for (const [file, hash] of protectedEntries) {
    assert.equal(sha(path.join(root, file)), hash, `Out-of-scope mutation: ${file}`);
  }
});

test('Every file introduced by this phase is declared and present', () => {
  for (const file of added) {
    assert.ok(fs.existsSync(path.join(root, file)), `Declared new file is missing: ${file}`);
  }
});

test('No file in the tree is unaccounted for', () => {
  // A file that is neither in the baseline, nor a declared change, nor a
  // declared addition would otherwise slip past the guard entirely.
  const accounted = new Set([...Object.keys(manifest), ...changed, ...added]);
  // The manifest cannot record its own hash, so it is not expected to.
  accounted.add(path.relative(root, manifestPath).split(path.sep).join('/'));
  const unaccounted = treeFiles().filter(file => !accounted.has(file));
  assert.deepEqual(unaccounted, [], `Unaccounted files in the tree: ${unaccounted.join(', ')}`);
});
