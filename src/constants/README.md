# Constants Directory

This directory contains all centralized constants used throughout the application.

## 📁 Files

### gujaratiStrings.ts
Centralized repository for all Gujarati text used in the website. This ensures consistency and makes it easy to update text across the entire application.

**Categories:**
- Loading Messages
- Error Messages
- Success Messages
- Button Text
- Navigation
- Category Names
- Time Ago Messages
- General Messages

### api.ts
API endpoints and configuration constants.

## 🎯 Purpose

The constants directory serves as a single source of truth for:

1. **Text Content** - All user-facing text in Gujarati
2. **API Configuration** - Endpoints, base URLs, and API keys
3. **Application Settings** - Feature flags, limits, and defaults
4. **Shared Values** - Any value used in multiple places

## 📖 Usage

### Importing Constants

```typescript
// Import specific categories
import { LOADING_MESSAGES, BUTTON_TEXT, CATEGORIES } from '@/constants/gujaratiStrings';

// Import helper functions
import { getTimeAgoMessage, getErrorMessage } from '@/constants/gujaratiStrings';

// Use in components
<LoadingSpinner message={LOADING_MESSAGES.LOADING} />
<button>{BUTTON_TEXT.READ_MORE}</button>
<h3>{CATEGORIES.GSTV_SATRANG}</h3>
```

### Using Helper Functions

```typescript
// Time ago with dynamic values
const message = getTimeAgoMessage(5, 'MINUTES_AGO'); // "5 મિનિટ પહેલા"

// Error messages with details
const error = getErrorMessage('MAGAZINE_LOAD_ERROR', errorDetails);
```

## 🔧 Adding New Constants

When adding new constants:

1. **Choose the right file** - Add to existing file or create new one
2. **Use descriptive names** - Use UPPER_SNAKE_CASE for constants
3. **Group logically** - Keep related constants together
4. **Add comments** - Document purpose and usage
5. **Export types** - Create TypeScript types for type safety
6. **Use `as const`** - For literal type inference

### Example: Adding New Category

```typescript
// In gujaratiStrings.ts
export const CATEGORIES = {
  // ... existing categories
  NEW_CATEGORY: 'નવી કેટેગરી',
} as const;

// Export type
export type CategoryKey = keyof typeof CATEGORIES;
```

## 🌍 Future: Multi-Language Support

The current structure is designed to easily support multiple languages:

```typescript
// Future structure
export const GUJARATI_STRINGS = { /* current constants */ };
export const ENGLISH_STRINGS = { /* English translations */ };
export const HINDI_STRINGS = { /* Hindi translations */ };

// Language selector
export const getStrings = (language: 'gu' | 'en' | 'hi') => {
  switch (language) {
    case 'gu': return GUJARATI_STRINGS;
    case 'en': return ENGLISH_STRINGS;
    case 'hi': return HINDI_STRINGS;
  }
};
```

## 📚 Documentation

- **USAGE_EXAMPLES.md** - Practical examples of using constants
- **MIGRATION_GUIDE.md** - Step-by-step guide for migrating existing code

## ✅ Best Practices

1. **Never hardcode text** - Always use constants
2. **Import only what you need** - Use named imports
3. **Use helper functions** - For dynamic content
4. **Keep it organized** - Group related constants
5. **Document changes** - Update docs when adding constants
6. **Type safety** - Use exported types in your code

## 🔍 Finding Constants

To find where a constant is used:

```bash
# Search for constant usage
grep -r "LOADING_MESSAGES.LOADING" src/

# Search for imports
grep -r "from '@/constants/gujaratiStrings'" src/
```

## 🚨 Important Notes

- **Don't modify constants at runtime** - They are immutable
- **Don't duplicate constants** - Reuse existing ones
- **Don't mix languages** - Keep each language separate
- **Do use TypeScript types** - For autocomplete and validation

## 📞 Support

If you need to add new constants or have questions:

1. Check existing constants first
2. Review USAGE_EXAMPLES.md
3. Follow the patterns in gujaratiStrings.ts
4. Update documentation when adding new constants
