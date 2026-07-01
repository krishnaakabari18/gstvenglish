'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-switcher">
      <button
        onClick={() => setLang('en')}
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="lang-divider">|</span>
      <button
        onClick={() => setLang('gu')}
        className={`lang-btn ${lang === 'gu' ? 'active' : ''}`}
        aria-label="Switch to Gujarati"
      >
        ગુ
      </button>

      <style jsx>{`
        .lang-switcher {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          padding: 3px 6px;
        }
        .lang-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          color: #fff;
          transition: background 0.2s, color 0.2s;
        }
        .lang-btn.active {
          background: #8B0000;
          color: #fff;
        }
        .lang-btn:not(.active):hover {
          background: rgba(255,255,255,0.2);
        }
        .lang-divider {
          color: rgba(255,255,255,0.4);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
