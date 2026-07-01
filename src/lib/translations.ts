import en from '@/locales/en.json';
import gu from '@/locales/gu.json';

export type Language = 'en' | 'gu';

// All valid translation keys come from en.json (source of truth)
export type TranslationKey = keyof typeof en;

const locales: Record<Language, typeof en> = { en, gu };

/**
 * Get a translated string for the given key and language.
 * Supports {placeholder} substitutions.
 *
 * @example
 *   getTranslation('HOME', 'gu')          // → "હોમ"
 *   getTranslation('TODAY_RASHIFAL', 'gu', { rashi: 'મેષ' })
 *                                          // → "આજનું મેષ રાશિફળ"
 */
export function getTranslation(
  key: TranslationKey,
  lang: Language,
  replacements?: Record<string, string>
): string {
  const dict = locales[lang] ?? locales.en;
  let text: string = (dict as Record<string, string>)[key] ?? (en as Record<string, string>)[key] ?? key;

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, value);
    });
  }

  return text;
}
