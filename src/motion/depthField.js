import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  FogExp2,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

/**
 * Impact frame depth field.
 *
 * A corridor of tilted frames receding into a fogged void, with dust
 * catching the light. The camera dollies forward on scroll and yaws with
 * the pointer, so the poster reads as a space rather than a flat cut.
 *
 * Loaded on demand: the sky in CSS is the instant poster, and the 3D depth
 * arrives as an enhancement on top of it.
 *
 * Contract with the surrounding page:
 *   - the visible canvas is the renderer's own target, never a hidden one;
 *   - the drawing buffer is preserved so a paused frame compares byte for byte;
 *   - reduced motion renders one static frame and never starts a loop.
 */

const FRAME_COUNT = 9;
const FRAME_SPACING = 2.6;
const DUST_COUNT = 220;
const FIELD_OF_VIEW = 46;

function buildFrames() {
  const positions = [];
  const colors = [];
  const near = new Color('#ff2e88');
  const far = new Color('#3b0a5e');
  const scratch = new Color();
  const corners = [];

  // Every frame is the same size; the camera does the shrinking. A slow twist
  // keeps the tunnel from reading as a mechanical grid.
  for (let index = 0; index < FRAME_COUNT; index += 1) {
    const depth = index * FRAME_SPACING;
    const twist = 0.05 + index * 0.035;
    const cos = Math.cos(twist);
    const sin = Math.sin(twist);
    const halfWidth = 1.9;
    const halfHeight = 2.5;
    const mix = 1 - index / FRAME_COUNT;

    scratch.copy(far).lerp(near, mix);
    const alpha = 0.34 + mix * 0.66;

    const ring = [[-halfWidth, -halfHeight], [halfWidth, -halfHeight], [halfWidth, halfHeight], [-halfWidth, halfHeight]]
      .map(([x, y]) => [x * cos - y * sin, x * sin + y * cos, -depth]);
    corners.push(ring);

    for (let edge = 0; edge < 4; edge += 1) {
      const a = ring[edge];
      const b = ring[(edge + 1) % 4];
      positions.push(...a, ...b);
      colors.push(scratch.r, scratch.g, scratch.b, alpha, scratch.r, scratch.g, scratch.b, alpha);
    }
  }

  // Rails join matching corners, so the frames read as one tunnel.
  const rail = new Color('#2ee6ff');
  for (let index = 0; index < FRAME_COUNT - 1; index += 1) {
    for (let edge = 0; edge < 4; edge += 1) {
      const a = corners[index][edge];
      const b = corners[index + 1][edge];
      positions.push(...a, ...b);
      colors.push(rail.r, rail.g, rail.b, 0.8, rail.r, rail.g, rail.b, 0.8);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 4));
  return geometry;
}

function buildDust() {
  const positions = new Float32Array(DUST_COUNT * 3);
  for (let index = 0; index < DUST_COUNT; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 9;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 6.5;
    positions[index * 3 + 2] = -Math.random() * 22 + 1.5;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  return geometry;
}

/**
 * Creates the depth field on the given visible canvas.
 * Returns a controller, or null when WebGL is unavailable.
 */
export function createDepthField(canvas, { motion }) {
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
  scene.fog = new FogExp2(0x0a0614, 0.052);

  const camera = new PerspectiveCamera(FIELD_OF_VIEW, 1, 0.1, 90);
  camera.position.set(0, 0, 6.2);

  const frameGeometry = buildFrames();
  const frameMaterial = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const frames = new LineSegments(frameGeometry, frameMaterial);

  // The slab at the end of the corridor gives the void a light source.
  const slabGeometry = new BufferGeometry();
  slabGeometry.setAttribute('position', new BufferAttribute(new Float32Array([
    -1.6, -2.1, -20.5, 1.6, -2.1, -20.5, 1.6, 2.1, -20.5,
    -1.6, -2.1, -20.5, 1.6, 2.1, -20.5, -1.6, 2.1, -20.5,
  ]), 3));
  const slabMaterial = new MeshBasicMaterial({
    color: new Color('#1a0830'),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const slab = new Mesh(slabGeometry, slabMaterial);

  const dustGeometry = buildDust();
  const dustMaterial = new PointsMaterial({
    color: new Color('#ff6bb0'),
    size: 0.035,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });
  const dust = new Points(dustGeometry, dustMaterial);

  const group = new Group();
  // The tunnel recedes into the empty lower right of the hero, clear of the
  // copy block, so the far frames read as light on black and the near ones
  // read as structure against the sky.
  group.position.set(0, 0, 0);
  group.rotation.z = 0.16;
  group.add(frames, slab, dust);
  scene.add(group);

  const state = {
    frame: 0,
    width: 1,
    height: 1,
    visible: true,
    time: 0,
    progress: 0,
    pointer: { x: 0, y: 0 },
  };

  const focus = new Vector3(0, 0, -14);

  /**
   * The scene is rendered into a viewport rather than the whole canvas, so it
   * occupies exactly the lower-right of the hero and is projected for that
   * region instead of being masked out of a full-width render.
   */
  function region() {
    const width = state.width;
    const height = state.height;
    const regionWidth = width * 0.44;
    const regionHeight = height * 0.56;
    return { x: width - regionWidth, y: 0, width: regionWidth, height: regionHeight };
  }

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
    draw();
  }

  function draw() {
    const { reduced } = motion.get();
    const yaw = reduced ? 0 : state.pointer.x * 0.15;
    const pitch = reduced ? 0 : -state.pointer.y * 0.09;
    const dolly = 6.2 + state.progress * 5.2;
    const drift = reduced ? 0 : Math.sin(state.time * 0.00022) * 0.3;

    camera.position.set(drift, state.pointer.y * -0.12, dolly);
    camera.lookAt(focus);

    group.rotation.y = yaw;
    group.rotation.x = pitch;
    dust.rotation.y = state.time * 0.00004;

    // Render only into the lower-right region, projected for that region.
    const area = region();
    renderer.setViewport(area.x, area.y, area.width, area.height);
    renderer.setScissor(area.x, area.y, area.width, area.height);
    renderer.setScissorTest(true);
    camera.aspect = area.width / area.height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);

    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, state.width, state.height);
    canvas.dataset.render = motion.get().paused ? 'held' : 'live';
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

  function readScroll() {
    const rect = canvas.getBoundingClientRect();
    state.progress = MathUtils.clamp(-rect.top / Math.max(1, rect.height), 0, 1);
  }

  function move(event) {
    const { reduced, paused } = motion.get();
    if (event.pointerType !== 'mouse' || paused || reduced) return;
    const rect = canvas.getBoundingClientRect();
    const x = MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.42) / 0.3, -1, 1);
    const y = MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) / 0.32, -1, 1);
    state.pointer.x = x;
    state.pointer.y = y;
  }

  function leave() {
    state.pointer.x = 0;
    state.pointer.y = 0;
  }

  const resizeObserver = new ResizeObserver(() => { resize(); readScroll(); });
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    syncLoop();
  });
  resizeObserver.observe(canvas);
  visibilityObserver.observe(canvas);
  document.addEventListener('visibilitychange', syncLoop);
  window.addEventListener('scroll', readScroll, { passive: true });
  canvas.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('pointerleave', leave);

  resize();
  readScroll();
  draw();
  syncLoop();

  return {
    syncLoop,
    destroy() {
      cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      window.removeEventListener('scroll', readScroll);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      frameGeometry.dispose();
      frameMaterial.dispose();
      slabGeometry.dispose();
      slabMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    },
  };
}
