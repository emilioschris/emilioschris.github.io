// ---------------------------------------------------------
// Light / dark mode toggle
// ---------------------------------------------------------
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

// Which theme is showing right now? (a saved choice, or the device setting)
function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

toggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  // Remember the choice for next visit (wrapped in try in case the browser blocks storage)
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------------------------------------------------------
// Put the current year in the footer
// ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();
