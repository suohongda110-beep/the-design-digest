(() => {
  const entries = window.DIGEST_ENTRIES || [];
  const issues = window.DIGEST_ISSUES || [];
  const state = { query: "", tag: "all", limit: 12, sort: "newest" };
  const grid = document.querySelector("[data-resource-grid]");
  const count = document.querySelector("[data-result-count]");
  const empty = document.querySelector("[data-empty-state]");
  const loadMore = document.querySelector("[data-load-more]");
  const input = document.querySelector("[data-search]");
  const lang = () => window.DigestLanguage?.get() || "zh";
  const tags = (entry) => entry[lang()].tags.split(" · ");
  const image = (entry) => entry.image ? `<img src="${entry.image}" alt="${entry[lang()].title}" loading="lazy">` : `<span class="resource-fallback">${entry[lang()].title.slice(0, 2)}</span>`;
  function matches(entry) {
    const field = `${entry.zh.title} ${entry.en.title} ${entry.zh.description} ${entry.en.description} ${entry.zh.tags} ${entry.en.tags} ${entry.issue}`.toLowerCase();
    return (!state.query || field.includes(state.query.toLowerCase())) && (state.tag === "all" || tags(entry).includes(state.tag));
  }
  function render() {
    if (!grid) return;
    const all = entries.filter(matches).sort((a, b) => state.sort === "issue" ? a.issue - b.issue || a.position - b.position : b.issue - a.issue || a.position - b.position);
    const shown = all.slice(0, state.limit);
    grid.innerHTML = shown.map((entry) => `<article class="resource-card"><a class="resource-image" href="${entry.url || `issue-${String(entry.issue).padStart(3, "0")}.html`}" ${entry.url ? 'target="_blank" rel="noopener"' : ""}>${image(entry)}</a><div class="resource-copy"><div class="resource-meta"><span>${entry[lang()].tags}</span><span>${String(entry.issue).padStart(3, "0")} / ${String(entry.position).padStart(2, "0")}</span></div><h2>${entry[lang()].title}</h2><p>${entry[lang()].description}</p><a class="resource-link" href="${entry.url || `issue-${String(entry.issue).padStart(3, "0")}.html`}" ${entry.url ? 'target="_blank" rel="noopener"' : ""}>${entry.url ? (lang() === "zh" ? "查看资源 →" : "Visit resource →") : (lang() === "zh" ? "查看本期 →" : "View issue →")}</a></div></article>`).join("");
    count.textContent = lang() === "zh" ? `共 ${all.length} 条收录` : `${all.length} entries`;
    empty.hidden = all.length > 0;
    loadMore.hidden = shown.length >= all.length;
    loadMore.textContent = lang() === "zh" ? "载入更多精选" : "Load more";
  }
  document.addEventListener("click", (event) => {
    const tag = event.target.closest("[data-tag]"); const sort = event.target.closest("[data-sort]");
    if (tag) { state.tag = tag.dataset.tag; state.limit = 12; document.querySelectorAll("[data-tag]").forEach((b) => b.classList.toggle("is-active", b === tag)); render(); }
    if (sort) { state.sort = sort.dataset.sort; document.querySelectorAll("[data-sort]").forEach((b) => b.classList.toggle("is-active", b === sort)); render(); }
    if (event.target.closest("[data-load-more]")) { state.limit += 12; render(); }
  });
  input?.addEventListener("input", () => { state.query = input.value.trim(); state.limit = 12; render(); });
  document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input?.focus(); } });
  document.addEventListener("digest:language", render);
  render();
})();
