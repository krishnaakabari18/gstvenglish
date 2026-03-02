/**
 * Centralized Gujarati Text Constants
 * All Gujarati strings used across the website
 * Update this file to change text throughout the application
 */

// ============================================
// LOADING MESSAGES
// ============================================
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',
  LOADING_NEWS: 'Loading news...',
  LOADING_MORE_NEWS: 'Loading more news...',
  LOADING_VIDEOS: 'Loading video...',
  LOADING_CATEGORIES: 'Loading categories...',
  LOADING_WEB_STORY: 'Loading web story...',
  LOADING_GSTV_SATRANG: 'Loading GSTV Satrang...',
  LOADING_GSTV_MAGAZINE: 'Loading GSTV Magazine...',
  LOADING_EPAPER: 'Loading E-paper...',
  LOADING_TAG_PAGE: 'Loading tag page...',
  LOADING_RASHIFAL: 'Loading horoscope...',
  LOADING_JOURNALIST: 'Loading journalist...',
  LOADING_CAMPUS_CORNER: 'Loading campus corner...',
  LOADING_USER_POINTS: 'Loading user points...',
  LOADING_BOOKMARK_LIST: 'Loading bookmark list...',
  UPLOADING: 'Uploading...',
  NEXT_VIDEO_COMING: 'Next video is coming...',
  LOADING_NEWS_GUJ: 'Loading news...',
  LOADING_MAGAZINE_GUJ: 'Loading magazine...',
  NOT_LOADING_CATEGORY: 'No category',
  ATLEAST_ONE_CITY: 'Please select at least one city',
  BEFORE_LOGIN: 'Please login first',
  UPDATE_CITY_ERROR: 'Error updating city',
  ATLEAST_ONE_CATEGORY: 'Please select at least one category',
  UPDATE_CATEGORY_ERROR: 'Error updating category',
  NO_CITY_FOUND: 'No City found',
  NO_CATEGORY_FOUND: 'No Category found',
  LOADING_ERROR_CITY:'શહેર લોડ કરવામાં ભૂલ થઈ',
  LOADING_CITY:'Loading Cities...',
} as const;

