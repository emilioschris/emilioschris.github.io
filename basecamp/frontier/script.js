/* =========================================================
   FRONTIER · script
   ---------------------------------------------------------
   The Day/Dusk switch comes from ../../shared/field-notes.js.

   1. Helpers and citations
   2. The edge of the map (scroll motion)
   3. Diagrams (one original drawing per technology)
   4. The overview: the hero, the metals, families, compare (#/)
   5. A technology page (#/fusion …)
   6. Routing
   ========================================================= */
(() => {
  "use strict";

  const F = window.FRONTIER;
  const C = window.CONNECTIONS || { links: [], places: {} };
  const main = document.getElementById("main");
  const reduced = FieldNotes.reducedMotion;
  const FAM = Object.fromEntries(F.families.map((f) => [f.id, f]));
  const TECH = Object.fromEntries(F.techs.map((t) => [t.id, t]));

  /* ---------------------------------------------------------
     1. HELPERS AND CITATIONS
     Sources are numbered in the order a page first cites them.
     --------------------------------------------------------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const niceDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  function citer() {
    const order = [];
    const cite = (ids = []) => ids.length ? `<sup class="fr-cite">${ids.map((id) => {
      if (!order.includes(id)) order.push(id);
      const n = order.indexOf(id) + 1;
      return `<a href="#src-${n}" aria-label="Source ${n}">${n}</a>`;
    }).join("")}</sup>` : "";
    const list = () => `<ol class="fr-sources">${order.map((id, i) => {
      const s = F.sources[id];
      return `<li id="src-${i + 1}"><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title)}</a> <span>${esc(s.publisher)}</span></li>`;
    }).join("")}</ol>`;
    return { cite, list };
  }

  /* ---------------------------------------------------------
     2. SCROLL MOTION
     As you scroll, the metal tiles in the hero drift apart
     at slightly different speeds.
     --------------------------------------------------------- */
  function onScroll() {
    const p = reduced.matches ? 0 : Math.min(1, window.scrollY / (window.innerHeight * 1.2));
    document.documentElement.style.setProperty("--fr-p", p.toFixed(3));
    if (bot) bot.setProgress(Math.min(1, window.scrollY / window.innerHeight));
    walls();
  }
  // the chrome walls appear once you've scrolled past the hero
  function walls() {
    const hero = document.querySelector(".fr-x");
    const past = hero ? hero.getBoundingClientRect().bottom < innerHeight * 0.5 : window.scrollY > 160;
    document.documentElement.classList.toggle("has-walls", past);
  }
  addEventListener("scroll", () => { walls(); requestAnimationFrame(onScroll); }, { passive: true });

  // The starfield in the hero: a few hundred faint stars that twinkle slowly
  let starsStop = null;
  function stars() {
    if (starsStop) starsStop();
    const cv = document.querySelector(".fr-stars");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(2, devicePixelRatio || 1);
    const box = cv.getBoundingClientRect();
    cv.width = box.width * dpr; cv.height = box.height * dpr;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const list = Array.from({ length: Math.round(box.width * box.height / 2600) }, () => ({
      x: rnd() * cv.width, y: rnd() * cv.height * 0.75, r: (rnd() * 1.1 + 0.2) * dpr, p: rnd() * 6.28, s: 0.4 + rnd() * 1.2,
    }));
    let raf = 0;
    const draw = (t) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const st of list) {
        const a = reduced.matches ? 0.6 : 0.35 + 0.35 * Math.sin(st.p + t / 1000 * st.s);
        ctx.globalAlpha = a;
        ctx.fillStyle = "#F2EBDD";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
      }
      if (!reduced.matches) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    starsStop = () => cancelAnimationFrame(raf);
  }
  addEventListener("resize", () => { if (document.querySelector(".fr-stars")) stars(); });

  /* The hero's data centre: endless rows of server racks receding
     to one point, cold blue light, blinking status LEDs, haze, and a
     single unblinking red glow far down the aisle. Drawn on a 2D
     canvas so it can shift a little with the pointer and the page. */
  let dcStop = null;
  function dataCentre() {
    if (dcStop) dcStop();
    const cv = document.querySelector(".fr-dc");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1, raf = 0, par = { x: 0, y: 0, tx: 0, ty: 0 };
    let seed = 17;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const leds = [];
    for (let i = 0; i < 900; i++) leds.push({ side: rnd() < 0.5 ? -1 : 1, z: 0.4 + rnd() * 40, u: rnd(), v: rnd(), c: rnd() < 0.82 ? "#7FD0FF" : rnd() < 0.5 ? "#7CFFB2" : "#FFC66B", s: 0.5 + rnd() * 2.5, p: rnd() * 6.28 });
    function size() {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
    }
    function draw(t) {
      par.x += (par.tx - par.x) * 0.05; par.y += (par.ty - par.y) * 0.05;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const vx = W / 2 + par.x * 30, vy = H * 0.34 + par.y * 18;
      const f = Math.min(W, H * 1.6) * 0.42;
      const P = (X, Y, z) => [vx + (X * f) / z, vy + (Y * f) / z];
      // the dark room
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#03060B"); bg.addColorStop(0.5, "#071425"); bg.addColorStop(1, "#02050A");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // floor and ceiling light strips converging on the aisle's end
      const strip = (X, Y, a) => { ctx.strokeStyle = `rgba(120,190,255,${a})`; ctx.lineWidth = 2; ctx.beginPath(); const [x1, y1] = P(X, Y, 1); const [x2, y2] = P(X, Y, 60); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
      [-0.55, 0, 0.55].forEach((X) => strip(X, -1.5, 0.35));
      [-0.6, 0.6].forEach((X) => strip(X, 1.25, 0.18));
      // racks: far to near, both sides of the aisle
      for (let z = 42; z >= 0.4; z -= 1.35) {
        const z2 = z - 1.2;
        if (z2 < 0.25) continue;
        for (const side of [-1, 1]) {
          const X = side * 1.05;
          const [ax, ay] = P(X, -1.45, z), [bx, by] = P(X, -1.45, z2), [cx, cy] = P(X, 1.2, z2), [dx, dy] = P(X, 1.2, z);
          const shade = Math.max(0, Math.min(1, 1 - z / 42));
          ctx.fillStyle = `rgb(${12 + shade * 26},${22 + shade * 44},${38 + shade * 68})`;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.lineTo(dx, dy); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = `rgba(130,190,250,${0.14 + shade * 0.4})`; ctx.lineWidth = 1; ctx.stroke();
          // server slots
          ctx.strokeStyle = `rgba(0,0,0,${0.35 + shade * 0.3})`;
          for (let k = 1; k < 12; k++) {
            const yy = -1.45 + (2.65 * k) / 12;
            const [p1x, p1y] = P(X, yy, z), [p2x, p2y] = P(X, yy, z2);
            ctx.beginPath(); ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y); ctx.stroke();
          }
        }
      }
      // status LEDs, blinking at their own pace
      for (const l of leds) {
        const zz = l.z + l.u * 1.2 * 0;
        const [x, y] = P(l.side * 1.04, -1.4 + l.v * 2.55, l.z);
        const on = reduced.matches ? 0.8 : 0.45 + 0.55 * Math.max(0, Math.sin(l.p + t / 1000 * l.s * 2));
        const r = Math.max(0.7, 3 / Math.sqrt(zz));
        ctx.globalAlpha = on * Math.min(1, 8 / l.z + 0.3);
        ctx.fillStyle = l.c; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // haze down the aisle
      const hz = ctx.createRadialGradient(vx, vy, 0, vx, vy, Math.max(W, H) * 0.6);
      hz.addColorStop(0, "rgba(90,150,220,0.35)"); hz.addColorStop(0.35, "rgba(40,90,160,0.12)"); hz.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H);
      // the single red glow, far away and unblinking
      const rg = ctx.createRadialGradient(vx, vy + 4, 0, vx, vy + 4, Math.min(W, H) * 0.3);
      rg.addColorStop(0, "rgba(255,70,50,0.95)"); rg.addColorStop(0.08, "rgba(255,40,30,0.6)"); rg.addColorStop(0.4, "rgba(170,20,20,0.15)"); rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
      if (!reduced.matches) raf = requestAnimationFrame(draw);
    }
    size(); draw(performance.now());
    const onMove = (e) => { par.tx = (e.clientX / innerWidth - 0.5) * 2; par.ty = (e.clientY / innerHeight - 0.5) * 2; };
    addEventListener("pointermove", onMove, { passive: true });
    const ro = new ResizeObserver(() => { size(); cancelAnimationFrame(raf); draw(performance.now()); });
    ro.observe(cv);
    dcStop = () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); ro.disconnect(); };
  }

  // robot.js is loaded on demand, so it carries this file's ?v= tag
  // (otherwise browsers keep an old copy after an update)
  const VERSION = (document.currentScript && new URL(document.currentScript.src).search) || "";
  // The robot: Three.js, loaded only when the hero is shown
  let bot = null;
  function robot() {
    const cv = document.getElementById("fr-bot");
    if (!cv) return;
    const hero = document.querySelector(".fr-x");
    const go = () => import(`./robot.js${VERSION}`).then((m) => {
      bot = m.start(cv, { onReady: () => hero.classList.add("has-bot") });
      onScroll();
    }).catch(() => hero.classList.add("no-bot"));
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1200 }); else setTimeout(go, 300);
  }

  /* ---------------------------------------------------------
     3. DIAGRAMS
     --------------------------------------------------------- */
  const nucleus = (x, y, protons, neutrons, label) => {
    const balls = [];
    const n = protons + neutrons;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.4, r = n > 1 ? 7 : 0;
      balls.push(`<circle class="${i < protons ? "dg-p" : "dg-n"}" cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="7"/>`);
    }
    return `<g>${balls.join("")}<text class="dg-label" x="${x}" y="${y + 30}">${label}</text></g>`;
  };
  const DIAGRAMS = {
    fusion: () => `<svg class="fr-diagram" viewBox="0 0 640 300" role="img" aria-labelledby="dg-t dg-d">
      <title id="dg-t">How fusion works</title>
      <desc id="dg-d">Left: a deuterium nucleus and a tritium nucleus fuse into a helium nucleus and a fast neutron. Right: a tokamak seen from above, a ring of plasma held by magnet coils, inside a lithium blanket that catches the neutrons.</desc>
      <g class="dg-react">
        <text class="dg-head" x="150" y="28">The reaction</text>
        ${nucleus(60, 110, 1, 1, "Deuterium")}
        <text class="dg-op" x="104" y="116">+</text>
        ${nucleus(148, 110, 1, 2, "Tritium")}
        <path class="dg-arrow" d="M70 160 Q110 200 150 200 T 230 160" />
        <path class="dg-flash" d="M150 200 l-10 -16 l9 4 l-3 -14 l14 20 l-9 -4 z"/>
        ${nucleus(100, 250, 2, 2, "Helium")}
        <g class="dg-neutron"><circle class="dg-n" cx="220" cy="240" r="7"/><path class="dg-speed" d="M232 240h34M228 232h26M228 248h26"/><text class="dg-label" x="235" y="270">Fast neutron</text></g>
        <text class="dg-note" x="20" y="292">Most of the energy leaves with the neutron.</text>
      </g>
      <g class="dg-tok" transform="translate(470 160)">
        <text class="dg-head" x="0" y="-132">A tokamak, from above</text>
        <circle class="dg-blanket" r="112"/>
        <circle class="dg-wall" r="96"/>
        <circle class="dg-plasma" r="70"/>
        <circle class="dg-hole" r="44"/>
        <g class="dg-coils">${Array.from({ length: 12 }, (_, i) => `<rect x="-6" y="-104" width="12" height="40" rx="3" transform="rotate(${i * 30})"/>`).join("")}</g>
        <circle class="dg-solenoid" r="20"/>
        <text class="dg-tag" x="0" y="4">magnet</text>
        <text class="dg-tag dg-tag--hot" x="0" y="-55">plasma</text>
        <text class="dg-tag dg-tag--blanket" x="0" y="128">lithium blanket</text>
      </g>
    </svg>`,
    crispr: () => {
      const helix = (y, cls) => { let d = ""; for (let x = 20; x <= 330; x += 4) d += `${x === 20 ? "M" : "L"}${x} ${(y + Math.sin(x / 18) * 10).toFixed(1)} `; return `<path d="${d}" style="fill:none;stroke:${cls};stroke-width:2.2"/>`; };
      const rungs = Array.from({ length: 26 }, (_, k) => { const x = 24 + k * 12; return `<path d="M${x} ${(118 + Math.sin(x / 18) * 10).toFixed(1)} L${x} ${(150 - Math.sin(x / 18) * 10).toFixed(1)}" style="stroke:var(--rule);stroke-width:1.5"/>`; }).join("");
      const letters = (y, seq, hi = -1, hiCls = "") => [...seq].map((c, k) => `<g transform="translate(${385 + k * 19} ${y})"><rect width="16" height="18" rx="3" style="fill:${k === hi ? hiCls : "var(--bg-raised)"};stroke:var(--text);stroke-width:1"/><text class="dg-tag" x="8" y="9.5" style="fill:var(--text)">${c}</text></g>`).join("");
      return `<svg class="fr-diagram" viewBox="0 0 640 300" role="img" aria-labelledby="dg-t dg-d">
      <title id="dg-t">How CRISPR gene editing works</title>
      <desc id="dg-d">Left: a strand of DNA with the Cas9 protein sitting on it. A guide RNA inside Cas9 matches one stretch of the DNA, and Cas9 cuts both strands there. Right: three kinds of change: a cut, which the cell repairs in a way that usually switches the gene off; a base edit, which changes one DNA letter without a full cut; and a prime edit, which writes a short new sequence. Underneath: the editor can be used on cells taken out of the body and put back, or sent into the body in tiny fat bubbles that reach the liver.</desc>
      <text class="dg-head" x="175" y="28">Cas9 finds and cuts</text>
      ${rungs}${helix(118, "var(--link)")}${helix(150, "var(--secondary)")}
      <path d="M120 104 C 112 66 170 52 205 62 C 246 74 250 118 236 162 C 226 192 150 192 130 168 C 114 150 126 128 120 104 Z" style="fill:color-mix(in srgb, var(--tone) 22%, var(--bg));stroke:var(--tone);stroke-width:2;opacity:.95"/>
      <path d="M140 132 h 70" style="stroke:var(--accent);stroke-width:4;stroke-linecap:round"/>
      <path d="M178 112 l 8 12 l -8 12 M190 112 l -8 12 l 8 12" style="fill:none;stroke:var(--text);stroke-width:1.8"/>
      <text class="dg-tag" x="200" y="78" style="fill:var(--text)">Cas9 protein</text>
      <text class="dg-tag dg-tag--hot" x="120" y="214" style="text-anchor:start">guide RNA: matches the target</text>
      <path d="M150 208 L 160 138" style="stroke:var(--muted);stroke-width:1"/>
      <text class="dg-tag" x="262" y="92" style="text-anchor:start">cuts both strands</text><path d="M260 94 L 192 118" style="stroke:var(--muted);stroke-width:1"/>
      <text class="dg-label" x="175" y="250">DNA</text>
      <text class="dg-head" x="480" y="28">Three kinds of edit</text>
      <text class="dg-label" x="385" y="58" style="text-anchor:start">Cut: the repair switches the gene off</text>
      ${letters(66, "GATTA")}<path d="M482 66 l6 9 l-6 9" style="fill:none;stroke:var(--accent);stroke-width:2"/>${[...("CAGT")].map((c, k) => `<g transform="translate(${494 + k * 19} 66)"><rect width="16" height="18" rx="3" style="fill:var(--bg-raised);stroke:var(--text);stroke-width:1"/><text class="dg-tag" x="8" y="9.5" style="fill:var(--text)">${c}</text></g>`).join("")}
      <text class="dg-label" x="385" y="116" style="text-anchor:start">Base edit: change one letter</text>
      ${letters(124, "GATTACAGT", 4, "color-mix(in srgb, var(--tone) 55%, var(--bg))")}
      <text class="dg-label" x="385" y="174" style="text-anchor:start">Prime edit: write a short new piece</text>
      ${letters(182, "GATT")}<g transform="translate(461 179)"><rect width="54" height="24" rx="4" style="fill:color-mix(in srgb, var(--accent) 25%, var(--bg));stroke:var(--accent);stroke-width:1.5"/><text class="dg-tag" x="27" y="12" style="fill:var(--text)">new</text></g>${[...("CAGT")].map((c, k) => `<g transform="translate(${520 + k * 19} 182)"><rect width="16" height="18" rx="3" style="fill:var(--bg-raised);stroke:var(--text);stroke-width:1"/><text class="dg-tag" x="8" y="9.5" style="fill:var(--text)">${c}</text></g>`).join("")}
      <text class="dg-note" x="385" y="240">Delivery: edit cells outside the body</text>
      <text class="dg-note" x="385" y="255">and put them back (Casgevy), or send</text>
      <text class="dg-note" x="385" y="270">the editor in tiny fat bubbles that</text>
      <text class="dg-note" x="385" y="285">reach the liver.</text>
    </svg>`;
    },
    "humanoid-robots": () => {
      const joint = (x, y) => `<circle cx="${x}" cy="${y}" r="5.5" style="fill:var(--bg);stroke:var(--link);stroke-width:2"/>`;
      const call = (x1, y1, x2, y2, label, anchor = "start") => `<path d="M${x1} ${y1} L${x2} ${y2}" style="stroke:var(--muted);stroke-width:1;fill:none"/><text class="dg-tag" x="${x2 + (anchor === "start" ? 4 : -4)}" y="${y2}" style="text-anchor:${anchor}">${label}</text>`;
      const node = (x, y, word, sub) => `<g><circle cx="${x}" cy="${y}" r="30" style="fill:var(--bg-raised);stroke:var(--tone);stroke-width:2"/><text class="dg-label" x="${x}" y="${y - 3}" style="fill:var(--text)">${word}</text><text class="dg-tag" x="${x}" y="${y + 11}">${sub}</text></g>`;
      return `<svg class="fr-diagram" viewBox="0 0 640 300" role="img" aria-labelledby="dg-t dg-d">
      <title id="dg-t">How a humanoid robot works</title>
      <desc id="dg-d">Left: a generic humanoid robot seen from the front, with labels: cameras in the head, an AI computer and battery in the torso, a balance sensor, electric actuators at every joint, touch sensors in the fingertips and force sensors in the feet. Right: the loop it runs many times a second: see with cameras, decide with an AI model, move with actuators, feel through force and balance sensors, and see again.</desc>
      <text class="dg-head" x="150" y="28">The body</text>
      <g style="fill:var(--bg-raised);stroke:var(--text);stroke-width:1.4">
        <rect x="132" y="44" width="36" height="40" rx="14"/>
        <path d="M118 96 h64 l-6 74 h-52 Z"/>
        <rect x="128" y="172" width="44" height="18" rx="5"/>
        <path d="M118 100 l-26 52 l-6 46" style="fill:none;stroke-width:9;stroke-linecap:round;stroke:var(--text)"/>
        <path d="M182 100 l26 52 l6 46" style="fill:none;stroke-width:9;stroke-linecap:round;stroke:var(--text)"/>
        <path d="M138 192 l-6 46 l-2 40" style="fill:none;stroke-width:11;stroke-linecap:round;stroke:var(--text)"/>
        <path d="M162 192 l6 46 l2 40" style="fill:none;stroke-width:11;stroke-linecap:round;stroke:var(--text)"/>
      </g>
      <rect x="138" y="58" width="24" height="9" rx="4" style="fill:var(--tone)"/>
      <rect x="136" y="112" width="28" height="18" rx="3" class="dg-p"/><rect x="138" y="138" width="24" height="22" rx="3" style="fill:color-mix(in srgb, var(--secondary) 55%, var(--bg))"/>
      <path d="M118 282 h24 M158 282 h24" style="stroke:var(--text);stroke-width:5;stroke-linecap:round"/>
      ${joint(118, 100)}${joint(182, 100)}${joint(92, 152)}${joint(208, 152)}${joint(138, 192)}${joint(162, 192)}${joint(132, 238)}${joint(168, 238)}${joint(150, 90)}
      <circle cx="86" cy="202" r="4" style="fill:var(--tone)"/><circle cx="214" cy="202" r="4" style="fill:var(--tone)"/>
      ${call(162, 62, 214, 50, "cameras")}
      ${call(164, 120, 236, 98, "AI computer")}
      ${call(162, 150, 236, 124, "battery")}
      ${call(208, 152, 250, 158, "actuator (every joint)")}
      ${call(214, 202, 248, 210, "touch sensors")}
      ${call(150, 182, 250, 236, "balance sensor")}
      ${call(178, 282, 250, 276, "force sensors (feet)")}
      <text class="dg-head" x="490" y="28">The loop</text>
      <path class="dg-arrow" d="M455 78 Q 490 60 525 78"/><path class="dg-arrow" d="M560 112 Q 578 150 560 188"/><path class="dg-arrow" d="M525 222 Q 490 240 455 222"/><path class="dg-arrow" d="M420 188 Q 402 150 420 112"/>
      ${node(425, 92, "See", "cameras")}${node(555, 92, "Decide", "AI model")}${node(555, 208, "Move", "motors")}${node(425, 208, "Feel", "sensors")}
      <text class="dg-note" x="380" y="276">Many times a second. In many demos, a remote</text>
      <text class="dg-note" x="380" y="291">human operator still does the deciding.</text>
    </svg>`;
    },
    "vertical-farming": () => {
      const tier = (ty) => `
        <polygon points="50,${ty + 5} 240,${ty + 5} 250,${ty + 40} 40,${ty + 40}" style="fill:var(--tone);opacity:.1"/>
        <rect class="dg-p" x="50" y="${ty}" width="190" height="5" rx="2"/>
        ${Array.from({ length: 6 }, (_, k) => { const x = 66 + k * 32; return `<path d="M${x} ${ty + 42} q -12 -6 -9 -16 q 7 1 9 9 q 2 -12 10 -15 q 4 11 -10 22 Z" style="fill:var(--secondary)"/><path d="M${x} ${ty + 50} v8 M${x - 3} ${ty + 50} l-3 7 M${x + 3} ${ty + 50} l3 7" style="stroke:var(--secondary);stroke-width:1;fill:none"/>`; }).join("")}
        <rect x="46" y="${ty + 42}" width="198" height="8" rx="2" style="fill:color-mix(in srgb, var(--link) 35%, var(--bg));stroke:var(--link);stroke-width:1"/>
        <rect class="dg-wall" x="40" y="${ty + 60}" width="210" height="4"/>`;
      const row = (y, label, a, b, av, bv) => `
        <text class="dg-label" x="390" y="${y}" style="text-anchor:start">${label}</text>
        <rect x="390" y="${y + 7}" width="${Math.max(2, a)}" height="9" rx="2" style="fill:var(--secondary)"/><text class="dg-tag" x="${394 + Math.max(2, a)}" y="${y + 12}" style="text-anchor:start">field ${av}</text>
        <rect x="390" y="${y + 20}" width="${Math.max(2, b)}" height="9" rx="2" class="dg-p"/><text class="dg-tag" x="${394 + Math.max(2, b)}" y="${y + 25}" style="text-anchor:start">indoor ${bv}</text>`;
      return `<svg class="fr-diagram" viewBox="0 0 640 300" role="img" aria-labelledby="dg-t dg-d">
      <title id="dg-t">How a vertical farm works</title>
      <desc id="dg-d">Left: a rack seen from the side, with three layers of plants. Each layer has an LED light above it, and the plants' bare roots hang into a channel of flowing nutrient solution; a pump returns the solution from a tank at the bottom to the top layer, so the water goes round in a loop. Right: lettuce per kilogram in a modelling study for Arizona: a field uses about 250 litres of water and an indoor hydroponic farm about 20; a field yields 3.9 kilograms per square metre a year and the indoor farm 41; the indoor farm uses about 82 times the energy.</desc>
      <text class="dg-head" x="150" y="28">A vertical farm, side on</text>
      <rect class="dg-wall" x="36" y="46" width="4" height="226"/><rect class="dg-wall" x="250" y="46" width="4" height="226"/>
      ${tier(52)}${tier(122)}${tier(192)}
      <rect x="262" y="258" width="58" height="26" rx="4" style="fill:color-mix(in srgb, var(--link) 25%, var(--bg));stroke:var(--link);stroke-width:1.5"/>
      <text class="dg-tag" x="291" y="272">tank</text>
      <path class="dg-arrow" d="M244 98 H 300 V 254"/><path class="dg-arrow" d="M244 168 H 300"/><path class="dg-arrow" d="M244 238 H 300"/>
      <path class="dg-arrow" d="M262 278 H 22 V 96 H 40"/>
      <circle cx="22" cy="190" r="9" style="fill:var(--bg);stroke:var(--link);stroke-width:1.5"/><text class="dg-tag" x="22" y="190">P</text>
      <text class="dg-tag dg-tag--hot" x="145" y="45">LED light</text>
      <text class="dg-tag" x="145" y="290">nutrient solution goes round in a loop</text>
      <text class="dg-head" x="505" y="28">Lettuce, per kilogram</text>
      ${row(62, "Water per kg", 150, 12, "≈250 L", "≈20 L")}
      ${row(128, "Yield per m² a year", 14, 150, "3.9 kg", "41 kg")}
      ${row(194, "Energy per kg", 2, 150, "1×", "≈82×")}
      <text class="dg-note" x="390" y="262">A modelling study for Yuma, Arizona</text>
      <text class="dg-note" x="390" y="278">(Barbosa et al., 2015).</text>
    </svg>`;
    },
  };

  /* ---------------------------------------------------------
     4. THE OVERVIEW
     --------------------------------------------------------- */
  const famChip = (f) => `<span class="fr-fam fr-fam--${f.tone}">${esc(f.name)}</span>`;
  const charted = () => F.techs.filter((t) => t.status === "charted");

  function compareBlock(selected) {
    const picks = F.techs.map((t) => {
      const on = selected.includes(t.id), off = t.status !== "charted";
      return `<label class="fr-pick${off ? " is-off" : ""}">
        <input type="checkbox" value="${t.id}" ${on ? "checked" : ""} ${off ? "disabled" : ""}>
        <span>${esc(t.name)}${off ? " <em>coming</em>" : ""}</span>
      </label>`;
    }).join("");
    const cols = selected.map((id) => TECH[id]).filter(Boolean);
    const rows = [["Family", (t) => esc(FAM[t.family].name)], ["Readiness", (t) => esc(t.compare.readiness)], ["Where it stands", (t) => esc(t.compare.timeline)],
      ["Main cost or barrier", (t) => esc(t.compare.barrier)], ["Potential impact", (t) => esc(t.compare.impact)], ["Biggest debate", (t) => esc(t.compare.debate)]];
    const table = cols.length
      ? `<div class="fr-compare-table" style="--cols:${cols.length}">
          <div class="fr-ct-head"></div>${cols.map((t) => `<div class="fr-ct-head fr-tone--${FAM[t.family].tone}"><a href="#/${t.id}">${esc(t.name)}</a></div>`).join("")}
          ${rows.map(([label, fn]) => `<div class="fr-ct-label">${label}</div>${cols.map((t) => `<div class="fr-ct-cell" data-label="${label}">${fn(t)}</div>`).join("")}`).join("")}
        </div>`
      : "";
    const note = charted().length < 2
      ? `<p class="fr-compare-note">Only one technology is charted so far, so there's nothing to set beside it yet. The others will join as they're written.</p>` : "";
    return `<fieldset class="fr-picks"><legend>Choose up to three</legend>${picks}</fieldset>${note}${table}`;
  }

  // The metals of the energy transition: a tile for each metal; each
  // opens its own path from mine to machine, and its demand in 2025
  // against the IEA's projection for 2040. All panels are drawn at once
  // (so the source numbers stay fixed) and the tiles switch between them.
  const STAGE_ICON = {
    mine: '<path d="M4 20h16M6 20l4-9 3 5 2-3 3 7"/><path d="M15 6l3-3M16 3l2 2"/>',
    refine: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
    make: '<path d="M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4Z"/><path d="M6 7h4M14 7h4"/>',
    build: '<circle cx="12" cy="12" r="3"/><path d="M12 9V3M12 15v6M9 12H3M15 12h6"/><path d="M8 8 5.5 5.5M16 16l2.5 2.5"/>',
  };
  // kt (thousand tonnes) in words: 275 -> "275,000 tonnes", 27775 -> "27.8 million tonnes"
  const tonnes = (kt) => kt >= 1000 ? `${(kt / 1000).toFixed(kt >= 10000 ? 1 : 2).replace(/\.?0+$/, "")} million tonnes` : `${(kt * 1000).toLocaleString("en-GB")} tonnes`;
  const pct = (a, b) => Math.round((a / b) * 100);
  const growth = ([a, b]) => b / a >= 2 ? `×${(b / a).toFixed(1)}` : `+${Math.round((b / a - 1) * 100)}%`;
  function metalsBlock(cite) {
    const M = F.minerals;
    const src = cite(M.sources);
    const share = (who, n, label) => `<span class="fr-share" role="img" aria-label="${esc(who)}: ${n}%"><span class="fr-share-bar"><span style="width:${n}%"></span></span><span class="fr-share-num">${esc(who)} ${esc(label || n + "%")}</span></span>`;
    const step = (id, i, title, detail, extra = "") => `<li class="fr-step" style="--i:${i}">
        <span class="fr-step-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${STAGE_ICON[id]}</svg></span>
        <span class="fr-step-body"><b>${title}</b><span class="fr-step-detail">${detail}</span>${extra}</span>
      </li>`;
    const panel = (m, k) => {
      const [d0, d1] = m.demand, max = Math.max(d0, d1);
      const mineShare = pct(m.mine.kt, m.mine.world), refShare = pct(m.refine.kt, m.refine.world);
      return `<div class="fr-metal-panel fr-tone--${m.tone}" id="metal-${m.id}" role="tabpanel" aria-labelledby="tab-${m.id}" ${k ? "hidden" : ""}>
        <div class="fr-metal-need">
          <p class="fr-metal-name"><span class="fr-metal-sym">${esc(m.symbol)}</span>${esc(m.name)}</p>
          <p class="fr-metal-use">${esc(m.use)}</p>
          <p class="fr-metal-k">How much the world uses in a year${m.unit ? `, ${esc(m.unit)}` : ""}</p>
          <div class="fr-need-bars">
            <p class="fr-need"><span class="fr-need-year">2025</span><span class="fr-need-bar"><span style="width:${(d0 / max) * 100}%"></span></span><span class="fr-need-val">${tonnes(d0)}</span></p>
            <p class="fr-need is-proj"><span class="fr-need-year">2040<em>projected</em></span><span class="fr-need-bar"><span style="width:${(d1 / max) * 100}%"></span></span><span class="fr-need-val">${tonnes(d1)}</span></p>
          </div>
          <p class="fr-need-growth"><b>${growth(m.demand)}</b> by 2040 in the IEA's projection${src}</p>
          <p class="fr-need-clean">Clean energy's share of that demand: <b>${m.clean[0]}%</b> in 2025, <b>${m.clean[1]}%</b> projected for 2040.</p>
          <p class="fr-metal-fact">${esc(m.fact)}${src}</p>
        </div>
        <ol class="fr-chain-steps" aria-label="${esc(m.name)}: from the ground to the machine">
          ${step("mine", 0, "Mine", `${esc(tonnes(m.mine.world))} ${m.mine.what ? esc("of " + m.mine.what) + " " : ""}mined in 2025.${src}`, share(m.mine.top, mineShare))}
          ${step("refine", 1, "Refine", `Purified${m.refine.what ? " " + esc(m.refine.what) : ""}: ${esc(tonnes(m.refine.world))} in 2025.${src}`, share(m.refine.top, refShare))}
          ${step("make", 2, "Make", `${esc(m.make.what)}.${m.make.sources ? cite(m.make.sources) : ""}`, m.make.share ? share(m.make.top, m.make.share, m.make.shareLabel) : "")}
          ${step("build", 3, "Build the future", `${esc(m.build)}.`)}
        </ol>
      </div>`;
    };
    return `<section class="fr-chain fr-metals" aria-labelledby="chain-title">
      <h2 class="fr-chain-title" id="chain-title">${esc(M.title)}</h2>
      <p class="fr-chain-intro">${esc(M.intro)}</p>
      <div class="fr-metal-tiles" role="tablist" aria-label="Metals">
        ${M.metals.map((m, k) => `<button type="button" class="fr-metal-tile fr-tone--${m.tone}" role="tab" id="tab-${m.id}" aria-controls="metal-${m.id}" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}" data-metal="${m.id}">
          <span class="fr-tile-num">${m.number}</span><span class="fr-tile-sym">${esc(m.symbol)}</span><span class="fr-tile-name">${esc(m.name)}</span><span class="fr-tile-growth">${growth(m.demand)} <small>by 2040</small></span>
        </button>`).join("")}
      </div>
      ${M.metals.map(panel).join("")}
      <p class="fr-chain-note"><b>A projection, not a fact.</b> ${esc(M.projection)}${src}</p>
    </section>`;
  }
  function pickMetal(btn, focus) {
    const tiles = [...document.querySelectorAll(".fr-metal-tile")];
    tiles.forEach((t) => { const on = t === btn; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; document.getElementById(t.getAttribute("aria-controls")).hidden = !on; });
    if (focus) btn.focus();
  }
  main.addEventListener("click", (e) => { const b = e.target.closest(".fr-metal-tile"); if (b) pickMetal(b); });
  main.addEventListener("keydown", (e) => {
    const b = e.target.closest(".fr-metal-tile"); if (!b) return;
    const tiles = [...document.querySelectorAll(".fr-metal-tile")], i = tiles.indexOf(b);
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tiles.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault(); pickMetal(tiles[(to + tiles.length) % tiles.length], true);
  });

  function overview() {
    document.title = "Frontier · Field Notes";
    const { cite, list } = citer();
    return `
      <section class="fr-x" aria-labelledby="fr-title">
        <canvas class="fr-dc" aria-hidden="true"></canvas>
        <div class="fr-x-shade" aria-hidden="true"></div>
        <p class="fr-brand"><img src="../../favicon.svg" alt="" width="26" height="26"><span>Frontier</span></p>
        <div class="fr-words">
          <h1 class="fr-word fr-word--back" id="fr-title" aria-label="Frontier"><span>F</span><span>R</span><span>O</span><span>N</span><span class="fr-brk"></span><span>T</span><span>I</span><span>E</span><span>R</span></h1>
          <div class="fr-bot" aria-hidden="true"><canvas id="fr-bot"></canvas></div>
          <p class="fr-word fr-word--front" aria-hidden="true"><span class="is-back">F</span><span class="is-back">R</span><span class="is-back">O</span><span class="is-back">N</span><span class="fr-brk"></span><span class="is-front">T</span><span class="is-back">I</span><span class="is-back">E</span><span class="is-back">R</span></p>
        </div>
        <p class="fr-x-tag">Breakthrough technologies, explained, compared and argued over</p>
        <p class="fr-x-scroll" aria-hidden="true">Scroll <span>↓</span></p>
      </section>

      <section class="fr-hero fr-wrap" aria-label="The edge">
        <p class="fr-eyebrow">Base Camp · Breakthrough technologies</p>
        <div class="fr-space" aria-hidden="true">
          <img class="fr-space-img" src="img/space-colony.webp" alt="" width="2400" height="1891" fetchpriority="high">
          <canvas class="fr-stars"></canvas>
          <span class="fr-ring"></span>
        </div>
        <p class="fr-telemetry" aria-hidden="true"><span>Mission log</span><span>Sector 01 · The edge</span><span class="fr-blink">● Signal</span></p>
        ${metalsBlock(cite)}
      </section>

      <section class="fr-section fr-wrap" aria-labelledby="fam-title">
        <p class="fr-eyebrow">Four families</p>
        <h2 class="fr-h2" id="fam-title">On the edge of the map</h2>
        <p class="fr-intro">Four families of technology. Open a charted dossier to see how it works, how close it is, who pays and who argues about it.</p>
        <div class="fr-families">
          ${F.families.map((f, fi) => {
            const techs = F.techs.filter((t) => t.family === f.id);
            const lead = techs[0];
            const done = techs.filter((t) => t.status === "charted").length;
            return `<article class="fr-dossier fr-tone--${f.tone}" style="--fi:${fi}">
              <div class="fr-dossier-media">
                ${lead && lead.photo ? `<img src="${esc(lead.photo.src)}" alt="" loading="lazy" style="object-position:${esc(lead.photo.focus || "50% 50%")}">` : ""}
                <span class="fr-dossier-index">0${fi + 1} / 0${F.families.length}</span>
              </div>
              <div class="fr-dossier-body">
                <h3 class="fr-dossier-family">${esc(f.name)}</h3>
                <p class="fr-dossier-q">${esc(f.question)}</p>
                <ul class="fr-dossier-techs">${techs.map((t) => t.status === "charted" ? `<li>
                  <a class="fr-dtech" href="#/${t.id}">
                    <span class="fr-dtech-name">${esc(t.name)}</span>
                    <span class="fr-dtech-line">${esc(t.tagline)}</span>
                    <span class="fr-dtech-stats">
                      <span class="fr-mini-trl" role="img" aria-label="Readiness ${t.readiness.level} of 9">${Array.from({ length: 9 }, (_, k) => `<i class="${k < t.readiness.level ? "on" : ""}"></i>`).join("")}</span>
                      <span class="fr-dtech-trl">TRL ${t.readiness.level}/9</span>
                      ${t.metrics && t.metrics[0] ? `<span class="fr-dtech-metric"><b>${esc(t.metrics[0].value)}</b> ${esc(t.metrics[0].label.split(",")[0])}</span>` : ""}
                    </span>
                    <span class="fr-dtech-open">Open dossier <span aria-hidden="true">→</span></span>
                  </a></li>` : `<li>
                  <span class="fr-dtech is-uncharted">
                    <span class="fr-dtech-name">${esc(t.name)}</span>
                    <span class="fr-dtech-line">${esc(t.tagline)}</span>
                    <span class="fr-dtech-stats"><span class="fr-mini-trl is-unknown" aria-hidden="true">${"<i></i>".repeat(9)}</span><span class="fr-dtech-trl">Coordinates unknown</span></span>
                    <span class="fr-stamp">Uncharted · charting next</span>
                  </span></li>`).join("")}</ul>
                <p class="fr-dossier-count">${done} of ${techs.length} charted</p>
              </div>
            </article>`;
          }).join("")}
      </section>

      <section class="fr-section fr-wrap" id="compare" aria-labelledby="cmp-title">
        <p class="fr-eyebrow">Side by side</p>
        <h2 class="fr-h2" id="cmp-title">Compare</h2>
        <div class="fr-compare" id="fr-compare">${compareBlock(charted().slice(0, 3).map((t) => t.id))}</div>
      </section>

      <section class="fr-section fr-wrap fr-section--sources" aria-label="Sources">
        <p class="fr-eyebrow">Sources</p>${list()}
      </section>`;
  }

  /* ---------------------------------------------------------
     5. A TECHNOLOGY PAGE
     --------------------------------------------------------- */
  function gauge(level) {
    return `<div class="fr-gauge" role="img" aria-label="Readiness ${level} of 9">
      ${Array.from({ length: 9 }, (_, i) => `<span class="fr-gauge-step${i < level ? " is-on" : ""}" style="--i:${i}"><b>${i + 1}</b></span>`).join("")}
      <span class="fr-gauge-ends"><span>Idea</span><span>Proven in use</span></span>
    </div>`;
  }

  const photoBlock = (t) => t.photo ? `<figure class="fr-photo"><img src="${esc(t.photo.src)}" alt="${esc(t.photo.alt)}"${t.photo.focus ? ` style="object-position:${esc(t.photo.focus)}"` : ""}><figcaption><a href="${esc(t.photo.url)}" rel="noopener" target="_blank">${esc(t.photo.credit)}</a></figcaption></figure>` : "";

  function techPage(t) {
    const f = FAM[t.family];
    document.title = `${t.name} · Frontier · Field Notes`;
    if (t.status !== "charted") {
      return `<section class="fr-hero fr-hero--tech fr-wrap fr-tone--${f.tone}">
        <a class="fr-back" href="#/">← Frontier</a>
        ${famChip(f)}<h1 class="fr-h1 fr-h1--tech">${esc(t.name)}</h1>
        <p class="fr-lede">${esc(t.tagline)}</p>
        <p class="fr-empty">Uncharted for now. This page is next on the list.</p>
        ${photoBlock(t)}
      </section>`;
    }
    const { cite, list } = citer();
    const links = C.links.filter((l) => l.status === "approved" && (l.from === `frontier:${t.id}` || l.to === `frontier:${t.id}`));
    const field = t.fieldNote === "placeholder"
      ? `<aside class="fr-fieldnote is-placeholder"><p>Field note to come: my own words, from experience.</p></aside>`
      : t.fieldNote ? `<aside class="fr-fieldnote"><p>${esc(t.fieldNote)}</p></aside>` : "";

    return `
      <section class="fr-hero fr-hero--tech fr-wrap fr-tone--${f.tone}" aria-labelledby="t-title">
        <a class="fr-back" href="#/">← Frontier</a>
        ${famChip(f)}
        <h1 class="fr-h1 fr-h1--tech" id="t-title">${esc(t.name)}</h1>
        <p class="fr-lede">${esc(t.tagline)}</p>
        <p class="fr-asof">Facts checked ${niceDate(t.asOf)}. This field moves fast.</p>
        ${field}
        ${photoBlock(t)}
        ${t.metrics ? `<dl class="fr-metrics">${t.metrics.map((m) => `<div class="fr-metric"><dt>${esc(m.value)}</dt><dd>${esc(m.label)}${cite(m.sources)}</dd></div>`).join("")}</dl>` : ""}
      </section>

      <section class="fr-section fr-wrap fr-tone--${f.tone}" aria-labelledby="how">
        <p class="fr-eyebrow">01</p><h2 class="fr-h2" id="how">How it works</h2>
        <div class="fr-how">
          <div class="fr-prose">${t.how.map((p) => `<p>${esc(p.text)}${cite(p.sources)}</p>`).join("")}</div>
          <figure class="fr-figure">${DIAGRAMS[t.diagram] ? DIAGRAMS[t.diagram]() : ""}<figcaption>Simplified drawing, not to scale.</figcaption></figure>
        </div>
      </section>

      <section class="fr-section fr-wrap fr-tone--${f.tone}" aria-labelledby="ready">
        <p class="fr-eyebrow">02</p><h2 class="fr-h2" id="ready">Readiness and timeline</h2>
        <div class="fr-ready">
          <div>
            ${gauge(t.readiness.level)}
            <p class="fr-ready-label">${esc(t.readiness.label)}</p>
            <p>${esc(t.readiness.summary)}${cite(t.readiness.sources)}</p>
            <p class="fr-small">${esc(t.readiness.note)}</p>
          </div>
          <ol class="fr-timeline">${t.milestones.map((m) => `<li class="${m.ahead ? "is-ahead" : ""}"><span class="fr-when">${esc(m.when)}</span><p>${esc(m.text)}${cite(m.sources)}</p></li>`).join("")}</ol>
        </div>
      </section>

      <section class="fr-section fr-wrap fr-tone--${f.tone}" aria-labelledby="econ">
        <p class="fr-eyebrow">03</p><h2 class="fr-h2" id="econ">Economics and policy</h2>
        <div class="fr-econ">${t.economics.map((e) => `<article><h3>${esc(e.heading)}</h3><p>${esc(e.text)}${cite(e.sources)}</p></article>`).join("")}</div>
      </section>

      <section class="fr-section fr-wrap fr-tone--${f.tone}" aria-labelledby="who">
        <p class="fr-eyebrow">04</p><h2 class="fr-h2" id="who">Who's building it</h2>
        <ul class="fr-builders">${t.builders.map((b) => `<li><a href="${esc(b.url)}" rel="noopener" target="_blank">${esc(b.name)} ↗</a><span>${esc(b.what)}</span></li>`).join("")}</ul>
      </section>

      <section class="fr-section fr-wrap fr-tone--${f.tone}" aria-labelledby="debates">
        <p class="fr-eyebrow">05</p><h2 class="fr-h2" id="debates">The heated debates</h2>
        <div class="fr-debates">${t.debates.map((d, i) => `<details class="fr-debate"${i === 0 ? " open" : ""}>
          <summary><span class="fr-flame" aria-hidden="true"></span>${esc(d.question)}</summary>
          <div class="fr-sides">
            <div class="fr-side fr-side--yes"><p class="fr-side-label">The case for</p><p>${esc(d.yes)}</p></div>
            <div class="fr-side fr-side--no"><p class="fr-side-label">The case against</p><p>${esc(d.no)}</p></div>
          </div>
          <p class="fr-dig">Dig in:</p>
          <ul class="fr-searches">${d.search.map((q) => `<li><button class="fr-copy" type="button" data-copy="${esc(q)}">${esc(q)}<span class="fr-copied" aria-live="polite"></span></button></li>`).join("")}</ul>
        </details>`).join("")}</div>
      </section>

      ${links.length ? `<section class="fr-section fr-wrap" aria-labelledby="conn">
        <p class="fr-eyebrow">06</p><h2 class="fr-h2" id="conn">Connections</h2>
        <ul class="fr-links">${links.map((l) => {
          const other = l.from === `frontier:${t.id}` ? l.to : l.from;
          const p = C.places[other];
          return p ? `<li><a href="../../${esc(p.href)}">${esc(p.label)}</a><span>${esc(l.reason)}</span></li>` : "";
        }).join("")}</ul>
      </section>` : ""}

      <section class="fr-section fr-wrap fr-section--sources" aria-labelledby="src">
        <p class="fr-eyebrow">Sources</p><h2 class="fr-h2" id="src">Where this comes from</h2>
        ${list()}
        ${t.flags && t.flags.length ? `<div class="fr-flags"><p class="fr-flags-head">Flagged: things I'm not fully sure of</p><ul>${t.flags.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
      </section>`;
  }

  // The ticker: listed companies involved in each technology, with the
  // latest price and change on the day (ticker-data.js, refreshed every
  // 30 minutes on market days by a GitHub Action)
  function ticker() {
    const T = window.FRONTIER_TICKER || { quotes: {} };
    // no prices yet (the FINNHUB_KEY secret isn't set): hide the bar altogether
    if (!T.updated || !Object.keys(T.quotes || {}).length) return "";
    const items = F.stocks.map((st) => {
      const t = TECH[st.tech], f = FAM[t.family], q = T.quotes[st.symbol];
      const move = q ? (q.change > 0 ? "is-up" : q.change < 0 ? "is-down" : "is-flat") : "is-none";
      const quote = q
        ? `<span class="fr-px">$${q.price.toFixed(2)}</span><span class="fr-chg ${move}">${q.change > 0 ? "▲" : q.change < 0 ? "▼" : "•"} ${Math.abs(q.change).toFixed(2)}%</span>`
        : `<span class="fr-px is-pending">price pending</span>`;
      return `<a class="fr-tick fr-tone--${f.tone}" href="#/${t.id}" title="${esc(st.name)}: ${esc(st.why)}"><b class="fr-sym">${st.symbol}</b>${quote}<span class="fr-tick-tech">${esc(t.name)}</span></a>`;
    }).join("");
    const when = T.updated ? `Prices as of ${new Date(T.updated).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}` : "";
    return `<nav class="fr-ticker" aria-label="Stock ticker: companies involved in these technologies">
      <span class="fr-ticker-label">Frontier index</span>
      <div class="fr-ticker-window"><div class="fr-ticker-track">${items}<span aria-hidden="true" class="fr-ticker-dup">${items.replaceAll("<a ", '<a tabindex="-1" ')}</span></div></div>
      <span class="fr-ticker-when">${when} · delayed · for information, not investment advice</span>
    </nav>
    <p class="fr-ticker-note">${when} · delayed · for information, not investment advice</p>`;
  }

  /* ---------------------------------------------------------
     6. ROUTING
     --------------------------------------------------------- */
  let selected = [];
  function render() {
    const id = location.hash.replace(/^#\/?/, "");
    const t = TECH[id];
    main.innerHTML = ticker() + (t ? techPage(t) : overview());
    stars();
    if (dcStop) { dcStop(); dcStop = null; }
    if (bot) { bot.stop(); bot = null; }
    if (!t) { dataCentre(); robot(); }
    document.body.classList.toggle("is-tech", !!t);
    window.scrollTo(0, 0);
    onScroll();
    selected = charted().slice(0, 3).map((x) => x.id);
  }
  main.addEventListener("change", (e) => {
    const box = e.target.closest(".fr-pick input");
    if (!box) return;
    if (box.checked) { selected.push(box.value); if (selected.length > 3) selected.shift(); }
    else selected = selected.filter((x) => x !== box.value);
    document.getElementById("fr-compare").innerHTML = compareBlock(selected);
  });
  main.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const done = () => { const s = b.querySelector(".fr-copied"); s.textContent = " copied"; setTimeout(() => (s.textContent = ""), 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, () => {});
  });
  // Credits, in the footer
  const credits = document.getElementById("fr-credits");
  if (credits) credits.innerHTML = 'Background: space colony interior by Rick Guidice for NASA Ames Research Center, 1970s. Public domain, via <a href="https://commons.wikimedia.org/wiki/File:Spacecolony3edit.jpeg" rel="noopener" target="_blank">Wikimedia Commons</a>. The falling robot (made with <a href="https://threejs.org" rel="noopener" target="_blank">three.js</a>) and the data centre are drawn in code. Prices in the ticker are delayed and are not investment advice.';

  addEventListener("hashchange", () => { render(); main.focus({ preventScroll: true }); });

  /* ---------------------------------------------------------
     7. WORK IN PROGRESS GATE
     Frontier opens only after you close the notice. Once closed,
     it stays closed for the rest of the visit (this tab).
     Remove this section and the dialog when Frontier is ready.
     --------------------------------------------------------- */
  (() => {
    const gate = document.getElementById("fr-gate");
    if (!gate || typeof gate.showModal !== "function") return;
    let seen = false;
    try { seen = sessionStorage.getItem("frontier-wip-seen") === "1"; } catch (e) { /* private mode */ }
    if (seen) return;
    const ok = gate.querySelector("[data-gate-ok]");
    gate.addEventListener("cancel", (e) => e.preventDefault());   // Esc doesn't skip it: use the button
    ok.addEventListener("click", () => {
      try { sessionStorage.setItem("frontier-wip-seen", "1"); } catch (e) { /* fine */ }
      gate.close();
      main.focus({ preventScroll: true });
    });
    gate.showModal();
  })();
  render();
})();
