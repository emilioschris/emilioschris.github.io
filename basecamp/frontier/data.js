/* =========================================================
   FRONTIER · your data
   ---------------------------------------------------------
   To add a technology, copy one block in FRONTIER.techs and
   fill it in. Every claim carries the ids of its sources
   (listed in FRONTIER.sources at the bottom).

   A technology has:
     id, name, family      family is an id from FRONTIER.families
     status                "charted" (full page) or "uncharted" (coming)
     tagline               one line
     asOf                  "YYYY-MM-DD": when the facts were last checked
     diagram               which drawing to use (script.js, section 3)
     metrics               [{ value, label, sources }]  the headline numbers
     how                   [{ text, sources }]   how it works
     readiness             { level, label, summary, note, sources }
     milestones            [{ when, text, sources }]  things that have happened (no forecasts)
     economics             [{ heading, text, sources }]
     builders              [{ name, what, url }]
     debates               [{ question, yes, no, search: [...] }]
     fieldNote             null, or "placeholder", or my own words
     compare               { readiness, timeline, barrier, impact, debate }
     flags                 things I'm unsure about, shown on the page
   ========================================================= */

window.FRONTIER = window.FRONTIER || {};

FRONTIER.families = [
  { id: "food", name: "Food and agriculture", tone: "gold", question: "How do we feed more people on less land?" },
  { id: "energy", name: "Energy and climate", tone: "copper", question: "How do we power the world without warming it?" },
  { id: "ai", name: "AI, computing and robotics", tone: "titanium", question: "What happens when machines can think and move?" },
  { id: "bio", name: "Biotech and health", tone: "platinum", question: "What changes when we can edit life itself?" },
];

FRONTIER.eschatia = {
  text: [
    "ἐσχατιά (eschatia) is the ancient Greek word for the farthest part of something: its edge, its border.",
    "Said of land, it meant the frontier country at the edge of a territory; in Attica it could mean an estate out on the boundary.",
    "Herodotus uses it for the far edges of the inhabited world, where his map runs out into the unknown.",
    "This is that edge for technology: the things we are only just learning how to build.",
  ],
  sources: ["lsj-eschatia", "wiktionary-eschatia"],
};

/* The hero's supply chain: rare earths, from mine to machine */
FRONTIER.supply = {
  title: "The rare earth supply chain",
  intro: "Electric cars, wind turbines, robots and data centres run on powerful permanent magnets made from four \"magnet rare earths\": neodymium, praseodymium, dysprosium and terbium. Getting them from the ground into a motor takes four steps, and China dominates each one, most of all the middle.",
  stages: [
    { id: "mine", label: "Mine", detail: "Ore is dug out and concentrated. In 2024 the world mined about 390,000 tonnes of rare earths; China mined about 270,000.", china: 60, chinaLabel: "about 60%", chinaNote: "of mined magnet rare earths", sources: ["usgs-rare-earths-2025", "aa-iea-rare-earths-2026"] },
    { id: "refine", label: "Separate and refine", detail: "The elements are chemically separated from each other into pure oxides and metals: the hardest, most concentrated step.", china: 91, chinaLabel: "over 90%", chinaNote: "of refining", sources: ["aa-iea-rare-earths-2026"] },
    { id: "magnet", label: "Make magnets", detail: "The metals become neodymium-iron-boron magnets, the strongest kind in common use.", china: 94, chinaLabel: "nearly 95%", chinaNote: "of permanent magnets", sources: ["aa-iea-rare-earths-2026", "doe-critical-materials-2023"] },
    { id: "build", label: "Build the future", detail: "The magnets go into EV motors, wind turbine generators, robots and data centres.", china: null, sources: ["doe-critical-materials-2023", "aa-iea-rare-earths-2026"] },
  ],
  note: "When China introduced export controls in 2025, some manufacturers elsewhere faced short-term disruptions.",
  noteSources: ["aa-iea-rare-earths-2026"],
};

