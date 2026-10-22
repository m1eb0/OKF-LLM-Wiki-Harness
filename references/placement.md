# Placement

Goal: decide whether a new fact belongs in an existing page, a new page, a lifecycle link, a raw capture, or nowhere.

## Step 1: name the claim

Write one sentence:

```text
<Subject> <behavior/constraint> because <reason>.
```

If you cannot name it, do not create a page yet.

## Step 2: search

```text
domain index
rg the concept/keywords in wiki/
wiki-coverage.md
```

Do not start by creating a file.

## Step 3: decide

| Situation | Action |
|---|---|
| Same concept/question; adds detail | update existing canonical page |
| New distinct concept with its own identity | create a new canonical page |
| Cross-domain navigation only | update lifecycle view (link only) |
| Historical/source/provenance only | add `raw/` capture + meta |
| Decision with alternatives/consequences | `decisions/` ADR |
| Operational procedure | `operations/runbooks/` |
| Nothing durable or verified | no page |

## Step 4: split / merge test

Create a new page only if:

```text
it answers a different primary question
it needs its own title/frontmatter/tags
other pages can link to it as a concept
```

Update the existing page if:

```text
the addition is a fact, constraint, example, or failure mode of the same concept
the page title still describes the whole content
splitting would create two thin, cross-linked pages
```

Do not use size alone as a reason. A long page that answers one question stays one page; a short page with a new concept can be its own page.

## Step 5: canonical placement

```text
architecture/  system behavior/request/cache/auth
frontend/      routes/pages/design/a11y/perf
backend/       API/write path
data/          schema/migrations/search
platform/      deploy/CI/edge/admin/observability
operations/    SLO/incidents/runbooks
product/       intent/lifecycle/moderation/notifications
decisions/     ADRs
sources/       source register/synthesis about sources
```

## Step 6: finish

```text
update domain index
update wiki/log.md
add links from related pages
pnpm verify:wiki
```

Report:

```text
Placement: update | new page | lifecycle | raw | decision | none
Target: <path>
Why: <one sentence>
```