// ============================================
// ERROR MESSAGES
// ============================================
export const ERROR_MESSAGES = {
  MAGAZINE_LOAD_ERROR: 'Magazine loading error',
  FAST_TRACK_LOAD_ERROR: 'GSTV Fast Track loading error',
  LINK_COPY_FAILED: 'Link copy error!',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  MAGAZINE_LOAD_ERROR_GUJ: 'There was a problem loading the magazine. Please try again.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================
export const SUCCESS_MESSAGES = {
  LINK_COPIED: 'Link copied successfully!',
  VIDEO_BOOKMARKED: 'Video bookmarked',
  VIDEO_BOOKMARK_REMOVED: 'Video bookmark removed',
} as const;

// ============================================
// BUTTON TEXT
// ============================================
export const BUTTON_TEXT = {
  READ_MORE: 'Read More',
  LOAD_MORE: 'Load More',
  RETRY: 'Retry',
  GO_BACK: 'Go Back',
  UPLOAD: 'Upload',
  SUBMIT: 'Submit',
  PROCEED: 'Proceed',
} as const;

// ============================================
// NAVIGATION & MENU
// ============================================
export const NAVIGATION = {
  HOME: 'Home',
  PREVIOUS_VIDEO: 'Previous Video',
  NEXT_VIDEO: 'Next Video',
  LIVE_TV: 'Live TV',
  VIDEO: 'Video',
  VIDEOS: 'Videos',
  SEARCH: 'Search',
  E_PAPER: 'E-paper',
  ENTERTAINMENT: 'Entertainment',
  PODCAST: 'Podcast',
  RASHIFAL: 'Horoscope',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  MY_PROFILE: 'My Profile',
  BOOKMARK_LIST: 'Bookmark List',
} as const;

// ============================================
// CATEGORY NAMES
// ============================================
export const CATEGORIES = {
  GSTV_SATRANG: 'GSTV Satrang',
  GSTV_MAGAZINE: 'GSTV Magazine',
  GSTV_FAST_TRACK: 'GSTV Fast Track',
  MAGAZINE: 'Magazine',
  CHITRALOK: 'Chitralok',
  TOP_NEWS: 'Top News',
  GTV_FAST_TRACK_GUJ: 'GSTV Fast Track',
  GSTV_MAGAZINE_GUJ: 'GSTV Magazine',
  NEWS_PAPER_GUJ: 'Newspaper',
} as const;

// ============================================
// TIME AGO MESSAGES
// ============================================
export const TIME_AGO = {
  JUST_NOW: 'Just now',
  MINUTES_AGO: 'minutes ago',
  HOURS_AGO: 'hours ago',
  DAYS_AGO: 'days ago',
  WEEKS_AGO: 'weeks ago',
  MONTHS_AGO: 'months ago',
  YEARS_AGO: 'years ago',
} as const;

// ============================================
// GENERAL MESSAGES
// ============================================
export const GENERAL_MESSAGES = {
  NO_MORE_DATA: 'No more data',
  END_OF_NEWS: 'End of news',
  ALL_VIDEOS_WATCHED: 'All videos watched',
  SOURCE: 'Source',
  SOURCE_LABEL: 'Source:',
  YESTERDAY: 'Yesterday',
  JUST_NOW_SHORT: 'Just now',
  LINK_COPIED_FULL: 'Link copied successfully!',
  TOPICS:'Topics',
} as const;

export const CAMPUSCORNER_MESSAGES = {
  CAMPUS_CORNER: 'Campus Corner',
  CAMPUS_CORNER_GUJ: 'Campus Corner',
  UPLOAD_YOUR_CAMPUS_CORNER: 'Please upload your Campus Corner',
  REPORTED_BY: 'Reported By',
  CAMPUSCORNER_LOADING: 'Loading...',
  CAMPUS_LOADING: 'Campus Corner Loading...',
  CAMPUSCORNER_STORIES: 'You have viewed all Campus Corner stories.',
  CAMPUSCORNER_STORIES_DUPLICATE: 'Duplicate content detected.',
  CAMPUSCORNER_SAME_STORIES: 'Loading has been stopped to avoid showing duplicate content.',
  CAMPUSCORNER_MORE_LOADING: 'Loading more content...',
  CAMPUSCORNER_NEXT_STORY: 'Next Story',
  SCHOOL: 'School/College',
  CAMPUSCORNER_NO_ENRTY: 'No Campus Corner entries found.',
  ADD_BTN: 'Add',
  LOADING_GUJ: 'Loading...',
  DATE_GUJ: 'Date:',
  SCHOOL_GUJ: 'School:',
  REASON_GUJ: 'Reason:',
  EDIT_GUJ: 'Edit',
  LOAD_MORE_GUJ: 'Load More',
} as const;

export const JOURNALIST_MESSAGES = {
  JOURNALIST_NEWS: 'Please upload your news',
  I_M_JOURNALIST: 'I am a Journalist',
  JOURNA_LOADING: 'Loading...',
  JOURNALIST_LOADING: 'Journalist Loading...',
  JOURNALIST_LIST_GUJ: 'Journalist List',
  ADD_BTN_GUJ: 'Add',
  LOADING_GUJ: 'Loading...',
  NO_JOURNALIST_GUJ: 'No journalists available.',
  DATE_GUJ: 'Date:',
  REASON_GUJ: 'Reason:',
  EDIT_GUJ: 'Edit',
  LOAD_MORE_GUJ: 'Load More',
  JOURNALIST_STORIES: 'You have viewed all Journalist stories.',
  JOURNALIST_STORIES_DUPLICATE: 'Duplicate content detected.',
  JOURNALIST_SAME_STORIES: 'Loading has been stopped to avoid showing duplicate content.',
  JOURNALIST_MORE_LOADING: 'Loading more content...',
  JOURNALIST_NEXT_STORY: 'Next Story',
} as const;
// ============================================
// WEB STORIES
// ============================================
export const WEB_STORIES = {
  TITLE: 'Web Stories',
  LOADING: 'Loading web stories...',
  LOADING_MORE: 'Loading more web stories...',
} as const;

// ============================================
// VIEW COUNTS
// ============================================
export const VIEW_COUNTS = {
  VIEWS: 'views',
  VIEWS_K: 'K views',
  VIEWS_L: 'L views',
  VIEWS_CR: 'Cr views',
} as const;

// ============================================
// TIME UNITS
// ============================================
export const TIME_UNITS = {
  HOURS_AGO_ALT: 'hours ago',
  DAYS_AGO_ALT: 'days ago',
  MINUTES_AGO_ALT: 'minutes ago',
} as const;

// ============================================
// AUTH & LOGIN MESSAGES
// ============================================
export const AUTH_MESSAGES = {
  // Login/Signup
  SIGNUP: 'Sign Up',
  LOGIN: 'Login',
  SIGNUP_WITH_MOBILE: 'Sign up with mobile number',
  LOGIN_WITH_MOBILE: 'Login with mobile number',
  MOBILE_OTP: 'Mobile OTP',
  M_PIN: 'MPIN',
  
  // OTP Messages
  VERIFY_OTP: 'Verify OTP',
  ENTER_OTP_CODE: 'Enter the 6-digit code sent to your mobile',
  CHANGE_MOBILE_NUMBER: 'Change mobile number',
  RESEND_OTP: 'Resend OTP',
  OTP_SENT_SUCCESS: 'OTP sent successfully!',
  OTP_SEND_FAILED: 'Failed to send OTP. Please try again.',
  
  // Verification
  VERIFY: 'Verify',
  VERIFYING: 'Verifying...',
  MPIN_VERIFIED_SUCCESS: 'MPIN verified successfully!',
  VERIFY_MOBILE_AND_MPIN: 'Please check your mobile number and MPIN.',
  
  // Actions
  CONTINUE: 'Continue',
  SENDING: 'Sending...',
  BACK_TO_WEBSITE: 'Back to website',
  
  // Privacy
  PRIVACY_MESSAGE: 'Your personal information is secure.',
  PRIVACY_DETAIL: 'Your number is collected only for account verification purposes.',
  
  // Errors
  ERROR_OCCURRED: 'An error occurred. Please try again.',
  INVALID_MOBILE: 'Please enter a valid mobile number.',
  
  // Existing messages
  LOGIN_REQUIRED_BOOKMARK:
    'Login is required to bookmark. Do you want to go to the login page?',
  USER_ID_NOT_FOUND:
    'User ID not found. Please login again.',
  BOOKMARK_ERROR:
    'An error occurred while bookmarking!',
  LOGOUT_CONFIRM:
    'Are you sure you want to logout?',
  LOGIN_SESSION_EXPIRED:
    'Login session expired. Please login again.',
} as const;

// ============================================
// BOOKMARK MESSAGES
// ============================================
export const BOOKMARK_MESSAGES = {
  BOOKMARK_ADDED: 'Bookmark added!',
  BOOKMARK_REMOVED: 'Bookmark removed!',
  BOOKMARK_ACTION: 'Bookmark',
  BOOKMARK_LIST: 'Bookmark List',
} as const;

// ============================================
// SHARE & COPY MESSAGES
// ============================================
export const SHARE_MESSAGES = {
  SHARE: 'Share',
  SHARE_TITLE: 'Share',
  COPY: 'Copy',
  COPY_SUCCESS: 'Copied!',
  LINK_COPY_ERROR: 'Error copying link!',
} as const;

// ============================================
// FORM & ACTION BUTTONS
// ============================================
export const FORM_BUTTONS = {
  SUBMIT: 'Submit',
  SUBMITTING: 'Submitting...',
  PROCESSING: 'Processing...',
  CANCEL: 'Cancel',
  CLOSE: 'Close',
  OPEN: 'Open',
  DOWNLOAD: 'Download',
} as const;

// ============================================
// FORM SUCCESS/ERROR MESSAGES
// ============================================
export const FORM_MESSAGES = {
  FORM_SUBMIT_SUCCESS: 'Form submitted successfully!',
  REVIEW_SUBMIT_SUCCESS: 'Your review submitted successfully!',
  SUBMIT_FAILED: 'Submission failed.',
  GANAPATI_SUBMIT_SUCCESS: 'Ganapati submitted successfully!',
  GANAPATI_UPDATE_SUCCESS: 'Ganapati updated successfully!',
  CAREER_FORM_ERROR: 'Career form submission error:',
  ERROR_TRY_AGAIN: 'An error occurred. Please try again.',
} as const;

// ============================================
// APP DOWNLOAD & PROMOTIONAL
// ============================================
export const APP_MESSAGES = {
  DOWNLOAD_APP: 'Download GSTV Application',
  SCAN_QR_TO_DOWNLOAD: 'Scan QR code to download the app',
  DOWNLOAD_APP_GUJ: 'Download GSTV Application',
} as const;

export const PLACEHOLDERS = {
  SEARCH_CITY: 'Search your city',
  SEARCH_CATEGORY: 'Search your category',
  SELECT_CITY: 'Select city',
  SELECT_CATEGORY: 'Select category',
  SELECT_YOUR_CITY: 'Select your city',
  PLEASE_SELECT: 'Please Select',

} as const;

export const SPECIAL_LABELS = {
  LIVE: 'Live',
  READ_TODAY_EPAPER: 'Today’s E-paper',
  READ_TODAY_MAGAZINE: 'Today’s Magazine',
  EPAPER_LOADING: 'E-paper loading...',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  NEXT_STORY:'Next Story',
} as const;

export const DATE_TIME_LABELS = {
  LAST_UPDATE: 'Last Update',
  LAST_UPDATE_COLON: 'Last Update:',
  LAST_UPDATE_GUJ: 'Last Update',
  LAST_UPDATE_COLON_GUJ: 'Last Update :',
  DATE: 'Date',
  TIME: 'Time',
  BIRTH_DATE: 'Birth Date',
  BIRTH_TIME: 'Birth Time',
  BIRTH_PLACE: 'Birth Place',
  READING_TIME: 'Min Read',
  AM: 'AM',
  PM: 'PM',
} as const;

export const FORM_LABELS = {
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  NAME: 'Name',
  PHONE: 'Phone',
  MOBILE_NUMBER: 'Mobile Number',
  EMAIL: 'Email Address',
  CITY: 'City',
  TITLE: 'Title',
  DESCRIPTION: 'Description',
  GENDER: 'Gender',
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
  SET_MPIN: 'Set MPIN',
  MPIN_HINT: '(6 digits required)',
} as const;

export const FORM_PLACEHOLDERS = {
  ENTER_FIRST_NAME: 'Enter your first name',
  ENTER_LAST_NAME: 'Enter your last name',
  ENTER_NAME: 'Enter your name',
  ENTER_MOBILE: 'Enter your mobile number',
  ENTER_EMAIL: 'Enter your email address',
  SELECT_CITY: 'Select your city',
  ENTER_BIRTH_TIME: 'Enter birth time (HH:MM)',
  ENTER_BIRTH_PLACE: 'Enter your birth place',
  ENTER_MPIN: 'Enter your 6-digit MPIN',
  DATE_FORMAT: 'DD-MM-YYYY',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email',
  INVALID_PHONE: 'Invalid phone number',
  LOADING_PROFILE: 'Loading profile...',
  LOADING: 'Loading...',
} as const;

export const UPDATE_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  VOTE_UPDATED: 'Your vote recorded successfully',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
} as const;

