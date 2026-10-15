/* =========================================================
   KYPRIAKA · entities: people, places, objects, events,
   myths and cults, thinkers and faiths
   ---------------------------------------------------------
   All 24 layers are excavated (stage 2, October 2026).
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
     image: { src, alt, caption, credit, licence, page }  // optional photo
   }

   A claim whose sources are all encyclopedias (kind "reference")
   is marked "single source" on the page automatically.

   Myths use extra fields instead of plain claims:
     story, earliestSource, religiousRole, historicalBackground,
     archaeology, laterReinterpretation
   ========================================================= */

window.KYPRIAKA = window.KYPRIAKA || {};

/* ---------- LATE CYPRIOT (c. 1650–1150 BC) ---------- */
KYPRIAKA.entities = [
  {
    "id": "alashiya",
    "type": "place",
    "name": "Alashiya",
    "altNames": [
      "Alašiya",
      "Alasiya"
    ],
    "period": [
      "middle-cypriot",
      "late-cypriot"
    ],
    "summary": "A Bronze Age kingdom that exported copper, known from letters and treaties across the Near East. Most scholars now place it on Cyprus, but not everyone, and where its centre lay is still unknown.",
    "claims": [
      {
        "text": "Alashiya is named in texts written in Egyptian, Hittite, Akkadian, Mycenaean Greek (Linear B) and Ugaritic.",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-alashiya"
        ]
      },
      {
        "text": "The Amarna letters (c. 1350 BC) include letters between the king of Alashiya and the pharaoh, mostly about copper sent in return for silver and ivory. The king calls the pharaoh his \"brother\".",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-alashiya"
        ]
      },
      {
        "text": "Analysis of the clay of letters sent from Alashiya, found at Amarna and Ugarit, points to the margin of the Troodos Mountains in Cyprus, with Kalavasos-Ayios Dhimitrios or Alassa as the likely source of the official letters.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "goren-2003"
        ]
      },
      {
        "text": "That Alashiya was on Cyprus is now generally, though not universally, accepted.",
        "evidence": "consensus",
        "confidence": "strong",
        "sources": [
          "wikipedia-alashiya",
          "goren-2003"
        ]
      },
      {
        "text": "Whether Alashiya covered the whole island or only part of it, and where its capital was, remains unclear.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-alashiya"
        ]
      },
      {
        "text": "Around 1200 BC the Hittite kings Tudhaliya IV and Suppiluliuma II campaigned against Alashiya and forced its king to sign a treaty of submission.",
        "evidence": "epigraphic",
        "confidence": "probable",
        "sources": [
          "wikipedia-alashiya"
        ]
      },
      {
        "text": "A king of Ugarit asked the king of Alashiya for military help. The first Cypriot king known by name, Kushmeshusha, appears in 13th-century BC letters to Ugarit.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-alashiya"
        ]
      }
    ],
    "sources": [
      "wikipedia-alashiya",
      "goren-2003"
    ]
  },
  {
    "id": "alashiya-letters",
    "type": "object",
    "name": "The Alashiya letters (Amarna EA 33–40)",
    "period": [
      "late-cypriot"
    ],
    "summary": "Eight clay tablets sent from the king of Alashiya to the pharaoh of Egypt, found in the archive at Amarna.",
    "claims": [
      {
        "text": "Eight letters from Alashiya survive in the Amarna archive, numbered EA 33 to EA 40.",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-alashiya"
        ]
      },
      {
        "text": "One letter mentions 500 talents of copper, and makes excuses for how little copper has been sent.",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-alashiya"
        ]
      }
    ],
    "relations": [
      {
        "id": "alashiya",
        "rel": "sent from"
      },
      {
        "id": "kalavasos",
        "rel": "clay traced to"
      },
      {
        "id": "alassa",
        "rel": "clay traced to"
      }
    ],
    "image": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Amarna_letter._%22Message_from_the_king_of_Alashiya%2C_your_brother%22_to_the_Pharaoh_of_Egypt%2C_possibly_Akhenaten._C._1350_BCE._From_Tell_e-Amarna%2C_Egypt._British_Museum.jpg/960px-thumbnail.jpg",
      "alt": "A clay tablet covered in cuneiform writing",
      "caption": "A letter from the king of Alashiya to the pharaoh, c. 1350 BC. British Museum.",
      "credit": "Osama Shukir Muhammed Amin FRCP(Glasg)",
      "licence": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Amarna_letter._%22Message_from_the_king_of_Alashiya,_your_brother%22_to_the_Pharaoh_of_Egypt,_possibly_Akhenaten._C._1350_BCE._From_Tell_e-Amarna,_Egypt._British_Museum.jpg"
    },
    "sources": [
      "wikipedia-alashiya",
      "goren-2003"
    ]
  },
  {
    "id": "enkomi",
    "type": "place",
    "name": "Enkomi",
    "altNames": [
      "Έγκωμη",
      "Tuzla"
    ],
    "place": "enkomi",
    "period": [
      "late-cypriot",
      "bronze-iron-transition"
    ],
    "summary": "A walled copper town on the east coast, one of the best-known Bronze Age sites on Cyprus.",
    "claims": [
      {
        "text": "From about the 16th to the 12th centuries BC, Enkomi was an important centre of the copper trade, and copper was smelted on site.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi"
        ]
      },
      {
        "text": "The town was enclosed by a wall built of stone slabs up to 3.5 metres long, enclosing about 2.5 hectares.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-enkomi"
        ]
      },
      {
        "text": "Cypro-Minoan tablets found at Enkomi include the longest known clay tablet in the script, and the earliest inscription of any real length (found in 1955 and dated c. 1500 BC).",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi",
          "wikipedia-cypro-minoan"
        ]
      },
      {
        "text": "Whether Enkomi was the capital of Alashiya is debated.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-enkomi",
          "wikipedia-alashiya"
        ]
      },
      {
        "text": "Whether Enkomi was destroyed around 1200 BC is unclear: its buildings from that time show limited burning, with most rooms undamaged.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-bronze-age-collapse"
        ]
      },
      {
        "text": "Enkomi was excavated by the British Museum (1895 to 1898, about 100 tombs), the Swedish Cyprus Expedition (1930), and a joint French and Cypriot expedition (1948 to 1973). Excavation stopped in 1974.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi"
        ]
      }
    ],
    "relations": [
      {
        "id": "alashiya",
        "rel": "proposed capital of"
      },
      {
        "id": "cyprus-around-1200",
        "rel": "part of"
      }
    ],
    "image": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/ENGOMI_RUINS%2C_CYPRUS.jpg/960px-ENGOMI_RUINS%2C_CYPRUS.jpg",
      "alt": "Low stone walls of excavated buildings in open ground",
      "caption": "Excavated remains at Enkomi.",
      "credit": "JERRYE AND ROY KLOTZ MD",
      "licence": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:ENGOMI_RUINS,_CYPRUS.jpg"
    },
    "sources": [
      "wikipedia-enkomi",
      "wikipedia-alashiya",
      "wikipedia-cypro-minoan",
      "wikipedia-bronze-age-collapse"
    ],
    "hellenika": [
      "enkomi"
    ]
  },
  {
    "id": "horned-god",
    "type": "object",
    "name": "The Horned God of Enkomi",
    "period": [
      "late-cypriot"
    ],
    "summary": "A bronze statue of a young male figure wearing a horned headdress, found in a large ashlar building at Enkomi.",
    "claims": [
      {
        "text": "The Horned God is a bronze statue 0.55 metres tall, found at Enkomi in a large ashlar building of the early 12th century BC.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi"
        ]
      },
      {
        "text": "Ox skulls, stag antlers, animal bones and small gold horns found where the statue had stood suggest ritual activity.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-enkomi"
        ]
      }
    ],
    "relations": [
      {
        "id": "enkomi",
        "rel": "found at"
      }
    ],
    "image": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/9/98/Geh%C3%B6rnter_Gott%2C_Enkomi.jpg",
      "alt": "A bronze statue of a standing young man wearing a horned cap",
      "caption": "The Horned God, 12th century BC.",
      "credit": "Gerhard Haubold",
      "licence": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Geh%C3%B6rnter_Gott,_Enkomi.jpg"
    },
    "sources": [
      "wikipedia-enkomi"
    ]
  },
  {
    "id": "ingot-god",
    "type": "object",
    "name": "The Ingot God of Enkomi",
    "period": [
      "late-cypriot"
    ],
    "summary": "A bronze warrior god standing on a base shaped like a copper ingot.",
    "claims": [
      {
        "text": "The Ingot God is a bronze figure about 0.35 metres tall, wearing a horned helmet and greaves, holding a shield and spear, and standing on a base shaped like an oxhide ingot.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi"
        ]
      },
      {
        "text": "It was found in a building at Enkomi now known as the Sanctuary of the Ingot God.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi"
        ]
      }
    ],
    "relations": [
      {
        "id": "enkomi",
        "rel": "found at"
      }
    ],
    "image": {
      "src": "https://upload.wikimedia.org/wikipedia/commons/9/94/Barren-Gott%2C_Enkomi%2C_12._Jh._v._Chr._C.jpg",
      "alt": "A small bronze figure with a horned helmet, shield and spear, standing on an ingot-shaped base",
      "caption": "The Ingot God, 12th century BC. Cyprus Museum, Nicosia.",
      "credit": "Gerhard Haubold, Hattingen",
      "licence": "GFDL",
      "page": "https://commons.wikimedia.org/wiki/File:Barren-Gott,_Enkomi,_12._Jh._v._Chr._C.jpg"
    },
    "sources": [
      "wikipedia-enkomi"
    ]
  },
  {
    "id": "oxhide-ingots",
    "type": "object",
    "name": "Oxhide copper ingots",
    "period": [
      "late-cypriot"
    ],
    "summary": "Heavy slabs of copper, shaped like a stretched ox hide, in which metal was traded around the Mediterranean.",
    "claims": [
      {
        "text": "Oxhide ingots are slabs of 20 to 30 kilograms, usually of copper, shaped like an ox hide with a handle at each corner. They were traded across the Mediterranean in the Late Bronze Age.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-oxhide-ingot"
        ]
      },
      {
        "text": "The shape probably made them easier to carry; the old idea that each ingot was worth one ox is not supported.",
        "evidence": "consensus",
        "confidence": "probable",
        "sources": [
          "wikipedia-oxhide-ingot"
        ]
      },
      {
        "text": "Whether oxhide ingots served as a form of currency is uncertain.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-oxhide-ingot"
        ]
      },
      {
        "text": "Three oxhide ingots were found at Enkomi. The Uluburun shipwreck, off Turkey, carried 317 copper ingots of the usual oxhide shape.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-enkomi",
          "wikipedia-oxhide-ingot"
        ]
      }
    ],
    "relations": [
      {
        "id": "enkomi",
        "rel": "found at"
      }
    ],
    "image": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Oxhide_ingots_at_the_Numismatic_Museum%2C_Athens.jpg/960px-Oxhide_ingots_at_the_Numismatic_Museum%2C_Athens.jpg",
      "alt": "Several flat copper slabs with four corner handles, displayed in a museum case",
      "caption": "Oxhide ingots in the Numismatic Museum, Athens.",
      "credit": "Odysses",
      "licence": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Oxhide_ingots_at_the_Numismatic_Museum,_Athens.jpg"
    },
    "sources": [
      "wikipedia-oxhide-ingot",
      "wikipedia-enkomi"
    ],
    "hellenika": [
      "uluburun-shipwreck"
    ]
  },
  {
    "id": "cypro-minoan",
    "type": "writing",
    "name": "The Cypro-Minoan script",
    "period": [
      "late-cypriot",
      "bronze-iron-transition"
    ],
    "summary": "The writing of Bronze Age Cyprus. It has never been deciphered.",
    "claims": [
      {
        "text": "Cypro-Minoan is an undeciphered script used on Cyprus and by its trading partners, c. 1550 to 1050 BC.",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-cypro-minoan"
        ]
      },
      {
        "text": "About 250 objects with Cypro-Minoan inscriptions have been found, on Cyprus and at Ugarit on the Syrian coast.",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-cypro-minoan"
        ]
      },
      {
        "text": "It is thought to derive from Linear A of Minoan Crete, and to be related to the later Cypriot syllabary.",
        "evidence": "linguistic",
        "confidence": "probable",
        "sources": [
          "wikipedia-cypro-minoan"
        ]
      },
      {
        "text": "How its inscriptions should be grouped (into separate scripts CM1 to CM3, or treated as one) is debated.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-cypro-minoan"
        ]
      }
    ],
    "relations": [
      {
        "id": "enkomi",
        "rel": "found at"
      },
      {
        "id": "pyla-kokkinokremos",
        "rel": "found at"
      }
    ],
    "image": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Tablet_cypro-minoan_2_Louvre_AM2336.jpg/960px-Tablet_cypro-minoan_2_Louvre_AM2336.jpg",
      "alt": "A small clay tablet inscribed with rows of signs",
      "caption": "A clay tablet in Cypro-Minoan script. Louvre, AM 2336.",
      "credit": "Jastrow",
      "licence": "Public domain",
      "page": "https://commons.wikimedia.org/wiki/File:Tablet_cypro-minoan_2_Louvre_AM2336.jpg"
    },
    "sources": [
      "wikipedia-cypro-minoan"
    ]
  },
  {
    "id": "kition",
    "type": "place",
    "name": "Kition",
    "altNames": [
      "Κίτιο",
      "Larnaka"
    ],
    "place": "kition",
    "period": [
      "late-cypriot",
      "bronze-iron-transition",
      "cypro-geometric",
      "cypro-archaic",
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "A city on the south coast beneath modern Larnaka: a Bronze Age copper town, then from the 10th century BC a Phoenician kingdom, until Ptolemy ended it in 312 BC.",
    "claims": [
      {
        "text": "Excavations have revealed part of a 13th-century BC defensive wall and the remains of five temples. The largest, built of ashlar blocks, measured 35 by 22 metres.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-kition"
        ]
      },
      {
        "text": "Graffiti of ships survive on the façade of one Late Bronze Age temple.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-kition"
        ]
      },
      {
        "text": "Whether Kition was destroyed around 1200 BC is disputed. Wikipedia's article on Kition says it was destroyed and soon rebuilt; the excavator, Vassos Karageorghis, as quoted in Wikipedia's article on the Bronze Age collapse, wrote that there is \"no evidence of violent destruction\".",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-kition",
          "wikipedia-bronze-age-collapse"
        ]
      },
      {
        "text": "Kition prospered after 1200 BC.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-bronze-age-collapse"
        ]
      },
      {
        "text": "Literary evidence suggests Phoenicians from Tyre settled at Kition at the start of the 10th century BC, and after about 850 BC its sanctuaries were rebuilt and reused by Phoenician settlers.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kition"
        ]
      },
      {
        "text": "Its kings are named from about 500 BC, in Phoenician texts and on coins. By the Classical period it was one of the leading powers on Cyprus, with Salamis.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-kition"
        ]
      },
      {
        "text": "The Swedish Cyprus Expedition (1929 to 1930) found a sanctuary on the Bamboula hill whose statues of Heracles with lion skin and club point to Melqart, the city god of Kition.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-kition"
        ]
      },
      {
        "text": "In 333/332 BC Kitian merchants in Athens were allowed to build a temple to Aphrodite (Astarte) there.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-kition"
        ]
      },
      {
        "text": "Ptolemy I took Cyprus in 312 BC, killed Poumyathon, the Phoenician king of Kition, and burned the temples; the Phoenician dynasty was abolished soon after.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-kition"
        ]
      }
    ],
    "relations": [
      {
        "id": "cyprus-around-1200",
        "rel": "prospered after"
      }
    ],
    "sources": [
      "wikipedia-kition",
      "wikipedia-bronze-age-collapse"
    ],
    "hellenika": [
      "kition"
    ]
  },
  {
    "id": "hala-sultan-tekke",
    "type": "place",
    "name": "Hala Sultan Tekke",
    "altNames": [
      "Χαλά Σουλτάν Τεκκέ",
      "Hala Sultan Tekkesi"
    ],
    "place": "hala-sultan-tekke",
    "period": [
      "late-cypriot",
      "ottoman"
    ],
    "summary": "A large Bronze Age town beside the Larnaca Salt Lake, named today after the later mosque nearby.",
    "claims": [
      {
        "text": "A large Late Cypriot town stood beside the Larnaca Salt Lake. Rich tombs of c. 1650 to 1100 BC were excavated there by the British Museum in 1897 and 1898.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-hala-sultan-tekke"
        ]
      },
      {
        "text": "Radar surveys in 2010 to 2012 suggest it was one of the largest cities of the Late Bronze Age, perhaps up to 50 hectares.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-hala-sultan-tekke"
        ]
      },
      {
        "text": "Swedish teams have excavated the town since the 1970s; since 2010 the New Swedish Cyprus Expedition under Peter M. Fischer of the University of Gothenburg.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-hala-sultan-tekke"
        ]
      },
      {
        "text": "The site is named after the mosque complex built in stages around the tomb of Umm Haram during Ottoman rule. A dervish, Sheikh Hasan, is said to have found the tomb in the 18th century and built a shrine around it in 1760.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-hala-sultan-tekke"
        ]
      },
      {
        "text": "One source says the mosque was begun by the governor Seyyid Mehmed Emin Efendi and completed in November 1817; the visitor Giovanni Mariti instead credited the shrine to a governor he calls Ali Agha.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-hala-sultan-tekke"
        ]
      }
    ],
    "sources": [
      "wikipedia-hala-sultan-tekke"
    ],
    "hellenika": [
      "hala-sultan-tekke"
    ]
  },
  {
    "id": "kalavasos",
    "type": "place",
    "name": "Kalavasos-Ayios Dhimitrios",
    "altNames": [
      "Καλαβασός"
    ],
    "place": "kalavasos",
    "period": [
      "late-cypriot"
    ],
    "summary": "A Late Bronze Age town in the south, near the copper of the Troodos foothills.",
    "claims": [
      {
        "text": "The analysis of the clay of the Alashiya letters identifies Kalavasos-Ayios Dhimitrios, or Alassa, as the likely source of the official letters.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "goren-2003"
        ]
      },
      {
        "text": "It is one of the candidates for the capital of Alashiya.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-alashiya"
        ]
      }
    ],
    "relations": [
      {
        "id": "alashiya",
        "rel": "proposed capital of"
      }
    ],
    "sources": [
      "goren-2003",
      "wikipedia-alashiya"
    ]
  },
  {
    "id": "alassa",
    "type": "place",
    "name": "Alassa-Paliotaverna",
    "altNames": [
      "Άλασσα"
    ],
    "place": "alassa",
    "period": [
      "late-cypriot"
    ],
    "summary": "A hilltop town above the Kouris river, with one of the largest Bronze Age buildings on Cyprus.",
    "claims": [
      {
        "text": "Alassa-Paliotaverna was a settlement of about 1340 to 1100 BC, on a plateau above the Kouris river at the foot of the Troodos Mountains.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-alassa"
        ]
      },
      {
        "text": "Its Building II is a monumental ashlar building of 1,410 square metres, in which at least 16 large storage jars were found.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-alassa"
        ]
      },
      {
        "text": "The analysis of the clay of the Alashiya letters identifies Alassa, or Kalavasos-Ayios Dhimitrios, as the likely source of the official letters.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "goren-2003"
        ]
      },
      {
        "text": "Aegean features in Building II's architecture have been read as a sign of migrants from the Aegean living alongside Cypriots. This is an interpretation.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-alassa"
        ]
      }
    ],
    "relations": [
      {
        "id": "alashiya",
        "rel": "proposed capital of"
      },
      {
        "id": "cyprus-around-1200",
        "rel": "abandoned during"
      }
    ],
    "image": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Building_II_Alassa_Paliotaverna.png/960px-Building_II_Alassa_Paliotaverna.png",
      "alt": "A computer model of a large stone building around a courtyard",
      "caption": "A 3D reconstruction (not a photograph) of part of Building II at Alassa-Paliotaverna.",
      "credit": "Abbas Ifra Shahid",
      "licence": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Building_II_Alassa_Paliotaverna.png"
    },
    "sources": [
      "wikipedia-alassa",
      "goren-2003"
    ]
  },
  {
    "id": "pyla-kokkinokremos",
    "type": "place",
    "name": "Pyla-Kokkinokremos",
    "altNames": [
      "Πύλα-Κοκκινόκρεμος"
    ],
    "place": "pyla-kokkinokremos",
    "period": [
      "late-cypriot"
    ],
    "summary": "A short-lived settlement on a plateau near Larnaka, a \"time capsule\" of the years around 1200 BC.",
    "claims": [
      {
        "text": "Pyla-Kokkinokremos was a planned settlement of about 7 hectares, lived in for less than fifty years in the late 13th and early 12th centuries BC.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-pyla",
          "georgiou-2012"
        ]
      },
      {
        "text": "Hoards of precious metal were hidden there and never recovered, and the abandonment appears to have been planned.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-pyla"
        ]
      },
      {
        "text": "Finds include Minoan, Canaanite, Mycenaean, Sardinian, Hittite and Cypriot pottery, and two tablets in Cypro-Minoan script.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-pyla"
        ]
      },
      {
        "text": "Who founded it is debated: the excavator proposed refugees from the Aegean; other scholars see an outpost set up by local Cypriots.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "georgiou-2012"
        ]
      }
    ],
    "relations": [
      {
        "id": "cyprus-around-1200",
        "rel": "abandoned during"
      }
    ],
    "image": {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Excavation_Pyla_Cyprus.JPG/960px-Excavation_Pyla_Cyprus.JPG",
      "alt": "A large storage jar inside a deep excavated pit",
      "caption": "Excavating a storage jar in an underground structure at Pyla-Kokkinokremos.",
      "credit": "BretschneiderJ",
      "licence": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Excavation_Pyla_Cyprus.JPG"
    },
    "sources": [
      "wikipedia-pyla",
      "georgiou-2012"
    ]
  },
  {
    "id": "maa-palaeokastro",
    "type": "place",
    "name": "Maa-Palaeokastro",
    "period": [
      "late-cypriot"
    ],
    "summary": "A fortified settlement on a peninsula in the south-west, lived in for only a couple of generations.",
    "claims": [
      {
        "text": "Maa-Palaeokastro was a fortified settlement on a peninsula in south-west Cyprus, from the late 13th to the middle of the 12th century BC.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-maa",
          "georgiou-2012"
        ]
      },
      {
        "text": "It is the only settlement on Cyprus with clear evidence of destruction around 1200 BC. The excavators wrote that the attackers might have been \"pirates\", \"adventurers\" or remnants of the \"Sea Peoples\", \"but this is simply another way of saying that we do not know\".",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-bronze-age-collapse"
        ]
      },
      {
        "text": "Who lived there is debated, as at Pyla-Kokkinokremos: refugees from the Aegean, or local Cypriots.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "georgiou-2012"
        ]
      }
    ],
    "relations": [
      {
        "id": "cyprus-around-1200",
        "rel": "destroyed during"
      }
    ],
    "sources": [
      "wikipedia-maa",
      "wikipedia-bronze-age-collapse",
      "georgiou-2012"
    ]
  },
  {
    "id": "apliki",
    "type": "place",
    "name": "Apliki",
    "altNames": [
      "Απλίκι",
      "Aplıç"
    ],
    "place": "apliki",
    "period": [
      "late-cypriot"
    ],
    "summary": "A copper-mining settlement in the Troodos foothills.",
    "claims": [
      {
        "text": "Apliki was a copper-mining and smelting site from the late 14th century BC. Four excavated houses held an ivory cylinder, a steatite cylinder seal and a gold earring.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-apliki"
        ]
      }
    ],
    "sources": [
      "wikipedia-apliki"
    ]
  },
  {
    "id": "cyprus-around-1200",
    "type": "event",
    "name": "Cyprus around 1200 BC",
    "period": [
      "late-cypriot",
      "bronze-iron-transition"
    ],
    "summary": "While palaces and kingdoms fell across the eastern Mediterranean, Cyprus saw abandonments, one clear destruction, and some places that went on to prosper.",
    "claims": [
      {
        "text": "There is little clear evidence of destruction on Cyprus around 1200 BC.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-bronze-age-collapse"
        ]
      },
      {
        "text": "Several settlements were abandoned at the end of Late Cypriot IIC, or in the first half of the 12th century BC, without being destroyed, among them Pyla-Kokkinokremos, Toumba tou Skourou, Alassa and Maroni-Vournes.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-bronze-age-collapse"
        ]
      },
      {
        "text": "Kition and Paphos prospered after 1200 BC.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-bronze-age-collapse"
        ]
      }
    ],
    "sources": [
      "wikipedia-bronze-age-collapse"
    ],
    "hellenika": [
      "bronze-age-collapse",
      "sea-peoples-invasion"
    ]
  },

  /* ---------- PREHISTORIC: Akrotiri phase to Middle Cypriot ---------- */
  {
    "id": "aetokremnos-site",
    "type": "place",
    "name": "Aetokremnos",
    "altNames": [
      "Αετόκρεμνος",
      "Akrotiri Aetokremnos"
    ],
    "place": "aetokremnos",
    "period": [
      "akrotiri-phase"
    ],
    "summary": "A collapsed rock shelter on a cliff above the south coast, with some of the oldest evidence of people on Cyprus, and the bones of hundreds of pygmy hippos.",
    "claims": [
      {
        "text": "The rock shelter sits on a steep cliff about 40 metres above the sea, near Limassol. Its name means \"cliff of the eagles\".",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-aetokremnos"
        ]
      },
      {
        "text": "Excavators date its occupation to a short span of about 300 years, centred around 11,775 years ago.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-aetokremnos"
        ]
      },
      {
        "text": "It holds the remains of more than 370 pygmy hippopotamuses and at least three dwarf elephants, with about 1,000 flint tools resembling those of the Natufian culture of the Levant.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-aetokremnos"
        ]
      },
      {
        "text": "None of the bones show butchery marks, but about 30% are burned.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-aetokremnos"
        ]
      },
      {
        "text": "Whether people hunted the hippos is disputed. Some argue the bones were gathered by humans; others that they built up naturally over centuries and were burned later by people lighting fires in the shelter.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-aetokremnos",
          "wikipedia-pygmy-hippo"
        ]
      },
      {
        "text": "The site was found in 1960 by an amateur who reported it to the archaeologist Stuart Swiny. It lies on a British Royal Air Force base.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-aetokremnos"
        ]
      }
    ],
    "relations": []
  },
  {
    "id": "pygmy-hippopotamus",
    "type": "object",
    "name": "The Cypriot pygmy hippopotamus",
    "altNames": [
      "Hippopotamus minor",
      "Phanourios minor"
    ],
    "period": [
      "akrotiri-phase"
    ],
    "summary": "A hippo about the size of a large pig, which lived only on Cyprus and died out soon after people arrived.",
    "claims": [
      {
        "text": "It lived on Cyprus from the Middle Pleistocene until the early Holocene, and is one of the smallest hippopotamus species known: about 130 kg and 70 cm tall.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-pygmy-hippo"
        ]
      },
      {
        "text": "Its closest living relative is the common hippopotamus. Its ancestors must have crossed the sea to reach Cyprus, which was never joined to the mainland.",
        "evidence": "consensus",
        "confidence": "strong",
        "sources": [
          "wikipedia-pygmy-hippo"
        ]
      },
      {
        "text": "It died out around 12,000 years ago, after humans arrived.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-pygmy-hippo",
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "From at least the 15th century, Cypriots took bones exposed in the Kyrenia mountains for the relics of saints. In 1972 the species was given the genus name Phanourios, after Saint Phanourios, whom local people linked with the bones.",
        "evidence": "tradition",
        "confidence": "established",
        "sources": [
          "wikipedia-pygmy-hippo"
        ]
      }
    ],
    "relations": [
      {
        "id": "aetokremnos-site",
        "rel": "found at"
      }
    ]
  },
  {
    "id": "klimonas-site",
    "type": "place",
    "name": "Klimonas",
    "altNames": [
      "Κλήμονας",
      "Ayios Tychonas-Klimonas"
    ],
    "place": "klimonas",
    "period": [
      "early-aceramic-neolithic"
    ],
    "summary": "A village of the 9th millennium BC near Ayios Tychonas, east of Limassol, with a large shared building dug into the ground.",
    "claims": [
      {
        "text": "Klimonas dates to the 9th millennium BC and is described as the oldest known farming village in the world.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-klimonas"
        ]
      },
      {
        "text": "Its main feature is a sunken circular building about ten metres across, like communal buildings at sites on the nearby mainland.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-klimonas"
        ]
      },
      {
        "text": "Its people hunted wild boar with domestic dogs, and obtained cereals from the Levant.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-klimonas"
        ]
      }
    ]
  },
  {
    "id": "shillourokambos-site",
    "type": "place",
    "name": "Shillourokambos",
    "altNames": [
      "Σιλλουρόκαμπος",
      "Parekklisha-Shillourokambos"
    ],
    "place": "shillourokambos",
    "period": [
      "early-aceramic-neolithic",
      "khirokitia-culture"
    ],
    "summary": "An early farming settlement on a low plateau near Parekklisia, east of Limassol, lived in for over a thousand years.",
    "claims": [
      {
        "text": "It was occupied from the end of the 9th millennium to the second half of the 8th millennium BC, and has been excavated since 1992.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-shillourokambos"
        ]
      },
      {
        "text": "Its first houses were round wattle-and-daub huts set in post holes cut into the bedrock; later ones were round stone houses like those of the Khirokitia culture.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-shillourokambos"
        ]
      },
      {
        "text": "Around 300 blades of obsidian from Anatolia show trade with the mainland.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-shillourokambos"
        ]
      },
      {
        "text": "It is one of the few sites that show cattle on Cyprus in the aceramic Neolithic. They later died out and were not brought back for a long time.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-shillourokambos",
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Of its animals, only dogs and pigs show the smaller size of domestication; the sheep, goats and cattle are still the size of wild animals.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-shillourokambos"
        ]
      }
    ],
    "relations": []
  },
  {
    "id": "shillourokambos-cat",
    "type": "object",
    "name": "The Shillourokambos cat burial",
    "altNames": [],
    "place": "shillourokambos",
    "period": [
      "early-aceramic-neolithic"
    ],
    "summary": "A person buried with a cat about 9,500 years ago: the oldest known evidence of cats living with people.",
    "claims": [
      {
        "text": "In 2004 a team of French archaeologists led by Jean-Denis Vigne excavated a grave at Shillourokambos holding a human and an eight-month-old cat, laid close together.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-shillourokambos",
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "The grave is about 9,500 years old, far older than the cats painted in ancient Egypt, long thought the first.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-shillourokambos"
        ]
      },
      {
        "text": "The cat is large and closely resembles the African wildcat rather than today's house cats.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-shillourokambos"
        ]
      }
    ],
    "relations": [
      {
        "id": "shillourokambos-site",
        "rel": "found at"
      }
    ]
  },
  {
    "id": "khirokitia-site",
    "type": "place",
    "name": "Khirokitia",
    "altNames": [
      "Χοιροκοιτία",
      "Choirokoitia",
      "Hirokitya"
    ],
    "place": "khirokitia",
    "period": [
      "khirokitia-culture"
    ],
    "summary": "A walled village of round houses on a hillside above the Maroni river, one of the best preserved prehistoric sites in the eastern Mediterranean.",
    "claims": [
      {
        "text": "Khirokitia has been a UNESCO World Heritage Site since 1998.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-khirokitia"
        ]
      },
      {
        "text": "Porphyrios Dikaios of the Department of Antiquities found it in 1934 and excavated it six times up to 1946. He first thought it began around 4000 BC; radiocarbon dating later gave about 7000 BC.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-khirokitia"
        ]
      },
      {
        "text": "The village was cut off by a stone wall about 2.5 metres thick, standing up to 3 metres high.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-khirokitia"
        ]
      },
      {
        "text": "Inside, round buildings (tholoi) from 2 to 9 metres across were grouped around open courtyards, probably one group to a family.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-khirokitia"
        ]
      },
      {
        "text": "Probably no more than 300 to 600 people lived there at any one time.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-khirokitia"
        ]
      },
      {
        "text": "Excavation stopped in 1974 and was resumed in 1977 by a French mission led by Alain Le Brun.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-khirokitia"
        ]
      }
    ],
    "hellenika": [
      "choirokoitia"
    ]
  },
  {
    "id": "tenta-site",
    "type": "place",
    "name": "Kalavasos-Tenta",
    "altNames": [
      "Tenta",
      "Tenda"
    ],
    "place": "tenta",
    "period": [
      "early-aceramic-neolithic",
      "khirokitia-culture"
    ],
    "summary": "A small hill in the Vasilikos valley, settled for about two thousand years and now covered by a cone-shaped roof.",
    "claims": [
      {
        "text": "Its first occupation dates to around 8000 BC, almost a thousand years before Khirokitia, and it was still lived in during the 6th millennium BC.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-tenta"
        ]
      },
      {
        "text": "Its buildings, objects, burials, plants and animals changed very little over two millennia, suggesting a long continuity in how people lived.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-tenta"
        ]
      },
      {
        "text": "Porphyrios Dikaios reported the site in 1940 after finds during the building of a mining railway. The Vasilikos Valley Project, led by Ian Todd, excavated it in five seasons between 1976 and 1984.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-tenta"
        ]
      },
      {
        "text": "Local tradition says the name recalls a tent pitched there by Saint Helena in AD 327.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-tenta"
        ]
      }
    ]
  },
  {
    "id": "sotira-teppes",
    "type": "place",
    "name": "Sotira-Teppes",
    "altNames": [
      "Σωτήρα"
    ],
    "place": "sotira",
    "period": [
      "sotira-culture"
    ],
    "summary": "The hilltop village that gives the Ceramic Neolithic Sotira culture its name.",
    "claims": [
      {
        "text": "Its tightly packed houses were lightly built, round to rectangular with rounded corners, with mudbrick upper walls and probably flat roofs.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-sotira"
        ]
      },
      {
        "text": "Under the top floors, a layer of collapsed buildings sealed well-preserved hearths and a rich set of flint, stone and bone tools, with bowls and jugs of combed ware.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-sotira"
        ]
      },
      {
        "text": "Like most sites of the period, it stood on high ground near the coast that was easy to defend.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-sotira"
        ]
      }
    ]
  },
  {
    "id": "erimi-pamboula",
    "type": "place",
    "name": "Erimi-Pamboula",
    "altNames": [
      "Ερήμη"
    ],
    "place": "erimi",
    "period": [
      "sotira-culture",
      "chalcolithic"
    ],
    "summary": "The Chalcolithic village near the south coast that gives the Erimi culture its name.",
    "claims": [
      {
        "text": "The Chalcolithic site of Erimi-Pamboula was excavated by Porphyrios Dikaios.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-erimi"
        ]
      },
      {
        "text": "Erimi is the type site of the first Chalcolithic phase, with red-on-white pottery decorated with lines and plant designs.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "A copper chisel found at Erimi is the oldest copper object yet found on Cyprus.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Pottery of the earlier Sotira culture is found in its earliest levels.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      }
    ]
  },
  {
    "id": "lemba-site",
    "type": "place",
    "name": "Lemba",
    "altNames": [
      "Λέμπα",
      "Lempa"
    ],
    "place": "lemba",
    "period": [
      "chalcolithic"
    ],
    "summary": "A Chalcolithic village above the sea north of Paphos, excavated by the University of Edinburgh and partly rebuilt as an experiment.",
    "claims": [
      {
        "text": "The School of Archaeology of the University of Edinburgh has excavated at Lemba since 1976. The village was first settled in the Chalcolithic, about 3800 to 2500 BC.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-lempa"
        ]
      },
      {
        "text": "Several cross-shaped female figurines carved in stone have been found there.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-lempa"
        ]
      },
      {
        "text": "Since 1982 the Lemba Experimental Village has rebuilt Chalcolithic houses to test how they were built, how pottery was fired and how food was cooked.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-lempa"
        ]
      }
    ]
  },
  {
    "id": "idol-of-pomos",
    "type": "object",
    "name": "The Idol of Pomos",
    "altNames": [
      "Ειδώλιο από τον Πωμό",
      "Pomos putu"
    ],
    "place": "pomos",
    "period": [
      "chalcolithic"
    ],
    "summary": "A small stone figure with outstretched arms, about five thousand years old, now on the Cypriot euro coins.",
    "claims": [
      {
        "text": "It was found near the village of Pomos and dates to around the 30th century BC. It is in the Cyprus Museum in Nicosia.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-pomos-idol"
        ]
      },
      {
        "text": "It probably shows a woman with her arms spread, like many similar Cypriot figures with small marks on the chest; it wears a small copy of itself around its neck.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-pomos-idol"
        ]
      },
      {
        "text": "What such figures meant is not known. They are often read as fertility symbols; another suggestion is that they show a kind of dance.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-pomos-idol"
        ]
      },
      {
        "text": "Since Cyprus adopted the euro in 2008, the idol has been on its one and two euro coins.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-pomos-idol"
        ]
      }
    ]
  },
  {
    "id": "marki-alonia-site",
    "type": "place",
    "name": "Marki Alonia",
    "altNames": [],
    "place": "marki-alonia",
    "period": [
      "philia-phase",
      "early-cypriot",
      "middle-cypriot"
    ],
    "summary": "The most fully excavated village of the Early Bronze Age, lived in for about four hundred years.",
    "claims": [
      {
        "text": "David Frankel and Jennifer Webb of La Trobe University excavated the site between 1990 and 2000.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-marki-alonia"
        ]
      },
      {
        "text": "It was occupied from the start of the Early Bronze Age, about 2400 BC, until well into the Middle Bronze Age, and shows the Philia phase coming before Early Cypriot I and II.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-marki-alonia",
          "wikipedia-philia-culture"
        ]
      },
      {
        "text": "Houses were rectangular, of mould-made mudbricks on stone foundations, around open courtyards; later houses usually had three or more rooms.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-marki-alonia"
        ]
      },
      {
        "text": "The village grew from forty or fifty founders to about 400 people around four hundred years later.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-marki-alonia"
        ]
      },
      {
        "text": "A little over half its animal bones are sheep and goat; cattle were at least as important, giving meat and milk and pulling ploughs.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-marki-alonia"
        ]
      }
    ]
  },
  {
    "id": "red-polished-ware",
    "type": "object",
    "name": "Red Polished Ware",
    "altNames": [],
    "period": [
      "philia-phase",
      "early-cypriot",
      "middle-cypriot"
    ],
    "summary": "The handmade, polished red pottery of the Cypriot Early Bronze Age.",
    "claims": [
      {
        "text": "Porphyrios Dikaios identified it at Philia in 1942; similar pottery is known in Anatolia from the Early Bronze Age II.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-philia-culture"
        ]
      },
      {
        "text": "The pots were always made by hand, coated in liquid clay and polished smooth; iron in the clay and incised patterns gave a range of decoration.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-philia-culture"
        ]
      },
      {
        "text": "A Red Polished bowl in the British Museum comes from a tomb on the slopes of Vounous, on the north coast.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-philia-culture"
        ]
      }
    ]
  },
  {
    "id": "alambra-mouttes",
    "type": "place",
    "name": "Alambra-Mouttes",
    "altNames": [
      "Αλάμπρα"
    ],
    "place": "alambra",
    "period": [
      "middle-cypriot"
    ],
    "summary": "A Middle Bronze Age village in central Cyprus with some of the island's earliest rectangular houses.",
    "claims": [
      {
        "text": "Excavations between 1974 and 1985 uncovered a settlement of about 1900 to 1650 BC.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-alambra"
        ]
      },
      {
        "text": "Its rectangular houses of several rooms are among the earliest rectangular buildings on Cyprus.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-alambra"
        ]
      },
      {
        "text": "Clay figurines and copper objects were found, but no sign of copper being worked there.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-alambra"
        ]
      },
      {
        "text": "The village's name is first recorded on the Idalion Tablet of the 5th century BC.",
        "evidence": "epigraphic",
        "confidence": "probable",
        "sources": [
          "wikipedia-alambra"
        ]
      }
    ]
  },

  /* ---------- IRON AGE AND HELLENISTIC: Bronze to Iron to the Ptolemies ---------- */
  {
    "id": "opheltas-skewer",
    "type": "writing",
    "name": "The Opheltas skewer",
    "altNames": [
      "Opheltas obelos"
    ],
    "place": "palaepaphos",
    "period": [
      "bronze-iron-transition"
    ],
    "summary": "A bronze roasting skewer from a tomb near Palaepaphos, scratched with a Greek name: the earliest sign of Greek being written on Cyprus.",
    "claims": [
      {
        "text": "Three bronze skewers (obeloi) with inscriptions in the Cypriot syllabic script were found in tomb 49 at Palaepaphos-Skales, an 11th-century BC tomb.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "One of them bears the name Opheltas. It is the first indication of the Greek language on the island.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "The script it is written in stayed in use on Cyprus until the 3rd century BC.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-prehistoric-cyprus",
          "wikipedia-arcadocypriot"
        ]
      }
    ],
    "relations": [
      {
        "id": "cypriot-syllabary",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "kourion-sceptre",
    "type": "object",
    "name": "The Kourion sceptre",
    "altNames": [
      "Kourion-Kaloriziki tomb 40"
    ],
    "place": "kourion",
    "period": [
      "bronze-iron-transition"
    ],
    "summary": "A gold sceptre topped by two enamelled falcons, from an 11th-century BC grave near Kourion.",
    "claims": [
      {
        "text": "Tomb 40 at Kourion-Kaloriziki, from the first half of the 11th century BC, held the first known cremation burial in bronze vessels on Cyprus, with two bronze tripod stands, the remains of a shield and a gold sceptre.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "The sceptre head with its two falcons is decorated in cloisonné enamel, which has no parallels in the Aegean but shows strong Egyptian influence.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "The grave was once seen as that of an Argive Greek founder of Kourion; it is now interpreted as the tomb of a native Cypriot or a Phoenician prince.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      }
    ]
  },
  {
    "id": "cypriot-syllabary",
    "type": "writing",
    "name": "The Cypriot syllabary",
    "altNames": [
      "Cypro-Syllabic script",
      "Classical Cypriot syllabary"
    ],
    "period": [
      "bronze-iron-transition",
      "cypro-geometric",
      "cypro-archaic",
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "Cyprus's own script, with a sign for each syllable, used for about seven hundred years to write Greek and the island's older language.",
    "claims": [
      {
        "text": "It was used from about the 11th to the 4th century BC, when the Greek alphabet replaced it; King Evagoras of Salamis was a pioneer of that change.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-cypriot-syllabary"
        ]
      },
      {
        "text": "It is thought to descend from Cypro-Minoan, itself derived from the Linear A script of Crete.",
        "evidence": "linguistic",
        "confidence": "probable",
        "sources": [
          "wikipedia-cypriot-syllabary"
        ]
      },
      {
        "text": "It has 56 signs, each standing for an open syllable such as ka, ke, ki, ko or ku.",
        "evidence": "linguistic",
        "confidence": "established",
        "sources": [
          "wikipedia-cypriot-syllabary"
        ]
      },
      {
        "text": "Most texts are in the Arcadocypriot dialect of Greek, a close relative of the Mycenaean Greek of Linear B; some at Amathus are in Eteocypriot, a language that is not Greek.",
        "evidence": "linguistic",
        "confidence": "strong",
        "sources": [
          "wikipedia-cypriot-syllabary",
          "wikipedia-arcadocypriot",
          "wikipedia-amathus"
        ]
      },
      {
        "text": "About 1,000 inscriptions are known, most from around the 6th century BC; none is known from before the 8th century.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-cypriot-syllabary"
        ]
      },
      {
        "text": "George Smith deciphered it in the 19th century with the help of a bilingual inscription from Idalion, in Cypriot script and Phoenician.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-cypriot-syllabary",
          "wikipedia-idalion"
        ]
      }
    ],
    "relations": [
      {
        "id": "cypro-minoan",
        "rel": "influenced by"
      },
      {
        "id": "idalion-tablet",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "salamis-city",
    "type": "place",
    "name": "Salamis",
    "altNames": [
      "Σαλαμίνα",
      "Salamis"
    ],
    "place": "salamis",
    "period": [
      "bronze-iron-transition",
      "cypro-geometric",
      "cypro-archaic",
      "cypro-classical",
      "hellenistic",
      "roman",
      "late-roman"
    ],
    "summary": "The great city of the east coast, near modern Famagusta, for centuries the strongest of the Cypriot kingdoms.",
    "claims": [
      {
        "text": "Its earliest finds go back to the 11th century BC; children buried in Canaanite jars show a Phoenician presence from the start.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-salamis",
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Tradition says it was founded by Teucer, son of Telamon, who could not go home after the Trojan War. There is little direct evidence for the story.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-salamis"
        ]
      },
      {
        "text": "It may have grown up to replace Enkomi, nearby, once Enkomi was cut off from the sea.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-salamis"
        ]
      },
      {
        "text": "Under Evagoras I (411 to 374 BC) Greek culture and art flourished in the city.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-salamis",
          "wikipedia-evagoras"
        ]
      },
      {
        "text": "After the kingdoms ended it remained the seat of the governor until Nea Paphos replaced it as capital.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-salamis",
          "wikipedia-nea-paphos"
        ]
      },
      {
        "text": "After earthquakes destroyed it in the early 4th century AD, it was rebuilt by Constantius II (337 to 361) as Constantia, a bishop's seat whose best-known bishop was Epiphanius.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-salamis"
        ]
      },
      {
        "text": "Tradition says Barnabas was stoned to death at Salamis around AD 61; his bones are believed to lie in the nearby monastery named after him.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-salamis"
        ]
      },
      {
        "text": "It was finally abandoned after attacks under Mu'awiya in the Arab invasions of the 7th century, and its people moved to Arsinoë (Famagusta).",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-salamis"
        ]
      }
    ],
    "relations": [],
    "hellenika": [
      "salamis-cyprus"
    ]
  },
  {
    "id": "salamis-royal-tombs",
    "type": "place",
    "name": "The royal tombs of Salamis",
    "altNames": [],
    "place": "salamis",
    "period": [
      "cypro-geometric",
      "cypro-archaic"
    ],
    "summary": "Monumental tombs of the 8th and 7th centuries BC whose entrance ramps were filled with sacrificed horses, chariots and luxury goods.",
    "claims": [
      {
        "text": "Monumental tombs such as the \"royal\" tombs of Salamis appear for the first time in the 8th century BC, and may mark the rise of the Cypriot kingdoms.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Although plundered, they held horses sacrificed with their chariots and gear, bronze tripods, huge cauldrons decorated with sirens and griffins, and ivory beds and thrones.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Some burial customs, such as sacrificing horses and offering jars of olive oil, match the funerals in Homer's epics, and some scholars see the poems' influence in them.",
        "evidence": "debate",
        "confidence": "probable",
        "sources": [
          "wikipedia-salamis",
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Most of the grave goods came from the Levant or Egypt; one tomb held so much Greek pottery that it has been explained as the dowry of a Greek princess.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-salamis"
        ]
      }
    ],
    "relations": [
      {
        "id": "salamis-city",
        "rel": "part of"
      }
    ]
  },
  {
    "id": "amathus-city",
    "type": "place",
    "name": "Amathus",
    "altNames": [
      "Αμαθούντα",
      "Amathous"
    ],
    "place": "amathus",
    "period": [
      "cypro-geometric",
      "cypro-archaic",
      "cypro-classical",
      "hellenistic",
      "roman",
      "late-roman"
    ],
    "summary": "A city-kingdom on the cliffs east of Limassol, where the island's older, non-Greek language lasted longest.",
    "claims": [
      {
        "text": "No trace of people has been found at the site before the earliest Iron Age, about 1100 BC.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-amathus"
        ]
      },
      {
        "text": "Inscriptions in the Cypriot syllabary show that its people spoke Eteocypriot, a language that was not Greek, down to the 4th century BC.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-amathus",
          "wikipedia-cypriot-syllabary"
        ]
      },
      {
        "text": "Its sanctuary of Aphrodite was the second most important on Cyprus, after Paphos.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-amathus"
        ]
      },
      {
        "text": "Amathus refused to join Onesilus's revolt against Persia, was besieged by him, and after his death hung his head over its gates. Herodotus says bees later filled the skull, and an oracle told the townspeople to bury it and honour him as a hero.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-amathus",
          "wikipedia-onesilus"
        ]
      },
      {
        "text": "Two statue bases given by Androkles, the last king, carry inscriptions in both Eteocypriot and Greek.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-amathus"
        ]
      }
    ],
    "hellenika": [
      "amathous"
    ]
  },
  {
    "id": "paphos-kingdom",
    "type": "place",
    "name": "Paphos (Palaepaphos)",
    "altNames": [
      "Κούκλια",
      "Old Paphos",
      "Kouklia"
    ],
    "place": "palaepaphos",
    "period": [
      "late-cypriot",
      "bronze-iron-transition",
      "cypro-geometric",
      "cypro-archaic",
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "The kingdom of the south-west, centred on the old town at Kouklia and its famous sanctuary of Aphrodite.",
    "claims": [
      {
        "text": "Permanent settlement at Kouklia-Palaepaphos began around 1700 BC, probably at the end of a network of settlements based on mining and shipping copper.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-paphos-polity"
        ]
      },
      {
        "text": "The ruins of Paphos (Palaepaphos, Nea Paphos and the Tombs of the Kings) have been a UNESCO World Heritage Site since 1980.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-paphos-polity"
        ]
      },
      {
        "text": "Paphos joined the Ionian Revolt in 499 to 498 BC. The Persians besieged the town with a huge ramp against its walls, built partly from a dismantled sanctuary, while the defenders dug tunnels to undermine it.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-paphos-polity"
        ]
      },
      {
        "text": "Greek tradition named the Arcadian hero Agapenor as the founder of Paphos and of its sanctuary of Aphrodite after the Trojan War.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-arcadocypriot",
          "wikipedia-prehistoric-cyprus"
        ]
      },
      {
        "text": "Recent research shows the settlement came before the sanctuary, and that early prosperity came from copper rather than from pilgrims, overturning older assumptions.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-paphos-polity"
        ]
      },
      {
        "text": "More than 500 inscriptions in a local Paphian form of the syllabic script have been found in its territory.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-paphos-polity"
        ]
      }
    ],
    "relations": [],
    "hellenika": [
      "palaepaphos"
    ]
  },
  {
    "id": "idalion-city",
    "type": "place",
    "name": "Idalion",
    "altNames": [
      "Ιδάλιον",
      "Idalium",
      "Dali"
    ],
    "place": "idalion",
    "period": [
      "cypro-geometric",
      "cypro-archaic",
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "An inland kingdom near modern Dali, rich from nearby copper, with a fortified palace and the sanctuaries of Aphrodite and Adonis.",
    "claims": [
      {
        "text": "Its name is not on the Sargon Stele of 707 BC, but it heads the list of ten Cypriot kingdoms on the prism of the Assyrian king Esarhaddon.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-idalion"
        ]
      },
      {
        "text": "Its fortified palace on the west acropolis, built in 750 to 600 BC and rebuilt against attacks from Kition, is the largest known on Cyprus.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-idalion"
        ]
      },
      {
        "text": "Kition conquered the city around 450 BC and used the palace as its administrative centre; an archive of tax payments was found there.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-idalion"
        ]
      },
      {
        "text": "Between 1867 and 1875 the consul and antiquarian Luigi Palma di Cesnola dug at Idalion and claimed to have opened 15,000 tombs.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-idalion"
        ]
      }
    ],
    "relations": [
      {
        "id": "kition",
        "rel": "ruled by"
      }
    ],
    "hellenika": [
      "idalion"
    ]
  },
  {
    "id": "idalion-tablet",
    "type": "writing",
    "name": "The Idalion Tablet",
    "altNames": [
      "Idalion bronze tablet"
    ],
    "place": "idalion",
    "period": [
      "cypro-classical"
    ],
    "summary": "A bronze tablet of the 5th century BC recording a contract between \"the king and the city\" of Idalion and a family of doctors.",
    "claims": [
      {
        "text": "It is written in the Cypriot syllabary, in the Arcadocypriot dialect of Greek, and is the longest surviving text in that dialect.",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-idalion-tablet",
          "wikipedia-arcadocypriot"
        ]
      },
      {
        "text": "It rewards the physician Onasilos and his brothers for treating the wounded without fee when the city was besieged by the Persians and the Kitians, in 478 to 470 BC.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-idalion-tablet"
        ]
      },
      {
        "text": "Because the decision was taken jointly by the king and the citizens, it is read as evidence of a council governing alongside the king.",
        "evidence": "epigraphic",
        "confidence": "probable",
        "sources": [
          "wikipedia-idalion-tablet",
          "wikipedia-idalion"
        ]
      },
      {
        "text": "A farmer from Dali found it in 1850 in the temple of Athena on the west acropolis; it is now in the Bibliothèque nationale de France in Paris.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-idalion-tablet"
        ]
      }
    ],
    "relations": [
      {
        "id": "idalion-city",
        "rel": "found at"
      }
    ]
  },
  {
    "id": "sargon-stele",
    "type": "writing",
    "name": "The Sargon Stele",
    "altNames": [],
    "place": "kition",
    "period": [
      "cypro-archaic"
    ],
    "summary": "An Assyrian royal monument set up at Kition around 707 BC, the first time an empire of the mainland claimed Cyprus in writing on the island.",
    "claims": [
      {
        "text": "It was found in 1845 at Kition, in modern Larnaca, and is inscribed in Assyrian Akkadian for Sargon II (who reigned 722 to 705 BC).",
        "evidence": "epigraphic",
        "confidence": "established",
        "sources": [
          "wikipedia-sargon-stele"
        ]
      },
      {
        "text": "It was erected around 707 BC and does not name the Cypriot kingdoms individually.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-sargon-stele"
        ]
      },
      {
        "text": "The Cypriot kingdoms may have become vassals of Sargon II. At the time the island was dominated by Tyre, which treated the local city-states as its vassals.",
        "evidence": "debate",
        "confidence": "probable",
        "sources": [
          "wikipedia-sargon-stele"
        ]
      },
      {
        "text": "Esarhaddon (680 to 669 BC) later listed the kingdoms: Idalion, Chytri, Soli, Paphos, Salamis, Kourion, Tamassos, the \"New Town\", Ledra and \"Nuria\".",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-sargon-stele"
        ]
      },
      {
        "text": "Offered to the British Museum, it was bought by Ludwig Ross and is now in the Berlin State Museums; a replica is in the Larnaca District Museum.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-sargon-stele"
        ]
      }
    ],
    "relations": [
      {
        "id": "kition",
        "rel": "found at"
      }
    ]
  },
  {
    "id": "tamassos-city",
    "type": "place",
    "name": "Tamassos",
    "altNames": [
      "Ταμασσός",
      "Tamasos"
    ],
    "place": "tamassos",
    "period": [
      "cypro-archaic",
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "An inland copper-mining kingdom beside the village of Politiko, south-west of Nicosia.",
    "claims": [
      {
        "text": "An Assyrian inscription of about 673 BC, the prism of Esarhaddon, names it Tamesi among the kingdoms paying tribute.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-tamassos"
        ]
      },
      {
        "text": "Because of its copper mines it was probably the \"Temese\" that Homer mentions in the Odyssey as a copper market.",
        "evidence": "debate",
        "confidence": "probable",
        "sources": [
          "wikipedia-tamassos"
        ]
      },
      {
        "text": "Without a port, it was more a town of mines and workshops than a trading city like Salamis or Paphos.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-tamassos"
        ]
      },
      {
        "text": "According to Athenaeus, Alexander the Great gave the city to Pnytagoras, king of Salamis, for his help at the siege of Tyre.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-tamassos"
        ]
      }
    ],
    "hellenika": [
      "tamassos"
    ]
  },
  {
    "id": "soli-city",
    "type": "place",
    "name": "Soli",
    "altNames": [
      "Σόλοι",
      "Soloi"
    ],
    "place": "soli",
    "period": [
      "cypro-archaic",
      "cypro-classical",
      "hellenistic",
      "roman"
    ],
    "summary": "A kingdom on the Bay of Morphou near the island's richest copper district, which traded timber and copper with Athens.",
    "claims": [
      {
        "text": "Tradition credits the Athenian statesman Solon with laying out and naming the city, but Soli already appears among the ten Cypriot kingdoms on the prism of Esarhaddon, before Solon's time.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-soli"
        ]
      },
      {
        "text": "The Swedish Cyprus Expedition led by Einar Gjerstad excavated Soli in 1927.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-soli"
        ]
      },
      {
        "text": "Its temple complex at Cholades, with sanctuaries of Aphrodite, Isis, Serapis and Mithras, dates from Hellenistic and Roman times.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-soli"
        ]
      }
    ],
    "hellenika": [
      "soloi"
    ]
  },
  {
    "id": "marion-city",
    "type": "place",
    "name": "Marion",
    "altNames": [
      "Μάριον",
      "Arsinoe",
      "Polis"
    ],
    "place": "marion",
    "period": [
      "cypro-archaic",
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "A north-western kingdom near modern Polis, rich in copper and gold, with close ties to Athens.",
    "claims": [
      {
        "text": "It grew rich from nearby copper and gold mines and traded widely with Athens, Corinth and the eastern Aegean.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-marion"
        ]
      },
      {
        "text": "Its first definite mention is in 449 BC, when the Athenian general Cimon freed it from the Persians.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-marion"
        ]
      },
      {
        "text": "Ptolemy destroyed it in 312 BC because its last king, Stasioikos II, had sided with Antigonus, and moved its people to Nea Paphos. A new city called Arsinoe was founded on the ruins around 270 BC.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-marion",
          "wikipedia-nea-paphos"
        ]
      },
      {
        "text": "Its sanctuary yielded a colossal terracotta statue, the largest clay sculpture found on Cyprus.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-marion"
        ]
      }
    ],
    "hellenika": [
      "marion"
    ]
  },
  {
    "id": "ionian-revolt-cyprus",
    "type": "event",
    "name": "The revolt against Persia (499 to 497 BC)",
    "altNames": [
      "Ionian Revolt"
    ],
    "period": [
      "cypro-archaic"
    ],
    "summary": "The year when most of the Cypriot kingdoms, led by Onesilus of Salamis, joined the Greeks of Ionia in rebelling against Persia.",
    "claims": [
      {
        "text": "Seeing the revolt spread from Ionia, the kingdoms of Cyprus also rose against Persia; Herodotus says the Cypriots had one year of freedom.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-ionian-revolt"
        ]
      },
      {
        "text": "All the kingdoms joined except Amathus.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-ionian-revolt",
          "wikipedia-amathus"
        ]
      },
      {
        "text": "A Persian army arrived with a Phoenician fleet. In the battle outside Salamis the Persian general Artybius was killed, but the Cypriots were defeated and Onesilus died.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-ionian-revolt",
          "wikipedia-onesilus"
        ]
      },
      {
        "text": "At Paphos the Persians built a siege ramp against the walls, and its remains have been excavated.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-paphos-polity"
        ]
      }
    ],
    "relations": [
      {
        "id": "paphos-kingdom",
        "rel": "took place at"
      }
    ]
  },
  {
    "id": "onesilus",
    "type": "person",
    "name": "Onesilus",
    "altNames": [
      "Ὀνήσιλος",
      "Onesilos"
    ],
    "period": [
      "cypro-archaic"
    ],
    "start": null,
    "end": -497,
    "summary": "The brother of a king of Salamis, who led the Cypriot revolt against Persia and died in battle in 497 BC.",
    "claims": [
      {
        "text": "He is known only from Herodotus.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-onesilus"
        ]
      },
      {
        "text": "He seized Salamis from his brother, King Gorgus, who sided with Persia, and won over every city on the island except Amathus.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-onesilus"
        ]
      },
      {
        "text": "He was killed in the battle near Salamis in 497 BC, and Gorgus was restored as king by the Persians.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-onesilus"
        ]
      }
    ],
    "relations": [
      {
        "id": "ionian-revolt-cyprus",
        "rel": "fought in"
      },
      {
        "id": "salamis-city",
        "rel": "ruled"
      }
    ]
  },
  {
    "id": "evagoras-i",
    "type": "person",
    "name": "Evagoras I",
    "altNames": [
      "Εὐαγόρας",
      "Euagoras"
    ],
    "period": [
      "cypro-classical"
    ],
    "start": -411,
    "end": -374,
    "summary": "King of Salamis from 411 to 374 BC, who spread Greek culture, ruled most of Cyprus for a time, and fought Persia.",
    "claims": [
      {
        "text": "He took the throne of Salamis in 411 BC, returning secretly from exile in Cilicia with fifty followers.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-evagoras"
        ]
      },
      {
        "text": "He helped Athens against Sparta, and the Athenians set up his statue beside that of their admiral Conon.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-evagoras"
        ]
      },
      {
        "text": "From 391 BC he was at war with Persia, extending his rule over most of Cyprus and taking cities in Phoenicia, until he made peace in 376 BC as a Persian vassal.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-evagoras"
        ]
      },
      {
        "text": "The orator Isocrates presents him as a model ruler; other ancient writers are less admiring.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-evagoras"
        ]
      },
      {
        "text": "He was a pioneer in replacing the Cypriot syllabary with the Greek alphabet.",
        "evidence": "epigraphic",
        "confidence": "probable",
        "sources": [
          "wikipedia-cypriot-syllabary"
        ]
      }
    ],
    "relations": [
      {
        "id": "salamis-city",
        "rel": "ruled"
      }
    ]
  },
  {
    "id": "nicocreon",
    "type": "person",
    "name": "Nicocreon",
    "altNames": [
      "Nικoκρέων"
    ],
    "period": [
      "cypro-classical",
      "hellenistic"
    ],
    "summary": "One of the last kings of Salamis, who submitted to Alexander and later ruled Cyprus for Ptolemy.",
    "claims": [
      {
        "text": "Like the other Cypriot kings, he submitted to Alexander the Great without opposition, and in 331 BC paid him homage at Tyre.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-nicocreon"
        ]
      },
      {
        "text": "After Alexander's death he sided with Ptolemy, who gave him command over all of Cyprus.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-nicocreon"
        ]
      },
      {
        "text": "Sources differ on his end: he probably died before 306 BC, and a tumulus at Salamis covering a cenotaph is linked with him.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-nicocreon",
          "wikipedia-salamis"
        ]
      }
    ],
    "relations": [
      {
        "id": "salamis-city",
        "rel": "ruled"
      }
    ]
  },
  {
    "id": "battle-salamis-306",
    "type": "event",
    "name": "The Battle of Salamis (306 BC)",
    "altNames": [],
    "place": "salamis",
    "period": [
      "hellenistic"
    ],
    "summary": "A sea battle off Salamis between two of Alexander's successors, which briefly cost Ptolemy the island.",
    "claims": [
      {
        "text": "Antigonus sent his son Demetrius to take Cyprus from Ptolemy; Demetrius besieged Salamis, held by Ptolemy's brother Menelaus.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-battle-salamis-306"
        ]
      },
      {
        "text": "When Ptolemy came with a relief fleet, Demetrius won a complete victory, and the rest of Cyprus fell to him.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-battle-salamis-306"
        ]
      },
      {
        "text": "After the battle Antigonus took the title of king, and most of the other successors soon did the same.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-battle-salamis-306"
        ]
      }
    ],
    "relations": [
      {
        "id": "salamis-city",
        "rel": "took place at"
      }
    ],
    "hellenika": [
      "battle-salamis-cyprus-306bc"
    ]
  },
  {
    "id": "nea-paphos-city",
    "type": "place",
    "name": "Nea Paphos",
    "altNames": [
      "Πάφος",
      "New Paphos",
      "Kato Paphos"
    ],
    "place": "nea-paphos",
    "period": [
      "hellenistic",
      "roman",
      "late-roman"
    ],
    "summary": "The new port city founded at the end of the 4th century BC, capital of Cyprus under the Ptolemies and Rome, famous for its mosaics.",
    "claims": [
      {
        "text": "It was founded in the late 4th century BC by Nicocles, last ruler of Paphos, as a deep-water port to replace the silted harbour of the old town.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-nea-paphos",
          "wikipedia-paphos-polity"
        ]
      },
      {
        "text": "It became a Ptolemaic shipbuilding centre and, in the 2nd century BC, the capital of Cyprus in place of Salamis, remaining so under Rome.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-nea-paphos"
        ]
      },
      {
        "text": "Excavations began in 1965 under Kazimierz Michałowski of the University of Warsaw and continue with the Cyprus Department of Antiquities and others.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-nea-paphos"
        ]
      },
      {
        "text": "The floor mosaics of its great houses, such as the Villa of Theseus and the House of Aion, are among the finest preserved in the Mediterranean world.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-nea-paphos"
        ]
      }
    ],
    "hellenika": [
      "nea-paphos"
    ]
  },
  {
    "id": "zeno-of-citium",
    "type": "thinker",
    "name": "Zeno of Citium",
    "altNames": [
      "Ζήνων ὁ Κιτιεύς",
      "Zeno of Kition"
    ],
    "period": [
      "hellenistic"
    ],
    "start": -334,
    "end": -262,
    "summary": "The philosopher from Kition who founded Stoicism in Athens.",
    "claims": [
      {
        "text": "He was born at Kition around 334 BC and died around 262 BC.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-zeno"
        ]
      },
      {
        "text": "He founded the Stoic school of philosophy, which he taught in Athens from about 300 BC. Athens honoured him with a public funeral after his death.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-zeno"
        ]
      },
      {
        "text": "Whether he was Phoenician, Greek or of mixed background is debated: Kition had both Phoenician and Greek inhabitants.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-zeno"
        ]
      },
      {
        "text": "Most of what is known of his life comes from Diogenes Laërtius, writing in the 3rd century AD.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-zeno"
        ]
      }
    ],
    "relations": [
      {
        "id": "kition",
        "rel": "born in"
      }
    ],
    "hellenika": [
      "zeno-of-citium"
    ]
  },

  /* ---------- ROMAN TO OTTOMAN (58 BC – AD 1878) ---------- */
  {
    "id": "paul-barnabas-mission",
    "type": "event",
    "name": "Paul and Barnabas on Cyprus",
    "altNames": [],
    "period": [
      "roman"
    ],
    "start": 45,
    "summary": "The first Christian mission across the island, told in the Acts of the Apostles.",
    "claims": [
      {
        "text": "Around AD 45 Paul and Barnabas, with John Mark, preached across Cyprus; Barnabas came back a second time in AD 49.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-roman-cyprus",
          "wikipedia-sergius-paulus"
        ]
      },
      {
        "text": "According to Acts 13, at Paphos they converted the Roman proconsul Sergius Paulus, despite the efforts of the magician Elymas.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-sergius-paulus",
          "wikipedia-church-of-cyprus"
        ]
      },
      {
        "text": "Later Christian tradition therefore calls Cyprus the first territory governed by a Christian ruler.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-church-of-cyprus"
        ]
      }
    ],
    "relations": [
      {
        "id": "nea-paphos-city",
        "rel": "took place at"
      }
    ]
  },
  {
    "id": "sergius-paulus",
    "type": "person",
    "name": "Sergius Paulus",
    "altNames": [
      "Lucius Sergius Paulus"
    ],
    "period": [
      "roman"
    ],
    "summary": "A Roman proconsul of Cyprus under Claudius, remembered as the first governor converted to Christianity.",
    "claims": [
      {
        "text": "He was proconsul of Cyprus under the emperor Claudius (AD 41 to 54).",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-sergius-paulus"
        ]
      },
      {
        "text": "A boundary stone found in Rome in 1887 names a Sergius among the curators of the Tiber appointed in AD 47; he may be the same man, returned from Cyprus.",
        "evidence": "epigraphic",
        "confidence": "probable",
        "sources": [
          "wikipedia-sergius-paulus"
        ]
      },
      {
        "text": "Another inscription naming a proconsul Paulus was found at Soli in 1887. D. G. Hogarth dated it to the mid 1st century, but Terence Mitford argued on epigraphic grounds that it is probably considerably later.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-sergius-paulus"
        ]
      }
    ],
    "relations": [
      {
        "id": "paul-barnabas-mission",
        "rel": "influenced by"
      }
    ]
  },
  {
    "id": "kourion-city",
    "type": "place",
    "name": "Kourion",
    "altNames": [
      "Κούριο",
      "Curium"
    ],
    "place": "kourion",
    "period": [
      "cypro-archaic",
      "cypro-classical",
      "hellenistic",
      "roman",
      "late-roman"
    ],
    "summary": "A city on a limestone cliff above Episkopi Bay, west of Limassol, with a theatre, a sanctuary of Apollo Hylates and early Christian churches.",
    "claims": [
      {
        "text": "Under Rome it governed itself through elected officials, a council and priesthoods, including priests and priestesses of Apollo Hylates, under the oversight of the proconsul.",
        "evidence": "epigraphic",
        "confidence": "strong",
        "sources": [
          "wikipedia-kourion"
        ]
      },
      {
        "text": "Its Sanctuary of Apollo Hylates was rebuilt after an earthquake in AD 65/66, and restored again under Trajan.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-roman-cyprus",
          "wikipedia-kourion"
        ]
      },
      {
        "text": "Five strong earthquakes between 365 and 370 left it almost completely destroyed; it was rebuilt in the late 4th and early 5th centuries, with a Christian precinct on the acropolis.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-kourion"
        ]
      },
      {
        "text": "Arab raids in 648 to 649 destroyed the acropolis, and the town moved to Episkopi, named after its bishop.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-kourion"
        ]
      },
      {
        "text": "Luigi Palma di Cesnola dug its cemetery and sanctuary in 1874 to 1875 only to recover valuable objects, most of which he sold to the Metropolitan Museum of Art.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-kourion"
        ]
      }
    ],
    "relations": [
      {
        "id": "kourion-sceptre",
        "rel": "find spot of"
      }
    ],
    "hellenika": [
      "kourion"
    ]
  },
  {
    "id": "jewish-revolt-116",
    "type": "event",
    "name": "The Jewish revolt of AD 116",
    "altNames": [
      "Kitos War"
    ],
    "place": "salamis",
    "period": [
      "roman"
    ],
    "start": 116,
    "end": 117,
    "summary": "Part of a wave of Jewish uprisings across the eastern Roman Empire, which devastated Salamis and ended in harsh reprisals.",
    "claims": [
      {
        "text": "In Cyprus, Jewish rebels led by Artemion reportedly devastated the island and the city of Salamis.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kitos-war"
        ]
      },
      {
        "text": "It was one of a series of uprisings at the same time in Egypt, Libya, Cyprus and Mesopotamia.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-kitos-war"
        ]
      },
      {
        "text": "The Roman campaigns that followed were extremely brutal and nearly wiped out the Jewish population of Cyprus.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kitos-war"
        ]
      }
    ],
    "relations": [
      {
        "id": "salamis-city",
        "rel": "took place at"
      }
    ]
  },
  {
    "id": "church-autocephaly",
    "type": "event",
    "name": "The independence of the Church of Cyprus",
    "altNames": [
      "Autocephaly"
    ],
    "period": [
      "late-roman"
    ],
    "start": 431,
    "end": 488,
    "summary": "How the Church of Cyprus won recognition as self-governing, first at Ephesus in 431, then from the emperor in 488.",
    "claims": [
      {
        "text": "The Council of Ephesus in 431 recognised that the bishops of Cyprus could ordain their own bishops, against the claims of the patriarch of Antioch.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-church-of-cyprus",
          "wikipedia-history-of-cyprus"
        ]
      },
      {
        "text": "Whether the Church of Cyprus had always been independent, or had once been under Antioch, is unclear.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-church-of-cyprus"
        ]
      },
      {
        "text": "In 488, after Archbishop Anthemius found what was believed to be the tomb of Barnabas, the emperor Zeno confirmed the Church's independence and granted its archbishop the sceptre, red ink and purple cloak still used today.",
        "evidence": "tradition",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-middle-ages"
        ]
      }
    ],
    "relations": [
      {
        "id": "barnabas-monastery",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "barnabas-monastery",
    "type": "place",
    "name": "The Monastery of Saint Barnabas",
    "altNames": [
      "Ayios Barnabas"
    ],
    "place": "barnabas-monastery",
    "period": [
      "late-roman",
      "middle-byzantine",
      "ottoman"
    ],
    "summary": "A church near Salamis built over the place where the body of Barnabas was said to be found, now an icon and archaeological museum.",
    "claims": [
      {
        "text": "The first church was built in the late 5th century, perhaps in 477, paid for by the emperor Zeno, near where Archbishop Anthemius found the body of Barnabas.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-barnabas-monastery"
        ]
      },
      {
        "text": "It was destroyed in Arab raids in the late 7th century; the present church, of around 900, incorporates what remains of the first.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-barnabas-monastery"
        ]
      },
      {
        "text": "The present buildings date largely from work by Archbishop Philotheos in 1756. The monastery was abandoned after 1974 and is now a museum.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-barnabas-monastery"
        ]
      }
    ]
  },
  {
    "id": "epiphanius",
    "type": "thinker",
    "name": "Epiphanius of Salamis",
    "altNames": [
      "Ἐπιφάνιος"
    ],
    "period": [
      "late-roman"
    ],
    "start": 365,
    "end": 403,
    "summary": "Bishop of Salamis for nearly forty years, a fierce defender of orthodoxy and author of a catalogue of eighty heresies.",
    "claims": [
      {
        "text": "Born in Palestine, he became bishop of Salamis in 365 or 367 and held the post until his death in 403, as metropolitan of the Church of Cyprus.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-epiphanius"
        ]
      },
      {
        "text": "His best-known work, the Panarion, catalogues eighty heresies, including pagan religions and philosophies.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-epiphanius"
        ]
      },
      {
        "text": "How many of the quotations later attributed to him by the Byzantine Iconoclasts are genuine is disputed, but he was clearly strongly against some uses of images in churches of his time.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-epiphanius"
        ]
      }
    ]
  },
  {
    "id": "arab-raids-649",
    "type": "event",
    "name": "The Arab expeditions of 649 to 650",
    "altNames": [
      "Muslim conquest of Cyprus"
    ],
    "period": [
      "late-roman"
    ],
    "start": 649,
    "end": 654,
    "summary": "The first naval campaigns of the caliphate, which took the capital, imposed tribute and began three centuries of contest over the island.",
    "claims": [
      {
        "text": "In 649 a fleet under Mu'awiya, governor of Syria, landed unopposed, took the capital Constantia and left with plunder and captives.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-muslim-conquest",
          "wikipedia-cyprus-middle-ages"
        ]
      },
      {
        "text": "The Cypriots then paid tribute to the caliphate as well as to Byzantium, a first form of the later shared rule.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-muslim-conquest"
        ]
      },
      {
        "text": "A second expedition in 650 or 654 left a garrison of 12,000, which stayed until 680.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-middle-ages",
          "wikipedia-muslim-conquest"
        ]
      }
    ],
    "relations": [
      {
        "id": "salamis-city",
        "rel": "took place at"
      }
    ]
  },
  {
    "id": "umm-haram",
    "type": "person",
    "name": "Umm Haram",
    "altNames": [
      "أم حرام بنت ملحان",
      "Hala Sultan"
    ],
    "place": "hala-sultan-tekke",
    "period": [
      "late-roman",
      "ottoman"
    ],
    "summary": "A companion of the Prophet Muhammad who died on Cyprus during the first Arab expedition; her tomb by the Larnaca salt lake is a place of pilgrimage.",
    "claims": [
      {
        "text": "Umm Haram bint Milhan, known in Turkish tradition as Hala Sultan, was a companion of the Prophet Muhammad and the wife of Ubada ibn al-Samit.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-umm-haram"
        ]
      },
      {
        "text": "Tradition says she fell from her mule near the salt lake at Larnaca during the expedition of the late 640s, died, and was buried where she fell.",
        "evidence": "tradition",
        "confidence": "probable",
        "sources": [
          "wikipedia-umm-haram",
          "wikipedia-cyprus-middle-ages",
          "wikipedia-hala-sultan-tekke"
        ]
      },
      {
        "text": "According to Shia belief her grave is instead in the Jannat al-Baqi cemetery in Medina.",
        "evidence": "tradition",
        "confidence": "debated",
        "sources": [
          "wikipedia-hala-sultan-tekke"
        ]
      }
    ],
    "relations": [
      {
        "id": "hala-sultan-tekke",
        "rel": "died in"
      },
      {
        "id": "arab-raids-649",
        "rel": "fought in"
      }
    ]
  },
  {
    "id": "condominium-688",
    "type": "event",
    "name": "The shared rule of 688",
    "altNames": [
      "The condominium"
    ],
    "period": [
      "arab-byzantine"
    ],
    "start": 688,
    "end": 965,
    "summary": "An agreement between emperor and caliph to rule Cyprus jointly and split its taxes, which lasted about three hundred years.",
    "claims": [
      {
        "text": "In 688 the emperor Justinian II and the caliph Abd al-Malik agreed to rule Cyprus jointly; the Arabs withdrew and the taxes were divided between them.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-middle-ages",
          "wikipedia-history-of-cyprus"
        ]
      },
      {
        "text": "Under Basil I (867 to 886) Byzantine troops retook the island and made it a province, but after seven years it went back to shared rule.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-middle-ages"
        ]
      },
      {
        "text": "The shared rule ended when Niketas Chalkoutzes recovered the island for Byzantium in 965.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-history-of-cyprus",
          "wikipedia-niketas"
        ]
      }
    ]
  },
  {
    "id": "niketas-chalkoutzes",
    "type": "person",
    "name": "Niketas Chalkoutzes",
    "altNames": [
      "Νικήτας Χαλκούτζης"
    ],
    "period": [
      "middle-byzantine"
    ],
    "summary": "The Byzantine general who brought Cyprus back fully under the empire in 965.",
    "claims": [
      {
        "text": "The chroniclers Kedrenos and Skylitzes credit him with recovering Cyprus from the shared rule with the Arabs.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-niketas"
        ]
      },
      {
        "text": "No details of the campaign survive. It is usually dated to the second half of 965, but may have been a little earlier, perhaps mid-964.",
        "evidence": "debate",
        "confidence": "probable",
        "sources": [
          "wikipedia-niketas"
        ]
      },
      {
        "text": "He was probably the first Byzantine governor (strategos) of the island afterwards.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-niketas",
          "wikipedia-cyprus-middle-ages"
        ]
      }
    ],
    "relations": [
      {
        "id": "condominium-688",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "troodos-painted-churches",
    "type": "place",
    "name": "The painted churches of the Troodos",
    "altNames": [
      "Τοιχογραφημένοι ναοί"
    ],
    "place": "troodos-churches",
    "period": [
      "middle-byzantine",
      "lusignan",
      "venetian"
    ],
    "summary": "Ten mountain churches and monasteries covered in Byzantine and post-Byzantine wall paintings, a UNESCO World Heritage Site.",
    "claims": [
      {
        "text": "UNESCO listed nine of the churches in 1985 and added a tenth, at Palaichori, in 2001.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-painted-churches"
        ]
      },
      {
        "text": "They range from Agios Nikolaos tis Stegis at Kakopetria, an 11th-century monastery with the oldest surviving monastery church (katholikon) on Cyprus, to churches of the 16th century.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-painted-churches"
        ]
      },
      {
        "text": "Among them is the 12th-century church of the Virgin Phorviotissa at Asinou, near Nikitari.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-painted-churches"
        ]
      },
      {
        "text": "Many have steep-pitched wooden roofs; the chapel at Moutoullas is the earliest example.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-painted-churches"
        ]
      }
    ]
  },
  {
    "id": "kykkos-monastery",
    "type": "place",
    "name": "Kykkos Monastery",
    "altNames": [
      "Ιερά Μονή Κύκκου",
      "Cikko Manastırı"
    ],
    "place": "kykkos",
    "period": [
      "middle-byzantine",
      "lusignan",
      "venetian",
      "ottoman",
      "british",
      "since-1960"
    ],
    "summary": "A wealthy monastery high in the Troodos, founded around 1100 and home to an icon of the Virgin said to be painted by Saint Luke.",
    "claims": [
      {
        "text": "It was founded around the end of the 11th century by the emperor Alexios I Komnenos, and stands at about 1,318 metres.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kykkos"
        ]
      },
      {
        "text": "Nothing of the first monastery survives, as it has burned down many times.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-kykkos"
        ]
      },
      {
        "text": "Tradition says the hermit Esaias asked the governor Manuel Boutoumites to bring from Constantinople an icon of the Virgin painted by the Apostle Luke.",
        "evidence": "tradition",
        "confidence": "legendary",
        "sources": [
          "wikipedia-kykkos"
        ]
      },
      {
        "text": "Makarios III, later archbishop and first president of Cyprus, began his life in the church there as a monk in 1926.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-kykkos"
        ]
      }
    ]
  },
  {
    "id": "saint-hilarion-castle",
    "type": "place",
    "name": "Saint Hilarion Castle",
    "altNames": [
      "Κάστρο του Αγίου Ιλαρίωνα",
      "St. Hilarion Kalesi"
    ],
    "place": "saint-hilarion",
    "period": [
      "middle-byzantine",
      "lusignan",
      "venetian"
    ],
    "summary": "A castle on the peaks of the Kyrenia mountains, guarding the pass between Kyrenia and Nicosia.",
    "claims": [
      {
        "text": "The Byzantines began fortifying it in the 11th century; with Buffavento and Kantara it guarded the island against raids from the sea.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-saint-hilarion"
        ]
      },
      {
        "text": "The Lusignan kings strengthened it and may have used it as a summer residence; it was at the centre of a four-year struggle between the emperor Frederick II and John of Ibelin.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-saint-hilarion"
        ]
      },
      {
        "text": "The Venetians dismantled much of it to save the cost of a garrison.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-saint-hilarion"
        ]
      }
    ]
  },
  {
    "id": "isaac-komnenos",
    "type": "person",
    "name": "Isaac Komnenos",
    "altNames": [
      "Ισαάκιος Κομνηνός"
    ],
    "period": [
      "middle-byzantine"
    ],
    "start": 1185,
    "end": 1191,
    "summary": "The last Byzantine governor of Cyprus, who made himself its \"emperor\" and lost it to Richard the Lionheart.",
    "claims": [
      {
        "text": "In 1185 he rebelled and took control of Cyprus. A Byzantine fleet sent against him lost its ships to Margaritus of Brindisi, admiral of William II of Sicily, and its troops were defeated.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-isaac-komnenos",
          "wikipedia-history-of-cyprus"
        ]
      },
      {
        "text": "Contemporary sources commonly call him the emperor of Cyprus.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-isaac-komnenos"
        ]
      },
      {
        "text": "After defeating him in 1191, Richard I had him bound in silver chains, having sworn not to bind him in iron, and kept him prisoner until his death in 1194 or 1195.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-middle-ages"
        ]
      }
    ],
    "relations": []
  },
  {
    "id": "richard-1191",
    "type": "event",
    "name": "Richard the Lionheart takes Cyprus (1191)",
    "altNames": [],
    "period": [
      "middle-byzantine",
      "lusignan"
    ],
    "start": 1191,
    "end": 1192,
    "summary": "On his way to the Third Crusade, the king of England conquered the island, married at Limassol, then sold it on.",
    "claims": [
      {
        "text": "Ships carrying Richard's sister Joan and his bride Berengaria reached Limassol after a storm; when Isaac Komnenos treated them as a threat, Richard invaded.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-theme",
          "wikipedia-history-of-cyprus"
        ]
      },
      {
        "text": "Richard married Berengaria at Limassol, and she was crowned Queen of England there.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-history-of-cyprus"
        ]
      },
      {
        "text": "He sold the island to the Knights Templar, who after a rebellion in April 1192 passed it to Guy of Lusignan.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-middle-ages"
        ]
      },
      {
        "text": "The Cypriot chronicler Neophytus called Richard \"the wretch\".",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-middle-ages"
        ]
      }
    ],
    "relations": [
      {
        "id": "isaac-komnenos",
        "rel": "fought by"
      }
    ]
  },
  {
    "id": "guy-of-lusignan",
    "type": "person",
    "name": "Guy of Lusignan",
    "altNames": [
      "Guy de Lusignan"
    ],
    "period": [
      "lusignan"
    ],
    "start": 1192,
    "end": 1194,
    "summary": "The former king of Jerusalem who bought Cyprus in 1192 and founded three centuries of Lusignan rule.",
    "claims": [
      {
        "text": "He had been king of Jerusalem and was captured by Saladin at the Battle of Hattin in 1187.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-guy-of-lusignan"
        ]
      },
      {
        "text": "He bought Cyprus in 1192 and was its lord until his death in 1194.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-guy-of-lusignan",
          "wikipedia-cyprus-middle-ages"
        ]
      },
      {
        "text": "He invited barons who had lost their lands to Saladin to settle on Cyprus, giving them large estates under feudal rights.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-middle-ages"
        ]
      }
    ],
    "relations": [
      {
        "id": "richard-1191",
        "rel": "influenced by"
      }
    ]
  },
  {
    "id": "saint-sophia-nicosia",
    "type": "place",
    "name": "Saint Sophia, Nicosia (Selimiye Mosque)",
    "altNames": [
      "Τέμενος Σελιμιγιέ",
      "Selimiye Camii",
      "Ayasofya Camii"
    ],
    "place": "nicosia",
    "period": [
      "lusignan",
      "venetian",
      "ottoman",
      "british",
      "since-1960"
    ],
    "summary": "The Gothic coronation cathedral of the kings of Cyprus, a mosque since 1571.",
    "claims": [
      {
        "text": "The foundation stone is usually dated to 1209, and the church was largely complete by 1228.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-selimiye"
        ]
      },
      {
        "text": "It is the largest and oldest surviving Gothic church on Cyprus, and was the coronation church of the kings of Cyprus.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-selimiye"
        ]
      },
      {
        "text": "Converted into a mosque after the Ottoman conquest, it has historically been the main mosque of the island.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-selimiye"
        ]
      }
    ]
  },
  {
    "id": "saint-nicholas-famagusta",
    "type": "place",
    "name": "Saint Nicholas, Famagusta (Lala Mustafa Pasha Mosque)",
    "altNames": [
      "Lala Mustafa Paşa Camii"
    ],
    "place": "famagusta",
    "period": [
      "lusignan",
      "venetian",
      "ottoman",
      "british",
      "since-1960"
    ],
    "summary": "A Gothic cathedral so close to French models it has been called \"the Reims of Cyprus\", where the Lusignan kings were crowned kings of Jerusalem.",
    "claims": [
      {
        "text": "It was built between 1298 and about 1400 and consecrated as a Catholic cathedral in 1328.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-lala-mustafa"
        ]
      },
      {
        "text": "The Lusignan kings were crowned kings of Cyprus in Saint Sophia in Nicosia and then kings of Jerusalem here.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-lala-mustafa",
          "wikipedia-peter-i"
        ]
      },
      {
        "text": "It became a mosque after the Ottomans took Famagusta in 1571; since 1954 it has been named after Lala Mustafa Pasha, who led the Ottoman forces.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-lala-mustafa"
        ]
      }
    ]
  },
  {
    "id": "bellapais-abbey",
    "type": "place",
    "name": "Bellapais Abbey",
    "altNames": [
      "Μονή Μπέλλαπαϊς",
      "Beylerbeyi Manastırı"
    ],
    "place": "bellapais",
    "period": [
      "lusignan",
      "venetian"
    ],
    "summary": "A ruined Gothic abbey above Kyrenia, founded by canons who fled Jerusalem in 1187.",
    "claims": [
      {
        "text": "Its first known occupants were canons of the Holy Sepulchre who had fled Jerusalem after it fell to Saladin in 1187.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-bellapais"
        ]
      },
      {
        "text": "Aimery de Lusignan founded the monastery; its first buildings date from between 1198 and 1205, and the main building from the reign of Hugh III (1267 to 1284).",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-bellapais"
        ]
      },
      {
        "text": "The Genoese stripped it of everything portable and valuable in their raid of 1373.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-bellapais"
        ]
      }
    ]
  },
  {
    "id": "kolossi-castle",
    "type": "place",
    "name": "Kolossi Castle",
    "altNames": [
      "Κάστρο του Κολοσσίου"
    ],
    "place": "kolossi",
    "period": [
      "lusignan",
      "venetian"
    ],
    "summary": "A square Crusader keep west of Limassol, a centre of sugar making and of the sweet wine Commandaria.",
    "claims": [
      {
        "text": "The first castle was possibly built in 1210, when King Hugh I gave the land to the Knights Hospitaller; the present keep was built in 1454 by the Hospitallers under the commander Louis de Magnac.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kolossi"
        ]
      },
      {
        "text": "It held large facilities for making sugar from local sugarcane, one of the island's main exports.",
        "evidence": "archaeological",
        "confidence": "strong",
        "sources": [
          "wikipedia-kolossi"
        ]
      },
      {
        "text": "The sweet wine Commandaria takes its name from the Grand Commandery here, and is thought to be the oldest continually produced named wine in the world.",
        "evidence": "tradition",
        "confidence": "probable",
        "sources": [
          "wikipedia-kolossi"
        ]
      }
    ]
  },
  {
    "id": "peter-i-of-cyprus",
    "type": "person",
    "name": "Peter I of Cyprus",
    "altNames": [
      "Πέτρος Α΄"
    ],
    "period": [
      "lusignan"
    ],
    "start": 1358,
    "end": 1369,
    "summary": "A crusading king who sacked Alexandria in 1365 and was murdered by his own knights.",
    "claims": [
      {
        "text": "Born in Nicosia in 1328, he became king in 1358 and was crowned in Saint Sophia, Nicosia, and as king of Jerusalem in Saint Nicholas, Famagusta, in 1360.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-peter-i"
        ]
      },
      {
        "text": "In 1365 he led a raid on Alexandria and sacked the city for three days.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-mamluk-1426",
          "wikipedia-peter-i"
        ]
      },
      {
        "text": "He was assassinated by three of his knights in 1369.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-peter-i"
        ]
      }
    ],
    "relations": [
      {
        "id": "saint-sophia-nicosia",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "mamluk-1426",
    "type": "event",
    "name": "The Mamluk campaigns and the Battle of Khirokitia (1424 to 1426)",
    "altNames": [],
    "place": "khirokitia",
    "period": [
      "lusignan"
    ],
    "start": 1424,
    "end": 1426,
    "summary": "Three expeditions from Egypt, ending in the capture of King Janus and the kingdom paying tribute to the Mamluks.",
    "claims": [
      {
        "text": "After years of Cypriot raids on Egyptian ports and shipping, the Mamluk Sultanate sent three expeditions to Cyprus between 1424 and 1426, each time sacking Limassol.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-mamluk-1426"
        ]
      },
      {
        "text": "On 7 July 1426 the Mamluks defeated the Cypriot army at Khirokitia and captured King Janus.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-mamluk-1426"
        ]
      },
      {
        "text": "From then on Cyprus was a tributary state of Egypt.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-mamluk-1426",
          "wikipedia-history-of-cyprus"
        ]
      }
    ],
    "relations": [
      {
        "id": "khirokitia-site",
        "rel": "took place at"
      }
    ]
  },
  {
    "id": "catherine-cornaro",
    "type": "person",
    "name": "Catherine Cornaro",
    "altNames": [
      "Αικατερίνη Κορνάρο",
      "Caterina Cornaro"
    ],
    "period": [
      "lusignan",
      "venetian"
    ],
    "start": 1474,
    "end": 1489,
    "summary": "A Venetian noblewoman who became the last queen of Cyprus and handed the island to Venice.",
    "claims": [
      {
        "text": "Born in Venice in 1454, she married King James II of Cyprus by proxy in 1468, at fourteen; the match secured Venice's trading rights on the island.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-catherine-cornaro",
          "wikipedia-venetian-cyprus"
        ]
      },
      {
        "text": "After the deaths of her husband and their infant son, she reigned as queen from 1474 to 1489.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-catherine-cornaro"
        ]
      },
      {
        "text": "In 1489 she was made to abdicate and cede Cyprus to the Republic of Venice; she kept the title of queen and was given the lordship of Asolo.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-venetian-cyprus",
          "wikipedia-catherine-cornaro"
        ]
      },
      {
        "text": "The chronicler George Boustronios describes her leaving Nicosia in black, in tears, while the people mourned.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-venetian-cyprus"
        ]
      }
    ]
  },
  {
    "id": "walls-of-nicosia",
    "type": "place",
    "name": "The Venetian walls of Nicosia",
    "altNames": [
      "Τείχη της Λευκωσίας",
      "Lefkoşa surları"
    ],
    "place": "nicosia",
    "period": [
      "venetian",
      "ottoman",
      "british",
      "since-1960"
    ],
    "summary": "The circuit of Renaissance walls and bastions still ringing the old city of Nicosia.",
    "claims": [
      {
        "text": "In 1567 Venice commissioned the engineers Giulio Savorgnan and Francesco Barbaro to rebuild the city's defences, demolishing the medieval walls and many buildings inside and outside them.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-walls-nicosia"
        ]
      },
      {
        "text": "The river Pedieos was diverted to fill the moat around the new walls.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-walls-nicosia"
        ]
      },
      {
        "text": "Still unfinished when the Ottomans attacked in 1570, the walls were breached at the Podocattaro bastion on 9 September after a siege that began on 22 July.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-walls-nicosia"
        ]
      },
      {
        "text": "They are among the best preserved Renaissance fortifications in the eastern Mediterranean.",
        "evidence": "archaeological",
        "confidence": "probable",
        "sources": [
          "wikipedia-walls-nicosia"
        ]
      }
    ]
  },
  {
    "id": "ottoman-conquest",
    "type": "event",
    "name": "The Ottoman conquest (1570 to 1571)",
    "altNames": [
      "Siege of Nicosia",
      "Siege of Famagusta"
    ],
    "period": [
      "venetian",
      "ottoman"
    ],
    "start": 1570,
    "end": 1571,
    "summary": "The war in which the Ottoman Empire took Cyprus from Venice: Nicosia fell in 1570 and Famagusta in 1571.",
    "claims": [
      {
        "text": "The Ottoman army under Lala Mustafa Pasha landed near Limassol in July 1570 and besieged Nicosia, which fell on 9 September.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-ottoman-cyprus",
          "wikipedia-walls-nicosia"
        ]
      },
      {
        "text": "Many of Nicosia's defenders and people were killed when the city fell; Wikipedia's articles give a figure of about 20,000, from contemporary accounts.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-ottoman-cyprus",
          "wikipedia-siege-famagusta"
        ]
      },
      {
        "text": "Kyrenia surrendered without a fight; Famagusta, defended by Marco Antonio Bragadin, held out from September 1570 to August 1571.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-ottoman-cyprus",
          "wikipedia-siege-famagusta"
        ]
      },
      {
        "text": "After Famagusta surrendered on terms, the agreement was broken: Bragadin was executed and many of the defenders killed.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-ottoman-cyprus",
          "wikipedia-bragadin"
        ]
      },
      {
        "text": "The Holy League's victory at Lepanto in October 1571 came too late to change the outcome for Cyprus.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-ottoman-cyprus"
        ]
      }
    ],
    "relations": [
      {
        "id": "walls-of-nicosia",
        "rel": "took place at"
      }
    ],
    "place": "famagusta"
  },
  {
    "id": "bragadin",
    "type": "person",
    "name": "Marco Antonio Bragadin",
    "altNames": [
      "Marcantonio Bragadin"
    ],
    "period": [
      "venetian"
    ],
    "start": 1569,
    "end": 1571,
    "summary": "The Venetian commander of Famagusta during the eleven-month siege of 1570 to 1571.",
    "claims": [
      {
        "text": "Elected Captain of the Kingdom of Cyprus in 1569, he moved to Famagusta and strengthened its defences.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-bragadin"
        ]
      },
      {
        "text": "He led the defence of Famagusta from September 1570 until its surrender in August 1571.",
        "evidence": "literary",
        "confidence": "established",
        "sources": [
          "wikipedia-bragadin",
          "wikipedia-siege-famagusta"
        ]
      },
      {
        "text": "Despite the agreed terms of surrender, he was executed by flaying on 17 August 1571.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-bragadin"
        ]
      }
    ],
    "relations": [
      {
        "id": "ottoman-conquest",
        "rel": "fought in"
      }
    ]
  },
  {
    "id": "buyuk-han",
    "type": "place",
    "name": "Büyük Han",
    "altNames": [
      "Μεγάλο Πανδοχείο",
      "Great Inn"
    ],
    "place": "nicosia",
    "period": [
      "ottoman",
      "british",
      "since-1960"
    ],
    "summary": "The largest caravanserai on Cyprus, built in Nicosia the year after the conquest, now an arts centre.",
    "claims": [
      {
        "text": "It was built in 1572, modelled on the Koza Han in Bursa; sources differ on whether the governor Muzaffer Pasha or his successor Sinan Pasha built it.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-buyuk-han"
        ]
      },
      {
        "text": "Its two floors of 68 rooms surround a courtyard with a small mosque and an ablutions fountain at its centre.",
        "evidence": "archaeological",
        "confidence": "established",
        "sources": [
          "wikipedia-buyuk-han"
        ]
      },
      {
        "text": "After the British takeover in 1878 it was restored for use as a prison, and was Nicosia's Central Prison from 1892 to 1903; after restoration through most of the 1990s, it is now an arts centre.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-buyuk-han"
        ]
      }
    ]
  },
  {
    "id": "kornesios",
    "type": "person",
    "name": "Hadjigeorgakis Kornesios",
    "altNames": [
      "Χατζηγεωργάκης Κορνέσιος"
    ],
    "period": [
      "ottoman"
    ],
    "start": 1779,
    "end": 1809,
    "summary": "The Dragoman of Cyprus, a Greek Cypriot official of the Ottoman administration and one of the most powerful men on the island around 1800.",
    "claims": [
      {
        "text": "From Kritou Terra in Paphos, he was dragoman (interpreter) of Cyprus from 1779 to 1809; around 1796 Sultan Selim III made the post his for life.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-kornesios"
        ]
      },
      {
        "text": "The dragoman, usually a local Christian fluent in Greek and Turkish, dealt mainly with taxes and administration, between the Ottoman officials and the local community.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-kornesios"
        ]
      },
      {
        "text": "In 1804, amid heavy taxes and a wheat shortage, a revolt sacked his mansion and he fled to Constantinople for three years.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kornesios"
        ]
      }
    ]
  },
  {
    "id": "july-1821",
    "type": "event",
    "name": "The executions of July 1821",
    "altNames": [],
    "place": "nicosia",
    "period": [
      "ottoman"
    ],
    "start": 1821,
    "summary": "The killing of the archbishop, bishops and leading Greek Cypriots in Nicosia after the Greek War of Independence broke out.",
    "claims": [
      {
        "text": "Archbishop Kyprianos had joined the Friendly Society (Philiki Etairia) in 1818. Asked in 1820 for Cyprus to join the armed struggle, he advised supporting the revolution with money and supplies instead, as an isolated island with no navy.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kyprianos"
        ]
      },
      {
        "text": "When the war broke out on 25 March 1821 many Cypriots left to fight in Greece; the local pasha, Küçük Mehmet, called in reinforcements, confiscated weapons and arrested prominent Cypriots.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-kyprianos"
        ]
      },
      {
        "text": "On 9 July 1821 he had the gates of Nicosia closed and executed 470 leading Cypriots, among them the bishops of Paphos, Kition and Kyrenia; Archbishop Kyprianos was publicly hanged.",
        "evidence": "literary",
        "confidence": "strong",
        "sources": [
          "wikipedia-kyprianos"
        ]
      },
      {
        "text": "Kyprianos had founded the Pancyprian Gymnasium in 1812, the island's first secondary school.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-kyprianos"
        ]
      }
    ]
  },

  /* ---------- BRITISH AND SINCE 1960 (1878 – today) ---------- */
  {
    "id": "cyprus-convention",
    "type": "writing",
    "name": "The Cyprus Convention (1878)",
    "altNames": [],
    "period": [
      "ottoman",
      "british"
    ],
    "start": 1878,
    "end": 1914,
    "summary": "A secret agreement between Britain and the Ottoman Empire that handed the government of Cyprus to Britain while leaving the Sultan's rights in place.",
    "claims": [
      {
        "text": "Agreed on 4 June 1878, it gave Britain administrative control of Cyprus in exchange for British support of the Ottomans at the Congress of Berlin, and kept Ottoman rights over the island.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-cyprus-convention"
        ]
      },
      {
        "text": "Britain was to use the island as a base to protect the Ottoman Empire against possible Russian expansion.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-convention"
        ]
      },
      {
        "text": "The \"Cyprus Tribute\", the surplus of revenue owed to the Sultan, was fixed at £92,799 11s 3d a year, but was paid into the Bank of England against Ottoman loans on which the Ottomans had defaulted.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-convention"
        ]
      },
      {
        "text": "In a welcoming speech for the first British High Commissioner at Larnaca, the bishop of Kition expressed the hope that Britain would bring about the union of Cyprus with Greece.",
        "evidence": "literary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-convention",
          "wikipedia-eoka"
        ]
      },
      {
        "text": "Britain ended the Convention by annexing Cyprus on 5 November 1914, when the Ottoman Empire entered the First World War.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-cyprus-convention",
          "wikipedia-british-cyprus"
        ]
      }
    ]
  },
  {
    "id": "october-1931",
    "type": "event",
    "name": "The October Events of 1931",
    "altNames": [
      "Οκτωβριανά",
      "1931 Cyprus revolt"
    ],
    "place": "nicosia",
    "period": [
      "british"
    ],
    "start": 1931,
    "summary": "A Greek Cypriot uprising for union with Greece, followed by years of direct rule by the governor.",
    "claims": [
      {
        "text": "In September 1931 the governor, Ronald Storrs, overrode a Legislative Council decision against tax rises, and the Greek Cypriot members resigned.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-1931-revolt"
        ]
      },
      {
        "text": "On 21 October about 5,000 people, mostly students, priests and city notables, marched in Nicosia for union with Greece; after hours of stone throwing, Government House was set on fire.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-1931-revolt"
        ]
      },
      {
        "text": "Seven protesters were killed and thirty injured; ten people were exiled for life and 2,606 received other punishments.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-1931-revolt",
          "wikipedia-eoka"
        ]
      },
      {
        "text": "The Legislative Council and municipal elections were abolished, and flying foreign flags and gatherings of more than five people were banned. The period of autocratic rule that followed is called the \"Palmerocracy\", after governor Richmond Palmer.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-1931-revolt"
        ]
      }
    ]
  },
  {
    "id": "enosis-referendum-1950",
    "type": "event",
    "name": "The enosis referendum of 1950",
    "altNames": [],
    "period": [
      "british"
    ],
    "start": 1950,
    "summary": "An unofficial vote organised by the Church of Cyprus, in which Greek Cypriots signed for or against union with Greece.",
    "claims": [
      {
        "text": "After the British refused Archbishop Makarios II's call for a referendum, the Church Council organised one, with signature books in churches from 15 to 22 January 1950.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-1950-referendum"
        ]
      },
      {
        "text": "Only Greek Cypriots voted, and 95.71% of those taking part were in favour of union with Greece; the result was never implemented.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-1950-referendum",
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "The British authorities did not sanction or recognise the vote.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-1950-referendum",
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "Afterwards, the Church publicly admonished those who had voted against union.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-1950-referendum"
        ]
      }
    ]
  },
  {
    "id": "eoka",
    "type": "event",
    "name": "EOKA and the Cyprus Emergency (1955 to 1959)",
    "altNames": [
      "Εθνική Οργάνωσις Κυπρίων Αγωνιστών",
      "National Organisation of Cypriot Fighters"
    ],
    "period": [
      "british"
    ],
    "start": 1955,
    "end": 1959,
    "summary": "The armed campaign of a Greek Cypriot organisation to end British rule and unite Cyprus with Greece, and Britain's counter-insurgency against it.",
    "claims": [
      {
        "text": "EOKA was led by Georgios Grivas, a Cypriot-born officer of the Greek army, who took the name Digenis.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-eoka"
        ]
      },
      {
        "text": "Its campaign began with attacks on 1 April 1955; the governor, Sir John Harding, declared a state of emergency on 26 November 1955.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "The communist party AKEL opposed EOKA's armed action and argued for civil disobedience instead.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-eoka"
        ]
      },
      {
        "text": "Britain relied heavily on Turkish Cypriot policemen against EOKA, which made relations between the two communities worse.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-emergency",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "EOKA also killed Turkish Cypriot policemen and Greek Cypriots it saw as opponents, including leftists; from January 1957 it deliberately targeted Turkish Cypriot police.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-turkish-invasion",
          "wikipedia-intercommunal"
        ]
      },
      {
        "text": "At least 14 detainees suspected of belonging to EOKA were tortured and killed in British custody; in 2019 the British government paid £1 million to 33 Cypriots who said they had been tortured, without admitting liability.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "Grivas declared a ceasefire on 9 March 1959, after the London and Zürich Agreements, and left the island under safe conduct.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-emergency"
        ]
      }
    ],
    "relations": [
      {
        "id": "london-zurich",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "tmt",
    "type": "event",
    "name": "TMT, the Turkish Resistance Organisation",
    "altNames": [
      "Türk Mukavemet Teşkilatı"
    ],
    "period": [
      "british",
      "since-1960"
    ],
    "start": 1957,
    "end": 1974,
    "summary": "A Turkish Cypriot paramilitary organisation formed to oppose union with Greece and to work for partition (taksim).",
    "claims": [
      {
        "text": "Many Turkish Cypriots feared that union with Greece would force them to leave the island, as had happened to the Muslims of Crete; this fear is called the \"Cretan syndrome\".",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-tmt",
          "wikipedia-intercommunal"
        ]
      },
      {
        "text": "It was founded in Nicosia in November 1957 (sources give the 15th, 23rd or 27th), with Rauf Denktaş among its founders, and at first had about 100 members.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-tmt"
        ]
      },
      {
        "text": "From 1958 Turkey secretly supported it, sending officers who trained Turkish Cypriot fighters.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-tmt",
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "It also used violence against Turkish Cypriots, especially on the left, who did not follow its line.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-emergency",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "TMT's own account is that it acted in response to a real threat to its community, from EOKA and, after 1963, from the Greek Cypriot-run government.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-tmt"
        ]
      }
    ]
  },
  {
    "id": "summer-1958",
    "type": "event",
    "name": "The intercommunal violence of 1958",
    "altNames": [],
    "period": [
      "british"
    ],
    "start": 1958,
    "summary": "The first sustained fighting between Greek and Turkish Cypriots, which began to separate the two communities.",
    "claims": [
      {
        "text": "On 12 June 1958 eight Greek Cypriots from Kondemenos, released by British forces and made to walk home unarmed, were killed by armed Turkish Cypriots near Kioneli; it is considered the first intercommunal massacre.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-intercommunal",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "A bomb in Nicosia on 7 June 1958 was followed by the looting of Greek Cypriot property; in 1984 Rauf Denktaş said on British television that the bomb had been placed by Turkish Cypriots themselves, to create tension.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-intercommunal",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "Between 7 June and 7 August 1958, about 55 Greek Cypriots were killed by Turkish Cypriots and about 59 Turkish Cypriots by Greek Cypriots.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "Members of each community began to leave mixed villages where they were a minority, the beginning of the separation of the two communities.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-intercommunal",
          "wikipedia-cyprus-emergency"
        ]
      }
    ]
  },
  {
    "id": "london-zurich",
    "type": "writing",
    "name": "The London and Zürich Agreements (1959)",
    "altNames": [
      "Συμφωνίες Ζυρίχης–Λονδίνου",
      "Zürih ve Londra Antlaşmaları"
    ],
    "period": [
      "british",
      "since-1960"
    ],
    "start": 1959,
    "summary": "The agreements between Britain, Greece, Turkey and the two communities' leaders that created an independent Cyprus.",
    "claims": [
      {
        "text": "A constitution and the Treaties of Guarantee and of Alliance were agreed at Zürich on 11 February 1959, and the agreement was signed in London on 19 February 1959 by Britain, Greece, Turkey, Archbishop Makarios III and Dr Fazıl Küçük.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "Under the Treaty of Guarantee, Cyprus and the three guarantor powers undertook to prohibit both the union of Cyprus with any other state and the partition of the island.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-london-zurich",
          "wikipedia-treaty-guarantee"
        ]
      },
      {
        "text": "Article IV allowed each guarantor, if joint action proved impossible, \"to take action with the sole aim of re-establishing the state of affairs created by the present Treaty\".",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-treaty-guarantee",
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "Makarios accepted the agreements reluctantly; the Turkish Cypriot leadership welcomed them, and Grivas publicly opposed them.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "Britain kept about 254 square kilometres as two Sovereign Base Areas, at Akrotiri and Dhekelia.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-cyprus-emergency",
          "wikipedia-british-cyprus"
        ]
      }
    ],
    "relations": [
      {
        "id": "constitution-1960",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "makarios-iii",
    "type": "person",
    "name": "Makarios III",
    "altNames": [
      "Μακάριος Γ΄"
    ],
    "period": [
      "british",
      "since-1960"
    ],
    "summary": "Archbishop of Cyprus and the first President of the Republic, the central Greek Cypriot leader from the 1950s to the 1970s.",
    "claims": [
      {
        "text": "He began his life in the church as a monk at Kykkos Monastery in 1926.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-kykkos"
        ]
      },
      {
        "text": "The British authorities came to identify him closely with the EOKA insurgency, and exiled him to the Seychelles after talks with the governor broke down.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-emergency"
        ]
      },
      {
        "text": "He was elected the first President of Cyprus on 13 December 1959.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-cyprus-1878-present"
        ]
      },
      {
        "text": "His proposal of thirteen constitutional amendments in November 1963 was rejected by the Turkish Cypriot leadership, and the crisis that followed ended power-sharing.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-cyprus-problem",
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "Overthrown in the coup of 15 July 1974, he escaped and told the UN Security Council that Cyprus had been invaded by Greece; he returned to office after the coup regime collapsed.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-coup-1974"
        ]
      }
    ]
  },
  {
    "id": "fazil-kucuk",
    "type": "person",
    "name": "Fazıl Küçük",
    "altNames": [],
    "period": [
      "british",
      "since-1960"
    ],
    "summary": "The Turkish Cypriot leader who signed the 1959 agreements and became the first Vice-President of the Republic.",
    "claims": [
      {
        "text": "He signed the London Agreement of February 1959 for the Turkish Cypriots.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "As early as 1954 he proposed dividing Cyprus along the 35th parallel.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-intercommunal"
        ]
      },
      {
        "text": "As Vice-President he had a final veto over laws and over decisions of the Council of Ministers.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "After December 1963 he and the other Turkish Cypriot office holders no longer took part in the government; whether they withdrew or were forced out is disputed.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-cyprus-1878-present",
          "wikipedia-cyprus-problem"
        ]
      }
    ]
  },
  {
    "id": "constitution-1960",
    "type": "writing",
    "name": "The 1960 Constitution",
    "altNames": [
      "Σύνταγμα της Κυπριακής Δημοκρατίας"
    ],
    "period": [
      "since-1960"
    ],
    "start": 1960,
    "summary": "The constitution of the Republic of Cyprus, built around two communities, which stopped working as designed after 1963.",
    "claims": [
      {
        "text": "It came into force on 16 August 1960 and set up a republic of two communities, with a Greek Cypriot President and a Turkish Cypriot Vice-President, both with wide veto powers.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-constitution-1960",
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "Of the ten ministers, three were to be Turkish Cypriots, and 30% of civil service posts were reserved for Turkish Cypriots, who made up about 18% of the population.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-london-zurich",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "Changes to tax, electoral and municipal laws needed separate majorities of both communities' members of the House.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "The UN mediator Galo Plaza called it \"a constitutional oddity\".",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-london-zurich"
        ]
      },
      {
        "text": "Since 1964 the articles on communal autonomy have been suspended in practice under the \"doctrine of necessity\"; the Republic holds that the constitution remains in force.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-constitution-1960",
          "wikipedia-london-zurich"
        ]
      }
    ]
  },
  {
    "id": "december-1963",
    "type": "event",
    "name": "The fighting of December 1963",
    "altNames": [
      "Bloody Christmas"
    ],
    "place": "nicosia",
    "period": [
      "since-1960"
    ],
    "start": 1963,
    "end": 1964,
    "summary": "Fighting between the communities that began in Nicosia on 21 December 1963, ended power-sharing and led to the first dividing line.",
    "claims": [
      {
        "text": "It began on 21 December 1963 in Nicosia, after a shooting during a police identity check, and spread across the island.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-intercommunal",
          "wikipedia-cyprus-problem"
        ]
      },
      {
        "text": "Wikipedia gives 364 Turkish Cypriots and 174 Greek Cypriots killed, and 25,000 Turkish Cypriots forced from their homes.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-problem"
        ]
      },
      {
        "text": "Turkish Cypriots remember the period as \"Bloody Christmas\".",
        "evidence": "tradition",
        "confidence": "strong",
        "sources": [
          "wikipedia-intercommunal"
        ]
      },
      {
        "text": "On 30 December 1963 a British general drew an agreed ceasefire line through Nicosia in green pencil: the first \"Green Line\".",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-buffer-zone"
        ]
      },
      {
        "text": "Turkish Cypriots then lived in enclaves covering little more than 3% of the island, according to the British prime minister in 1964.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-cyprus-1878-present"
        ]
      }
    ],
    "relations": [
      {
        "id": "unficyp",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "unficyp",
    "type": "event",
    "name": "UNFICYP, the UN force in Cyprus",
    "altNames": [
      "United Nations Peacekeeping Force in Cyprus"
    ],
    "place": "nicosia",
    "period": [
      "since-1960"
    ],
    "start": 1964,
    "summary": "One of the UN's longest-running peacekeeping missions, on the island since 1964.",
    "claims": [
      {
        "text": "Security Council Resolution 186 of 1964 recommended a UN force \"to prevent a recurrence of fighting\" and to help restore law and order and \"a return to normal conditions\".",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "un-res-186",
          "un-unficyp"
        ]
      },
      {
        "text": "After 1974 its mandate was extended, and it patrols the buffer zone between the ceasefire lines.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "un-unficyp",
          "wikipedia-unficyp"
        ]
      },
      {
        "text": "The buffer zone runs about 180 km across the island, from a few metres wide in old Nicosia to a few kilometres elsewhere; more than 10,000 people live or work in it.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "unficyp-buffer-zone"
        ]
      },
      {
        "text": "Pyla, inside the buffer zone, is one of the few villages where Greek and Turkish Cypriots still live side by side.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-buffer-zone"
        ]
      }
    ]
  },
  {
    "id": "coup-1974",
    "type": "event",
    "name": "The coup of 15 July 1974",
    "altNames": [],
    "place": "nicosia",
    "period": [
      "since-1960"
    ],
    "start": 1974,
    "summary": "The overthrow of President Makarios by the National Guard, on the orders of the military government of Greece.",
    "claims": [
      {
        "text": "It was ordered by Dimitrios Ioannidis, leader of the Greek junta; Greek officers led the Cypriot National Guard, with EOKA B, to seize the presidential palace in Nicosia.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-coup-1974",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "The coup installed Nikos Sampson, a supporter of union with Greece; its aim was union with Greece.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-coup-1974",
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "Supporters of Makarios were killed or detained; how many died is disputed, because the Republic of Cyprus lists some coup victims among the missing of the Turkish invasion.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-coup-1974"
        ]
      },
      {
        "text": "The United Nations regarded the coup as illegal.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-coup-1974"
        ]
      }
    ],
    "relations": [
      {
        "id": "events-1974",
        "rel": "influenced"
      }
    ]
  },
  {
    "id": "events-1974",
    "type": "event",
    "name": "The Turkish military operation of July and August 1974",
    "altNames": [
      "Turkish invasion of Cyprus",
      "Peace Operation"
    ],
    "period": [
      "since-1960"
    ],
    "start": 1974,
    "summary": "Turkey's landing of troops after the coup, in two phases, which left the north under Turkish and Turkish Cypriot control and the island divided.",
    "claims": [
      {
        "text": "Turkish troops landed on 20 July 1974, five days after the coup; Turkey cited its right under Article IV of the Treaty of Guarantee.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-turkish-invasion",
          "wikipedia-treaty-guarantee"
        ]
      },
      {
        "text": "On the same day the UN Security Council, in Resolution 353, demanded \"an immediate end to foreign military intervention in the Republic of Cyprus\".",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "un-res-353"
        ]
      },
      {
        "text": "The Greek junta and the coup regime collapsed; after peace talks in Geneva failed, Turkey launched a second offensive on 14 August, which it called the \"Second Peace Operation\".",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "The ceasefire lines of 16 August 1974, as recorded by UNFICYP, are the limits of today's buffer zone.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "unficyp-buffer-zone"
        ]
      },
      {
        "text": "Wikipedia records killings of civilians of both communities in the summer of 1974, including Turkish Cypriots killed by EOKA B at Maratha, Santalaris and Aloda and at Tochni, and Greek Cypriots taken prisoner to Turkey, some still missing.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "Around 150,000 Greek Cypriots were displaced from the north, and about 60,000 Turkish Cypriots moved from the south to the north the following year.",
        "evidence": "documentary",
        "confidence": "probable",
        "sources": [
          "wikipedia-turkish-invasion"
        ]
      },
      {
        "text": "Greek Cypriots and most of the international community regard the result as an occupation; Turkish Cypriots and Turkey regard the operation as lawful under the Treaty of Guarantee.",
        "evidence": "debate",
        "confidence": "debated",
        "sources": [
          "wikipedia-turkish-invasion",
          "wikipedia-treaty-guarantee",
          "wikipedia-northern-cyprus"
        ]
      }
    ],
    "relations": []
  },
  {
    "id": "missing-persons",
    "type": "event",
    "name": "The missing persons of 1963 to 1974",
    "altNames": [
      "Committee on Missing Persons"
    ],
    "period": [
      "since-1960"
    ],
    "summary": "People of both communities who disappeared in the fighting, and the bicommunal committee that searches for them.",
    "claims": [
      {
        "text": "The Committee on Missing Persons works to recover, identify and return to their families the remains of 2,002 people: 1,510 Greek Cypriots and 492 Turkish Cypriots.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "cmp-cyprus"
        ]
      },
      {
        "text": "They went missing during the intercommunal fighting of 1963 to 1964 and the events of 1974.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "cmp-cyprus"
        ]
      }
    ]
  },
  {
    "id": "trnc-declaration",
    "type": "event",
    "name": "The declaration of 15 November 1983",
    "altNames": [
      "Kuzey Kıbrıs Türk Cumhuriyeti",
      "Turkish Republic of Northern Cyprus"
    ],
    "period": [
      "since-1960"
    ],
    "start": 1983,
    "summary": "The Turkish Cypriot declaration of an independent state in the north, recognised only by Turkey.",
    "claims": [
      {
        "text": "On 15 November 1983 the Turkish Cypriot authorities declared the \"Turkish Republic of Northern Cyprus\".",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "un-res-541",
          "wikipedia-treaty-guarantee"
        ]
      },
      {
        "text": "Security Council Resolution 541, adopted on 18 November 1983 by 13 votes to 1, with 1 abstention, considered the declaration \"legally invalid\" and called upon all states \"not to recognise any Cypriot state other than the Republic of Cyprus\".",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "un-res-541"
        ]
      },
      {
        "text": "The Council of the European Communities later argued, in a case brought by Greece, that the resolution was a recommendation rather than a binding decision.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-unscr-541"
        ]
      },
      {
        "text": "Only Turkey recognises it; the international community considers its territory part of the Republic of Cyprus under Turkish military occupation.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-northern-cyprus"
        ]
      },
      {
        "text": "It has its own elections and government; because of its lack of recognition, it depends on Turkey economically, politically and militarily.",
        "evidence": "documentary",
        "confidence": "strong",
        "sources": [
          "wikipedia-northern-cyprus"
        ]
      }
    ]
  },
  {
    "id": "annan-plan",
    "type": "event",
    "name": "The Annan Plan referendums (2004)",
    "altNames": [],
    "period": [
      "since-1960"
    ],
    "start": 2004,
    "summary": "A UN plan to reunite Cyprus as a federation of two states, put to both communities in separate votes on the same day.",
    "claims": [
      {
        "text": "Named after the UN Secretary-General Kofi Annan, it proposed a \"United Republic of Cyprus\": a federation of a Greek Cypriot state and a Turkish Cypriot state.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-annan-plan"
        ]
      },
      {
        "text": "It would have had a six-member Presidential Council, a Senate split equally between the communities, and a lower house divided by population.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-annan-plan"
        ]
      },
      {
        "text": "In the separate referendums of 24 April 2004, 64.91% of Turkish Cypriots voted for it and 75.38% of Greek Cypriots against, on turnouts of 87% and 89.18%.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "wikipedia-annan-plan"
        ]
      },
      {
        "text": "A week later, on 1 May 2004, Cyprus joined the European Union; EU law is suspended in areas where the government of the Republic does not exercise effective control.",
        "evidence": "documentary",
        "confidence": "established",
        "sources": [
          "eu-cyprus",
          "wikipedia-cyprus-1878-present"
        ]
      }
    ]
  }
];
