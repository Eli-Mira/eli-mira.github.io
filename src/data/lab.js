/**
 * Neural Lab content.
 *
 * Everything here is traceable to a public README or to source that was read
 * directly. The local-model inventory stays unpublished (see models.js), so
 * this section describes the pipeline and its sources instead of listing
 * hardware that was never approved for publication.
 */
export const intelSources = [
  { id: 'github', label: 'GitHub releases', detail: 'Release feeds for tracked repositories.' },
  { id: 'reddit', label: 'Reddit', detail: 'RSS feeds from selected subreddits.' },
  { id: 'hn', label: 'Hacker News', detail: 'Front-page and new-item pulls.' },
  { id: 'arxiv', label: 'arXiv', detail: 'New submissions in the tracked categories.' },
  { id: 'news', label: 'Tech news', detail: 'Publication feeds and their updates.' },
];

export const intelPipeline = [
  { stage: 'Fetch', detail: 'Adapters pull from each source into a local store.' },
  { stage: 'Score', detail: 'Category priority and selection cutoff rank the items.' },
  { stage: 'Summarize', detail: 'Optional summarisation. Off unless explicitly enabled.' },
  { stage: 'Deduplicate', detail: 'Near-duplicate items collapse before publishing.' },
  { stage: 'Report', detail: 'A single HTML report is generated from the run.' },
  { stage: 'Publish', detail: 'Opt-in only, and the deployed report is read back byte for byte.' },
];

export const labPrinciples = [
  {
    title: 'A scheduled job never publishes by itself.',
    detail: 'Scanning, publishing and notifying are separate phases. Each needs its own opt-in flag, and the scheduled entry is not the publishing entry.',
  },
  {
    title: 'An empty report is a failed gate.',
    detail: 'The release gate rejects an empty daily output instead of quietly lowering the selection cutoff to make something appear.',
  },
  {
    title: 'The deployed artefact is verified, not assumed.',
    detail: 'After a deployment the report is fetched again and compared byte for byte before any notification is sent.',
  },
  {
    title: 'The local model collection stays private.',
    detail: 'No provider configuration, inference key, saved quota data or private state is published with the source.',
  },
];

export const labNote = 'This section describes a public, sanitized source release. It is not a live deployment, and no dashboard is connected here.';