FRONTIER.copper = {
  caption: "Cyprus gave copper its name.",
  text: "The Romans called it aes Cyprium, \"metal of Cyprus\", where much of their copper was mined. In Late Latin it became cuprum, and in English, copper.",
  sources: ["wikipedia-copper"],
};

FRONTIER.techs = [
  {
    id: "fusion",
    name: "Fusion power",
    family: "energy",
    status: "charted",
    tagline: "Making energy the way the Sun does, by fusing light atoms together.",
    photo: { src: "img/fusion.webp", alt: "A technician in a clean suit inside the spherical target chamber of the National Ignition Facility, lit blue, reaching towards a long metal positioner.", credit: "Worker inside the target chamber of the National Ignition Facility, Lawrence Livermore National Security, 2008. CC BY-SA 3.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:Worker_inside_the_target_chamber_of_the_National_Ignition_Facility.jpg" },
    asOf: "2026-10-15",
    diagram: "fusion",

    how: [
      { text: "In fusion, two light atomic nuclei merge into a single heavier one, releasing energy. It is what powers the Sun and other stars.", sources: ["doe-fusion"] },
      { text: "Most experimental reactors fuse deuterium and tritium, two heavier forms of hydrogen. The reaction makes a helium nucleus and a fast neutron, and much of the energy leaves with the neutron.", sources: ["wikipedia-fusion-power", "doe-fusion"] },
      { text: "For nuclei to fuse, the fuel has to be a plasma that is hot enough, dense enough and held together long enough, a balance known as the Lawson criterion. ITER plans to heat its plasma to about 150 million kelvin, around ten times the temperature at the Sun's core.", sources: ["wikipedia-fusion-power", "wikipedia-iter"] },
      { text: "There are two main ways to hold it. Magnetic confinement uses powerful magnets to hold the plasma in a ring; the leading design, the tokamak, is shaped like a doughnut. Inertial confinement crushes a tiny fuel pellet with lasers: the National Ignition Facility fires 192 laser beams at a target smaller than a pea.", sources: ["wikipedia-tokamak", "wikipedia-fusion-power", "doe-fusion"] },
      { text: "In a power plant, the neutrons would be caught in a thick blanket of lithium around the core. The blanket heats up and that heat drives a turbine, while the lithium also breeds new tritium fuel.", sources: ["wikipedia-fusion-power"] },
    ],

    metrics: [
      { value: "3.15 MJ", label: "fusion energy from 2.05 MJ of laser light, NIF, Dec 2022", sources: ["llnl-ignition"] },
      { value: "69 MJ", label: "JET's record over about 5 seconds, from about 0.2 mg of fuel, 2023", sources: ["wnn-jet"] },
      { value: "$9.8bn", label: "raised by 53 fusion companies to July 2025 (self-reported)", sources: ["wnn-fia-2025"] },
    ],

    readiness: {
      level: 4,
      label: "Lab demonstrations",
      summary: "Experiments have released more fusion energy than was delivered to the fuel, but only in single laser shots, and no machine has yet produced more electricity than it uses. No fusion power plant exists.",
      note: "The level (1 to 9) is my own reading against NASA's Technology Readiness Level scale, not an official rating.",
      sources: ["llnl-ignition", "wikipedia-nif", "nasa-trl"],
    },

    milestones: [
      { when: "Dec 2022", text: "The National Ignition Facility (California) produced 3.15 MJ of fusion energy from 2.05 MJ of laser light: the first \"ignition\". Running the lasers took far more energy from the grid, around 300 MJ.", sources: ["llnl-ignition", "wikipedia-nif"] },
      { when: "Aug to Oct 2023", text: "JET, the European tokamak in Oxfordshire, set a record of 69 MJ of fusion energy over about 5 seconds in its final experiments, from about 0.2 mg of fuel, before retiring in December 2023. It still used about three times more energy to heat the plasma than it produced.", sources: ["wnn-jet", "gov-jet"] },
      { when: "Feb 2024", text: "A National Ignition Facility shot yielded more than 5 MJ.", sources: ["wikipedia-nif"] },
    ],

    economics: [
      { heading: "Cheap fuel, expensive machines", text: "Fusion fuel costs little, so the price of its electricity would depend mostly on the cost of building and running the plant. No fusion plant has been built, so nobody yet knows what that cost is.", sources: ["wikipedia-fusion-power"] },
      { heading: "Public megaprojects run late and over budget", text: "ITER's initial budget was close to €6 billion; total construction and operation is now projected at €18 to €22 billion, and some outside estimates run higher, which ITER disputes. Its 2024 plan delayed the project by several years.", sources: ["wikipedia-iter", "iter-baseline-2024"] },
      { heading: "Private money is arriving, but needs patience", text: "The 53 companies in the Fusion Industry Association's 2025 survey had raised about $9.8 billion in total, $2.64 billion of it in the year to July 2025. The association's own conclusion is that access to funding is still a major obstacle, given long timelines and heavy capital needs. The figures are self-reported.", sources: ["wnn-fia-2025"] },
      { heading: "Who pays, and who takes the risk", text: "Large technology companies have signed up as first customers before any plant exists: Microsoft with Helion, Google with Commonwealth Fusion Systems. In effect, buyers who want firm, carbon-free power are taking on part of the technology risk in return for early access. That reading is mine, based on the deals.", sources: ["cnbc-helion", "spglobal-google-cfs"] },
      { heading: "Regulation is being written now", text: "The UK's Energy Act 2023 took fusion out of the regime for fission: fusion plants will not need a nuclear site licence and will be regulated by the Health and Safety Executive and the Environment Agency, on the grounds that the hazards are much lower and there is no risk of a runaway reaction.", sources: ["gov-uk-fusion-regulation", "engnews-uk-fusion"] },
      { heading: "The fuel supply problem", text: "Tritium is scarce on Earth and decays, with a half-life of about 12.3 years. Today's commercial supply is a by-product of CANDU fission reactors, so a power plant would have to breed its own tritium in lithium blankets, and breed slightly more than it burns.", sources: ["wikipedia-fusion-power", "iaea-tritium-slides"] },
    ],

    builders: [
      { name: "ITER", what: "The international tokamak under construction in southern France, backed by China, the EU, India, Japan, Korea, Russia and the US.", url: "https://www.iter.org/" },
      { name: "National Ignition Facility (Lawrence Livermore National Laboratory)", what: "The US laser fusion facility that first reached ignition in 2022.", url: "https://lasers.llnl.gov/" },
      { name: "UK Atomic Energy Authority", what: "Ran JET at Culham until it retired in 2023.", url: "https://www.gov.uk/government/organisations/uk-atomic-energy-authority" },
      { name: "Commonwealth Fusion Systems", what: "MIT spin-out building SPARC, a demonstration tokamak in Massachusetts.", url: "https://cfs.energy/" },
      { name: "Helion", what: "Private company with the first fusion power purchase agreement, with Microsoft.", url: "https://www.helionenergy.com/" },
      { name: "Pacific Fusion", what: "US company that raised a $900 million Series A, one of the largest rounds in the 2025 industry report.", url: "https://www.pacificfusion.com/" },
      { name: "Fusion Industry Association", what: "The industry's trade body; publishes the annual global fusion industry report.", url: "https://www.fusionindustryassociation.org/" },
    ],

    debates: [
      {
        question: "Will fusion arrive in time to matter for climate goals?",
        yes: "Private companies are racing to build the first power plants, and big buyers are already signing contracts. If those plants work, fusion could add firm, carbon-free power just as demand for it grows.",
        no: "No machine has yet produced net electricity, and public projects such as ITER have slipped by years. On that view, most near-term emission cuts will have to come from technologies that already exist.",
        search: ["\"fusion power timeline climate 2050\"", "\"fusion energy too late for climate change\"", "\"fusion power plant deployment rate 2040s\""],
      },
      {
        question: "Does \"ignition\" mean fusion now makes net energy?",
        yes: "In 2022 the National Ignition Facility got more energy out of the fuel than its lasers put in, 3.15 MJ from 2.05 MJ. That proved the physics of a self-heating fusion reaction for the first time.",
        no: "Counting the energy taken from the grid to run the lasers, about 300 MJ, the shot produced less than 1% of what the facility used. A power plant needs gain on that whole-plant, or \"wall-plug\", basis.",
        search: ["\"NIF ignition wall-plug efficiency\"", "\"scientific gain vs engineering gain fusion\"", "\"fusion Q engineering breakeven\""],
      },
      {
        question: "Can fusion ever compete on cost with renewables and storage?",
        yes: "Fusion would offer steady, around-the-clock power on a small footprint with almost free fuel, which can be worth more to a grid than cheaper but weather-dependent power.",
        no: "With fuel nearly free, everything rides on capital cost, and no one has built a fusion plant to show what it costs, while solar, wind and batteries are already cheap and widely built.",
        search: ["\"fusion levelized cost of electricity estimate\"", "\"fusion vs renewables plus storage cost\"", "\"fusion power plant capital cost per kW\""],
      },
      {
        question: "Is there enough tritium to start a fusion industry?",
        yes: "Supporters argue it is an engineering problem, not a resource limit: once early plants breed a little more tritium than they burn, the surplus can start the next ones.",
        no: "Commercial tritium comes almost entirely from CANDU fission reactors, the stock is limited and decays, and breeding needs blankets that have never been proven at scale, with only a thin margin to spare.",
        search: ["\"fusion tritium supply CANDU\"", "\"tritium breeding ratio blanket\"", "\"lithium-6 enrichment fusion\""],
      },
      {
        question: "Public megaprojects or a private race?",
        yes: "Private companies move faster, take more design risks and are attracting billions, so many smaller bets may get to a working plant sooner than one giant international project.",
        no: "Private timelines have a habit of slipping too, and the shared science behind them, from ITER, JET and national labs, came from patient public funding. Fusion may still need both.",
        search: ["\"ITER delay cost overrun 2024\"", "\"private fusion companies timelines realistic\"", "\"global fusion industry report 2025 funding\""],
      },
    ],

    fieldNote: null,

    compare: {
      readiness: "Lab demonstrations (TRL 4, my reading)",
      timeline: "First \"ignition\" in a lab in 2022; no plant yet produces electricity",
      barrier: "Very high capital cost, and proving net electricity",
      impact: "Firm, carbon-free power from abundant fuel, with little long-lived waste",
      debate: "Will it arrive in time to matter for climate goals?",
    },
    compareSources: ["wikipedia-fusion-power", "iter-baseline-2024", "mit-cfs-arc"],

    flags: [
      "The grid energy used for the 2022 NIF shot is given as about 300 MJ in one place and about 400 MJ in another in the same source; I've used \"around 300 MJ\".",
          "I've left out how the US will regulate fusion: I couldn't confirm the Nuclear Regulatory Commission's position and date from a source I could read.",
      "The tritium supply facts come partly from conference slides rather than peer-reviewed papers.",
    ],
  },

  { id: "vertical-farming", name: "Vertical farming and hydroponics", family: "food", status: "uncharted", tagline: "Growing crops indoors, in stacked layers, without soil.", photo: { src: "img/vertical-farming.webp", alt: "A long aisle of stacked shelves of leafy greens growing under white light in an indoor vertical farm.", credit: "Vertical farm, ifarm.fi, Finland, 2020. CC BY-SA 4.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:IFarm.fi_Vertical_farm_Finland.jpg" }, fieldNote: "placeholder" },
  { id: "humanoid-robots", name: "Humanoid robots", family: "ai", status: "uncharted", tagline: "General-purpose robots built in a human shape.", photo: { focus: "50% 12%", src: "img/humanoid-robots.webp", alt: "A white and black humanoid robot, Tesla's Optimus, standing among a crowd of people at an evening event.", credit: "Latest Tesla Optimus humanoid robot, Steve Jurvetson, 2024. CC BY 2.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:Latest_Tesla_Optimus_Humanoid_Robot.jpg" }, },
  { id: "crispr", name: "CRISPR gene editing", family: "bio", status: "uncharted", tagline: "Precise, programmable edits to DNA.", photo: { src: "img/crispr.webp", alt: "A 3D rendering of the Cas9 protein, a white bumpy molecule, gripping an orange guide RNA and a strand of target DNA.", credit: "Cas9 protein structure (PDB 5AXW), Thomas Splettstoesser (scistyle.com), 2016. CC BY-SA 4.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:Cas9_5AXW.png" }, },
];


