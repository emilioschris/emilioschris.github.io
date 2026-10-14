/* =========================================================
   FIELD NOTES · shared script
   ---------------------------------------------------------
   Load at the end of <body>, before the page's own script.js:
     <script src="shared/field-notes.js"></script>

   It sets up, on any page that has them:
   1. The Day/Dusk switch (#theme-toggle)
   2. Hawk blinks (.hawk with an eyelid)
   3. Dotted trails between cards (.cards with an svg.trail)
   4. Gentle reveal on scroll (.reveal)
   5. The current year (#year)

   And offers helpers for page scripts, on window.FieldNotes:
     FieldNotes.reducedMotion   true/false check: .matches
     FieldNotes.motion(ms)      ms, or 0 when reduced motion is on
     FieldNotes.isDusk()        is Dusk showing right now?
     FieldNotes.panel(el, { onClose })   open/close a slide-in panel
     FieldNotes.drawTrails()    redraw every trail
   Pages can listen for "fieldnotes:themechange" on document.
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = matchMedia("(prefers-color-scheme: dark)");
  const motion = (ms) => (reducedMotion.matches ? 0 : ms);

  /* ---------------------------------------------------------
     1. DAY / DUSK SWITCH
     Remembers the choice (if the browser allows storage) and
     follows the device's own setting until a choice is made.
     --------------------------------------------------------- */
  const themeButton = document.getElementById("theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function isDusk() {
    const chosen = root.dataset.theme;
    return chosen ? chosen === "dusk" : prefersDark.matches;
  }

  function syncTheme() {
    if (themeButton) themeButton.setAttribute("aria-checked", String(isDusk()));
    if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
    document.dispatchEvent(new CustomEvent("fieldnotes:themechange", { detail: { dusk: isDusk() } }));
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const next = isDusk() ? "day" : "dusk";
      root.dataset.theme = next;
      try { localStorage.setItem("fieldnotes-theme", next); } catch (e) {}
      syncTheme();
    });
  }
  prefersDark.addEventListener("change", syncTheme);

  /* ---------------------------------------------------------
     2. HAWK BLINK
     Each hawk blinks on its own, every 6–10 seconds.
     Skipped entirely when reduced motion is on.
     --------------------------------------------------------- */
  document.querySelectorAll(".hawk").forEach((hawk) => {
    hawk.addEventListener("animationend", () => hawk.classList.remove("is-blinking"));
    const scheduleBlink = () => {
      setTimeout(() => {
        if (!reducedMotion.matches && !document.hidden) hawk.classList.add("is-blinking");
        scheduleBlink();
      }, 6000 + Math.random() * 4000);
    };
    scheduleBlink();
  });

  /* ---------------------------------------------------------
     3. TRAILS BETWEEN CARDS
     Finds the little pin above each card and joins them with
     a dotted curve. The last card's trail heads off the edge,
     because the route continues. Redrawn whenever sizes change.
     --------------------------------------------------------- */
  function drawTrail(cards) {
    const path = cards.querySelector(".trail path");
    if (!path) return;
    const box = cards.getBoundingClientRect();
    const pts = [...cards.querySelectorAll(".card-pin")].map((pin) => {
      const r = pin.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    if (!pts.length) return;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    const join = (a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        // Side by side: arc up above the card, then drop down through the gap
        const top = Math.min(a.y, b.y) - 48;
        d += ` C ${a.x + dx * 0.55} ${top - 20}, ${b.x - 4} ${top}, ${b.x} ${b.y}`;
      } else {
        // Stacked (phones): wander down the left margin
        d += ` C ${a.x - 14} ${a.y + dy * 0.4}, ${b.x - 14} ${b.y - dy * 0.4}, ${b.x} ${b.y}`;
      }
    };
    for (let i = 1; i < pts.length; i++) join(pts[i - 1], pts[i]);

    // The route continues past the last card
    const last = pts[pts.length - 1];
    const stacked = box.width < 500;
    const end = stacked
      ? { x: last.x - 6, y: box.height + 40 }
      : { x: Math.max(box.width + 24, last.x + 200), y: last.y - 40 };
    if (stacked) join(last, end);
    else d += ` C ${last.x + 60} ${last.y - 50}, ${end.x - 80} ${end.y - 30}, ${end.x} ${end.y}`;
    path.setAttribute("d", d);
  }

  const drawTrails = () => document.querySelectorAll(".cards").forEach(drawTrail);
  const trailWatcher = new ResizeObserver((entries) => entries.forEach((e) => drawTrail(e.target)));
  document.querySelectorAll(".cards").forEach((cards) => trailWatcher.observe(cards));
  if (document.fonts) document.fonts.ready.then(drawTrails);

  /* ---------------------------------------------------------
     4. GENTLE REVEAL ON SCROLL
     Elements with class="reveal" fade up once as they arrive.
     --------------------------------------------------------- */
  const revealer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

  /* ---------------------------------------------------------
     5. CURRENT YEAR (for the © line)
     --------------------------------------------------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     SLIDE-IN PANEL HELPER
     const sheet = FieldNotes.panel(document.getElementById("panel"), { onClose() {…} });
     sheet.open(buttonThatOpenedIt);  sheet.close();
     Esc closes it, and focus goes back to where you were.
     --------------------------------------------------------- */
  function panel(el, { onClose } = {}) {
    const closeButton = el.querySelector(".panel-close");
    const scroller = el.querySelector(".panel-scroll");
    let lastFocus = null;

    function open(opener) {
      lastFocus = opener || document.activeElement;
      el.hidden = false;
      el.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => el.classList.add("is-open"));
      if (closeButton) closeButton.focus({ preventScroll: true });
      if (scroller) scroller.scrollTop = 0;
    }

    function close() {
      if (el.hidden) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
      setTimeout(() => { if (!el.classList.contains("is-open")) el.hidden = true; }, motion(560));
      if (onClose) onClose();
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    }

    if (closeButton) closeButton.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    return { open, close };
  }

  window.FieldNotes = { reducedMotion, motion, isDusk, panel, drawTrails };

  syncTheme();
})();
