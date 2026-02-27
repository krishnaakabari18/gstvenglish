'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useTopVideos } from '@/hooks/useTopVideos';
import { MEDIA_BASE_URL } from '@/constants/api';
import ErrorMessage from '@/components/ErrorMessage';
import '@/styles/TopVideos.css';

const AUTO_SLIDE_INTERVAL = 5000;

export default function TopVideos() {
  const { videos, loading, error, refetch } = useTopVideos();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [itemWidth, setItemWidth] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTimer = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* =========================
     Resize (DEBOUNCED)
  ========================= */
  const updateItemsPerView = useCallback(() => {
    const bodyWidth = window.innerWidth;
    const incno = bodyWidth < 768 ? 3 : 6;

    setItemsPerView(prev => (prev !== incno ? incno : prev));

    if (sliderRef.current?.parentElement) {
      const width = sliderRef.current.parentElement.offsetWidth;
      setItemWidth(width / incno);
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();

    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(updateItemsPerView, 120);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, [updateItemsPerView]);

  /* =========================
     Auto Rotation
  ========================= */
  useEffect(() => {
    if (!loading && isAutoRotating && videos.length > itemsPerView) {
      autoRotateRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          const max = Math.max(0, videos.length - itemsPerView);
          return prev >= max ? 0 : prev + 1;
        });
      }, AUTO_SLIDE_INTERVAL);
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [loading, isAutoRotating, videos.length, itemsPerView]);

  const maxSlides = Math.max(0, videos.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setIsAutoRotating(false);
    setCurrentSlide(p => Math.min(p + 1, maxSlides));
  }, [maxSlides]);

  const prevSlide = useCallback(() => {
    setIsAutoRotating(false);
    setCurrentSlide(p => Math.max(p - 1, 0));
  }, []);

  /* =========================
     Touch Swipe
  ========================= */
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoRotating(false);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  /* =========================
     Thumbnail Generator
  ========================= */
  const getVideoThumbnail = useCallback((video: any) => {
    if (video.featureImage) {
      const img = video.featureImage.startsWith('/')
        ? `${MEDIA_BASE_URL}${video.featureImage}`
        : video.featureImage;
      return { webp: img, gif: img };
    }

    const raw = video.videoURL || video.video_url || video.videoUrl;
    if (!raw) {
      return {
        webp: '/images/video-default.png',
        gif: '/images/video-default.png',
      };
    }

    const ext = raw.split('.').pop()?.toLowerCase();
    const base = raw.replace(`.${ext}`, '');

    const webp = `${base}_video.webp`;
    const gif = `${base}_video.gif`;

    return {
      webp: webp.startsWith('/') ? `${MEDIA_BASE_URL}${webp}` : webp,
      gif: gif.startsWith('/') ? `${MEDIA_BASE_URL}${gif}` : gif,
    };
  }, []);

  /* =========================
     Items
  ========================= */
  const items = useMemo(() => {
    return loading
      ? Array.from({ length: itemsPerView }).map((_, i) => ({
          __placeholder: true,
          id: `placeholder-${i}`,
        }))
      : videos;
  }, [loading, itemsPerView, videos]);

  if (error) {
    return (
      <div className="carousel-inner-top custom-carousel clearfix">
        <div className="section-header">
          <h2 className="section-title">Top Videos</h2>
        </div>
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div
      className="MultiCarousel"
      id="MultiCarousel"
      onMouseEnter={() => setIsAutoRotating(false)}
      onMouseLeave={() => setIsAutoRotating(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="MultiCarousel-inner topvideos"
        ref={sliderRef}
        style={{
          transform: itemWidth ? `translateX(-${currentSlide * itemWidth}px)` : 'none',
          transition: 'transform 0.3s ease',
          display: 'flex',
          width: `${itemWidth * (items.length || itemsPerView)}px`,
        }}
      >
        {items.map((video: any, index) => {
          const isPlaceholder = !!video.__placeholder;
          const thumb = !isPlaceholder ? getVideoThumbnail(video) : null;

          return (
            <div
              key={isPlaceholder ? index : video.id}
              className="item"
              style={{ width: `${itemWidth}px`, flex: 'none' }}
            >
              <div className="skeleton-wrapper">
                <div className="skeleton-image shimmer"></div>
                <div className="skeleton-play shimmer-circle"></div>
                <div className="skeleton-title shimmer"></div>
              </div>

              {!isPlaceholder && (
                <Link href={`/videos/${video.slug}`}>
                  <div className="card custom-card real-content">
                    <div className="img-wrappers">
                      <img
                        src={thumb!.webp}
                        className="video-thumbnail-img"
                        alt={video.title || ''}
                        loading="lazy"
                        onLoad={e => {
                          (e.target as HTMLImageElement)
                            .closest('.item')
                            ?.classList.add('loaded');
                        }}
                        onError={e => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallback) {
                            img.dataset.fallback = 'gif';
                            img.src = thumb!.gif;
                            return;
                          }
                          img.src = '/images/video-default.png';
                          img.closest('.item')?.classList.add('loaded');
                        }}
                      />
                    </div>

                    <div className="play-icon">
                      <i className="fa fa-play-circle"></i>
                    </div>

                    <div className="card-bodys">
                      <span className="samachar-title">{video.title}</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <button
        className={`btn btn-primary leftLst ${currentSlide === 0 ? 'over' : ''}`}
        onClick={prevSlide}
        disabled={currentSlide === 0}
      >
        <i className="fa fa-chevron-left"></i>
      </button>

      <button
        className={`btn btn-primary rightLst ${currentSlide >= maxSlides ? 'over' : ''}`}
        onClick={nextSlide}
        disabled={currentSlide >= maxSlides}
      >
        <i className="fa fa-chevron-right"></i>
      </button>
    </div>
  );
}
