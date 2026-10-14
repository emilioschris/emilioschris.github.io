/* =========================================================
   KYPRIAKA · script
   ---------------------------------------------------------
   One page, many views. The part of the address after "#"
   decides what is drawn into <main id="view">:

     #/                 Home
     #/strata           The timeline as strata (today at the top)
     #/layer/:id        One layer (period)
     #/map              Map of Cyprus and the eastern Mediterranean
     #/explore          Browse and filter everything
     #/e/:id            One entity (person, place, object, event…)
     #/myth             Myth & cult
     #/thinkers         Thinkers & faith
     #/sources          Sources (#/sources/:id jumps to one)
     #/about            About & method

   1. Helpers
   2. The data, indexed (and reverse relationships)
   3. Small building blocks (claims, citations, Hellenika links)
   4. Views
   5. Map
   6. Search
   7. Router
   ========================================================= */
(() => {
  "use strict";

  const K = window.KYPRIAKA;
  const view = document.getElementById("view");
  const NOW = new Date().getFullYear();

  /* ---------------------------------------------------------
     1. HELPERS
     --------------------------------------------------------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // For search: lower case, no accents (Greek or Latin), Turkish ı → i, Greek ς → σ
  const plain = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/ς/g, "σ");

  const yearsAgo = (y) => NOW - y;
  const fmtNum = (n) => n.toLocaleString("en-GB");
  const sourceShort = (id) => (K.sources[id] && K.sources[id].short) || id;
  const hellenikaUrl = (id) => `${K.hellenika.base}#/e/${encodeURIComponent(id)}`;
  const external = (href, label) => `<a href="${esc(href)}" target="_blank" rel="noopener">${label}<span class="visually-hidden"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a>`;

  /* ---------------------------------------------------------
     2. THE DATA, INDEXED
     Periods are entities too (type "period"), so everything
     can be found, linked and searched the same way.
     --------------------------------------------------------- */
  const periods = K.periods;
  const periodIndex = new Map(periods.map((p, i) => [p.id, i]));
  const byId = new Map();
  periods.forEach((p) => byId.set(p.id, Object.assign({ type: "period" }, p)));
  K.entities.forEach((e) => byId.set(e.id, e));
  const placeById = new Map(K.places.map((p) => [p.id, p]));

  // Relationships are written once; the reverse appears automatically.
  const reverseLabel = (rel) => {
    if (K.inverse[rel]) return K.inverse[rel];
    const back = Object.keys(K.inverse).find((k) => K.inverse[k] === rel);
    return back || "related to";
  };
  const derived = new Map();
  K.entities.forEach((e) => (e.relations || []).forEach((r) => {
    if (!byId.has(r.id)) { console.info(`Kypriaka: "${e.id}" points to "${r.id}", which doesn't exist yet.`); return; }
    if (!derived.has(r.id)) derived.set(r.id, []);
    derived.get(r.id).push({ id: e.id, rel: reverseLabel(r.rel) });
  }));

  const linkTo = (id) => {
    const e = byId.get(id);
    if (!e) return esc(id);
    return `<a href="${e.type === "period" ? "#/layer/" : "#/e/"}${esc(id)}">${esc(e.name)}</a>`;
  };

  /* ---------------------------------------------------------
     3. BUILDING BLOCKS
     --------------------------------------------------------- */
  const cite = (ids) => (ids || []).map((id) =>
    `<a class="k-cite" href="#/sources/${esc(id)}">${esc(sourceShort(id))}</a>`).join(", ");

  // A confidence level drawn as six dots, filled up to its rank
  function confidenceMeter(level) {
    const c = K.confidence[level];
    if (!c) return "";
    const dots = Array.from({ length: 6 }, (_, i) => `<i class="${i < c.rank ? "on" : ""}"></i>`).join("");
    return `<span class="k-conf" title="${esc(c.desc)}"><span class="k-dots" aria-hidden="true">${dots}</span>${esc(c.label)}</span>`;
  }

  // A claim resting only on encyclopedias gets a visible "single source" marker
  const singleSource = (ids) => ids && ids.length > 0 && ids.every((id) => K.sources[id] && K.sources[id].kind === "reference");

  // One claim, with its evidence type, confidence and sources
  function claim(c) {
    const ev = K.evidence[c.evidence];
    return `<li class="k-claim">
      <p>${esc(c.text)}</p>
      <p class="k-tags">
        ${ev ? `<span class="k-ev" title="${esc(ev.desc)}">${esc(ev.label)}</span>` : ""}
        ${confidenceMeter(c.confidence)}
        ${c.sources && c.sources.length ? `<span class="k-src">Source: ${cite(c.sources)}</span>` : ""}
        ${singleSource(c.sources) ? `<span class="k-single" title="This claim rests only on an encyclopedia. It matches other accounts, but a scholarly source has not been checked yet.">Single source</span>` : ""}
      </p>
    </li>`;
  }

  function hellenikaLinks(ids) {
    const known = (ids || []).filter((id) => K.hellenika.pages[id]);
    if (!known.length) return "";
    return `<section class="k-block k-sibling">
      <h2 class="p-label">See also in <span lang="el">Ἑλληνικά</span> (Hellenika)</h2>
      <ul class="k-links">${known.map((id) => `<li>${external(hellenikaUrl(id), esc(K.hellenika.pages[id]))}</li>`).join("")}</ul>
    </section>`;
  }

  // A photo with its caption and the photographer's credit (required by the licence)
  function figure(img, cls = "k-figure") {
    if (!img) return "";
    return `<figure class="${cls}">
      <img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy" decoding="async">
      <figcaption>${esc(img.caption)} <span class="k-credit-line">Photo: ${esc(img.credit)}, ${esc(img.licence)}, ${external(img.page, "Wikimedia Commons")}</span></figcaption>
    </figure>`;
  }

  // A card linking to an entity, with its photo if it has one
  function entityCard(e) {
    const type = (K.types[e.type] || {}).label || e.type;
    return `<li><a class="k-card${e.image ? " has-image" : ""}" href="#/e/${e.id}">
      ${e.image ? `<img class="k-card-img" src="${esc(e.image.src)}" alt="" loading="lazy" decoding="async">` : ""}
      <span class="k-card-type">${esc(type)}</span>
      <span class="k-card-name">${esc(e.name)}</span>
      ${e.summary ? `<span class="k-card-sum">${esc(e.summary)}</span>` : ""}
    </a></li>`;
  }

  // A small, still map of Cyprus with some places marked (drawn after the page is shown)
  function miniMap(id, placeIds) {
    return `<figure class="k-minimap" id="${id}" data-places="${placeIds.join(",")}" aria-hidden="true"></figure>`;
  }
  function drawMiniMaps() {
    if (!window.d3) return;
    view.querySelectorAll(".k-minimap").forEach((fig) => {
      const ids = fig.dataset.places.split(",").filter(Boolean);
      const w = fig.clientWidth || 600, h = Math.round(w * 0.5);
      const projection = d3.geoMercator().fitExtent([[16, 16], [w - 16, h - 16]], K.outlines.cyprus);
      const path = d3.geoPath(projection);
      const svg = d3.select(fig).append("svg").attr("viewBox", `0 0 ${w} ${h}`);
      svg.append("path").attr("class", "k-island").attr("d", path(K.outlines.cyprus));
      ids.map((pid) => placeById.get(pid)).filter(Boolean).forEach((p) => {
        const [x, y] = projection([p.lon, p.lat]);
        const g = svg.append("g").attr("class", "k-marker k-marker--still").attr("transform", `translate(${x},${y})`);
        g.append("path").attr("class", "k-cross").attr("d", "M-5 0H5M0 -5V5");
        g.append("circle").attr("class", "k-dot").attr("r", 2.2);
        const pos = p.mini || p.label || "right";
        g.append("text").attr("x", pos === "left" ? -8 : pos === "below" ? 6 : 8).attr("y", pos === "below" ? 13 : -5).attr("text-anchor", pos === "left" ? "end" : "start").text(p.name.replace(/\s*\(.*\)$/, "").replace(/-Paliotaverna|-Ayios Dhimitrios|-Kokkinokremos/, ""));
      });
    });
  }

  const notExcavated = (what = "Layer not yet excavated") => `<p class="stamp stamp--large k-stamp">${esc(what)}</p>`;

  const pageHead = (eyebrow, title, lede, extra = "") => `
    <header class="k-head">
      <p class="k-eyebrow">${eyebrow}</p>
      <h1 class="k-h1" tabindex="-1">${title}</h1>
      ${lede ? `<p class="k-lede">${lede}</p>` : ""}
      ${extra}
    </header>`;

  /* ---------------------------------------------------------
     4. VIEWS
     Each view returns HTML, and can return a mount() function
     that runs once the HTML is on the page.
     --------------------------------------------------------- */
  const views = {};

  /* ---- Home ---- */
  views.home = () => {
    const first = periods[0];
    const ago = Math.round(yearsAgo(first.start) / 1000) * 1000;
    const excavated = periods.filter((p) => p.excavated).length;
    return {
      title: "Κυπριακά",
      html: `
      <section class="k-home">
        <div class="k-home-intro">
          <p class="k-eyebrow">Base Camp · History · Stage 1</p>
          <h1 class="k-title" tabindex="-1"><span lang="el">Κυπριακά</span> <em>Kypriaka</em></h1>
          <p class="k-lede">The island every empire passed through, dug layer by layer: from the first people on Cyprus, about ${fmtNum(ago)} years ago, to today. Every claim shows its source, the kind of evidence behind it, and how sure anyone can be.</p>
          <p class="k-actions"><a class="btn btn--solid" href="#/strata">Dig in</a> <a class="btn" href="#/map">Open the map</a> <a class="btn" href="#/about">How it works</a></p>
        </div>
        <dl class="k-stats">
          <div><dt>Layers mapped</dt><dd>${periods.length}</dd></div>
          <div><dt>Excavated</dt><dd>${excavated}</dd></div>
          <div><dt>Entities</dt><dd>${K.entities.length}</dd></div>
          <div><dt>Sources</dt><dd>${Object.keys(K.sources).length}</dd></div>
        </dl>
      </section>

      <section class="k-grid3" aria-label="How to read Kypriaka">
        <a class="k-tile" href="#/strata"><span class="k-tile-n">01</span><h2>Strata</h2><p>The timeline as an archaeological section. Today is at the top; scroll down to dig deeper.</p></a>
        <a class="k-tile" href="#/about"><span class="k-tile-n">02</span><h2>Evidence, tagged</h2><p>Every claim says what kind of evidence it rests on and how confident anyone is entitled to be.</p></a>
        <a class="k-tile" href="${esc(K.hellenika.base)}" target="_blank" rel="noopener"><span class="k-tile-n">03</span><h2>A sibling of <span lang="el">Ἑλληνικά</span></h2><p>Built in the shape of George Philippou's Hellenika, and linked to it wherever the two histories meet.<span class="visually-hidden"> (opens in a new tab)</span></p></a>
      </section>

      <section class="k-block k-stage">
        ${excavated ? `<p class="stamp stamp--large stamp--visited k-stamp">${excavated} of ${periods.length} layers excavated</p>` : notExcavated("Stage 1: mapped, not yet excavated")}
        <p>${excavated ? `Excavated so far: ${periods.filter((p) => p.excavated).map((p) => `<a href="#/layer/${p.id}">${esc(p.name)}</a> (${esc(p.dates)})`).join(", ")}. The other layers have cited dates and wait their turn.` : "The layers, their dates and their sources are in place. The people, places, objects and events inside them come next, one layer at a time."}</p>
      </section>`,
    };
  };

  /* ---- Strata ---- */
  const SOIL = { "Modern": "--ochre", "Early modern": "--ochre", "Medieval": "--olive", "Ancient": "--terracotta", "Iron Age": "--terracotta", "Bronze Age": "--olive", "Prehistoric": "--ink" };

  // A gently wavy edge for each layer, different for every layer but fixed
  function edge(seed) {
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    let line = "M0 " + (8 + rnd() * 6).toFixed(1);
    for (let x = 100; x <= 1000; x += 100) {
      const cx = x - 50, cy = 3 + rnd() * 14, y = 6 + rnd() * 8;
      line += ` Q${cx} ${cy.toFixed(1)} ${x} ${y.toFixed(1)}`;
    }
    return { line, fill: line + " L1000 20 L0 20 Z" };
  }

  views.strata = () => {
    const layers = periods.slice().reverse();
    const edges = layers.map((_, i) => edge(i + 3));
    const items = layers.map((p, i) => {
      const end = p.end === null ? NOW : p.end;
      const duration = Math.max(1, end - p.start);
      const h = Math.max(132, Math.round(Math.sqrt(duration) * 8));    // square-root scale
      const depth = i / (layers.length - 1);
      const pct = Math.round(11 + depth * 18 + (i % 2 ? 6 : 0));        // alternate so each layer reads
      const soil = `color-mix(in srgb, var(${SOIL[p.era] || "--ochre"}) ${pct}%, var(--bg))`;
      const top = p.end === null ? "Today" : (p.end < 0 ? `${fmtNum(-p.end)} BC` : `AD ${p.end}`);
      return `<li class="stratum" style="--h:${h}px; --soil:${soil}">
        <svg class="stratum-edge" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true"><path d="${edges[i].fill}"/><path class="stratum-line" d="${edges[i].line}"/></svg>
        <span class="stratum-top" aria-hidden="true">${top}</span>
        <a class="stratum-link" href="#/layer/${p.id}">
          <span class="stratum-dates">${esc(p.dates)}</span>
          <span class="stratum-name">${esc(p.name)}</span>
          <span class="stratum-sub">${esc(p.subtitle)}</span>
          <span class="stratum-era">${esc(p.era)} · ${fmtNum(duration)} years</span>
          ${p.excavated ? "" : `<span class="stamp stratum-stamp">Not yet excavated</span>`}
        </a>
      </li>`;
    }).join("");

    return {
      title: "Strata",
      html: `${pageHead("Timeline", "Strata",
        "Today is at the top. Scroll down to dig deeper into the past. Longer periods are thicker, on a gentle square-root scale so short recent layers stay readable; the real dates are written on every layer.")}
      <ol class="strata" aria-label="Layers, from today at the top to the earliest at the bottom">${items}</ol>
      <p class="strata-bedrock"><span>Bedrock</span> Before the first people</p>`,
    };
  };

  /* ---- One layer ---- */
  views.layer = ({ id }) => {
    const i = periodIndex.get(id);
    if (i === undefined) return views.notFound();
    const p = periods[i];
    const older = periods[i - 1], newer = periods[i + 1];
    const places = (p.sites || []).map((sid) => placeById.get(sid)).filter(Boolean);
    const inLayer = K.entities.filter((e) => (e.period || []).includes(p.id));
    return {
      title: p.name,
      html: `
      <article class="k-layer">
        ${pageHead(`Layer ${periods.length - i} of ${periods.length} from the top · ${esc(p.era)}`, esc(p.name), esc(p.subtitle),
          `<p class="k-dates">${esc(p.dates)}</p>${p.excavated ? "" : notExcavated()}`)}

        ${p.overview ? `<section class="k-block k-overview">
          <h2 class="p-label">Overview</h2>
          ${p.overview.map((o) => `<p>${esc(o.text)} <span class="k-src">${cite(o.sources)}</span></p>`).join("")}
        </section>` : ""}

        ${p.excavated && places.length ? `<section class="k-block k-wide">
          <h2 class="p-label">Sites in this layer</h2>
          ${miniMap("mm-" + p.id, places.map((pl) => pl.id))}
          <p class="k-actions"><a class="btn" href="#/map">Open the full map</a></p>
        </section>` : ""}

        ${p.excavated && inLayer.length ? `<section class="k-block k-wide">
          <h2 class="p-label">Found in this layer</h2>
          ${Object.keys(K.types).filter((t) => inLayer.some((e) => e.type === t)).map((t) => `
            <h3 class="k-group">${esc(K.types[t].plural)}</h3>
            <ul class="k-results">${inLayer.filter((e) => e.type === t).map(entityCard).join("")}</ul>`).join("")}
        </section>` : ""}

        <section class="k-block">
          <h2 class="p-label">What the sources say about its dates</h2>
          <ul class="k-says">${p.says.map((s) => `<li><p>${esc(s.text)}</p><p class="k-src">Source: ${cite([s.source])}</p></li>`).join("")}</ul>
        </section>

        ${p.disagree.length ? `<section class="k-block">
          <h2 class="p-label">Where sources disagree, or are uncertain</h2>
          <ul class="k-disagree">${p.disagree.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        </section>` : ""}

        ${p.excavated ? "" : `<section class="k-block">
          <h2 class="p-label">Found in this layer</h2>
          ${inLayer.length ? `<ul class="k-links">${inLayer.map((e) => `<li>${linkTo(e.id)}</li>`).join("")}</ul>`
            : `<p class="k-empty">Nothing excavated yet.</p>`}
          ${places.length ? `<p class="k-chips">${places.map((pl) => `<a class="k-chip" href="#/map?place=${pl.id}"><span class="crosshair" aria-hidden="true"></span>${esc(pl.name)}</a>`).join("")}</p>` : ""}
        </section>`}

        ${hellenikaLinks(p.hellenika)}

        <nav class="k-dig" aria-label="Neighbouring layers">
          ${newer ? `<a href="#/layer/${newer.id}"><span>↑ Up a layer</span>${esc(newer.name)}</a>` : `<span></span>`}
          ${older ? `<a href="#/layer/${older.id}"><span>↓ Dig deeper</span>${esc(older.name)}</a>` : `<span class="k-dig-end">Bedrock: this is the earliest layer.</span>`}
        </nav>
      </article>`,
      mount: drawMiniMaps,
    };
  };

  /* ---- One entity (people, places, objects, events, myths, thinkers) ---- */
  views.entity = ({ id }) => {
    const e = byId.get(id);
    if (!e) return views.notFound();
    if (e.type === "period") { location.replace(`#/layer/${id}`); return { title: e.name, html: "" }; }
    const type = K.types[e.type] || { label: e.type };
    const rels = [...(e.relations || []), ...(derived.get(id) || [])];
    const mythParts = [["story", "The story as told"], ["earliestSource", "Earliest surviving source"], ["religiousRole", "Religious role"],
      ["historicalBackground", "Possible historical background"], ["archaeology", "What archaeology shows"], ["laterReinterpretation", "Later reinterpretation"]];
    return {
      title: e.name,
      html: `
      <article class="k-entity">
        ${pageHead(`${esc(type.label)}${e.period ? " · " + e.period.map(linkTo).join(", ") : ""}`, esc(e.name),
          e.summary ? esc(e.summary) : "",
          e.altNames && e.altNames.length ? `<p class="k-alt">Also: ${e.altNames.map(esc).join(" · ")}</p>` : "")}
        ${figure(e.image)}
        ${e.place && placeById.get(e.place) ? `<p class="k-chips"><a class="k-chip" href="#/map?place=${e.place}"><span class="crosshair" aria-hidden="true"></span>See it on the map</a></p>` : ""}
        ${e.type === "myth" ? mythParts.filter(([k]) => e[k]).map(([k, label]) => `<section class="k-block"><h2 class="p-label">${label}</h2><p>${esc(e[k])}</p></section>`).join("") : ""}
        ${e.claims && e.claims.length ? `<section class="k-block"><h2 class="p-label">Claims</h2><ul class="k-claims">${e.claims.map(claim).join("")}</ul></section>` : ""}
        ${rels.length ? `<section class="k-block"><h2 class="p-label">Connections</h2><ul class="k-rels">${rels.map((r) => `<li><span>${esc(r.rel)}</span> ${linkTo(r.id)}</li>`).join("")}</ul></section>` : ""}
        ${e.sources && e.sources.length ? `<section class="k-block"><h2 class="p-label">Sources</h2><p>${cite(e.sources)}</p></section>` : ""}
        ${hellenikaLinks(e.hellenika)}
      </article>`,
    };
  };

  /* ---- Explore ---- */
  views.explore = () => {
    const typeButtons = [["all", "All"], ...Object.entries(K.types).map(([k, t]) => [k, t.plural])];
    const opts = (obj) => Object.entries(obj).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join("");
    return {
      title: "Explore",
      html: `${pageHead("Explore", "Explore",
        "Everything on the site in one place. Filter by kind, by layer, or by the evidence behind it.")}
      <div class="k-filters">
        <div class="pill-group" role="group" aria-label="Kind">${typeButtons.map(([k, label], i) =>
          `<button type="button" data-type="${k}" aria-pressed="${i === 0}">${esc(label)}</button>`).join("")}</div>
        <label class="k-select"><span>Layer</span><select id="f-period"><option value="">Any layer</option>${periods.slice().reverse().map((p) => `<option value="${p.id}">${esc(p.name)} (${esc(p.dates)})</option>`).join("")}</select></label>
        <label class="k-select"><span>Evidence</span><select id="f-evidence"><option value="">Any evidence</option>${opts(K.evidence)}</select></label>
        <label class="k-select"><span>Confidence</span><select id="f-confidence"><option value="">Any confidence</option>${opts(K.confidence)}</select></label>
      </div>
      <p class="k-count" id="f-count" role="status"></p>
      <ul class="k-results" id="f-results"></ul>`,
      mount() {
        const state = { type: "all" };
        const all = [...byId.values()];
        const results = document.getElementById("f-results");
        const count = document.getElementById("f-count");
        function render() {
          const period = document.getElementById("f-period").value;
          const evidence = document.getElementById("f-evidence").value;
          const confidence = document.getElementById("f-confidence").value;
          const list = all.filter((e) => {
            if (state.type !== "all" && e.type !== state.type) return false;
            if (period && !(e.id === period || (e.period || []).includes(period))) return false;
            if (evidence && !(e.claims || []).some((c) => c.evidence === evidence)) return false;
            if (confidence && !(e.claims || []).some((c) => c.confidence === confidence)) return false;
            return true;
          });
          count.textContent = `${list.length} ${list.length === 1 ? "result" : "results"}`;
          results.innerHTML = list.length ? list.map((e) => e.type !== "period" ? entityCard(e) : `<li><a class="k-card" href="#/layer/${e.id}">
              <span class="k-card-type">Layer</span>
              <span class="k-card-name">${esc(e.name)}</span>
              <span class="k-card-meta">${esc(e.dates || "")}</span>
              ${e.excavated ? `<span class="k-card-note k-card-note--dug">Excavated</span>` : `<span class="k-card-note">Not yet excavated</span>`}
            </a></li>`).join("")
            : `<li class="k-empty">Nothing excavated here yet. As layers are dug, the people, places, objects and events found in them will appear here.</li>`;
        }
        view.querySelectorAll(".pill-group button").forEach((b, _, btns) => b.addEventListener("click", () => {
          state.type = b.dataset.type;
          btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          render();
        }));
        view.querySelectorAll("select").forEach((s) => s.addEventListener("change", render));
        render();
      },
    };
  };

  /* ---- Myth & cult ---- */
  views.myth = () => {
    const myths = K.entities.filter((e) => e.type === "myth");
    return {
      title: "Myth & cult",
      html: `${pageHead("Myth &amp; cult", "Myth &amp; cult",
        "The stories, gods and cults of Cyprus. Myths don't use the history template. Following Hellenika, each one is split into six parts, so a story is never mistaken for a fact and a fact is never lost inside a story.")}
      <section class="k-block">
        <h2 class="p-label">How each myth is written</h2>
        <ol class="k-six">
          <li><b>The story as told</b> in its own terms.</li>
          <li><b>The earliest surviving source</b> for it, and how long after the events it claims to describe.</li>
          <li><b>Its religious role</b>: where and how it was worshipped or retold.</li>
          <li><b>Possible historical background</b>, if any, with its confidence level.</li>
          <li><b>What archaeology actually shows.</b></li>
          <li><b>Later reinterpretation</b>, from antiquity to now.</li>
        </ol>
        <p class="k-note">A myth with no historical basis can still be the most important thing a society believed. Separating the parts isn't dismissal.</p>
      </section>
      <section class="k-block">
        <h2 class="p-label">Myths and cults</h2>
        ${myths.length ? `<ul class="k-links">${myths.map((m) => `<li>${linkTo(m.id)}</li>`).join("")}</ul>` : notExcavated("Not yet excavated")}
      </section>
      ${hellenikaLinks(["aphrodite", "adonis", "aphrodite-baetyl-paphos"])}`,
    };
  };

  /* ---- Thinkers & faith ---- */
  views.thinkers = () => {
    const list = K.entities.filter((e) => e.type === "thinker");
    return {
      title: "Thinkers & faith",
      html: `${pageHead("Thinkers &amp; faith", "Thinkers &amp; faith",
        "The ideas and beliefs that came from Cyprus or shaped it: philosophers, writers and scholars, saints and churches, mosques and the island's faith communities, from antiquity to today.")}
      <section class="k-block">
        <h2 class="p-label">Thinkers and faiths</h2>
        ${list.length ? `<ul class="k-links">${list.map((t) => `<li>${linkTo(t.id)}</li>`).join("")}</ul>` : notExcavated("Not yet excavated")}
      </section>
      ${hellenikaLinks(["zeno-of-citium"])}`,
    };
  };

  /* ---- Sources ---- */
  const KINDS = [["scholarly", "Scholarly"], ["research", "Research institutes"], ["official", "Official bodies"],
    ["reference", "Reference works"], ["data", "Data"], ["sibling", "Sibling site"]];
  views.sources = ({ id } = {}) => ({
    title: "Sources",
    html: `${pageHead("Sources", "Sources",
      "Every date and claim on the site points to one of these. Reference works like Wikipedia are only used alongside other sources, and where they disagree the disagreement is shown, not hidden.")}
      ${KINDS.map(([kind, label]) => {
        const list = Object.entries(K.sources).filter(([, s]) => s.kind === kind);
        if (!list.length) return "";
        return `<section class="k-block"><h2 class="p-label">${label}</h2><ol class="k-sources">${list.map(([sid, s]) => `
          <li id="src-${sid}" class="${sid === id ? "is-target" : ""}">
            <p class="k-source-cite">${esc(s.citation)}</p>
            <p><b>Used for:</b> ${esc(s.usedFor)}</p>
            ${s.note ? `<p class="k-source-note">${esc(s.note)}</p>` : ""}
            <p class="k-source-meta">${external(s.url, "Open source")} <span>Read ${esc(s.accessed)}</span> <span class="k-source-id">${esc(sid)}</span></p>
          </li>`).join("")}</ol></section>`;
      }).join("")}`,
    mount() {
      if (!id) return;
      const target = document.getElementById(`src-${id}`);
      if (target) setTimeout(() => target.scrollIntoView({ block: "center", behavior: FieldNotes.reducedMotion.matches ? "auto" : "smooth" }), 50);
    },
  });

  /* ---- About & method ---- */
  views.about = () => {
    const example = { text: "Cyprus has been a member state of the European Union since 1 May 2004.", evidence: "documentary", confidence: "established", sources: ["eu-cyprus"] };
    return {
      title: "About & method",
      html: `${pageHead("About &amp; method", "About &amp; method", "")}
      <section class="k-block k-credit">
        <h2 class="p-label">A sibling of <span lang="el">Ἑλληνικά</span></h2>
        <p>Kypriaka is built in the shape of <b lang="el">Ἑλληνικά</b> (Hellenika), George Philippou's interactive atlas of the Ancient Greek world. Its structure (a timeline, a map, connected entities, search, sources, and a system for tagging every claim with its evidence and confidence) is George's work, mirrored here with his permission. Thank you, George.</p>
        <p class="k-actions">${external(K.hellenika.base, "Visit Hellenika")} ${external(K.hellenika.repo, "Hellenika on GitHub")}</p>
        <p>Kypriaka is a sibling, not a copy. It tells the story of one island instead of the whole Greek world, runs from the first people on Cyprus to today, wears the Field Notes design, and its code is written separately. Wherever the two histories overlap, Kypriaka links to the matching Hellenika page instead of repeating it.</p>
      </section>

      <section class="k-block">
        <h2 class="p-label">Every claim is tagged</h2>
        <p>Every factual statement carries two tags: the kind of evidence it rests on, and how confident anyone is entitled to be. Like this:</p>
        <ul class="k-claims">${claim(example)}</ul>
      </section>

      <section class="k-block">
        <h2 class="p-label">Kinds of evidence</h2>
        <dl class="k-defs">${Object.values(K.evidence).map((e) => `<div><dt>${esc(e.label)}${e.kypriaka ? ` <span class="k-new">Added for Kypriaka</span>` : ""}</dt><dd>${esc(e.desc)}</dd></div>`).join("")}</dl>
        <p class="k-note">The first eight are Hellenika's. Kypriaka adds two for medieval and modern Cyprus, where archives and living memory matter.</p>
      </section>

      <section class="k-block">
        <h2 class="p-label">How sure can we be?</h2>
        <dl class="k-defs">${Object.keys(K.confidence).map((k) => `<div><dt>${confidenceMeter(k)}</dt><dd>${esc(K.confidence[k].desc)}</dd></div>`).join("")}</dl>
      </section>

      <section class="k-block">
        <h2 class="p-label">Dates, and where they disagree</h2>
        <p>The layers follow the chronology table in ${cite(["harper-fox-2008"])}, checked against ${cite(["georgiadou-kyprios-character"])} and other sources. Prehistoric dates are approximate and are revised as new finds are radiocarbon dated, so they are written with "c." (about). Where sources disagree, every layer says so.</p>
      </section>

      <section class="k-block">
        <h2 class="p-label">Neutral language</h2>
        <p>Cyprus's recent history is still painful and still argued over, and even the words for events are contested. From the 1950s onward, Kypriaka will set each community's account side by side, each with its sources, and use neutral wording such as the United Nations' "the hostilities of 1974" (${cite(["un-unficyp"])}). Places are named in Greek, Turkish and English where each is used.</p>
      </section>

      <section class="k-block">
        <h2 class="p-label">Built with AI, checked by hand</h2>
        <p>I build Kypriaka with AI as part of Field Notes. Facts come from the sources listed on the Sources page, never from memory, and anything uncertain is flagged rather than guessed. If you spot a mistake, the evidence tags are the way to argue with it: a claim marked "established" that you know is contested is a bug, and I'd like to hear about it.</p>
      </section>

      <section class="k-block">
        <h2 class="p-label">Where it's up to</h2>
        <p>The ${periods.length} layers all have cited dates. Excavated so far: ${periods.filter((p) => p.excavated).map((p) => `<a href="#/layer/${p.id}">${esc(p.name)}</a>`).join(", ") || "none"}, with ${K.entities.length} entities and ${K.entities.reduce((n, e) => n + (e.claims || []).length, 0)} tagged claims.</p>
        <p>Claims marked <span class="k-single">Single source</span> rest only on an encyclopedia. They match other accounts, but a scholarly source hasn't been checked yet; they're shown so you can judge them for yourself.</p>
      </section>`,
    };
  };

  /* ---- Not found ---- */
  views.notFound = () => ({
    title: "Not found",
    html: `${pageHead("Not found", "Nothing here", "This part of the island hasn't been surveyed. Try the strata, or search.")}
      <p class="k-actions"><a class="btn btn--solid" href="#/strata">Go to the strata</a></p>`,
  });

  /* ---------------------------------------------------------
     5. MAP
     Drawn with D3 from the outlines in data/geo.js. Two views:
     the island, and the eastern Mediterranean around it.
     --------------------------------------------------------- */
  const sheet = FieldNotes.panel(document.getElementById("panel"));
  const panelBody = document.getElementById("panel-body");

  function openPlace(place, opener) {
    const layers = periods.filter((p) => (p.sites || []).includes(place.id)).reverse();
    const found = K.entities.filter((e) => e.place === place.id || (e.relations || []).some((r) => r.rel === "found at" && byId.get(r.id) && byId.get(r.id).place === place.id));
    const lat = `${Math.abs(place.lat).toFixed(3)}°${place.lat >= 0 ? "N" : "S"}`;
    const lon = `${Math.abs(place.lon).toFixed(3)}°${place.lon >= 0 ? "E" : "W"}`;
    panelBody.innerHTML = `
      <p class="p-coords">${lat} ${lon}</p>
      <h2 class="p-title" id="panel-title">${esc(place.name)}</h2>
      ${place.altNames ? `<p class="k-alt">${place.altNames.map(esc).join(" · ")}</p>` : ""}
      ${found.length ? "" : notExcavated("Not yet excavated")}
      ${place.approx ? `<p class="k-approx">${esc(place.approx)}</p>` : ""}
      ${found.length ? `<section class="p-section"><p class="p-label">Found here</p><ul class="k-links">${found.map((e) => `<li>${linkTo(e.id)} <span class="k-muted">${esc((K.types[e.type] || {}).label || "")}</span></li>`).join("")}</ul></section>` : ""}
      ${layers.length ? `<section class="p-section"><p class="p-label">Layers</p><ul class="k-links">${layers.map((l) => `<li><a href="#/layer/${l.id}">${esc(l.name)}</a> <span class="k-muted">${esc(l.dates)}</span></li>`).join("")}</ul></section>` : ""}
      ${place.hellenika ? `<section class="p-section"><p class="p-label">See also in <span lang="el">Ἑλληνικά</span></p><p>${external(hellenikaUrl(place.hellenika), esc(K.hellenika.pages[place.hellenika] || place.name))}</p></section>` : ""}
      <p class="p-sources">Coordinates: ${external(`https://www.wikidata.org/wiki/${place.wikidata}`, `Wikidata ${esc(place.wikidata)}`)}</p>`;
    sheet.open(opener);
  }

  views.map = (_, query) => {
    const focus = query.place && placeById.get(query.place);
    const scope = query.view === "mediterranean" || (focus && focus.scope === "mediterranean") ? "mediterranean" : "cyprus";
    const list = (s) => K.places.filter((p) => p.scope === s).map((p) =>
      `<li><button type="button" data-place="${p.id}"><span class="crosshair" aria-hidden="true"></span>${esc(p.name)}</button></li>`).join("");
    return {
      title: "Map",
      html: `${pageHead("Map", "Map",
        "Cyprus, and the eastern Mediterranean it was always connected to. Places are marked but not yet excavated; select one to see its layers.")}
      <div class="pill-group k-map-switch" role="group" aria-label="Map view">
        <button type="button" data-scope="cyprus" aria-pressed="${scope === "cyprus"}">The island</button>
        <button type="button" data-scope="mediterranean" aria-pressed="${scope === "mediterranean"}">Eastern Mediterranean</button>
      </div>
      <figure class="k-map-frame">
        <svg class="k-map" id="k-map" role="img" aria-label="Map of Cyprus. The list of places below the map has the same places as buttons."></svg>
        <div class="icon-stack k-map-zoom" role="group" aria-label="Map zoom">
          <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
          <button type="button" data-zoom="out" aria-label="Zoom out">−</button>
          <button type="button" data-zoom="reset" aria-label="Reset map view">⟲</button>
        </div>
        <figcaption class="k-map-credit">Coastlines: Natural Earth · Coordinates: Wikidata</figcaption>
      </figure>
      <section class="k-block">
        <h2 class="p-label">Places on Cyprus</h2><ul class="k-place-list">${list("cyprus")}</ul>
        <h2 class="p-label">Around the eastern Mediterranean</h2><ul class="k-place-list">${list("mediterranean")}</ul>
      </section>`,
      mount() {
        const svgEl = document.getElementById("k-map");
        if (!window.d3) {
          svgEl.outerHTML = `<p class="p-error">The map needs the D3 library, which couldn't load. Check your internet connection. The list of places below still works.</p>`;
          return;
        }
        let current = scope, zoom, layer, k = 1;
        const svg = d3.select(svgEl);

        function draw() {
          const r = svgEl.getBoundingClientRect();
          const w = Math.max(300, r.width), h = Math.max(260, r.height);
          svg.attr("viewBox", `0 0 ${w} ${h}`).selectAll("*").remove();
          const island = current === "cyprus";
          const frame = island ? K.outlines.cyprus : { type: "MultiPoint", coordinates: [[20, 30], [37, 40.5]] };
          const projection = d3.geoMercator().fitExtent([[24, 24], [w - 24, h - 24]], frame);
          const path = d3.geoPath(projection);

          layer = svg.append("g");
          layer.append("rect").attr("class", "k-sea").attr("x", -w).attr("y", -h).attr("width", w * 3).attr("height", h * 3);
          layer.append("path").attr("class", "k-graticule").attr("d", path(d3.geoGraticule().step(island ? [0.5, 0.5] : [5, 5])()));
          if (!island) layer.append("path").attr("class", "k-land").attr("d", path(K.outlines.mediterranean));
          layer.append("path").attr("class", "k-island").attr("d", path(K.outlines.cyprus));

          const marks = layer.append("g");
          K.places.filter((p) => p.scope === current || (!island && p.id === "nicosia")).forEach((p) => {
            const [x, y] = projection([p.lon, p.lat]);
            const g = marks.append("g").attr("class", "k-marker").attr("data-x", x).attr("data-y", y)
              .attr("tabindex", 0).attr("role", "button").attr("aria-label", `${p.name}: open details`)
              .on("click", function () { openPlace(p, this); })
              .on("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPlace(p, this); } });
            g.append("circle").attr("class", "k-hit").attr("r", 14);
            g.append("path").attr("class", "k-cross").attr("d", "M-6 0H6M0 -6V6");
            g.append("circle").attr("class", "k-dot").attr("r", 2.4);
            const left = island && p.label === "left";
            g.append("text").attr("x", left ? -9 : 9).attr("y", -6).attr("text-anchor", left ? "end" : "start")
              .text(!island && p.id === "nicosia" ? "Cyprus" : p.name);
          });

          zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [w, h]]).on("zoom", (e) => {
            layer.attr("transform", e.transform); k = e.transform.k; place();
          });
          svg.call(zoom);
          k = 1; place();
        }
        // Markers keep their size while zooming
        function place() {
          layer.selectAll(".k-marker").attr("transform", function () { return `translate(${this.dataset.x},${this.dataset.y}) scale(${1 / k})`; });
        }

        draw();
        const ro = new ResizeObserver(() => draw());
        ro.observe(svgEl);

        view.querySelectorAll(".k-map-switch button").forEach((b, _, all) => b.addEventListener("click", () => {
          current = b.dataset.scope;
          all.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          draw();
        }));
        view.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
          const t = svg.transition().duration(FieldNotes.motion(350));
          if (b.dataset.zoom === "in") t.call(zoom.scaleBy, 1.6);
          else if (b.dataset.zoom === "out") t.call(zoom.scaleBy, 1 / 1.6);
          else t.call(zoom.transform, d3.zoomIdentity);
        }));
        view.querySelectorAll("[data-place]").forEach((b) => b.addEventListener("click", () => openPlace(placeById.get(b.dataset.place), b)));
        if (focus) openPlace(focus);
        return () => ro.disconnect();
      },
    };
  };

  /* ---------------------------------------------------------
     6. SEARCH
     Press "/" anywhere (or the Search button). Finds layers,
     entities, places, sources and pages. Greek and Turkish
     names work with or without accents.
     --------------------------------------------------------- */
  const PAGES = [["Strata", "#/strata"], ["Map", "#/map"], ["Explore", "#/explore"], ["Myth & cult", "#/myth"],
    ["Thinkers & faith", "#/thinkers"], ["Sources", "#/sources"], ["About & method", "#/about"]];
  const searchIndex = [
    ...periods.map((p) => ({ label: p.name, detail: `Layer · ${p.dates}`, href: `#/layer/${p.id}`, hay: [p.name, p.subtitle, p.era, p.dates] })),
    ...K.entities.map((e) => ({ label: e.name, detail: (K.types[e.type] || {}).label || e.type, href: `#/e/${e.id}`, hay: [e.name, ...(e.altNames || []), e.summary] })),
    ...K.places.map((p) => ({ label: p.name, detail: (p.altNames || []).join(" · ") || "Place on the map", href: `#/map?place=${p.id}`, hay: [p.name, ...(p.altNames || [])] })),
    ...Object.entries(K.sources).map(([id, s]) => ({ label: s.short || id, detail: "Source", href: `#/sources/${id}`, hay: [s.citation, id] })),
    ...PAGES.map(([label, href]) => ({ label, detail: "Page", href, hay: [label] })),
  ].map((item) => Object.assign(item, { text: plain(item.hay.join(" ")), name: plain(item.label) }));

  const searchBox = document.getElementById("search");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  let searchHits = [], searchActive = 0, searchOpener = null;

  function runSearch() {
    const words = plain(searchInput.value).split(/\s+/).filter(Boolean);
    searchHits = words.length ? searchIndex
      .filter((it) => words.every((w) => it.text.includes(w)))
      .sort((a, b) => (b.name.startsWith(words[0]) - a.name.startsWith(words[0])))
      .slice(0, 12) : [];
    searchActive = 0;
    searchResults.innerHTML = searchHits.length
      ? searchHits.map((h, i) => `<li role="option" id="hit-${i}" aria-selected="${i === 0}"><a href="${h.href}" tabindex="-1"><span>${esc(h.label)}</span><small>${esc(h.detail)}</small></a></li>`).join("")
      : (words.length ? `<li class="k-empty">Nothing found. This part of the island may not be excavated yet.</li>` : "");
    searchInput.setAttribute("aria-activedescendant", searchHits.length ? "hit-0" : "");
  }
  function moveSearch(step) {
    if (!searchHits.length) return;
    searchActive = (searchActive + step + searchHits.length) % searchHits.length;
    searchResults.querySelectorAll("[role=option]").forEach((li, i) => li.setAttribute("aria-selected", String(i === searchActive)));
    searchInput.setAttribute("aria-activedescendant", `hit-${searchActive}`);
    document.getElementById(`hit-${searchActive}`).scrollIntoView({ block: "nearest" });
  }
  function openSearch() {
    searchOpener = document.activeElement;
    searchBox.hidden = false;
    searchInput.value = "";
    runSearch();
    searchInput.focus();
  }
  function closeSearch() {
    if (searchBox.hidden) return;
    searchBox.hidden = true;
    if (searchOpener && document.contains(searchOpener)) searchOpener.focus({ preventScroll: true });
  }
  document.getElementById("search-open").addEventListener("click", openSearch);
  searchInput.addEventListener("input", runSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSearch(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSearch(-1); }
    else if (e.key === "Enter" && searchHits[searchActive]) { e.preventDefault(); searchBox.hidden = true; location.hash = searchHits[searchActive].href; }
    else if (e.key === "Escape") { e.preventDefault(); closeSearch(); }
  });
  searchResults.addEventListener("click", (e) => { if (e.target.closest("a")) searchBox.hidden = true; });
  searchBox.addEventListener("click", (e) => { if (e.target === searchBox) closeSearch(); });
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); openSearch(); }
  });

  /* ---------------------------------------------------------
     7. ROUTER
     Reads the address after "#", picks a view, draws it.
     --------------------------------------------------------- */
  const ROUTES = [
    ["/", views.home], ["/strata", views.strata], ["/layer/:id", views.layer], ["/map", views.map],
    ["/explore", views.explore], ["/e/:id", views.entity], ["/myth", views.myth], ["/thinkers", views.thinkers],
    ["/sources", views.sources], ["/sources/:id", views.sources], ["/about", views.about],
  ].map(([pattern, fn]) => {
    const keys = [];
    const rx = new RegExp("^" + pattern.replace(/:([a-z]+)/g, (_, key) => { keys.push(key); return "([^/]+)"; }) + "$");
    return { pattern, rx, keys, fn };
  });

  let cleanup = null;
  let firstRender = true;

  function render() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const query = Object.fromEntries(new URLSearchParams(qs || ""));
    let route = null, params = {};
    for (const r of ROUTES) {
      const m = path.match(r.rx);
      if (m) { route = r; r.keys.forEach((key, i) => { params[key] = decodeURIComponent(m[i + 1]); }); break; }
    }
    const result = (route ? route.fn : views.notFound)(params, query);
    if (cleanup) { cleanup(); cleanup = null; }
    view.innerHTML = result.html;
    document.title = `${result.title} · Kypriaka · Field Notes`;

    // Highlight the current section tab
    const top = "/" + (path.split("/")[1] || "");
    const tabFor = { "/layer": "/strata", "/e": "/explore" }[top] || top;
    document.querySelectorAll(".k-tabs a").forEach((a) => {
      if (a.dataset.tab === tabFor) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    if (result.mount) cleanup = result.mount() || null;
    if (!path.startsWith("/sources/")) window.scrollTo(0, 0);
    // Move keyboard focus to the new page's heading (not on first load)
    if (!firstRender) { const h1 = view.querySelector("h1"); if (h1) h1.focus({ preventScroll: true }); }
    firstRender = false;
  }

  window.addEventListener("hashchange", render);
  render();
})();
