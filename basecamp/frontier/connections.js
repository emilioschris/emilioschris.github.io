/* =========================================================
   CONNECTIONS ACROSS THE SITE
   ---------------------------------------------------------
   Links between projects. Claude suggests them; I review.
   Only "approved" links appear on the site.

   tags         The shared topic tags for every project.
   links        { from, to, reason, status }
                  from / to   "frontier:fusion", "greenhouse",
                              "akadimia#faculty", "atlas:FRA" …
                  status      "suggested" | "approved" | "rejected"
   places       Where each id points to (from the site root).
   ========================================================= */

window.CONNECTIONS = {
  tags: {
    kypriaka:   ["history", "cyprus", "archaeology"],
    akadimia:   ["economics", "energy", "climate", "food systems", "finance"],
    frontier:   ["technology", "energy", "climate", "food systems", "agriculture", "ai", "biotech", "economics"],
    atlas:      ["travel", "geography"],
    races:      ["running"],
    greenhouse: ["plants", "agriculture"],
    spanish:    ["language"],
    spiti:      ["language", "cyprus", "history"],
    "deep-end": ["games", "trivia"],
    ascents:    ["climbing", "outdoors"],
  },

  places: {
    "frontier":               { label: "Frontier", href: "basecamp/frontier/index.html" },
    "frontier:fusion":        { label: "Fusion power", href: "basecamp/frontier/index.html#/fusion" },
    "frontier:vertical-farming": { label: "Vertical farming", href: "basecamp/frontier/index.html#/vertical-farming" },
    "frontier:humanoid-robots":  { label: "Humanoid robots", href: "basecamp/frontier/index.html#/humanoid-robots" },
    "frontier:crispr":        { label: "CRISPR gene editing", href: "basecamp/frontier/index.html#/crispr" },
    "greenhouse":             { label: "The Greenhouse", href: "library/greenhouse/index.html" },
    "akadimia#faculty":       { label: "Akadimia: Faculty (Michael Grubb)", href: "basecamp/akadimia/index.html#faculty" },
    "akadimia:ucl":           { label: "Akadimia: UCL and its Institute for Sustainable Resources", href: "basecamp/akadimia/index.html#/ucl" },
    "akadimia#stream":        { label: "Akadimia: the Stream (food systems)", href: "basecamp/akadimia/index.html#stream" },
    "atlas:FRA":              { label: "The Atlas (France)", href: "atlas/index.html" },
    "atlas:GBR":              { label: "The Atlas (United Kingdom)", href: "atlas/index.html" },
    "kypriaka:late-cypriot":  { label: "Kypriaka: the Late Cypriot layer", href: "kypriaka/index.html#/layer/late-cypriot" },
    "kypriaka:oxhide-ingots": { label: "Kypriaka: oxhide ingots", href: "kypriaka/index.html#/e/oxhide-ingots" },
    "kypriaka:kornesios":     { label: "Kypriaka: Hadjigeorgakis Kornesios", href: "kypriaka/index.html#/e/kornesios" },
    "kypriaka:ottoman":       { label: "Kypriaka: the Ottoman layer", href: "kypriaka/index.html#/layer/ottoman" },
    "spiti":                  { label: "Σπίτι (Spíti)", href: "language/spiti/index.html" },
  },

  links: [
    { from: "frontier:vertical-farming", to: "greenhouse", status: "approved",
      reason: "Both grow plants indoors, managing light, water and nutrients by hand." },
    { from: "frontier:vertical-farming", to: "akadimia#stream", status: "approved",
      reason: "Akadimia's stream follows food systems and agriculture economics." },
    { from: "frontier:fusion", to: "akadimia#faculty", status: "approved",
      reason: "Michael Grubb's work on energy transitions, e.g. \"Virtuous and vicious cycles in the energy transition\" (2026)." },
    { from: "frontier:fusion", to: "akadimia:ucl", status: "approved",
      reason: "UCL's Institute for Sustainable Resources researches energy systems and transitions." },
    { from: "frontier:fusion", to: "atlas:FRA", status: "approved",
      reason: "ITER, the international fusion tokamak, is being built in southern France." },
    { from: "frontier:fusion", to: "atlas:GBR", status: "approved",
      reason: "JET, the European tokamak, ran at Culham in Oxfordshire until 2023." },
    { from: "frontier", to: "kypriaka:late-cypriot", status: "approved",
      reason: "Copper made Late Bronze Age Cyprus; Cyprus gave copper its name." },
    { from: "frontier", to: "kypriaka:oxhide-ingots", status: "approved",
      reason: "Copper crossed the Bronze Age Mediterranean as oxhide ingots, slabs of 20 to 30 kilograms." },
    { from: "frontier:crispr", to: "akadimia#stream", status: "approved",
      reason: "Gene-edited crops and how they are regulated are food systems questions." },
    { from: "spiti", to: "kypriaka:kornesios", status: "approved",
      reason: "Spíti's rooms are his house: the mansion Hadjigeorgakis Kornesios built in Nicosia in 1793." },
    { from: "spiti", to: "kypriaka:ottoman", status: "approved",
      reason: "The mansion is the finest surviving town house from the last century of Ottoman rule in Nicosia." },
  ],
};
