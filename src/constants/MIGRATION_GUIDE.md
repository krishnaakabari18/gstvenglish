# Migration Guide: Using Centralized Gujarati Strings

This guide will help you migrate all hardcoded Gujarati strings to use the centralized constants.

## ✅ Already Updated Files

The following files have been updated to use the new constants:

1. ✅ **src/utils/uiUtils.ts** - Now imports and uses constants
2. ✅ **src/utils/timeAgo.ts** - Now uses TIME_AGO constants
3. ✅ **src/utils/shareUtils.ts** - Now uses SUCCESS_MESSAGES and ERROR_MESSAGES

## 📋 Files That Need Updates

### Components

#### 1. src/components/GSTVSatrangBox.tsx

**Lines to update:**
- Line 140: `message="GSTV શતરંગ લોડ થઈ રહ્યું છે..."`
- Line 164: `<span className="blog-category">GSTV શતરંગ</span>`
- Line 168: `વધુ વાંચો`

**Changes needed:**
```tsx
// Add import at top
import { LOADING_MESSAGES, CATEGORIES, BUTTON_TEXT } from '@/constants/gujaratiStrings';

// Replace line 140
<LoadingSpinner message={LOADING_MESSAGES.LOADING_GSTV_SATRANG} />

// Replace line 164
<span className="blog-category">{CATEGORIES.GSTV_SATRANG}</span>

// Replace line 168
{BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>
```

---

#### 2. src/components/GSTVSatrang.tsx

**Lines to update:**
- Line 127: `message="GSTV શતરંગ લોડ થઈ રહ્યું છે..."`
- Line 140: `<span>GSTV શતરંગ</span>`
- Line 146: `વધુ વાંચો`

**Changes needed:**
```tsx
// Add import at top
import { LOADING_MESSAGES, CATEGORIES, BUTTON_TEXT } from '@/constants/gujaratiStrings';

// Replace line 127
<LoadingSpinner message={LOADING_MESSAGES.LOADING_GSTV_SATRANG} />

// Replace line 140
<span>{CATEGORIES.GSTV_SATRANG}</span>

// Replace line 146
{BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>
```

---

#### 3. src/components/GSTVShatrangLayout.tsx

**Lines to update:**
- Line 101: `categoryName="GSTV શતરંગ"`
- Line 140: `વધુ લોડ કરો`

**Changes needed:**
```tsx
// Add import at top
import { CATEGORIES, BUTTON_TEXT } from '@/constants/gujaratiStrings';

// Replace line 101
categoryName={CATEGORIES.GSTV_SATRANG}

// Replace line 140
{BUTTON_TEXT.LOAD_MORE}
```

---

#### 4. src/components/GSTVMagazine.tsx

**Lines to update:**
- Line 157: `message="GSTV મેગેઝિન લોડ થઈ રહ્યા છે..."`
- Line 171: `<h2 className="section-title">GSTV મેગેઝિન</h2>`
- Line 194: `<span>GSTV મેગેઝિન</span>`
- Line 199: `વધુ વાંચો`

**Changes needed:**
```tsx
// Add import at top
import { LOADING_MESSAGES, CATEGORIES, BUTTON_TEXT } from '@/constants/gujaratiStrings';

// Replace line 157
<LoadingSpinner message={LOADING_MESSAGES.LOADING_GSTV_MAGAZINE} />

// Replace line 171
<h2 className="section-title">{CATEGORIES.GSTV_MAGAZINE}</h2>

// Replace line 194
<span>{CATEGORIES.GSTV_MAGAZINE}</span>

// Replace line 199
{BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>
```

---

#### 5. src/components/GstvMagazineBox.tsx

**Lines to update:**
- Line 146: `મેગેઝિન લોડ કરવામાં ભૂલ: {error}`
- Line 153: `ફરી પ્રયાસ કરો`
- Line 234: `<h3 className="blog-category">મેગેઝિન</h3>`

**Changes needed:**
```tsx
// Add import at top
import { ERROR_MESSAGES, BUTTON_TEXT, CATEGORIES, getErrorMessage } from '@/constants/gujaratiStrings';

// Replace line 146
<p style={{ color: '#dc3545' }}>
  {getErrorMessage('MAGAZINE_LOAD_ERROR', error)}
</p>

// Replace line 153
{BUTTON_TEXT.RETRY}

// Replace line 234
<h3 className="blog-category">{CATEGORIES.MAGAZINE}</h3>
```

---

#### 6. src/components/GstvFastTrack.tsx

**Lines to update:**
- Line 153, 180, 229: `<h3 className="blog-category">GSTV ફાસ્ટ ટ્રેક</h3>`
- Line 194: `GSTV Fast Track લોડ કરવામાં ભૂલ: {error}`
- Line 209: `ફરી પ્રયાસ કરો`

**Changes needed:**
```tsx
// Add import at top
import { CATEGORIES, ERROR_MESSAGES, BUTTON_TEXT, getErrorMessage } from '@/constants/gujaratiStrings';

// Replace lines 153, 180, 229
<h3 className="blog-category">{CATEGORIES.GSTV_FAST_TRACK}</h3>

// Replace line 194
<p className="custom-gujrati-font" style={{ color: '#dc3545', marginBottom: '10px' }}>
  {getErrorMessage('FAST_TRACK_LOAD_ERROR', error)}
</p>

// Replace line 209
{BUTTON_TEXT.RETRY}
```

---

#### 7. src/components/Footer.tsx

**Lines to update:**
- Line 35: `<p className="footer-link custom-gujrati-font">હોમ</p>`

