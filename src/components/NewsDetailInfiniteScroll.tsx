import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo
} from 'react';
import Link from 'next/link';
import styles from './NewsDetailWithInfiniteScroll.module.css';
import { API_ENDPOINTS, getCategoryIds, DEFAULT_API_PARAMS } from '@/constants/api';
import { useAuth } from '@/contexts/AuthContext';
import { getOrCreateDeviceId } from '@/utils/deviceId';
import { getMediaImage } from '@/utils/newsUtils';
import { timeAgo } from "@/utils/timeAgo";
import ShareButtons from './ShareButtons';
import RelatedNews from "@/components/RelatedNews";
import LockScreen from '@/components/LockScreen';
import { useContentLock } from '@/hooks/useContentLock';
import { RELATED_NEWS, APP_DOWNLOAD } from '@/constants';

// Global registry to avoid re-processing the same embed container multiple times
const processedEmbedsRegistry = new Set<string>();

// Types (trimmed)
interface LiveNewsItem {
  livetitle: string;
  livedesc?: string;
  created_at: string;
  lid?: number;
}
interface RelatedNewsItem {
  category_slugs?: string;
  slug?: string;
  featureImage?: string;
  title?: string;
  [key: string]: any; // flexible fallback
}
interface NewsItem {
  id: number;
  title: string;
  englishTitle?: string;
  slug: string;
  description: string;
  videoURL?: string;
  featureImage?: string;
  tags?: string;
  catID?: string | number;
  created_at: string;
  updated_at: string;
  bookmark?: number;
  category_slugs?: string;
  categoryIds?: number[] | number;
  metatitle?: string;
  metadesc?: string;
  img_credit_txt?: string | null;
  relatednews?: NewsItem[];
  relatedNewsIddata?: Array<any>;
  categories?: Array<{ id: number; title: string; slug: string }>;
  live?: LiveNewsItem[];
  category_name_guj?: string;
  is_live_news?: number;
}

interface NewsDetailProps {
  categorySlug: string;
  newsSlug: string;
  subcategorySlug?: string;
}

// const YT_REGEX =
//   /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/g;
const YT_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/g;
const TWITTER_REGEX =
  /https?:\/\/(?:www\.)?twitter\.com\/[A-Za-z0-9_]+\/status\/\d+/g;
const INSTAGRAM_REGEX =
  /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?/g;
const FACEBOOK_POST_REGEX =
  /https?:\/\/(?:www\.|m\.)?facebook\.com\/(?:(?:[^\/]+\/(?:posts|reel|reels|videos)\/[A-Za-z0-9_-]+)|(?:share\/p\/[A-Za-z0-9_-]+)|photo\.php\?fbid=\d+)/g;
