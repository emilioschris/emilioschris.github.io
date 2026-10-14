/* =========================================================
   KYPRIAKA · periods (the strata)
   ---------------------------------------------------------
   One entry per layer, earliest first. The strata page shows
   them the other way up: today at the top, earliest at the
   bottom, like an archaeological section.

   start / end   Years as numbers: negative = BC, positive = AD.
                 end: null means "to the present day".
   dates         How the dates are written on the page.
   says          What each source actually states, with the
                 source's id from sources.js. Quote, don't guess.
   disagree      Where sources differ, or what is uncertain.
   hellenika     Ids of matching pages on Hellenika.
   sites         Ids of places in data/geo.js linked to this layer.
   overview      A few plain sentences, each with its sources.
   excavated     false until the layer has real content.

   The main scheme is Harper and Fox (2008), Table 1. Other
   sources are listed so the disagreements stay visible.
   ========================================================= */

window.KYPRIAKA = window.KYPRIAKA || {};

KYPRIAKA.periods = [
  {
    id: "akrotiri-phase",
    name: "Akrotiri phase",
    era: "Prehistoric",
    subtitle: "The first visitors: hunter-gatherers",
    start: -10900, end: -9900, dates: "c. 10,900–9900 BC",
    says: [
      { source: "harper-fox-2008", text: "Akrotiri Phase: c. 10,900–9900 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "The earliest humans arrived around 11,000–10,000 BC; Aetokremnos on the south coast is among the oldest well-dated sites." },
    ],
    disagree: [
      "Wikipedia rounds the first arrivals to c. 11,000–10,000 BC.",
      "Whether these first people hunted the island's dwarf hippopotamus and dwarf elephant is not settled. Wikipedia only says Aetokremnos is \"suggested to show evidence\" of it.",
    ],
    hellenika: [],
    sites: ["aetokremnos"],
    excavated: false,
  },
  {
    id: "early-aceramic-neolithic",
    name: "Early Aceramic Neolithic",
    era: "Prehistoric",
    subtitle: "Cypro-PPNA and Cypro-PPNB: the first farmers, before pottery",
    start: -9900, end: -7000, dates: "c. 9900–7000 BC",
    says: [
      { source: "harper-fox-2008", text: "Cypro-PPNA: c. 9900–9000 BC. Cypro-PPNB: c. 9900–7000 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "The oldest evidence of Neolithic settlement is dated to 8800–8600 BC; the first settlers were already farmers but made no pottery." },
    ],
    disagree: [
      "Harper and Fox give overlapping dates for PPNA and PPNB, so where one ends and the other begins is left open here.",
      "Wikipedia's oldest settlement (8800–8600 BC) is later than Harper and Fox's start date.",
    ],
    hellenika: [],
    sites: [],
    excavated: false,
  },
  {
    id: "khirokitia-culture",
    name: "Late Aceramic Neolithic",
    era: "Prehistoric",
    subtitle: "The Khirokitia culture: villages of round houses",
    start: -7000, end: -5500, dates: "c. 7000–5500 BC",
    says: [
      { source: "harper-fox-2008", text: "Early Neolithic, Khirokitia: c. 7000–5500 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "The aceramic Choirokoitia culture belongs to the 6th millennium BC; the aceramic civilisation ended quite abruptly around 6000 BC." },
    ],
    disagree: [
      "The end date differs: c. 5500 BC (Harper and Fox) against around 6000 BC (Wikipedia).",
    ],
    hellenika: ["neolithic-greece", "choirokoitia"],
    sites: ["khirokitia"],
    excavated: false,
  },
  {
    id: "neolithic-gap",
    name: "A gap in the record",
    era: "Prehistoric",
    subtitle: "Between the aceramic and pottery-making Neolithic",
    start: -5500, end: -4700, dates: "c. 5500–4700 BC",
    says: [
      { source: "harper-fox-2008", text: "Khirokitia ends c. 5500 BC; the Sotira culture begins c. 4700 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "The aceramic culture was probably followed by a vacuum of almost 1,500 years, until around 4500 BC." },
    ],
    disagree: [
      "How long the gap lasted depends on the source: about 800 years (Harper and Fox) or almost 1,500 (Wikipedia).",
      "Wikipedia says \"probably\". It may be a real gap in settlement, or a gap in what has been found so far.",
    ],
    hellenika: [],
    sites: [],
    excavated: false,
  },
  {
    id: "sotira-culture",
    name: "Ceramic Neolithic",
    era: "Prehistoric",
    subtitle: "The Sotira culture: the first pottery",
    start: -4700, end: -4000, dates: "c. 4700–4000 BC",
    says: [
      { source: "harper-fox-2008", text: "Late Neolithic, Sotira: c. 4700–4000 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "Neolithic II (Ceramic Neolithic) emerged around 4500 BC." },
    ],
    disagree: [
      "The start date differs: c. 4700 BC (Harper and Fox) against around 4500 BC (Wikipedia).",
    ],
    hellenika: ["neolithic-greece"],
    sites: [],
    excavated: false,
  },
  {
    id: "chalcolithic",
    name: "Chalcolithic",
    era: "Prehistoric",
    subtitle: "The Erimi culture: copper and stone",
    start: -4000, end: -2500, dates: "c. 4000–2500 BC",
    says: [
      { source: "harper-fox-2008", text: "Chalcolithic, Erimi: c. 4000–2500 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "An earthquake destroyed the Neolithic culture c. 3800 BC; the Chalcolithic began around 3500 BC with the first metalwork and lasted until around 2500/2300 BC." },
    ],
    disagree: [
      "Start: c. 4000 BC (Harper and Fox) or around 3500 BC (Wikipedia).",
      "End: c. 2500 BC, or as late as 2300 BC (Wikipedia).",
    ],
    hellenika: ["neolithic-greece", "early-bronze-age"],
    sites: [],
    excavated: false,
  },
  {
    id: "philia-phase",
    name: "Philia phase",
    era: "Bronze Age",
    subtitle: "The start of the Bronze Age",
    start: -2500, end: -2350, dates: "c. 2500–2350 BC",
    says: [
      { source: "harper-fox-2008", text: "Philia Facies: c. 2500–2350 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "The new era was introduced by people from Anatolia who came around 2400 BC, identified by a distinct material culture, the Philia Culture." },
    ],
    disagree: [
      "Wikipedia presents arrivals from Anatolia as fact. That is an interpretation of the archaeology, and it is marked here as not yet checked against specialist sources.",
    ],
    hellenika: ["early-bronze-age"],
    sites: [],
    excavated: false,
  },
  {
    id: "early-cypriot",
    name: "Early Cypriot",
    era: "Bronze Age",
    subtitle: "Early Bronze Age",
    start: -2350, end: -1950, dates: "c. 2350–1950 BC",
    says: [
      { source: "harper-fox-2008", text: "Bronze Age, Early Cypriot: c. 2350–1950 BC." },
    ],
    disagree: [],
    hellenika: ["early-bronze-age"],
    sites: [],
    excavated: false,
  },
  {
    id: "middle-cypriot",
    name: "Middle Cypriot",
    era: "Bronze Age",
    subtitle: "Middle Bronze Age: copper workshops and inland villages",
    start: -1950, end: -1650, dates: "c. 1950–1650 BC",
    says: [
      { source: "harper-fox-2008", text: "Middle Cypriot: c. 1950–1650 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "Gives 1900–1600 BC in a sentence about the Middle Bronze Age." },
    ],
    disagree: [
      "Wikipedia's figures (1900–1600 BC) are about 50 years later at both ends, and its sentence is ambiguous about which period they belong to.",
    ],
    hellenika: ["minoan-civilisation", "mycenaean-civilisation"],
    sites: [],
    excavated: false,
  },
  {
    id: "late-cypriot",
    name: "Late Cypriot",
    era: "Bronze Age",
    subtitle: "Late Bronze Age: cities, copper trade and writing",
    start: -1650, end: -1150, dates: "c. 1650–1150 BC",
    says: [
      { source: "harper-fox-2008", text: "Late Cypriot: c. 1650–1150 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "Late Cypriot IIC is dated 1300–1200 BC and IIIA 1200–1100 BC. Cyprus \"was known as Alashiya\" in Egyptian, Hittite, Assyrian and Ugaritic documents." },
    ],
    disagree: [
      "Harper and Fox end the Late Cypriot at c. 1150 BC; Wikipedia's phases run on to 1100 BC and beyond.",
      "Wikipedia treats Cyprus as the \"Alashiya\" of ancient letters. The identification is widely used but is flagged here until it is checked against specialist sources.",
    ],
    hellenika: ["mycenaean-civilisation", "bronze-age-collapse", "enkomi", "hala-sultan-tekke", "ugarit-letters", "uluburun-shipwreck", "sea-peoples-invasion"],
    sites: ["enkomi", "kition", "hala-sultan-tekke", "kalavasos", "alassa", "pyla-kokkinokremos", "apliki"],
    overview: [
      { text: "In the Late Bronze Age, Cyprus was a major source of copper for its neighbours, and copper was traded by sea in heavy slabs called oxhide ingots.", sources: ["wikipedia-alashiya", "wikipedia-oxhide-ingot"] },
      { text: "Letters found in Egypt and at Ugarit show a king of \"Alashiya\" writing to the pharaoh as his \"brother\". Testing the clay of those letters points to southern Cyprus.", sources: ["wikipedia-alashiya", "goren-2003"] },
      { text: "Towns such as Enkomi, Kition and Hala Sultan Tekke grew rich on this trade, and the island's people wrote in their own script, Cypro-Minoan, which has never been deciphered.", sources: ["wikipedia-enkomi", "wikipedia-hala-sultan-tekke", "wikipedia-cypro-minoan"] },
      { text: "Around 1200 BC, as kingdoms fell across the eastern Mediterranean, some Cypriot settlements were abandoned and at least one was destroyed, while others, like Kition, went on to prosper.", sources: ["wikipedia-bronze-age-collapse"] },
    ],
    excavated: true,
  },
  {
    id: "bronze-iron-transition",
    name: "Bronze to Iron",
    era: "Bronze Age",
    subtitle: "The transition: Late Cypriot IIIB",
    start: -1150, end: -1050, dates: "c. 1150–1050 BC",
    says: [
      { source: "harper-fox-2008", text: "Late Cypriot ends c. 1150 BC; Cypro-Geometric begins c. 1050 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "The Iron Age follows the Submycenaean period (1125–1050 BC)." },
    ],
    disagree: [
      "This layer fills the century that Harper and Fox's table leaves between the Bronze and Iron Ages. Its name and boundaries are a working choice for this site, not a single agreed scheme.",
    ],
    hellenika: ["bronze-age-collapse", "greek-dark-age"],
    sites: [],
    excavated: false,
  },
  {
    id: "cypro-geometric",
    name: "Cypro-Geometric",
    era: "Iron Age",
    subtitle: "Early Iron Age",
    start: -1050, end: -750, dates: "c. 1050–750 BC",
    says: [
      { source: "georgiadou-kyprios-character", text: "Cypro-Geometric I: 1050–950 BC; II: 950–900 BC; III: 900–750 BC (conventional absolute dates)." },
      { source: "harper-fox-2008", text: "Cypro-Geometric: c. 1050–750 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "Geometric: 1050–700 BC." },
    ],
    disagree: [
      "The end date differs: 750 BC (Georgiadou; Harper and Fox) against 700 BC (Wikipedia).",
    ],
    hellenika: ["greek-dark-age", "archaic-greece"],
    sites: ["salamis"],
    excavated: false,
  },
  {
    id: "cypro-archaic",
    name: "Cypro-Archaic",
    era: "Iron Age",
    subtitle: "The city-kingdoms",
    start: -750, end: -480, dates: "c. 750–480 BC",
    says: [
      { source: "georgiadou-kyprios-character", text: "Cypro-Archaic I: 750–600 BC; II: 600–480 BC (conventional absolute dates)." },
      { source: "harper-fox-2008", text: "Cypro-Archaic: c. 750–475 BC." },
      { source: "wikipedia-prehistoric-cyprus", text: "Archaic: 700–525 BC." },
    ],
    disagree: [
      "Three versions: 750–480 BC (Georgiadou), 750–475 BC (Harper and Fox) and 700–525 BC (Wikipedia).",
    ],
    hellenika: ["archaic-greece", "kition", "salamis-cyprus", "idalion", "tamassos", "amathous", "palaepaphos"],
    sites: ["kition", "salamis", "amathus", "palaepaphos"],
    excavated: false,
  },
  {
    id: "cypro-classical",
    name: "Cypro-Classical",
    era: "Iron Age",
    subtitle: "Between Persia and the Greek world",
    start: -480, end: -310, dates: "c. 480–310 BC",
    says: [
      { source: "georgiadou-kyprios-character", text: "Cypro-Classical I: 480–400 BC; II: 400–310 BC (conventional absolute dates)." },
      { source: "harper-fox-2008", text: "Cypro-Classical: 475–325 BC." },
    ],
    disagree: [
      "The end date differs: 310 BC (Georgiadou) against 325 BC (Harper and Fox).",
    ],
    hellenika: ["classical-greece", "alexander-empire", "vouni-palace", "marion", "soloi"],
    sites: ["salamis", "kition"],
    excavated: false,
  },
  {
    id: "hellenistic",
    name: "Hellenistic",
    era: "Ancient",
    subtitle: "Under the Ptolemies",
    start: -310, end: -58, dates: "c. 310–58 BC",
    says: [
      { source: "harper-fox-2008", text: "Hellenistic: 325–58 BC." },
      { source: "wikipedia-history-of-cyprus", text: "Ptolemy lost Cyprus to Demetrios Poliorketes between 306 and 295 BC; after that it remained under Ptolemaic rule until 58 BC." },
    ],
    disagree: [
      "The start depends on where the Cypro-Classical is ended: 310 BC (Georgiadou) or 325 BC (Harper and Fox).",
      "Mark Antony later gave Cyprus back to Ptolemaic rulers, so Ptolemaic rule did not fully end until 30 BC (Wikipedia).",
    ],
    hellenika: ["hellenistic-period", "ptolemaic-egypt", "battle-salamis-cyprus-306bc", "zeno-of-citium", "nea-paphos"],
    sites: ["salamis", "kition"],
    excavated: false,
  },
  {
    id: "roman",
    name: "Roman",
    era: "Ancient",
    subtitle: "A Roman province",
    start: -58, end: 330, dates: "58 BC – AD 330",
    says: [
      { source: "harper-fox-2008", text: "Roman: 58 BC – AD 330." },
      { source: "wikipedia-history-of-cyprus", text: "Cyprus became a Roman province in 58 BC; after Antony gave it to Cleopatra and Arsinoe IV, it became a Roman province again in 30 BC." },
    ],
    disagree: [
      "Roman rule began in 58 BC but was interrupted; some accounts start the Roman period in 30 BC.",
    ],
    hellenika: ["roman-conquest", "roman-greece", "kourion"],
    sites: ["kourion", "salamis"],
    excavated: false,
  },
  {
    id: "late-roman",
    name: "Late Roman",
    era: "Medieval",
    subtitle: "Late Roman and early Byzantine Cyprus",
    start: 330, end: 688, dates: "AD 330 – 688",
    says: [
      { source: "harper-fox-2008", text: "Late Roman: AD 330 – c. 700." },
      { source: "wikipedia-history-of-cyprus", text: "Cyprus came under Eastern Roman administration; Arab Muslims invaded in the 650s; in 688 an agreement between the caliph and the emperor began a period of joint rule." },
    ],
    disagree: [
      "Harper and Fox end this period at c. 700. This site ends it at 688, the agreement that Wikipedia dates the joint rule from.",
    ],
    hellenika: ["byzantine-empire"],
    sites: ["salamis", "kourion"],
    excavated: false,
  },
  {
    id: "arab-byzantine",
    name: "Arab–Byzantine shared rule",
    era: "Medieval",
    subtitle: "Three centuries between caliphate and empire",
    start: 688, end: 965, dates: "AD 688 – 965",
    says: [
      { source: "wikipedia-history-of-cyprus", text: "For the next 300 years Cyprus was ruled jointly by the Arabs and the Byzantines as a condominium; this lasted until 965, when Niketas Chalkoutzes conquered the island for the Byzantine Empire." },
      { source: "harper-fox-2008", text: "Does not separate this era: its Byzantine period runs from c. AD 700 to 1192." },
    ],
    disagree: [
      "Whether to treat this as its own period, and what to call it, varies between sources. \"Condominium\" (shared rule) is Wikipedia's word.",
    ],
    hellenika: ["byzantine-empire"],
    sites: [],
    excavated: false,
  },
  {
    id: "middle-byzantine",
    name: "Middle Byzantine",
    era: "Medieval",
    subtitle: "Back under Constantinople",
    start: 965, end: 1191, dates: "AD 965 – 1191",
    says: [
      { source: "wikipedia-history-of-cyprus", text: "Byzantine conquest in 965. In 1185 the governor Isaac Komnenos rebelled and kept control of the island. Richard the Lionheart landed at Limassol on 1 June 1191." },
      { source: "harper-fox-2008", text: "Byzantine: c. AD 700 – 1192." },
    ],
    disagree: [],
    hellenika: ["byzantine-empire"],
    sites: ["nicosia", "kyrenia"],
    excavated: false,
  },
  {
    id: "lusignan",
    name: "Lusignan",
    era: "Medieval",
    subtitle: "The Kingdom of Cyprus",
    start: 1191, end: 1489, dates: "AD 1192 – 1489",
    says: [
      { source: "harper-fox-2008", text: "Medieval, Lusignan: AD 1192 – 1489." },
      { source: "wikipedia-history-of-cyprus", text: "The House of Lusignan established the Kingdom of Cyprus in 1192. The Mamluks made it a tributary state in 1426. In 1489 the last queen, Catherine Cornaro, was forced to sell the island to Venice." },
    ],
    disagree: [
      "Richard I landed on Cyprus in 1191, a year before the kingdom began. That year is drawn as part of this layer.",
    ],
    hellenika: [],
    sites: ["nicosia", "famagusta"],
    excavated: false,
  },
  {
    id: "venetian",
    name: "Venetian",
    era: "Early modern",
    subtitle: "A Venetian possession",
    start: 1489, end: 1571, dates: "AD 1489 – 1571",
    says: [
      { source: "harper-fox-2008", text: "Venetian: AD 1489 – 1571." },
      { source: "wikipedia-history-of-cyprus", text: "Sold to Venice in 1489; captured by the Ottomans in 1571." },
    ],
    disagree: [],
    hellenika: [],
    sites: ["nicosia", "famagusta"],
    excavated: false,
  },
  {
    id: "ottoman",
    name: "Ottoman",
    era: "Early modern",
    subtitle: "A province of the Ottoman Empire",
    start: 1571, end: 1878, dates: "AD 1571 – 1878",
    says: [
      { source: "harper-fox-2008", text: "Ottoman: AD 1571 – 1878." },
      { source: "wikipedia-history-of-cyprus", text: "In 1571 Cyprus became an eyalet (province) of the Ottoman Empire, until 1878." },
    ],
    disagree: [],
    hellenika: [],
    sites: ["nicosia", "famagusta"],
    excavated: false,
  },
  {
    id: "british",
    name: "British",
    era: "Modern",
    subtitle: "Protectorate, annexation, crown colony",
    start: 1878, end: 1960, dates: "AD 1878 – 1960",
    says: [
      { source: "harper-fox-2008", text: "British Colonial: AD 1878 – 1960." },
      { source: "wikipedia-history-of-cyprus", text: "In 1878, under the Cyprus Convention, the United Kingdom took over the government of the island. Britain annexed it in 1914, at the start of the First World War, and declared it a Crown Colony in 1925." },
    ],
    disagree: [
      "The Ottoman Empire kept formal sovereignty from 1878 until the British annexation of 1914, so \"British Cyprus\" before 1914 means British government, not British sovereignty.",
    ],
    hellenika: [],
    sites: ["nicosia"],
    excavated: false,
  },
  {
    id: "since-1960",
    name: "Independence and after",
    era: "Modern",
    subtitle: "From 1960 to today",
    start: 1960, end: null, dates: "AD 1960 – today",
    says: [
      { source: "harper-fox-2008", text: "Republic of Cyprus: AD 1960 – present." },
      { source: "wikipedia-history-of-cyprus", text: "An independent republic, the Republic of Cyprus, was established in 1960." },
      { source: "un-unficyp", text: "A UN peacekeeping force was set up in March 1964 \"to prevent further fighting between the Greek Cypriot and Turkish Cypriot communities\". After \"the hostilities of 1974\" its mandate was extended." },
      { source: "eu-cyprus", text: "EU Member State since 1 May 2004. EU law is suspended in areas where the government of the Republic does not exercise effective control." },
    ],
    disagree: [
      "This is the layer where accounts differ most, and where words themselves are contested. When it is excavated, each community's account will be shown side by side, with sources, in neutral language.",
    ],
    hellenika: [],
    sites: ["nicosia"],
    excavated: false,
  },
];
