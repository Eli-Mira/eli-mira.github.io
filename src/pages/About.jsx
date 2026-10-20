import { origin } from '../data/origin.js';

export default function About() {
  return <section className="content origin" id="origin" aria-labelledby="origin-title" data-reveal data-reveal-style="wipe">
    <div data-reveal-item>
      <p className="section-index"><b>04</b> Origin</p>
      <h2 id="origin-title">Eli, behind the work.</h2>
      <p className="origin-role">{origin.role}</p>
      <div className="origin-story">
        {origin.story.map(paragraph => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
      </div>
    </div>
    <div data-reveal-item>
      <p className="detail-label">What keeps coming up</p>
      <ul className="focus-list">
        {origin.focus.map(item => <li key={item.title}><b>{item.title}</b><span>{item.detail}</span></li>)}
      </ul>
    </div>
  </section>;
}
