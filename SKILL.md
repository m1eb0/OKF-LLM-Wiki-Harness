---
name: harness
description: Use at the start of any repository task that may change code, config, deployment, product behavior, or Wiki content, and when asked to explain or extend the project. Provides daily Wiki workflow, Wiki-grounded explanation, independent fact-check audits, update-vs-new-page placement analysis, a durable backlog for deferred Wiki work, and self-contained OKF Wiki initialization.
---

# Harness

Wiki is the map. Code is the ground. Do not confuse them.

This skill is a router and enforcement protocol, not a copy of the Wiki.

## Pick a mode

| Mode | Use when | Writes? | Output |
|---|---|---|---|
| `daily` | normal code/config/deploy/product task | code + Wiki when facts change | workflow closeout |
| `explain` | user asks what/why/how, based on Wiki | no by default | cited answer + gaps |
| `audit` | fact-check Wiki, full or partial | only after parent verifies | findings + fixes |
| `placement` | new fact/content needs to be recorded | Wiki only | update vs new page decision |
| `init` | bootstrapping an OKF Wiki in a repo | structure only | scaffold + next steps |

If the user does not ask for a mode:

```text
question about project -> explain
Wiki fact-check -> audit
bootstrap an empty repo -> init
anything else -> daily
```

State the chosen mode at the start.

## Daily

1. Classify: `frontend`, `backend`, `data`, `platform`, `operations`, `product`, `wiki-only`, `unknown`.
2. Read the minimum pages from `references/routes.md` (2–4 pages).
3. Check `status`, `verified_commit`, `# Verification`; inspect the referenced code.
4. Do the task.
5. If facts changed, use `references/placement.md` then `references/update-protocol.md`.
6. If a Wiki change cannot be completed now, add an item to `wiki/start-here/wiki-backlog.md` via `references/backlog.md`.
7. Run `pnpm verify:wiki` (or `node scripts/verify-wiki.mjs` if pnpm is unavailable); report read/updated/verification.

Never load the whole Wiki "for context". If lost, read ``wiki/start-here/agent-onboarding.md` (if present)`.

## Explain

Use `references/explain.md`.

- Answer from Wiki pages; cite paths and lines.
- Distinguish `active` from `draft` and historical.
- Do not edit by default.
- If the Wiki is silent or stale, say so; do not invent an answer from memory.
- If code is needed to qualify the answer, label it as code-derived.

## Audit

Use `references/audit.md`.

- `partial`: a page, domain, or claim.
- `full`: inventory active pages and split by domain; one read-only subagent per batch (or inline if the host has no subagent tool).
- The subagent **must not edit files**; it returns evidence. If the host has no subagent tool, audit inline.
- The parent spot-checks high-severity findings, then updates Wiki.
- Deferred findings go into `wiki/start-here/wiki-backlog.md`, not into an untracked chat list.
- Never mark `active` on a subagent's assertion alone.

## Init

Use `references/init.md` and `scripts/init-wiki.mjs`.

```text
node <skill-dir>/scripts/init-wiki.mjs \
  --target /abs/path/to/repo \
  --title "Project Wiki"
```

Rules:

```text
refuse if wiki/index.md exists
create skeleton, not project claims
copy schema/verifier/templates from self-contained assets
do not create active concept pages
do not auto-commit
```

After init, inspect indexes, add CI, then write code-grounded concepts.

## Placement

Use `references/placement.md`.

Core question:

```text
Is this the same concept, or a new canonical concept?
```

Default:

```text
same question -> update existing page
new distinct concept -> new page
navigation only -> lifecycle link
source/provenance only -> raw capture
decision -> decisions/
```

Do not create a new file just because the addition is long. Do not merge two concepts just because they are related.

## Trust order

```text
runtime / code / config
  > active Wiki with fresh verified_commit and traceable refs
  > README
  > docs/
  > draft / historical docs
  > memory
```

`raw/` is historical evidence, not current truth. If Wiki and code disagree, follow code and fix the Wiki.

## Hard rules

- Do not present a draft or a design intent as current behavior.
- Do not copy raw sources or whole docs into Wiki pages.
- Do not mark `active` without code verification.
- Do not edit `raw/`; add a new capture.
- Do not create a duplicate canonical page.
- Do not run init over an existing `wiki/index.md`.
- Do not update Wiki "later" after a behavior-changing commit.
- Do not ignore `pnpm verify:wiki` (or `node scripts/verify-wiki.mjs` if pnpm is unavailable) stale/link failures.

## Closeout

```text
Mode: daily | explain | audit | placement
Wiki read: <pages>
Wiki updated: <pages> | none (reason)
Verification: <command/result>
```

For `audit`, also report findings fixed/deferred. For `explain`, report sources and gaps. For daily/placement, report any backlog item added/closed.

## References

Read only when needed:

- `references/routes.md` — task → minimum pages
- `references/explain.md` — Wiki-grounded answer shape
- `references/audit.md` — subagent fact-check protocol
- `references/placement.md` — update vs new page decision
- `references/init.md` — bootstrap an OKF Wiki in an empty repo
- `references/backlog.md` — durable queue for deferred Wiki work
- `references/update-protocol.md` — update, staleness, verification, commit
- `references/anti-patterns.md` — common misuse and correct action
