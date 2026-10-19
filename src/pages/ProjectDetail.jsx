export default function ProjectDetail({ project }) {
  if (!project) return null;
  return <article className="project-detail" role="tabpanel" id="project-panel" aria-labelledby={`project-tab-${project.id}`} tabIndex={0}>
    <p className="status">{project.status}</p>
    <h3>{project.name}</h3>
    <p className="project-summary">{project.summary}</p>

    {project.problem ? <>
      <p className="detail-label">Problem</p>
      <p>{project.problem}</p>
    </> : null}

    {project.stack.length ? <>
      <p className="detail-label">Stack</p>
      <ul className="stack-list" aria-label="Project technologies">{project.stack.map(tool => <li key={tool}>{tool}</li>)}</ul>
    </> : null}

    {project.architecture.length ? <>
      <p className="detail-label">Architecture</p>
      <ol className="architecture" aria-label="High-level architecture">{project.architecture.map(step => <li key={step}>{step}</li>)}</ol>
    </> : null}

    <p className="detail-label">Engineering</p>
    <p>{project.engineering}</p>

    {project.challenges.length ? <>
      <p className="detail-label">What it took</p>
      <ul className="challenge-list">{project.challenges.map(challenge => <li key={challenge}>{challenge}</li>)}</ul>
    </> : null}

    {project.links?.length ? <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div> : null}

    <p className="disclosure">{project.boundary}</p>
    <p className="evidence-line">{project.evidence}</p>
  </article>;
}
