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
                topo           Optional: a real photo of the boulder with each
                               problem's line drawn on it. Shown once src is set.
                                 src    "photos/recess-topo.webp" (my photo, or
                                        one I have permission to use)
                                 credit who took it, if it isn't mine
                                 linesInPhoto  true if the photo already has
                                        the route lines drawn on it (then
                                        lines just lists which problems)
                                 alt    what the picture shows
                                 lines  one per problem: { problem, d, label }
                                        d = the line, in a 1000 × 720 frame
                                        label = [x, y] for its name, plus
                                        "end" or "middle" to anchor it
                               Claude draws the lines when you send a photo.
                topoLink       Optional: someone else's topo photo to link to
                               (never copied): { url, credit }

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
          // Topo photo by Carson Darling, used with his permission (granted 14 Oct 2026)
          topo: {
            src: "photos/recess-topo.webp",
            alt: "Recess Boulder in autumn woods, with three problem lines drawn on it: Hop Scotch in red up the left edge, Sunset Dual Arete in yellow up the middle, Leap Frog in green up the right side.",
            linesInPhoto: true,
            credit: "Carson Darling, used with permission",
            lines: [
              { problem: "Hop Scotch" }, { problem: "Sunset Dual Arete" }, { problem: "Leap Frog" },
            ],
          },
          topoLink: {
            url: "https://www.mountainproject.com/photo/112311362",
            credit: "Topo photo by Carson Darling on Mountain Project, used with permission",
          },
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
