# Init Mode

Goal: bootstrap an OKF LLM Wiki in a repo **without copying another project's knowledge**.

The initializer creates structure and guardrails, not project facts.

The schema, verifier and templates are copied from `assets/init/` inside this skill,
so the initializer works even when the target repo has no Wiki yet. If the source
repo's verifier/schema changes, refresh those assets deliberately.

## Preconditions

```text
git repo exists (recommended)
no wiki/index.md yet
target path resolved and verified
```

Never overwrite an existing Wiki. If `wiki/index.md` exists:

```text
stop
inspect
ask whether this is a migration, not an init
```

## Command

From the repo that contains this skill:

```bash
node .agents/skills/harness/scripts/init-wiki.mjs \
  --target /absolute/path/to/repo \
  --title "Project Name"
```

The script refuses to overwrite `wiki/`.

It creates:

```text
raw/
  index.md
  external/.gitkeep
  project/.gitkeep
  code/.gitkeep

schema/
  index.md
  wiki-schema.md

scripts/
  verify-wiki.mjs

wiki/
  index.md
  log.md
  start-here/index.md
  product/index.md
  architecture/index.md
  frontend/index.md
  backend/index.md
  data/index.md
  platform/index.md
  testing/index.md
  decisions/index.md
  sources/index.md
  operations/index.md
  operations/runbooks/index.md
  lifecycle/develop/index.md
  lifecycle/test/index.md
  lifecycle/ship/index.md
  lifecycle/operate/index.md
  lifecycle/evolve/index.md
  templates/index.md
  templates/{concept,decision,runbook,source}.md
```

It also:

```text
adds package.json "verify:wiki" if a package.json exists
appends a minimal LLM Wiki section to AGENT.md if missing
prints CI next steps
```

It does **not** create active concept pages, project claims, or fake sources.

## After Running

```text
1. Review generated indexes; adjust domain names to the repo.
2. Read schema/wiki-schema.md; adjust canonical placement/prefixes.
3. Add verify:wiki to CI.
4. Create the first active concept only after code verification.
5. Run pnpm verify:wiki (or node scripts/verify-wiki.mjs).
6. Commit structure separately from content.
```

## First Content Rule

The first concept page must be grounded:

```text
Project Overview
System Map
Request/entry path
```

Do not start with aspirational architecture or copied README.

## Verify

```bash
cd <target>
node scripts/verify-wiki.mjs
pnpm verify:wiki        # if package.json was updated
git diff --stat
```

Expected:

```text
wiki files > 0
warnings: 0 (or explained)
errors: 0
```

## CI

Add to the job that has Node:

```yaml
- run: pnpm verify:wiki
```

If the verifier's stale check runs, checkout must have full history:

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

## Guardrails

```text
Never copy another project's wiki content into the new one.
Never seed sources or claims without evidence.
Never edit raw after init; raw is append-only.
Do not mark active pages without code verification.
Do not auto-commit; inspect generated structure first.
```
