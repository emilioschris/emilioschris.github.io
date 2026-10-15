/* =========================================================
   SPANISH TRAINER · script
   ---------------------------------------------------------
   1. Saved progress (localStorage, always inside try/catch)
   2. The climb: camps, intervals, what's due today
   3. Checking typed answers (accents, ñ, articles)
   4. Audio (the browser's own Spanish voice)
   5. The session: cards, feedback, end screen
   6. Home screen, logbook, sentence builder and keyboard
   ========================================================= */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. SAVED PROGRESS
     Everything lives in one object in this browser. If storage
     isn't available (private mode, blocked), the trainer still
     works for the session; it just won't remember.
     --------------------------------------------------------- */
  // Real recordings by native speakers (audio.js), where we have one
  const RECORDINGS = typeof AUDIO !== "undefined" ? AUDIO : {};

  const STORE_KEY = "fieldnotes-spanish-v1";
  const blankState = () => ({
    version: 1,
    words: {},   // id → { camp, due, seen, right, wrong }
    settings: { newPerDay: 10, cap: 40, decks: [] },   // decks: [] = all
    streak: { count: 0, lastDay: "" },
    newToday: { day: "", count: 0 },
    history: [],   // { day, total, correct, climbed, dropped } (finished daily climbs)
    log: {},       // "YYYY-MM-DD" → that day's practice, saved after every answer (see logDay)
    points: { total: 0, day: "", today: 0, bestRun: 0, bestCombo: 0 },   // metres climbed
  });

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blankState();
      const saved = JSON.parse(raw);
      const base = blankState();
      return { ...base, ...saved, settings: { ...base.settings, ...(saved.settings || {}) }, points: { ...base.points, ...(saved.points || {}) } };
    } catch (e) {
      return blankState();
    }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  let state = load();

  // Days logged before the logbook existed come from the old history list
  if (!state.log || typeof state.log !== "object") state.log = {};
  for (const h of state.history || []) {
    if (!h || !h.day || state.log[h.day]) continue;
    state.log[h.day] = { cards: h.total || 0, right: h.correct || 0, almost: 0, wrong: Math.max(0, (h.total || 0) - (h.correct || 0)), climbed: h.climbed || 0, dropped: h.dropped || 0, metres: 0, newWords: 0, sentences: 0, finished: true };
  }

  /* ---------------------------------------------------------
     2. THE CLIMB
     --------------------------------------------------------- */
  const CAMPS = ["Base Camp", "Camp 1", "Camp 2", "Camp 3", "Summit"];
  const INTERVALS = [1, 3, 7, 14, 30];   // days until the next visit, by camp

  // Dates as "YYYY-MM-DD" in local time
  const dayOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => dayOf(new Date());
  function addDays(day, n) {
    const [y, m, d] = day.split("-").map(Number);
    return dayOf(new Date(y, m - 1, d + n));
  }

  const byId = new Map(WORDS.map((w) => [w.id, w]));
  const inDecks = (w) => !state.settings.decks.length || state.settings.decks.includes(w.theme);

  function buildQueue() {
    const now = today();
    const due = WORDS
      .filter((w) => inDecks(w) && state.words[w.id] && state.words[w.id].due <= now)
      .sort((a, b) => state.words[a.id].camp - state.words[b.id].camp || state.words[a.id].due.localeCompare(state.words[b.id].due));

    const usedToday = state.newToday.day === now ? state.newToday.count : 0;
    const newAllowed = Math.max(0, state.settings.newPerDay - usedToday);
    const fresh = WORDS.filter((w) => inDecks(w) && !state.words[w.id]).slice(0, newAllowed);

    // Keep a session to roughly ten minutes: reviews first, then new words
    const cap = state.settings.cap;
    const reviews = due.slice(0, cap);
    const news = fresh.slice(0, Math.max(0, cap - reviews.length));
    return { cards: [...reviews, ...news], dueTotal: due.length, newTotal: fresh.length, carried: due.length - reviews.length };
  }

  // Which exercise a word gets at each camp
  function exerciseFor(w, canSpeak) {
    const camp = state.words[w.id] ? state.words[w.id].camp : 0;
    if (camp === 0) return "pick-en";        // Spanish shown, pick the English
    if (camp === 1) return "pick-es";        // English shown, pick the Spanish
    if (camp === 2) return "type-es";        // English shown, type the Spanish
    const audible = canSpeak || !!RECORDINGS[w.id];
    if (camp === 3) return audible ? "listen" : "type-es";   // hear it, type it
    return audible && Math.random() < 0.5 ? "listen" : "type-es";   // Summit review
  }

  // Plausible wrong options: same deck and word type first
  function distractors(w, field) {
    const seen = new Set([w[field]]);
    const pick = (pool) => pool.filter((x) => !seen.has(x[field])).sort(() => Math.random() - 0.5);
    const tiers = [
      WORDS.filter((x) => x.theme === w.theme && x.type === w.type),
      WORDS.filter((x) => x.type === w.type),
      WORDS.filter((x) => x.theme === w.theme),
      WORDS,
    ];
    const out = [];
    for (const tier of tiers) {
      for (const x of pick(tier)) {
        if (out.length === 3) break;
        if (!seen.has(x[field])) { out.push(x); seen.add(x[field]); }
      }
      if (out.length === 3) break;
    }
    return out;
  }

  /* V-GRADE: how much Spanish I really know.
     "Known" = words at Camp 3 or the Summit (they've survived weeks of
     spaced reviews). Strong accuracy adds a small bonus. Points can't
     raise it: only real knowing does. Rough language levels alongside. */
  const GRADES = [
    { g: "VB", need: 0, level: "First steps" },
    { g: "V0", need: 10, level: "Beginner · A1 begins" },
    { g: "V1", need: 25, level: "Beginner · A1" },
    { g: "V2", need: 50, level: "Beginner · A1" },
    { g: "V3", need: 100, level: "A1 well underway" },
    { g: "V4", need: 150, level: "A1 · survival Spanish" },
    { g: "V5", need: 300, level: "Elementary · A2" },
    { g: "V6", need: 600, level: "Elementary · A2" },
    { g: "V7", need: 1000, level: "Intermediate · B1" },
    { g: "V8", need: 1500, level: "Intermediate · B1" },
    { g: "V9", need: 2500, level: "Upper intermediate · B2" },
    { g: "V10", need: 4000, level: "Advanced · C1" },
  ];

  function gradeInfo() {
    const records = Object.values(state.words);
    const known = records.filter((r) => r.camp >= 3).length;
    const seen = records.reduce((n, r) => n + r.seen, 0);
    const right = records.reduce((n, r) => n + r.right, 0);
    const accuracy = seen ? right / seen : 0;
    // Up to 10% extra for steady accuracy, once there's enough to judge
    const bonus = seen >= 30 && accuracy >= 0.85 ? Math.round(known * Math.min(0.1, (accuracy - 0.85) * 0.67)) : 0;
    const score = known + bonus;
    let i = 0;
    while (i + 1 < GRADES.length && score >= GRADES[i + 1].need) i++;
    const nextG = GRADES[i + 1] || null;
    // The highest grade today's word list can reach
    let ceiling = 0;
    while (ceiling + 1 < GRADES.length && WORDS.length >= GRADES[ceiling + 1].need) ceiling++;
    return { ...GRADES[i], index: i, known, bonus, score, accuracy, next: nextG, ceiling: GRADES[ceiling] };
  }

  /* Metres: what each right answer is worth. "Almost" earns half.
     A run of 5 right doubles it, 10 in a row triples it. */
  const METRES = { "pick-en": 10, "pick-es": 10, "type-es": 20, "listen": 30 };
  const comboMultiplier = (combo) => (combo >= 10 ? 3 : combo >= 5 ? 2 : 1);

  function addMetres(m) {
    const now = today();
    if (state.points.day !== now) { state.points.day = now; state.points.today = 0; }
    state.points.total += m;
    state.points.today += m;
  }

  /* The logbook: one entry per day, updated after every answer in
     any mode (daily climb, free climb, sentence builder), so each
     day is saved as you go, even if you stop halfway. Each entry
     also keeps a snapshot of the mountain that day, for the chart. */
  function logDay(change) {
    const now = today();
    const e = state.log[now] || (state.log[now] = { cards: 0, right: 0, almost: 0, wrong: 0, climbed: 0, dropped: 0, metres: 0, newWords: 0, sentences: 0, finished: false });
    for (const [k, v] of Object.entries(change)) e[k] = typeof v === "number" ? (e[k] || 0) + v : v;
    const camps = [0, 0, 0, 0, 0];
    for (const r of Object.values(state.words)) camps[r.camp]++;
    e.camps = camps;
    e.known = camps[3] + camps[4];
    e.met = Object.keys(state.words).length;
    // Keep about a year and a bit
    const days = Object.keys(state.log).sort();
    for (const d of days.slice(0, Math.max(0, days.length - 400))) delete state.log[d];
  }

  /* Free climb: endless practice on words I've already met, weaker
     words more often. It never moves words between camps. */
  const FREE_FALLS = 3;
  const metWords = () => WORDS.filter((w) => inDecks(w) && state.words[w.id]);

  function freePick(recent) {
    const pool = metWords().filter((w) => !recent.includes(w.id));
    const list = pool.length ? pool : metWords();
    const weight = (w) => {
      const st = state.words[w.id];
      return 1 + (4 - st.camp) * 1.5 + 3 * (st.wrong / (st.seen || 1));
    };
    let r = Math.random() * list.reduce((n, w) => n + weight(w), 0);
    for (const w of list) { r -= weight(w); if (r <= 0) return w; }
    return list[list.length - 1];
  }

  function freeKind(w) {
    const camp = state.words[w.id].camp;
    const audible = canSpeak() || !!RECORDINGS[w.id];
    const options = [
      ["pick-en", "pick-en", "pick-es"],
      ["pick-es", "pick-en", "type-es"],
      ["type-es", "pick-es", "listen"],
      ["type-es", "listen", "listen"],
      ["type-es", "listen", "listen"],
    ][camp].filter((k) => k !== "listen" || audible);
    return options[Math.floor(Math.random() * options.length)];
  }

  /* ---------------------------------------------------------
     3. CHECKING TYPED ANSWERS
     → { verdict: "right" | "almost" | "wrong", note }
     --------------------------------------------------------- */
  const tidy = (s) => s.toLowerCase().replace(/[¿?¡!.,;:"]/g, "").replace(/\s+/g, " ").trim();
  // Accents and the tilde on ñ removed (they're separate marks in Unicode)
  const plain = (s) => tidy(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  const ARTICLE = /^(el|la|los|las) /;

  function checkTyped(input, w) {
    const said = tidy(input), target = tidy(w.es);
    if (!said) return { verdict: "wrong", note: "" };
    if (said === target) return { verdict: "right", note: "" };
    if (plain(said) === plain(target)) return { verdict: "almost", note: `almost: ${w.es}` };

    if (w.type === "noun" && ARTICLE.test(target)) {
      const noun = target.replace(ARTICLE, ""), article = target.match(ARTICLE)[1];
      const saidArticle = (said.match(ARTICLE) || [])[1];
      const saidNoun = said.replace(ARTICLE, "");
      if (plain(saidNoun) === plain(noun)) {
        if (!saidArticle) return { verdict: "almost", note: `almost: ${w.es} (with its article)` };
        if (saidArticle !== article) return { verdict: "wrong", note: `Right word, wrong article: it's ${w.es}.` };
      }
    }
    return { verdict: "wrong", note: "" };
  }

  /* ---------------------------------------------------------
     4. AUDIO
     A Mexican Spanish voice if the device has one, otherwise
     any Spanish voice. No voice? The trainer says how to add one.
     --------------------------------------------------------- */
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
  let voice = null;
  const canSpeak = () => !!(synth && voice);
  // Apple's playful character voices: fun, but not for learning
  const NOVELTY = /\b(Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox)\b/i;

  // Score every Spanish voice: Mexican first, then the most natural-sounding
  function voiceScore(v) {
    const lang = v.lang.replace("_", "-");
    if (!/^es\b/i.test(lang)) return -Infinity;
    let score = 0;
    if (/^es-MX/i.test(lang)) score += 40;
    else if (/^es-(US|419)/i.test(lang)) score += 30;
    else score += 10;
    if (/premium/i.test(v.name)) score += 50;
    else if (/enhanced|mejorad/i.test(v.name)) score += 35;
    else if (/google|natural|neural|online/i.test(v.name)) score += 30;
    if (NOVELTY.test(v.name)) score -= 60;
    return score;
  }

  function spanishVoices() {
    return synth ? synth.getVoices().filter((v) => voiceScore(v) > -Infinity).sort((a, b) => voiceScore(b) - voiceScore(a)) : [];
  }

  function pickVoice() {
    if (!synth) return;
    const list = spanishVoices();
    // A voice chosen in settings wins, if it's still on this device
    const chosen = state.settings.voice && list.find((v) => v.name === state.settings.voice);
    voice = chosen || list[0] || null;
    showVoiceNote();
  }
  if (synth) {
    pickVoice();
    synth.addEventListener?.("voiceschanged", pickVoice);
  }
  function speak(text) {
    if (!canSpeak()) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[¿?¡!]/g, ""));
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.9;
    synth.speak(u);
  }

  let player = null;

  function sayWord(w) {
    const rec = RECORDINGS[w.id];
    if (!rec) return speak(w.es);
    if (synth) synth.cancel();
    if (player) player.pause();
    player = new Audio(`audio/${rec.file}`);
    player.play().catch(() => speak(w.es));   // blocked or missing: fall back to the voice
  }

  function creditFor(w) {
    const rec = RECORDINGS[w.id];
    if (!rec) return canSpeak() ? `Voice: ${voice.name}` : "";
    return `Recorded by ${rec.speaker} (native speaker, ${rec.origin}) · Lingua Libre · ${rec.licence}`;
  }

  function showVoiceNote() {
    const note = document.getElementById("voice-note");
    if (!note) return;
    if (canSpeak()) {
      note.hidden = false;
      const count = Object.keys(RECORDINGS).length;
      note.textContent = (count ? `${count} of ${WORDS.length} words are recorded by native Latin American speakers. ` : "")
        + `Everything else is read by ${voice.name} (${voice.lang}).`;
      note.classList.remove("voice-note--warn");
    } else {
      note.hidden = false;
      note.classList.add("voice-note--warn");
      note.innerHTML = "No Spanish voice found on this device, so listening cards turn into typing cards. "
        + "On a Mac: System Settings → Accessibility → Spoken Content → System voice → Manage Voices, "
        + "then add a Spanish (Mexico) voice and reload this page.";
    }
  }

  /* ---------------------------------------------------------
     5. THE SESSION
     --------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const screens = ["home", "study", "builder", "end"];
  function show(id) {
    screens.forEach((s) => { $(s).hidden = s !== id; });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  let session = null;

  function startSession(mode = "daily") {
    const gradeBefore = gradeInfo().index;
    const free = mode === "free";
    const cards = free ? [] : buildQueue().cards;
    if (free ? !metWords().length : !cards.length) return;
    session = {
      mode,
      queue: free ? [] : cards.map((w) => ({ w, retry: false })),
      index: 0,
      results: [],   // { id, verdict, from, to, retry }
      answered: false,
      combo: 0, bestCombo: 0, metres: 0, falls: 0, recent: [], gradeBefore,
    };
    if (free) pushFreeCard();
    document.body.classList.toggle("is-free", free);
    show("study");
    renderCard();
  }

  function pushFreeCard() {
    const w = freePick(session.recent);
    session.recent = [w.id, ...session.recent].slice(0, 4);
    session.queue.push({ w, retry: false, kind: freeKind(w) });
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function renderCard() {
    const item = session.queue[session.index];
    const w = item.w;
    const st = state.words[w.id];
    const camp = st ? st.camp : 0;
    const free = session.mode === "free";
    const kind = item.kind || exerciseFor(w, canSpeak());
    session.current = { w, kind, camp, retry: item.retry };
    session.answered = false;

    if (free) {
      const left = FREE_FALLS - session.falls;
      $("study-count").textContent = `Card ${session.index + 1} · ${"●".repeat(left)}${"○".repeat(session.falls)} · ${session.metres} m`;
      $("progress-bar").style.width = `${Math.min(session.combo, 10) * 10}%`;   // the combo rope
    } else {
      $("study-count").textContent = `${session.index + 1} of ${session.queue.length} · ${session.metres} m`;
      $("progress-bar").style.width = `${(session.index / session.queue.length) * 100}%`;
    }
    $("combo").textContent = session.combo >= 2 ? `${session.combo} in a row${comboMultiplier(session.combo) > 1 ? ` · ×${comboMultiplier(session.combo)}` : ""}` : "";

    const stamp = free ? "Free climb" : item.retry ? "One more try" : st ? CAMPS[camp] : "New word";
    let body = "";
    const replay = `<button class="btn replay" id="replay" type="button" aria-label="Play the Spanish again">▶ Listen <kbd>space</kbd></button>`;

    if (kind === "pick-en" || kind === "pick-es") {
      const field = kind === "pick-en" ? "en" : "es";
      const options = [w, ...distractors(w, field)].sort(() => Math.random() - 0.5);
      session.current.options = options;
      const prompt = kind === "pick-en" ? w.es : w.en;
      body = `
        <p class="card-ask">${kind === "pick-en" ? "What does this mean?" : "How do you say this in Spanish?"}</p>
        <p class="card-prompt" lang="${kind === "pick-en" ? "es" : "en"}">${esc(prompt)}</p>
        ${kind === "pick-en" ? replay : ""}
        <ol class="options">
          ${options.map((o, i) => `<li><button class="option" type="button" data-i="${i}"><kbd>${i + 1}</kbd><span lang="${field === "es" ? "es" : "en"}">${esc(o[field])}</span></button></li>`).join("")}
        </ol>`;
    } else {
      const listen = kind === "listen";
      body = `
        <p class="card-ask">${listen ? "Listen, then type what you hear" : "Type it in Spanish"}</p>
        ${listen ? `<p class="card-prompt card-prompt--listen" aria-hidden="true">· · ·</p>${replay}` : `<p class="card-prompt" lang="en">${esc(w.en)}</p>`}
        <form class="type-form" id="type-form" autocomplete="off">
          <label class="visually-hidden" for="answer">Your answer in Spanish</label>
          <input class="type-input" id="answer" name="answer" lang="es" type="text" inputmode="text"
                 autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${w.type === "noun" ? "with el or la" : "escribe aquí"}">
          <button class="btn btn--solid" type="submit">Check <kbd>↵</kbd></button>
        </form>`;
    }

    $("card").className = "card";
    $("card").innerHTML = `
      <header class="card-head">
        <span class="card-deck">${esc(DECKS.find((d) => d.id === w.theme).name)}</span>
        <span class="stamp ${camp === 4 ? "stamp--sent" : ""} card-stamp">${esc(stamp)}</span>
      </header>
      <div class="card-body">${body}</div>
      <div class="card-feedback" id="feedback" hidden></div>`;

    // Hear it now if the Spanish is already on screen (or it's a listening card)
    if (kind === "pick-en" || kind === "listen") sayWord(w);

    $("card").querySelectorAll(".option").forEach((b) => b.addEventListener("click", () => answerOption(Number(b.dataset.i))));
    $("replay")?.addEventListener("click", () => sayWord(w));
    const form = $("type-form");
    if (form) {
      form.addEventListener("submit", (e) => { e.preventDefault(); answerTyped($("answer").value); });
      $("answer").focus({ preventScroll: true });
    } else {
      $("card").querySelector(".option")?.focus({ preventScroll: true });
    }
  }

  function answerOption(i) {
    if (session.answered) return;
    const { w, options, kind } = session.current;
    const chosen = options[i];
    const right = chosen.id === w.id || chosen[kind === "pick-en" ? "en" : "es"] === w[kind === "pick-en" ? "en" : "es"];
    $("card").querySelectorAll(".option").forEach((b, k) => {
      b.disabled = true;
      if (options[k].id === w.id) b.classList.add("is-right");
      else if (k === i) b.classList.add("is-wrong");
    });
    finish(right ? "right" : "wrong", "");
  }

  function answerTyped(value) {
    if (session.answered) return;
    const { verdict, note } = checkTyped(value, session.current.w);
    const input = $("answer");
    input.readOnly = true;
    input.classList.add(verdict === "wrong" ? "is-wrong" : "is-right");
    $("type-form").querySelector("button").disabled = true;
    finish(verdict, note);
  }

  // Move the word up or down the mountain, then show the answer and its sentence
  function finish(verdict, note) {
    session.answered = true;
    const { w, camp, retry, kind } = session.current;
    const free = session.mode === "free";
    const ok = verdict !== "wrong";
    const st0 = state.words[w.id];   // was this word already on the mountain?
    const now = today();
    let to = camp;

    // Metres for a right answer (none for a second try), boosted by the combo
    let earned = 0;
    if (ok && !retry) {
      session.combo++;
      session.bestCombo = Math.max(session.bestCombo, session.combo);
      earned = Math.round((METRES[kind] || 10) * (verdict === "almost" ? 0.5 : 1) * comboMultiplier(session.combo));
      session.metres += earned;
      addMetres(earned);
    } else if (!ok) {
      session.combo = 0;
      if (free) session.falls++;
    }
    if (free) save();

    if (!retry && !free) {
      const st = state.words[w.id] || { camp: 0, due: now, seen: 0, right: 0, wrong: 0 };
      if (!state.words[w.id]) {
        // A brand-new word counts against today's allowance
        if (state.newToday.day !== now) state.newToday = { day: now, count: 0 };
        state.newToday.count++;
      }
      st.seen++;
      if (ok) { st.right++; st.camp = Math.min(st.camp + 1, 4); }
      else { st.wrong++; st.camp = 0; }
      st.due = addDays(now, INTERVALS[st.camp]);
      to = st.camp;
      state.words[w.id] = st;
      save();
      // A miss comes back once at the end of the session, just for practice
      if (!ok) session.queue.push({ w, retry: true });
    }
    session.results.push({ id: w.id, verdict, from: camp, to, retry });
    if (!retry) {
      logDay({
        cards: 1, [verdict]: 1, metres: earned,
        climbed: !free && to > camp ? 1 : 0,
        dropped: !free && !ok && camp > 0 ? 1 : 0,
        newWords: !free && !st0 ? 1 : 0,
      });
      save();
    }

    const moved = free ? (ok ? "Free climb: practice only, camps stay as they are." : `A fall. ${FREE_FALLS - session.falls} left on this run.`)
      : retry ? "Practice only: this one doesn't move." : ok
      ? (to > camp ? `Climbs to ${CAMPS[to]}.` : `Stays at the ${CAMPS[to]}.`)
      : (camp > 0 ? "Back down to Base Camp." : "Stays at Base Camp.");

    const fb = $("feedback");
    fb.hidden = false;
    fb.innerHTML = `
      <p class="fb-verdict">${verdict === "right" ? "Correct" : verdict === "almost" ? "Almost" : "Not quite"}${earned ? ` <span class="fb-metres">+${earned} m${comboMultiplier(session.combo) > 1 ? ` · ×${comboMultiplier(session.combo)} combo` : ""}</span>` : ""}</p>
      ${note ? `<p class="fb-note">${esc(note)}</p>` : ""}
      <p class="fb-answer"><span lang="es">${esc(w.es)}</span> <span class="fb-en">${esc(w.en)}</span>
        <button class="btn replay replay--small" id="replay-fb" type="button" aria-label="Play the Spanish">▶</button></p>
      ${creditFor(w) ? `<p class="fb-voice">${RECORDINGS[w.id] ? `<a href="${esc(RECORDINGS[w.id].source)}" target="_blank" rel="noopener">${esc(creditFor(w))}</a>` : esc(creditFor(w))}</p>` : ""}
      <p class="fb-example" lang="es">${esc(w.ex)}</p>
      <p class="fb-example-en">${esc(w.exEn)}</p>
      ${w.note ? `<p class="fb-word-note">${esc(w.note)}</p>` : ""}
      <p class="fb-moved">${esc(moved)}</p>
      <button class="btn btn--solid fb-next" id="next" type="button">Next <kbd>↵</kbd></button>`;
    $("card").classList.add(ok ? "card--right" : "card--wrong");
    $("replay-fb").addEventListener("click", () => sayWord(w));
    $("next").addEventListener("click", next);
    $("next").focus({ preventScroll: true });
    fb.scrollIntoView({ block: "nearest", behavior: FieldNotes.reducedMotion.matches ? "auto" : "smooth" });

    // The English-first cards hear the Spanish now, after answering
    if (session.current.kind === "pick-es" || session.current.kind === "type-es") sayWord(w);
  }

  function next() {
    session.index++;
    if (session.mode === "free") {
      if (session.falls >= FREE_FALLS) return endFree();
      pushFreeCard();
      return renderCard();
    }
    if (session.index >= session.queue.length) endSession(true);
    else renderCard();
  }

  // The end of a free climb run
  function endFree() {
    if (synth) synth.cancel();
    const run = session.metres, combo = session.bestCombo, cards = session.results.length;
    const right = session.results.filter((r) => r.verdict !== "wrong").length;
    const record = run > state.points.bestRun;
    state.points.bestRun = Math.max(state.points.bestRun, run);
    state.points.bestCombo = Math.max(state.points.bestCombo, combo);
    save();
    $("end").innerHTML = `
      <p class="eyebrow">Free climb · ${today()}</p>
      <h2 class="title title--end" id="end-title">${session.falls >= FREE_FALLS ? "Off the <em>wall</em>" : "Down <em>safely</em>"}</h2>
      ${record && run ? `<span class="stamp stamp--large stamp--sent end-stamp">New best run</span>` : ""}
      <dl class="today today--end">
        <div><dt>Metres this run</dt><dd>${run}</dd><p>best ${state.points.bestRun} m</p></div>
        <div><dt>Best combo</dt><dd>${combo}</dd><p>record ${state.points.bestCombo}</p></div>
        <div><dt>Cards</dt><dd>${cards}</dd><p>${right} right</p></div>
      </dl>
      <p class="home-hint">${state.points.total.toLocaleString("en")} m climbed in total.</p>
      <div class="home-actions">
        <button class="btn btn--solid btn--big" id="again" type="button">Climb again</button>
        <button class="btn" id="to-home" type="button">Back to base</button>
      </div>`;
    session = null;
    document.body.classList.remove("is-free");
    show("end");
    $("again").addEventListener("click", () => startSession("free"));
    $("to-home").addEventListener("click", () => { renderHome(); show("home"); });
    $("again").focus({ preventScroll: true });
  }

  function endSession(completed) {
    if (synth) synth.cancel();
    const first = session.results.filter((r) => !r.retry);
    const correct = first.filter((r) => r.verdict !== "wrong").length;
    const climbed = first.filter((r) => r.to > r.from).length;
    const dropped = first.filter((r) => r.verdict === "wrong" && r.from > 0).length;
    const now = today();

    if (completed && first.length) {
      // The streak counts days with a finished session
      if (state.streak.lastDay !== now) {
        state.streak.count = state.streak.lastDay === addDays(now, -1) ? state.streak.count + 1 : 1;
        state.streak.lastDay = now;
      }
      state.history.push({ day: now, total: first.length, correct, climbed, dropped });
      state.history = state.history.slice(-365);
      logDay({ finished: true });
      // Summit bonus for finishing, plus a little for every day of the streak
      const bonus = 100 + 20 * state.streak.count;
      session.metres += bonus;
      addMetres(bonus);
      session.bonus = bonus;
      logDay({ metres: bonus });
      save();
    }

    const accuracy = first.length ? Math.round((correct / first.length) * 100) : 0;
    const left = buildQueue();
    const grade = gradeInfo();
    const gradeUp = grade.index > session.gradeBefore;
    $("end").innerHTML = `
      <p class="eyebrow">${completed ? "Session complete" : "Ended early"} · ${now}</p>
      <h2 class="title title--end" id="end-title">${completed ? "Back at <em>camp</em>" : "Rest <em>stop</em>"}</h2>
      ${completed ? `<span class="stamp stamp--large stamp--sent end-stamp">Day ${state.streak.count} · streak</span>` : ""}
      ${gradeUp ? `<div class="grade-up"><span class="stamp stamp--large stamp--sent">Sent ${grade.g}</span><p>New grade: <strong>${grade.g}</strong> · ${esc(grade.level)}</p></div>` : ""}
      <dl class="today today--end">
        <div><dt>Words climbed</dt><dd>${climbed}</dd></div>
        <div><dt>Words dropped</dt><dd>${dropped}</dd></div>
        <div><dt>Accuracy</dt><dd>${accuracy}%</dd><p>${correct} of ${first.length} first tries</p></div>
      </dl>
      <p class="end-metres"><strong>+${session.metres} m</strong>${session.bonus ? ` (including a ${session.bonus} m finishing bonus)` : ""} · ${state.points.total.toLocaleString("en")} m climbed in total</p>
      <p class="home-hint">${left.cards.length ? `${left.cards.length} more card${left.cards.length > 1 ? "s" : ""} waiting if you want to keep going.` : "That's everything for today. ¡Hasta mañana!"}</p>
      <div class="home-actions">
        ${left.cards.length ? `<button class="btn btn--solid btn--big" id="again" type="button">Keep climbing</button>` : ""}
        <button class="btn" id="to-home" type="button">Back to base</button>
      </div>`;
    session = null;
    show("end");
    $("again")?.addEventListener("click", () => startSession());
    $("to-home").addEventListener("click", () => { renderHome(); show("home"); });
    ($("again") || $("to-home")).focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------
     6. HOME SCREEN AND KEYBOARD
     --------------------------------------------------------- */
  function liveStreak() {
    const now = today();
    return state.streak.lastDay === now || state.streak.lastDay === addDays(now, -1) ? state.streak.count : 0;
  }

  function renderGrade() {
    const g = gradeInfo();
    const from = g.need, to = g.next ? g.next.need : g.need;
    const pct = g.next ? Math.min(100, Math.round((g.score / to) * 100)) : 100;
    $("grade").innerHTML = `
      <div class="grade-badge" aria-label="Spanish grade ${g.g}">
        <span class="grade-g">${g.g}</span>
        <span class="grade-level">${esc(g.level)}</span>
      </div>
      <div class="grade-detail">
        <p class="grade-known"><strong>${g.known}</strong> word${g.known === 1 ? "" : "s"} known${g.bonus ? ` <span class="grade-bonus">+${g.bonus} accuracy bonus</span>` : ""}</p>
        ${g.next ? `
          <div class="grade-bar" role="progressbar" aria-valuemin="${from}" aria-valuemax="${to}" aria-valuenow="${g.score}" aria-label="Progress to ${g.next.g}"><span style="width:${pct}%"></span></div>
          <p class="grade-next">${g.score} / ${to} to <strong>${g.next.g}</strong> · ${esc(g.next.level)}</p>` : `<p class="grade-next">Top of the grade scale. ¡Felicidades!</p>`}
        <p class="grade-how">A word counts as known once it reaches Camp 3: weeks of spaced reviews without slipping. Points don't change your grade, only knowing does.${g.index >= GRADES.indexOf(g.ceiling) ? "" : ` With today's ${WORDS.length} words the wall tops out at ${g.ceiling.g}; new decks will open higher grades.`}</p>
      </div>`;
  }

  // The mountain: how many words sit at each camp
  function renderMountain() {
    const counts = [0, 0, 0, 0, 0];
    let trailhead = 0;
    for (const w of WORDS) {
      if (!inDecks(w)) continue;
      const st = state.words[w.id];
      if (st) counts[st.camp]++; else trailhead++;
    }
    const W = 720, H = 240;
    // Camp positions along the ridge, low on the left to the summit on the right
    const pts = [[90, 196], [230, 160], [370, 120], [510, 82], [640, 34]];
    const ridge = "M0 232C60 226 80 204 90 196C140 168 180 172 230 160C290 146 320 130 370 120C430 106 460 96 510 82C560 66 600 46 640 34C660 30 690 60 720 92";
    const echoes = [10, 22, 36].map((dy, k) => `<path class="mtn-echo" d="${ridge}" transform="translate(0 ${dy})" style="opacity:${0.55 - k * 0.15}"/>`).join("");
    const camps = pts.map(([x, y], i) => `
      <g class="mtn-camp${counts[i] ? "" : " is-empty"}">
        ${i === 4 ? `<path class="mtn-flag" d="M${x} ${y}V${y - 26}L${x + 16} ${y - 20}L${x} ${y - 14}"/>` : ""}
        <circle cx="${x}" cy="${y}" r="7"/>
        ${i === 4
          ? `<text class="mtn-count" x="${x - 18}" y="${y - 22}" text-anchor="end">${counts[i]}</text>
             <text class="mtn-name" x="${x - 18}" y="${y - 6}" text-anchor="end">${CAMPS[i]}</text>`
          : `<text class="mtn-count" x="${x}" y="${y - 30}" text-anchor="middle">${counts[i]}</text>
             <text class="mtn-name" x="${x}" y="${y - 14}" text-anchor="middle">${CAMPS[i]}</text>`}
      </g>`).join("");
    $("mountain").innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Words by camp: ${CAMPS.map((c, i) => `${c} ${counts[i]}`).join(", ")}, and ${trailhead} not started.">
        ${echoes}
        <path class="mtn-ridge" d="${ridge}"/>
        <path class="mtn-trail" d="M20 232L90 196"/>
        ${camps}
        <text class="mtn-count" x="22" y="190" text-anchor="middle">${trailhead}</text>
        <text class="mtn-name" x="22" y="206" text-anchor="middle">Trailhead</text>
      </svg>`;
  }

  function renderHome() {
    renderGrade();
    renderMountain();
    renderLogbook();
    const q = buildQueue();
    const reviews = Math.min(q.dueTotal, q.cards.length);
    const news = q.cards.length - reviews;
    const minutes = Math.max(1, Math.round(q.cards.length * 0.25));
    $("today").innerHTML = `
      <div><dt>Due for review</dt><dd>${reviews}</dd></div>
      <div><dt>New words</dt><dd>${news}</dd></div>
      <div><dt>Streak</dt><dd>${liveStreak()}</dd><p>day${liveStreak() === 1 ? "" : "s"} in a row</p></div>
      <div><dt>Metres climbed</dt><dd>${state.points.total.toLocaleString("en")}</dd><p>${state.points.day === today() ? `${state.points.today} today · ` : ""}best run ${state.points.bestRun} m</p></div>`;
    const met = metWords().length;
    $("free").disabled = !met;
    $("free-hint").textContent = met ? `Endless practice on the ${met} word${met > 1 ? "s" : ""} you've met. Three falls end a run.` : "Free climb opens after your first daily climb.";
    $("build-hint").textContent = met ? `Rebuild ${BUILD_COUNT} example sentences from the words you've met, tile by tile. Practice only: camps don't change.` : `Rebuild ${BUILD_COUNT} example sentences, tile by tile. A good warm-up before your first climb.`;
    $("start").disabled = !q.cards.length;
    $("start").textContent = q.cards.length ? `Start today's climb · ${q.cards.length} cards` : "All done for today";
    $("home-hint").textContent = q.cards.length
      ? `About ${minutes} minute${minutes > 1 ? "s" : ""}.${q.carried ? ` ${q.carried} more reviews wait for tomorrow, so today stays short.` : ""}`
      : "Nothing due. Come back tomorrow, the words will be waiting.";
  }

  /* ---- The logbook: calendar, day detail and the words-known chart ---- */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const niceDay = (d) => { const [y, m, dd] = d.split("-").map(Number); return `${dd} ${MONTHS[m - 1]} ${y}`; };
  const weekdayOf = (d) => { const [y, m, dd] = d.split("-").map(Number); return (new Date(y, m - 1, dd).getDay() + 6) % 7; };   // Monday = 0
  const level = (n) => (!n ? 0 : n < 10 ? 1 : n < 25 ? 2 : n < 50 ? 3 : 4);
  let shownDay = null;

  function renderLogbook() {
    const now = today();
    const log = state.log;
    // 12 weeks, Monday to Sunday, ending with this week
    const first = addDays(now, -(weekdayOf(now) + 7 * 11));
    let cells = "", months = "";
    for (let wk = 0; wk < 12; wk++) {
      const monday = addDays(first, wk * 7);
      const dd = Number(monday.slice(8));
      // Label the week a month starts in (and the first week, if there's room before the next label)
      const nextStart = Number(addDays(monday, 7).slice(8)) <= 7 || Number(addDays(monday, 14).slice(8)) <= 7;
      if (dd <= 7 || (wk === 0 && !nextStart)) months += `<span style="grid-column:${wk + 2}">${MONTHS[Number(monday.slice(5, 7)) - 1]}</span>`;
      for (let d = 0; d < 7; d++) {
        const day = addDays(monday, d);
        if (day > now) { cells += `<span class="cal-cell is-future" style="grid-column:${wk + 2};grid-row:${d + 2}"></span>`; continue; }
        const e = log[day];
        const n = e ? e.cards : 0;
        const acc = e && e.cards ? Math.round(((e.right + e.almost) / e.cards) * 100) : 0;
        const label = `${niceDay(day)}: ${n ? `${n} card${n > 1 ? "s" : ""}, ${acc}% right` : "no practice"}`;
        cells += `<button class="cal-cell lv${level(n)}${day === now ? " is-today" : ""}${day === shownDay ? " is-shown" : ""}" type="button" data-day="${day}" style="grid-column:${wk + 2};grid-row:${d + 2}" aria-label="${label}" title="${label}"></button>`;
      }
    }
    const rows = ["M", "", "W", "", "F", "", "S"].map((l, i) => `<span class="cal-wd" style="grid-row:${i + 2}">${l}</span>`).join("");
    $("logbook-cal").innerHTML = `<div class="cal-grid"><div class="cal-months">${months}</div>${rows}${cells}</div>`;

    // This week and this month at a glance
    const last7 = Array.from({ length: 7 }, (_, i) => log[addDays(now, -i)]).filter(Boolean);
    const cards7 = last7.reduce((n, e) => n + e.cards, 0);
    const right7 = last7.reduce((n, e) => n + e.right + e.almost, 0);
    const month = now.slice(0, 7);
    const daysThisMonth = Object.keys(log).filter((d) => d.startsWith(month) && log[d].cards).length;
    $("logbook-sum").textContent = `${daysThisMonth} day${daysThisMonth === 1 ? "" : "s"} this month · ${cards7} cards this week${cards7 ? ` · ${Math.round((right7 / cards7) * 100)}% right` : ""}`;

    renderDay(shownDay || (log[now] ? now : Object.keys(log).filter((d) => log[d].cards).sort().pop() || now));
    renderChart();
  }

  function renderDay(day) {
    shownDay = day;
    document.querySelectorAll(".cal-cell.is-shown").forEach((c) => c.classList.remove("is-shown"));
    document.querySelector(`.cal-cell[data-day="${day}"]`)?.classList.add("is-shown");
    const e = state.log[day];
    if (!e || !e.cards) {
      $("logbook-day").innerHTML = `<p class="day-title">${day === today() ? "Today" : niceDay(day)}</p><p class="day-none">${day === today() ? "Nothing yet today. Every answer is saved here as you go." : "No practice that day."}</p>`;
      return;
    }
    const acc = Math.round(((e.right + e.almost) / e.cards) * 100);
    $("logbook-day").innerHTML = `
      <p class="day-title">${day === today() ? "Today" : niceDay(day)}${e.finished ? ` <span class="stamp stamp--sent day-stamp">Climb finished</span>` : ""}</p>
      <dl class="day-stats">
        <div><dt>Cards</dt><dd>${e.cards}</dd></div>
        <div><dt>Right</dt><dd>${acc}%</dd></div>
        <div><dt>Climbed</dt><dd>${e.climbed}</dd></div>
        <div><dt>Dropped</dt><dd>${e.dropped}</dd></div>
        <div><dt>New words</dt><dd>${e.newWords}</dd></div>
        ${e.sentences ? `<div><dt>Sentences</dt><dd>${e.sentences}</dd></div>` : ""}
        <div><dt>Metres</dt><dd>${e.metres}</dd></div>
        ${e.known !== undefined ? `<div><dt>Known by then</dt><dd>${e.known}</dd></div>` : ""}
      </dl>`;
  }

  $("logbook-cal").addEventListener("click", (e) => {
    const c = e.target.closest(".cal-cell[data-day]");
    if (c) renderDay(c.dataset.day);
  });

  // Words known each day for the last 60 days (carried forward on days off)
  function renderChart() {
    const now = today();
    const pts = [];
    let last = null;
    // Start from the most recent snapshot before the window
    const before = Object.keys(state.log).filter((d) => d < addDays(now, -59) && state.log[d].known !== undefined).sort().pop();
    if (before) last = state.log[before].known;
    for (let i = 59; i >= 0; i--) {
      const d = addDays(now, -i);
      const e = state.log[d];
      if (e && e.known !== undefined) last = e.known;
      if (i === 0) last = Object.values(state.words).filter((r) => r.camp >= 3).length;
      pts.push(last);
    }
    const known = pts.filter((v) => v !== null);
    if (known.length < 2 || !Object.keys(state.log).length) {
      $("logbook-chart").innerHTML = `<p class="day-none">The line starts once you've practised on a couple of days.</p>`;
      return;
    }
    const W = 720, H = 160, padL = 30, padB = 22, padT = 14;
    const g = gradeInfo();
    const top = Math.max(10, ...known, g.next ? g.next.need : 0) * 1.1;
    const x = (i) => padL + (i / 59) * (W - padL - 8);
    const y = (v) => padT + (1 - v / top) * (H - padT - padB);
    let line = "", started = false;
    pts.forEach((v, i) => { if (v === null) return; line += `${started ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)} `; started = true; });
    const firstI = pts.findIndex((v) => v !== null);
    const area = `${line}L${x(59).toFixed(1)},${y(0)} L${x(firstI).toFixed(1)},${y(0)} Z`;
    const goal = g.next ? `<path class="ch-goal" d="M${padL},${y(g.next.need).toFixed(1)} H${W - 8}"/><text class="ch-label" x="${W - 8}" y="${(y(g.next.need) - 5).toFixed(1)}" text-anchor="end">${g.next.g} at ${g.next.need}</text>` : "";
    $("logbook-chart").innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Words known over the last 60 days: now ${pts[59]}.">
        <path class="ch-axis" d="M${padL},${y(0)} H${W - 8}"/>
        ${goal}
        <path class="ch-area" d="${area}"/>
        <path class="ch-line" d="${line}"/>
        <circle class="ch-dot" cx="${x(59)}" cy="${y(pts[59]).toFixed(1)}" r="4"/>
        <text class="ch-label" x="${padL - 6}" y="${y(0) + 4}" text-anchor="end">0</text>
        <text class="ch-label" x="${padL}" y="${H - 4}">${niceDay(addDays(now, -59)).replace(/ \d{4}$/, "")}</text>
        <text class="ch-label" x="${W - 8}" y="${H - 4}" text-anchor="end">Today · ${pts[59]} known</text>
      </svg>`;
  }

  /* ---------------------------------------------------------
     SENTENCE BUILDER
     Each word's example sentence, cut into word tiles and
     shuffled. Tap a tile (or drag it) to build the sentence
     in order; tap a placed tile to send it back. Enter checks.
     It earns metres and is logged, but never moves words
     between camps.
     --------------------------------------------------------- */
  const BUILD_COUNT = 6;
  const BUILD_METRES = [25, 10];   // right first time, right on the second try

  // "¿Dónde está el baño?" → ["dónde", "está", "el", "baño"] (the first
  // letter is lowered so the capital doesn't give the start away)
  function tilesOf(sentence) {
    const raw = sentence.split(/\s+/).filter(Boolean);
    const words = [];
    raw.forEach((t, i) => {
      let word = t.replace(/^[¿¡"«(]+/, "").replace(/[.,;:!?"»)]+$/, "");
      if (!word) return;
      // Lower the first letter at the start of each sentence inside it
      if (i === 0 || /[.!?]$/.test(raw[i - 1]) || /^[¿¡]/.test(t)) word = word.charAt(0).toLowerCase() + word.slice(1);
      words.push(word);
    });
    return words;
  }
  const tileKey = (t) => plain(t);

  // Hearing a tile: the real recording if that word has one ("maleta" → la maleta)
  const TILE_WORDS = new Map();
  for (const w of WORDS) {
    const k = plain(w.es).replace(ARTICLE, "");
    if (!k.includes(" ") && (!TILE_WORDS.has(k) || RECORDINGS[w.id])) TILE_WORDS.set(k, w);
  }
  function sayTile(text) {
    const w = TILE_WORDS.get(tileKey(text));
    if (w && RECORDINGS[w.id]) sayWord(w);
    else speak(text);
  }

  function pickSentences() {
    const usable = (w) => w.ex && inDecks(w) && tilesOf(w.ex).length >= 3 && tilesOf(w.ex).length <= 10;
    const met = WORDS.filter((w) => usable(w) && state.words[w.id]);
    // Weaker words more often, then fill up with words not met yet
    const weight = (w) => { const st = state.words[w.id]; return 1 + (4 - st.camp) + 3 * (st.wrong / (st.seen || 1)); };
    const chosen = [];
    const pool = met.slice();
    while (chosen.length < BUILD_COUNT && pool.length) {
      let r = Math.random() * pool.reduce((n, w) => n + weight(w), 0);
      const i = pool.findIndex((w) => (r -= weight(w)) <= 0);
      chosen.push(pool.splice(i < 0 ? 0 : i, 1)[0]);
    }
    const fresh = WORDS.filter((w) => usable(w) && !state.words[w.id]);
    while (chosen.length < BUILD_COUNT && fresh.length) chosen.push(fresh.splice(Math.floor(Math.random() * fresh.length), 1)[0]);
    return chosen;
  }

  let build = null;   // { items, i, tiles, placed, tries, done, metres, right, combo }

  function startBuilder() {
    const items = pickSentences();
    if (!items.length) return;
    build = { items, i: 0, metres: 0, right: 0, results: [] };
    show("builder");
    nextSentence();
  }

  function nextSentence() {
    const w = build.items[build.i];
    const words = tilesOf(w.ex);
    // Shuffle until the order differs from the answer
    let order;
    do { order = words.map((t, k) => ({ id: k, text: t })).sort(() => Math.random() - 0.5); }
    while (order.length > 1 && order.every((t, k) => tileKey(t.text) === tileKey(words[k])));
    Object.assign(build, { w, answer: words, tiles: order, placed: [], tries: 0, done: false });
    $("build-count").textContent = `${build.i + 1} of ${build.items.length} · ${build.metres} m`;
    $("build-bar").style.width = `${(build.i / build.items.length) * 100}%`;
    $("build-card").className = "card build-card";
    $("build-card").innerHTML = `
      <header class="card-head">
        <span class="card-deck">${esc(DECKS.find((d) => d.id === w.theme).name)}</span>
        <span class="stamp card-stamp">Sentence builder</span>
      </header>
      <div class="card-body">
        <p class="card-ask">Put the words in order</p>
        <p class="build-en" lang="en">${esc(w.exEn)}</p>
        <p class="build-uses">Uses <span lang="es">${esc(w.es)}</span> · ${esc(w.en)}</p>
        <div class="build-line" id="build-line" aria-label="Your sentence"></div>
        <div class="build-bank" id="build-bank" aria-label="Word tiles"></div>
        <div class="build-actions">
          <button class="btn" id="build-clear" type="button">Clear</button>
          <button class="btn btn--solid" id="build-check" type="button">Check <kbd>↵</kbd></button>
        </div>
      </div>
      <div class="card-feedback" id="build-feedback" hidden></div>`;
    $("build-clear").addEventListener("click", () => { if (!build.done) { build.placed = []; paintTiles(); } });
    $("build-check").addEventListener("click", checkSentence);
    paintTiles(true);
    $("build-bank").querySelector(".tile")?.focus({ preventScroll: true });
  }

  // Draw the tiles, gliding each one from where it was (FLIP)
  function paintTiles(first) {
    const before = new Map();
    if (!first) document.querySelectorAll("#build-card .tile").forEach((el) => before.set(el.dataset.id, el.getBoundingClientRect()));
    const tile = (t, where, k) => `<button class="tile${where === "line" ? " tile--placed" : ""}" type="button" data-id="${t.id}" data-where="${where}" lang="es"
        aria-label="${esc(t.text)}${where === "line" ? `, word ${k + 1}. Tap to take it out.` : ". Tap to add it."}">${esc(t.text)}</button>`;
    const placedSet = new Set(build.placed);
    $("build-line").innerHTML = build.placed.length
      ? build.placed.map((id, k) => tile(build.tiles.find((t) => t.id === id), "line", k)).join("")
      : `<span class="build-empty">Tap or drag the words here</span>`;
    $("build-bank").innerHTML = build.tiles.map((t) => (placedSet.has(t.id) ? `<span class="tile tile--gap" aria-hidden="true">${esc(t.text)}</span>` : tile(t, "bank"))).join("");
    $("build-check").disabled = build.placed.length !== build.tiles.length || build.done;
    if (FieldNotes.reducedMotion.matches) return;
    document.querySelectorAll("#build-card .tile[data-id]").forEach((el) => {
      const was = before.get(el.dataset.id);
      if (!was) return;
      const now = el.getBoundingClientRect();
      const dx = was.left - now.left, dy = was.top - now.top;
      if (!dx && !dy) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
    });
  }

  function moveTile(id, toLine, at) {
    if (build.done) return;
    build.placed = build.placed.filter((p) => p !== id);
    if (toLine) build.placed.splice(at === undefined ? build.placed.length : at, 0, id);
    paintTiles();
  }

  // Tapping (or Enter / Space on a focused tile)
  $("build-card").addEventListener("click", (e) => {
    const t = e.target.closest(".tile[data-id]");
    if (!t || build.dragged) return;
    const id = Number(t.dataset.id);
    const toLine = t.dataset.where === "bank";
    if (toLine) sayTile(t.textContent);
    moveTile(id, toLine);
    // Keep the keyboard on the next free tile
    const next = $("build-bank").querySelector(".tile[data-id]") || $("build-check");
    if (toLine) next.focus({ preventScroll: true });
  });

  // Dragging: pick a tile up, drop it into the sentence (at a spot) or back in the bank
  $("build-card").addEventListener("pointerdown", (e) => {
    const t = e.target.closest(".tile[data-id]");
    if (!t || build.done || e.button > 0) return;
    const start = { x: e.clientX, y: e.clientY };
    const id = Number(t.dataset.id);
    let ghost = null;
    build.dragged = false;
    const move = (ev) => {
      if (!ghost) {
        if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 6) return;
        build.dragged = true;
        ghost = t.cloneNode(true);
        ghost.classList.add("tile--ghost");
        document.body.append(ghost);
        t.classList.add("tile--lifted");
      }
      ghost.style.left = `${ev.clientX}px`;
      ghost.style.top = `${ev.clientY}px`;
      $("build-line").classList.toggle("is-over", !!document.elementFromPoint(ev.clientX, ev.clientY)?.closest("#build-line"));
    };
    const up = (ev) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      $("build-line").classList.remove("is-over");
      if (!ghost) return;
      ghost.remove();
      const over = document.elementFromPoint(ev.clientX, ev.clientY);
      if (over?.closest("#build-line")) {
        // Insert before the first placed tile that sits after the pointer
        const others = [...$("build-line").querySelectorAll(".tile[data-id]")].filter((el) => Number(el.dataset.id) !== id);
        let at = others.length;
        for (let k = 0; k < others.length; k++) {
          const r = others[k].getBoundingClientRect();
          if (ev.clientY < r.top || (ev.clientY <= r.bottom && ev.clientX < r.left + r.width / 2)) { at = k; break; }
        }
        sayTile(t.textContent);
        moveTile(id, true, at);
      } else if (over?.closest("#build-bank")) {
        moveTile(id, false);
      } else {
        paintTiles();
      }
      setTimeout(() => { build.dragged = false; }, 0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  });

  function checkSentence() {
    if (!build || build.done || build.placed.length !== build.tiles.length) return;
    const got = build.placed.map((id) => tileKey(build.tiles.find((t) => t.id === id).text));
    const want = build.answer.map(tileKey);
    const right = got.every((k, i) => k === want[i]);
    build.tries++;
    const lineTiles = [...$("build-line").querySelectorAll(".tile[data-id]")];
    lineTiles.forEach((el, i) => el.classList.toggle("is-right", got[i] === want[i]));
    if (!right && build.tries === 1) {
      lineTiles.forEach((el, i) => el.classList.toggle("is-wrong", got[i] !== want[i]));
      $("build-card").classList.add("card--shake");
      setTimeout(() => $("build-card").classList.remove("card--shake"), 400);
      const fb = $("build-feedback");
      fb.hidden = false;
      fb.innerHTML = `<p class="fb-verdict">Not quite</p><p class="fb-note">The green words are in the right place. Move the others and check again.</p>`;
      return;
    }
    finishSentence(right);
  }

  function finishSentence(right) {
    build.done = true;
    const w = build.w;
    const earned = right ? BUILD_METRES[Math.min(build.tries, 2) - 1] : 0;
    if (right) { build.right++; build.metres += earned; addMetres(earned); }
    build.results.push({ id: w.id, right, tries: build.tries });
    logDay({ sentences: right ? 1 : 0, metres: earned });
    save();
    $("build-check").disabled = true;
    $("build-clear").disabled = true;
    $("build-card").classList.add(right ? "card--right" : "card--wrong");
    $("build-line").querySelectorAll(".tile").forEach((el) => { el.disabled = true; });
    const last = build.i === build.items.length - 1;
    const fb = $("build-feedback");
    fb.hidden = false;
    fb.innerHTML = `
      <p class="fb-verdict">${right ? (build.tries === 1 ? "¡Perfecto!" : "Got it") : "Here's how it goes"}${earned ? ` <span class="fb-metres">+${earned} m</span>` : ""}</p>
      <p class="fb-example" lang="es">${esc(w.ex)} <button class="btn replay replay--small" id="build-say" type="button" aria-label="Play the sentence">▶</button></p>
      <p class="fb-example-en">${esc(w.exEn)}</p>
      <p class="fb-moved">Practice only: the word's camp doesn't change.</p>
      <button class="btn btn--solid fb-next" id="build-next" type="button">${last ? "Finish" : "Next"} <kbd>↵</kbd></button>`;
    $("build-say").addEventListener("click", () => speak(w.ex));
    $("build-next").addEventListener("click", nextBuild);
    $("build-next").focus({ preventScroll: true });
    if (canSpeak()) speak(w.ex);
  }

  function nextBuild() {
    build.i++;
    if (build.i < build.items.length) nextSentence();
    else endBuilder();
  }

  function endBuilder() {
    if (synth) synth.cancel();
    const n = build.results.length;
    $("end").innerHTML = `
      <p class="eyebrow">Sentence builder · ${today()}</p>
      <h2 class="title title--end" id="end-title">${n && build.right === n ? "Every <em>sentence</em>" : "Words in <em>order</em>"}</h2>
      <dl class="today today--end">
        <div><dt>Sentences right</dt><dd>${build.right}</dd><p>of ${n}</p></div>
        <div><dt>Metres</dt><dd>${build.metres}</dd><p>${state.points.total.toLocaleString("en")} m in total</p></div>
      </dl>
      <div class="home-actions">
        <button class="btn btn--solid btn--big" id="again" type="button">Build more</button>
        <button class="btn" id="to-home" type="button">Back to base</button>
      </div>`;
    build = null;
    show("end");
    $("again").addEventListener("click", startBuilder);
    $("to-home").addEventListener("click", () => { renderHome(); show("home"); });
    $("again").focus({ preventScroll: true });
  }

  $("build").addEventListener("click", startBuilder);
  $("build-quit").addEventListener("click", () => build && endBuilder());

  // Keys while building: Enter checks or moves on, Backspace takes the last word out
  document.addEventListener("keydown", (e) => {
    if (!build || $("builder").hidden) return;
    if (e.key === "Enter" && !e.target.closest(".tile")) {
      e.preventDefault();
      if (build.done) nextBuild(); else checkSentence();
    } else if (e.key === "Backspace" && !build.done && build.placed.length) {
      e.preventDefault();
      moveTile(build.placed[build.placed.length - 1], false);
    }
  });

  $("start").addEventListener("click", () => startSession());
  $("quit").addEventListener("click", () => session && (session.mode === "free" ? endFree() : endSession(false)));
  $("free").addEventListener("click", () => startSession("free"));

  document.addEventListener("keydown", (e) => {
    if (!session || $("study").hidden) return;
    const typing = e.target.matches("input, textarea");
    if (e.key === " " && !typing) {
      e.preventDefault();
      sayWord(session.current.w);
      return;
    }
    if (!session.answered && !typing && /^[1-4]$/.test(e.key)) {
      const opt = $("card").querySelectorAll(".option")[Number(e.key) - 1];
      if (opt) { e.preventDefault(); opt.click(); }
      return;
    }
    if (session.answered && e.key === "Enter" && e.target.id !== "next") {
      e.preventDefault();
      next();
    }
  });

  // Credits for the recordings, grouped by speaker
  function renderVoices() {
    const list = $("voices-list");
    const bySpeaker = new Map();
    for (const rec of Object.values(RECORDINGS)) {
      const key = rec.speaker;
      if (!bySpeaker.has(key)) bySpeaker.set(key, { ...rec, count: 0, licences: new Set() });
      const s = bySpeaker.get(key);
      s.count++;
      s.licences.add(rec.licence);
    }
    if (!bySpeaker.size) return;
    $("voices").hidden = false;
    [...bySpeaker.values()].sort((a, b) => b.count - a.count).forEach((s) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${esc(s.speaker)}</strong> · ${esc(s.origin)} · ${s.count} word${s.count > 1 ? "s" : ""} · ${[...s.licences].map(esc).join(", ")}`;
      list.append(li);
    });
    const how = document.createElement("li");
    how.innerHTML = `Each recording links to its original on Wikimedia Commons from the answer card's credit. Converted to .m4a; CC BY-SA recordings are shared under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>.`;
    list.append(how);
  }

  /* ---------------------------------------------------------
     7. ROUTE AND GEAR: decks, settings, backup
     --------------------------------------------------------- */
  function renderDecks() {
    const holder = $("decks");
    const chosen = state.settings.decks;
    const btn = (id, label, pressed) => `<button type="button" data-deck="${id}" aria-pressed="${pressed}">${esc(label)}</button>`;
    holder.innerHTML = btn("all", "All decks", !chosen.length) + DECKS.map((d) => {
      const words = WORDS.filter((w) => w.theme === d.id);
      const known = words.filter((w) => state.words[w.id] && state.words[w.id].camp >= 3).length;
      return btn(d.id, `${d.name} · ${known}/${words.length}`, chosen.includes(d.id));
    }).join("");
    const count = WORDS.filter(inDecks).length;
    $("decks-hint").textContent = chosen.length ? `${count} words in ${chosen.length} deck${chosen.length > 1 ? "s" : ""}. Free climb and the daily climb both use these.` : `All ${WORDS.length} words. Pick decks to focus on a theme.`;
  }

  $("decks").addEventListener("click", (e) => {
    const b = e.target.closest("[data-deck]");
    if (!b) return;
    const id = b.dataset.deck;
    let decks = state.settings.decks;
    if (id === "all") decks = [];
    else decks = decks.includes(id) ? decks.filter((d) => d !== id) : [...decks, id];
    if (decks.length === DECKS.length) decks = [];   // every deck = all decks
    state.settings.decks = decks;
    save();
    renderDecks();
    renderHome();
  });

  $("new-per-day").value = String(state.settings.newPerDay);
  $("new-per-day").addEventListener("change", (e) => {
    state.settings.newPerDay = Number(e.target.value);
    save();
    renderHome();
  });

  function renderVoicePicker() {
    const sel = $("voice-select");
    const list = spanishVoices();
    if (!list.length) {
      sel.innerHTML = `<option>No Spanish voice on this device</option>`;
      sel.disabled = true;
      $("voice-test").disabled = true;
      return;
    }
    sel.disabled = false;
    $("voice-test").disabled = false;
    sel.innerHTML = `<option value="">Best available (${esc(list[0].name)})</option>`
      + list.map((v) => `<option value="${esc(v.name)}">${esc(v.name)} · ${esc(v.lang)}</option>`).join("");
    sel.value = state.settings.voice && list.some((v) => v.name === state.settings.voice) ? state.settings.voice : "";
  }
  $("voice-select").addEventListener("change", (e) => {
    state.settings.voice = e.target.value;
    save();
    pickVoice();
    speak("Hola, ¿cómo estás?");
  });
  $("voice-test").addEventListener("click", () => speak("Hola, ¿cómo estás? Vamos a practicar español."));
  if (synth) synth.addEventListener?.("voiceschanged", renderVoicePicker);

  // Backup: a small JSON file with everything this browser remembers
  $("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ app: "fieldnotes-spanish", exported: new Date().toISOString(), ...state }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `spanish-progress-${today()}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    $("backup-status").textContent = `Saved ${a.download}.`;
  });

  $("import").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== "fieldnotes-spanish" || typeof data.words !== "object") throw new Error("not a backup");
      const words = Object.keys(data.words).length;
      if (!confirm(`Load this backup? It has ${words} word${words === 1 ? "" : "s"} of progress and replaces what's in this browser now.`)) return;
      const base = blankState();
      state = {
        ...base,
        words: data.words || {},
        settings: { ...base.settings, ...(data.settings || {}) },
        streak: { ...base.streak, ...(data.streak || {}) },
        newToday: { ...base.newToday, ...(data.newToday || {}) },
        history: Array.isArray(data.history) ? data.history : [],
        log: data.log && typeof data.log === "object" ? data.log : {},
        points: { ...base.points, ...(data.points || {}) },
      };
      save();
      $("new-per-day").value = String(state.settings.newPerDay);
      pickVoice();
      renderVoicePicker();
      renderDecks();
      renderHome();
      $("backup-status").textContent = `Loaded ${file.name}: ${words} word${words === 1 ? "" : "s"} of progress.`;
    } catch (err) {
      $("backup-status").textContent = "That file doesn't look like a Spanish Trainer backup, so nothing changed.";
    }
  });

  renderHome();
  showVoiceNote();
  renderVoices();
  renderDecks();
  renderVoicePicker();
})();
