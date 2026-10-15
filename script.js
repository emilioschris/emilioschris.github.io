/* =========================================================
   FIELD NOTES · homepage script
   ---------------------------------------------------------
   The Day/Dusk switch, hawk blinks, card trails, scroll
   reveals and the year come from shared/field-notes.js.
   This file only holds what's unique to the homepage:

   1. Project cards (from projects.js)
   2. Top bar + mobile menu
   3. Compass
   4. Contour map (the hero)
   5. The bonsai (easter egg that leads to The Greenhouse)
   6. The field guide (the compass opens it)
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = FieldNotes.reducedMotion;

  /* ---------------------------------------------------------
     1. PROJECT CARDS
     Builds a card for every project in projects.js and puts it
     into its section, in the order listed. A section with no
     projects gets one quiet "Uncharted" card.
     --------------------------------------------------------- */
  const STAMPS = {
    planned: { text: "Planned", className: "stamp stamp--planned" },
    ongoing: { text: "Expedition ongoing", className: "stamp" },
  };

  // The Atlas card's little world map, two crosshairs and a dotted route
  const ATLAS_MAP = `
    <svg viewBox="0 0 200 120" aria-hidden="true">
      <path class="atlas-earth" d="M100 12 C150 12 188 30 192 60 C188 90 150 108 100 108 C50 108 12 90 8 60 C12 30 50 12 100 12 Z"/>
      <g class="atlas-grid">
        <path d="M100 12 V108"/><path d="M60 15 C48 40 48 80 60 105"/><path d="M140 15 C152 40 152 80 140 105"/>
        <path d="M30 26 C24 48 24 72 30 94"/><path d="M170 26 C176 48 176 72 170 94"/>
        <path d="M10 60 H190"/><path d="M22 36 H178"/><path d="M22 84 H178"/>
      </g>
      <path class="atlas-route" d="M58 44 Q86 22 116 40"/>
      <g class="atlas-cross"><path d="M54 44 h8 M58 40 v8"/><path d="M112 40 h8 M116 36 v8"/></g>
    </svg>`;

  // Small helper: make an element with a class and (optionally) some text
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildCard(project, index) {
    const card = el("article", "card");
    card.append(el("span", "card-pin"));
    card.lastChild.setAttribute("aria-hidden", "true");

    // Coordinates and date, e.g. "2026-10" is shown as "2026·10"
    const meta = el("p", "card-meta");
    meta.append(el("span", "", project.coords || ""));
    if (project.date) {
      const time = el("time", "", project.date.replace("-", "·"));
      time.dateTime = project.date;
      meta.append(time);
    }
    card.append(meta);

    // The pebble picture (a photo, the Atlas drawing, or a placeholder)
    const media = el("div", "card-media");
    const pebble = el("div", "pebble");
    pebble.dataset.shape = project.shape || (index % 4) + 1;
    if (project.image && typeof project.image === "object") {
      // A photo, tinted in the palette (see .pebble--photo in field-notes.css)
      pebble.classList.add("pebble--photo");
      pebble.dataset.tone = project.image.tone || "terracotta";
      const img = el("img");
      img.src = project.image.src;
      img.alt = project.image.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 1000;
      img.height = 800;
      pebble.append(img);
    } else if (project.image === "atlas-map") {
      pebble.classList.add("pebble--atlas");
      pebble.setAttribute("role", "img");
      pebble.setAttribute("aria-label", "A small world map with two crosshair markers joined by a dotted route");
      pebble.innerHTML = ATLAS_MAP;
    } else {
      pebble.classList.add(project.uncharted ? "pebble--uncharted" : "pebble--placeholder");
      pebble.setAttribute("role", "img");
      pebble.setAttribute("aria-label", project.uncharted ? "An empty space on the map" : "Placeholder image");
    }
    media.append(pebble);
    const stamp = STAMPS[project.status];
    if (stamp) media.append(el("span", stamp.className, stamp.text));
    card.append(media);

    if (project.elevation) card.append(el("p", "card-elev", project.elevation));

    // Title: a link (making the whole card clickable) if the project exists
    const title = el("h3", "card-title");
    if (project.link) {
      const a = el("a", "", project.title);
      a.href = project.link;
      title.append(a);
    } else {
      title.textContent = project.title;
    }
    card.append(title);
    card.append(el("p", "card-desc", project.description || ""));

    // When it last grew, e.g. "2026-10-14" is shown as "Last tended 2026·10·14"
    if (project.tended) {
      const tended = el("p", "card-tended", "Last tended ");
      const time = el("time", "", project.tended.replaceAll("-", "·"));
      time.dateTime = project.tended;
      tended.append(time);
      card.append(tended);
    }
    return card;
  }

  document.querySelectorAll(".leg").forEach((section) => {
    const holder = section.querySelector(".cards");
    if (!holder) return;
    const projects = (typeof PROJECTS !== "undefined" ? PROJECTS : []).filter((p) => p.section === section.id);
    const list = projects.length ? projects : [{
      title: "Uncharted",
      uncharted: true,
      description: "Nothing here yet. The route continues.",
      coords: section.querySelector(".leg-bearing")?.textContent.replace(/^\s*\d+\s*/, "") || "",
      elevation: "ELEV 0 m",
    }];
    list.forEach((project, i) => holder.append(buildCard(project, i)));
  });

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

  // Recolour the map whenever Day/Dusk changes
  document.addEventListener("fieldnotes:themechange", () => terrain.refreshColours());

  /* ---------------------------------------------------------
     5. THE BONSAI
     A small bonsai drifts slowly through the page's empty
     margins and gaps, bobbing like a leaf on still water.
     It never crosses text, cards, links or buttons: before
     each move it checks its whole path against them, and if
     the page shifts under it, it fades out and finds a clear
     spot. If there's no clear spot on screen (a narrow phone,
     say), it hides rather than cover anything.
     It pauses on hover, on focus, while the pop-up is open and
     when the tab is hidden. With reduced motion it sits still
     in a clear corner of the hero.
     Clicking it opens a small pop-up offering The Greenhouse.
     --------------------------------------------------------- */
  (() => {
    const tree = document.getElementById("bonsai");
    const dialog = document.getElementById("bonsai-dialog");
    if (!tree || !dialog || typeof dialog.showModal !== "function") return;

    const PAD = 14;          // breathing room kept around everything it avoids
    const EDGE = 8;          // distance kept from the window edges
    const AVOID = "main h1, main h2, main h3, main p, main a, main button, main li, main img, " +
      ".card, .hawk, .origin, .scale-bar, .margin-note, .colophon p, .colophon a";

    tree.hidden = false;
    let w = tree.offsetWidth, h = tree.offsetHeight;
    const pos = { x: 0, y: 0 };
    let leg = null;          // { from, to, start, duration }
    let restUntil = 0;       // pause between legs, in "drift time"
    let clock = 0;           // drift time: only runs while it's free to move
    let last = 0, raf = 0, checkedAt = -1e9;
    let hovered = false, focused = false, placed = false;
    let blocks = [];

    // Everything to stay clear of, in page coordinates
    function measure() {
      w = tree.offsetWidth; h = tree.offsetHeight;
      const sx = scrollX, sy = scrollY;
      blocks = [];
      document.querySelectorAll(AVOID).forEach((node) => {
        if (tree.contains(node) || dialog.contains(node)) return;
        const r = node.getBoundingClientRect();
        if (!r.width || !r.height) return;
        blocks.push({ l: r.left + sx - PAD, t: r.top + sy - PAD, r: r.right + sx + PAD, b: r.bottom + sy + PAD });
      });
    }
    const clearAt = (x, y) => !blocks.some((k) => x < k.r && x + w > k.l && y < k.b && y + h > k.t);
    function pathClear(a, b) {
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 6));
      for (let i = 1; i <= steps; i++) {
        if (!clearAt(a.x + ((b.x - a.x) * i) / steps, a.y + ((b.y - a.y) * i) / steps)) return false;
      }
      return true;
    }
    // The part of the page currently on screen, below the top bar
    function view() {
      const bar = parseFloat(getComputedStyle(root).getPropertyValue("--bar-h")) || 64;
      const docW = root.clientWidth, docH = root.scrollHeight;
      return {
        l: scrollX + EDGE, r: Math.min(scrollX + root.clientWidth, docW) - w - EDGE,
        t: scrollY + bar + EDGE, b: Math.min(scrollY + innerHeight, docH) - h - EDGE,
      };
    }
    const onScreen = (v) => pos.x >= v.l - w && pos.x <= v.r + w && pos.y >= v.t - h && pos.y <= v.b + h;

    // A clear spot on screen, preferring the side margins
    function findSpot(v, prefer) {
      const spots = [];
      for (let y = v.t; y <= v.b; y += 18) {
        for (let x = v.l; x <= v.r; x += 18) if (clearAt(x, y)) spots.push({ x, y });
      }
      if (!spots.length) return null;
      const score = prefer || ((p) => Math.min(p.x - v.l, v.r - p.x) + Math.random() * 60);
      return spots.reduce((best, p) => (score(p) < score(best) ? p : best));
    }
    // Somewhere new to drift to, along a clear path
    function pickTarget(v) {
      let best = null;
      for (let i = 0; i < 70; i++) {
        const p = { x: v.l + Math.random() * Math.max(0, v.r - v.l), y: v.t + Math.random() * Math.max(0, v.b - v.t) };
        const d = Math.hypot(p.x - pos.x, p.y - pos.y);
        if (d < 90 || !clearAt(p.x, p.y) || !pathClear(pos, p)) continue;
        if (!best || Math.abs(d - 320) < Math.abs(best.d - 320)) best = { x: p.x, y: p.y, d };
      }
      return best;
    }

    // About 35 seconds to cross the window, whatever its size
    const speed = () => Math.max(14, Math.min(40, root.clientWidth / 35));
    const ease = (t) => t * t * (3 - 2 * t);

    function draw(t) {
      const still = reducedMotion.matches;
      const bob = still ? 0 : Math.sin(t / 2600) * 3;
      const sway = still ? 0 : Math.sin(t / 4100) * 2.2;
      tree.style.transform = `translate(${pos.x.toFixed(1)}px, ${(pos.y + bob).toFixed(1)}px) rotate(${sway.toFixed(2)}deg)`;
      tree.classList.toggle("tag-left", pos.x - scrollX > root.clientWidth - w - 150);
    }
    function show(spot) {
      if (!spot) { tree.classList.remove("is-shown"); tree.style.visibility = "hidden"; return false; }
      tree.style.visibility = "";
      pos.x = spot.x; pos.y = spot.y;
      leg = null; restUntil = clock + 1500;
      draw(clock);
      tree.classList.add("is-shown");
      placed = true;
      return true;
    }
    // Fade out, then reappear somewhere clear on screen
    let moving = false;
    function relocate() {
      if (moving) return;
      moving = true;
      const wait = placed && tree.classList.contains("is-shown") ? 600 : 0;
      tree.classList.remove("is-shown");
      placed = false;
      setTimeout(() => { moving = false; measure(); show(findSpot(view())); }, wait);
    }

    // Reduced motion: one quiet spot in a clear corner of the hero
    function settle() {
      cancelAnimationFrame(raf); raf = 0;
      measure();
      const hero = document.querySelector(".hero").getBoundingClientRect();
      const v = { l: scrollX + EDGE, r: scrollX + root.clientWidth - w - EDGE, t: hero.top + scrollY + 80, b: hero.bottom + scrollY - h - EDGE };
      const corner = { x: v.r, y: v.b };
      show(findSpot(v, (p) => Math.hypot(p.x - corner.x, p.y - corner.y)) || findSpot(view()));
    }

    const paused = () => hovered || focused || dialog.open || document.hidden;

    function tick(now) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(100, now - (last || now));
      last = now;
      if (paused() || moving) return;
      clock += dt;

      // Every so often: re-measure, and make sure it's on screen and clear
      if (clock - checkedAt > 1200 || !placed) {
        checkedAt = clock;
        measure();
        const v = view();
        if (!placed || !onScreen(v) || (!leg && !clearAt(pos.x, pos.y))) { relocate(); return; }
        if (leg && !pathClear(pos, leg.to)) leg = null;
      }
      if (!placed) return;

      if (!leg && clock >= restUntil) {
        const to = pickTarget(view());
        if (to) leg = { from: { x: pos.x, y: pos.y }, to, start: clock, duration: (to.d / speed()) * 1000 };
        else restUntil = clock + 2000;
      }
      if (leg) {
        const k = Math.min(1, (clock - leg.start) / leg.duration);
        pos.x = leg.from.x + (leg.to.x - leg.from.x) * ease(k);
        pos.y = leg.from.y + (leg.to.y - leg.from.y) * ease(k);
        if (k >= 1) { leg = null; restUntil = clock + 2500 + Math.random() * 5000; }
      }
      draw(clock);
    }

    function begin() {
      if (reducedMotion.matches) { settle(); return; }
      if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
    }

    tree.addEventListener("pointerenter", () => (hovered = true));
    tree.addEventListener("pointerleave", () => (hovered = false));
    tree.addEventListener("focus", () => (focused = true));
    tree.addEventListener("blur", () => (focused = false));
    document.addEventListener("visibilitychange", () => { last = 0; });
    reducedMotion.addEventListener("change", () => { placed = false; begin(); });
    addEventListener("resize", () => { if (reducedMotion.matches) settle(); else placed = false; });
    if (reducedMotion.matches) addEventListener("scroll", () => { if (!tree.classList.contains("is-shown")) settle(); }, { passive: true });

    // The pop-up
    tree.addEventListener("click", () => dialog.showModal());
    dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });   // the backdrop
    dialog.addEventListener("close", () => tree.focus({ preventScroll: true }));

    // Start once the cards and fonts are in, so it measures the real layout
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    ready.then(() => setTimeout(begin, 1500));
  })();

  /* ---------------------------------------------------------
     6. THE FIELD GUIDE
     The compass in the top bar opens a field-guide page on
     navigation: three tabs, a compass diagram whose needle
     swings and settles each time it opens, and a latitude and
     longitude grid that reads out the position under your
     cursor or finger (or the arrow keys).
     --------------------------------------------------------- */
  (() => {
    const button = document.getElementById("compass");
    const guide = document.getElementById("guide");
    if (!button || !guide || typeof guide.showModal !== "function") return;
    const tabs = [...guide.querySelectorAll('[role="tab"]')];
    const needleG = document.getElementById("guide-needle");

    // Tick marks round the diagram's dial, every 10°
    const ticks = guide.querySelector(".gc-ticks");
    let t = "";
    for (let a = 0; a < 360; a += 10) {
      const major = a % 90 === 0, r1 = 84, r2 = major ? 74 : 79;
      const rad = (a * Math.PI) / 180;
      const p = (r) => `${(120 + Math.sin(rad) * r).toFixed(1)} ${(132 - Math.cos(rad) * r).toFixed(1)}`;
      const [x1, y1] = p(r1).split(" "), [x2, y2] = p(r2).split(" ");
      t += `<line${major ? ' class="major"' : ""} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    ticks.innerHTML = t;

    function swing() {
      if (reducedMotion.matches) return;
      needleG.classList.remove("is-swinging");
      void needleG.getBoundingClientRect();          // restart the animation
      needleG.classList.add("is-swinging");
    }

    function select(tab, focus) {
      tabs.forEach((x) => {
        const on = x === tab;
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
      if (tab.id === "gt-compass") swing();
      if (tab.id === "gt-coords") drawGrid();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const n = tabs.length;
        const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        select(tabs[to], true);
      });
    });

    button.addEventListener("click", () => {
      guide.showModal();
      tabs.find((x) => x.getAttribute("aria-selected") === "true").focus();
      swing();
    });
    guide.querySelector("[data-close]").addEventListener("click", () => guide.close());
    guide.addEventListener("click", (e) => { if (e.target === guide) guide.close(); });   // the backdrop
    guide.addEventListener("close", () => button.focus({ preventScroll: true }));
    guide.querySelector("[data-to-map]").addEventListener("click", () => {
      guide.close();
      document.getElementById("top").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    });

    /* ---- The latitude and longitude grid ----
       Plate carrée: x = longitude + 180, y = 90 − latitude, so one
       unit is one degree. A faint coastline (Natural Earth, via the
       world-atlas package) loads the first time the tab opens. */
    const grid = document.getElementById("guide-grid");
    const readout = document.getElementById("guide-grid-readout");
    const POINTS = [[35.1, 33.4], [40.4, -80.0]];
    let drawn = false, svg = null;
    const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`;
    function dms(v, pos, neg) {
      let a = Math.abs(v), d = Math.floor(a), m = Math.floor((a - d) * 60), sec = Math.round(((a - d) * 60 - m) * 60);
      if (sec === 60) { sec = 0; m += 1; } if (m === 60) { m = 0; d += 1; }
      return `${d}° ${m}′ ${sec}″ ${v >= 0 ? pos : neg}`;
    }
    const at = { lat: 0, lon: 0 };
    function show(lat, lon) {
      at.lat = Math.max(-90, Math.min(90, lat));
      at.lon = Math.max(-180, Math.min(180, lon));
      const c = svg.querySelector(".gg-cursor");
      c.style.opacity = 1;
      c.querySelector(".h").setAttribute("y1", 90 - at.lat); c.querySelector(".h").setAttribute("y2", 90 - at.lat);
      c.querySelector(".v").setAttribute("x1", at.lon + 180); c.querySelector(".v").setAttribute("x2", at.lon + 180);
      c.querySelector("circle").setAttribute("cx", at.lon + 180); c.querySelector("circle").setAttribute("cy", 90 - at.lat);
      readout.innerHTML = `${fmt(at.lat, "N", "S")} ${fmt(at.lon, "E", "W")}<small>${dms(at.lat, "N", "S")} · ${dms(at.lon, "E", "W")}</small>`;
    }
    function drawGrid() {
      if (drawn) return;
      drawn = true;
      let lines = "", labels = "";
      for (let lat = -60; lat <= 60; lat += 30) {
        lines += `<path class="gg-line${lat === 0 ? " gg-line--key" : ""}" d="M0 ${90 - lat}H360"/>`;
        if (lat) labels += `<text class="gg-label" x="3" y="${88 - lat}">${Math.abs(lat)}°${lat > 0 ? "N" : "S"}</text>`;
      }
      for (let lon = -150; lon <= 150; lon += 30) {
        lines += `<path class="gg-line${lon === 0 ? " gg-line--key" : ""}" d="M${lon + 180} 0V180"/>`;
        if (lon) labels += `<text class="gg-label" x="${lon + 181.5}" y="176">${Math.abs(lon)}°${lon > 0 ? "E" : "W"}</text>`;
      }
      labels += `<text class="gg-label gg-label--key" x="3" y="88">Equator 0°</text><text class="gg-label gg-label--key" x="181.5" y="8">Prime meridian 0°</text>`;
      const marks = POINTS.map(([lat, lon]) => {
        const x = lon + 180, y = 90 - lat;
        return `<g class="gg-mark"><path d="M${x - 4} ${y}h8M${x} ${y - 4}v8"/><text x="${x + 4}" y="${y - 4}">${fmt(lat, "N", "S")} ${fmt(lon, "E", "W")}</text></g>`;
      }).join("");
      grid.innerHTML = `<svg viewBox="0 0 360 180" aria-hidden="true" focusable="false">
        <g class="gg-landmass"></g>${lines}${labels}${marks}
        <g class="gg-cursor" style="opacity:0"><line class="h" x1="0" x2="360"/><line class="v" y1="0" y2="180"/><circle r="2.4"/></g>
      </svg>`;
      svg = grid.querySelector("svg");

      // Pointer or finger: read the position under it
      const move = (e) => {
        const r = svg.getBoundingClientRect();
        show(90 - ((e.clientY - r.top) / r.height) * 180, ((e.clientX - r.left) / r.width) * 360 - 180);
      };
      grid.addEventListener("pointermove", move);
      grid.addEventListener("pointerdown", (e) => { grid.setPointerCapture(e.pointerId); move(e); });
      // Keyboard: arrow keys move the marker 1° at a time (10° with Shift)
      grid.addEventListener("keydown", (e) => {
        const step = e.shiftKey ? 10 : 1;
        const d = { ArrowUp: [step, 0], ArrowDown: [-step, 0], ArrowLeft: [0, -step], ArrowRight: [0, step] }[e.key];
        if (!d) return;
        e.preventDefault();
        show(at.lat + d[0], at.lon + d[1]);
      });
      grid.addEventListener("focus", () => show(at.lat, at.lon));

      // The coastline, decoded from TopoJSON by hand (no library needed)
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json")
        .then((r) => r.json())
        .then((topo) => {
          const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
          const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => [(x += dx) * sx + tx, (y += dy) * sy + ty]); });
          const ring = (ids) => ids.flatMap((id, k) => {
            const a = id < 0 ? arcs[~id].slice().reverse() : arcs[id];
            return k ? a.slice(1) : a;
          });
          let d = "";
          topo.objects.land.geometries.forEach((g) => {
            const polys = g.type === "Polygon" ? [g.arcs] : g.type === "MultiPolygon" ? g.arcs : [];
            polys.forEach((poly) => poly.forEach((ids) => {
              // Keep rings that cross the 180° line in one piece, then draw a
              // copy shifted a full turn so both halves show
              let prev = null;
              const pts = ring(ids).map(([lon, lat]) => {
                if (prev !== null) while (lon - prev > 180) lon -= 360;
                if (prev !== null) while (prev - lon > 180) lon += 360;
                prev = lon;
                return [lon, lat];
              });
              const lons = pts.map((q) => q[0]);
              const shifts = [0];
              if (Math.max(...lons) > 180) shifts.push(-360);
              if (Math.min(...lons) < -180) shifts.push(360);
              shifts.forEach((sh) => {
                d += pts.map(([lon, lat], k) => `${k ? "L" : "M"}${(lon + sh + 180).toFixed(1)} ${(90 - lat).toFixed(1)}`).join("") + "Z";
              });
            }));
          });
          svg.querySelector(".gg-landmass").innerHTML = `<path class="gg-land" d="${d}"/>`;
        })
        .catch(() => {});                                 // the grid works without it
    }
  })();
})();
