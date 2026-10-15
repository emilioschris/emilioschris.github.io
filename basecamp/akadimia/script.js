/* =========================================================
   AKADIMIA · script
   ---------------------------------------------------------
   The Day/Dusk switch comes from ../../shared/field-notes.js.

   1. Helpers and saved items (this browser only, with backup)
   2. The daily feed (feed-data.js, loaded fresh each day)
   3. The school logos
   4. Pieces: an item, a list, the filters
   5. Views: the whole library (#/) and each school (#/ucl …)
   ========================================================= */
(() => {
  "use strict";

  const A = window.AKADIMIA;
  const main = document.getElementById("main");
  const SCHOOLS = Object.fromEntries(A.schools.map((s) => [s.id, s]));
  let FEED = { items: [], people: {}, topics: [], sources: [] };

  /* ---------------------------------------------------------
     1. HELPERS AND SAVED ITEMS
     --------------------------------------------------------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const niceDate = (d) => d ? new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";
  const today = () => new Date().toISOString().slice(0, 10);
  const topicName = (id) => (FEED.topics.find((t) => t.id === id) || {}).name || id;
  const idFor = (it) => it.id || "h-" + Array.from(it.link || it.title).reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7).toString(36);

  const KEY = "fieldnotes-akadimia-v1";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}").saved || {}; } catch (e) { saved = {}; }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({ saved })); } catch (e) { /* private mode: keeps working for this visit */ }
  }
  function toggleSave(item) {
    const id = idFor(item);
    if (saved[id]) delete saved[id];
    else saved[id] = { ...item, id, savedOn: today() };
    persist();
  }

  /* ---------------------------------------------------------
     2. THE DAILY FEED
     feed-data.js is rewritten once a day by a GitHub Action.
     Asking for it with today's date means the browser never
     shows yesterday's copy.
     --------------------------------------------------------- */
  function loadFeed() {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = `feed-data.js?d=${today()}`;
      s.onload = () => { if (window.AKADIMIA_FEED) FEED = window.AKADIMIA_FEED; resolve(); };
      s.onerror = () => resolve();
      document.head.append(s);
    });
  }

  /* ---------------------------------------------------------
     3. SCHOOL LOGOS
     Each school's own logo, unaltered, on a small light card so
     it reads in Day and Dusk alike.
     --------------------------------------------------------- */
  function badge(s, cls = "") {
    return `<span class="logo-tile logo-tile--${s.id} ${cls}"><img src="${esc(s.logo)}" alt="${esc(s.logoAlt)}" loading="lazy" decoding="async"></span>`;
  }

  /* ---------------------------------------------------------
     4. PIECES
     --------------------------------------------------------- */
  function itemCard(it, opts = {}) {
    const id = idFor(it);
    const school = it.school && SCHOOLS[it.school];
    const isSaved = !!saved[id];
    return `<li class="ak-item${opts.highlight ? " ak-item--highlight" : ""}" data-id="${esc(id)}">
      <p class="ak-meta">
        <time datetime="${esc(it.date)}">${niceDate(it.date)}</time>
        ${school ? `<a class="ak-school ak-school--${school.tone}" href="#/${school.id}">${esc(school.short)}</a>` : ""}
        <span class="ak-source">${esc(it.source || "")}</span>
      </p>
      <h3 class="ak-title"><a href="${esc(it.link)}" rel="noopener" target="_blank">${esc(it.title)}<span class="visually-hidden"> (opens in a new tab)</span></a></h3>
      ${it.note ? `<p class="ak-note">${esc(it.note)}</p>` : ""}
      ${it.summary ? `<p class="ak-summary">${esc(it.summary)}</p>` : ""}
      <div class="ak-foot-row">
        <span class="ak-topics">${(it.topics || []).map((t) => `<span class="ak-topic">${esc(topicName(t))}</span>`).join("")}</span>
        <button class="ak-star" type="button" data-star="${esc(id)}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove from saved" : "Save"}: ${esc(it.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.6 9l6.2.6-4.7 4.2 1.4 6.1L12 16.7l-5.5 3.2 1.4-6.1-4.7-4.2L9.4 9Z"/></svg>
        </button>
      </div>
    </li>`;
  }
  const list = (items, opts) => items.length
    ? `<ul class="ak-list">${items.map((it) => itemCard(it, opts)).join("")}</ul>`
    : `<p class="ak-empty">${opts && opts.empty || "Nothing here yet."}</p>`;

  // Everything the stream can show: the daily feed plus hand-added news
  const allItems = () => [...FEED.items, ...A.news].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const filters = { school: "all", topic: "all", shown: 24 };
  function streamBlock(scope) {
    const pool = allItems().filter((it) => !scope || it.school === scope);
    const items = pool.filter((it) =>
      (scope || filters.school === "all" || (filters.school === "other" ? !it.school : it.school === filters.school)) &&
      (filters.topic === "all" || (it.topics || []).includes(filters.topic)));
    const chip = (group, value, label) =>
      `<button class="ak-chip" type="button" data-filter="${group}" data-value="${value}" aria-pressed="${filters[group] === value}">${esc(label)}</button>`;
    return `
      <div class="ak-filters" role="group" aria-label="Filter the stream">
        ${scope ? "" : `<div class="ak-chips"><span class="ak-chips-label">School</span>${chip("school", "all", "All")}${A.schools.map((s) => chip("school", s.id, s.short)).join("")}${chip("school", "other", "Other sources")}</div>`}
        <div class="ak-chips"><span class="ak-chips-label">Topic</span>${chip("topic", "all", "All")}${FEED.topics.map((t) => chip("topic", t.id, t.name)).join("")}</div>
      </div>
      <p class="ak-count" aria-live="polite">${items.length} item${items.length === 1 ? "" : "s"}</p>
      ${list(items.slice(0, filters.shown), { empty: "Nothing matches these filters yet." })}
      ${items.length > filters.shown ? `<button class="btn ak-more" type="button" data-more>Show more</button>` : ""}`;
  }

  function personCard(p) {
    const s = SCHOOLS[p.school];
    const works = (FEED.people[p.id] || []).slice(0, 3);
    return `<article class="ak-person">
      <div class="ak-person-head">
        ${badge(s, "logo-tile--mini")}
        <div>
          <h3 class="ak-person-name">${esc(p.name)}</h3>
          <p class="ak-person-role">${esc(p.role)}</p>
        </div>
      </div>
      <p class="ak-person-bio">${esc(p.bio)}</p>
      <p class="ak-label">Latest work</p>
      ${works.length ? `<ul class="ak-works">${works.map((w) => `<li><a href="${esc(w.link)}" rel="noopener" target="_blank">${esc(w.title)}</a><span>${niceDate(w.date)}${w.summary ? " · " + esc(w.summary.split(" · ")[0]) : ""}</span></li>`).join("")}</ul>` : `<p class="ak-empty">Publications appear after the next daily update.</p>`}
      <a class="ak-orcid" href="https://openalex.org/${esc(p.openalex)}" rel="noopener" target="_blank">All work on OpenAlex ↗</a>
    </article>`;
  }

  /* ---------------------------------------------------------
     5. VIEWS
     --------------------------------------------------------- */
  function section(id, eyebrow, title, body, intro = "") {
    return `<section class="ak-section ak-wrap" id="${id}" aria-labelledby="${id}-title">
      <header class="ak-section-head">
        <p class="ak-eyebrow">${eyebrow}</p>
        <h2 class="ak-h2" id="${id}-title">${title}</h2>
        ${intro ? `<p class="ak-intro">${intro}</p>` : ""}
      </header>
      ${body}
    </section>`;
  }

  function savedBlock() {
    const items = Object.values(saved).sort((a, b) => (b.savedOn || "").localeCompare(a.savedOn || ""));
    return `${list(items, { empty: "Star anything in the library to keep it here. Saved items stay in this browser; save a backup to keep them safe or move them to another device." })}
      <div class="ak-backup">
        <button class="btn" type="button" data-export>Save backup</button>
        <label class="btn ak-import">Load backup…<input type="file" accept="application/json" data-import hidden></label>
      </div>`;
  }

  function homeView() {
    document.title = "Ακαδημία (Akadimia) · Field Notes";
    const ucl = allItems().filter((it) => it.school === "ucl" && (it.topics || []).some((t) => t === "energy-climate" || t === "climate-tech")).slice(0, 6);
    const people = (FEED.peopleInfo || []);
    return `
      <section class="ak-hero ak-wrap" aria-labelledby="ak-title">
        <p class="ak-eyebrow">Base Camp · Economics and global finance</p>
        <h1 class="ak-h1" id="ak-title">Ακαδημία<span class="ak-latin" lang="en">Akadimia</span></h1>
        <p class="ak-lede">A long-term library for economics and global finance, built around three schools: what I'm reading, the people whose work I follow, and a daily stream of research and news.</p>
        <nav class="ak-crests" aria-label="The three schools">
          ${A.schools.map((s) => `<a class="ak-crest-link" href="#/${s.id}">${badge(s)}<span>${esc(s.short)}<span class="ak-est"> · est. ${s.founded}</span></span></a>`).join("")}
        </nav>
      </section>
      ${section("highlights", "01 · Chosen", "Highlights", list(A.highlights.map((h) => ({ ...h, source: h.source || "" })), { highlight: true, empty: "Things I choose to feature will be pinned here first." }), "Readings, papers and pieces I've picked out myself.")}
      ${section("faculty", "02 · People", "Faculty", `<div class="ak-people">${people.map(personCard).join("")}</div>`, "Professors whose work I follow, with their latest publications from OpenAlex, a free, open research database.")}
      ${section("ucl-spotlight", "03 · UCL", "Climate and energy at UCL", list(ucl, { empty: "UCL research on energy and climate appears here after the daily update." }), "New UCL research on energy, climate economics and climate tech.")}
      ${section("stream", "04 · Every day", "The Stream", streamBlock(null), "News and research from all three schools and a few trusted sources, newest first. Updated once a day.")}
      ${section("saved", "05 · Kept", "Saved", savedBlock())}`;
  }

  function schoolView(s) {
    document.title = `${s.short} · Ακαδημία · Field Notes`;
    const people = (FEED.peopleInfo || []).filter((p) => p.school === s.id);
    const highlights = A.highlights.filter((h) => h.school === s.id);
    return `
      <section class="ak-hero ak-hero--school ak-wrap" aria-labelledby="ak-title">
        <a class="ak-back" href="#/">← All three schools</a>
        <div class="ak-school-head">
          ${badge(s, "logo-tile--large")}
          <div>
            <p class="ak-eyebrow">${esc(s.place)} · founded ${s.founded}</p>
            <h1 class="ak-h1 ak-h1--school" id="ak-title">${esc(s.name)}</h1>
            <p class="ak-course">${esc(s.course)}</p>
            <p class="ak-founded">${esc(s.foundedNote)} <a href="${esc(s.foundedSource.url)}" rel="noopener" target="_blank">Source</a></p>
          </div>
        </div>
        <nav class="ak-crests ak-crests--small" aria-label="Other schools">
          ${A.schools.filter((x) => x.id !== s.id).map((x) => `<a class="ak-crest-link" href="#/${x.id}">${badge(x)}<span>${esc(x.short)}</span></a>`).join("")}
        </nav>
      </section>
      ${highlights.length ? section("highlights", "Chosen", "Highlights", list(highlights, { highlight: true })) : ""}
      ${section("stream", "Every day", `The ${esc(s.short)} stream`, streamBlock(s.id), s.id === "skidmore" ? "Skidmore has no news feed, so this shows Skidmore economics research from OpenAlex plus anything I add by hand." : s.id === "ucl" ? "UCL's news can't be read automatically, so this shows new UCL research in economics and energy from OpenAlex." : "From the Grantham Research Institute and LSE's blogs, filtered to my topics.")}
      ${people.length ? section("faculty", "People", "Faculty", `<div class="ak-people">${people.map(personCard).join("")}</div>`) : ""}
      ${section("centres", "Where the work happens", "Research centres", `<ul class="ak-centres">${s.centres.map((c) => `<li><a href="${esc(c.url)}" rel="noopener" target="_blank">${esc(c.name)} ↗</a>${c.note ? `<span>${esc(c.note)}</span>` : ""}</li>`).join("")}</ul>`)}`;
  }

  function render(keepFocus) {
    const route = location.hash.replace(/^#\/?/, "");
    const s = SCHOOLS[route];
    main.innerHTML = s ? schoolView(s) : homeView();
    document.body.classList.toggle("is-school", !!s);
    const up = document.getElementById("ak-updated");
    if (up) up.textContent = FEED.updated ? `Stream last updated ${niceDate(FEED.updated.slice(0, 10))}, from ${FEED.sources.filter((x) => x.ok).length} of ${FEED.sources.length} sources.` : "";
    if (!keepFocus) { window.scrollTo(0, 0); }
  }

  // One listener for every button on the page
  main.addEventListener("click", (e) => {
    const star = e.target.closest("[data-star]");
    if (star) {
      const id = star.dataset.star;
      const it = [...allItems(), ...A.highlights, ...Object.values(saved), ...Object.values(FEED.people).flat()].find((x) => idFor(x) === id);
      if (it) toggleSave(it);
      const on = !!saved[id];
      main.querySelectorAll(`[data-star="${CSS.escape(id)}"]`).forEach((b) => { b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", `${on ? "Remove from saved" : "Save"}: ${it ? it.title : ""}`); });
      refreshSaved();
      return;
    }
    const f = e.target.closest("[data-filter]");
    if (f) {
      filters[f.dataset.filter] = f.dataset.value;
      filters.shown = 24;
      refreshStream();
      return;
    }
    if (e.target.closest("[data-more]")) { filters.shown += 24; refreshStream(); return; }
    if (e.target.closest("[data-export]")) {
      const blob = new Blob([JSON.stringify({ app: "akadimia", saved }, null, 1)], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `akadimia-saved-${today()}.json` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
  });
  main.addEventListener("change", (e) => {
    const input = e.target.closest("[data-import]");
    if (!input || !input.files[0]) return;
    input.files[0].text().then((t) => {
      try {
        const data = JSON.parse(t);
        if (data && data.saved && typeof data.saved === "object") { Object.assign(saved, data.saved); persist(); refreshSaved(); }
      } catch (err) { alert("That file isn't an Akadimia backup."); }
    });
  });

  function refreshStream() {
    const box = document.getElementById("stream");
    if (!box) return;
    const head = box.querySelector(".ak-section-head").outerHTML;
    const scope = SCHOOLS[location.hash.replace(/^#\/?/, "")] ? location.hash.replace(/^#\/?/, "") : null;
    box.innerHTML = head + streamBlock(scope);
  }
  function refreshSaved() {
    const box = document.getElementById("saved");
    if (!box) return;
    const head = box.querySelector(".ak-section-head").outerHTML;
    box.innerHTML = head + savedBlock();
  }

  window.addEventListener("hashchange", () => { filters.school = "all"; filters.topic = "all"; filters.shown = 24; render(); main.focus({ preventScroll: true }); });

  render(true);                               // draw at once with what's on hand
  loadFeed().then(() => render(true));        // then again with today's feed
})();
