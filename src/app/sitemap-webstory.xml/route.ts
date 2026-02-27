import { NextResponse } from 'next/server';
import { API_ENDPOINTS,MEDIA_BASE_URL } from '@/constants/api';

type WebStory = {
  slug: string;
  updated_at: string;
};

export async function GET(): Promise<NextResponse> {
  const BASE_URL =
    MEDIA_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(API_ENDPOINTS.SITEMAP_WEBSTORY, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch webstory sitemap data');
    }

    const stories: WebStory[] = await res.json();

    let urls = '';

    for (const story of stories) {
      urls += `
<url>
  <loc>${BASE_URL}/web-stories/${story.slug}</loc>
  <lastmod>${new Date(story.updated_at).toISOString()}</lastmod>
  <priority>1.0</priority>
</url>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    return new NextResponse('Webstory sitemap error', { status: 500 });
  }
}
