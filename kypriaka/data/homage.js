/* =========================================================
   KYPRIAKA · The Deepest Layer
   ---------------------------------------------------------
   A homage to Dr Carole McCartney (1965 to 2021), shown at
   the very bottom of the strata, beneath the Akrotiri phase.

   Facts come only from four sources (Wikipedia, the Cyprus
   Mail's report of the University of Cyprus ARU tribute, the
   Cyprus Press and Information Office, and the archaeology.wiki
   obituary) plus her own publications for what they report.
   No invented quotes or details, and no family members named.
   Every claim carries an evidence type and a confidence level,
   as everywhere else in Kypriaka.
   ========================================================= */

window.KYPRIAKA = window.KYPRIAKA || {};

KYPRIAKA.homage = {
  id: "deepest-layer",
  title: "The Deepest Layer",
  dedication: "In memory of Dr Carole McCartney, 1965 to 2021",
  intro: "Beneath every layer in this excavation lies the work of the people who dug it. This one is for an archaeologist who spent more than thirty years with the oldest tools on the island: the flakes, blades and cores of chipped stone that are often all that remains of the first people to reach Cyprus.",

  life: [
    { text: "Carole McCartney was born in Pittsburgh, Pennsylvania, in 1965.",
      evidence: "documentary", confidence: "established", sources: ["wikipedia-mccartney"] },
    { text: "She studied archaeology at the University of Edinburgh, earning a master's degree in 1989 and a PhD in 1996 on chipped stone technology in the Levant.",
      evidence: "documentary", confidence: "established", sources: ["cyprus-mail-aru-2021", "archaeology-wiki-mccartney", "wikipedia-mccartney"] },
    { text: "She first came to Cyprus in 1987 with Eddie Peltenburg's Edinburgh team, excavating Chalcolithic sites in the Paphos district.",
      evidence: "documentary", confidence: "established", sources: ["cyprus-mail-aru-2021", "archaeology-wiki-mccartney"] },
    { text: "She settled on the island in 1995, made her home in Kissonerga, became a Cypriot citizen and spoke Greek.",
      evidence: "documentary", confidence: "established", sources: ["cyprus-mail-aru-2021", "archaeology-wiki-mccartney"] },
    { text: "Over three decades she worked as a lithics specialist on excavations and surveys in Cyprus, Jordan, Syria and Egypt, and wrote or co-wrote more than fifty papers.",
      evidence: "documentary", confidence: "established", sources: ["cyprus-mail-aru-2021", "wikipedia-mccartney"] },
    { text: "The Archaeological Research Unit of the University of Cyprus called her \"one of the leading experts on Cypriot lithics on an international level\", and said she \"was eager to train the new generation of archaeologists\".",
      evidence: "testimony", confidence: "established", sources: ["cyprus-mail-aru-2021"] },
  ],

  work: [
    { title: "An older Neolithic",
      claim: { text: "She was among the first to recognise the early date and significance of material from the Mylouthkia wells at Kissonerga, the lower levels of Kalavasos Tenta and sites found by the Sydney Cyprus Survey Project, which extended the Neolithic in Cyprus back to the Pre-Pottery Neolithic B. Her work also suggested that the earliest visits to the island were older still, and that Akrotiri Aetokremnos was not unique.",
        evidence: "documentary", confidence: "strong", sources: ["cyprus-mail-aru-2021", "peltenburg-2000"] } },
    { title: "Elaborating Early Neolithic Cyprus",
      claim: { text: "In 2005 she launched this project, a collaboration between the University of Cyprus, Cornell University and Trent University, centred on excavations at Ayia Varvara Asprokremnos: a Pre-Pottery Neolithic site of around 9000 BC in the Troodos foothills, where the finds may relate to the use of mineral resources, workshops and ritual activity.",
        evidence: "documentary", confidence: "strong", sources: ["cyprus-mail-aru-2021", "archaeology-wiki-mccartney", "mccartney-1998"] } },
    { title: "Sharing the evidence",
      claim: { text: "She worked with the Department of Antiquities on displays at the Cyprus Museum and the Pafos and Larnaka archaeological museums, taught students from universities around the world, and in 2016 co-organised the 8th international conference on Pre-Pottery Neolithic chipped and ground stone industries at the University of Cyprus.",
        evidence: "documentary", confidence: "established", sources: ["archaeology-wiki-mccartney", "cyprus-mail-aru-2021"] } },
    { title: "Her last questions",
      claim: { text: "From 2019 she worked with the University of Cyprus, the Cyprus University of Technology and Israeli colleagues on the probable sea routes between Cyprus and the nearby coasts at the start of the Holocene, the first crossings that brought people here. At the time of her death she was also studying material from the early Neolithic site of Roudias in the Paphos forest.",
        evidence: "documentary", confidence: "established", sources: ["cyprus-mail-aru-2021"] } },
  ],

  timeline: [
    { year: "1965", text: "Born in Pittsburgh", sources: ["wikipedia-mccartney"] },
    { year: "1987", text: "First season in Cyprus, Paphos district", sources: ["cyprus-mail-aru-2021"] },
    { year: "1989", text: "Master's degree, University of Edinburgh", sources: ["cyprus-mail-aru-2021"] },
    { year: "1995", text: "Settles in Cyprus", sources: ["cyprus-mail-aru-2021"] },
    { year: "1996", text: "PhD, University of Edinburgh", sources: ["cyprus-mail-aru-2021"] },
    { year: "1998", text: "First report on the chipped stone from Ayia Varvara Asprokremnos", sources: ["mccartney-1998"] },
    { year: "2000", text: "Co-author, early colonisation of Cyprus (Antiquity)", sources: ["peltenburg-2000"] },
    { year: "2005", text: "Research fellow at the University of Cyprus; launches Elaborating Early Neolithic Cyprus", sources: ["cyprus-mail-aru-2021"] },
    { year: "2010", text: "Co-author, Pre-Pottery Neolithic A occupation in Cyprus (Antiquity)", sources: ["manning-2010"] },
    { year: "2016", text: "Co-organises the stone industries conference in Nicosia", sources: ["cyprus-mail-aru-2021"] },
    { year: "2019", text: "Postdoctoral researcher; begins the sea routes project", sources: ["cyprus-mail-aru-2021"] },
    { year: "2021", text: "Dies on 13 March", sources: ["archaeology-wiki-mccartney", "wikipedia-mccartney"] },
  ],

  // Each of these was checked in Crossref (DOI links)
  bibliography: ["mccartney-1996", "mccartney-1998", "peltenburg-2000", "webb-2009", "manning-2010", "stewart-2020"],
  further: ["bolger-clarke-mccartney"],
  // Two works listed on Wikipedia that couldn't be confirmed, so they're left out:
  // the 2008 RDAC report on the 2007 EENC season, and the 2010 "Landscapes in Transition" chapter.

  // Her key sites, pinned on the Kypriaka map with a link back here
  sites: ["asprokremnos", "mylouthkia", "tenta"],

  // The sea-crossings map: illustrative only, not reconstructed routes.
  // Start and end points are simply nearby coasts, chosen for the drawing.
  crossings: [
    { from: [32.85, 36.08], to: [33.05, 35.36], label: "From the southern Anatolian coast", labelAt: [32.95, 36.2], anchor: "start" },
    { from: [35.76, 35.48], to: [34.58, 35.69], label: "From the northern Levant", labelAt: [35.9, 35.05], anchor: "end" },
  ],
  crossingsCaption: "Possible crossings to Cyprus from the nearby coasts at the start of the Holocene, the question of her final project. Drawn for illustration only: these are not reconstructed routes.",
};