const PDF_REGEX = /https?:\/\/[^\s'"]+\.pdf(\?[^\s'"]*)?/gi;
const REDDIT_POST_REGEX =
  /https?:\/\/(?:www\.|old\.|np\.)?reddit\.com\/(?:r\/[A-Za-z0-9_]+\/)?comments\/[A-Za-z0-9]+(?:\/[^\s'"]*)?/gi;
const REDDIT_VIDEO_REGEX = /https?:\/\/v\.redd\.it\/[A-Za-z0-9]+/gi;

// Small helper to safely create DOM nodes (for the embed container)
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
};

// Format date - returns static format to avoid hydration mismatch
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

const NewsDetailWithInfiniteScroll: React.FC<NewsDetailProps> = ({
  categorySlug,
  newsSlug,
  subcategorySlug
}) => {
  // Basic states
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [categoryIds, setCategoryIds] = useState<string>('');
  const [loadedSlugs, setLoadedSlugs] = useState<string[]>([]);
  const [newsDefaultText, setNewsDefaultText] = useState<string>('');
  const initialSlugRef = useRef(newsSlug);
  const { getUserId } = useAuth();
  const deviceId = getOrCreateDeviceId();
  const [bookmarkUpdate, setBookmarkUpdate] = useState(0);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const processedContentCache = useRef<Map<string, string>>(new Map());
  const isClient = useIsClient();

  const userId = Number(getUserId() || 0);
  const { isLocked: contentLocked, loading: lockLoading } = useContentLock(userId);
  const pageLocked = contentLocked;

  // throttles & duplicates protection
  const lastScrollTimeRef = useRef<number>(0);
  const consecutiveDuplicatesRef = useRef<number>(0);
  const MAX_DUPLICATE_ATTEMPTS = 10;
  useEffect(() => {
  const enableSound = () => {
    if (activeVideoIndex !== null) {
      const video = videoRefs.current[activeVideoIndex];
      if (video) {
        video.muted = false;
        video.volume = 1;
        video.play().catch(() => {});
      }
    }
  };

  document.addEventListener("click", enableSound);
  document.addEventListener("touchstart", enableSound);

  return () => {
    document.removeEventListener("click", enableSound);
    document.removeEventListener("touchstart", enableSound);
  };
}, [activeVideoIndex]);
useEffect(() => {
  videoRefs.current.forEach((video, index) => {
    if (!video) return;

    if (index === activeVideoIndex) {
      // ✅ ACTIVE VIDEO → SOUND
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
    } else {
      // ✅ INACTIVE VIDEO → STOP
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    }
  });
}, [activeVideoIndex]);
useEffect(() => {
  const onScroll = () => {
    if (activeVideoIndex === null) return;

    const video = videoRefs.current[activeVideoIndex];
    if (!video) return;

    const rect = video.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isVisible) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      setActiveVideoIndex(null);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, [activeVideoIndex]);
  // SEO helpers
  const updateSEOMetadata = useCallback((newsItem: NewsItem) => {
    try {
      document.title = newsItem.title || 'GSTV News';

      const metaDescription = document.querySelector('meta[name="description"]');
      const newDescription =
        newsItem.metadesc || newsItem.description?.substring(0, 160) || `${newsItem.title} - GSTV News`;

      if (metaDescription) {
        if (metaDescription.getAttribute('content') !== newDescription) {
          metaDescription.setAttribute('content', newDescription);
        }
      } else {
        const m = document.createElement('meta');
        m.name = 'description';
        m.content = newDescription;
        document.head.appendChild(m);
      }

      // Open Graph & Twitter tags (lightweight updates)
      const setMeta = (prop: string, content: string, useName = false) => {
        if (!content) return;
        const selector = useName ? `meta[name="${prop}"]` : `meta[property="${prop}"]`;
        let el = document.querySelector(selector) as HTMLMetaElement | null;
        if (el) {
          if (el.content !== content) el.content = content;
        } else {
          el = document.createElement('meta') as HTMLMetaElement;
          if (useName) el.setAttribute('name', prop);
          else el.setAttribute('property', prop);
          el.content = content;
          document.head.appendChild(el);
        }
      };

      const origin = window.location.origin;
      const categorySegment = categorySlug || '';
      const subSegment = subcategorySlug && subcategorySlug !== categorySlug ? `/${subcategorySlug}` : '';
      const ogUrl = `${origin}/news/${categorySegment}${subSegment ? subSegment + '/' : '/'}${newsItem.slug}`;

      setMeta('og:title', newsItem.title);
      setMeta('og:description', newDescription);
      setMeta('og:url', ogUrl);
      setMeta('og:type', 'article');
      setMeta('twitter:card', 'summary_large_image', true);
      setMeta('twitter:title', newsItem.title, true);
      setMeta('twitter:description', newDescription, true);

      if (newsItem.featureImage) {
        let img = newsItem.featureImage;
        if (!img.startsWith('http')) {
          img = img.startsWith('/') ? `${origin}${img}` : `${origin}/${img}`;
        }
        setMeta('og:image', img);
        setMeta('twitter:image', img, true);
      }

      // canonical
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      const canonicalUrl = ogUrl;
      if (canonical) {
        if (canonical.href !== canonicalUrl) canonical.href = canonicalUrl;
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }
    } catch (err) {
      console.error('SEO update error', err);
    }
  }, [categorySlug, subcategorySlug]);

  // ---------- EMBED PROCESSING (INLINE) ----------
  // Convert known URLs to embed HTML (Twitter, YouTube, Instagram, Facebook, PDF)
 const convertEmbedsInline = useCallback((rawHtml: string) => {
  if (!rawHtml) return '';

  const cacheKey = rawHtml.substring(0, 200);
  if (processedContentCache.current.has(cacheKey)) {
    return processedContentCache.current.get(cacheKey)!;
  }

  let content = rawHtml;

  // Normalize line breaks
  content = content.replace(/\r\n|\r/g, '\n');

  /* --------------------------------------------------
     ✅ FIX IMAGE TAGS (IMPORTANT PART)
  -------------------------------------------------- */

  // 1️⃣ Decode escaped HTML if backend sends encoded tags
  content = content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');

  // 2️⃣ Ensure all images are responsive
  content = content.replace(
  /<img([^>]+)src="http:\/\/([^"]+)"([^>]*)>/gi,
  '<img$1src="https://$2"$3>'
);

  /* --------------------------------------------------
     Your Existing Embed Replacements
  -------------------------------------------------- */

  content = content.replace(YT_REGEX, (_, videoId) => `
<!--SOCIAL_EMBED_START-->
<div class="social-media-embed youtube-embed">
  <iframe
    src="https://www.youtube.com/embed/${videoId}"
    loading="lazy"
    allowfullscreen
    style="width:100%;aspect-ratio:16/9;border-radius:8px;">
  </iframe>
</div>
<!--SOCIAL_EMBED_END-->
`);

  content = content.replace(TWITTER_REGEX, (match) => {
    return `<!--SOCIAL_EMBED_START--><blockquote class="twitter-tweet"><a href="${match}"></a></blockquote><!--SOCIAL_EMBED_END-->`;
  });

  content = content.replace(INSTAGRAM_REGEX, (match) => {
    const embedSrc = match.endsWith('/') ? `${match}embed` : `${match}/embed`;
    return `
<!--SOCIAL_EMBED_START-->
<div class="social-media-embed instagram-embed">
  <iframe
    src="${embedSrc}"
    width="400"
    height="480"
    frameborder="0"
    scrolling="no"
    allow="encrypted-media">
  </iframe>
</div>
<!--SOCIAL_EMBED_END-->
`;
  });

  content = content.replace(FACEBOOK_POST_REGEX, (match) => {
    return `
<!--SOCIAL_EMBED_START-->
<div class="social-media-embed facebook-embed">
  <div class="fb-post" data-href="${match}" data-width="500"></div>
</div>
<!--SOCIAL_EMBED_END-->
`;
  });

  content = content.replace(REDDIT_POST_REGEX, (match) => {
    const safeUrl = encodeURI(match);
    return `
<!--SOCIAL_EMBED_START-->
<div class="social-media-embed reddit-embed">
  <blockquote class="reddit-card">
    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a>
  </blockquote>
</div>
<!--SOCIAL_EMBED_END-->
`;
  });

  content = content.replace(REDDIT_VIDEO_REGEX, (match) => {
    return `
<!--SOCIAL_EMBED_START-->
<div class="social-media-embed reddit-video">
  <video controls playsinline preload="metadata" style="max-width:100%;">
    <source src="${match}/DASH_720.mp4" type="video/mp4">
  </video>
</div>
<!--SOCIAL_EMBED_END-->
`;
  });

  content = content.replace(PDF_REGEX, (match) => {
    const encodedPdfUrl = encodeURIComponent(match);
    return `
<!--SOCIAL_EMBED_START-->
<div class="social-media-embed pdf-embed">
  <iframe
    src="https://docs.google.com/gview?url=${encodedPdfUrl}&embedded=true"
    style="width:100%; height:650px;"
    frameborder="0"
    loading="lazy">
  </iframe>
</div>
<!--SOCIAL_EMBED_END-->
`;
  });

  processedContentCache.current.set(cacheKey, content);
  return content;
}, []);

  // Widget loader: loads 3rd party scripts as needed (Twitter, Facebook, Instagram)
  const loadExternalWidgetScripts = useCallback(() => {
    if (!isClient) return;

    // Twitter
    if (!(window as any).twttr) {
      const s = document.createElement('script');
      s.src = 'https://platform.twitter.com/widgets.js';
      s.async = true;
      document.body.appendChild(s);
    } else {
      try {
        (window as any).twttr.widgets.load();
      } catch { /* ignore */ }
    }

    if (!(window as any).__redditScriptLoaded) {
      const s = document.createElement('script');
      s.src = 'https://embed.redditmedia.com/widgets/platform.js';
      s.async = true;
      s.onload = () => {
        (window as any).__redditScriptLoaded = true;
        try {
          // Load existing embeds after script is ready
          if ((window as any).reddit) {
            (window as any).reddit.init();
          }
        } catch { /* ignore errors */ }
      };
      document.body.appendChild(s);
    } else {
      try {
        // Re-initialize embeds if script already exists
        if ((window as any).reddit) {
          (window as any).reddit.init();
        } else {
          // Fallback: manually trigger Reddit widget refresh
          const existingScript = document.querySelector(
            'script[src="https://embed.redditmedia.com/widgets/platform.js"]'
          ) as HTMLScriptElement | null;
          if (existingScript) {
            const clone = existingScript.cloneNode() as HTMLScriptElement;
            document.body.appendChild(clone);
          }
        }
      } catch { /* ignore errors */ }
    }

    // Facebook SDK (light-weight loader)
    if (!(window as any).FB) {
      const fbRoot = document.getElementById('fb-root') || (() => {
        const div = document.createElement('div');
        div.id = 'fb-root';
        document.body.appendChild(div);
        return div;
      })();

      const fbScriptId = 'facebook-jssdk';
      if (!document.getElementById(fbScriptId)) {
        const script = document.createElement('script');
        script.id = fbScriptId;
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0';
        document.body.appendChild(script);
      } else {
        try {
          if ((window as any).FB && (window as any).FB.XFBML) {
            (window as any).FB.XFBML.parse();
          }
        } catch { /* ignore */ }
      }
    }

    // Instagram embed script
    if (!(window as any).instgrm) {
      const igScriptId = 'instagram-embed-script';
      if (!document.getElementById(igScriptId)) {
        const script = document.createElement('script');
        script.id = igScriptId;
        script.async = true;
        script.defer = true;
        script.src = 'https://www.instagram.com/embed.js';
        document.body.appendChild(script);
      } else {
        try {
          if ((window as any).instgrm && (window as any).instgrm.Embeds) {
            (window as any).instgrm.Embeds.process();
          }
        } catch { /* ignore */ }
      }
    }
  }, [isClient]);

  // SocialEmbedContainer - sets innerHTML once and triggers widget parsing inside container
  const SocialEmbedContainer: React.FC<{ html: string; uniqueId: string }> = ({ html, uniqueId }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (!ref.current) return;
      if (processedEmbedsRegistry.has(uniqueId)) return;

      // Prevent double initialization
      ref.current.innerHTML = html;
      processedEmbedsRegistry.add(uniqueId);

      // Trigger widget parsing for this container only
      setTimeout(() => {
        const container = ref.current;
        if (!container) return;

        // Twitter
        try {
          if ((window as any).twttr && (window as any).twttr.widgets) {
            (window as any).twttr.widgets.load(container);
          }
        } catch (e) { /* ignore */ }

        // Instagram
        try {
          if ((window as any).instgrm && (window as any).instgrm.Embeds) {
            (window as any).instgrm.Embeds.process();
          }
        } catch (e) { /* ignore */ }

        // Facebook
        try {
          if ((window as any).FB && (window as any).FB.XFBML) {
            (window as any).FB.XFBML.parse(container);
          }
        } catch (e) { /* ignore */ }
      }, 150);
    }, [html, uniqueId]);

    return <div ref={ref} suppressHydrationWarning data-embed-container={uniqueId} />;
  };

  
  // Render parsed description: splits into safe paragraphs and renders SocialEmbedContainer where needed
