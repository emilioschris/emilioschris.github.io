/* =========================================================
   KYPRIAKA · sources
   ---------------------------------------------------------
   Every date and claim on the site points to one of these by
   its id. To add a source, copy a block and give it a new id.

   short     How it's cited on the page.
   kind      "scholarly"  peer-reviewed article or academic book
             "research"   research institute or university site
             "official"   government or international body
             "reference"  encyclopaedia (useful, but check it)
             "data"       a dataset (map outlines, coordinates)
             "sibling"    Hellenika, the site Kypriaka follows
   used for  What this site actually takes from it.
   accessed  When it was read (YYYY-MM-DD).
   ========================================================= */

window.KYPRIAKA = window.KYPRIAKA || {};

KYPRIAKA.sources = {
  "harper-fox-2008": {
    short: "Harper and Fox (2008)",
    kind: "scholarly",
    citation: "Harper, N. K. and Fox, S. C. (2008). Recent research in Cypriot bioarchaeology. Bioarchaeology of the Near East 2: 1–38.",
    url: "http://www.anthropology.uw.edu.pl/02/bne-02-01.pdf",
    usedFor: "Table 1, \"Chronology of Cyprus\": the main period scheme for the strata, from the Akrotiri phase to the present.",
    accessed: "2026-10-14",
  },
  "georgiadou-kyprios-character": {
    short: "Georgiadou, Kyprios Character",
    kind: "research",
    citation: "Georgiadou, A. P. Pottery of Geometric, Archaic and Classical periods in Cyprus. Kyprios Character, Institute of Historical Research, National Hellenic Research Foundation.",
    url: "http://kyprioscharacter.eie.gr/en/scientific-texts/details/archaeology/pottery-of-geometric-archaic-and-classical-periods-in-cyprus",
    usedFor: "The conventional absolute dates of the Cypro-Geometric, Cypro-Archaic and Cypro-Classical periods (Gjerstad's scheme).",
    accessed: "2026-10-14",
  },
  "wikipedia-prehistoric-cyprus": {
    short: "Wikipedia: Prehistoric Cyprus",
    kind: "reference",
    citation: "Wikipedia contributors. \"Prehistoric Cyprus\", revision 1380023422 (13 October 2026).",
    url: "https://en.wikipedia.org/w/index.php?title=Prehistoric_Cyprus&oldid=1380023422",
    usedFor: "A second opinion on prehistoric dates. Where it disagrees with the scholarly sources, the disagreement is shown.",
    note: "Some of its dates are inconsistent with each other (for example its Iron Age divisions), so it is never the only source for a date.",
    accessed: "2026-10-14",
  },
  "wikipedia-history-of-cyprus": {
    short: "Wikipedia: History of Cyprus",
    kind: "reference",
    citation: "Wikipedia contributors. \"History of Cyprus\", revision 1379199046 (8 October 2026).",
    url: "https://en.wikipedia.org/w/index.php?title=History_of_Cyprus&oldid=1379199046",
    usedFor: "Dates for the Roman, Byzantine, medieval, Ottoman, British and modern periods.",
    note: "Used for dates only. Some of its wording takes sides (for example on Ottoman rule), and Kypriaka does not repeat that language.",
    accessed: "2026-10-14",
  },
  "eu-cyprus": {
    short: "European Union",
    kind: "official",
    citation: "European Union. Cyprus: EU country profile. european-union.europa.eu.",
    url: "https://european-union.europa.eu/principles-countries-history/eu-countries/cyprus_en",
    usedFor: "EU membership since 1 May 2004, and the note that EU law is suspended in areas where the government of the Republic does not exercise effective control.",
    accessed: "2026-10-14",
  },
  "un-unficyp": {
    short: "UN Peacekeeping (UNFICYP)",
    kind: "official",
    citation: "United Nations Peacekeeping. UNFICYP Fact Sheet. peacekeeping.un.org.",
    url: "https://peacekeeping.un.org/en/mission/unficyp",
    usedFor: "The UN force established in March 1964 \"to prevent further fighting between the Greek Cypriot and Turkish Cypriot communities\", and its neutral wording for \"the hostilities of 1974\".",
    accessed: "2026-10-14",
  },
  "wikidata": {
    short: "Wikidata",
    kind: "data",
    citation: "Wikidata, the free knowledge base (coordinate location, property P625).",
    url: "https://www.wikidata.org/",
    usedFor: "The coordinates of every place on the map. Each place links to its own Wikidata entry.",
    accessed: "2026-10-14",
  },
  "natural-earth": {
    short: "Natural Earth",
    kind: "data",
    citation: "Natural Earth, 1:10m and 1:50m land (public domain), via the world-atlas package 2.0.2.",
    url: "https://www.naturalearthdata.com/",
    usedFor: "The coastline of Cyprus and the eastern Mediterranean on the map, simplified once and saved with the site.",
    accessed: "2026-10-14",
  },
  "goren-2003": {
    short: "Goren et al. (2003)",
    kind: "scholarly",
    citation: "Goren, Y., Bunimovitz, S., Finkelstein, I. and Na'aman, N. (2003). The Location of Alashiya: New Evidence from Petrographic Investigation of Alashiyan Tablets from El-Amarna and Ugarit. American Journal of Archaeology 107(2): 233–255. doi:10.3764/aja.107.2.233.",
    url: "https://ajaonline.org/?p=797",
    usedFor: "The clay of the letters sent from Alashiya: traced to the margin of the Troodos Mountains in Cyprus, with Kalavasos-Ayios Dhimitrios or Alassa as the likely source of the official letters.",
    note: "Read from the journal's own abstract page, not the full article.",
    accessed: "2026-10-14",
  },
  "georgiou-2012": {
    short: "Georgiou (2012)",
    kind: "scholarly",
    citation: "Georgiou, A. (2012). Pyla-Kokkinokremos, Maa-Palaeokastro and the settlement histories of Cyprus in the twelfth century BC. DPhil thesis, University of Oxford.",
    url: "https://ora.ox.ac.uk/objects/uuid:d4adbae2-3dd8-43d8-a997-a2f0ecddc450",
    usedFor: "The dates of Pyla-Kokkinokremos and Maa-Palaeokastro, and the debate over who founded them: refugees from the Aegean (the excavator's view) or local Cypriots.",
    note: "Read from the thesis abstract in the Oxford University Research Archive.",
    accessed: "2026-10-14",
  },
  "wikipedia-alashiya": {
    short: "Wikipedia: Alashiya",
    kind: "reference",
    citation: "Wikipedia contributors. \"Alashiya\", revision 1356925954 (2026-05-30).",
    url: "https://en.wikipedia.org/w/index.php?title=Alashiya&oldid=1356925954",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-enkomi": {
    short: "Wikipedia: Enkomi",
    kind: "reference",
    citation: "Wikipedia contributors. \"Enkomi (archaeological site)\", revision 1368148299 (2026-08-07).",
    url: "https://en.wikipedia.org/w/index.php?title=Enkomi_%28archaeological_site%29&oldid=1368148299",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-kition": {
    short: "Wikipedia: Kition",
    kind: "reference",
    citation: "Wikipedia contributors. \"Kition\", revision 1375390696 (2026-09-17).",
    url: "https://en.wikipedia.org/w/index.php?title=Kition&oldid=1375390696",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-hala-sultan-tekke": {
    short: "Wikipedia: Hala Sultan Tekke",
    kind: "reference",
    citation: "Wikipedia contributors. \"Hala Sultan Tekke\", revision 1367241373 (2026-08-01).",
    url: "https://en.wikipedia.org/w/index.php?title=Hala_Sultan_Tekke&oldid=1367241373",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-alassa": {
    short: "Wikipedia: Alassa",
    kind: "reference",
    citation: "Wikipedia contributors. \"Alassa\", revision 1377546319 (2026-09-29).",
    url: "https://en.wikipedia.org/w/index.php?title=Alassa&oldid=1377546319",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-pyla": {
    short: "Wikipedia: Pyla-Kokkinokremos",
    kind: "reference",
    citation: "Wikipedia contributors. \"Pyla-Kokkinokremos\", revision 1323765626 (2025-11-23).",
    url: "https://en.wikipedia.org/w/index.php?title=Pyla-Kokkinokremos&oldid=1323765626",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-maa": {
    short: "Wikipedia: Maa Palaeokastro",
    kind: "reference",
    citation: "Wikipedia contributors. \"Maa Palaeokastro\", revision 1296537909 (2025-06-20).",
    url: "https://en.wikipedia.org/w/index.php?title=Maa_Palaeokastro&oldid=1296537909",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-apliki": {
    short: "Wikipedia: Apliki",
    kind: "reference",
    citation: "Wikipedia contributors. \"Apliki\", revision 1377553702 (2026-09-30).",
    url: "https://en.wikipedia.org/w/index.php?title=Apliki&oldid=1377553702",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-oxhide-ingot": {
    short: "Wikipedia: Oxhide ingot",
    kind: "reference",
    citation: "Wikipedia contributors. \"Oxhide ingot\", revision 1348336206 (2026-04-12).",
    url: "https://en.wikipedia.org/w/index.php?title=Oxhide_ingot&oldid=1348336206",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-cypro-minoan": {
    short: "Wikipedia: Cypro-Minoan script",
    kind: "reference",
    citation: "Wikipedia contributors. \"Cypro-Minoan script\", revision 1361395878 (2026-06-27).",
    url: "https://en.wikipedia.org/w/index.php?title=Cypro-Minoan_script&oldid=1361395878",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikipedia-bronze-age-collapse": {
    short: "Wikipedia: Late Bronze Age collapse",
    kind: "reference",
    citation: "Wikipedia contributors. \"Late Bronze Age collapse\", revision 1380017526 (2026-10-13).",
    url: "https://en.wikipedia.org/w/index.php?title=Late_Bronze_Age_collapse&oldid=1380017526",
    usedFor: "Late Cypriot layer.",
    accessed: "2026-10-14",
  },
  "wikimedia-commons": {
    short: "Wikimedia Commons",
    kind: "data",
    citation: "Wikimedia Commons, the free media repository.",
    url: "https://commons.wikimedia.org/",
    usedFor: "Photographs. Each photo is credited to its photographer, with its licence, and links to its own page.",
    accessed: "2026-10-14",
  },
  "hellenika": {
    short: "Hellenika (Philippou)",
    kind: "sibling",
    citation: "Philippou, G. Ἑλληνικά (Hellenika): an interactive atlas of the Ancient Greek world, 3200 BC to 30 BC.",
    url: "https://georgephilippou.github.io/Hellenika/",
    usedFor: "The structure Kypriaka follows (timeline, map, explore, relationships, search, sources), the evidence types and confidence scale, and every \"See also in Hellenika\" link.",
    note: "Source code: https://github.com/GeorgePhilippou/Hellenika. Structure mirrored with George's permission; Kypriaka's code and design are its own.",
    accessed: "2026-10-14",
  },
};
