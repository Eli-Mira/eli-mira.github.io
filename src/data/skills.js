/**
 * Skills are grouped by what they were used for, and every group points at
 * the project that proves it. No proficiency scores, no percentages.
 */
export const skills = [
  {
    name: 'Python systems',
    tools: ['Python', 'asyncio', 'dataclasses', 'Enums', 'argparse'],
    evidence: 'DevSquad pipeline state and the EliLain Intel tracker core',
  },
  {
    name: 'Computer vision',
    tools: ['MediaPipe Tasks', 'OpenCV contrib', 'NumPy'],
    evidence: 'Gesture Control engine and its pinned requirements',
  },
  {
    name: 'Windows control',
    tools: ['pywinauto', 'pycaw', 'ctypes', 'Tk overlay'],
    evidence: 'Gesture Control desktop layer and display module',
  },
  {
    name: 'Web interface',
    tools: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'CSS'],
    evidence: 'This portfolio and the UpgradeAtlas front end',
  },
  {
    name: 'Backend and data',
    tools: ['Laravel', 'PHP', 'PostgreSQL', 'SQLite', 'SQLAlchemy'],
    evidence: 'UpgradeAtlas services and the tracker store',
  },
  {
    name: 'Agents and pipelines',
    tools: ['LangGraph-shaped graphs', 'fan-out review', 'deduplication', 'scheduling'],
    evidence: 'DevSquad and the EliLain Intel pipeline',
  },
  {
    name: 'Realtime and games',
    tools: ['pygame-ce', 'frame-time profiling', 'SDL dummy driver'],
    evidence: 'Arcane Swipe and its headless benchmark',
  },
  {
    name: 'Interface motion',
    tools: ['Three.js', 'GSAP ScrollTrigger', 'Lenis'],
    evidence: 'The depth field and scroll choreography on this page',
  },
];
