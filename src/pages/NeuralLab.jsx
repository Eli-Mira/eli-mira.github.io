import { lazy, Suspense, useState } from 'react';
import { models, modelInventoryNote } from '../data/models.js';
import { intelSources, intelPipeline, labPrinciples, labNote } from '../data/lab.js';
import { stack } from '../data/stack.js';
import LabErrorBoundary from '../components/ui/LabErrorBoundary.jsx';

const LainConsole = lazy(() => import('../components/character/LainConsole.jsx'));
const SignalGraph = lazy(() => import('../components/motion/SignalGraph.jsx'));

export default function NeuralLab() {
  const [loaded, setLoaded] = useState(false);

  return <section className="lab" id="neural-lab" aria-labelledby="lab-title" data-reveal data-reveal-style="slide">
    <div className="content lab-layout">
      <div data-reveal-item>
        <p className="section-index"><b>02</b> Neural Lab</p>
        <h2 id="lab-title">The human leads.<br />Lain assists.</h2>
        <p>Lain is an original ASCII guide, not a portrait and not an autonomous operator. This interface demonstrates five visual states without connecting to an AI service.</p>
        <p className="lab-note">{labNote}</p>

        <p className="detail-label">Signal chain</p>
        <ol className="chain">
          {intelPipeline.map(step => <li key={step.stage}><b>{step.stage}</b><span>{step.detail}</span></li>)}
        </ol>

        <p className="detail-label">Sources</p>
        <ul className="source-list">
          {intelSources.map(source => <li key={source.id}><b>{source.label}</b><span>{source.detail}</span></li>)}
        </ul>

        <p className="detail-label">Rules the pipeline follows</p>
        <ul className="principles">
          {labPrinciples.map(principle => <li key={principle.title}><b>{principle.title}</b><span>{principle.detail}</span></li>)}
        </ul>
      </div>

      <div data-reveal-item>
        <LabErrorBoundary>
          {loaded
            ? <Suspense fallback={<p className="lab-loading" role="status">Loading the local ASCII interface...</p>}><LainConsole /></Suspense>
            : <div className="lab-standby">
              <pre aria-hidden="true">{' /[::]\\\n< L/A >\n \\[::]/'}</pre>
              <p>No model connection required.</p>
              <button type="button" className="action secondary" onClick={() => setLoaded(true)}>Open Lain interface</button>
            </div>}
        </LabErrorBoundary>

        <p className="detail-label">Signal graph</p>
        <Suspense fallback={<p className="lab-loading" role="status">Loading the signal graph...</p>}>
          <SignalGraph />
        </Suspense>

        <p className="detail-label">This page's own stack</p>
        <ul className="source-list">
          {stack.map(item => <li key={item.name}><b>{item.name} {item.version}</b><span>{item.role}</span></li>)}
        </ul>

        <p className="detail-label">Local model collection</p>
        <p className="lab-note">{modelInventoryNote}{models.length ? ` ${models.map(model => model.name).join(', ')}` : ''}</p>
      </div>
    </div>
  </section>;
}
