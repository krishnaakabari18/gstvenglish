/**
 * Search API Service
 * Handles all search-related API calls
 */

import { API_ENDPOINTS } from '@/constants/api';

export interface SearchItem {
  id: number;
  title: string;
  englishTitle?: string;
  slug: string;
  featureImage?: string | null;
  videoURL?: string;
  created_at: string;
  updated_at?: string;
  catID?: string;
  category_slugs?: string;
  is_vertical_video?: number;
  description?: string; // May not be in search results
  categories?: Array<{
    id: number;
    title: string;
    slug: string;
  }>;
}

export interface SearchResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: SearchItem[];
    last_page: number;
    next_page_url: string | null;
    total: number;
  };
}

export interface SearchRequest {
  txtSearch: string;
  pageNumber?: number;
  user_id?: string;
}

/**
 * Perform search using the search API
 * @param searchParams - Search parameters
 * @returns Promise<SearchResponse>
 */
export async function performSearch(searchParams: SearchRequest): Promise<SearchResponse> {
  try {


    const response = await fetch('/api/searchresult', {
      method: 'POST',
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txtSearch: searchParams.txtSearch,
        pageNumber: searchParams.pageNumber || 1,
        user_id: searchParams.user_id || ''
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SearchResponse = await response.json();


    if (!result.status) {
      throw new Error(result.message || 'Search failed');
    }

    return result;
  } catch (error) {
    console.error('🔍 Search API Error:', error);
    throw error;
  }
}

/**
 * Get search suggestions based on popular terms
 * @returns Array of search suggestion objects
 */
export function getSearchSuggestions(lang: string = 'gu') {
  return [
    {
      term: 'ગુજરાત',
      label: lang === 'gu' ? 'ગુજરાત' : 'Gujarat',
      category: 'location',
    },
    {
      term: 'રાજકોટ',
      label: lang === 'gu' ? 'રાજકોટ' : 'Rajkot',
      category: 'location',
    },
    {
      term: 'અમદાવાદ',
      label: lang === 'gu' ? 'અમદાવાદ' : 'Ahmedabad',
      category: 'location',
    },
    {
      term: 'સુરત',
      label: lang === 'gu' ? 'સુરત' : 'Surat',
      category: 'location',
    },
    {
      term: 'વડોદરા',
      label: lang === 'gu' ? 'વડોદરા' : 'Vadodara',
      category: 'location',
    },
    {
      term: 'રાજકારણ',
      label: lang === 'gu' ? 'રાજકારણ' : 'Politics',
      category: 'topic',
    },
    {
      term: 'વ્યવસાય',
      label: lang === 'gu' ? 'વ્યવસાય' : 'Business',
      category: 'topic',
    },
    {
      term: 'રમતગમત',
      label: lang === 'gu' ? 'રમતગમત' : 'Sports',
      category: 'topic',
    },
    {
      term: 'મનોરંજન',
      label: lang === 'gu' ? 'મનોરંજન' : 'Entertainment',
      category: 'topic',
    },
    {
      term: 'આરોગ્ય',
      label: lang === 'gu' ? 'આરોગ્ય' : 'Health',
      category: 'topic',
    },
  ];
}

/**
 * Format search query for display
 * @param query - Raw search query
 * @returns Formatted query string
 */
export function formatSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

/**
 * Validate search query
 * @param query - Search query to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateSearchQuery(query: string): { isValid: boolean; error?: string } {
  const trimmedQuery = query.trim();
  
  if (!trimmedQuery) {
    return { isValid: false, error: 'કૃપા કરીને શોધ શબ્દ દાખલ કરો' };
  }
  
  if (trimmedQuery.length < 2) {
    return { isValid: false, error: 'શોધ શબ્દ ઓછામાં ઓછા 2 અક્ષરનો હોવો જોઈએ' };
  }
  
  if (trimmedQuery.length > 100) {
    return { isValid: false, error: 'શોધ શબ્દ 100 અક્ષરથી વધુ લાંબો હોઈ શકતો નથી' };
  }
  
  return { isValid: true };
}

/**
 * Get search result statistics
 * @param response - Search API response
 * @returns Formatted statistics object
 */
export function getSearchStats(response: SearchResponse) {
  if (!response.status || !response.data) {
    return {
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      resultsText: 'કોઈ પરિણામો મળ્યા નથી'
    };
  }

  const { data } = response;
  const hasMore = !!data.next_page_url;
  const resultsText = data.total > 0 
    ? `કુલ ${data.total} પરિણામો મળ્યા`
    : 'કોઈ પરિણામો મળ્યા નથી';

  return {
    total: data.total,
    currentPage: data.current_page,
    totalPages: data.last_page,
    hasMore,
    resultsText
  };
}

/**
 * Build search URL with query parameters
 * @param query - Search query
 * @param page - Page number (optional)
 * @returns Search URL string
 */
export function buildSearchUrl(query: string, page?: number): string {
  const params = new URLSearchParams();
  params.set('q', query);
  
  if (page && page > 1) {
    params.set('page', page.toString());
  }
  
  return `/search?${params.toString()}`;
}

/**
 * Extract search query from URL
 * @param searchParams - URLSearchParams object
 * @returns Search query string or null
 */
export function extractSearchQuery(searchParams: URLSearchParams): string | null {
  return searchParams.get('q');
}

/**
 * Check if search result item is a video
 * @param item - Search result item
 * @returns Boolean indicating if item is a video
 */
export function isVideoItem(item: SearchItem): boolean {
  if (!item.catID) return false;
  
  const categoryIds = item.catID.split(',').map(id => parseInt(id.trim()));
  return categoryIds.includes(9) || item.is_vertical_video === 9;
}

/**
 * Get category name from search item
 * @param item - Search result item
 * @returns Category name or default
 */
export function getCategoryName(item: SearchItem): string {
  if (item.categories && item.categories.length > 0) {
    return item.categories[0].title;
  }
  
  // Fallback based on catID
  if (item.catID) {
    const categoryIds = item.catID.split(',').map(id => parseInt(id.trim()));
    if (categoryIds.includes(9)) return 'વિડિયો';
    if (categoryIds.includes(1)) return 'ગુજરાત';
    if (categoryIds.includes(2)) return 'ભારત';
    if (categoryIds.includes(3)) return 'વિશ્વ';
  }
  
  return 'સમાચાર';
}

/**
 * Debounce function for search input
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Search analytics helper
 * @param query - Search query
 * @param resultsCount - Number of results found
 */
export function trackSearchAnalytics(query: string, resultsCount: number): void {
  // This can be extended to integrate with analytics services
  // Analytics tracking can be implemented here
}
