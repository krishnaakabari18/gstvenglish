'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ENDPOINTS, getcampuscornerImageUrl } from '@/constants/api';
import ShareButtons from '@/components/ShareButtons';
import Link from 'next/link';

// TypeScript interfaces for the API response
interface CampusCornerData {
  id: number;
  userID: number;
  name: string;
  title: string;
  description: string;
  featureImage: string[] | string; // Can be array or JSON string array
  video: string | null;
  video_status: number;
  city: string;
  school: string;
  adminid: number;
  agree_status: number;
  status: string;
  created_at: string;
  updated_at: string;
  video_img: string | null;
}

interface ApiResponse {
  success: boolean;
  data: CampusCornerData;
  last_id: number | null;
}

const CampusCornerDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [entries, setEntries] = useState<CampusCornerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duplicateDetected, setDuplicateDetected] = useState(false);
  // const observerRef = useRef<IntersectionObserver | null>(null); // Disabled for now
  const loadingRef = useRef<HTMLDivElement>(null);
  const [currentVisibleEntry, setCurrentVisibleEntry] = useState<number | null>(null);
  const entryRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const visibilityObserverRef = useRef<IntersectionObserver | null>(null);
  const initialLoadDone = useRef(false); // Track if initial load is complete
  const lastLoadedId = useRef<number | null>(null); // Track the last ID we loaded
  const entriesRef = useRef<CampusCornerData[]>([]); // Ref to track entries without causing re-renders
  const currentVisibleEntryRef = useRef<number | null>(null); // Ref to track current visible entry
  const isLoadingNextRef = useRef(false); // Prevent multiple simultaneous loads

  const currentId = params?.id ? parseInt(params.id as string) : null;

  // Track entries state for debugging if needed
  useEffect(() => {
    // State tracking removed for production
  }, [entries, lastId, hasMore, currentId]);

  // Format date function (same as campus corner)
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
       day: '2-digit',
        month: 'short',  // Nov
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

 // Get image URL with fallback (same as campus corner)
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '/assets/images/news-default.png';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Use the Gujarat image URL helper
    return getcampuscornerImageUrl(imagePath);
  };

  // Get video URL (same as campus corner)
  const getVideoUrl = (videoPath: string): string => {
    if (!videoPath) return '';

    // If it's already a full URL, return as is
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
      return videoPath;
    }

    // Use the Gujarat image URL helper for videos too
    return getcampuscornerImageUrl(videoPath);
  };

  // Update meta tags and URL
  const updateMetaAndUrl = useCallback((entry: CampusCornerData) => {
    // Update URL without page refresh
    const newUrl = `/campuscornerdetails/${entry.id}`;
    const oldUrl = window.location.pathname;

    if (oldUrl !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }

    // Update document title
    const newTitle = `${entry.title} | GSTV News`;
    if (document.title !== newTitle) {
      document.title = newTitle;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const cleanDescription = entry.description.replace(/<[^>]*>/g, '').substring(0, 160);
    if (metaDescription) {
      metaDescription.setAttribute('content', cleanDescription);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', entry.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', cleanDescription);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${window.location.origin}/campuscornerdetails/${entry.id}`);
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', entry.title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', cleanDescription);
    }
    const ogImage = document.querySelector('meta[property="og:image"]');
const twitterImage = document.querySelector('meta[name="twitter:image"]');

// Choose best image
let shareImage = "";
if (entry.video_img) {
  shareImage = getImageUrl(entry.video_img);
} else if (Array.isArray(entry.featureImage)) {
  shareImage = getImageUrl(entry.featureImage[0] || "");
} else {
  try {
    const arr = JSON.parse(entry.featureImage as string);
    shareImage = getImageUrl(arr[0] || "");
  } catch {
    shareImage = "/assets/images/news-default.png";
  }
}

// Convert to absolute URL
if (!shareImage.startsWith("http")) {
  shareImage = `${window.location.origin}${shareImage}`;
}

// Update meta image tags
if (ogImage) ogImage.setAttribute("content", shareImage);
if (twitterImage) twitterImage.setAttribute("content", shareImage);
       
  }, []);

  // Fetch journalist details from staging API
  const fetchCampusCornerDetails = useCallback(async (id: number): Promise<ApiResponse | null> => {
    try {
      const response = await fetch(API_ENDPOINTS.CAMPUS_CORNER_DETAILS, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          campuscornerid: id.toString()
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorText = await response.text();
        console.error('HTTP Error Response:', errorText.substring(0, 500));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      let data: ApiResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was not valid JSON');
        throw new Error('Invalid JSON response from API');
      }

      // Verify API returned correct data
      if (data.data && data.data.id !== id) {
        console.warn('⚠️ WARNING: API returned different ID than requested!', {
          requested: id,
          received: data.data.id
        });
      } else if (!data.data) {
        console.error('API returned success but no data!');
      }

      return data;
    } catch (error) {
      console.error('❌ ERROR fetching details for ID', id, ':', error);
      return null;
    }
  }, []);

  // Sync entriesRef with entries state
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  // Load initial entry - handles first load and real page navigation
  useEffect(() => {
    const loadInitialEntry = async () => {
      if (!currentId) return;

      // ✅ CRITICAL FIX: Use ref to check if entry is already loaded
      // This prevents dependency loop with entries state
      const entryAlreadyLoaded = entriesRef.current.some(entry => entry.id === currentId);

      if (entryAlreadyLoaded && initialLoadDone.current) {
        // Entry already loaded - visibility observer handles URL updates
        return;
      }

      // If entries array is empty OR entry is not loaded, do a fresh load
      // This handles: first mount, page refresh, browser back/forward to different page

      // Reset state for fresh load
      setLoading(true);
      setError(null);
      setEntries([]); // Clear entries for fresh load
      entriesRef.current = []; // Also clear ref
      setLastId(null);
      setHasMore(true);
      initialLoadDone.current = false;

      const result = await fetchCampusCornerDetails(currentId);

      if (result && result.success && result.data) {
        setEntries([result.data]);
        entriesRef.current = [result.data]; // Also update ref
        setLastId(result.last_id);
        setHasMore(result.last_id !== null);
        setCurrentVisibleEntry(result.data.id);
        currentVisibleEntryRef.current = result.data.id;

        // Update page title and meta tags using the new function
        updateMetaAndUrl(result.data);

        // Mark initial load as complete
        initialLoadDone.current = true;
        lastLoadedId.current = currentId;
      } else {
        console.error('❌ Failed to load initial entry');
        setError('Failed to load campus corner details');
      }

      setLoading(false);
    };

    loadInitialEntry();
  }, [currentId, fetchCampusCornerDetails, updateMetaAndUrl]); // ✅ NO entries dependency

  // Load next entry for infinite scroll (using lastId)
  const loadNextEntry = useCallback(async () => {
    if (!hasMore || loadingMore || !lastId || isLoadingNextRef.current) {
      return;
    }

    setLoadingMore(true);

    const result = await fetchCampusCornerDetails(lastId);

    if (result && result.success && result.data) {
      // Duplicate prevention: Check if this entry already exists by ID
      const isDuplicateById = entriesRef.current.some(entry => entry.id === result.data.id);

      if (isDuplicateById) {
        console.warn('⚠️ Duplicate entry detected by ID:', result.data.id);
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      // ✅ CRITICAL CHECK: Verify the data is actually different from existing entries
      // Normalize strings for comparison (trim whitespace, handle null/undefined)
      const normalizeString = (str: string | null | undefined): string => {
        return (str || '').trim().toLowerCase();
      };

      const newTitle = normalizeString(result.data.title);
      const newDescription = normalizeString(result.data.description);
      const newName = normalizeString(result.data.name);

      const isDuplicateByContent = entriesRef.current.some(entry => {
        const existingTitle = normalizeString(entry.title);
        const existingDescription = normalizeString(entry.description);
        const existingName = normalizeString(entry.name);

        // Check if title AND (description OR name) match
        // This catches cases where the same content is being returned
        const titleMatch = existingTitle === newTitle && newTitle !== '';
        const descriptionMatch = existingDescription === newDescription && newDescription !== '';
        const nameMatch = existingName === newName && newName !== '';

        // Consider it a duplicate if:
        // 1. Title and description match, OR
        // 2. Title and name match, OR
        // 3. All three match
        const isDuplicate = (titleMatch && descriptionMatch) ||
                           (titleMatch && nameMatch) ||
                           (titleMatch && descriptionMatch && nameMatch);

        return isDuplicate;
      });

      if (isDuplicateByContent) {
        console.error('❌ DUPLICATE CONTENT DETECTED! API returned different ID but SAME content');
        setDuplicateDetected(true);
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      // Add the new entry
      setEntries(prev => {
        const newEntries = [...prev, result.data];
        return newEntries;
      });

      setLastId(result.last_id);
      setHasMore(result.last_id !== null);

      // Immediately update URL and metadata when new entry is loaded
      updateMetaAndUrl(result.data);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  }, [hasMore, loadingMore, lastId, fetchCampusCornerDetails]); // Removed entries dependency


  useEffect(() => {
    let isLoading = false;
    const loadedStories: Array<{id: number, title: string, url: string, position: number}> = [];

    // Push the first story on initial page load
    if (entries.length > 0) {
      loadedStories.push({
        id: entries[0].id,
        title: entries[0].title,
        url: `${window.location.origin}/campuscornerdetails/${entries[0].id}`,
        position: 0
      });
    }

    const handleScroll = () => {
      if (isLoading) return;

      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // Production-style trigger: 200px from bottom
      if (scrollY + windowHeight >= documentHeight - 200) {
        if (hasMore && !loadingMore && lastId) {

          isLoading = true;
          loadNextEntry().finally(() => {
            isLoading = false;
          });
        }
      }

      // URL updates are now handled by the separate scroll-based URL update system
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loadingMore, lastId, entries.length]);

  // Scroll-based URL update system
  useEffect(() => {

    const handleScrollUrlUpdate = () => {
      if (entries.length === 0) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportCenter = scrollY + (windowHeight / 2);

      // Find which entry is currently most visible in the viewport
      let currentVisibleEntryId: number | null = null;
      let minDistance = Infinity;

      entries.forEach((entry) => {
        const entryElement = entryRefs.current.get(entry.id);
        if (entryElement) {
          const rect = entryElement.getBoundingClientRect();
          const entryTop = scrollY + rect.top;
          const entryBottom = entryTop + rect.height;
          const entryCenter = entryTop + (rect.height / 2);

          // Check if entry is in viewport
          const isInViewport = entryTop < scrollY + windowHeight && entryBottom > scrollY;

          if (isInViewport) {
            const distanceFromCenter = Math.abs(entryCenter - viewportCenter);
            if (distanceFromCenter < minDistance) {
              minDistance = distanceFromCenter;
              currentVisibleEntryId = entry.id;
            }
          }
        }
      });

      // Update URL if the visible entry has changed
      if (currentVisibleEntryId && currentVisibleEntryId !== currentVisibleEntry) {
        const currentEntry = entries.find(e => e.id === currentVisibleEntryId);
        if (currentEntry) {
          setCurrentVisibleEntry(currentVisibleEntryId);
          updateMetaAndUrl(currentEntry);
        }
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollUrlUpdate();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Initial check
    setTimeout(handleScrollUrlUpdate, 100);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [entries, currentVisibleEntry, updateMetaAndUrl]);

  // Set up visibility observer for meta tag updates
  useEffect(() => {
    if (visibilityObserverRef.current) {
      visibilityObserverRef.current.disconnect();
    }

    if (entries.length === 0) return;

    visibilityObserverRef.current = new IntersectionObserver(
      (observerEntries) => {
        // Find the entry with the highest intersection ratio (most visible)
        let mostVisibleEntry: CampusCornerData | null = null;
        let highestRatio = 0;

        observerEntries.forEach((observerEntry) => {
          // Only update URL when entry is at least 50% visible
          if (observerEntry.isIntersecting && observerEntry.intersectionRatio > 0.5) {
            const entryId = parseInt(observerEntry.target.getAttribute('data-entry-id') || '0');
            const campusEntry = entries.find(e => e.id === entryId);

            if (campusEntry && observerEntry.intersectionRatio > highestRatio) {
              mostVisibleEntry = campusEntry;
              highestRatio = observerEntry.intersectionRatio;
            }
          }
        });

        // Only update URL if the new entry ID is LOWER than current
        // This prevents jumping back to previous entries when scrolling

        const visibleEntry = mostVisibleEntry as CampusCornerData | null;
        if (visibleEntry && typeof visibleEntry.id === 'number' && visibleEntry.id !== currentVisibleEntryRef.current) {

          // Only update if we're moving to a lower ID (newer entry) OR if it's the first entry
          if (currentVisibleEntryRef.current === null || visibleEntry.id < currentVisibleEntryRef.current) {
            currentVisibleEntryRef.current = visibleEntry.id;
            setCurrentVisibleEntry(visibleEntry.id);
            updateMetaAndUrl(visibleEntry);
          }
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 0.9],
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    // Observe all entry elements
    entryRefs.current.forEach((element, entryId) => {
      if (visibilityObserverRef.current) {
        visibilityObserverRef.current.observe(element);
      }
    });

    return () => {
      if (visibilityObserverRef.current) {
        visibilityObserverRef.current.disconnect();
      }
    };
  }, [entries, updateMetaAndUrl]); // ✅ Removed currentVisibleEntry dependency

  if (loading) {
    return (
      <div className="blogs-main-section inner custom-blog-details undefined nextstorydiv">
        <div className="detail-page-heading-h1">
          <h1 className="content-page-title">લોડ થઈ રહ્યું છે...</h1>
        </div>
        <div className="row blog-content" id='news-container'>
          <div className="col-lg-12 detail-page">
            <div className="blog-read-content">
              <div className="detail-page">
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
                  <p>કેમ્પસ કોર્નર લોડ થઈ રહ્યું છે...</p>
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

  // Parse feature images - handle both array and JSON string (same as campus corner)
  const parseFeatureImages = (featureImageData: string[] | string): string[] => {
    try {
      // If it's already an array, return it
      if (Array.isArray(featureImageData)) {
        return featureImageData;
      }

      // If it's a string, try to parse as JSON
      if (typeof featureImageData === 'string') {
        const parsed = JSON.parse(featureImageData);
        const result = Array.isArray(parsed) ? parsed : [];
        return result;
      }

      return [];
    } catch (error) {
      return [];
    }
  };

  

  // Show loading state
  if (loading && entries.length === 0) {
    return (
      <div className="blogs-main-section inner">
        <div className="blogs-head-bar inner">
          <span className="blog-category detail-page-heading">
            <Link href="/">Home</Link> / <Link href="/campuscorner"><i>Campus Corner</i></Link>
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '20px', color: '#007bff' }}></i>
          <p style={{ fontSize: '18px', color: '#666' }}>લોડ થઈ રહ્યું છે...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="blogs-main-section inner">
        <div className="blogs-head-bar inner">
          <span className="blog-category detail-page-heading">
            <Link href="/">Home</Link> / <Link href="/campuscorner"><i>Campus Corner</i></Link>
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <p style={{ fontSize: '18px', color: '#dc3545', marginBottom: '20px' }}>❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ફરીથી પ્રયાસ કરો
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="blogs-main-section inner custom-blog-details undefined nextstorydiv">
         <div className="blogs-head-bar inner">
        <span className="blog-category detail-page-heading">
          <Link href="/">હોમ</Link> / <Link href="/campuscorner"><i>કેમ્પસ કોર્નર</i></Link>
        </span>
      </div>
      {entries.map((entry, index) => {
        const featureImages = parseFeatureImages(entry.featureImage);


        return (
          <div
            key={entry.id}
            ref={(el) => {
              if (el) {
                entryRefs.current.set(entry.id, el);
              }
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
                      url={`${window.location.origin}/campuscornerdetails/${entry.id}`}
                      title={entry.title}
                      variant="fontawesome"
                      showDate={true}
                      date={entry.created_at}
                      imageUrl={
                        entry.video
                          ? (entry.video_img
                              ? getImageUrl(entry.video_img)
                              : "/assets/images/news-default.png")
                          : (Array.isArray(featureImages) && featureImages.length > 0
                              ? getImageUrl(featureImages[0])
                              : "/assets/images/news-default.png")
                      }
                    />
                   
                  </div>

                  <div className="blog-featured-image">
                    <div className="blog-featured-image-inner">
                      {(() => {
                        // Check if video exists and should be displayed
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
                        }
                        // If no video, display first image if available
                        else if (featureImages.length > 0) {
                          const imageUrl = getImageUrl(featureImages[0]);
                          return (
                            <img
                              style={{ height: 'auto', width: '100%' }}
                              src={imageUrl}
                              alt={entry.title}
                              onError={(e) => {
                                e.currentTarget.src = '/assets/images/news-default.png';
                              }}
                            />
                          );
                        }
                        // No media available
                        else {
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
                  <span><b>શાળા/કોલેજ :</b> {entry.school}</span>

                  <div className="detail-page finalContent">
                    <div dangerouslySetInnerHTML={{ __html: entry.description }} />
                  </div>

                  {/* Additional Images Logic - Exact Campus Corner Match */}
                  {featureImages.length > 0 && featureImages.map((image, imgIndex) => {
                    let shouldShow = false;

                    // Check if video exists and is not empty
                    const hasVideo = entry.video && entry.video.trim() !== '';

                    if (hasVideo) {
                      // If video exists, show ALL images from featureImage array
                      shouldShow = true;
                    } else {
                      // If no video, skip first image (already shown above) and show rest
                      shouldShow = imgIndex !== 0;
                    }

                    if (shouldShow) {
                      const imageUrl = getImageUrl(image);
                      return (
                         <div key={imgIndex} className="lazyload-wrapper" style={{ textAlign: 'center' }}>
                          <img
                            style={{ width: '60%', height: 'auto' }}
                            src={imageUrl}
                            className="innerpage"
                            alt={`${entry.title} - Image ${imgIndex + 1}`}
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/news-default.png';
                            }}
                          />
                        </div>
                      );
                    }

                    return null;
                  })}

                </div>
              </div>
            </div>

            {/* Next Story Indicator - Show after every journalist detail */}
            {index !== entries.length - 1 && (
            <div
              id={`next-story-${entry.id}`}
              className="next-story"
            >
              <span style={{ marginRight: '8px' }}>નેક્સ્ટ સ્ટોરી</span>
              <img
                src="/assets/images/next-arrow.gif"
                width="16"
                height="16"
                alt="Arrow GIF"
                style={{
                  verticalAlign: 'middle',
                  opacity: 0.8
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            )}
          </div>
        );
      })}

      {/* Hidden input for last_id (for compatibility with staging site JS) */}
      <input type="hidden" id="last_id" value={lastId || ''} />

       {entries.length > 0 && (
        <div
          ref={loadingRef}
          style={{
            textAlign: 'center',
            padding: '20px 0',
            minHeight: '50px',
          }}
        >
          {hasMore && loadingMore && (
            <>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '18px', marginRight: '10px' }}></i>
              <span>વધુ સામગ્રી લોડ થઈ રહી છે...</span>
            </>
          )}
        </div>
      )}
 
      {/* End of content message */}
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
              <p style={{ fontSize: '14px' }}>
                સમાન સામગ્રી બતાવવાનું ટાળવા માટે લોડિંગ બંધ કરવામાં આવી છે.
              </p>
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                (Duplicate content detected. Loading stopped to prevent showing repeated content.)
              </p>
            </>
          ) : (
            <p>તમે બધી કેમ્પસ કોર્નર સ્ટોરીઝ જોઈ લીધી છે.</p>
          )}
        </div>
      )}
      </div>
    </>
  );
};

export default CampusCornerDetailsPage;