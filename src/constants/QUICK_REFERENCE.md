# Quick Reference - Gujarati Strings Constants

## 🚀 Quick Start

```typescript
import { 
  LOADING_MESSAGES, 
  BUTTON_TEXT, 
  CATEGORIES 
} from '@/constants/gujaratiStrings';
```

## 📋 Available Constants

### LOADING_MESSAGES
```typescript
LOADING_MESSAGES.LOADING                  // લોડ થઈ રહ્યું છે...
LOADING_MESSAGES.LOADING_MORE             // વધુ લોડ થઈ રહ્યું છે...
LOADING_MESSAGES.LOADING_NEWS             // સમાચાર લોડ થઈ રહ્યા છે...
LOADING_MESSAGES.LOADING_MORE_NEWS        // વધુ સમાચાર લોડ થઈ રહ્યા છે...
LOADING_MESSAGES.LOADING_VIDEOS           // વીડિયો લોડ થઈ રહ્યા છે...
LOADING_MESSAGES.LOADING_CATEGORIES       // કેટેગરી લોડ થઈ રહ્યા છે...
LOADING_MESSAGES.LOADING_WEB_STORY        // વેબ સ્ટોરી લોડ થઈ રહી છે...
LOADING_MESSAGES.LOADING_GSTV_SATRANG    // GSTV શતરંગ લોડ થઈ રહ્યું છે...
LOADING_MESSAGES.LOADING_GSTV_MAGAZINE   // GSTV મેગેઝિન લોડ થઈ રહ્યા છે...
LOADING_MESSAGES.NEXT_VIDEO_COMING       // આગળનો વીડિયો આવી રહ્યો છે...
```

### ERROR_MESSAGES
```typescript
ERROR_MESSAGES.MAGAZINE_LOAD_ERROR        // મેગેઝિન લોડ કરવામાં ભૂલ
ERROR_MESSAGES.FAST_TRACK_LOAD_ERROR      // GSTV Fast Track લોડ કરવામાં ભૂલ
ERROR_MESSAGES.LINK_COPY_FAILED           // લિંક કોપી કરવામાં નિષ્ફળ!
```

### SUCCESS_MESSAGES
```typescript
SUCCESS_MESSAGES.LINK_COPIED              // લિંક કોપી થઈ ગઈ!
SUCCESS_MESSAGES.VIDEO_BOOKMARKED         // વીડિયો બુકમાર્ક કરવામાં આવ્યો
SUCCESS_MESSAGES.VIDEO_BOOKMARK_REMOVED   // વીડિયો બુકમાર્કમાંથી દૂર કરવામાં આવ્યો
```

### BUTTON_TEXT
```typescript
BUTTON_TEXT.READ_MORE                     // વધુ વાંચો
BUTTON_TEXT.LOAD_MORE                     // વધુ લોડ કરો
BUTTON_TEXT.RETRY                         // ફરી પ્રયાસ કરો
BUTTON_TEXT.GO_BACK                       // પાછા જાઓ
```

### NAVIGATION
```typescript
NAVIGATION.HOME                           // હોમ
NAVIGATION.PREVIOUS_VIDEO                 // પાછલો વીડિયો
NAVIGATION.NEXT_VIDEO                     // આગળનો વીડિયો
```

### CATEGORIES
```typescript
CATEGORIES.GSTV_SATRANG                   // GSTV શતરંગ
CATEGORIES.GSTV_MAGAZINE                  // GSTV મેગેઝિન
CATEGORIES.GSTV_FAST_TRACK                // GSTV ફાસ્ટ ટ્રેક
CATEGORIES.MAGAZINE                       // મેગેઝિન
```

### TIME_AGO
```typescript
TIME_AGO.JUST_NOW                         // હમણાં જ
TIME_AGO.MINUTES_AGO                      // મિનિટ પહેલા
TIME_AGO.HOURS_AGO                        // કલાક પહેલા
TIME_AGO.DAYS_AGO                         // દિવસ પહેલા
TIME_AGO.WEEKS_AGO                        // અઠવાડિયા પહેલા
TIME_AGO.MONTHS_AGO                       // મહિના પહેલા
TIME_AGO.YEARS_AGO                        // વર્ષ પહેલા
```

### GENERAL_MESSAGES
```typescript
GENERAL_MESSAGES.NO_MORE_DATA             // (empty string)
GENERAL_MESSAGES.END_OF_NEWS              // તમે સમાચારના અંત સુધી પહોંચી ગયા છો.
GENERAL_MESSAGES.ALL_VIDEOS_WATCHED       // તમે બધા વીડિયો જોઈ લીધા છે!
GENERAL_MESSAGES.SOURCE                   // સોર્સ
GENERAL_MESSAGES.SOURCE_LABEL             // સોર્સ:
```

## 🛠️ Helper Functions

