import { useEffect, useRef, useState } from 'react';
import { handleAnchorClick } from '../../motion/scrollTo.js';
import useActiveSection from '../../motion/useActiveSection.js';

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
      <p className="hud-readout" aria-live="off"><b>{sectionLabel(section).number}</b><i>/</i>{sectionLabel(section).name}</p>
      <button className="motion-toggle" type="button" disabled={reduced} aria-pressed={paused} onClick={onMotionToggle}>
        {reduced ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion'}
      </button>
      <button ref={menu} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(value => !value)}>{open ? 'Close' : 'Menu'}</button>
    </div>
  </header>;
}

const SECTION_LABELS = {
  initialize: { number: '00', name: 'INITIALIZE' },
  projects: { number: '01', name: 'OPERATIONS' },
  'neural-lab': { number: '02', name: 'NEURAL LAB' },
  'system-profile': { number: '03', name: 'SYSTEM PROFILE' },
  origin: { number: '04', name: 'ORIGIN' },
  transmission: { number: '05', name: 'TRANSMISSION' },
};

function sectionLabel(id) {
  return SECTION_LABELS[id] ?? SECTION_LABELS.initialize;
}
