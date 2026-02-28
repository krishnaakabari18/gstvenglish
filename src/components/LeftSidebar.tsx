'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCategorySettings } from '@/hooks/useCategorySettings';
import { useStockmarketSiteSetting } from '@/hooks/useStockmarketSiteSetting';
import { CategorySettingsItem } from '@/services/newsApi';
import { API_ENDPOINTS, MEDIA_BASE_URL } from '@/constants/api';
import { useUserSession } from '@/hooks/useUserSession';
import '@/styles/sidebar.css';

interface UserCategoryPreferences {
  category: number[];
  city: number[];
}

export default function LeftSidebar() {
  const { categories, loading, error } = useCategorySettings();
  const { isLoggedIn, user_id } = useUserSession();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userCategoryPreferences, setUserCategoryPreferences] =
    useState<UserCategoryPreferences | null>(null);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [preferencesError, setPreferencesError] = useState(false);
  const { RashiEnabled } = useStockmarketSiteSetting();
  /* =========================
     MOUNT
  ========================= */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* =========================
     FETCH USER PREFS (UNCHANGED LOGIC)
  ========================= */
  useEffect(() => {
    const fetchUserCategoryPreferences = async () => {
      if (!isLoggedIn || !user_id) {
        setUserCategoryPreferences(null);
        return;
      }

      setLoadingPreferences(true);
      setPreferencesError(false);

      try {
        const response = await fetch(API_ENDPOINTS.GET_CATEGORY_CITY, {
          method: 'POST',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id }),
        });

        const data = await response.json();

        if (data?.category && Array.isArray(data.category)) {
          setUserCategoryPreferences({
            category: data.category.map(Number),
            city: (data.city || []).map(Number),
          });
        } else {
          setUserCategoryPreferences(null);
        }
      } catch {
        setPreferencesError(true);
        setUserCategoryPreferences(null);
      } finally {
        setLoadingPreferences(false);
      }
    };

    fetchUserCategoryPreferences();
  }, [isLoggedIn, user_id]);

  /* =========================
     CONSTANTS
  ========================= */
  const ALWAYS_VISIBLE_SLUGS = useMemo(
    () => ['campuscorner', 'journalist', 'rashifal', 'web-stories', 'livetv'],
    []
  );

  /* =========================
     FILTERED CATEGORIES (MEMOIZED)
     SAME LOGIC
  ========================= */
  const filteredCategories = useMemo(() => {
    if (!isLoggedIn || !userCategoryPreferences?.category?.length) {
      return categories;
    }

    const allowedCategoryIds = userCategoryPreferences.category;
    const allowedCityIds = userCategoryPreferences.city || [];

    return categories
      .filter(
        cat =>
          ALWAYS_VISIBLE_SLUGS.includes(cat.slug) ||
          allowedCategoryIds.includes(cat.id)
      )
      .map(cat => {
        if (cat.slug === 'gujarat' && allowedCityIds.length && cat.subcategories) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(
              (sub: any) => sub?.id && allowedCityIds.includes(Number(sub.id))
            ),
          };
        }
        return cat;
      });
  }, [categories, isLoggedIn, userCategoryPreferences, ALWAYS_VISIBLE_SLUGS]);

  /* =========================
     MOBILE MENU TOGGLE
  ========================= */
  useEffect(() => {
    const handleToggleMobileMenu = () =>
      setIsMobileMenuOpen(prev => !prev);

    window.addEventListener('toggleMobileMenu', handleToggleMobileMenu);
    return () =>
      window.removeEventListener('toggleMobileMenu', handleToggleMobileMenu);
  }, []);

  /* =========================
     AUTO OPEN SUBMENU FROM URL
  ========================= */
  useEffect(() => {
    if (!pathname || !filteredCategories.length) return;

    const parts = pathname.split('/');
    if (parts[1] === 'category' && parts.length >= 4) {
      const slug = parts[2];
      const category = filteredCategories.find(c => c.slug === slug);
      if (category?.subcategories?.length) {
        setOpenSubmenu(category.id);
      }
    }
  }, [pathname, filteredCategories]);

  /* =========================
     CLICK / ESC HANDLERS
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.mobile-sidebar-menu');
      const menuToggle = document.querySelector('.mobile-menu-toggle');

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuToggle &&
        !menuToggle.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  /* =========================
     HELPERS (STABLE)
  ========================= */
  const toggleSubmenu = useCallback((id: number) => {
    setOpenSubmenu(prev => (prev === id ? null : id));
  }, []);

  const isActiveCategory = useCallback(
    (slug: string, id: number) =>
      id <= 0 ? pathname === `/${slug}` : pathname === `/category/${slug}`,
    [pathname]
  );

  const isActiveSubcategory = useCallback(
    (c: string, s: string) =>
      pathname === `/category/${c}/${s}`,
    [pathname]
  );

  const renderCategoryIcon = useCallback((category: CategorySettingsItem) => {
    if (category.icon) {
      return (
        <Image
          src={category.icon}
          alt={category.category_name}
          width={25}
          height={25}
          onError={e => ((e.currentTarget as any).src = '/images/category_icon.svg')}
        />
      );
    }
    return <i className="fa-solid fa-folder"></i>;
  }, []);

  const getCategoryPath = useCallback(
    (slug: string, id: number) => (id <= 0 ? `/${slug}` : `/category/${slug}`),
    []
  );

  const getSubcategoryPath = useCallback(
    (c: string, s: string) => `/category/${c}/${s}`,
    []
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="col-lg-2 mb-1 col-md-2 d-lg-none" style={{ zIndex: 999 }}>
        <button
          className="mobile-menu-btn d-lg-none"
          onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileMenu'))}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
            fontSize: '12px',
            fontFamily: "'Hind Vadodara', sans-serif",
            minWidth: '60px',
            top: '56px',
            position: 'fixed',
            left: '0px',
            zIndex: '1000',
          }}
        >
          <i className="fa-solid fa-bars" style={{ fontSize: '20px', marginBottom: '2px' }}></i>
        </button>
         <div className="nav-list custom-sidebar scrollarea">
            <ul className="sidebar-menu">
              <li className=" allcatshow catMobileshow">
                <Link href="/category/gstv-satrang" className="">
                  <img src="/assets/icons/gstv_satrang.svg" alt="GSTV શતરંગ"/>
                  <span>GSTV શતરંગ</span>
                </Link>
              </li>
              {RashiEnabled && (
              <li className=" allcatshow catMobileshow">
                <Link href="/rashifal" className="">
                  <img src={`${MEDIA_BASE_URL}/backend/public/uploads/category/icon/rashifal.svg`} alt="રાશિફળ"/>
                  <span>રાશિફળ</span>
                </Link>
              </li>
             )}

              <li className="allcatshow catMobileshow">
                <Link href="/livetv" className="">
                  <img src={`${MEDIA_BASE_URL}/public/assets/icons/icon-live.svg`} alt="લાઇવ ટીવી"/>
                  <span>લાઇવ ટીવી</span>
                </Link>
              </li>
            </ul>
          </div>
      </div>
      <div className="sidebar col-lg-2 col-md-2 d-none d-lg-block">
        <div className="nav-list custom-sidebar scrollarea">
          <ul>
            
            {/* Show categories */}
            {!isMounted && (
              <li className="allcatshow">
                <div style={{ padding: 10, textAlign: 'center', color: '#666' }}>કેટેગરી લોડ થઈ રહી છે...</div>
              </li>
            )}

            {isMounted && loading && (
              <li className="allcatshow">
                <div style={{ padding: 10, textAlign: 'center', color: '#666' }}>કેટેગરી લોડ થઈ રહી છે...</div>
              </li>
            )}

            {isMounted && error && (
              <li className="allcatshow">
                <div style={{ padding: 10, textAlign: 'center', color: '#dc3545' }}>Error loading categories</div>
              </li>
            )}

            {isMounted && !loading && !error &&
              filteredCategories.map((category, index) => {
                const hasSub = category.subcategories?.length > 0;
                const open = openSubmenu === category.id;

                return (
                  <li key={`${category.id}-${category.slug}-${index}`} className="allcatshow">
                    <div className="category-item">
                      <Link
                        href={getCategoryPath(category.slug, category.id)}
                        className={`category-link ${isActiveCategory(category.slug, category.id) ? 'active' : ''}`}
                      >
                        {renderCategoryIcon(category)}
                        <span>{category.category_name_guj}</span>
                      </Link>

                      {hasSub && (
                        <button className="submenu-toggle" onClick={() => toggleSubmenu(category.id)}>
                          <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`}></i>
                        </button>
                      )}
                    </div>

                    {hasSub && (
                      <ul className={`submenu ${open ? 'show' : ''}`}>
                        {category.subcategories!.map((sub: any, subIndex: number) => (
                          <li key={`${category.id}-${sub.slug}-${subIndex}`} className="subcategory-item">
                            <Link
                              href={getSubcategoryPath(category.slug, sub.slug)}
                              className={`subcategory-link ${isActiveSubcategory(category.slug, sub.slug) ? 'active' : ''}`}
                            >
                              {renderCategoryIcon(sub)}
                              <span>{sub.category_name_guj}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>

          {/* Download Apps & Social */}
          <div className="download-app" style={{ padding: '0 15px', marginTop: '0px' }}>
            <h6 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px', color: '#977e34' }}>
              GSTVની એપ્લિકેશન ડાઉનલોડ કરો
            </h6>
            <div className="download-btn clearfix" style={{ marginBottom: '0px', gap: '0px' }}>
              <Link href="https://play.google.com/store/apps/details?id=com.tops.gstvapps" target="_blank" rel="noopener noreferrer">
                <img src="https://www.gstv.in/public/assets/images/play-store.png" alt="Play Store" />
              </Link>
              &nbsp;&nbsp;&nbsp;
              <Link href="https://apps.apple.com/in/app/gstv-gujarat-samachar/id1609602449" target="_blank" rel="noopener noreferrer">
                <img src="https://www.gstv.in/public/assets/images/appstore.png" alt="App Store" />
              </Link>
            </div>
            <h6 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', marginTop: '0px', color: '#977e34' }}>
              ફોલવર્સ માટે
            </h6>
            <div className="socila-media" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="https://www.facebook.com/GSTV.NEWS" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f facebook-link"></i>
              </Link>
              <Link href="https://twitter.com/GSTV_NEWS" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-x-twitter twitter-link"></i>
              </Link>
              <Link href="https://www.instagram.com/gstvnews" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram instagram-link"></i>
              </Link>
              <Link href="https://www.youtube.com/gstvnews" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube youtube-link"></i>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-sidebar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <button className="back-arrow-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/images/arrow-backProfile.svg" alt="Back" className="back-arrow" />
          </button>
          <span className="menu-title">All Categories</span>
        </div>

        <div className="mobile-menu-content">
          <ul className="mobile-menu-list">
            {!isMounted && (
              <li className="mobile-menu-item">
                <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                  કેટેગરી લોડ થઈ રહી છે...
                </div>
              </li>
            )}

            {isMounted && loading && (
              <li className="mobile-menu-item">
                <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                  કેટેગરી લોડ થઈ રહી છે...
                </div>
              </li>
            )}

            {isMounted && error && (
              <li className="mobile-menu-item">
                <div style={{ padding: '15px', color: '#dc3545', fontSize: '14px' }}>
                  Error loading categories
                </div>
              </li>
            )}

            {isMounted && !loading && !error &&
              filteredCategories.map((category, index) => {
                const hasSub = category.subcategories?.length > 0;
                return (
                  <li key={`mobile-${category.id}-${category.slug}-${index}`} className="mobile-menu-item">
                    <div className="mobile-category-item">
                      <Link
                        href={getCategoryPath(category.slug, category.id)}
                        className={`mobile-category-link ${isActiveCategory(category.slug, category.id) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {renderCategoryIcon(category)}
                        <span>{category.category_name_guj}</span>
                      </Link>

                      {hasSub && (
                        <button className="mobile-submenu-toggle" onClick={() => toggleSubmenu(category.id)}>
                          <i className={`fa-solid ${openSubmenu === category.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </button>
                      )}
                    </div>

                    {hasSub && (
                      <ul className={`mobile-submenu ${openSubmenu === category.id ? 'show' : ''}`}>
                        {category.subcategories!.map((sub: any, subIndex: number) => (
                          <li key={`mobile-sub-${category.id}-${sub.slug}-${subIndex}`} className="mobile-subcategory-item">
                            <Link
                              href={`/category/${category.slug}/${sub.slug}`}
                              className={`mobile-subcategory-link ${isActiveSubcategory(category.slug, sub.slug) ? 'active' : ''}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {renderCategoryIcon(sub)}
                              <span>{sub.category_name_guj}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

    </>
  );
}
