/* =========================================================
   ΣΠΙΤΙ (SPITI) · script
   ---------------------------------------------------------
   1. Helpers and saved progress
   2. Greek: speech, matching answers, the keyboard
   3. The rooms (real photographs)
   4. Rooms and hotspots
   5. The card: Explore, Easy, Hard
   6. Points and the money tree
   7. Start
   ========================================================= */
(() => {
  "use strict";

  const V = window.SPITI;
  const $ = (id) => document.getElementById(id);
  const vl = $("vl"), stage = $("stage"), roomEl = $("room"), hotsEl = $("hotspots");
  const card = $("card"), cardBody = $("card-body");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------------------------------------------------
     1. SAVED PROGRESS (this browser only)
     dollars: lifetime total. paid: which objects have paid out
     in each mode. hardRight: correct Hard answers per object.
     --------------------------------------------------------- */
  const KEY = "spiti-v1";
  const blank = () => ({ dollars: 0, paid: { easy: {}, hard: {} }, hardRight: {}, sound: true });
  let save = blank();
  try { save = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { /* private mode */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* keeps working this visit */ } };
  let sessionDollars = 0;
  let mode = "easy";
  let roomIndex = 0;
  const room = () => V.rooms[roomIndex];
  const learned = (id) => (save.hardRight[id] || 0) >= 2;

  /* ---------------------------------------------------------
     2. GREEK
     --------------------------------------------------------- */
  // Speech: the browser's own voices, Greek if there is one
  let greekVoice = null;
  const pickVoice = () => {
    const vs = speechSynthesis.getVoices();
    greekVoice = vs.find((v) => /^el(-|_|$)/i.test(v.lang) && /enhanced|premium/i.test(v.name))
      || vs.find((v) => /^el(-|_|$)/i.test(v.lang)) || null;
  };
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.addEventListener("voiceschanged", pickVoice); }
  function say(text) {
    if (!save.sound || !("speechSynthesis" in window)) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "el-GR"; u.rate = 0.85;
    if (greekVoice) u.voice = greekVoice;
    speechSynthesis.speak(u);
    return !!greekVoice;
  }

  // A cash-register "ka-ching" for a right answer, synthesised (no audio file)
  let actx = null;
  function cash() {
    if (!save.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime;
      const out = actx.createGain(); out.gain.value = 0.35; out.connect(actx.destination);
      // the drawer: a short noisy thunk
      const buf = actx.createBuffer(1, actx.sampleRate * 0.12, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const n = actx.createBufferSource(); n.buffer = buf;
      const nf = actx.createBiquadFilter(); nf.type = "lowpass"; nf.frequency.value = 900;
      n.connect(nf).connect(out); n.start(t);
      // the bell: two bright metallic chimes
      [[2093, 0.06], [2637, 0.16]].forEach(([f, at]) => {
        [1, 2.76, 5.4].forEach((m, k) => {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = "sine"; o.frequency.value = f * m;
          g.gain.setValueAtTime(0, t + at); g.gain.linearRampToValueAtTime(0.5 / (k + 1), t + at + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.9 / (k + 1));
          o.connect(g).connect(out); o.start(t + at); o.stop(t + at + 1);
        });
      });
    } catch (e) { /* no audio here: fine */ }
  }

  // Matching typed answers: accents, the article and final sigma don't matter
  const plain = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ς/g, "σ").replace(/\s+/g, " ").trim();
  const noArticle = (s) => s.replace(/^(ο|η|το|οι|τα)\s+/, "");
  const splitWord = (el) => { const m = el.match(/^(ο|η|το)\s+(.*)$/); return m ? { art: m[1], noun: m[2] } : { art: "", noun: el }; };

  // The on-screen keyboard (Greek layout), with a tonos key for accents
  const ROWS = ["ςερτυθιοπ", "ασδφγηξκλ", "ζχψωβνμ"];
  const TONOS = { α: "ά", ε: "έ", η: "ή", ι: "ί", ο: "ό", υ: "ύ", ω: "ώ" };
  const keyboard = () => `<div class="vl-kb" aria-label="Greek keyboard">
    ${ROWS.map((r, i) => `<div class="vl-kb-row">${i === 2 ? '<button type="button" class="vl-key vl-key--wide vl-key--tonos" data-key="tonos" aria-label="Add accent (tonos)">΄ tonos</button>' : ""}${[...r].map((c) => `<button type="button" class="vl-key" data-key="${c}">${c}</button>`).join("")}${i === 2 ? '<button type="button" class="vl-key vl-key--wide" data-key="back" aria-label="Delete">⌫</button>' : ""}</div>`).join("")}
    <div class="vl-kb-row"><button type="button" class="vl-key vl-key--wide" data-key="space" style="max-width:200px">space</button></div>
  </div>`;

  /* ---------------------------------------------------------
     3. THE ROOMS: real photographs
     Each room is a photo cropped to 16:10; the clickable boxes in
     data.js are % of it. The next room's photo loads in advance.
     --------------------------------------------------------- */
  const photoHTML = (r) => `<img src="${esc(r.photo.src)}" alt="" decoding="async" draggable="false">`;
  function preload(i) { const r = V.rooms[i]; if (r) { const im = new Image(); im.src = r.photo.src; } }
  function credit(r) {
    const p = r.photo;
    $("credit").innerHTML = `Photo: <a href="${esc(p.page)}" target="_blank" rel="noopener">${esc(p.author)}</a>, ${esc(p.date)}, <a href="${esc(p.licenceUrl)}" target="_blank" rel="noopener">${esc(p.licence)}</a>, cropped`;
  }

  /* ---------------------------------------------------------
     4. ROOMS AND HOTSPOTS
     --------------------------------------------------------- */
  function renderRoom() {
    const r = room();
    roomEl.innerHTML = photoHTML(r);
    credit(r);
    preload(roomIndex + 1);
    hotsEl.innerHTML = r.objects.map((o) => `<button type="button" class="vl-hot" data-id="${o.id}"
      style="left:${o.box.x}%;top:${o.box.y}%;width:${o.box.w}%;height:${o.box.h}%"
      aria-label="${esc(o.en)}"></button>`).join("");
    $("room-name").innerHTML = `${esc(r.el)}<small>${esc(r.en)}</small>`;
    const total = V.rooms.length + V.comingSoon.length;
    document.querySelector('[data-go="-1"]').disabled = roomIndex === 0;
    document.querySelector('[data-go="1"]').disabled = roomIndex >= V.rooms.length - 1;
    document.querySelector('[data-go="1"]').title = roomIndex >= V.rooms.length - 1 && V.comingSoon.length ? `Next: ${V.comingSoon[0].en} (coming soon)` : "";
    marks();
  }
  function marks() {
    hotsEl.querySelectorAll(".vl-hot").forEach((b) => {
      const id = b.dataset.id;
      b.classList.toggle("is-learned", learned(id));
      b.classList.toggle("is-paid", !learned(id) && mode !== "explore" && !!save.paid[mode][id]);
    });
  }
  function goRoom(step) {
    const next = roomIndex + step;
    if (next < 0 || next >= V.rooms.length) return;
    closeCard();
    stage.classList.add("is-fading");
    setTimeout(() => { roomIndex = next; renderRoom(); stage.classList.remove("is-fading"); }, reduced.matches ? 0 : 600);
  }

  let hintTimer = 0;
  function hint(text) {
    const h = $("hint");
    h.textContent = text; h.classList.add("is-on");
    clearTimeout(hintTimer); hintTimer = setTimeout(() => h.classList.remove("is-on"), 3200);
  }

  /* ---------------------------------------------------------
     5. THE CARD
     --------------------------------------------------------- */
  let current = null, lastHot = null, tries = 0;
  const wordHTML = (o) => { const { art, noun } = splitWord(o.el); return `<span class="vl-art">${esc(art)}</span> ${esc(noun)}`; };
  const genderTag = (g) => `<span class="vl-gender vl-gender--${g}">${{ m: "masculine", f: "feminine", n: "neuter" }[g]}</span>`;
  const reveal = (o) => `
    <p class="vl-word" id="card-title" lang="el">${wordHTML(o)}</p>
    <p class="vl-tr">${esc(o.tr)}</p>
    <p class="vl-en">${esc(o.en)}${genderTag(o.gender)}</p>
    <p class="vl-note">${esc(o.note)}</p>
    <button type="button" class="vl-play" data-say>▶ Hear it</button>`;

  function place(btn) {
    if (matchMedia("(max-width: 640px)").matches) { card.style.left = ""; card.style.top = ""; return; }
    const r = btn.getBoundingClientRect(), cw = card.offsetWidth, ch = card.offsetHeight;
    let x = r.right + 14, y = r.top + r.height / 2 - ch / 2;
    if (x + cw > innerWidth - 12) x = r.left - cw - 14;
    if (x < 12) x = Math.min(innerWidth - cw - 12, Math.max(12, r.left + r.width / 2 - cw / 2));
    y = Math.min(innerHeight - ch - 12, Math.max(64, y));
    card.style.left = `${x}px`; card.style.top = `${y}px`;
  }
  function openCard(o, btn) {
    current = o; lastHot = btn; tries = 0;
    hotsEl.querySelectorAll(".vl-hot").forEach((b) => b.classList.toggle("is-active", b === btn));
    if (mode === "explore") {
      cardBody.innerHTML = reveal(o);
      card.hidden = false; place(btn);
      return;
    }
    if (mode === "easy") {
      const opts = shuffle([o, ...distractors(o)]);
      cardBody.innerHTML = `<p class="vl-q">Which is it?</p><p class="vl-q-en" id="card-title">${esc(o.en)}</p>
        <div class="vl-opts">${opts.map((x) => `<button type="button" class="vl-opt" lang="el" data-pick="${x.id}">${esc(x.el)}</button>`).join("")}</div>
        <p class="vl-feedback" aria-live="polite"></p>`;
    } else {
      cardBody.innerHTML = `<p class="vl-q">Type it in Greek</p><p class="vl-q-en" id="card-title">${esc(o.en)}</p>
        <form class="vl-type" data-form><input class="vl-input" lang="el" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer in Greek" placeholder="…"><button class="vl-btn" type="submit">Check</button></form>
        ${keyboard()}
        <p class="vl-feedback" aria-live="polite"></p>`;
    }
    card.hidden = false; place(btn);
    const first = card.querySelector(".vl-opt, .vl-input");
    if (first && !matchMedia("(pointer: coarse)").matches) first.focus();
  }
  function closeCard() {
    card.hidden = true; current = null;
    hotsEl.querySelectorAll(".vl-hot").forEach((b) => b.classList.remove("is-active"));
    if (lastHot) lastHot.focus({ preventScroll: true });
  }
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // Wrong options: same room, same gender first, then similar-looking words
  function distractors(o) {
    const pool = room().objects.filter((x) => x.id !== o.id);
    const n = plain(noArticle(o.el));
    const score = (x) => (x.gender === o.gender ? 0 : 10) + Math.abs(plain(noArticle(x.el)).length - n.length) + (plain(noArticle(x.el))[0] === n[0] ? -3 : 0) + Math.random() * 4;
    return pool.sort((a, b) => score(a) - score(b)).slice(0, 3);
  }

  function award(o) {
    if (save.paid[mode][o.id]) return false;
    save.paid[mode][o.id] = true;
    save.dollars += 10; sessionDollars += 10;
    persist(); showScore(true); marks();
    if (tourDone()) setTimeout(openTree, 1400);
    return true;
  }
  function answerEasy(btn) {
    const o = current, right = btn.dataset.pick === o.id;
    const fb = card.querySelector(".vl-feedback");
    btn.classList.add(right ? "is-right" : "is-wrong");
    if (right) {
      card.querySelectorAll(".vl-opt").forEach((b) => (b.disabled = true));
      const paid = award(o);
      fb.className = "vl-feedback is-good";
      fb.innerHTML = `${paid ? "+$10 · " : "Already counted · "}<b lang="el">${esc(o.el)}</b> <i>${esc(o.tr)}</i>`;
      cash();
      setTimeout(() => { if (current === o) { cardBody.innerHTML = reveal(o) + `<p class="vl-feedback is-good">${paid ? "+$10" : ""}</p>`; place(lastHot); } }, 1100);
    } else {
      btn.disabled = true;
      fb.className = "vl-feedback is-bad"; fb.textContent = "Not quite. Try again.";
    }
  }
  function answerHard(text) {
    const o = current, fb = card.querySelector(".vl-feedback");
    const given = plain(noArticle(plain(text))), want = plain(noArticle(o.el));
    if (!given) return;
    if (given === want) {
      save.hardRight[o.id] = (save.hardRight[o.id] || 0) + 1;
      const paid = award(o);
      const exact = text.trim() === o.el;
      fb.className = "vl-feedback is-good";
      fb.innerHTML = `${paid ? "+$10 · " : ""}${exact ? "Perfect." : "Right! Fully written:"} <b lang="el">${esc(o.el)}</b>${learned(o.id) ? " · ★ learned" : ""}`;
      persist(); marks(); cash();
      card.querySelector("[data-form]").remove(); card.querySelector(".vl-kb").remove();
      cardBody.insertAdjacentHTML("beforeend", `<p class="vl-tr">${esc(o.tr)} · ${esc(o.note)}</p>`);
      place(lastHot);
    } else {
      tries += 1;
      if (tries >= 2) {
        fb.className = "vl-feedback is-bad";
        fb.innerHTML = `The answer is <b lang="el">${esc(o.el)}</b> <i>(${esc(o.tr)})</i>. It'll come back.`;
        card.querySelector("[data-form]").remove(); card.querySelector(".vl-kb").remove();
        cardBody.insertAdjacentHTML("beforeend", '<button type="button" class="vl-play" data-say>▶ Hear it</button>');
        place(lastHot);
      } else {
        fb.className = "vl-feedback is-bad"; fb.textContent = "Not quite. One more try.";
      }
    }
  }

  /* ---------------------------------------------------------
     6. POINTS AND THE MONEY TREE
     --------------------------------------------------------- */
  const money = (n) => "$" + n.toLocaleString("en-US");
  function showScore(bump) {
    const s = $("score");
    s.textContent = money(save.dollars);
    if (bump && !reduced.matches) { s.classList.remove("is-bump"); void s.offsetWidth; s.classList.add("is-bump"); }
  }
  const tourDone = () => mode !== "explore" && V.rooms.every((r) => r.objects.every((o) => save.paid[mode][o.id]));

  function treeSVG(lifetime, session) {
    // Bigger lifetime total, grander tree
    const g = Math.min(1, 0.45 + Math.sqrt(lifetime / 3000) * 0.55);
    const W = 600, base = 470, h = 300 * g;
    const branches = [];
    const grow = (x, y, ang, len, depth, delay) => {
      if (depth === 0 || len < 14) return;
      const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      branches.push({ x, y, x2, y2, w: depth * 2.6 * g + 1.5, delay, len });
      grow(x2, y2, ang - 0.42 - Math.random() * 0.15, len * 0.74, depth - 1, delay + 0.35);
      grow(x2, y2, ang + 0.38 + Math.random() * 0.15, len * 0.72, depth - 1, delay + 0.35);
    };
    let seed = 11; const rnd = Math.random; Math.random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    grow(W / 2, base, -Math.PI / 2, h * 0.38, Math.round(4 + g * 2), 0);
    const tips = branches.filter((b) => b.len < h * 0.2);
    const leaves = Math.min(160, Math.round(lifetime / 10)), fresh = Math.min(leaves, Math.round(session / 10));
    const notes = [];
    for (let i = 0; i < leaves; i++) {
      const t = tips[i % tips.length], k = Math.random();
      notes.push({ x: t.x + (t.x2 - t.x) * k + (Math.random() - 0.5) * 34, y: t.y + (t.y2 - t.y) * k + (Math.random() - 0.5) * 30, r: (Math.random() - 0.5) * 70, isNew: i >= leaves - fresh });
    }
    Math.random = rnd;
    const coins = Math.min(12, Math.max(1, Math.round(lifetime / 250)));
    const tEnd = (Math.max(...branches.map((b) => b.delay)) || 0) + 1;
    return `<ellipse cx="300" cy="${base + 8}" rx="${150 * g + 40}" ry="16" fill="#8A6A44" opacity="0.35"/>
      <path d="M${300 - 120 * g - 30} ${base + 6} q ${120 * g + 30} -26 ${2 * (120 * g + 30)} 0" fill="#7D8E6A" opacity="0.6"/>
      ${branches.map((b) => `<path class="tr-trunk tr-grow" d="M${b.x.toFixed(1)} ${b.y.toFixed(1)} L ${b.x2.toFixed(1)} ${b.y2.toFixed(1)}" stroke-width="${b.w.toFixed(1)}" style="--len:${Math.ceil(b.len)};--delay:${b.delay}s;--dur:0.5s"/>`).join("")}
      ${notes.map((n, i) => `<g class="tr-leaf tr-note${n.isNew ? " is-new" : ""}" style="--delay:${(n.isNew ? tEnd + 0.4 + (i - (leaves - fresh)) * 0.12 : tEnd * (i / Math.max(1, leaves))).toFixed(2)}s;--r:${n.r.toFixed(0)}deg" transform="translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})"><rect x="-13" y="-7" width="26" height="14" rx="2"/><text>$</text></g>`).join("")}
      ${Array.from({ length: coins }, (_, i) => `<g class="tr-leaf tr-coin" style="--delay:${(tEnd + 0.2 + i * 0.08).toFixed(2)}s;--r:0deg" transform="translate(${300 + (i - coins / 2) * 22 + 11} ${base + 2 - (i % 2) * 8})"><circle r="10"/><text>$</text></g>`).join("")}`;
  }
  function countUp(el, to) {
    if (reduced.matches) { el.textContent = money(to); return; }
    const t0 = performance.now(), dur = 1800;
    const step = (now) => { const k = Math.min(1, (now - t0) / dur); el.textContent = money(Math.round(to * (1 - Math.pow(1 - k, 3)) / 10) * 10); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function openTree() {
    closeCard();
    $("tree-svg").innerHTML = treeSVG(save.dollars, sessionDollars);
    $("tree").showModal();
    countUp($("tree-session"), sessionDollars); countUp($("tree-life"), save.dollars);
  }
  // A share card for the group chat: a PNG drawn on a canvas
  function shareCard() {
    const c = document.createElement("canvas"); c.width = 1080; c.height = 1350;
    const x = c.getContext("2d");
    const grd = x.createLinearGradient(0, 0, 0, 1350); grd.addColorStop(0, "#FBF4E6"); grd.addColorStop(1, "#EBD8B0");
    x.fillStyle = grd; x.fillRect(0, 0, 1080, 1350);
    const img = new Image();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 520"><style>.tr-trunk{fill:none;stroke:#6B4A2E;stroke-linecap:round}.tr-note rect{fill:#8DB97A;stroke:#4E7A3E}.tr-note text,.tr-coin text{font:700 9px sans-serif;fill:#2F5223;text-anchor:middle;dominant-baseline:central}.tr-coin circle{fill:#E3B94E;stroke:#A67C22}</style>${treeSVG(save.dollars, 0)}</svg>`;
    img.onload = () => {
      x.drawImage(img, 90, 230, 900, 780);
      x.fillStyle = "#B4583A"; x.font = "600 34px Inter, sans-serif"; x.textAlign = "center";
      x.fillText("ΣΠΙΤΙ · SPÍTI · HOME", 540, 120);
      x.fillStyle = "#2A1E16"; x.font = "600 84px 'Cormorant Garamond', Georgia, serif";
      x.fillText("My money tree", 540, 200);
      x.font = "600 120px 'Cormorant Garamond', Georgia, serif"; x.fillText(money(save.dollars), 540, 1130);
      x.font = "500 34px Inter, sans-serif"; x.fillStyle = "rgba(42,30,22,0.7)";
      x.fillText(`+${money(sessionDollars)} this tour · learning Greek, room by room`, 540, 1200);
      x.font = "500 26px Inter, sans-serif"; x.fillText("Play money, obviously.", 540, 1270);
      c.toBlob(async (blob) => {
        const file = new File([blob], "spiti-money-tree.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], title: "My Spíti money tree" }); return; } catch (e) { /* cancelled */ }
        }
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "spiti-money-tree.png" });
        a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }, "image/png");
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ---------------------------------------------------------
     7. START: wiring
     --------------------------------------------------------- */
  hotsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".vl-hot"); if (!b) return;
    const o = room().objects.find((x) => x.id === b.dataset.id);
    if (current === o) { closeCard(); return; }
    openCard(o, b);
  });
  // Explore on a mouse: hovering shows the word too
  hotsEl.addEventListener("pointerover", (e) => {
    if (mode !== "explore" || e.pointerType !== "mouse") return;
    const b = e.target.closest(".vl-hot"); if (!b) return;
    const o = room().objects.find((x) => x.id === b.dataset.id);
    if (current !== o) { cardBody.innerHTML = reveal(o); current = o; lastHot = b; card.hidden = false; place(b); hotsEl.querySelectorAll(".vl-hot").forEach((x) => x.classList.toggle("is-active", x === b)); }
  });
  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) { closeCard(); return; }
    if (e.target.closest("[data-say]") && current) { if (!save.sound) hint("Sound is off: turn it on with ♪."); say(current.el); return; }
    const pick = e.target.closest("[data-pick]"); if (pick) { answerEasy(pick); return; }
    const k = e.target.closest("[data-key]");
    if (k) {
      const inp = card.querySelector(".vl-input"); if (!inp) return;
      const v = inp.value;
      if (k.dataset.key === "back") inp.value = v.slice(0, -1);
      else if (k.dataset.key === "space") inp.value = v + " ";
      else if (k.dataset.key === "tonos") { const last = v.slice(-1); if (TONOS[last]) inp.value = v.slice(0, -1) + TONOS[last]; }
      else inp.value = v + k.dataset.key;
    }
  });
  card.addEventListener("submit", (e) => { e.preventDefault(); const inp = card.querySelector(".vl-input"); if (inp) answerHard(inp.value); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !card.hidden) closeCard();
    if (card.hidden && !$("tree").open && (e.key === "ArrowRight" || e.key === "ArrowLeft") && !e.target.closest("input")) goRoom(e.key === "ArrowRight" ? 1 : -1);
  });
  document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => {
    if (b.disabled) return; goRoom(Number(b.dataset.go));
  }));
  document.querySelector('[data-go="1"]').addEventListener("pointerdown", (e) => {
    if (e.currentTarget.disabled && V.comingSoon.length) hint(`${V.comingSoon[0].el} · ${V.comingSoon[0].en}: coming soon`);
  });
  document.querySelectorAll(".vl-modes button").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll(".vl-modes button").forEach((x) => x.setAttribute("aria-checked", x === b));
    vl.classList.toggle("is-quiz", mode !== "explore");
    $("end").hidden = mode === "explore";
    closeCard(); marks();
    hint({ explore: "Tap anything to learn its name.", easy: "Tap an object, then pick its Greek name. $10 each.", hard: "Tap an object and type its name. $10 each." }[mode]);
  }));
  $("sound").addEventListener("click", () => {
    save.sound = !save.sound; persist();
    $("sound").setAttribute("aria-pressed", save.sound); $("sound").setAttribute("aria-label", save.sound ? "Sound on" : "Sound off");
    if (!save.sound && "speechSynthesis" in window) speechSynthesis.cancel();
  });
  $("end").addEventListener("click", openTree);
  $("again").addEventListener("click", () => { $("tree").close(); sessionDollars = 0; });
  $("share").addEventListener("click", shareCard);
  $("reset").addEventListener("click", () => {
    if (!confirm("Reset your money and progress? This can't be undone.")) return;
    save = blank(); sessionDollars = 0; persist(); showScore(); marks(); $("tree").close();
  });
  addEventListener("resize", () => { if (!card.hidden && lastHot) place(lastHot); });

  // Start in the middle of a wide room on a tall phone
  $("sound").setAttribute("aria-pressed", save.sound);
  $("house").innerHTML = `<a href="${esc(V.house.source.url)}" target="_blank" rel="noopener">${esc(V.house.name)}</a>`;
  $("house").title = V.house.about;
  renderRoom(); showScore();
  const vp = $("viewport"); vp.scrollLeft = (vp.scrollWidth - vp.clientWidth) / 2;
  setTimeout(() => hint("Tap an object, then pick its Greek name. $10 each."), 600);
})();
