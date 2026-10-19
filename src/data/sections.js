// The six destinations of the REDLINE // OVERDRIVE architecture.
export const sections = [
  { id: 'initialize', number: '00', label: 'Initialize', target: 'initialize' },
  { id: 'operations', number: '01', label: 'Operations', target: 'projects' },
  { id: 'neural-lab', number: '02', label: 'Neural Lab', target: 'neural-lab' },
  { id: 'system-profile', number: '03', label: 'System Profile', target: 'system-profile' },
  { id: 'origin', number: '04', label: 'Origin', target: 'origin' },
  { id: 'transmission', number: '05', label: 'Transmission', target: 'transmission' },
];

export function getSection(id) {
  return sections.find(section => section.id === id) ?? null;
}