export const POLL_MESSAGES = {
  POLL: 'Poll',
  VIEW_RESULTS: 'View Results',
  VOTE_NOW: 'Vote Now',
  TOTAL_VOTES: 'Total Votes',
  YOUR_VOTE: 'Your Vote',
} as const;

export const SEARCH_MESSAGES = {
  NO_RESULTS: 'No results found',
  SEARCH_PLACEHOLDER: 'Search...',
  SEARCHING: 'Searching...',
} as const;

export const PROFILE_MESSAGES = {
  WELCOME: 'Welcome',
  SAVE_PROFILE: 'Save Profile',
  DELETE_ACCOUNT: 'Delete Account',
  DELETE_CONFIRM:
    'Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.',
  ACCOUNT_DELETED:
    'Account deleted successfully! Redirecting to homepage...',
} as const;

export const POLICY_LINKS = {
  CAREER: 'Career',
  CONTACT_US: 'Contact Us',
  COOKIE_POLICY: 'Cookie Policy',
  PRIVACY_POLICY: 'Privacy Policy',
  REFUND_POLICY: 'Refund Policy',
  TERMS_CONDITIONS: 'Terms & Conditions',
  DISCLAIMER_POLICY: 'Disclaimer Policy',
  ABOUT_US: 'About Us',
  DISCLAIMER: 'Disclaimer',
} as const;

export const APP_DOWNLOAD = {
  DOWNLOAD_APP: 'Download GSTV App',
  SCAN_QR: 'Scan QR Code',
  GET_APP: 'Get App',
} as const;

export const RELATED_NEWS = {
  ALSO_READ: 'Also Read:',
  RELATED_NEWS: 'Related News',
  MORE_NEWS: 'More News',
  READ_MORE: 'Read More',
} as const;

