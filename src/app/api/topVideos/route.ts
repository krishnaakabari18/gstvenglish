import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request: NextRequest) {
  try {
   
    const response = await fetch(API_ENDPOINTS.TOP_VIDEOS, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
   
    // Transform the topVideos API response to match our expected structure
    // The API returns { topvideos: [...] }
    const transformedData = {
      status: 'success',
      message: 'Top videos fetched successfully',
      category: null,
      data: {
        current_page: 1,
        data: data.topvideos || [],
        first_page_url: '',
        from: 1,
        last_page: 1,
        last_page_url: '',
        next_page_url: null,
        path: '',
        per_page: data.topvideos?.length || 0,
        prev_page_url: null,
        to: data.topvideos?.length || 0,
        total: data.topvideos?.length || 0
      }
    };

    

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('API Route: Error fetching top videos:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch videos',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
