# OKF LLM Wiki Harness

Project-level DSH skill for working with a code-grounded LLM Wiki.

It is a **skill**, not a DSH plugin. It teaches an agent to:

- route a task to the minimum relevant Wiki pages;
- verify Wiki claims against current code/config;
- record deferred Wiki work in a durable backlog;
- audit the Wiki with read-only subagents;
- decide whether new facts update an existing page or need a new one;
- initialize an OKF v0.1 Wiki in another repository.

## Install

Install this repository as a project skill:

```bash
mkdir -p .agents/skills
git clone git@github.com:m1eb0/OKF-LLM-Wiki-Harness.git .agents/skills/harness
```

Or copy the directory:

```bash
cp -R /path/to/harness-skill .agents/skills/harness
```

The resulting layout must be:

```text
.agents/skills/harness/
  SKILL.md
  references/
  scripts/
  assets/
```

The `SKILL.md` frontmatter is deliberately limited to the DSH skill contract:

```yaml
---
name: harness
description: ...
---
```

## Modes

| Mode | Purpose |
|---|---|
| `daily` | normal code/Wiki workflow and update gate |
| `explain` | Wiki-grounded answers with evidence and gaps |
| `audit` | read-only subagent fact-check, full or partial |
| `placement` | update existing page vs create a new canonical page |
| `backlog` | durable queue for deferred Wiki work |
| `init` | bootstrap an OKF Wiki skeleton in an empty repo |

See `references/` for each protocol. Start with `references/routes.md`.

## Init another repo

```bash
node .agents/skills/harness/scripts/init-wiki.mjs \
  --target /absolute/path/to/repo \
  --title "Project Wiki"
```

It refuses to overwrite an existing `wiki/index.md`. It creates structure and
guardrails only; it does not copy project facts or create active concept pages.

## Requirements

- Node.js 22+ for the initializer and verifier.
- Git for the verifier's stale check when there are active pages.
- DSH discovers project skills under `.agents/skills/`.

## Test

```bash
bash tests/init-smoke.sh
```

The test initializes a temporary repo, runs the generated verifier, and confirms
that a second init refuses to overwrite it.

## Design

The skill is a router and enforcement protocol, not a copy of a project Wiki.

```text
Wiki is the map.
Code is the ground.
Deferred work goes in the backlog.
```

Do not mark a page `active` without code verification, and do not use the backlog
to bypass a stale-page gate.

## Files

```text
SKILL.md
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
tests/init-smoke.sh
```
