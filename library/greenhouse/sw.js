/* =========================================================
   THE GREENHOUSE · offline helper (service worker)
   ---------------------------------------------------------
   Lets the Greenhouse open from the home screen with no
   signal. It only looks after pages in library/greenhouse/.

   Always network first: when you're online you get the newest
   files (so the ?v= cache busting keeps working), and a copy
   is kept for next time. Only when the network fails does it
   fall back to that copy.

   The page registers this file as sw.js?v=VERSION, so every
   version bump starts a fresh cache and clears the old one.
   ========================================================= */
const CACHE = "greenhouse-" + (new URL(self.location).searchParams.get("v") || "dev");
const FONTS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  // Keep the page itself ready straight away
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("greenhouse-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const ours = url.origin === self.location.origin || FONTS.includes(url.origin);
  if (!ours) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === "navigate" })
        .then((hit) => hit || (req.mode === "navigate" ? caches.match("./") : Response.error())))
  );
});
