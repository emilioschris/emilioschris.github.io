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

/* The metals of the energy transition (the interactive panel below the hero).
   Every number is copied as-is from the IEA's Global Critical Minerals
   Outlook 2026, Annex "Key projection results" (kt = thousand tonnes);
   the page works out the shares and growth itself.
     demand    total demand in 2025, and in 2040 in the IEA's Stated
               Policies Scenario (STEPS, today's policy settings).
               2040 is a PROJECTION: Frontier's one exception to its
               no-predictions rule, agreed 16 Oct 2026, always labelled.
     clean     share of demand from clean energy, 2025 and 2040 (STEPS)
     mine      top mining country and its 2025 output, and world output
     refine    the same for refining
     make      what the refined metal becomes; share = the top
               country's share of that step, where a source gives one */
FRONTIER.minerals = {
  title: "The metals of the energy transition",
  intro: "Electric cars, power grids, wind turbines and batteries are built from a handful of metals, and each one has to be dug up, refined and made into parts first. Pick a metal to follow it from the ground to the machine, and see how much more of it the IEA projects the world will use.",
  projection: "Projections are the IEA's Stated Policies Scenario, which reflects today's policy settings. They are projections, not facts: the IEA's other scenarios land about 10% lower and 16% higher by 2040.",
  sources: ["iea-gcmo-2026"],
  metals: [
    { id: "lithium", symbol: "Li", number: 3, name: "Lithium", tone: "titanium",
      use: "The light metal in rechargeable batteries, for electric cars and grid storage.",
      unit: "of lithium content", demand: [275, 932], clean: [74, 90],
      mine: { top: "Australia", kt: 104, world: 302 }, refine: { top: "China", kt: 235, world: 319, what: "into lithium chemicals" },
      make: { what: "Battery cathodes" }, build: "Electric car batteries and grid storage",
      fact: "Lithium shows the strongest growth of any of these metals. Its price roughly doubled between January 2025 and April 2026, after falling through 2023 and 2024." },
    { id: "cobalt", symbol: "Co", number: 27, name: "Cobalt", tone: "platinum",
      use: "Used in many battery cathodes, alongside nickel.",
      unit: "", demand: [259, 343], clean: [35, 41],
      mine: { top: "the DR Congo", kt: 210, world: 320 }, refine: { top: "China", kt: 180, world: 238 },
      make: { what: "Battery cathodes" }, build: "Electric car batteries",
      fact: "Growth is gentler than for lithium because more batteries now use lithium iron phosphate (LFP), which needs no cobalt. In October 2025 the DR Congo, which mines about two-thirds of the world's cobalt, brought in an export quota; cobalt prices rose by around 130% between January 2025 and April 2026." },
    { id: "nickel", symbol: "Ni", number: 28, name: "Nickel", tone: "platinum",
      use: "Used in many battery cathodes, and in steel.",
      unit: "", demand: [3532, 5832], clean: [18, 41],
      mine: { top: "Indonesia", kt: 2637, world: 4207 }, refine: { top: "Indonesia", kt: 1681, world: 3729 },
      make: { what: "Battery cathodes" }, build: "Electric car batteries and grid storage",
      fact: "Most nickel still goes to other uses today, with clean energy taking about 18%. In the IEA's projection that share rises to about 40% by 2040." },
    { id: "copper", symbol: "Cu", number: 29, name: "Copper", tone: "copper",
      use: "Carries the electricity: wires, cables, motors and solar panels.",
      unit: "of refined copper", demand: [27775, 34984], clean: [29, 37],
      mine: { top: "Chile", kt: 5485, world: 23227 }, refine: { top: "China", kt: 13069, world: 27955 },
      make: { what: "Wire, cable and foil" }, build: "Power grids, electric cars and solar panels",
      fact: "Copper adds the most tonnes of any of these metals, about 7 million more a year by 2040. Mines that exist or are planned would supply about 25% less than the projected need in 2035." },
    { id: "graphite", symbol: "C", number: 6, name: "Graphite", tone: "titanium",
      use: "A form of carbon, used for the anode: the negative side of a lithium-ion battery.",
      unit: "natural and synthetic", demand: [5779, 10947], clean: [43, 53],
      mine: { top: "China", kt: 1432, world: 1781, what: "natural graphite" }, refine: { top: "China", kt: 2139, world: 2266, what: "into battery-grade graphite" },
      make: { what: "Battery anodes" }, build: "Electric car batteries and grid storage",
      fact: "In October 2025 China announced export controls on graphite anode materials. The IEA estimates that if battery-grade graphite trade were fully cut off, over USD 300 billion a year of production outside China would be at risk." },
    { id: "rare-earths", symbol: "Nd", number: 60, name: "Magnet rare earths", tone: "gold",
      use: "Neodymium, praseodymium, dysprosium and terbium make the strongest permanent magnets.",
      unit: "of the four magnet rare earths", demand: [93, 140], clean: [22, 32],
      mine: { top: "China", kt: 47, world: 80 }, refine: { top: "China", kt: 75, world: 89, what: "by separating the four elements" },
      make: { what: "Permanent magnets", top: "China", share: 94, shareLabel: "nearly 95%", sources: ["aa-iea-rare-earths-2026"] },
      build: "Electric car motors and wind turbine generators",
      fact: "In April 2025 China put export controls on seven heavy rare earths, and some carmakers had to slow or stop production. Rare earths are the one market where refining became less concentrated in 2025, thanks to new plants in the United States and Malaysia." },
  ],
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

  {
    id: "vertical-farming",
    name: "Vertical farming and hydroponics",
    family: "food",
    status: "charted",
    tagline: "Growing crops indoors, in stacked layers, without soil.",
    photo: { src: "img/vertical-farming.webp", alt: "A long aisle of stacked shelves of leafy greens growing under white light in an indoor vertical farm.", credit: "Vertical farm, ifarm.fi, Finland, 2020. CC BY-SA 4.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:IFarm.fi_Vertical_farm_Finland.jpg" },
    asOf: "2026-10-16",
    diagram: "vertical-farming",

    how: [
      { text: "A vertical farm grows crops indoors on shelves stacked in layers, in a warehouse, a purpose-built building or even a shipping container, under LED lights instead of the sun. It is one kind of controlled-environment agriculture, in which temperature, humidity, light and water are all managed by machines.", sources: ["wikipedia-vertical-farming", "wikipedia-cea"] },
      { text: "Most vertical farms use hydroponics: there is no soil, and the roots are fed by water with mineral nutrients dissolved in it. In the common nutrient film technique, a shallow stream of nutrient solution runs past bare roots in a gently sloping channel and is pumped back round; aeroponic farms spray the roots with a nutrient mist instead.", sources: ["wikipedia-hydroponics"] },
      { text: "Because the water goes round in a loop, very little is lost. A modelling study of lettuce in Yuma, Arizona estimated about 20 litres of water per kilogram for hydroponic lettuce, against about 250 litres in the field, and about 11 times the yield per square metre.", sources: ["barbosa-2015"] },
      { text: "The catch is light. Indoors, all the light for photosynthesis comes from electricity. Plants mainly use red and blue light, so farms tune their LEDs to save power, but lighting remains the biggest cost: the same Arizona study put hydroponic lettuce at about 82 times the energy per kilogram of field lettuce.", sources: ["wikipedia-vertical-farming", "barbosa-2015"] },
      { text: "So far the crops that pay are small, fast and perishable: leafy greens, herbs, microgreens and, more recently, strawberries. Staple crops are another matter: a 2020 study found wheat could yield hundreds of times more per hectare in a 10-layer indoor farm, but at a cost far above its market price.", sources: ["wikipedia-vertical-farming", "wikipedia-oishii", "asseng-2020"] },
    ],

    metrics: [
      { value: "11×", label: "lettuce yield per square metre, hydroponic against field, in a modelling study (Arizona, 2015)", sources: ["barbosa-2015"] },
      { value: "82×", label: "the energy per kilogram of field lettuce, in the same study", sources: ["barbosa-2015"] },
      { value: "$700m+", label: "raised by Bowery Farming before it shut down in November 2024", sources: ["techcrunch-bowery"] },
    ],

    readiness: {
      level: 8,
      label: "Commercial, but fragile",
      summary: "Indoor farms have sold leafy greens, herbs and strawberries commercially for years, so the growing technology works. What is unproven is the business: several of the best-funded US companies shut down or went through bankruptcy between 2023 and 2025. For staple crops such as wheat, it exists only in research.",
      note: "The level (1 to 9) is my own reading against NASA's Technology Readiness Level scale, not an official rating. For leafy greens the growing systems are proven in operation; I've kept it at 8 because the farms have not yet shown they can run profitably at scale.",
      sources: ["techcrunch-bowery", "wikipedia-aerofarms", "verticalfarmdaily-plenty", "asseng-2020", "nasa-trl"],
    },

    milestones: [
      { when: "1999", text: "Dickson Despommier, a professor at Columbia University, and his students proposed a skyscraper farm that could feed 50,000 people. It was never built, but it popularised the idea.", sources: ["wikipedia-vertical-farming"] },
      { when: "2012", text: "Sky Greens opened a three-storey farm in Singapore, described as the world's first commercial vertical farm.", sources: ["wikipedia-vertical-farming"] },
      { when: "Aug 2015", text: "Astronauts Scott Kelly, Kjell Lindgren and Kimiya Yui ate red romaine lettuce grown in NASA's Veggie plant growth system on the International Space Station.", sources: ["sciam-veggie"] },
      { when: "Jun 2023", text: "AeroFarms, one of the best-known US vertical farms, filed for Chapter 11 bankruptcy. It emerged in September 2023, cutting back to its farm in Danville, Virginia.", sources: ["wikipedia-aerofarms"] },
      { when: "Nov 2024", text: "Bowery Farming, which had raised more than $700 million and was valued at over $2 billion in 2021, shut down.", sources: ["techcrunch-bowery"] },
      { when: "Mar 2025", text: "Plenty filed for Chapter 11 bankruptcy, keeping its vertical strawberry farm in Richmond, Virginia running.", sources: ["verticalfarmdaily-plenty"] },
      { when: "Apr 2025", text: "Freight Farms, which pioneered container farms and had installed more than 600 of them, ceased operations and filed for Chapter 7 bankruptcy. Its customers were warned that its cloud software might stop working.", sources: ["hortidaily-freight-farms", "wikipedia-freight-farms"] },
    ],

    economics: [
      { heading: "Electricity instead of sunlight", text: "A field or a greenhouse gets its light free; a vertical farm buys all of it. Researchers at Wageningen found that closed plant factories can be more efficient than greenhouses overall, and use less water, CO2 and land, but that greenhouses need far less purchased energy because they use the sun. Which wins depends on local energy prices and climate.", sources: ["graamans-2018", "barbosa-2015"] },
      { heading: "High fixed costs, cheap competition", text: "Farms are expensive to build and run, and they compete with field lettuce that is cheap and abundant. Even a modelled indoor wheat farm with yields hundreds of times higher than a field would cost about 46 times what its grain earns, with electricity for lighting more than half the cost.", sources: ["wikipedia-vertical-farming", "asseng-2020"] },
      { heading: "A funding boom, then a bust", text: "Investors poured money in while interest rates were low. AgFunder's \"novel farming systems\" category, which includes vertical farms and greenhouses as well as insect farming, aquaculture and algae, raised $2.8 billion in 2022 and $680 million in 2023, partly because of large market corrections in indoor farming.", sources: ["agfunder-2023"] },
      { heading: "Who pays, and who benefits", text: "The farms that survive sell premium products: Oishii's Japanese strawberries started at $50 for a tray of eight. The clearest economic case is where land, water or transport are expensive, such as remote northern towns like Churchill, Manitoba, where container farms supply fresh produce year-round. So far, much of the cost of the experiment has been carried by venture investors. That reading is mine.", sources: ["wikipedia-oishii", "wikipedia-vertical-farming"] },
      { heading: "Organic or not depends where you are", text: "EU organic rules require crops to grow in living soil and prohibit hydroponic production. In the US, the Department of Agriculture lets hydroponic produce be certified organic, and in 2022 a federal appeals court left that in place. The US also offers grants for urban farms, which it defines to include vertical and hydroponic farms.", sources: ["eu-organic-2018-848", "nalc-organic-hydroponics", "farmers-gov-urban"] },
    ],

    builders: [
      { name: "80 Acres Farms", what: "US indoor farming company; in 2025 it merged with Soil Organics, running seven vertical farms.", url: "https://www.80acresfarms.com/" },
      { name: "AeroFarms", what: "Aeroponic farm in Danville, Virginia, growing microgreens; restructured in 2023.", url: "https://www.aerofarms.com/" },
      { name: "Plenty", what: "Runs a vertical strawberry farm in Richmond, Virginia; restructured in 2025.", url: "https://www.plenty.ag/" },
      { name: "Oishii", what: "Grows Japanese strawberries and cherry tomatoes in vertical farms in New Jersey.", url: "https://oishii.com/" },
      { name: "Gotham Greens", what: "The greenhouse alternative: hydroponic greenhouses across the US, lit mainly by the sun.", url: "https://www.gothamgreens.com/" },
      { name: "Wageningen University & Research", what: "Dutch research centre for greenhouse and indoor horticulture; its researchers compared plant factories with greenhouses.", url: "https://www.wur.nl/en/research/plant/future-proof-greenhouse-horticulture" },
      { name: "NASA: growing plants in space", what: "The Veggie and Advanced Plant Habitat systems on the International Space Station.", url: "https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/" },
      { name: "USDA urban agriculture", what: "US grants and support for urban farms, including vertical and hydroponic farms.", url: "https://www.farmers.gov/your-business/urban-growers" },
    ],

    debates: [
      {
        question: "Is vertical farming good for the climate?",
        yes: "It needs a fraction of the land and water, uses no soil, few or no pesticides and loses no fertiliser to rivers. Land freed from farming could go back to nature, and food can be grown where people live.",
        no: "It swaps free sunlight for electricity. Unless that power is low-carbon, a kilo of indoor lettuce can mean more emissions than one grown in a field or a greenhouse, and food miles turn out to be a small part of food's footprint.",
        search: ["\"vertical farm carbon footprint lettuce\"", "\"plant factory vs greenhouse energy use\"", "\"food miles share of food emissions\""],
      },
      {
        question: "Could it ever grow staple crops and help feed the world?",
        yes: "A 2020 study measured wheat yields of about 700 tonnes per hectare in a 10-layer indoor facility, against a world field average of 3.2. Indoor farms are also immune to drought, floods and heat waves, a hedge as the climate changes.",
        no: "The same study found indoor wheat would cost far more than it sells for, and calories need a lot of light. Greens are mostly water and sell at a premium; wheat, rice and maize are cheap and grown on a vast scale under free sunlight.",
        search: ["\"indoor vertical farming wheat yield cost\"", "\"vertical farming staple crops calories\"", "\"Asseng vertical wheat PNAS\""],
      },
      {
        question: "Was the boom just a venture-capital bubble?",
        yes: "Billions went in when money was cheap, valuations soared, and some of the biggest names shut down or went bankrupt within a few years, often after expanding before they had shown a profitable farm.",
        no: "The failures were mostly about business models and cheap capital ending, not the technology. Survivors are focusing on premium crops, smaller footprints and lower energy costs, and LEDs keep getting more efficient.",
        search: ["\"why vertical farms failed Bowery AeroFarms\"", "\"vertical farming profitability 2025\"", "\"indoor farming investment decline AgFunder\""],
      },
      {
        question: "Vertical farms or high-tech greenhouses?",
        yes: "A sealed vertical farm controls everything, can stack many layers on a small plot and can be built anywhere, from a city warehouse to a desert or the Arctic.",
        no: "Greenhouses use free sunlight and need far less bought energy; in most climates a modern hydroponic greenhouse grows the same crops more cheaply, and companies like Gotham Greens have grown that way.",
        search: ["\"greenhouse vs vertical farm economics\"", "\"plant factories versus greenhouses resource use efficiency\"", "\"hydroponic greenhouse lettuce cost per kg\""],
      },
      {
        question: "Should hydroponic produce be allowed to be called organic?",
        yes: "Organic is about avoiding synthetic pesticides and caring for the environment, and hydroponic farms can do that. US regulators judged hydroponics compatible with organic principles.",
        no: "Organic farming was built on feeding the soil, and many organic farmers say soilless produce dilutes the label. The EU agrees and bans hydroponics from organic certification.",
        search: ["\"hydroponic organic certification debate\"", "\"EU organic regulation hydroponics ban\"", "\"Center for Food Safety hydroponic organic lawsuit\""],
      },
    ],

    fieldNote: "placeholder",

    compare: {
      readiness: "Commercial for greens, herbs and some berries (TRL 8, my reading)",
      timeline: "Selling greens commercially since the 2010s; several big US firms failed or restructured from 2023 to 2025",
      barrier: "Electricity and building costs, against cheap field-grown produce",
      impact: "Fresh produce near cities with far less land and water",
      debate: "Can it ever pay its way beyond premium greens?",
    },
    compareSources: ["wikipedia-vertical-farming", "barbosa-2015", "techcrunch-bowery"],

    flags: [
      "The 11× yield, 20 L against 250 L of water and 82× energy figures come from a 2015 modelling study of a hydroponic greenhouse with extra lighting in Arizona, not measurements from a fully indoor vertical farm.",
      "AgFunder's investment figures cover a wider category than vertical farming (also greenhouses, insect farming, aquaculture and algae).",
      "Bowery's total funding: TechCrunch says more than $700 million; Wikipedia says $472 million. I've used TechCrunch.",
      "Freight Farms' filing date: April 30, 2025 in the trade press (from the company's own email) and May 1 on Wikipedia. I've used April.",
      "Sky Greens as \"the world's first commercial vertical farm\" is Wikipedia's description; I couldn't check it against another source.",
      "I couldn't open the full Wageningen paper, so I've used only what its abstract says, not its electricity figures.",
    ],
  },
  {
    id: "humanoid-robots",
    name: "Humanoid robots",
    family: "ai",
    status: "charted",
    tagline: "General-purpose robots built in a human shape.",
    photo: { focus: "50% 12%", src: "img/humanoid-robots.webp", alt: "A white and black humanoid robot, Tesla's Optimus, standing among a crowd of people at an evening event.", credit: "Latest Tesla Optimus humanoid robot, Steve Jurvetson, 2024. CC BY 2.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:Latest_Tesla_Optimus_Humanoid_Robot.jpg" },
    asOf: "2026-10-16",
    diagram: "humanoid-robots",

    how: [
      { text: "A humanoid robot has a torso, a head, two arms and usually two legs, so that it can work in places and with tools built for people. Some designs keep only the upper body on a wheeled base, which removes the risk of falling over.", sources: ["wikipedia-humanoid-robot"] },
      { text: "Its joints are moved by actuators, the robot's muscles. Most humanoids now use electric motors with compact gearboxes or screws; Boston Dynamics retired its famous hydraulic Atlas in 2024 and replaced it with an all-electric one. A modern humanoid has dozens of joints: Figure's latest model has 60, 20 of them in each hand.", sources: ["wikipedia-humanoid-robot", "wikipedia-atlas", "wikipedia-figure-ai"] },
      { text: "Sensors tell it where it is and what it touches: cameras and depth sensors to see, accelerometers and tilt sensors to keep its balance, force sensors in the feet and hands, and touch sensors in the fingertips.", sources: ["wikipedia-humanoid-robot", "wikipedia-figure-ai"] },
      { text: "Walking on two legs is a constant balancing act. Controllers keep the robot's weight over its feet, using measures such as the zero moment point, while whole-body control coordinates every joint at once.", sources: ["wikipedia-humanoid-robot"] },
      { text: "The new part is the AI. Companies now train vision-language-action models, which take in camera images and spoken or written instructions and output movements, learning from human demonstrations and simulation instead of being programmed task by task. Many public demonstrations still rely partly on a human operator controlling the robot remotely.", sources: ["wikipedia-figure-ai", "wikipedia-optimus", "wikipedia-1x"] },
    ],

    metrics: [
      { value: "$16,000", label: "about the price of Unitree's G1 humanoid, released in 2024", sources: ["wikipedia-unitree"] },
      { value: "74%", label: "of Unitree's humanoid revenue came from research and education customers in the first nine months of 2025; 9% from industry", sources: ["wikipedia-unitree"] },
      { value: "$39bn", label: "Figure AI's valuation after it raised over $1 billion in September 2025", sources: ["wikipedia-figure-ai"] },
    ],

    readiness: {
      level: 6,
      label: "Early pilots",
      summary: "Humanoids are working in a few real warehouses and factories, mostly in trials and paid pilots, and are sold to researchers. Many public demonstrations still use remote control, and no humanoid is yet doing general work in homes on its own.",
      note: "The level (1 to 9) is my own reading against NASA's Technology Readiness Level scale, not an official rating: prototypes demonstrated in real working environments. Some deployments, such as Agility's Digit at GXO, arguably reach level 7.",
      sources: ["wikipedia-agility", "wikipedia-unitree", "wikipedia-optimus", "wikipedia-1x", "nasa-trl"],
    },

    milestones: [
      { when: "Oct 2000", text: "Honda unveiled ASIMO, the best-known walking humanoid of its time. Honda stopped developing it in 2018 and retired it in 2022.", sources: ["wikipedia-asimo"] },
      { when: "Jul 2013", text: "Boston Dynamics unveiled Atlas, a hydraulic humanoid funded by the US defence research agency DARPA for search and rescue; Atlas robots competed in the DARPA Robotics Challenge.", sources: ["wikipedia-atlas"] },
      { when: "Aug 2021", text: "Tesla announced Optimus; prototypes walked on stage in September 2022.", sources: ["wikipedia-optimus"] },
      { when: "Apr 2024", text: "Boston Dynamics retired the hydraulic Atlas and the next day unveiled a fully electric one, designed for industry.", sources: ["wikipedia-atlas"] },
      { when: "2024", text: "Agility Robotics and GXO Logistics signed the first humanoid Robot-as-a-Service contract, for Digit robots handling goods in a warehouse near Atlanta.", sources: ["wikipedia-agility"] },
      { when: "Aug 2024", text: "Unitree released the G1 humanoid at about $16,000.", sources: ["wikipedia-unitree"] },
      { when: "Oct 2024", text: "At Tesla's \"We, Robot\" event, Optimus robots served drinks and chatted with guests; critics pointed out they were mainly teleoperated.", sources: ["wikipedia-optimus"] },
      { when: "Aug 2025", text: "Beijing hosted the first World Humanoid Robot Games, with more than 500 robots from 280 teams.", sources: ["wikipedia-humanoid-robot"] },
      { when: "Oct 2025", text: "1X opened pre-orders for NEO, a humanoid for the home, at $20,000 or $499 a month; a reviewer found most tasks were still done by a remote human operator.", sources: ["wikipedia-1x"] },
    ],

    economics: [
      { heading: "Cheaper hardware, unproven work", text: "Prices have fallen fast: Unitree's G1 sells for about $16,000. But in the first nine months of 2025, about 74% of Unitree's humanoid revenue came from research and education customers and only 9% from industry. The robots are being bought to experiment with more than to replace labour.", sources: ["wikipedia-unitree"] },
      { heading: "Valuations run ahead of revenue", text: "Figure AI was valued at $2.6 billion in February 2024 and $39 billion after a round of over $1 billion in September 2025. Its investors include Nvidia, Microsoft, Intel and Jeff Bezos. Prices like these are bets on a future market, not on today's sales. That reading is mine.", sources: ["wikipedia-figure-ai"] },
      { heading: "Robots for rent", text: "Instead of selling robots outright, companies are renting them by time: Agility's Robot-as-a-Service contract with GXO, and 1X's offer of NEO at $499 a month. Renting lowers the upfront cost for the buyer and keeps the risk that the robot underperforms with the maker.", sources: ["wikipedia-agility", "wikipedia-1x"] },
      { heading: "A national priority in China", text: "In November 2023 China's industry ministry issued guidance making humanoid robots a strategic priority, aiming for mass production and a secure supply of key parts such as sensors and actuators. The International Federation of Robotics describes the regions differently: China treats humanoids as national strategy, the US relies on private investment for logistics and manufacturing, Europe is more cautious, and Japan sees them as companions.", sources: ["register-miit-2023", "ifr-humanoids-2025"] },
      { heading: "Safety, security and liability", text: "A full-size robot is heavy and strong. In 2025 Figure's former head of product safety sued the company, saying he was fired after warning its robots could fracture a human skull, and security researchers found serious flaws in Unitree's humanoids. Who is liable when a robot hurts someone in a factory or a home is still being worked out.", sources: ["wikipedia-figure-ai", "wikipedia-unitree"] },
    ],

    builders: [
      { name: "Tesla (Optimus)", what: "Developing the Optimus humanoid, first shown in 2021.", url: "https://www.tesla.com/AI" },
      { name: "Figure AI", what: "US start-up behind Figure 03 and the Helix AI model.", url: "https://www.figure.ai/" },
      { name: "Agility", what: "Makes Digit, working in warehouses under the first humanoid Robot-as-a-Service contract.", url: "https://www.agilityrobotics.com/" },
      { name: "Boston Dynamics", what: "Maker of Atlas, now all-electric; owned by Hyundai.", url: "https://bostondynamics.com/products/atlas/" },
      { name: "Unitree Robotics", what: "Hangzhou maker of low-cost humanoids such as the G1.", url: "https://www.unitree.com/" },
      { name: "1X", what: "Norwegian-American company building NEO, a humanoid for the home.", url: "https://www.1x.tech/" },
      { name: "Apptronik", what: "Austin company building Apollo, a humanoid for manufacturing and logistics.", url: "https://apptronik.com/" },
      { name: "Nvidia Isaac GR00T", what: "AI models and simulation tools that many humanoid makers build on.", url: "https://developer.nvidia.com/isaac/gr00t" },
      { name: "Google DeepMind (Gemini Robotics)", what: "AI models for robots, to be paired with Boston Dynamics' Atlas.", url: "https://deepmind.google/models/gemini-robotics/" },
      { name: "International Federation of Robotics", what: "The industry body; publishes robot statistics and a 2025 paper on humanoids.", url: "https://ifr.org/" },
    ],

    debates: [
      {
        question: "Does a robot need to be human-shaped?",
        yes: "Our world is built for human bodies: stairs, doors, tools, shelves and car interiors. A humanoid can step into existing workplaces without rebuilding them, and one design could learn many jobs.",
        no: "Wheels are cheaper and safer than legs, and specialised machines already do most factory work better. Roboticist Rodney Brooks calls the all-purpose humanoid helper \"pure fantasy thinking\", and the industry body expects humanoids to add to existing robots, not replace them.",
        search: ["\"why humanoid robots form factor debate\"", "\"Rodney Brooks humanoid robots fantasy\"", "\"wheeled vs legged robots warehouse\""],
      },
      {
        question: "How much of what we see is real autonomy?",
        yes: "AI models trained on demonstrations and simulation are improving fast, and some companies have shown robots doing long, unedited stretches of real work on their own.",
        no: "Several high-profile demonstrations, from Tesla's Optimus to 1X's NEO, relied largely on remote human operators, often without saying so clearly. Until robots work unsupervised for long periods, it is hard to judge progress.",
        search: ["\"Optimus teleoperated We Robot\"", "\"humanoid robot demo teleoperation disclosure\"", "\"1X NEO teleoperation review\""],
      },
      {
        question: "Will humanoids take jobs, or fill labour gaps?",
        yes: "Ageing populations and labour shortages in warehouses, factories and care homes mean there may not be enough workers for dull, dirty and dangerous jobs; robots could take those.",
        no: "If the robots get good and cheap, employers will use them to cut wages and headcount, and the gains will go to robot owners rather than workers unless policy changes.",
        search: ["\"humanoid robots labour shortage ageing population\"", "\"automation wages robots economics study\"", "\"robot tax debate\""],
      },
      {
        question: "Is the humanoid boom a bubble?",
        yes: "Valuations in the tens of billions rest on robots that mostly sell to researchers today, echoing past waves of robot hype that fizzled.",
        no: "The underlying pieces, cheaper motors and batteries and much better AI, are genuinely new, and the market for physical labour is so large that even a small share would be worth a lot.",
        search: ["\"humanoid robot valuation bubble\"", "\"Figure AI valuation revenue\"", "\"humanoid robots hype vs reality IFR\""],
      },
      {
        question: "Should we let humanoids into our homes?",
        yes: "A home robot could help older people live independently longer and take on chores, and early users help train the robots to be useful.",
        no: "A strong machine with cameras and microphones in the house raises safety and privacy risks, especially if remote operators can see inside, or if the robot's software can be hacked.",
        search: ["\"home humanoid robot privacy teleoperator\"", "\"Unitree G1 security vulnerability\"", "\"humanoid robot safety standard\""],
      },
    ],

    fieldNote: null,

    compare: {
      readiness: "Early pilots (TRL 6, my reading)",
      timeline: "Walking humanoids since 2000; first paid warehouse contract in 2024",
      barrier: "Reliable autonomy, safety and cost per useful hour of work",
      impact: "One machine for many manual jobs, in spaces built for people",
      debate: "Does a robot need to be human-shaped?",
    },
    compareSources: ["wikipedia-humanoid-robot", "wikipedia-agility", "ifr-humanoids-2025"],

    flags: [
      "Much of this page relies on Wikipedia, because the field moves faster than most other sources; company figures (prices, valuations, robots delivered) are mostly self-reported.",
      "Unitree's revenue split comes from its stock exchange listing responses as reported on Wikipedia; I couldn't open the filing itself.",
      "The date of China's 2023 guidance is inferred from a news report published on 7 November 2023 (\"last Thursday\", so 2 November).",
      "The safety lawsuit against Figure is an allegation, not a finding.",
    ],
  },
  {
    id: "crispr",
    name: "CRISPR gene editing",
    family: "bio",
    status: "charted",
    tagline: "Precise, programmable edits to DNA.",
    photo: { src: "img/crispr.webp", alt: "A 3D rendering of the Cas9 protein, a white bumpy molecule, gripping an orange guide RNA and a strand of target DNA.", credit: "Cas9 protein structure (PDB 5AXW), Thomas Splettstoesser (scistyle.com), 2016. CC BY-SA 4.0, via Wikimedia Commons.", url: "https://commons.wikimedia.org/wiki/File:Cas9_5AXW.png" },
    asOf: "2026-10-16",
    diagram: "crispr",

    how: [
      { text: "CRISPR gene editing borrows a defence system that bacteria use against viruses. Its best-known form pairs a protein, Cas9, with a short guide RNA: the guide matches a chosen stretch of DNA, and Cas9 cuts the DNA there.", sources: ["wikipedia-crispr", "wikipedia-cas9"] },
      { text: "The cell then repairs the cut. Its quick repair often adds or deletes a few letters, which switches the gene off; if scientists also supply a DNA template, the cell can copy it in, adding or correcting a sequence.", sources: ["wikipedia-crispr"] },
      { text: "Earlier tools such as zinc finger nucleases and TALENs needed a custom protein for each target. With CRISPR, retargeting only means making a new short RNA, which is why it spread so fast through labs: it is cheap, quick and precise.", sources: ["wikipedia-crispr"] },
      { text: "Newer versions do not cut both strands at all. Base editors change a single DNA letter into another, and prime editors write short new sequences, reducing the risk of unwanted changes.", sources: ["wikipedia-crispr", "wikipedia-prime-editing"] },
      { text: "Getting the editor to the right cells is the hard part. It can be done outside the body, by removing a patient's stem cells, editing them and putting them back (as in Casgevy), or inside the body, for example by packing the editor into lipid nanoparticles that travel to the liver.", sources: ["wikipedia-casgevy", "wikipedia-intellia", "penn-kj-2025"] },
    ],

    metrics: [
      { value: "$2.2m", label: "US list price of Casgevy, the first approved CRISPR therapy", sources: ["wikipedia-casgevy"] },
      { value: "29 of 31", label: "sickle cell patients in its trial free of severe pain crises for at least a year", sources: ["wikipedia-casgevy"] },
      { value: "6 months", label: "to design and make a personalised base-editing treatment for one baby, 2025", sources: ["penn-kj-2025"] },
    ],

    readiness: {
      level: 8,
      label: "Approved, for a few uses",
      summary: "One CRISPR therapy, Casgevy, is approved in the UK, US, EU and elsewhere for two inherited blood disorders. Editing inside the body is in late-stage trials, a personalised treatment has helped one baby, and edited crops are on sale in some countries. Most uses are still in trials.",
      note: "The level (1 to 9) is my own reading against NASA's Technology Readiness Level scale, not an official rating. Casgevy itself is in routine use (arguably level 9); I've marked the field 8 because most therapies are still in clinical trials.",
      sources: ["wikipedia-casgevy", "wikipedia-intellia", "penn-kj-2025", "wikipedia-genome-editing", "nasa-trl"],
    },

    milestones: [
      { when: "2012", text: "Jennifer Doudna and Emmanuelle Charpentier showed that CRISPR-Cas9 could be programmed with RNA to cut chosen DNA, and filed a patent.", sources: ["wikipedia-crispr", "wikipedia-doudna"] },
      { when: "Nov 2018", text: "He Jiankui announced the birth of twin girls from embryos he had edited, to worldwide condemnation. In December 2019 a Chinese court sentenced him to three years in prison.", sources: ["wikipedia-he-jiankui"] },
      { when: "Oct 2020", text: "Doudna and Charpentier won the Nobel Prize in Chemistry.", sources: ["wikipedia-doudna"] },
      { when: "Jun 2021", text: "Intellia published the first human data from a CRISPR therapy given directly into the body, as a single infusion.", sources: ["wikipedia-intellia"] },
      { when: "Sep 2021", text: "A CRISPR-edited tomato, with extra GABA, went on public sale in Japan.", sources: ["wikipedia-genome-editing"] },
      { when: "Nov to Dec 2023", text: "The UK approved Casgevy for sickle cell disease and beta thalassaemia, the first CRISPR therapy anywhere; the US followed in December, and the EU in February 2024.", sources: ["wikipedia-casgevy"] },
      { when: "May 2025", text: "Doctors in Philadelphia reported treating a baby, KJ, with a base-editing therapy designed for his own mutation in about six months; he had three doses with no serious side effects.", sources: ["penn-kj-2025"] },
      { when: "Oct to Nov 2025", text: "Intellia paused two late-stage trials after a patient had a severe liver reaction; the patient later died, and the FDA put the trials on hold.", sources: ["biospace-intellia-2025"] },
      { when: "May 2026", text: "EU governments adopted new rules treating many gene-edited plants like conventionally bred ones, sending them to the European Parliament for a final vote.", sources: ["eu-ngt-2026"] },
    ],

    economics: [
      { heading: "A one-off cure with a $2 million price", text: "Casgevy lists at $2.2 million in the US and about £1 million in the UK. One estimate puts its cost-effectiveness in the US at $1.35 to $2.05 million, depending on what is counted. The treatment also needs high-dose chemotherapy and a specialist transplant centre, which adds cost and limits where it can be given.", sources: ["wikipedia-casgevy"] },
      { heading: "Who pays, and when", text: "Health systems usually pay for chronic diseases year by year; a one-time cure asks them to pay most of a lifetime's cost up front, while the benefits arrive over decades, and patients may change insurer in between. That reading is mine.", sources: ["wikipedia-casgevy"] },
      { heading: "Medicines for one patient", text: "KJ's treatment was designed for a single child's mutation. Medicines like that do not fit the usual model of large trials and prices spread over many patients; making it routine would need new ways to test, approve and pay. That reading is mine, based on the case.", sources: ["penn-kj-2025"] },
      { heading: "Who owns CRISPR", text: "The University of California (Doudna's side) and the Broad Institute of MIT and Harvard fought for years over the core patents; in March 2022 the US Patent Office ruled that the Broad had been first. Companies have to license patents from one side or both.", sources: ["wikipedia-crispr", "wikipedia-intellia"] },
      { heading: "Rules for edited food", text: "Countries are splitting. Japan has gene-edited food on sale. The EU's new rules, adopted by member states in 2026, would treat many edited plants like conventional ones, without GMO labels on food, while excluding traits such as herbicide tolerance and requiring patent disclosure.", sources: ["wikipedia-genome-editing", "eu-ngt-2026"] },
      { heading: "Safety sets the pace", text: "Editing inside the body is new, and serious side effects can halt whole programmes: Intellia's late-stage trials were halted in late 2025 after a patient's severe liver reaction and later death.", sources: ["biospace-intellia-2025"] },
    ],

    builders: [
      { name: "Vertex Pharmaceuticals", what: "Developed and sells Casgevy, with CRISPR Therapeutics.", url: "https://www.vrtx.com/" },
      { name: "CRISPR Therapeutics", what: "Co-developed Casgevy; co-founded by Emmanuelle Charpentier.", url: "https://crisprtx.com/" },
      { name: "Intellia Therapeutics", what: "First to publish human results from CRISPR given directly into the body, using lipid nanoparticles to reach the liver.", url: "https://www.intelliatx.com/" },
      { name: "Beam Therapeutics", what: "Develops base-editing medicines.", url: "https://www.beamtx.com/" },
      { name: "Verve Therapeutics", what: "One-time gene-editing treatments aimed at lowering cholesterol.", url: "https://www.verve.com/" },
      { name: "Innovative Genomics Institute", what: "Jennifer Doudna's institute at Berkeley, working on CRISPR for health, food and climate.", url: "https://innovativegenomics.org/" },
      { name: "Broad Institute of MIT and Harvard", what: "Home of Feng Zhang's CRISPR work and of base and prime editing research.", url: "https://www.broadinstitute.org/" },
      { name: "Children's Hospital of Philadelphia and Penn Medicine", what: "Treated KJ with the first personalised base-editing therapy.", url: "https://pennmedicine.org/news/worlds-first-patient-treated-with-personalized-crispr-therapy" },
    ],

    debates: [
      {
        question: "Should we ever edit human embryos?",
        yes: "Editing an embryo could stop a serious inherited disease being passed down a family for good, something no treatment after birth can do.",
        no: "Changes in an embryo pass to all future generations, the risks cannot be fully tested, and safer options such as embryo screening usually exist. The He Jiankui case showed how easily it can be done badly, and it opens the door to enhancement.",
        search: ["\"heritable human genome editing moratorium\"", "\"He Jiankui CRISPR babies consequences\"", "\"germline editing ethics summit statement\""],
      },
      {
        question: "Who will be able to afford it?",
        yes: "Prices of new technologies usually fall, and a one-time cure can save decades of hospital care, so even a high price may pay for itself over time.",
        no: "At $2 million a patient, plus chemotherapy and specialist centres, these cures are out of reach for most of the people with sickle cell disease and for many health systems.",
        search: ["\"Casgevy price access sickle cell\"", "\"gene therapy affordability outcomes-based payment\"", "\"cost of curing sickle cell disease gene therapy\""],
      },
      {
        question: "Are gene-edited crops just GMOs by another name?",
        yes: "Editing can cut out genes or make changes that could also happen in nature or by breeding, faster and without adding foreign DNA, so it should be treated like conventional breeding.",
        no: "It is still a laboratory genetic change, and critics want it labelled, assessed for risk, and kept clear of patents that could tie farmers to a few companies.",
        search: ["\"EU new genomic techniques regulation debate\"", "\"gene edited crops labelling\"", "\"CRISPR crops patents farmers\""],
      },
      {
        question: "How safe is editing inside the body?",
        yes: "Early trials have shown large, lasting effects from a single infusion, and newer editors that do not cut both DNA strands should be gentler and more precise.",
        no: "Edits inside the body cannot be undone, effects years later are unknown, and serious reactions have already paused late-stage trials.",
        search: ["\"in vivo gene editing safety liver lipid nanoparticle\"", "\"CRISPR off-target effects long term\"", "\"Intellia MAGNITUDE clinical hold\""],
      },
      {
        question: "Should CRISPR be locked up in patents?",
        yes: "Patents reward the institutions and companies that take on the cost and risk of turning a discovery into approved medicines.",
        no: "Years of disputes have cost money and created uncertainty over a tool built on public research, and broad patents could raise prices and slow uses in poorer countries and farming.",
        search: ["\"CRISPR patent dispute Broad University of California\"", "\"CRISPR licensing costs\"", "\"CRISPR patents agriculture access\""],
      },
    ],

    fieldNote: null,

    compare: {
      readiness: "Approved for two blood disorders; most uses in trials (TRL 8, my reading)",
      timeline: "Shown as an editing tool in 2012; first approved therapy in 2023",
      barrier: "Price, safe delivery into the body, and long-term safety",
      impact: "One-time treatments for genetic diseases, and faster crop breeding",
      debate: "Where is the line on editing human embryos?",
    },
    compareSources: ["wikipedia-crispr", "wikipedia-casgevy", "penn-kj-2025"],

    flags: [
      "Casgevy's US cost-effectiveness range and UK price are estimates reported on Wikipedia; I didn't open the original analyses.",
      "Whether the European Parliament gave final approval to the EU rules on gene-edited plants after May 2026 is something I couldn't confirm; I've described only the member states' adoption.",
      "Intellia attributed the 2025 trial death to the patient's other illnesses; investigations were ongoing in the reports I read.",
      "KJ's outcome is early: the hospital itself says longer follow-up is needed.",
    ],
  },
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

/* The commodities ticker: the second list in the ticker.
   Prices come from commodity-data.js, written by a scheduled job.
   unit is how the price is quoted; tech links an item to a page
   ("metals" scrolls to the metals panel) only where it fits. */
FRONTIER.commodities = [
  { id: "brent", name: "Brent crude", unit: "$/barrel", tech: "fusion" },
  { id: "wti", name: "WTI crude", unit: "$/barrel", tech: "fusion" },
  { id: "natgas", name: "Natural gas (US)", unit: "$/MMBtu", tech: "fusion" },
  { id: "gold", name: "Gold", unit: "$/troy oz" },
  { id: "silver", name: "Silver", unit: "$/troy oz" },
  { id: "copper", name: "Copper", unit: "$/tonne", tech: "metals" },
  { id: "aluminium", name: "Aluminium", unit: "$/tonne" },
  { id: "wheat", name: "Wheat", unit: "$/tonne", tech: "vertical-farming" },
  { id: "maize", name: "Corn", unit: "$/tonne", tech: "vertical-farming" },
  { id: "soybeans", name: "Soybeans", unit: "$/tonne", tech: "vertical-farming" },
  { id: "coffee", name: "Coffee (arabica)", unit: "$/kg" },
  { id: "cocoa", name: "Cocoa", unit: "$/kg" },
  { id: "sugar", name: "Sugar", unit: "$/kg" },
];

FRONTIER.sources = {
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
  "iea-gcmo-2026": { title: "Global Critical Minerals Outlook 2026 (revised version, July 2026): executive summary, outlook overview and annex of key projection results. CC BY 4.0", publisher: "International Energy Agency", url: "https://iea.blob.core.windows.net/assets/19c60aa0-ee07-4a20-a138-33c967ac5008/GlobalCriticalMineralsOutlook2026.pdf" },
  "wikipedia-vertical-farming": { title: "Vertical farming, revision 1377820132", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Vertical_farming&oldid=1377820132" },
  "wikipedia-cea": { title: "Controlled-environment agriculture, revision 1347357427", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Controlled-environment_agriculture&oldid=1347357427" },
  "wikipedia-hydroponics": { title: "Hydroponics, revision 1379375133", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Hydroponics&oldid=1379375133" },
  "wikipedia-aerofarms": { title: "AeroFarms, revision 1365787738", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=AeroFarms&oldid=1365787738" },
  "wikipedia-freight-farms": { title: "Freight Farms, revision 1311293208", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Freight_Farms&oldid=1311293208" },
  "wikipedia-oishii": { title: "Oishii, revision 1371979154", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Oishii&oldid=1371979154" },
  "barbosa-2015": { title: "Barbosa et al., Comparison of land, water, and energy requirements of lettuce grown using hydroponic vs. conventional agricultural methods (2015)", publisher: "International Journal of Environmental Research and Public Health", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4483736/" },
  "asseng-2020": { title: "Asseng et al., Wheat yield potential in controlled-environment vertical farms (2020)", publisher: "PNAS", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7430987/" },
  "graamans-2018": { title: "Graamans et al., Plant factories versus greenhouses: comparison of resource use efficiency (2018), abstract", publisher: "Wageningen University & Research (Agricultural Systems)", url: "https://research.wur.nl/en/publications/plant-factories-versus-greenhouses-comparison-of-resource-use-eff" },
  "sciam-veggie": { title: "Astronauts take first bites of lettuce grown in space (August 2015)", publisher: "Scientific American", url: "https://www.scientificamerican.com/article/astronauts-take-first-bites-of-lettuce-grown-in-space/" },
  "techcrunch-bowery": { title: "Bowery Farming is ceasing operations (November 2024)", publisher: "TechCrunch", url: "https://techcrunch.com/2024/11/04/bowery-farming-is-ceasing-operations/" },
  "verticalfarmdaily-plenty": { title: "US: Plenty enters into Chapter 11 bankruptcy (March 2025)", publisher: "Vertical Farm Daily", url: "https://www.verticalfarmdaily.com/article/9716674/us-plenty-enters-into-chapter-11-bankruptcy/" },
  "hortidaily-freight-farms": { title: "Freight Farms files for Chapter 7 bankruptcy, leaving growers disconnected (May 2025)", publisher: "HortiDaily", url: "https://www.hortidaily.com/article/9728356/freight-farms-files-for-chapter-7-bankruptcy-leaving-growers-disconnected/" },
  "agfunder-2023": { title: "Data snapshot: the top 20 deals in Novel Farming Systems in 2023 (January 2024)", publisher: "AgFunderNews", url: "https://agfundernews.com/data-snapshot-from-insect-ag-and-vertical-farming-to-aquaculture-the-top-20-deals-in-novel-farming-systems-in-2023" },
  "eu-organic-2018-848": { title: "Regulation (EU) 2018/848 on organic production, Annex II Part I, points 1.1 and 1.2", publisher: "EUR-Lex", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018R0848" },
  "nalc-organic-hydroponics": { title: "The fight over organic hydroponics: an update", publisher: "National Agricultural Law Center", url: "https://nationalaglawcenter.org/the-fight-over-organic-hydroponics-an-update" },
  "farmers-gov-urban": { title: "Urban agriculture", publisher: "USDA, farmers.gov", url: "https://www.farmers.gov/your-business/urban-growers" },
  "wikipedia-humanoid-robot": { title: "Humanoid robot, revision 1380086428", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Humanoid_robot&oldid=1380086428" },
  "wikipedia-atlas": { title: "Atlas (robot), revision 1373221767", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Atlas_(robot)&oldid=1373221767" },
  "wikipedia-asimo": { title: "ASIMO, revision 1379605996", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=ASIMO&oldid=1379605996" },
  "wikipedia-figure-ai": { title: "Figure AI, revision 1380142782", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Figure_AI&oldid=1380142782" },
  "wikipedia-agility": { title: "Agility Robotics, revision 1380025206", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Agility_Robotics&oldid=1380025206" },
  "wikipedia-unitree": { title: "Unitree Robotics, revision 1378417625", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Unitree_Robotics&oldid=1378417625" },
  "wikipedia-1x": { title: "1X Technologies, revision 1368054998", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=1X_Technologies&oldid=1368054998" },
  "ifr-humanoids-2025": { title: "Humanoid robots: \"Vision and Reality\" paper published by IFR (14 August 2025)", publisher: "International Federation of Robotics", url: "https://ifr.org/ifr-press-releases/news/humanoid-robots-vision-and-reality-paper-published-by-ifr" },
  "register-miit-2023": { title: "Beijing prepares for imminent rise of humanoid robots (7 November 2023)", publisher: "The Register", url: "https://www.theregister.com/2023/11/07/beijing_prepares_for_imminent_rise/" },
  "wikipedia-crispr": { title: "CRISPR gene editing, revision 1375110502", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=CRISPR_gene_editing&oldid=1375110502" },
  "wikipedia-cas9": { title: "Cas9, revision 1380091095", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Cas9&oldid=1380091095" },
  "wikipedia-prime-editing": { title: "Prime editing, revision 1380214216", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Prime_editing&oldid=1380214216" },
  "wikipedia-genome-editing": { title: "Genome editing, revision 1378460428", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Genome_editing&oldid=1378460428" },
  "wikipedia-he-jiankui": { title: "He Jiankui affair, revision 1380372717", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=He_Jiankui_affair&oldid=1380372717" },
  "wikipedia-doudna": { title: "Jennifer Doudna, revision 1379081993", publisher: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Jennifer_Doudna&oldid=1379081993" },
  "penn-kj-2025": { title: "World's first patient treated with personalized CRISPR gene editing therapy (15 May 2025)", publisher: "Penn Medicine and Children's Hospital of Philadelphia", url: "https://pennmedicine.org/news/worlds-first-patient-treated-with-personalized-crispr-therapy" },
  "biospace-intellia-2025": { title: "Patient dies after receiving Intellia's CRISPR gene therapy candidate (7 November 2025)", publisher: "BioSpace", url: "https://www.biospace.com/drug-development/patient-dies-after-receiving-intellias-crispr-gene-therapy-candidate" },
  "eu-ngt-2026": { title: "Council adopts regulation on new genomic techniques (5 May 2026)", publisher: "European Commission, IP Helpdesk", url: "https://intellectual-property-helpdesk.ec.europa.eu/news-events/news/council-adopts-regulation-new-genomic-techniques-2026-05-05_en" },
  "aa-iea-rare-earths-2026": { title: "International Energy Agency warns rare earth supply diversification lags rising global demand (8 April 2026), reporting the IEA's rare earths analysis", publisher: "Anadolu Agency", url: "https://aa.com.tr/en/economy/international-energy-agency-warns-rare-earth-supply-diversification-lags-rising-global-demand/3898514" },
  "doe-critical-materials-2023": { title: "Critical Materials Assessment (July 2023)", publisher: "U.S. Department of Energy", url: "https://www.energy.gov/sites/default/files/2023-07/doe-critical-material-assessment_07312023.pdf" },
};