/* The stock ticker: listed companies involved in each technology.
   Prices come from ticker-data.js, written by a scheduled job. */
FRONTIER.stocks = [
  { symbol: "MSFT", name: "Microsoft", tech: "fusion", why: "Helion fusion power deal", sources: ["cnbc-helion"] },
  { symbol: "GOOGL", name: "Alphabet", tech: "fusion", why: "Buying power from CFS's ARC plant", sources: ["spglobal-google-cfs"] },
  { symbol: "TSLA", name: "Tesla", tech: "humanoid-robots", why: "Optimus humanoid robot", sources: ["wikipedia-optimus"] },
  { symbol: "NVDA", name: "Nvidia", tech: "humanoid-robots", why: "Isaac GR00T humanoid robot model", sources: ["wikipedia-nvidia"] },
  { symbol: "CRSP", name: "CRISPR Therapeutics", tech: "crispr", why: "Co-developed Casgevy, the first approved CRISPR therapy", sources: ["wikipedia-casgevy", "wikipedia-crispr-therapeutics"] },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals", tech: "crispr", why: "Co-developed Casgevy", sources: ["wikipedia-casgevy"] },
  { symbol: "NTLA", name: "Intellia Therapeutics", tech: "crispr", why: "CRISPR therapies given directly into the body", sources: ["wikipedia-intellia"] },
];

