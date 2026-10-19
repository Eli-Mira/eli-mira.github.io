#!/usr/bin/env node
/**
 * Runs the byte-integrity test against the current phase baseline.
 *
 * The baseline is the phase-1 evidence tree. The changed set is the explicit
 * list of files this phase is allowed to differ on. Anything not listed is
 * verified byte for byte.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CHANGED = [
  'index.html',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'src/components/character/LainBadge.jsx',
  'src/components/motion/ImpactScene.jsx',
  'src/components/motion/useMotionSettings.js',
  'src/components/navigation/Navigation.jsx',
  'src/data/projects.js',
  'src/data/skills.js',
  'src/pages/About.jsx',
  'src/pages/Contact.jsx',
  'src/pages/Home.jsx',
  'src/pages/NeuralLab.jsx',
  'src/pages/ProjectDetail.jsx',
  'src/pages/Projects.jsx',
  'src/styles/global.css',
  'src/styles/tokens.css',
  'tests/binding-integrity.test.js',
  'tests/browser-smoke.mjs',
  'tests/content.test.js',
];

const baseline = path.join(root, '../evidence/improvement-20261019/before');

const result = spawnSync(
  process.execPath,
  ['--test', 'tests/binding-integrity.test.js'],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      REDLINE_MANIFEST: path.join(root, '../evidence/improvement-20261019/before-manifest.json'),
      ...(fs.existsSync(baseline) ? { REDLINE_BASELINE: baseline } : {}),
      REDLINE_CHANGED: CHANGED.join(','),
    },
  },
);

process.exit(result.status ?? 1);
