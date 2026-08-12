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
const issueFiveCopy = [
  ["组件音效库", "Component Sound Library", "为 shadcn/ui 提供语义化音频反馈。", "Semantic audio feedback for shadcn/ui components."],
  ["SVG 矢量形状集合", "SVG Shape Collection", "一键复制抽象形状，用于快速建立视觉语言。", "Copy abstract SVG shapes in one click to build a visual language quickly."],
  ["Moxt 团队协作 AI", "Moxt Team AI", "让团队把想法、讨论和交付放在同一个协作空间里。", "A shared space for teams to turn ideas and discussion into shipped work."],
  ["MeiGen 提示词库", "MeiGen Prompt Library", "从可复用的提示词和案例开始探索图像创作。", "Explore image making through reusable prompts and examples."],
  ["Weavy AI 工作流", "Weavy AI Workflows", "把模型、工具和步骤连成可扩展的节点画布。", "Connect models, tools, and steps on an extensible visual canvas."],
  ["UI/UX Vibe Coding 指南", "UI/UX Vibe Coding Guide", "给设计师一套更清晰的 AI 编程工作框架。", "A clearer AI coding framework for designers."],
  ["设计师个人博客", "Designer’s Personal Blog", "用多图、交互和个人视角记录设计实践。", "A personal view of design practice through images and interaction."],
  ["磨砂质感图标库", "Frosted Glass Icon Library", "一组可复制的磨砂质感 SVG 图标。", "A copy-ready set of frosted-glass SVG icons."],
  ["设计系统 101", "Design Systems 101", "从基础概念开始理解一致性的设计系统。", "A clear introduction to the foundations of design systems."],
  ["Elementum 原子设计系统", "Elementum Atomic Design System", "从网格、变量到组件的原子设计系统资源。", "An atomic design system resource spanning grids, variables, and components."],
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
    const enTitle = attr(heading[1] || "", "data-en") || (issue === 1 ? issueOneEnglish[index] : issue === 5 ? issueFiveCopy[index][1] : zhTitle);
    const zhTags = attr(meta[1] || "", "data-zh") || clean(meta[2]) || (issue === 5 ? ["灵感 · 设计", "设计 · 灵感", "产品 · AI", "AI · 设计", "产品 · AI", "洞察 · AI", "个人网站 · 灵感", "设计 · ICON", "文章 · 设计", "文章 · 设计"][index] : "设计");
    const enTags = attr(meta[1] || "", "data-en") || zhTags;
    const image = (article.match(/<img src="([^"]+)"/) || [])[1] || (issue === 1 ? `images/issue-001/${String(index + 1).padStart(2, "0")}.png` : "");
    const url = (article.match(/<a href="([^"]+)"/) || [])[1] || "";
    const zhCopy = issue === 5 ? issueFiveCopy[index][2] : zhDescription || zhTitle;
    const enCopy = issue === 5 ? issueFiveCopy[index][3] : enDescription || enTitle;
    entries.push({ id: `${String(issue).padStart(3, "0")}-${String(index + 1).padStart(2, "0")}`, issue, position: index + 1, date: dates[issue], image, url, zh: { title: zhTitle, description: zhCopy, tags: zhTags }, en: { title: enTitle, description: enCopy, tags: enTags } });
  });
}
const payload = `window.DIGEST_ISSUES = ${JSON.stringify(Object.entries(issueTitles).map(([issue, [zh, en]]) => ({ issue: Number(issue), date: dates[issue], zh, en })), null, 2)};\nwindow.DIGEST_ENTRIES = ${JSON.stringify(entries, null, 2)};\n`;
fs.writeFileSync(output, payload);
console.log(`Wrote ${entries.length} entries to ${path.relative(root, output)}`);
