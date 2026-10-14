/* =========================================================
   KYPRIAKA · method: evidence types and confidence
   ---------------------------------------------------------
   Every factual claim carries one evidence type and one
   confidence level. The first eight evidence types and the
   whole confidence scale are Hellenika's, used with George
   Philippou's permission so the two sites mean the same thing.
   "documentary" and "testimony" are Kypriaka's additions, for
   medieval and modern Cyprus.
   ========================================================= */

window.KYPRIAKA = window.KYPRIAKA || {};

KYPRIAKA.evidence = {
  archaeological: { label: "Archaeological", desc: "Excavated material remains: structures, objects, deposits." },
  literary:       { label: "Literary", desc: "Written narrative sources composed as texts to be read." },
  epigraphic:     { label: "Epigraphic", desc: "Inscriptions on stone, clay or metal, usually contemporary." },
  numismatic:     { label: "Numismatic", desc: "Coins: their designs, metal, weight and find distribution." },
  linguistic:     { label: "Linguistic", desc: "Evidence from language structure, script and etymology." },
  tradition:      { label: "Ancient tradition", desc: "What ancient people believed, reported as belief rather than fact." },
  consensus:      { label: "Scholarly consensus", desc: "A settled modern conclusion drawn from combined evidence." },
  debate:         { label: "Scholarly debate", desc: "An open modern question with credible positions on more than one side." },
  documentary:    { label: "Documentary", desc: "Archives, official records, treaties, censuses and other documents of the time.", kypriaka: true },
  testimony:      { label: "Testimony", desc: "Memoirs and oral history: personal accounts, shown as such.", kypriaka: true },
};

KYPRIAKA.confidence = {
  established: { label: "Established", rank: 6, desc: "Multiple independent lines of evidence. No serious dissent." },
  strong:      { label: "Strong evidence", rank: 5, desc: "Well supported and widely accepted, with minor open questions." },
  probable:    { label: "Probable", rank: 4, desc: "The best current explanation, but not decisively demonstrated." },
  debated:     { label: "Debated", rank: 3, desc: "Specialists actively disagree; the evidence underdetermines the answer." },
  speculative: { label: "Speculative", rank: 2, desc: "A proposal worth stating that the evidence does not currently support." },
  legendary:   { label: "Legendary", rank: 1, desc: "Known only from myth or tradition, with no independent corroboration." },
};

/* The kinds of entity the site can hold, and how they read in lists. */
KYPRIAKA.types = {
  period:  { label: "Layer", plural: "Layers" },
  person:  { label: "Person", plural: "People" },
  place:   { label: "Place", plural: "Places" },
  object:  { label: "Object", plural: "Objects" },
  event:   { label: "Event", plural: "Events" },
  myth:    { label: "Myth or cult", plural: "Myth & cult" },
  thinker: { label: "Thinker or faith", plural: "Thinkers & faith" },
  writing: { label: "Writing", plural: "Writing" },
};

/* Relationships are written once; the reverse appears automatically.
   If you invent a new label, add its reverse here. */
KYPRIAKA.inverse = {
  "part of": "contains",
  "born in": "birthplace of",
  "died in": "place of death of",
  "ruled": "ruled by",
  "founded": "founded by",
  "found at": "find spot of",
  "made in": "place of making of",
  "took place at": "site of",
  "excavated by": "excavated",
  "worshipped at": "cult centre of",
  "taught": "student of",
  "influenced": "influenced by",
  "wrote": "written by",
  "fought in": "fought by",
  "traded with": "traded with",
  "proposed capital of": "proposed capital",
  "sent from": "sender of",
  "clay traced to": "possible source of the clay of",
  "abandoned during": "saw the abandonment of",
  "destroyed during": "saw the destruction of",
  "prospered after": "followed by prosperity at",
};
