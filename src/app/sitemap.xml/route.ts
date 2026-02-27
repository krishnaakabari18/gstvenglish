import { NextResponse } from 'next/server';
import { API_ENDPOINTS ,MEDIA_BASE_URL} from '@/constants/api';

type SitemapCountResponse = {
  total: number;
};

export async function GET(): Promise<NextResponse> {
  const BASE_URL = MEDIA_BASE_URL || 'http://localhost:3000';

  try {
    // Fetch total news count
    const res = await fetch(API_ENDPOINTS.SITEMAP_NEWS_COUNT, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch sitemap count');
    }

    const data: SitemapCountResponse = await res.json();
    const { total } = data;

    const perPage = 1000;
    const totalPages = Math.ceil(total / perPage);

    let sitemaps = '';

    // News sitemaps
    for (let i = 1; i <= totalPages; i++) {
      sitemaps += `
<sitemap>
  <loc>${BASE_URL}/sitemap-news-${i}.xml</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
</sitemap>`;
    }

    // Category & Webstory sitemaps
    sitemaps += `
<sitemap>
  <loc>${BASE_URL}/sitemap-category.xml</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
</sitemap>
<sitemap>
  <loc>${BASE_URL}/sitemap-webstory.xml</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
</sitemap>`;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    return new NextResponse('Sitemap error', { status: 500 });
  }
}


 