export const ACTION_BUTTONS = {
  SHARE: 'Share',
  SAVE: 'Save',
  READ_MORE: 'Read More',
  VIEW_MORE: 'View More',
  PLAY: 'Play',
  PAUSE: 'Pause',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  GO_BACK: 'Go Back',
} as const;

export const MISC_UI = {
  PHOTO: 'Photo',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  GALLERY: 'Gallery',
  COMMENTS: 'Comments',
  LIKES: 'Likes',
  SHARES: 'Shares',
  EDIT_PHOTO: 'Edit Photo',
  DESIGN_DEVELOPED_BY: 'Design and Developed By',
  COPYRIGHT: '© Copyright 2026 | GSTV. All rights reserved.',
 GSTV_SATRANG: 'GSTV Satrang',
RASHIFAL: 'Horoscope',
LIVE_TV_GUJ: 'Live TV',
CATEGORY_LOADING: 'Category loading...',
DOWNLOAD_GSTV_APP: 'Download GSTV Application',
FOLLOWERS: 'For Followers',
ALL_CATEGORIES: 'All Categories',
YESTERDAY_GUJ: 'Yesterday',
JUST_NOW_GUJ: 'Just now',
JUST_NOW_SHORT_GUJ: 'હમણાં જ',
MINUTES_AGO_GUJ: 'minutes ago',
HOURS_AGO_GUJ: 'hours ago',
HOURS_AGO_TEXT_GUJ: 'કલાક પહેલાં',
LINK_COPIED_GUJ: 'Link copied successfully!',
LINK_COPY_ERROR_GUJ: 'Error copying link!',
SHARE_ERROR_GUJ: 'Error while sharing!',
ALSO_READ_GUJ: 'Also Read:',
LOADING_GUJ: 'Loading...',
NEWS_LOADING_GUJ: 'Loading news...',
GSTV_SATRANG_LOADING: 'Loading GSTV Satrang...',
GSTV_SATRANG_LOADING_GUJ: 'GSTV શતરંગ લોડ થઈ રહ્યું છે...',
GSTV_SATRANG_GUJ: 'GSTV શતરંગ',
COPY_GUJ: 'Copy',
COPIED_GUJ: 'Copied!',
SHARE_WITH_GUJ: 'Share',
NEXT_NEWS_LOADING: 'આગળનો સમાચાર લોડ થઈ રહ્યો છે...',
NEXT_VIDEO: 'આગળનો વીડિયો',
NEXT_VIDEO_COMING: 'આગળનો વીડિયો આવી રહ્યો છે...',
GAME_RUNNING: 'રમત ચાલી રહી છે',
TITLE_GUJ: 'શીર્ષક',
TIME_GUJ: 'સમય',
NEWS_LOAD_ERROR: 'ન્યૂઝ લોડ કરવામાં ભૂલ:',
NEWS_LOAD_ERROR_SHORT: 'સમાચાર લોડ કરવામાં ભૂલ આવી',
SEARCH_RESULTS_FAILED: 'શોધ પરિણામો મેળવવામાં નિષ્ફળ',
NO_ACTIVE_POLLS: 'કોઈ સક્રિય પોલ્સ ઉપલબ્ધ નથી.',
VIDEO_BOOKMARKED: 'વીડિયો બુકમાર્ક કરવામાં આવ્યો',
VIDEO_UNBOOKMARKED: 'વીડિયો બુકમાર્કમાંથી દૂર કરવામાં આવ્યો',
FORM_REQUIRED: 'ડ્રો મા ભાગ લેવા આ ફોર્મ ફરજિયાત ભરો.',
PROCESSING: 'પ્રક્રિયા ચાલી રહી છે...',
SUBMIT_BTN: 'સબમિટ કરો',
SUBMISSION_FAILED: 'સબમિશન નિષ્ફળ થયું',
FORM_SUBMITTED_SUCCESS: 'ફોર્મ સફળતાપૂર્વક સબમિટ કર્યું!',
REVIEW_SUBMITTED_SUCCESS: 'તમારો રિવ્યૂ સફળતાપૂર્વક સબમિટ થયો!',
SUBMIT_FAILED_SHORT: 'સબમિટ નિષ્ફળ ગયું.',
} as const;

// ============================================
// SEARCH MESSAGES (GUJARATI)
// ============================================
export const SEARCH_MESSAGES_GUJ = {
  ENTER_SEARCH: 'Please enter a search term',
  MIN_LENGTH: 'Search term must be at least 2 characters long',
  MAX_LENGTH: 'Search term cannot be longer than 100 characters',
  NO_RESULTS: 'No results found',
  TOTAL_RESULTS: 'Total {count} results found',
  VIDEO_CATEGORY: 'Video',
  GUJARAT_CATEGORY: 'Gujarat',
  INDIA_CATEGORY: 'India',
  WORLD_CATEGORY: 'World',
  NEWS_CATEGORY: 'News',
} as const;

// ============================================
// AGREEMENT TEXT (GUJARATI)
// ============================================
export const AGREEMENT_TEXT = {
  GUJRAT_AGREE:
    'I agree that the content uploaded by me is completely true and authentic. If any kind of false information is found, I will be fully responsible for it.',
    
  CAMPUS_AGREE:
    'I agree that the content uploaded by me is not objectionable, obscene, violent, or illegal in any manner. If any such content is found, I will be fully responsible for it.',
} as const;
// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get time ago message with value
 * @param value - Numeric value
 * @param unit - Time unit key from TIME_AGO
 */
export const getTimeAgoMessage = (value: number, unit: keyof typeof TIME_AGO): string => {
  if (unit === 'JUST_NOW') return TIME_AGO.JUST_NOW;
  return `${value} ${TIME_AGO[unit]}`;
};

