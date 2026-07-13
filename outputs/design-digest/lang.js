(() => {
  const titles = [
    ["让 AI 也能拥有「设计感」", "Give AI a design sensibility"],
    ["适合 vibe coding 的语音输入法", "Voice input for vibe coding"],
    ["来自 X 的设计灵感汇集", "A design inspiration feed from X"],
    ["设计灵感采集", "A daily design inspiration index"],
    ["把人机验证变成了抓娃娃", "A CAPTCHA turned into a claw machine"],
    ["动画词汇对照表", "A visual motion vocabulary"],
    ["Icones 桌面客户端", "The Icones desktop app"],
    ["常见物品机械结构剖析", "Mechanical dissections of everyday objects"],
    ["腾讯新 AI 生成工具 Miora", "Miora, Tencent’s new AI creative tool"],
    ["个人主页网站设计 · NOOC", "A personal website study: NOOC"],
  ];
  const meta = [
    ["AI · 设计", "AI · Design"],
    ["产品 · 输入法", "Product · Voice input"],
    ["灵感 · 设计", "Inspiration · Design"],
    ["灵感 · 设计", "Inspiration · Design"],
    ["交互 · 灵感", "Interaction · Inspiration"],
    ["设计 · 动效", "Design · Motion"],
    ["设计 · 产品", "Design · Product"],
    ["设计 · 动效 · 灵感", "Design · Motion · Inspiration"],
    ["AI · 设计", "AI · Design"],
    ["灵感 · 个人网站", "Inspiration · Personal site"],
  ];
  function setLanguage(lang) {
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document
      .querySelectorAll("[data-zh][data-en]")
      .forEach((n) => (n.innerHTML = n.dataset[lang]));
    document.querySelectorAll(".story").forEach((s, i) => {
      const c = s.querySelector(".copy"),
        h = c?.querySelector("h2"),
        m = s.querySelector(".meta"),
        a = c?.querySelector("a");
      if (h) h.textContent = titles[i][lang === "zh" ? 0 : 1];
      if (m) m.textContent = meta[i][lang === "zh" ? 0 : 1];
      if (a)
        a.textContent = lang === "zh" ? "阅读原文 ↗" : "Read the source ↗";
    });
    document
      .querySelectorAll(".zh,.en")
      .forEach(
        (n) => (n.hidden = n.classList.contains(lang === "zh" ? "en" : "zh")),
      );
    document
      .querySelectorAll("[data-set-lang]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)),
      );
    localStorage.setItem("digest-language", lang);
  }
  document
    .querySelectorAll("[data-set-lang]")
    .forEach((b) =>
      b.addEventListener("click", () => setLanguage(b.dataset.setLang)),
    );
  setLanguage(localStorage.getItem("digest-language") || "zh");
})();
