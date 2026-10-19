/**
 * Verified project archive.
 *
 * Every field here is traceable to source that was read directly:
 * gesture_control/, dev-squad/, upgradeatlas/, EliLain-Intel-Public/, Game/.
 * Statuses stay literal. Nothing here claims a launch, a metric or a user.
 */
export const projects = [
  {
    id: 'gesture-control',
    name: 'Gesture Control',
    status: 'Release status in review',
    kind: 'Computer vision / desktop control',
    summary: 'A Windows desktop-control project that turns a camera feed into typed hand observations, gesture state and proposed actions.',
    problem: 'Desktop control usually means holding a mouse. The hard part is not the gesture, it is keeping every frame inspectable so an action can be traced back to what was actually seen.',
    stack: ['Python', 'MediaPipe Tasks', 'OpenCV contrib', 'NumPy', 'pywinauto', 'pycaw'],
    architecture: [
      'Camera capture thread',
      'HandLandmarker inference',
      'Immutable HandObservation contracts',
      'Gesture state machine',
      'Action proposals',
      'Windows desktop control',
    ],
    engineering: 'contracts.py models a frame as a frozen dataclass with landmark tuples, a bounding box and a handedness hint, and it states the rule that observations and action proposals are never OS commands. The engine, the display overlay and the acceptance harness are separate modules, and the dependency file is pinned to the environment that actually runs it.',
    challenges: [
      'Keeping inference, gesture state and desktop actions in separate modules so the action layer can be reasoned about without a camera.',
      'Pinning mediapipe and opencv-contrib to the installed environment instead of open ranges, because MediaPipe pulls its own transitive dependencies.',
    ],
    boundary: 'This does not claim a released version, a stable gesture vocabulary or fresh camera benchmarks. Screenshots, demo recordings and repository access need owner approval.',
    evidence: 'Read: gesture_control/contracts.py, engine.py, display.py, requirements-gesture.txt.',
  },
  {
    id: 'devsquad',
    name: 'DevSquad',
    status: 'Working pipeline, reviewers awaiting real model calls',
    kind: 'Multi-agent code review',
    summary: 'A standalone review pipeline that fans a codebase out to four specialist reviewers, then aggregates and finalises one report.',
    problem: 'A single pass over a diff misses architecture problems and misses the obvious security bug. Splitting the review by concern and merging the results keeps each reviewer narrow.',
    stack: ['Python', 'asyncio', 'dataclasses', 'CLI'],
    architecture: [
      'Scan target files',
      'Fan out to architecture, quality, security and design reviewers',
      'Aggregate findings',
      'Finalise report',
    ],
    engineering: 'The pipeline is a LangGraph-shaped state machine over a typed SquadState. Findings carry file, line, risk tier, category, description, a suggested fix and a confidence value, with a four-level risk enum. The CLI takes a target path, a focus area and a dry-run flag, so a single reviewer can be exercised without running the whole graph.',
    challenges: [
      'Keeping the reviewer contract stable so a reviewer can be swapped for a real model call without changing the graph.',
      'Making the report reproducible from state alone, so a run can be inspected after the fact.',
    ],
    boundary: 'The reviewer functions are currently placeholders, not live model calls, and the project is not published. No claim is made about the quality of its findings until the reviewers are real.',
    evidence: 'Read: dev-squad/src/dev_squad_pipeline.py, including the state, finding and risk-tier definitions.',
  },
  {
    id: 'upgradeatlas',
    name: 'UpgradeAtlas',
    status: 'In development',
    kind: 'College platform',
    summary: 'A college platform built as a monorepo: a React front end, a Laravel API and PostgreSQL, run together with Docker.',
    problem: 'The project started as a scaffold with documented stack decisions. The work now is turning those decisions into a working product without losing the data that is already there.',
    stack: ['React', 'JavaScript', 'Tailwind CSS', 'Laravel', 'PHP', 'PostgreSQL', 'Docker', 'Nginx'],
    architecture: [
      'apps/web: React + Vite + Tailwind',
      'services/api: Laravel API',
      'PostgreSQL 16 database',
      'infra: Docker Compose, PHP-FPM, Nginx',
    ],
    engineering: 'The repository records its decisions as ADRs instead of folklore: the stack choice, the monorepo layout, Docker for reproducible development, and a safe migration baseline that backs up with pg_dump before creating an empty baseline migration. Migrations are reversible by design, which is what makes a shared schema safe to change.',
    challenges: [
      'Making schema changes safe for a team, which is why the migration baseline is backed up and verified before it runs.',
      'Keeping the front end and the API in one repository without coupling their build pipelines.',
    ],
    boundary: 'Still in development. No finished product, deployment, user count or business result is implied, and the documented scaffold is not a working feature set.',
    evidence: 'Read: upgradeatlas/README.md, docs/DECISIONS.md, apps/web and services/api layout, infra/docker-compose.yml.',
  },
  {
    id: 'elilain-intel',
    name: 'EliLain Intel',
    status: 'Public source release, currently being updated',
    kind: 'AI and tool intelligence',
    summary: 'A public AI and tool intelligence dashboard that collects developer news, scores and deduplicates it, and publishes a report on its own schedule.',
    problem: 'Developer tooling moves fast enough that a weekly digest is more useful than a feed. The pipeline has to be unattended, and the publishing step has to be opt-in.',
    stack: ['Python', 'APScheduler', 'httpx', 'SQLite', 'GitHub Actions', 'Cloudflare Pages'],
    architecture: [
      'Fetch from GitHub releases, Reddit, Hacker News, arXiv and tech news',
      'Score and rank by category priority',
      'Optional summarisation',
      'Deduplicate',
      'Generate the HTML report',
      'Optional publish, then notify',
    ],
    engineering: 'The code is split into a reusable tracker core, a source-intelligence package and a news-tracker package. The dependency lock is fully pinned to the environment that ran the passing test suite, and the public daily producer needs no provider database and no inference key. Publishing is deliberately hard to trigger: a nonempty report gate, a preflight check, an explicit production URL, and a byte-exact read-back of the deployed report before any notification is sent.',
    challenges: [
      'Making the public release safe by default, so an empty report is a failed gate rather than a quiet lower threshold.',
      'Separating the local run from the publish run, so the scheduled job can never publish on its own.',
    ],
    boundary: 'Publishing stays opt-in and the live deployment is not claimed here. No private provider configuration, stored state or credential is included, and the repository licence covers source only, not third-party artwork.',
    evidence: 'Read: EliLain-Intel-Public/README.md, docs/public-publishing.md, src/tracker-core, src/intel_sources, src/news_tracker, requirements-lock.txt.',
    links: [
      { label: 'Public repository', href: 'https://github.com/Eli-Mira/EliLain-Intel-Public' },
    ],
  },
  {
    id: 'arcane-swipe',
    name: 'Arcane Swipe',
    status: 'Local prototype with a headless benchmark',
    kind: 'Gesture game / pygame',
    summary: 'A gesture spell duel: swipes cast, the cursor is the wand, and the whole loop is benchmarked without a display.',
    problem: 'Real-time input handling is the part of a game that is hardest to profile, because a window, a camera and a GPU all add noise to the numbers.',
    stack: ['Python', 'pygame-ce', 'NumPy', 'OpenCV', 'MediaPipe'],
    architecture: [
      'Camera capture and gesture detection',
      'Public gesture engine API',
      'Swipe and cursor read',
      'Spell casting and duel loop',
      'Headless frame-time benchmark',
    ],
    engineering: 'The game only consumes the gesture engine through its public API, so the input seam can be faked. bench.py then runs the real update and draw code against the SDL dummy video driver with a deterministic sweeping cursor, which gives a worst-case frame-time reading that a GPU-composited window would otherwise obscure.',
    challenges: [
      'Separating the detection seam from the game so the loop can be measured without a camera.',
      'Making the benchmark deterministic so a regression is visible rather than noise.',
    ],
    boundary: 'A local prototype. Benchmark numbers are relative and were taken on development hardware, and no release or distribution is claimed.',
    evidence: 'Read: Game/game.py, Game/gesture_engine.py, Game/bench.py, Game/requirements.txt.',
  },
  {
    id: 'alphapos',
    name: 'AlphaPOS',
    status: 'Identity to confirm',
    kind: 'Requested entry, case study pending',
    summary: 'A requested portfolio entry whose intended codebase still has to be confirmed before anything about it can be written.',
    problem: 'The name is known; the source behind it is not.',
    stack: [],
    architecture: [],
    engineering: 'AlphaPOS has not been identified with Hearth POS or with any other point-of-sale project. Nothing about it is asserted here.',
    challenges: [],
    boundary: 'No technology, authorship, completion or usage claim is made until the correct codebase is confirmed.',
    evidence: 'Name supplied by the owner; codebase identity unresolved.',
  },
];

export function getProject(id) {
  return projects.find(project => project.id === id) ?? null;
}
