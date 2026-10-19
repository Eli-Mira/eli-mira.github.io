import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { graph, layoutGraph } from '../data/graph.js';

/**
 * The 3D signal graph.
 *
 * Nodes are placed on three bands: concepts outside, tools between, projects
 * at the centre. Links are drawn as thin additive lines so the graph reads
 * as a field of signal rather than a chart.
 *
 * The pointer picks nodes by raycast, and every node is also reachable from
 * the text list that sits under the canvas.
 */

const GROUP_COLORS = {
  project: '#ff4055',
  tool: '#ff8b9b',
  concept: '#c9c2c8',
};

const NODE_RADIUS = 0.19;

export function createSignalGraph(canvas, { motion, onHover }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }

  if (renderer.domElement !== canvas) return null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 1, 0.1, 60);
  camera.position.set(0, 0, 8.4);

  const root = new Group();
  scene.add(root);

  const positions = layoutGraph();

  // The real extent of the layout, so the camera can frame it exactly
  // whatever the node set turns out to be.
  let extentX = 1;
  let extentY = 1;
  for (const position of positions.values()) {
    extentX = Math.max(extentX, Math.abs(position.x));
    extentY = Math.max(extentY, Math.abs(position.y));
  }
  const nodes = graph.projects.concat(graph.tools, graph.concepts);
  const pickable = [];
  const nodeMeshes = new Map();

  const sphere = new SphereGeometry(NODE_RADIUS, 16, 14);
  for (const node of nodes) {
    const position = positions.get(node.id);
    if (!position) continue;
    const material = new MeshBasicMaterial({
      color: new Color(GROUP_COLORS[node.group]),
      transparent: true,
      opacity: node.group === 'project' ? 1 : 0.82,
    });
    const mesh = new Mesh(sphere, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.userData.id = node.id;
    root.add(mesh);
    pickable.push(mesh);
    nodeMeshes.set(node.id, mesh);
  }

  const linkPositions = [];
  const linkColors = [];
  for (const [from, to] of graph.links) {
    const a = positions.get(from);
    const b = positions.get(to);
    if (!a || !b) continue;
    linkPositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const color = new Color(GROUP_COLORS.project);
    linkColors.push(color.r, color.g, color.b, 0.62, color.r, color.g, color.b, 0.62);
  }
  const linkGeometry = new BufferGeometry();
  linkGeometry.setAttribute('position', new BufferAttribute(new Float32Array(linkPositions), 3));
  linkGeometry.setAttribute('color', new BufferAttribute(new Float32Array(linkColors), 4));
  const linkMaterial = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const links = new LineSegments(linkGeometry, linkMaterial);
  root.add(links);

  const state = {
    frame: 0,
    width: 1,
    height: 1,
    visible: true,
    time: 0,
    hovered: null,
    pointer: new Vector2(0, 0),
    pointerWorld: new Vector3(),
  };

  const raycaster = new Raycaster();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    state.width = rect.width || 1;
    state.height = rect.height || 1;
    const width = Math.max(1, Math.round(state.width * ratio));
    const height = Math.max(1, Math.round(state.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(state.width, state.height, false);
    }
    camera.aspect = state.width / state.height;
    camera.updateProjectionMatrix();
    draw();
  }

  function draw() {
    const { reduced, paused } = motion.get();
    camera.position.x = reduced ? 0 : state.pointer.x * 0.6;
    camera.position.y = reduced ? 0 : -state.pointer.y * 0.4;
    camera.lookAt(0, 0, 0);

    // The graph is laid out on a disc, so it is scaled to fit the frame
    // rather than sitting in the middle of it with dead space around.
    const viewHeight = 2 * Math.tan((46 * Math.PI) / 360) * camera.position.z;
    const viewWidth = viewHeight * camera.aspect;
    const fit = Math.min(viewWidth / (extentX * 2), viewHeight / (extentY * 2)) * 0.92;
    root.scale.setScalar(fit);

    if (!reduced) {
      // A slow sway rather than a spin: the map has to stay readable, and a
      // full rotation would turn the wide ellipse edge-on.
      root.rotation.y = Math.sin(state.time * 0.00011) * 0.26;
      root.rotation.x = Math.sin(state.time * 0.00008) * 0.07;
    }

    for (const [id, mesh] of nodeMeshes) {
      const hovered = state.hovered === id;
      const dimmed = state.hovered && !hovered;
      const target = hovered ? 1.9 : 1;
      const scale = mesh.scale.x + (target - mesh.scale.x) * 0.18;
      mesh.scale.setScalar(scale);
      mesh.material.opacity = (mesh.userData.group === 'project' ? 1 : 0.82) * (dimmed ? 0.4 : 1);
    }

    // A hovered node eases away from the pointer, so the connections to it
    // open up and the relationship is legible without touching the labels.
    if (state.hovered && !reduced) {
      for (const [id, mesh] of nodeMeshes) {
        if (id === state.hovered) continue;
        const dx = mesh.position.x - state.pointerWorld.x;
        const dy = mesh.position.y - state.pointerWorld.y;
        const distance = Math.hypot(dx, dy) || 1;
        const push = Math.max(0, 1.5 - distance) * 0.32;
        mesh.position.x += (dx / distance) * push;
        mesh.position.y += (dy / distance) * push;
      }
    }

    renderer.render(scene, camera);
    canvas.dataset.render = paused ? 'held' : 'live';
  }

  function loop(now) {
    state.frame = 0;
    const { reduced, paused } = motion.get();
    if (paused || reduced || !state.visible || document.hidden) return;
    state.time = now;
    draw();
    state.frame = requestAnimationFrame(loop);
  }

  function syncLoop() {
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    const { reduced, paused } = motion.get();
    if (!paused && !reduced && state.visible && !document.hidden) {
      state.frame = requestAnimationFrame(loop);
    }
  }

  function pick() {
    raycaster.setFromCamera(state.pointer, camera);
    const hits = raycaster.intersectObjects(pickable, false);
    const id = hits.length ? hits[0].object.userData.id : null;
    if (id !== state.hovered) {
      state.hovered = id;
      onHover?.(id);
    }
  }

  function move(event) {
    const { reduced, paused } = motion.get();
    if (event.pointerType !== 'mouse' || paused || reduced) return;
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    // The pointer is also tracked in world space, so nodes can move away from
    // it rather than only being picked by it.
    state.pointerWorld.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera);
    state.pointerWorld.sub(camera.position).normalize().multiplyScalar(12);
    pick();
  }

  function leave() {
    state.pointer.set(-2, -2);
    if (state.hovered) {
      state.hovered = null;
      onHover?.(null);
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    syncLoop();
  });
  resizeObserver.observe(canvas);
  visibilityObserver.observe(canvas);
  document.addEventListener('visibilitychange', syncLoop);
  canvas.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('pointerleave', leave);

  resize();
  draw();
  syncLoop();

  return {
    syncLoop,
    destroy() {
      cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      sphere.dispose();
      for (const mesh of nodeMeshes.values()) mesh.material.dispose();
      linkGeometry.dispose();
      linkMaterial.dispose();
      renderer.dispose();
    },
  };
}
