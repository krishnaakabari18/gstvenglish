#!/bin/bash

# Script to fix remaining CSS module references in NewsDetailInfiniteScroll.tsx
# This script uses sed to replace all remaining styles.xxx references

FILE="src/components/NewsDetailInfiniteScroll.tsx"

echo "🔧 Fixing remaining CSS module references in $FILE..."

# Backup the current state
cp "$FILE" "${FILE}.before-script-fix"
echo "✅ Created backup: ${FILE}.before-script-fix"

# Fix content paragraphs
sed -i 's/className={styles\.newsContent}/className="custom-gujrati-font"/g' "$FILE"
echo "✅ Fixed: newsContent → custom-gujrati-font"

# Fix source
sed -i 's/className={styles\.newsSource}/className="blog-excerpt" style={{ marginTop: '\''10px'\'', fontSize: '\''14px'\'' }}/g' "$FILE"
echo "✅ Fixed: newsSource → blog-excerpt"

# Fix content wrapper
sed -i 's/className={styles\.newsContentWrapper}/className="detail-page"/g' "$FILE"
echo "✅ Fixed: newsContentWrapper → detail-page"

# Fix tags
sed -i 's/className={styles\.newsTags}/className="details-inner-footer" style={{ marginTop: '\''30px'\'' }}/g' "$FILE"
echo "✅ Fixed: newsTags → details-inner-footer"

# Fix tag links
sed -i 's/className={styles\.tagLink}/style={{ marginLeft: '\''10px'\'' }}/g' "$FILE"
echo "✅ Fixed: tagLink → inline style"

# Fix news default text
sed -i 's/className={styles\.newsDefaultText}/className="custom-gujrati-font" style={{ marginTop: '\''20px'\'' }}/g' "$FILE"
echo "✅ Fixed: newsDefaultText → custom-gujrati-font"

# Fix live news box
sed -i 's/className={styles\.liveNewsBox}/style={{ border: '\''2px solid #dc3545'\'', borderRadius: '\''8px'\'', padding: '\''20px'\'', marginTop: '\''30px'\'', backgroundColor: '\''#fff5f5'\'' }}/g' "$FILE"
echo "✅ Fixed: liveNewsBox → inline style"

# Fix live news header
sed -i 's/className={styles\.liveNewsHeader}/style={{ display: '\''flex'\'', alignItems: '\''center'\'', marginBottom: '\''20px'\'' }}/g' "$FILE"
echo "✅ Fixed: liveNewsHeader → inline style"

# Fix live indicator
sed -i 's/className={styles\.liveIndicator}/style={{ display: '\''flex'\'', alignItems: '\''center'\'', marginRight: '\''15px'\'' }}/g' "$FILE"
echo "✅ Fixed: liveIndicator → inline style"

# Fix live dot
sed -i 's/className={styles\.liveDot}/style={{ width: '\''10px'\'', height: '\''10px'\'', backgroundColor: '\''#dc3545'\'', borderRadius: '\''50%'\'', display: '\''inline-block'\'', marginRight: '\''8px'\'' }}/g' "$FILE"
echo "✅ Fixed: liveDot → inline style"

# Fix live text
sed -i 's/className={styles\.liveText}/style={{ fontWeight: '\''bold'\'', color: '\''#dc3545'\'' }}/g' "$FILE"
echo "✅ Fixed: liveText → inline style"

# Fix live news title (in header)
sed -i 's/<h3 className={styles\.liveNewsTitle}>/<h3 className="custom-gujrati-font" style={{ margin: 0, fontSize: '\''20px'\'' }}>/g' "$FILE"
echo "✅ Fixed: liveNewsTitle (h3) → custom-gujrati-font"

# Fix live news content
sed -i 's/className={styles\.liveNewsContent}/style={{ }}/g' "$FILE"
echo "✅ Fixed: liveNewsContent → inline style"

# Fix live news item
sed -i 's/className={styles\.liveNewsItem}/style={{ borderLeft: '\''3px solid #dc3545'\'', paddingLeft: '\''15px'\'', marginBottom: '\''20px'\'' }}/g' "$FILE"
echo "✅ Fixed: liveNewsItem → inline style"

# Fix live news time
sed -i 's/className={styles\.liveNewsTime}/style={{ fontSize: '\''12px'\'', color: '\''#666'\'', marginBottom: '\''5px'\'' }}/g' "$FILE"
echo "✅ Fixed: liveNewsTime → inline style"

# Fix live news text wrapper
sed -i 's/className={styles\.liveNewsTextWrapper}/style={{ }}/g' "$FILE"
echo "✅ Fixed: liveNewsTextWrapper → inline style"

# Fix live news title (in item)
sed -i 's/<div className={styles\.liveNewsTitle}>/<div className="custom-gujrati-font" style={{ fontWeight: '\''bold'\'', marginBottom: '\''5px'\'' }}>/g' "$FILE"
echo "✅ Fixed: liveNewsTitle (div) → custom-gujrati-font"

# Fix live news desc
sed -i 's/className={styles\.liveNewsDesc}/className="custom-gujrati-font"/g' "$FILE"
echo "✅ Fixed: liveNewsDesc → custom-gujrati-font"

echo ""
echo "✅ All replacements complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check for any remaining 'styles.' references:"
echo "   grep -n 'styles\\.' $FILE"
echo ""
echo "2. Run TypeScript check:"
echo "   npm run build"
echo ""
echo "3. Start dev server and test:"
echo "   npm run dev"
echo ""
echo "4. If there are issues, restore from backup:"
echo "   cp ${FILE}.before-script-fix $FILE"
echo ""

