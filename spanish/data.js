/* =========================================================
   SPANISH TRAINER · vocabulary
   ---------------------------------------------------------
   Mexican Spanish (es-MX) throughout. Where Spain says it
   differently, the word has a short note.

   Each word has:
     es       The Spanish. Nouns include their article: "el carro".
     en       The English.
     theme    Which deck it's in (see DECKS below).
     type     "noun", "verb", "adjective", "adverb", "number" or "phrase".
     ex       A short example sentence in Spanish…
     exEn     …and its English.
     note     Optional. A small note, e.g. how Spain says it.
     id       Never change a word's id: your progress is saved by it.

   To add a word, copy a line, give it a new id, and keep the
   comma at the end.

   TO CHECK (words I'm less sure about; tell Claude if one is off):
     ahorita       In Mexico it can mean "right now" or "in a bit"
                   (sometimes "never"). Wiktionary lists both senses
                   as Latin American but doesn't single out Mexico.
     derecho       "Straight ahead" in directions ("siga derecho");
                   from memory, not checked against a source.
     ¿mande?       The polite Mexican "pardon?"; from memory.
     con permiso   "Excuse me" when passing someone; from memory.
     ¿qué onda?    Informal "what's up?"; from memory.
     la colonia    "Neighbourhood" in Mexican cities; from memory.
     el zócalo     The main square, especially in Mexico City; from memory.
     el jitomate   Wiktionary: Mexican, "tomato (usually red)". How
                   it splits with "tomate" varies by region.
     el camión     "Bus" in Mexico (also "truck"); from memory.
     la comida     In Mexico also the main midday meal; from memory.
     manejar, rentar, tomar (to drink): Mexican-leaning choices,
                   from memory.
     futbol        The note says Mexico writes it without an accent
                   (stress on the last syllable); from memory.
   ========================================================= */

const DECKS = [
  { id: "basics", name: "Greetings and basics" },
  { id: "numbers", name: "Numbers" },
  { id: "food", name: "Food and drink" },
  { id: "travel", name: "Travel and directions" },
  { id: "verbs", name: "Everyday verbs" },
  { id: "people", name: "People and family" },
  { id: "town", name: "Places in town" },
  { id: "time", name: "Time and days" },
];

