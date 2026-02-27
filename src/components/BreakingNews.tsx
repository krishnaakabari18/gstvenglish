'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/constants/api';

interface BreakingNewsItem {
  id: number;
  title: string;
  slug: string;
  url?: string;
}

interface BreakingNewsResponse {
  breakingnews: BreakingNewsItem[];
  newsflash: string;
}

const BreakingNews: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [textObjList, setTextObjList] = useState<(BreakingNewsItem | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Fetch breaking news from API
  useEffect(() => {
    let cancelled = false;

    const fetchBreakingNews = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.BREAKING_NEWS, { cache: 'no-store', headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: BreakingNewsResponse = await response.json();

        let itemsList: string[] = [];
        let objList: (BreakingNewsItem | null)[] = [];

        const newsflashRaw = (data.newsflash || '').trim();

        if (Array.isArray(data.breakingnews)) {
          itemsList = data.breakingnews.map(n => (n?.title || '').trim()).filter(Boolean);
          objList = data.breakingnews.map(n => n || null); // Store full object for URL
        }
        else if (newsflashRaw) {
          itemsList = newsflashRaw.split('•••').map(s => s.trim()).filter(Boolean);
          objList = itemsList.map(() => null); // No URL for newsflash
        } 

        if (!cancelled) {
          setItems(itemsList);
          setTextObjList(objList);
        }
      } catch (error) {
        console.error('Error fetching breaking news:', error);
        if (!cancelled) {
          setItems([]);
          setTextObjList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBreakingNews();
    return () => { cancelled = true; };
  }, []);

  // Auto-rotate items
  useEffect(() => {
    if (items.length > 1) {
      setCurrentIndex(0);
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [items.length]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 500);
  };
  if (loading) {
    return null;
  }
  if (!isVisible || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`breakingnews ${isClosing ? 'fadeOut' : ''}`}>
        <div className="breakinglabel">
          <span className="breakingspan">બ્રેકિંગ ન્યૂઝ</span>
        </div>

        {items.map((text, index) => {
          const itemObj = textObjList[index];
          const hasUrl = itemObj?.url && itemObj.url.trim() !== '';

          return (
            <a
              key={`${index}-${text.slice(0, 20)}`}
              className={`breakingitem ${index === currentIndex ? 'active' : ''}`}
              {...(hasUrl ? { href: itemObj?.url, rel: 'noopener noreferrer' } : {})}
            >
              {text}
            </a>
          );
        })}

        <span className="closecls" onClick={handleClose}>X</span>
      </div>

      <style jsx>{`
        .breakingnews {
          display: flex !important;
          width: 100%;
          align-items: flex-start !important;
          justify-content: left;
          gap: 0 !important;
          background: #8A0B00;
          color: white;
          padding: 5px 15px;
          margin: 0 auto 20px auto;
          border-radius: 5px;
          position: relative;
          overflow: hidden;
          font-family: 'Noto Sans Gujarati', sans-serif;
          font-size: 18px;
          line-height: 1.4;
        }

        .breakingspan {
          background: transparent;
          padding: 8px 15px 8px 0;
          border-radius: 0;
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #fff;
          display: block;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .breakingitem {
          display: none;
          color: white;
          text-decoration: none;
          padding: 7px 0 0 0px;
          font-size: 18px;
          line-height: 1.4;
          transition: all 0.3s ease;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Noto Sans Gujarati', sans-serif;
          font-weight: 400;
        }

        .breakingitem.active {
          display: block;
          animation: slideIn 0.5s ease-in-out;
        }

        .breakingitem:hover {
          opacity: 0.8;
        }

        .closecls {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 20px;
          height: 20px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .closecls:hover {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.4);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }

        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }

        @media (max-width: 767px) {
          .breakingnews {
            margin-left: 0 !important;
            margin-right: 0 !important;
            border-radius: 5px !important;
            margin-bottom: 15px !important;
            padding: 6px 10px;
            font-size: 12px;
          }

          .breakingspan, .breakingitem {
            font-size: 12px;
          }

          .breakingspan {
            line-height: 18px;
            display: block;
            padding: 6px 10px;
          }

          .breakingitem {
            padding-left: 10px;
            line-height: 1.3;
          }

          .closecls {
            right: 8px;
            width: 18px;
            height: 18px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default BreakingNews;
