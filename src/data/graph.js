/**
 * The signal graph.
 *
 * A relationship map of the work: projects, the tools they are built with,
 * and the concepts they exercise. The positions are precomputed rather than
 * force-solved, so the map is identical on every load and testable.
 *
 * The graph is decorative. Every node it draws also appears as a real list
 * entry with the same information, so the map is never the only way to read
 * the content.
 */
export const graph = {
  projects: [
    { id: 'gesture-control', label: 'Gesture Control', group: 'project' },
    { id: 'devsquad', label: 'DevSquad', group: 'project' },
    { id: 'upgradeatlas', label: 'UpgradeAtlas', group: 'project' },
    { id: 'elilain-intel', label: 'EliLain Intel', group: 'project' },
    { id: 'arcane-swipe', label: 'Arcane Swipe', group: 'project' },
  ],
  tools: [
    { id: 'python', label: 'Python', group: 'tool' },
    { id: 'opencv', label: 'OpenCV', group: 'tool' },
    { id: 'mediapipe', label: 'MediaPipe', group: 'tool' },
    { id: 'react', label: 'React', group: 'tool' },
    { id: 'laravel', label: 'Laravel', group: 'tool' },
    { id: 'postgres', label: 'PostgreSQL', group: 'tool' },
  ],
  concepts: [
    { id: 'agents', label: 'Agents', group: 'concept' },
    { id: 'pipelines', label: 'Pipelines', group: 'concept' },
    { id: 'realtime', label: 'Realtime', group: 'concept' },
    { id: 'interfaces', label: 'Interfaces', group: 'concept' },
  ],
  links: [
    ['gesture-control', 'python'],
    ['gesture-control', 'opencv'],
    ['gesture-control', 'mediapipe'],
    ['gesture-control', 'realtime'],
    ['devsquad', 'python'],
    ['devsquad', 'agents'],
    ['devsquad', 'pipelines'],
    ['upgradeatlas', 'react'],
    ['upgradeatlas', 'laravel'],
    ['upgradeatlas', 'postgres'],
    ['upgradeatlas', 'interfaces'],
    ['elilain-intel', 'python'],
    ['elilain-intel', 'pipelines'],
    ['elilain-intel', 'interfaces'],
    ['arcane-swipe', 'python'],
    ['arcane-swipe', 'mediapipe'],
    ['arcane-swipe', 'realtime'],
    ['agents', 'pipelines'],
    ['interfaces', 'react'],
  ],
};

/**
 * Deterministic node positions on a shallow disc, grouped by kind so the
 * map reads as three bands rather than a cloud.
 */
export function layoutGraph() {
  const positions = new Map();
  const place = (nodes, radius, phase) => {
    nodes.forEach((node, index) => {
      const angle = phase + (index / nodes.length) * Math.PI * 2;
      positions.set(node.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.62,
        z: (index % 3) * 0.4 - 0.4,
      });
    });
  };
  place(graph.concepts, 3.5, Math.PI / 2);
  place(graph.tools, 2.25, Math.PI * 0.72);
  place(graph.projects, 1.1, -Math.PI / 2);
  return positions;
}

export const groupLabels = {
  project: 'Project',
  tool: 'Tool',
  concept: 'Concept',
};
