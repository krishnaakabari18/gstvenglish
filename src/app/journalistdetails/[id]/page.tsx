'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ENDPOINTS, getGujaratImageUrlV2 } from '@/constants/api';
import ShareButtons from '@/components/ShareButtons';
import Link from 'next/link';

// TypeScript interfaces for the API response
interface JournalistDetail {
  id: number;
  userID: number;
  name: string;
  title: string;
  description: string;
  featureImage: string[] | string; // Can be array or JSON string array
  video: string | null;
  video_status: number;
  city: string;
  adminid: number;
  agree_status: number;
  status: string;
  created_at: string;
  updated_at: string;
  video_img: string | null;
}

interface ApiResponse {
  success: boolean;
  data: JournalistDetail;
  last_id: number | null;
}

const JournalistDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalistDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duplicateDetected, setDuplicateDetected] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [currentVisibleEntry, setCurrentVisibleEntry] = useState<number | null>(null);
  const entryRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const visibilityObserverRef = useRef<IntersectionObserver | null>(null);
  const initialLoadDone = useRef(false);
  const lastLoadedId = useRef<number | null>(null);
  const entriesRef = useRef<JournalistDetail[]>([]);
  const currentVisibleEntryRef = useRef<number | null>(null);
  const isLoadingNextRef = useRef(false);

  const currentId = params?.id ? parseInt(params.id as string) : null;

  // Format date function -> "11 Nov 2025"
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',  // Nov
        year: 'numeric'
      });
    } catch {
      return 'Unknown Date';
    }
  };

  // Parse feature images - handle both array and JSON string
  const parseFeatureImages = (featureImageData: string[] | string): string[] => {
    try {
      if (Array.isArray(featureImageData)) return featureImageData;
      if (typeof featureImageData === 'string' && featureImageData.trim() !== '') {
        const parsed = JSON.parse(featureImageData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // Get image URL with fallback
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '/assets/images/news-default.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return getGujaratImageUrlV2(imagePath);
  };

  // Get video URL
  const getVideoUrl = (videoPath: string): string => {
    if (!videoPath) return '';
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) return videoPath;
    return getGujaratImageUrlV2(videoPath);
  };

  // Choose story image for meta/og/twitter/ld
  const getStoryImageForEntry = (entry: JournalistDetail): string => {
    // 1) video_img
    if (entry.video_img && entry.video_img.trim() !== '') {
      return getImageUrl(entry.video_img);
    }

    // 2) featureImage first item
    const featureImages = parseFeatureImages(entry.featureImage);
    if (featureImages.length > 0 && featureImages[0]) {
      return getImageUrl(featureImages[0]);
    }

    // 3) fallback
    return '/assets/images/news-default.png';
  };

  // Helpers to create/update meta tags
  const createOrUpdateMeta = (attrs: { name?: string; property?: string; content: string }) => {
    try {
      const selector = attrs.name ? `meta[name="${attrs.name}"]` : `meta[property="${attrs.property}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (attrs.name) el.setAttribute('name', attrs.name);
        if (attrs.property) el.setAttribute('property', attrs.property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', attrs.content);
    } catch (err) {
      // ignore
    }
  };

  const setCanonical = (href: string) => {
    try {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    } catch (err) {
      // ignore
    }
  };

  // JSON-LD injection/update
  const setJsonLdForEntry = (entry: JournalistDetail, imageUrl: string) => {
    try {
      const ld = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${window.location.origin}/journalistdetails/${entry.id}`
        },
        "headline": entry.title,
        "image": [imageUrl],
        "datePublished": entry.created_at,
        "dateModified": entry.updated_at || entry.created_at,
        "author": {
          "@type": "Person",
          "name": entry.name || "GSTV Journalist"
        },
        "publisher": {
          "@type": "Organization",
          "name": "GSTV",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/assets/images/gstv-logo-bg.png`
          }
        },
        "description": entry.description ? entry.description.replace(/<[^>]*>/g, '').slice(0, 300) : ''
      };

      let script = document.getElementById('journalist-json-ld') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'journalist-json-ld';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(ld);
    } catch (err) {
      // ignore
    }
  };

  // Update meta tags and URL (centralized)
  const updateMetaAndUrl = useCallback((entry: JournalistDetail) => {
    try {
      const newUrlPath = `/journalistdetails/${entry.id}`;
      const fullUrl = `${window.location.origin}${newUrlPath}`;

      // Update URL without refresh
      if (window.location.pathname !== newUrlPath) {
        window.history.replaceState({}, '', newUrlPath);
      }

      // Title
      const newTitle = `${entry.title} | GSTV News`;
      if (document.title !== newTitle) document.title = newTitle;

      // Description (cleaned)
      const cleanDescription = (entry.description || '').replace(/<[^>]*>/g, '').trim();
      const metaDesc = cleanDescription.length > 160 ? cleanDescription.substring(0, 157) + '...' : cleanDescription;
      createOrUpdateMeta({ name: 'description', content: metaDesc });

      // Keywords - create reasonable keywords from title + site keywords (example)
      const titleKeywords = (entry.title || '').split(/\s+/).slice(0, 12).map(k => k.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()).filter(Boolean);
      const baseKeywords = ['GSTV', 'journalist', 'student news', 'local news', 'Gujarat'];
      const keywords = Array.from(new Set([...titleKeywords, ...baseKeywords])).slice(0, 15).join(', ');
      createOrUpdateMeta({ name: 'keywords', content: keywords });

      // Canonical
      setCanonical(fullUrl);

      // Open Graph
      createOrUpdateMeta({ property: 'og:title', content: entry.title });
      createOrUpdateMeta({ property: 'og:description', content: metaDesc });
      createOrUpdateMeta({ property: 'og:url', content: fullUrl });
      createOrUpdateMeta({ property: 'og:site_name', content: 'GSTV' });
      createOrUpdateMeta({ property: 'og:type', content: 'article' });

      // Choose image for meta
      const storyImage = getStoryImageForEntry(entry);
      createOrUpdateMeta({ property: 'og:image', content: storyImage });
      createOrUpdateMeta({ property: 'og:image:alt', content: entry.title || 'GSTV story image' });

      // Twitter
      createOrUpdateMeta({ name: 'twitter:card', content: 'summary_large_image' });
      createOrUpdateMeta({ name: 'twitter:title', content: entry.title });
      createOrUpdateMeta({ name: 'twitter:description', content: metaDesc });
      createOrUpdateMeta({ name: 'twitter:image', content: storyImage });

      // JSON-LD
      setJsonLdForEntry(entry, storyImage);
    } catch (err) {
      console.error('Error updating meta:', err);
    }
  }, []);

  // Fetch journalist details from API
  const fetchJournalistDetails = useCallback(async (id: number): Promise<ApiResponse | null> => {
    try {
      const response = await fetch(API_ENDPOINTS.JOURNALIST_DETAILS, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          gujaratid: id.toString()
        }),
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        const errorText = await response.text();
        console.error('HTTP Error Response:', errorText.substring(0, 500));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const data: ApiResponse = JSON.parse(responseText);
      return data;
    } catch (error) {
      console.error('Error fetching details for ID', id, error);
      return null;
    }
  }, []);

  // Sync entriesRef with entries state
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  // Load initial entry
  useEffect(() => {
    const loadInitialEntry = async () => {
      if (!currentId) return;

      const entryAlreadyLoaded = entriesRef.current.some(entry => entry.id === currentId);
      if (entryAlreadyLoaded && initialLoadDone.current) return;

      setLoading(true);
      setError(null);
      setEntries([]);
      entriesRef.current = [];
      setLastId(null);
      setHasMore(true);
      initialLoadDone.current = false;

      const result = await fetchJournalistDetails(currentId);

      if (result && result.success && result.data) {
        setEntries([result.data]);
        entriesRef.current = [result.data];
        setLastId(result.last_id);
        setHasMore(result.last_id !== null);
        setCurrentVisibleEntry(result.data.id);
        currentVisibleEntryRef.current = result.data.id;

        // Update metadata (title, og, twitter, json-ld)
        updateMetaAndUrl(result.data);

        initialLoadDone.current = true;
        lastLoadedId.current = currentId;
      } else {
        setError('Failed to load journalist details');
      }

      setLoading(false);
    };

    loadInitialEntry();
  }, [currentId, fetchJournalistDetails, updateMetaAndUrl]);

  // Load next entry (infinite scroll)
  const loadNextEntry = useCallback(async () => {
    if (!hasMore || loadingMore || !lastId || isLoadingNextRef.current) return;
    setLoadingMore(true);
    isLoadingNextRef.current = true;

    const result = await fetchJournalistDetails(lastId);

    if (result && result.success && result.data) {
      // Duplicate checks by ID and content
      const isDuplicateById = entriesRef.current.some(entry => entry.id === result.data.id);
      if (isDuplicateById) {
        setHasMore(false);
        setLoadingMore(false);
        isLoadingNextRef.current = false;
        return;
      }

      const normalizeString = (str?: string | null) => (str || '').trim().toLowerCase();
      const newTitle = normalizeString(result.data.title);
      const newDescription = normalizeString(result.data.description);
      const newName = normalizeString(result.data.name);

      const isDuplicateByContent = entriesRef.current.some(entry => {
        const existingTitle = normalizeString(entry.title);
        const existingDesc = normalizeString(entry.description);
        const existingName = normalizeString(entry.name);

        const titleMatch = existingTitle === newTitle && newTitle !== '';
        const descMatch = existingDesc === newDescription && newDescription !== '';
        const nameMatch = existingName === newName && newName !== '';

        return (titleMatch && descMatch) || (titleMatch && nameMatch) || (titleMatch && descMatch && nameMatch);
      });

      if (isDuplicateByContent) {
        setDuplicateDetected(true);
        setHasMore(false);
        setLoadingMore(false);
        isLoadingNextRef.current = false;
        return;
      }

      setEntries(prev => {
        const newEntries = [...prev, result.data];
        return newEntries;
      });

      setLastId(result.last_id);
      setHasMore(result.last_id !== null);

      // Immediately update meta + url for the newly loaded entry
      updateMetaAndUrl(result.data);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
    isLoadingNextRef.current = false;
  }, [hasMore, loadingMore, lastId, fetchJournalistDetails, updateMetaAndUrl]);

  // Infinite scroll trigger to load next entry
  useEffect(() => {
    let isLoading = false;
    if (!entries.length) return;

    const handleScroll = () => {
      if (isLoading) return;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= documentHeight - 200) {
        if (hasMore && !loadingMore && lastId) {
          isLoading = true;
          loadNextEntry().finally(() => {
            isLoading = false;
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entries.length, hasMore, loadingMore, lastId, loadNextEntry]);

  // Scroll-based URL/meta updates - center-of-viewport detection
  useEffect(() => {
    const handleScrollUrlUpdate = () => {
      if (entries.length === 0) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportCenter = scrollY + (windowHeight / 2);

      let currentVisibleEntryId: number | null = null;
      let minDistance = Infinity;

      entries.forEach((entry) => {
        const el = entryRefs.current.get(entry.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const entryTop = scrollY + rect.top;
        const entryCenter = entryTop + (rect.height / 2);
        const entryBottom = entryTop + rect.height;
        const isInViewport = entryTop < scrollY + windowHeight && entryBottom > scrollY;

        if (isInViewport) {
          const distance = Math.abs(entryCenter - viewportCenter);
          if (distance < minDistance) {
            minDistance = distance;
            currentVisibleEntryId = entry.id;
          }
        }
      });

      if (currentVisibleEntryId && currentVisibleEntryId !== currentVisibleEntry) {
        const currentEntry = entries.find(e => e.id === currentVisibleEntryId);
        if (currentEntry) {
          setCurrentVisibleEntry(currentVisibleEntryId);
          updateMetaAndUrl(currentEntry);
        }
      }
    };

    let ticking = false;
    const throttled = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollUrlUpdate();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttled, { passive: true });
    setTimeout(handleScrollUrlUpdate, 100);
    return () => window.removeEventListener('scroll', throttled);
  }, [entries, currentVisibleEntry, updateMetaAndUrl]);

  // Visibility observer used as a second layer (only updates on >50% visible)
  useEffect(() => {
    if (visibilityObserverRef.current) visibilityObserverRef.current.disconnect();
    if (entries.length === 0) return;

    visibilityObserverRef.current = new IntersectionObserver(
      (observerEntries) => {
        let mostVisible: JournalistDetail | null = null;
        let highestRatio = 0;
        observerEntries.forEach((oe) => {
          if (oe.isIntersecting && oe.intersectionRatio > 0.5) {
            const entryId = parseInt(oe.target.getAttribute('data-entry-id') || '0', 10);
            const entry = entries.find(e => e.id === entryId);
            if (entry && oe.intersectionRatio > highestRatio) {
              mostVisible = entry;
              highestRatio = oe.intersectionRatio;
            }
          }
        });

       const visibleEntry = mostVisible as JournalistDetail | null;

if (
  visibleEntry !== null &&
  typeof visibleEntry.id === 'number' &&
  visibleEntry.id !== currentVisibleEntryRef.current
) {
  if (
    currentVisibleEntryRef.current === null ||
    visibleEntry.id < currentVisibleEntryRef.current
  ) {
    currentVisibleEntryRef.current = visibleEntry.id;
    setCurrentVisibleEntry(visibleEntry.id);
    updateMetaAndUrl(visibleEntry);
  }
}
      },
      { threshold: [0.1, 0.25, 0.5, 0.75, 0.9], rootMargin: '-50px 0px -50px 0px' }
    );

    entryRefs.current.forEach((el) => {
      if (visibilityObserverRef.current) visibilityObserverRef.current.observe(el);
    });

    return () => {
      if (visibilityObserverRef.current) visibilityObserverRef.current.disconnect();
    };
  }, [entries, updateMetaAndUrl]);

  if (loading) {
    return (
      <div className="blogs-main-section inner">
        <div className="detail-page-heading-h1">
          <h1 className="content-page-title">લોડ થઈ રહ્યું છે...</h1>
        </div>
        <div className="row blog-content" id='news-container'>
          <div className="col-lg-12 detail-page">
            <div className="blog-read-content">
              <div className="detail-page">
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
                  <p>જર્નાલિસ્ટ લોડ થઈ રહ્યું છે...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-main-section inner">
        <div className="detail-page-heading-h1">
          <h1 className="content-page-title">ભૂલ</h1>
        </div>
        <div className="row blog-content" id="news-container">
          <div className="col-lg-12 detail-page">
            <div className="blog-read-content">
              <div className="detail-page">
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#dc3545' }}>
                  <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="blogs-main-section inner custom-blog-details undefined nextstorydiv">
        <div className="blogs-head-bar inner">
          <span className="blog-category detail-page-heading">
            <Link href="/">Home</Link> / <Link href="/journalist"><i>આઈ એમ જર્નાલિસ્ટ</i></Link>
          </span>
        </div>

        {entries.map((entry, index) => {
          const featureImages = parseFeatureImages(entry.featureImage);
          const storyImage = getStoryImageForEntry(entry);

          return (
            <div
              key={entry.id}
              ref={(el) => {
                if (el) entryRefs.current.set(entry.id, el);
              }}
              data-entry-id={entry.id}
            >
              <div className="detail-page-heading-h1">
                <h1>{entry.title}</h1>
              </div>

              <div className="row blog-content">
                <div className="col-lg-12 detail-page">
                  <div className="blog-read-content">
                    <div className="blog-featured-functions">
                      <div className="reading-time-blog">
                        <b>રિપોર્ટેડ બાય :</b> {entry.name}, {entry.city}
                        &nbsp;&nbsp;
                        <img src="/assets/icons/clock.webp" alt="" />
                        છેલ્લું અપડેટ : {formatDate(entry.created_at)}
                      </div>
                      <ShareButtons
                        url={`${window.location.origin}/journalistdetails/${entry.id}`}
                        title={entry.title}
                        variant="fontawesome"
                        showDate={true}
                        date={entry.created_at}
                        imageUrl={
                          entry.video_img
                            ? getImageUrl(entry.video_img)
                            : (Array.isArray(entry.featureImage) && entry.featureImage.length > 0
                                ? getImageUrl(entry.featureImage[0])
                                : "/assets/images/news-default.png")
                        }
                      />
                    </div>

                    <div className="blog-featured-image">
                      <div className="blog-featured-image-inner">
                        {(() => {
                          if (entry.video && entry.video.trim() !== '') {
                            const videoUrl = getVideoUrl(entry.video);
                            return (
                              <div className="video-container">
                                <video
                                  controls
                                  style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
                                  poster={entry.video_img ? getImageUrl(entry.video_img) : undefined}
                                >
                                  <source src={videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            );
                          } else if (featureImages.length > 0) {
                            const imageUrl = getImageUrl(featureImages[0]);
                            return (
                              <img
                                style={{ height: 'auto', width: '100%' }}
                                src={imageUrl}
                                alt={entry.title}
                                onError={(e) => { e.currentTarget.src = '/assets/images/news-default.png'; }}
                              />
                            );
                          } else {
                            return (
                              <img
                                style={{ height: 'auto', width: '100%' }}
                                src="/assets/images/news-default.png"
                                alt={entry.title}
                              />
                            );
                          }
                        })()}
                      </div>
                    </div>

                    <div className="detail-page finalContent" style={{ height: 'auto', overflow: 'visible' }}>
                      <div dangerouslySetInnerHTML={{ __html: entry.description }} />
                    </div>

                    {/* Additional Images */}
                    {featureImages.length > 0 && featureImages.map((image, imgIndex) => {
                      const hasVideo = entry.video && entry.video.trim() !== '';
                      const shouldShow = hasVideo ? true : imgIndex !== 0;
                      if (!shouldShow) return null;
                      const imageUrl = getImageUrl(image);
                      return (
                        <div key={imgIndex} className="lazyload-wrapper" style={{ textAlign: 'center' }}>
                          <img
                            style={{ width: '60%', height: 'auto' }}
                            src={imageUrl}
                            className="innerpage"
                            alt={`${entry.title} - Image ${imgIndex + 1}`}
                            onLoad={() => console.log(`Image ${imgIndex} loaded:`, imageUrl)}
                            onError={(e) => { e.currentTarget.src = '/assets/images/news-default.png'; }}
                          />
                        </div>
                      );
                    })}

                  </div>
                </div>
              </div>

              {/* Next Story Indicator */}
              {index !== entries.length - 1 && (
                <div id={`next-story-${entry.id}`} className="next-story">
                  <span style={{ marginRight: '8px' }}>નેક્સ્ટ સ્ટોરી</span>
                  <img
                    src="/assets/images/next-arrow.gif"
                    width="16"
                    height="16"
                    alt="Arrow GIF"
                    style={{ verticalAlign: 'middle', opacity: 0.8 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Hidden last_id input for compatibility */}
        <input type="hidden" id="last_id" value={lastId || ''} />

        {/* Loading indicator for infinite scroll */}
        {entries.length > 0 && (
          <div ref={loadingRef} style={{ textAlign: 'center', padding: '20px 0', minHeight: '50px' }}>
            {hasMore && loadingMore && (
              <>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '18px', marginRight: '10px' }}></i>
                <span>વધુ સામગ્રી લોડ થઈ રહી છે...</span>
              </>
            )}
          </div>
        )}

        {/* End message */}
        {!hasMore && entries.length > 1 && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: duplicateDetected ? '#fff3cd' : '#f8f9fa',
            border: duplicateDetected ? '2px solid #ffc107' : '1px solid #dee2e6',
            borderRadius: '8px',
            color: duplicateDetected ? '#856404' : '#666'
          }}>
            {duplicateDetected ? (
              <>
                <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                  ⚠️ ડુપ્લિકેટ સામગ્રી શોધાઈ
                </p>
                <p style={{ fontSize: '14px' }}>સમાન સામગ્રી બતાવવાનું ટાળવા માટે લોડિંગ બંધ કરવામાં આવી છે.</p>
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                  (Duplicate content detected. Loading stopped to prevent showing repeated content.)
                </p>
              </>
            ) : (
              <p>તમને બધી જર્નાલિસ્ટ સ્ટોરીઝ મળી ગઈ છે.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default JournalistDetailsPage;
