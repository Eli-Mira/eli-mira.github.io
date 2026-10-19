import { useState } from 'react';
import { projects, getProject } from '../data/projects.js';
import ProjectDetail from './ProjectDetail.jsx';

// AlphaPOS is an external reference, not Eli's portfolio work.
const portfolioProjects = projects.filter(project => project.id !== 'alphapos');

export default function Projects() {
  const [selected, setSelected] = useState(portfolioProjects[0].id);

  function navigate(event, index) {
    const next = (index + 1) % portfolioProjects.length;
    const previous = (index + portfolioProjects.length - 1) % portfolioProjects.length;
    const targets = { ArrowDown: next, ArrowRight: next, ArrowUp: previous, ArrowLeft: previous, Home: 0, End: portfolioProjects.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const id = portfolioProjects[targets[event.key]].id;
    setSelected(id);
    document.getElementById(`project-tab-${id}`).focus();
  }

  return <section className="content projects-section" id="projects" aria-labelledby="projects-title" data-reveal>
    <header className="section-head">
      <p className="section-index"><b>01</b> Operations</p>
      <h2 id="projects-title">The work.</h2>
      <p>Real projects, read at source level. Each entry states its current state and what it does not claim.</p>
    </header>
    <div className="project-archive" data-reveal-item>
      <div className="project-tabs" role="tablist" aria-label="Choose a project" aria-orientation="vertical">
        {portfolioProjects.map((project, index) => <button key={project.id} id={`project-tab-${project.id}`} role="tab" type="button" aria-selected={selected === project.id} aria-controls="project-panel" tabIndex={selected === project.id ? 0 : -1} onClick={() => setSelected(project.id)} onKeyDown={event => navigate(event, index)}>
          <span>{project.name}<small>{project.kind}</small></span>
          <span className="project-state">{project.status}</span>
        </button>)}
      </div>
      <ProjectDetail project={getProject(selected)} />
    </div>
  </section>;
}
