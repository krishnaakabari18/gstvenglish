'use client';

import { useMemo, memo } from 'react';
import { useTopNews } from '@/hooks/useTopNews';
import ErrorMessage from '@/components/ErrorMessage';
import { GridContainer, BlogGridItem } from '@/components/common/GridComponents';
import '@/styles/TopNewsShimmer.css';

interface TopNewsProps {
  className?: string;
}

const TopNews = ({ className = '' }: TopNewsProps) => {
  const { newsData, loading, error, refetch } = useTopNews();

  // 🔥 Memoize news items rendering
  const newsItems = useMemo(() => {
    return newsData.map((news, index) => (
      <BlogGridItem
        key={news.id}
        news={news}
        className={index < 2 ? 'grid-one-cls' : ''}
      />
    ));
  }, [newsData]);

  if (error) {
    return (
      <div className="topnewshome blogs-main-section">
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      <div style={{ clear: 'both' }}></div>

      <div className={`topnewshome blogs-main-section shimmer-parent ${className}`}>
        {/* ✅ SHIMMER OVERLAY (UNCHANGED) */}
        {loading && (
          <div className="topnews-shimmer-overlay">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="topnews-skeleton-card">
                <div className="skeleton-image shimmer"></div>
                <div className="skeleton-strip shimmer"></div>
                <div className="skeleton-text shimmer"></div>
                <div className="skeleton-meta">
                  <div className="meta-line shimmer"></div>
                  <div className="meta-icons shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ REAL CONTENT (UNCHANGED STRUCTURE) */}
        <GridContainer className="blog-content">
          {newsItems}
        </GridContainer>
      </div>

      <br />
    </>
  );
};

// 🔥 Prevent unnecessary re-renders
export default memo(TopNews);
