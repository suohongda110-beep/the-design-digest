(() => {
  const key = "digest-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const getChoice = () => localStorage.getItem(key) || "system";
  const apply = (choice = getChoice()) => {
    const actual = choice === "system" ? (media.matches ? "dark" : "light") : choice;
    document.documentElement.dataset.theme = actual;
    document.documentElement.dataset.themeChoice = choice;
    document.querySelectorAll("button[data-theme-choice]").forEach((button) => button.setAttribute("aria-checked", String(button.dataset.themeChoice === choice)));
    const label = document.querySelector("[data-theme-label]");
    if (label) label.textContent = ({ light: "☀", dark: "◐", system: "◑" })[choice];
    document.dispatchEvent(new CustomEvent("digest:theme", { detail: { choice, actual } }));
  };
  function ensureControl() {
    if (document.querySelector("[data-theme-toggle]")) return;
    const target = document.querySelector(".header-actions") || document.querySelector(".site-header");
    if (!target) return;
    const control = document.createElement("div");
    control.className = "theme-control";
    control.innerHTML = '<button type="button" class="icon-button" data-theme-toggle aria-label="Theme"><span data-theme-label>◑</span></button><div class="theme-menu" role="radiogroup" aria-label="Theme"><button type="button" data-theme-choice="light" role="radio" aria-label="Light" data-zh="亮色" data-en="Light">亮色</button><button type="button" data-theme-choice="dark" role="radio" aria-label="Dark" data-zh="暗色" data-en="Dark">暗色</button><button type="button" data-theme-choice="system" role="radio" aria-label="System" data-zh="跟随系统" data-en="System">跟随系统</button></div>';
    target.append(control);
    window.DigestLanguage?.set(window.DigestLanguage.get());
  }
  ensureControl();
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    const choice = event.target.closest("button[data-theme-choice]");
    if (toggle) document.body.classList.toggle("theme-menu-open");
    if (choice) { localStorage.setItem(key, choice.dataset.themeChoice); apply(); document.body.classList.remove("theme-menu-open"); }
  });
  media.addEventListener("change", () => { if (getChoice() === "system") apply(); });
  apply();
})();
