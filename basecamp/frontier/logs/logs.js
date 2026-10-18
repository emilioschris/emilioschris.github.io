/* =========================================================
   MISSION LOGS · data
   ---------------------------------------------------------
   My investigations into cutting-edge technologies and what's
   to come. One entry per log; to add a log, copy an entry,
   give it the next number and fill it in.

   number     "001", "002" … (also its address: logs/#/001)
   title      short name
   question   the one-line question it explores
   opened     date it was opened (YYYY-MM-DD)
   updated    date of the last change (YYYY-MM-DD)
   status     "open" | "ongoing" | "closed"
   telemetry  the small mission labels above its exhibit
   exhibit    an interactive panel drawn by logs/script.js
              ("metals": the metals of the energy transition,
              from FRONTIER.minerals in ../data.js), or null
   findings   [{ text, sources }]: what I've found so far
   openQs     what I still want to find out
   sources    ids in FRONTIER.sources (../data.js); sources
              cited in findings and the exhibit are added too
   Related links come from ../connections.js, under the place
   "frontier:log-001" and so on.
   ========================================================= */

window.MISSION_LOGS = [
  {
    number: "001",
    title: "The metals of the frontier",
    question: "How much metal will the energy transition need, and who controls each step from the mine to the machine?",
    opened: "2026-10-16",
    updated: "2026-10-17",
    status: "ongoing",
    telemetry: ["Mission log", "Sector 01 · The edge"],
    exhibit: "metals",
    findings: [
      { text: "Of the six metals I followed, lithium grows fastest in the IEA's projection: from about 275,000 tonnes of lithium content in 2025 to about 932,000 tonnes in 2040, more than three times as much. Copper adds the most tonnes, from about 27.8 million to about 35 million tonnes of refined copper a year.", sources: ["iea-gcmo-2026"] },
      { text: "Mining is spread more widely than refining. Australia mines about a third of the world's lithium, but China refines about three-quarters of it into lithium chemicals. China also refines about three-quarters of the world's cobalt, about two-thirds of which is mined in the DR Congo.", sources: ["iea-gcmo-2026"] },
      { text: "For battery anodes and motor magnets, one country leads almost every step. China mines about 80% of the world's natural graphite and makes about 94% of its battery-grade graphite; it separates about 84% of the four magnet rare earths and makes nearly 95% of the world's permanent magnets.", sources: ["iea-gcmo-2026", "aa-iea-rare-earths-2026"] },
      { text: "That control is already being used. China put export controls on seven heavy rare earths in April 2025 and on graphite anode materials in October 2025, and the same month the DR Congo brought in an export quota on cobalt.", sources: ["iea-gcmo-2026"] },
      { text: "Every 2040 figure here is a projection, not a fact: the IEA's Stated Policies Scenario, which reflects today's policy settings. Its other scenarios land about 10% lower and 16% higher by 2040.", sources: ["iea-gcmo-2026"] },
    ],
    openQs: [
      "How much of this demand could recycling old batteries, cables and magnets supply?",
      "Which of these metals do Frontier's own technologies need, and how much? A fusion plant would breed its fuel in a lithium blanket; humanoid robots move with rare-earth magnets.",
      "How much would batteries that use less cobalt and nickel, or none at all, change the picture?",
      "Is there a free, reliable price for lithium, so it can join the commodities ticker?",
    ],
    sources: [],
  },
];
