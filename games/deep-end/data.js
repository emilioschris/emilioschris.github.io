/* =========================================================
   THE DEEP END · prompts and answers
   ---------------------------------------------------------
   Each prompt has:
     id       Never change it once people have played (daily
              results are saved by id).
     prompt   What the player sees: "Name a cheese".
     survey   The matching question in the friend survey.
     tiers    Six lists of accepted answers, from the most
              obvious to the rarest:
                0 Surface        10 points
                1 Too Clever     15 points
                2 The Reef       30 points
                3 Twilight Zone  60 points
                4 The Abyss      85 points
              Answers are separated by ";". Other ways of saying
              the same answer go after a "|":
                "Parmesan|Parmigiano Reggiano|Parmigiano"
     wreck    The one hidden answer worth 100 points (tier 5).
              Aliases work here too.
     options  Optional matching help:
                surnames: true   "Monet" also accepts "Claude Monet"
                                 and the other way round
                sequels: true    "Toy Story 3" counts as "Toy Story"
                suffix: true     a longer name ending in an answer counts
                                 as that answer ("bald eagle" is Eagle)
     nope     Optional answers that are close but don't count,
              with the reason shown: { answers: "…;…", why: "…" }
     flags    Things still to check, for Emilios.

   Rarity tiers here are WORLD rarity: Claude's best guess at how
   often people in general would give each answer. They are a
   judgement, not measured data. Friend counts from the survey
   come later (survey.js, made by tools/import-survey.js) and
   move answers your friends gave toward the Surface.

   Matching ignores capitals, accents, extra spaces, "the" at
   the start, and plurals; a one-letter typo is forgiven on
   longer words if it can't be mistaken for another answer.
   ========================================================= */

window.DEEP = window.DEEP || {};

DEEP.tiers = [
  { name: "Surface",       points: 10,  air: 8,  emoji: "🫧" },
  { name: "Too Clever",    points: 15,  air: 9,  emoji: "🐟" },
  { name: "The Reef",      points: 30,  air: 10, emoji: "🐠" },
  { name: "Twilight Zone", points: 60,  air: 12, emoji: "🦑" },
  { name: "The Abyss",     points: 85,  air: 14, emoji: "🐙" },
  { name: "The Wreck",     points: 100, air: 16, emoji: "⚓" },
];
DEEP.missEmoji = "▪️";
DEEP.depthPerPoint = 4;   // depth in metres = points × 4

