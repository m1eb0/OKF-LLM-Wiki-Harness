# Explain Mode

Goal: answer a human question **from the Wiki**, with evidence and honest gaps.

## Read

Start from `references/routes.md`; read 2–4 relevant pages, not the whole bundle.

For each page used, check:

```text
status: active | draft | needs-review
verified_commit
# Verification
```

## Answer shape

```text
Direct answer (2–5 sentences)

Evidence:
- wiki/path.md#Lx — what it establishes
- wiki/path2.md — supporting detail

Status:
- active / draft / historical
- verified_commit if relevant

Gaps:
- what the Wiki does not answer
- whether code/README was used to qualify
```

## Rules

- Do not silently fill a Wiki gap with code or memory.
- If using code, label it: `code-derived, not a Wiki claim`.
- Do not edit Wiki pages in explain mode unless the user asks to fix a gap.
- If the Wiki is stale, say which page and why; offer a fix.
- Cite paths with line anchors when possible.

## Example

```text
Mode: explain

PPR is enabled via cacheComponents + partialPrefetching, and public pages
render as Partial Prerender. The canonical page is
wiki/architecture/frontend-ssr-ppr.md; route-level ◐ markers are in
wiki/frontend/route-map.md.

Gap: the Wiki does not define a numeric performance SLO. That is a draft
in operations/slo.md, not an implemented target.
```
