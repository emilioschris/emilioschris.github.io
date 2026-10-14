/* =========================================================
   COURSE RECORDS · your data
   ---------------------------------------------------------
   This is the only file you need to edit.
   Medals hang on the rail in date order, oldest first.

   Each race has:
     name        The race's name.
     edition     Optional extra line, e.g. "The Authentic · 41st edition". "" if none.
     place       Town and region.
     coords      Where it finishes, e.g. "37.97°N 23.74°E".
     date        "YYYY-MM-DD". If you don't know the day yet, use
                 "YYYY-MM" or just "YYYY" and fill it in later.
     distanceKm  42.195 for a marathon, 21.0975 for a half, 10 for a 10K…
     time        Finish time as "H:MM:SS".
     course      One short line about the course.
     link        The official race website.
     notes       Your own notes. Leave it as "" until you write some.
     photo       Leave it as null for the drawn medal, or:
                   { src: "medals/athens-2024.jpg", alt: "What the photo shows" }
                 (Put the photo in library/races/medals/. Ask Claude to
                 strip its metadata before committing.)
     medal       The medal design:
                   "kotinos"    bronze disc with an olive sprig (Athens)
                   "sunrise"    silver disc, sun over the sea (Hampton)
                   "jellyfish"  enamel jellyfish (Newport)
                   "column", "wave" or "lighthouse": a brass pebble
                   with that line drawing
     ribbon      Ribbon colours: [main, accent]. Use the palette names:
                 "terracotta", "olive", "aegean", "sky", "ochre", "ink", "limestone".
     ribbonMotif Optional: "stripes" (the default), "lettering", "bird" or "bubbles".
     shape       Pebble outline for brass medals, 1 to 4.
     profile     A rough elevation line: points as [km, metres], a note
                 saying how rough it is, and where it came from.
                 Add sketch: true if the line is drawn by eye, not traced
                 (then no height is labelled).
     sources     Where the facts about the race came from.

   To add a race: copy one { … } block, change it, and keep the
   comma after the closing }.
   ========================================================= */

const RACES = [
  {
    name: "Athens Marathon",
    edition: "The Authentic · 41st edition",
    place: "Marathon to Athens, Greece",
    coords: "37.97°N 23.74°E",
    date: "2024-11-10",
    distanceKm: 42.195,
    time: "4:47:42",
    course: "The original route: from the town of Marathon past the Tomb of the Athenians, a long climb from km 10 to km 31, then down into the marble Panathenaic Stadium.",
    link: "https://www.athensauthenticmarathon.gr/en/",
    notes: "My first race, and I hadn't trained enough for it. Major leg cramps set in along the way, but we made it over the finish line.",
    photo: null,
    profile: {
      points: [[0, 30], [4, 25], [10, 40], [14, 85], [18, 120], [21, 140], [24, 165], [27, 200], [29, 228], [31, 245], [33, 210], [36, 150], [39, 105], [42.195, 70]],
      note: "Flat to about km 10, then a long climb to a high point of about 245 m near km 31, then downhill into Athens. Start and finish heights are rough.",
      source: { label: "Fat Marathoner: Athens course guide", url: "https://fatmarathoner.com/athens-marathon-guide/" },
    },
    medal: "kotinos",
    ribbon: ["olive", "limestone"],
    ribbonMotif: "lettering",
    shape: 1,
    sources: [
      { label: "Athens Authentic Marathon (official site)", url: "https://www.athensauthenticmarathon.gr/en/" },
      { label: "Wikipedia: Athens Classic Marathon", url: "https://en.wikipedia.org/wiki/Athens_Classic_Marathon" },
      { label: "Greek Reporter: the 41st Athens Marathon", url: "https://greekreporter.com/2024/11/10/athens-marathon-greece-history/" },
    ],
  },
  {
    name: "Hampton Half Marathon",
    edition: "",
    place: "Hampton, New Hampshire",
    coords: "42.91°N 70.81°W",
    date: "2025-03-02",
    distanceKm: 21.0975,
    time: "1:51:25",
    course: "Flat, fast and coastal: the course runs along Hampton Beach with the Atlantic in view.",
    link: "https://hamptonhalf.com/",
    notes: "Race morning was −15 °C. Crazy cold.",
    photo: null,
    profile: {
      points: [[0, 4], [2, 5], [4, 8], [6, 4], [8, 6], [10, 9], [12, 5], [14, 4], [16, 7], [18, 4], [21.1, 4]],
      note: "Flat and close to sea level. Drawn as a gentle line, not traced: race listings give only about 40 m (130 ft) of climbing in total.",
      sketch: true,
      source: { label: "halfmarathons.net: Hampton Half Marathon & 5K", url: "https://www.halfmarathons.net/races/hampton-half-marathon-5k/" },
    },
    medal: "sunrise",
    ribbon: ["sky", "aegean"],
    ribbonMotif: "bird",
    shape: 2,
    sources: [
      { label: "The Hampton Half Marathon & 5K (official site)", url: "https://hamptonhalf.com/" },
    ],
  },
  {
    name: "Newport Half Marathon",
    edition: "",
    place: "Newport, Rhode Island",
    coords: "41.49°N 71.29°W",
    date: "2026-10-11",
    distanceKm: 21.0975,
    time: "2:02:05",
    course: "From Easton's Beach through town to Fort Adams, around the Ocean Drive loop and past Bellevue Avenue's mansions, then back to the beach.",
    link: "https://newportmarathon.com/",
    notes: "Insanely fun and so beautiful: the Newport cows, and the mansions along the coast.",
    photo: null,
    profile: {
      points: [[0.0, 2], [0.6, 6], [1.0, 19], [1.3, 20], [1.6, 22], [1.9, 9], [2.3, 5], [2.7, 5], [3.2, 3], [3.9, 4], [4.2, 12], [4.5, 15], [4.8, 14], [5.1, 16], [5.6, 15], [5.8, 6], [6.3, 8], [6.8, 14], [7.4, 12], [7.9, 7], [8.2, 10], [8.7, 7], [9.7, 5], [10.5, 5], [11.3, 7], [11.7, 10], [12.2, 5], [12.9, 5], [13.2, 11], [13.7, 6], [14.2, 11], [14.6, 8], [15.3, 11], [16.1, 15], [16.7, 15], [17.1, 11], [17.7, 16], [18.2, 17], [18.7, 18], [19.3, 20], [20.0, 21], [20.3, 6], [20.9, 4], [21.1, 4]],
      note: "Traced from the first 13.1 miles of the official marathon profile, assuming the half runs the same opening loop. Rolling, with short sharp climbs.",
      source: { label: "Official elevation profile (PDF)", url: "https://newportmarathon.com/wp-content/uploads/newportmarathon_elevation.pdf" },
    },
    medal: "jellyfish",
    ribbon: ["terracotta", "ochre"],
    ribbonMotif: "bubbles",
    shape: 3,
    sources: [
      { label: "Amica Newport Marathon & Half Marathon (official site)", url: "https://newportmarathon.com/" },
      { label: "What'sUpNewp: the 2022 course", url: "https://whatsupnewp.com/2022/10/newport-shows-off-its-best-for-the-2022-amica-newport-marathon-and-half-marathon/" },
    ],
  },
];

// The empty hook at the end of the rail. Set a name when you sign up
// for one, e.g. { name: "Boston Marathon", date: "2027-04" }.
const NEXT_RACE = { name: "", date: "" };
