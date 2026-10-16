/* =========================================================
   ΣΠΙΤΙ (SPITI) · words and rooms
   ---------------------------------------------------------
   σπίτι (spíti) = house, home. Every object in a room is one entry.

   The house is real: the mansion of Hadjigeorgakis Kornesios in
   old Nicosia, built in 1793 and today the Cyprus Ethnological
   Museum (Wikipedia, "Hadjigeorgakis Kornesios Mansion",
   revision 1363279025). The rooms are photographs from Wikimedia
   Commons, cropped to 16:10 (credits in each room's photo field).

   Each room has:
     id, el, en  The room's id and its name in Greek and English.
     photo       { src, author, date, licence, licenceUrl, page }
     about       One sourced line about the room.
     objects     The things to find (below).

   Each object has:
     id        Never change it: progress is saved by id.
     el        The Greek word WITH its article (ο, η, το).
     gender    "m" (ο), "f" (η) or "n" (το).
     tr        Transliteration, with the stressed vowel marked.
     en        English meaning.
     note      A short note: what you can see in the photo.
     box       The clickable area, as a percentage of the photo:
               { x, y, w, h } (from the top left).
     checked   Where the word and gender were checked.
   ========================================================= */

window.SPITI = window.SPITI || {};

SPITI.house = {
  name: "The mansion of Hadjigeorgakis Kornesios, Nicosia",
  about: "Built in 1793 for Hadjigeorgakis Kornesios, the dragoman (official interpreter) of Cyprus, in local sandstone; today the Cyprus Ethnological Museum.",
  source: { label: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?title=Hadjigeorgakis_Kornesios_Mansion&oldid=1363279025" },
};

SPITI.rooms = [
  {
    id: "sala",
    el: "η σάλα",
    en: "The hall",
    photo: { src: "rooms/sala.webp", author: "AncientNicosia", date: "2011",
      licence: "CC BY-SA 3.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      page: "https://commons.wikimedia.org/wiki/File:Hadjigeorgakis_Kornesios_Cypriot_Mansion_living_room_hall.jpg" },
    about: "Upstairs, the reception rooms all open off a central hall (Wikipedia).",
    objects: [
      { id: "curtain", el: "η κουρτίνα", gender: "f", tr: "i kourtína", en: "curtain",
        note: "Gold curtains, drawn back from the tall windows.",
        box: { x: 0, y: 10, w: 11, h: 84 }, checked: "Wiktionary: κουρτίνα (f)" },
      { id: "chandelier", el: "ο πολυέλαιος", gender: "m", tr: "o polyéleos", en: "chandelier",
        note: "Glass drops hang from a slim brass chandelier.",
        box: { x: 58.5, y: 0, w: 11, h: 15 }, checked: "Wiktionary: πολυέλαιος (m)" },
      { id: "arch", el: "η καμάρα", gender: "f", tr: "i kamára", en: "arch",
        note: "Great whitewashed arches carry the wooden ceiling across the hall.",
        box: { x: 43, y: 3, w: 8, h: 57 }, checked: "Wiktionary: καμάρα (f), sense: arch" },
      { id: "painting", el: "ο πίνακας", gender: "m", tr: "o pínakas", en: "picture",
        note: "A framed picture on the whitewashed wall.",
        box: { x: 36, y: 36, w: 4.5, h: 9.5 }, checked: "Wiktionary: πίνακας (m), sense: painting" },
      { id: "wardrobe", el: "η ντουλάπα", gender: "f", tr: "i ntoulápa", en: "wardrobe",
        note: "A tall wooden wardrobe with carved, painted doors.",
        box: { x: 58.5, y: 29.5, w: 10, h: 29 }, checked: "Wiktionary: ντουλάπα (f)" },
      { id: "door", el: "η πόρτα", gender: "f", tr: "i pórta", en: "door",
        note: "Painted deep blue, in a grey stone frame.",
        box: { x: 71.5, y: 32, w: 6, h: 28 }, checked: "Wiktionary: πόρτα (f)" },
      { id: "table", el: "το τραπέζι", gender: "n", tr: "to trapézi", en: "table",
        note: "A round table of dark polished wood.",
        box: { x: 55, y: 60, w: 9, h: 10 }, checked: "Wiktionary: τραπέζι (n)" },
      { id: "armchair", el: "η πολυθρόνα", gender: "f", tr: "i polythróna", en: "armchair",
        note: "One of a set, upholstered in gold.",
        box: { x: 64.5, y: 63, w: 13.5, h: 25 }, checked: "Wiktionary: πολυθρόνα (f)" },
      { id: "sofa", el: "ο καναπές", gender: "m", tr: "o kanapés", en: "sofa",
        note: "A settee to match the armchairs.",
        box: { x: 78, y: 57, w: 7, h: 20 }, checked: "Wiktionary: καναπές (m), sofa, couch, settee" },
      { id: "chair", el: "η καρέκλα", gender: "f", tr: "i karékla", en: "chair",
        note: "A bentwood chair, the kind made famous by Thonet in Vienna.",
        box: { x: 30.5, y: 48, w: 5, h: 12.5 }, checked: "Wiktionary: καρέκλα (f)" },
      { id: "rug", el: "το χαλί", gender: "n", tr: "to chalí", en: "rug",
        note: "A red patterned carpet, laid over the stone.",
        box: { x: 60, y: 87, w: 22, h: 12 }, checked: "Wiktionary: χαλί (n)" },
      { id: "floor", el: "το πάτωμα", gender: "n", tr: "to pátoma", en: "floor",
        note: "Big slabs of pale stone, worn smooth.",
        box: { x: 12, y: 68, w: 22, h: 28 }, checked: "Wiktionary: πάτωμα (n)" },
    ],
  },
  {
    id: "ontas",
    el: "ο οντάς",
    en: "The reception room",
    photo: { src: "rooms/ontas.webp", author: "Hermann Junghans", date: "2016",
      licence: "CC BY-SA 3.0 DE", licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
      page: "https://commons.wikimedia.org/wiki/File:Diwan_Kornessios.JPG" },
    about: "The official reception room, the onda, stands out for its carved, gilded and painted wood (Wikipedia).",
    objects: [
      { id: "minteri", el: "το μιντέρι", gender: "n", tr: "to mintéri", en: "low divan",
        note: "The low sofa that runs round the walls of an οντάς, in a Π shape. From Turkish minder.",
        box: { x: 66, y: 73, w: 22, h: 9 }, checked: "Greek Wiktionary: μιντέρι (n)" },
      { id: "cushion", el: "το μαξιλάρι", gender: "n", tr: "to maxilári", en: "cushion",
        note: "Gold, blue and rose cushions lean along the walls. The same word means pillow.",
        box: { x: 70, y: 64, w: 7, h: 8 }, checked: "Wiktionary: μαξιλάρι (n), pillow; cushion" },
      { id: "portrait", el: "το πορτρέτο", gender: "n", tr: "to portréto", en: "portrait",
        note: "Portraits in dark frames hang high on the painted walls.",
        box: { x: 22, y: 13, w: 9, h: 17.5 }, checked: "Wiktionary: πορτρέτο (n)" },
      { id: "brazier", el: "το μαγκάλι", gender: "n", tr: "to mangáli", en: "brazier",
        note: "A metal pot for burning charcoal to warm a room. From Turkish mangal.",
        box: { x: 28, y: 72, w: 8.5, h: 13 }, checked: "Greek Wiktionary: μαγκάλι (n)" },
      { id: "hookah", el: "ο ναργιλές", gender: "m", tr: "o nargilés", en: "hookah",
        note: "A tall water pipe, standing on the carpet.",
        box: { x: 51, y: 67, w: 3.5, h: 15 }, checked: "Wiktionary: ναργιλές (m)" },
      { id: "coffeetable", el: "το τραπεζάκι", gender: "n", tr: "to trapezáki", en: "little table",
        note: "A low table with a round metal tray for a top. The word means \"little table\".",
        box: { x: 56.5, y: 72, w: 7.5, h: 12 }, checked: "Wiktionary: τραπεζάκι (n), diminutive of τραπέζι; coffee table" },
      { id: "kilim", el: "το κιλίμι", gender: "n", tr: "to kilími", en: "kilim",
        note: "A handmade rug woven flat on a loom, here in stripes of red and blue.",
        box: { x: 30, y: 87, w: 28, h: 12 }, checked: "Greek Wiktionary: κιλίμι (n)" },
      { id: "ceiling", el: "το ταβάνι", gender: "n", tr: "to taváni", en: "ceiling",
        note: "Carved and painted wood, edged in gold.",
        box: { x: 20, y: 0, w: 50, h: 7 }, checked: "Wiktionary: ταβάνι (n)" },
      { id: "window", el: "το παράθυρο", gender: "n", tr: "to paráthyro", en: "window",
        note: "Tall windows all along the room let in the Nicosia light.",
        box: { x: 25.5, y: 40, w: 6, h: 21 }, checked: "Wiktionary: παράθυρο (n)" },
    ],
  },
  {
    id: "bedroom",
    el: "η κρεβατοκάμαρα",
    en: "The bedroom",
    photo: { src: "rooms/bedroom.webp", author: "Hermann Junghans", date: "2016",
      licence: "CC BY-SA 3.0 DE", licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
      page: "https://commons.wikimedia.org/wiki/File:Schlafzimmer_Kornessios.JPG" },
    about: "Κρεβατοκάμαρα is κρεβάτι (bed) + κάμαρα (room).",
    objects: [
      { id: "bed", el: "το κρεβάτι", gender: "n", tr: "to kreváti", en: "bed",
        note: "An iron bedstead, dressed in white cotton.",
        box: { x: 45, y: 76, w: 18, h: 15 }, checked: "Wiktionary: κρεβάτι (n)" },
      { id: "lamp", el: "η λάμπα", gender: "f", tr: "i lámpa", en: "lamp",
        note: "A tall lamp with a frosted glass shade.",
        box: { x: 5, y: 57, w: 6.5, h: 21 }, checked: "Wiktionary: λάμπα (f), lamp, electric or oil" },
      { id: "rocker", el: "η κουνιστή καρέκλα", gender: "f", tr: "i kounistí karékla", en: "rocking chair",
        note: "Κουνιστός means \"that can rock\", from κουνάω, to move or rock.",
        box: { x: 18, y: 72, w: 14, h: 25 }, checked: "Greek Wiktionary: κουνιστός (adj); Wiktionary: καρέκλα (f)" },
      { id: "drawers", el: "η συρταριέρα", gender: "f", tr: "i syrtariéra", en: "chest of drawers",
        note: "From συρτάρι, a drawer.",
        box: { x: 0, y: 86, w: 18, h: 14 }, checked: "Wiktionary: συρταριέρα (f)" },
      { id: "lace", el: "η δαντέλα", gender: "f", tr: "i dantéla", en: "lace",
        note: "A lace mat under the lamp. Lace is a Cypriot craft: Lefkara lace is on UNESCO's list of intangible heritage.",
        box: { x: 11.5, y: 78, w: 4.5, h: 7 }, checked: "Greek Wiktionary: δαντέλα (f)" },
      { id: "beam", el: "το δοκάρι", gender: "n", tr: "to dokári", en: "beam",
        note: "Heavy wooden beams cross the ceiling.",
        box: { x: 42, y: 0, w: 8, h: 19 }, checked: "Wiktionary: δοκάρι (n)" },
      { id: "wall", el: "ο τοίχος", gender: "m", tr: "o toíchos", en: "wall",
        note: "Painted a warm earth red.",
        box: { x: 22, y: 10, w: 15, h: 25 }, checked: "Wiktionary: τοίχος (m)" },
      { id: "frame", el: "η κορνίζα", gender: "f", tr: "i korníza", en: "picture frame",
        note: "A plain frame above the bed. Κορνίζα also means a cornice.",
        box: { x: 52, y: 28, w: 7.5, h: 8 }, checked: "Wiktionary: κορνίζα (f), picture frame; cornice" },
      { id: "nightstand", el: "το κομοδίνο", gender: "n", tr: "to komodíno", en: "bedside table",
        note: "A small wooden table between the beds.",
        box: { x: 58, y: 70.5, w: 7, h: 8 }, checked: "Wiktionary: κομοδίνο (n)" },
    ],
  },
];

/* Rooms still to come */
SPITI.comingSoon = [
  { el: "η κουζίνα", en: "The kitchen" },
  { el: "η αυλή", en: "The courtyard" },
];
