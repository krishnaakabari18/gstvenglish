import { Metadata } from 'next';
import { Suspense } from 'react';
import NewsDetailClientWrapper from '@/components/NewsDetailClientWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';
import { generateNewsDetailSEO } from '@/utils/seoUtils';
import { API_ENDPOINTS, DEFAULT_API_PARAMS } from '@/constants/api';


// Fetch news data for metadata generation
async function fetchNewsData(newsSlug: string, hasSubcategory: boolean = false) {
  try {
    const apiEndpoint = API_ENDPOINTS.NEWS_NEXT_CONTENT;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; GSTV-Bot/1.0)',
      },
      body: new URLSearchParams({
        slug: newsSlug,
        user_id: DEFAULT_API_PARAMS.user_id,
        device_id: DEFAULT_API_PARAMS.device_id,
        loadedSlugs: '',
        categoryIds: '',
      }),
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data?.newsDetail) {
      return Array.isArray(data.newsDetail) ? data.newsDetail[0] : data.newsDetail;
    }

    if (Array.isArray(data?.data) && data.data.length > 0) {
      return data.data[0];
    }

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return null;
  } catch (error) {
    console.error('[fetchNewsData] Error:', error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { category: categorySlug, slug: slugArray } = resolvedParams;

  const hasSubcategory = slugArray.length === 2;
  const subcategorySlug = hasSubcategory ? slugArray[0] : undefined;
  const newsSlug = hasSubcategory ? slugArray[1] : slugArray[0];

  const canonicalUrl = hasSubcategory
    ? `https://www.gstv.in/news/${categorySlug}/${subcategorySlug}/${newsSlug}`
    : `https://www.gstv.in/news/${categorySlug}/${newsSlug}`;

  try {
    const newsData = await fetchNewsData(newsSlug, hasSubcategory);

    if (!newsData || !newsData.title) {
      return {
        title: 'GSTV News',
        description: 'Latest Gujarati News from GSTV',
        openGraph: {
          type: 'article',
          title: 'GSTV News',
          description: 'Latest Gujarati News from GSTV',
          url: canonicalUrl,
          siteName: 'GSTV',
          images: [
            {
              url: 'https://www.gstv.in/images/logo.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          images: ['https://www.gstv.in/images/logo.png'],
        },
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }

    const seoData = generateNewsDetailSEO(newsData, categorySlug);

    const ogImage =
      seoData.ogImage && seoData.ogImage.startsWith('http')
        ? seoData.ogImage
        : 'https://www.gstv.in/images/logo.png';

    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      openGraph: {
        type: 'article',
        title: seoData.ogTitle,
        description: seoData.ogDescription,
        url: canonicalUrl,
        siteName: 'GSTV',
        locale: 'gu_IN',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: seoData.ogTitle,
          },
        ],
        publishedTime: seoData.publishedTime,
        modifiedTime: seoData.modifiedTime,
        authors: [seoData.author || 'GSTV Team'],
        section: seoData.section,
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData.ogTitle,
        description: seoData.ogDescription,
        images: [ogImage],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('[generateMetadata] Error:', error);

    return {
      title: 'GSTV News',
      description: 'Latest Gujarati News from GSTV',
      openGraph: {
        type: 'article',
        title: 'GSTV News',
        description: 'Latest Gujarati News from GSTV',
        url: canonicalUrl,
        siteName: 'GSTV',
        images: [
          {
            url: 'https://www.gstv.in/images/logo.png',
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        images: ['https://www.gstv.in/images/logo.png'],
      },
    };
  }
}

interface NewsDetailPageProps {
  params: Promise<{
    category: string;
    slug: string[];
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const slugArray = resolvedParams.slug;

  const hasSubcategory = slugArray.length === 2;
  const subcategorySlug = hasSubcategory ? slugArray[0] : undefined;
  const newsSlug = hasSubcategory ? slugArray[1] : slugArray[0];
 

  if (!categorySlug || !newsSlug) {
    return <div style={{ padding: 40 }}>News article not found</div>;
  }

  return (
    <div className="news-detail-page blogs-main-section inner custom-blog-details">
      
      <Suspense
        fallback={
          <div style={{ padding: 40, textAlign: 'center' }}>
            <LoadingSpinner
              message="સમાચાર લોડ થઈ રહ્યો છે..."
              size="large"
              type="dots"
              color="#850E00"
            />
          </div>
        }
      >
        <NewsDetailClientWrapper
          initialCategorySlug={categorySlug}
          initialNewsSlug={newsSlug}
          initialSubcategorySlug={subcategorySlug}
        />
       
      </Suspense>
    </div>
  );
}
