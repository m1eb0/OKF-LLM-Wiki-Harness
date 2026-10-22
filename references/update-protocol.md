# Update Protocol

Use when a code/config/product fact changes, when Wiki contradicts code, or when the user asks for a Wiki change.

## 1. Decide whether the Wiki must change

Update when:

```text
behavior or constraints changed
route/API/component/status added or removed
deployment/cache/auth boundary changed
a code path referenced by an active page changed
Wiki contradicts current code
a decision is accepted and should be recorded
```

No update when:

```text
pure refactor with no factual change
purely local experiment
question-only task
```

If unsure, keep the page `draft` or set `needs-review`; do not claim active truth.

## 2. Decide placement

Use `references/placement.md` first.

```text
same concept -> update existing canonical page
new concept -> new page
navigation -> lifecycle link
source -> raw capture
decision -> ADR
```

Do not create a second page for the same concept.

```text
architecture/  system behavior
frontend/      routes, pages, design, accessibility, performance
backend/       API, writes
data/          schema, migrations, search
platform/      deploy, CI, edge, admin, observability
operations/    SLO, incidents, runbooks
product/       intent, lifecycle, moderation, notifications
```

Lifecycle pages only link; never duplicate content there.

## 3. Update

```text
1. Read current page and code refs.
2. Change the smallest set of facts.
3. Update # Verification with commands/checkpoints actually used.
4. Set verified_at to now and verified_commit to the current code revision.
5. Update the domain index.
6. Update wiki/log.md.
```

Do not edit `raw/`. Capture a new raw file with `.meta.md` (source, commit, sha256) when provenance is needed.

## 4. Verify

```bash
pnpm verify:wiki (or node scripts/verify-wiki.mjs)
```

It checks:

```text
OKF frontmatter/index
active verified fields and # Verification
stale code vs verified_commit
relative Markdown links
```

If stale:

```text
re-verify the affected code and update the page
or set status: needs-review
```

Do not bypass the gate.

## 5. Commit

```text
one coherent change: code + Wiki together
commit message names the behavior/docs change
push only after verify passes
```

## Closeout

Report:

```text
Wiki read
Wiki updated / none + reason
verify result
commit
```
