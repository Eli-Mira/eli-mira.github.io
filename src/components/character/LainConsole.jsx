import { useState } from 'react';
import { lainStates } from '../../data/lainStates.js';

export default function LainConsole() {
  const [state, setState] = useState('idle');
  const current = lainStates[state];
  return <div className="lain-console">
    <div className="console-head"><span>LAIN / original ASCII entity</span><span>Scripted preview</span></div>
    <pre className="ascii" data-state={state} aria-hidden="true">{current.art}</pre>
    <div className="state-controls" role="group" aria-label="Lain display state">{Object.entries(lainStates).map(([id, item]) => <button type="button" key={id} aria-pressed={state === id} onClick={() => setState(id)}>{item.label}</button>)}</div>
    <p className="lain-message" role="status" aria-live="polite" aria-atomic="true"><strong>{current.label}.</strong> {current.message}</p>
  </div>;
}