const renderDescription = useCallback(
  (rawDescription: string, newsItem: any, newsIndex: number) => {

    if (
  (!rawDescription || rawDescription.trim() === "") &&
  newsItem?.relatedNewsIddata?.length > 0
) {
  return (
    <div className="blogs-main-section relatednewsdata" style={{ margin: "25px 0" }}>
      <div className="blogs-head-bar first">
        <span className="blog-category">{RELATED_NEWS.ALSO_READ}</span>
      </div>

      <div className="row blog-content related-blog-content relatednews relatednews2">
        {newsItem.relatedNewsIddata.map((r: RelatedNewsItem, i: number) => {
          const thumb =
            r.featureImage
              ? r.featureImage
              : r.videoURL
              ? r.videoURL.replace(/\.(mp4|webm|mov)$/i, "_video.webp")
              : "/assets/images/gstv-logo-bg.png";

          return (
            <div key={i} className="col-lg-6">
              <a
                href={`/news/${r.category_slugs || ""}/${r.slug}`}
                className="custom-blog-title-link"
              >
                <div className="img-container" style={{ textAlign: 'center' }}>
                  <img
                    src={thumb}
                    loading="lazy"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "/assets/images/gstv-logo-bg.png")
                    }
                  />
                </div>

                <div className="text-container">
                  <h4 className="custom-blog-title">{r.title}</h4>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
    if (!rawDescription) return null;

    const processed = convertEmbedsInline(rawDescription);

    const parts = processed
      .split(/(<!--SOCIAL_EMBED_START-->[\s\S]*?<!--SOCIAL_EMBED_END-->)/g)
      .filter(Boolean);

    let globalParaCount = 0;
    let promoInserted = false;
    let relatedInserted = false;
    let locked = false;
    let relatedIndex = 0;

    return parts.map((part, partIndex) => {
      if (locked) return null;

      /* ---------------- SOCIAL EMBED ---------------- */
      if (part.startsWith("<!--SOCIAL_EMBED_START-->")) {
        const innerHtml = part
          .replace("<!--SOCIAL_EMBED_START-->", "")
          .replace("<!--SOCIAL_EMBED_END-->", "");

        const uniqueId = `news-${newsIndex}-embed-${partIndex}-${hashString(innerHtml)}`;

        return (
          <div key={uniqueId} style={{ margin: "10px 0" }}>
            <SocialEmbedContainer html={innerHtml} uniqueId={uniqueId} />
          </div>
        );
      }

      /* ---------------- TEXT ---------------- */
      const html = part.trim();
      if (!html) return null;

      const paragraphs: string[] = [];
      //const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      const regex = /<(p|ul|ol|table|figure|div|h[1-6])[^>]*>[\s\S]*?<\/\1>/gi;
      let match;

      // while ((match = regex.exec(html)) !== null) {
      //   const clean = match[1].replace(/<[^>]+>/g, "").trim();
      //   if (clean.length) {
      //     paragraphs.push(`<p>${match[1].trim()}</p>`);
      //   }
      // }
      while ((match = regex.exec(html)) !== null) {
          const block = match[0];

          // Remove all HTML tags for empty check
          const cleanText = block.replace(/<[^>]+>/g, "").trim();

          // Allow images or media
          const hasImage = /<img\b/i.test(block);
          const hasIframe = /<iframe\b/i.test(block);

          if (cleanText.length > 0 || hasImage || hasIframe) {
            paragraphs.push(block);
          }
        }

      let modifiedHTML = "";
      let paraCount = 0;
      let contentParaCount = 0;

      for (let i = 0; i < paragraphs.length; i++) {
        modifiedHTML += paragraphs[i];
        globalParaCount++;
         paraCount++;
        contentParaCount++;
        if (pageLocked && globalParaCount === 1) {
          locked = true;
          break;
        }
        /* 🔥 APP PROMO AFTER FIRST PARA */
        if (globalParaCount === 1 && !promoInserted && !newsItem?.live?.length) {
          modifiedHTML += `
            <div class="download-app" style="text-align:center;display:block;margin:20px 0;">
              <h6 style="font-size:25px !important;font-family:'Hind Vadodara',sans-serif;color:#000;text-align:center;margin-bottom:10px;">
                ${APP_DOWNLOAD.DOWNLOAD_APP}
              </h6>
              <div class="download-btn clearfix" style="display:inline-flex;gap:15px;align-items:center;justify-content:center;">
                <a href="https://play.google.com/store/apps/details?id=com.tops.gstvapps" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/play-store.png" alt="Play Store" style="width:100%;height:auto;">
                </a>
                <a href="https://apps.apple.com/in/app/gstv-gujarat-samachar/id1609602449" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/appstore.png" alt="App Store" style="width:100%;height:auto;">
                </a>
              </div>
            </div>
            <div class="text-center pb-2">
              <div id="gstvin_inarticle1-${newsItem.id}">
                <script>
                  googletag.cmd.push(function() { googletag.display('gstvin_inarticle1-${newsItem.id}'); });
                </script>
              </div>
            </div>
          `;
          promoInserted = true;
        }

        /* 🔥 RELATED AFTER 2 PARAS */
        // ✅ After every 2 paragraphs, insert dynamic “આ પણ વાંચો” section
        if (contentParaCount % 2 === 0 && newsItem?.relatedNewsIddata?.length > 0) {
  const relatedToShow = newsItem.relatedNewsIddata.slice(relatedIndex, relatedIndex + 2);
  relatedIndex += 2;
if (relatedToShow.length > 0) {
  const relatedHTML = `
    <div class="blogs-main-section relatednewsdata" style="margin:25px 0;">
      <div class="blogs-head-bar first">
        <span class="blog-category">${RELATED_NEWS.ALSO_READ}</span>
      </div>
      <div class="row blog-content related-blog-content relatednews relatednews2">
        ${relatedToShow
          .map((r: RelatedNewsItem) => {
            const thumb =
              r.featureImage
                ? r.featureImage
                : r.videoURL
                ? r.videoURL.replace(/\.(mp4|webm|mov)$/i, "_video.webp")
                : "/assets/images/gstv-logo-bg.png";

            return `
              <div class="col-lg-6">
                <a href="/news/${r.category_slugs || ""}/${r.slug}" class="custom-blog-title-link">
                  <div class="img-container" style={{ textAlign: 'center' }}>
                    <img
                      src="${thumb}"
                      alt="${r.title || ""}"
                      loading="lazy"
                      style="max-width:100%;display:block;margin:0 auto;"
                      onerror="this.src='/assets/images/gstv-logo-bg.png';"
                    />
                  </div>
                  <div class="text-container">
                    <h4 class="custom-blog-title">${r.title || ""}</h4>
                  </div>
                </a>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
  modifiedHTML += relatedHTML;
}

}

        /* 🔒 LOCK AFTER EVERYTHING */
        
      }

      return (
        <React.Fragment key={`desc-${newsIndex}-${partIndex}`}>
          <div dangerouslySetInnerHTML={{ __html: modifiedHTML }} />
          {locked && (
            <div className="news-detail-lock">
              <LockScreen userId={userId} />
            </div>
          )}
        </React.Fragment>
      );
    });
  },
  [convertEmbedsInline, pageLocked, userId]
);





  // small helper hash for stable ids
  function hashString(s: string) {
    let h = 0, i = 0, len = s.length;
    while (i < len) h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return Math.abs(h).toString(36);
  }

  // Bookmark icon helper - uses localStorage
  const getBookmarkIcon = (newsId: number) => {
    if (typeof window === 'undefined') return '/images/ico_bookmark_line.svg';
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      return bookmarks.some((b: any) => b.id === newsId) ? '/images/ico_bookmark_solid.svg' : '/images/ico_bookmark_line.svg';
    } catch {
      return '/images/ico_bookmark_line.svg';
    }
  };

  const handleBookmark = async (newsItem: NewsItem) => {
    try {
      const { handleBookmark: handleBookmarkCommon } = await import('@/utils/commonUtils');
      const res = await handleBookmarkCommon({
        id: newsItem.id,
        title: newsItem.title,
        slug: newsItem.slug,
        type: 'news'
      });
      // toggle icon(s)
      setBookmarkUpdate(prev => prev + 1);
      // update icons in DOM if present
      const items = document.querySelectorAll(`.bookmark-icon-${newsItem.id}`) as NodeListOf<HTMLImageElement>;
      items.forEach(img => {
        img.src = res ? '/images/ico_bookmark_solid.svg' : '/images/ico_bookmark_line.svg';
      });
      return res;
    } catch (err) {
      console.error('Bookmark error', err);
      return false;
    }
  };

  // ---------- FETCH LOGIC ----------
  const fetchNewsData = useCallback(async (slug: string, page = 1, isLoadMore = false) => {
    try {
      let requestCategoryIds = '';
      if (!isLoadMore && page === 1) {
        requestCategoryIds = getCategoryIds(categorySlug, subcategorySlug);
      } else {
        requestCategoryIds = categoryIds || getCategoryIds(categorySlug, subcategorySlug);
      }

      const loaded = loadedSlugs.join(',');
      const resolvedUserId = getUserId() || DEFAULT_API_PARAMS.user_id || '';

      const body = (page === 1 && !isLoadMore)
        ? { slug: initialSlugRef.current, user_id: resolvedUserId }
        : {
            slug: initialSlugRef.current,
            user_id: resolvedUserId,
            device_id: deviceId,
            loadedSlugs: loaded,
            categoryIds: requestCategoryIds
          };

      const resp = await fetch(API_ENDPOINTS.NEWS_NEXT_CONTENT, {
        cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        // fallback attempt for compatibility (same as your original code)
        if (page === 1 && !isLoadMore) {
          const fallback = {
            slug: initialSlugRef.current,
            user_id: resolvedUserId,
            device_id: deviceId,
            loadedSlugs: '',
            categoryIds: requestCategoryIds
          };
          const r2 = await fetch(API_ENDPOINTS.NEWS_NEXT_CONTENT, {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fallback)
          });
          if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
          return await r2.json();
        }
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      return data;
    } catch (err) {
      console.error('fetchNewsData error', err);
      throw err;
    }
  }, [categoryIds, categorySlug, deviceId, getUserId, loadedSlugs, subcategorySlug]);

  // Load initial
  const loadInitialNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNewsData(initialSlugRef.current, 1, false);

      // Handle new v8 style
      let newsArray: NewsItem[] = [];
      if (data && data.newsDetail) {
        newsArray = Array.isArray(data.newsDetail) ? data.newsDetail : [data.newsDetail];
      } else if (data && Array.isArray(data.data)) {
        newsArray = data.data;
      } else if (Array.isArray(data)) {
        newsArray = data;
      }

      if (newsArray.length === 0) {
        setError('કોઈ સમાચાર મળ્યા નથી');
        setNewsItems([]);
        setHasMoreData(false);
        return;
      }

      setNewsItems(newsArray);

      // Set loaded slugs
      const slugs = newsArray.map(n => n.slug).filter(Boolean);
      setLoadedSlugs(slugs);

      // set categoryIds using first article
      const first = newsArray[0];
      let extractedCategoryIds = '';
      if (first.categories && Array.isArray(first.categories)) {
        const ids = first.categories.map(c => c.id);
        if (ids.length > 1) extractedCategoryIds = ids[ids.length - 1].toString();
        else if (ids.length === 1) extractedCategoryIds = ids[0].toString();
      } else if (first.categoryIds) {
        if (Array.isArray(first.categoryIds)) {
          extractedCategoryIds = first.categoryIds.join(',');
        } else {
          extractedCategoryIds = String(first.categoryIds);
        }
      } else if (first.catID) {
        extractedCategoryIds = String(first.catID);
      } else {
        // fallback
        extractedCategoryIds = getCategoryIds(categorySlug, subcategorySlug);
      }
      if (extractedCategoryIds) setCategoryIds(extractedCategoryIds);


      
      // Attach API relatednews (3 items) to first loaded article
      if (data.relatednews && Array.isArray(data.relatednews) && data.relatednews.length > 0) {
        newsArray[0].relatednews = data.relatednews;
      }

      // Attach relatedNewsIddata (for inline paragraphs)
      if (first.relatedNewsIddata && Array.isArray(first.relatedNewsIddata)) {
        newsArray[0].relatedNewsIddata = first.relatedNewsIddata;
      }

      // load widgets for any embeds present
      loadExternalWidgetScripts();

      // SEO update for first item
      updateSEOMetadata(first);
      setHasMoreData(true);
    } catch (err) {
      console.error('loadInitialNews error', err);
      setError('સમાચાર લોડ કરવામાં ભૂલ આવી');
    } finally {
      setLoading(false);
    }
  }, [categorySlug, fetchNewsData, loadExternalWidgetScripts, subcategorySlug, updateSEOMetadata]);


const getNewsThumb = (news: any): string => {
  // 1️⃣ Feature image exists
  if (news.featureImage && news.featureImage.trim() !== "") {
    return news.featureImage;
  }

  // 2️⃣ Feature image missing → try video GIF
  if (news.videoURL) {
    const ext = news.videoURL.split(".").pop()?.toLowerCase() || "";
    return news.videoURL.replace(`.${ext}`, `_video.webp`);
  }

  // 3️⃣ Final fallback
  return "/assets/images/gstv-logo-bg.png";
};

  // Load more
const loadMoreNews = useCallback(async () => {
  if (loadingMore) return;
  setLoadingMore(true);

  try {
    const data = await fetchNewsData(initialSlugRef.current, 2, true);

    // Accept both newsDetail[] or relatednews[]
    let newArray: NewsItem[] = [];
    if (Array.isArray(data?.newsDetail)) newArray = data.newsDetail;
    else if (data?.newsDetail) newArray = [data.newsDetail];
    else if (Array.isArray(data?.relatednews)) newArray = data.relatednews;
    else if (Array.isArray(data?.data)) newArray = data.data;

    if (!newArray || newArray.length === 0) {
      setHasMoreData(false);
      setLoadingMore(false);
      return;
    }

    // 🔥 FETCH RELATEDNEWS FOR EACH NEW ARTICLE
    await Promise.all(
      newArray.map(async (item) => {
        try {
          const r = await fetch(API_ENDPOINTS.NEWS_NEXT_CONTENT, {
            method: "POST",
            cache: 'no-store',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: item.slug,  // 🔥 Correct slug for each article
              user_id: getUserId() || "",
            }),
          });

          const extra = await r.json();

          // Attach RelatedNews (3 items)
          if (Array.isArray(extra.relatednews)) {
            item.relatednews = extra.relatednews;
          }

          // Attach Inline Related “આ પણ વાંચો”
          if (extra.newsDetail?.relatedNewsIddata) {
            item.relatedNewsIddata = extra.newsDetail.relatedNewsIddata;
          }
        } catch (e) {
          console.warn("relatednews fetch failed for:", item.slug);
        }
      })
    );

    // Update state without duplicates
    setNewsItems((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const uniqueNew = newArray.filter((n) => !existingIds.has(n.id));

      if (uniqueNew.length === 0) {
        consecutiveDuplicatesRef.current += 1;
        if (consecutiveDuplicatesRef.current >= MAX_DUPLICATE_ATTEMPTS) {
          setHasMoreData(false);
        }
        return prev;
      } else {
        consecutiveDuplicatesRef.current = 0;
      }

      // update loaded slugs
      const newSlugs = uniqueNew.map((u) => u.slug).filter(Boolean);
      setLoadedSlugs((prevSlugs) =>
        Array.from(new Set([...prevSlugs, ...newSlugs]))
      );

      // update categoryIds from first unique item
      const firstNew = uniqueNew[0];
      if (
        firstNew &&
        firstNew.categories &&
        Array.isArray(firstNew.categories)
      ) {
        const ids = firstNew.categories.map((c) => c.id);
        if (ids.length > 0) setCategoryIds(String(ids[ids.length - 1]));
      }

      return [...prev, ...uniqueNew];
    });

    loadExternalWidgetScripts();
  } catch (err) {
    console.error("loadMoreNews error", err);
  } finally {
    setLoadingMore(false);
  }
}, [
  fetchNewsData,
  loadExternalWidgetScripts,
  loadingMore,
  getUserId,
]);
  // Infinite scroll: throttled
  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 150) return;
      lastScrollTimeRef.current = now;

      if (!hasMoreData || loadingMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      if (distanceFromBottom <= 1000) {
        loadMoreNews();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMoreData, loadMoreNews, loadingMore]);

  // Scroll-based URL update to change SEO when different article is centered
   // Scroll-based URL update (ONLY after user scrolls enough)

