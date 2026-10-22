# Anti-patterns

## 1. "Read the whole Wiki first"

Wrong: load 50 pages before knowing the task.

Right: classify the task, pick 2–4 pages from `routes.md`.

## 2. "The Wiki says it, so it is true"

Wrong: an active page may be stale.

Right: check `verified_commit`, `# Verification`, and the referenced code.

## 3. "README/PRODUCT is the source of truth"

Wrong: these can lag the implementation.

Right: code/config wins; use README/PRODUCT for intent, not feature status.

## 4. "Raw is current"

Wrong: `raw/` is an immutable historical capture.

Right: cite raw for provenance; verify current behavior from code.

## 5. "Draft means implemented"

Wrong: draft records a gap or unverified claim.

Right: do not present it as shipped; close the gap or keep it draft.

## 6. "Update the Wiki later"

Wrong: behavior changes and Wiki drift survive a commit.

Right: update canonical page in the same change; otherwise `verify:wiki` should fail.

## 7. "Create a new page for this"

Wrong: duplicate canonical pages fragment knowledge.

Right: find the existing page via domain index; update it.

## 8. "Edit raw to fix the old statement"

Wrong: raw is append-only.

Right: add a new capture and update the synthesized Wiki page.

## 9. "Use design intent as implementation"

Wrong: `DESIGN.md` / `PRODUCT.md` may describe values the code has not implemented.

Right: record spec vs code difference explicitly.

## 10. "Skip verify because it is only docs"

Wrong: broken links, stale commits, and invalid frontmatter are cheap to catch.

Right: run `pnpm verify:wiki`; it now includes staleness and link checks.
