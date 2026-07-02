/**
 * Language Sync Utility
 * This utility synchronizes React LanguageContext with global window object
 * so that vanilla JavaScript files (like category-modal.js) can access the current language
 */

/**
 * Set the global language variable that vanilla JS can access
 * Call this from React components whenever the language changes
 * @param lang - The language code ('en' or 'gu')
 */
export function setSyncLanguage(lang: 'en' | 'gu') {
  if (typeof window !== 'undefined') {
    window.GSTV_LANG = lang;
    // Also dispatch an event so listening components can react to language changes
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
  }
}

/**
 * Get the current synced language
 * @returns The current language code or 'en' as default
 */
export function getSyncLanguage(): 'en' | 'gu' {
  if (typeof window !== 'undefined' && window.GSTV_LANG) {
    return window.GSTV_LANG;
  }
  return 'en';
}

/**
 * Listen for language changes
 * @param callback - Function to call when language changes
 * @returns Cleanup function to remove the listener
 */
export function onLanguageChange(callback: (lang: 'en' | 'gu') => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.lang);
  };

  window.addEventListener('languageChange', handler);

  return () => {
    window.removeEventListener('languageChange', handler);
  };
}
