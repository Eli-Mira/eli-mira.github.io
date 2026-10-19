/**
 * Shared motion state.
 *
 * React owns the truth; the imperative layers (GSAP, the WebGL scene) read
 * it from this store, so a pause never depends on a React re-render landing
 * before the next animation frame.
 */

const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

const state = {
  // Seeded from the media query so the first animation frame is already
  // correct, before React has had a chance to run an effect.
  reduced: media ? media.matches : false,
  paused: media ? media.matches : false,
};

const listeners = new Set();

export function setMotionState(next) {
  let changed = false;
  for (const [key, value] of Object.entries(next)) {
    if (state[key] !== value) {
      state[key] = value;
      changed = true;
    }
  }
  if (changed) listeners.forEach(listener => listener({ ...state }));
}

export function getMotionState() {
  return { ...state };
}

export function subscribeMotionState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
