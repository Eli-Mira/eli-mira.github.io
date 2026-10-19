// The six destinations of the REDLINE // OVERDRIVE architecture.
//
// A destination is not always the same thing as the element it points at:
// Operations is the second destination but the Operations section is the
// projects element. Both names are kept here so nothing has to guess.
export const sections = [
  { id: 'initialize', number: '00', label: 'Initialize', target: 'initialize' },
  { id: 'operations', number: '01', label: 'Operations', target: 'projects' },
  { id: 'neural-lab', number: '02', label: 'Neural Lab', target: 'neural-lab' },
  { id: 'system-profile', number: '03', label: 'System Profile', target: 'system-profile' },
  { id: 'origin', number: '04', label: 'Origin', target: 'origin' },
  { id: 'transmission', number: '05', label: 'Transmission', target: 'transmission' },
];

/** The element id of each destination, in the order they appear. */
export const sectionTargets = sections.map(section => section.target);

/** The destination that a given element id belongs to. */
export const sectionByTarget = new Map(sections.map(section => [section.target, section]));
