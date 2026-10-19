/**
 * REDLINE // OVERDRIVE motion system.
 *
 * Loaded on demand so the first paint never waits for the motion runtime.
 * It owns four things:
 *   1. Lenis smooth scrolling, driven by the GSAP ticker.
 *   2. The hero title sequence.
 *   3. Scroll-triggered section reveals and the reading progress bar.
 *   4. Section tracking for the header readout and the destination strip.
 *
 * Reduced motion gets none of it: the document stays static and fully
 * readable, and every hidden element is released back to its normal state.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { registerScrollController } from './scrollTo.js';
import { getMotionState } from './motionState.js';
import { releasePending } from './pending.js';
import { sectionTargets } from '../data/sections.js';

gsap.registerPlugin(ScrollTrigger);

/** The state a revealed element ends in. */
const SHOWN = { opacity: 1, y: 0, x: 0, clipPath: 'none' };

/**
 * Each section is given its own entrance rather than one repeated move: a
 * rise for prose, a slide for rails and lists, and a wipe for the headings.
 */
const REVEAL_STYLES = {
  rise: { from: { opacity: 0, y: 26 }, duration: 0.8, ease: 'power3.out' },
  slide: { from: { opacity: 0, x: -22 }, duration: 0.75, ease: 'power3.out' },
  wipe: { from: { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, duration: 0.9, ease: 'power4.out' },
};

const show = targets => gsap.set(targets, SHOWN);

function releaseHiddenContent() {
  // Anything the runtime was going to animate must be visible again if the
  // runtime goes away, whether it stopped or never started.
  releasePending();
  gsap.set('[data-hero-line], [data-reveal-item], .section-head h2', { clearProps: 'all' });
}

export function startMotion({ reduced = false } = {}) {
  if (reduced) {
    document.documentElement.dataset.motion = 'reduced';
    releaseHiddenContent();
    return { setPaused() {}, refresh() {}, destroy() {} };
  }

  document.documentElement.dataset.motion = 'running';

  const lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    syncTouch: false,
    anchors: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Reveal targets that have not fired yet. Pausing finishes them rather than
  // freezing them, so a section can never be left stranded at zero opacity.
  const pending = new Set();

  /**
   * Hides the targets and shows them again when the trigger comes into view.
   *
   * A paused runtime shows them straight away rather than waiting for the
   * scroll, so pausing never leaves anything invisible.
   */
  const revealOnScroll = (trigger, targets, style, start) => {
    gsap.set(targets, style.from);
    pending.add(targets);
    ScrollTrigger.create({
      trigger,
      start,
      once: true,
      onEnter: () => {
        pending.delete(targets);
        if (getMotionState().paused) {
          show(targets);
          return;
        }
        gsap.to(targets, { ...SHOWN, duration: style.duration, ease: style.ease, stagger: 0.06 });
      },
    });
  };

  const context = gsap.context(() => {
    // Hero title sequence
    const heroLines = gsap.utils.toArray('[data-hero-line]');
    if (heroLines.length) {
      const sequence = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from(heroLines, {
          autoAlpha: 0,
          y: 28,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.9,
          stagger: 0.09,
        });
      // Every optional target is checked, so a missing element never
      // produces a GSAP warning in the console.
      const optional = [
        ['[data-hero-meta]', { autoAlpha: 0, y: 8, duration: 0.35 }, 0],
        ['[data-hero-intro]', { autoAlpha: 0, y: 14, duration: 0.55 }, 0.22],
        ['[data-hero-action]', { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.07 }, 0.1],
        ['[data-hero-badge]', { autoAlpha: 0, y: 12, duration: 0.45 }, 0.12],
      ];
      for (const [selector, vars, position] of optional) {
        const targets = gsap.utils.toArray(selector);
        if (targets.length) sequence.from(targets, vars, `<${position}`);
      }
    }

    // Section reveals
    // Opacity is used rather than visibility, so content that is still below
    // the fold stays reachable by keyboard and assistive technology.
    gsap.utils.toArray('[data-reveal]').forEach((section) => {
      const items = section.querySelectorAll('[data-reveal-item]');
      const targets = items.length ? items : [section];
      const style = REVEAL_STYLES[section.dataset.revealStyle] ?? REVEAL_STYLES.rise;
      revealOnScroll(section, targets, style, 'top 85%');
    });

    // Reading progress
    gsap.utils.toArray('[data-progress-fill]').forEach((bar) => {
      gsap.fromTo(bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.2 },
        });
    });

    // Section tracking
    const setSection = (id) => {
      document.documentElement.dataset.section = id;
      window.dispatchEvent(new CustomEvent('redline:section', { detail: id }));
    };
    sectionTargets.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      ScrollTrigger.create({
        trigger: element,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => { if (self.isActive) setSection(id); },
      });
    });
    setSection(sectionTargets[0]);

    // Hero depth: the poster drifts slower than the copy
    gsap.to('[data-hero-art]', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '#initialize', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    gsap.to('[data-hero-copy]', {
      yPercent: -6,
      ease: 'none',
      scrollTrigger: { trigger: '#initialize', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });

    // The headline leaves the frame at a different rate from the copy, which
    // gives the hero a sense of depth as the page moves under it.
    gsap.to('[data-hero-line]', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '#initialize', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });

    // Section headings settle as their section arrives
    const headingStyle = { from: { opacity: 0, y: 18 }, duration: 0.7, ease: 'power3.out' };
    gsap.utils.toArray('.section-head h2').forEach((heading) => {
      revealOnScroll(heading, [heading], headingStyle, 'top 88%');
    });
  });

  registerScrollController({
    scrollTo: (target) => lenis.scrollTo(target, { offset: -76, duration: 1.1 }),
  });

  // The runtime is live and now owns the hidden state through inline styles.
  releasePending();

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh);
  document.fonts?.ready.then(refresh);

  return {
    refresh,
    setPaused(paused) {
      // Ambient motion stops. Scroll-linked entrances are allowed to finish so
      // that pausing never strands content at zero opacity.
      gsap.globalTimeline.timeScale(paused ? 0.001 : 1);
      if (paused) pending.forEach(show);
    },
    destroy() {
      window.removeEventListener('load', refresh);
      context.revert();
      releaseHiddenContent();
      registerScrollController(null);
      lenis.destroy();
    },
  };
}
