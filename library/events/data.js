/* =========================================================
   RECENTLY ATTENDED · the events
   ---------------------------------------------------------
   Newest first. To add an event, copy one { … } block and
   keep the comma after it.

   Public information only: the event's own listing or
   programme. Never the names of people I met, and no private
   notes. Dates are kept rough (month and year) on purpose.

     name       The event's name.
     kind       "Conference", "Talk" or "Panel".
     month      "YYYY-MM". Shown as e.g. "Nov 2026".
     place      Where it was.
     coords     Rough coordinates, e.g. "42.37°N 71.12°W".
     host       Who ran it, as the listing says.
     link       The event's public page.
     source     { label, url, checked }: where the speakers come from.
     note       Optional. A short line shown under the speakers.
     speakers   [{ name, affiliation, role, link }]
                  affiliation  As written in the listing.
                  role         Optional, e.g. "Morning keynote".
                  link         Optional. A public profile. Leave it
                               out and the name opens a web search.
   ========================================================= */
const EVENTS = [
  {
    name: "Energy and Climate Conference 2026: Powering a Resilient Future",
    kind: "Conference",
    month: "2026-11",
    place: "Klarman Hall, Harvard Business School, Boston",
    coords: "42.37°N 71.12°W",
    host: "The Energy & Environment Club, a student club at Harvard Business School",
    link: "https://www.eventbrite.com/e/1997469697636",
    source: { label: "the public event listing", url: "https://www.eventbrite.com/e/1997469697636", checked: "2026-11-08" },
    note: "Speakers as named on the public listing, which said more were still to be confirmed.",
    speakers: [
      { name: "Lord Browne", affiliation: "Chairman and Co-founder of BeyondNetZero, and former CEO of BP", role: "Morning keynote",
        link: "https://en.wikipedia.org/wiki/John_Browne,_Baron_Browne_of_Madingley" },
      { name: "Rick Needham", affiliation: "CCO of Commonwealth Fusion Systems", role: "Afternoon keynote",
        link: "https://ceba.swoogo.com/summit2025/speaker/1653672/rick-needham" },
      { name: "Professor Le Xie", affiliation: "Harvard SEAS, PJM Board",
        link: "https://www.belfercenter.org/people/le-xie" },
      { name: "Chris Root", affiliation: "Dash Power Partners" },
      { name: "Lynn Schenk", affiliation: "HBS BEI" },
      { name: "Jim Matheson", affiliation: "HBS" },
      { name: "Anil Achyuta", affiliation: "EIP",
        link: "https://salatainstitute.harvard.edu/user_events/energy-seminar-at-harvard-anil-achyuta-partner-energy-impact-partners/" },
      { name: "Frank O'Sullivan", affiliation: "S2G",
        link: "https://s2gventures.com/team/francis-o%E2%80%99sullivan" },
      { name: "Vikram Gandhi", affiliation: "HBS" },
      { name: "Sully Crevecoeur", affiliation: "HBS, Socotec" },
    ],
  },
];
