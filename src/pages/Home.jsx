import { useEffect, useState } from 'react';
import Navigation from '../components/navigation/Navigation.jsx';
import ImpactScene from '../components/motion/ImpactScene.jsx';
import useMotionSettings from '../components/motion/useMotionSettings.js';
import LainBadge from '../components/character/LainBadge.jsx';
import BootReplay from '../components/ui/BootReplay.jsx';
import Projects from './Projects.jsx';
import NeuralLab from './NeuralLab.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import { skills } from '../data/skills.js';
import { sections } from '../data/sections.js';
import { learningPath } from '../data/origin.js';
import { handleAnchorClick } from '../motion/scrollTo.js';
import { releasePending } from '../motion/pending.js';

export default function Home() {
  const motion = useMotionSettings();
  const [controller, setController] = useState(null);

  useEffect(() => {
    let active = true;
    let instance = null;
    if (motion.reduced) {
      releasePending();
      return undefined;
    }
    import('../motion/motion.js')
      .then(({ startMotion }) => {
        if (!active) return;
        instance = startMotion({ reduced: motion.reduced });
        setController(instance);
      })
      .catch(() => {
        // The page stays fully readable without the motion runtime.
        releasePending();
      });
    return () => {
      active = false;
      instance?.destroy();
    };
  }, [motion.reduced]);

  useEffect(() => {
    controller?.setPaused(motion.paused);
  }, [controller, motion.paused]);

  return <div className="site" data-motion={motion.paused ? 'paused' : 'running'}>
    <a className="skip" href="#main">Skip to content</a>
    <Navigation paused={motion.paused} reduced={motion.reduced} onMotionToggle={motion.toggle} />
    <main id="main">
      <section className="hero" id="initialize" aria-labelledby="hero-title">
        <div className="hero-art" data-hero-art>
          <div className="impact-field" />
          <ImpactScene />
          <div className="impact-cut" />
          <div className="impact-slash" />
          <img className="figure" src={`${import.meta.env.BASE_URL}artwork/eli-abstract.svg`} alt="" width="540" height="820" fetchPriority="high" />
          <div className="impact-name" aria-hidden="true">ELI</div>
          <span className="figure-label">Original abstract figure / not a portrait</span>
        </div>
        <div className="hero-copy" data-hero-copy>
          <p className="identity" data-hero-meta><b>Human direction.</b><span>AI assistance.</span></p>
          <h1 id="hero-title">
            <span data-hero-line>BUILT BY HUMAN.</span>
            <span data-hero-line>AMPLIFIED BY AI.</span>
          </h1>
          <p className="hero-intro" data-hero-intro>I'm Eli. I build software and explore what people and AI can create together.</p>
          <div className="actions">
            <a className="action primary" href="#projects" onClick={handleAnchorClick} data-hero-action>Projects</a>
            <a className="action secondary" href="#neural-lab" onClick={handleAnchorClick} data-hero-action>AI Lab</a>
          </div>
          <BootReplay />
        </div>
        <LainBadge />
      </section>

      <div className="brandline">
        <div className="brandline-inner">
          <strong>ELI BUILDS. LAIN EXECUTES. TOGETHER, THEY EVOLVE.</strong>
          <span>Human direction / machine assistance</span>
        </div>
        <ul className="destinations" aria-label="Site sections">
          {sections.map(section => <li key={section.id}><a href={`#${section.target}`} onClick={handleAnchorClick} data-destination={section.id}><b>{section.number}</b>{section.label}</a></li>)}
        </ul>
      </div>

      <Projects />

      <NeuralLab />

      <section className="content profile-strip" id="system-profile" aria-labelledby="profile-title" data-reveal>
        <header className="section-head">
          <p className="section-index"><b>03</b> System Profile</p>
          <h2 id="profile-title">Tools behind the work.</h2>
          <p>Project evidence, not proficiency scores. Every group points at the code that proves it.</p>
        </header>
        <ul className="skill-groups" data-reveal-item>
          {skills.map(group => <li key={group.name}>
            <h3>{group.name}</h3>
            <p>{group.tools.join(' / ')}</p>
            <small>{group.evidence}</small>
          </li>)}
        </ul>
        <div className="learning-path" data-reveal-item>
          <p className="detail-label">Current path</p>
          <ol className="path-steps">
            {learningPath.map(step => <li key={step.label}><b>{step.label}</b><span>{step.state}</span></li>)}
          </ol>
        </div>
      </section>

      <About />
    </main>
    <Contact />
  </div>;
}
