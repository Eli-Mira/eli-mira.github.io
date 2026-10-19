import { useEffect, useRef } from 'react';
import { getMotionState, subscribeMotionState } from '../../motion/motionState.js';

/**
 * Impact frame depth field.
 *
 * The sky in CSS is the instant poster. This canvas adds the 3D
 * depth on top of it, and it is loaded on demand so the 3D engine never
 * blocks the first paint.
 *
 * Contract with the surrounding page:
 *   - the visible canvas is the renderer's own target, never a hidden one;
 *   - reduced motion renders one static frame and never starts a loop;
 *   - the pointer also drives the CSS parallax on the figure and the slash.
 */
export default function ImpactScene() {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let active = true;
    let field = null;

    import('../../motion/depthField.js')
      .then(({ createDepthField }) => {
        if (!active) return;
        field = createDepthField(canvas, { motion: { get: getMotionState } });
        if (!field) {
          canvas.dataset.render = 'unavailable';
          return;
        }
        fieldRef.current = field;
        canvas.dataset.render = 'live';
      })
      .catch(() => {
        // The CSS poster carries the hero on its own.
        canvas.dataset.render = 'unavailable';
      });

    // The figure and the slash shift with the pointer, so the whole poster
    // reads as one object rather than a flat collage.
    const hero = canvas.closest('.hero');
    function move(event) {
      const { reduced, paused } = getMotionState();
      if (event.pointerType !== 'mouse' || paused || reduced) return;
      const rect = hero.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.42) / 0.3));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) / 0.32));
      hero.style.setProperty('--dx', x.toFixed(3));
      hero.style.setProperty('--dy', y.toFixed(3));
    }
    function leave() {
      hero.style.setProperty('--dx', '0');
      hero.style.setProperty('--dy', '0');
    }
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);

    const unsubscribe = subscribeMotionState(() => {
      const { reduced, paused } = getMotionState();
      // The loop stops on its own, so the label is updated here rather than
      // waiting for a frame that will never be drawn.
      canvas.dataset.render = paused || reduced ? 'held' : 'live';
      field?.syncLoop();
    });

    return () => {
      active = false;
      unsubscribe();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      field?.destroy();
      fieldRef.current = null;
    };
  }, []);

  return <canvas className="impact-scene" ref={canvasRef} aria-hidden="true" />;
}
