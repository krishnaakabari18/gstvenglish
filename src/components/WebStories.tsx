'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { fetchTopWebStories, WebStory } from '@/services/newsApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import '@/styles/WebStories.css';

export default function WebStories() {
  console.log('WebStories component rendering...');

  // State management for WebStories component (matching TopVideos)
  const [webStories, setWebStories] = useState<WebStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [itemWidth, setItemWidth] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

 

  // Fetch web stories data on component mount
  useEffect(() => {
    const loadWebStories = async () => {
      try {
        console.log('WebStories: Starting to fetch data...');
        setLoading(true);
        setError(null);

        const data = await fetchTopWebStories();
        console.log('WebStories: Data received:', data);

        if (data.topwebstory && Array.isArray(data.topwebstory)) {
          setWebStories(data.topwebstory);
          console.log('WebStories: Set web stories data, count:', data.topwebstory.length);
        } else {
          console.warn('WebStories: No topwebstory data found in response');
          setWebStories([]);
        }
      } catch (err) {
        console.error('WebStories: Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch web stories');
      } finally {
        setLoading(false);
      }
    };

    loadWebStories();
  }, []);

  /* ===============================
   MOBILE TOUCH SCROLL (ADDED)
================================ */
useEffect(() => {
  const slider = sliderRef.current;
  if (!slider) return;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextSlide();   // swipe left
      } else {
        prevSlide();   // swipe right
      }
    }
  };

  slider.addEventListener('touchstart', handleTouchStart, { passive: true });
  slider.addEventListener('touchmove', handleTouchMove, { passive: true });
  slider.addEventListener('touchend', handleTouchEnd);

  return () => {
    slider.removeEventListener('touchstart', handleTouchStart);
    slider.removeEventListener('touchmove', handleTouchMove);
    slider.removeEventListener('touchend', handleTouchEnd);
  };
}, [webStories.length, itemsPerView]);


  // Helper function to get the first image from story data
  const getFirstStoryImage = (story: WebStory): string => {
    try {
      const storyData = JSON.parse(story.Story_data);
      if (storyData.length > 0 && storyData[0].webimage) {
        // Convert to small image format like in Laravel
        return storyData[0].webimage.replace('.webp', '_small.webp');
      }
    } catch (error) {
      console.error('Error parsing story data:', error);
    }
    return '/images/video-default.png'; // fallback image
  };

  // Navigation functions (matching TopVideos)
  const goToSlide = (slideIndex: number) => {
    const maxSlides = Math.max(0, webStories.length - itemsPerView);
    const targetSlide = Math.max(0, Math.min(slideIndex, maxSlides));
    setCurrentSlide(targetSlide);
    console.log('WebStories: Going to slide:', targetSlide);
  };

  const nextSlide = () => {
    const maxSlides = Math.max(0, webStories.length - itemsPerView);
    console.log('WebStories: Next slide clicked. Current:', currentSlide, 'Max:', maxSlides);
    setCurrentSlide(prev => prev >= maxSlides ? 0 : prev + 1);
  };

  const prevSlide = () => {
    const maxSlides = Math.max(0, webStories.length - itemsPerView);
    console.log('WebStories: Previous slide clicked. Current:', currentSlide, 'Max:', maxSlides);
    setCurrentSlide(prev => prev <= 0 ? maxSlides : prev - 1);
  };

  // Retry function for error handling
  const retryFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchTopWebStories();
      if (data.topwebstory && Array.isArray(data.topwebstory)) {
        setWebStories(data.topwebstory);
      } else {
        setWebStories([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch web stories');
    } finally {
      setLoading(false);
    }
  };

  // Responsive items per view based on data-items="1,3,5,6" (original WebStories logic)
  useEffect(() => {
    const updateItemsPerView = () => {
      const bodyWidth = window.innerWidth;
      let incno = 5; // default

      // data-items="1,3,5,6" means: [mobile, tablet, desktop, large]
      // Original WebStories responsive logic
      if (bodyWidth >= 1200) {
        incno = 5; // itemsSplit[3] - large desktop
      } else if (bodyWidth >= 992) {
        incno = 5; // itemsSplit[2] - desktop
      } else if (bodyWidth >= 768) {
        incno = 3; // itemsSplit[1] - tablet
      } else {
        incno = 3; // itemsSplit[0] - mobile
      }


      setItemsPerView(incno);
      console.log('WebStories: Updated items per view:', incno, 'for width:', bodyWidth);
    };

    updateItemsPerView();

    const handleResize = () => {
      updateItemsPerView();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate item width based on container and items per view (matching TopVideos)
  useEffect(() => {
    if (sliderRef.current && webStories.length > 0) {
      const containerWidth = sliderRef.current.parentElement?.offsetWidth || 0;
      const calculatedItemWidth = containerWidth / itemsPerView;
      setItemWidth(calculatedItemWidth);
      console.log('WebStories: Container width:', containerWidth, 'Item width:', calculatedItemWidth);
    }
  }, [itemsPerView, webStories.length]);

  // Auto-rotation with data-interval="1000" (matching TopVideos)
  useEffect(() => {
    if (isAutoRotating && webStories.length > itemsPerView) {
      autoRotateRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          const maxSlides = Math.max(0, webStories.length - itemsPerView);
          return prev >= maxSlides ? 0 : prev + 1;
        });
      }, 5000); // data-interval="1000"
    } else {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [isAutoRotating, webStories.length, itemsPerView]);

  // Cleanup on unmount (matching TopVideos)
  useEffect(() => {
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="carousel-inner-top custom-carousel clearfix">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner
            message="વેબ સ્ટોરીઝ લોડ થઈ રહ્યા છે..."
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
          <h2 className="section-title">વેબ સ્ટોરીઝ</h2>
        </div>
        <ErrorMessage error={error} onRetry={retryFetch} />
      </div>
    );
  }

  if (webStories.length === 0) {
    return (
      <div className="carousel-inner-top custom-carousel clearfix">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No web stories available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="web-stories-section">
      {/* Header Section - Exact match to Laravel Blade */}
      <div className="storySectionNav">
        <div className="storySectionNav-left">
          <Link href="/web-stories">
            <img
              src="/assets/icons/e-paper-1.svg"
              alt="Web Stories"
            />
            <span>વેબ સ્ટોરીઝ</span>
          </Link>
        </div>
        <div className="storySectionNav-right">
          <Link href="/web-stories" className="custom-link-btn">
            વધુ વાંચો <i className="fas fa-chevron-right"></i>
          </Link>
        </div>
      </div>

      {/* Carousel - Matching TopVideos structure exactly */}
      <div className="custom-carousel clearfix">
        <div
          className="MultiCarousel"
          data-items="1,3,5,5"
          data-slide="1"
          id="MultiCarousel"
          data-interval="1000"
          onMouseEnter={() => setIsAutoRotating(false)}
          onMouseLeave={() => setIsAutoRotating(true)}
        >
          <div
            className="MultiCarousel-inner topwebstory"
            id="topwebstory-container"
            ref={sliderRef}
            style={{
              transform: `translateX(-${currentSlide * itemWidth}px)`,
              transition: 'transform 0.3s ease',
              display: 'flex',
              width: `${itemWidth * webStories.length}px`
            }}
          >
            {webStories.map((story, index) => (
              <div
                key={`${story.id}-${index}`}
                className=""
                style={{
                  width: `${itemWidth}px`,
                  flex: 'none'
                }}
              >
                <div className="loader"></div>
                <div className="">
                  <Link href={`/web-stories/${story.slug}`}>
                    <div className="card custom-card">
                      <div className="img-wrappers custom-webstory-image">
                        <img
                          src={getFirstStoryImage(story)}
                          className="video-thumbnail-img"
                          alt={story.title}
                          onError={(e) => {
                            // Fallback to default image if thumbnail fails to load
                            const img = e.target as HTMLImageElement;
                            img.src = '/images/video-default.png';
                          }}
                        />
                      </div>

                     
                      {/* Story Title - Same as TopVideos */}
                       <div className="webstory-title-content custom-gujrati-font">
                                <span className="samachar-title">{story.title}</span>
                            </div>
                      
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Exact match to TopVideos */}
          <button className={`btn btn-primary leftLst ${currentSlide === 0 ? 'over' : ''}`} onClick={prevSlide}
            disabled={currentSlide === 0}><i className="fa fa-chevron-left"></i></button>
        <button className={`btn btn-primary rightLst ${currentSlide >= Math.max(0, webStories.length - itemsPerView) ? 'over' : ''}`} onClick={nextSlide}
            disabled={currentSlide >= Math.max(0, webStories.length - itemsPerView)}>
          <i className="fa fa-chevron-right"></i></button>
         
        </div>
      </div>
    </div>
  );
}