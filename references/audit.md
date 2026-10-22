# Audit Mode

Goal: independently fact-check Wiki against current code, then fix only after verification.

## Scope

```text
partial: one page / domain / claim set
full: all active pages, split by domain
```

For full audit, do not give one subagent 60 pages. Split:

```text
architecture + start-here
frontend + product
backend + data
platform + operations
decisions + sources + testing
```

Max ~5 pages per subagent.

## Subagent prompt

Give a **read-only** task:

```text
Read <pages>. For each material claim:
1. find the code/config evidence;
2. compare it to the page;
3. return a table:
   claim | page:line | evidence path:line | verdict | severity | suggested fix
Verdict: confirmed | outdated | missing-code | ambiguous.
Do not edit any file. Do not infer from memory.
Do not treat raw/ or draft pages as current truth.
```

Use `subagent` (or multiple independent subagents) for the audit. Do not use a workflow unless the user asks for one.

## Parent review

- Spot-check every `outdated` / `ambiguous` finding and a sample of `confirmed`.
- Reject findings without a code/config source.
- Do not mark pages `active` on a child's assertion alone.
- Fix pages in small batches; update `verified_commit` and `# Verification`.

## Output

```text
Audit scope:
Pages checked:
Findings:
  - confirmed: n
  - outdated: n
  - missing evidence: n
Fixes applied:
Deferred:
Verification:
```

Audit findings are not automatically a Wiki page. Persist them only if the user asks for a report or the finding changes a canonical page.

## Rules

```text
Subagents are read-only.
No edits to raw/.
No silent status changes.
No "fix" without a source.
No full-audit claim if only a sample was checked.
```
