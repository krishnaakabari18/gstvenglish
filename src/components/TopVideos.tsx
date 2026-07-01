'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import '@/styles/TopVideos.css';
import { useLanguage } from '@/contexts/LanguageContext';

const PER_PAGE = 6;

interface VideoItem {
  id: number;
  title: string;
  englishTitle?: string;
  slug: string;
  videoURL?: string;
  video_webp?: string;
  featureImage?: string | null;
  imageURL?: string;
  category_names?: string;
  category_slugs?: string;
  is_video_horizontal?: number;
  [key: string]: any;
}

/* ── category URL: "gujarat,kheda" → "/category/gujarat/kheda" ── */
function getCategoryUrl(slugs?: string): string {
  if (!slugs?.trim()) return '#';
  const parts = slugs.split(',').map(s => s.trim()).filter(Boolean);
  return `/category/${parts.join('/')}`;
}

/* ── best thumbnail ── */
function getThumb(v: VideoItem): string {
  if (v.video_webp?.trim()) return v.video_webp.trim();
  if (v.featureImage?.trim()) return v.featureImage.trim();
  if (v.imageURL?.trim()) return v.imageURL.trim();
  return '/images/video-default.png';
}

export default function TopVideos() {
  const [allVideos,   setAllVideos]   = useState<VideoItem[]>([]);
  const { t, lang } = useLanguage();
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage,    setLastPage]    = useState(1);

  const [slide,     setSlide]     = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [perView,   setPerView]   = useState(6);

  const sliderRef    = useRef<HTMLDivElement>(null);
  const tabsBarRef   = useRef<HTMLDivElement>(null);
  const resizeTimer  = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef  = useRef(false);
  const isDragging   = useRef(false);
  const mouseStartX  = useRef(0);
  const dragStartSlide = useRef(0);
  const touchStart   = useRef(0);
  const touchEnd     = useRef(0);

  /* mirror refs — always fresh values in callbacks */
  const slideRef     = useRef(0);
  const perViewRef   = useRef(6);
  const itemWidthRef = useRef(0);
  const allVideosRef = useRef<VideoItem[]>([]);

  useEffect(() => { slideRef.current     = slide;     }, [slide]);
  useEffect(() => { perViewRef.current   = perView;   }, [perView]);
  useEffect(() => { itemWidthRef.current = itemWidth; }, [itemWidth]);
  useEffect(() => { allVideosRef.current = allVideos; }, [allVideos]);

  /* ── fetch a page from TOP_VIDEOS ── */
  const fetchPage = useCallback(async (page: number, append: boolean) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (append) setLoadingMore(true); else setLoading(true);

    try {
      const res  = await fetch('/api/topVideos', {
        method: 'POST',
        cache:  'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, per_page: PER_PAGE }),
      });
      const data = await res.json();

      // Response: { current_page, data: [...], last_page }
      const items: VideoItem[] = Array.isArray(data?.data) ? data.data : [];
      setLastPage(data?.last_page ?? 1);
      setCurrentPage(data?.current_page ?? page);

      if (append) {
        setAllVideos(prev => {
          const merged = [...prev, ...items];
          allVideosRef.current = merged;
          return merged;
        });
      } else {
        setAllVideos(items);
        allVideosRef.current = items;
      }
    } catch (err) {
      console.error('TopVideos fetchPage failed', err);
    } finally {
      fetchingRef.current = false;
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  /* ── initial load ── */
  useEffect(() => { fetchPage(1, false); }, [fetchPage]);

  /* ── unique category tabs — navigation only, no filtering ── */
  const tabs = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; slugs: string }[] = [];
    allVideos.forEach(v => {
      // Use first slug only as the unique key (e.g. "gujarat" from "gujarat,kheda")
      const firstSlug = (v.category_slugs || '').split(',')[0].trim();
      const name      = (v.category_names  || '').split(',')[0].trim();
      const key       = firstSlug || name;
      if (key && !seen.has(key)) {
        seen.add(key);
        list.push({ name: name || key, slugs: v.category_slugs || key });
      }
    });
    return list;
  }, [allVideos]);

  /* ── all videos show regardless of tab ── */
  const videos = allVideos;

  /* ── layout measurement ── */
  const measure = useCallback(() => {
    const pv = window.innerWidth < 768 ? 3 : 6;
    setPerView(pv);
    perViewRef.current = pv;
    if (sliderRef.current?.parentElement) {
      const w = sliderRef.current.parentElement.offsetWidth / pv;
      setItemWidth(w);
      itemWidthRef.current = w;
    }
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(measure, 120);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  /* ── fetch more when reaching end ── */
  const triggerFetchIfNeeded = useCallback(() => {
    if (fetchingRef.current) return;
    if (currentPage >= lastPage) return;
    const cur   = slideRef.current;
    const total = allVideosRef.current.length;
    const pv    = perViewRef.current;
    if (cur >= Math.max(0, total - pv)) {
      fetchPage(currentPage + 1, true);
    }
  }, [currentPage, lastPage, fetchPage]);

  /* ── derived ── */
  const maxSlide = Math.max(0, videos.length - perView);

  /* ── navigation ── */
  const goTo = useCallback((n: number) => {
    const curMax = Math.max(0, videos.length - perViewRef.current);
    const next   = Math.max(0, Math.min(n, curMax));
    setSlide(next);
    slideRef.current = next;
    setTimeout(triggerFetchIfNeeded, 0);
  }, [videos.length, triggerFetchIfNeeded]);

  const nextSlide = useCallback(() => goTo(slideRef.current + 1), [goTo]);
  const prevSlide = useCallback(() => goTo(slideRef.current - 1), [goTo]);

  /* ── touch ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchEnd.current   = e.touches[0].clientX;
  };
  const onTouchMove  = (e: React.TouchEvent) => { touchEnd.current = e.touches[0].clientX; };
  const onTouchEnd   = () => {
    const d = touchStart.current - touchEnd.current;
    if (Math.abs(d) > 50) d > 0 ? nextSlide() : prevSlide();
  };

  /* ── mouse drag ── */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current     = false;
    mouseStartX.current    = e.clientX;
    dragStartSlide.current = slideRef.current;
    e.preventDefault();
  };
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseStartX.current) return;
    if (Math.abs(e.clientX - mouseStartX.current) > 5) isDragging.current = true;
    if (!isDragging.current) return;
    const w      = itemWidthRef.current || 1;
    const moved  = Math.round((mouseStartX.current - e.clientX) / w);
    const curMax = Math.max(0, allVideosRef.current.length - perViewRef.current);
    const next   = Math.max(0, Math.min(curMax, dragStartSlide.current + moved));
    setSlide(next);
    slideRef.current = next;
    triggerFetchIfNeeded();
  }, [triggerFetchIfNeeded]);
  const onMouseUp    = () => { mouseStartX.current = 0; setTimeout(() => { isDragging.current = false; }, 50); };
  const onMouseLeave = () => { isDragging.current = false; mouseStartX.current = 0; };

  /* ── re-measure after data loads so itemWidth is correct ── */
  useEffect(() => {
    if (!loading && videos.length > 0) {
      requestAnimationFrame(measure);
    }
  }, [loading, videos.length, measure]);

  if (loading) return null;
  if (videos.length === 0 && !loading) return null;

  const leftDisabled  = slide === 0;
  const rightDisabled = slide >= maxSlide && currentPage >= lastPage;

  /* track width covers all videos + optional loading placeholders */
  const trackItems = videos.length + (loadingMore ? perView : 0);
  const trackWidth = itemWidth * Math.max(trackItems, perView);

  return (
    <div className="tv-wrap">
      <div className="tv-box">

        {/* ── carousel ── */}
        <div
          className="MultiCarousel tv-carousel"
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ cursor: isDragging.current ? 'grabbing' : 'grab', minHeight: 180 }}
        >
          <div
            className="MultiCarousel-inner topvideos"
            ref={sliderRef}
            style={{
              display:    'flex',
              transform:  itemWidth ? `translateX(-${slide * itemWidth}px)` : 'none',
              transition: 'transform 0.3s ease',
              width:      `${trackWidth}px`,
            }}
          >
            {/* real video cards */}
            {videos.map(video => (
              <div
                key={video.id}
                className="item loaded tv-item"
                style={{ width: `${itemWidth}px`, flex: 'none', padding: '4px' }}
              >
                <div className="tv-card">
                  <Link
                    href={`/videos/${video.slug}`}
                    className="tv-thumb-link"
                    onClick={e => { if (isDragging.current) e.preventDefault(); }}
                  >
                    <div className="tv-thumb1">
                      <img
                        src={getThumb(video)}
                        alt={
                          lang === 'gu'
                            ? (video.title || '')
                            : (video.englishTitle || video.title || '')
                        }
                        loading="lazy"
                        onError={e => {
                          const img = e.currentTarget;
                          if (!img.dataset.fb) { img.dataset.fb = '1'; img.src = '/images/video-default.png'; }
                        }}
                      />
                      {/* <div className="tv-overlay">
                        <span className="tv-overlay-title custom-gujrati-font">{video.title}</span>
                      </div> */}
                      <span className="tv-play"><i className="fa fa-play-circle" /></span>
                    </div>
                  </Link>

                  {/* category title below video */}
                  {video.category_names && (
                    <Link
                      href={getCategoryUrl(video.category_slugs)}
                      className="tv-cat-label custom-gujrati-font"
                      onClick={e => { if (isDragging.current) e.preventDefault(); }}
                    >
                      {lang === 'gu'
                        ? video.title
                        : (video.title_eng || video.title)}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* loading placeholders while next page loads */}
            {loadingMore && Array.from({ length: perView }).map((_, i) => (
              <div key={`sk-${i}`} className="tv-item" style={{ width: `${itemWidth}px`, flex: 'none', padding: '4px' }}>
                <div className="tv-card">
                  <div className="tv-thumb1">
                    <img src="/images/video-default.png" alt="" style={{ opacity: 0.4 }} />
                    <div className="shimmer" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            ))}

            {/* spacers when fewer videos than one view */}
            {!loadingMore && videos.length > 0 && videos.length < perView &&
              Array.from({ length: perView - videos.length }).map((_, i) => (
                <div key={`sp-${i}`} className="tv-item" style={{ width: `${itemWidth}px`, flex: 'none', padding: '4px' }}>
                  <div className="tv-card">
                    <div className="tv-thumb1">
                      <img src="/images/video-default.png" alt="" style={{ opacity: 0.15 }} />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* ── arrows ── */}
          {leftDisabled ? (
            <span className="btn btn-primary leftLst over disabled-arrow" aria-hidden="true"
              onClick={e => { e.stopPropagation(); e.preventDefault(); }}
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
              onMouseUp={e => { e.stopPropagation(); e.preventDefault(); }}>
              <i className="fa fa-chevron-left" />
            </span>
          ) : (
            <button className="btn btn-primary leftLst" type="button"
              onClick={e => { e.stopPropagation(); e.preventDefault(); prevSlide(); }}
              onMouseDown={e => e.stopPropagation()}>
              <i className="fa fa-chevron-left" />
            </button>
          )}

          {rightDisabled ? (
            <span className="btn btn-primary rightLst over disabled-arrow" aria-hidden="true"
              onClick={e => { e.stopPropagation(); e.preventDefault(); }}
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
              onMouseUp={e => { e.stopPropagation(); e.preventDefault(); }}>
              <i className="fa fa-chevron-right" />
            </span>
          ) : (
            <button className="btn btn-primary rightLst" type="button"
              onClick={e => { e.stopPropagation(); e.preventDefault(); nextSlide(); }}
              onMouseDown={e => e.stopPropagation()}>
              <i className="fa fa-chevron-right" />
            </button>
          )}
        </div>

        {/* ── category tabs — pure navigation links ── */}
        {/* {tabs.length > 0 && (
          <div className="tv-tabs" ref={tabsBarRef}>
            {tabs.map((tab) => (
              <Link
                key={tab.slugs}
                href={getCategoryUrl(tab.slugs)}
                className="tv-tab custom-gujrati-font"
              >
                {tab.name}
              </Link>
            ))}
          </div>
        )} */}

      </div>
    </div>
  );
}
