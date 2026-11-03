/* =========================================================
   PARATIRITIRIO · hand-updated figures (a dated snapshot)
   ---------------------------------------------------------
   These sources have no API, so the monthly job can't fetch
   them. Everything else on the Pulse comes from pulse-data.js.

   HOW TO UPDATE (about once a month)
   1. Property sales: open the Department of Lands and Surveys
      "Contracts of Sales" page (link below), open the PDF, and
      copy the PANCYPRIAN 2026 row (last page) into months, plus
      each district's 2026 total. Change asOf.
   2. Company registrations: open the Registrar of Companies
      knowledge base (link below), find "Registration of business
      entities until …", and copy the Companies Registration row.
      Copy the total from "Total registered business entities".
   3. Bad loans: the Central Bank publishes the NPL ratio monthly;
      until its own table is linked here, the figure comes from a
      news report of it (labelled News).
   4. Change asOf on anything you touch, then ask Claude to run
      tools/check.js.

   Every figure keeps its source, its evidence kind and the date
   it describes.
   ========================================================= */

window.PARATIRITIRIO = window.PARATIRITIRIO || {};

PARATIRITIRIO.snapshot = {

  /* Pulse cards with no API */
  propertySales: {
    label: "Property sales",
    unit: "sales contracts deposited per month",
    months: [["2026-01", 1411], ["2026-02", 1537], ["2026-03", 1761], ["2026-04", 1611], ["2026-05", 1723],
             ["2026-06", 1964], ["2026-07", 2040], ["2026-08", 1241], ["2026-09", 1681]],
    yearToDate: { months: "January to September 2026", total: 14969, changePct: 14 },
    lastMonthChangePct: 13,   /* September 2026 vs September 2025, from the same PDF */
    byDistrict2026: { nicosia: 3163, limassol: 4860, larnaca: 3291, famagusta: 656, paphos: 2999 },
    source: { title: "Contracts of Sales 2025 and 2026 (PDF, dated 5 Oct 2026)", publisher: "Department of Lands and Surveys", kind: "official",
              url: "https://portal.dls.moi.gov.cy/wp-content/uploads/2026/02/Contracts-of-Sale-2025-2026.pdf", page: "https://portal.dls.moi.gov.cy/en/?p=81332" },
    note: "Contracts deposited at the land registry, government-controlled areas only. The district figures add up to the island total.",
    asOf: "2026-10-05",
  },

  companyRegistrations: {
    label: "Company registrations",
    unit: "new companies registered per month",
    months: [["2026-01", 910], ["2026-02", 1420], ["2026-03", 1745], ["2026-04", 1448], ["2026-05", 1489], ["2026-06", 1527], ["2026-07", 1540]],
    totalRegistered: { date: "2026-07-31", companies: 211471, partnerships: 4824, businessNames: 51126, overseas: 1224 },
    source: { title: "Registration of business entities until 31/07/2026", publisher: "Department of Registrar of Companies and Intellectual Property", kind: "official",
              url: "https://companies.gov.cy/en/knowledgebase/registration-of-business-entities-until-31-07-2026" },
    source2: { title: "Total registered business entities as at 31/07/2026", publisher: "Department of Registrar of Companies and Intellectual Property", kind: "official",
               url: "https://companies.gov.cy/en/knowledgebase/total-registered-business-entities-as-at-31-07-2026" },
    note: "Read from the Registrar's published charts. Many registered companies are holding or trading vehicles with no staff in Cyprus.",
    asOf: "2026-08-10",
  },

  npl: {
    label: "Non-performing loans",
    unit: "% of all bank loans",
    months: [["2026-06", 1.6], ["2026-07", 1.5]],
    coverage: { "2026-06": 64.9, "2026-07": 64.5 },
    source: { title: "Cyprus banks' non-performing loan ratio edges down in July", publisher: "Cyprus Mail (reporting Central Bank of Cyprus data)", kind: "news",
              url: "https://cyprus-mail.com/2026/10/19/cyprus-banks-non-performing-loan-ratio-edges-down-in-july" },
    note: "Labelled News: the Central Bank's own monthly table should replace this source.",
    asOf: "2026-10-19",
  },

  /* Who benefits: the ECB's household survey (2021 wave, published July 2023) */
  hfcs: {
    wave: "2021",
    unit: "€ thousand, median net wealth per household",
    cyprus: 200.4,
    euroArea: 123.5,
    top10Share: { cyprus: 46.1, euroArea: 53.4 },
    gini: { cyprus: 0.633, euroArea: 0.694 },
    byAge: [  /* age of the household's reference person: [label, Cyprus, euro area] */
      ["16 to 34", 161.8, 21.7], ["35 to 44", 187.8, 88.4], ["45 to 54", 274.8, 146.8],
      ["55 to 64", 275.2, 195.2], ["65 to 74", 196.8, 185.3], ["75 and over", 115.3, 144.4],
    ],
    byHousing: [  /* [label, Cyprus, euro area] */
      ["Own outright", 300.7, 266.6], ["Own with a mortgage", 232.8, 193.2], ["Rent or other", 6.6, 12.0],
    ],
    source: { title: "HFCS Statistical Tables, wave 2021 (tables A3 and J4)", publisher: "European Central Bank", kind: "official",
              url: "https://www.ecb.europa.eu/home/pdf/research/hfcn/HFCS_Statistical_Tables_Wave_2021_July2023.pdf" },
    note: "A survey: these figures carry sampling error (the tables give standard errors). The 2021 wave is the latest published.",
    asOf: "2023-07",
  },

  millionaires: {
    count: 24000,
    shareOfAdults: "close to 3%",
    year: "2025",
    source: { title: "Global wealth hits new high as inequality persists, UBS report finds", publisher: "Politis (reporting the UBS Global Wealth Report 2026)", kind: "news",
              url: "https://en.politis.com.cy/news/economy/1017479/global-wealth-hits-new-high-as-inequality-persists-ubs-report-finds" },
    original: { title: "Global Wealth Report 2026", publisher: "UBS", kind: "report", url: "https://www.ubs.com/global/en/wealth-management/insights/global-wealth-report.html" },
    note: "Labelled News: UBS's report blocks automated downloads, so the figure is taken from Politis's report of it. Check it in the UBS report.",
    asOf: "2026-07-07",
  },

  /* Companies: a vendor's public headline, cited with a link only */
  infobel: {
    count: 255093,
    source: { title: "Company data in Cyprus, by industry", publisher: "InfobelPRO (commercial data vendor)", kind: "company",
              url: "https://www.infobelpro.com/companies/cyprus" },
    note: "A vendor's own public headline, not an official count. Its paid data is not used here.",
    asOf: "2026-11-02",
  },

  links: {
    deeper: [
      { title: "StatWatch", publisher: "StockWatch with Bank of Cyprus", url: "http://www.statwatch.com.cy", desc: "Free portal of Cyprus economic data from official sources." },
      { title: "Dashboard for Short-Term Economic Indicators", publisher: "CYSTAT", url: "https://www.cystat.gov.cy/en/Dashboards/ShortTermInds", desc: "CYSTAT's own interactive dashboard." },
      { title: "CYSTAT database", publisher: "CYSTAT", url: "https://cystatdb.cystat.gov.cy/pxweb/en/8.CYSTAT-DB/", desc: "Every CYSTAT table, with downloads." },
      { title: "Cyprus Stock Exchange", publisher: "CSE", url: "https://www.cse.com.cy/en-GB/home/", desc: "Listed companies and their announcements." },
      { title: "Project Bank", publisher: "Invest Cyprus", url: "https://www.projectbank.org.cy/projects/", desc: "Projects seeking investors. Listings are for registered investors only, so none are copied here." },
    ],
  },
};
