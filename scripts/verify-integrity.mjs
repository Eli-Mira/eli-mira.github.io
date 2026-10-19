#!/usr/bin/env node
/**
 * Runs the byte-integrity test against the released tree.
 *
 * In this repository the manifest is the released tree, so every file that
 * was reviewed and released must still be byte for byte identical. A change
 * fails the test until the release manifest is deliberately regenerated,
 * which is the only moment that says "yes, this edit was reviewed".
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = path.join(root, 'tests/released-manifest.json');

const result = spawnSync(
  process.execPath,
  ['--test', 'tests/binding-integrity.test.js'],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      REDLINE_MANIFEST: manifest,
      REDLINE_CHANGED: '',
      REDLINE_ADDED: '',
    },
  },
);

process.exit(result.status ?? 1);