DEEP.prompts = [
  {
    id: "cheese", prompt: "Name a cheese", survey: "A cheese",
    options: { suffix: true },
    tiers: [
      "Cheddar; Mozzarella; Brie; Parmesan|Parmigiano Reggiano|Parmigiano; Feta; Halloumi|Hellim|Haloumi|Halumi; Gouda; Camembert",
      "Stilton; Gorgonzola; Roquefort; Manchego; Emmental|Emmentaler|Emmenthal; Gruyère; Ricotta; Mascarpone; Edam; Burrata; Swiss cheese|Swiss; Goat cheese|Goats cheese|Chèvre|Chevre; Blue cheese",
      "Pecorino|Pecorino Romano; Comté; Wensleydale; Red Leicester; Double Gloucester; Jarlsberg; Provolone; Monterey Jack|Jack; Colby; Paneer; Cottage cheese; Cream cheese; Havarti; Kefalotyri|Kefalotiri; Kasseri; Anari; Manouri; Taleggio; Fontina; Asiago; Raclette; Reblochon; Port Salut; Boursin; Babybel; Leerdammer; Pepper Jack; Queso fresco; Lancashire; Caerphilly; Cheshire; Danish blue; Grana Padano; Stracciatella; American cheese|American; Halloumi cheese",
      "Graviera; Mizithra|Myzithra; Kefalograviera; Ladotyri; Époisses|Epoisses; Munster|Muenster; Saint-Nectaire|St Nectaire; Pont-l'Évêque|Pont l'Eveque; Morbier; Tomme|Tomme de Savoie; Cantal; Beaufort; Appenzeller; Tilsit|Tilsiter; Limburger; Scamorza; Caciocavallo; Stinking Bishop; Cornish Yarg|Yarg; Shropshire Blue; Cotija; Oaxaca; Labneh; Akkawi; Brunost|Gjetost|Brown cheese; Cashel Blue; Dubliner; Saint Agur; Fourme d'Ambert; Bleu d'Auvergne",
      "Casu marzu; Vacherin|Vacherin Mont d'Or|Mont d'Or; Livarot; Torta del Casar; Idiazabal; Mahón|Mahon; Cabrales; Herve; Nøkkelost|Nokkelost; Sbrinz; Bryndza; Oscypek; Formaggio di fossa; Ossau-Iraty; Banon; Langres; Maroilles; Salers; Bitto; Castelmagno; Pule; Xynomyzithra; San Simón|San Simon; Tête de Moine|Tete de Moine",
    ],
    wreck: "Mimolette",
    flags: ["Brand names (Boursin, Babybel, Leerdammer) are accepted as The Reef. Change this if you'd rather not allow brands."],
  },
  {
    id: "country-outside-europe", prompt: "Name a country outside Europe", survey: "A country outside Europe",
    tiers: [
      "United States|USA|US|America|United States of America|The States; China; Japan; Australia; Canada; Brazil; India; Mexico; Egypt",
      "Argentina; South Africa; New Zealand; Thailand; South Korea|Korea; Morocco; Peru; Kenya; Chile; Colombia; Vietnam; Turkey|Türkiye|Turkiye; Israel; Nigeria; Indonesia",
      "Cuba; Jamaica; Philippines; Malaysia; Singapore; Saudi Arabia; United Arab Emirates|UAE|Emirates; Iran; Iraq; Pakistan; Afghanistan; Lebanon; Jordan; Syria; North Korea; Ethiopia; Ghana; Tanzania; Uganda; Venezuela; Ecuador; Bolivia; Uruguay; Paraguay; Nepal; Sri Lanka; Bangladesh; Mongolia; Cambodia; Madagascar; Tunisia; Algeria; Libya; Sudan; Somalia; Zimbabwe; Zambia; Botswana; Namibia; Rwanda; Senegal; Cyprus; Qatar; Kuwait; Oman; Yemen; Fiji; Costa Rica; Panama; Guatemala; Honduras; Nicaragua; El Salvador; Haiti; Dominican Republic; Bahamas; Barbados; Taiwan; Palestine; Myanmar|Burma; Laos; Kazakhstan; Georgia; Armenia; Azerbaijan; Maldives; Mauritius; Seychelles; Bahrain; Bhutan; Mozambique; Angola; Cameroon",
      "Uzbekistan; Kyrgyzstan; Tajikistan; Turkmenistan; Papua New Guinea; Samoa; Tonga; Brunei; Ivory Coast|Côte d'Ivoire|Cote d'Ivoire; Mali; Niger; Chad; Democratic Republic of the Congo|DR Congo|DRC|Democratic Republic of Congo|Congo Kinshasa; Republic of the Congo|Congo|Republic of Congo|Congo Brazzaville; Trinidad and Tobago|Trinidad; Belize; Guyana; Suriname; Timor-Leste|East Timor; Malawi; Lesotho; Eswatini|Swaziland; Gabon; Guinea; Liberia; Sierra Leone; Gambia; Burkina Faso; Benin; Togo; Eritrea; Djibouti; South Sudan; Mauritania; Central African Republic|CAR; Equatorial Guinea; Cape Verde|Cabo Verde; Burundi; Grenada; Saint Lucia|St Lucia",
      "Guinea-Bissau; Comoros; Vanuatu; Solomon Islands; Kiribati; Tuvalu; Nauru; Palau; Marshall Islands; Micronesia|Federated States of Micronesia; Dominica; Antigua and Barbuda|Antigua; Saint Kitts and Nevis|St Kitts and Nevis|St Kitts; Saint Vincent and the Grenadines|St Vincent and the Grenadines|St Vincent",
    ],
    wreck: "São Tomé and Príncipe|Sao Tome and Principe|Sao Tome",
    nope: {
      answers: "Russia; France; Germany; Italy; Spain; Portugal; Greece; United Kingdom|UK|Britain|Great Britain|England|Scotland|Wales|Northern Ireland; Ireland; Netherlands|Holland; Belgium; Switzerland; Austria; Sweden; Norway; Denmark; Finland; Iceland; Poland; Ukraine; Czechia|Czech Republic; Hungary; Romania; Bulgaria; Serbia; Croatia; Albania; Malta; Monaco; Luxembourg",
      why: "That one's in Europe.",
    },
    flags: [
      "Which countries count as \"in Europe\" follows the UN's M49 regions. That rules out Russia but allows Turkey, Georgia, Armenia, Azerbaijan, Kazakhstan and Cyprus (the UN puts Cyprus in Western Asia, even though it's in the EU). Your friends may want to argue about Cyprus!",
      "Taiwan and Palestine aren't UN members but are accepted.",
      "\"Congo\" on its own is read as the Republic of the Congo.",
    ],
  },
  {
    id: "dog-breed", prompt: "Name a dog breed", survey: "A dog breed",
    options: { suffix: true },
    tiers: [
      "Labrador|Labrador Retriever|Lab; Golden Retriever|Golden; German Shepherd|Alsatian; Poodle; Bulldog|English Bulldog|British Bulldog; Beagle; Chihuahua; Husky|Siberian Husky",
      "French Bulldog|Frenchie; Dachshund|Sausage dog|Wiener dog; Pug; Rottweiler; Border Collie; Dalmatian; Great Dane; Cocker Spaniel; Corgi|Welsh Corgi|Pembroke Welsh Corgi; Shih Tzu; Yorkshire Terrier|Yorkie; Boxer; Dobermann|Doberman|Doberman Pinscher; Pomeranian",
      "Jack Russell|Jack Russell Terrier; Springer Spaniel|English Springer Spaniel; Staffordshire Bull Terrier|Staffy|Staffie; Bichon Frise|Bichon; Cavalier King Charles Spaniel|Cavalier|King Charles Spaniel; Maltese; Samoyed; Akita; Shiba Inu|Shiba; Saint Bernard|St Bernard; Bernese Mountain Dog|Bernese; Newfoundland; Greyhound; Whippet; Basset Hound|Basset; Bloodhound; Rough Collie|Collie; Shetland Sheepdog|Sheltie; Australian Shepherd|Aussie; Weimaraner; Vizsla; Pointer; Irish Setter|Red Setter; Schnauzer|Miniature Schnauzer; West Highland Terrier|Westie|West Highland White Terrier; Scottish Terrier|Scottie; Bull Terrier; Pit Bull|Pitbull|American Pit Bull Terrier; Chow Chow|Chow; Shar Pei; Lhasa Apso; Pekingese; Papillon; Afghan Hound; Alaskan Malamute|Malamute; Mastiff; Cane Corso; Rhodesian Ridgeback; Labradoodle; Cockapoo; Boston Terrier; Airedale|Airedale Terrier; Old English Sheepdog; Irish Wolfhound; Basenji; Belgian Malinois|Malinois; Australian Cattle Dog|Blue Heeler|Heeler",
      "Borzoi; Saluki; Bedlington Terrier; Dandie Dinmont Terrier; Cairn Terrier; Norfolk Terrier; Norwich Terrier; Border Terrier; Lakeland Terrier; Welsh Terrier; Kerry Blue Terrier; Wheaten Terrier|Soft-coated Wheaten Terrier; Leonberger; Great Pyrenees|Pyrenean Mountain Dog; Anatolian Shepherd|Kangal; Komondor; Puli; Kuvasz; Keeshond; Schipperke; Brittany|Brittany Spaniel; Clumber Spaniel; Sussex Spaniel; Irish Water Spaniel; Portuguese Water Dog; Chinese Crested; Xoloitzcuintli|Xolo|Mexican Hairless Dog; Italian Greyhound; Pharaoh Hound; Ibizan Hound; Affenpinscher; Brussels Griffon|Griffon Bruxellois; Coton de Tulear; Havanese; Japanese Chin; Tibetan Mastiff; Tibetan Terrier; Bouvier des Flandres|Bouvier; Briard; Bearded Collie; Finnish Spitz; Dogue de Bordeaux; Neapolitan Mastiff; Bullmastiff; Chesapeake Bay Retriever; Flat-coated Retriever; Nova Scotia Duck Tolling Retriever|Toller; German Shorthaired Pointer; Gordon Setter; English Setter; Coonhound; Catahoula|Catahoula Leopard Dog; Kelpie|Australian Kelpie; Lagotto Romagnolo|Lagotto; Spinone|Italian Spinone; Kooikerhondje; Jindo|Korean Jindo; Azawakh; Sloughi",
      "Otterhound; Mudi; Peruvian Inca Orchid; Chinook; Glen of Imaal Terrier; Sealyham Terrier; Skye Terrier; Cesky Terrier; Lancashire Heeler; Swedish Vallhund; Icelandic Sheepdog; Karelian Bear Dog; Hovawart; Eurasier; Pumi; Cretan Hound|Kritikos Lagonikos; Hellenic Hound|Hellenic Scent Hound; Bergamasco; Cirneco dell'Etna|Cirneco; Stabyhoun; Shikoku; Kai Ken|Kai; Thai Ridgeback; Catalburun",
    ],
    wreck: "Norwegian Lundehund|Lundehund",
    flags: ["Crossbreeds (Labradoodle, Cockapoo) are accepted as The Reef, though kennel clubs don't list them as breeds. Pit Bull is accepted as the American Pit Bull Terrier."],
  },
  {
    id: "pasta-shape", prompt: "Name a pasta shape", survey: "A pasta shape",
    tiers: [
      "Spaghetti; Penne; Fusilli; Macaroni; Lasagne|Lasagna; Farfalle|Bow ties|Bowtie|Bow tie",
      "Tagliatelle; Linguine; Rigatoni; Fettuccine|Fettucine|Fettuccini; Ravioli; Tortellini; Conchiglie|Shells; Orzo|Risoni|Kritharaki; Pappardelle; Gnocchi",
      "Cannelloni; Orecchiette; Ziti; Vermicelli; Capellini|Angel hair; Bucatini; Tortiglioni; Paccheri; Cavatappi; Gemelli; Rotini; Ditalini; Tortelloni; Agnolotti; Stelline|Stars; Manicotti; Campanelle; Radiatori; Trofie; Cavatelli; Spaghettini; Casarecce; Strozzapreti; Conchiglioni; Lumaconi; Mafaldine|Mafalde|Reginette; Anelli|Anelletti; Fregola|Fregula; Hilopites|Chilopites; Pastina; Acini di pepe",
      "Garganelli; Pici; Malloreddus; Bigoli; Busiate; Calamarata; Lumache; Maltagliati; Mezze maniche; Fideo|Fideos; Gramigna; Cappelletti; Scialatielli; Tajarin; Pizzoccheri; Strangozzi; Lagane; Fileja; Sagne; Testaroli; Culurgiones",
      "Corzetti|Croxetti; Sorpresine; Lorighittas; Fazzoletti; Umbricelli; Andarinos; Foglie d'ulivo; Ricciolini; Lanterne; Cencioni; Capunti; Tripoline",
    ],
    wreck: "Su filindeu|Filindeu",
    flags: [
      "Gnocchi are dumplings rather than pasta, but they're accepted as Too Clever.",
      "Su filindeu (\"the threads of God\") is a Sardinian pasta made by hand by very few people.",
    ],
  },
  {
    id: "fruit", prompt: "Name a fruit", survey: "A fruit",
    options: { suffix: true },
    tiers: [
      "Apple; Banana; Orange; Strawberry; Grape; Mango; Pineapple; Watermelon",
      "Kiwi|Kiwifruit|Kiwi fruit; Pear; Peach; Cherry; Lemon; Blueberry; Raspberry; Pomegranate; Coconut; Plum; Fig; Melon; Tomato; Avocado; Olive; Cucumber; Pumpkin; Aubergine|Eggplant; Pepper|Bell pepper; Chilli|Chili",
      "Apricot; Nectarine; Grapefruit; Lime; Blackberry; Cranberry; Gooseberry; Blackcurrant|Black currant; Redcurrant|Red currant; Date; Guava; Persimmon|Sharon fruit|Kaki; Quince; Clementine; Mandarin|Tangerine|Satsuma; Kumquat; Starfruit|Carambola; Jackfruit; Durian; Rambutan; Mangosteen; Cantaloupe; Honeydew|Honeydew melon; Papaya|Pawpaw|Paw paw; Passion fruit|Passionfruit; Lychee|Litchi|Lichee; Dragon fruit|Pitaya|Pitahaya",
      "Loquat|Mespila|Mousmoula; Prickly pear|Cactus fruit|Papoutsosyko|Babutsa; Carob; Mulberry; Elderberry; Sloe; Damson; Greengage; Medlar; Tamarind; Soursop|Guanabana; Cherimoya|Custard apple; Feijoa; Physalis|Cape gooseberry; Lingonberry; Cloudberry; Boysenberry; Loganberry; Salak|Snake fruit; Longan; Ackee; Breadfruit; Yuzu; Bergamot; Citron; Pomelo; Ugli fruit; Blood orange; Huckleberry; Bilberry; Jujube; Sapodilla; Rosehip|Rose hip; Buddha's hand",
      "Mamey sapote|Mamey; Santol; Cupuaçu|Cupuacu; Lucuma; Hala fruit; Kiwano|Horned melon; Akebia; Wood apple; Bael; Langsat; Marula; Baobab|Baobab fruit; Pequi; Naranjilla|Lulo; Black sapote|Chocolate pudding fruit; Ice cream bean; Atemoya; Gac; Jabuticaba; Pitanga|Surinam cherry",
    ],
    wreck: "Miracle fruit|Miracle berry",
    flags: ["Botanical fruits that people call vegetables (tomato, avocado, olive, cucumber, pumpkin, aubergine, pepper, chilli) are accepted as Too Clever: right, but the smart-answer everyone thinks of."],
  },
  {
    id: "board-game", prompt: "Name a board game", survey: "A board game",
    tiers: [
      "Monopoly; Chess; Scrabble; Cluedo|Clue; Snakes and Ladders|Chutes and Ladders; Checkers|Draughts; Backgammon|Tavli|Tavla; Risk",
      "Catan|Settlers of Catan; Ticket to Ride; Trivial Pursuit; Battleship|Battleships; Connect Four|Connect 4; Mouse Trap|Mousetrap; Guess Who; Operation; Pictionary; The Game of Life|Game of Life|Life; Sorry; Ludo|Parcheesi|Pachisi; Go",
      "Carcassonne; Pandemic; Codenames; Stratego; Othello|Reversi; Mancala|Oware; Chinese Checkers; Mastermind; Hungry Hippos|Hungry Hungry Hippos; Rummikub; Azul; Splendor; Dixit; 7 Wonders|Seven Wonders; Wingspan; Terraforming Mars; Cranium; Balderdash; Articulate; Trouble|Frustration; Kingdomino; Diplomacy; Axis and Allies; Mahjong|Mahjongg; Shogi; Xiangqi|Chinese chess; Candy Land|Candyland; Small World; King of Tokyo; Blokus; Downfall; Labyrinth; Boggle",
      "Twilight Imperium; Agricola; Power Grid; Puerto Rico; Terra Mystica; Brass; Scythe; Root; Spirit Island; Everdell; Cascadia; Patchwork; Hive; Quoridor; Santorini; Takenoko; Mysterium; Betrayal at House on the Hill; Arkham Horror; Eldritch Horror; HeroQuest; Hotel|Hotels; Dune; Fireball Island; Gloomhaven; Nine Men's Morris|Mill; Halma; Carrom; Pay Day; Escape from Colditz; Acquire",
      "Senet; Royal Game of Ur|Game of Ur; Hnefatafl|Tafl; Fanorona; Pente; Hex; Twixt; Tak; Yinsh; Gipf; Bao; Konane; Alquerque; Surakarta; Abalone; Quarto; Onitama; Tigris and Euphrates; El Grande; Through the Ages",
    ],
    wreck: "Petteia|Pessoi",
    flags: [
      "Backgammon is Surface here because for Greek and Cypriot players it's tavli, the most obvious game there is.",
      "Card, tile and dice games (Uno, dominoes, Jenga) don't count. Rummikub, Mahjong and Boggle are borderline and accepted.",
      "Petteia was a board game played in ancient Greece; its exact rules are lost.",
    ],
  },
  {
    id: "greek-god", prompt: "Name a Greek god or goddess", survey: "A Greek god or goddess",
    tiers: [
      "Zeus; Poseidon; Athena|Athene; Aphrodite; Hades; Apollo; Hera",
      "Ares; Hermes; Artemis; Dionysus|Dionysos; Demeter; Hephaestus|Hephaistos; Persephone; Eros; Nike; Hestia; Gaia|Gaea|Ge; Cronus|Kronos|Cronos",
      "Pan; Helios; Selene; Eos; Hecate|Hekate; Nemesis; Hypnos; Thanatos; Rhea; Uranus|Ouranos; Iris; Tyche; Asclepius|Asklepios; Hebe; Leto; Morpheus; Nyx; Eris; Atlas; Prometheus; Heracles|Hercules; Triton; Amphitrite; Themis; Oceanus|Okeanos",
      "Mnemosyne; Tethys; Hyperion; Phoebe; Metis; Proteus; Nereus; Boreas; Zephyrus|Zephyr; Notus; Eurus; Aeolus; Priapus; Phobos; Deimos; Enyo; Erebus; Aether; Hemera; Pontus; Tartarus; Ananke; Chronos; Harmonia; Psyche; Ganymede; Chaos; Eileithyia; Peitho; Styx; Kratos; Bia; Hymenaios|Hymen; Plutus|Ploutos",
      "Achlys; Momus; Oizys; Penthus; Arete; Soteria; Hesychia; Euthenia; Pheme; Zelus; Palaemon; Leucothea; Glaucus; Physis; Kairos|Caerus; Geras; Pistis; Elpis; Thalassa; Ichnaea; Enyalius; Eupheme",
    ],
    wreck: "Aergia",
    flags: [
      "Titans (Atlas, Prometheus, Cronus) and deified heroes (Heracles, Psyche, Ganymede) are accepted.",
      "Groups (the Muses, the Fates) aren't accepted as single answers.",
      "Aergia is the goddess of sloth and idleness.",
    ],
  },
  {
    id: "cocktail", prompt: "Name a cocktail", survey: "A cocktail",
    tiers: [
      "Mojito; Margarita; Piña Colada|Pina Colada; Cosmopolitan|Cosmo; Martini; Long Island Iced Tea|Long Island; Sex on the Beach; Aperol Spritz|Spritz",
      "Old Fashioned; Negroni; Espresso Martini; Daiquiri|Strawberry Daiquiri; Bloody Mary; Manhattan; Pornstar Martini|Passion Fruit Martini; Mai Tai; Caipirinha; Tequila Sunrise; Moscow Mule; Whiskey Sour|Whisky Sour; Gin and Tonic|G&T|Gin Tonic; Cuba Libre|Rum and Coke",
      "Mimosa; Bellini; Sangria; Paloma; Dark 'n' Stormy|Dark and Stormy; Tom Collins; White Russian; Black Russian; Screwdriver; Kir Royale|Kir; Bramble; French 75; Sidecar; Gimlet; Mint Julep; Amaretto Sour; Pisco Sour; Singapore Sling; Zombie; Hurricane; Blue Lagoon; Woo Woo; Sea Breeze; Mudslide; Grasshopper; B-52|B52; Irish Coffee; Hugo|Hugo Spritz; Michelada; Caipiroska; Lemon Drop; Appletini|Apple Martini; Kamikaze; Harvey Wallbanger; Lynchburg Lemonade; Pimm's|Pimms|Pimm's Cup",
      "Sazerac; Boulevardier; Rob Roy; Rusty Nail; Godfather; Gibson; Vesper; Americano; Bee's Knees; Clover Club; Corpse Reviver; Aviation; Last Word; Paper Plane; Penicillin; Hanky Panky; Martinez; Brandy Alexander|Alexander; Brandy Sour; Ramos Gin Fizz|Gin Fizz; Jungle Bird; Painkiller; Planter's Punch; El Diablo; Vieux Carré|Vieux Carre; French Martini; Tom and Jerry; Eggnog",
      "Hemingway Daiquiri|Papa Doble; Twentieth Century; Bijou; Jack Rose; Monkey Gland; Blood and Sand; Mary Pickford; Hotel Nacional; Scofflaw; Brooklyn; Saturn; Fog Cutter; Suffering Bastard; Pink Lady; Widow's Kiss; Alaska; Chartreuse Swizzle; Trinidad Sour; Toronto; Remember the Maine",
    ],
    wreck: "Death in the Afternoon",
    flags: [
      "Brandy Sour, Cyprus's national cocktail, is Twilight Zone for the world. Your friends will probably say it often, and the survey will lower it.",
      "Simple mixed drinks (Gin and Tonic, Rum and Coke) are accepted.",
    ],
  },
  {
    id: "car-brand", prompt: "Name a car brand", survey: "A car brand",
    tiers: [
      "Toyota; BMW; Mercedes|Mercedes-Benz|Merc; Ford; Volkswagen|VW; Audi; Ferrari; Honda",
      "Tesla; Porsche; Lamborghini; Nissan; Kia; Hyundai; Fiat; Peugeot; Renault; Volvo; Mazda; Chevrolet|Chevy; Jaguar; Land Rover; Mini; Jeep; Lexus; Subaru; Mitsubishi",
      "Škoda|Skoda; SEAT|Seat; Citroën|Citroen; Opel; Vauxhall; Alfa Romeo; Maserati; Bentley; Rolls-Royce|Rolls Royce; Aston Martin; McLaren; Bugatti; Dacia; Suzuki; Dodge; Cadillac; Chrysler; Buick; GMC; Lincoln; Infiniti; Acura; Genesis; Smart; Cupra; Polestar; BYD; MG; Lotus; Daewoo; Isuzu; Ram; Lancia; Saab; Rover; Range Rover; Daihatsu; Chery; Geely; Lucid; Rivian; Abarth; DS; Alpine; Koenigsegg; Pagani",
      "Morgan; TVR; Caterham; Noble; Ariel; Spyker; Rimac; Lada; Tata; Mahindra; Proton; Perodua; Holden; Hummer; Pontiac; Oldsmobile; Plymouth; Saturn; Mercury; DeLorean|Delorean; Trabant; Wartburg; Zastava|Yugo; Moskvitch; Datsun; Scion; SsangYong|KGM; Great Wall; NIO; XPeng; Li Auto; Zeekr; Hongqi; Lynk & Co|Lynk and Co; VinFast; Togg",
      "Studebaker; Packard; Hudson; Nash; AMC|American Motors; Tucker; Duesenberg; Cord; Auburn; Pierce-Arrow; Panhard; Simca; Talbot; Borgward; NSU; Horch; Maybach; Hillman; Humber; Triumph; Sunbeam; Austin; Morris; Riley; Wolseley; Jensen; Bristol; Gumpert; De Tomaso; Iso; Bizzarrini; Vector; Saleen; Hennessey; Laraki; W Motors; Zenvo",
    ],
    wreck: "Facel Vega",
    flags: ["Range Rover is really a Land Rover model but is accepted as its own answer. Old and defunct brands count."],
  },
  {
    id: "animated-film", prompt: "Name an animated film", survey: "An animated film",
    options: { sequels: true },
    tiers: [
      "Toy Story; Frozen; The Lion King|Lion King; Shrek; Finding Nemo|Nemo; Moana; Cars; Up",
      "Spirited Away; Inside Out; Coco; Aladdin; The Little Mermaid|Little Mermaid; Beauty and the Beast; Snow White|Snow White and the Seven Dwarfs; Monsters, Inc.|Monsters Inc|Monsters Inc.; The Incredibles|Incredibles; Ratatouille; WALL-E|Wall E|Walle; Zootopia|Zootropolis; Encanto; Tangled; Despicable Me; Kung Fu Panda; Ice Age; How to Train Your Dragon; Spider-Man: Into the Spider-Verse|Into the Spider-Verse|Spider-Verse|Spiderverse; Finding Dory",
      "My Neighbour Totoro|My Neighbor Totoro|Totoro; Princess Mononoke; Howl's Moving Castle; Kiki's Delivery Service; Ponyo; Akira; Bambi; Dumbo; Pinocchio; Fantasia; Cinderella; Sleeping Beauty; Peter Pan; Lady and the Tramp; 101 Dalmatians|One Hundred and One Dalmatians; The Jungle Book|Jungle Book; Mulan; Pocahontas; Hercules; Tarzan; Lilo & Stitch|Lilo and Stitch; The Emperor's New Groove|Emperor's New Groove; Brave; Big Hero 6; Wreck-It Ralph|Wreck It Ralph; Bolt; Madagascar; Minions; Sing; The Secret Life of Pets|Secret Life of Pets; Rio; Megamind; Chicken Run; Wallace & Gromit|Wallace and Gromit; Shaun the Sheep; Flushed Away; Corpse Bride; Coraline; The Nightmare Before Christmas|Nightmare Before Christmas; Fantastic Mr Fox|Fantastic Mr. Fox; Isle of Dogs; The Iron Giant|Iron Giant; Anastasia; The Prince of Egypt|Prince of Egypt; Spirit|Spirit: Stallion of the Cimarron; Shark Tale; Bee Movie; Antz; A Bug's Life|Bug's Life; Luca; Soul; Onward; Turning Red; Elemental; Wish; Raya and the Last Dragon; Puss in Boots; The Boss Baby|Boss Baby; Trolls; The Lego Movie|Lego Movie; Klaus; The Mitchells vs the Machines|Mitchells vs the Machines; Hotel Transylvania; Cloudy with a Chance of Meatballs; Happy Feet; Rango; The Polar Express|Polar Express; The Super Mario Bros. Movie|Super Mario Bros Movie|Mario Movie; Your Name; The Grinch|Grinch; Robin Hood; The Fox and the Hound|Fox and the Hound; The Aristocats|Aristocats; The Rescuers|Rescuers; Treasure Planet; Atlantis|Atlantis: The Lost Empire; Brother Bear; Chicken Little; Meet the Robinsons; The Princess and the Frog|Princess and the Frog; The Little Prince",
      "Persepolis; Waltz with Bashir; The Triplets of Belleville|Triplets of Belleville|Belleville Rendez-vous; Grave of the Fireflies; Perfect Blue; Paprika; Ghost in the Shell; Wolf Children; A Silent Voice; Song of the Sea; The Secret of Kells|Secret of Kells; Wolfwalkers; Ernest & Celestine|Ernest and Celestine; The Illusionist; Mary and Max; Anomalisa; I Lost My Body; Flow; The Red Turtle|Red Turtle; Watership Down; The Last Unicorn|Last Unicorn; The Land Before Time|Land Before Time; An American Tail|American Tail; The Secret of NIMH|Secret of NIMH; All Dogs Go to Heaven; The Plague Dogs|Plague Dogs; When the Wind Blows; Yellow Submarine; Fritz the Cat; Fantastic Planet|La Planète sauvage; Redline; Tokyo Godfathers; Millennium Actress; The Boy and the Heron|Boy and the Heron; Porco Rosso; Nausicaä|Nausicaa|Nausicaa of the Valley of the Wind; Castle in the Sky|Laputa; The Wind Rises|Wind Rises; Arrietty|The Secret World of Arrietty; When Marnie Was There; The Tale of the Princess Kaguya|Princess Kaguya; My Life as a Courgette|My Life as a Zucchini; Chico & Rita|Chico and Rita; Loving Vincent",
      "Allegro non troppo; The Snow Queen|Snow Queen; Alice|Něco z Alenky; Twice Upon a Time; Rock & Rule|Rock and Rule; Heavy Metal; Wizards; The Point!|The Point; Gay Purr-ee; Kirikou and the Sorceress|Kirikou; Sita Sings the Blues; The Painting; Long Way North; Phantom Boy; The Breadwinner|Breadwinner; Funan; Josep; Calamity; The Thief and the Cobbler|Thief and the Cobbler",
    ],
    wreck: "The Adventures of Prince Achmed|Adventures of Prince Achmed|Prince Achmed",
    flags: [
      "Sequels count as the original (\"Toy Story 3\" is Toy Story).",
      "The Adventures of Prince Achmed (1926, Lotte Reiniger) is the oldest surviving animated feature film.",
    ],
  },
  {
    id: "bird", prompt: "Name a bird", survey: "A bird",
    options: { suffix: true },
    tiers: [
      "Eagle; Pigeon; Parrot; Penguin; Owl; Robin; Sparrow; Flamingo; Seagull|Gull",
      "Hummingbird; Peacock|Peafowl|Peahen; Ostrich; Crow; Swan; Duck; Chicken|Hen|Rooster|Cockerel; Hawk; Falcon; Toucan; Pelican; Woodpecker; Blue tit|Bluetit; Kingfisher; Magpie; Blackbird; Swallow; Goose; Turkey; Dove",
      "Raven; Heron; Stork; Kiwi; Emu; Cassowary; Puffin; Albatross; Vulture; Condor; Kestrel; Osprey; Buzzard; Kite|Red kite; Starling; Wren; Finch; Goldfinch; Chaffinch; Canary; Budgie|Budgerigar; Parakeet; Cockatoo; Macaw; Lovebird; Cockatiel; Myna|Mynah; Nightingale; Lark|Skylark; Thrush; Jay|Blue jay; Cardinal; Cuckoo; Pheasant; Partridge; Quail; Grouse; Crane; Egret; Cormorant; Gannet; Tern; Sandpiper; Plover; Lapwing; Curlew; Kookaburra; Bird of paradise; Roadrunner; Mockingbird; Bluebird; Oriole; Great tit|Tit; Swift; House martin|Martin; Coot; Moorhen; Rhea; Dodo; Jackdaw; Rook; Mallard; Barn owl",
      "Hoopoe; Bee-eater|Bee eater; Shoebill; Secretary bird; Kakapo; Kea; Quetzal; Hornbill; Lyrebird; Oystercatcher; Nuthatch; Treecreeper; Shrike; Pipit; Bunting; Wagtail; Grebe; Spoonbill; Ibis; Avocet; Godwit; Dunlin; Turnstone; Shearwater; Petrel; Frigatebird; Booby|Blue-footed booby; Tropicbird; Bittern; Frogmouth|Tawny frogmouth; Nightjar; Wryneck; Goldcrest; Firecrest; Dipper; Waxwing; Crossbill; Hawfinch; Bullfinch; Linnet; Siskin; Redstart; Stonechat; Wheatear; Dunnock; Fieldfare; Redwing; Chough; Corncrake; Capercaillie; Ptarmigan; Eider; Shelduck; Wigeon; Pintail; Shoveler; Bustard; Sandgrouse; Jacana; Sunbird; Weaver|Weaverbird; Bowerbird; Tui; Takahe; Loon|Diver; Anhinga",
      "Potoo; Oilbird; Kagu; Sunbittern; Seriema; Limpkin; Tinamou; Mesite; Cuckoo-roller; Wallcreeper; Bobolink; Ovenbird; Antpitta; Manakin; Cock-of-the-rock|Cock of the rock; Bellbird; Umbrellabird; Finfoot; Plains-wanderer; Ibisbill; Crab-plover; Sheathbill; Seedsnipe; Tapaculo; Cyprus warbler; Cyprus wheatear",
    ],
    wreck: "Hoatzin|Stinkbird",
    flags: [
      "A longer name ending in an accepted bird counts as that bird (\"bald eagle\" is Eagle, \"barn swallow\" is Swallow).",
      "The Cyprus warbler and Cyprus wheatear breed only in Cyprus.",
      "The hoatzin's chicks have claws on their wings.",
    ],
  },
  {
    id: "olympic-sport", prompt: "Name an Olympic sport (past or present)", survey: "An Olympic sport",
    tiers: [
      "Swimming; Athletics|Track and field|Running; Gymnastics; Football|Soccer; Basketball; Tennis; Boxing",
      "Volleyball|Beach volleyball; Cycling; Rowing; Diving; Fencing; Judo; Taekwondo|Tae kwon do; Wrestling; Weightlifting; Archery; Skiing|Alpine skiing; Figure skating|Ice skating; Ice hockey; Snowboarding; Sailing; Equestrian|Horse riding|Show jumping|Dressage|Eventing; Golf; Rugby|Rugby sevens; Surfing; Skateboarding",
      "Handball; Water polo; Badminton; Table tennis|Ping pong; Triathlon; Canoeing|Kayaking|Canoe|Kayak; Shooting; Artistic swimming|Synchronised swimming|Synchronized swimming; Trampoline|Trampolining; Bobsleigh|Bobsled; Luge; Skeleton; Curling; Biathlon; Speed skating; Ski jumping; Cross-country skiing; Nordic combined; Freestyle skiing|Moguls; Sport climbing|Climbing|Bouldering; Breaking|Breakdancing; Karate; Baseball; Softball; Marathon; Modern pentathlon|Pentathlon; Decathlon|Heptathlon; Rhythmic gymnastics; BMX; Mountain biking; Short track; Hockey|Field hockey",
      "Cricket; Lacrosse; Polo; Tug of war; Croquet; Real tennis|Jeu de paume; Rackets; Basque pelota|Pelota; Powerboating|Motorboating; Water skiing; Bandy; Skijoring; Military patrol; Pesäpallo|Pesapallo; Kitesurfing|Kiteboarding; Windsurfing; Canoe slalom; Racewalking|Race walking; Steeplechase; Hammer throw",
      "Live pigeon shooting; Plunge for distance; Rope climbing; Club swinging; Standing high jump; Underwater swimming; Swimming obstacle race; Running deer shooting; Duelling pistol; Korfball; Glima; Savate; Gliding; Alpinism",
    ],
    wreck: "Art competitions|Art|Painting|Sculpture|Architecture|Literature|Music",
    flags: [
      "Includes sports that were once Olympic or shown as demonstrations (cricket in 1900, tug of war until 1920, live pigeon shooting in 1900).",
      "Medals were given for painting, sculpture, architecture, literature and music from 1912 to 1948: that's The Wreck.",
      "\"Hockey\" on its own is read as field hockey.",
    ],
  },
  {
    id: "painter", prompt: "Name a famous painter", survey: "A famous painter",
    options: { surnames: true },
    tiers: [
      "Pablo Picasso; Vincent van Gogh|Van Gogh; Leonardo da Vinci|Da Vinci|Leonardo; Claude Monet; Michelangelo; Frida Kahlo|Frida",
      "Rembrandt; Salvador Dalí|Dali; Andy Warhol; Raphael; Banksy; Johannes Vermeer; Henri Matisse; Gustav Klimt; Sandro Botticelli; Paul Cézanne|Cezanne; Pierre-Auguste Renoir; Edgar Degas; Edvard Munch; Jackson Pollock; Bob Ross; Caravaggio; J. M. W. Turner|JMW Turner|William Turner|Turner",
      "Paul Gauguin; Édouard Manet|Edouard Manet; Georges Seurat; Henri de Toulouse-Lautrec|Toulouse-Lautrec|Toulouse Lautrec; Wassily Kandinsky; Piet Mondrian; René Magritte|Rene Magritte; Edward Hopper; Georgia O'Keeffe; Jean-Michel Basquiat; Mark Rothko; Roy Lichtenstein; David Hockney; Francisco Goya; Diego Velázquez|Velazquez; El Greco|Domenikos Theotokopoulos; Titian; Peter Paul Rubens; John Constable; Pieter Bruegel|Brueghel; Hieronymus Bosch; Albrecht Dürer|Durer; Hans Holbein; Marc Chagall; Joan Miró|Miro; Paul Klee; Katsushika Hokusai; Amedeo Modigliani; Egon Schiele; Mary Cassatt; James McNeill Whistler; John Singer Sargent; Thomas Gainsborough; William Hogarth; William Blake; Dante Gabriel Rossetti; John Everett Millais; John William Waterhouse; L. S. Lowry|LS Lowry; Lucian Freud; Francis Bacon; Camille Pissarro; Berthe Morisot; Gustave Courbet; Eugène Delacroix|Delacroix; Jacques-Louis David; Artemisia Gentileschi; Giotto; Jan van Eyck|Van Eyck; Canaletto; Tintoretto; Yayoi Kusama; Gerhard Richter; Diego Rivera; Fernando Botero; Giorgio de Chirico|De Chirico; Henri Rousseau; Willem de Kooning|De Kooning",
      "Hilma af Klint; Ernst Ludwig Kirchner; Franz Marc; Emil Nolde; Max Ernst; Yves Tanguy; Leonora Carrington; Remedios Varo; Tamara de Lempicka|Lempicka; Paula Rego; Peter Doig; Cy Twombly; Agnes Martin; Helen Frankenthaler; Lee Krasner; Joan Mitchell; Bridget Riley; Frank Auerbach; Jenny Saville; Kehinde Wiley; Amrita Sher-Gil; Raja Ravi Varma; Utagawa Hiroshige|Hiroshige; Ilya Repin; Ivan Aivazovsky; Kazimir Malevich; Caspar David Friedrich; Arnold Böcklin|Bocklin; Odilon Redon; Gustave Moreau; Pierre Bonnard; Édouard Vuillard|Vuillard; Paul Signac; Albert Bierstadt; Thomas Cole; Winslow Homer; Grant Wood; Norman Rockwell; Andrew Wyeth; Gustave Caillebotte; Alfred Sisley; Fra Angelico; Andrea Mantegna; Giovanni Bellini; Paolo Veronese|Veronese; Nikolaos Gyzis|Gyzis; Yannis Tsarouchis|Tsarouchis; Nikos Hadjikyriakos-Ghikas|Ghikas|Ghika",
      "Hans Memling; Rogier van der Weyden; Piero della Francesca; Paolo Uccello; Masaccio; Duccio; Cimabue; Lorenzo Lotto; Correggio; Parmigianino; Pontormo; Bronzino; Francisco de Zurbarán|Zurbaran; Bartolomé Esteban Murillo|Murillo; Jean-Siméon Chardin|Chardin; Joseph Wright of Derby; George Stubbs; Henry Fuseli; Samuel Palmer; Richard Dadd; Atkinson Grimshaw; Akseli Gallen-Kallela; Helene Schjerfbeck; Zinaida Serebriakova; Theophilos|Theophilos Hatzimihail; Nikos Engonopoulos|Engonopoulos; Adamantios Diamantis|Diamantis; Telemachos Kanthos|Kanthos; Stelios Votsis|Votsis; Christoforos Savva|Savva; Konstantinos Parthenis|Parthenis; Yannis Moralis|Moralis",
    ],
    wreck: "Vilhelm Hammershøi|Hammershoi|Hammershøi",
    flags: [
      "Surnames on their own are accepted (\"Monet\" or \"Claude Monet\").",
      "Banksy is a street artist rather than a painter in the usual sense, but is accepted.",
      "Greek and Cypriot painters (Diamantis, Kanthos, Votsis, Savva, Theophilos, Engonopoulos) are in the deep tiers for world rarity; the survey will show if your friends know them.",
    ],
  },
  {
    id: "us-city", prompt: "Name a US city", survey: "A US city",
    tiers: [
      "New York|New York City|NYC|NY; Los Angeles|LA; Chicago; Miami; San Francisco|SF|San Fran; Las Vegas|Vegas; Boston; Washington|Washington DC|Washington D.C.|DC",
      "Seattle; Houston; Dallas; Austin; Philadelphia|Philly; Atlanta; Denver; New Orleans|NOLA; Orlando; San Diego; Nashville; Detroit; Phoenix; Pittsburgh",
      "Portland; Baltimore; Minneapolis; St. Louis|Saint Louis|St Louis; Kansas City; Cleveland; Cincinnati; Milwaukee; Indianapolis; Columbus; Charlotte; Memphis; Louisville; Salt Lake City; San Antonio; San Jose; Sacramento; Honolulu; Anchorage; Albuquerque; Tucson; Oklahoma City; Tampa; Jacksonville; Raleigh; Richmond; Savannah; Charleston; Buffalo; Providence; Hartford; Newark; Jersey City; Oakland; Long Beach; Palm Springs; Santa Barbara; Santa Fe; Boulder; Fort Worth; El Paso; Omaha; Des Moines; Madison; Ann Arbor; Cambridge; Key West; Fort Lauderdale; Atlantic City; Princeton; Berkeley; Pasadena; Santa Monica; Malibu; Reno; Boise; Spokane; Tacoma; Birmingham; Little Rock; Baton Rouge; Knoxville; Chattanooga; Tulsa; Albany; Syracuse; Rochester; Scottsdale; Aspen; Durham; Asheville; Galveston; Virginia Beach; New Haven; Salem; Ithaca; Hoboken; Tallahassee; Sarasota; St. Petersburg|Saint Petersburg|St Petersburg; Boca Raton; Daytona Beach; Fresno; Irvine; Anaheim; Palo Alto; Monterey; Santa Cruz; Springfield; Lexington; Wichita; Lincoln; Fargo; Juneau; Burlington; Annapolis; Harrisburg; Toledo; Dayton; Grand Rapids; Flint; Green Bay; St. Paul|Saint Paul|St Paul; Plano; Arlington; Alexandria; Norfolk; Worcester; Plymouth; Athens; Sparta; Troy",
      "Wilmington; Dover; Scranton; Allentown; Erie; Akron; Lansing; Duluth; Sioux Falls; Rapid City; Bismarck; Helena; Missoula; Bozeman; Billings; Cheyenne; Vail; Sedona; Flagstaff; Tempe; Mesa; Greenville; Myrtle Beach; Corpus Christi; Laredo; Lubbock; Amarillo; Waco; Irving; Roanoke; Stamford; Trenton; Camden; Gary; Fort Wayne; South Bend; Peoria; Rockford; Champaign; Iowa City; Cedar Rapids; Topeka; Branson; Fayetteville; Hot Springs; Shreveport; Lafayette; Biloxi; Pensacola; Gainesville; Naples; West Palm Beach; Augusta; Macon; Tuscaloosa; Huntsville; Muncie; Yakima; Eugene; Bend; Medford; Bakersfield; Modesto; Stockton; Riverside; San Bernardino; Carmel; Cupertino; Mountain View; Hilo; Fairbanks; Nome; Olympia; Corinth; Marathon; Euclid; Arcadia; Delphi; Utica",
      "Truth or Consequences; Kalamazoo; Walla Walla; Punxsutawney; Tombstone; Deadwood; Roswell; Boring; Hell; Bethlehem; Nazareth; Rome; Paris; Moscow; Cairo; Last Chance; Why",
    ],
    wreck: "Ypsilanti",
    flags: [
      "Towns are accepted as well as cities.",
      "Neighbourhoods and boroughs (Brooklyn, Hollywood) aren't accepted.",
      "Ypsilanti, Michigan is named after Demetrios Ypsilantis, a hero of the Greek War of Independence.",
      "Several US towns share a name with a Greek or European city (Athens, Sparta, Troy, Corinth, Paris, Rome); they're accepted.",
    ],
  },
  {
    id: "kitchen-drawer", prompt: "Name something in a kitchen drawer", survey: "Something in a kitchen drawer",
    options: { suffix: true },
    tiers: [
      "Spoon; Fork; Knife|Knives; Cutlery|Silverware; Scissors; Spatula",
      "Whisk; Ladle; Tin opener|Can opener; Bottle opener; Corkscrew|Wine opener; Peeler|Vegetable peeler|Potato peeler; Grater|Cheese grater; Tongs; Rolling pin; Measuring spoons|Measuring spoon; Batteries|Battery; Rubber bands|Rubber band|Elastic bands|Elastic band; Takeaway menus|Takeaway menu|Takeout menus|Menus; Tape|Sellotape|Scotch tape; Pens|Pen; Tin foil|Foil|Aluminium foil|Aluminum foil; Cling film|Clingfilm|Plastic wrap|Saran wrap; Tea towel|Dish towel|Tea towels",
      "Pizza cutter|Pizza wheel; Garlic press; Potato masher|Masher; Slotted spoon; Wooden spoon; Measuring cups; Meat thermometer|Thermometer; Skewers|Skewer; Chopsticks; Oven gloves|Oven mitts|Oven glove; Bag clips|Chip clips|Clips; Sandwich bags|Ziploc bags|Freezer bags; Baking paper|Parchment paper|Greaseproof paper; Napkins|Serviettes; Straws; Cookie cutters|Cookie cutter; Ice cream scoop; Zester|Microplane; Pastry brush; Piping bags; Funnel; Sieve|Strainer; Teaspoon; Egg slicer; Nutcracker; Apple corer|Corer; Mandoline; Kitchen timer|Timer; Fish slice; Potato ricer|Ricer; Mezzaluna; Bread knife; Knife sharpener|Sharpening steel; Toothpicks|Cocktail sticks; Matches; Lighter; Candles|Birthday candles; Torch|Flashlight; Superglue|Glue; String|Twine|Kitchen string; Coupons|Vouchers; Receipts; Tape measure; Allen keys|Allen key|Hex key; Screwdriver; Twist ties; Soy sauce packets|Soy sauce sachets; Ketchup sachets; Spare keys|Keys; Instruction manuals|Manuals; Sticky notes|Post-its; Coins|Loose change|Change; Chargers|Phone charger|Cables; Paper clips; Pencil; Notepad; Lemon squeezer|Citrus squeezer|Juicer",
      "Lobster crackers|Seafood fork; Escargot tongs; Butter curler; Egg separator; Cherry pitter|Olive pitter; Avocado slicer; Herb scissors; Strawberry huller; Spaghetti measurer; Jar opener; Baster|Turkey baster; Trussing needle; Grapefruit spoon; Fondue forks; Corn holders|Corn on the cob holders; Pastry blender; Pastry wheel|Ravioli cutter; Biscuit cutter; Bench scraper|Dough scraper; Channel knife; Oyster knife; Cleaver; Kitchen torch|Blowtorch; Sugar tongs; Tea infuser|Tea strainer; Coffee scoop; Melon baller; Cake tester; Mortar and pestle|Pestle",
      "Bottle stopper|Wine stopper; Mouli|Rotary grater; Bird's beak knife|Tourné knife; Asparagus peeler; Grapefruit knife; Evil eye|Mati; Komboloi|Worry beads; Larding needle; Butter knife; Pickle fork; Spoon rest; Tomato shark",
    ],
    wreck: "Spurtle",
    flags: [
      "This one is very open, so the list is generous: kitchen tools and the junk-drawer classics (batteries, takeaway menus, spare keys) all count.",
      "A spurtle is a Scottish wooden stick for stirring porridge.",
      "The evil eye (mati) is in for Greek and Cypriot kitchens.",
    ],
  },
  {
    id: "breakfast-cereal", prompt: "Name a breakfast cereal", survey: "A breakfast cereal",
    tiers: [
      "Cornflakes|Corn Flakes|Corn Flake; Cheerios; Coco Pops|Choco Krispies; Frosties|Frosted Flakes; Weetabix; Rice Krispies|Rice Bubbles; Special K; Granola; Muesli; Porridge|Oatmeal|Oats",
      "Shreddies; Crunchy Nut|Crunchy Nut Cornflakes; Lucky Charms; Froot Loops|Fruit Loops; Cinnamon Toast Crunch|Curiosity Cinnamon Toast Crunch|Cini Minis; Shredded Wheat; Bran Flakes; All-Bran|All Bran; Cookie Crisp; Golden Grahams; Cocoa Puffs; Cap'n Crunch|Captain Crunch; Honey Nut Cheerios; Fruit and Fibre|Fruit 'n Fibre; Krave; Nesquik|Nesquik cereal; Chocapic; Honey Loops|Honey Nut Loops; Alpen",
      "Raisin Bran; Grape-Nuts|Grape Nuts; Wheaties; Kix; Trix; Apple Jacks; Corn Pops; Honey Monster Puffs|Sugar Puffs|Honey Smacks|Smacks; Frosted Mini-Wheats|Mini Wheats; Coco Shreddies; Clusters; Fitness; Cinnamon Grahams; Weetos; Ready Brek; Ricicles; Bran Buds; Oatibix; Puffed rice; Puffed wheat; Count Chocula; Fruity Pebbles|Cocoa Pebbles|Pebbles; Reese's Puffs; Life; Chex|Corn Chex|Rice Chex; Crispix; Golden Nuggets; Lion; Frosted Shreddies; Sultana Bran; Honeycomb; Total",
      "Quisp; Boo Berry; Franken Berry; Fruit Brute; Mr. T Cereal|Mr T Cereal; Smurf-Berry Crunch|Smurf Berry Crunch; Ghostbusters cereal; Nerds cereal; Waffle Crisp; French Toast Crunch; Oreo O's|Oreo Os; Coco Wheats; Cream of Wheat; Malt-O-Meal|Malt O Meal; Golden Crisp|Super Sugar Crisp; Basic 4; Product 19; Corn Bran; Mueslix; Just Right; Honey Puffs; Optivita; Start; Crunchy Bran",
      "Force|Force Wheat Flakes; Wheatena; Maypo; Post Toasties; Grape-Nut Flakes; King Vitaman; Sir Grapefellow; Freakies; Pac-Man cereal; E.T. cereal|ET cereal; Urkel-Os; Breakfast with Barbie; Pep; Granose",
    ],
    wreck: "Granula",
    flags: [
      "Lots of brand names and UK/US differences: tell me if any favourites are missing.",
      "Granula (1863) was the first ready-to-eat cold cereal, made by James Caleb Jackson. It's one letter away from granola, so typos never turn granola into Granula.",
    ],
  },
  {
    id: "instrument", prompt: "Name a musical instrument", survey: "A musical instrument",
    options: { suffix: true },
    tiers: [
      "Piano; Guitar; Drums|Drum|Drum kit; Violin|Violi; Flute; Trumpet; Saxophone|Sax",
      "Cello; Clarinet; Harp; Ukulele|Uke; Bass|Bass guitar|Electric bass; Trombone; Keyboard|Keys; Recorder; Harmonica|Mouth organ; Tuba; Triangle; Accordion; Xylophone; Banjo; Tambourine; Oboe; French horn|Horn",
      "Bassoon; Viola; Double bass|Upright bass|Contrabass; Organ|Pipe organ; Piccolo; Glockenspiel; Bagpipes|Bagpipe; Mandolin; Sitar; Bongos|Bongo; Congas|Conga; Cymbals|Cymbal; Timpani|Kettle drum; Marimba; Vibraphone|Vibes; Harpsichord; Lute; Synthesizer|Synth|Synthesiser; Maracas; Castanets; Cowbell; Bouzouki; Lyre; Didgeridoo; Kazoo; Steel drum|Steelpan|Steel pan; Cajón|Cajon; Djembe; Tabla; Bodhrán|Bodhran; Melodica; Ocarina; Pan flute|Panpipes|Pan pipes; Cornet; Euphonium; Flugelhorn; Sousaphone; Celesta; Gong; Tubular bells; Snare drum|Snare; Bass drum; Handbells|Bells; Spoons; Jaw harp|Jew's harp; Musical saw",
      "Theremin; Koto; Shamisen; Erhu; Balalaika; Zither; Dulcimer|Hammered dulcimer; Autoharp; Concertina; Harmonium; Hurdy-gurdy|Hurdy gurdy; Oud; Santouri|Santoor; Laouto; Lyra|Cretan lyra; Darbuka|Toumbeleki|Doumbek|Tarabuka; Tzouras; Baglamas; Kalimba|Mbira|Thumb piano; Handpan|Hang; Shakuhachi; Duduk; Bandura; Charango; Güiro|Guiro; Cabasa; Vuvuzela; Keytar; Mellotron; Clavichord; Spinet; Viola da gamba; Sackbut; Shawm; Crumhorn; Serpent; Ophicleide; Cor anglais|English horn; Contrabassoon; Bass clarinet; Tin whistle|Penny whistle; Uilleann pipes; Nyckelharpa; Kantele; Sarangi; Sarod; Veena; Shehnai; Bansuri; Mridangam; Pipa; Guzheng; Sheng; Suona; Kora; Talking drum; Udu; Berimbau; Washboard",
      "Ondes Martenot; Glass harmonica|Glass armonica; Hydraulophone; Octobass; Sarrusophone; Heckelphone; Lithophone; Waterphone; Daxophone; Stylophone; Omnichord; Aeolian harp; Bullroarer; Tromba marina; Baryton; Arpeggione; Pithkiavli; Tsabouna; Gaida; Sistrum; Aulos; Kithara",
    ],
    wreck: "Hydraulis|Water organ",
    flags: [
      "Greek and Cypriot instruments are included (bouzouki, laouto, Cretan lyra, tzouras, baglamas, santouri, the Cypriot pithkiavli and violi).",
      "The hydraulis, a water-powered organ, was invented in ancient Greece by Ctesibius of Alexandria.",
    ],
  },
  {
    id: "greek-cypriot-dish", prompt: "Name a Greek or Cypriot dish", survey: "A Greek or Cypriot dish",
    tiers: [
      "Moussaka|Mousakas; Souvlaki; Gyros|Gyro; Tzatziki|Talattouri; Greek salad|Horiatiki|Choriatiki|Village salad; Halloumi|Hellim|Grilled halloumi; Spanakopita|Spinach pie; Baklava|Baklavas",
      "Dolmades|Dolmas|Koupepia|Stuffed vine leaves; Pastitsio|Makaronia tou fournou|Pastichio; Kleftiko; Taramasalata|Taramosalata|Taramas; Loukoumades|Loukmades|Lokmades|Lokmathes; Stifado; Souvla; Sheftalia|Seftalia|Sheftalies; Yemista|Gemista|Stuffed peppers|Stuffed tomatoes; Fasolada|Bean soup; Avgolemono; Keftedes|Keftethes|Meatballs; Tiropita|Tyropita|Cheese pie; Kolokithokeftedes|Courgette fritters|Zucchini fritters",
      "Galaktoboureko; Kourabiedes|Kourambiedes|Kourabiethes; Melomakarona; Bougatsa; Loukoumi|Cyprus delight; Afelia; Koupes|Koupa; Kolokasi|Kolokassi|Taro; Flaouna|Flaounes; Trahanas|Trachanas|Tarhana; Louvi|Louvia; Spanakorizo; Fakes|Lentil soup; Revithada|Chickpea soup; Briam|Briami|Tourlou; Imam bayildi|Imam; Gigantes|Gigantes plaki; Saganaki; Bifteki|Biftekia; Soutzoukakia; Youvetsi|Giouvetsi; Kokoretsi; Magiritsa; Kontosouvli; Paidakia|Lamb chops; Horta; Dakos|Ntakos|Koukouvagia; Skordalia; Fava; Melitzanosalata; Kalamarakia|Kalamari|Calamari; Htapodi|Chtapodi|Octopus; Garides saganaki; Psarosoupa|Fish soup; Pastitsada; Sofrito; Bourdeto; Kreatopita; Hortopita; Kotopita; Kotopoulo lemonato; Patates lemonates|Lemon potatoes; Koulouri|Koulouria; Tsoureki; Vasilopita; Diples; Halvas|Halva; Rizogalo|Rice pudding; Kataifi|Kadaifi|Ekmek kataifi; Portokalopita; Karidopita; Revani|Ravani; Pasteli; Spoon sweets|Glyko tou koutaliou; Loukaniko|Loukanika; Pastourmas|Pastourma",
      "Lountza; Hiromeri; Tava|Tavas|Ttavas; Ofton|Kleftiko ofto; Bourekia|Pourekia; Daktyla|Dactyla; Pourgouri|Pligouri|Bulgur pilafi; Pilafi; Kakavia; Bakaliaros skordalia|Bakaliaros; Gouna; Tirokafteri|Htipiti; Mageiritsa soup; Fasolakia|Fasolakia ladera; Bamies|Okra; Kapama; Arni kleftiko",
      "Kattimeri; Shamishi|Siamishi; Soutzioukos|Soutzouko; Palouzes|Palouze; Pastelaki; Kaskavalli; Koupepia me kolokithia; Tsamarella; Anari pies|Bourekia me anari; Strapatsada; Kalitsounia; Sfakiani pita; Boureki; Gemista me kima",
    ],
    wreck: "Moungra",
    flags: [
      "Dishes shared across the eastern Mediterranean (baklava, halva, loukoumi) are accepted. Hummus isn't, as it's Levantine rather than Greek or Cypriot.",
      "Cypriot specialities sit in the deep tiers for world rarity; the survey will bring the ones your friends say often back up.",
      "Moungra is Cypriot pickled cauliflower with mustard, made for Lent.",
    ],
  },
];

// Friend-specific prompts for the Group round: added once the survey is in.
DEEP.groupPrompts = [];
