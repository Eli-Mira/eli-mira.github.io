import { useEffect, useRef, useState } from 'react';
import { handleAnchorClick } from '../../motion/scrollTo.js';
import useActiveSection from '../../motion/useActiveSection.js';
import { sectionByTarget } from '../../data/sections.js';

const links = [
  ['Projects', '#projects'],
  ['AI Lab', '#neural-lab'],
  ['Skills', '#system-profile'],
  ['About', '#origin'],
  ['Contact', '#transmission'],
];

export default function Navigation({ paused, reduced, onMotionToggle }) {
  const [open, setOpen] = useState(false);
  const section = useActiveSection();
  const menu = useRef(null);
  const readout = sectionByTarget.get(section) ?? sectionByTarget.get('initialize');

  useEffect(() => {
    if (!open) return undefined;
    function escape(event) {
      if (event.key === 'Escape') { setOpen(false); menu.current.focus(); }
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);

  return <header className="site-header">
    <a className="wordmark" href="#initialize" onClick={handleAnchorClick} aria-label="Redline Overdrive home">REDLINE<span><i>//</i> OVERDRIVE</span></a>
    <div className="header-progress" aria-hidden="true"><span data-progress-fill /></div>
    <nav id="main-navigation" className={`navigation${open ? ' is-open' : ''}`} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={event => { setOpen(false); handleAnchorClick(event); }} aria-current={section === href.slice(1) ? 'true' : undefined}>{label}</a>)}
    </nav>
    <div className="header-controls">
      <p className="hud-readout" aria-live="off"><b>{readout.number}</b><i>/</i>{readout.label}</p>
      <button className="motion-toggle" type="button" disabled={reduced} aria-pressed={paused} onClick={onMotionToggle}>
        {reduced ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion'}
      </button>
      <button ref={menu} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(value => !value)}>{open ? 'Close' : 'Menu'}</button>
    </div>
  </header>;
}
