import { useEffect, useState, useSyncExternalStore } from 'react';
import { setMotionState } from '../../motion/motionState.js';

const query = '(prefers-reduced-motion: reduce)';

function subscribe(listener) {
  const media = window.matchMedia(query);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

function snapshot() { return window.matchMedia(query).matches; }

export default function useMotionSettings() {
  const reduced = useSyncExternalStore(subscribe, snapshot, () => true);
  const [userPaused, setUserPaused] = useState(false);
  const paused = reduced || userPaused;

  // The imperative layers (GSAP, WebGL) read the state from a store so a
  // pause never has to wait for a React re-render to reach the next frame.
  useEffect(() => {
    setMotionState({ reduced, paused });
  }, [reduced, paused]);

  return { reduced, paused, toggle: () => setUserPaused(value => !value) };
}
