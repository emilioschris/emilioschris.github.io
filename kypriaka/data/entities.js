/* =========================================================
   KYPRIAKA · entities: people, places, objects, events,
   myths and cults, thinkers and faiths
   ---------------------------------------------------------
   Layers excavated so far: Late Cypriot (c. 1650–1150 BC).
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
      "bronze-iron-transition"
    ],
    "summary": "A Bronze Age town with walls and temples, beneath modern Larnaka.",
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
      "late-cypriot"
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
];
