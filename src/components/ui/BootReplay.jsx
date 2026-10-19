import { useEffect, useRef } from 'react';

export default function BootReplay() {
  const dialog = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  function replay() {
    clearTimeout(timer.current);
    dialog.current.showModal();
    timer.current = setTimeout(() => dialog.current?.close(), 2100);
  }
  return <><button className="boot-replay" type="button" onClick={replay}>Replay title sequence</button><dialog ref={dialog} className="boot-overlay" aria-labelledby="boot-title" onClose={() => clearTimeout(timer.current)}><p className="boot-label">Visual replay / no services connecting</p><h2 id="boot-title">REDLINE<br /><span>// OVERDRIVE</span></h2><div className="boot-track" aria-hidden="true"><span /></div><button type="button" className="action secondary" autoFocus onClick={() => dialog.current.close()}>Skip sequence</button></dialog></>;
}