/**
 * Get error message with details
 * @param errorType - Error type key from ERROR_MESSAGES
 * @param details - Optional error details
 */
export const getErrorMessage = (
  errorType: keyof typeof ERROR_MESSAGES,
  details?: string
): string => {
  const baseMessage = ERROR_MESSAGES[errorType];
  return details ? `${baseMessage}: ${details}` : baseMessage;
};

/**
 * Format view count in Gujarati
 * @param num - Number of views
 * @returns Formatted view count string
 */
export const formatViews = (num: number): string => {
  if (num < 1000) {
    return `${num} ${VIEW_COUNTS.VIEWS}`;
  } else if (num < 100000) {
    return `${(num / 1000).toFixed(1)}${VIEW_COUNTS.VIEWS_K}`;
  } else if (num < 10000000) {
    return `${(num / 100000).toFixed(1)}${VIEW_COUNTS.VIEWS_L}`;
  } else {
    return `${(num / 10000000).toFixed(1)}${VIEW_COUNTS.VIEWS_CR}`;
  }
};

// ============================================
// TYPE EXPORTS
// ============================================
export type LoadingMessageKey = keyof typeof LOADING_MESSAGES;
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
export type ButtonTextKey = keyof typeof BUTTON_TEXT;
export type NavigationKey = keyof typeof NAVIGATION;
export type CategoryKey = keyof typeof CATEGORIES;
export type TimeAgoKey = keyof typeof TIME_AGO;
export type GeneralMessageKey = keyof typeof GENERAL_MESSAGES;
export type WebStoryKey = keyof typeof WEB_STORIES;
export type ViewCountKey = keyof typeof VIEW_COUNTS;
export type TimeUnitKey = keyof typeof TIME_UNITS;
export type AuthMessageKey = keyof typeof AUTH_MESSAGES;
export type BookmarkMessageKey = keyof typeof BOOKMARK_MESSAGES;
export type ShareMessageKey = keyof typeof SHARE_MESSAGES;
export type FormButtonKey = keyof typeof FORM_BUTTONS;
export type FormMessageKey = keyof typeof FORM_MESSAGES;
export type AppMessageKey = keyof typeof APP_MESSAGES;
export type PlaceholderKey = keyof typeof PLACEHOLDERS;
export type SpecialLabelKey = keyof typeof SPECIAL_LABELS;
export type DateTimeLabelKey = keyof typeof DATE_TIME_LABELS;
export type FormLabelKey = keyof typeof FORM_LABELS;
export type FormPlaceholderKey = keyof typeof FORM_PLACEHOLDERS;
export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
export type UpdateMessageKey = keyof typeof UPDATE_MESSAGES;
export type PollMessageKey = keyof typeof POLL_MESSAGES;
export type SearchMessageKey = keyof typeof SEARCH_MESSAGES;
export type ProfileMessageKey = keyof typeof PROFILE_MESSAGES;
export type PolicyLinkKey = keyof typeof POLICY_LINKS;
export type AppDownloadKey = keyof typeof APP_DOWNLOAD;
export type RelatedNewsKey = keyof typeof RELATED_NEWS;
export type ActionButtonKey = keyof typeof ACTION_BUTTONS;
export type MiscUIKey = keyof typeof MISC_UI;

export type SearchMessageGujKey = keyof typeof SEARCH_MESSAGES_GUJ;
export type AgreementTextKey = keyof typeof AGREEMENT_TEXT;

// ============================================
// LOCK SCREEN MESSAGES (GUJARATI)
// ============================================
export const LOCK_SCREEN = {
  READ_FULL_NEWS: 'Not partial! Read the full news on the GSTV App',
  READ_ON_WEBSITE: 'Read on website',
  PREMIUM_MEMBERSHIP: 'If you have a Premium Membership,',
  LOGIN_NOW: 'Login Now',
  VIEW_PLANS: 'View Plans',
  SCAN_QR_DOWNLOAD: 'Scan QR to download the app',
} as const;

export type LockScreenKey = keyof typeof LOCK_SCREEN;

// ============================================
// CAMPUS CORNER FORM
// ============================================
export const CAMPUS_CORNER_FORM = {
  // Page Title
  ADD_TITLE: 'Add',
  EDIT_TITLE: 'Edit',
  
  // Form Labels
  NAME_LABEL: 'Name',
  TITLE_LABEL: 'News Title',
  SCHOOL_LABEL: 'School',
  CITY_LABEL: 'City',
  DESCRIPTION_LABEL: 'Description',
  IMAGES_LABEL: 'Images (Minimum 1, Maximum 5 images allowed)',
  VIDEO_LABEL: 'Video (Optional, only mp4/mov, ≤ 100MB)',
  EXISTING_IMAGES: 'Existing Images:',
  EXISTING_VIDEO: 'Existing Video:',
  
  // Placeholders
  NAME_PLACEHOLDER: 'Enter your name',
  TITLE_PLACEHOLDER: 'Enter your title',
  SCHOOL_PLACEHOLDER: 'Enter your school name',
  CITY_PLACEHOLDER: 'Enter your city',
  DESCRIPTION_PLACEHOLDER: 'Enter description',
  
  // Validation Messages
  ENTER_NAME: 'Please enter your name.',
  ENTER_TITLE: 'Please enter the title.',
  ENTER_SCHOOL: 'Please enter your school name.',
  ENTER_CITY: 'Please enter your city.',
  ENTER_DESCRIPTION: 'Please enter the description.',
  AGREE_TERMS: 'Please agree to the terms and conditions.',
  UPLOAD_MEDIA: 'Please upload at least one image or video.',
  UPLOAD_NEW_MEDIA: 'Please upload at least one image or video for new submission.',
  
  // File Upload Messages
  MAX_IMAGES: 'You can upload a maximum of 5 images.',
  VIDEO_FORMAT_ERROR: 'Only MP4 or MOV formats are allowed.',
  VIDEO_SIZE_ERROR: 'Video size must not exceed 100MB.',
  
  // Success Messages
  ADDED_SUCCESS: 'Campus Corner added successfully!',
  UPDATED_SUCCESS: 'Campus Corner updated successfully!',
  
  // Error Messages
  LOAD_FAILED: 'Failed to load Campus Corner data.',
  LOGIN_REQUIRED: 'You must be logged in to submit a Campus Corner entry. Please login and try again.',
  
  // Button Text
  UPLOAD_BUTTON: 'Upload',
  UPLOADING: 'Uploading...',
  PLEASE_WAIT: 'Please wait...',
} as const;

