import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS, DEFAULT_API_PARAMS } from '@/constants/api';

export async function POST(request: NextRequest) {
  try {
    console.log('Category News API Route: Processing POST request');

    const body = await request.json();
    const { category_slug, subslug, page = 1 } = body;

    console.log('Category News API Route: Request body:', { category_slug, subslug, page });

    if (!category_slug) {
      return NextResponse.json(
        { error: 'category_slug is required' },
        { status: 400 }
      );
    }

    // Simple subslug logic: use provided subslug or 'undefined' for main categories
    const getSubslugForCategory = (requestedSubslug?: string): string => {
      // If a specific subslug is requested, use it
      if (requestedSubslug) {
        return requestedSubslug;
      }

      // For main category pages (no subslug), always return 'undefined' string
      return 'undefined';
    };

    const finalSubslug = getSubslugForCategory(subslug);

    console.log('Category News API Route: getSubslugForCategory result:', {
      category_slug,
      subslug,
      finalSubslug
    });

    // Use the exact parameters from your Postman example
    const requestBody = new URLSearchParams({
      slug: category_slug,
      subslug: finalSubslug,
      pageNumber: page.toString(),
      device_id: DEFAULT_API_PARAMS.device_id,
      user_id: DEFAULT_API_PARAMS.user_id
    });

    console.log('Category News API Route: Request params:', Object.fromEntries(requestBody));

    const response = await fetch(API_ENDPOINTS.CATEGORY_NEWS, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    console.log('Category News API Route: External API response status:', response.status);

    if (!response.ok) {
      console.error('Category News API Route: External API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `External API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Category News API Route: External API data received:', data);

    // Transform the response to match our expected format
    const transformedData = {
      status: 'success',
      message: 'Success',
      data: {
        current_page: data.news?.current_page || page,
        data: data.news?.data || [],
        first_page_url: data.news?.first_page_url || '',
        from: data.news?.from || 1,
        last_page: data.news?.last_page || 1,
        last_page_url: data.news?.last_page_url || '',
        next_page_url: data.news?.next_page_url,
        path: data.news?.path || '',
        per_page: data.news?.per_page,
        prev_page_url: data.news?.prev_page_url,
        to: data.news?.to || 0,
        total: data.news?.total || 0
      },
      category: {
        id: 1,
        name: data.catTitle || category_slug,
        slug: data.catSlug || category_slug,
        icon: '',
        description: data.catMetadesc || `Latest news from ${category_slug}`
      }
    };

    

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Category News API Route: Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET method for testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestBody = {
      category_slug: searchParams.get('category_slug') || '',
      subslug: searchParams.get('subslug') || 'undefined',
      page: parseInt(searchParams.get('page') || '1')
    };

    // Call the POST method internally
    const postResponse = await POST(new NextRequest(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }));

    return postResponse;

  } catch (error) {
    console.error('Category News API Route (GET): Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



