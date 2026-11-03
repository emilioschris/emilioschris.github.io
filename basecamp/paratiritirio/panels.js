/* =========================================================
   PARATIRITIRIO · the data panels
   ---------------------------------------------------------
   1. Helpers: formatting, evidence labels, the line chart
   2. The Pulse: twelve indicator cards and one time slider
   3. Who benefits: wealth, generations, housing
   4. Companies by structure
   Reads PARATIRITIRIO.pulse (pulse-data.js, refreshed monthly
   by a GitHub Action) and PARATIRITIRIO.snapshot
   (pulse-snapshot.js, updated by hand). Charts are drawn as
   plain SVG: one axis each, at most two series, values
   labelled, a crosshair and tooltip on hover or focus.
   ========================================================= */
(() => {
  "use strict";

  const P = window.PARATIRITIRIO;
  const D = (P.pulse && P.pulse.series) || {};
  const S = P.snapshot || {};
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- 1. HELPERS ---------- */
  function fmtPeriod(p) {
    if (/^\d{4}-Q\d$/.test(p)) return p.replace("-", " ");
    const m = p.match(/^(\d{4})-(\d{2})$/);
    if (m) return MONTHS[Number(m[2]) - 1] + " " + m[1];
    return p;
  }
  const yearOf = (p) => Number(p.slice(0, 4));
  /* A comparable decimal year, so monthly, quarterly and annual series share one x-scale */
  function tOf(p) {
    const y = yearOf(p);
    let m = p.match(/-Q(\d)$/);
    if (m) return y + (Number(m[1]) * 3 - 1.5) / 12;
    m = p.match(/-(\d{2})$/);
    if (m) return y + (Number(m[1]) - 0.5) / 12;
    return y + 0.5;
  }
  function num(v, dp = 0) {
    return Number(v).toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }
  function evLabel(kind) {
    const k = P.evidence && P.evidence[kind];
    return k ? `<span class="ev ev--${esc(kind)}" title="${esc(k.desc)}">${esc(k.label)}</span>` : "";
  }
  function srcLine(src, asOf) {
    if (!src) return "";
    return `<p class="card-src">${evLabel(src.kind)} <a href="${esc(src.url)}" rel="noopener">${esc(src.publisher)}${src.dataset ? " · " + esc(src.dataset) : ""}</a>${asOf ? ` <span class="card-asof">as of ${esc(asOf)}</span>` : ""}</p>`;
  }

  /* The shared time window: every chart shows points from this year on */
  const latestYear = Math.max(...Object.values(D).filter((s) => s.points).map((s) => yearOf(s.points[s.points.length - 1][0])), 2026);
  let fromYear = Math.max(2010, latestYear - 7);
  try { const saved = Number(localStorage.getItem("paratiritirio-from")); if (saved >= 2010 && saved <= latestYear) fromYear = saved; } catch (e) {}
  const charts = [];   // redraw functions, called when the slider moves

  /* A line chart: one y-axis, one or two series, crosshair + tooltip.
     series: [{ name, points: [[period, value]], cls: "s1" | "s2" }] */
  function lineChart(host, series, { unit = "", dp = 1, height = 96, axis = true, zero = false, width = 320 } = {}) {
    const draw = () => {
      const visible = series.map((s) => ({ ...s, pts: s.points.filter((p) => yearOf(p[0]) >= fromYear) })).filter((s) => s.pts.length);
      if (!visible.length) { host.innerHTML = `<p class="chart-empty">No data from ${fromYear} on.</p>`; return; }
      const W = width, H = height, padL = axis ? 34 : 4, padR = 46, padT = 10, padB = axis ? 18 : 6;
      const all = visible.flatMap((s) => s.pts);
      const t0 = Math.min(...all.map((p) => tOf(p[0]))), t1 = Math.max(...all.map((p) => tOf(p[0])));
      let v0 = Math.min(...all.map((p) => p[1])), v1 = Math.max(...all.map((p) => p[1]));
      if (zero) { v0 = Math.min(0, v0); v1 = Math.max(0, v1); }
      if (v0 === v1) { v0 -= 1; v1 += 1; }
      const pad = (v1 - v0) * 0.08; v0 -= pad; v1 += pad;
      const x = (t) => padL + (t1 === t0 ? 0.5 : (t - t0) / (t1 - t0)) * (W - padL - padR);
      const y = (v) => padT + (1 - (v - v0) / (v1 - v0)) * (H - padT - padB);
      const ticks = [v0 + pad, (v0 + v1) / 2, v1 - pad];
      const yearTicks = [];
      for (let yr = Math.ceil(t0); yr <= t1; yr += Math.max(1, Math.ceil((t1 - t0) / 4))) yearTicks.push(yr);
      const path = (pts) => pts.map((p, i) => (i ? "L" : "M") + x(tOf(p[0])).toFixed(1) + "," + y(p[1]).toFixed(1)).join("");
      const zeroLine = v0 < 0 && v1 > 0 ? `<line class="ch-zero" x1="${padL}" x2="${W - padR}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}"/>` : "";
      const label = visible.length > 1 ? (s) => esc(s.short || s.name) + " " : () => "";
      host.innerHTML = `
        <svg class="ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(visible.map((s) => s.name + ": " + num(s.pts[s.pts.length - 1][1], dp) + " in " + fmtPeriod(s.pts[s.pts.length - 1][0])).join("; "))}">
          ${axis ? ticks.map((v) => `<line class="ch-grid" x1="${padL}" x2="${W - padR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="ch-tick" x="${padL - 4}" y="${(y(v) + 3).toFixed(1)}" text-anchor="end">${num(v, Math.abs(v1 - v0) < 10 ? 1 : 0)}</text>`).join("") : ""}
          ${axis ? yearTicks.map((yr) => `<text class="ch-tick" x="${x(yr).toFixed(1)}" y="${H - 4}" text-anchor="middle">${yr}</text>`).join("") : ""}
          ${zeroLine}
          ${visible.map((s) => `<path class="ch-line ${s.cls || "s1"}" d="${path(s.pts)}"/>`).join("")}
          ${visible.map((s) => { const p = s.pts[s.pts.length - 1]; return `<circle class="ch-end ${s.cls || "s1"}" cx="${x(tOf(p[0])).toFixed(1)}" cy="${y(p[1]).toFixed(1)}" r="4"/><text class="ch-endlabel" x="${(x(tOf(p[0])) + 7).toFixed(1)}" y="${(y(p[1]) + 3.5).toFixed(1)}">${label(s)}${num(p[1], dp)}</text>`; }).join("")}
          <line class="ch-cross" x1="0" x2="0" y1="${padT}" y2="${H - padB}" visibility="hidden"/>
          <rect class="ch-hit" x="${padL}" y="0" width="${W - padL - padR}" height="${H}"/>
        </svg>
        <div class="ch-tip" hidden></div>`;
      const svg = host.querySelector("svg"), tip = host.querySelector(".ch-tip"), cross = host.querySelector(".ch-cross");
      const show = (clientX) => {
        const r = svg.getBoundingClientRect();
        const t = t0 + ((clientX - r.left) / r.width * W - padL) / (W - padL - padR) * (t1 - t0);
        const rows = visible.map((s) => {
          const p = s.pts.reduce((a, b) => Math.abs(tOf(b[0]) - t) < Math.abs(tOf(a[0]) - t) ? b : a);
          return { s, p };
        });
        const px = x(tOf(rows[0].p[0]));
        cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.setAttribute("visibility", "visible");
        tip.innerHTML = `<strong>${esc(fmtPeriod(rows[0].p[0]))}</strong>${rows.map(({ s, p }) => `<span><i class="sw ${s.cls || "s1"}"></i>${visible.length > 1 ? esc(s.short || s.name) + ": " : ""}${num(p[1], dp)}${unit ? (unit === "%" ? "" : " ") + esc(unit) : ""}</span>`).join("")}`;
        tip.hidden = false;
        const left = Math.min(Math.max(px / W * r.width, 60), r.width - 60);
        tip.style.left = left + "px";
      };
      svg.addEventListener("pointermove", (e) => show(e.clientX));
      svg.addEventListener("pointerleave", () => { tip.hidden = true; cross.setAttribute("visibility", "hidden"); });
    };
    charts.push(draw);
    draw();
  }

  function legend(items) {
    return `<p class="ch-legend">${items.map(([cls, name]) => `<span><i class="sw ${cls}"></i>${esc(name)}</span>`).join("")}</p>`;
  }

  /* Horizontal bars with the value printed on each: [[label, value, cls?]] */
  function bars(rows, { dp = 0, unit = "", max } = {}) {
    const m = max || Math.max(...rows.map((r) => r[1]));
    return `<ul class="hbars">${rows.map(([label, v, cls]) => `
      <li><span class="hb-label">${esc(label)}</span>
        <span class="hb-track"><span class="hb-bar ${cls || "s1"}" style="--w:${Math.max(0.5, (v / m) * 100).toFixed(2)}%"></span></span>
        <span class="hb-val">${num(v, dp)}${esc(unit)}</span></li>`).join("")}</ul>`;
  }

  /* ---------- 2. THE PULSE ---------- */
  const last = (pts, n = 1) => pts[pts.length - n];
  /* Compare with the same period a year earlier where the series is seasonal */
  function yearAgo(pts) {
    const [p] = last(pts);
    const target = p.replace(/^(\d{4})/, (y) => String(Number(y) - 1));
    return pts.find((q) => q[0] === target);
  }

  function changeText(cur, prev, isRate, dp) {
    if (!prev) return "";
    const d = isRate ? cur[1] - prev[1] : (cur[1] / prev[1] - 1) * 100;
    const arrow = d > 0.0001 ? "▲" : d < -0.0001 ? "▼" : "■";
    const amount = isRate ? `${num(Math.abs(d), dp)} pts` : `${num(Math.abs(d), 1)}%`;
    return `<span class="chg ${d > 0 ? "up" : d < 0 ? "down" : ""}">${arrow} ${amount}</span> <span class="chg-vs">vs ${esc(fmtPeriod(prev[0]))}</span>`;
  }

  const PULSE = [
    { id: "gdp", title: "GDP growth", rate: true, dp: 1, suffix: "%", compare: "prev", zero: true },
    { id: "inflation", title: "Inflation", rate: true, dp: 1, suffix: "%", compare: "prev", zero: true },
    { id: "unemployment", title: "Unemployment", rate: true, dp: 1, suffix: "%", compare: "prev" },
    { id: "rppi", title: "House prices", rate: false, dp: 1, compare: "year", note: "Index, 2010 Q1 = 100" },
    { snap: "propertySales", title: "Property sales", dp: 0 },
    { id: "permits", title: "Building permits", rate: false, dp: 0, compare: "year" },
    { id: "arrivals", title: "Tourist arrivals", rate: false, dp: 0, compare: "year", countries: true },
    { id: "tourismRevenue", title: "Tourism revenue", rate: false, dp: 0, prefix: "€", suffix: "m", compare: "year" },
    { snap: "companyRegistrations", title: "Company registrations", dp: 0 },
    { id: "loansHouseholds", id2: "loansBusinesses", title: "Bank lending", rate: true, dp: 1, suffix: "%", compare: "prev", zero: true, names: ["Households", "Businesses"] },
    { snap: "npl", title: "Non-performing loans", dp: 1, suffix: "%" },
    { id: "fdiTotal", id2: "fdiSpe", title: "Foreign direct investment", rate: false, dp: 0, prefix: "€", suffix: "bn", scale: 1e-3, compare: "prev", names: ["All", "Via SPEs"] },
  ];

  function pulseCard(c) {
    const card = document.createElement("article");
    card.className = "pcard";
    if (c.snap) {
      const s = S[c.snap];
      if (!s) return null;
      const pts = s.months;
      const cur = last(pts), prev = pts.length > 1 ? last(pts, 2) : null;
      let change = "";
      if (c.snap === "propertySales") change = `<span class="chg up">▲ ${s.lastMonthChangePct}%</span> <span class="chg-vs">vs ${esc(fmtPeriod(cur[0]).replace(/\d{4}$/, (y) => y - 1))}</span>`;
      else change = changeText(cur, prev, c.snap === "npl", 1);
      card.innerHTML = `
        <header><h3>${esc(c.title)}</h3><p class="pcard-unit">${esc(s.unit)}</p></header>
        <p class="pcard-num">${esc(c.prefix || "")}${num(cur[1], c.dp)}${esc(c.suffix || "")}<span class="pcard-when">${esc(fmtPeriod(cur[0]))}</span></p>
        <p class="pcard-chg">${change}</p>
        <div class="pcard-chart"></div>
        ${c.snap === "propertySales" ? `<p class="pcard-extra">Jan to Sep 2026: ${num(s.yearToDate.total)} contracts, up ${s.yearToDate.changePct}% on a year earlier.</p>` : ""}
        ${c.snap === "companyRegistrations" ? `<p class="pcard-extra">${num(s.totalRegistered.companies)} companies on the register at ${esc(s.totalRegistered.date.split("-").reverse().join("/"))}.</p>` : ""}
        ${c.snap === "npl" ? `<p class="pcard-extra">Coverage by provisions: ${s.coverage["2026-07"]}% in July 2026.</p>` : ""}
        ${srcLine(s.source, s.asOf)}
        <p class="card-snap">Hand-updated snapshot</p>`;
      lineChart(card.querySelector(".pcard-chart"), [{ name: c.title, points: pts }], { unit: c.snap === "npl" ? "%" : "", dp: c.dp, height: 84 });
      return card;
    }
    const s = D[c.id];
    if (!s) return null;
    const scale = c.scale || 1;
    const pts = s.points.map(([p, v]) => [p, v * scale]);
    const cur = last(pts);
    const prev = c.compare === "year" ? yearAgo(pts) : last(pts, 2);
    const series = [{ name: c.names ? c.names[0] : c.title, short: c.names && c.names[0], points: pts, cls: "s1" }];
    if (c.id2 && D[c.id2]) series.push({ name: c.names[1], short: c.names[1], points: D[c.id2].points.map(([p, v]) => [p, v * scale]), cls: "s2" });
    let extra = "";
    if (c.countries && D.arrivalsByCountry) {
      const a = D.arrivalsByCountry;
      extra = `<p class="pcard-extra">Top countries, ${esc(fmtPeriod(a.month))}:</p>${bars(a.top.map(([n, v]) => [n, v]), {})}`;
    }
    if (c.id === "fdiTotal" && D.fdiSpe) {
      const all = last(D.fdiTotal.points), spe = D.fdiSpe.points.find((p) => p[0] === all[0]);
      if (spe) extra = `<p class="pcard-extra">Without special purpose entities: <strong>€${num((all[1] - spe[1]) / 1000, 1)}bn</strong> in ${esc(all[0])}. Most of the headline passes through Cyprus rather than staying.</p>`;
    }
    if (c.id === "loansHouseholds" && D.loansBusinesses) {
      extra = `<p class="pcard-extra">Businesses: ${num(last(D.loansBusinesses.points)[1], 1)}% a year, ${esc(fmtPeriod(last(D.loansBusinesses.points)[0]))}.</p>`;
    }
    card.innerHTML = `
      <header><h3>${esc(c.title)}</h3><p class="pcard-unit">${esc(c.note || s.unit)}${c.id2 ? "" : ""}</p></header>
      <p class="pcard-num">${esc(c.prefix || "")}${num(cur[1], c.id === "fdiTotal" ? 0 : c.dp)}${esc(c.suffix || "")}<span class="pcard-when">${esc(fmtPeriod(cur[0]))}${c.names ? " · " + esc(c.names[0].toLowerCase()) : ""}</span></p>
      <p class="pcard-chg">${changeText(cur, prev, c.rate, c.dp)}</p>
      ${series.length > 1 ? legend(series.map((x) => [x.cls, x.name])) : ""}
      <div class="pcard-chart"></div>
      ${extra}
      ${srcLine(s.source, fmtPeriod(cur[0]))}`;
    lineChart(card.querySelector(".pcard-chart"), series, { unit: c.suffix === "%" ? "%" : "", dp: c.id === "fdiTotal" ? 0 : c.dp, height: 84, zero: c.zero });
    return card;
  }

  function buildPulse() {
    const grid = document.getElementById("pulse-grid");
    if (!grid) return;
    if (!P.pulse) { grid.innerHTML = `<p class="p-error">The indicator data (pulse-data.js) didn't load.</p>`; return; }
    PULSE.forEach((c) => { const card = pulseCard(c); if (card) grid.appendChild(card); });
    document.getElementById("pulse-fetched").textContent = "Figures fetched " + P.pulse.fetched.split("-").reverse().join("/") + "; snapshots dated on each card.";

    const slider = document.getElementById("time-from");
    const out = document.getElementById("time-from-out");
    slider.min = 2010; slider.max = latestYear - 1; slider.value = fromYear;
    out.textContent = fromYear;
    slider.addEventListener("input", () => {
      fromYear = Number(slider.value);
      out.textContent = fromYear;
      try { localStorage.setItem("paratiritirio-from", String(fromYear)); } catch (e) {}
      charts.forEach((draw) => draw());
    });
    document.getElementById("pulse-deeper").innerHTML = S.links.deeper.map((l) =>
      `<li><a href="${esc(l.url)}" rel="noopener">${esc(l.title)}</a> <span>${esc(l.publisher)}. ${esc(l.desc)}</span></li>`).join("");
  }

  /* ---------- 3. WHO BENEFITS ---------- */
  function buildWho() {
    const el = document.getElementById("who-grid");
    if (!el) return;
    const h = S.hfcs, m = S.millionaires;
    const t10 = D.wealthTop10CY, b50 = D.wealthBottom50CY, t10e = D.wealthTop10EA, b50e = D.wealthBottom50EA;
    const cards = [];

    if (t10 && b50 && t10e && b50e) {
      const L = (s) => last(s.points);
      cards.push(`
        <article class="wcard wcard--wide">
          <header><h3>Who holds the wealth</h3><p class="pcard-unit">share of all household net wealth</p></header>
          ${legend([["s1", "Cyprus"], ["s2", "Euro area"]])}
          <div class="wsplit">
            <div><p class="wsub">Richest 10% of households</p>${bars([["Cyprus", L(t10)[1], "s1"], ["Euro area", L(t10e)[1], "s2"]], { dp: 1, unit: "%", max: 100 })}</div>
            <div><p class="wsub">Poorest half of households</p>${bars([["Cyprus", L(b50)[1], "s1"], ["Euro area", L(b50e)[1], "s2"]], { dp: 1, unit: "%", max: 100 })}</div>
          </div>
          <p class="wsub">Richest 10%'s share over time</p>
          <div class="wchart" id="who-t10"></div>
          <p class="pcard-extra">Cyprus ${esc(fmtPeriod(L(t10)[0]))}, euro area ${esc(fmtPeriod(L(t10e)[0]))}. Wealth Gini for Cyprus: ${D.wealthGiniCY ? num(last(D.wealthGiniCY.points)[1], 1) : "n/a"} (0 = equal, 100 = one household has everything).</p>
          ${srcLine(t10.source, fmtPeriod(L(t10)[0]))}
          <p class="card-snap">Experimental statistics: the ECB scales its household survey to the national accounts every quarter.</p>
        </article>`);
    }

    if (h) {
      cards.push(`
        <article class="wcard">
          <header><h3>A typical household's wealth</h3><p class="pcard-unit">${esc(h.unit)}, ${esc(h.wave)} survey</p></header>
          ${legend([["s1", "Cyprus"], ["s2", "Euro area"]])}
          ${bars([["Cyprus", h.cyprus, "s1"], ["Euro area", h.euroArea, "s2"]], { dp: 1, unit: "k" })}
          <p class="wsub">By age of the head of household</p>
          ${bars(h.byAge.flatMap(([a, cy, ea]) => [[a + " · CY", cy, "s1"], [a + " · EA", ea, "s2"]]), { dp: 1, unit: "k" })}
          <p class="pcard-extra">In the same survey the richest 10% held ${h.top10Share.cyprus}% in Cyprus and ${h.top10Share.euroArea}% in the euro area.</p>
          ${srcLine(h.source, h.asOf)}
          <p class="card-snap">${esc(h.note)}</p>
        </article>`);
      cards.push(`
        <article class="wcard">
          <header><h3>Owners and renters</h3><p class="pcard-unit">${esc(h.unit)}, ${esc(h.wave)} survey</p></header>
          ${legend([["s1", "Cyprus"], ["s2", "Euro area"]])}
          ${bars(h.byHousing.flatMap(([a, cy, ea]) => [[a + " · CY", cy, "s1"], [a + " · EA", ea, "s2"]]), { dp: 1, unit: "k" })}
          <p class="pcard-extra">A renting household in Cyprus had a median net wealth of €${num(h.byHousing[2][1] * 1000)}; one that owns its home outright, €${num(h.byHousing[0][1] * 1000)}.</p>
          ${srcLine(h.source, h.asOf)}
        </article>`);
    }

    if (D.leaveHomeCY) {
      cards.push(`
        <article class="wcard">
          <header><h3>Leaving home</h3><p class="pcard-unit">average age young people leave their parents' home</p></header>
          ${legend([["s1", "Cyprus"], ["s2", "EU"]])}
          <div class="wchart" id="who-home"></div>
          ${srcLine(D.leaveHomeCY.source, last(D.leaveHomeCY.points)[0])}
        </article>`);
    }

    if (D.rppi && D.rents && D.inflation) {
      cards.push(`
        <article class="wcard">
          <header><h3>Housing costs</h3><p class="pcard-unit">% change on a year earlier</p></header>
          ${legend([["s1", "Rents"], ["s2", "House prices"]])}
          <div class="wchart" id="who-housing"></div>
          <p class="pcard-extra">General inflation: ${num(last(D.inflation.points)[1], 1)}% in ${esc(fmtPeriod(last(D.inflation.points)[0]))}. An income series to set against prices isn't in yet.</p>
          ${srcLine(D.rents.source, fmtPeriod(last(D.rents.points)[0]))}
          ${srcLine(D.rppi.source, fmtPeriod(last(D.rppi.points)[0]))}
        </article>`);
    }

    if (m) {
      cards.push(`
        <article class="wcard">
          <header><h3>Millionaires</h3><p class="pcard-unit">dollar millionaires, ${esc(m.year)}</p></header>
          <p class="pcard-num">about ${num(m.count)}<span class="pcard-when">${esc(m.shareOfAdults)} of adults</span></p>
          ${srcLine(m.source, m.asOf)}
          <p class="card-src">Original: <a href="${esc(m.original.url)}" rel="noopener">${esc(m.original.publisher)}, ${esc(m.original.title)}</a></p>
          <p class="card-snap">${esc(m.note)}</p>
        </article>`);
    }

    cards.push(`
      <article class="wcard wcard--wide wcard--argue">
        <header><h3>The argument</h3><p class="pcard-unit">how to read these figures</p></header>
        <div class="argue">
          <div>
            <p class="wsub">${evLabel("opinion")} Inequality is rising</p>
            <p>Les Manison, a former IMF economist and Central Bank adviser, argues in a Cyprus Mail column that Cypriot wealth is unevenly held and growing more so, driven by inheritance, and that younger households are falling behind on income and home ownership.</p>
            <p class="card-src"><a href="https://cyprus-mail.com/2024/05/19/as-wealth-inequality-rises-in-cyprus-both-people-and-democracy-suffer" rel="noopener">Cyprus Mail, 19 May 2024</a></p>
          </div>
          <div>
            <p class="wsub">${evLabel("official")} What the official tables show</p>
            <p>On the ECB's measures, wealth in Cyprus is less concentrated than in the euro area as a whole, and young Cypriot households hold far more than young households elsewhere. The two are compatible: a lower level of inequality can still be rising, and these tables say nothing about incomes.</p>
            <p class="card-src">ECB distributional wealth accounts; HFCS 2021 tables</p>
          </div>
        </div>
        <p class="card-snap">The column is cited for its argument only. Its figures come from the same ECB survey shown above.</p>
      </article>`);

    el.innerHTML = cards.join("");
    if (t10 && t10e) lineChart(document.getElementById("who-t10"), [
      { name: "Cyprus", short: "CY", points: t10.points, cls: "s1" }, { name: "Euro area", short: "EA", points: t10e.points, cls: "s2" }], { unit: "%", dp: 1, height: 130, width: 900 });
    if (D.leaveHomeCY && D.leaveHomeEU) lineChart(document.getElementById("who-home"), [
      { name: "Cyprus", short: "CY", points: D.leaveHomeCY.points, cls: "s1" }, { name: "EU", short: "EU", points: D.leaveHomeEU.points, cls: "s2" }], { unit: "years", dp: 1, height: 110 });
    if (D.rppi && D.rents) {
      // House-price growth: each quarter against the same quarter a year earlier
      const idx = Object.fromEntries(D.rppi.points);
      const growth = D.rppi.points.map(([p, v]) => { const prev = idx[p.replace(/^(\d{4})/, (y) => String(Number(y) - 1))]; return prev ? [p, (v / prev - 1) * 100] : null; }).filter(Boolean);
      lineChart(document.getElementById("who-housing"), [
        { name: "Rents", short: "Rents", points: D.rents.points, cls: "s1" }, { name: "House prices", short: "Prices", points: growth, cls: "s2" }], { unit: "%", dp: 1, height: 110, zero: true });
    }
  }

  /* ---------- 4. COMPANIES BY STRUCTURE ---------- */
  const DISTRICT_NAMES = { nicosia: "Nicosia", limassol: "Limassol", larnaca: "Larnaca", paphos: "Paphos", famagusta: "Famagusta (south)" };

  function buildCompanies() {
    const el = document.getElementById("companies-grid");
    if (!el) return;
    const reg = S.companyRegistrations, inf = S.infobel, sz = D.companySizes, est = D.establishments, fc = D.foreignControl;
    const cards = [];

    cards.push(`
      <article class="wcard wcard--wide">
        <header><h3>How many companies?</h3><p class="pcard-unit">three counts, three meanings</p></header>
        <div class="tiles">
          ${reg ? `<div class="tile"><p class="tile-num">${num(reg.totalRegistered.companies)}</p><p class="tile-label">companies on the register</p><p class="card-src">${evLabel("official")} <a href="${esc(reg.source2.url)}" rel="noopener">Registrar of Companies</a> · ${esc(reg.totalRegistered.date.split("-").reverse().join("/"))}</p></div>` : ""}
          ${sz ? `<div class="tile"><p class="tile-num">${num(sz.total)}</p><p class="tile-label">active enterprises in the business economy</p><p class="card-src">${evLabel("official")} <a href="${esc(sz.source.url)}" rel="noopener">Eurostat</a> · ${esc(sz.year)}</p></div>` : ""}
          ${inf ? `<div class="tile"><p class="tile-num">${num(inf.count)}</p><p class="tile-label">businesses in a vendor's database</p><p class="card-src">${evLabel("company")} <a href="${esc(inf.source.url)}" rel="noopener">InfobelPRO</a> · public headline</p></div>` : ""}
        </div>
        <p class="pcard-extra">The register counts every company ever set up and not struck off, including many holding companies with no staff on the island. Eurostat counts only enterprises with real business activity. The vendor's count is its own and isn't used anywhere else on this page.</p>
      </article>`);

    if (est) {
      const d = Object.entries(est.byDistrict).sort((a, b) => b[1] - a[1]);
      cards.push(`
        <article class="wcard">
          <header><h3>By district</h3><p class="pcard-unit">business establishments, ${esc(est.year)}</p></header>
          ${bars(d.map(([k, v]) => [DISTRICT_NAMES[k] || k, v]))}
          <p class="pcard-extra">Government-controlled areas only; CYSTAT has no figures for the north. An establishment is a place of business, so one company can have several.</p>
          ${srcLine(est.source, est.year)}
        </article>
        <article class="wcard">
          <header><h3>By sector</h3><p class="pcard-unit">business establishments, ${esc(est.year)}, top 8</p></header>
          ${bars(est.bySector.slice(0, 8).map(([k, v]) => [k.replace(/^[A-Z]\s+/, ""), v]))}
          ${srcLine(est.source, est.year)}
        </article>`);
    }

    if (sz) {
      cards.push(`
        <article class="wcard">
          <header><h3>By size</h3><p class="pcard-unit">enterprises by people employed, ${esc(sz.year)}</p></header>
          ${bars(sz.bands)}
          <p class="pcard-extra">${esc(sz.note)}</p>
          ${srcLine(sz.source, sz.year)}
        </article>`);
    }

    if (fc) {
      const pctE = (fc.enterprises.foreign / fc.enterprises.all) * 100, pctJ = (fc.employed.foreign / fc.employed.all) * 100;
      cards.push(`
        <article class="wcard">
          <header><h3>Foreign or Cypriot?</h3><p class="pcard-unit">foreign-controlled share of the business economy, ${esc(fc.year)}</p></header>
          ${legend([["s2", "Foreign-controlled"]])}
          ${bars([["Enterprises", pctE, "s2"], ["People employed", pctJ, "s2"]], { dp: 1, unit: "%", max: 100 })}
          <p class="pcard-extra">${num(fc.enterprises.foreign)} of ${num(fc.enterprises.all)} enterprises, employing ${num(fc.employed.foreign)} of ${num(fc.employed.all)} people. Few foreign firms, but they are larger than average. ${esc(fc.note)}</p>
          ${srcLine(fc.source, fc.year)}
          <p class="card-snap">${esc(fc.year)} is the latest year Eurostat publishes for Cyprus.</p>
        </article>`);
    }

    cards.push(`
      <article class="wcard">
        <header><h3>Listed companies</h3><p class="pcard-unit">where to look them up</p></header>
        <p>Shares in the island's largest companies, including Bank of Cyprus, trade on the <a href="https://www.cse.com.cy/en-GB/home/" rel="noopener">Cyprus Stock Exchange</a>, which publishes their announcements and annual reports.</p>
        <p class="card-src">${evLabel("official")} Cyprus Stock Exchange</p>
      </article>`);

    el.innerHTML = cards.join("");
  }

  buildPulse();
  buildWho();
  buildCompanies();
})();
