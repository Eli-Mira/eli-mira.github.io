import { useState } from 'react';

export default function LainBadge() {
  const [expanded, setExpanded] = useState(false);
  return <div className="lain-badge" data-hero-badge>
    <div>LAIN / ASCII intelligence<span>Scripted guide. No live model.</span></div>
    <pre id="hero-lain-ascii" hidden={!expanded} aria-hidden="true">{' /[::]\\\n< L/A >\n \\[::]/'}</pre>
    <button type="button" className="ascii-toggle" aria-expanded={expanded} aria-controls="hero-lain-ascii" onClick={() => setExpanded(value => !value)}>{expanded ? 'Hide ASCII' : 'Show ASCII'}</button>
  </div>;
}
