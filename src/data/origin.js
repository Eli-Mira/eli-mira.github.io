/**
 * Origin and contact.
 *
 * The biography is in the owner's own voice, and every fact in it comes from
 * the site this one replaced: the owner wrote it there and published it
 * there. Nothing here is invented, expanded or reinterpreted, and the two
 * claims the old page made that the source contradicts have been left out.
 *
 * Two of the old claims were not carried forward:
 *   - the old page listed a "Fruit Slicer" pygame game; the repository is a
 *     gesture spell duel, now called Arcane Swipe
 *   - the old page described DevSquad's four reviewers as running; the
 *     reviewers are placeholders awaiting real model calls
 */
export const origin = {
  role: 'CS student, AI/ML path. Building gesture control, agent pipelines and the tooling around them.',
  location: 'Egypt',
  story: [
    'I got into programming because I was translating English-Arabic legal documents on Khamsat to pay for a laptop, and I needed a faster way to rename files. My first script was twenty lines of Python and it worked the first time. I kept building after that.',
    'I am a computer science student at Culture & Science City, in 6th of October City, Egypt, and I split my time between coursework and projects that try to write themselves. I take Python and data engineering work on Mostaql when the server bills need covering, and the projects are how I learn: gesture control, agent pipelines, a tracker that keeps its own state legible, a game I built to understand game loops and real-time input. The machine is an ASUS TUF A16 I call Mira.',
    'I have been diagnosed with ADHD and depression, and I take medication for both. It means I work in intense bursts and then need to step away. The work comes out better for it, but the rhythm is uneven, and I have stopped pretending otherwise.',
    'I want to get to the point where my systems pay for themselves before I graduate. This site shows what is shipped, not what is planned.',
  ],
  focus: [
    {
      title: 'Computer vision that owns its inputs.',
      detail: 'Gesture Control treats a camera frame as a typed, inspectable observation instead of a stream of side effects.',
    },
    {
      title: 'Pipelines that can be checked.',
      detail: 'Both the code-review pipeline and the intel tracker keep their state explicit, so a run can be understood after the fact.',
    },
    {
      title: 'Interfaces that load fast and stay readable.',
      detail: 'This page is the same exercise: local fonts, no tracking, no live model, and a reduced-motion path that still shows everything.',
    },
  ],
};

/**
 * Contact channels.
 *
 * These are the channels the site being replaced already published, so
 * replacing it does not remove a route to Eli. Nothing here is new.
 */
export const contact = [
  { id: 'github', label: 'GitHub', value: 'Eli-Mira', href: 'https://github.com/Eli-Mira', detail: 'Three public repositories, including the sanitized intel tracker source.' },
  { id: 'linkedin', label: 'LinkedIn', value: 'eli-mira', href: 'https://linkedin.com/in/eli-mira', detail: 'Professional profile linked from the public GitHub profile.' },
  { id: 'email', label: 'Email', value: '3emad2lden@gmail.com', href: 'mailto:3emad2lden@gmail.com', detail: 'Direct route for collaboration and review requests.' },
];

export const contactNote = 'A résumé is not published yet. The public repositories are the fastest way to see the work itself.';

/**
 * The learning path, as the site being replaced published it. It is a
 * direction of study, not a list of completed certifications.
 */
export const learningPath = [
  { label: 'CS50 Python', state: 'Foundations' },
  { label: 'CS50 SQL', state: 'Foundations' },
  { label: 'Data engineering', state: 'In progress' },
  { label: 'AI / ML', state: 'Next' },
  { label: 'Autonomous agents', state: 'Building now' },
];
