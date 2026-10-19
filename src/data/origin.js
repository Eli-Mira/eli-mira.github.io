/**
 * Origin and contact.
 *
 * The biography is deliberately short and factual. It states the same role the
 * public GitHub profile states, and lists the work that can be inspected. It
 * does not restate, expand or reinterpret anything the owner has not published.
 */
export const origin = {
  role: 'CS student, AI/ML path. Building gesture control, agent pipelines and the tooling around them.',
  location: 'Egypt',
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
