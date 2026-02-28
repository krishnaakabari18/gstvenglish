#!/bin/bash

# Script to find remaining hardcoded Gujarati text in the codebase
# Usage: bash scripts/find-gujarati-text.sh

echo "🔍 Searching for hardcoded Gujarati text in the codebase..."
echo ""

# Search for Gujarati Unicode characters in TypeScript/JavaScript files
# Excluding the constants file itself and node_modules
echo "📁 Files containing Gujarati text:"
echo "=================================="

grep -r -l "[\u0A80-\u0AFF]" src/ \
  --include="*.tsx" \
  --include="*.ts" \
  --include="*.jsx" \
  --include="*.js" \
  --exclude-dir=node_modules \
  | grep -v "gujaratiStrings.ts" \
  | sort

echo ""
echo "📊 Detailed occurrences:"
echo "======================="

grep -r -n "[\u0A80-\u0AFF]" src/ \
  --include="*.tsx" \
  --include="*.ts" \
  --include="*.jsx" \
  --include="*.js" \
  --exclude-dir=node_modules \
  | grep -v "gujaratiStrings.ts" \
  | head -50

echo ""
echo "✅ Search complete!"
echo ""
echo "💡 Tips:"
echo "  - Files listed above need to be migrated"
echo "  - See MIGRATION_GUIDE.md for step-by-step instructions"
echo "  - Use QUICK_REFERENCE.md to find the right constants"
echo ""
