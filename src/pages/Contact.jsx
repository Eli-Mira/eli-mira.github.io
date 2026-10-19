import { contact, contactNote } from '../data/origin.js';

export default function Contact() {
  return <footer className="footer" id="transmission" aria-labelledby="transmission-title" data-reveal>
    <div className="footer-inner">
      <div data-reveal-item>
        <p className="section-index"><b>05</b> Transmission</p>
        <h2 id="transmission-title">Open a channel.</h2>
        <p>Code, review requests and collaboration all start the same way. The public repositories are the fastest way to judge the work before writing anything.</p>
        <p className="footer-note">{contactNote}</p>
      </div>
      <div data-reveal-item>
        <ul className="contact-list">
          {contact.map(channel => <li key={channel.id}>
            <b>{channel.label}</b>
            <span>
              <a href={channel.href} {...(channel.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>{channel.value} ↗</a>
              <br />{channel.detail}
            </span>
          </li>)}
        </ul>
      </div>
    </div>
    <div className="footer-base">
      <span>REDLINE // OVERDRIVE</span>
      <span>Built by Eli · local fonts · no tracking · no live model</span>
    </div>
  </footer>;
}
