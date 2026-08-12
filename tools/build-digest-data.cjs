const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "outputs/design-digest/digest-data.js");
const issueTitles = {
  1: ["当工具成为材料", "When tools become materials"],
  2: ["把 AI 交还给判断力", "Putting judgement back into AI"],
  3: ["让创作工具说清楚一点", "Make creative tools speak more clearly"],
  4: ["让屏幕，重新好玩起来", "Make screens playful again"],
  5: ["让界面，更有声音与秩序", "Give interfaces sound and order"],
};
const dates = { 1: "2026-07-10", 2: "2026-07-20", 3: "2026-07-28", 4: "2026-08-03", 5: "2026-08-10" };
const issueOneEnglish = [
  "Give AI a design sensibility", "Voice input for vibe coding", "A design inspiration feed from X", "A daily design inspiration index", "A CAPTCHA turned into a claw machine", "A visual motion vocabulary", "The Icones desktop app", "Mechanical dissections of everyday objects", "Miora, Tencent’s new AI creative tool", "A personal website study: NOOC",
];
const clean = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const attr = (markup, key) => (markup.match(new RegExp(`${key}="([^"]*)"`)) || [])[1] || "";

const entries = [];
for (let issue = 1; issue <= 5; issue += 1) {
  const html = fs.readFileSync(path.join(root, `outputs/design-digest/issue-00${issue}.html`), "utf8");
  const articles = [...html.matchAll(/<article class="story[^>]*>([\s\S]*?)<\/article>/g)];
  articles.forEach((match, index) => {
    const article = match[1];
    const heading = article.match(/<h2([^>]*)>([\s\S]*?)<\/h2>/) || [];
    const meta = article.match(/<div class="meta"([^>]*)>([\s\S]*?)<\/div>/) || [];
    const zhDescription = clean((article.match(/<p class="zh">([\s\S]*?)<\/p>/) || [])[1]);
    const enDescription = clean((article.match(/<p class="en">([\s\S]*?)<\/p>/) || [])[1]);
    const zhTitle = attr(heading[1] || "", "data-zh") || clean(heading[2]);
    const enTitle = attr(heading[1] || "", "data-en") || (issue === 1 ? issueOneEnglish[index] : zhTitle);
    const zhTags = attr(meta[1] || "", "data-zh") || clean(meta[2]) || (issue === 5 ? ["灵感 · 设计", "设计 · 灵感", "产品 · AI", "AI · 设计", "产品 · AI", "洞察 · AI", "个人网站 · 灵感", "设计 · ICON", "文章 · 设计", "文章 · 设计"][index] : "设计");
    const enTags = attr(meta[1] || "", "data-en") || zhTags;
    const image = (article.match(/<img src="([^"]+)"/) || [])[1] || (issue === 1 ? `images/issue-001/${String(index + 1).padStart(2, "0")}.png` : "");
    const url = (article.match(/<a href="([^"]+)"/) || [])[1] || "";
    entries.push({ id: `${String(issue).padStart(3, "0")}-${String(index + 1).padStart(2, "0")}`, issue, position: index + 1, date: dates[issue], image, url, zh: { title: zhTitle, description: zhDescription || zhTitle, tags: zhTags }, en: { title: enTitle, description: enDescription || enTitle, tags: enTags } });
  });
}
const payload = `window.DIGEST_ISSUES = ${JSON.stringify(Object.entries(issueTitles).map(([issue, [zh, en]]) => ({ issue: Number(issue), date: dates[issue], zh, en })), null, 2)};\nwindow.DIGEST_ENTRIES = ${JSON.stringify(entries, null, 2)};\n`;
fs.writeFileSync(output, payload);
console.log(`Wrote ${entries.length} entries to ${path.relative(root, output)}`);
