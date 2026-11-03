/* =========================================================
   PARATIRITIRIO · Money moves
   ---------------------------------------------------------
   The hawk swoops in with a gold coin and a one-line tag:
   "Big money move: …". Tapping it opens a "Learn more" card.

   1. Picking the moves: recent entries (announced, approved or
      completed in the last 18 months) and recent Signals
      headlines that name a sum of money and a deal-like word.
      Each gets a score (size, how recent); the top ones rotate,
      one per day.
   2. The toast (hawk, coin, tag), shown once per visit.
   3. The card (a dialog): what, how much, who, where, when, why,
      who gains and who pays, sources, search phrases.
   4. Settings: "Don't show moves" is remembered in localStorage.
   ========================================================= */
(() => {
  "use strict";

  const P = window.PARATIRITIRIO;
  const U = P.ui;
  if (!U) return;
  const { esc, fmtDate, fmtEur, kindChip, analysisChip, sourceList, mark, copyText, byId, districtById, statusById } = U;

  const STORE = "paratiritirio-moves";      // { off: true } when switched off
  const SEEN = "paratiritirio-moves-seen";  // sessionStorage: shown this visit
  const DAY = 86400000;
  const WINDOW_DAYS = 540;                  // entries: last 18 months
  const NEWS_DAYS = 45;                     // headlines: last 45 days
  const MAX_MOVES = 12;
  const NEWS_MIN_EUR = 10e6;
  /* A headline counts as a "move" only if it names money AND a deal-like word,
     and isn't about results or falls (profit, debt, a drop in arrivals …). */
  const DEAL = /\b(invest\w*|deal|acquir\w*|takeover|stake|contract|tender\w*|award\w*|approv\w*|signs?|signed|buys?|bought|funding|funds?|raises?|concession|fid|merger|budget|grant\w*|launch\w*)\b/i;
  const NOT_A_MOVE = /\b(profit\w*|earnings|debt|falls?|fell|down|cut|drops?|loss\w*)\b/i;
  const EUR = /€\s?(\d+(?:[.,]\d+)?)\s?(bn|billion|mn|mln|million|m)\b/i;

  const store = {
    get() { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; } },
    set(v) { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch (e) { /* storage blocked: the choice lasts this visit */ } },
  };
  const seenThisVisit = () => { try { return sessionStorage.getItem(SEEN) === "1"; } catch (e) { return false; } };
  const markSeen = () => { try { sessionStorage.setItem(SEEN, "1"); } catch (e) {} };

  /* ---------- 1. PICKING THE MOVES ---------- */
  const today = new Date();
  const ageDays = (iso) => (today - new Date(iso.length === 4 ? iso + "-07-01" : iso.length === 7 ? iso + "-15" : iso)) / DAY;
  const VERB = { completed: "completed", approved: "approved", announced: "announced" };

  function entryMoves() {
    return P.entries.flatMap((e) => {
      if (e.status === "active" || e.status === "ended") return [];
      const events = ["completed", "approved", "announced"].filter((k) => e.dates[k]).map((k) => ({ k, date: e.dates[k] }));
      const ev = events.sort((a, b) => (a.date < b.date ? 1 : -1))[0];
      if (!ev) return [];
      const age = ageDays(ev.date);
      if (age < 0 || age > WINDOW_DAYS) return [];
      const size = e.value.eur ? Math.log10(e.value.eur) / 3 : 2;
      return [{
        id: "e:" + e.id, kind: "entry", entry: e, date: ev.date,
        headline: `${e.name} ${VERB[ev.k]}`,
        score: size + 2 * (1 - age / WINDOW_DAYS),
      }];
    });
  }

  function toEur(m) {
    const n = parseFloat(m[1].replace(",", "."));
    return /^b/i.test(m[2]) ? n * 1e9 : n * 1e6;
  }

  function newsMoves() {
    const items = (P.signals && P.signals.items) || [];
    return items.flatMap((it) => {
      const age = ageDays(it.date);
      if (age < 0 || age > NEWS_DAYS) return [];
      if (!DEAL.test(it.title) || NOT_A_MOVE.test(it.title)) return [];
      const m = it.title.match(EUR) || it.summary.match(EUR);
      if (!m || toEur(m) < NEWS_MIN_EUR) return [];
      const entry = it.entries.length === 1 ? byId[it.entries[0]] : null;
      /* Feeds sometimes carry another article's summary: keep it only if it
         shares at least three longer words with the headline */
      const words = new Set(it.title.toLowerCase().match(/[a-z]{5,}/g) || []);
      const shared = (it.summary.toLowerCase().match(/[a-z]{5,}/g) || []).filter((w) => words.has(w));
      const summary = new Set(shared).size >= 3 ? it.summary : "";
      return [{
        id: "n:" + it.id, kind: "news", item: it, entry, summary, date: it.date, eur: toEur(m), eurText: m[0],
        headline: it.title.length > 90 ? it.title.slice(0, 88).replace(/\s+\S*$/, "") + "…" : it.title,
        score: Math.log10(toEur(m)) / 3 + 2 * (1 - age / NEWS_DAYS) + (entry ? 0.3 : 0),
      }];
    });
  }

  /* The most significant, then in date order so each day's pick is stable */
  const MOVES = [...entryMoves(), ...newsMoves()]
    .sort((a, b) => b.score - a.score).slice(0, MAX_MOVES)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? -1 : 1));
  if (!MOVES.length) return;

  const dayNumber = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / DAY);
  const pickFor = (day) => ((day % MOVES.length) + MOVES.length) % MOVES.length;
  let current = pickFor(dayNumber);

  /* ---------- 2. THE TOAST ---------- */
  /* The hawk is the favicon's silhouette, with talons holding a coin */
  const HAWK = `
    <svg class="mm-hawk" viewBox="250 140 420 740" aria-hidden="true" focusable="false">
      <path class="mm-h-t" d="M360,650 L406,676 L404,858 C401,882 386,890 373,885 C360,878 357,862 359,832 Z"/>
      <path class="mm-h-t" d="M394,686 L470,686 C474,750 478,820 475,858 C472,882 453,890 434,886 C414,882 405,870 403,850 Z"/>
      <path class="mm-h-s" d="M376,280 C350,300 318,330 300,375 C286,420 286,480 290,540 C296,630 312,720 328,797 C340,740 352,680 358,620 C362,520 364,420 376,280 Z"/>
      <path class="mm-h-s" d="M468,153 C505,152 532,166 540,190 L535,228 C552,250 590,300 608,350 C622,410 615,480 585,550 C555,610 505,660 470,690 L392,690 C372,600 362,500 362,430 C364,360 372,300 380,250 C384,205 420,158 468,153 Z"/>
      <path class="mm-h-s" d="M520,196 C536,191 549,200 549,216 C549,228 546,236 538,243 C538,232 534,224 526,222 L478,216 C490,206 505,198 520,196 Z"/>
      <path class="mm-h-s" d="M470,688 C440,720 396,770 366,808 C360,762 356,700 354,640 L410,640 L410,688 Z"/>
      <circle class="mm-h-r" cx="473" cy="190" r="22"/>
      <circle class="mm-h-p" cx="476" cy="190" r="11"/>
      <path class="mm-h-claw" d="M452,684 C470,712 500,724 528,722 M470,686 C494,700 520,700 540,692"/>
      <g class="mm-coin" transform="translate(568 768)">
        <circle r="92" class="mm-coin-rim"/><circle r="74" class="mm-coin-face"/>
        <text y="32" text-anchor="middle" class="mm-coin-sign">€</text>
      </g>
    </svg>`;

  const toast = document.createElement("div");
  toast.className = "mm-toast";
  toast.hidden = true;
  toast.innerHTML = `
    <button type="button" class="mm-toast-open" aria-haspopup="dialog">
      ${HAWK}
      <span class="mm-tag"><span class="mm-tag-k">Big money move:</span> <span class="mm-tag-h"></span></span>
    </button>
    <button type="button" class="mm-toast-x" aria-label="Dismiss the money move">✕</button>`;
  document.body.append(toast);
  const tagH = toast.querySelector(".mm-tag-h");

  let foldTimer = null;
  function showToast() {
    tagH.textContent = MOVES[current].headline;
    toast.hidden = false;
    toast.classList.remove("is-folded");
    requestAnimationFrame(() => toast.classList.add("is-in"));
    clearTimeout(foldTimer);
    foldTimer = setTimeout(() => toast.classList.add("is-folded"), 12000);
    markSeen();
  }
  function hideToast() { toast.classList.remove("is-in"); toast.hidden = true; clearTimeout(foldTimer); }
  toast.querySelector(".mm-toast-open").addEventListener("click", () => openCard(current));
  toast.querySelector(".mm-toast-x").addEventListener("click", hideToast);
  toast.addEventListener("mouseenter", () => toast.classList.remove("is-folded"));
  toast.addEventListener("focusin", () => toast.classList.remove("is-folded"));

  /* Never on top of the entry panel or the bottom sheet */
  const panel = document.getElementById("panel");
  if (panel) new MutationObserver(() => toast.classList.toggle("is-under-panel", !panel.hidden && panel.getAttribute("aria-hidden") !== "true"))
    .observe(panel, { attributes: true, attributeFilter: ["hidden", "aria-hidden"] });

  /* ---------- 3. THE CARD ---------- */
  const dlg = document.createElement("div");
  dlg.className = "mm-layer";
  dlg.hidden = true;
  dlg.innerHTML = `
    <div class="mm-backdrop" data-close></div>
    <section class="mm-card" role="dialog" aria-modal="true" aria-labelledby="mm-title" tabindex="-1">
      <button type="button" class="mm-x" data-close aria-label="Close">✕</button>
      <div class="mm-body"></div>
    </section>`;
  document.body.append(dlg);
  const card = dlg.querySelector(".mm-card");
  const body = dlg.querySelector(".mm-body");
  let opener = null;
  let showPast = false;

  /* A tiny map of the island (the same district outlines) with one pin */
  const shapes = (P.districtShapes && P.districtShapes.features) || [];
  function miniMap(lat, lon) {
    let [x0, x1, y0, y1] = [32.2, 34.65, 34.5, 35.75];
    x0 = Math.min(x0, lon - 0.2); x1 = Math.max(x1, lon + 0.2); y0 = Math.min(y0, lat - 0.2); y1 = Math.max(y1, lat + 0.2);
    const k = Math.cos((35 * Math.PI) / 180);
    const W = 240, sx = W / ((x1 - x0) * k), H = Math.round((y1 - y0) * sx);
    const px = (lo) => (((lo - x0) * k) * sx).toFixed(1), py = (la) => ((y1 - la) * sx).toFixed(1);
    const paths = shapes.map((f) => {
      const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      return polys.map((poly) => poly.map((ring) => "M" + ring.map(([lo, la]) => px(lo) + "," + py(la)).join("L") + "Z").join("")).join("");
    }).join("");
    return `<svg class="mm-mini" viewBox="0 0 ${W} ${H}" role="img" aria-label="Pin at ${lat.toFixed(2)}°N ${lon.toFixed(2)}°E">
      <path d="${paths}" class="mm-mini-land"/>
      <circle cx="${px(lon)}" cy="${py(lat)}" r="9" class="mm-mini-halo"/><circle cx="${px(lon)}" cy="${py(lat)}" r="4.5" class="mm-mini-pin"/></svg>`;
  }

  function phrases(m) {
    const e = m.entry;
    const year = String(m.date).slice(0, 4);
    if (m.kind === "news") {
      const list = [`"${m.item.title}"`];
      if (e) list.push(`"${e.name}" ${year}`);
      const key = (m.item.title.match(/[A-Za-z€][\w.€]*/g) || []).filter((w) => w.length > 3 || /€/.test(w)).slice(0, 5).join(" ");
      list.push(`${key} Cyprus ${year}`, `${m.item.source} ${key}`);
      return [...new Set(list)].slice(0, 3);
    }
    const who = (e.developer || "").split(/[,(;]/)[0].trim();
    return [`"${e.name}" Cyprus`, `${e.name} ${m.headline.split(" ").pop()} ${year}`, who && !/^to be chosen/i.test(who) ? `"${who}" Cyprus investment` : `${e.name} tender ${year}`];
  }

  function moveHtml(m) {
    const e = m.entry;
    const where = e ? e.coords : m.item.districts.length ? districtById[m.item.districts[0]].seat : null;
    const placeName = e ? districtById[e.district].name : m.item.districts.length ? districtById[m.item.districts[0]].name : "";
    const howMuch = m.kind === "news"
      ? `<p class="mm-eur">${esc(fmtEur(m.eur))}</p><p class="o-fine">${esc(m.eurText)} as written in the headline. ${kindChip("news")}</p>`
      : e.value.eur !== null
        ? `<p class="mm-eur">${esc(fmtEur(e.value.eur))}</p><p class="o-fine">${esc(e.value.text)} ${e.sources[e.value.source] ? kindChip(e.sources[e.value.source].kind) : ""}</p>`
        : `<p class="mm-eur mm-eur--none">No reliable figure</p><p class="o-fine">${esc(e.value.text)}</p>`;
    const sources = m.kind === "news"
      ? sourceList([{ title: m.item.title, publisher: m.item.source, date: m.item.date, url: m.item.link, kind: "news" }].concat(e ? e.sources.slice(0, 2) : []))
      : sourceList(e.sources);
    const pos = MOVES.indexOf(m) + 1;
    return `
      <p class="mm-eyebrow">Big money move · ${esc(fmtDate(m.date))} · ${pos} of ${MOVES.length}</p>
      <div class="mm-head">${e ? mark(e, "lg") : `<span class="mono-tile mono-tile--lg" aria-hidden="true">€</span>`}
        <h2 class="mm-title" id="mm-title">${esc(m.headline)}</h2></div>

      <div class="mm-grid">
        <section class="mm-sec mm-sec--what"><p class="p-label">What happened</p>
          <p>${esc(m.kind === "news" ? (m.summary || m.item.title) : e.summary)}</p>
          ${m.kind === "news" ? `<p class="o-fine">${m.summary ? `From ${esc(m.item.source)}'s feed: the headline and its summary only.` : `Only the headline: the feed's summary didn't match it. Read the full story at the source.`}</p>` : ""}</section>
        <section class="mm-sec"><p class="p-label">How much</p>${howMuch}</section>
        <section class="mm-sec"><p class="p-label">Who's behind it</p>
          ${e ? `<p>${esc(e.developer)}</p>` : `<p class="o-fine">Not linked to an entry yet: see the source.</p>`}</section>
        <section class="mm-sec"><p class="p-label">Where</p>
          ${where ? miniMap(where[0], where[1]) : ""}<p class="o-fine">${esc(placeName || "Cyprus")}${e && e.north ? " · north" : ""}</p></section>
        <section class="mm-sec"><p class="p-label">When</p><p class="mm-when">${esc(fmtDate(m.date))}</p>
          ${e ? `<p class="o-fine">${esc(statusById[e.status].label)}</p>` : ""}</section>
      </div>

      <section class="mm-sec"><p class="p-label">Why it matters ${analysisChip}</p>
        ${e ? `<p>${esc(e.why)}</p>` : `<p class="o-fine">Not analysed yet: this is a news headline, and I only write analysis for entries on the map.</p>`}</section>
      ${e && e.whoGains ? `<section class="mm-sec o-gains"><p class="p-label">Who gains, who pays ${analysisChip}</p><p>${esc(e.whoGains.text)}</p></section>` : ""}

      <section class="mm-sec"><p class="p-label">Sources</p>${sources}</section>

      <section class="mm-sec"><p class="p-label">Dig deeper</p>
        <ul class="mm-phrases">${phrases(m).map((q) => `<li><code>${esc(q)}</code><button type="button" class="cite-btn" data-copy="${esc(q)}">Copy</button></li>`).join("")}</ul></section>

      <div class="mm-actions">
        ${e ? `<button type="button" class="btn mm-btn" data-map="${esc(e.id)}">Show on map</button>` : ""}
        <button type="button" class="btn mm-btn mm-btn--next" data-next>Next move <span aria-hidden="true">→</span></button>
        <button type="button" class="btn mm-btn mm-btn--quiet" data-past aria-expanded="${showPast}">Past moves</button>
      </div>
      <div class="mm-past" ${showPast ? "" : "hidden"}>
        <p class="p-label">Past moves</p>
        <ol>${MOVES.map((pm, i) => [pm, i]).filter(([, i]) => i !== shown).map(([pm, i]) => `
          <li><button type="button" data-goto="${i}"><span class="mm-past-d">${esc(fmtDate(pm.date))}</span> ${esc(pm.headline)}</button></li>`).join("")}</ol>
        <p class="o-fine">The featured move changes every day, rotating through the ${MOVES.length} biggest recent moves in the entries and the news. Dates are when each move happened.</p>
      </div>

      <label class="mm-off"><input type="checkbox" data-off ${store.get().off ? "checked" : ""}> Don't show moves when I open the page</label>`;
  }

  let shown = current;
  function render(i) {
    shown = i;
    const hadFocus = card.contains(document.activeElement);
    body.innerHTML = moveHtml(MOVES[i]);
    card.scrollTop = 0;
    if (hadFocus || document.activeElement === document.body) card.focus();
  }

  function openCard(i) {
    opener = document.activeElement;
    render(i);
    dlg.hidden = false;
    document.documentElement.classList.add("mm-open");
    requestAnimationFrame(() => dlg.classList.add("is-open"));
    card.focus();
  }
  function closeCard() {
    dlg.classList.remove("is-open");
    dlg.hidden = true;
    document.documentElement.classList.remove("mm-open");
    if (opener && document.contains(opener) && !opener.closest("[hidden]")) opener.focus();
  }

  dlg.addEventListener("click", (ev) => {
    const t = ev.target;
    if (t.closest("[data-close]")) return closeCard();
    if (t.closest("[data-next]")) return render((shown + 1) % MOVES.length);
    const past = t.closest("[data-past]");
    if (past) { showPast = !showPast; past.setAttribute("aria-expanded", String(showPast)); body.querySelector(".mm-past").hidden = !showPast; return; }
    const go = t.closest("[data-goto]");
    if (go) return render(+go.dataset.goto);
    const cp = t.closest("[data-copy]");
    if (cp) return copyText(cp.dataset.copy, cp);
    const mp = t.closest("[data-map]");
    if (mp) {
      closeCard();
      hideToast();
      const mapEl = document.getElementById("map");
      if (mapEl) mapEl.scrollIntoView({ behavior: FieldNotes.reducedMotion.matches ? "auto" : "smooth", block: "center" });
      U.focusMap(mp.dataset.map);
      U.openEntry(mp.dataset.map);
    }
  });
  dlg.addEventListener("change", (ev) => {
    if (!ev.target.matches("[data-off]")) return;
    store.set({ off: ev.target.checked });
    if (ev.target.checked) hideToast();
  });

  /* Esc closes; Tab stays inside the card */
  document.addEventListener("keydown", (ev) => {
    if (dlg.hidden) return;
    if (ev.key === "Escape") { ev.stopPropagation(); return closeCard(); }
    if (ev.key !== "Tab") return;
    const f = [...card.querySelectorAll("button, a[href], input, [tabindex='0']")].filter((x) => !x.closest("[hidden]"));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && (document.activeElement === first || document.activeElement === card)) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });

  /* ---------- 4. THE PERMANENT BUTTON, AND THE FIRST SHOW ---------- */
  const btn = document.getElementById("moves-open");
  if (btn) btn.addEventListener("click", () => openCard(current));

  if (!store.get().off && !seenThisVisit() && !/[?&]nomoves\b/.test(location.search)) {
    setTimeout(showToast, FieldNotes.reducedMotion.matches ? 600 : 2400);
  }
})();
