/* =========================================================
   MISSION LOGS · script
   ---------------------------------------------------------
   The Day/Dusk switch comes from ../../../shared/field-notes.js.
   Logs are in logs.js; sources and the metals in ../data.js;
   related links in ../connections.js.

   1. Helpers and citations
   2. The starfield behind an exhibit
   3. Exhibits (the metals of the energy transition)
   4. The logbook (#/)
   5. A log (#/001 …)
   6. Routing
   ========================================================= */
(() => {
  "use strict";

  const F = window.FRONTIER;
  const C = window.CONNECTIONS || { links: [], places: {} };
  const LOGS = window.MISSION_LOGS || [];
  const BY_NUM = Object.fromEntries(LOGS.map((l) => [l.number, l]));
  const main = document.getElementById("main");
  const reduced = FieldNotes.reducedMotion;
  const STATUS = { open: "Open", ongoing: "Ongoing", closed: "Closed" };
  const ROOT = "../../../";   // from here to the site root, for connections.js links

  /* ---------------------------------------------------------
     1. HELPERS AND CITATIONS
     Sources are numbered in the order a page first cites them.
     --------------------------------------------------------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shortDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();
  const niceDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  function citer() {
    const order = [];
    const add = (id) => { if (F.sources[id] && !order.includes(id)) order.push(id); };
    const cite = (ids = []) => ids.length ? `<sup class="fr-cite">${ids.map((id) => {
      add(id);
      const n = order.indexOf(id) + 1;
      return `<a href="#src-${n}" aria-label="Source ${n}">${n}</a>`;
    }).join("")}</sup>` : "";
    const list = () => `<ol class="fr-sources">${order.map((id, i) => {
      const s = F.sources[id];
      return `<li id="src-${i + 1}"><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title)}</a> <span>${esc(s.publisher)}</span></li>`;
    }).join("")}</ol>`;
    return { cite, list, add };
  }

  /* ---------------------------------------------------------
     2. THE STARFIELD BEHIND AN EXHIBIT
     --------------------------------------------------------- */
  function onScroll() {
    const p = reduced.matches ? 0 : Math.min(1, window.scrollY / (window.innerHeight * 1.2));
    document.documentElement.style.setProperty("--fr-p", p.toFixed(3));
  }
  addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });

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

  /* ---------------------------------------------------------
     3. EXHIBITS
     --------------------------------------------------------- */
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
  const EXHIBITS = { metals: metalsBlock };

  /* ---------------------------------------------------------
     4. THE LOGBOOK (#/)
     --------------------------------------------------------- */
  const status = (l) => `<span class="fr-log-status is-${l.status}">${STATUS[l.status] || esc(l.status)}</span>`;
  function logbook() {
    document.title = "Mission Logs · Frontier · Field Notes";
    const rows = [...LOGS].sort((a, b) => b.number.localeCompare(a.number));
    return `
      <section class="fr-hero fr-hero--tech fr-wrap lg-head" aria-labelledby="lg-title">
        <a class="fr-back" href="../index.html">← Frontier</a>
        <p class="fr-telemetry lg-telemetry" aria-hidden="true"><span>Frontier</span><span>Logbook</span><span class="fr-blink">● ${LOGS.length} ${LOGS.length === 1 ? "log" : "logs"}</span></p>
        <h1 class="fr-h1 fr-h1--tech" id="lg-title">Mission Logs</h1>
        <p class="fr-lede">A growing collection of my investigations into cutting-edge technologies and what's to come.</p>
      </section>

      <section class="fr-section fr-wrap" aria-label="All logs">
        <ol class="lg-book">
          ${rows.map((l) => `<li><a class="lg-entry" href="#/${l.number}">
            <span class="lg-line"><b>Log ${l.number}</b><i aria-hidden="true">·</i>${status(l)}<i aria-hidden="true">·</i><span>Opened <time datetime="${l.opened}">${shortDate(l.opened)}</time></span><span class="lg-upd">Updated <time datetime="${l.updated}">${shortDate(l.updated)}</time></span></span>
            <span class="lg-title">${esc(l.title)}</span>
            <span class="lg-q">${esc(l.question)}</span>
          </a></li>`).join("")}
        </ol>
      </section>`;
  }

  /* ---------------------------------------------------------
     5. A LOG (#/001 …)
     --------------------------------------------------------- */
  function logPage(l) {
    document.title = `Log ${l.number}: ${l.title} · Mission Logs · Field Notes`;
    const { cite, list, add } = citer();
    const exhibit = EXHIBITS[l.exhibit] ? `
      <section class="fr-hero fr-wrap lg-exhibit" aria-label="The exhibit">
        <div class="fr-space" aria-hidden="true">
          <img class="fr-space-img" src="../img/space-colony.webp" alt="" width="2400" height="1891">
          <canvas class="fr-stars"></canvas>
          <span class="fr-ring"></span>
        </div>
        <p class="fr-telemetry" aria-hidden="true">${(l.telemetry || []).map((x) => `<span>${esc(x)}</span>`).join("")}<span class="fr-blink">● Signal</span></p>
        ${EXHIBITS[l.exhibit](cite)}
      </section>` : "";
    const findings = (l.findings || []).map((x) => `<li>${esc(x.text)}${cite(x.sources)}</li>`).join("");
    (l.sources || []).forEach(add);
    const me = `frontier:log-${l.number}`;
    const links = C.links.filter((x) => x.status === "approved" && (x.from === me || x.to === me));
    const related = links.map((x) => {
      const p = C.places[x.from === me ? x.to : x.from];
      return p ? `<li><a href="${ROOT}${esc(p.href)}">${esc(p.label)}</a><span>${esc(x.reason)}</span></li>` : "";
    }).join("");
    const i = LOGS.indexOf(l), prev = LOGS[i - 1], next = LOGS[i + 1];
    return `
      <section class="fr-hero fr-hero--tech fr-wrap lg-head" aria-labelledby="lg-title">
        <a class="fr-back" href="#/">← All mission logs</a>
        <p class="lg-meta lg-line"><b>Log ${l.number}</b><i aria-hidden="true">·</i>${status(l)}<i aria-hidden="true">·</i><span>Opened <time datetime="${l.opened}">${shortDate(l.opened)}</time></span></p>
        <h1 class="fr-h1 fr-h1--tech" id="lg-title">${esc(l.title)}</h1>
        <p class="lg-label">The question</p>
        <p class="fr-lede lg-question">${esc(l.question)}</p>
      </section>
      ${exhibit}

      <section class="fr-section fr-wrap" aria-labelledby="lg-find">
        <p class="fr-eyebrow">01</p><h2 class="fr-h2" id="lg-find">Findings so far</h2>
        ${findings ? `<ol class="lg-findings">${findings}</ol>` : `<p class="fr-intro">Nothing written up yet.</p>`}
      </section>

      <section class="fr-section fr-wrap" aria-labelledby="lg-open">
        <p class="fr-eyebrow">02</p><h2 class="fr-h2" id="lg-open">Open questions</h2>
        <p class="fr-intro">What I still want to find out.</p>
        ${(l.openQs || []).length ? `<ul class="lg-open">${l.openQs.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>` : ""}
      </section>

      ${related ? `<section class="fr-section fr-wrap" aria-labelledby="lg-rel">
        <p class="fr-eyebrow">03</p><h2 class="fr-h2" id="lg-rel">Related</h2>
        <ul class="fr-links">${related}</ul>
      </section>` : ""}

      <section class="fr-section fr-wrap fr-section--sources" aria-labelledby="lg-src">
        <p class="fr-eyebrow">Sources</p><h2 class="fr-h2" id="lg-src">Where this comes from</h2>
        ${list()}
        <p class="lg-updated">Last updated <time datetime="${l.updated}">${niceDate(l.updated)}</time>.</p>
        <nav class="lg-pager" aria-label="Other logs">
          ${prev ? `<a href="#/${prev.number}">← Log ${prev.number}</a>` : "<span></span>"}
          <a href="#/">All mission logs</a>
          ${next ? `<a href="#/${next.number}">Log ${next.number} →</a>` : "<span></span>"}
        </nav>
      </section>`;
  }

  /* ---------------------------------------------------------
     6. ROUTING
     --------------------------------------------------------- */
  function render() {
    const l = BY_NUM[location.hash.replace(/^#\/?/, "")];
    main.innerHTML = l ? logPage(l) : logbook();
    stars();
    window.scrollTo(0, 0);
    onScroll();
  }
  // Citation numbers jump to their source in the list. They are handled
  // here because a plain "#src-3" link would change the page's route.
  main.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#src-"]');
    if (!a) return;
    const li = document.getElementById(a.getAttribute("href").slice(1));
    if (!li) return;
    e.preventDefault();
    document.querySelectorAll(".fr-sources li.is-target").forEach((x) => x.classList.remove("is-target"));
    li.classList.add("is-target");
    li.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "center" });
    const link = li.querySelector("a");
    if (link) link.focus({ preventScroll: true });
  });
  addEventListener("hashchange", () => { render(); main.focus({ preventScroll: true }); });
  render();
})();
