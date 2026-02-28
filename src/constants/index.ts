/**
 * Constants Index
 * Central export point for all constants
 */

// Gujarati Strings - All text content
export {
  LOADING_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  BUTTON_TEXT,
  NAVIGATION,
  CATEGORIES,
  TIME_AGO,
  GENERAL_MESSAGES,
  WEB_STORIES,
  VIEW_COUNTS,
  TIME_UNITS,
  AUTH_MESSAGES,
  BOOKMARK_MESSAGES,
  SHARE_MESSAGES,
  FORM_BUTTONS,
  FORM_MESSAGES,
  APP_MESSAGES,
  PLACEHOLDERS,
  SPECIAL_LABELS,
  DATE_TIME_LABELS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  VALIDATION_MESSAGES,
  UPDATE_MESSAGES,
  POLL_MESSAGES,
  SEARCH_MESSAGES,
  PROFILE_MESSAGES,
  POLICY_LINKS,
  APP_DOWNLOAD,
  RELATED_NEWS,
  ACTION_BUTTONS,
  MISC_UI,
  getTimeAgoMessage,
  getErrorMessage,
  formatViews,
  type LoadingMessageKey,
  type ErrorMessageKey,
  type SuccessMessageKey,
  type ButtonTextKey,
  type NavigationKey,
  type CategoryKey,
  type TimeAgoKey,
  type GeneralMessageKey,
  type WebStoryKey,
  type ViewCountKey,
  type TimeUnitKey,
  type AuthMessageKey,
  type BookmarkMessageKey,
  type ShareMessageKey,
  type FormButtonKey,
  type FormMessageKey,
  type AppMessageKey,
  type PlaceholderKey,
  type SpecialLabelKey,
  type DateTimeLabelKey,
  type FormLabelKey,
  type FormPlaceholderKey,
  type ValidationMessageKey,
  type UpdateMessageKey,
  type PollMessageKey,
  type SearchMessageKey,
  type ProfileMessageKey,
  type PolicyLinkKey,
  type AppDownloadKey,
  type RelatedNewsKey,
  type ActionButtonKey,
  type MiscUIKey,
} from './gujaratiStrings';

// API Configuration
export {
  BASE_URLS,
  COMMON_API_BASE_URL,
  API_BASE_URL,
  API_V5_BASE_URL,
  API_V6_BASE_URL,
  MEDIA_BASE_URL,
  UPLOAD_PATHS,
  API_ENDPOINTS,
  DEFAULT_API_PARAMS,
  API_REQUEST_TYPES,
  API_METHODS,
  PAGINATION,
  IMAGE_CONSTANTS,
  CATEGORY_MAPPING,
  CATEGORY_ID_MAPPING,
  API_STATUS,
  HTTP_STATUS,
  getCategoryIds,
  commonApiFetch,
  commonApiPost,
  commonApiGet,
  getGujaratImageUrl,
  getGujaratImageUrlV2,
  getcampuscornerImageUrl,
  getEkasanaImageUrl,
  getGanapatiImageUrl,
  getMediaUrl,
} from './api';

/**
 * Usage Examples:
 * 
 * // Import specific constants
 * import { LOADING_MESSAGES, BUTTON_TEXT } from '@/constants';
 * 
 * // Import API utilities
 * import { API_ENDPOINTS, commonApiGet } from '@/constants';
 * 
 * // Import everything
 * import * as Constants from '@/constants';
 */
