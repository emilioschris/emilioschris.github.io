/* =========================================================
   AKADIMIA · your data
   ---------------------------------------------------------
   The hand-picked part of the library. (The daily stream is
   written automatically into feed-data.js; its sources, people
   and topic keywords live in feed-config.json.)

   highlights   Things I've chosen to feature. They lead the page.
                When I say "highlight: …", add one here:
                  { title, link, source, school, date, topics, note, kind }
                  school   "skidmore" | "lse" | "ucl" | null
                  date     "YYYY-MM-DD" (when it was published)
                  topics   ids from feed-config.json, e.g. ["energy-climate"]
                  note     one line on why it's here (optional)
                  kind     "paper" | "article" | "talk" | "reading" | "data"

   news         Hand-added news for a school without a feed
                (Skidmore): same shape, without note.

   schools      The three schools: logo, founding, centres. The logos
                are the universities' own (img/logos/), used as published.
   ========================================================= */

window.AKADIMIA = window.AKADIMIA || {};

AKADIMIA.highlights = [
];

AKADIMIA.news = [
];

AKADIMIA.schools = [
  {
    id: "skidmore",
    logo: "img/logos/skidmore.png",
    logoAlt: "Skidmore College logo",
    name: "Skidmore College",
    short: "Skidmore",
    place: "Saratoga Springs, New York",
    founded: 1903,
    foundedNote: "Began in 1903 as a women's industrial club founded by Lucy Skidmore Scribner, chartered as a school in 1911, and became Skidmore College in 1922.",
    foundedSource: { title: "Wikipedia: Skidmore College", url: "https://en.wikipedia.org/w/index.php?title=Skidmore_College&oldid=1378303900" },
    course: "BA Economics",
    tone: "olive",
    centres: [
      { name: "Department of Economics", url: "https://www.skidmore.edu/economics/" },
      { name: "Environmental Studies and Sciences", url: "https://www.skidmore.edu/environmental-studies/" },
    ],
  },
  {
    id: "lse",
    logo: "img/logos/lse.svg",
    logoAlt: "LSE, The London School of Economics and Political Science logo",
    name: "London School of Economics and Political Science",
    short: "LSE",
    place: "London",
    founded: 1895,
    foundedNote: "Founded in 1895 by Beatrice and Sidney Webb, Graham Wallas and George Bernard Shaw.",
    foundedSource: { title: "Wikipedia: London School of Economics", url: "https://en.wikipedia.org/w/index.php?title=London_School_of_Economics&oldid=1379559268" },
    course: "General Course",
    tone: "terracotta",
    centres: [
      { name: "Grantham Research Institute on Climate Change and the Environment", url: "https://www.lse.ac.uk/granthaminstitute" },
      { name: "Centre for Economic Performance", url: "https://cep.lse.ac.uk/" },
      { name: "Department of Economics", url: "https://www.lse.ac.uk/economics" },
    ],
  },
  {
    id: "ucl",
    logo: "img/logos/ucl.svg",
    logoAlt: "UCL logo",
    name: "University College London",
    short: "UCL",
    place: "London",
    founded: 1826,
    foundedNote: "Founded on 11 February 1826 as an alternative to the Anglican universities of Oxford and Cambridge.",
    foundedSource: { title: "Wikipedia: University College London", url: "https://en.wikipedia.org/w/index.php?title=University_College_London&oldid=1379522257" },
    course: "MSc Economics and Policy of Energy and the Environment, The Bartlett",
    tone: "aegean",
    centres: [
      { name: "UCL Institute for Sustainable Resources", url: "https://www.ucl.ac.uk/bartlett/environment-energy-resources/sustainable/about",
        note: "Research on energy transitions, climate finance, the circular economy, innovation and sustainable food systems." },
      { name: "UCL Energy Institute", url: "https://www.ucl.ac.uk/bartlett/energy",
        note: "Research, teaching and policy support on climate change and energy security." },
      { name: "The Bartlett School of Environment, Energy and Resources", url: "https://www.bartlett.ucl.ac.uk/bseer",
        note: "Home to both institutes, within The Bartlett, UCL's Faculty of the Built Environment." },
    ],
  },
];
