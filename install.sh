#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
TARGET=$(pwd)
AGENTS=""
FORCE=0
DRY=0

usage() {
  cat <<'USAGE'
Usage:
  ./install.sh [--target DIR] [--agents LIST] [--force] [--dry-run]

Interactive: run without --agents and choose one or more targets.

Agents:
  dsh        .agents/skills/harness
  claude     .claude/skills/harness
  codex      .codex/skills/harness
  cursor     .cursor/skills/harness + .cursor/rules/harness.mdc
  gemini     .gemini/skills/harness + GEMINI.md pointer
  copilot    .agents/skills/harness + .github/copilot-instructions.md
  agents     .agents/skills/harness + AGENTS.md
  windsurf   .agents/skills/harness + .windsurf/rules/harness.md

Examples:
  ./install.sh --target ../my-repo --agents dsh,claude,agents
  ./install.sh --agents all --force
USAGE
}

while [ $# -gt 0 ]; do
  case "$1" in
    --target) TARGET=${2:?missing value for --target}; shift 2 ;;
    --agents) AGENTS=${2:?missing value for --agents}; shift 2 ;;
    --force) FORCE=1; shift ;;
    --dry-run) DRY=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

[ -d "$TARGET" ] || { echo "target is not a directory: $TARGET" >&2; exit 1; }
TARGET=$(cd -- "$TARGET" && pwd)

if [ -z "$AGENTS" ]; then
  if [ ! -t 0 ]; then
    usage >&2
    echo "non-interactive install requires --agents" >&2
    exit 2
  fi
  cat <<'MENU'
Select Coding Agent target(s), comma-separated:
  1) DSH                 .agents/skills/harness
  2) Claude Code         .claude/skills/harness
  3) Codex               .codex/skills/harness
  4) Cursor              .cursor/skills/harness + rule pointer
  5) Gemini CLI          .gemini/skills/harness + GEMINI.md pointer
  6) GitHub Copilot      .agents/skills/harness + copilot instructions
  7) Generic AGENTS.md   .agents/skills/harness + AGENTS.md
  8) Windsurf            .agents/skills/harness + .windsurf rule
  9) All
MENU
  printf 'Selection [1]: '
  read -r selection
  selection=${selection:-1}
  AGENTS=""
  old_ifs=$IFS
  IFS=,
  for item in $selection; do
    case "$item" in
      1) AGENTS="$AGENTS,dsh" ;;
      2) AGENTS="$AGENTS,claude" ;;
      3) AGENTS="$AGENTS,codex" ;;
      4) AGENTS="$AGENTS,cursor" ;;
      5) AGENTS="$AGENTS,gemini" ;;
      6) AGENTS="$AGENTS,copilot" ;;
      7) AGENTS="$AGENTS,agents" ;;
      8) AGENTS="$AGENTS,windsurf" ;;
      9) AGENTS="$AGENTS,all" ;;
      *) echo "unknown selection: $item" >&2; exit 2 ;;
    esac
  done
  IFS=$old_ifs
  AGENTS=${AGENTS#,}
fi

if [ "$AGENTS" = "all" ]; then
  AGENTS="dsh,claude,codex,cursor,gemini,copilot,agents,windsurf"
fi
AGENTS=",$AGENTS,"

has() { case "$AGENTS" in *",$1,"*) return 0 ;; *) return 1 ;; esac; }
run() { if [ "$DRY" = 1 ]; then echo "DRY: $*"; else "$@"; fi; }

install_skill_dir() {
  local dest="$1"
  local full="$TARGET/$dest"
  if [ -e "$full" ] && [ "$FORCE" != 1 ]; then
    echo "SKIP $dest (exists; use --force)"
    return 0
  fi
  if [ -e "$full" ]; then
    run rm -rf "$full"
  fi
  run mkdir -p "$full"
  for item in SKILL.md references scripts assets; do
    run cp -R "$ROOT/$item" "$full/"
  done
  echo "installed skill: $dest"
}

pointer_block() {
  local skill_path="$1"
  cat <<BLOCK
<!-- harness-skill:begin -->
## Harness project skill

Before project work, read and follow \`$skill_path/SKILL.md\`.

It is the Wiki workflow, explanation, audit, placement, backlog and init protocol.
Use it only with this repository's current code as the source of truth.
<!-- harness-skill:end -->
BLOCK
}

install_pointer() {
  local file="$1"
  local skill_path="$2"
  local full="$TARGET/$file"
  local header="${3:-}"
  if [ -f "$full" ] && grep -q 'harness-skill:begin' "$full"; then
    echo "SKIP $file (harness block exists)"
    return 0
  fi
  run mkdir -p "$(dirname "$full")"
  if [ "$DRY" = 1 ]; then
    echo "DRY: install pointer $file"
    return 0
  fi
  if [ ! -f "$full" ] && [ -n "$header" ]; then
    printf '%s\n\n' "$header" > "$full"
  fi
  pointer_block "$skill_path" >> "$full"
  echo "installed pointer: $file"
}

if has dsh; then install_skill_dir ".agents/skills/harness"; fi
if has claude; then install_skill_dir ".claude/skills/harness"; fi
if has codex; then install_skill_dir ".codex/skills/harness"; fi
if has cursor; then
  install_skill_dir ".cursor/skills/harness"
  install_pointer ".cursor/rules/harness.mdc" ".cursor/skills/harness" $'---\ndescription: Harness OKF Wiki workflow\nalwaysApply: true\n---'
fi
if has gemini; then
  install_skill_dir ".gemini/skills/harness"
  install_pointer "GEMINI.md" ".gemini/skills/harness"
fi
if has copilot; then
  install_skill_dir ".agents/skills/harness"
  install_pointer ".github/copilot-instructions.md" ".agents/skills/harness"
fi
if has agents; then
  install_skill_dir ".agents/skills/harness"
  install_pointer "AGENTS.md" ".agents/skills/harness"
fi
if has windsurf; then
  install_skill_dir ".agents/skills/harness"
  install_pointer ".windsurf/rules/harness.md" ".agents/skills/harness"
fi

echo "done: $TARGET"
