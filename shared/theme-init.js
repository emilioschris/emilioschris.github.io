/* =========================================================
   FIELD NOTES · theme start-up
   Load this in every page's <head>, before the stylesheets:
     <script src="shared/theme-init.js"></script>
   It applies the saved Day/Dusk choice before anything is drawn,
   so the page never flashes the wrong colours.
   ========================================================= */
(function () {
  document.documentElement.classList.add("js");
  try {
    var saved = localStorage.getItem("fieldnotes-theme");
    if (saved === "day" || saved === "dusk") document.documentElement.dataset.theme = saved;
  } catch (e) {}
})();
