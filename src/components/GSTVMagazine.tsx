'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import Link from 'next/link';
import {
  fetchMagazineCategories,
  MagazineCategory,
  filterMagazinesByType
} from '@/services/magazineApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import '@/styles/GSTVMagazine.css';

export default function GSTVMagazine() {

  const [magazines, setMagazines] = useState<MagazineCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [itemWidth, setItemWidth] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const resizeRAF = useRef<number | null>(null);

  // ✅ TOUCH REFS (ADDED)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const loadMagazines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchMagazineCategories();

      const list =
        data?.epapercat && Array.isArray(data.epapercat)
          ? filterMagazinesByType(data.epapercat, 'Magazine')
          : [];

      setMagazines(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch magazines');
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMagazines();
  }, [loadMagazines]);

  const retryFetch = () => {
    loadMagazines();
  };

  const updateItemsPerView = useCallback(() => {
    const w = window.innerWidth;

    let incno = 6;
    if (w < 768) incno = 3;
    else if (w < 992) incno = 3;
    else if (w < 1200) incno = 5;

    setItemsPerView(incno);
  }, []);

  useEffect(() => {
    updateItemsPerView();

    const onResize = () => {
      if (resizeRAF.current) cancelAnimationFrame(resizeRAF.current);
      resizeRAF.current = requestAnimationFrame(updateItemsPerView);
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      if (resizeRAF.current) cancelAnimationFrame(resizeRAF.current);
      window.removeEventListener('resize', onResize);
    };
  }, [updateItemsPerView]);

  useEffect(() => {
    if (!sliderRef.current || !magazines.length) return;

    const containerWidth =
      sliderRef.current.parentElement?.offsetWidth || 0;

    setItemWidth(containerWidth / itemsPerView);
  }, [itemsPerView, magazines.length]);

  const maxSlides = useMemo(
    () => Math.max(0, magazines.length - itemsPerView),
    [magazines.length, itemsPerView]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev >= maxSlides ? 0 : prev + 1));
  }, [maxSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev <= 0 ? maxSlides : prev - 1));
  }, [maxSlides]);

  // ✅ TOUCH HANDLERS (ADDED)
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

  useEffect(() => {
    if (!isAutoRotating || magazines.length <= itemsPerView) return;

    autoRotateRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev >= maxSlides ? 0 : prev + 1));
    }, 5000);

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [isAutoRotating, magazines.length, itemsPerView, maxSlides]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [magazines.length]);

  if (loading) {
    return (
      <div className="carousel-inner-top custom-carousel clearfix">
        <div style={{ padding: 40, textAlign: 'center' }}>
          <LoadingSpinner
            message="GSTV મેગેઝિન લોડ થઈ રહ્યા છે..."
            size="large"
            type="dots"
            color="#850E00"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel-inner-top custom-carousel clearfix">
        <div className="section-header">
          <h2 className="section-title">GSTV મેગેઝિન</h2>
        </div>
        <ErrorMessage error={error} onRetry={retryFetch} />
      </div>
    );
  }

  if (!magazines.length) {
    return (
      <div className="carousel-inner-top custom-carousel clearfix">
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          <p>No magazines available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="web-stories-section">
      <div className="storySectionNav" style={{ marginTop: 20 }}>
        <div className="storySectionNav-left">
          <Link href="/magazine">
            <img src="/assets/icons/e-paper-1.svg" alt="GSTV Magazine" />
            <span>GSTV મેગેઝિન</span>
          </Link>
        </div>
        <div className="storySectionNav-right">
          <Link href="/magazine" className="custom-link-btn">
            વધુ વાંચો <i className="fas fa-chevron-right"></i>
          </Link>
        </div>
      </div>

      <div className="custom-carousel clearfix">
        <div
          className="MultiCarousel"
          data-items="1,3,5,6"
          data-slide="1"
          data-interval="1000"
          onMouseEnter={() => setIsAutoRotating(false)}
          onMouseLeave={() => setIsAutoRotating(true)}

          // ✅ TOUCH EVENTS ADDED
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="MultiCarousel-inner topwebstory"
            ref={sliderRef}
            style={{
              transform: `translateX(-${currentSlide * itemWidth}px)`,
              transition: 'transform 0.3s ease',
              display: 'flex',
              width: itemWidth * magazines.length
            }}
          >
            {magazines.map(magazine => (
              <div
                key={magazine.id}
                style={{ width: itemWidth, flex: 'none' }}
              >
                <Link href={`/magazine/${magazine.slug}`}>
                  <div className="card custom-card">
                    <div className="img-wrappers custom-webstory-image magazine-image custom-epaper-cat">
                      <img
                        src={magazine.featureImage}
                        className="video-thumbnail-img"
                        alt={magazine.title}
                        onError={e =>
                          (e.currentTarget.src =
                            magazine.icon || '/images/magazine-default.png')
                        }
                      />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
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
      </div>
    </div>
  );
}