// ============================================
// ERROR PAGE
// ============================================
export const ERROR_PAGE = {
  SOMETHING_WRONG: 'Something went wrong!',
  PAGE_LOAD_ERROR: 'There was a problem loading the page. Please try again.',
  TRY_AGAIN: 'Try Again',
} as const;

// ============================================
// EPAPER PAGE
// ============================================
export const EPAPER_PAGE = {
  LOADING_EPAPER: 'Loading E-paper...',
  NOT_AVAILABLE: 'E-paper is not available for this date',
  GO_BACK: 'Go Back',
  ZOOM: 'Zoom:',
  RESET: 'Reset',
} as const;

export type CampusCornerFormKey = keyof typeof CAMPUS_CORNER_FORM;
export type ErrorPageKey = keyof typeof ERROR_PAGE;
export type EpaperPageKey = keyof typeof EPAPER_PAGE;

// ============================================
// JOURNALIST FORM
// ============================================
export const JOURNALIST_FORM = {
  // Page Title
  ADD_TITLE: 'Add',
  EDIT_TITLE: 'Edit',
  EDITING_ID: 'Editing ID:',
  
  // Form Labels
  NAME_LABEL: 'Name',
  TITLE_LABEL: 'News Title',
  CITY_LABEL: 'City',
  IMAGE_LABEL: 'Image',
  DESCRIPTION_LABEL: 'Description',
  IMAGES_LABEL: 'Images (Minimum 1, Maximum 5 images allowed)',
  VIDEO_LABEL: 'Video (Optional)',
  
  // Placeholders
  NAME_PLACEHOLDER: 'Enter your name',
  TITLE_PLACEHOLDER: 'Enter your title',
  CITY_PLACEHOLDER: 'Enter your city',
  DESCRIPTION_PLACEHOLDER: 'Enter description',
  
  // Validation Messages
  ENTER_NAME: 'Enter your name.',
  ENTER_CITY: 'Please enter your city.',
  ENTER_TITLE: 'Please enter the title.',
  DESCRIPTION_REQUIRED: 'Description is required.',
  UPLOAD_MEDIA: 'Please upload at least 1 image or 1 video.',
  AGREE_REQUIRED: 'You must agree before submitting.',
  TITLE_LENGTH_ERROR: 'Title must be between 1-14 words.',
  
  // Success Messages
  ADDED_SUCCESS: 'Journalist added successfully!',
  UPDATED_SUCCESS: 'Journalist updated successfully!',
  
  // Error Messages
  LOGIN_REQUIRED: 'You must be logged in to submit a journalist entry. Please login and try again.',
  ERROR_OCCURRED: 'An error occurred. Please try again..',
  
  // Button Text
  UPLOADING: 'Uploading...',
  UPLOAD: 'Upload',
  
  // Loading Messages
  LOADING: 'Loading...',
  
  // Existing Media Labels
  EXISTING_IMAGES: 'Existing Images:',
  EXISTING_VIDEO: 'Existing Video:',
  
  // API Error Messages
  SUBMIT_FAILED: 'Failed to {action} journalist. Please try again.',
} as const;

// ============================================
// GANAPATI FORM
// ============================================
export const GANAPATI_FORM = {
  // Loading Messages
  LOADING_DATA: 'Data is loading...',
  LOADING: 'Loading...',
  PLEASE_WAIT: 'Please wait',
  
  // Form Labels
  NAME_LABEL: 'Name',
  ADDRESS_LABEL: 'City',
  
  // Placeholders
  NAME_PLACEHOLDER: 'Enter your name',
  ADDRESS_PLACEHOLDER: 'Enter your city',
  
  // Success Messages
  ADDED_SUCCESS: 'Ganapati submitted successfully!',
  UPDATED_SUCCESS: 'Ganapati updated successfully!',
} as const;

// ============================================
// EKASANA FORM
// ============================================
export const EKASANA_FORM = {
  // Form Labels
  NAME_LABEL: 'Name',
  DAYS_LABEL: 'Days',
  MOBILE_LABEL: 'Mobile',
  ADDRESS_LABEL: 'Address',
  
  // Placeholders
  NAME_PLACEHOLDER: 'Enter your name',
  DAYS_PLACEHOLDER: 'Enter your days',
  MOBILE_PLACEHOLDER: 'Enter your mobile',
  ADDRESS_PLACEHOLDER: 'Enter your address',
  
  // Validation Messages
  IMAGE_SIZE_ERROR: 'Image size must be less than 5MB.',
  
  // Success Messages
  ADDED_SUCCESS: 'Your Ekasana has been submitted successfully!',
  UPDATED_SUCCESS: 'Your Ekasana has been updated successfully!',
  
  // Error Messages
  LOGIN_REQUIRED_EDIT: 'You must be logged in to edit Ekasana. Please login.',
  LOGIN_REQUIRED_SUBMIT: 'You must be logged in to submit Ekasana. Please login and try again.',
} as const;

