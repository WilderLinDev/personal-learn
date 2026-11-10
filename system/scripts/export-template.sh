#!/usr/bin/env bash
# Export a clean Template: System files (system/MANIFEST) + an empty Vault
# (system/vault-skeleton) into a new directory with fresh git history.
#
# Usage: system/scripts/export-template.sh <target-dir> [deny-regex]
#   deny-regex  optional extended regex (e.g. your name or repo) that must not
#               appear anywhere in the exported files; the export fails if it does.
set -euo pipefail

target="${1:?usage: export-template.sh <target-dir> [deny-regex]}"
deny="${2:-}"
root="$(cd "$(dirname "$0")/../.." && pwd)"

if [ -e "$target" ] && [ -n "$(ls -A "$target" 2>/dev/null)" ]; then
  echo "error: $target exists and is not empty" >&2; exit 1
fi
mkdir -p "$target"

grep -vE '^\s*(#|$)' "$root/system/MANIFEST" | while read -r path; do
  [ -e "$root/$path" ] || [ -L "$root/$path" ] || { echo "error: missing $path" >&2; exit 1; }
  mkdir -p "$target/$(dirname "$path")"
  cp -RP "$root/$path" "$target/$path"
done
cp -RP "$root/system/vault-skeleton" "$target/vault"
find "$target" -name .DS_Store -delete

if [ -n "$deny" ] && grep -rIEl --exclude-dir=.git "$deny" "$target"; then
  echo "error: files above match deny pattern; template not clean" >&2; exit 1
fi

git -C "$target" init -q -b main
git -C "$target" add -A
git -C "$target" -c user.name=template -c user.email=template@localhost commit -qm "Initial template"
echo "Template exported to $target"
