/* =========================================================
   THE DEEP END · script
   ---------------------------------------------------------
   1. Answers: reading data.js, matching what people type
   2. Rarity: world tier, adjusted by friend counts (survey)
   3. Saved games (localStorage, always inside try/catch)
   4. Sound (Web Audio, made on the fly, no files)
   5. The water: colour by depth, bubbles, the depth gauge
   6. The Daily Dive
   ========================================================= */
(() => {
  "use strict";

  const D = window.DEEP;
  const $ = (id) => document.getElementById(id);
  const reduced = () => (window.FieldNotes ? FieldNotes.reducedMotion.matches : false);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const DAILY_COUNT = 7;
  const ROUND_MS = 25000;
  const WRONG_MS = 3000;
  const MAX_DAILY_DEPTH = DAILY_COUNT * 100 * D.depthPerPoint;

  /* ---------------------------------------------------------
     1. ANSWERS
     Every answer and alias is turned into a "key": lower case,
     no accents or punctuation, no leading "the", and each word
     made singular. What people type goes through the same steps.
     --------------------------------------------------------- */
  function normalise(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/ß/g, "ss")
      .replace(/&/g, " and ")
      .replace(/['’`.]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/^(the|a|an) /, "");
  }
  const singular = (w) => {
    if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
    if (w.length > 4 && /(ss|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) return w.slice(0, -1);
    return w;
  };
  const keyOf = (s) => normalise(s).split(" ").map(singular).join(" ");
  const stripSequel = (k) => k.replace(/ (part )?(\d+|ii|iii|iv|v)$/, "").trim();

  // Build each prompt's answer list and lookup table
  const PROMPTS = D.prompts.map((p) => {
    const answers = [];
    const index = new Map();      // key → { answer, rank } (lower rank wins a clash)
    const add = (key, answer, rank) => {
      if (!key) return;
      const had = index.get(key);
      if (!had || rank < had.rank) index.set(key, { answer, rank });
      else if (had.answer !== answer && rank === had.rank && rank > 0) index.set(key, { answer: null, rank });   // ambiguous
      const compact = key.replace(/ /g, "");
      if (compact !== key && !index.has(compact)) index.set(compact, { answer, rank: rank + 1 });
    };
    const read = (entry, tier) => {
      const names = entry.split("|").map((n) => n.trim()).filter(Boolean);
      if (!names.length) return;
      const answer = { name: names[0], tier, names };
      answers.push(answer);
      names.forEach((n, i) => add(keyOf(n), answer, i === 0 ? 0 : 1));
      if (p.options?.surnames) {
        for (const n of names) {
          const words = keyOf(n).split(" ");
          if (words.length > 1 && words[words.length - 1].length > 3) add(words[words.length - 1], answer, 2);
        }
      }
    };
    p.tiers.forEach((list, tier) => list.split(";").forEach((e) => read(e, tier)));
    read(p.wreck, 5);
    const nope = new Map();
    if (p.nope) p.nope.answers.split(";").forEach((e) => e.split("|").forEach((n) => nope.set(keyOf(n), e.split("|")[0].trim())));
    return { ...p, answers, index, nope, wreckAnswer: answers.find((a) => a.tier === 5) };
  });
  const byId = new Map(PROMPTS.map((p) => [p.id, p]));

  // Edit distance (with swapped letters counting as one), for typos
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      let rowMin = Infinity;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        rowMin = Math.min(rowMin, d[i][j]);
      }
      if (rowMin > max) return max + 1;
    }
    return d[a.length][b.length];
  }

  // What did they mean? Returns { answer } or { nope } or {}
  function match(prompt, typed) {
    let key = keyOf(typed);
    if (!key) return {};
    const tries = [key, key.replace(/ /g, "")];
    if (prompt.options?.sequels) tries.push(stripSequel(key));
    if (prompt.options?.suffix) {
      const words = key.split(" ");
      if (words.length > 2) tries.push(words.slice(-2).join(" "));
      if (words.length > 1) tries.push(words[words.length - 1]);
    }
    for (const k of tries) {
      const hit = prompt.index.get(k);
      if (hit && hit.answer) return { answer: hit.answer };
    }
    if (prompt.nope.has(key)) return { nope: prompt.nope.get(key) };

    // A small typo on a longer word, if it points at exactly one answer
    if (key.length >= 5) {
      const max = key.length >= 10 ? 2 : 1;
      let best = max + 1, found = null, clash = false;
      for (const [k, hit] of prompt.index) {
        if (!hit.answer) continue;
        const d = distance(key, k, max);
        if (d < best) { best = d; found = hit.answer; clash = false; }
        else if (d === best && hit.answer !== found) clash = true;
      }
      if (found && !clash && best <= max) return { answer: found, typo: true };
    }
    return {};
  }

  /* ---------------------------------------------------------
     2. RARITY
     World tier from data.js. Once the friend survey is in
     (survey.js), answers friends gave move toward the Surface:
       nobody gave it            stays where it is
       1 friend, or under 10%    down 1 tier
       10% to under 25%          down 2 tiers
       25% or more               Surface
     The Wreck only stays the Wreck if no friend gave it.
     --------------------------------------------------------- */
  function tierOf(prompt, answer) {
    const s = D.survey && D.survey.prompts && D.survey.prompts[prompt.id];
    if (!s || !s.respondents) return answer.tier;
    const count = (s.counts && s.counts[answer.name]) || 0;
    if (!count) return answer.tier;
    const share = count / s.respondents;
    if (share >= 0.25) return 0;
    const base = answer.tier === 5 ? 4 : answer.tier;   // a Wreck a friend found isn't hidden any more
    return Math.max(0, base - (share >= 0.1 ? 2 : 1));
  }
  const tierInfo = (t) => D.tiers[t];
  const depthOf = (t) => (t >= 0 ? tierInfo(t).points * D.depthPerPoint : 0);

  /* ---------------------------------------------------------
     3. SAVED GAMES
     --------------------------------------------------------- */
  const KEY = "fieldnotes-deepend-v1";
  const SOUND_KEY = "fieldnotes-deepend-sound";
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && typeof raw === "object") return { days: raw.days || {}, endlessBest: raw.endlessBest || 0 };
    } catch (e) { /* storage blocked */ }
    return { days: {}, endlessBest: 0 };
  }
  let saved = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* private window: keep it for this visit */ }
  }

  /* ---------------------------------------------------------
     4. SOUND
     Nothing plays until the first tap or key press (browsers
     require that), and the mute choice is remembered.
     --------------------------------------------------------- */
  const Sound = (() => {
    let ctx = null, master = null, hum = null;
    let muted = false;
    try { muted = localStorage.getItem(SOUND_KEY) === "off"; } catch (e) { /* default on */ }

    function wake() {
      if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.7;
      master.connect(ctx.destination);
    }
    function tone({ freq, to = freq, dur = 0.3, type = "sine", gain = 0.2, at = 0, attack = 0.01 }) {
      if (!ctx || muted) return;
      const t = ctx.currentTime + at;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    function noise({ dur = 0.2, gain = 0.2, cutoff = 400, at = 0 }) {
      if (!ctx || muted) return;
      const t = ctx.currentTime + at;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf;
      f.type = "lowpass";
      f.frequency.value = cutoff;
      g.gain.value = gain;
      src.connect(f).connect(g).connect(master);
      src.start(t);
    }
    return {
      wake,
      get muted() { return muted; },
      setMuted(m) {
        muted = m;
        try { localStorage.setItem(SOUND_KEY, m ? "off" : "on"); } catch (e) { /* not saved */ }
        if (master) master.gain.setTargetAtTime(m ? 0 : 0.7, ctx.currentTime, 0.05);
      },
      // A sonar ping, with a quieter echo
      ping() {
        tone({ freq: 1320, to: 1250, dur: 0.9, gain: 0.16 });
        tone({ freq: 1320, to: 1250, dur: 0.7, gain: 0.05, at: 0.42 });
      },
      // A soft bubble: deeper tiers sound lower
      bubble(tier) {
        const base = [900, 760, 620, 500, 400, 320][tier] || 600;
        tone({ freq: base, to: base * 1.7, dur: 0.16, gain: 0.22, attack: 0.005 });
        tone({ freq: base * 0.8, to: base * 1.5, dur: 0.14, gain: 0.14, at: 0.12, attack: 0.005 });
        if (tier >= 4) tone({ freq: base * 0.5, to: base * 0.48, dur: 1.2, gain: 0.12, at: 0.05 });
      },
      // A dull thud
      thud() {
        tone({ freq: 110, to: 48, dur: 0.28, gain: 0.35, type: "sine" });
        noise({ dur: 0.12, gain: 0.25, cutoff: 280 });
      },
      // A low hum that sinks as you go deeper (0 = surface, 1 = deepest)
      hum(depth) {
        if (!ctx || muted) { this.humOff(); return; }
        if (!hum) {
          const o = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
          o.type = "sawtooth"; o2.type = "sine";
          f.type = "lowpass"; f.Q.value = 0.7;
          g.gain.value = 0.0001;
          o.connect(f); o2.connect(f); f.connect(g).connect(master);
          o.start(); o2.start();
          hum = { o, o2, f, g };
        }
        const t = ctx.currentTime;
        hum.o.frequency.setTargetAtTime(62 - 26 * depth, t, 1.5);
        hum.o2.frequency.setTargetAtTime(31 - 13 * depth, t, 1.5);
        hum.f.frequency.setTargetAtTime(240 - 140 * depth, t, 1.5);
        hum.g.gain.setTargetAtTime(0.035 + 0.03 * depth, t, 1.5);
      },
      humOff() {
        if (!hum || !ctx) return;
        hum.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.6);
      },
    };
  })();

  // Wake the sound on the first tap or key press
  const wakeOnce = () => { Sound.wake(); window.removeEventListener("pointerdown", wakeOnce); window.removeEventListener("keydown", wakeOnce); };
  window.addEventListener("pointerdown", wakeOnce);
  window.addEventListener("keydown", wakeOnce);

  const soundBtn = $("sound");
  function paintSound() {
    soundBtn.setAttribute("aria-pressed", String(!Sound.muted));
    soundBtn.querySelector(".sound-label").textContent = Sound.muted ? "Sound off" : "Sound on";
    soundBtn.classList.toggle("is-muted", Sound.muted);
  }
  soundBtn.addEventListener("click", () => { Sound.wake(); Sound.setMuted(!Sound.muted); paintSound(); if (!Sound.muted && diving) Sound.hum(depthNow / MAX_DAILY_DEPTH); });
  paintSound();

  /* ---------------------------------------------------------
     5. THE WATER
     The page colour follows your depth: bright turquoise at the
     surface, through the Aegean blue, to blue-black.
     --------------------------------------------------------- */
  const STOPS = [
    [0, [142, 219, 221]], [200, [63, 183, 194]], [600, [30, 134, 160]],
    [1200, [31, 78, 95]], [1900, [19, 47, 68]], [2800, [6, 13, 22]],
  ];
  function colourAt(m) {
    for (let i = 1; i < STOPS.length; i++) {
      const [m1, c1] = STOPS[i], [m0, c0] = STOPS[i - 1];
      if (m <= m1) {
        const t = (m - m0) / (m1 - m0);
        return c0.map((v, k) => Math.round(v + (c1[k] - v) * t));
      }
    }
    return STOPS[STOPS.length - 1][1];
  }
  const rgb = (c, a = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

  let depthNow = 0;
  function setDepth(m) {
    depthNow = m;
    const top = colourAt(Math.max(0, m - 250)), mid = colourAt(m), low = colourAt(m + 600);
    $("water").style.background = `radial-gradient(120% 70% at 50% -10%, ${rgb(top, 0.9)}, transparent 70%), linear-gradient(to bottom, ${rgb(mid)}, ${rgb(low)})`;
    document.body.classList.toggle("is-deep", m > 450);
    document.body.style.setProperty("--light", String(Math.max(0, 1 - m / 1400)));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = rgb(mid);
    // The gauge
    const scaleMax = Math.max(MAX_DAILY_DEPTH, Math.ceil(m / 400) * 400);
    $("gauge-marker").style.top = `${Math.min(100, (m / scaleMax) * 100)}%`;
    $("gauge-reading").textContent = `${m.toLocaleString("en-GB")} m`;
  }

  function drawScale() {
    let s = "";
    for (let m = 0; m <= MAX_DAILY_DEPTH; m += 200) {
      s += `<span class="tick${m % 400 === 0 ? " tick--major" : ""}" style="top:${(m / MAX_DAILY_DEPTH) * 100}%">${m % 400 === 0 ? `${m}` : ""}</span>`;
    }
    $("gauge-scale").innerHTML = s;
  }

  // Bubbles rising, a little faster near the surface. Stops when the
  // tab is hidden; with reduced motion only a few sit still.
  const canvas = $("bubbles"), g = canvas.getContext("2d");
  let bubbles = [], W = 0, H = 0, dpr = 1, lastT = 0;
  function sizeCanvas() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const n = Math.round(Math.min(46, (W * H) / 26000));
    bubbles = Array.from({ length: n }, () => newBubble(true));
  }
  function newBubble(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: 1 + Math.random() * 4.5, v: 12 + Math.random() * 30, w: Math.random() * Math.PI * 2 };
  }
  // A burst of bubbles on a right answer (more for deeper tiers)
  function burst(tier) {
    if (reduced()) return;
    const from = $("catch").getBoundingClientRect();
    const x0 = from.width ? from.left + from.width / 2 : W / 2, y0 = from.width ? from.top + 30 : H * 0.7;
    for (let i = 0; i < 8 + tier * 6; i++) {
      bubbles.push({ x: x0 + (Math.random() - 0.5) * 160, y: y0 + Math.random() * 40, r: 1.5 + Math.random() * 4, v: 60 + Math.random() * 90, w: Math.random() * 6, life: 1 });
    }
  }
  function drawBubbles(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
    lastT = t;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const alpha = document.body.classList.contains("is-deep") ? 0.32 : 0.5;
    bubbles = bubbles.filter((b) => b.life === undefined || (b.life > 0 && b.y > -10));
    for (const b of bubbles) {
      if (!reduced()) {
        b.y -= b.v * dt;
        b.w += dt * 1.6;
        if (b.life !== undefined) b.life -= dt * 0.55;
        else if (b.y < -10) Object.assign(b, newBubble(false));
      }
      const x = b.x + Math.sin(b.w) * 6;
      g.beginPath();
      g.arc(x, b.y, b.r, 0, Math.PI * 2);
      g.strokeStyle = `rgba(255, 255, 255, ${b.life === undefined ? alpha : Math.max(0, b.life) * 0.6})`;
      g.lineWidth = 1;
      g.stroke();
      g.beginPath();
      g.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
      g.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      g.fill();
    }
    if (!reduced() && !document.hidden) requestAnimationFrame(drawBubbles);
  }
  function startBubbles() { requestAnimationFrame((t) => { lastT = t; drawBubbles(t); }); }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) startBubbles(); });
  window.addEventListener("resize", () => { sizeCanvas(); if (reduced()) drawBubbles(lastT); });

  /* ---------------------------------------------------------
     6. THE DAILY DIVE
     The same seven prompts for everyone each UTC day: the prompt
     bank is shuffled once with a fixed seed, and each day takes
     the next seven. No server needed.
     --------------------------------------------------------- */
  function seeded(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const ORDER = (() => {
    const ids = PROMPTS.map((p) => p.id).sort();
    const r = seeded(20261014);
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    return ids;
  })();
  const utcDay = (t = Date.now()) => Math.floor(t / 864e5);
  const dayKey = (n) => new Date(n * 864e5).toISOString().slice(0, 10);
  const niceDay = (n) => new Date(n * 864e5).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  function promptsFor(n) {
    const start = (n * DAILY_COUNT) % ORDER.length;
    return Array.from({ length: DAILY_COUNT }, (_, i) => byId.get(ORDER[(start + i) % ORDER.length]));
  }

  // ---- Screens ----
  const screens = ["start", "play", "end"];
  function show(id) {
    screens.forEach((s) => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  // The tier legend
  $("tier-list").innerHTML = D.tiers.map((t, i) =>
    `<li class="tier-row tier-row--${i}"><span class="tier-emoji" aria-hidden="true">${t.emoji}</span><span class="tier-name">${t.name}</span><span class="tier-pts">${t.points} pts</span><span class="tier-m">${t.points * D.depthPerPoint} m</span></li>`).join("");

  // Countdown to the next dive (00:00 UTC)
  function untilNext() {
    const ms = (utcDay() + 1) * 864e5 - Date.now();
    const h = Math.floor(ms / 36e5), m = Math.floor((ms % 36e5) / 6e4), s = Math.floor((ms % 6e4) / 1e3);
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }
  setInterval(() => document.querySelectorAll("[data-countdown]").forEach((el) => { el.textContent = untilNext(); }), 1000);

  function renderStart() {
    const today = utcDay();
    const done = saved.days[dayKey(today)];
    if (done) {
      $("daily-card").innerHTML = `
        <p class="card-kicker">Daily Dive · ${niceDay(today)}</p>
        <p class="card-big">${done.depth.toLocaleString("en-GB")} m</p>
        <p class="card-line">You've already dived today. Deepest: ${done.deepest >= 0 ? tierInfo(done.deepest).name : "nothing caught"}.</p>
        <div class="card-actions">
          <button class="btn btn--solid" type="button" id="see-dive">See today's dive</button>
        </div>
        <p class="card-line card-next">Next dive in <span data-countdown>${untilNext()}</span></p>`;
      $("see-dive").addEventListener("click", () => renderEnd(done, today));
    } else {
      $("daily-card").innerHTML = `
        <p class="card-kicker">Daily Dive · ${niceDay(today)}</p>
        <p class="card-big">7 prompts</p>
        <p class="card-line">25 seconds each. The same seven for everyone today.</p>
        <div class="card-actions">
          <button class="btn btn--solid btn--big" type="button" id="dive">Dive in</button>
        </div>
        <p class="card-line card-next">New prompts in <span data-countdown>${untilNext()}</span></p>`;
      $("dive").addEventListener("click", startDaily);
    }
    setDepth(0);
    show("start");
  }

  // ---- A dive ----
  let diving = false;
  let run = null;   // { day, prompts, i, results, depth }
  let round = null; // { prompt, left, tried, done, raf }

  function startDaily() {
    Sound.wake();
    const today = utcDay();
    run = { day: today, prompts: promptsFor(today), i: 0, results: [], depth: 0 };
    diving = true;
    show("play");
    nextPrompt();
  }

  function nextPrompt() {
    const prompt = run.prompts[run.i];
    round = { prompt, left: ROUND_MS, tried: new Set(), done: false, last: performance.now() };
    $("play-count").textContent = `Prompt ${run.i + 1} of ${run.prompts.length}`;
    $("play-depth").textContent = `${run.depth.toLocaleString("en-GB")} m`;
    $("prompt").textContent = prompt.prompt;
    $("feedback").textContent = "";
    $("misses").innerHTML = "";
    $("catch").hidden = true;
    $("guess-form").hidden = false;
    $("guess").value = "";
    $("guess").focus({ preventScroll: true });
    Sound.ping();
    Sound.hum(run.depth / MAX_DAILY_DEPTH);
    paintAir();
    round.raf = requestAnimationFrame(tick);
    // A backup clock, in case animation frames are paused
    round.timer = setInterval(() => tick(performance.now()), 250);
  }

  function tick(now) {
    if (!round || round.done) return;
    const dt = Math.min(250, now - round.last);
    round.last = now;
    if (!document.hidden) round.left -= dt;
    paintAir();
    if (round.left <= 0) { finishRound(null); return; }
    cancelAnimationFrame(round.raf);
    round.raf = requestAnimationFrame(tick);
  }

  function paintAir() {
    const frac = Math.max(0, round.left / ROUND_MS);
    $("air-bar").style.transform = `scaleX(${frac})`;
    $("air-bar").classList.toggle("is-low", frac < 0.25);
    $("air-text").textContent = `${Math.max(0, Math.ceil(round.left / 1000))} s`;
  }

  $("guess-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!round || round.done) return;
    const typed = $("guess").value.trim();
    if (!typed) return;
    $("guess").value = "";
    const key = keyOf(typed);
    const res = match(round.prompt, typed);
    if (res.answer) { finishRound(res.answer, typed); return; }

    // Wrong: a thud and three seconds of air, unless it's a repeat
    if (round.tried.has(key)) {
      $("feedback").textContent = `You've tried "${typed}" already.`;
      return;
    }
    round.tried.add(key);
    round.left -= WRONG_MS;
    Sound.thud();
    $("feedback").textContent = res.nope ? `${res.nope}? ${round.prompt.nope.why || "Not this time."} −3 s` : `Not on the chart. −3 s`;
    const li = document.createElement("li");
    li.textContent = typed;
    $("misses").append(li);
    const input = $("guess");
    input.classList.remove("is-wrong");
    void input.offsetWidth;
    input.classList.add("is-wrong");
    paintAir();
    if (round.left <= 0) finishRound(null);
  });

  function finishRound(answer, typed) {
    round.done = true;
    cancelAnimationFrame(round.raf);
    clearInterval(round.timer);
    const prompt = round.prompt;
    const tier = answer ? tierOf(prompt, answer) : -1;
    const metres = depthOf(tier);
    run.results.push({ id: prompt.id, answer: answer ? answer.name : null, typed: typed || null, tier, metres });
    run.depth += metres;

    $("guess-form").hidden = true;
    $("feedback").textContent = "";
    const box = $("catch");
    box.hidden = false;
    box.className = `catch catch--${tier}`;
    if (answer) {
      Sound.bubble(tier);
      requestAnimationFrame(() => burst(tier));
      $("catch-tier").textContent = `${tierInfo(tier).emoji} ${tierInfo(tier).name}`;
      $("catch-answer").textContent = answer.name;
      $("catch-depth").textContent = `+${metres} m · ${tierInfo(tier).points} points`;
    } else {
      Sound.thud();
      $("catch-tier").textContent = "Out of air";
      $("catch-answer").textContent = "No answer this time";
      $("catch-depth").textContent = "+0 m";
    }
    $("play-depth").textContent = `${run.depth.toLocaleString("en-GB")} m`;
    setDepth(run.depth);
    Sound.hum(run.depth / MAX_DAILY_DEPTH);
    const last = run.i === run.prompts.length - 1;
    $("next").textContent = last ? "Surface" : "Next prompt";
    $("next").focus({ preventScroll: true });
  }

  $("next").addEventListener("click", () => {
    if (!run) return;
    run.i += 1;
    if (run.i < run.prompts.length) { nextPrompt(); return; }
    // The dive is over: save it
    const deepest = Math.max(-1, ...run.results.map((r) => r.tier));
    const result = { depth: run.depth, deepest, results: run.results };
    saved.days[dayKey(run.day)] = result;
    save();
    diving = false;
    Sound.humOff();
    renderEnd(result, run.day);
  });

  // ---- The end of a dive ----
  function shareText(result, day) {
    const row = result.results.map((r) => (r.tier >= 0 ? tierInfo(r.tier).emoji : D.missEmoji)).join("");
    return `The Deep End · ${niceDay(day)}\n${row}\n${result.depth.toLocaleString("en-GB")} m · deepest: ${result.deepest >= 0 ? tierInfo(result.deepest).name : "nothing caught"}\nhttps://emilioschris.github.io/games/deep-end/`;
  }

  function renderEnd(result, day) {
    setDepth(result.depth);
    const rows = result.results.map((r) => {
      const p = byId.get(r.id);
      const wreck = p ? p.wreckAnswer.name : "";
      const caught = r.tier >= 0
        ? `<span class="row-answer">${esc(r.answer)}</span><span class="row-tier row-tier--${r.tier}">${tierInfo(r.tier).emoji} ${tierInfo(r.tier).name} · ${r.metres} m</span>`
        : `<span class="row-answer row-answer--none">No answer</span><span class="row-tier row-tier--miss">${D.missEmoji} 0 m</span>`;
      return `<li class="row">
        <p class="row-prompt">${esc(p ? p.prompt : r.id)}</p>
        <p class="row-caught">${caught}</p>
        <p class="row-wreck"><span aria-hidden="true">⚓</span> The Wreck: <strong>${esc(wreck)}</strong></p>
      </li>`;
    }).join("");
    $("end").innerHTML = `
      <p class="deep-eyebrow">Daily Dive · ${niceDay(day)}</p>
      <h2 class="end-title" id="end-title">You reached <span class="end-depth">${result.depth.toLocaleString("en-GB")} m</span></h2>
      <p class="end-sub">Deepest: ${result.deepest >= 0 ? `${tierInfo(result.deepest).emoji} ${tierInfo(result.deepest).name}` : "nothing caught"} · ${result.results.filter((r) => r.tier >= 0).length} of ${result.results.length} answered</p>
      <p class="end-row" aria-label="Your dive in emoji">${result.results.map((r) => (r.tier >= 0 ? tierInfo(r.tier).emoji : D.missEmoji)).join(" ")}</p>
      <div class="card-actions">
        <button class="btn btn--solid btn--big" type="button" id="share">Share with the group</button>
        <button class="btn" type="button" id="home">Back to the surface</button>
      </div>
      <p class="share-status" id="share-status" role="status"></p>
      <ol class="rows">${rows}</ol>
      <p class="card-line card-next">Next dive in <span data-countdown>${untilNext()}</span></p>`;
    $("share").addEventListener("click", () => share(shareText(result, day)));
    $("home").addEventListener("click", renderStart);
    show("end");
  }

  async function share(text) {
    const status = $("share-status");
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied. Paste it in the group chat.";
      return;
    } catch (e) { /* fall through */ }
    if (navigator.share) {
      try { await navigator.share({ text }); status.textContent = ""; return; } catch (e) { /* cancelled */ }
    }
    // Last resort: select the text so it can be copied by hand
    status.innerHTML = `<textarea class="share-box" readonly rows="5">${esc(text)}</textarea>`;
    status.querySelector("textarea").select();
  }

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */
  drawScale();
  sizeCanvas();
  startBubbles();
  renderStart();

  // For checking the data: DEEP.check() in the console lists any
  // alias that points at two answers in the same prompt.
  D.check = () => PROMPTS.flatMap((p) => [...p.index].filter(([, h]) => !h.answer).map(([k]) => `${p.id}: "${k}"`));
  D.match = (id, typed) => { const r = match(byId.get(id), typed); return r.answer ? `${r.answer.name} (${tierInfo(r.answer.tier).name})` : r.nope ? `nope: ${r.nope}` : "no match"; };
})();
