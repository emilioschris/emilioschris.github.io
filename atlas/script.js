/* =========================================================
   THE ATLAS · script
   ---------------------------------------------------------
   The Day/Dusk switch and the slide-in panel's open/close
   behaviour come from ../shared/field-notes.js.

   1. Your data + country codes
   2. Counter
   3. The map (drawing, ocean contours, markers, zoom, hover)
   4. Filters
   5. Logbook (searchable country list)
   6. Country panel (live facts, overview, note, links)
   ========================================================= */
(() => {
  "use strict";

  const motion = FieldNotes.motion;

  /* ---------------------------------------------------------
     1. YOUR DATA + COUNTRY CODES
     The map file numbers each country (Cyprus is "196").
     This table links those numbers to the 3-letter codes in
     data.js and the 2-letter codes used by flags and links.
     Format: 3-letter code + map number + 2-letter code.
     --------------------------------------------------------- */
  const ISO_TABLE = [
    "ABW533AW AFG004AF AGO024AO AIA660AI ALA248AX ALB008AL AND020AD ARE784AE ARG032AR ARM051AM ASM016AS ATA010AQ",
    "ATF260TF ATG028AG AUS036AU AUT040AT AZE031AZ BDI108BI BEL056BE BEN204BJ BFA854BF BGD050BD BGR100BG BHR048BH",
    "BHS044BS BIH070BA BLM652BL BLR112BY BLZ084BZ BMU060BM BOL068BO BRA076BR BRB052BB BRN096BN BTN064BT BWA072BW",
    "CAF140CF CAN124CA CHE756CH CHL152CL CHN156CN CIV384CI CMR120CM COD180CD COG178CG COK184CK COL170CO COM174KM",
    "CPV132CV CRI188CR CUB192CU CUW531CW CYM136KY CYP196CY CZE203CZ DEU276DE DJI262DJ DMA212DM DNK208DK DOM214DO",
    "DZA012DZ ECU218EC EGY818EG ERI232ER ESH732EH ESP724ES EST233EE ETH231ET FIN246FI FJI242FJ FLK238FK FRA250FR",
    "FRO234FO FSM583FM GAB266GA GBR826GB GEO268GE GGY831GG GHA288GH GIN324GN GMB270GM GNB624GW GNQ226GQ GRC300GR",
    "GRD308GD GRL304GL GTM320GT GUM316GU GUY328GY HKG344HK HMD334HM HND340HN HRV191HR HTI332HT HUN348HU IDN360ID",
    "IMN833IM IND356IN IOT086IO IRL372IE IRN364IR IRQ368IQ ISL352IS ISR376IL ITA380IT JAM388JM JEY832JE JOR400JO",
    "JPN392JP KAZ398KZ KEN404KE KGZ417KG KHM116KH KIR296KI KNA659KN KOR410KR KWT414KW LAO418LA LBN422LB LBR430LR",
    "LBY434LY LCA662LC LIE438LI LKA144LK LSO426LS LTU440LT LUX442LU LVA428LV MAC446MO MAF663MF MAR504MA MCO492MC",
    "MDA498MD MDG450MG MDV462MV MEX484MX MHL584MH MKD807MK MLI466ML MLT470MT MMR104MM MNE499ME MNG496MN MNP580MP",
    "MOZ508MZ MRT478MR MSR500MS MUS480MU MWI454MW MYS458MY NAM516NA NCL540NC NER562NE NFK574NF NGA566NG NIC558NI",
    "NIU570NU NLD528NL NOR578NO NPL524NP NRU520NR NZL554NZ OMN512OM PAK586PK PAN591PA PCN612PN PER604PE PHL608PH",
    "PLW585PW PNG598PG POL616PL PRI630PR PRK408KP PRT620PT PRY600PY PSE275PS PYF258PF QAT634QA ROU642RO RUS643RU",
    "RWA646RW SAU682SA SDN729SD SEN686SN SGP702SG SGS239GS SHN654SH SLB090SB SLE694SL SLV222SV SMR674SM SOM706SO",
    "SPM666PM SRB688RS SSD728SS STP678ST SUR740SR SVK703SK SVN705SI SWE752SE SWZ748SZ SXM534SX SYC690SC SYR760SY",
    "TCA796TC TCD148TD TGO768TG THA764TH TJK762TJ TKM795TM TLS626TL TON776TO TTO780TT TUN788TN TUR792TR TWN158TW",
    "TZA834TZ UGA800UG UKR804UA URY858UY USA840US UZB860UZ VAT336VA VCT670VC VEN862VE VGB092VG VIR850VI VNM704VN",
    "VUT548VU WLF876WF WSM882WS YEM887YE ZAF710ZA ZMB894ZM ZWE716ZW",
  ].join(" ");
  const byNumber = new Map();   // "196" → { a3: "CYP", a2: "CY" }
  const byCode = new Map();     // "CYP" → "196"
  ISO_TABLE.split(" ").forEach((e) => {
    const a3 = e.slice(0, 3), num = e.slice(3, 6), a2 = e.slice(6, 8);
    byNumber.set(num, { a3, a2 });
    byCode.set(a3, num);
  });

  // The map file shortens some names; show them in full
  const FULL_NAMES = {
    "Antigua and Barb.": "Antigua and Barbuda", "Bosnia and Herz.": "Bosnia and Herzegovina",
    "Br. Indian Ocean Ter.": "British Indian Ocean Territory", "British Virgin Is.": "British Virgin Islands",
    "Cayman Is.": "Cayman Islands", "Central African Rep.": "Central African Republic", "Cook Is.": "Cook Islands",
    "Dem. Rep. Congo": "DR Congo", "Dominican Rep.": "Dominican Republic", "Eq. Guinea": "Equatorial Guinea",
    "Faeroe Is.": "Faroe Islands", "Falkland Is.": "Falkland Islands", "Fr. Polynesia": "French Polynesia",
    "Fr. S. Antarctic Lands": "French Southern Lands", "Heard I. and McDonald Is.": "Heard and McDonald Islands",
    "Marshall Is.": "Marshall Islands", "N. Mariana Is.": "Northern Mariana Islands", "Pitcairn Is.": "Pitcairn Islands",
    "S. Geo. and the Is.": "South Georgia", "S. Sudan": "South Sudan", "Solomon Is.": "Solomon Islands",
    "St. Kitts and Nevis": "Saint Kitts and Nevis", "St. Pierre and Miquelon": "Saint Pierre and Miquelon",
    "St. Vin. and Gren.": "Saint Vincent and the Grenadines", "Turks and Caicos Is.": "Turks and Caicos Islands",
    "U.S. Virgin Is.": "U.S. Virgin Islands", "W. Sahara": "Western Sahara", "Wallis and Futuna Is.": "Wallis and Futuna",
    "United States of America": "United States", "Ashmore and Cartier Is.": "Ashmore and Cartier Islands",
    "Indian Ocean Ter.": "Indian Ocean Territories",
  };

  const mine = new Map();       // "CYP" → your entry from data.js
  ATLAS.countries.forEach((c) => mine.set(c.code.toUpperCase(), c));
  const isWant = (status) => status === "want" || status === "next";
  const STATUS = {
    visited: { stamp: "Visited", tag: "Visited" },
    want: { stamp: "On the list", tag: "On the list" },
    next: { stamp: "Next expedition", tag: "Next" },
  };

  /* ---------------------------------------------------------
     2. COUNTER
     "% of the world" = visited ÷ 195 countries.
     --------------------------------------------------------- */
  const WORLD_COUNTRIES = 195;
  const visitedCount = ATLAS.countries.filter((c) => c.status === "visited").length;
  const wantCount = ATLAS.countries.filter((c) => isWant(c.status)).length;
  document.getElementById("count-visited").textContent = visitedCount;
  document.getElementById("count-want").textContent = wantCount;
  document.getElementById("count-percent").textContent =
    `${(Math.round((visitedCount / WORLD_COUNTRIES) * 1000) / 10).toFixed(1)}%`;

  /* ---------------------------------------------------------
     3. THE MAP
     --------------------------------------------------------- */
  const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";
  const frame = document.getElementById("map-frame");
  const svgEl = document.getElementById("map");
  const svg = d3.select(svgEl);
  const statusEl = document.getElementById("map-status");
  const tooltip = document.getElementById("map-tooltip");

  let places = [];              // every country we can draw: { num, a3, a2, name, entry, feature }
  let width = 0, height = 0, projection, path, zoom, layer, scaleK = 1;
  let selected = null;

  async function loadWorld() {
    statusEl.hidden = false;
    statusEl.textContent = "Unrolling the map…";
    try {
      const topo = await d3.json(WORLD_URL);
      prepare(topo);
      draw();
      new ResizeObserver(debounce(draw, 150)).observe(frame);
      statusEl.hidden = true;
      buildList();
    } catch (err) {
      statusEl.innerHTML = 'The map couldn\'t load. Check your internet connection. <button type="button" class="retry">Try again</button>';
      statusEl.querySelector(".retry").addEventListener("click", loadWorld);
    }
  }

  function prepare(topo) {
    const geoms = topo.objects.countries.geometries;
    // Cyprus is one whole island: merge the two shapes the map file splits it into
    const cyprusParts = geoms.filter((g) => g.id === "196" || g.properties.name === "N. Cyprus");
    const rest = geoms.filter((g) => !cyprusParts.includes(g));
    const features = topojson.feature(topo, { type: "GeometryCollection", geometries: rest }).features;
    features.push({
      type: "Feature", id: "196", properties: { name: "Cyprus" },
      geometry: topojson.merge(topo, cyprusParts),
    });

    places = features.map((feature) => {
      const codes = byNumber.get(feature.id) || {};
      const entry = codes.a3 ? mine.get(codes.a3) : undefined;
      const mapName = feature.properties.name;
      return {
        num: feature.id,
        a3: codes.a3,
        a2: codes.a2,
        name: entry ? entry.name : FULL_NAMES[mapName] || mapName,
        entry,
        feature,
      };
    });
  }

  function draw() {
    const rect = frame.getBoundingClientRect();
    width = Math.max(320, rect.width);
    height = Math.max(300, rect.height);
    svg.attr("viewBox", `0 0 ${width} ${height}`).selectAll("*").remove();

    // Equal Earth keeps countries at their true relative size.
    // Wide screens fit the whole world; tall screens (phones) draw it at full
    // height and start centred on Europe and Africa: drag sideways to explore.
    const sphere = { type: "Sphere" };
    projection = d3.geoEqualEarth();
    if (width / height >= 1.5) {
      projection.fitExtent([[12, 12], [width - 12, height - 12]], sphere);
    } else {
      const mapH = height - 24;
      projection.fitExtent([[0, 12], [mapH * 2.05, 12 + mapH]], sphere);
      const [cx] = projection([15, 0]);
      const [tx, ty] = projection.translate();
      projection.translate([tx - (cx - width / 2), ty]);
    }
    path = d3.geoPath(projection);
    const [[sx0, sy0], [sx1, sy1]] = path.bounds(sphere);
    const panLimits = [[Math.min(0, sx0 - 12), Math.min(0, sy0)], [Math.max(width, sx1 + 12), Math.max(height, sy1)]];

    const defs = svg.append("defs");
    defs.append("clipPath").attr("id", "sphere-clip")
      .append("path").attr("d", path({ type: "Sphere" }));

    layer = svg.append("g").attr("class", "zoom-layer");
    layer.append("path").attr("class", "sphere").attr("d", path({ type: "Sphere" }));
    drawOceanContours(layer.append("g").attr("class", "ocean-contours").attr("clip-path", "url(#sphere-clip)"));
    layer.append("path").attr("class", "graticule").attr("d", path(d3.geoGraticule10()));

    // Countries
    layer.append("g").attr("class", "countries")
      .selectAll("path")
      .data(places)
      .join("path")
      .attr("class", (p) => {
        const s = p.entry && p.entry.status;
        return [
          "country",
          p.a3 ? "is-known" : "",
          s === "visited" ? "is-visited" : "",
          isWant(s) ? "is-want" : "",
          selected && selected.num === p.num ? "is-selected" : "",
        ].join(" ");
      })
      .attr("d", (p) => path(p.feature))
      .on("pointermove", (e, p) => showTooltip(e, p))
      .on("pointerleave", hideTooltip)
      .on("click", (e, p) => { if (p.a3) openCountry(p, { zoomTo: false }); });

    // Want-to-visit outlines on top, so their dashes aren't hidden by neighbours
    layer.select(".countries").selectAll(".is-want").raise();

    // Origins: a faint dotted route along the great circle, plus crosshairs
    const [a, b] = ATLAS.origins;
    layer.append("path").attr("class", "route")
      .attr("d", path({ type: "LineString", coordinates: [[a.lon, a.lat], [b.lon, b.lat]] }));

    const markers = layer.append("g").attr("class", "markers");
    ATLAS.origins.forEach((o) => {
      const [x, y] = projection([o.lon, o.lat]);
      const g = markers.append("g").attr("class", "origin-marker marker").attr("data-x", x).attr("data-y", y);
      g.append("line").attr("x1", -8).attr("x2", 8);
      g.append("line").attr("y1", -8).attr("y2", 8);
      g.append("circle").attr("r", 2.2);
      g.append("text").attr("x", 10).attr("y", -7).text(o.label);
    });

    // Tiny countries (like Vatican City) get a clickable dot
    places.filter((p) => p.entry && p.entry.dot).forEach((p) => {
      const [lat, lon] = p.entry.dot;
      const [x, y] = projection([lon, lat]);
      const g = markers.append("g").attr("class", "dot-marker marker").attr("data-x", x).attr("data-y", y)
        .on("pointermove", (e) => showTooltip(e, p))
        .on("pointerleave", hideTooltip)
        .on("click", () => openCountry(p, { zoomTo: false }));
      g.append("circle").attr("class", "hit").attr("r", 12);
      g.append("circle").attr("class", "dot").attr("r", 3.6);
    });

    // The next expedition gets a pulse and a stamp-like label
    places.filter((p) => p.entry && p.entry.status === "next").forEach((p) => {
      const [x, y] = path.centroid(p.feature);
      const g = markers.append("g").attr("class", "next-marker marker").attr("data-x", x).attr("data-y", y);
      g.append("circle").attr("class", "pulse").attr("r", 12);
      g.append("line").attr("class", "leader").attr("x1", -6).attr("y1", -6).attr("x2", -26).attr("y2", -30);
      const label = g.append("g").attr("transform", "translate(-26,-30) rotate(-4)");
      const text = label.append("text").attr("text-anchor", "end").attr("x", -8).attr("y", -6).text("NEXT EXPEDITION");
      const w = text.node().getComputedTextLength() + 16;
      label.insert("rect", "text").attr("x", -w).attr("y", -20).attr("width", w).attr("height", 20).attr("rx", 2);
    });

    // Zoom and pan: scroll, drag, pinch, plus the +/− buttons
    zoom = d3.zoom()
      .scaleExtent([1, 14])
      .translateExtent(panLimits)
      .on("zoom", (e) => {
        layer.attr("transform", e.transform);
        scaleK = e.transform.k;
        placeMarkers();
        hideTooltip();
      });
    svg.call(zoom);
    scaleK = 1;
    placeMarkers();
  }

  // Markers stay the same size on screen however far you zoom in
  function placeMarkers() {
    layer.selectAll(".marker").attr("transform", function () {
      return `translate(${this.dataset.x},${this.dataset.y}) scale(${1 / scaleK})`;
    });
  }

  // Faint contour lines in the ocean, made from smooth noise
  function drawOceanContours(g) {
    const cell = 8;
    const nx = Math.ceil(width / cell) + 1, ny = Math.ceil(height / cell) + 1;
    const values = new Float64Array(nx * ny);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        values[j * nx + i] = noise(i * 0.03, j * 0.03) + 0.3 * noise(i * 0.08 + 9, j * 0.08 - 4);
      }
    }
    const contours = d3.contours().size([nx, ny]).thresholds(d3.range(-1, 1.05, 0.2))(values);
    const toScreen = d3.geoPath(d3.geoIdentity().scale(cell));
    g.selectAll("path").data(contours).join("path").attr("d", toScreen);
  }

  function zoomToPlace(p) {
    if (!zoom) return;
    const [[x0, y0], [x1, y1]] = p.entry && p.entry.dot
      ? (() => { const [x, y] = projection([p.entry.dot[1], p.entry.dot[0]]); return [[x - 4, y - 4], [x + 4, y + 4]]; })()
      : path.bounds(p.feature);
    // Leave room for the panel on wide screens
    const panelW = window.innerWidth > 640 ? Math.min(460, window.innerWidth) : 0;
    const visibleW = Math.max(200, width - Math.max(0, panelW - (window.innerWidth - frame.getBoundingClientRect().right)));
    const k = Math.max(1, Math.min(8, 0.6 / Math.max((x1 - x0) / visibleW, (y1 - y0) / height)));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const t = d3.zoomIdentity.translate(visibleW / 2, height / 2).scale(k).translate(-cx, -cy);
    svg.transition().duration(motion(900)).call(zoom.transform, t);
  }

  document.getElementById("zoom-in").addEventListener("click", () => svg.transition().duration(motion(350)).call(zoom.scaleBy, 1.6));
  document.getElementById("zoom-out").addEventListener("click", () => svg.transition().duration(motion(350)).call(zoom.scaleBy, 1 / 1.6));
  document.getElementById("zoom-reset").addEventListener("click", () => svg.transition().duration(motion(600)).call(zoom.transform, d3.zoomIdentity));

  // Hover label (mouse and pen only; on phones a tap opens the panel)
  function showTooltip(e, p) {
    if (e.pointerType === "touch") return;
    const r = frame.getBoundingClientRect();
    const s = p.entry ? STATUS[p.entry.status] : null;
    tooltip.innerHTML = `${escapeHtml(p.name)}${s ? `<small>${s.tag}</small>` : ""}`;
    tooltip.style.left = `${e.clientX - r.left}px`;
    tooltip.style.top = `${e.clientY - r.top}px`;
    tooltip.classList.add("is-on");
  }
  function hideTooltip() { tooltip.classList.remove("is-on"); }

  /* ---------------------------------------------------------
     4. FILTERS: All / Visited / Want to go
     --------------------------------------------------------- */
  let filter = "all";
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      document.querySelectorAll(".filters button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      svgEl.dataset.filter = filter;
      renderList();
    });
  });

  /* ---------------------------------------------------------
     5. LOGBOOK: every country as a button, searchable
     --------------------------------------------------------- */
  const listEl = document.getElementById("country-list");
  const searchEl = document.getElementById("country-search");
  const countEl = document.getElementById("logbook-count");
  let listItems = [];

  const plain = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function buildList() {
    const seen = new Set();
    listItems = places
      .filter((p) => p.a3 && !seen.has(p.a3) && seen.add(p.a3))
      .sort((a, b) => a.name.localeCompare(b.name));
    renderList();
  }

  function renderList() {
    const q = plain(searchEl.value.trim());
    const matches = listItems.filter((p) => {
      const s = p.entry && p.entry.status;
      if (filter === "visited" && s !== "visited") return false;
      if (filter === "want" && !isWant(s)) return false;
      return !q || plain(p.name).includes(q);
    });

    const groups = [
      ["On the list", matches.filter((p) => p.entry && isWant(p.entry.status))],
      ["Visited", matches.filter((p) => p.entry && p.entry.status === "visited")],
      ["Everywhere else", matches.filter((p) => !p.entry)],
    ];

    listEl.innerHTML = "";
    for (const [label, items] of groups) {
      if (!items.length) continue;
      const head = document.createElement("li");
      head.className = "group-label";
      head.textContent = label;
      head.setAttribute("aria-hidden", "true");
      listEl.append(head);
      for (const p of items) {
        const s = p.entry && p.entry.status;
        const li = document.createElement("li");
        li.className = s === "visited" ? "is-visited" : isWant(s) ? "is-want" : "";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = `<span class="mark" aria-hidden="true"></span><span>${escapeHtml(p.name)}</span>` +
          (s ? `<span class="tag">${STATUS[s].tag}</span>` : "");
        btn.addEventListener("click", () => openCountry(p, { zoomTo: true, opener: btn }));
        li.append(btn);
        listEl.append(li);
      }
    }
    countEl.textContent = matches.length
      ? `${matches.length} ${matches.length === 1 ? "country" : "countries"}`
      : "No countries match that search.";
  }
  searchEl.addEventListener("input", renderList);

  /* ---------------------------------------------------------
     6. COUNTRY PANEL
     Opens like a journal page. Facts come live from Wikidata,
     the overview from Wikipedia, the flag from REST Countries'
     free flag images. Each lookup is remembered for the visit.
     --------------------------------------------------------- */
  const panelBody = document.getElementById("panel-body");
  const panel = document.getElementById("panel");
  const sheet = FieldNotes.panel(panel, {
    onClose() {
      selected = null;
      svg.selectAll(".country").classed("is-selected", false);
    },
  });
  let openToken = 0;
  const cache = new Map();

  function openCountry(p, { zoomTo = false, opener = null } = {}) {
    const token = ++openToken;
    selected = p;
    svg.selectAll(".country").classed("is-selected", (d) => d.num === p.num);
    hideTooltip();

    panelBody.innerHTML = panelTemplate(p);
    sheet.open(opener || document.activeElement);
    if (zoomTo) zoomToPlace(p);

    lookUp(p).then((info) => {
      if (token === openToken) fillPanel(p, info);
    });
  }

  function panelTemplate(p) {
    const s = p.entry ? p.entry.status : null;
    const [lon, lat] = p.entry && p.entry.dot ? [p.entry.dot[1], p.entry.dot[0]] : d3.geoCentroid(p.feature);
    const coords = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
    const flag = p.a2 ? `<img class="p-flag" src="https://flags.restcountries.com/v5/w160/${p.a2.toLowerCase()}.png" alt="Flag of ${escapeAttr(p.name)}" width="64" onerror="this.remove()">` : "";
    const skel = '<span class="skeleton"></span>';
    return `
      <p class="p-coords">${coords}</p>
      <div class="p-head">${flag}<h2 class="p-title" id="panel-title">${escapeHtml(p.name)}</h2></div>
      ${s ? `<p class="stamp stamp--large stamp--${s} p-stamp">${STATUS[s].stamp}</p>` : ""}

      <section class="p-section" aria-label="Basics">
        <p class="p-label">Basics</p>
        <dl class="p-facts" id="p-facts">
          <dt>Capital</dt><dd>${skel}</dd>
          <dt>Population</dt><dd>${skel}</dd>
          <dt>Official languages</dt><dd>${skel}</dd>
          <dt>Currency</dt><dd>${skel}</dd>
          <dt>Region</dt><dd>${skel}</dd>
        </dl>
      </section>

      <section class="p-section" aria-label="Overview">
        <p class="p-label">Overview</p>
        <div class="p-overview" id="p-overview">${skel}${skel}${skel}<span class="skeleton" style="width:60%"></span></div>
      </section>

      ${p.entry && p.entry.note ? `
      <section class="p-section" aria-label="Field note">
        <p class="p-label">Field note</p>
        <p class="p-note">${escapeHtml(p.entry.note)}</p>
      </section>` : ""}

      <section class="p-section" aria-label="Explore further">
        <p class="p-label">Explore further</p>
        <ul class="p-links" id="p-links">${exploreLinks(p, p.name)}</ul>
      </section>

      <p class="p-sources">Facts: <a href="https://www.wikidata.org/" target="_blank" rel="noopener">Wikidata</a> ·
        Overview: <a href="https://en.wikipedia.org/" target="_blank" rel="noopener">Wikipedia</a> ·
        Flag: <a href="https://restcountries.com/" target="_blank" rel="noopener">REST Countries</a></p>`;
  }

  // Links open in a new tab. Search pages are used wherever a country's
  // own page address isn't predictable, so these links never break.
  function exploreLinks(p, wikiTitle) {
    const q = encodeURIComponent(p.name);
    const t = encodeURIComponent(wikiTitle).replace(/%20/g, "_");
    const a2 = (p.a2 || "").toLowerCase();
    const links = [
      ["Wikipedia", wikiTitle !== p.name ? `https://en.wikipedia.org/wiki/${t}` : `https://en.wikipedia.org/wiki/Special:Search?search=${q}`],
      ["Britannica", `https://www.britannica.com/search?query=${q}`],
      ["UNESCO World Heritage", a2 ? `https://whc.unesco.org/en/statesparties/${a2}` : `https://whc.unesco.org/en/list/?search=${q}`],
      ["Our World in Data", `https://ourworldindata.org/search?q=${q}`],
      ["World Bank data", a2 ? `https://data.worldbank.org/country/${a2.toUpperCase()}` : `https://data.worldbank.org/?q=${q}`],
      ["CIA World Factbook", `https://duckduckgo.com/?q=${encodeURIComponent(`site:cia.gov/the-world-factbook ${p.name}`)}`],
      ["Internet Archive", `https://archive.org/search?query=${q}`],
      ["Google Arts & Culture", `https://artsandculture.google.com/search?q=${q}`],
      ["Wikivoyage", `https://en.wikivoyage.org/wiki/Special:Search?search=${encodeURIComponent(wikiTitle)}`],
    ];
    return links.map(([label, href]) =>
      `<li><a href="${href}" target="_blank" rel="noopener">${label}<span aria-hidden="true">↗</span><span class="visually-hidden"> (opens in a new tab)</span></a></li>`
    ).join("");
  }

  // Fetch facts (Wikidata) then the overview (Wikipedia). Never throws.
  function lookUp(p) {
    if (cache.has(p.a3)) return cache.get(p.a3);
    const job = (async () => {
      const info = { facts: null, summary: null, wikiTitle: p.name };
      try {
        info.facts = await fetchFacts(p.a3);
        if (info.facts.wikiTitle) info.wikiTitle = info.facts.wikiTitle;
      } catch (e) { /* shown as a friendly message */ }
      try {
        info.summary = await fetchSummary(info.wikiTitle);
      } catch (e) { /* shown as a friendly message */ }
      return info;
    })();
    cache.set(p.a3, job);
    // If both lookups failed, let the next click try again
    job.then((info) => { if (!info.facts && !info.summary) cache.delete(p.a3); });
    return job;
  }

  async function fetchFacts(a3) {
    // Official languages: only ones that apply to the whole country
    // (not regional ones like Hawaiian), and not ones marked outdated.
    // Labels fall back to "mul" (all languages) when there's no English one.
    const query = `
      SELECT ?article ?capitalLabel ?population ?languageLabel ?currencyLabel ?continentLabel WHERE {
        ?c wdt:P298 "${a3}" .
        OPTIONAL { ?c wdt:P36 ?capital }
        OPTIONAL { ?c wdt:P1082 ?population }
        OPTIONAL { ?c p:P37 ?ls . ?ls ps:P37 ?language ; wikibase:rank ?rank .
                   FILTER(?rank != wikibase:DeprecatedRank)
                   FILTER NOT EXISTS { ?ls pq:P518 [] } FILTER NOT EXISTS { ?ls pq:P1001 [] } }
        OPTIONAL { ?c wdt:P38 ?currency }
        OPTIONAL { ?c wdt:P30 ?continent }
        OPTIONAL { ?article schema:about ?c ; schema:isPartOf <https://en.wikipedia.org/> }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul" }
      }`;
    const res = await fetchWithTimeout(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`);
    const rows = (await res.json()).results.bindings;
    if (!rows.length) throw new Error("No facts");
    const set = (key) => [...new Set(rows.map((r) => r[key] && r[key].value).filter((v) => v && !/^Q\d+$/.test(v)))];
    const pops = set("population").map(Number).filter((n) => n > 0);
    const article = set("article")[0];
    return {
      capital: set("capitalLabel"),
      population: pops.length ? Math.max(...pops) : null,
      languages: set("languageLabel"),
      currencies: set("currencyLabel"),
      region: set("continentLabel"),
      wikiTitle: article ? decodeURIComponent(article.split("/wiki/")[1]).replace(/_/g, " ") : null,
    };
  }

  async function fetchSummary(title) {
    const res = await fetchWithTimeout(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
    const data = await res.json();
    if (!data.extract) throw new Error("No summary");
    return { text: data.extract, url: data.content_urls && data.content_urls.desktop.page };
  }

  function fillPanel(p, info) {
    const facts = document.getElementById("p-facts");
    const overview = document.getElementById("p-overview");
    const links = document.getElementById("p-links");
    if (!facts) return;

    if (info.facts) {
      const f = info.facts;
      const list = (arr) => (arr.length ? arr.map(escapeHtml).join(", ") : "Not listed");
      facts.innerHTML = `
        <dt>Capital</dt><dd>${list(f.capital)}</dd>
        <dt>Population</dt><dd>${f.population ? f.population.toLocaleString("en-GB") : "Not listed"}</dd>
        <dt>Official languages</dt><dd>${list(f.languages)}</dd>
        <dt>Currency</dt><dd>${list(f.currencies)}</dd>
        <dt>Region</dt><dd>${list(f.region)}</dd>`;
    } else {
      facts.outerHTML = `<p class="p-error">The basic facts couldn't be fetched just now. Check your connection, or close this page and try again in a moment.</p>`;
    }

    if (info.summary) {
      overview.innerHTML = `<p>${escapeHtml(info.summary.text)}</p>` +
        (info.summary.url ? `<a href="${escapeAttr(info.summary.url)}" target="_blank" rel="noopener">Read more on Wikipedia ↗<span class="visually-hidden"> (opens in a new tab)</span></a>` : "");
    } else {
      overview.innerHTML = `<p class="p-error">The overview couldn't be loaded from Wikipedia right now. The links below still work.</p>`;
    }

    links.innerHTML = exploreLinks(p, info.wikiTitle);
  }

  /* ---------------------------------------------------------
     Small helpers
     --------------------------------------------------------- */
  function fetchWithTimeout(url, ms = 9000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).then((res) => {
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const escapeAttr = escapeHtml;
  function debounce(fn, ms) {
    let t;
    return () => { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  // Simplex noise (same idea as the homepage map): smooth, natural randomness
  const perm = new Uint8Array(512);
  (function seed(s) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  })(404040);
  const GX = [1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0], GY = [1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1];
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  function noise(x, y) {
    const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s), t = (i + j) * G2;
    const x0 = x - (i - t), y0 = y - (j - t), i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n = 0, tt, g;
    tt = 0.5 - x0 * x0 - y0 * y0; if (tt > 0) { g = perm[ii + perm[jj]] % 12; tt *= tt; n += tt * tt * (GX[g] * x0 + GY[g] * y0); }
    tt = 0.5 - x1 * x1 - y1 * y1; if (tt > 0) { g = perm[ii + i1 + perm[jj + j1]] % 12; tt *= tt; n += tt * tt * (GX[g] * x1 + GY[g] * y1); }
    tt = 0.5 - x2 * x2 - y2 * y2; if (tt > 0) { g = perm[ii + 1 + perm[jj + 1]] % 12; tt *= tt; n += tt * tt * (GX[g] * x2 + GY[g] * y2); }
    return 70 * n;
  }

  loadWorld();
})();
