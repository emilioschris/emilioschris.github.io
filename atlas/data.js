/* =========================================================
   THE ATLAS · your data
   ---------------------------------------------------------
   This is the only file you need to edit.

   Each country has:
     name    How the name is shown on the page.
     code    The country's 3-letter ISO code (e.g. "GRC" for Greece).
             Look one up here: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
     status  "visited"  → filled terracotta, stamped VISITED
             "want"     → dashed ochre outline, stamped ON THE LIST
             "next"     → like "want", plus the NEXT EXPEDITION highlight
     note    Your own field note. Leave it as "" until you write one.
     dot     (Only for tiny countries.) [latitude, longitude] for a
             small clickable dot, because the country is too small to see.

   To add a country: copy a line, change the name and code, and
   make sure the line ends with a comma.
   ========================================================= */

const ATLAS = {
  // The two origin points: shown as small crosshairs, joined by a dotted route
  origins: [
    { label: "35.1°N 33.4°E", lat: 35.1, lon: 33.4 },
    { label: "40.4°N 80.0°W", lat: 40.4, lon: -80.0 },
  ],

  countries: [
    // ---- Visited ----
    { name: "Cyprus",         code: "CYP", status: "visited", note: "" },
    { name: "Greece",         code: "GRC", status: "visited", note: "" },
    { name: "Georgia",        code: "GEO", status: "visited", note: "" },
    { name: "United Kingdom", code: "GBR", status: "visited", note: "Visited England and Scotland." },
    { name: "Denmark",        code: "DNK", status: "visited", note: "" },
    { name: "Sweden",         code: "SWE", status: "visited", note: "" },
    { name: "Canada",         code: "CAN", status: "visited", note: "" },
    { name: "United States",  code: "USA", status: "visited", note: "" },
    { name: "Peru",           code: "PER", status: "visited", note: "" },
    { name: "France",         code: "FRA", status: "visited", note: "" },
    { name: "Spain",          code: "ESP", status: "visited", note: "" },
    { name: "Italy",          code: "ITA", status: "visited", note: "" },
    { name: "Vatican City",   code: "VAT", status: "visited", note: "", dot: [41.903, 12.453] },
    { name: "Hungary",        code: "HUN", status: "visited", note: "" },
    { name: "Egypt",          code: "EGY", status: "visited", note: "" },
    { name: "Zimbabwe",       code: "ZWE", status: "visited", note: "" },
    { name: "South Africa",   code: "ZAF", status: "visited", note: "" },
    { name: "Tanzania",       code: "TZA", status: "visited", note: "" },
    { name: "Kenya",          code: "KEN", status: "visited", note: "" },
    { name: "Botswana",       code: "BWA", status: "visited", note: "" },
    { name: "Zambia",         code: "ZMB", status: "visited", note: "" },
    { name: "Ireland",        code: "IRL", status: "visited", note: "" },

    // ---- Want to visit ----
    { name: "Japan",          code: "JPN", status: "next",    note: "" },
  ],
};
