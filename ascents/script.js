/* =========================================================
   ASCENTS · script
   ---------------------------------------------------------
   Reads ASCENTS from data.js and builds:
   1. The hero figures
   2. The rack (two slings of carabiners, V0 to V10)
   3. The projects board
   4. Outdoor: a sketch of the Fells and each boulder's problems
   5. The ticklist
   6. Indoor progression chart
   7. Session log
   8. Lessons
   ========================================================= */
(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const GRADES = Array.from({ length: 11 }, (_, i) => i);   // V0 … V10

  /* ---------------------------------------------------------
     Small helpers
     --------------------------------------------------------- */
  // "V2+" → 2, null → null
  const gradeNum = (g) => (g ? parseInt(String(g).replace(/^V/i, ""), 10) : null);

  function el(tag, attrs = {}, text) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text != null) node.textContent = text;
    return node;
  }

  const gyms = new Map(ASCENTS.gyms.map((g) => [g.id, g]));
  const boulders = new Map();
  const problems = new Map();   // problem name → { problem, boulder }
  for (const area of ASCENTS.areas) {
    for (const b of area.boulders) {
      boulders.set(b.id, { ...b, area });
      for (const p of b.problems) problems.set(p.name, { ...p, boulder: b });
    }
  }

  /* ---------------------------------------------------------
     1. HERO FIGURES
     --------------------------------------------------------- */
  function buildHero() {
    const dl = document.getElementById("hero-figures");
    const add = (label, value, note, cls = "") => {
      const item = el("div", { class: `figure ${cls}`.trim() });
      item.append(el("dt", {}, label), el("dd", {}, value));
      if (note) item.append(el("p", { class: "figure-note" }, note));
      dl.append(item);
    };

    const somerville = ASCENTS.gyms.find((g) => g.before && g.before.slab);
    const styleNote = somerville ? `${somerville.before.slab} on slab · ${somerville.before.overhang} on overhang` : "";
    add("Indoor range", ASCENTS.indoorRange, styleNote);

    const project = ASCENTS.projects.find((p) => p.status === "projecting");
    if (project) {
      const b = boulders.get(project.boulder);
      add("Outdoor project", project.problem, `${project.grade} · ${b ? b.name : ""}`, "figure--project");
    }
  }

  /* ---------------------------------------------------------
     2. THE RACK
     Works out, for each grade, whether it's sent, being
     projected, and how many sends are logged.
     --------------------------------------------------------- */
  const blankRack = () => GRADES.map((g) => ({ grade: g, sends: 0, before: false, projecting: false, items: [] }));

  function indoorRack() {
    const rack = blankRack();

    // What I'd sent before the journal began
    for (const gym of ASCENTS.gyms) {
      const b = gym.before || {};
      const slab = gradeNum(b.slab), over = gradeNum(b.overhang), best = gradeNum(b.best);
      const top = Math.max(slab ?? -1, over ?? -1, best ?? -1);
      for (let g = 0; g <= top && g < rack.length; g++) {
        rack[g].before = true;
        let style = "";
        if (slab != null && over != null) style = g <= over ? " (slab and overhang)" : " (slab only)";
        rack[g].items.push(`Before the log: ${gym.name}${style}`);
      }
    }

    // Logged sessions
    for (const s of ASCENTS.sessions) {
      if (!gyms.has(s.place)) continue;
      for (const c of s.climbs || []) {
        const g = gradeNum(c.grade);
        if (g == null || !rack[g]) continue;
        const what = [c.wall, c.holds && `${c.holds} holds`, c.style].filter(Boolean).join(", ");
        if (c.result === "send" || c.result === "flash") rack[g].sends++;
        rack[g].items.push(`${s.date} · ${c.result}${what ? ` · ${what}` : ""}`);
      }
    }
    return rack;
  }

  function outdoorRack() {
    const rack = blankRack();
    const unplaced = [];

    for (const p of problems.values()) {
      const g = gradeNum(p.grade);
      if (g == null) {
        if (p.status) unplaced.push(p);
        continue;
      }
      if (p.status === "sent") {
        rack[g].sends++;
        rack[g].items.push(`${p.name}, ${p.grade} · ${p.boulder.name} · sent`);
      }
      if (p.status === "projecting") {
        rack[g].projecting = true;
        rack[g].items.push(`${p.name}, ${p.grade} · ${p.boulder.name} · projecting`);
      }
    }

    // Logged outdoor sends (each one adds a tick)
    for (const s of ASCENTS.sessions) {
      if (!boulders.has(s.place)) continue;
      for (const c of s.climbs || []) {
        const p = problems.get(c.problem);
        const g = p && gradeNum(p.grade);
        if (g == null || !rack[g]) continue;
        if (c.result === "send" || c.result === "flash") rack[g].sends++;
        rack[g].items.push(`${s.date} · ${c.problem} · ${c.result}`);
      }
    }
    return { rack, unplaced };
  }

  // One carabiner, about 38 × 70, hanging from its top
  // A D-shaped carabiner: the spine on the left, the gate on the right
  const BODY = "M31 21C31 11 26 5 17.5 5C9 5 4 11 4 20V51C4 60.5 10 66 18.5 66C27 66 33 60.5 33 52";
  const GATE = "M33 52L31.4 22";
  const FILL = BODY + "L31.4 22Z";

  function sling({ title, rack, colour, note }) {
    const W = 1100, H = 214, x0 = 24, x1 = W - 24, ends = 30, sag = 80;
    const xs = GRADES.map((g) => 96 + g * ((W - 192) / 10));
    const yAt = (x) => {
      const t = (x - x0) / (x1 - x0);
      return (1 - t) * (1 - t) * ends + 2 * (1 - t) * t * (sag * 2 - ends) + t * t * ends;   // the webbing's curve
    };

    const wrap = el("figure", { class: "sling" });
    wrap.append(el("figcaption", { class: "sling-title" }, title));

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("class", "sling-art");
    svg.style.setProperty("--webbing", colour);

    const webbing = `M${x0} ${ends}Q${W / 2} ${sag * 2 - ends} ${x1} ${ends}`;
    let html = `
      <circle class="bolt" cx="${x0}" cy="${ends}" r="7"/><circle class="bolt" cx="${x1}" cy="${ends}" r="7"/>
      <path class="webbing" d="${webbing}"/>
      <path class="webbing-stitch" d="${webbing}"/>`;

    rack.forEach((r, i) => {
      const x = xs[i], y = yAt(x);
      const sent = r.sends > 0 || r.before;
      const state = sent ? "sent" : r.projecting ? "projecting" : "empty";
      const ticks = r.sends ? "ǀ".repeat(Math.min(r.sends, 12)) + (r.sends > 12 ? "+" : "") : r.before ? "·" : "";
      const label = `V${r.grade}: ${sent ? "sent" : r.projecting ? "projecting" : "not yet"}`
        + `${r.sends ? `, ${r.sends} logged send${r.sends > 1 ? "s" : ""}` : ""}`
        + `${r.projecting && sent ? ", also projecting" : ""}.`;
      html += `
        <g class="biner biner--${state}${r.projecting ? " biner--gate-open" : ""}" data-i="${i}" tabindex="0" role="button" aria-label="${label}">
          <g transform="translate(${x - 19} ${y - 6})"><g class="biner-body">
            <rect class="biner-hit" x="-8" y="-4" width="54" height="${H - y + 2}"/>
            <path class="biner-fill" d="${FILL}"/>
            <path class="biner-line" d="${BODY}"/>
            <path class="biner-line biner-gate" d="${GATE}"/>
            <path class="biner-hollow" d="${BODY}"/>
            <path class="biner-hollow biner-gate" d="${GATE}"/>
          </g></g>
          <text class="biner-grade" x="${x}" y="${y + 86}" text-anchor="middle">V${r.grade}</text>
          <text class="biner-ticks" x="${x}" y="${y + 104}" text-anchor="middle">${ticks}</text>
        </g>`;
    });
    svg.innerHTML = html;
    wrap.append(svg);
    if (note) wrap.append(el("p", { class: "sling-note" }, note));
    return { wrap, svg };
  }

  function buildRack() {
    const holder = document.getElementById("rack");
    const tip = document.getElementById("rack-tip");

    const indoor = indoorRack();
    const { rack: outdoor, unplaced } = outdoorRack();
    const gymNames = ASCENTS.gyms.map((g) => g.name).join(" and ");
    const slings = [
      { title: `Indoor · ${gymNames}`, rack: indoor, colour: "var(--ochre)" },
      {
        title: "Outdoor · Middlesex Fells",
        rack: outdoor,
        colour: "var(--olive)",
        note: unplaced.length ? `Not on the rack yet: ${unplaced.map((p) => `${p.name} (${p.status}, grade to add)`).join(", ")}.` : "",
      },
    ];

    let pinned = null;
    const show = (biner, which) => {
      const r = slings[which].rack[biner.dataset.i];
      tip.innerHTML = "";
      tip.append(el("p", { class: "tip-title" }, `V${r.grade} · ${slings[which].title.split(" · ")[0]}`));
      const list = el("ul");
      (r.items.length ? r.items : ["Nothing yet."]).forEach((t) => list.append(el("li", {}, t)));
      tip.append(list);
      const box = holder.getBoundingClientRect();
      const b = biner.querySelector(".biner-line").getBoundingClientRect();
      tip.hidden = false;
      const left = Math.min(Math.max(b.left + b.width / 2 - box.left - tip.offsetWidth / 2, 0), box.width - tip.offsetWidth);
      tip.style.left = `${left + holder.offsetLeft}px`;
      tip.style.top = `${b.bottom - box.top + holder.offsetTop + 46}px`;
    };
    const hide = () => { if (!pinned) tip.hidden = true; };

    slings.forEach((s, which) => {
      const { wrap, svg } = sling(s);
      holder.append(wrap);
      svg.querySelectorAll(".biner").forEach((biner) => {
        biner.addEventListener("mouseenter", () => show(biner, which));
        biner.addEventListener("mouseleave", hide);
        biner.addEventListener("focus", () => show(biner, which));
        biner.addEventListener("blur", () => { pinned = null; hide(); });
        // Tap (phones) pins the list open; tap again to close
        biner.addEventListener("click", () => {
          pinned = pinned === biner ? null : biner;
          if (pinned) show(biner, which); else tip.hidden = true;
        });
        biner.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); biner.click(); }
          if (e.key === "Escape") { pinned = null; tip.hidden = true; }
        });
      });
    });
  }

  /* ---------------------------------------------------------
     3. PROJECTS BOARD
     Attempts and sessions come from data.js if filled in,
     otherwise they're counted from the session log.
     --------------------------------------------------------- */
  // "2026-10-18" → "18 Oct 2026"
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function formatDate(date) {
    if (!date) return "";
    const [y, m, d] = date.split("-").map(Number);
    return d ? `${d} ${MONTHS[m - 1]} ${y}` : m ? `${MONTHS[m - 1]} ${y}` : String(y);
  }

  function buildProjects() {
    const holder = document.getElementById("projects");
    if (!ASCENTS.projects.length) {
      holder.append(el("p", { class: "empty" }, "No projects on the go. Something will catch my eye soon."));
      return;
    }
    for (const p of ASCENTS.projects) {
      const b = boulders.get(p.boulder);
      const tries = ASCENTS.sessions.filter((s) => (s.climbs || []).some((c) => c.problem === p.problem));
      const attempts = p.attempts ?? tries.reduce((n, s) => n + s.climbs.filter((c) => c.problem === p.problem).length, 0);
      const sessions = p.sessions ?? tries.length;
      const sent = p.status === "sent";

      const card = el("article", { class: `project${sent ? " project--sent" : ""}` });
      card.append(el("span", { class: `stamp stamp--large ${sent ? "stamp--sent" : "stamp--projecting"} project-stamp` }, sent ? "Sent" : "Projecting"));
      card.append(el("p", { class: "project-meta" }, [p.grade, b && b.name, b && b.area.name].filter(Boolean).join(" · ")));
      card.append(el("h3", { class: "project-name" }, p.problem));

      const stats = el("dl", { class: "project-stats" });
      const stat = (label, value) => {
        const div = el("div");
        div.append(el("dt", {}, label), el("dd", value ? {} : { class: "is-blank" }, value || "Not yet logged"));
        stats.append(div);
      };
      stat("Attempts", attempts ? String(attempts) : "");
      stat("Sessions", sessions ? String(sessions) : "");
      stat("High point", p.highPoint);
      stat(sent ? "Sent" : "Started", formatDate(sent ? p.sent : p.started));
      card.append(stats);

      card.append(el("p", { class: "project-label" }, "Beta"));
      card.append(p.beta
        ? el("p", { class: "p-note project-beta" }, p.beta)
        : el("p", { class: "empty empty--inline" }, "No beta written down yet. It goes here after the next session."));
      holder.append(card);
    }
  }

  /* ---------------------------------------------------------
     4. OUTDOOR: a sketch of the Fells, and the problems
     --------------------------------------------------------- */
  // A soft, wobbly ring, like a hand-drawn contour line
  function blob(cx, cy, r, seed) {
    const n = 14, pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = r * (1 + 0.09 * Math.sin(3 * a + seed) + 0.05 * Math.sin(5 * a + seed * 2));
      pts.push([cx + rr * Math.cos(a) * 1.25, cy + rr * Math.sin(a)]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}`
        + ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}`
        + ` ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + "Z";
  }

  const coord = ([lat, lon]) => `${Math.abs(lat).toFixed(5)}°${lat >= 0 ? "N" : "S"} ${Math.abs(lon).toFixed(5)}°${lon >= 0 ? "E" : "W"}`;

  function sketchMap() {
    const W = 560, H = 400, cx = 300, cy = 210;
    const pinned = [...boulders.values()].filter((b) => b.gps);
    const rings = [150, 118, 88, 60, 34].map((r, i) => `<path class="contour${i % 2 ? "" : " contour--index"}" d="${blob(cx, cy, r, i * 0.7 + 1)}"/>`).join("");

    // One boulder sits in the middle; any more are placed around it by their real offsets
    const [lat0, lon0] = pinned.length ? pinned[0].gps : [0, 0];
    const pins = pinned.map((b) => {
      const dx = (b.gps[1] - lon0) * 90000 * Math.cos((lat0 * Math.PI) / 180) * 0.6;   // ~0.6 px per metre
      const dy = -(b.gps[0] - lat0) * 111000 * 0.6;
      const x = cx + dx, y = cy + dy;
      return `
        <g class="pin" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
          <line x1="-12" y1="0" x2="12" y2="0"/><line x1="0" y1="-12" x2="0" y2="12"/>
          <circle r="4.5"/>
          <text class="pin-name" x="16" y="-8">${b.name}</text>
          <text class="pin-meta" x="16" y="8">${b.elevation != null ? `${b.elevation} m · ` : ""}${coord(b.gps)}</text>
        </g>`;
    }).join("");

    return `
      <svg class="fells-sketch" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="A hand-drawn sketch, not to scale: contour lines around ${pinned.map((b) => b.name).join(" and ")} in the Middlesex Fells.">
        ${rings}
        ${pins}
        <g class="north" transform="translate(${W - 46} ${H - 70})">
          <path d="M0 -22L6 4L0 0L-6 4Z"/><text y="22" text-anchor="middle">N</text>
        </g>
        <text class="sketch-note" x="24" y="${H - 18}">Sketch · not to scale</text>
      </svg>`;
  }

  const STATUS_STAMP = { sent: ["Sent", "stamp--sent"], projecting: ["Projecting", "stamp--projecting"] };

  function buildOutdoor() {
    const holder = document.getElementById("outdoor");
    const ticklist = new Set(ASCENTS.ticklist.map((t) => t.problem));

    const map = el("figure", { class: "fells" });
    map.innerHTML = sketchMap();
    holder.append(map);

    const list = el("div", { class: "boulders" });
    for (const area of ASCENTS.areas) {
      for (const b of area.boulders) {
        const card = el("article", { class: "boulder" });
        card.append(el("p", { class: "boulder-meta" },
          b.gps ? `${b.elevation != null ? `${b.elevation} m · ` : ""}${coord(b.gps)}` : "Location to add"));
        card.append(el("h3", { class: "boulder-name" }, b.name));

        const ul = el("ul", { class: "problems" });
        for (const p of b.problems) {
          const li = el("li", { class: "problem" });
          const open = el("button", { class: "problem-name", type: "button", "data-problem": p.name }, p.name);
          li.append(open);
          li.append(el("span", { class: "problem-grade" }, p.grade || "V?"));
          const [text, cls] = STATUS_STAMP[p.status] || (ticklist.has(p.name) ? ["To try", "stamp--planned"] : ["", ""]);
          if (text) li.append(el("span", { class: `stamp ${cls}` }, text));
          ul.append(li);
        }
        card.append(ul);

        const link = b.mountainProject || area.mountainProject;
        const a = el("a", { class: "mp-link", href: link, target: "_blank", rel: "noopener" },
          b.mountainProject ? "Mountain Project ↗" : `${area.name} on Mountain Project ↗`);
        a.append(el("span", { class: "visually-hidden" }, " (opens in a new tab)"));
        card.append(a);
        list.append(card);
      }
    }
    holder.append(list);

    holder.append(el("p", { class: "credit" },
      "Problem names and grades from Mountain Project, where you'll find each problem's description and photos. The sketch is drawn by hand around the GPS point and is not a real map."));
  }

  /* ---------------------------------------------------------
     5. TICKLIST
     --------------------------------------------------------- */
  function buildTicklist() {
    const holder = document.getElementById("ticklist");
    if (!ASCENTS.ticklist.length) {
      holder.append(el("li", { class: "empty" }, "The ticklist is clear. Time to go and find some new rock."));
      return;
    }
    ASCENTS.ticklist.forEach((t, i) => {
      const p = problems.get(t.problem);
      const b = boulders.get(t.boulder) || (p && p.boulder);
      const li = el("li", { class: "tick" });
      li.append(el("span", { class: "tick-box", "aria-hidden": "true" }));
      li.append(el("span", { class: "tick-num" }, String(i + 1).padStart(2, "0")));
      li.append(el("button", { class: "tick-name", type: "button", "data-problem": t.problem }, t.problem));
      li.append(el("span", { class: "tick-grade" }, (p && p.grade) || "V?"));
      li.append(el("span", { class: "tick-where" }, b ? b.name : ""));
      holder.append(li);
    });
  }

  /* ---------------------------------------------------------
     6. INDOOR PROGRESSION
     Hardest send (or flash) in each indoor session.
     --------------------------------------------------------- */
  const placeName = (id) => (gyms.get(id) || boulders.get(id) || { name: id }).name;
  const isIndoor = (s) => gyms.has(s.place);

  function buildProgress() {
    const fig = document.getElementById("progress");
    const points = ASCENTS.sessions
      .filter(isIndoor)
      .map((s) => {
        const sent = (s.climbs || []).filter((c) => c.result === "send" || c.result === "flash").map((c) => gradeNum(c.grade)).filter((g) => g != null);
        return sent.length ? { date: s.date, grade: Math.max(...sent), place: s.place } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.date.localeCompare(b.date));

    const W = 900, H = 300, L = 52, R = 24, T = 20, B = 40;
    const lo = 0, hi = 10;
    const y = (g) => T + (1 - (g - lo) / (hi - lo)) * (H - T - B);
    const x = (i, n) => (n <= 1 ? L + (W - L - R) / 2 : L + (i / (n - 1)) * (W - L - R));

    // Grade lines on the left
    let grid = "";
    for (let g = lo; g <= hi; g += 2) grid += `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}"/><text class="axis" x="${L - 12}" y="${y(g) + 4}" text-anchor="end">V${g}</text>`;

    // Where I stood before the log (slab and overhang, from the gyms)
    const before = [];
    for (const gym of ASCENTS.gyms) {
      const b = gym.before || {};
      if (b.slab) before.push([gradeNum(b.slab), `${b.slab} slab`]);
      if (b.overhang) before.push([gradeNum(b.overhang), `${b.overhang} overhang`]);
    }
    const seen = new Set();
    const baselines = before.filter(([g, t]) => !seen.has(t) && seen.add(t)).map(([g, t]) =>
      `<line class="baseline" x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}"/><text class="baseline-label" x="${W - R}" y="${y(g) - 6}" text-anchor="end">before the log · ${t}</text>`).join("");

    let line = "", dots = "", labels = "";
    if (points.length) {
      const pts = points.map((p, i) => [x(i, points.length), y(p.grade)]);
      const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join("");
      line = [9, 6, 3].map((dy, k) => `<path class="echo" d="${d}" transform="translate(0 ${dy})" style="opacity:${0.18 + k * 0.12}"/>`).join("") + `<path class="trend" d="${d}"/>`;
      dots = pts.map(([px, py], i) => `<circle class="dot" cx="${px}" cy="${py}" r="4.5"><title>${formatDate(points[i].date)}: V${points[i].grade} at ${placeName(points[i].place)}</title></circle>`).join("");
      const every = Math.ceil(points.length / 6);
      labels = points.map((p, i) => (i % every === 0 || i === points.length - 1)
        ? `<text class="axis" x="${pts[i][0]}" y="${H - 12}" text-anchor="middle">${formatDate(p.date).replace(/ \d{4}$/, "")}</text>` : "").join("");
    }

    fig.innerHTML = `
      <svg class="progress-chart" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="${points.length ? `Hardest indoor send per session: ${points.map((p) => `V${p.grade} on ${formatDate(p.date)}`).join(", ")}.` : "No indoor sessions logged yet."}">
        ${grid}${baselines}${line}${dots}${labels}
      </svg>`;
    if (!points.length) fig.append(el("p", { class: "chart-empty" }, "first session goes here →"));
  }

  /* ---------------------------------------------------------
     7. SESSION LOG
     --------------------------------------------------------- */
  const RESULT = { flash: "Flash", send: "Send", attempt: "Attempt" };

  function buildLog() {
    const holder = document.getElementById("log");
    const sessions = [...ASCENTS.sessions].sort((a, b) => b.date.localeCompare(a.date));
    if (!sessions.length) {
      holder.append(el("li", { class: "empty" }, "The first entry will go here after my next session. Ink's ready."));
      return;
    }
    for (const s of sessions) {
      const entry = el("li", { class: "entry" });
      const head = el("p", { class: "entry-head" });
      head.append(el("time", { datetime: s.date }, formatDate(s.date)));
      head.append(el("span", { class: `entry-zone entry-zone--${isIndoor(s) ? "in" : "out"}` }, isIndoor(s) ? "Indoor" : "Outdoor"));
      entry.append(head);
      entry.append(el("h3", { class: "entry-place" }, placeName(s.place)));

      if (s.climbs && s.climbs.length) {
        const ul = el("ul", { class: "climbs" });
        for (const c of s.climbs) {
          const p = c.problem && problems.get(c.problem);
          const li = el("li", { class: "climb" });
          li.append(el("span", { class: "climb-grade" }, c.grade || (p && p.grade) || "V?"));
          li.append(el("span", { class: "climb-what" }, c.problem || [c.wall, c.holds && `${c.holds} holds`, c.style].filter(Boolean).join(" · ") || "Problem"));
          li.append(el("span", { class: `climb-result climb-result--${c.result}` }, RESULT[c.result] || c.result));
          ul.append(li);
        }
        entry.append(ul);
      }
      if (s.felt) entry.append(el("p", { class: "entry-felt" }, s.felt));
      holder.append(entry);
    }
  }

  /* ---------------------------------------------------------
     8. LESSONS
     --------------------------------------------------------- */
  function buildLessons() {
    const holder = document.getElementById("lessons");
    const lessons = [...ASCENTS.sessions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .flatMap((s) => (s.notes || []).map((n) => ({ text: n, date: s.date, place: placeName(s.place) })));
    if (!lessons.length) {
      holder.append(el("li", { class: "empty" }, "Lessons collect here: footwork, beta, the things I keep relearning."));
      return;
    }
    for (const l of lessons) {
      const li = el("li", { class: "lesson" });
      li.append(el("p", { class: "lesson-text" }, l.text));
      li.append(el("p", { class: "lesson-meta" }, `${formatDate(l.date)} · ${l.place}`));
      holder.append(li);
    }
  }

  /* ---------------------------------------------------------
     9. PROBLEM PANEL
     Click a problem to open its page: status, project notes,
     my sessions on it, my photos, and Mountain Project.
     --------------------------------------------------------- */
  const panelBody = document.getElementById("panel-body");
  const sheet = FieldNotes.panel(document.getElementById("panel"));

  function openProblem(name, opener) {
    const p = problems.get(name);
    if (!p) return;
    const b = p.boulder;
    const area = boulders.get(b.id).area;
    const project = ASCENTS.projects.find((x) => x.problem === name);
    const tries = [...ASCENTS.sessions]
      .sort((x, y) => y.date.localeCompare(x.date))
      .flatMap((s) => (s.climbs || []).filter((c) => c.problem === name).map((c) => ({ date: s.date, result: c.result })));
    const onTicklist = ASCENTS.ticklist.some((t) => t.problem === name);
    const [stampText, stampCls] = STATUS_STAMP[p.status] || (onTicklist ? ["To try", "stamp--planned"] : ["", ""]);
    const photos = [...(p.photos || []), ...(b.photos || [])];
    const link = b.mountainProject || area.mountainProject;

    panelBody.innerHTML = "";
    panelBody.append(el("p", { class: "p-coords" },
      [b.elevation != null && `${b.elevation} m`, b.gps && coord(b.gps)].filter(Boolean).join(" · ") || area.name));
    const title = el("h2", { class: "p-title", id: "panel-title" }, name);
    panelBody.append(title);
    const sub = el("p", { class: "pp-sub" });
    sub.append(el("span", { class: "pp-grade" }, p.grade || "V?"), ` ${b.name} · ${area.name}`);
    panelBody.append(sub);
    if (stampText) panelBody.append(el("span", { class: `stamp stamp--large ${stampCls} pp-stamp` }, stampText));

    // Photos: mine, or a quiet empty frame
    const photoSec = el("section", { class: "p-section" });
    photoSec.append(el("p", { class: "p-label" }, "Photos"));
    if (photos.length) {
      const grid = el("div", { class: "pp-photos" });
      for (const ph of photos) {
        const fig = el("figure", { class: "pp-photo" });
        fig.append(el("img", { src: ph.src, alt: ph.alt || "", loading: "lazy" }));
        if (ph.caption) fig.append(el("figcaption", {}, ph.caption));
        grid.append(fig);
      }
      photoSec.append(grid);
    } else {
      photoSec.append(el("p", { class: "empty empty--inline" }, "No photos of my own yet. Next time I'm out there."));
    }
    panelBody.append(photoSec);

    // Project details
    if (project) {
      const sec = el("section", { class: "p-section" });
      sec.append(el("p", { class: "p-label" }, "Project"));
      const facts = [
        ["Started", formatDate(project.started)], ["Sent", formatDate(project.sent)],
        ["High point", project.highPoint],
      ].filter(([, v]) => v);
      if (facts.length) {
        const dl = el("dl", { class: "pp-facts" });
        facts.forEach(([k, v]) => dl.append(el("dt", {}, k), el("dd", {}, v)));
        sec.append(dl);
      }
      sec.append(project.beta ? el("p", { class: "p-note" }, project.beta) : el("p", { class: "empty empty--inline" }, "No beta written down yet."));
      panelBody.append(sec);
    }

    // My sessions on it
    const log = el("section", { class: "p-section" });
    log.append(el("p", { class: "p-label" }, "My tries"));
    if (tries.length) {
      const ul = el("ul", { class: "pp-tries" });
      tries.forEach((t) => {
        const li = el("li");
        li.append(el("span", {}, formatDate(t.date)), el("span", { class: `climb-result climb-result--${t.result}` }, RESULT[t.result] || t.result));
        ul.append(li);
      });
      log.append(ul);
    } else {
      log.append(el("p", { class: "pp-quiet" }, p.status === "sent" ? "Sent before the log began." : "None logged yet."));
    }
    panelBody.append(log);

    // Mountain Project: descriptions and everyone else's photos live there
    const mp = el("section", { class: "p-section" });
    const a = el("a", { class: "btn", href: link, target: "_blank", rel: "noopener" }, "Photos and description on Mountain Project ↗");
    a.append(el("span", { class: "visually-hidden" }, " (opens in a new tab)"));
    mp.append(a);
    mp.append(el("p", { class: "pp-quiet" }, b.mountainProject ? `Opens the ${b.name} page.` : `Opens the ${area.name} area page.`));
    panelBody.append(mp);

    sheet.open(opener);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-problem]");
    if (btn) openProblem(btn.dataset.problem, btn);
  });

  buildHero();
  buildRack();
  buildProjects();
  buildOutdoor();
  buildProgress();
  buildLog();
  buildLessons();
  buildTicklist();
})();
