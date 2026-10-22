#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
printf '{"name":"install-smoke","scripts":{}}\n' > "$TMP/package.json"

"$ROOT/install.sh" --target "$TMP" --agents dsh,claude,codex,cursor,gemini,copilot,agents,windsurf

for path in \
  .agents/skills/harness/SKILL.md \
  .claude/skills/harness/SKILL.md \
  .codex/skills/harness/SKILL.md \
  .cursor/skills/harness/SKILL.md \
  .gemini/skills/harness/SKILL.md \
  .cursor/rules/harness.mdc \
  GEMINI.md \
  .github/copilot-instructions.md \
  AGENTS.md \
  .windsurf/rules/harness.md
do
  [ -e "$TMP/$path" ] || { echo "missing $path" >&2; exit 1; }
done

grep -q 'harness-skill:begin' "$TMP/AGENTS.md"
grep -q 'harness-skill:begin' "$TMP/.cursor/rules/harness.mdc"

# A second install is idempotent: it must succeed and must not overwrite.
before=$(cksum "$TMP/.agents/skills/harness/SKILL.md" | awk '{print $1":"$2}')
"$ROOT/install.sh" --target "$TMP" --agents dsh | grep -q '^SKIP .agents/skills/harness'
after=$(cksum "$TMP/.agents/skills/harness/SKILL.md" | awk '{print $1":"$2}')
[ "$before" = "$after" ] || { echo "SKILL.md changed on idempotent reinstall" >&2; exit 1; }

echo "PASS: multi-agent install paths, idempotent reinstall"
