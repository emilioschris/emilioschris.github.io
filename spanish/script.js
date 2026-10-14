/* =========================================================
   SPANISH TRAINER · script
   ---------------------------------------------------------
   1. Saved progress (localStorage, always inside try/catch)
   2. The climb: camps, intervals, what's due today
   3. Checking typed answers (accents, ñ, articles)
   4. Audio (the browser's own Spanish voice)
   5. The session: cards, feedback, end screen
   6. Home screen and keyboard
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
    history: [],   // { day, total, correct, climbed, dropped }
  });

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blankState();
      const saved = JSON.parse(raw);
      const base = blankState();
      return { ...base, ...saved, settings: { ...base.settings, ...(saved.settings || {}) } };
    } catch (e) {
      return blankState();
    }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  let state = load();

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
  const screens = ["home", "study", "end"];
  function show(id) {
    screens.forEach((s) => { $(s).hidden = s !== id; });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  let session = null;

  function startSession() {
    const { cards } = buildQueue();
    if (!cards.length) return;
    session = {
      queue: cards.map((w) => ({ w, retry: false })),
      index: 0,
      results: [],   // { id, verdict, from, to, retry }
      answered: false,
    };
    show("study");
    renderCard();
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function renderCard() {
    const item = session.queue[session.index];
    const w = item.w;
    const st = state.words[w.id];
    const camp = st ? st.camp : 0;
    const kind = exerciseFor(w, canSpeak());
    session.current = { w, kind, camp, retry: item.retry };
    session.answered = false;

    $("study-count").textContent = `${session.index + 1} of ${session.queue.length}`;
    $("progress-bar").style.width = `${(session.index / session.queue.length) * 100}%`;

    const stamp = item.retry ? "One more try" : st ? CAMPS[camp] : "New word";
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
    const { w, camp, retry } = session.current;
    const ok = verdict !== "wrong";
    const now = today();
    let to = camp;

    if (!retry) {
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

    const moved = retry ? "Practice only: this one doesn't move." : ok
      ? (to > camp ? `Climbs to ${CAMPS[to]}.` : `Stays at the ${CAMPS[to]}.`)
      : (camp > 0 ? "Back down to Base Camp." : "Stays at Base Camp.");

    const fb = $("feedback");
    fb.hidden = false;
    fb.innerHTML = `
      <p class="fb-verdict">${verdict === "right" ? "Correct" : verdict === "almost" ? "Almost" : "Not quite"}</p>
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
    if (session.index >= session.queue.length) endSession(true);
    else renderCard();
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
      save();
    }

    const accuracy = first.length ? Math.round((correct / first.length) * 100) : 0;
    const left = buildQueue();
    $("end").innerHTML = `
      <p class="eyebrow">${completed ? "Session complete" : "Ended early"} · ${now}</p>
      <h2 class="title title--end" id="end-title">${completed ? "Back at <em>camp</em>" : "Rest <em>stop</em>"}</h2>
      ${completed ? `<span class="stamp stamp--large stamp--sent end-stamp">Day ${state.streak.count} · streak</span>` : ""}
      <dl class="today today--end">
        <div><dt>Words climbed</dt><dd>${climbed}</dd></div>
        <div><dt>Words dropped</dt><dd>${dropped}</dd></div>
        <div><dt>Accuracy</dt><dd>${accuracy}%</dd><p>${correct} of ${first.length} first tries</p></div>
      </dl>
      <p class="home-hint">${left.cards.length ? `${left.cards.length} more card${left.cards.length > 1 ? "s" : ""} waiting if you want to keep going.` : "That's everything for today. ¡Hasta mañana!"}</p>
      <div class="home-actions">
        ${left.cards.length ? `<button class="btn btn--solid btn--big" id="again" type="button">Keep climbing</button>` : ""}
        <button class="btn" id="to-home" type="button">Back to base</button>
      </div>`;
    session = null;
    show("end");
    $("again")?.addEventListener("click", startSession);
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

  function renderHome() {
    const q = buildQueue();
    const reviews = Math.min(q.dueTotal, q.cards.length);
    const news = q.cards.length - reviews;
    const minutes = Math.max(1, Math.round(q.cards.length * 0.25));
    $("today").innerHTML = `
      <div><dt>Due for review</dt><dd>${reviews}</dd></div>
      <div><dt>New words</dt><dd>${news}</dd></div>
      <div><dt>Streak</dt><dd>${liveStreak()}</dd><p>day${liveStreak() === 1 ? "" : "s"} in a row</p></div>`;
    $("start").disabled = !q.cards.length;
    $("start").textContent = q.cards.length ? `Start today's climb · ${q.cards.length} cards` : "All done for today";
    $("home-hint").textContent = q.cards.length
      ? `About ${minutes} minute${minutes > 1 ? "s" : ""}.${q.carried ? ` ${q.carried} more reviews wait for tomorrow, so today stays short.` : ""}`
      : "Nothing due. Come back tomorrow, the words will be waiting.";
  }

  $("start").addEventListener("click", startSession);
  $("quit").addEventListener("click", () => session && endSession(false));

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

  renderHome();
  showVoiceNote();
  renderVoices();
})();
