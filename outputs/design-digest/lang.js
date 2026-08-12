(() => {
  const key = "digest-language";
  function setLanguage(lang) {
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-zh][data-en]").forEach((node) => {
      node.innerHTML = node.dataset[lang];
    });
    document.querySelectorAll("[data-zh-placeholder][data-en-placeholder]").forEach((node) => {
      node.placeholder = node.dataset[`${lang}Placeholder`];
    });
    document.querySelectorAll(".zh,.en").forEach((node) => {
      node.hidden = node.classList.contains(lang === "zh" ? "en" : "zh");
    });
    document.querySelectorAll("[data-set-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLang === lang));
    });
    localStorage.setItem(key, lang);
    document.dispatchEvent(new CustomEvent("digest:language", { detail: { lang } }));
  }
  window.DigestLanguage = { get: () => document.body.dataset.lang || "zh", set: setLanguage };
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-set-lang]");
    if (button) setLanguage(button.dataset.setLang);
  });
  setLanguage(localStorage.getItem(key) || "zh");
  if (!document.querySelector('script[src="theme.js"]')) {
    const script = document.createElement("script");
    script.src = "theme.js";
    document.head.append(script);
  }
})();