useEffect(() => {

  if (!isClient) return;



  let hasUserScrolledEnough = false;

  let ticking = false;



  const SCROLL_THRESHOLD = 200; // Must scroll down 200px



  const updateVisibleArticle = () => {

    if (!newsItems || newsItems.length === 0) return;



    const scrollY = window.scrollY;

    if (!hasUserScrolledEnough) {

      if (scrollY < SCROLL_THRESHOLD) return; // STOP early updates

      hasUserScrolledEnough = true;

    }



    const winH = window.innerHeight;

    const center = scrollY + winH / 2;



    let closestSlug: string | null = null;

    let minDistance = Infinity;



    newsItems.forEach((item) => {

      const el = document.querySelector(

        `[data-news-slug="${item.slug}"]`

      ) as HTMLElement | null;

      if (!el) return;



      const rect = el.getBoundingClientRect();

      const articleCenter = scrollY + rect.top + rect.height / 2;

      const dist = Math.abs(articleCenter - center);



      if (dist < minDistance) {

        minDistance = dist;

        closestSlug = item.slug;

      }

    });



    if (!closestSlug) return;



    const candidateNews = newsItems.find(n => n.slug === closestSlug);

    if (!candidateNews) return;



    const currentPath = window.location.pathname;



    // -------------------------------

    // 🔥 Correct Category + Subcategory

    // -------------------------------

    let actualCategory = categorySlug;
    let actualSubcategory = subcategorySlug;

    if (candidateNews.category_slugs) {
  const catParts = candidateNews.category_slugs.split(',').map(c => c.trim());
  if (catParts.length >= 1) actualCategory = catParts[0];
  if (catParts.length >= 2) actualSubcategory = catParts[1];
}

// 2) Override from categories[] if API gives richer data
if (
  candidateNews.categories &&
  candidateNews.categories.length > 1
) {
  actualSubcategory = candidateNews.categories[1].slug;
}

// 3) Construct correct URL
let newPath = `/news/${actualCategory}`;
if (actualSubcategory && actualSubcategory !== actualCategory) {
  newPath += `/${actualSubcategory}`;
}
newPath += `/${candidateNews.slug}`;



    if (newPath !== currentPath) {

      window.history.replaceState(

        { newsSlug: candidateNews.slug, newsId: candidateNews.id },

        candidateNews.title,

        newPath

      );

      updateSEOMetadata(candidateNews);

    }

  };



  const onScroll = () => {

    if (!ticking) {

      requestAnimationFrame(() => {

        updateVisibleArticle();

        ticking = false;

      });

      ticking = true;

    }

  };



  window.addEventListener("scroll", onScroll, { passive: true });



  return () => window.removeEventListener("scroll", onScroll);

}, [newsItems, categorySlug, subcategorySlug, isClient, updateSEOMetadata]);



  // Load initial data on route param change
  useEffect(() => {
    initialSlugRef.current = newsSlug;
    loadInitialNews();
    // cleanup processed embeds registry to allow reprocessing for new article set
    processedEmbedsRegistry.clear();
    // Reset cache for new article content
    processedContentCache.current.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsSlug]);

  // Fetch news default text from category settings API
  useEffect(() => {
    const fetchNewsDefaultText = async () => {
      try {
        console.log('📰 Fetching news default text from category settings API...');
        const response = await fetch(API_ENDPOINTS.CATEGORY_SETTING, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📰 Category settings API response received');

        if (data && data.setting && Array.isArray(data.setting) && data.setting.length > 0) {
          const newsdefaulttxt = data.setting[0].newsdefaulttxt || '';
          console.log(`✅ News default text loaded: ${newsdefaulttxt.substring(0, 100)}...`);
          setNewsDefaultText(newsdefaulttxt);
        } else {
          console.log('⚠️ No setting array found in API response');
        }
      } catch (error) {
        console.error('❌ Error fetching news default text:', error);
      }
    };

    fetchNewsDefaultText();
  }, []);


  // Popstate (back/forward) handling - scroll to article if present
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const state = (e.state as any) || {};
      const slug = state?.newsSlug;
      if (slug) {
        const el = document.querySelector(`[data-news-slug="${slug}"]`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // When newsItems change, ensure we call widget script loader (for newly added social blocks)
  useEffect(() => {
    if (newsItems.length > 0) loadExternalWidgetScripts();
  }, [newsItems.length, loadExternalWidgetScripts]);

  // Bookmark icons update listener across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'bookmarks') setBookmarkUpdate(prev => prev + 1);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ------------------ RENDER ------------------
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid #f3f3f3', borderTop: '2px solid #8B0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: 10, color: '#666' }}>સમાચાર લોડ થઈ રહ્યા છે...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.newsDetailError}>
        <h2>ભૂલ આવી</h2>
        <p>{error}</p>
        <button onClick={loadInitialNews} className={styles.retryButton}>ફરી પ્રયાસ કરો</button>
      </div>
    );
  }

  return (
    <div className={styles.newsDetailContainer} style={{ padding: 0 }}>
      {newsItems.map((newsItem, index) => {


  // 🔥 Correct Category + Subcategory Resolver
  let actualCategory = categorySlug;
  let actualSubcategory = subcategorySlug;

  if (newsItem.category_name_guj) {
    const parts = newsItem.category_name_guj.split(',').map(v => v.trim());
    if (parts.length >= 1) actualCategory = parts[0];
    if (parts.length >= 2) actualSubcategory = parts[1];
  }

  if (newsItem.categories && newsItem.categories.length > 1) {
    actualSubcategory = newsItem.categories[1].slug;
  }

  return (
    <React.Fragment key={`news-fragment-${newsItem.id}-${index}`}>
       
        
                    
      {/* 🔥 Correct Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">હોમ</Link>
        <span> / </span>

        <Link href={`/category/${categorySlug}`}>
          {actualCategory}
        </Link>

        {(() => {
          let categorySlugEn: string | undefined;
          let subcategorySlugEn: string | undefined;

          if (newsItem.category_slugs) {
            const parts = newsItem.category_slugs
              .split(',')
              .map(s => s.trim());

            if (parts.length >= 1) categorySlugEn = parts[0];
            if (parts.length >= 2) subcategorySlugEn = parts[1];
          }

          return (
            actualSubcategory &&
            actualSubcategory !== actualCategory &&
            categorySlugEn &&
            subcategorySlugEn && (
              <>
                <span> / </span>
                <Link href={`/category/${categorySlugEn}/${subcategorySlugEn}`}>
                  {actualSubcategory}
                </Link>
              </>
            )
          );
        })()}

        <span> : </span>
        <span>{newsItem.englishTitle || newsItem.title}</span>
      </div>

      <article
        key={`${newsItem.id}-${index}`}
        className={`${styles.newsItemContainer} detail-page-heading-h1 detail-page1`}
        data-news-id={newsItem.id}
        data-news-slug={newsItem.slug}
      >
        <h1>
            {newsItem.is_live_news === 1 && (
              <span className="liveNewsHeading">
                <em>લાઇવ</em>
              </span>
            )}{' '}
            {newsItem.title}
          </h1>
        <div className={styles.newsMeta}>
          <div className="reading-time-blog">
            <img src="/assets/icons/clock.webp" alt="Time" />
            <span>છેલ્લું અપડેટ : {formatDate(newsItem.created_at)}</span>
          </div>

          <div className={styles.newsActions}>
            <Link
              href="/livetv"
              className={styles.liveTvLink}
              style={{ display: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'none' : 'block' }}
            >
              <img src="/assets/images/live-ico.svg" alt="લાઇવ ટીવી" />
            </Link>

            <Link
              href="https://news.google.com/publications/CAAqIAgKIhpDQklTRFFnTWFna0tCMmR6ZEhZdWFXNG9BQVAB?hl=gu-IN&gl=IN&ceid=IN%3Agu"
              className={styles.googleNewsLink}
            >
              <img src="/assets/images/Google_News_icon.svg" alt="Google News" />
            </Link>

            <div className="bookmark-share-actions">
              <ShareButtons
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/news/${actualCategory}/${newsItem.slug}`}
                title={newsItem.title}
                variant="fontawesome"
                showDate={true}
                date={newsItem.created_at}
                imageUrl={
                  newsItem.featureImage && newsItem.featureImage.trim() !== ""
                    ? newsItem.featureImage
                    : "/assets/images/gstv-logo-bg.png"
                }
/>

              <button
                onClick={() => handleBookmark(newsItem)}
                className="bookmark-btn bookmark-btn-news"
                title="બુકમાર્ક કરો"
                style={{ border: 0, backgroundColor: 'transparent', padding: 0 }}
              >
                <img
                  className={`bookmark-icon-${newsItem.id}`}
                  src={getBookmarkIcon(newsItem.id)}
                  alt="Bookmark"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Media */}
        {newsItem.videoURL && newsItem.videoURL.trim() !== '' ? (
          <div className={styles.newsVideoContainer}>
            <video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              src={newsItem.videoURL}
              controls
              className={styles.newsFeaturedVideo}
              style={{
                width: '100%',
                height: 'auto',
                minHeight: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'auto' : '450px',
                maxHeight: '500px'
              }}
              poster={newsItem.featureImage || undefined}
              playsInline
              muted={false}  
              preload="metadata"
              onPlay={() => {
                setActiveVideoIndex(index);
              }}

              onClick={() => {
                setActiveVideoIndex(index);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : newsItem.featureImage && newsItem.featureImage.trim() !== '' ? (
          <div className="lazyload-wrapper">
            <img
              src={newsItem.featureImage}
              alt={newsItem.title}
              className="innerpage lazyautosizes lazyloaded"
              onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/gstv-logo-bg.png'; }}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        ) : null}

        {newsItem.img_credit_txt && (
          <div className="news_credit_txt"><strong>સોર્સ :</strong> {newsItem.img_credit_txt}</div>
        )}

        {/* Description */}
        <div className="detail-page finalContent">
          {renderDescription(newsItem.description || '', newsItem, index)}
          
        </div>

        {/* Live Section - Only render time on client to avoid hydration mismatch */}
        {newsItem.live && newsItem.live.length > 0 && (
          <div className="liveNewsAddSection">
            {Array.from(
              new Map((newsItem.live || []).map((l) => [l.lid || l.livetitle, l])).values()
            ).map((liveItem, liveIndex) => (
              <React.Fragment key={liveIndex}>
                <div className="colLeft">
                  <h6>
                    {isClient ? (
                      <>
                        {new Date(liveItem.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                        <span style={{ marginLeft: 8 }}>
                          ({timeAgo(liveItem.created_at)})
                        </span>
                      </>
                    ) : (
                      // Server-side fallback - show date only
                      formatDate(liveItem.created_at)
                    )}
                  </h6>
                </div>

                <div className="colRight">
                  <h4>{liveItem.livetitle}</h4>

                  {/* {liveItem.livedesc && (
                    <div className="liveNewsDesc">
                      {renderDescription(convertEmbedsInline(liveItem.livedesc), newsItem, index + liveIndex)}

                    </div>
                  )} */}
                  {liveItem.livedesc && (
                    <div
                      className="liveNewsDesc"
                      dangerouslySetInnerHTML={{
                        __html: convertEmbedsInline(liveItem.livedesc)
                      }}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Tags */}
        {newsItem.tags && (
          <div className="tagsOuterblock">
            <strong>ટોપિક્સ:</strong>
            {newsItem.tags.split(',').map((tag, tIdx) => (
              <span key={tIdx} className="tagscls">
                <Link href={`/tags/${tag.trim().toLowerCase().replace(/\s+/g, '-')}`}>
                  {tag.trim()}
                </Link>
              </span>
            ))}
          </div>
        )}

        {/* News Default Text from Settings */}
          {newsDefaultText && (
            <div
              className={styles.newsDefaultText}
              dangerouslySetInnerHTML={{ __html: newsDefaultText }}
            />
          )}
          
          {/* 🔥 Related News only for FIRST article */}
          {/* {newsItem.relatednews && newsItem.relatednews.length > 0  && (
            <div style={{ marginTop: "30px" }}>
              <RelatedNews items={newsItem.relatednews} />
            </div>
          )} */}

        {/* Next Story */}
        {index !== newsItems.length - 1 && (
          <div id={`next-story-${newsItems[index].id}`} className="next-story">
            <span style={{ marginRight: 8 }}>નેક્સ્ટ સ્ટોરી</span>
            <img
              src="/assets/images/next-arrow.gif"
              width="16"
              height="16"
              alt="Arrow GIF"
              style={{ verticalAlign: 'middle', opacity: 0.8 }}
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            />
          </div>
        )}

      </article>
    </React.Fragment>
  );
})}


      {/* Loading more UI */}
      {loadingMore && (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid #f3f3f3', borderTop: '2px solid #8B0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 10, color: '#666' }}>વધુ સમાચાર લોડ કરી રહ્યા છીએ...</p>
        </div>
      )}

      {/* End message */}
      {!hasMoreData && newsItems.length > 1 && (
        <div style={{ textAlign: 'center', padding: 20, borderTop: '1px solid #eee', marginTop: 20 }}>
          બધા સમાચાર લોડ થઈ ગયા છે
        </div>
      )}
    </div>
  );
};

export default NewsDetailWithInfiniteScroll;
