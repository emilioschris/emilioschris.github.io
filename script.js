/* =========================================================
   FIELD NOTES · script
   ---------------------------------------------------------
   1. Day / Dusk theme
   2. Top bar + mobile menu
   3. Compass
   4. Contour map (the hero)
   5. Hawk blink
   6. Trails between cards
   7. Gentle reveal on scroll
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = matchMedia("(prefers-color-scheme: dark)");

  /* ---------------------------------------------------------
     1. DAY / DUSK THEME
     --------------------------------------------------------- */
  const themeButton = document.getElementById("theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function isDusk() {
    const chosen = root.dataset.theme;
    return chosen ? chosen === "dusk" : prefersDark.matches;
  }

  function syncTheme() {
    themeButton.setAttribute("aria-checked", String(isDusk()));
    themeMeta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
    terrain.refreshColours();
  }

  themeButton.addEventListener("click", () => {
    const next = isDusk() ? "day" : "dusk";
    root.dataset.theme = next;
    try { localStorage.setItem("fieldnotes-theme", next); } catch (e) {}
    syncTheme();
  });
  prefersDark.addEventListener("change", syncTheme);

  /* ---------------------------------------------------------
     2. TOP BAR + MOBILE MENU
     --------------------------------------------------------- */
  const bar = document.querySelector(".bar");
  const nav = document.getElementById("site-nav");
  const menuButton = document.getElementById("menu-toggle");

  const onScroll = () => bar.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }
  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      menuButton.focus();
    }
  });

  /* ---------------------------------------------------------
     3. COMPASS
     Every section has data-bearing="…". When a section crosses
     the middle of the screen, the needle turns to face it.
     --------------------------------------------------------- */
  const needle = document.getElementById("compass-needle");
  const bearingText = document.getElementById("compass-bearing");
  let needleAngle = 0;

  function pointTo(bearing) {
    // Turn the short way round (e.g. 350° → 10° is +20°, not −340°)
    const diff = ((bearing - needleAngle) % 360 + 540) % 360 - 180;
    needleAngle += diff;
    needle.style.transform = `rotate(${needleAngle}deg)`;
    bearingText.textContent = `N ${String(bearing).padStart(3, "0")}°`;
  }

  const legs = document.querySelectorAll("[data-bearing]");
  const legWatcher = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      pointTo(Number(entry.target.dataset.bearing));
      nav.querySelectorAll("a").forEach((a) => {
        if (a.hash === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  legs.forEach((leg) => legWatcher.observe(leg));

  /* ---------------------------------------------------------
     4. CONTOUR MAP
     How it works:
       a) Lay an invisible grid over the hero.
       b) Give every grid point a height: high at the origin,
          lower further away, plus smooth "noise" so it looks
          like real terrain (and a bump under the cursor).
       c) "Marching squares" walks each grid cell and finds
          where the land crosses 0, 1, 2, 3… — those crossings,
          joined up, are the contour lines.
     --------------------------------------------------------- */
  const terrain = (() => {
    const hero = document.querySelector(".hero");
    const canvas = document.getElementById("terrain");
    const ctx = canvas.getContext("2d");
    const originMarker = document.getElementById("origin");
    const readout = document.getElementById("survey-readout");

    /* --- Simplex noise: smooth random hills (seeded, so the map is the same every visit) --- */
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    const GX = [1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0];
    const GY = [1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1];
    (function seed(s) {
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const j = s % (i + 1);
        [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12; }
    })(351334);

    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    function noise(x, y) {
      const s = (x + y) * F2;
      const i = Math.floor(x + s), j = Math.floor(y + s);
      const t = (i + j) * G2;
      const x0 = x - (i - t), y0 = y - (j - t);
      const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
      const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      const ii = i & 255, jj = j & 255;
      let n = 0, tt, g;
      tt = 0.5 - x0 * x0 - y0 * y0;
      if (tt > 0) { g = permMod12[ii + perm[jj]]; tt *= tt; n += tt * tt * (GX[g] * x0 + GY[g] * y0); }
      tt = 0.5 - x1 * x1 - y1 * y1;
      if (tt > 0) { g = permMod12[ii + i1 + perm[jj + j1]]; tt *= tt; n += tt * tt * (GX[g] * x1 + GY[g] * y1); }
      tt = 0.5 - x2 * x2 - y2 * y2;
      if (tt > 0) { g = permMod12[ii + 1 + perm[jj + 1]]; tt *= tt; n += tt * tt * (GX[g] * x2 + GY[g] * y2); }
      return 70 * n; // roughly −1 … 1
    }

    /* --- Marching squares lookup: which cell edges each line joins.
           Edges: 0 top, 1 right, 2 bottom, 3 left. --- */
    const SEGMENTS = [
      [], [3, 2], [2, 1], [3, 1], [0, 1], [3, 0, 2, 1], [0, 2], [3, 0],
      [3, 0], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], [],
    ];

    /* --- State --- */
    let width = 0, height = 0, dpr = 1;
    let cell = 9, cols = 0, rows = 0, grid = new Float32Array(0);
    let originX = 0, originY = 0, ringSpacing = 36, elevationOffset = 40;
    let bumpSigma = 120;
    let colours = {};
    let labels = [];
    let running = false, onScreen = true, frameId = 0, lastT = 0;
    let lastReadout = "";

    // The cursor: x/y glide toward tx/ty, strength fades between 0 and 1
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };
    let touchRelease = 0;

    const BUMP_HEIGHT = 2.4;     // how many contour steps the land rises under the cursor
    const METRES_PER_STEP = 20;  // each contour line = 20 m
    const INDEX_EVERY = 5;       // every 5th line is a bold "index" contour (100 m)

    /* --- The height of the land at any point --- */
    function heightAt(x, y, t) {
      // Close to the origin the land is calmer, so the origin stays the summit
      const dx0 = x - originX, dy0 = y - originY;
      const calm = Math.min(1, Math.sqrt(dx0 * dx0 + dy0 * dy0) / 180);
      const k = calm * calm * (3 - 2 * calm);

      // Gently warp space so the rings wander like real hills
      const wx = noise(x / 520 + t * 0.010, y / 520 + 3.1);
      const wy = noise(x / 520 - 7.3, y / 520 - t * 0.008);
      const px = x + wx * 70 * k;
      const py = y + wy * 70 * k;

      // Distance from the origin: the further away, the lower
      const dx = px - originX, dy = py - originY;
      const d = Math.sqrt(dx * dx + dy * dy);
      let h = -d / ringSpacing;

      // Natural-looking hills on top
      h += k * (1.7 * noise(px / 380 + t * 0.012, py / 380 - t * 0.009)
              + 0.5 * noise(px / 150 - t * 0.020, py / 150 + t * 0.015));

      // The bump under the cursor
      if (pointer.s > 0.001) {
        const bx = x - pointer.x, by = y - pointer.y;
        h += pointer.s * BUMP_HEIGHT * Math.exp(-(bx * bx + by * by) / (2 * bumpSigma * bumpSigma));
      }
      return h;
    }

    const toMetres = (h) => Math.round((h + elevationOffset) * METRES_PER_STEP);

    /* --- Fit the canvas and grid to the hero's size --- */
    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const small = width < 700;
      // About 22,000 grid points whatever the screen size keeps every frame fast
      cell = Math.max(7, Math.min(14, Math.sqrt((width * height) / 22000)));
      cols = Math.ceil(width / cell) + 1;
      rows = Math.ceil(height / cell) + 1;
      grid = new Float32Array(cols * rows);

      ringSpacing = small ? 26 : 36;
      bumpSigma = small ? 80 : 120;
      originX = width * (small ? 0.56 : 0.42);
      originY = height * (small ? 0.68 : 0.62);
      originMarker.style.left = `${originX}px`;
      originMarker.style.top = `${originY}px`;

      // Make sure even the far corners stay above 0 m
      const far = Math.hypot(Math.max(originX, width - originX), Math.max(originY, height - originY));
      elevationOffset = Math.ceil(far / ringSpacing / INDEX_EVERY + 1) * INDEX_EVERY;

      // Where the elevation labels try to sit (as fractions of the hero), kept clear of the title
      const spots = small
        ? [[0.86, 0.9], [0.2, 0.62]]
        : [[0.84, 0.28], [0.9, 0.7], [0.16, 0.86], [0.66, 0.9]];
      labels = spots.map(([fx, fy]) => ({ ax: fx * width, ay: fy * height, x: 0, y: 0, a: 0, lv: null }));

      if (!running) render(0);
    }

    function refreshColours() {
      const css = getComputedStyle(root);
      colours = {
        line: css.getPropertyValue("--map-line").trim(),
        lineAlpha: parseFloat(css.getPropertyValue("--map-alpha")) || 0.3,
        indexAlpha: parseFloat(css.getPropertyValue("--map-index-alpha")) || 0.6,
        accent: css.getPropertyValue("--accent").trim(),
      };
      if (!running) render(lastT);
    }

    /* --- Draw one frame --- */
    function render(t) {
      lastT = t;

      // b) heights for every grid point
      for (let j = 0, n = 0; j < rows; j++) {
        const y = j * cell;
        for (let i = 0; i < cols; i++, n++) grid[n] = heightAt(i * cell, y, t);
      }

      // The contour under the cursor is traced in terracotta
      const traced = pointer.s > 0.25 ? Math.round(heightAt(pointer.x, pointer.y, t)) : NaN;

      const thin = new Path2D(), bold = new Path2D(), trace = new Path2D();
      for (const l of labels) { l.best = Infinity; }

      // c) marching squares
      let a, b, c, d, x0, y0, x1, y1, lv, ex, ey;
      const edge = (e) => {
        let f;
        if (e === 0)      { f = (lv - a) / (b - a); ex = x0 + f * cell; ey = y0; }
        else if (e === 1) { f = (lv - b) / (c - b); ex = x1; ey = y0 + f * cell; }
        else if (e === 2) { f = (lv - d) / (c - d); ex = x0 + f * cell; ey = y1; }
        else              { f = (lv - a) / (d - a); ex = x0; ey = y0 + f * cell; }
      };

      for (let j = 0; j < rows - 1; j++) {
        y0 = j * cell; y1 = y0 + cell;
        for (let i = 0; i < cols - 1; i++) {
          const n = j * cols + i;
          a = grid[n]; b = grid[n + 1]; c = grid[n + cols + 1]; d = grid[n + cols];
          const lo = Math.ceil(Math.min(a, b, c, d));
          const hi = Math.floor(Math.max(a, b, c, d));
          if (lo > hi) continue;
          x0 = i * cell; x1 = x0 + cell;

          for (lv = lo; lv <= hi; lv++) {
            const code = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
            if (code === 0 || code === 15) continue;
            const isIndex = lv % INDEX_EVERY === 0;
            const path = lv === traced ? trace : isIndex ? bold : thin;
            const segs = SEGMENTS[code];

            for (let s = 0; s < segs.length; s += 2) {
              edge(segs[s]);     const sx = ex, sy = ey;
              edge(segs[s + 1]);
              path.moveTo(sx, sy);
              path.lineTo(ex, ey);

              // Remember the bold-line point closest to each label spot
              if (isIndex) {
                const mx = (sx + ex) / 2, my = (sy + ey) / 2;
                for (const l of labels) {
                  const dd = (mx - l.ax) ** 2 + (my - l.ay) ** 2;
                  if (dd < l.best) { l.best = dd; l.bx = mx; l.by = my; l.ba = Math.atan2(ey - sy, ex - sx); l.blv = lv; }
                }
              }
            }
          }
        }
      }

      // Paint
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = colours.line;

      ctx.globalAlpha = colours.lineAlpha;
      ctx.lineWidth = 0.9;
      ctx.stroke(thin);

      ctx.globalAlpha = colours.indexAlpha;
      ctx.lineWidth = 1.4;
      ctx.stroke(bold);

      if (!Number.isNaN(traced)) {
        ctx.globalAlpha = Math.min(1, pointer.s) * 0.85;
        ctx.strokeStyle = colours.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke(trace);
      }
      ctx.globalAlpha = 1;

      drawLabels();
      updateReadout(t);
    }

    /* Tiny elevation numbers sitting in a gap cut out of the bold lines */
    function drawLabels() {
      ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const l of labels) {
        if (l.best === Infinity) continue;
        let ang = l.ba;
        if (ang > Math.PI / 2) ang -= Math.PI;     // keep text upright
        if (ang < -Math.PI / 2) ang += Math.PI;

        // Glide smoothly; jump only if the label moved to a different line
        const ease = running && l.lv === l.blv && Math.abs(ang - l.a) < 0.8 ? 0.18 : 1;
        l.x += (l.bx - l.x) * ease;
        l.y += (l.by - l.y) * ease;
        l.a += (ang - l.a) * ease;
        l.lv = l.blv;

        const text = String(toMetres(l.lv));
        const w = ctx.measureText(text).width + 10;
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.a);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(-w / 2, -6, w, 12);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = colours.line;
        ctx.globalAlpha = Math.min(1, colours.indexAlpha + 0.3);
        ctx.fillText(text, 0, 0.5);
        ctx.restore();
      }
    }

    /* The live readout in the corner: position and height under the cursor */
    function updateReadout(t) {
      const active = pointer.s > 0.05;
      const px = active ? pointer.x : originX;
      const py = active ? pointer.y : originY;
      const lat = 35.1 - (py - originY) * 0.00035;
      const lon = 33.4 + (px - originX) * 0.00042;
      const text = `${lat.toFixed(3)}°N ${lon.toFixed(3)}°E · ELEV ${toMetres(heightAt(px, py, t))} m`;
      if (text !== lastReadout) { readout.textContent = text; lastReadout = text; }
    }

    /* --- Animation loop --- */
    function frame(now) {
      if (!running) return;
      if (touchRelease && now > touchRelease) { pointer.ts = 0; touchRelease = 0; }
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.s += (pointer.ts - pointer.s) * 0.05;
      render(now / 1000);
      frameId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !onScreen || document.hidden || reducedMotion.matches) return;
      running = true;
      frameId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(frameId);
    }

    /* --- Cursor and touch --- */
    function aim(e) {
      if (reducedMotion.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (pointer.s < 0.02) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
      pointer.ts = 1;
      touchRelease = 0;
    }
    hero.addEventListener("pointermove", aim);
    hero.addEventListener("pointerdown", aim);
    hero.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") pointer.ts = 0; });
    const release = (e) => {
      // After a tap or drag, let the land settle back slowly
      if (e.pointerType !== "mouse") touchRelease = performance.now() + 1200;
    };
    hero.addEventListener("pointerup", release);
    hero.addEventListener("pointercancel", release);

    /* --- Only animate while the map is on screen and the tab is open --- */
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen ? start() : stop();
    }).observe(hero);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    /* --- Reduced motion: one still map, no drift, no cursor effect --- */
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        stop();
        pointer.s = pointer.ts = 0;
        render(0);
      } else {
        start();
      }
    });

    new ResizeObserver(resize).observe(hero);
    refreshColours();
    resize();
    start();
    // Redraw once the mono font arrives so the labels use it
    if (document.fonts) document.fonts.ready.then(() => { if (!running) render(lastT); });

    return { refreshColours };
  })();

  /* ---------------------------------------------------------
     5. HAWK BLINK
     Each hawk blinks on its own, every 6–10 seconds.
     Skipped entirely when reduced motion is on.
     --------------------------------------------------------- */
  document.querySelectorAll(".hawk").forEach((hawk) => {
    hawk.addEventListener("animationend", () => hawk.classList.remove("is-blinking"));
    const scheduleBlink = () => {
      setTimeout(() => {
        if (!reducedMotion.matches && !document.hidden) hawk.classList.add("is-blinking");
        scheduleBlink();
      }, 6000 + Math.random() * 4000);
    };
    scheduleBlink();
  });

  /* ---------------------------------------------------------
     6. TRAILS BETWEEN CARDS
     Finds the little pin above each card and joins them with
     a dotted curve. The last card's trail heads off the edge,
     because the route continues. Redrawn whenever sizes change.
     --------------------------------------------------------- */
  function drawTrail(cards) {
    const path = cards.querySelector(".trail path");
    const box = cards.getBoundingClientRect();
    const pts = [...cards.querySelectorAll(".card-pin")].map((pin) => {
      const r = pin.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    if (!pts.length) return;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    const join = (a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        // Side by side: arc up above the card, then drop down through the gap
        const top = Math.min(a.y, b.y) - 48;
        d += ` C ${a.x + dx * 0.55} ${top - 20}, ${b.x - 4} ${top}, ${b.x} ${b.y}`;
      } else {
        // Stacked (phones): wander down the left margin
        d += ` C ${a.x - 14} ${a.y + dy * 0.4}, ${b.x - 14} ${b.y - dy * 0.4}, ${b.x} ${b.y}`;
      }
    };
    for (let i = 1; i < pts.length; i++) join(pts[i - 1], pts[i]);

    // The route continues past the last card
    const last = pts[pts.length - 1];
    const stacked = box.width < 500;
    const end = stacked
      ? { x: last.x - 6, y: box.height + 40 }
      : { x: Math.max(box.width + 24, last.x + 200), y: last.y - 40 };
    if (stacked) join(last, end);
    else d += ` C ${last.x + 60} ${last.y - 50}, ${end.x - 80} ${end.y - 30}, ${end.x} ${end.y}`;
    path.setAttribute("d", d);
  }

  const trailWatcher = new ResizeObserver((entries) => entries.forEach((e) => drawTrail(e.target)));
  document.querySelectorAll(".cards").forEach((cards) => trailWatcher.observe(cards));
  if (document.fonts) document.fonts.ready.then(() => document.querySelectorAll(".cards").forEach(drawTrail));

  /* ---------------------------------------------------------
     7. GENTLE REVEAL ON SCROLL
     Sections fade up once as they come into view.
     --------------------------------------------------------- */
  const revealer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

  document.getElementById("year").textContent = new Date().getFullYear();

  syncTheme();
})();
