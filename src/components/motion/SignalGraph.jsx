import { useEffect, useRef, useState } from 'react';
import { graph, groupLabels, nodeById } from '../../data/graph.js';
import { getMotionState, subscribeMotionState } from '../../motion/motionState.js';

/**
 * The signal graph.
 *
 * A real 3D node map of how the work connects: projects, the tools they
 * are built with, and the concepts they exercise. It is an enhancement over
 * the poster, so it loads on demand and never blocks the page.
 *
 * The map is decorative. The same relationships are listed as text below it,
 * so the content is never only available inside a canvas.
 */
export default function SignalGraph() {
  const canvasRef = useRef(null);
  const [active, setActive] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let activeEffect = true;
    let field = null;

    import('../../motion/signalGraph.js')
      .then(({ createSignalGraph }) => {
        if (!activeEffect) return;
        field = createSignalGraph(canvas, {
          motion: { get: getMotionState },
          onHover: (id) => setActive(id),
        });
        if (!field) setFailed(true);
      })
      .catch(() => setFailed(true));

    const unsubscribe = subscribeMotionState(() => {
      const { reduced, paused } = getMotionState();
      canvas.dataset.render = paused || reduced ? 'held' : 'live';
      field?.syncLoop();
    });

    return () => {
      activeEffect = false;
      unsubscribe();
      field?.destroy();
    };
  }, []);

  const activeNode = active ? nodeById.get(active) : null;
  const activeLinks = active ? graph.links.filter(([from, to]) => from === active || to === active) : [];

  return <figure className="signal-graph">
    <div className="signal-graph-canvas">
      <canvas ref={canvasRef} aria-hidden="true" />
      {failed ? <p className="signal-graph-fallback">The interactive map could not start on this device. The relationships are listed below.</p> : null}
    </div>
    <figcaption>
      <span className="signal-legend">
        {Object.keys(groupLabels).map(key => <span key={key} className={`legend-dot legend-${key}`} aria-hidden="true" />)}
        {Object.values(groupLabels).join(' · ')}
      </span>
      {activeNode
        ? <p className="signal-active" role="status">{activeNode.label} — {activeLinks.length} connected {activeLinks.length === 1 ? 'node' : 'nodes'}.</p>
        : <p className="signal-active">Hover or focus a node to see what it connects to.</p>}
    </figcaption>
    <ul className="signal-list">
      {graph.projects.map(project => <li key={project.id}>
        <b>{project.label}</b>
        <span>{graph.links
          .filter(([from]) => from === project.id)
          .map(([, to]) => nodeById.get(to)?.label)
          .join(' · ')}</span>
      </li>)}
    </ul>
  </figure>;
}
