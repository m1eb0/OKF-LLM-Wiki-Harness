#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

printf '{"name":"harness-init-test","scripts":{}}\n' > "$TMP/package.json"
node "$ROOT/scripts/init-wiki.mjs" --target "$TMP" --title "Harness Init Test"

[ -f "$TMP/wiki/index.md" ] || { echo "missing wiki/index.md" >&2; exit 1; }
[ -f "$TMP/schema/wiki-schema.md" ] || { echo "missing schema" >&2; exit 1; }
[ -f "$TMP/scripts/verify-wiki.mjs" ] || { echo "missing verifier" >&2; exit 1; }
[ -f "$TMP/wiki/templates/concept.md" ] || { echo "missing templates" >&2; exit 1; }

(cd "$TMP" && node scripts/verify-wiki.mjs)

if node "$ROOT/scripts/init-wiki.mjs" --target "$TMP" --title "Again" >/dev/null 2>&1; then
  echo "second init unexpectedly succeeded" >&2
  exit 1
fi

echo "PASS: init scaffold, verify, and overwrite guard"
