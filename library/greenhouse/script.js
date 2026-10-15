/* =========================================================
   THE GREENHOUSE · script
   ---------------------------------------------------------
   1. Small helpers (seeded randomness, SVG strings)
   2. Botanical sketches: one drawing per kind of plant,
      used until a real photo arrives
   3. The scene: the Bedroom Tower, the benches, the tags
   4. The conservatory: glass, iron, pool and planting (redrawn on resize)
   5. The light: follows this device's clock
   6. The Pothos family line
   7. The care log (saved in this browser) and the schedule
   8. This week in the greenhouse
   9. Herbarium sheets
   10. Backup
   11. The hawk
   12. Elephant ears framing the page
   Plants come from data.js (window.GREENHOUSE).
   ========================================================= */
(() => {
  "use strict";

  const G = window.GREENHOUSE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const house = $("#glasshouse");
  const floor = $("#gh-floor");

  /* ---------------------------------------------------------
     1. HELPERS
     Each plant's drawing uses randomness seeded from its id,
     so it looks hand-drawn but stays the same on every visit.
     --------------------------------------------------------- */
  function hash(str) {
    let h = 2166136261;
    for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function seeded(seed) {
    let a = seed;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const r1 = (n) => Math.round(n * 10) / 10;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const DEG = Math.PI / 180;

  // A point and its direction along a quadratic curve
  function onCurve([x0, y0], [x1, y1], [x2, y2], t) {
    const u = 1 - t;
    return {
      x: u * u * x0 + 2 * u * t * x1 + t * t * x2,
      y: u * u * y0 + 2 * u * t * y1 + t * t * y2,
      a: Math.atan2(2 * u * (y1 - y0) + 2 * t * (y2 - y1), 2 * u * (x1 - x0) + 2 * t * (x2 - x1)) / DEG,
    };
  }
  const curve = (p0, p1, p2) => `M${r1(p0[0])},${r1(p0[1])} Q${r1(p1[0])},${r1(p1[1])} ${r1(p2[0])},${r1(p2[1])}`;

  /* ---------------------------------------------------------
     2. BOTANICAL SKETCHES
     Leaves are drawn once at 100 units long (base at 0,0, tip
     at 100,0), then placed with translate, rotate and scale.
     Lines keep their weight at every size.
     --------------------------------------------------------- */
  const LEAF = {
    heart:  { d: "M0,0 C-12,-30 25,-62 62,-40 C85,-25 95,-8 100,0 C95,8 85,25 62,40 C25,62 -12,30 0,0Z", vein: "M2,0 Q50,-3 95,0" },
    almond: { d: "M0,0 C20,-26 65,-30 100,0 C65,30 20,26 0,0Z", vein: "M3,0 Q50,-2 95,0" },
    paddle: { d: "M0,0 C10,-22 55,-42 88,-28 C102,-20 102,20 88,28 C55,42 10,22 0,0Z" },
    lance:  { d: "M0,0 C25,-14 70,-16 100,0 C70,16 25,14 0,0Z", vein: "M3,0 L95,0" },
    oval:   { d: "M0,0 C15,-34 70,-40 100,0 C70,40 15,34 0,0Z" },
    petal:  { d: "M0,0 C15,-30 72,-24 100,0 C72,24 15,30 0,0Z" },
    arrow:  {
      d: "M100,0 C70,-36 22,-50 -30,-36 C-16,-18 -4,-6 0,0 C-4,6 -16,18 -30,36 C22,50 70,36 100,0Z",
      vein: "M0,0 L96,0 M0,0 L-26,-30 M0,0 L-26,30 M20,0 L8,-34 M20,0 L8,34 M42,0 L34,-38 M42,0 L34,38 M64,0 L62,-28 M64,0 L62,28 M82,0 L84,-14 M82,0 L84,14",
    },
  };

  function leaf(shape, x, y, angle, size, cls = "sp-leaf", extra = "") {
    const L = LEAF[shape];
    const k = r1(size / 100 * 100) / 100;
    const tf = `translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)}) scale(${k})`;
    let out = `<g transform="${tf}"><path class="${cls}" d="${L.d}" vector-effect="non-scaling-stroke"/>`;
    if (L.vein) out += `<path class="sp-vein" d="${L.vein}" vector-effect="non-scaling-stroke"/>`;
    return out + extra + "</g>";
  }

  /* ---- Pots ---- */
  const POTS = {
    clay:  { body: "M31,132 L39,176 L101,176 L109,132Z", rim: "M26,121 h88 v11 h-88Z", soil: 121 },
    tall:  { body: "M38,124 L42,176 L98,176 L102,124Z", rim: "M35,116 h70 v9 h-70Z", soil: 116 },
    glaze: { body: "M33,124 C31,150 40,172 53,176 L87,176 C100,172 109,150 107,124Z", rim: "M31,119 h78 v6 h-78Z", soil: 119 },
    bowl:  { body: "M22,142 C24,163 44,175 70,175 C96,175 116,163 118,142Z", rim: "M19,137 h102 v6 h-102Z", soil: 137 },
  };
  function pot(shape, glaze) {
    const P = POTS[shape];
    return `<g class="pot pot--${glaze}">
      <ellipse class="pot-shadow" cx="70" cy="177" rx="46" ry="4"/>
      <path class="pot-body" d="${P.body}"/>
      <path class="pot-shade" d="${P.body}"/>
      <path class="pot-rim" d="${P.rim}"/>
      <path class="pot-glint" d="M${shape === "bowl" ? 30 : 42},${P.soil + 12} q2,16 6,30"/>
    </g>`;
  }
  const soilLine = (y) => `<path class="sp-soil" d="M34,${y + 1} Q70,${y - 3} 106,${y + 1}"/>`;

  /* ---- Plants: each returns { back, front } drawn around the pot ---- */
  const SKETCH = {
    pothos(r, small) {
      let back = "", front = "";
      const n = small ? 3 : 6;
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? 1 : -1;
        const trailing = !small && i >= n - 2;
        const p0 = [70 + side * (4 + r() * 8), 122];
        let p1, p2;
        if (trailing) {
          p1 = [70 + side * (56 + r() * 8), 112];
          p2 = [70 + side * (50 + r() * 12), 158 + r() * 20];
        } else if (small) {
          p1 = [70 + side * (4 + r() * 10), 100];
          p2 = [70 + side * (12 + r() * 22), 66 + r() * 22];
        } else {
          p1 = [70 + side * (6 + r() * 24), 84 + r() * 18];
          p2 = [70 + side * (14 + r() * 44), 22 + r() * 46];
        }
        let g = `<path class="sp-stem" d="${curve(p0, p1, p2)}"/>`;
        let flip = 1;
        for (let t = 0.3; t < 0.98; t += 0.16 + r() * 0.05) {
          const p = onCurve(p0, p1, p2, t);
          const size = small ? 13 + r() * 4 : 15 + r() * 7;
          const variegated = r() < 0.35 ? `<path class="sp-variegate" d="M14,-4 Q40,-14 62,-6" vector-effect="non-scaling-stroke"/>` : "";
          g += leaf("heart", p.x, p.y, p.a + flip * (58 + r() * 26), size, "sp-leaf", variegated);
          flip = -flip;
        }
        const tip = onCurve(p0, p1, p2, 1);
        g += leaf("heart", tip.x, tip.y, tip.a, small ? 12 : 15);
        if (trailing) front += g; else back += g;
      }
      return { back, front };
    },

    callisia(r) {
      let back = "", front = "";
      for (let i = 0; i < 74; i++) {
        const a = (-180 + r() * 180) * DEG;
        const rad = Math.sqrt(r());
        const x = 70 + Math.cos(a) * 44 * rad;
        const y = 116 + Math.sin(a) * 34 * rad;
        const ang = Math.atan2(y - 122, x - 70) / DEG + (r() - 0.5) * 50;
        back += leaf("oval", x, y, ang, 9 + r() * 5, r() < 0.4 ? "sp-leaf sp-leaf--blush" : "sp-leaf sp-leaf--light");
      }
      for (const side of [-1, 1]) {   // a few stems spilling over the rim
        const p0 = [70 + side * 30, 118], p1 = [70 + side * 52, 118], p2 = [70 + side * 48, 150 + r() * 10];
        front += `<path class="sp-stem" d="${curve(p0, p1, p2)}"/>`;
        for (let t = 0.25; t <= 1; t += 0.2) {
          const p = onCurve(p0, p1, p2, t);
          front += leaf("oval", p.x, p.y, p.a + (t * 10 % 2 > 1 ? 50 : -50), 8 + r() * 3, r() < 0.5 ? "sp-leaf sp-leaf--blush" : "sp-leaf sp-leaf--light");
        }
      }
      return { back, front };
    },

    jade(r) {
      let wood = "", leaves = "";
      function branch(x, y, ang, len, depth) {
        const x2 = x + Math.cos(ang * DEG) * len, y2 = y + Math.sin(ang * DEG) * len;
        const bend = (r() - 0.5) * 8;
        wood += `<path class="sp-wood" style="stroke-width:${r1(1.4 + depth * 1.6)}" d="M${r1(x)},${r1(y)} Q${r1((x + x2) / 2 + bend)},${r1((y + y2) / 2)} ${r1(x2)},${r1(y2)}"/>`;
        if (depth > 0) {
          const spread = 20 + r() * 16;
          branch(x2, y2, ang - spread, len * (0.68 + r() * 0.1), depth - 1);
          branch(x2, y2, ang + spread, len * (0.68 + r() * 0.1), depth - 1);
        } else {
          const n = 4 + Math.floor(r() * 3);
          for (let i = 0; i < n; i++) {
            leaves += leaf("paddle", x2, y2, ang - 70 + (140 / (n - 1)) * i + (r() - 0.5) * 14, 11 + r() * 4, "sp-leaf sp-leaf--jade");
          }
        }
      }
      branch(70, 122, -90, 26, 3);
      return { back: wood + leaves, front: "" };
    },

    zz(r) {
      let back = "";
      const n = 5;
      for (let i = 0; i < n; i++) {
        const x0 = 56 + (28 / (n - 1)) * i + (r() - 0.5) * 4;
        const lean = (i - (n - 1) / 2) * (9 + r() * 5);
        const p0 = [x0, 118], p1 = [x0 + lean * 0.2, 80], p2 = [x0 + lean * 1.2, 24 + r() * 30];
        back += `<path class="sp-stem sp-stem--thick" d="${curve(p0, p1, p2)}"/>`;
        for (let t = 0.36; t < 0.95; t += 0.12) {
          const p = onCurve(p0, p1, p2, t);
          const size = 15 - t * 4 + r() * 2;
          const gloss = `<path class="sp-gloss" d="M18,-6 Q42,-12 66,-6" vector-effect="non-scaling-stroke"/>`;
          back += leaf("almond", p.x, p.y, p.a - 42 - r() * 8, size, "sp-leaf sp-leaf--deep", gloss);
          back += leaf("almond", p.x, p.y, p.a + 42 + r() * 8, size, "sp-leaf sp-leaf--deep", gloss);
        }
        const tip = onCurve(p0, p1, p2, 1);
        back += leaf("almond", tip.x, tip.y, tip.a, 11, "sp-leaf sp-leaf--deep");
      }
      return { back, front: "" };
    },

    // Three trunks woven together, shared by the palm and the money tree
    braid(top) {
      let out = "";
      for (let k = 0; k < 3; k++) {
        let d = "";
        for (let y = 124; y >= top; y -= 2) {
          const x = 70 + Math.sin(y / 7 + k * 2.094) * 5.2;
          d += `${d ? "L" : "M"}${r1(x)},${y} `;
        }
        out += `<path class="sp-wood sp-wood--braid" d="${d}"/>`;
      }
      return out;
    },

    palm(r) {
      let back = SKETCH.braid(70);
      const n = 8;
      for (let i = 0; i < n; i++) {
        const ang = -165 + (150 / (n - 1)) * i + (r() - 0.5) * 10;
        const len = 42 + r() * 18;
        const p0 = [70, 70];
        const p2 = [70 + Math.cos(ang * DEG) * len, 70 + Math.sin(ang * DEG) * len + len * 0.45];
        const p1 = [70 + Math.cos(ang * DEG) * len * 0.5, 70 + Math.sin(ang * DEG) * len * 0.75 - 10];
        back += `<path class="sp-stem" d="${curve(p0, p1, p2)}"/>`;
        for (let t = 0.18; t < 1; t += 0.065) {
          const p = onCurve(p0, p1, p2, t);
          const l = (1 - t) * 13 + 4;
          for (const s of [-1, 1]) {
            const a = (p.a + s * 38) * DEG;
            back += `<path class="sp-frond" d="M${r1(p.x)},${r1(p.y)} l${r1(Math.cos(a) * l)},${r1(Math.sin(a) * l + 2)}"/>`;
          }
        }
      }
      return { back, front: "" };
    },

    // Dracaena marginata: a braided trunk under a burst of long, narrow,
    // red-edged leaves that arch up and out, then droop at the tips
    dracaena(r) {
      let back = SKETCH.braid(46);
      let front = "";
      const head = [70, 44];
      const n = 40;
      for (let i = 0; i < n; i++) {
        const ang = -178 + (176 / (n - 1)) * i + (r() - 0.5) * 9;
        const len = 34 + r() * 26 - Math.abs(ang + 90) * 0.08;
        const lift = Math.abs(ang + 90) / 90;              // side leaves droop more
        const p2 = [head[0] + Math.cos(ang * DEG) * len, head[1] + Math.sin(ang * DEG) * len * (1 - lift * 0.6) + lift * 16];
        const p1 = [head[0] + Math.cos(ang * DEG) * len * 0.55, head[1] + Math.sin(ang * DEG) * len * 0.75 - 4];
        const d = curve(head, p1, p2);
        const g = `<path class="sp-blade" d="${d}"/><path class="sp-blade-edge" d="${d}"/>`;
        if (i % 3 === 1) front += g; else back += g;
      }
      return { back, front };
    },

    pachira(r) {
      let back = SKETCH.braid(62);
      const n = 6;
      for (let i = 0; i < n; i++) {
        const ang = -160 + (140 / (n - 1)) * i + (r() - 0.5) * 12;
        const len = 20 + r() * 14;
        const x2 = 70 + Math.cos(ang * DEG) * len, y2 = 60 + Math.sin(ang * DEG) * len;
        back += `<path class="sp-stem" d="M70,60 Q${r1(70 + Math.cos(ang * DEG) * len * 0.5)},${r1(60 + Math.sin(ang * DEG) * len * 0.5 - 4)} ${r1(x2)},${r1(y2)}"/>`;
        [-64, -32, 0, 32, 64].forEach((off, j) => {
          back += leaf("lance", x2, y2, ang + off + (r() - 0.5) * 8, (j === 2 ? 24 : 18 + r() * 4) + r() * 3);
        });
      }
      return { back, front: "" };
    },

    succulent(r) {
      let back = "";
      [[50, 136, 15], [86, 132, 19], [106, 141, 10]].forEach(([cx, cy, rad], k) => {
        const cls = k === 1 ? "sp-leaf sp-leaf--silver sp-leaf--tipped" : "sp-leaf sp-leaf--jade";
        for (let ring = 0; ring < 3; ring++) {
          const n = 8 - ring;
          const size = rad * (1.05 - ring * 0.3);
          const off = r() * 40 + ring * 22;
          // Seen a little from above: petals behind first, then the ones in front
          const petals = [];
          for (let i = 0; i < n; i++) {
            const a = (off + (360 / n) * i) * DEG;
            const ang = Math.atan2(Math.sin(a) * 0.42 - ring * 0.38, Math.cos(a)) / DEG;
            petals.push({ ang, z: Math.sin(a) });
          }
          petals.sort((p, q) => p.z - q.z).forEach((p) => { back += leaf("petal", cx, cy, p.ang, size * (0.9 + r() * 0.2), cls); });
        }
      });
      return { back, front: "" };
    },

    alocasia(r, small, tired) {
      let back = "", front = "";
      const tops = [[44, 60, -1], [62, 34, -1], [84, 40, 1], [102, 64, 1]];
      tops.forEach(([x, y, side], i) => {
        const droop = tired && i === 3;
        const end = droop ? [118, 112] : [x + (r() - 0.5) * 6, y + (r() - 0.5) * 6];
        const p0 = [66 + i * 3, 120], p1 = droop ? [112, 76] : [(p0[0] + end[0]) / 2 - side * 6, (p0[1] + end[1]) / 2];
        const stem = `<path class="sp-stem" d="${curve(p0, p1, end)}"/>`;
        const ang = droop ? 92 : (side > 0 ? 18 + r() * 26 : 162 - r() * 26) - (i === 1 || i === 2 ? 26 * side : 0);
        const lf = leaf("arrow", end[0], end[1], ang, droop ? 30 : 34 + r() * 8, droop ? "sp-leaf sp-leaf--tired" : "sp-leaf sp-leaf--silver");
        if (droop) front += stem + lf; else back += stem + lf;
      });
      return { back, front };
    },
  };

  // Which drawing, pot and size each kind of plant gets
  const KIND = {
    "pothos":         { draw: "pothos", pot: ["clay", "clay"], size: "md" },
    "pothos-cutting": { draw: "pothos", small: true, pot: ["clay", "clay"], size: "sm" },
    "callisia":       { draw: "callisia", pot: ["glaze", "lime"], size: "md" },
    "jade":           { draw: "jade", pot: ["glaze", "olive"], size: "md" },
    "zz":             { draw: "zz", pot: ["tall", "lime"], size: "md" },
    "palm":           { draw: "palm", pot: ["clay", "clay"], size: "lg" },
    "dracaena":       { draw: "dracaena", pot: ["tall", "lime"], size: "lg" },
    "pachira":        { draw: "pachira", pot: ["glaze", "ink"], size: "lg" },
    "succulent":      { draw: "succulent", pot: ["bowl", "clay"], size: "sm" },
    "alocasia":       { draw: "alocasia", pot: ["glaze", "lime"], size: "md" },
  };
  const ZZ_GLAZES = ["lime", "clay", "olive"];

  // The plant laid flat on a herbarium sheet: no pot, a few roots, paper tape
  function pressed(plant) {
    const kind = KIND[plant.sketch];
    const parts = SKETCH[kind.draw](seeded(hash(plant.id)), kind.small, plant.status === "struggling");
    const r = seeded(hash(plant.id + "roots"));
    const base = POTS[kind.pot[0]].soil + 2;
    let roots = "";
    for (let i = 0; i < 7; i++) {
      const x = 70 + (r() - 0.5) * 14, len = 16 + r() * 22;
      roots += `<path class="sp-root" d="M70,${base} Q${r1(x + (r() - 0.5) * 20)},${r1(base + len * 0.5)} ${r1(x + (r() - 0.5) * 30)},${r1(base + len)}"/>`;
    }
    const tape = [[70, base - 6, -4], [40 + r() * 15, 70 + r() * 20, 28], [92 + r() * 12, 50 + r() * 25, -22]]
      .map(([x, y, a]) => `<rect class="sp-tape" x="${r1(x - 13)}" y="${r1(y - 3.5)}" width="26" height="7" transform="rotate(${a} ${r1(x)} ${r1(y)})"/>`).join("");
    return `<svg class="pressed" viewBox="-6 0 152 ${base + 44}" aria-hidden="true" focusable="false">
      <g class="sp-flat">${roots}${parts.back}${parts.front}</g>${tape}
    </svg>`;
  }

  function specimen(plant) {
    const kind = KIND[plant.sketch];
    const r = seeded(hash(plant.id));
    const parts = SKETCH[kind.draw](r, kind.small, plant.status === "struggling");
    let [shape, glaze] = kind.pot;
    if (plant.sketch === "zz") glaze = ZZ_GLAZES[(parseInt(plant.id.slice(-1), 10) - 1) % 3];
    if (plant.pot) [shape, glaze] = plant.pot;          // its real pot, from a photo
    return `<svg class="specimen" viewBox="0 0 140 180" aria-hidden="true" focusable="false">
      <g class="sp-back">${parts.back}</g>
      ${pot(shape, glaze)}
      ${soilLine(POTS[shape].soil)}
      <g class="sp-front">${parts.front}</g>
    </svg>`;
  }

  /* ---------------------------------------------------------
     3. THE SCENE
     --------------------------------------------------------- */
  const STATUS = { thriving: "Thriving", steady: "Steady", struggling: "Struggling", dormant: "Dormant" };

  function plantButton(plant, i) {
    const string = plant.location.place === "bench" && i % 2 ? 66 : 14;
    const kind = KIND[plant.sketch];
    const r = seeded(hash(plant.id + "tag"));
    const tilt = r1((r() - 0.5) * 7);
    const delay = r1(-r() * 6);
    const marks = [];
    if (!plant.confirmed) marks.push(`<span class="tag-mark tag-mark--confirm">To confirm</span>`);
    if (plant.status === "struggling" || plant.status === "dormant") marks.push(`<span class="tag-mark tag-mark--${plant.status}">${STATUS[plant.status]}</span>`);
    const label = `${plant.name}, ${plant.species}${plant.confirmed ? "" : " (to confirm)"}. ${STATUS[plant.status]}. Open its herbarium sheet.`;
    return `<button class="plant plant--${kind.size} is-${plant.status}" type="button" data-id="${esc(plant.id)}" aria-label="${esc(label)}">
      ${plant.photo && plant.photo.scene ? `<img class="specimen specimen--photo" src="${esc(plant.photo.src)}" alt="">` : specimen(plant)}
      <span class="tag-wrap" style="--tilt:${tilt}deg; --delay:${delay}s; --string:${string}px" aria-hidden="true">
        <span class="tag-string"></span>
        <span class="tag">
          <span class="tag-name">${esc(plant.name)}</span>
          <span class="tag-species">${esc(plant.species)}</span>
          ${marks.join("")}
        </span>
      </span>
    </button>`;
  }

  function buildScene() {
    const on = (fn) => G.plants.filter(fn);
    const tower = [1, 2, 3].map((tier) => {
      const p = on((x) => x.location.place === "tower" && x.location.tier === tier);
      return `<div class="tier"><div class="tier-slot">${p.map(plantButton).join("")}</div><div class="shelf"></div></div>`;
    }).join("");

    const bench = (n, label) => `
      <div class="bench" data-bench="${n}">
        <p class="bench-hint" aria-hidden="true">${label} · swipe along <span>→</span></p>
        <div class="bench-scroll">
          <div class="bench-track">
            <div class="bench-plants">${on((x) => x.location.place === "bench" && x.location.bench === n).map(plantButton).join("")}</div>
            <div class="bench-top" aria-hidden="true"></div>
            <div class="bench-under" aria-hidden="true">
              <span class="bench-plate">${label}</span>
              <span class="leg leg--l"></span><span class="leg leg--r"></span><span class="brace"></span>
            </div>
          </div>
        </div>
      </div>`;

    floor.innerHTML = `
      <div class="tower">
        <span class="tower-plate" aria-hidden="true">Bedroom Tower</span>
        ${tower}
        <div class="tower-feet" aria-hidden="true"></div>
      </div>
      ${bench(1, "Bench I")}
      ${bench(2, "Bench II")}`;
  }

  /* ---------------------------------------------------------
     4. THE CONSERVATORY
     A tall glass nave seen from the front, drawn to fit the
     scene: a gabled glass roof on white iron with arched
     trusses, a back wall of round-arched windows, a reflecting
     pool running to a small stepped fountain, a hanging fern,
     palms and layered planting, hazier the further back it is.
     Everything is placed in depth: t = 0 is the front of the
     scene, t = 1 the back wall.
     --------------------------------------------------------- */
  const frame = $("#gh-frame");
  const P = (x, y) => `${r1(x)},${r1(y)}`;

  function drawGlass() {
    const W = house.clientWidth, H = house.clientHeight;
    if (!W || !H) return;
    const r = seeded(hash("glass" + Math.round(W / 40)));
    const Hv = Math.min(H, W * 1.05);               // the "room" (phones get a taller scene below it)
    const F = { l: -W * 0.06, r: W * 1.06, eave: Hv * 0.13, ridge: -Hv * 0.24, floor: H };
    const B = { l: W * 0.335, r: W * 0.665, eave: Hv * 0.34, ridge: Hv * 0.17, floor: Hv * 0.6 };
    const ease = (t) => (t * 4) / (1 + 3 * t);    // far slices bunch up, like real perspective
    const mix = (a, b, e) => a + (b - a) * e;
    const sec = (t) => {
      const e = ease(t);
      return { l: mix(F.l, B.l, e), r: mix(F.r, B.r, e), eave: mix(F.eave, B.eave, e), ridge: mix(F.ridge, B.ridge, e), floor: mix(F.floor, B.floor, e), k: mix(1, 0.3, e) };
    };
    const cx = W / 2;
    // A point on a section's pitched roof, u from 0 (left eave) to 1 (right eave)
    const roofPt = (S, u) => [S.l + (S.r - S.l) * u, S.eave + (S.ridge - S.eave) * (1 - Math.abs(2 * u - 1))];
    let s = "";

    /* --- Back wall: round-arched windows under a glazed gable --- */
    s += `<path class="cv-glass" d="M${P(B.l, B.floor)} L${P(B.l, B.eave)} L${P(cx, B.ridge)} L${P(B.r, B.eave)} L${P(B.r, B.floor)}Z"/>`;
    const bays = 3, bw = (B.r - B.l) / bays;
    for (let i = 0; i < bays; i++) {
      const x0 = B.l + bw * i + bw * 0.12, x1 = B.l + bw * (i + 1) - bw * 0.12;
      const top = B.eave + (B.floor - B.eave) * (i === 1 ? 0.12 : 0.2), rad = (x1 - x0) / 2;
      s += `<path class="cv-arch" d="M${P(x0, B.floor)} V${r1(top + rad)} A${r1(rad)},${r1(rad)} 0 0 1 ${P(x1, top + rad)} V${r1(B.floor)}"/>`;
      for (let m = 1; m < 4; m++) s += `<path class="cv-bar cv-bar--fine" d="M${P(x0 + (x1 - x0) * m / 4, top + rad * (m === 2 ? 0 : 0.14))} V${r1(B.floor)}"/>`;
      for (let y = top + rad * 1.4; y < B.floor; y += (B.floor - top) / 7) s += `<path class="cv-bar cv-bar--fine" d="M${P(x0, y)} H${r1(x1)}"/>`;
    }
    for (let u = 1; u < 12; u++) {                   // the gable's fan of glazing bars
      const [x, y] = roofPt(B, u / 12);
      s += `<path class="cv-bar cv-bar--fine" d="M${P(cx, B.eave + 4)} L${P(x, y)}"/>`;
    }
    s += `<path class="cv-bar" d="M${P(B.l, B.eave)} H${r1(B.r)}"/>`;

    /* --- Roof: glazing bars running back, purlins across --- */
    for (let i = 0; i <= 32; i++) {
      const u = i / 32;
      const [x0, y0] = roofPt(F, u), [x1, y1] = roofPt(B, u);
      s += `<path class="cv-bar cv-bar--fine" d="M${P(x0, y0)} L${P(x1, y1)}"/>`;
    }
    for (let k = 1; k < 12; k++) {
      const S = sec(k / 12);
      s += `<path class="cv-bar cv-bar--fine" d="M${P(S.l, S.eave)} L${P(cx, S.ridge)} L${P(S.r, S.eave)}"/>`;
    }
    // Ridge and eaves running to the back
    s += `<path class="cv-bar" d="M${P(cx, F.ridge)} L${P(cx, B.ridge)} M${P(F.l, F.eave)} L${P(B.l, B.eave)} M${P(F.r, F.eave)} L${P(B.r, B.eave)}"/>`;

    /* --- Side walls: tall panes between columns --- */
    for (let k = 0; k <= 10; k++) {
      const S = sec(k / 10);
      const bottom = Math.min(S.floor, H);
      s += `<path class="cv-bar cv-bar--fine" d="M${P(S.l, S.eave)} V${r1(bottom)} M${P(S.r, S.eave)} V${r1(bottom)}"/>`;
    }
    for (const f of [0.35, 0.7]) {
      s += `<path class="cv-bar cv-bar--fine" d="M${P(F.l, mix(F.eave, Hv, f))} L${P(B.l, mix(B.eave, B.floor, f))} M${P(F.r, mix(F.eave, Hv, f))} L${P(B.r, mix(B.eave, B.floor, f))}"/>`;
    }

    /* --- Arched iron trusses, near ones heavier --- */
    for (const t of [0.12, 0.36, 0.62, 0.86]) {
      const S = sec(t), w = 4 * S.k;
      const yE = S.eave + 6 * S.k, peak = S.ridge + (S.eave - S.ridge) * 0.32;
      const outer = (u) => [S.l + (S.r - S.l) * u, yE + (peak - yE) * Math.sin(Math.PI * u)];
      const inner = (u) => { const [x, y] = outer(u); return [x, y + 16 * S.k * (0.5 + Math.sin(Math.PI * u) * 0.5)]; };
      let o = "", n = "", lattice = "";
      for (let i = 0; i <= 40; i++) {
        const u = i / 40, a = outer(u), b = inner(u);
        o += `${i ? "L" : "M"}${P(...a)} `;
        n += `${i ? "L" : "M"}${P(...b)} `;
        if (i < 40) { const b2 = inner((i + 1) / 40); lattice += `M${P(...a)} L${P(...b2)} `; }
      }
      s += `<path class="cv-truss" style="stroke-width:${r1(w)}" d="${o}"/><path class="cv-truss" style="stroke-width:${r1(w * 0.7)}" d="${n}"/>`;
      s += `<path class="cv-truss cv-truss--lattice" style="stroke-width:${r1(w * 0.35)}" d="${lattice}"/>`;
      // the columns the truss stands on
      s += `<path class="cv-truss" style="stroke-width:${r1(w * 1.3)}" d="M${P(S.l + 3, yE)} V${r1(Math.min(S.floor, H))} M${P(S.r - 3, yE)} V${r1(Math.min(S.floor, H))}"/>`;
    }

    /* --- Floor: planted beds either side of a long pool --- */
    const pool = (t) => { const S = sec(t); const half = (S.r - S.l) * 0.11; return [cx - half, cx + half, S.floor]; };
    const [pl0, pr0, py0] = pool(0.2), [pl1, pr1] = pool(1);
    s += `<path class="cv-ground" d="M${P(F.l, H)} L${P(B.l, B.floor)} L${P(B.r, B.floor)} L${P(F.r, H)}Z"/>`;
    s += `<path class="cv-ground-haze" d="M${P(F.l, H)} L${P(B.l, B.floor)} L${P(B.r, B.floor)} L${P(F.r, H)}Z"/>`;
    s += `<path class="cv-water" d="M${P(pl0, py0)} L${P(pl1, B.floor)} L${P(pr1, B.floor)} L${P(pr0, py0)}Z"/>`;
    for (let i = 0; i < 14; i++) {                   // light on the water
      const t = 0.25 + r() * 0.73, [a, b, y] = pool(t), w = (b - a) * (0.2 + r() * 0.4), x = a + (b - a - w) * r();
      s += `<path class="cv-glint" d="M${P(x, y)} h${r1(w)}"/>`;
    }
    s += `<path class="cv-kerb" d="M${P(pl0, py0)} L${P(pl1, B.floor)} M${P(pr0, py0)} L${P(pr1, B.floor)}"/>`;
    // A little stepped fountain at the far end
    const fw = (pr1 - pl1) * 1.3;
    for (let i = 0; i < 3; i++) s += `<rect class="cv-step" x="${r1(cx - fw / 2 + i * fw * 0.12)}" y="${r1(B.floor - (i + 1) * Hv * 0.012)}" width="${r1(fw * (1 - i * 0.24))}" height="${r1(Hv * 0.012)}"/>`;
    s += `<path class="cv-fall" d="M${P(cx - fw * 0.18, B.floor - Hv * 0.034)} v${r1(Hv * 0.034)} M${P(cx + fw * 0.18, B.floor - Hv * 0.034)} v${r1(Hv * 0.034)}"/>`;

    /* --- Planting, back to front --- */
    const blob = (x, y, rw, rh, cls) => `<path class="${cls}" d="M${P(x - rw, y)} C${P(x - rw, y - rh * 1.2)} ${P(x - rw * 0.2, y - rh * 1.35)} ${P(x + rw * 0.1, y - rh)} C${P(x + rw * 0.5, y - rh * 1.3)} ${P(x + rw * 1.05, y - rh * 0.9)} ${P(x + rw, y)}Z"/>`;
    const flowers = (x, y, rw, rh, n) => {
      let o = "";
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI, d = Math.sqrt(r());
        o += `<circle class="fol-bloom${r() < 0.4 ? " fol-bloom--deep" : ""}" cx="${r1(x + Math.cos(a) * rw * 0.85 * d)}" cy="${r1(y - Math.sin(a) * rh * d)}" r="${r1(1.4 + r() * 2.2 * (rw / 40))}"/>`;
      }
      return o;
    };

    // Far beds against the back wall: rounded shrubs, some in pink flower
    let far = "";
    for (const side of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const t = 0.7 + i * 0.045;
        const S = sec(t), edge = side < 0 ? S.l : S.r, [pa, pb] = pool(t);
        const x = mix(edge, side < 0 ? pa : pb, 0.1 + r() * 0.8), rw = (S.r - S.l) * (0.07 + r() * 0.05), rh = rw * (0.9 + r() * 0.6);
        far += blob(x, S.floor + 2, rw, rh, i % 2 ? "fol-3" : "fol-2");
        if (r() < 0.7) far += flowers(x, S.floor - rh * 0.25, rw, rh * 0.9, 26);
      }
    }
    s += `<g class="cv-far">${far}</g>`;

    // The hanging fern, from the third truss
    const hS = sec(0.62), hy = hS.ridge + (hS.eave - hS.ridge) * 0.32 + 24 * hS.k, ball = 46 * hS.k * 2.3;
    let fern = `<path class="cv-chain" d="M${P(cx, hy)} v${r1(ball * 1.1)}"/>`;
    const by = hy + ball * 1.1 + ball * 0.6;
    for (let i = 0; i < 60; i++) {
      const a = -Math.PI * 0.95 + (Math.PI * 1.9) * (i / 59) + (r() - 0.5) * 0.2;
      const len = ball * (0.9 + r() * 0.5);
      const x2 = cx + Math.cos(a) * len * 0.75, y2 = by + Math.abs(Math.sin(a)) * len * 0.3 + len * 0.55;
      fern += `<path class="fol-frond" style="stroke-width:${r1(2.6 * hS.k + 0.6)}" d="M${P(cx, by - ball * 0.3)} Q${P(cx + Math.cos(a) * len * 0.5, by - ball * 0.5)} ${P(x2, y2)}"/>`;
    }
    fern += `<ellipse class="fol-2" cx="${r1(cx)}" cy="${r1(by)}" rx="${r1(ball * 0.62)}" ry="${r1(ball * 0.5)}"/>`;
    s += `<g class="cv-mid">${fern}</g>`;

    // Banks of planting up both side walls, as tall as a person and more
    let bank = "";
    for (const side of [-1, 1]) {
      for (let i = 0; i < 18; i++) {
        const t = 0.26 + i * 0.04;
        const S = sec(Math.min(t, 0.97)), wall = side < 0 ? S.l : S.r, y = Math.min(S.floor, H) + 4;
        const rw = (S.r - S.l) * (0.06 + r() * 0.05), rh = (S.floor - S.eave) * (0.22 + r() * 0.26);
        const x = wall - side * rw * (0.3 + r() * 0.5);
        bank += blob(x, y, rw, Math.min(rh, H), i % 3 ? "fol-1" : "fol-2");
        if (r() < 0.45) bank += flowers(x, y - rh * 0.3, rw * 0.9, rh * 0.8, 30);
        for (let j = 0; j < 3; j++) {
          bank += leaf(r() < 0.5 ? "arrow" : "heart", x + (r() - 0.5) * rw, y - rh * (0.6 + r() * 0.5), side < 0 ? -30 + r() * 60 : 150 + r() * 60, 70 * S.k * (0.8 + r() * 0.6), r() < 0.5 ? "fol-2" : "fol-3");
        }
      }
    }
    s += `<g class="cv-bank">${bank}</g>`;

    // Middle beds along the pool: big leaves, spiky bromeliads, low shrubs
    let mid = "";
    for (const side of [-1, 1]) {
      for (let i = 0; i < 14; i++) {
        const t = 0.36 + i * 0.044 + r() * 0.03;
        const S = sec(t), [pa, pb] = pool(t), edge = side < 0 ? S.l : S.r;
        const x = mix(side < 0 ? pa : pb, edge, 0.05 + r() * 0.85), y = Math.min(S.floor, H) + 2, sz = 110 * S.k * (0.8 + r() * 0.6);
        const kind = r();
        if (kind < 0.4) {                             // elephant ears
          for (let j = 0; j < 4; j++) mid += leaf("arrow", x + (r() - 0.5) * sz * 0.5, y - sz * (0.3 + r() * 0.5), 60 + r() * 60 + (side > 0 ? -30 : 30), sz * 0.55, j % 2 ? "fol-2" : "fol-1");
        } else if (kind < 0.7) {                      // bromeliad spikes
          for (let j = 0; j < 9; j++) mid += leaf("lance", x, y, -90 + (j - 4) * 16 + (r() - 0.5) * 8, sz * (0.5 + r() * 0.3), "fol-3");
        } else {
          mid += blob(x, y, sz * 0.5, sz * 0.42, "fol-1");
          if (r() < 0.5) mid += flowers(x, y - sz * 0.1, sz * 0.5, sz * 0.36, 18);
        }
      }
    }
    s += `<g class="cv-mid">${mid}</g>`;

    // Palms: one tall on the right reaching for the roof, one nearer on the left
    const palm = (x, yBase, yTop, size, lean) => {
      let o = `<path class="fol-trunk" style="stroke-width:${r1(size * 0.06)}" d="M${P(x, yBase)} Q${P(x + lean * 0.4, (yBase + yTop) / 2)} ${P(x + lean, yTop)}"/>`;
      for (let y = yBase; y > yTop + 10; y -= size * 0.05) o += `<path class="fol-ring" d="M${P(x + lean * (1 - (y - yTop) / (yBase - yTop)) - size * 0.028, y)} h${r1(size * 0.056)}"/>`;
      for (let i = 0; i < 11; i++) {
        const a = (-175 + i * 17 + (r() - 0.5) * 8) * DEG, len = size * (0.5 + r() * 0.25);
        const tx = x + lean, ex = tx + Math.cos(a) * len, ey = yTop + Math.sin(a) * len * 0.4 + len * 0.35;
        const p0 = [tx, yTop], p1 = [tx + Math.cos(a) * len * 0.5, yTop + Math.sin(a) * len * 0.5 - size * 0.06], p2 = [ex, ey];
        o += `<path class="fol-rib" d="${curve(p0, p1, p2)}"/>`;
        for (let t = 0.12; t < 1; t += 0.05) {
          const p = onCurve(p0, p1, p2, t), l = size * 0.13 * (1 - t * 0.6);
          for (const sd of [-1, 1]) {
            const b = (p.a + sd * 30) * DEG;
            o += `<path class="fol-leaflet" style="stroke-width:${r1(size * 0.012 + 0.6)}" d="M${P(p.x, p.y)} l${r1(Math.cos(b) * l)},${r1(Math.sin(b) * l + l * 0.5)}"/>`;
          }
        }
      }
      return o;
    };
    const rS = sec(0.3), lS = sec(0.18);
    s += `<g class="cv-near">${palm(rS.r - (rS.r - rS.l) * 0.16, Math.min(rS.floor, H), Hv * 0.06, W * 0.2, -W * 0.03)}</g>`;
    s += `<g class="cv-near">${palm(lS.l + (lS.r - lS.l) * 0.16, Math.min(lS.floor, H), Hv * 0.2, W * 0.14, W * 0.02)}</g>`;

    // Phones: a taller scene, so planting keeps going down both walls
    if (H > Hv * 1.1) {
      let edge = "";
      for (let y = Hv; y < H; y += 120) {
        for (const x of [0, W]) {
          for (let j = 0; j < 2; j++) edge += leaf(r() < 0.5 ? "arrow" : "heart", x + (x ? -1 : 1) * r() * 14, y + r() * 90, x ? 150 + r() * 40 : -10 + r() * 40, 26 + r() * 18, r() < 0.5 ? "fol-2" : "fol-3");
        }
      }
      s += `<g class="cv-bank">${edge}</g>`;
    }

    // Condensation running down the side panes
    for (let i = 0; i < 18; i++) {
      const t = r() * 0.6, S = sec(t), side = r() < 0.5, x = side ? S.l + (sec(t + 0.08).l - S.l) * r() : S.r - (S.r - sec(t + 0.08).r) * r();
      const y0 = mix(S.eave, Hv, 0.1 + r() * 0.3), len = 14 + r() * 60;
      s += `<path class="gl-drip" d="M${P(x, y0)} q${r1((r() - 0.5) * 3)},${r1(len / 2)} ${r1((r() - 0.5) * 4)},${r1(len)}"/><circle class="gl-drop" cx="${r1(x)}" cy="${r1(y0 + len + 3)}" r="${r1(1.2 + r())}"/>`;
    }

    frame.setAttribute("viewBox", `0 0 ${W} ${H}`);
    frame.innerHTML = s;
    drawLamps(sec(0.36), sec(0.62));
  }

  // Lamps hang from the two middle trusses, lit at dusk and at night
  function drawLamps(a, b) {
    const lamps = $("#gh-lamps");
    const W = house.clientWidth;
    const spots = [[a, 0.24], [b, 0.4], [b, 0.6], [a, 0.76]];
    lamps.innerHTML = spots.map(([S, u]) => {
      const x = S.l + (S.r - S.l) * u;
      const drop = S.eave + 30 * S.k + (S.ridge - S.eave) * 0.32 * Math.sin(Math.PI * u) + 60 * S.k;
      return `<span class="lamp" style="left:${((x / W) * 100).toFixed(1)}%; --drop:${Math.round(Math.max(drop, 30))}px; --lamp-k:${S.k.toFixed(2)}">
        <span class="lamp-cord"></span><span class="lamp-shade"></span><span class="lamp-glow"></span>
      </span>`;
    }).join("");
  }

  /* ---------------------------------------------------------
     5. THE LIGHT
     Sunrise and sunset are estimated from the date and this
     device's time zone (no location is asked for), so they're
     rough: within about half an hour for most places.
     Add ?light=morning (or dawn, midday, golden, dusk, night)
     to the address to preview another time of day.
     --------------------------------------------------------- */
  const LIGHT_NAMES = {
    dawn: "Dawn light", morning: "Cool morning light", midday: "Midday light",
    golden: "Golden hour", dusk: "Dusk", night: "Lamps on",
  };

  function sunTimes(now) {
    const jan = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
    const noon = 12 + (Math.max(jan, jul) - now.getTimezoneOffset()) / 60;   // an hour later in summer time
    const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
    const decl = 23.44 * Math.sin((2 * Math.PI * (284 + doy)) / 365) * DEG;
    const lat = 45 * DEG;                       // a middle northern latitude
    const half = Math.acos(Math.max(-1, Math.min(1, -Math.tan(lat) * Math.tan(decl)))) / DEG / 15;
    return { rise: noon - half, set: noon + half, noon };
  }

  function phaseAt(now) {
    const h = now.getHours() + now.getMinutes() / 60;
    const { rise, set, noon } = sunTimes(now);
    if (h < rise - 0.75 || h >= set + 0.75) return "night";
    if (h < rise + 1) return "dawn";
    if (h < noon - 1.5) return "morning";
    if (h < set - 1.75) return "midday";
    if (h < set) return "golden";
    return "dusk";
  }

  const forced = new URLSearchParams(location.search).get("light");
  const readout = $("#light-readout");
  function updateLight() {
    const now = new Date();
    const phase = LIGHT_NAMES[forced] ? forced : phaseAt(now);
    if (house.dataset.light !== phase) house.dataset.light = phase;
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    readout.innerHTML = `<span class="gh-light-dot"></span>${forced ? "Preview" : time} · ${LIGHT_NAMES[phase]}`;
    readout.title = "The light follows the clock on this device";
  }

  /* ---------------------------------------------------------
     6. THE POTHOS FAMILY
     A dotted line from the Mother to each of her cuttings.
     --------------------------------------------------------- */
  const familySvg = $("#gh-family");
  function drawFamily() {
    const box = house.getBoundingClientRect();
    if (box.width < 860) { familySvg.innerHTML = ""; return; }   // on phones the sheets show the family instead
    const potTop = (id) => {
      const el = floor.querySelector(`.plant[data-id="${id}"] .specimen`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2 - box.left, y: b.top + b.height * 0.68 - box.top, w: b.width, b };
    };
    let s = "";
    for (const parent of G.plants.filter((p) => G.plants.some((c) => c.parent === p.id))) {
      const m = potTop(parent.id);
      if (!m) continue;
      const kids = G.plants.filter((c) => c.parent === parent.id).map((c) => potTop(c.id)).filter(Boolean);
      kids.forEach((k, i) => {
        const sx = m.x + m.w * 0.42, sy = m.y;
        const mx = (sx + k.x) / 2, my = Math.min(sy, k.y) - 40 - i * 14;
                const ky = k.b.top - box.top + k.b.height * 0.42;
        s += `<path class="fam-line" d="M${r1(sx)},${r1(sy)} Q${r1(mx)},${r1(my)} ${r1(k.x)},${r1(ky)}"/>`;
        s += `<circle class="fam-dot" cx="${r1(k.x)}" cy="${r1(ky)}" r="2.6"/>`;
      });
      if (kids.length) {
        s += `<circle class="fam-dot" cx="${r1(m.x + m.w * 0.42)}" cy="${r1(m.y)}" r="3.2"/>`;
        const last = kids[0];
        s += `<text class="fam-note" x="${r1((m.x + last.x) / 2 + 10)}" y="${r1(Math.min(m.y, last.y) - 52)}">her cuttings</text>`;
      }
    }
    familySvg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    familySvg.innerHTML = s;
  }

  /* ---------------------------------------------------------
     7. THE CARE LOG AND THE SCHEDULE
     Saved in this browser as { started, log: { plantId: [{ t, d }] } }
     where t is the task and d the day ("YYYY-MM-DD").
     Every interval is a starting point. In winter (November to
     March) soil checks switch to their winter interval and
     feeding stops.
     --------------------------------------------------------- */
  const KEY = "fieldnotes-greenhouse-v1";
  const TASKS = {
    check:  { verb: "Check soil", done: "Checked the soil", hint: "Push a finger in. Water only if it's as dry as the sheet says." },
    water:  { done: "Watered", counts: "check" },
    feed:   { verb: "Feed", done: "Fed", hint: "Growing season only." },
    mist:   { verb: "Mist", done: "Misted", hint: "Or top up the pebble tray." },
    rotate: { verb: "Turn", done: "Turned", hint: "A quarter turn, so it grows evenly toward the light." },
    repot:  { verb: "Repot", done: "Repotted", hint: "" },
  };
  const ORDER = ["check", "mist", "feed", "rotate", "repot"];

  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => iso(new Date());
  const dayNum = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
  const addDays = (s, n) => { const d = new Date(dayNum(s) * 864e5 + n * 864e5); return d.toISOString().slice(0, 10); };
  const weekday = (s) => new Date(dayNum(s) * 864e5).toLocaleDateString(undefined, { weekday: "long", timeZone: "UTC" });
  const niceDate = (s) => new Date(dayNum(s) * 864e5).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  function blank() { return { started: todayISO(), log: {} }; }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && typeof raw.log === "object") return { ...blank(), ...raw };
    } catch (err) { /* storage blocked or empty */ }
    return blank();
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* private window: keep it for this visit */ }
  }
  save();

  const season = (day) => {
    const m = Number(day.slice(5, 7));
    return m >= G.season.growing[0] && m <= G.season.growing[1] ? "summer" : "winter";
  };

  // The jobs a plant has right now, with how often
  function jobsFor(plant, day) {
    const jobs = [{ t: "check", every: plant.water[season(day)] }];
    if (plant.feed && season(day) === "summer") jobs.push({ t: "feed", every: plant.feed.every });
    for (const x of plant.tasks || []) jobs.push({ t: x.task, every: x.every });
    return jobs;
  }

  function lastDone(id, t) {
    let last = null;
    for (const e of state.log[id] || []) {
      if ((e.t === t || TASKS[e.t]?.counts === t) && (!last || e.d > last)) last = e.d;
    }
    return last;
  }

  // When a job is next due. Never-logged soil checks and misting are
  // due straight away; feeding and turning start counting from the
  // day the greenhouse was first opened in this browser.
  function dueDate(plant, job) {
    const last = lastDone(plant.id, job.t);
    if (last) return addDays(last, job.every);
    if (job.t === "check" || job.t === "mist") return state.started;
    return addDays(state.started, job.every);
  }

  function logTask(id, t, day = todayISO()) {
    (state.log[id] = state.log[id] || []).push({ t, d: day });
    save();
  }
  function unlog(id, t, day) {
    const list = state.log[id] || [];
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].t === t && list[i].d === day) { list.splice(i, 1); break; }
    }
    if (!list.length) delete state.log[id];
    save();
  }

  function whenText(due, today) {
    const diff = dayNum(due) - dayNum(today);
    if (diff < -1) return `${-diff} days late`;
    if (diff === -1) return "1 day late";
    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff < 7) return weekday(due);
    return new Date(dayNum(due) * 864e5).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });
  }

  /* Toast with an undo */
  const toast = $("#toast");
  let toastTimer = 0;
  function say(text, undo) {
    toast.innerHTML = `<span>${esc(text)}</span>${undo ? `<button class="gh-toast-undo" type="button">Undo</button>` : ""}`;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-on"));
    if (undo) toast.querySelector("button").addEventListener("click", () => { undo(); hideToast(); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  }
  function hideToast() {
    toast.classList.remove("is-on");
    setTimeout(() => { if (!toast.classList.contains("is-on")) toast.hidden = true; }, 300);
  }

  function done(id, t) {
    const day = todayISO();
    const plant = G.plants.find((p) => p.id === id);
    logTask(id, t);
    refresh();
    say(`${TASKS[t].done} · ${plant.name}`, () => { unlog(id, t, day); refresh(); });
  }

  function refresh() {
    renderWeek();
    if (openId) renderSheet(openId);
  }

  /* ---------------------------------------------------------
     8. THIS WEEK IN THE GREENHOUSE
     One card per kind of job. Each plant is a chip: tap it
     when the job's done.
     --------------------------------------------------------- */
  let shownDay = "";
  function renderWeek() {
    const today = todayISO();
    shownDay = today;
    const horizon = addDays(today, 6);
    const groups = {};
    for (const plant of G.plants) {
      for (const job of jobsFor(plant, today)) {
        const due = dueDate(plant, job);
        if (due > horizon) continue;
        (groups[job.t] = groups[job.t] || []).push({ plant, due });
      }
    }

    const sea = season(today);
    $("#week-season").innerHTML = sea === "summer"
      ? `<span class="week-dot week-dot--summer"></span>Growing season · until 31 October`
      : `<span class="week-dot week-dot--winter"></span>Winter rest · longer gaps, no feeding`;

    const cards = ORDER.filter((t) => groups[t]).map((t) => {
      const items = groups[t].sort((a, b) => a.due.localeCompare(b.due) || G.plants.indexOf(a.plant) - G.plants.indexOf(b.plant));
      const now = items.filter((x) => x.due <= today);
      const later = items.filter((x) => x.due > today);
      const chip = ({ plant, due }) => {
        const when = whenText(due, today);
        const late = due < today;
        return `<li><button class="chip${due <= today ? " chip--due" : ""}${late ? " chip--late" : ""}" type="button" data-id="${esc(plant.id)}" data-task="${t}"
            aria-label="${esc(`${TASKS[t].verb}: ${plant.name}, due ${when}. Mark as done.`)}">
          <span class="chip-box" aria-hidden="true"></span>
          <span class="chip-name">${esc(plant.name)}</span>
          <span class="chip-when">${when}</span>
        </button></li>`;
      };
      return `<article class="job job--${t}${items.length > 6 ? " job--wide" : ""}">
        <header class="job-head">
          <h3 class="job-title">${TASKS[t].verb}</h3>
          <p class="job-count">${now.length ? `${now.length} now` : ""}${now.length && later.length ? " · " : ""}${later.length ? `${later.length} later` : ""}</p>
        </header>
        ${TASKS[t].hint ? `<p class="job-hint">${esc(TASKS[t].hint)}</p>` : ""}
        <ul class="chips">${now.map(chip).join("")}${later.length ? later.map(chip).join("") : ""}</ul>
        ${now.length > 1 ? `<button class="btn job-all" type="button" data-task="${t}">All ${now.length} done</button>` : ""}
      </article>`;
    });

    $("#week-body").innerHTML = cards.length
      ? `<div class="jobs">${cards.join("")}</div>`
      : `<p class="week-empty">Nothing due this week. The greenhouse is quiet.</p>`;
  }

  $("#week-body").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) { done(chip.dataset.id, chip.dataset.task); return; }
    const all = e.target.closest(".job-all");
    if (all) {
      const t = all.dataset.task, today = todayISO();
      const ids = G.plants.filter((p) => jobsFor(p, today).some((j) => j.t === t && dueDate(p, j) <= today)).map((p) => p.id);
      ids.forEach((id) => logTask(id, t));
      refresh();
      say(`${TASKS[t].done} · ${ids.length} plants`, () => { ids.forEach((id) => unlog(id, t, today)); refresh(); });
    }
  });

  /* ---------------------------------------------------------
     9. HERBARIUM SHEETS
     The plant pressed flat with its label, then its care,
     facts with numbered sources, pets, family and log.
     --------------------------------------------------------- */
  const panelEl = $("#panel");
  const panelBody = $("#panel-body");
  let openId = null;
  const sheet = FieldNotes.panel(panelEl, { onClose() { openId = null; } });

  const TIERS = { 1: "top tier", 2: "middle tier", 3: "bottom tier" };
  const placeText = (loc) => loc.place === "tower" ? `Bedroom Tower, ${TIERS[loc.tier]}` : `Bench ${loc.bench === 2 ? "II" : "I"}`;
  const every = (n) => n === 1 ? "every day" : n % 30 === 0 && n >= 60 ? `every ${n / 30} months` : `every ${n} days`;

  function renderSheet(id) {
    const plant = G.plants.find((p) => p.id === id);
    if (!plant) return;
    const today = todayISO();
    const no = String(G.plants.indexOf(plant) + 1).padStart(2, "0");

    // Number the sources in the order they're first cited
    const cited = [];
    const cite = (ids) => ids.map((sid) => {
      if (!cited.includes(sid)) cited.push(sid);
      const n = cited.indexOf(sid) + 1;
      return `<a class="cite" href="#src-${n}" aria-label="Source ${n}">${n}</a>`;
    }).join("");
    const facts = plant.facts.map((f) => `<li>${esc(f.text)}<sup>${cite(f.sources)}</sup></li>`).join("");
    const tox = `${esc(plant.toxicity.text)}${plant.toxicity.sources.length ? `<sup>${cite(plant.toxicity.sources)}</sup>` : ""}`;

    // The schedule, with when each job is next due
    const jobs = jobsFor(plant, today);
    const rows = [
      { t: "check", label: "Check soil", rule: `${every(plant.water.summer)} in the growing season, ${every(plant.water.winter)} in winter` },
      ...(plant.feed ? [{ t: "feed", label: "Feed", rule: `${every(plant.feed.every)}, ${plant.feed.season} only` }] : []),
      ...(plant.tasks || []).map((x) => ({ t: x.task, label: TASKS[x.task].verb, rule: every(x.every) })),
    ].map((row) => {
      const job = jobs.find((j) => j.t === row.t);
      const next = job ? dueDate(plant, job) : null;
      // Feeding that would fall after October waits for spring
      const resting = !job || (row.t === "feed" && season(next) === "winter");
      const status = resting ? "Resting until April" : `Next: ${whenText(next, today)}`;
      return `<div class="sched-row">
        <dt>${row.label}</dt>
        <dd><span class="sched-rule">${row.rule}</span><span class="sched-next${!resting && next <= today ? " is-due" : ""}">${status}</span></dd>
      </div>`;
    }).join("");

    const logButtons = ["check", "water", ...jobs.map((j) => j.t).filter((t) => t !== "check"), ...(plant.tasks || []).some((x) => x.task === "repot") ? [] : ["repot"]]
      .filter((t, i, a) => a.indexOf(t) === i)
      .map((t) => `<button class="btn" type="button" data-log="${t}">${TASKS[t].done}</button>`).join("");

    const entries = (state.log[plant.id] || []).slice().sort((a, b) => b.d.localeCompare(a.d)).slice(0, 30);
    const log = entries.length
      ? `<ol class="sheet-log">${entries.map((e) => `<li><time datetime="${e.d}">${niceDate(e.d)}</time> ${esc(TASKS[e.t]?.done || e.t)}<button class="log-remove" type="button" data-t="${esc(e.t)}" data-d="${e.d}" aria-label="Remove this entry">✕</button></li>`).join("")}</ol>`
      : `<p class="sheet-quiet">Nothing logged yet.</p>`;

    // The Pothos family
    const parent = plant.parent && G.plants.find((p) => p.id === plant.parent);
    const kids = G.plants.filter((p) => p.parent === plant.id);
    const famLink = (p, what) => `<li><button class="fam-link" type="button" data-open="${esc(p.id)}">${esc(p.name)}</button> <span>${what}</span></li>`;
    const family = parent || kids.length ? `<section class="p-section">
        <p class="p-label">Family</p>
        <ul class="sheet-family">
          ${parent ? famLink(parent, "the parent plant") : ""}
          ${kids.map((k) => famLink(k, k.propagated ? `cutting, ${niceDate(k.propagated)}` : "cutting")).join("")}
          ${parent ? G.plants.filter((p) => p.parent === parent.id && p.id !== plant.id).map((p) => famLink(p, "sibling cutting")).join("") : ""}
        </ul>
      </section>` : "";

    panelBody.innerHTML = `
      <p class="p-coords">Specimen ${no} · ${placeText(plant.location)}</p>
      <h2 class="p-title" id="panel-title">${esc(plant.name)}</h2>
      <p class="sheet-species"><em>${esc(plant.species)}</em></p>

      <figure class="sheet-paper">
        ${plant.photo ? `<span class="sheet-print"><img class="sheet-photo" src="${esc(plant.photo.src)}" alt="${esc(plant.photo.alt)}" loading="lazy"><span class="sheet-tape sheet-tape--a"></span><span class="sheet-tape sheet-tape--b"></span></span><span class="sheet-photo-note">Field photo${plant.photo.date ? `, ${niceDate(plant.photo.date)}` : ""}</span>` : pressed(plant)}
        <figcaption class="sheet-label">
          <span class="sheet-label-head">The Greenhouse · Herbarium</span>
          <span class="sheet-label-row"><b>Name</b> ${esc(plant.name)}</span>
          <span class="sheet-label-row"><b>Species</b> <i>${esc(plant.species)}</i></span>
          <span class="sheet-label-row"><b>Det.</b> ${plant.confirmed ? "Confirmed" : "To confirm"}</span>
          <span class="sheet-label-row"><b>Locality</b> ${esc(placeText(plant.location))}</span>
        </figcaption>
        ${plant.photo ? "" : `<span class="sheet-sketch-note">Drawing until a photo arrives</span>`}
      </figure>

      <p class="sheet-stamps">
        <span class="stamp stamp--large sheet-status sheet-status--${plant.status}">${STATUS[plant.status]}</span>
        ${plant.confirmed ? "" : `<span class="stamp stamp--large stamp--planned">To confirm</span>`}
      </p>
      <button class="btn btn--hawk" type="button" data-hawk="${esc(plant.id)}"><img src="../../favicon.svg" alt="" width="16" height="16"> Call the hawk</button>

      <section class="p-section">
        <p class="p-label">Light</p>
        <p>${esc(plant.light)}</p>
      </section>

      <section class="p-section">
        <p class="p-label">Care schedule · starting points</p>
        <dl class="sched">${rows}</dl>
        <p class="sheet-small">These are where to start, not rules. Check before watering, and change the numbers in data.js once you know the plant.</p>
      </section>

      <section class="p-section">
        <p class="p-label">Log it</p>
        <div class="sheet-actions">${logButtons}</div>
      </section>

      ${facts ? `<section class="p-section"><p class="p-label">Care facts</p><ul class="sheet-facts">${facts}</ul></section>` : ""}

      <section class="p-section">
        <p class="p-label">Pets</p>
        <p class="sheet-tox">${tox}</p>
      </section>

      ${plant.flags.length ? `<section class="p-section sheet-flags"><p class="p-label">Still uncertain</p><ul>${plant.flags.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></section>` : ""}

      ${family}

      ${plant.notes ? `<section class="p-section"><p class="p-label">Notes</p><p class="p-note">${esc(plant.notes)}</p></section>` : ""}

      <section class="p-section">
        <p class="p-label">Care log</p>
        ${log}
      </section>

      ${cited.length ? `<section class="p-section">
        <p class="p-label">Sources</p>
        <ol class="sheet-sources">${cited.map((sid, i) => {
          const src = G.sources[sid];
          return `<li id="src-${i + 1}"><a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.title)}</a>, ${esc(src.publisher)}</li>`;
        }).join("")}</ol>
      </section>` : ""}
    `;
  }

  function openSheet(id, opener) {
    openId = id;
    renderSheet(id);
    sheet.open(opener);
  }

  panelBody.addEventListener("click", (e) => {
    const logBtn = e.target.closest("[data-log]");
    if (logBtn) { done(openId, logBtn.dataset.log); return; }
    const rm = e.target.closest(".log-remove");
    if (rm) { unlog(openId, rm.dataset.t, rm.dataset.d); refresh(); return; }
    const call = e.target.closest("[data-hawk]");
    if (call) { renderHawk(call.dataset.hawk); panelEl.querySelector(".panel-scroll").scrollTop = 0; return; }
    const back = e.target.closest("[data-open-sheet]");
    if (back) { openId = back.dataset.openSheet; renderSheet(openId); panelEl.querySelector(".panel-scroll").scrollTop = 0; return; }
    const fam = e.target.closest("[data-open]");
    if (fam) { openId = fam.dataset.open; renderSheet(openId); panelEl.querySelector(".panel-scroll").scrollTop = 0; }
  });

  /* ---------------------------------------------------------
     10. BACKUP
     --------------------------------------------------------- */
  $("#export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ app: "fieldnotes-greenhouse", exported: new Date().toISOString(), ...state }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `greenhouse-log-${todayISO()}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    $("#backup-status").textContent = `Saved ${a.download}.`;
  });

  $("#import").addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== "fieldnotes-greenhouse" || typeof data.log !== "object" || !data.log) throw new Error("not a backup");
      const n = Object.values(data.log).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
      if (!confirm(`Load this backup? It has ${n} care log entr${n === 1 ? "y" : "ies"} and replaces what's in this browser now.`)) return;
      const log = {};
      for (const [id, list] of Object.entries(data.log)) {
        if (!Array.isArray(list)) continue;
        const ok = list.filter((x) => x && TASKS[x.t] && /^\d{4}-\d\d-\d\d$/.test(x.d));
        if (ok.length) log[id] = ok.map((x) => ({ t: x.t, d: x.d }));
      }
      state = { started: /^\d{4}-\d\d-\d\d$/.test(data.started) ? data.started : todayISO(), log };
      save();
      refresh();
      $("#backup-status").textContent = `Loaded ${file.name}: ${n} entr${n === 1 ? "y" : "ies"}.`;
    } catch (err) {
      $("#backup-status").textContent = "That file doesn't look like a Greenhouse backup, so nothing changed.";
    }
  });

  /* ---------------------------------------------------------
     11. THE HAWK
     While any plant is marked struggling, the red-tail glides
     across the glasshouse with a field tag in its talons.
     Tap it (or the note by the clock) for "Field notes from
     above". Every herbarium sheet can call it too.
     --------------------------------------------------------- */
  // Seen from the side, gliding right, wings raised. Colours come
  // from the shared --hawk-* tokens.
  const HAWK_SVG = `<svg class="hawk-svg" viewBox="38 0 140 122" aria-hidden="true" focusable="false">
    <path class="hk2-far" d="M134,60 C132,42 126,26 118,14 L116,5 L112,13 L108,4 L106,14 L100,7 L101,17 L94,13 C100,30 110,46 120,62Z"/>
    <path class="hk2-tail" d="M76,68 C66,64 56,61 46,60 C41,68 42,78 47,84 C58,82 66,78 78,76Z"/>
    <path class="hk2-band" d="M51,61 C47,68 48,77 52,83"/>
    <path class="hk2-body" d="M70,70 C82,58 108,52 132,54 C148,56 156,64 152,74 C146,84 124,88 104,86 C88,85 76,80 70,70Z"/>
    <path class="hk2-belly" d="M100,84 C116,87 138,83 149,72 C142,68 128,70 116,74 C108,77 102,80 100,84Z"/>
    <path class="hk2-streak" d="M112,79 l2,2.4 M118,77.5 l2,2.4 M124,76 l2,2.4 M130,74.5 l1.6,2.2"/>
    <g class="hk2-wing">
      <path class="hk2-near" d="M128,62 C122,44 110,28 96,16 L90,7 L88,16 L80,5 L80,16 L72,7 L73,19 L63,12 L67,24 L57,21 C70,34 86,50 100,66Z"/>
      <path class="hk2-bar" d="M123,57 C117,44 108,33 99,24"/>
    </g>
    <path class="hk2-body" d="M134,56 C136,42 152,36 162,44 C168,49 167,58 160,62 C152,66 140,64 134,58Z"/>
    <path class="hk2-beak" d="M160,46 C166,45 172,49 170,56 L166,55 C166,52 164,50 160,51Z"/>
    <path class="hk2-tip" d="M168,52 C171,53 171,57 169,58 L166,55Z"/>
    <circle class="hk2-ring" cx="154" cy="47" r="3.4"/><circle class="hk2-eye" cx="154.6" cy="47" r="1.8"/>
    <path class="hk2-leg" d="M110,85 l2,9 M117,85 l1,9"/>
    <path class="hk2-string" d="M114,94 L117,104"/>
    <g class="hk2-tag" transform="rotate(6 117 111)">
      <path d="M107,104 h20 v15 h-20Z"/><circle cx="117" cy="107.5" r="1.3"/>
      <path class="hk2-writing" d="M110,112 h14 M110,115 h9"/>
    </g>
  </svg>`;

  const struggling = () => G.plants.filter((p) => p.status === "struggling");
  const hawkNote = $("#hawk-note");

  function placeHawk() {
    const list = struggling();
    house.querySelector(".hawk-fly")?.remove();
    hawkNote.hidden = !list.length;
    if (!list.length) return;
    const words = list.length === 1 ? `${list[0].name} is struggling` : `${list.length} plants are struggling`;
    hawkNote.innerHTML = `<img src="../../favicon.svg" alt="" width="18" height="18"> Field notes from above · ${esc(words)}`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hawk-fly";
    btn.setAttribute("aria-label", `The hawk has field notes: ${words}. Open them.`);
    btn.innerHTML = `<span class="hawk-bob">${HAWK_SVG}</span>`;
    btn.addEventListener("click", () => openHawk(null, btn));
    house.append(btn);
  }
  hawkNote.addEventListener("click", () => openHawk(null, hawkNote));

  function openHawk(id, opener) {
    openId = null;
    renderHawk(id);
    sheet.open(opener);
  }

  function renderHawk(id) {
    const list = id ? [G.plants.find((p) => p.id === id)] : struggling();
    const cited = [];
    const cite = (ids) => ids.map((sid) => {
      if (!cited.includes(sid)) cited.push(sid);
      const n = cited.indexOf(sid) + 1;
      return `<a class="cite" href="#src-${n}" aria-label="Source ${n}">${n}</a>`;
    }).join("");
    const items = (arr, tag = "ul") => `<${tag} class="hawk-list">${arr.map((x) => `<li>${esc(x.text)}<sup>${cite(x.sources)}</sup></li>`).join("")}</${tag}>`;

    const notes = list.map((p) => {
      const h = p.hawk;
      const head = `<h3 class="hawk-plant-name">${esc(p.name)} <span class="stamp sheet-status sheet-status--${p.status}">${STATUS[p.status]}</span></h3>`;
      if (!h) {
        return `<article class="hawk-plant">${head}
          <p class="hawk-summary">No detailed notes for this one yet. The hawk writes them when a plant is marked struggling. Until then, its herbarium sheet has the care basics.</p>
          <button class="btn" type="button" data-open-sheet="${esc(p.id)}">Open its herbarium sheet</button>
        </article>`;
      }
      return `<article class="hawk-plant">${head}
        <p class="p-note hawk-summary">${esc(h.summary)}</p>
        <section class="p-section"><p class="p-label">Likely causes</p>${items(h.causes)}</section>
        <section class="p-section"><p class="p-label">What to do this week</p>${items(h.thisWeek, "ol")}</section>
        <section class="p-section"><p class="p-label">Watch for</p>${items(h.watch)}</section>
        ${h.normal ? `<section class="p-section"><p class="p-label">What normal rest looks like</p>${items(h.normal)}</section>` : ""}
        <button class="btn" type="button" data-open-sheet="${esc(p.id)}">Open its herbarium sheet</button>
      </article>`;
    }).join("");

    panelBody.innerHTML = `
      <p class="p-coords">${niceDate(todayISO())} · from above the benches</p>
      <div class="hawk-head">
        <span class="hawk-head-bird">${HAWK_SVG}</span>
        <h2 class="p-title" id="panel-title">Field notes <em>from above</em></h2>
      </div>
      ${list.length ? notes : `<p class="hawk-summary">Nothing is struggling. The hawk is circling, but there's nothing to report.</p>`}
      ${cited.length ? `<section class="p-section">
        <p class="p-label">Sources</p>
        <ol class="sheet-sources">${cited.map((sid, i) => {
          const src = G.sources[sid];
          return `<li id="src-${i + 1}"><a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.title)}</a>, ${esc(src.publisher)}</li>`;
        }).join("")}</ol>
      </section>` : ""}
      <p class="sheet-small">General advice from the sources above, not a diagnosis. If something looks badly wrong, a local garden centre or plant clinic can look at the real thing.</p>
    `;
  }

  /* ---------------------------------------------------------
     12. ELEPHANT EARS
     Big alocasia-style leaves rise from the bottom corners of
     the window, behind everything, nodding in a slow breeze
     (CSS animates them; reduced motion keeps them still).
     One leaf is drawn once and reused at different sizes.
     --------------------------------------------------------- */
  function drawEars() {
    const leaf = `<symbol id="ear-leaf" viewBox="0 0 200 260" overflow="visible">
      <defs>
        <linearGradient id="ear-grad" x1="0" y1="0" x2="1" y2="1">
          <stop class="ear-stop-lit" offset="0"/><stop class="ear-stop" offset=".5"/><stop class="ear-stop-dk" offset="1"/>
        </linearGradient>
      </defs>
      <path class="ear-blade-fill" fill="url(#ear-grad)" d="M100,48 C88,22 50,8 26,22 C2,38 2,92 22,140 C42,188 80,228 100,252 C120,228 158,188 178,140 C198,92 198,38 174,22 C150,8 112,22 100,48Z"/>
      <path class="ear-shade" d="M100,52 C100,120 100,190 100,250 C120,228 158,188 178,140 C198,92 198,38 174,22 C150,8 112,22 100,48Z"/>
      <path class="ear-vein ear-vein--mid" d="M100,56 L100,244"/>
      <path class="ear-vein" d="M100,60 C80,44 56,30 34,30 M100,60 C120,44 144,30 166,30
        M100,82 C76,82 44,84 18,100 M100,82 C124,82 156,84 182,100
        M100,112 C78,116 50,128 26,150 M100,112 C122,116 150,128 174,150
        M100,146 C82,152 62,166 46,188 M100,146 C118,152 138,166 154,188
        M100,180 C88,188 78,200 70,216 M100,180 C112,188 122,200 130,216"/>
      <path class="ear-rim" d="M100,48 C88,22 50,8 26,22 C2,38 2,92 22,140 C42,188 80,228 100,252 C120,228 158,188 178,140 C198,92 198,38 174,22 C150,8 112,22 100,48Z"/>
    </symbol>`;
    // [base x, petiole bend, where it meets the blade, blade angle, size, sway seconds]
    const EARS = [
      [6, [24, 820], [70, 600], 22, 0.95, 11],
      [22, [80, 720], [168, 400], -18, 1.3, 9],
      [70, [120, 920], [236, 760], -34, 0.78, 7.5],
    ];
    const side = (cls) => `<svg class="ear-side ${cls}" viewBox="0 0 420 1000" preserveAspectRatio="xMinYMax meet" focusable="false">
      ${EARS.map(([bx, bend, [ax, ay], ang, sz, secs], i) => `
        <g class="ear ear--${i + 1}" style="transform-origin:${bx}px 1000px; --sway:${secs}s; --delay:${-i * 2.3}s">
          <path class="ear-stem" d="M${bx},1000 Q${bend[0]},${bend[1]} ${ax},${ay}"/>
          <g class="ear-flutter" style="transform-origin:${ax}px ${ay}px; --delay:${-i * 1.7}s">
            <use href="#ear-leaf" width="200" height="260" transform="translate(${ax} ${ay}) rotate(${ang}) scale(${sz}) translate(-100 -60)"/>
          </g>
        </g>`).join("")}
    </svg>`;
    const wrap = document.createElement("div");
    wrap.className = "gh-ears";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `<svg width="0" height="0" style="position:absolute">${leaf}</svg>${side("ear-side--l")}${side("ear-side--r")}`;
    document.body.prepend(wrap);
  }

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */
  drawEars();
  buildScene();
  updateLight();
  requestAnimationFrame(() => requestAnimationFrame(() => house.classList.add("is-lit")));
  setInterval(updateLight, 30 * 1000);

  const redraw = () => { drawGlass(); drawFamily(); };
  new ResizeObserver(redraw).observe(house);
  floor.querySelectorAll(".bench-scroll").forEach((el) => el.addEventListener("scroll", drawFamily, { passive: true }));
  if (document.fonts) document.fonts.ready.then(drawFamily);

  // Hold the animations still while the glasshouse is off-screen
  new IntersectionObserver(([e]) => house.classList.toggle("is-paused", !e.isIntersecting)).observe(house);

  floor.addEventListener("click", (e) => {
    const btn = e.target.closest(".plant");
    if (btn) openSheet(btn.dataset.id, btn);
  });
  placeHawk();
  renderWeek();
  // A new day while the page is open: refresh the list
  setInterval(() => { if (todayISO() !== shownDay) renderWeek(); }, 60 * 1000);
})();
