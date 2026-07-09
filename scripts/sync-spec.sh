#!/usr/bin/env bash
# scripts/sync-spec.sh
#
# Mirrors the canonical AppArchitect-Foundation spec into the app's
# spec bridge at src/data/spec/. The Foundation is the source of truth;
# this script is the read-side wiring.
#
# Layout: foundation uses "01 - governance" (with spaces); the bridge
# uses "01-governance" (dashes) to keep Vite import paths simple. The
# sync preserves content under the bridge's dash-separated layout.
#
# Usage:
#   bash scripts/sync-spec.sh           # sync + report
#   bash scripts/sync-spec.sh --check   # exit 1 if bridge is out of sync

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FOUNDATION="${APPARCHITECT_FOUNDATION:-/home/workspace/AppArchitect-Foundation}"
BRIDGE="$ROOT/src/data/spec"

if [ ! -d "$FOUNDATION" ]; then
  echo "❌ Foundation not found at: $FOUNDATION"
  echo "   Set APPARCHITECT_FOUNDATION or adjust the path."
  exit 1
fi

# Mapping: foundation "01 - governance" -> bridge "01-governance"
# Filename mapping for agents: foundation uses "-agent-spec.md" suffix
map_path() {
  local src="$1"
  local rel="${src#$FOUNDATION/}"
  # Convert "NN - name" -> "NN-name"
  rel=$(echo "$rel" | sed -E 's|^([0-9]+) - |\1-|')
  echo "$BRIDGE/$rel"
}

CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

echo "🔄 Syncing spec from Foundation..."
echo "   Foundation: $FOUNDATION"
echo "   Bridge:     $BRIDGE"
echo

synced=0
added=0
updated=0
skipped=0

# Walk the foundation (excluding app-only metadata folders that the app
# never reads: _meta, assets, reference)
while IFS= read -r src; do
  rel="${src#$FOUNDATION/}"
  case "$rel" in
    README.md|_meta/*|assets/*|reference/*|0[0-9]\ -\ agents/templates/*) continue ;;
  esac

  # Skip filenames that don't follow the foundation convention
  dst=$(map_path "$src")
  dst_dir=$(dirname "$dst")
  mkdir -p "$dst_dir"

  if [ ! -f "$dst" ]; then
    if [ "$CHECK_ONLY" -eq 1 ]; then
      echo "MISSING: $rel"
      added=$((added+1))
    else
      cp "$src" "$dst"
      added=$((added+1))
    fi
  elif ! diff -q "$src" "$dst" >/dev/null 2>&1; then
    if [ "$CHECK_ONLY" -eq 1 ]; then
      echo "DIFFERS: $rel"
      updated=$((updated+1))
    else
      cp "$src" "$dst"
      updated=$((updated+1))
    fi
  else
    skipped=$((skipped+1))
  fi
  synced=$((synced+1))
done < <(find "$FOUNDATION" -type f \( -name "*.md" -o -name "*.json" \))

if [ "$CHECK_ONLY" -eq 1 ]; then
  if [ "$added" -eq 0 ] && [ "$updated" -eq 0 ]; then
    echo "✅ Bridge is in sync ($synced files checked)"
    exit 0
  else
    echo "❌ Bridge is out of sync: $added missing, $updated differ"
    exit 1
  fi
fi

echo "📊 Sync summary:"
echo "   $synced files scanned"
echo "   $added added"
echo "   $updated updated"
echo "   $skipped unchanged"
echo
echo "⚠️  Manual step: review src/data/spec/loader.ts if filenames changed"
echo "    (e.g. agent files now use -agent-spec.md suffix)."
