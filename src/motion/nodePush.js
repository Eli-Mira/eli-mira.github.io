/**
 * The offset a node takes when the pointer comes near it.
 *
 * Kept separate from the scene so it can be reasoned about and tested on its
 * own. The offset is always measured from a node's laid-out position, never
 * from where it currently is, so a node cannot drift further with every
 * frame and end up permanently displaced.
 */

export const PUSH_RADIUS = 1.5;
export const PUSH_STRENGTH = 0.32;

/**
 * @param {{ x: number, y: number }} base where the node is laid out
 * @param {{ x: number, y: number }} pointer where the pointer is
 * @returns {{ x: number, y: number }} the offset to add to the base position
 */
export function pushOffset(base, pointer) {
  const dx = base.x - pointer.x;
  const dy = base.y - pointer.y;
  const distance = Math.hypot(dx, dy);
  const strength = Math.max(0, PUSH_RADIUS - distance) * PUSH_STRENGTH;
  // A node sitting exactly on the pointer has no direction to move in, so it
  // is pushed straight up rather than being left on top of the pointer.
  if (distance === 0) return { x: 0, y: strength };
  return { x: (dx / distance) * strength, y: (dy / distance) * strength };
}
