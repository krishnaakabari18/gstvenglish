# Example Component Update

This document shows a complete before/after example of updating a component to use centralized constants.

## Component: GSTVSatrangBox.tsx

### ❌ BEFORE (Hardcoded Gujarati Text)

```tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import { fetchGSTVSatrangNews } from '@/services/newsService';

const GSTVSatrangBox: React.FC = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGSTVSatrangNews().then(data => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="custom-carousel clearfix">
        <LoadingSpinner
          message="GSTV શતરંગ લોડ થઈ રહ્યું છે..."
          size="large"
          type="dots"
          color="#850E00"
        />
      </div>
    );
  }

  return (
    <div className="blogs-main-section">
      <div className="storySectionNav blogs-head-bar first">
        <div className="storySectionNav-left">
          <span className="blog-category">GSTV શતરંગ</span>
        </div>
        <div className="storySectionNav-right rightstory">
          <Link href="/category/satrang" className="custom-link-btn">
            વધુ વાંચો <i className="fas fa-chevron-right"></i>
          </Link>
        </div>
      </div>
      
      {/* News content */}
      <div className="news-grid">
        {news.map(item => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
};

export default GSTVSatrangBox;
```

### ✅ AFTER (Using Constants)

```tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import { fetchGSTVSatrangNews } from '@/services/newsService';
// ✨ Import constants
import { LOADING_MESSAGES, CATEGORIES, BUTTON_TEXT } from '@/constants/gujaratiStrings';

const GSTVSatrangBox: React.FC = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGSTVSatrangNews().then(data => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="custom-carousel clearfix">
        <LoadingSpinner
          message={LOADING_MESSAGES.LOADING_GSTV_SATRANG}  {/* ✨ Using constant */}
          size="large"
          type="dots"
          color="#850E00"
        />
      </div>
    );
  }

  return (
    <div className="blogs-main-section">
      <div className="storySectionNav blogs-head-bar first">
        <div className="storySectionNav-left">
          <span className="blog-category">{CATEGORIES.GSTV_SATRANG}</span>  {/* ✨ Using constant */}
        </div>
        <div className="storySectionNav-right rightstory">
          <Link href="/category/satrang" className="custom-link-btn">
            {BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>  {/* ✨ Using constant */}
          </Link>
        </div>
      </div>
      
      {/* News content */}
      <div className="news-grid">
        {news.map(item => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
};

export default GSTVSatrangBox;
```

## Key Changes

### 1. Import Statement Added
```tsx
// ✨ NEW: Import constants at the top
import { LOADING_MESSAGES, CATEGORIES, BUTTON_TEXT } from '@/constants/gujaratiStrings';
```

### 2. Loading Message
```tsx
// ❌ BEFORE
message="GSTV શતરંગ લોડ થઈ રહ્યું છે..."

// ✅ AFTER
message={LOADING_MESSAGES.LOADING_GSTV_SATRANG}
```

### 3. Category Name
```tsx
// ❌ BEFORE
<span className="blog-category">GSTV શતરંગ</span>

// ✅ AFTER
<span className="blog-category">{CATEGORIES.GSTV_SATRANG}</span>
```

### 4. Button Text
```tsx
// ❌ BEFORE
વધુ વાંચો <i className="fas fa-chevron-right"></i>

// ✅ AFTER
{BUTTON_TEXT.READ_MORE} <i className="fas fa-chevron-right"></i>
```

## Benefits Demonstrated

### 1. Type Safety
```tsx
// TypeScript will autocomplete and validate
LOADING_MESSAGES.LOADING_GSTV_SATRANG  // ✅ Valid
LOADING_MESSAGES.INVALID_KEY            // ❌ TypeScript error
```

### 2. Easy Updates
```typescript
// In gujaratiStrings.ts - change once
export const CATEGORIES = {
  GSTV_SATRANG: 'GSTV શતરંગ - નવું',  // Updated text
} as const;

// All components automatically use the new text! 🎉
```

