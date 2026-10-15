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
                    {
                      src:  "assets/cards/kypriaka.webp",   ← swap in your own photo here
                      alt:  "What the picture shows",
                      tone: "terracotta" or "olive",        (the colour tint)
                      credit: { … }                          (leave out for your own photos)
                    }
                  Card images are 1000 × 800 (5:4). Ask Claude to resize,
                  compress and strip the metadata from your own photos.
                  "atlas-map" still works too (the Atlas's built-in drawing).
                  credit lists where an image came from, for the Image
                  credits page: title, author, date, source, url, licence,
                  licenceUrl, and an optional note about what it is.
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
    image: {
      src: "assets/cards/kypriaka.webp",
      alt: "A carved limestone head of a bearded man wearing a wreath of leaves, from ancient Cyprus.",
      tone: "terracotta",
      credit: {
        title: "Limestone head of a bearded male with a wreath of leaves",
        author: "Cypriot, Classical period",
        date: "late 5th century BCE",
        source: "The Metropolitan Museum of Art, The Cesnola Collection (74.51.2827)",
        url: "https://www.metmuseum.org/art/collection/search/242378",
        licence: "Public domain (Met Open Access, CC0)",
        licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        note: "Carved in Cyprus in the late 5th century BCE, the Classical period, and about 33 cm tall. It reached New York with the Cesnola Collection: tens of thousands of antiquities gathered on the island by Luigi Palma di Cesnola while he was US consul at Larnaca (1865 to 1877). The Met bought the collection by subscription in 1874 to 1876, and Cesnola became the museum's first director in 1879. His digging is still regarded in Cyprus as close to looting, and the Met's record gives no findspot for this head.",
        sources: [
          { label: "The Met: object record", url: "https://www.metmuseum.org/art/collection/search/242378" },
          { label: "Wikipedia: Luigi Palma di Cesnola", url: "https://en.wikipedia.org/wiki/Luigi_Palma_di_Cesnola" },
        ],
      },
    },
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
    image: {
      src: "assets/cards/atlas.webp",
      alt: "Abraham Ortelius's world map of about 1570, an oval world framed by clouds, with a huge imagined southern continent.",
      tone: "olive",
      credit: {
        title: "Typus Orbis Terrarum",
        author: "Abraham Ortelius",
        date: "c. 1570",
        source: "Wikimedia Commons, from a scan by the National Library of Australia",
        url: "https://commons.wikimedia.org/wiki/File:Typus_Orbis_Terrarum_drawn_by_Abraham_Ortelius.png",
        licence: "Public domain",
        licenceUrl: "https://commons.wikimedia.org/wiki/File:Typus_Orbis_Terrarum_drawn_by_Abraham_Ortelius.png",
        note: "The world map from Ortelius's Theatrum Orbis Terrarum, first printed in Antwerp on 20 May 1570 and often called the first true modern atlas: maps of one size, with text, bound together as a single book. It ran to 25 editions before Ortelius died in 1598. It also shows Terra Australis, an imagined great southern continent.",
        sources: [
          { label: "Wikipedia: Theatrum Orbis Terrarum", url: "https://en.wikipedia.org/wiki/Theatrum_Orbis_Terrarum" },
          { label: "Wikimedia Commons: file description", url: "https://commons.wikimedia.org/wiki/File:Typus_Orbis_Terrarum_drawn_by_Abraham_Ortelius.png" },
        ],
      },
    },
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
    image: {
      src: "assets/cards/races.webp",
      alt: "The marble Panathenaic Stadium in Athens, seen from the track looking toward its curved end.",
      tone: "terracotta",
      credit: {
        title: "The Panathenaic Stadium in Athens",
        author: "George E. Koronaios",
        date: "2018",
        source: "Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:The_Panathenaic_Stadium_in_Athens_on_2_October_2018.jpg",
        licence: "CC0 1.0",
        licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      },
    },
  },
  {
    title: "The Greenhouse",
    section: "library",
    status: "ongoing",
    link: "library/greenhouse/index.html",
    description: "My house plants on their benches: what each one needs, with sources, and what to check this week.",
    coords: "51.47°N 0.30°W",
    date: "2026-10",
    tended: "2026-10-14",
    elevation: "ELEV 3 TIERS · 13 PLANTS",
  },
  {
    title: "Spanish Trainer",
    section: "language-routes",
    status: "ongoing",
    link: "spanish/index.html",
    description: "Mexican Spanish practice: vocabulary, spaced repetition and small games.",
    coords: "19.43°N 99.13°W",
    date: "2026-10",
    tended: "2026-10-14",
    elevation: "ELEV 2,240 m",
    shape: 4,
    image: {
      src: "assets/cards/spanish.webp",
      alt: "Strings of colourful cut-paper papel picado banners hanging between trees in Coyoacán, Mexico City.",
      tone: "terracotta",
      credit: {
        title: "Artesanías de papel picado en la Hacienda de Cortés, Coyoacán",
        author: "OsBlanco",
        date: "2019",
        source: "Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:%E2%80%9CArtesan%C3%ADas_de_papel_picado_en_la_Hacienda_de_Cort%C3%A9s,_Coyoac%C3%A1n%E2%80%9D.jpg",
        licence: "CC BY-SA 4.0",
        licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
    },
  },
  {
    title: "Ascents",
    section: "the-wild",
    status: "ongoing",
    link: "ascents/index.html",
    description: "A climbing journal: sessions, grades and projects, indoors and out.",
    coords: "42.44°N 71.10°W",
    date: "2026-10",
    tended: "2026-10-14",
    elevation: "ELEV 90 m",
    shape: 2,
    image: {
      src: "assets/cards/ascents.webp",
      alt: "A bare granite outcrop among pine trees on the Rock Circuit trail in the Middlesex Fells.",
      tone: "olive",
      credit: {
        title: "Rock Circuit / White Trail at Middlesex Fells",
        author: "Ethan Long",
        date: "2023",
        source: "Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Rock_Circuit_White_Trail_at_Middlesex_Fells_(53234108044).jpg",
        licence: "CC BY-SA 2.0",
        licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      },
    },
  },
];
