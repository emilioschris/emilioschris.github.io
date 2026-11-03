/* =========================================================
   PARATIRITIRIO · data check
   ---------------------------------------------------------
   Run it before publishing changes to data.js. It checks that
   every entry has its fields and at least one source, that
   related ids exist and dates are well formed, every source has
   an evidence kind, no figure rests on an opinion source, that each pin
   sits inside its district (offshore pins outside them all),
   and that there are no em dashes.

   Run it from the basecamp/paratiritirio folder with the
   JavaScript engine that comes with every Mac:

   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc \
     tools/setup.js geo.js data.js tools/check.js
   ========================================================= */

(function () {
  var P = PARATIRITIRIO, problems = [], notes = [];
  var fail = function (where, msg) { problems.push(where + ": " + msg); };
  var idsOf = function (list) { var o = {}; list.forEach(function (x) { o[x.id] = true; }); return o; };
  var types = idsOf(P.types), sectors = idsOf(P.sectors), statuses = idsOf(P.statuses), districts = idsOf(P.districts);
  var ids = {}, flagged = 0;

  /* Is a point inside a ring? (ray casting, lon/lat) */
  function inRing(pt, ring) {
    var x = pt[1], y = pt[0], inside = false;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function inShape(pt, geom) {
    var polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
    return polys.some(function (rings) {
      return inRing(pt, rings[0]) && !rings.slice(1).some(function (hole) { return inRing(pt, hole); });
    });
  }
  function districtAt(pt) {
    var hit = null;
    P.districtShapes.features.forEach(function (f) { if (inShape(pt, f.geometry)) hit = f.properties.id; });
    return hit;
  }

  var date = /^\d{4}(-\d{2}(-\d{2})?)?$/;
  var required = ["id", "name", "type", "sectors", "district", "coords", "status", "summary", "why", "sources", "asOf"];

  P.entries.forEach(function (e) {
    var w = e.id || e.name || "(entry)";
    required.forEach(function (k) { if (e[k] === undefined || e[k] === "") fail(w, "missing " + k); });
    if (ids[e.id]) fail(w, "duplicate id");
    ids[e.id] = true;
    if (!/^[a-z0-9-]+$/.test(e.id)) fail(w, "id should be lowercase with dashes");
    if (!types[e.type]) fail(w, "unknown type " + e.type);
    if (!statuses[e.status]) fail(w, "unknown status " + e.status);
    if (!districts[e.district]) fail(w, "unknown district " + e.district);
    (e.sectors || []).forEach(function (s) { if (!sectors[s]) fail(w, "unknown sector " + s); });
    if (!e.sources || !e.sources.length) fail(w, "no sources");
    (e.sources || []).forEach(function (s, i) {
      if (!s.title || !s.publisher || !/^https:\/\//.test(s.url || "")) fail(w, "source " + (i + 1) + " needs a title, publisher and https url");
      if (s.date && !date.test(s.date)) fail(w, "source " + (i + 1) + " date " + s.date);
    });
    Object.keys(e.dates || {}).forEach(function (k) { if (!date.test(e.dates[k])) fail(w, "date " + k + " " + e.dates[k]); });
    if (!date.test(e.asOf)) fail(w, "asOf " + e.asOf);
    if (e.value && e.value.eur !== null && typeof e.value.eur !== "number") fail(w, "value.eur should be a number or null");
    (e.sources || []).forEach(function (s, i) {
      if (!P.evidence[s.kind]) fail(w, "source " + (i + 1) + " needs a kind (" + Object.keys(P.evidence).join(", ") + ")");
    });
    if (e.value) {
      if (!P.confidence[e.value.confidence]) fail(w, "value needs a confidence");
      var vs = e.sources && e.sources[e.value.source];
      if (!vs) fail(w, "value.source doesn't point at a source");
      else if (e.value.eur !== null && vs.kind === "opinion") fail(w, "a figure can't rest on an opinion source");
      else if (e.value.eur !== null && vs.kind === "news") notes.push(w + ": figure sourced to news; replace with official data if it exists");
    }
    if (e.whoGains) (e.whoGains.sources || []).forEach(function (i) { if (!e.sources[i]) fail(w, "whoGains source " + i + " doesn't exist"); });

    var at = districtAt(e.coords);
    if (e.district === "offshore") { if (at) fail(w, "offshore pin is on land, in " + at); }
    else if (at !== e.district) fail(w, "pin is in " + (at || "the sea") + ", not " + e.district);
    var dist = P.districts.filter(function (d) { return d.id === e.district; })[0];
    if (dist && dist.north && !e.north) fail(w, "district is in the north but entry isn't marked north");
    if (e.north && !e.legalStatus) notes.push(w + ": in the north with no legalStatus line yet");
    if (e.flags && e.flags.length) flagged++;
  });

  P.entries.forEach(function (e) {
    (e.related || []).forEach(function (r) { if (!ids[r]) fail(e.id, "related id " + r + " doesn't exist"); });
  });

  var text = JSON.stringify([P.entries, P.districts, P.northNote]);
  if (text.indexOf("—") >= 0) fail("data.js", "contains an em dash");

  print("Entries: " + P.entries.length + "  Book-tagged: " + P.entries.filter(function (e) { return e.book; }).length + "  With flags: " + flagged);
  notes.forEach(function (n) { print("  note  " + n); });
  if (problems.length) { problems.forEach(function (p) { print("  FAIL  " + p); }); print(problems.length + " problem(s)."); }
  else print("All checks passed.");
})();
