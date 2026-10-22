import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("wiki");
const repoRoot = path.dirname(root);
const errors = [];
const warnings = [];
const STATUSES = new Set(["active", "accepted", "draft", "needs-review", "deprecated"]);
const CODE_PREFIXES = [
  "app/", "admin/", "admin-api/", "ops-agent/", "components/", "lib/",
  "server/", "deploy/", "scripts/", ".github/",
  "next.config.ts", "proxy.ts", "package.json",
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function frontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return null;
  return text.slice(4, end);
}

function field(fm, key) {
  return fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function codeReferences(text, fm) {
  const refs = new Set();
  const resource = field(fm, "resource").replaceAll("`", "");
  if (resource) refs.add(resource);
  const section = text.match(/^# Code References\s*$([\s\S]*?)(?=^# |\s*$)/m);
  if (!section) return refs;
  for (const match of section[1].matchAll(/`([^`\n]+)`/g)) {
    const value = match[1].trim();
    if (!value || value.includes(" ")) continue;
    refs.add(value.replace(/\/$/, ""));
  }
  return refs;
}

function isCodeRef(ref) {
  return CODE_PREFIXES.some((prefix) => ref === prefix || ref.startsWith(prefix));
}

function matchesRef(file, ref) {
  if (ref.includes("*")) {
    const escaped = ref
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replaceAll("**", "\u0000")
      .replaceAll("*", "[^/]*")
      .replaceAll("\u0000", ".*");
    return new RegExp(`^${escaped}$`).test(file);
  }
  return file === ref || file.startsWith(`${ref.replace(/\/$/, "")}/`);
}

function changedSince(commit) {
  try {
    execFileSync("git", ["cat-file", "-e", `${commit}^{commit}`], { cwd: repoRoot, stdio: "ignore" });
    const out = execFileSync("git", ["diff", "--name-only", `${commit}..HEAD`], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    return out.split("\n").map((line) => line.trim()).filter(Boolean);
  } catch {
    return null;
  }
}

function checkLinks(file, text) {
  const body = text.replace(/^---[\s\S]*?\n---\n?/, "");
  for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim();
    if (!target || target.startsWith(("#", "http://", "https://", "mailto:"))) continue;
    if (target.includes("<") || target.includes(">")) continue;
    target = target.split("#", 1)[0].split("?", 1)[0];
    if (!target) continue;
    target = decodeURIComponent(target);
    const resolved = path.resolve(path.dirname(file), target);
    const finalPath = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()
      ? path.join(resolved, "index.md")
      : resolved;
    if (!fs.existsSync(finalPath)) {
      const rel = path.relative(root, file).replaceAll(path.sep, "/");
      errors.push(`${rel}: broken link ${match[1]}`);
    }
  }
}

const files = walk(root);
for (const file of files) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  const text = fs.readFileSync(file, "utf8");
  const isIndex = path.basename(file) === "index.md";
  const isLog = path.basename(file) === "log.md";
  const fm = frontmatter(text);

  if (isIndex || isLog) {
    if (rel !== "index.md" && fm !== null) {
      errors.push(`${rel}: sub-index must not have frontmatter`);
    }
    if (rel === "index.md" && (!fm || !/^okf_version:\s*["']?0\.1["']?\s*$/m.test(fm))) {
      errors.push("index.md: missing okf_version 0.1");
    }
    continue;
  }

  if (fm === null) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }
  if (!/^type:\s*\S+/m.test(fm)) errors.push(`${rel}: missing non-empty type`);
  if (!/^description:\s*\S+/m.test(fm)) warnings.push(`${rel}: missing description`);
  if (!/^timestamp:\s*\S+/m.test(fm)) warnings.push(`${rel}: missing timestamp`);
  checkLinks(file, text);

  const status = field(fm, "status");
  if (status && !STATUSES.has(status)) errors.push(`${rel}: unknown status ${status}`);
  if (status === "active") {
    const verifiedAt = field(fm, "verified_at");
    const verifiedCommit = field(fm, "verified_commit");
    if (!verifiedAt) errors.push(`${rel}: active page missing verified_at`);
    if (!verifiedCommit) errors.push(`${rel}: active page missing verified_commit`);
    if (!/^# Verification\s*$/m.test(text)) errors.push(`${rel}: active page missing # Verification`);

    if (verifiedCommit) {
      const changed = changedSince(verifiedCommit);
      if (changed === null) {
        errors.push(`${rel}: cannot compare code changes against ${verifiedCommit}`);
      } else {
        const refs = [...codeReferences(text, fm)].filter(isCodeRef);
        const stale = changed.filter((fileChanged) => refs.some((ref) => matchesRef(fileChanged, ref)));
        if (stale.length) {
          errors.push(`${rel}: stale since ${verifiedCommit}: ${stale.slice(0, 8).join(", ")}`);
        }
      }
    }
  }
}

console.log(`wiki files: ${files.length}`);
console.log(`warnings: ${warnings.length}`);
for (const w of warnings) console.log(`WARN ${w}`);
if (errors.length) {
  console.error(`errors: ${errors.length}`);
  for (const e of errors) console.error(`ERROR ${e}`);
  process.exit(1);
}
console.log("wiki validation: OK");
