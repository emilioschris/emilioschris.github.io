/* =========================================================
   PARATIRITIRIO · the page
   ---------------------------------------------------------
   1. Helpers (formatting, icons)
   2. The header strip
   3. The map: tiles, districts, pins, legend
   4. The panel: an entry, a district, "about this map"
   5. The ledger (every entry as a list)
   6. Links into the page (#/e/id, #/d/id)
   ========================================================= */
(() => {
  "use strict";

  const P = window.PARATIRITIRIO;
  const byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const districtById = Object.fromEntries(P.districts.map((d) => [d.id, d]));
  const typeById = Object.fromEntries(P.types.map((t) => [t.id, t]));
  const statusById = Object.fromEntries(P.statuses.map((s) => [s.id, s]));
  const sectorById = Object.fromEntries(P.sectors.map((s) => [s.id, s]));

  /* ---------- 1. HELPERS ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(d) {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    if (!m) return y;
    return (day ? Number(day) + " " : "") + MONTHS[Number(m) - 1] + " " + y;
  }

  /* €1.43bn, €650m, €300,000 */
  function fmtEur(n) {
    if (n === null || n === undefined) return "";
    if (n >= 1e9) return "€" + (n / 1e9).toFixed(n % 1e9 ? 2 : 0).replace(/\.?0+$/, "") + "bn";
    if (n >= 1e6) return "€" + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
    return "€" + n.toLocaleString("en-GB");
  }

  function band(e) {
    const eur = e.value && e.value.eur;
    if (eur === null || eur === undefined) return P.valueBands.find((b) => b.id === "undisclosed");
    return P.valueBands.find((b) => b.max !== undefined && eur < b.max);
  }

  function fmtCoords([lat, lon]) {
    const ns = lat >= 0 ? "N" : "S", ew = lon >= 0 ? "E" : "W";
    return Math.abs(lat).toFixed(2) + "°" + ns + " " + Math.abs(lon).toFixed(2) + "°" + ew;
  }

  /* Small line icons, one per type, drawn on a 24-unit grid. */
  const GLYPHS = {
    project: '<path d="M6 20V9l6-4 6 4v11M10 20v-5h4v5M4 20h16"/>',
    company: '<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 13h16"/>',
    investment: '<circle cx="12" cy="12" r="8"/><path d="M15.5 8.6a4 4 0 1 0 0 6.8M7.5 11h6M7.5 13.2h6"/>',
    policy: '<path d="M7 4h7l4 4v12H7z"/><path d="M14 4v4h4M10 12h5M10 15.5h5"/>',
    tourism: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/>',
  };
  const glyph = (type, size = 16) =>
    `<svg class="glyph" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${GLYPHS[type] || GLYPHS.project}</svg>`;

  /* ---------- 2. HEADER STRIP ---------- */
  const asOfText = "As of " + fmtDate(P.asOf);
  document.getElementById("asof-top").textContent = asOfText;
  const inNorth = P.entries.filter((e) => e.north).length;
  document.getElementById("strip").innerHTML = [
    ["Entries", P.entries.length],
    ["Districts", "6 + offshore"],
    ["In the north", inNorth],
    ["Checked", fmtDate(P.asOf)],
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  /* ---------- 4 (first, the map needs it). THE PANEL ---------- */
  const panelEl = document.getElementById("panel");
  const panelBody = document.getElementById("panel-body");
  let onPanelClose = null;
  const sheet = FieldNotes.panel(panelEl, {
    onClose() {
      if (onPanelClose) onPanelClose();
      if (location.hash.startsWith("#/")) history.replaceState(null, "", location.pathname + location.search);
    },
  });

  /* An evidence label: what kind of source this is (Official data, News, …) */
  function kindChip(kind) {
    const k = P.evidence && P.evidence[kind];
    return k ? `<span class="ev ev--${esc(kind)}" title="${esc(k.desc)}">${esc(k.label)}</span>` : "";
  }
  function confChip(level) {
    const c = P.confidence && P.confidence[level];
    return c ? `<span class="conf conf--${esc(level)}" title="${esc(c.desc)}">${esc(c.label)}</span>` : "";
  }
  const analysisChip = `<span class="ev ev--analysis" title="My reading of the sources, not a fact from them.">Analysis</span>`;

  function sourceList(sources) {
    return `<ol class="o-sources">${sources.map((s) => `
      <li><a href="${esc(s.url)}" rel="noopener">${esc(s.title)}</a>
        <span class="o-src-meta">${kindChip(s.kind)} ${esc(s.publisher)}${s.date ? " · " + esc(fmtDate(s.date)) : ""}</span></li>`).join("")}
    </ol>`;
  }

  function stamp(status) {
    const s = statusById[status];
    return `<span class="stamp o-stamp o-stamp--${esc(status)}">${esc(s ? s.label : status)}</span>`;
  }

  function entryPanel(e) {
    const d = districtById[e.district];
    const t = typeById[e.type];
    const dates = [["Announced", e.dates.announced], ["Approved", e.dates.approved], ["Expected", e.dates.expected], ["Completed", e.dates.completed]]
      .filter(([, v]) => v);
    const related = (e.related || []).map((id) => byId[id]).filter(Boolean);
    return `
      <p class="p-coords">${esc(fmtCoords(e.coords))} · ${esc(d.name)}${e.north ? " · north" : ""}</p>
      <p class="o-kind">${glyph(e.type, 14)} ${esc(t.label)} · ${e.sectors.map((s) => esc(sectorById[s].label)).join(", ")}</p>
      <h2 class="p-title" id="panel-title">${esc(e.name)}</h2>
      <div class="o-stamprow">${stamp(e.status)}</div>
      ${e.coordsNote ? `<p class="o-fine">${esc(e.coordsNote)}</p>` : ""}

      <section class="o-value" aria-label="Value">
        <p class="o-value-num">${e.value.eur !== null ? esc(fmtEur(e.value.eur)) : "n/a"}</p>
        <p class="o-value-text">${esc(e.value.text)}</p>
        ${e.value.eur !== null && e.sources[e.value.source] ? `<p class="o-value-src">${kindChip(e.sources[e.value.source].kind)} ${confChip(e.value.confidence)} <span>${esc(e.sources[e.value.source].publisher)}</span></p>` : ""}
      </section>

      <section class="p-section"><p class="p-label">What it is</p><p>${esc(e.summary)}</p></section>
      <section class="p-section"><p class="p-label">Why it matters ${analysisChip}</p><p>${esc(e.why)}</p></section>
      ${e.whoGains ? `
      <section class="p-section o-gains"><p class="p-label">Who gains, who pays ${analysisChip}</p>
        <p>${esc(e.whoGains.text)}</p>
        <p class="o-fine">Drawn from: ${e.whoGains.sources.map((i) => e.sources[i]).filter(Boolean).map((s) => esc(s.publisher)).join("; ")}. Written as neutrally as I can; read it as interpretation.</p>
      </section>` : ""}

      ${e.north ? `
      <section class="p-section o-legal">
        <p class="p-label">Legal status</p>
        ${e.legalStatus ? `<p>${esc(e.legalStatus)}</p>` : `<p class="o-fine">No legal-status line yet: it will be added once both sides' positions are sourced.</p>`}
        <p class="o-fine">${esc(P.northNote.text)}</p>
      </section>` : ""}

      ${dates.length ? `
      <section class="p-section"><p class="p-label">Key dates</p>
        <dl class="o-dates">${dates.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(fmtDate(v))}</dd></div>`).join("")}</dl>
      </section>` : ""}

      <section class="p-section"><p class="p-label">Who</p>
        <p>${esc(e.developer)}</p>
        ${e.investors.length ? `<ul class="o-investors">${e.investors.map((i) => `<li><span>${esc(i.name)}</span>${i.country ? `<span class="o-country">${esc(i.country)}</span>` : ""}</li>`).join("")}</ul>` : ""}
      </section>

      ${related.length ? `
      <section class="p-section"><p class="p-label">Related</p>
        <ul class="o-related">${related.map((r) => `<li><button type="button" data-entry="${esc(r.id)}">${glyph(r.type, 14)} ${esc(r.name)}</button></li>`).join("")}</ul>
      </section>` : ""}

      ${e.flags && e.flags.length ? `
      <section class="p-section o-flags"><p class="p-label">Unsure</p>
        <ul>${e.flags.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      </section>` : ""}

      <section class="p-section"><p class="p-label">Sources</p>${sourceList(e.sources)}
        <p class="o-asof">As of ${esc(fmtDate(e.asOf))}</p>
      </section>
      ${e.tags && e.tags.length ? `<p class="o-tags">${e.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</p>` : ""}`;
  }

  function districtPanel(d) {
    const list = P.entries.filter((e) => e.district === d.id);
    const counts = P.types.map((t) => [t, list.filter((e) => e.type === t.id).length]).filter(([, n]) => n);
    const sectors = [...new Set(list.flatMap((e) => e.sectors))].map((s) => sectorById[s].label);
    const latest = list.map((e) => e.asOf).sort().pop();
    const allSources = list.length;
    return `
      <p class="p-coords">${esc(fmtCoords(d.seat))}${d.north ? " · north" : d.partNorth ? " · partly in the north" : ""}</p>
      <h2 class="p-title" id="panel-title">${esc(d.name)}</h2>
      <p class="o-names">${d.greek ? `<span lang="el">${esc(d.greek)}</span>` : ""}${d.turkish ? ` · <span lang="tr">${esc(d.turkish)}</span>` : ""}</p>

      <section class="p-section"><p class="p-label">Where it's heading</p>
        <p class="o-heading">${esc(d.heading)}</p>
        <p class="o-fine">A summary of the entries below, not a forecast. Each entry has its own sources.</p>
      </section>

      <section class="p-section"><p class="p-label">In this tracker</p>
        <ul class="o-counts">${counts.map(([t, n]) => `<li>${glyph(t.id, 14)} <span class="o-count-n">${n}</span> ${esc(n === 1 ? t.label : t.plural)}</li>`).join("")}</ul>
        <p class="o-chips">${sectors.map((s) => `<span>${esc(s)}</span>`).join("")}</p>
      </section>

      <section class="p-section"><p class="p-label">Entries</p>
        <ul class="o-related o-related--rows">${list.map((e) => `
          <li><button type="button" data-entry="${esc(e.id)}">${glyph(e.type, 14)}
            <span class="o-row-name">${esc(e.name)}</span>
            <span class="o-row-meta">${esc(statusById[e.status].label)}${e.value.eur !== null ? " · " + esc(fmtEur(e.value.eur)) : ""}</span>
          </button></li>`).join("")}
        </ul>
      </section>

      ${d.north || d.partNorth ? `
      <section class="p-section o-legal"><p class="p-label">The north</p>
        <p class="o-fine">${esc(P.northNote.text)}</p>
        ${sourceList(P.northNote.sources)}
      </section>` : ""}

      <p class="o-asof">${allSources} entries · checked up to ${esc(fmtDate(latest))}</p>`;
  }

  function aboutPanel() {
    return `
      <p class="p-coords">35.1°N 33.4°E</p>
      <h2 class="p-title" id="panel-title">About this map</h2>
      <section class="p-section"><p class="p-label">What's on it</p>
        <p>Each pin is one entry in data.js: a project, a company, an investment, a policy, or something in film and tourism. Policies that apply to the whole island are pinned in Nicosia. Where a pin is approximate, its entry says so.</p>
        <p>Districts are the Republic of Cyprus's six administrative districts, which cover the whole island. The British Sovereign Base Areas at Akrotiri and Dhekelia sit inside them on this map.</p>
      </section>
      <section class="p-section o-legal"><p class="p-label">The north</p>
        <p>${esc(P.northNote.text)}</p>
        ${sourceList(P.northNote.sources)}
      </section>
      <section class="p-section"><p class="p-label">Method</p>
        <p>Every fact in an entry comes from one of its listed sources. Values are the figures those sources give, in euros where they give euros; nothing is converted or estimated. Anything I'm unsure of is listed under "Unsure" on the entry itself.</p>
      </section>
      <section class="p-section"><p class="p-label">Map data</p>
        <p class="o-fine">District outlines from geoBoundaries (gbOpen CYP ADM1), drawn from OpenStreetMap and licensed under the ODbL 1.0. There are no background map tiles, so the map shows no place names or borders other than the six districts. Drawn with Leaflet.</p>
      </section>`;
  }

  function openEntry(id, opener) {
    const e = byId[id];
    if (!e) return;
    panelBody.innerHTML = entryPanel(e);
    highlight(id);
    onPanelClose = () => highlight(null);
    sheet.open(opener);
    history.replaceState(null, "", "#/e/" + id);
  }

  function openDistrict(id, opener) {
    const d = districtById[id];
    if (!d) return;
    panelBody.innerHTML = districtPanel(d);
    selectDistrict(id);
    onPanelClose = () => selectDistrict(null);
    sheet.open(opener);
    history.replaceState(null, "", "#/d/" + id);
  }

  panelBody.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-entry]");
    if (b) { openEntry(b.dataset.entry); panelEl.querySelector(".panel-scroll").scrollTop = 0; }
  });
  document.getElementById("about-open").addEventListener("click", (ev) => {
    panelBody.innerHTML = aboutPanel();
    onPanelClose = null;
    sheet.open(ev.currentTarget);
  });

  /* ---------- 3. THE MAP ---------- */
  let map = null;
  const markers = {};
  const districtLayers = {};

  /* No map tiles: the island is drawn from the district outlines
     alone, over a faint grid of latitude and longitude every half
     degree, so the map carries no one else's names or borders. */
  function drawGraticule() {
    const line = { color: "#1F4E5F", weight: 1, opacity: 1, interactive: false, className: "grid-line" };
    for (let lat = 32.5; lat <= 36.5; lat += 0.5) L.polyline([[lat, 29.5], [lat, 36]], line).addTo(map);
    for (let lon = 29.5; lon <= 36; lon += 0.5) L.polyline([[32.5, lon], [36.5, lon]], line).addTo(map);
    [33.5, 34.5, 35.5].forEach((lat) => L.marker([lat, 30.62], { interactive: false, keyboard: false, icon: L.divIcon({ className: "grid-tick", html: lat.toFixed(1) + "°N", iconSize: [60, 14], iconAnchor: [0, 16] }) }).addTo(map));
    [31, 32, 33, 34].forEach((lon) => L.marker([35.95, lon], { interactive: false, keyboard: false, icon: L.divIcon({ className: "grid-tick", html: lon.toFixed(1) + "°E", iconSize: [60, 14], iconAnchor: [-4, 0] }) }).addTo(map));
  }

  /* Pins that land on top of each other at the current zoom are
     fanned out in a small ring around their shared spot. */
  function spreadPins() {
    const pts = P.entries.map((e) => ({ id: e.id, p: map.latLngToLayerPoint(markers[e.id].getLatLng()) }));
    const used = new Set();
    pts.forEach((a) => {
      if (used.has(a.id)) return;
      const group = pts.filter((b) => !used.has(b.id) && a.p.distanceTo(b.p) < (matchMedia("(max-width: 640px)").matches ? 16 : 22));
      group.forEach((g) => used.add(g.id));
      const n = group.length;
      const cx = group.reduce((s, g) => s + g.p.x, 0) / n, cy = group.reduce((s, g) => s + g.p.y, 0) / n;
      const small = matchMedia("(max-width: 640px)").matches;
      const r = n > 1 ? (small ? 9 + n * 2 : 13 + n * 3) : 0;
      group.forEach((g, i) => {
        const ang = (2 * Math.PI * i) / n - Math.PI / 2;
        const dx = cx - g.p.x + r * Math.cos(ang), dy = cy - g.p.y + r * Math.sin(ang);
        const pin = markers[g.id].getElement().querySelector(".pin");
        pin.style.translate = n > 1 ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : "";
      });
    });
  }

  /* Colours and hover live in styles.css (.d-shape); these are
     only Leaflet's starting values. */
  const districtStyle = (id) => ({ weight: 1.2, color: "#6B6A3A", fillColor: "#C9973F", fillOpacity: 0.12, className: "d-shape d-" + id });

  function selectDistrict(id) {
    Object.entries(districtLayers).forEach(([k, layer]) => {
      const el = layer.getElement && layer.getElement();
      if (el) el.classList.toggle("is-selected", k === id);
    });
  }

  function highlight(id) {
    Object.entries(markers).forEach(([k, m]) => {
      const el = m.getElement();
      if (el) el.classList.toggle("is-active", k === id);
    });
    if (id && map && markers[id]) {
      const ll = markers[id].getLatLng();
      if (!map.getBounds().pad(-0.15).contains(ll)) map.panTo(ll, { animate: !FieldNotes.reducedMotion.matches });
    }
  }

  function pinIcon(e) {
    return L.divIcon({
      className: "pin-wrap",
      html: `<span class="pin pin--${e.type} pin--${e.status}${e.north ? " pin--north" : ""}">${glyph(e.type, 14)}</span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  /* Where to put each district's name: the middle of its largest piece. */
  function labelPoint(feature) {
    const g = feature.geometry;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    let best = null, bestArea = -1;
    polys.forEach((rings) => {
      const r = rings[0];
      let a = 0, cx = 0, cy = 0;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const f = r[j][0] * r[i][1] - r[i][0] * r[j][1];
        a += f; cx += (r[j][0] + r[i][0]) * f; cy += (r[j][1] + r[i][1]) * f;
      }
      if (Math.abs(a) > bestArea) { bestArea = Math.abs(a); best = [cy / (3 * a), cx / (3 * a)]; }
    });
    return best;
  }
  /* A few names sit better slightly off-centre, away from the pins. */
  const LABEL_NUDGE = { nicosia: [0.03, -0.14], limassol: [0.06, 0], larnaca: [0.04, 0.02], kyrenia: [0.06, 0.16], famagusta: [0.05, -0.05], paphos: [0.04, 0.06] };

  function buildMap() {
    if (!window.L) {
      document.getElementById("map").innerHTML = `<p class="p-error atlas-error">The map couldn't load (Leaflet didn't arrive). Every entry is still in the list below.</p>`;
      return;
    }
    map = L.map("map", {
      zoomSnap: 0.25,
      minZoom: 6,
      maxZoom: 13,
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: true,
    });
    /* Start on the island; a button zooms out to the offshore fields */
    const island = L.latLngBounds([34.55, 32.25], [35.72, 34.62]);
    const everything = L.latLngBounds(P.entries.map((e) => e.coords)).extend(island);
    map.setMaxBounds(everything.pad(0.5));
    map.fitBounds(island, { padding: matchMedia("(max-width: 640px)").matches ? [2, 2] : [16, 16] });
    drawGraticule();

    const SeaButton = L.Control.extend({
      options: { position: "bottomleft" },
      onAdd() {
        const b = L.DomUtil.create("button", "sea-toggle");
        b.type = "button";
        const set = (wide) => { b.dataset.wide = wide ? "1" : ""; b.textContent = wide ? "Back to the island" : "Show offshore gas fields"; };
        set(false);
        L.DomEvent.disableClickPropagation(b);
        b.addEventListener("click", () => {
          const wide = !b.dataset.wide;
          map.flyToBounds(wide ? everything : island, { padding: [24, 24], duration: FieldNotes.reducedMotion.matches ? 0 : 0.8 });
          set(wide);
        });
        return b;
      },
    });
    new SeaButton().addTo(map);

    /* Scroll-zoom only after the map has been clicked, so the page
       can still scroll past it. */
    map.once("focus click", () => map.scrollWheelZoom.enable());

    L.geoJSON(P.districtShapes, {
      style: (f) => districtStyle(f.properties.id),
      onEachFeature: (f, layer) => {
        const id = f.properties.id;
        districtLayers[id] = layer;
        layer.on("click", () => openDistrict(id));
      },
    }).addTo(map);

    /* District names, as buttons so they work from the keyboard too. */
    P.districtShapes.features.forEach((f) => {
      const id = f.properties.id, d = districtById[id];
      const [lat, lon] = labelPoint(f);
      const n = LABEL_NUDGE[id] || [0, 0];
      const label = L.marker([lat + n[0], lon + n[1]], {
        icon: L.divIcon({ className: "d-label-wrap", html: `<span class="d-label">${esc(d.name)}<span class="d-label-gr" lang="el">${esc(d.greek)}</span></span>`, iconSize: [120, 34], iconAnchor: [60, 17] }),
        keyboard: true,
        title: d.name + " district profile",
        alt: d.name + " district profile",
        zIndexOffset: -500,
      }).addTo(map);
      label.on("click", (ev) => openDistrict(id, ev.target.getElement()));
    });

    /* The offshore zone has no outline: a label in the sea instead. */
    const off = districtById.offshore;
    L.marker([33.3, 31.75], {
      icon: L.divIcon({ className: "d-label-wrap", html: `<span class="d-label d-label--sea">Offshore<span class="d-label-gr">exclusive economic zone</span></span>`, iconSize: [160, 34], iconAnchor: [80, 17] }),
      keyboard: true,
      title: "Offshore profile",
      alt: "Offshore profile",
      zIndexOffset: -500,
    }).addTo(map).on("click", (ev) => openDistrict(off.id, ev.target.getElement()));

    P.entries.forEach((e) => {
      const m = L.marker(e.coords, {
        icon: pinIcon(e),
        keyboard: true,
        title: e.name,
        alt: e.name + " (" + typeById[e.type].label + ", " + statusById[e.status].label + ")",
        riseOnHover: true,
      }).addTo(map);
      m.on("click", (ev) => openEntry(e.id, ev.target.getElement()));
      markers[e.id] = m;
    });

    spreadPins();
    map.on("zoomend", spreadPins);
  }

  function buildLegend() {
    const el = document.getElementById("legend");
    el.innerHTML = `
      <p class="legend-head">Key</p>
      <ul class="legend-types">${P.types.map((t) => `<li><span class="pin pin--${t.id} pin--complete pin--legend">${glyph(t.id, 12)}</span>${esc(t.label)}</li>`).join("")}</ul>
      <ul class="legend-status">
        <li><span class="pin pin--project pin--complete pin--legend pin--blank"></span>Done or active</li>
        <li><span class="pin pin--project pin--seeking-capital pin--legend pin--blank"></span>Seeking capital</li>
        <li><span class="pin pin--project pin--announced pin--legend pin--blank"></span>Announced or approved</li>
        <li><span class="pin pin--project pin--stalled pin--legend pin--blank"></span>Stalled</li>
      </ul>`;
  }

  /* ---------- 5. THE LEDGER ---------- */
  function buildLedger() {
    const el = document.getElementById("ledger");
    el.innerHTML = P.districts.map((d) => {
      const list = P.entries.filter((e) => e.district === d.id);
      if (!list.length) return "";
      return `
        <article class="ledger-col">
          <header class="ledger-col-head">
            <h3><button type="button" class="ledger-district" data-district="${esc(d.id)}">${esc(d.name)} <span lang="el">${esc(d.greek)}</span></button></h3>
            <p class="ledger-coords">${esc(fmtCoords(d.seat))} · ${list.length} ${list.length === 1 ? "entry" : "entries"}${d.north ? " · north" : d.partNorth ? " · partly north" : ""}</p>
          </header>
          <ul class="ledger-list">${list.map((e) => `
            <li><button type="button" class="ledger-row" data-entry="${esc(e.id)}">
              <span class="ledger-glyph pin pin--${e.type} pin--${e.status} pin--legend">${glyph(e.type, 12)}</span>
              <span class="ledger-name">${esc(e.name)}${e.north ? ' <span class="ledger-north">north</span>' : ""}</span>
              <span class="ledger-meta"><span>${esc(statusById[e.status].label)}</span><span class="ledger-eur">${e.value.eur !== null ? esc(fmtEur(e.value.eur)) : "n/a"}</span></span>
            </button></li>`).join("")}
          </ul>
        </article>`;
    }).join("");
    el.addEventListener("click", (ev) => {
      const r = ev.target.closest("[data-entry]");
      if (r) return openEntry(r.dataset.entry, r);
      const d = ev.target.closest("[data-district]");
      if (d) openDistrict(d.dataset.district, d);
    });
  }

  /* ---------- 5b. THE PIPELINE FUNNEL ----------
     Projects move from left to right; stalled sits apart. Companies
     and policies (active, ended) aren't in it. Pick a stage to show
     only its pins and rows; pick it again (or "Show all") to clear. */
  const STAGES = ["seeking-capital", "announced", "approved", "under-construction", "complete"];
  let stageFilter = null;

  function applyStage(stage) {
    stageFilter = stageFilter === stage ? null : stage;
    const keep = (e) => !stageFilter || e.status === stageFilter;
    P.entries.forEach((e) => {
      const m = markers[e.id];
      const el = m && m.getElement();
      if (el) el.classList.toggle("is-filtered", !keep(e));
      const row = document.querySelector(`.ledger-row[data-entry="${e.id}"]`);
      if (row) row.closest("li").classList.toggle("is-filtered", !keep(e));
    });
    document.querySelectorAll(".funnel-stage").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.stage === stageFilter)));
    const status = document.getElementById("funnel-status");
    status.textContent = stageFilter ? `Showing ${statusById[stageFilter].label.toLowerCase()} only.` : "Showing everything.";
    document.getElementById("funnel-clear").hidden = !stageFilter;
  }

  function buildFunnel() {
    const el = document.getElementById("funnel");
    if (!el) return;
    const count = (id) => P.entries.filter((e) => e.status === id).length;
    const max = Math.max(...STAGES.map(count), 1);
    const other = P.entries.filter((e) => e.status === "active" || e.status === "ended").length;
    el.innerHTML = `
      <ol class="funnel-track">${STAGES.map((id) => `
        <li><button type="button" class="funnel-stage funnel-stage--${id}" data-stage="${id}" aria-pressed="false">
          <span class="funnel-bar" style="--h:${(count(id) / max).toFixed(3)}"></span>
          <span class="funnel-n">${count(id)}</span>
          <span class="funnel-label">${esc(statusById[id].label)}</span>
        </button></li>`).join('<li class="funnel-arrow" aria-hidden="true">→</li>')}
      </ol>
      <div class="funnel-side">
        <button type="button" class="funnel-stage funnel-stage--stalled" data-stage="stalled" aria-pressed="false">
          <span class="funnel-n">${count("stalled")}</span><span class="funnel-label">Stalled</span>
        </button>
        <p class="funnel-note">${other} companies and policies sit outside the pipeline.</p>
        <p class="funnel-status" id="funnel-status" role="status">Showing everything.</p>
        <button type="button" class="linkish" id="funnel-clear" hidden>Show all</button>
      </div>`;
    el.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-stage]");
      if (b) applyStage(b.dataset.stage);
    });
    document.getElementById("funnel-clear").addEventListener("click", () => applyStage(stageFilter));
  }

  /* ---------- 6. LINKS INTO THE PAGE ---------- */
  function fromHash() {
    const m = location.hash.match(/^#\/(e|d)\/([a-z0-9-]+)$/);
    if (!m) return;
    if (m[1] === "e") openEntry(m[2]);
    else openDistrict(m[2]);
  }

  buildLegend();
  buildMap();
  buildLedger();
  buildFunnel();
  fromHash();
  window.addEventListener("hashchange", fromHash);
})();
