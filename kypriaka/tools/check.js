/* =========================================================
   KYPRIAKA · data check
   ---------------------------------------------------------
   Checks the data files before anything is published:
   every claim has a real source, evidence type and confidence;
   every link points to something that exists; dates line up;
   no em dashes.

   Run it from the kypriaka folder with the JavaScript engine
   that comes with every Mac:

   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc \
     tools/setup.js data/sources.js data/method.js data/periods.js \
     data/entities.js data/geo.js data/hellenika.js data/homage.js tools/check.js
   ========================================================= */

(function () {
  var K = KYPRIAKA, problems = [], notes = [];
  var fail = function (where, msg) { problems.push(where + ": " + msg); };
  var has = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };
  var ids = {}, placeIds = {}, periodIds = {};

  K.periods.forEach(function (p) { periodIds[p.id] = true; ids[p.id] = "period"; });
  K.places.forEach(function (p) { placeIds[p.id] = true; });

  function checkSources(where, list) {
    if (!list || !list.length) { fail(where, "no sources"); return; }
    list.forEach(function (s) { if (!has(K.sources, s)) fail(where, "unknown source \"" + s + "\""); });
  }
  function checkHellenika(where, list) {
    (list || []).forEach(function (h) { if (!has(K.hellenika.pages, h)) fail(where, "unknown Hellenika page \"" + h + "\""); });
  }
  function checkText(where, text) {
    if (/—/.test(text || "")) fail(where, "contains an em dash");
  }

  // Sources
  Object.keys(K.sources).forEach(function (id) {
    var s = K.sources[id];
    ["short", "kind", "citation", "url", "usedFor", "accessed"].forEach(function (f) { if (!s[f]) fail("source " + id, "missing " + f); });
  });

  // Periods: in order, no overlaps, sources real
  K.periods.forEach(function (p, i) {
    var w = "layer " + p.id;
    if (i > 0 && K.periods[i - 1].end !== p.start && !(p.id === "lusignan")) notes.push(w + ": starts at " + p.start + ", previous layer ends at " + K.periods[i - 1].end);
    p.says.forEach(function (s) { checkSources(w + " (says)", [s.source]); checkText(w, s.text); });
    (p.overview || []).forEach(function (o) { checkSources(w + " (overview)", o.sources); checkText(w, o.text); });
    (p.disagree || []).forEach(function (d) { checkText(w, d); });
    (p.sites || []).forEach(function (s) { if (!placeIds[s]) fail(w, "unknown place \"" + s + "\""); });
    checkHellenika(w, p.hellenika);
    if (p.excavated && !(p.overview && p.overview.length)) fail(w, "excavated but has no overview");
  });

  // Entities
  var claims = 0, single = 0;
  K.entities.forEach(function (e) {
    var w = "entity " + e.id;
    if (ids[e.id]) fail(w, "id used twice");
    ids[e.id] = e.type;
    if (!has(K.types, e.type)) fail(w, "unknown type \"" + e.type + "\"");
    (e.period || []).forEach(function (p) { if (!periodIds[p]) fail(w, "unknown layer \"" + p + "\""); });
    if (e.place && !placeIds[e.place]) fail(w, "unknown place \"" + e.place + "\"");
    checkHellenika(w, e.hellenika);
    checkText(w, e.summary);
    if (e.image) ["src", "alt", "caption", "credit", "licence", "page"].forEach(function (f) { if (!e.image[f]) fail(w, "image missing " + f); });
    (e.claims || []).forEach(function (c, i) {
      var cw = w + " claim " + (i + 1);
      claims++;
      if (!c.text) fail(cw, "no text");
      checkText(cw, c.text);
      if (!has(K.evidence, c.evidence)) fail(cw, "unknown evidence \"" + c.evidence + "\"");
      if (!has(K.confidence, c.confidence)) fail(cw, "unknown confidence \"" + c.confidence + "\"");
      checkSources(cw, c.sources);
      if (c.sources && c.sources.length && c.sources.every(function (s) { return K.sources[s] && K.sources[s].kind === "reference"; })) single++;
    });
  });
  K.entities.forEach(function (e) {
    (e.relations || []).forEach(function (r) {
      var w = "entity " + e.id;
      if (!ids[r.id]) fail(w, "relation points to unknown \"" + r.id + "\"");
      var known = has(K.inverse, r.rel) || Object.keys(K.inverse).some(function (k) { return K.inverse[k] === r.rel; });
      if (!known) fail(w, "relation label \"" + r.rel + "\" has no reverse in method.js");
      var back = K.entities.filter(function (o) { return o.id === r.id; })[0];
      if (back && (back.relations || []).some(function (b) { return b.id === e.id; }))
        fail(w, "relation to \"" + r.id + "\" is written in both directions (write it once; the reverse appears automatically)");
    });
  });

  // The Deepest Layer: every claim, timeline entry and reference is real and sourced
  if (K.homage) {
    var H = K.homage, hw = "The Deepest Layer";
    var homageClaims = H.life.concat(H.work.map(function (w) { return w.claim; }));
    homageClaims.forEach(function (c, i) {
      var cw = hw + " claim " + (i + 1);
      if (!K.evidence[c.evidence]) fail(cw, "unknown evidence type \"" + c.evidence + "\"");
      if (!K.confidence[c.confidence]) fail(cw, "unknown confidence \"" + c.confidence + "\"");
      if (!c.sources || !c.sources.length) fail(cw, "has no source");
      checkSources(cw, c.sources);
      checkText(cw, c.text);
      claims++;
    });
    H.timeline.forEach(function (t) { checkSources(hw + " timeline " + t.year, t.sources); checkText(hw + " timeline " + t.year, t.text); });
    H.bibliography.concat(H.further).forEach(function (id) { if (!K.sources[id]) fail(hw, "bibliography points to unknown source \"" + id + "\""); });
    H.sites.forEach(function (id) {
      var place = K.places.filter(function (p) { return p.id === id; })[0];
      if (!place) fail(hw, "site \"" + id + "\" isn't on the map");
      else if (!place.homage) fail(hw, "site \"" + id + "\" is missing homage: true");
    });
    [H.title, H.dedication, H.intro, H.crossingsCaption].forEach(function (t) { checkText(hw, t); });
  }

  print("Kypriaka data check");
  print("  " + K.periods.length + " layers (" + K.periods.filter(function (p) { return p.excavated; }).length + " excavated), " +
        K.entities.length + " entities, " + claims + " claims (" + single + " single-source), " +
        Object.keys(K.sources).length + " sources, " + K.places.length + " places");
  notes.forEach(function (n) { print("  note: " + n); });
  if (problems.length) {
    problems.forEach(function (p) { print("  PROBLEM: " + p); });
    print("  " + problems.length + " problem(s) found.");
  } else {
    print("  All checks passed.");
  }
})();
