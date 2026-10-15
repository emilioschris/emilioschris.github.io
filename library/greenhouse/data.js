/* =========================================================
   THE GREENHOUSE · your plants
   ---------------------------------------------------------
   This is the only file you need to edit.

   Each plant has:
     id          Never change it once set: your care log is saved by id.
     name        What you call it.
     species     Botanical name.
     confirmed   true once the species is certain, false = "to confirm".
     parent      Optional: the id of the plant it was cut from.
     propagated  Optional: "YYYY-MM-DD" the cutting was taken ("" if unknown).
     location    Where it sits: { place: "bench" | "tower", tier: 1 to 3 }
                 (tier 1 is the top of the Bedroom Tower, 3 the bottom).
                 Bench plants also take bench: 1 or 2.
     light       One short line.
     water       Days between soil checks: { summer, winter }.
                 These are starting points, not rules: the page says
                 "check soil", never "water".
     feed        { every: days, season: "Apr to Oct" } or null for none.
     tasks       Other jobs, each { task: "mist" | "rotate" | "repot", every: days }.
     status      "thriving", "steady", "struggling" or "dormant".
     facts       Care facts, each { text, sources: [ids] }.
     toxicity    Pets: { text, sources: [ids] }.
     notes       Your own notes.
     photo       null for the drawn specimen, or { src, alt, date }
                 (photos go in library/greenhouse/photos/, cropped to the
                 plant, metadata stripped). It shows on the herbarium
                 sheet; add scene: true to stand it in the glasshouse too.
     pot         Optional [shape, glaze] for its real pot, e.g. ["glaze", "yellow"].
                 Shapes: clay, tall, glaze, bowl. Glazes: clay, lime (white),
                 olive, ink (charcoal), yellow, slate (blue-grey).
     sketch      Which drawing to use while there's no photo.
     added       "YYYY-MM-DD" it joined the greenhouse ("" if unknown).
     flags       Anything still uncertain, shown on the sheet.
     hawk        Optional "Field notes from above" for a struggling plant:
                 { summary, causes, thisWeek, watch, normal }, each a list
                 of { text, sources }. While any plant is "struggling",
                 the hawk flies across the greenhouse.

   Seasons follow the RHS houseplant calendar: growing season April
   to October, winter rest November to March. In winter every
   check interval switches to its winter value and feeding stops.
   ========================================================= */

window.GREENHOUSE = window.GREENHOUSE || {};

GREENHOUSE.season = { growing: [4, 10] };   // months, inclusive