FRONTIER.sources = {
  "lsj-eschatia": { title: "Liddell, Scott and Jones, A Greek-English Lexicon: ἐσχατιά", publisher: "Perseus Digital Library", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=e)sxatia/" },
  "wiktionary-eschatia": { title: "ἐσχατιά", publisher: "Wiktionary", url: "https://en.wiktionary.org/wiki/%E1%BC%90%CF%83%CF%87%CE%B1%CF%84%CE%B9%CE%AC" },
  "wikipedia-copper": { title: "Copper (Etymology), revision 1374343138", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Copper&oldid=1374343138" },
  "doe-fusion": { title: "DOE Explains: Nuclear Fusion Reactions", publisher: "US Department of Energy, Office of Science", url: "https://www.energy.gov/science/doe-explainsnuclear-fusion-reactions" },
  "wikipedia-fusion-power": { title: "Fusion power, revision 1378635800", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Fusion_power&oldid=1378635800" },
  "wikipedia-iter": { title: "ITER, revision 1380390244", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=ITER&oldid=1380390244" },
  "wikipedia-tokamak": { title: "Tokamak, revision 1377863087", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Tokamak&oldid=1377863087" },
  "wikipedia-nif": { title: "National Ignition Facility, revision 1374804524", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=National_Ignition_Facility&oldid=1374804524" },
  "llnl-ignition": { title: "Lawrence Livermore National Laboratory achieves fusion ignition", publisher: "LLNL", url: "https://www.llnl.gov/article/49306/lawrence-livermore-national-laboratory-achieves-fusion-ignition" },
  "nasa-trl": { title: "Technology Readiness Levels", publisher: "NASA", url: "https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/" },
  "wnn-jet": { title: "New world record set in JET's final fusion experiments", publisher: "World Nuclear News", url: "https://world-nuclear-news.org/Articles/New-world-record-set-in-JET-s-final-fusion-experim" },
  "gov-jet": { title: "JET's final tritium experiments yield new fusion energy record", publisher: "GOV.UK", url: "https://www.gov.uk/government/news/jets-final-tritium-experiments-yield-new-fusion-energy-record" },
  "mit-cfs-arc": { title: "MIT spinout Commonwealth Fusion Systems unveils plans for the world's first fusion power plant (Dec 2024)", publisher: "MIT News", url: "https://news.mit.edu/2024/commonwealth-fusion-systems-unveils-worlds-first-fusion-power-plant-1217" },
  "nnn-sparc": { title: "SPARC (Commonwealth Fusion Systems): fusion project status", publisher: "Nuclear News Network tracker", url: "https://www.nuclearnewsnetwork.com/industry-trackers/fusion-energy-companies/cfs-sparc" },
  "cnbc-helion": { title: "Microsoft agrees to buy electricity generated from fusion company Helion in 2028 (May 2023)", publisher: "CNBC", url: "https://www.cnbc.com/2023/05/10/microsoft-agrees-to-buy-power-from-sam-altman-backed-helion-in-2028.html" },
  "spglobal-google-cfs": { title: "Google signs deal for 200 MW from nuclear fusion project in Virginia (June 2025)", publisher: "S&P Global Market Intelligence", url: "https://www.spglobal.com/market-intelligence/en/news-insights/articles/2025/6/google-signs-deal-for-200-mw-from-nuclear-fusion-project-in-virginia-91242529" },
  "iter-baseline-2024": { title: "Baseline 2024: press conference summary (July 2024)", publisher: "ITER Organization", url: "https://iter.org/sites/default/files/media/2024-07/baseline_press_conference_summary_july-2024_b.pdf" },
  "wnn-fia-2025": { title: "Access to funding remains a major issue for fusion, says industry report (July 2025)", publisher: "World Nuclear News", url: "https://world-nuclear-news.org/articles/access-to-funding-remains-a-major-issue-for-fusion-says-fia" },
  "gov-uk-fusion-regulation": { title: "Energy Security Bill factsheet: fusion regulation", publisher: "GOV.UK", url: "https://www.gov.uk/government/publications/energy-security-bill-factsheets/energy-security-bill-factsheet-fusion-regulation" },
  "engnews-uk-fusion": { title: "UK creating regulatory framework for nuclear fusion plants (May 2024)", publisher: "Engineering News", url: "https://engineeringnews.co.za/print-version/uk-creating-regulatory-framework-for-nuclear-fusion-plants-simpler-easier-than-for-fission-2024-05-14" },
  "iaea-tritium-slides": { title: "Resource availability and supply (R. J. Pearson, IAEA meeting, June 2022)", publisher: "IAEA conference slides", url: "https://conferences.iaea.org/event/285/contributions/22687/attachments/11981/19520/IAEA%20Resource%20availability%20&%20supply%20RJPearson_8June2022.pdf" },
  "wikipedia-nvidia": { title: "Nvidia, revision 1380193071", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Nvidia&oldid=1380193071" },
  "wikipedia-optimus": { title: "Optimus (robot), revision 1379711096", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Optimus_(robot)&oldid=1379711096" },
  "wikipedia-casgevy": { title: "Exagamglogene autotemcel (Casgevy), revision 1376826291", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Exagamglogene_autotemcel&oldid=1376826291" },
  "wikipedia-crispr-therapeutics": { title: "CRISPR Therapeutics, revision 1378836944", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=CRISPR_Therapeutics&oldid=1378836944" },
  "wikipedia-intellia": { title: "Intellia Therapeutics, revision 1359551050", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Intellia_Therapeutics&oldid=1359551050" },
  "usgs-rare-earths-2025": { title: "Mineral Commodity Summaries 2025: Rare earths", publisher: "U.S. Geological Survey", url: "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-rare-earths.pdf" },
  "aa-iea-rare-earths-2026": { title: "International Energy Agency warns rare earth supply diversification lags rising global demand (8 April 2026), reporting the IEA's rare earths analysis", publisher: "Anadolu Agency", url: "https://aa.com.tr/en/economy/international-energy-agency-warns-rare-earth-supply-diversification-lags-rising-global-demand/3898514" },
  "doe-critical-materials-2023": { title: "Critical Materials Assessment (July 2023)", publisher: "U.S. Department of Energy", url: "https://www.energy.gov/sites/default/files/2023-07/doe-critical-material-assessment_07312023.pdf" },
};
