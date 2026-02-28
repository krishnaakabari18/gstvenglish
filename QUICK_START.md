# Quick Start Guide - Gujarati Constants

Get started with centralized Gujarati constants in 5 minutes!

## 🚀 What You Have

A complete system for managing all Gujarati text in one place. No more hardcoded strings scattered across your codebase!

## 📖 3-Step Quick Start

### Step 1: Import Constants (30 seconds)

Add this to the top of your component:

```typescript
import { LOADING_MESSAGES, BUTTON_TEXT, CATEGORIES } from '@/constants/gujaratiStrings';
```

### Step 2: Replace Text (2 minutes)

Replace hardcoded Gujarati text with constants:

```tsx
// ❌ Before
<LoadingSpinner message="લોડ થઈ રહ્યું છે..." />
<button>વધુ વાંચો</button>
<h3>GSTV શતરંગ</h3>

// ✅ After
<LoadingSpinner message={LOADING_MESSAGES.LOADING} />
<button>{BUTTON_TEXT.READ_MORE}</button>
<h3>{CATEGORIES.GSTV_SATRANG}</h3>
```

### Step 3: Test & Commit (2 minutes)

```bash
npm run build
git add .
git commit -m "Use centralized Gujarati constants"
```

Done! 🎉

## 📚 Available Constants

### Most Common

```typescript
// Loading
LOADING_MESSAGES.LOADING              // લોડ થઈ રહ્યું છે...
LOADING_MESSAGES.LOADING_MORE         // વધુ લોડ થઈ રહ્યું છે...

// Buttons
BUTTON_TEXT.READ_MORE                 // વધુ વાંચો
BUTTON_TEXT.LOAD_MORE                 // વધુ લોડ કરો
BUTTON_TEXT.RETRY                     // ફરી પ્રયાસ કરો

// Categories
CATEGORIES.GSTV_SATRANG              // GSTV શતરંગ
CATEGORIES.GSTV_MAGAZINE             // GSTV મેગેઝિન

// Navigation
NAVIGATION.HOME                       // હોમ
NAVIGATION.GO_BACK                    // પાછા જાઓ
```

**See `QUICK_REFERENCE.md` for all 39 constants!**

## 🎯 Common Use Cases

### Loading Spinner
```tsx
<LoadingSpinner message={LOADING_MESSAGES.LOADING} />
```

### Category Header
```tsx
<h3 className="blog-category">{CATEGORIES.GSTV_SATRANG}</h3>
```

### Read More Link
```tsx
<Link href="/category/satrang">
  {BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>
</Link>
```

### Error Message
```tsx
import { getErrorMessage } from '@/constants/gujaratiStrings';

<p>{getErrorMessage('MAGAZINE_LOAD_ERROR', error)}</p>
```

### Time Ago
```tsx
import { getTimeAgoMessage } from '@/constants/gujaratiStrings';

const timeText = getTimeAgoMessage(5, 'MINUTES_AGO'); // "5 મિનિટ પહેલા"
```

## 🔍 Find What Needs Updating

Run this command to find hardcoded Gujarati text:

```bash
# Bash
bash scripts/find-gujarati-text.sh

# PowerShell (Windows)
powershell -ExecutionPolicy Bypass -File scripts/find-gujarati-text.ps1
```

## 📋 Files to Update

### Components (7 files)
1. src/components/GSTVSatrangBox.tsx
2. src/components/GSTVSatrang.tsx
3. src/components/GSTVShatrangLayout.tsx
4. src/components/GSTVMagazine.tsx
5. src/components/GstvMagazineBox.tsx
6. src/components/GstvFastTrack.tsx
7. src/components/Footer.tsx

### Pages (4 files)
8. src/app/web-story-detail/[slug]/page.tsx
9. src/app/web-stories/[slug]/route.ts
10. src/app/videos/page.tsx
11. src/app/videos/[...slug]/ClientVideoPage.tsx

## 💡 Pro Tips

### 1. Import Only What You Need
```typescript
// ✅ Good
import { BUTTON_TEXT, CATEGORIES } from '@/constants/gujaratiStrings';

// ❌ Avoid
import * as GJ from '@/constants/gujaratiStrings';
```

### 2. Use Curly Braces in JSX
```tsx
// ✅ Correct
<span>{CATEGORIES.GSTV_SATRANG}</span>

// ❌ Wrong
<span>CATEGORIES.GSTV_SATRANG</span>
```

### 3. TypeScript Autocomplete
Start typing and let TypeScript help:
```typescript
LOADING_MESSAGES.  // TypeScript shows all options!
```

## 📖 Need More Help?

### Quick Reference
- **QUICK_REFERENCE.md** - All constants listed

### Examples
- **USAGE_EXAMPLES.md** - Before/after examples

### Step-by-Step
- **MIGRATION_GUIDE.md** - Detailed instructions

### Complete Example
- **EXAMPLE_COMPONENT_UPDATE.md** - Full component update

## ✅ Checklist

- [ ] Read this quick start
- [ ] Import constants in your component
- [ ] Replace hardcoded text
- [ ] Test your changes
- [ ] Commit your code
- [ ] Update MIGRATION_CHECKLIST.md
- [ ] Move to next file

## 🎉 You're Ready!

You now know enough to start migrating files. Pick a component, follow the 3 steps above, and you're done!

**Start with the easiest file first** (like Footer.tsx with only 1 change) to get comfortable with the process.

---

**Time to Complete**: 5 minutes per file
**Difficulty**: Easy
**Next**: Pick a file from the list above and start!
