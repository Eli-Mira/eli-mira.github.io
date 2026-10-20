import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, getProject } from '../src/data/projects.js';
import { models } from '../src/data/models.js';
import { skills } from '../src/data/skills.js';
import { lainStates } from '../src/data/lainStates.js';
import { intelSources, intelPipeline, labPrinciples } from '../src/data/lab.js';
import { graph, layoutGraph } from '../src/data/graph.js';
import { contact, origin } from '../src/data/origin.js';

const PUBLIC_LINK_ALLOWLIST = [
  'https://github.com/Eli-Mira',
  'https://github.com/Eli-Mira/EliLain-Intel-Public',
  'https://linkedin.com/in/eli-mira',
  'mailto:3emad2lden@gmail.com',
];

test('Project archive contains every reviewed project with a unique id', () => {
  const ids = projects.map(project => project.id);
  assert.deepEqual(ids, ['gesture-control', 'devsquad', 'upgradeatlas', 'elilain-intel', 'arcane-swipe', 'alphapos']);
  assert.equal(new Set(ids).size, ids.length);
  for (const project of projects) {
    for (const key of ['name', 'status', 'summary', 'problem', 'engineering', 'boundary', 'evidence']) {
      assert.ok(project[key]?.trim(), `${project.id}.${key}`);
    }
    assert.equal(getProject(project.id), project);
    assert.ok(Array.isArray(project.stack));
    assert.ok(Array.isArray(project.architecture));
    assert.ok(Array.isArray(project.challenges));
  }
  assert.equal(getProject('not-an-approved-project'), null);
});

test('Unfinished and unconfirmed projects stay explicit', () => {
  assert.equal(getProject('upgradeatlas').status, 'In development');
  assert.match(getProject('devsquad').status, /placeholder|awaiting real model calls/i);
  assert.equal(getProject('alphapos').status, 'Identity to confirm');
  assert.deepEqual(getProject('alphapos').stack, []);
  assert.deepEqual(getProject('alphapos').architecture, []);
  assert.deepEqual(getProject('alphapos').challenges, []);
  assert.equal(getProject('gesture-control').status, 'Release status in review');
  assert.match(getProject('arcane-swipe').status, /prototype/i);
});

test('No project states a metric, a count or a claim it cannot evidence', () => {
  // A number attached to a unit is a claim. Prose that merely names the idea
  // ("no user count is implied") is a disclaimer and is allowed.
  const claim = /\b\d[\d.,]*\s?(k|m|%|percent|x|users?|customers?|downloads?|stars?|ms|s\b|req\/s|rps|users\/day)/i;
  for (const project of projects) {
    for (const key of ['summary', 'problem', 'engineering', 'boundary']) {
      assert.doesNotMatch(project[key], claim, `${project.id}.${key} states an unverified number`);
    }
  }
});

test('The origin is written in the first person and says what it does not claim', () => {
  assert.ok(Array.isArray(origin.story) && origin.story.length >= 3, 'The origin needs a narrative');
  const story = origin.story.join(' ');
  assert.match(story, /\bI\b/, 'The origin should be in the first person');
  assert.match(story, /shipped, not what is planned/, 'The origin should end on the line the site is built on');
  // The two claims the site being replaced made that the source contradicts.
  assert.doesNotMatch(story, /fruit slicer/i, 'The old page named a game the repository does not contain');
  assert.doesNotMatch(story, /four specialized reviewers|runs four/i, 'The old page claimed the reviewers run; they are placeholders');
  // Nothing may be dated, because a page that lives for years should not
  // rot on a relative date or a stated age.
  assert.doesNotMatch(story, /\b\d{1,2}-?year-?old\b/i, 'The origin should not state an age');
  assert.doesNotMatch(story, /\b(three|two|four|five|six|seven) years ago\b/i, 'The origin should not use a relative date');
});

test('Public data exposes only allowlisted public links and no personal data', () => {
  const serialized = JSON.stringify({ projects, skills, models, lab: { intelSources, intelPipeline, labPrinciples }, graph, contact, origin });
  // A local machine path is a drive letter at the start of a value, not the
  // tail of a URL scheme.
  assert.doesNotMatch(serialized, /(?:^|[\s"'([{])[A-Z]:[\\/]/);
  assert.doesNotMatch(serialized, /\+20\d{8,}|\b\d{3}[- ]?\d{3}[- ]?\d{4}\b/i);
  for (const match of serialized.matchAll(/https?:\/\/[^"\\]+/g)) {
    assert.ok(PUBLIC_LINK_ALLOWLIST.includes(match[0]), `Unapproved public link: ${match[0]}`);
  }
  for (const match of serialized.matchAll(/mailto:[^"\\]+/g)) {
    assert.ok(PUBLIC_LINK_ALLOWLIST.includes(match[0]), `Unapproved contact address: ${match[0]}`);
  }
  // No address may appear outside the allowlist, wherever it sits.
  const addresses = serialized.match(/[\w.+-]+@[\w.-]+\.[A-Z]{2,}/gi) ?? [];
  for (const address of addresses) {
    assert.ok(PUBLIC_LINK_ALLOWLIST.includes(`mailto:${address}`), `Unapproved address: ${address}`);
  }
  for (const project of projects) {
    assert.equal(Object.hasOwn(project, 'repoUrl'), false);
    assert.equal(Object.hasOwn(project, 'email'), false);
  }
});

test('No invented model inventory or proficiency scores', () => {
  assert.deepEqual(models, []);
  for (const group of skills) {
    assert.ok(group.evidence);
    assert.ok(group.tools.length > 0);
    assert.equal(Object.hasOwn(group, 'score'), false);
    assert.equal(Object.hasOwn(group, 'percentage'), false);
  }
});

test('Lain has five original seven-bit ASCII states with honest explanations', () => {
  assert.deepEqual(Object.keys(lainStates), ['booting', 'idle', 'processing', 'speaking', 'disconnected']);
  const artwork = new Set();
  for (const state of Object.values(lainStates)) {
    assert.match(state.art, /L \/ [A-]/);
    for (const character of state.art) assert.ok(character === '\n' || (character >= ' ' && character <= '~'));
    assert.ok(state.message.length > 30);
    artwork.add(state.art);
  }
  assert.equal(artwork.size, Object.keys(lainStates).length);
});

test('The signal graph only links nodes that exist and is laid out deterministically', () => {
  const ids = new Set(graph.projects.concat(graph.tools, graph.concepts).map(node => node.id));
  assert.ok(graph.links.length > 0);
  for (const [from, to] of graph.links) {
    assert.ok(ids.has(from), `Unknown link source: ${from}`);
    assert.ok(ids.has(to), `Unknown link target: ${to}`);
  }
  const first = layoutGraph();
  const second = layoutGraph();
  for (const [id, position] of first) {
    assert.deepEqual(position, second.get(id), `Layout for ${id} is not deterministic`);
  }
  assert.equal(first.size, ids.size);
});