**Changes needed:**
```tsx
// Add import at top
import { NAVIGATION } from '@/constants/gujaratiStrings';

// Replace line 35
<p className="footer-link custom-gujrati-font">{NAVIGATION.HOME}</p>
```

---

### App/Pages

#### 8. src/app/web-story-detail/[slug]/page.tsx

**Lines to update:**
- Line 17: `message="વેબ સ્ટોરી લોડ થઈ રહી છે..."`

**Changes needed:**
```tsx
// Add import at top
import { LOADING_MESSAGES } from '@/constants/gujaratiStrings';

// Replace line 17
<LoadingSpinner message={LOADING_MESSAGES.LOADING_WEB_STORY} />
```

---

#### 9. src/app/web-stories/[slug]/route.ts

**Lines to update:**
- Line 461: `<b>સોર્સ :</b>`

**Changes needed:**
```tsx
// Add import at top
import { GENERAL_MESSAGES } from '@/constants/gujaratiStrings';

// Replace line 461
<b>${GENERAL_MESSAGES.SOURCE_LABEL}</b>
```

---

#### 10. src/app/videos/page.tsx

**Lines to update:**
- Line 882-883: Video bookmark messages
- Line 1388: `title="પાછા જાઓ"`
- Line 1446: `title="પાછલો વીડિયો"`
- Line 1493: `title="આગળનો વીડિયો"`
- Line 1538: `આગળનો વીડિયો આવી રહ્યો છે...`
- Line 1643: `alert('તમે બધા વીડિયો જોઈ લીધા છે!')`
- Line 1687: `<strong style={{ color: '#333' }}>સોર્સ:</strong>`

**Changes needed:**
```tsx
// Add import at top
import { 
  SUCCESS_MESSAGES, 
  NAVIGATION, 
  LOADING_MESSAGES, 
  GENERAL_MESSAGES 
} from '@/constants/gujaratiStrings';

// Replace line 882-883
const message = newStatus === 1
  ? SUCCESS_MESSAGES.VIDEO_BOOKMARKED
  : SUCCESS_MESSAGES.VIDEO_BOOKMARK_REMOVED;

// Replace line 1388
title={NAVIGATION.GO_BACK}

// Replace line 1446
title={NAVIGATION.PREVIOUS_VIDEO}

// Replace line 1493
title={NAVIGATION.NEXT_VIDEO}

// Replace line 1538
{LOADING_MESSAGES.NEXT_VIDEO_COMING}

// Replace line 1643
alert(GENERAL_MESSAGES.ALL_VIDEOS_WATCHED);

// Replace line 1687
<strong style={{ color: '#333' }}>{GENERAL_MESSAGES.SOURCE_LABEL}</strong>
```

---

#### 11. src/app/videos/[...slug]/ClientVideoPage.tsx

**Lines to update:**
- Line 987-988: Video bookmark messages
- Line 1466: `title="પાછા જાઓ"`
- Line 1518: `title="પાછલો વીડિયો"`
- Line 1566: `title="આગળનો વીડિયો"`
- Line 1615: `આગળનો વીડિયો આવી રહ્યો છે...`

**Changes needed:**
```tsx
// Add import at top
import { 
  SUCCESS_MESSAGES, 
  NAVIGATION, 
  LOADING_MESSAGES 
} from '@/constants/gujaratiStrings';

// Replace line 987-988
const message = newStatus === 1
  ? SUCCESS_MESSAGES.VIDEO_BOOKMARKED
  : SUCCESS_MESSAGES.VIDEO_BOOKMARK_REMOVED;

// Replace line 1466
title={NAVIGATION.GO_BACK}

// Replace line 1518
title={NAVIGATION.PREVIOUS_VIDEO}

// Replace line 1566
title={NAVIGATION.NEXT_VIDEO}

// Replace line 1615
{LOADING_MESSAGES.NEXT_VIDEO_COMING}
```

---

## 🚀 Quick Migration Script

You can use find-and-replace in your IDE to speed up the migration:

### VS Code / Kiro Find & Replace

1. Open Find & Replace (Ctrl+Shift+H / Cmd+Shift+H)
2. Enable regex mode
3. Use these patterns:

**Pattern 1: Loading Messages**
- Find: `message="લોડ થઈ રહ્યું છે..."`
- Replace: `message={LOADING_MESSAGES.LOADING}`

**Pattern 2: Read More Links**
- Find: `વધુ વાંચો`
- Replace: `{BUTTON_TEXT.READ_MORE}`

**Pattern 3: Load More Buttons**
- Find: `વધુ લોડ કરો`
- Replace: `{BUTTON_TEXT.LOAD_MORE}`

**Pattern 4: Retry Buttons**
- Find: `ફરી પ્રયાસ કરો`
- Replace: `{BUTTON_TEXT.RETRY}`

## ✨ Benefits After Migration

Once all files are migrated:

1. **Single Source of Truth** - All Gujarati text in one file
2. **Easy Updates** - Change once, updates everywhere
3. **Type Safety** - TypeScript autocomplete and validation
4. **Consistency** - No duplicate or inconsistent text
5. **Future-Ready** - Easy to add multi-language support

## 🔍 Verification

After migration, search for these patterns to ensure nothing was missed:

```bash
# Search for remaining hardcoded Gujarati text
grep -r "[\u0A80-\u0AFF]" src/ --include="*.tsx" --include="*.ts"
```

## 📝 Notes

- The constants file uses `as const` for type safety
- Helper functions are provided for dynamic messages
- Backward compatibility is maintained in uiUtils.ts
- All constants are exported with TypeScript types