// ============================================
// REVIEW FORM
// ============================================
export const REVIEW_FORM = {
  // Validation Messages
  ENTER_FULLNAME: 'Please enter your full name.',
  ENTER_PHONE: 'Please enter your phone number.',
  VALID_MOBILE: 'Enter a valid mobile number.',
  ENTER_CITY: 'Please enter city.',
  SELECT_MAGAZINE: 'Please select magazine.',
  SELECT_RATING: 'Please select rating.',
  ENTER_MESSAGE: 'Please enter message.',
  MESSAGE_MIN_LENGTH: 'Message must be at least 10 characters long.',
  
  // Success Messages
  SUBMIT_SUCCESS: 'Your review has been submitted successfully!',
  
  // Error Messages
  SUBMIT_FAILED: 'Submission failed.',
  ERROR_TRY_AGAIN: 'An error occurred. Please try again.',
  
  // Button Text
  SUBMITTING: 'Submitting...',
  SUBMIT: 'Submit',
} as const;

// ============================================
// VIDEO PLAYER
// ============================================
export const VIDEO_PLAYER = {
  // Bookmark Messages
  VIDEO_BOOKMARKED: 'Video bookmarked',
  VIDEO_UNBOOKMARKED: 'Video removed from bookmarks',
  
  // Navigation
  GO_BACK: 'Go back',
  PREVIOUS_VIDEO: 'Previous video',
  
  // Alerts
  ALL_VIDEOS_WATCHED: 'You have watched all videos!',
} as const;

// ============================================
// USER POINTS PAGE
// ============================================
export const USER_POINTS = {
  TOTAL_DURATION: 'Total Duration',
  LOADING: 'Loading...',
  SEARCH: 'Search',
  LOADING_TEXT: 'Loading...',
  USER_POINTS_LOADING: 'User points are loading...',
  FIRST_DATE: 'First Date:',
  LAST_DATE: 'Last Date:',
  TOTAL_TIME: 'Total Time:',
  FROM: 'From',
  TO: 'To',
  NO_DATA_FOUND: 'No data found for the current week.',
} as const;

// ============================================
// POLL MESSAGES
// ============================================
export const POLL_MESSAGES_GUJ = {
  VOTE_UPDATED: 'Your vote has been updated.',
  VOTE_RECORDED: 'Your vote has been recorded!',
  VOTE_ERROR: 'Error in voting!',
} as const;

// ============================================
// WEB STORY DETAIL
// ============================================
export const WEB_STORY_DETAIL = {
  LOADING: 'Web story is loading...',
} as const;

// ============================================
// SEARCH PAGE
// ============================================
export const SEARCH_PAGE = {
  TITLE: 'Search - GSTV',
  DESCRIPTION: 'Search for news, videos, and more on GSTV',
  SEARCH_PLACEHOLDER: 'Search for news, videos, and more...',
  TOTAL_RESULTS: 'Total {count} results found',
  NO_RESULTS_TITLE: 'No results found',
  NO_RESULTS_MESSAGE: 'Please try again with different keywords.',
  LOADING_MORE_RESULTS: 'Loading more results...',
  ALL_RESULTS_VIEWED: 'You have viewed all results.',
  SEARCH_FAILED: 'Failed to retrieve search results.',
} as const;

// ============================================
// RASHIFAL PAGE
// ============================================
export const RASHIFAL_PAGE = {
  META_DESCRIPTION: 'Read about your daily horoscope, fortune, love, career, health and life. Know what is written for your zodiac sign today.',
  META_KEYWORDS: 'Horoscope',
  OG_ALT: 'Horoscope - Daily Rashifal',
} as const;

// ============================================
// CAREER FORM
// ============================================
export const CAREER_FORM = {
  FULLNAME_PLACEHOLDER: 'Enter your full name',
  EMAIL_PLACEHOLDER: 'Enter your email',
  MESSAGE_PLACEHOLDER: 'Write briefly about yourself.',
  
  // Form Labels
  TITLE: 'Career At GSTV',
  FULLNAME_LABEL: 'Full Name',
  EMAIL_LABEL: 'Email',
  PHONE_LABEL: 'Phone Number',
  POST_LABEL: 'Which post are you applying for?',
  EXPERIENCE_LABEL: 'Years of Experience',
  EXPERIENCE_PLACEHOLDER: 'Enter years of experience',
  MESSAGE_LABEL: 'Write briefly about yourself.',
  CV_LABEL: 'Attach CV / Resume',
} as const;

// ============================================
// ATHAITAP PAGE
// ============================================
export const ATHAITAP_PAGE = {
  STATUS_PUBLISHED: 'Published',
  STATUS_DRAFT: 'Draft',
} as const;

// ============================================
// LOGIN PAGE (Additional)
// ============================================
export const LOGIN_PAGE_ADDITIONAL = {
  MOBILE_PLACEHOLDER: 'Enter your mobile number',
} as const;

export type JournalistFormKey = keyof typeof JOURNALIST_FORM;
export type GanapatiFormKey = keyof typeof GANAPATI_FORM;
export type EkasanaFormKey = keyof typeof EKASANA_FORM;
export type ReviewFormKey = keyof typeof REVIEW_FORM;
export type VideoPlayerKey = keyof typeof VIDEO_PLAYER;
export type UserPointsKey = keyof typeof USER_POINTS;
export type PollMessagesGujKey = keyof typeof POLL_MESSAGES_GUJ;
export type WebStoryDetailKey = keyof typeof WEB_STORY_DETAIL;
export type SearchPageKey = keyof typeof SEARCH_PAGE;
export type RashifalPageKey = keyof typeof RASHIFAL_PAGE;
export type CareerFormKey = keyof typeof CAREER_FORM;
export type AthaitapPageKey = keyof typeof ATHAITAP_PAGE;
export type LoginPageAdditionalKey = keyof typeof LOGIN_PAGE_ADDITIONAL;

