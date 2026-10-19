/**
 * In-page anchor scrolling.
 *
 * The motion system registers a controller once Lenis/GSAP are live. Until then
 * (reduced motion, slow chunk load, or no JavaScript) navigation falls back to
 * native behaviour so no link ever breaks.
 */

let controller = null;

export function registerScrollController(next) {
  controller = next;
}

export function scrollToHash(hash, { focus = true } = {}) {
  const id = hash.replace('#', '');
  const target = document.getElementById(id);
  if (!target) return false;

  if (controller) controller.scrollTo(target);
  else target.scrollIntoView({ block: 'start' });

  if (focus) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  if (window.history?.pushState) window.history.pushState(null, '', `#${id}`);
  return true;
}

/** Click handler for in-page links. The real href stays for crawlers and no-JS. */
export function handleAnchorClick(event) {
  const href = event.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#') || href === '#') return;
  if (!scrollToHash(href)) return;
  event.preventDefault();
}
