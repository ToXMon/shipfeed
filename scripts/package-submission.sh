#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

ZIP_PATH="deliverables/shipfeed_submission.zip"

# ── B) Validate prerequisites ──────────────────────────────────────────
if [ ! -f "deliverables/landing.png" ]; then
  echo "ERROR: Missing deliverables/landing.png. Run landing screenshot step first."
  exit 1
fi

# ── C) Create ZIP (exclude junk) ───────────────────────────────────────
echo "📦 Creating $ZIP_PATH …"
rm -f "$ZIP_PATH"

zip -r "$ZIP_PATH" . \
  -x ".git/*" \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".env.local" \
  -x "*.log" \
  -x ".DS_Store" \
  -x "$ZIP_PATH"

echo ""
echo "✅ ZIP created: $ZIP_PATH ($(du -h "$ZIP_PATH" | cut -f1))"

# ── D) Verify ZIP contents ────────────────────────────────────────────
echo ""
echo "🔍 Verifying ZIP contents …"

MISSING=0
for entry in SUBMISSION.md deliverables/landing.png src/; do
  if zipinfo -1 "$ZIP_PATH" "$entry" > /dev/null 2>&1 || \
     zipinfo -1 "$ZIP_PATH" | grep -q "^${entry}"; then
    echo "  ✅ $entry"
  else
    echo "  ❌ $entry MISSING"
    MISSING=1
  fi
done

LEAKED=0
for bad in node_modules/ .next/ .env.local .git/; do
  if zipinfo -1 "$ZIP_PATH" | grep -q "^${bad}"; then
    echo "  ❌ LEAKED: $bad"
    LEAKED=1
  else
    echo "  ✅ excluded $bad"
  fi
done

if [ "$MISSING" -ne 0 ] || [ "$LEAKED" -ne 0 ]; then
  echo ""
  echo "❌ ZIP verification failed."
  exit 1
fi

echo ""
echo "🎉 ZIP verification passed."
