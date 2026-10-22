# Backlog Protocol

Use when Wiki work cannot be completed now, or when a finding needs durable follow-up.

Canonical queue:

```text
wiki/start-here/wiki-backlog.md
```

## When to add an item

```text
Wiki contradicts code
behavior change needs a Wiki update but cannot be done in this task
new canonical page/split is needed
audit finding is deferred
a referenced page is stale and needs re-verification
```

Do not add items for:

```text
ordinary code work with no Wiki impact
something already fixed in this task
vague "improve docs"
```

## Item rules

```text
one atomic outcome
stable WIKI-YYYYMMDD-NNN id
priority + type + scope + evidence
acceptance check (which page/command/commit proves done)
status is explicit
never silently delete
```

## Workflow

```text
start: read open/in-progress
claim: set in-progress + owner/since
do: placement -> update -> verify
close: set done + commit + pages
block: set blocked + concrete reason + need
```

## Hard boundary

The backlog is not permission to leave an active page false.

```text
If code changed and verify:wiki flags a stale page:
  update the page now, or set needs-review.
  A backlog item alone does not satisfy the gate.
```

## Audit integration

Audit deferred findings go into the queue, not into an untracked chat list.

Each audit item should include:

```text
claim
page
code/config evidence
verdict
why deferred
```

## Closeout

Report:

```text
Backlog: WIKI-... added/updated/closed | none
```