### getTimeAgoMessage()
```typescript
import { getTimeAgoMessage } from '@/constants/gujaratiStrings';

// Usage
getTimeAgoMessage(5, 'MINUTES_AGO')      // "5 મિનિટ પહેલા"
getTimeAgoMessage(2, 'HOURS_AGO')        // "2 કલાક પહેલા"
getTimeAgoMessage(3, 'DAYS_AGO')         // "3 દિવસ પહેલા"
```

### getErrorMessage()
```typescript
import { getErrorMessage } from '@/constants/gujaratiStrings';

// Usage
getErrorMessage('MAGAZINE_LOAD_ERROR')                    // "મેગેઝિન લોડ કરવામાં ભૂલ"
getErrorMessage('MAGAZINE_LOAD_ERROR', 'Network error')   // "મેગેઝિન લોડ કરવામાં ભૂલ: Network error"
```

## 💡 Common Use Cases

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

### Load More Button
```tsx
<button onClick={handleLoadMore}>
  {BUTTON_TEXT.LOAD_MORE}
</button>
```

### Error Display
```tsx
<p style={{ color: '#dc3545' }}>
  {getErrorMessage('MAGAZINE_LOAD_ERROR', error)}
</p>
```

### Retry Button
```tsx
<button onClick={handleRetry}>
  {BUTTON_TEXT.RETRY}
</button>
```

### Video Navigation
```tsx
<button title={NAVIGATION.PREVIOUS_VIDEO}>
  <i className="fas fa-chevron-left"></i>
</button>

<button title={NAVIGATION.NEXT_VIDEO}>
  <i className="fas fa-chevron-right"></i>
</button>
```

### Success Alert
```tsx
alert(SUCCESS_MESSAGES.LINK_COPIED);
```

### Time Display
```tsx
const timeText = getTimeAgoMessage(minutes, 'MINUTES_AGO');
<span>{timeText}</span>
```

## 🔍 Find & Replace Patterns

### Pattern 1: Loading Messages
```
Find:    message="લોડ થઈ રહ્યું છે..."
Replace: message={LOADING_MESSAGES.LOADING}
```

### Pattern 2: Read More
```
Find:    વધુ વાંચો
Replace: {BUTTON_TEXT.READ_MORE}
```

### Pattern 3: Load More
```
Find:    વધુ લોડ કરો
Replace: {BUTTON_TEXT.LOAD_MORE}
```

### Pattern 4: Retry
```
Find:    ફરી પ્રયાસ કરો
Replace: {BUTTON_TEXT.RETRY}
```

### Pattern 5: GSTV Satrang
```
Find:    "GSTV શતરંગ"
Replace: {CATEGORIES.GSTV_SATRANG}
```

## ⚡ Pro Tips

1. **Import only what you need**
   ```typescript
   // ✅ Good
   import { BUTTON_TEXT, CATEGORIES } from '@/constants/gujaratiStrings';
   
   // ❌ Avoid
   import * as GJ from '@/constants/gujaratiStrings';
   ```

2. **Use destructuring for cleaner code**
   ```typescript
   const { READ_MORE, LOAD_MORE, RETRY } = BUTTON_TEXT;
   ```

3. **Combine with template literals**
   ```typescript
   const message = `${CATEGORIES.GSTV_SATRANG} - ${LOADING_MESSAGES.LOADING}`;
   ```

4. **Type-safe access**
   ```typescript
   // TypeScript will autocomplete and validate
   LOADING_MESSAGES.LOADING  // ✅ Valid
   LOADING_MESSAGES.INVALID  // ❌ TypeScript error
   ```

## 📱 Mobile-Friendly Snippet

Copy-paste this into your component:

```typescript
import { 
  LOADING_MESSAGES, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  BUTTON_TEXT,
  NAVIGATION,
  CATEGORIES,
  TIME_AGO,
  GENERAL_MESSAGES,
  getTimeAgoMessage,
  getErrorMessage
} from '@/constants/gujaratiStrings';
```

## 🎯 Cheat Sheet

| Need | Use |
|------|-----|
| Loading state | `LOADING_MESSAGES.*` |
| Error message | `ERROR_MESSAGES.*` or `getErrorMessage()` |
| Success message | `SUCCESS_MESSAGES.*` |
| Button text | `BUTTON_TEXT.*` |
| Navigation | `NAVIGATION.*` |
| Category name | `CATEGORIES.*` |
| Time ago | `TIME_AGO.*` or `getTimeAgoMessage()` |
| General text | `GENERAL_MESSAGES.*` |

## 📞 Need Help?

- Check `USAGE_EXAMPLES.md` for detailed examples
- See `MIGRATION_GUIDE.md` for step-by-step migration
- Review `EXAMPLE_COMPONENT_UPDATE.md` for complete examples
- Read `README.md` for comprehensive documentation
