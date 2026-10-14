/* =========================================================
   COURSE RECORDS · script
   ---------------------------------------------------------
   Reads RACES from data.js and builds:
   1. The records strip (personal bests, distance, count)
   2. The medal rail (ribbons, medals, the empty next hook)
   3. The journal panel (paces, elevation line, notes)
   ========================================================= */
(() => {
  "use strict";

  const races = [...RACES].sort((a, b) => a.date.localeCompare(b.date));
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------
     Small helpers
     --------------------------------------------------------- */
  const KM_PER_MILE = 1.609344;

  // "4:47:42" → 17262 seconds
  function toSeconds(time) {
    return time.split(":").map(Number).reduce((total, part) => total * 60 + part, 0);
  }

  // 17262 → "4:47:42" (or "6:49" for paces under an hour)
  function formatSeconds(total) {
    total = Math.round(total);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
  }

  // Named distances; anything else is shown in km
  const DISTANCES = [
    { km: 42.195, name: "Marathon", short: "42.2 km" },
    { km: 21.0975, name: "Half marathon", short: "21.1 km" },
    { km: 10, name: "10K", short: "10 km" },
    { km: 5, name: "5K", short: "5 km" },
  ];
  function distanceInfo(km) {
    const named = DISTANCES.find((d) => Math.abs(d.km - km) < 0.05);
    return named || { km, name: `${+km.toFixed(2)} km`, short: `${+km.toFixed(1)} km` };
  }

  // "2024-11-10" → "10 Nov 2024", "2026-10" → "Oct 2026", "2025" → "2025"
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function formatDate(date, long = false) {
    const [y, m, d] = date.split("-").map(Number);
    if (!m) return String(y);
    const month = (long ? MONTHS_LONG : MONTHS)[m - 1];
    return d ? `${d} ${month} ${y}` : `${month} ${y}`;
  }
  const year = (date) => date.slice(0, 4);
  const shortName = (race) => race.name.split(" ")[0];   // "Athens", "Hampton"…

  function el(tag, attrs = {}, text) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------------------------------------------------------
     1. RECORDS STRIP
     --------------------------------------------------------- */
  function buildRecords() {
    const list = document.getElementById("records");
    const best = new Map();
    for (const race of races) {
      const info = distanceInfo(race.distanceKm);
      const current = best.get(info.name);
      if (!current || toSeconds(race.time) < toSeconds(current.race.time)) best.set(info.name, { info, race });
    }

    const add = (label, value, note, extraClass = "") => {
      const item = el("div", { class: `record ${extraClass}`.trim() });
      item.append(el("dt", {}, label), el("dd", {}, value));
      if (note) item.append(el("p", { class: "record-note" }, note));
      list.append(item);
    };

    // Longest distance first
    [...best.values()]
      .sort((a, b) => b.info.km - a.info.km)
      .forEach(({ info, race }) =>
        add(`${info.name} best`, race.time, `${shortName(race)} · ${year(race.date)}`, "record--pb"));

    const totalKm = races.reduce((sum, r) => sum + r.distanceKm, 0);
    add("Race distance", `${totalKm.toFixed(2)} km`, `${(totalKm / KM_PER_MILE).toFixed(1)} mi`);
    add("Races", String(races.length), races.length ? `Since ${year(races[0].date)}` : "");
  }

  /* ---------------------------------------------------------
     2. MEDAL DRAWINGS
     Everything is drawn on a 168 × 340 canvas: the ribbon
     hangs from the rail at the top, the medal below it.
     --------------------------------------------------------- */
  const W = 168, CX = 84, CY = 254, R = 70;

  // Each pebble is a circle nudged by a few gentle waves
  const SHAPES = {
    1: [[2, 0.045, 0.4], [3, 0.03, 1.9]],
    2: [[2, 0.05, 2.2], [3, 0.025, 0.3], [5, 0.012, 1.0]],
    3: [[2, 0.04, 1.1], [4, 0.025, 2.6]],
    4: [[3, 0.045, 0.8], [2, 0.03, 2.9]],
  };

  function pebbleRadius(shape, angle) {
    return (SHAPES[shape] || SHAPES[1]).reduce((r, [k, amp, phase]) => r * (1 + amp * Math.sin(k * angle + phase)), 1);
  }

  // A smooth closed outline (Catmull-Rom curve through 16 points)
  function pebblePath(shape, cx, cy, r) {
    const n = 16;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const rr = r * pebbleRadius(shape, a);
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    });
    const f = (v) => v.toFixed(1);
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + "Z";
  }

  // Original line drawings on a 64 × 64 grid, "engraved" into the medal
  const ICONS = {
    // An Ionic column with an olive sprig growing beside it
    column: `
      <path d="M12 14H42"/>
      <path d="M10 16Q10 24 15.5 24Q19.5 24 19.5 20Q19.5 17 16.8 17Q14.6 17 14.6 19.3"/>
      <path d="M44 16Q44 24 38.5 24Q34.5 24 34.5 20Q34.5 17 37.2 17Q39.4 17 39.4 19.3"/>
      <path d="M19.5 20.5Q27 23.5 34.5 20.5"/>
      <path d="M20 25L19.2 54M34 25L34.8 54"/>
      <path class="fine" d="M23.6 26V54M27 26V54M30.4 26V54"/>
      <path d="M15 54H39M13 58.5H41"/>
      <path d="M46 59Q58 44 54 19"/>
      <g class="leaf">
        <path transform="translate(51 50.4) rotate(-25)" d="M0 0Q4.5-3.2 9 0Q4.5 3.2 0 0Z"/>
        <path transform="translate(53 44.6) rotate(205)" d="M0 0Q4.5-3.2 9 0Q4.5 3.2 0 0Z"/>
        <path transform="translate(54.4 39.5) rotate(-45)" d="M0 0Q4.5-3.2 9 0Q4.5 3.2 0 0Z"/>
        <path transform="translate(55 31.4) rotate(215)" d="M0 0Q4.2-3 8.4 0Q4.2 3 0 0Z"/>
        <path transform="translate(54.7 25) rotate(-60)" d="M0 0Q4-2.8 8 0Q4 2.8 0 0Z"/>
        <path transform="translate(54 19.5) rotate(-100)" d="M0 0Q3.6-2.6 7.2 0Q3.6 2.6 0 0Z"/>
      </g>`,

    // A wave curling over at sunrise, with swells below
    wave: `
      <circle cx="13" cy="14" r="4.5"/>
      <path d="M4 50C16 48 20 26 34 20C46 15 58 22 58 34C58 42 50 45 46 40C42 35 46 30 50 32"/>
      <path d="M18 50C25 44 29 34 38 30C43 28 48 29 50 32"/>
      <path class="fine" d="M27 47C31 42 34 38 40 36"/>
      <path d="M4 56Q12 52 20 56T36 56T52 56T60 56"/>
      <path class="fine" d="M10 61.5Q18 58 26 61.5T42 61.5T56 61.5"/>
      <g class="dot"><circle cx="24" cy="24" r="1.3"/><circle cx="19" cy="29.5" r="1"/><circle cx="29" cy="18.5" r="1"/></g>`,

    // A lighthouse on the rocks, sweeping its light
    lighthouse: `
      <path d="M24 56L28 24H36L40 56"/>
      <path class="band" d="M25.1 47.5H38.9L38.2 42H25.8Z"/>
      <path class="band" d="M26.5 36.5H37.5L36.8 31H27.2Z"/>
      <path d="M24.5 24H39.5"/>
      <path d="M29 24V15.5H35V24"/>
      <path d="M27.5 15.5L32 9.5L36.5 15.5Z"/>
      <path d="M32 9.5V6"/>
      <path class="fine" d="M29 18L7 12M29 21.5L7 27M35 18L57 12M35 21.5L57 27"/>
      <path d="M30.5 56V51.5Q32 49.8 33.5 51.5V56"/>
      <path d="M13 58.5Q19 53.5 25 56.5Q32 52.5 39 56.5Q46 54 51 58.5"/>
      <path class="fine" d="M6 62Q14 59 22 62T38 62T54 62T62 62"/>`,
  };

  // Ribbon colour names from data.js → design-system colours
  const PALETTE = {
    terracotta: "var(--terracotta)", olive: "var(--olive)", aegean: "var(--aegean)",
    ochre: "var(--ochre)", ink: "var(--ink)", limestone: "var(--limestone)",
    sky: "var(--sky)",
  };
  const colour = (name) => PALETTE[name] || name;

  // The ribbon: draped over the rail, ending in a notched point
  const RIBBON = "M62 22Q62 4 84 4Q106 4 106 22V156L84 172L62 156Z";

  // Little things printed on a ribbon, on top of its colour
  const MOTIFS = {
    stripes: (c) => `
      <rect x="79" y="0" width="10" height="180" fill="${c}"/>
      <rect x="66" y="0" width="2.5" height="180" fill="${c}" opacity="0.55"/>
      <rect x="99.5" y="0" width="2.5" height="180" fill="${c}" opacity="0.55"/>`,
    // Soft tonal bands, with a bird flying up the ribbon
    bird: (c) => `
      <rect x="62" y="0" width="11" height="180" fill="${c}" opacity="0.22"/>
      <rect x="84" y="0" width="11" height="180" fill="${c}" opacity="0.22"/>
      <path d="${GULL}" transform="translate(84 128) scale(1.1)" fill="var(--ink)" opacity="0.8"/>`,
    // The race's name printed down the ribbon, in Greek and English
    lettering: (c) => `
      <g fill="${c}" font-family="var(--font-mono)" font-size="6.4" letter-spacing="1.1">
        <text transform="translate(76 26) rotate(90)">ΜΑΡΑΘΩΝΙΟΣ ΑΘΗΝΑΣ</text>
        <text transform="translate(95 30) rotate(90)">THE AUTHENTIC</text>
      </g>`,
    // Glowing jellyfish bells drifting down the ribbon
    bubbles: (c) => `
      <g fill="none" stroke="${c}" stroke-width="1.6" opacity="0.75">
        <circle cx="74" cy="40" r="9"/><circle cx="96" cy="76" r="12"/>
        <circle cx="72" cy="112" r="7"/><circle cx="94" cy="140" r="8"/>
      </g>
      <g fill="${c}" opacity="0.3">
        <circle cx="74" cy="40" r="5"/><circle cx="96" cy="76" r="7"/><circle cx="94" cy="140" r="4"/>
      </g>`,
  };

  // A gliding seabird, wings up, about 20 wide
  const GULL = "M-10 1C-7-4-3-5 0 0C3-5 7-4 10 1C7-1.5 3-1.5 0 3C-3-1.5-7-1.5-10 1Z";

  function ribbonSVG(id, [main, accent], motif = "stripes", race = {}) {
    return `
      <clipPath id="${id}-rib"><path d="${RIBBON}"/></clipPath>
      <g class="ribbon">
        <path d="${RIBBON}" fill="${colour(main)}"/>
        <g clip-path="url(#${id}-rib)">
          ${(MOTIFS[motif] || MOTIFS.stripes)(colour(accent), race)}
          <rect x="60" y="0" width="50" height="180" fill="url(#ribbon-fold)"/>
        </g>
        <path d="${RIBBON}" fill="none" class="ribbon-edge"/>
      </g>`;
  }

  const metalGradient = (id, tone) => `
    <radialGradient id="${id}" cx="38%" cy="32%" r="78%">
      <stop offset="0" style="stop-color: var(--${tone}-hi)"/>
      <stop offset="0.55" style="stop-color: var(--${tone})"/>
      <stop offset="1" style="stop-color: var(--${tone}-lo)"/>
    </radialGradient>`;

  // The finish time, struck into the metal (a light edge below a dark cut)
  const engraved = (x, y, text, extra = "") => `
    <text class="engrave engrave--lit ${extra}" x="${x}" y="${y + 0.8}" text-anchor="middle">${text}</text>
    <text class="engrave engrave--time ${extra}" x="${x}" y="${y}" text-anchor="middle">${text}</text>`;

  /* Each medal design returns its drawing and where its top edge is
     (so the little ring can join it to the ribbon). */
  const DESIGNS = {
    // A brass pebble with a line drawing (Athens, and the default)
    classic(race, id, i) {
      const shape = race.shape || ((i % 4) + 1);
      const outline = pebblePath(shape, CX, CY, R);
      const arcR = R * 0.7;
      const label = `${shortName(race)} · ${year(race.date)}`.toUpperCase();
      return {
        top: CY - R * pebbleRadius(shape, -Math.PI / 2),
        art: `
          <defs>${metalGradient(`${id}-metal`, "brass")}</defs>
          <path d="${outline}" fill="url(#${id}-metal)" class="medal-edge"/>
          <path d="${pebblePath(shape, CX - 16, CY - 22, R * 0.52)}" class="medal-sheen"/>
          <path d="${pebblePath(shape, CX, CY, R * 0.86)}" class="medal-rim" fill="none"/>
          <path id="${id}-arc" d="M${CX - arcR} ${CY} A${arcR} ${arcR} 0 0 1 ${CX + arcR} ${CY}" fill="none"/>
          <text class="engrave engrave--label"><textPath href="#${id}-arc" startOffset="50%" text-anchor="middle">${label}</textPath></text>
          <g class="icon" transform="translate(${CX - 33.6} ${CY - 44}) scale(1.05)">${ICONS[race.icon || race.medal] || ICONS.column}</g>
          ${engraved(CX, CY + 41, race.time)}`,
      };
    },

    // Athens: a bronze disc with an olive sprig, the kotinos
    kotinos(race, id) {
      const inner = R * 0.78, rimR = R * 0.875, botR = R * 0.93;
      const pt = (deg, r) => `${(CX + r * Math.cos(deg * Math.PI / 180)).toFixed(1)} ${(CY + r * Math.sin(deg * Math.PI / 180)).toFixed(1)}`;
      // A leaf: tip, base and how wide it is
      const leaf = (bx, by, tx, ty, w) => {
        const mx = (bx + tx) / 2, my = (by + ty) / 2;
        const dx = ty - by, dy = bx - tx, len = Math.hypot(dx, dy);
        const nx = (dx / len) * w, ny = (dy / len) * w;
        return `<path class="relief" d="M${bx} ${by}Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${tx} ${ty}Q${(mx - nx).toFixed(1)} ${(my - ny).toFixed(1)} ${bx} ${by}Z"/>`
          + `<path class="relief-vein" d="M${bx} ${by}L${tx} ${ty}"/>`;
      };
      return {
        top: CY - R,
        art: `
          <defs>${metalGradient(`${id}-metal`, "brass")}</defs>
          <circle cx="${CX}" cy="${CY}" r="${R}" fill="url(#${id}-metal)" class="medal-edge"/>
          <circle cx="${CX}" cy="${CY}" r="${inner}" fill="none" class="medal-rim"/>
          <path d="${pebblePath(1, CX - 18, CY - 24, R * 0.45)}" class="medal-sheen medal-sheen--soft"/>
          <path id="${id}-top" d="M${pt(150, rimR)}A${rimR} ${rimR} 0 1 1 ${pt(30, rimR)}" fill="none"/>
          <path id="${id}-bot" d="M${pt(150, botR)}A${botR} ${botR} 0 0 0 ${pt(30, botR)}" fill="none"/>
          <text class="engrave engrave--rim engrave--small"><textPath href="#${id}-top" startOffset="50%" text-anchor="middle">ATHENS MARATHON · THE AUTHENTIC</textPath></text>
          <text class="engrave engrave--rim engrave--small"><textPath href="#${id}-bot" startOffset="50%" text-anchor="middle">KOTINOS · ${year(race.date)}</textPath></text>
          <g class="sprig" transform="translate(${CX - 2} ${CY + 2}) scale(1.15) translate(${-CX} ${-CY})">
            <path class="relief-stem" d="M${CX - 24} ${CY + 24}C${CX - 18} ${CY + 6} ${CX - 16} ${CY - 14} ${CX - 12} ${CY - 40}"/>
            ${leaf(CX - 17, CY - 6, CX + 34, CY - 32, 9)}
            ${leaf(CX - 13, CY - 30, CX - 2, CY - 48, 4)}
            ${leaf(CX - 19, CY + 6, CX - 38, CY - 10, 4.5)}
            <path class="relief-stem relief-stem--fine" d="M${CX - 18} ${CY + 2}Q${CX - 10} ${CY + 4} ${CX - 6} ${CY + 10}M${CX - 20} ${CY + 12}Q${CX - 12} ${CY + 14} ${CX - 10} ${CY + 20}"/>
            <ellipse class="relief" cx="${CX - 4}" cy="${CY + 13}" rx="5" ry="6"/>
            <ellipse class="relief" cx="${CX - 8}" cy="${CY + 23}" rx="4.5" ry="5.5"/>
          </g>
          ${engraved(CX, CY + 47.5, race.time, "engrave--sm")}`,
      };
    },

    // Hampton: a silver disc, the sun rising out of the sea, a bird above
    sunrise(race, id) {
      const r = R, inner = R * 0.68, horizon = CY + 4;
      const top = CY - r;
      const arcTop = R * 0.79, arcBot = R * 0.86;
      const rays = Array.from({ length: 11 }, (_, k) => {
        const a = Math.PI + (k + 1) * (Math.PI / 12);
        const r1 = 21, r2 = k % 2 ? 29 : 36;
        return `M${(CX + r1 * Math.cos(a)).toFixed(1)} ${(horizon + r1 * Math.sin(a)).toFixed(1)}L${(CX + r2 * Math.cos(a)).toFixed(1)} ${(horizon + r2 * Math.sin(a)).toFixed(1)}`;
      }).join("");
      return {
        top,
        ring: "medal-ring--silver",
        art: `
          <defs>
            ${metalGradient(`${id}-metal`, "silver")}
            <clipPath id="${id}-window"><circle cx="${CX}" cy="${CY}" r="${inner}"/></clipPath>
          </defs>
          <circle cx="${CX}" cy="${CY}" r="${r}" fill="url(#${id}-metal)" class="medal-edge medal-edge--silver"/>
          <circle cx="${CX}" cy="${CY}" r="${inner + 2.5}" fill="none" class="silver-cut"/>
          <g clip-path="url(#${id}-window)">
            <rect x="${CX - inner}" y="${CY - inner}" width="${inner * 2}" height="${inner + 4}" class="enamel-sky"/>
            <path d="${rays}" class="sun-rays"/>
            <path d="M${CX - 17} ${horizon}A17 17 0 0 1 ${CX + 17} ${horizon}Z" fill="url(#${id}-metal)" class="silver-line"/>
            <rect x="${CX - inner}" y="${horizon}" width="${inner * 2}" height="${inner}" fill="url(#${id}-metal)"/>
            <path class="silver-line" fill="none" d="M${CX - inner} ${horizon}H${CX + inner}"/>
            <path class="sea-line" d="M${CX - 44} ${horizon + 8}q8-3 16 0t16 0t16 0t16 0t16 0M${CX - 36} ${horizon + 14}q8-3 16 0t16 0t16 0t16 0"/>
            <path d="${GULL}" transform="translate(${CX + 14} ${CY - 34}) scale(0.85)" class="enamel-bird"/>
          </g>
          <path d="${pebblePath(1, CX - 20, CY - 26, R * 0.4)}" class="medal-sheen medal-sheen--soft"/>
          <path id="${id}-top" d="M${CX - arcTop} ${CY} A${arcTop} ${arcTop} 0 0 1 ${CX + arcTop} ${CY}" fill="none"/>
          <path id="${id}-bot" d="M${CX - arcBot} ${CY} A${arcBot} ${arcBot} 0 0 0 ${CX + arcBot} ${CY}" fill="none"/>
          <text class="engrave engrave--rim"><textPath href="#${id}-top" startOffset="50%" text-anchor="middle">${shortName(race).toUpperCase()}</textPath></text>
          <text class="engrave engrave--rim engrave--small"><textPath href="#${id}-bot" startOffset="50%" text-anchor="middle">HALF MARATHON · ${year(race.date)}</textPath></text>
          ${engraved(CX, horizon + 34, race.time, "engrave--sm")}`,
      };
    },

    // Newport: an enamel jellyfish, the time struck into its bell
    jellyfish(race, id) {
      const top = 182, bellBase = 238;
      const bell = `M26 ${bellBase}C24 204 50 ${top} 84 ${top}C118 ${top} 144 204 142 ${bellBase}`
        + `Q133 ${bellBase - 5} 125 ${bellBase + 2}Q116 ${bellBase - 5} 105 ${bellBase + 2}Q94 ${bellBase - 5} 84 ${bellBase + 2}`
        + `Q74 ${bellBase - 5} 63 ${bellBase + 2}Q52 ${bellBase - 5} 43 ${bellBase + 2}Q34 ${bellBase - 5} 26 ${bellBase}Z`;

      // Each tentacle: start x, length, sway, thickness, colour
      const tentacles = [
        [36, 62, 7, 5, "tent-a"], [50, 84, -8, 6, "tent-b"], [63, 94, 9, 6.5, "tent-a"],
        [105, 94, -9, 6.5, "tent-a"], [118, 84, 8, 6, "tent-b"], [132, 62, -7, 5, "tent-a"],
        [74, 96, -7, 7, "tent-c"], [94, 96, 7, 7, "tent-c"],
      ].map(([x, len, sway, w, cls]) => {
        const y0 = bellBase - 2, s = len / 4;
        const d = `M${x} ${y0}C${x + sway} ${y0 + s} ${x - sway} ${y0 + s * 2} ${x} ${y0 + s * 2.2}`
          + `S${x + sway} ${y0 + s * 3.4} ${x + sway * 0.4} ${y0 + len}`;
        return `<path d="${d}" class="tent-edge" stroke-width="${w + 2.6}"/><path d="${d}" class="${cls}" stroke-width="${w}"/>`;
      }).join("");

      // The frilly centre arm, with little bubbles
      const arm = `M84 ${bellBase}C78 252 90 262 82 274C76 284 90 294 84 308`;
      const bubbles = [[79, 256, 1.8], [88, 268, 1.4], [80, 284, 1.6], [87, 298, 1.2], [70, 262, 1.2], [99, 280, 1.3]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");

      return {
        top,
        ring: "medal-ring--copper",
        art: `
          <defs>
            <radialGradient id="${id}-bell" cx="40%" cy="20%" r="85%">
              <stop offset="0" style="stop-color: var(--jelly-hi)"/>
              <stop offset="0.6" style="stop-color: var(--jelly)"/>
              <stop offset="1" style="stop-color: var(--jelly-lo)"/>
            </radialGradient>
          </defs>
          <g class="jelly">
            ${tentacles}
            <path d="${arm}" class="tent-edge" stroke-width="11"/>
            <path d="${arm}" class="tent-arm" stroke-width="8.5"/>
            <g class="jelly-bubbles">${bubbles}</g>
            <path d="${bell}" fill="url(#${id}-bell)" class="jelly-edge"/>
            <path class="jelly-lines" d="M40 228C42 208 60 194 84 192C108 194 126 208 128 228M56 ${bellBase - 4}C56 220 68 208 84 206M112 ${bellBase - 4}C112 220 100 208 84 206"/>
            <path d="M46 214C50 198 64 190 78 188" class="jelly-sheen"/>
          </g>
          <text class="engrave engrave--jelly-label" x="${CX}" y="208" text-anchor="middle">${shortName(race).toUpperCase()} · ${year(race.date)}</text>
          <text class="engrave engrave--jelly-shadow" x="${CX}" y="227.8" text-anchor="middle">${race.time}</text>
          <text class="engrave engrave--jelly" x="${CX}" y="227" text-anchor="middle">${race.time}</text>`,
      };
    },
  };

  function medalSVG(race, i, prefix = "m") {
    const id = `${prefix}${i}`;
    let top, face, ring = "";

    if (race.photo) {
      // A real photo, cropped into a pebble
      const shape = race.shape || ((i % 4) + 1);
      const outline = pebblePath(shape, CX, CY, R);
      top = CY - R * pebbleRadius(shape, -Math.PI / 2);
      face = `<clipPath id="${id}-clip"><path d="${outline}"/></clipPath>
         <image href="${race.photo.src}" x="${CX - R * 1.1}" y="${CY - R * 1.1}" width="${R * 2.2}" height="${R * 2.2}"
                preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}-clip)"/>
         <path d="${outline}" class="medal-edge" fill="none"/>`;
    } else {
      ({ top, art: face, ring = "" } = (DESIGNS[race.medal] || DESIGNS.classic)(race, id, i));
    }

    return `
      <svg class="medal-art" viewBox="0 0 ${W} 340" aria-hidden="true" focusable="false">
        ${ribbonSVG(id, race.ribbon || ["terracotta", "ochre"], race.ribbonMotif, race)}
        <ellipse class="medal-ring ${ring}" cx="${CX}" cy="${(172 + top) / 2 + 1}" rx="6.5" ry="${Math.max(5, (top - 168) / 2)}"/>
        ${face}
      </svg>`;
  }

  // The empty hook at the end of the rail
  function nextSVG() {
    const outline = pebblePath(4, CX, CY, R);
    return `
      <svg class="medal-art" viewBox="0 0 ${W} 340" aria-hidden="true" focusable="false">
        <path d="${RIBBON}" class="ghost"/>
        <path d="${outline}" class="ghost"/>
        <text class="ghost-mark" x="${CX}" y="${CY + 12}" text-anchor="middle">?</text>
      </svg>`;
  }

  /* ---------------------------------------------------------
     3. THE MEDAL RAIL
     --------------------------------------------------------- */
  function buildRail() {
    const track = document.getElementById("rail-track");

    // Shared shading for every ribbon fold
    const shared = document.createElementNS(SVG_NS, "svg");
    shared.setAttribute("class", "rail-defs");
    shared.setAttribute("aria-hidden", "true");
    shared.innerHTML = `
      <defs>
        <linearGradient id="ribbon-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity="0.32"/>
          <stop offset="0.12" stop-color="#000" stop-opacity="0"/>
          <stop offset="0.85" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.18"/>
        </linearGradient>
      </defs>`;
    track.before(shared);

    races.forEach((race, i) => {
      const info = distanceInfo(race.distanceKm);
      const item = el("li", { class: "hook" });

      const button = el("button", { class: "hang", type: "button", "data-index": i });
      button.setAttribute("aria-label", `${race.name}, ${formatDate(race.date, true)}, ${info.name.toLowerCase()} in ${race.time}. Open its journal page.`);
      button.innerHTML = `<span class="swing">${medalSVG(race, i)}</span>`;
      if (race.photo) button.querySelector(".medal-art").insertAdjacentHTML("afterbegin", `<title>${race.photo.alt}</title>`);

      const caption = el("div", { class: "hook-caption" });
      caption.append(
        el("p", { class: "hook-date" }, `${formatDate(race.date)} · ${info.short}`),
        el("p", { class: "hook-name" }, race.name),
        el("p", { class: "hook-place" }, race.place),
      );

      item.append(button, caption);
      track.append(item);
    });

    // The next race, still to come
    const next = el("li", { class: "hook hook--next" });
    const art = el("div", { class: "hang hang--next" });
    art.innerHTML = `${nextSVG()}<span class="stamp stamp--next hook-stamp">Expedition ongoing</span>`;
    const caption = el("div", { class: "hook-caption" });
    caption.append(
      el("p", { class: "hook-date" }, NEXT_RACE.date ? formatDate(NEXT_RACE.date) : "Date to come"),
      el("p", { class: "hook-name" }, NEXT_RACE.name || "The next race"),
      el("p", { class: "hook-place" }, NEXT_RACE.name ? "Training now" : "Still choosing"),
    );
    next.append(art, caption);
    track.append(next);

    track.addEventListener("click", (e) => {
      const button = e.target.closest(".hang[data-index]");
      if (button) openRace(Number(button.dataset.index), button);
    });
  }

  /* ---------------------------------------------------------
     4. THE JOURNAL PANEL
     --------------------------------------------------------- */
  const panelEl = document.getElementById("panel");
  const panelBody = document.getElementById("panel-body");
  const sheet = FieldNotes.panel(panelEl, {
    onClose() {
      document.querySelectorAll(".hang.is-open").forEach((b) => b.classList.remove("is-open"));
    },
  });

  // A smooth line through [x, y] points (no overshoot on flat stretches)
  function smoothLine(pts) {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      c1[1] = Math.min(Math.max(c1[1], Math.min(p1[1], p2[1])), Math.max(p1[1], p2[1]));
      c2[1] = Math.min(Math.max(c2[1], Math.min(p1[1], p2[1])), Math.max(p1[1], p2[1]));
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }

  // The course's elevation as a contour line, with fainter echoes below it
  function profileSVG(race) {
    const { points } = race.profile;
    const w = 400, h = 150, left = 8, right = 8, top = 26, bottom = 26;
    const maxKm = race.distanceKm;
    const peak = points.reduce((a, b) => (b[1] > a[1] ? b : a));
    const ceiling = Math.max(60, peak[1] * 1.15);   // flat courses still look flat
    const x = (km) => left + (km / maxKm) * (w - left - right);
    const y = (m) => h - bottom - (m / ceiling) * (h - top - bottom);
    const pts = points.map(([km, m]) => [x(km), y(m)]);
    const line = smoothLine(pts);
    const floor = h - bottom;

    const echoes = [7, 14, 21].map((dy, k) =>
      `<path d="${line}" transform="translate(0 ${dy})" class="profile-echo" style="opacity:${0.5 - k * 0.14}"/>`).join("");
    const ticks = [0, maxKm / 2, maxKm].map((km, k) =>
      `<text x="${x(km)}" y="${h - 6}" text-anchor="${["start", "middle", "end"][k]}">${km ? km.toFixed(1) : 0} km</text>`).join("");

    return `
      <svg class="profile" viewBox="0 0 ${w} ${h}" role="img"
           aria-label="${race.profile.sketch ? "A rough sketch of a flat course." : `Approximate elevation of the course. Highest point about ${peak[1]} metres, near km ${Math.round(peak[0])}.`}">
        <defs>
          <clipPath id="profile-clip"><rect x="0" y="0" width="${w}" height="${floor}"/></clipPath>
          <linearGradient id="profile-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style="stop-color: var(--accent); stop-opacity: 0.16"/>
            <stop offset="1" style="stop-color: var(--accent); stop-opacity: 0"/>
          </linearGradient>
        </defs>
        <path d="M${left} ${floor}H${w - right}" class="profile-base"/>
        <path d="${line} L${pts[pts.length - 1][0]} ${floor} L${pts[0][0]} ${floor}Z" fill="url(#profile-fill)"/>
        <g clip-path="url(#profile-clip)">${echoes}</g>
        <path d="${line}" class="profile-line"/>
        ${race.profile.sketch ? "" : `
        <circle cx="${x(peak[0])}" cy="${y(peak[1])}" r="3.5" class="profile-peak"/>
        <text x="${Math.min(Math.max(x(peak[0]), 40), w - 40)}" y="${y(peak[1]) - 10}" text-anchor="middle" class="profile-label">≈ ${peak[1]} m</text>`}
        <g class="profile-ticks">${ticks}</g>
      </svg>`;
  }

  function openRace(i, button) {
    const race = races[i];
    const info = distanceInfo(race.distanceKm);
    const seconds = toSeconds(race.time);
    const perKm = formatSeconds(seconds / race.distanceKm);
    const perMile = formatSeconds(seconds / (race.distanceKm / KM_PER_MILE));
    const miles = (race.distanceKm / KM_PER_MILE).toFixed(1);
    const dateKnown = race.date.length === 10;

    const notes = race.notes
      ? `<p class="p-note">${race.notes}</p>`
      : `<p class="p-empty">No notes yet. Tell Claude what you remember and it will go here.</p>`;

    const sources = [...(race.sources || []), ...(race.profile ? [race.profile.source] : [])]
      .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join("");

    panelBody.innerHTML = `
      <div class="p-medal">${medalSVG(race, i, "p").replace('viewBox="0 0 168 340"', 'viewBox="0 168 168 172"')}</div>
      <p class="p-coords"><span class="crosshair" aria-hidden="true"></span> ${race.coords} · ${formatDate(race.date, true)}${dateKnown ? "" : " · day to fill in"}</p>
      <h2 class="p-title" id="panel-title">${race.name}</h2>
      ${race.edition ? `<p class="p-edition">${race.edition}</p>` : ""}
      <p class="p-place">${race.place}</p>

      <dl class="p-stats">
        <div class="p-stat p-stat--time"><dt>Finish time</dt><dd>${race.time}</dd></div>
        <div class="p-stat"><dt>Distance</dt><dd>${race.distanceKm} km</dd><p>${info.name} · ${miles} mi</p></div>
        <div class="p-stat"><dt>Pace per km</dt><dd>${perKm}</dd><p>min:sec</p></div>
        <div class="p-stat"><dt>Pace per mile</dt><dd>${perMile}</dd><p>min:sec</p></div>
      </dl>

      <section class="p-section">
        <p class="p-label">The course</p>
        <p class="p-text">${race.course}</p>
        ${race.profile ? `
          <figure class="p-profile">
            ${profileSVG(race)}
            <figcaption><span class="in-progress">Approximate</span> ${race.profile.note}</figcaption>
          </figure>` : ""}
      </section>

      <section class="p-section">
        <p class="p-label">My notes</p>
        ${notes}
      </section>

      <p class="p-section"><a class="btn" href="${race.link}" target="_blank" rel="noopener">Official race site ↗<span class="visually-hidden"> (opens in a new tab)</span></a></p>

      <div class="p-sources"><p>Sources</p><ul>${sources}</ul></div>`;

    document.querySelectorAll(".hang.is-open").forEach((b) => b.classList.remove("is-open"));
    button.classList.add("is-open");
    sheet.open(button);
  }

  buildRecords();
  buildRail();
})();
