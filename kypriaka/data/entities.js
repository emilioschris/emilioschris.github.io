/* =========================================================
   KYPRIAKA · entities: people, places, objects, events,
   myths and cults, thinkers and faiths
   ---------------------------------------------------------
   Empty in Stage 1: nothing has been excavated yet.
   When adding an entity, use this shape (every claim needs a
   source, an evidence type and a confidence level):

   {
     id: "kition",                       // lower-case, hyphens
     type: "place",                      // see KYPRIAKA.types in method.js
     name: "Kition",
     altNames: ["Κίτιον", "Larnaka"],    // Greek, Turkish, other names
     period: ["cypro-archaic"],          // ids from periods.js
     start: -1300, end: null,            // optional years (negative = BC)
     place: "kition",                    // optional map place from geo.js
     summary: "One or two plain sentences.",
     claims: [
       { text: "A single factual statement.",
         evidence: "archaeological",       // see KYPRIAKA.evidence
         confidence: "established",        // see KYPRIAKA.confidence
         sources: ["source-id"] },         // ids from sources.js
     ],
     relations: [ { id: "zeno-of-citium", rel: "birthplace of" } ],
     sources: ["source-id"],
     hellenika: ["kition"],              // ids from hellenika.js
   }

   Myths use extra fields instead of plain claims:
     story, earliestSource, religiousRole, historicalBackground,
     archaeology, laterReinterpretation
   ========================================================= */

window.KYPRIAKA = window.KYPRIAKA || {};

KYPRIAKA.entities = [];
