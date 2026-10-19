import { useEffect, useState } from 'react';

/**
 * Tracks which of the six destinations is on screen.
 *
 * The motion runtime publishes the section as it scrolls. When motion is off
 * or unavailable, this falls back to an IntersectionObserver so the header
 * readout and the destination strip stay truthful either way.
 */
const SECTION_IDS = ['initialize', 'projects', 'neural-lab', 'system-profile', 'origin', 'transmission'];

export default function useActiveSection() {
  const [section, setSection] = useState(SECTION_IDS[0]);

  useEffect(() => {
    function onSection(event) { setSection(event.detail); }
    window.addEventListener('redline:section', onSection);
    return () => window.removeEventListener('redline:section', onSection);
  }, []);

  useEffect(() => {
    const elements = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length) return undefined;

    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      }
      // The section covering the most of the viewport wins.
      let best = null;
      let bestRatio = 0;
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) { best = id; bestRatio = ratio; }
      }
      if (best) setSection(best);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return section;
}
