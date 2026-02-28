# Gujarati Strings Constants - Usage Guide

This guide shows how to use the centralized Gujarati strings constants in your components.

## Import the Constants

```typescript
import { 
  LOADING_MESSAGES, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  BUTTON_TEXT,
  CATEGORIES,
  NAVIGATION,
  TIME_AGO,
  GENERAL_MESSAGES,
  getTimeAgoMessage,
  getErrorMessage
} from '@/constants/gujaratiStrings';
```

## Usage Examples

### 1. Loading Messages

**Before:**
```tsx
<LoadingSpinner message="લોડ થઈ રહ્યું છે..." />
```

**After:**
```tsx
<LoadingSpinner message={LOADING_MESSAGES.LOADING} />
```

### 2. Category Names

**Before:**
```tsx
<span className="blog-category">GSTV શતરંગ</span>
```

**After:**
```tsx
<span className="blog-category">{CATEGORIES.GSTV_SATRANG}</span>
```

### 3. Button Text

**Before:**
```tsx
<Link href="/category/satrang" className="custom-link-btn">
  વધુ વાંચો <i className="fas fa-chevron-right"></i>
</Link>
```

**After:**
```tsx
<Link href="/category/satrang" className="custom-link-btn">
  {BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>
</Link>
```

### 4. Error Messages with Details

**Before:**
```tsx
<p>મેગેઝિન લોડ કરવામાં ભૂલ: {error}</p>
```

**After:**
```tsx
<p>{getErrorMessage('MAGAZINE_LOAD_ERROR', error)}</p>
```

### 5. Time Ago Messages

**Before:**
```tsx
if (seconds < 60) return "હમણાં જ";
if (minutes < 60) return `${minutes} મિનિટ પહેલા`;
```

**After:**
```tsx
if (seconds < 60) return TIME_AGO.JUST_NOW;
if (minutes < 60) return getTimeAgoMessage(minutes, 'MINUTES_AGO');
```

### 6. Success Messages

**Before:**
```tsx
const message = newStatus === 1
  ? 'વીડિયો બુકમાર્ક કરવામાં આવ્યો'
  : 'વીડિયો બુકમાર્કમાંથી દૂર કરવામાં આવ્યો';
```

**After:**
```tsx
const message = newStatus === 1
  ? SUCCESS_MESSAGES.VIDEO_BOOKMARKED
  : SUCCESS_MESSAGES.VIDEO_BOOKMARK_REMOVED;
```

### 7. Navigation Text

**Before:**
```tsx
<button title="પાછા જાઓ">←</button>
```

**After:**
```tsx
<button title={NAVIGATION.GO_BACK}>←</button>
```

## Files to Update

Here's a list of files that need to be updated to use the new constants:

1. **src/utils/uiUtils.ts** - Update LOADING_MESSAGES import
2. **src/utils/timeAgo.ts** - Replace hardcoded time strings
3. **src/utils/shareUtils.ts** - Replace success/error messages
4. **src/components/GSTVSatrangBox.tsx** - Replace category and button text
5. **src/components/GSTVSatrang.tsx** - Replace category and button text
6. **src/components/GSTVShatrangLayout.tsx** - Replace category and button text
7. **src/components/GSTVMagazine.tsx** - Replace category and loading text
8. **src/components/GstvMagazineBox.tsx** - Replace error messages
9. **src/components/GstvFastTrack.tsx** - Replace category and error text
10. **src/components/Footer.tsx** - Replace navigation text
11. **src/app/videos/page.tsx** - Replace video-related messages
12. **src/app/videos/[...slug]/ClientVideoPage.tsx** - Replace video messages
13. **src/app/web-story-detail/[slug]/page.tsx** - Replace loading message
14. **src/app/web-stories/[slug]/route.ts** - Replace source label

## Benefits

✅ **Single Source of Truth** - All Gujarati text in one place
✅ **Easy Updates** - Change text once, updates everywhere
✅ **Type Safety** - TypeScript ensures correct usage
✅ **Consistency** - Same text used across the application
✅ **Maintainability** - Easy to find and update translations
✅ **Scalability** - Easy to add new languages in the future

## Adding New Strings

When you need to add new Gujarati text:

1. Open `src/constants/gujaratiStrings.ts`
2. Add your string to the appropriate section
3. Export it as part of the constant object
4. Use it in your component by importing the constant

Example:
```typescript
// In gujaratiStrings.ts
export const BUTTON_TEXT = {
  // ... existing buttons
  SUBMIT: 'સબમિટ કરો',
} as const;

// In your component
import { BUTTON_TEXT } from '@/constants/gujaratiStrings';

<button>{BUTTON_TEXT.SUBMIT}</button>
```
