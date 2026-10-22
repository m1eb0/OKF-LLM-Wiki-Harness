#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
function arg(name, fallback = "") {
  const i = args.indexOf(name);
  return i === -1 ? fallback : (args[i + 1] ?? fallback);
}
const target = path.resolve(arg("--target", "."));
const title = arg("--title", path.basename(target) + " LLM Wiki");
const skillRoot = path.resolve(import.meta.dirname, "..");
const assetRoot = path.join(skillRoot, "assets/init");

function fail(message) {
  console.error(`init-wiki: ${message}`);
  process.exit(1);
}
function write(rel, content) {
  const file = path.join(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) fail(`refusing to overwrite ${file}`);
  fs.writeFileSync(file, content);
}
function copy(rel) {
  const from = path.join(assetRoot, rel);
  const to = path.join(target, rel);
  if (!fs.existsSync(from)) fail(`missing initializer asset ${from}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fail(`refusing to overwrite ${to}`);
  fs.copyFileSync(from, to);
}
function domain(name) {
  return `# ${name[0].toUpperCase() + name.slice(1)}\n\n本目录按域维护 canonical 概念页；导航视图只链接，不复制内容。\n\n## Concepts\n\n_尚未创建。_\n`;
}
function lifecycle(name) {
  return `# ${name[0].toUpperCase() + name.slice(1)}\n\n跨域生命周期导航。只链接 canonical 页面，不复制内容。\n\n## Related Canonical Pages\n\n_待建立。_\n`;
}

if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) fail(`target is not a directory: ${target}`);
if (fs.existsSync(path.join(target, "wiki/index.md"))) {
  fail("wiki/index.md already exists; this is not an empty init target");
}
if (!fs.existsSync(path.join(assetRoot, "schema/wiki-schema.md")) ||
    !fs.existsSync(path.join(assetRoot, "scripts/verify-wiki.mjs"))) {
  fail(`cannot find initializer assets under ${assetRoot}`);
}

// raw
write("raw/index.md", `# Raw Sources\n\n不可变原始资料层。\n\n规则：\n\n\`\`\`text\n只追加，不修改已摄取内容\n保留原始链接/提交/日期\nwiki/ 只保存合成后的知识\n\`\`\`\n\n目录：\n\n- \`external/\` - 外部文章、规范、访谈、会议记录\n- \`project/\` - 需求、计划、review、事故记录\n- \`code/\` - 需要逐字保留的代码/配置摘录\n\n当前为空。\n`);
for (const dir of ["raw/external", "raw/project", "raw/code"]) {
  const file = path.join(target, dir, ".gitkeep");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, "");
}

// schema + verifier
copy("schema/wiki-schema.md");
copy("scripts/verify-wiki.mjs");
write("schema/index.md", "# Schema\n\nAgent 读写、链接和校验规则。\n\n- [Wiki Schema](./wiki-schema.md)\n");

// wiki root
write("wiki/index.md", `---\nokf_version: "0.1"\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(title + "；面向 Agent 与人工，覆盖项目生命周期。")}\n---\n\n# ${title}\n\nWiki is the map. Code is the ground.\n\n## Start Here\n\n- [Start Here](start-here/) - 项目概览和 Agent 入场。\n\n## Lifecycle Views\n\n- [Develop](lifecycle/develop/)\n- [Test](lifecycle/test/)\n- [Ship](lifecycle/ship/)\n- [Operate](lifecycle/operate/)\n- [Evolve](lifecycle/evolve/)\n\n## System Domains\n\n- [Product](product/)\n- [Architecture](architecture/)\n- [Frontend](frontend/)\n- [Backend](backend/)\n- [Data](data/)\n- [Testing](testing/)\n- [Platform](platform/)\n\n## Delivery and Operations\n\n- [Operations](operations/)\n- [Runbooks](operations/runbooks/)\n- [Decisions](decisions/)\n\n## Reference\n\n- [Sources](sources/)\n- [Templates](templates/)\n\n## Knowledge System\n\n- [Raw Sources](../raw/index.md)\n- [Wiki Schema](../schema/wiki-schema.md)\n`);
write("wiki/log.md", `# Wiki Log\n\n- **Init**: Created OKF v0.1 skeleton and verification gate.\n`);
write("wiki/start-here/index.md", "# Start Here\n\nAgent 入场、项目概览和覆盖。\n\n## Concepts\n\n_尚未创建。_\n");

for (const name of ["product", "architecture", "frontend", "backend", "data", "platform", "testing", "decisions", "sources", "operations", "operations/runbooks"]) {
  write(`wiki/${name}/index.md`, domain(path.basename(name)));
}
for (const name of ["develop", "test", "ship", "operate", "evolve"]) {
  write(`wiki/lifecycle/${name}/index.md`, lifecycle(name));
}

// templates
fs.mkdirSync(path.join(target, "wiki/templates"), { recursive: true });
for (const name of ["concept", "decision", "runbook", "source"]) {
  copy(`wiki/templates/${name}.md`);
}
copy("wiki/templates/index.md");

// package.json script
const pkgPath = path.join(target, "package.json");
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.scripts ??= {};
  if (!pkg.scripts["verify:wiki"]) {
    pkg.scripts["verify:wiki"] = "node scripts/verify-wiki.mjs";
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log("updated package.json: verify:wiki");
  } else {
    console.log("package.json already has verify:wiki");
  }
} else {
  console.log("no package.json; run verification with: node scripts/verify-wiki.mjs");
}

// AGENT.md
const agentPath = [path.join(target, "AGENTS.md"), path.join(target, "AGENT.md")].find((file) => fs.existsSync(file)) ?? path.join(target, "AGENTS.md");
const wikiRules = `\n## LLM Wiki\n\n- Read \`schema/wiki-schema.md\` before changing wiki pages.\n- \`wiki/\` is an OKF v0.1 bundle; \`raw/\` is append-only.\n- Code is the source of truth; active pages need \`verified_at\`, \`verified_commit\`, and \`# Verification\`.\n- Run \`pnpm verify:wiki\` (or \`node scripts/verify-wiki.mjs\`) after Wiki changes.\n- Update \`wiki/index.md\` and \`wiki/log.md\` when adding/moving concepts.\n`;
if (fs.existsSync(agentPath)) {
  const existing = fs.readFileSync(agentPath, "utf8");
  if (!existing.includes("## LLM Wiki")) fs.appendFileSync(agentPath, wikiRules);
} else {
  fs.writeFileSync(agentPath, `# Agent Notes\n${wikiRules}`);
}

console.log(`initialized OKF wiki at ${target}`);
console.log("next: inspect schema/indexes, add CI verify:wiki, then create code-grounded concepts");
