/* =========================================================
   RECENTLY ATTENDED · builds the list from data.js
   ========================================================= */
(() => {
  "use strict";

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const roughDate = (ym) => { const [y, m] = ym.split("-"); return `${MONTHS[Number(m) - 1]} ${y}`; };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // An outside link that opens in a new tab and says so to screen readers
  function outLink(href, text, hidden) {
    const a = el("a", "", text);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.append(el("span", "visually-hidden", ` (${hidden}, opens in a new tab)`));
    return a;
  }

  const CROSSHAIR = '<svg class="ev-cross" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1v14M1 8h14"/><circle cx="8" cy="8" r="2"/></svg>';

  function speaker(s, event) {
    const li = el("li", "ev-speaker");
    const name = el("p", "ev-name");
    if (s.link) {
      name.append(outLink(s.link, s.name, "profile"), el("span", "ev-hint", "profile ↗"));
    } else {
      const q = encodeURIComponent(`${s.name} ${s.affiliation}`);
      name.append(outLink(`https://www.google.com/search?q=${q}`, s.name, "web search"), el("span", "ev-hint", "search ↗"));
    }
    li.append(name, el("p", "ev-aff", s.affiliation));
    if (s.role) li.append(el("p", "ev-role", s.role));
    return li;
  }

  function entry(event) {
    const li = el("li", "ev-entry reveal");
    li.append(el("span", "ev-pin"));
    li.lastChild.setAttribute("aria-hidden", "true");

    const meta = el("p", "ev-meta");
    const time = el("time", "", roughDate(event.month));
    time.dateTime = event.month;
    meta.append(el("span", "", event.kind), time);

    const title = el("h2", "ev-name-title");
    title.append(outLink(event.link, event.name, "event page"));

    const place = el("p", "ev-place");
    place.innerHTML = CROSSHAIR;
    place.append(el("span", "", event.place), el("span", "ev-coords", event.coords));

    const stamp = el("span", "stamp stamp--visited ev-stamp", "Attended");

    const card = el("article", "ev-card");
    card.append(meta, title, place, el("p", "ev-host", event.host), stamp);

    const speakers = el("section", "ev-speakers");
    const label = el("h3", "ev-label", `Speakers · ${event.speakers.length}`);
    const list = el("ul", "ev-grid");
    list.append(...event.speakers.map((s) => speaker(s, event)));
    speakers.append(label, list);
    if (event.note) speakers.append(el("p", "ev-note", event.note));

    const source = el("p", "ev-source", "Source: ");
    source.append(outLink(event.source.url, event.source.label, "source"), `, checked ${event.source.checked}.`);
    speakers.append(source);

    card.append(speakers);
    li.append(card);
    return li;
  }

  const list = document.getElementById("ev-list");
  list.append(...EVENTS.map(entry));

  // Fade each entry in as it arrives (the shared reveal only sees what was there at load)
  const watcher = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-visible"); watcher.unobserve(e.target); }
  }, { rootMargin: "0px 0px -10% 0px" });
  list.querySelectorAll(".reveal").forEach((n) => watcher.observe(n));
})();