GREENHOUSE.sources = {
  "ncsu-pothos":     { title: "Epipremnum aureum", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/epipremnum-aureum/" },
  "ncsu-callisia":   { title: "Callisia repens", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/callisia-repens/" },
  "ncsu-jade":       { title: "Crassula ovata", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/crassula-ovata/" },
  "ncsu-zz":         { title: "Zamioculcas zamiifolia", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/zamioculcas-zamiifolia/" },
  "ncsu-pachira":    { title: "Pachira aquatica", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/pachira-aquatica/" },
  "ncsu-alocasia":   { title: "Alocasia", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/alocasia/" },
  "mbg-jade":        { title: "Crassula ovata", publisher: "Missouri Botanical Garden Plant Finder", url: "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?taxonid=279445" },
  "rhs-alocasia":    { title: "How to grow alocasias", publisher: "Royal Horticultural Society", url: "https://www.rhs.org.uk/plants/alocasia/growing-guide" },
  "rhs-succulents":  { title: "How to grow cacti and succulents", publisher: "Royal Horticultural Society", url: "https://www.rhs.org.uk/plants/types/cacti-succulents/houseplants/growing-guide" },
  "rhs-houseplants": { title: "How to grow houseplants", publisher: "Royal Horticultural Society", url: "https://www.rhs.org.uk/plants/types/houseplants/growing-guide" },
  "rhs-spider-mite": { title: "Glasshouse red spider mite", publisher: "Royal Horticultural Society", url: "https://www.rhs.org.uk/biodiversity/glasshouse-red-spider-mite" },
  "iastate-bulbs":   { title: "Bulbs well-suited as houseplants", publisher: "Iowa State University Extension", url: "https://yardandgarden.extension.iastate.edu/how-to/bulbs-well-suited-houseplants" },
  "aspca-pothos":    { title: "Golden Pothos", publisher: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/golden-pothos" },
  "aspca-jade":      { title: "Jade Plant", publisher: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/jade-plant" },
  "aspca-money":     { title: "Money Tree", publisher: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/money-tree" },
  "ncsu-dracaena":   { title: "Dracaena marginata", publisher: "NC State Extension Gardener Plant Toolbox", url: "https://plants.ces.ncsu.edu/plants/dracaena-marginata/" },
  "aspca-dracaena":  { title: "Dracaena", publisher: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/dracaena" },
  "aspca-kalanchoe": { title: "Kalanchoe", publisher: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/kalanchoe" },
  "aspca-oxalates":  { title: "These houseplants can cause trouble for your pets (13 Oct 2025)", publisher: "ASPCA", url: "https://www.aspca.org/news/these-houseplants-can-cause-trouble-your-pets" },
};

// Shared facts, so the Mother and her cuttings say the same thing
const POTHOS_FACTS = [
  { text: "Prefers bright, indirect light but survives long spells in low light. Low light can fade the variegation.", sources: ["ncsu-pothos"] },
  { text: "Let the potting mix dry out between waterings. Overwatering causes root rot and blackened leaf edges.", sources: ["ncsu-pothos"] },
  { text: "Feed about every two months, but not during the winter rest.", sources: ["ncsu-pothos"] },
  { text: "Older leaves yellow and drop, so growth gathers at the stem ends. Pinching back keeps it bushy, and a support to climb gives bigger leaves.", sources: ["ncsu-pothos"] },
  { text: "Stem cuttings root easily in water, often in about two weeks.", sources: ["ncsu-pothos"] },
  { text: "Watch for mealybugs and scale. Wipe the leaves now and then to keep them dust free.", sources: ["ncsu-pothos"] },
];
const POTHOS_TOX = { text: "Toxic to dogs and cats (insoluble calcium oxalates): mouth irritation, drooling, vomiting, trouble swallowing. Also irritates skin.", sources: ["aspca-pothos", "ncsu-pothos"] };

const ZZ_FACTS = [
  { text: "Copes with very low light but does best in bright, indirect light. Direct sun can scorch the leaves.", sources: ["ncsu-zz"] },
  { text: "Drought tolerant and hates wet feet: let the soil dry out completely. Roughly twice a month in summer and once a month in winter.", sources: ["ncsu-zz"] },
  { text: "A balanced liquid houseplant feed once or twice a year is enough.", sources: ["ncsu-zz"] },
  { text: "Usually trouble free. Watch for scale insects.", sources: ["ncsu-zz"] },
];
const ZZ_TOX = { text: "Toxic to dogs and cats (insoluble calcium oxalates): mouth irritation, drooling, vomiting, diarrhoea.", sources: ["aspca-oxalates", "ncsu-zz"] };

GREENHOUSE.plants = [
  {
    id: "mother-pothos", name: "Mother Pothos", species: "Epipremnum aureum", confirmed: true,
    location: { place: "tower", tier: 1 }, light: "Bright, indirect; tolerates low light",
    water: { summer: 7, winter: 14 }, feed: { every: 60, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 30 }],
    status: "thriving", facts: POTHOS_FACTS, toxicity: POTHOS_TOX,
    notes: "The parent plant, on the top tier of the Bedroom Tower. Propagations 1, 2 and 3 were cut from her. From the photo (15 Oct 2026): a yellow honeycomb-textured pot on a round wooden stand by the window, with long vines trailing down that are bare for much of their length. Another cutting is rooting in water in a pink glass vase.",
    photo: { src: "photos/mother-pothos.webp", alt: "Mother Pothos in a yellow honeycomb pot on a wooden stand by a window, long bare vines trailing down", date: "2026-10-15" }, pot: ["glaze", "yellow"], sketch: "pothos", added: "", flags: [],
  },
  ...[1, 2, 3].map(n => ({
    id: `pothos-prop-${n}`, name: `Pothos propagation ${n}`, species: "Epipremnum aureum", confirmed: true,
    parent: "mother-pothos", propagated: "",
    location: { place: "bench", bench: 1 }, light: "Bright, indirect",
    water: { summer: 5, winter: 10 }, feed: { every: 60, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 30 }],
    status: "steady", facts: POTHOS_FACTS, toxicity: POTHOS_TOX,
    notes: [
      "Rooted from a cutting of the Mother, now potted in soil. From the photo (15 Oct 2026): two stems in a terracotta pot on a saucer, on the windowsill.",
      "Rooted from a cutting of the Mother, now potted in soil. From the photo (15 Oct 2026): one stem with two leaves in a terracotta pot on a saucer, on the windowsill.",
      "Rooted from a cutting of the Mother, now potted in soil. From the photo (15 Oct 2026): three leaves, in a small can on the windowsill.",
    ][n - 1],
    photo: n < 3 ? { src: `photos/pothos-prop-${n}.webp`, alt: `Pothos propagation ${n}: a young pothos cutting in a terracotta pot of fresh potting mix`, date: "2026-10-15" } : null,
    pot: n < 3 ? ["clay", "clay"] : ["tall", "ink"], sketch: "pothos-cutting", added: "",
    flags: n === 3 ? ["Which cutting is number 3 is my guess from the photo: the one in the small can."] : ["Which cutting is which number is my guess from the photo."],
  })),
  {
    id: "bubblegum", name: "Bubblegum", species: "Callisia repens 'Bubblegum'", confirmed: false,
    location: { place: "tower", tier: 2 }, light: "Bright, indirect; not harsh direct sun",
    water: { summer: 5, winter: 10 }, feed: { every: 30, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 21 }],
    status: "steady",
    facts: [
      { text: "Likes bright, indirect light. Strong direct sun can scorch or discolour the leaves, and too much shade makes the stems long and weak.", sources: ["ncsu-callisia"] },
      { text: "Keep the soil lightly moist but well drained. Overwatering leads to root rot and fungal disease.", sources: ["ncsu-callisia"] },
      { text: "Happiest at about 16 to 27°C (60 to 80°F), and no frost.", sources: ["ncsu-callisia"] },
      { text: "Watch for spider mites, aphids and mealybugs.", sources: ["ncsu-callisia"] },
    ],
    toxicity: { text: "NC State lists it as toxic to cats and dogs (calcium oxalates) and an irritant to skin. ASPCA has no entry for Callisia repens.", sources: ["ncsu-callisia"] },
    notes: "From the photo (15 Oct 2026): a dense, rounded mound of small pink, cream and green leaves.",
    photo: { src: "photos/bubblegum.webp", alt: "Bubblegum: a dense mound of tiny pink, cream and green leaves", date: "2026-10-15" }, sketch: "callisia", added: "",
    flags: ["The photo fits Callisia repens (tiny fleshy leaves, pink and cream variegation); the cultivar name is still to confirm.", "Feeding interval is my starting guess: no source gives one.", "Pet toxicity comes from one source only."],
  },
  {
    id: "jade", name: "Jade", species: "Crassula ovata", confirmed: true,
    location: { place: "tower", tier: 3 }, light: "Bright, with some afternoon shade",
    water: { summer: 14, winter: 30 }, feed: { every: 60, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 30 }],
    status: "steady",
    facts: [
      { text: "Needs bright light but appreciates some afternoon shade.", sources: ["mbg-jade", "ncsu-jade"] },
      { text: "Water moderately and let the soil dry between waterings. It needs no true dormancy, but a rest with less water from autumn to late winter helps.", sources: ["mbg-jade", "ncsu-jade"] },
      { text: "Does poorly in wet, badly drained soil: overwatering causes leaf drop and root rot.", sources: ["mbg-jade", "ncsu-jade"] },
      { text: "Handles low humidity well.", sources: ["mbg-jade"] },
      { text: "Aphids, scale, spider mites and mealybugs are occasional problems.", sources: ["ncsu-jade"] },
    ],
    toxicity: { text: "Toxic to dogs, cats and horses (toxic principle unknown): vomiting, depression, loss of coordination.", sources: ["aspca-jade"] },
    notes: "On the bottom tier of the Bedroom Tower. From the photo (15 Oct 2026): full and bushy, packed with fleshy, rounded leaves.",
    photo: { src: "photos/jade.webp", alt: "Jade: a bushy mass of thick, glossy, spoon-shaped leaves", date: "2026-10-15" }, sketch: "jade", added: "",
    flags: ["Feeding interval is my starting guess: no source gives one."],
  },
  ...[1, 2, 3].map(n => ({
    id: `zz-${n}`, name: `ZZ plant ${n}`, species: "Zamioculcas zamiifolia", confirmed: true,
    location: { place: "bench", bench: 2 }, light: "Bright, indirect; tolerates low light",
    water: { summer: 14, winter: 30 }, feed: { every: 180, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 30 }],
    status: "steady", facts: ZZ_FACTS, toxicity: ZZ_TOX,
    notes: [
      "From the photo (15 Oct 2026): upright stems of glossy leaflets in a terracotta pot with a saucer, on the floor in a corner.",
      "From the photo (15 Oct 2026): a bushy, dark green clump in a white pot, beside the braided palm.",
      "From the photo (15 Oct 2026): in a dark pot, next to the Money Tree.",
    ][n - 1],
    photo: n < 3 ? { src: `photos/zz-${n}.webp`, alt: n === 1 ? "ZZ plant 1: upright stems of glossy leaflets in a terracotta pot" : "ZZ plant 2: a dark green clump in a white pot", date: "2026-10-15" } : null,
    pot: [["clay", "clay"], ["tall", "lime"], ["tall", "ink"]][n - 1],
    sketch: "zz", added: "", flags: n === 3 ? ["Only the edge of this one is in the photos."] : [],
  })),
  {
    id: "braided-palm", name: "Braided palm", species: "Dracaena marginata", confirmed: false,
    location: { place: "bench", bench: 2 }, light: "Bright, indirect",
    water: { summer: 10, winter: 21 }, feed: { every: 90, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 30 }],
    status: "steady",
    facts: [
      { text: "Not actually a palm: it looks like a Madagascar dragon tree, whose stems can be trained into braids or spirals.", sources: ["ncsu-dracaena"] },
      { text: "Bright, indirect light is ideal.", sources: ["ncsu-dracaena"] },
      { text: "Use a well-draining mix and let it dry between waterings, but not severely.", sources: ["ncsu-dracaena"] },
      { text: "Needs little feeding: a controlled-release feed in spring, summer and autumn.", sources: ["ncsu-dracaena"] },
      { text: "Sensitive to fluoride, like most dracaenas: distilled or non-fluoridated water is better.", sources: ["ncsu-dracaena"] },
      { text: "Mites, thrips and chewing insects can be a problem, and it is prone to leaf spot.", sources: ["ncsu-dracaena"] },
    ],
    toxicity: { text: "Toxic to dogs and cats (saponins): vomiting, sometimes with blood, depression, loss of appetite, drooling, and dilated pupils in cats.", sources: ["aspca-dracaena", "ncsu-dracaena"] },
    notes: "From the photo (15 Oct 2026): three braided trunks under a burst of long, narrow leaves, in a white pot by the window.",
    photo: { src: "photos/braided-palm.webp", alt: "Braided palm: a tall braided trunk topped by a burst of long, narrow leaves, in a white pot by a window", date: "2026-10-15" }, pot: ["tall", "lime"], sketch: "dracaena", added: "",
    flags: ["Identified from a photo, so still to confirm: braided trunks and long, narrow leaves in a rosette fit Dracaena marginata.", "Check and feeding intervals are my starting guesses: the source gives no numbers."],
  },
  {
    id: "money-tree", name: "Braided Money Tree", species: "Pachira aquatica", confirmed: true,
    location: { place: "bench", bench: 2 }, light: "Indirect, or a mix of sun and shade",
    water: { summer: 7, winter: 14 }, feed: { every: 30, season: "Apr to Oct" },
    tasks: [{ task: "rotate", every: 30 }],
    status: "steady",
    facts: [
      { text: "Prefers indirect light. Direct sun can scorch the leaves.", sources: ["ncsu-pachira"] },
      { text: "Keep the mix moist but well drained: standing water causes root rot, and drying out too far causes leaf drop.", sources: ["ncsu-pachira"] },
      { text: "Likes humid air at about 18 to 24°C (65 to 75°F). Low humidity can yellow the leaves. Keep it above 7°C (45°F).", sources: ["ncsu-pachira"] },
      { text: "Braiding the flexible trunks began in Taiwan, where it was thought to lock in luck.", sources: ["ncsu-pachira"] },
      { text: "Watch for aphids, mealybugs, scale and fungus gnats.", sources: ["ncsu-pachira"] },
    ],
    toxicity: { text: "ASPCA lists it as non-toxic to dogs, cats and horses. NC State rates it low severity: the seeds can be harmful, but indoor plants rarely make them.", sources: ["aspca-money", "ncsu-pachira"] },
    notes: "From the photo (15 Oct 2026): a full head of hand-shaped leaves in a charcoal pot, by the window.",
    photo: { src: "photos/money-tree.webp", alt: "Braided Money Tree: a full head of hand-shaped leaves seen from above, in a charcoal pot", date: "2026-10-15" }, sketch: "pachira", added: "",
    flags: ["Feeding interval is my starting guess: no source gives one."],
  },
  {
    id: "succulents", name: "Small succulents", species: "To identify (an Echeveria and a Kalanchoe?)", confirmed: false,
    location: { place: "bench", bench: 1 }, light: "Bright; as much light as possible",
    water: { summer: 14, winter: 30 }, feed: null,
    tasks: [],
    status: "steady",
    facts: [
      { text: "Water thoroughly only when the compost surface is dry, and never leave the pot standing in water.", sources: ["rhs-succulents"] },
      { text: "Most want a cool, dry winter rest from about November to early March: water only enough to stop them shrivelling.", sources: ["rhs-succulents"] },
      { text: "Overwatering is the main cause of failure.", sources: ["rhs-succulents"] },
    ],
    toxicity: { text: "If the green one is a Kalanchoe, the ASPCA lists Kalanchoe as toxic to dogs and cats: vomiting, diarrhoea and, rarely, an abnormal heart rhythm. The rosette's safety isn't checked yet.", sources: ["aspca-kalanchoe"] },
    notes: "One entry for now. From the photo (15 Oct 2026): a blue-grey rosette and a green plant with scalloped leaves and pink buds, sharing a white bowl dressed with moss.",
    photo: { src: "photos/succulents.webp", alt: "Small succulents: a blue-grey rosette beside a green plant with scalloped leaves, in a white bowl with moss", date: "2026-10-15" }, pot: ["bowl", "lime"], sketch: "succulent", added: "",
    flags: ["Species to identify. From the photo, the rosette looks like an Echeveria and the green one like a Kalanchoe, but neither is certain.", "General succulent advice only."],
  },
  {
    id: "dragon-scale", name: "Dragon Scale", species: "Alocasia baginda 'Dragon Scale'", confirmed: false,
    location: { place: "bench", bench: 1 }, light: "Bright, indirect or dappled",
    water: { summer: 7, winter: 21 }, feed: { every: 30, season: "Apr to Oct" },
    tasks: [{ task: "mist", every: 3 }, { task: "rotate", every: 30 }],
    status: "struggling",
    facts: [
      { text: "Wants warmth: above 16°C (60°F) through the growing season, and never below 10°C (50°F) in winter. Keep it out of cold draughts.", sources: ["rhs-alocasia"] },
      { text: "Likes medium to high humidity, while home air is often very dry. Ways to raise it: a tray of gravel kept topped up with water, grouping plants together, misting, or a humidifier.", sources: ["rhs-alocasia", "iastate-bulbs"] },
      { text: "From April to October, water once the top 5 cm (2 in) of compost has dried. In winter, cut watering to a minimum: overwatering while it rests rots the roots.", sources: ["rhs-alocasia"] },
      { text: "Feed with a general liquid fertiliser from April to October only.", sources: ["rhs-alocasia"] },
      { text: "Dry air browns the leaf edges and attracts red spider mites, which thrive in a dry atmosphere.", sources: ["rhs-alocasia", "ncsu-alocasia"] },
      { text: "Alocasias rest in winter and may lose some leaves. This is nothing to worry about: new leaves come in spring.", sources: ["rhs-alocasia"] },
    ],
    toxicity: { text: "Toxic to cats, dogs and people (calcium oxalates): mouth and throat pain, drooling, vomiting. The sap irritates skin, so wear gloves.", sources: ["aspca-oxalates", "ncsu-alocasia", "rhs-alocasia"] },
    notes: "Sold as a philodendron. Struggling with the cold and low humidity. From the photo (15 Oct 2026): thick, silvery, deeply veined leaves, in a blue-grey pot on a wooden tray.",
    photo: { src: "photos/dragon-scale.webp", alt: "Dragon Scale: large, thick, silvery-green leaves with deep dark veins, in a blue-grey pot", date: "2026-10-15" }, pot: ["glaze", "slate"], sketch: "alocasia", added: "",
    flags: ["Species to confirm: sold as a philodendron, but the thick, silvery, deeply veined leaves in the photo fit Alocasia baginda 'Dragon Scale'.", "Care facts are for Alocasia in general: no reliable source covers 'Dragon Scale' on its own."],

    // Field notes from above: what the hawk says when this plant is struggling
    hawk: {
      summary: "Cold and dry air, most likely. Alocasias want warmth and humid air, and in winter they rest, so some leaf loss can be normal.",
      causes: [
        { text: "Too cold. Alocasias want more than 16°C (60°F) while growing and should never drop below 10°C (50°F).", sources: ["rhs-alocasia"] },
        { text: "Dry air. Home air is often very dry, and dry air browns the leaf edges.", sources: ["rhs-alocasia"] },
        { text: "Cold draughts, which can shock a plant and make it collapse.", sources: ["rhs-houseplants", "rhs-alocasia"] },
        { text: "Too much water in the cold. Overwatering while it rests rots the roots.", sources: ["rhs-alocasia"] },
      ],
      thisWeek: [
        { text: "Find it a warm spot, out of cold draughts. Don't leave it behind drawn curtains on a winter night: that space gets very cold.", sources: ["rhs-alocasia", "rhs-houseplants"] },
        { text: "Keep it back from radiators too. Close to one, leaves dry out and brown at the edges.", sources: ["rhs-houseplants"] },
        { text: "Raise the humidity: stand the pot on a tray of gravel kept topped up with water, group it with the other plants, or run a humidifier nearby. Misting helps only if it's done often.", sources: ["rhs-alocasia", "rhs-houseplants"] },
        { text: "Water less. In the growing season wait until the top 5 cm (2 in) of compost is dry; in winter cut watering to a minimum.", sources: ["rhs-alocasia"] },
        { text: "No feeding until April.", sources: ["rhs-alocasia"] },
        { text: "Turn a few leaves over and look underneath for red spider mite.", sources: ["rhs-spider-mite", "ncsu-alocasia"] },
      ],
      watch: [
        { text: "Red spider mite: fine pale mottling on the top of the leaves, tiny mites, white cast skins and eggs underneath, and fine silk webbing in a bad attack. They thrive in warm, dry air, so humidity lowers the risk but won't clear them on its own.", sources: ["rhs-spider-mite"] },
        { text: "Brown, crisp leaf edges: the air is too dry.", sources: ["rhs-alocasia"] },
        { text: "Yellowing leaves: too much water, too little water or too little light can all cause it, so check the soil before changing anything.", sources: ["ncsu-alocasia"] },
      ],
      normal: [
        { text: "In winter alocasias go dormant and may lose some of their leaves. This is nothing to worry about.", sources: ["rhs-alocasia"] },
        { text: "Keep it cooler and drier then, but still above 10°C (50°F). New leaves come when it starts growing again in spring.", sources: ["rhs-alocasia"] },
      ],
    },
  },
];
