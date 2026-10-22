# OKF LLM Wiki Harness

A portable project-level **Agent Skill** for working with a code-grounded,
OKF v0.1 LLM Wiki.

It is a skill, not a DSH plugin. It works with hosts that support the
`SKILL.md` convention, and with instruction-only hosts through pointer files.

## What it does

- routes a task to the minimum relevant Wiki pages;
- verifies Wiki claims against current code/config;
- records deferred Wiki work in a durable backlog;
- audits the Wiki with read-only subagents;
- decides whether new facts update an existing page or need a new one;
- initializes an OKF Wiki skeleton in another repository.

## Install

### Interactive

```bash
git clone git@github.com:m1eb0/OKF-LLM-Wiki-Harness.git
cd OKF-LLM-Wiki-Harness
./install.sh --target /path/to/your/repo
```

You will get a numbered menu:

```text
1) DSH
2) Claude Code
3) Codex
4) Cursor
5) Gemini CLI
6) GitHub Copilot
7) Generic AGENTS.md
8) Windsurf
9) All
```

Enter one or more numbers, e.g. `1,4,7`.

### Non-interactive

```bash
./install.sh --target /path/to/your/repo \
  --agents dsh,claude,cursor,agents
```

Use `--force` to replace an existing installed skill directory. Use
`--dry-run` to print actions without writing.

## Install targets

| Agent | Project install |
|---|---|
| DSH | `.agents/skills/harness` |
| Claude Code | `.claude/skills/harness` |
| Codex | `.codex/skills/harness` |
| Cursor | `.cursor/skills/harness` + `.cursor/rules/harness.mdc` |
| Gemini CLI | `.gemini/skills/harness` + `GEMINI.md` pointer |
| GitHub Copilot | `.agents/skills/harness` + `.github/copilot-instructions.md` |
| Generic | `.agents/skills/harness` + `AGENTS.md` |
| Windsurf | `.agents/skills/harness` + `.windsurf/rules/harness.md` |

Native skill paths follow these agents' project-level skill conventions. If a
host version differs, use the generic `AGENTS.md` or instruction pointer.

The installer writes a managed `harness-skill:begin` block to instruction files.
It refuses to overwrite existing files silently; `--force` is explicit.

## Init another repo

```bash
node .agents/skills/harness/scripts/init-wiki.mjs \
  --target /absolute/path/to/repo \
  --title "Project Wiki"
```

If installed under another path, substitute that skill directory.

It refuses to overwrite an existing `wiki/index.md`. It creates structure and
guardrails only; it does not copy project facts or create active concept pages.

## Modes

| Mode | Purpose |
|---|---|
| `daily` | normal code/Wiki workflow and update gate |
| `explain` | Wiki-grounded answers with evidence and gaps |
| `audit` | read-only subagent fact-check, full or partial |
| `placement` | update existing page vs create a new canonical page |
| `backlog` | durable queue for deferred Wiki work |
| `init` | bootstrap an OKF Wiki skeleton in an empty repo |

See `references/routes.md` first.

## Requirements

- Node.js 22+ for the initializer and verifier.
- Git for the verifier's stale check when active pages exist.
- Bash for `install.sh`.
- No package installation is required.

## Test

```bash
bash tests/init-smoke.sh
bash tests/install-smoke.sh
```

## Design

```text
Wiki is the map.
Code is the ground.
Deferred work goes in the backlog.
```

Do not mark a page `active` without code verification. Do not use the backlog to
bypass a stale-page gate.

## Files

```text
SKILL.md
install.sh
references/
  routes.md
  explain.md
  audit.md
  placement.md
  backlog.md
  update-protocol.md
  anti-patterns.md
  init.md
scripts/
  init-wiki.mjs
assets/init/
  schema/wiki-schema.md
  scripts/verify-wiki.mjs
  wiki/templates/
tests/
  init-smoke.sh
  install-smoke.sh
```
