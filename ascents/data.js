/* =========================================================
   ASCENTS · your data
   ---------------------------------------------------------
   This is the only file you need to edit (or tell Claude
   "log session: …" and it will do it for you).

   Grades are written "V0" to "V10". A "+" or "-" is kept for
   display ("V2+") but filed under its number on the rack.

   gyms       Indoor walls. Problems get reset, so indoor climbs
              are logged by grade, wall, hold colour and result.
                before   What I'd already sent before this journal
                         began. Shown solid on the rack, without
                         tick marks. slab / overhang = hardest grade
                         on each style.

   areas      Outdoor areas > boulders > problems.
                gps            [latitude, longitude], or null
                elevation      metres, or null
                mountainProject  link to the boulder's page, or ""
                problems       name, grade (or null if unknown), and
                               status: "sent", "projecting" or ""
                photos         Optional, on a boulder or a problem: my own
                               photos, shown when the problem is clicked.
                                 photos: [{ src: "photos/recess-1.webp",
                                            alt: "What it shows",
                                            caption: "Optional line" }]
                               (Put them in ascents/photos/. Claude strips
                               the GPS and other metadata first.)

   sessions   One per day out, newest anywhere (the page sorts them):
                {
                  date: "2026-10-18",
                  place: "bp-somerville",   ← a gym id or a boulder id
                  climbs: [
                    // indoors: grade, wall, holds, style, result
                    { grade: "V5", wall: "The Cave", holds: "purple", style: "overhang", result: "send" },
                    // outdoors: the problem's name and its result
                    { problem: "Sunset Dual Arete", result: "attempt" },
                  ],
                  felt: "How the day felt",
                  notes: ["Technique lessons, one per line"],
                }
              result is "flash" (first try), "send" or "attempt".

   projects   Problems I'm working on:
                problem, boulder, grade, status ("projecting" or
                "sent"), attempts, sessions, highPoint, beta,
                started and sent ("YYYY-MM-DD" or "").

   ticklist   Outdoor problems I want next: { problem, boulder }.
   ========================================================= */

const ASCENTS = {
  // The headline numbers in the hero
  indoorRange: "V4 to V6",

  gyms: [
    {
      id: "bp-somerville",
      name: "Bouldering Project Somerville",
      place: "Somerville, Massachusetts",
      before: { slab: "V6", overhang: "V5" },
    },
    {
      id: "eustonwall",
      name: "EustonWall Climbing Centre",
      place: "Euston, London · London Climbing Centres",
      before: { best: "V5" },
    },
  ],

  areas: [
    {
      id: "fells",
      name: "Middlesex Fells Reservation",
      place: "Medford, Massachusetts",
      mountainProject: "https://www.mountainproject.com/area/109907600/middlesex-fells",
      boulders: [
        {
          id: "recess",
          name: "Recess Boulder",
          elevation: 62,
          gps: [42.44488, -71.08875],
          mountainProject: "https://www.mountainproject.com/area/109257563/recess-boulder",
          photos: [],
          problems: [
            { name: "Free Period", grade: "V0", status: "" },
            { name: "Hop Scotch", grade: "V2+", status: "" },
            { name: "Sunset Dual Arete", grade: "V3", status: "projecting" },
            { name: "Leap Frog", grade: "V0", status: "" },
            { name: "Undercling Cranker", grade: "V0", status: "" },
          ],
        },
        {
          id: "swamp-slab",
          name: "Swamp Slab",
          elevation: null,          // ← to fill in
          gps: null,                // ← to fill in
          mountainProject: "",      // ← to fill in
          problems: [
            { name: "Swamp Slab", grade: "V0", status: "sent" },
          ],
        },
      ],
    },
  ],

  sessions: [],

  projects: [
    {
      problem: "Sunset Dual Arete",
      boulder: "recess",
      grade: "V3",
      status: "projecting",
      attempts: null,
      sessions: null,
      highPoint: "",
      beta: "",
      started: "",
      sent: "",
    },
  ],

  ticklist: [
    { problem: "Hop Scotch", boulder: "recess" },
    { problem: "Free Period", boulder: "recess" },
    { problem: "Leap Frog", boulder: "recess" },
    { problem: "Undercling Cranker", boulder: "recess" },
  ],
};
