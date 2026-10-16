/* =========================================================
   FRONTIER · the falling robot (Three.js)
   ---------------------------------------------------------
   Loaded only when the hero is on screen. Draws a humanoid
   robot mid-fall into a transparent canvas that sits between
   the two copies of the word FRONTIER, so some letters pass
   in front of it and some behind.

   The robot is modelled here from simple shapes: an original,
   generic humanoid, nothing downloaded.
   ========================================================= */
import * as THREE from "three";

export function start(canvas, opts = {}) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  // Light to match the data centre: cold blue all round, a blue rim
  // from behind, and a hint of red from the glow down the aisle.
  scene.add(new THREE.HemisphereLight(0x9cc8ff, 0x0a0f18, 0.7));
  const key = new THREE.DirectionalLight(0xcfe4ff, 1.6); key.position.set(-4, 5, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4aa8ff, 4.5); rim.position.set(3, 4, -8); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x7fc4ff, 2.2); rim2.position.set(-5, -2, -6); scene.add(rim2);
  const red = new THREE.PointLight(0xff2a1a, 60, 30, 1.6); red.position.set(0.5, -2.5, -6); scene.add(red);

  const pivot = new THREE.Group();
  scene.add(pivot);

  let ready = false, raf = 0, progress = 0, t0 = performance.now();

  // ---- The robot, modelled here from simple shapes ----
  // A generic modern humanoid: white shell panels over dark joints,
  // a glossy black face visor and a small blue chest light.
  // Low-poly and flat-shaded on purpose.
  const shell = new THREE.MeshStandardMaterial({ color: 0xe9edf2, metalness: 0.3, roughness: 0.3, flatShading: true });
  const joint = new THREE.MeshStandardMaterial({ color: 0x1b2028, metalness: 0.85, roughness: 0.35, flatShading: true });
  const grey = new THREE.MeshStandardMaterial({ color: 0x8c96a2, metalness: 0.6, roughness: 0.35, flatShading: true });
  const visor = new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.9, roughness: 0.12, side: THREE.DoubleSide });
  const glow = new THREE.MeshStandardMaterial({ color: 0x9fe2ff, emissive: 0x5cc8ff, emissiveIntensity: 2.2 });

  const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };
  const group = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const capsule = (r, len, mat, y, sx = 1, sz = 1) => { const m = mesh(new THREE.CapsuleGeometry(r, len, 3, 8), mat, 0, y, 0); m.scale.set(sx, 1, sz); return m; };
  const ball = (r, mat) => mesh(new THREE.SphereGeometry(r, 8, 6), mat);

  const robot = new THREE.Group();
  // pelvis and waist
  robot.add(mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.14, 8), shell, 0, 0, 0));
  robot.add(mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.14, 8), joint, 0, 0.13, 0));
  // chest: a tapered shell, a darker back pack, the chest light
  const chest = mesh(new THREE.CylinderGeometry(0.21, 0.14, 0.36, 8), shell, 0, 0.37, 0); chest.scale.z = 0.62; robot.add(chest);
  const pack = mesh(new THREE.BoxGeometry(0.24, 0.26, 0.08), grey, 0, 0.38, -0.12); robot.add(pack);
  robot.add(mesh(new THREE.BoxGeometry(0.1, 0.015, 0.01), glow, 0, 0.44, 0.122));
  // neck and head: a rounded helmet with a black visor
  robot.add(mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.09, 8), joint, 0, 0.6, 0));
  const head = group(robot, 0, 0.71, 0);
  const helmet = mesh(new THREE.SphereGeometry(0.115, 12, 9), shell); helmet.scale.set(0.88, 1.08, 1); head.add(helmet);
  const face = mesh(new THREE.SphereGeometry(0.118, 14, 8, Math.PI / 2 - 0.85, 1.7, 0.75, 1.15), visor); face.scale.set(0.9, 1.08, 1.02); head.add(face);

  function arm(side) {                        // side: 1 = left (+x), -1 = right
    const sh = group(robot, side * 0.25, 0.5, 0);
    sh.add(ball(0.07, joint));
    sh.add(capsule(0.055, 0.17, shell, -0.15, 1, 0.9));
    const el = group(sh, 0, -0.3, 0);
    el.add(ball(0.048, joint));
    el.add(capsule(0.047, 0.16, shell, -0.13, 1, 0.9));
    const hand = group(el, 0, -0.27, 0);
    hand.add(mesh(new THREE.BoxGeometry(0.035, 0.08, 0.075), joint, 0, -0.03, 0));
    for (let f = 0; f < 4; f++) hand.add(mesh(new THREE.BoxGeometry(0.03, 0.06, 0.014), joint, 0, -0.1, -0.026 + f * 0.018));
    hand.add(mesh(new THREE.BoxGeometry(0.02, 0.05, 0.018), joint, side * 0.02, -0.05, 0.04));
    return { sh, el, hand };
  }
  function leg(side) {
    const hip = group(robot, side * 0.1, -0.06, 0);
    hip.add(ball(0.07, joint));
    hip.add(capsule(0.075, 0.22, shell, -0.19, 1, 0.92));
    const knee = group(hip, 0, -0.42, 0);
    knee.add(ball(0.06, joint));
    knee.add(capsule(0.062, 0.24, grey, -0.2, 1, 0.9));
    knee.add(mesh(new THREE.BoxGeometry(0.09, 0.22, 0.03), shell, 0, -0.17, 0.05));   // shin plate
    const ankle = group(knee, 0, -0.42, 0);
    ankle.add(mesh(new THREE.BoxGeometry(0.1, 0.06, 0.24), joint, 0, -0.03, 0.05));
    return { hip, knee, ankle };
  }
  const L = arm(1), R = arm(-1), LL = leg(1), RL = leg(-1);

  // Mid-fall: arms flung up and out, one knee drawn up, head thrown back
  L.sh.rotation.set(-0.3, 0, 2.3);  L.el.rotation.set(-0.7, 0, 0.2);  L.hand.rotation.set(0, 0, 0.3);
  R.sh.rotation.set(0.4, 0, -1.7);  R.el.rotation.set(-0.9, 0, -0.1); R.hand.rotation.set(0, 0, -0.4);
  LL.hip.rotation.set(-1.1, 0, 0.25); LL.knee.rotation.set(1.5, 0, 0); LL.ankle.rotation.set(-0.4, 0, 0);
  RL.hip.rotation.set(0.35, 0, -0.3); RL.knee.rotation.set(0.6, 0, 0);  RL.ankle.rotation.set(0.3, 0, 0);
  head.rotation.set(-0.35, 0.25, 0);

  // Centre it and scale it to 4.2 units tall (standing height)
  robot.position.y = -0.25;
  pivot.scale.setScalar(5.1 / 1.65);
  pivot.add(robot);
  ready = true;
  if (opts.onReady) setTimeout(() => { opts.onReady(); frame(); }, 0);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the robot a similar size against the word, wide or tall
    camera.fov = w / h < 0.8 ? 50 : 30;
    camera.updateProjectionMatrix();
    if (ready) renderer.render(scene, camera);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function frame() {
    if (!ready) return;
    const t = (performance.now() - t0) / 1000;
    const still = reduced.matches;
    // Mid-fall: tilted head-down, tumbling slowly; scrolling makes it fall further
    const drift = still ? 0 : t;
    pivot.rotation.set(
      -0.55 + progress * 1.1 + (still ? 0 : Math.sin(drift * 0.35) * 0.08),
      -0.1 + progress * 0.9 + (still ? 0 : Math.sin(drift * 0.21) * 0.25),
      2.25 + progress * 0.8 + (still ? 0 : Math.sin(drift * 0.27) * 0.06),
    );
    pivot.position.set(0.35, 0.05 - progress * 3.2 + (still ? 0 : Math.sin(drift * 0.6) * 0.06), 0);
    renderer.render(scene, camera);
    if (!still) raf = requestAnimationFrame(frame);
  }

  return {
    setProgress(p) {
      progress = Math.max(0, Math.min(1, p));
      if (reduced.matches && ready) frame();
    },
    stop() { cancelAnimationFrame(raf); },
    resume() { if (!reduced.matches && ready) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } },
  };
}
