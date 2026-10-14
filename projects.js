/* =========================================================
   FIELD NOTES · project registry
   ---------------------------------------------------------
   Every card on the homepage comes from this list.
   To add a project, copy one { … } block, change it, and keep
   the comma after the closing }. Cards appear in this order.

   Each project has:
     title        The project's name.
     section      Which section it sits in:
                  "base-camp", "library", "training-ground",
                  "language-routes" or "the-wild".
     status       "planned"  → dashed PLANNED stamp, no link yet
                  "ongoing"  → EXPEDITION ONGOING stamp
                  "finished" → no stamp
     link         Where the card goes, e.g. "atlas/index.html".
                  Leave it out until the project exists.
     description  One line about it.
     coords       A place it relates to, e.g. "35.17°N 33.36°E".
     date         When it started, as "YYYY-MM".
     tended       Optional. When it last grew, as "YYYY-MM-DD".
                  Shown on the card as "Last tended …".
     elevation    The card's "elevation" line, e.g. "ELEV 220 m".
     image        Optional. Leave it out for a placeholder pebble, or:
                    { src: "kypriaka/cover.jpg", alt: "What the picture shows" }
                    "atlas-map"  (the Atlas's built-in drawing)
     shape        Optional pebble shape, 1 to 4. Picked for you if left out.
   ========================================================= */

const PROJECTS = [
  {
    title: "Κυπριακά (Kypriaka)",
    section: "base-camp",
    status: "ongoing",
    link: "kypriaka/index.html",
    description: "An interactive history of Cyprus, dug through layer by layer like an excavation.",
    coords: "35.17°N 33.36°E",
    date: "2026-10",
    elevation: "ELEV 220 m",
  },
  {
    title: "The Atlas",
    section: "library",
    status: "ongoing",
    link: "atlas/index.html",
    description: "An interactive world map of where I've been and where I'm going next.",
    coords: "0.00°N 0.00°E",
    date: "2026-10",
    elevation: "ELEV 0 m · SEA LEVEL",
    image: "atlas-map",
    shape: 3,
  },
  {
    title: "Course Records",
    section: "library",
    status: "ongoing",
    link: "library/races/index.html",
    description: "A race tracker: every finish line on a medal rail, with paces and the shape of each course.",
    coords: "37.97°N 23.74°E",
    date: "2026-10",
    tended: "2026-10-14",
    elevation: "ELEV ≈ 245 m · ATHENS KM 31",
    shape: 1,
  },
  {
    title: "Spanish Trainer",
    section: "language-routes",
    status: "planned",
    description: "Mexican Spanish practice: vocabulary, spaced repetition and small games.",
    coords: "19.43°N 99.13°W",
    date: "2026-10",
    elevation: "ELEV 2,240 m",
    shape: 4,
  },
  {
    title: "Ascents",
    section: "the-wild",
    status: "planned",
    description: "A climbing journal: sessions, grades and projects, indoors and out.",
    coords: "42.44°N 71.10°W",
    date: "2026-10",
    elevation: "ELEV 90 m",
    shape: 2,
  },
];
