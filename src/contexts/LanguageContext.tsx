'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { type Language, type TranslationKey, getTranslation } from '@/lib/translations';

const STORAGE_KEY = 'gstv_lang';
const DEFAULT_LANG: Language = 'en'; // ← change to 'gu' to make Gujarati the default

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Translate a key in the current language */
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);

  // Restore saved language on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'en' || saved === 'gu') setLangState(saved);
    } catch {
      // localStorage unavailable (SSR or private mode) — keep default
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch { /* ignore */ }
  }, []);

  const t = useCallback(
    (key: TranslationKey, replacements?: Record<string, string>) =>
      getTranslation(key, lang, replacements),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Use this hook in any client component to access translations */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
