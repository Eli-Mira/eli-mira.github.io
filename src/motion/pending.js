/**
 * Pending-state handoff.
 *
 * The inline script in index.html hides the entrance targets before first
 * paint, so the title sequence never flashes its final state. This module is
 * the single place that releases them, and it is called from every exit
 * path: successful start, failed load, reduced motion and teardown.
 */

const HERO_PENDING = 'hero-pending';
const REVEAL_PENDING = 'reveal-pending';

export function releasePending() {
  const root = document.documentElement;
  root.classList.remove(HERO_PENDING);
  root.classList.remove(REVEAL_PENDING);
  if (window.__motionFailsafe) {
    clearTimeout(window.__motionFailsafe);
    window.__motionFailsafe = null;
  }
}

/**
 * The runtime is live and now owns the hidden state through inline styles,
 * so the pre-paint classes can come off.
 */
export function handoverPending() {
  releasePending();
}
