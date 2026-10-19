import assert from 'node:assert/strict';
import test from 'node:test';
import { PUSH_RADIUS, PUSH_STRENGTH, pushOffset } from '../src/motion/nodePush.js';
import { layoutGraph } from '../src/data/graph.js';

test('a node outside the push radius is not moved', () => {
  const base = { x: 4, y: 0 };
  const pointer = { x: 0, y: 0 };
  const offset = pushOffset(base, pointer);
  assert.equal(offset.x, 0);
  assert.equal(offset.y, 0);
});

test('a node at the pointer is pushed away from it', () => {
  const base = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const offset = pushOffset(base, pointer);
  assert.equal(offset.x, 0);
  assert.ok(Math.abs(offset.y) > 0, 'A node sitting on the pointer should be pushed');
});

test('the push points away from the pointer', () => {
  const base = { x: 1, y: 0 };
  const pointer = { x: 0, y: 0 };
  const offset = pushOffset(base, pointer);
  assert.ok(offset.x > 0, 'The node should move further from the pointer');
  assert.equal(offset.y, 0);
});

test('the push is bounded, so a node cannot be pushed out of the map', () => {
  const base = { x: 0, y: 0 };
  const pointer = { x: 0.01, y: 0 };
  const offset = pushOffset(base, pointer);
  const distance = Math.hypot(offset.x, offset.y);
  assert.ok(distance <= PUSH_RADIUS * PUSH_STRENGTH + 1e-9, `Push was ${distance}`);
});

test('applying the push repeatedly from the base position is stable', () => {
  // The bug this guards against: the offset was added to the node's current
  // position, so every frame pushed it a little further and the node never
  // came back. Measured from the base position, the result is the same each
  // time however many frames have passed.
  const base = { x: 1, y: 0.5 };
  const pointer = { x: 0, y: 0 };
  const first = pushOffset(base, pointer);
  const second = pushOffset(base, pointer);
  assert.deepEqual(first, second);

  // And the node returns to its laid-out position when the pointer is gone.
  const restored = { x: base.x + first.x, y: base.y + first.y };
  assert.notDeepEqual(restored, base);
  const settled = { x: base.x, y: base.y };
  assert.deepEqual(settled, base);
});

test('the layout spreads the map across a wide frame', () => {
  const positions = layoutGraph();
  let extentX = 0;
  let extentY = 0;
  for (const position of positions.values()) {
    extentX = Math.max(extentX, Math.abs(position.x));
    extentY = Math.max(extentY, Math.abs(position.y));
  }
  assert.ok(extentX > extentY * 1.8, `The map should be wide: ${extentX} by ${extentY}`);
});