// ============================================
// PAYMENT & SUBSCRIPTION
// ============================================
export const PAYMENT_PAGE = {
  SELECT_PLAN: 'Select Plan',
  GET_PREMIUM_PLAN: 'Get Premium Plan',
  IN: 'in',
  YEARLY: 'Yearly',
  MONTHLY: 'Monthly',
  RENEW_UPGRADE: 'Renew / Upgrade Plan',
} as const;

// ============================================
// MAGAZINE PAGE
// ============================================
export const MAGAZINE_PAGE = {
  LOADING_ERROR: 'Error loading magazine. Please try again.',
  LOADING_MESSAGE: 'Loading magazine...',
  LOADING_ERROR_GUJ: 'મેગેઝિન લોડ કરવામાં તકલીફ આવી. ફરી પ્રયાસ કરો.',
  LOADING_MESSAGE_GUJ: 'મેગેઝિન લોડ કરી રહ્યા છીએ...',
  NO_MAGAZINE_FOUND: 'કોઈ મેગેઝિન મળ્યાં નથી.',
  ALL_MAGAZINES_LOADED: 'બધાં મેગેઝિન લોડ થઈ ગયા છે',
  NOT_AVAILABLE_FOR_DATE: 'આ તારીખ માટે મેગેઝિન ઉપલબ્ધ નથી',
  MAGAZINE_REVIEW: 'મેગેઝિન રિવ્યૂ',
  SELECT_MAGAZINE: 'મેગેઝિન પસંદ કરો',
  PLEASE_SELECT_MAGAZINE: 'કૃપા કરીને મેગેઝિન પસંદ કરો.',
  LOADING_MAGAZINE_ERROR: 'મેગેઝિન લોડ કરવામાં ભૂલ:',
} as const;

// ============================================
// NEWS DETAIL PAGE
// ============================================
export const NEWS_DETAIL_PAGE = {
  LOADING_NEWS: 'Loading news...',
  GO_BACK: 'Go back',
  READ_MORE: 'Read more',
} as const;

// ============================================
// PODCAST PAGE
// ============================================
export const PODCAST_PAGE = {
  LOADING: 'Loading...',
  LOAD_MORE: 'Load more',
} as const;

// ============================================
// LIST PAGES (GET PAGES)
// ============================================
export const LIST_PAGES = {
  LOADING_ALT: 'Loading...',
  LOADING_IMAGE_ALT: 'Loading...',
} as const;

// ============================================
// CAREER FORM (Additional)
// ============================================
export const CAREER_FORM_VALIDATION = {
  ENTER_FULLNAME: 'Please enter your full name.',
  ENTER_EMAIL: 'Please enter your email.',
  ENTER_PHONE: 'Please enter your phone number.',
  SELECT_POST: 'Please select the position you are applying for.',
  ENTER_EXPERIENCE: 'Please enter your years of experience.',
  VALID_EXPERIENCE: 'Please enter a valid number for experience.',
  ENTER_MESSAGE: 'Please enter a brief message about yourself.',
  MESSAGE_MIN_LENGTH: 'Message must be at least 10 characters long.',
  MESSAGE_MAX_LENGTH: 'Message cannot exceed 500 characters.',
  UPLOAD_CV: 'Please upload your CV or resume.',
  CV_FORMAT_ERROR: 'Only PDF, DOC, or DOCX files are allowed.',
  CV_SIZE_ERROR: 'File size must not exceed 5 MB.',
  PHONE_PLACEHOLDER: 'Enter phone number',
  SELECT_POST_PLACEHOLDER: 'Select post',
  LOADING_POSTS: 'Loading...',
  SUBMIT_ERROR: 'Submission failed. Please try again.',
  ERROR_OCCURRED: 'An error occurred. Please try again.',
  SUBMITTING: 'Submitting...',
  SUBMIT: 'Submit',
  LOADING_IMAGE_ALT: 'Loading...',
  CAREER_FORM_ERROR: 'Career form submission error:',
} as const;

// ============================================
// BOOKMARK LIST
// ============================================
export const BOOKMARK_LIST = {
  TITLE: 'Bookmark List',
  LOADING: 'Loading...',
  NO_BOOKMARKS: 'No bookmarks available.',
  CATEGORY: 'Category:',
  VIDEO_CATEGORY: 'Video',
  NEWS_CATEGORY: 'News',
  DATE: 'Date:',
  DELETE: 'Delete',
  LOAD_MORE: 'Load more',
} as const;

export type PaymentPageKey = keyof typeof PAYMENT_PAGE;
export type MagazinePageKey = keyof typeof MAGAZINE_PAGE;
export type NewsDetailPageKey = keyof typeof NEWS_DETAIL_PAGE;
export type PodcastPageKey = keyof typeof PODCAST_PAGE;
export type ListPagesKey = keyof typeof LIST_PAGES;
export type CareerFormValidationKey = keyof typeof CAREER_FORM_VALIDATION;
export type BookmarkListKey = keyof typeof BOOKMARK_LIST;

// ============================================
// GSTV PODCAST PAGE
// ============================================
export const GSTV_PODCAST_PAGE = {
  TITLE: 'GSTV Podcast',
  LOADING: 'Loading podcast...',
  LOADING_MORE: 'Loading...',
  LOAD_MORE: 'Load more',
} as const;

// ============================================
// GET PAGES (List Pages - Additional)
// ============================================
export const GET_PAGES = {
  LOADING_IMAGE: 'Loading...',
  NO_DATA: 'No data available',
} as const;

export type GstvPodcastPageKey = keyof typeof GSTV_PODCAST_PAGE;
export type GetPagesKey = keyof typeof GET_PAGES;
