'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/constants/api';
import Link from 'next/link';

interface BreakingNewsItem {
  id: number;
  title: string;
  slug: string;
  category_slugs?: string;
  created_at?: string;
  url?: string;
}

interface BreakingNewsResponse {
  breakingnews: BreakingNewsItem[];
  newsflash: string;
}

function timeAgoGu(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1)  return 'હમણાં';
    if (diff < 60) return `${diff} મિનિટ પહેલા`;
    const h = Math.floor(diff / 60);
    if (h < 24)   return `${h} કલાક પહેલા`;
    return `${Math.floor(h / 24)} દિવસ પહેલા`;
  } catch { return ''; }
}

const BreakingNews: React.FC = () => {
  const [items,        setItems]        = useState<BreakingNewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible,    setIsVisible]    = useState(true);
  const [isClosing,    setIsClosing]    = useState(false);
  const [loading,      setLoading]      = useState(true);

  // ── Fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetch_ = async () => {
      try {
        const res  = await fetch(API_ENDPOINTS.BREAKING_NEWS, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BreakingNewsResponse = await res.json();

        let list: BreakingNewsItem[] = [];
        if (Array.isArray(data.breakingnews) && data.breakingnews.length > 0) {
          list = data.breakingnews.filter(n => n?.title);
        } else if (data.newsflash?.trim()) {
          list = data.newsflash.split('•••')
            .map((t, i) => ({ id: i, title: t.trim(), slug: '' }))
            .filter(n => n.title);
        }
        if (!cancelled) setItems(list);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch_();
    return () => { cancelled = true; };
  }, []);

  // ── Auto-rotate ────────────────────────────────────────────────────────
  useEffect(() => {
    if (items.length > 1) {
      const t = setInterval(() => {
        setCurrentIndex(p => (p + 1) % items.length);
      }, 5000);
      return () => clearInterval(t);
    }
  }, [items.length]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 400);
  };

  if (loading || !isVisible || items.length === 0) return null;

  const current = items[currentIndex];
  const catSlug = current.category_slugs?.split(',')[0]?.toLowerCase() || 'gujarat';
  const href    = current.slug
    ? `/news/${catSlug}/${current.slug}`
    : (current.url || '#');
  const timeStr = timeAgoGu(current.created_at);

  return (
    <div className={`bn-wrap${isClosing ? ' bn-closing' : ''}`}>

      {/* Left label */}
      <span className="bn-label custom-gujrati-font">
        બ્રેકિંગ ન્યૂઝ
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 4, flexShrink: 0 }}>
          <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg>
      </span>

      {/* Divider */}
      <span className="bn-divider" />

      {/* Title — animates on change */}
      <Link
        href={href}
        className="bn-title custom-gujrati-font"
        key={currentIndex}
      >
        {current.title}
      </Link>

      {/* Timestamp + arrow */}
      {timeStr && (
        <span className="bn-time custom-gujrati-font">
          {timeStr}&nbsp;&gt;
        </span>
      )}

      {/* Close */}
      <button className="bn-close" onClick={handleClose} aria-label="Close">✕</button>
    </div>
  );
};

export default BreakingNews;
