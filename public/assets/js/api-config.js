/**
 * Global API Configuration
 * Exposed for use in vanilla JavaScript files
 * This mirrors the constants from src/constants/api.ts
 * Dynamically loads configuration from environment or backend
 */

window.GSTV_API_CONFIG = {
  // Default base URLs (will be overridden by environment or backend config)
  COMMON_API_BASE_URL: window.GSTV_API_CONFIG?.COMMON_API_BASE_URL || getApiBaseUrl(),
  MEDIA_BASE_URL: window.GSTV_API_CONFIG?.MEDIA_BASE_URL || getMediaBaseUrl(),

  // API Endpoints (built dynamically from base URL)
  get CATEGORY_SETTING() {
    return this.COMMON_API_BASE_URL + '/categorysettingweb';
  },

  get USER_CATEGORY() {
    return this.COMMON_API_BASE_URL + '/usercategory';
  },

  /**
   * Get category setting endpoint dynamically
   * @returns {string} Full URL for category setting API
   */
  getCategorySettingUrl() {
    return this.CATEGORY_SETTING;
  },

  /**
   * Get user category endpoint dynamically
   * @returns {string} Full URL for user category API
   */
  getUserCategoryUrl() {
    return this.USER_CATEGORY;
  }
};

/**
 * Get the API base URL from environment or meta tag
 * @returns {string} API base URL
 */
function getApiBaseUrl() {
  // Try to get from meta tag first (set by Next.js)
  const metaTag = document.querySelector('meta[data-api-base-url]');
  if (metaTag) {
    return metaTag.getAttribute('data-api-base-url');
  }

  // Try to get from window object (set by Next.js in layout)
  if (window.NEXT_PUBLIC_API_BASE) {
    return window.NEXT_PUBLIC_API_BASE;
  }

  // Default fallback to staging
  return 'https://staging.gstv.in/backend2/api/v17/mobile';
}

/**
 * Get the media base URL from environment or meta tag
 * @returns {string} Media base URL
 */
function getMediaBaseUrl() {
  // Try to get from meta tag first (set by Next.js)
  const metaTag = document.querySelector('meta[data-media-base-url]');
  if (metaTag) {
    return metaTag.getAttribute('data-media-base-url');
  }

  // Try to get from window object (set by Next.js in layout)
  if (window.NEXT_PUBLIC_MEDIA_BASE) {
    return window.NEXT_PUBLIC_MEDIA_BASE;
  }

  // Default fallback to staging
  return 'https://staging.gstv.in';
}

console.log('✓ Global API Config loaded:', {
  baseUrl: window.GSTV_API_CONFIG.COMMON_API_BASE_URL,
  mediaUrl: window.GSTV_API_CONFIG.MEDIA_BASE_URL
});