### 3. Consistency
```tsx
// Same constant used everywhere
<h3>{CATEGORIES.GSTV_SATRANG}</h3>
<span>{CATEGORIES.GSTV_SATRANG}</span>
<Link>{CATEGORIES.GSTV_SATRANG}</Link>

// All show the same text, guaranteed!
```

### 4. Searchability
```bash
# Easy to find all usages
grep -r "CATEGORIES.GSTV_SATRANG" src/

# Easy to find the definition
grep -r "GSTV_SATRANG:" src/constants/
```

## More Complex Example: Error Handling

### ❌ BEFORE
```tsx
const handleError = (error: string) => {
  alert(`મેગેઝિન લોડ કરવામાં ભૂલ: ${error}`);
};

const handleRetry = () => {
  // retry logic
};

return (
  <div>
    <p style={{ color: '#dc3545' }}>
      મેગેઝિન લોડ કરવામાં ભૂલ: {error}
    </p>
    <button onClick={handleRetry}>
      ફરી પ્રયાસ કરો
    </button>
  </div>
);
```

### ✅ AFTER
```tsx
import { ERROR_MESSAGES, BUTTON_TEXT, getErrorMessage } from '@/constants/gujaratiStrings';

const handleError = (error: string) => {
  alert(getErrorMessage('MAGAZINE_LOAD_ERROR', error));  // ✨ Using helper
};

const handleRetry = () => {
  // retry logic
};

return (
  <div>
    <p style={{ color: '#dc3545' }}>
      {getErrorMessage('MAGAZINE_LOAD_ERROR', error)}  {/* ✨ Using helper */}
    </p>
    <button onClick={handleRetry}>
      {BUTTON_TEXT.RETRY}  {/* ✨ Using constant */}
    </button>
  </div>
);
```

## Time Ago Example

### ❌ BEFORE
```tsx
export function timeAgo(dateString: string): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} મિનિટ પહેલા`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} કલાક પહેલા`;
}
```

### ✅ AFTER
```tsx
import { getTimeAgoMessage } from '@/constants/gujaratiStrings';

export function timeAgo(dateString: string): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return getTimeAgoMessage(minutes, 'MINUTES_AGO');  // ✨ Using helper
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return getTimeAgoMessage(hours, 'HOURS_AGO');  // ✨ Using helper
}
```

## Testing After Update

### 1. TypeScript Compilation
```bash
npm run build
# Should compile without errors
```

### 2. Visual Testing
- Check that all text displays correctly
- Verify no missing translations
- Ensure formatting is preserved

### 3. Functionality Testing
- Test loading states
- Test error messages
- Test button clicks
- Test navigation

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting Curly Braces
```tsx
// ❌ WRONG - This will show "[object Object]"
<span>{CATEGORIES}</span>

// ✅ CORRECT - Access the specific property
<span>{CATEGORIES.GSTV_SATRANG}</span>
```

### ❌ Mistake 2: String Concatenation
```tsx
// ❌ WRONG - Don't concatenate
<span>{"Category: " + CATEGORIES.GSTV_SATRANG}</span>

// ✅ CORRECT - Use template literals or separate elements
<span>Category: {CATEGORIES.GSTV_SATRANG}</span>
```

### ❌ Mistake 3: Not Importing
```tsx
// ❌ WRONG - Forgot to import
<span>{CATEGORIES.GSTV_SATRANG}</span>  // ReferenceError!

// ✅ CORRECT - Import first
import { CATEGORIES } from '@/constants/gujaratiStrings';
<span>{CATEGORIES.GSTV_SATRANG}</span>
```

## Summary

✅ **Import constants** at the top of your file
✅ **Replace hardcoded text** with constant references
✅ **Use helper functions** for dynamic content
✅ **Test thoroughly** after updates
✅ **Commit changes** with clear messages

This pattern ensures maintainable, consistent, and type-safe code! 🎉