const WORDS = [
  // ---- Greetings and basics ----
  { id: "hola", es: "hola", en: "hello", theme: "basics", type: "phrase", ex: "Hola, ¿cómo estás?", exEn: "Hello, how are you?" },
  { id: "adios", es: "adiós", en: "goodbye", theme: "basics", type: "phrase", ex: "Adiós, nos vemos mañana.", exEn: "Goodbye, see you tomorrow." },
  { id: "buenos-dias", es: "buenos días", en: "good morning", theme: "basics", type: "phrase", ex: "Buenos días, señora.", exEn: "Good morning, ma'am." },
  { id: "buenas-tardes", es: "buenas tardes", en: "good afternoon", theme: "basics", type: "phrase", ex: "Buenas tardes, ¿qué va a querer?", exEn: "Good afternoon, what would you like?" },
  { id: "buenas-noches", es: "buenas noches", en: "good evening / good night", theme: "basics", type: "phrase", ex: "Buenas noches, que descanses.", exEn: "Good night, rest well." },
  { id: "por-favor", es: "por favor", en: "please", theme: "basics", type: "phrase", ex: "Un café, por favor.", exEn: "A coffee, please." },
  { id: "gracias", es: "gracias", en: "thank you", theme: "basics", type: "phrase", ex: "Muchas gracias por todo.", exEn: "Thank you very much for everything." },
  { id: "de-nada", es: "de nada", en: "you're welcome", theme: "basics", type: "phrase", ex: "Gracias. De nada.", exEn: "Thanks. You're welcome." },
  { id: "si", es: "sí", en: "yes", theme: "basics", type: "adverb", ex: "Sí, quiero ir.", exEn: "Yes, I want to go." },
  { id: "no", es: "no", en: "no", theme: "basics", type: "adverb", ex: "No, gracias.", exEn: "No, thank you." },
  { id: "perdon", es: "perdón", en: "sorry", theme: "basics", type: "phrase", ex: "Perdón, no te vi.", exEn: "Sorry, I didn't see you." },
  { id: "con-permiso", es: "con permiso", en: "excuse me (to get past)", theme: "basics", type: "phrase", ex: "Con permiso, voy a bajar.", exEn: "Excuse me, I'm getting off.", note: "Used in Mexico when passing someone or leaving." },
  { id: "como-estas", es: "¿cómo estás?", en: "how are you?", theme: "basics", type: "phrase", ex: "Hola, Ana, ¿cómo estás?", exEn: "Hi, Ana, how are you?" },
  { id: "bien", es: "bien", en: "well / fine", theme: "basics", type: "adverb", ex: "Estoy bien, gracias.", exEn: "I'm fine, thanks." },
  { id: "mucho-gusto", es: "mucho gusto", en: "nice to meet you", theme: "basics", type: "phrase", ex: "Me llamo Emilios. Mucho gusto.", exEn: "My name is Emilios. Nice to meet you." },
  { id: "que-onda", es: "¿qué onda?", en: "what's up?", theme: "basics", type: "phrase", ex: "¿Qué onda? ¿Vamos al cine?", exEn: "What's up? Shall we go to the cinema?", note: "Informal and very Mexican. Use it with friends." },
  { id: "hasta-luego", es: "hasta luego", en: "see you later", theme: "basics", type: "phrase", ex: "Hasta luego, que te vaya bien.", exEn: "See you later, take care." },
  { id: "mande", es: "¿mande?", en: "pardon? / sorry, what?", theme: "basics", type: "phrase", ex: "¿Mande? No te escuché.", exEn: "Pardon? I didn't hear you.", note: "A polite Mexican way to ask someone to repeat. Spain: ¿cómo?" },
  { id: "claro", es: "claro", en: "of course", theme: "basics", type: "adverb", ex: "Claro, con mucho gusto.", exEn: "Of course, with pleasure." },
  { id: "ahorita", es: "ahorita", en: "right now / in a bit", theme: "basics", type: "adverb", ex: "Ahorita vengo.", exEn: "I'll be right back.", note: "In Mexico it can mean now or later. Context tells you which." },

  // ---- Numbers ----
  { id: "cero", es: "cero", en: "zero", theme: "numbers", type: "number", ex: "Mi número empieza con cero.", exEn: "My number starts with zero." },
  { id: "uno", es: "uno", en: "one", theme: "numbers", type: "number", ex: "Tengo uno nada más.", exEn: "I only have one." },
  { id: "dos", es: "dos", en: "two", theme: "numbers", type: "number", ex: "Dos tacos, por favor.", exEn: "Two tacos, please." },
  { id: "tres", es: "tres", en: "three", theme: "numbers", type: "number", ex: "Son las tres.", exEn: "It's three o'clock." },
  { id: "cuatro", es: "cuatro", en: "four", theme: "numbers", type: "number", ex: "Somos cuatro.", exEn: "There are four of us." },
  { id: "cinco", es: "cinco", en: "five", theme: "numbers", type: "number", ex: "Cuesta cinco pesos.", exEn: "It costs five pesos." },
  { id: "seis", es: "seis", en: "six", theme: "numbers", type: "number", ex: "Llego a las seis.", exEn: "I arrive at six." },
  { id: "siete", es: "siete", en: "seven", theme: "numbers", type: "number", ex: "La semana tiene siete días.", exEn: "The week has seven days." },
  { id: "ocho", es: "ocho", en: "eight", theme: "numbers", type: "number", ex: "Trabajo ocho horas.", exEn: "I work eight hours." },
  { id: "nueve", es: "nueve", en: "nine", theme: "numbers", type: "number", ex: "Tengo nueve primos.", exEn: "I have nine cousins." },
  { id: "diez", es: "diez", en: "ten", theme: "numbers", type: "number", ex: "Espera diez minutos.", exEn: "Wait ten minutes." },
  { id: "quince", es: "quince", en: "fifteen", theme: "numbers", type: "number", ex: "Mi hermana tiene quince años.", exEn: "My sister is fifteen." },
  { id: "veinte", es: "veinte", en: "twenty", theme: "numbers", type: "number", ex: "Son veinte pesos.", exEn: "That's twenty pesos." },
  { id: "cien", es: "cien", en: "one hundred", theme: "numbers", type: "number", ex: "Tengo cien pesos.", exEn: "I have a hundred pesos." },
  { id: "mil", es: "mil", en: "one thousand", theme: "numbers", type: "number", ex: "El boleto cuesta mil pesos.", exEn: "The ticket costs a thousand pesos." },

  // ---- Food and drink ----
  { id: "agua", es: "el agua", en: "water", theme: "food", type: "noun", ex: "Un vaso de agua, por favor.", exEn: "A glass of water, please.", note: "A feminine word, but it takes \"el\" because it starts with a stressed a: el agua fría." },
  { id: "jugo", es: "el jugo", en: "juice", theme: "food", type: "noun", ex: "Me gusta el jugo de naranja.", exEn: "I like orange juice.", note: "Spain: el zumo." },
  { id: "papa", es: "la papa", en: "potato", theme: "food", type: "noun", ex: "Quiero papas con la carne.", exEn: "I want potatoes with the meat.", note: "Spain: la patata." },
  { id: "pan", es: "el pan", en: "bread", theme: "food", type: "noun", ex: "El pan está caliente.", exEn: "The bread is warm." },
  { id: "tortilla", es: "la tortilla", en: "tortilla (flatbread)", theme: "food", type: "noun", ex: "Las tortillas son de maíz.", exEn: "The tortillas are made of corn.", note: "In Mexico, a corn or flour flatbread. In Spain, a potato omelette." },
  { id: "frijol", es: "el frijol", en: "bean", theme: "food", type: "noun", ex: "Me gustan los frijoles con arroz.", exEn: "I like beans with rice.", note: "Spain: la judía or la alubia." },
  { id: "aguacate", es: "el aguacate", en: "avocado", theme: "food", type: "noun", ex: "El guacamole lleva aguacate.", exEn: "Guacamole has avocado in it." },
  { id: "jitomate", es: "el jitomate", en: "tomato", theme: "food", type: "noun", ex: "Compra jitomates para la salsa.", exEn: "Buy tomatoes for the salsa.", note: "Mexican, for the red tomato. Spain and many other places: el tomate." },
  { id: "chile", es: "el chile", en: "chilli pepper", theme: "food", type: "noun", ex: "¿Pica mucho el chile?", exEn: "Is the chilli very hot?" },
  { id: "carne", es: "la carne", en: "meat", theme: "food", type: "noun", ex: "La carne está muy rica.", exEn: "The meat is delicious." },
  { id: "pollo", es: "el pollo", en: "chicken", theme: "food", type: "noun", ex: "Quiero tacos de pollo.", exEn: "I want chicken tacos." },
  { id: "pescado", es: "el pescado", en: "fish (to eat)", theme: "food", type: "noun", ex: "El pescado es fresco.", exEn: "The fish is fresh." },
  { id: "huevo", es: "el huevo", en: "egg", theme: "food", type: "noun", ex: "Desayuno huevos con frijoles.", exEn: "I have eggs with beans for breakfast." },
  { id: "arroz", es: "el arroz", en: "rice", theme: "food", type: "noun", ex: "El arroz lleva jitomate.", exEn: "The rice has tomato in it." },
  { id: "leche", es: "la leche", en: "milk", theme: "food", type: "noun", ex: "¿Tienes leche para el café?", exEn: "Do you have milk for the coffee?" },
  { id: "cafe", es: "el café", en: "coffee", theme: "food", type: "noun", ex: "Tomo café cada mañana.", exEn: "I drink coffee every morning." },
  { id: "cerveza", es: "la cerveza", en: "beer", theme: "food", type: "noun", ex: "Una cerveza fría, por favor.", exEn: "A cold beer, please." },
  { id: "fruta", es: "la fruta", en: "fruit", theme: "food", type: "noun", ex: "Compro fruta en el mercado.", exEn: "I buy fruit at the market." },
  { id: "manzana", es: "la manzana", en: "apple", theme: "food", type: "noun", ex: "La manzana es roja.", exEn: "The apple is red." },
  { id: "platano", es: "el plátano", en: "banana", theme: "food", type: "noun", ex: "Quiero un licuado de plátano.", exEn: "I want a banana smoothie." },
  { id: "queso", es: "el queso", en: "cheese", theme: "food", type: "noun", ex: "Una quesadilla con mucho queso.", exEn: "A quesadilla with lots of cheese." },
  { id: "comida", es: "la comida", en: "food / lunch", theme: "food", type: "noun", ex: "La comida es a las tres.", exEn: "Lunch is at three.", note: "In Mexico, la comida is also the main meal of the day, in the afternoon." },
  { id: "desayuno", es: "el desayuno", en: "breakfast", theme: "food", type: "noun", ex: "El desayuno está listo.", exEn: "Breakfast is ready." },
  { id: "cena", es: "la cena", en: "dinner", theme: "food", type: "noun", ex: "La cena es ligera.", exEn: "Dinner is light." },
  { id: "cuenta", es: "la cuenta", en: "the bill", theme: "food", type: "noun", ex: "La cuenta, por favor.", exEn: "The bill, please." },

  // ---- Travel and directions ----
  { id: "camion", es: "el camión", en: "bus", theme: "travel", type: "noun", ex: "Tomo el camión al trabajo.", exEn: "I take the bus to work.", note: "In Mexico it means bus (and also truck). Spain: el autobús." },
  { id: "carro", es: "el carro", en: "car", theme: "travel", type: "noun", ex: "Mi carro es azul.", exEn: "My car is blue.", note: "Spain: el coche." },
  { id: "metro", es: "el metro", en: "subway / metro", theme: "travel", type: "noun", ex: "El metro está lleno.", exEn: "The metro is full." },
  { id: "aeropuerto", es: "el aeropuerto", en: "airport", theme: "travel", type: "noun", ex: "Voy al aeropuerto en taxi.", exEn: "I'm going to the airport by taxi." },
  { id: "boleto", es: "el boleto", en: "ticket", theme: "travel", type: "noun", ex: "Necesito un boleto de ida.", exEn: "I need a one-way ticket.", note: "Spain: el billete." },
  { id: "maleta", es: "la maleta", en: "suitcase", theme: "travel", type: "noun", ex: "Mi maleta es muy pesada.", exEn: "My suitcase is very heavy." },
  { id: "pasaporte", es: "el pasaporte", en: "passport", theme: "travel", type: "noun", ex: "¿Dónde está mi pasaporte?", exEn: "Where is my passport?" },
  { id: "calle", es: "la calle", en: "street", theme: "travel", type: "noun", ex: "La calle está cerrada.", exEn: "The street is closed." },
  { id: "esquina", es: "la esquina", en: "corner", theme: "travel", type: "noun", ex: "La tienda está en la esquina.", exEn: "The shop is on the corner." },
  { id: "cuadra", es: "la cuadra", en: "block (of a street)", theme: "travel", type: "noun", ex: "Está a dos cuadras.", exEn: "It's two blocks away.", note: "Latin American. Spain: la manzana." },
  { id: "derecha", es: "a la derecha", en: "to the right", theme: "travel", type: "phrase", ex: "Gire a la derecha.", exEn: "Turn right." },
  { id: "izquierda", es: "a la izquierda", en: "to the left", theme: "travel", type: "phrase", ex: "El baño está a la izquierda.", exEn: "The bathroom is on the left." },
  { id: "derecho", es: "derecho", en: "straight ahead", theme: "travel", type: "adverb", ex: "Siga derecho dos cuadras.", exEn: "Keep going straight for two blocks.", note: "Spain usually says recto." },
  { id: "cerca", es: "cerca", en: "near / close", theme: "travel", type: "adverb", ex: "El hotel está cerca.", exEn: "The hotel is close." },
  { id: "lejos", es: "lejos", en: "far", theme: "travel", type: "adverb", ex: "¿Está lejos el centro?", exEn: "Is the centre far?" },
  { id: "donde-esta", es: "¿dónde está?", en: "where is it?", theme: "travel", type: "phrase", ex: "¿Dónde está la parada?", exEn: "Where is the stop?" },
  { id: "mapa", es: "el mapa", en: "map", theme: "travel", type: "noun", ex: "¿Tienes un mapa de la ciudad?", exEn: "Do you have a map of the city?", note: "Masculine, even though it ends in -a." },
  { id: "parada", es: "la parada", en: "stop (bus stop)", theme: "travel", type: "noun", ex: "Me bajo en la próxima parada.", exEn: "I get off at the next stop." },
  { id: "hotel", es: "el hotel", en: "hotel", theme: "travel", type: "noun", ex: "El hotel tiene alberca.", exEn: "The hotel has a pool." },
  { id: "taxi", es: "el taxi", en: "taxi", theme: "travel", type: "noun", ex: "Pido un taxi.", exEn: "I'll call a taxi." },

  // ---- Everyday verbs ----
  { id: "ser", es: "ser", en: "to be (who or what)", theme: "verbs", type: "verb", ex: "Quiero ser maestro.", exEn: "I want to be a teacher." },
  { id: "estar", es: "estar", en: "to be (where or how)", theme: "verbs", type: "verb", ex: "Voy a estar en casa.", exEn: "I'm going to be at home." },
  { id: "tener", es: "tener", en: "to have", theme: "verbs", type: "verb", ex: "Vas a tener tiempo mañana.", exEn: "You'll have time tomorrow." },
  { id: "ir", es: "ir", en: "to go", theme: "verbs", type: "verb", ex: "Quiero ir al mercado.", exEn: "I want to go to the market." },
  { id: "hacer", es: "hacer", en: "to do / to make", theme: "verbs", type: "verb", ex: "¿Qué vas a hacer hoy?", exEn: "What are you going to do today?" },
  { id: "comer", es: "comer", en: "to eat", theme: "verbs", type: "verb", ex: "Vamos a comer tacos.", exEn: "Let's eat tacos." },
  { id: "tomar", es: "tomar", en: "to drink / to take", theme: "verbs", type: "verb", ex: "¿Quieres tomar algo?", exEn: "Do you want something to drink?", note: "In Mexico tomar is the everyday word for drinking. Beber is also correct." },
  { id: "hablar", es: "hablar", en: "to speak", theme: "verbs", type: "verb", ex: "Quiero hablar español.", exEn: "I want to speak Spanish." },
  { id: "querer", es: "querer", en: "to want / to love", theme: "verbs", type: "verb", ex: "Te voy a querer siempre.", exEn: "I'll always love you." },
  { id: "poder", es: "poder", en: "to be able to / can", theme: "verbs", type: "verb", ex: "Vas a poder hacerlo.", exEn: "You'll be able to do it." },
  { id: "vivir", es: "vivir", en: "to live", theme: "verbs", type: "verb", ex: "Quiero vivir en Oaxaca.", exEn: "I want to live in Oaxaca." },
  { id: "trabajar", es: "trabajar", en: "to work", theme: "verbs", type: "verb", ex: "Tengo que trabajar mañana.", exEn: "I have to work tomorrow." },
  { id: "estudiar", es: "estudiar", en: "to study", theme: "verbs", type: "verb", ex: "Me gusta estudiar en la mañana.", exEn: "I like studying in the morning." },
  { id: "entender", es: "entender", en: "to understand", theme: "verbs", type: "verb", ex: "No puedo entender la pregunta.", exEn: "I can't understand the question." },
  { id: "saber", es: "saber", en: "to know (facts)", theme: "verbs", type: "verb", ex: "Quiero saber la verdad.", exEn: "I want to know the truth." },
  { id: "conocer", es: "conocer", en: "to know (people, places)", theme: "verbs", type: "verb", ex: "Quiero conocer México.", exEn: "I want to get to know Mexico." },
  { id: "ver", es: "ver", en: "to see", theme: "verbs", type: "verb", ex: "Vamos a ver una película.", exEn: "Let's see a film." },
  { id: "llegar", es: "llegar", en: "to arrive", theme: "verbs", type: "verb", ex: "Voy a llegar tarde.", exEn: "I'm going to arrive late." },
  { id: "salir", es: "salir", en: "to go out / to leave", theme: "verbs", type: "verb", ex: "¿Quieres salir esta noche?", exEn: "Do you want to go out tonight?" },
  { id: "manejar", es: "manejar", en: "to drive", theme: "verbs", type: "verb", ex: "No me gusta manejar en la ciudad.", exEn: "I don't like driving in the city.", note: "Spain: conducir." },
  { id: "rentar", es: "rentar", en: "to rent", theme: "verbs", type: "verb", ex: "Queremos rentar un departamento.", exEn: "We want to rent an apartment.", note: "Spain: alquilar." },
  { id: "platicar", es: "platicar", en: "to chat", theme: "verbs", type: "verb", ex: "Me gusta platicar con mi abuela.", exEn: "I like chatting with my grandmother.", note: "Latin American. Spain: charlar." },
  { id: "necesitar", es: "necesitar", en: "to need", theme: "verbs", type: "verb", ex: "Voy a necesitar ayuda.", exEn: "I'm going to need help." },
  { id: "comprar", es: "comprar", en: "to buy", theme: "verbs", type: "verb", ex: "Quiero comprar un celular.", exEn: "I want to buy a mobile phone." },
  { id: "pagar", es: "pagar", en: "to pay", theme: "verbs", type: "verb", ex: "¿Puedo pagar con tarjeta?", exEn: "Can I pay by card?" },

  // ---- People and family ----
  { id: "mama", es: "la mamá", en: "mum", theme: "people", type: "noun", ex: "Mi mamá cocina muy rico.", exEn: "My mum cooks really well." },
  { id: "papa-padre", es: "el papá", en: "dad", theme: "people", type: "noun", ex: "Mi papá trabaja mucho.", exEn: "My dad works a lot.", note: "Careful: la papa (no accent) is a potato." },
  { id: "hermano", es: "el hermano", en: "brother", theme: "people", type: "noun", ex: "Mi hermano vive en Monterrey.", exEn: "My brother lives in Monterrey." },
  { id: "hermana", es: "la hermana", en: "sister", theme: "people", type: "noun", ex: "Mi hermana es doctora.", exEn: "My sister is a doctor." },
  { id: "hijo", es: "el hijo", en: "son", theme: "people", type: "noun", ex: "Su hijo tiene cinco años.", exEn: "Her son is five." },
  { id: "hija", es: "la hija", en: "daughter", theme: "people", type: "noun", ex: "Su hija estudia mucho.", exEn: "His daughter studies a lot." },
  { id: "abuelo", es: "el abuelo", en: "grandfather", theme: "people", type: "noun", ex: "Mi abuelo cuenta historias.", exEn: "My grandfather tells stories." },
  { id: "abuela", es: "la abuela", en: "grandmother", theme: "people", type: "noun", ex: "Mi abuela hace tamales.", exEn: "My grandmother makes tamales." },
  { id: "esposo", es: "el esposo", en: "husband", theme: "people", type: "noun", ex: "Su esposo es de Puebla.", exEn: "Her husband is from Puebla." },
  { id: "esposa", es: "la esposa", en: "wife", theme: "people", type: "noun", ex: "Su esposa es maestra.", exEn: "His wife is a teacher." },
  { id: "amigo", es: "el amigo", en: "friend (male)", theme: "people", type: "noun", ex: "Él es mi amigo.", exEn: "He's my friend." },
  { id: "amiga", es: "la amiga", en: "friend (female)", theme: "people", type: "noun", ex: "Ella es mi mejor amiga.", exEn: "She's my best friend." },
  { id: "nino", es: "el niño", en: "boy / child", theme: "people", type: "noun", ex: "El niño juega en el parque.", exEn: "The boy plays in the park." },
  { id: "nina", es: "la niña", en: "girl", theme: "people", type: "noun", ex: "La niña tiene un perro.", exEn: "The girl has a dog." },
  { id: "senor", es: "el señor", en: "man / sir", theme: "people", type: "noun", ex: "El señor vende elotes.", exEn: "The man sells corn on the cob." },
  { id: "senora", es: "la señora", en: "woman / ma'am", theme: "people", type: "noun", ex: "La señora es muy amable.", exEn: "The lady is very kind." },
  { id: "familia", es: "la familia", en: "family", theme: "people", type: "noun", ex: "Mi familia es grande.", exEn: "My family is big." },
  { id: "tio", es: "el tío", en: "uncle", theme: "people", type: "noun", ex: "Mi tío vive en Guadalajara.", exEn: "My uncle lives in Guadalajara." },
  { id: "tia", es: "la tía", en: "aunt", theme: "people", type: "noun", ex: "Mi tía tiene una tienda.", exEn: "My aunt has a shop." },
  { id: "primo", es: "el primo", en: "cousin (male)", theme: "people", type: "noun", ex: "Mi primo juega futbol.", exEn: "My cousin plays football.", note: "Mexico writes futbol without an accent; Spain writes fútbol." },

  // ---- Places in town ----
  { id: "casa", es: "la casa", en: "house / home", theme: "town", type: "noun", ex: "Estoy en casa.", exEn: "I'm at home." },
  { id: "mercado", es: "el mercado", en: "market", theme: "town", type: "noun", ex: "El mercado abre temprano.", exEn: "The market opens early." },
  { id: "tienda", es: "la tienda", en: "shop", theme: "town", type: "noun", ex: "Voy a la tienda por tortillas.", exEn: "I'm going to the shop for tortillas." },
  { id: "banco", es: "el banco", en: "bank", theme: "town", type: "noun", ex: "El banco cierra a las cuatro.", exEn: "The bank closes at four." },
  { id: "hospital", es: "el hospital", en: "hospital", theme: "town", type: "noun", ex: "El hospital está cerca.", exEn: "The hospital is close." },
  { id: "farmacia", es: "la farmacia", en: "pharmacy", theme: "town", type: "noun", ex: "La farmacia abre las 24 horas.", exEn: "The pharmacy is open 24 hours." },
  { id: "escuela", es: "la escuela", en: "school", theme: "town", type: "noun", ex: "Los niños van a la escuela.", exEn: "The children go to school." },
  { id: "iglesia", es: "la iglesia", en: "church", theme: "town", type: "noun", ex: "La iglesia es muy antigua.", exEn: "The church is very old." },
  { id: "parque", es: "el parque", en: "park", theme: "town", type: "noun", ex: "Corro en el parque.", exEn: "I run in the park." },
  { id: "restaurante", es: "el restaurante", en: "restaurant", theme: "town", type: "noun", ex: "El restaurante está lleno.", exEn: "The restaurant is full." },
  { id: "plaza", es: "la plaza", en: "square (town square)", theme: "town", type: "noun", ex: "Nos vemos en la plaza.", exEn: "See you in the square." },
  { id: "zocalo", es: "el zócalo", en: "main square", theme: "town", type: "noun", ex: "Hay un concierto en el zócalo.", exEn: "There's a concert in the main square.", note: "Mexican. The main square of a town, above all in Mexico City." },
  { id: "bano", es: "el baño", en: "bathroom / toilet", theme: "town", type: "noun", ex: "¿Dónde está el baño?", exEn: "Where is the bathroom?" },
  { id: "oficina", es: "la oficina", en: "office", theme: "town", type: "noun", ex: "Trabajo en una oficina.", exEn: "I work in an office." },
  { id: "supermercado", es: "el supermercado", en: "supermarket", theme: "town", type: "noun", ex: "Compro leche en el supermercado.", exEn: "I buy milk at the supermarket." },
  { id: "biblioteca", es: "la biblioteca", en: "library", theme: "town", type: "noun", ex: "Estudio en la biblioteca.", exEn: "I study in the library." },
  { id: "museo", es: "el museo", en: "museum", theme: "town", type: "noun", ex: "El museo es gratis los domingos.", exEn: "The museum is free on Sundays." },
  { id: "colonia", es: "la colonia", en: "neighbourhood", theme: "town", type: "noun", ex: "Vivo en una colonia tranquila.", exEn: "I live in a quiet neighbourhood.", note: "Mexican usage. Spain: el barrio." },
  { id: "gasolinera", es: "la gasolinera", en: "gas station / petrol station", theme: "town", type: "noun", ex: "Hay una gasolinera en la esquina.", exEn: "There's a petrol station on the corner." },
  { id: "celular", es: "el celular", en: "mobile phone", theme: "travel", type: "noun", ex: "Se me olvidó el celular.", exEn: "I forgot my phone.", note: "Spain: el móvil." },
  { id: "computadora", es: "la computadora", en: "computer", theme: "travel", type: "noun", ex: "Trabajo en la computadora.", exEn: "I work on the computer.", note: "Spain: el ordenador." },

  // ---- Time and days ----
  { id: "hoy", es: "hoy", en: "today", theme: "time", type: "adverb", ex: "Hoy hace calor.", exEn: "It's hot today." },
  { id: "manana", es: "mañana", en: "tomorrow", theme: "time", type: "adverb", ex: "Nos vemos mañana.", exEn: "See you tomorrow.", note: "La mañana (with the article) means the morning." },
  { id: "ayer", es: "ayer", en: "yesterday", theme: "time", type: "adverb", ex: "Ayer llovió mucho.", exEn: "It rained a lot yesterday." },
  { id: "ahora", es: "ahora", en: "now", theme: "time", type: "adverb", ex: "Ahora no puedo.", exEn: "I can't right now." },
  { id: "temprano", es: "temprano", en: "early", theme: "time", type: "adverb", ex: "Me levanto temprano.", exEn: "I get up early." },
  { id: "tarde", es: "tarde", en: "late", theme: "time", type: "adverb", ex: "Es tarde, vámonos.", exEn: "It's late, let's go.", note: "La tarde (with the article) means the afternoon." },
  { id: "dia", es: "el día", en: "day", theme: "time", type: "noun", ex: "Es un día bonito.", exEn: "It's a beautiful day.", note: "Masculine, even though it ends in -a." },
  { id: "noche", es: "la noche", en: "night", theme: "time", type: "noun", ex: "La noche está fresca.", exEn: "The night is cool." },
  { id: "semana", es: "la semana", en: "week", theme: "time", type: "noun", ex: "La semana que viene voy a Puebla.", exEn: "Next week I'm going to Puebla." },
  { id: "mes", es: "el mes", en: "month", theme: "time", type: "noun", ex: "El mes pasado fui a la playa.", exEn: "Last month I went to the beach." },
  { id: "ano", es: "el año", en: "year", theme: "time", type: "noun", ex: "Feliz año nuevo.", exEn: "Happy new year." },
  { id: "hora", es: "la hora", en: "hour / time (of day)", theme: "time", type: "noun", ex: "Espero una hora.", exEn: "I'll wait an hour." },
  { id: "que-hora", es: "¿qué hora es?", en: "what time is it?", theme: "time", type: "phrase", ex: "Perdón, ¿qué hora es?", exEn: "Excuse me, what time is it?" },
  { id: "lunes", es: "el lunes", en: "Monday", theme: "time", type: "noun", ex: "El lunes empiezo.", exEn: "I start on Monday." },
  { id: "martes", es: "el martes", en: "Tuesday", theme: "time", type: "noun", ex: "El martes hay mercado.", exEn: "There's a market on Tuesday." },
  { id: "miercoles", es: "el miércoles", en: "Wednesday", theme: "time", type: "noun", ex: "El miércoles voy al gimnasio.", exEn: "On Wednesday I go to the gym." },
  { id: "jueves", es: "el jueves", en: "Thursday", theme: "time", type: "noun", ex: "El jueves cenamos juntos.", exEn: "On Thursday we have dinner together." },
  { id: "viernes", es: "el viernes", en: "Friday", theme: "time", type: "noun", ex: "El viernes salimos.", exEn: "On Friday we go out." },
  { id: "sabado", es: "el sábado", en: "Saturday", theme: "time", type: "noun", ex: "El sábado no trabajo.", exEn: "I don't work on Saturday." },
  { id: "domingo", es: "el domingo", en: "Sunday", theme: "time", type: "noun", ex: "El domingo comemos con la familia.", exEn: "On Sunday we eat with the family." },
];
