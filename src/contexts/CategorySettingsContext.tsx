'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  saveToCache,
  loadFromCache,
  clearCache,
  CACHE_KEYS,
  CACHE_TTL,
  invalidateCategorySettingsCache
} from '@/utils/cacheUtils';
import { API_ENDPOINTS } from '@/constants/api';

// Category Settings Item Interface
export interface CategorySettingsItem {
  id: number;
  userID: number;
  parentID: number;
  title: string;
  category_name: string;
  category_name_guj: string;
  slug: string;
  featureImage: string;
  icon: string;
  description: string;
  metatitle: string;
  metakeyword: string;
  metadesc: string;
  catOrder: number;
  eventCat: number;
  setHome: number;
  status: string;
  created_at: string;
  updated_at: string;
  parent_category_name: string | null;
  subcategories?: CategorySettingsItem[];
}

// Context Value Interface
interface CategorySettingsContextValue {
  categories: CategorySettingsItem[];
  loading: boolean;
  error: string | null;
  isCached: boolean;
  refetch: () => void;
  clearCacheData: () => void;
  invalidateCache: () => Promise<boolean>;
}

// Create Context
const CategorySettingsContext = createContext<CategorySettingsContextValue | undefined>(undefined);

// Build Category Hierarchy Function
const buildCategoryHierarchy = (categories: CategorySettingsItem[]): CategorySettingsItem[] => {
  console.log('🔥 buildCategoryHierarchy: Building hierarchy from', categories.length, 'categories');

  // Separate parent and child categories
  const parentCategories = categories.filter(cat => cat.parentID === 0);
  const childCategories = categories.filter(cat => cat.parentID !== 0);

  console.log('🔥 buildCategoryHierarchy: Parent categories:', parentCategories.length);
  console.log('🔥 buildCategoryHierarchy: Child categories:', childCategories.length);

  // Build hierarchy
  const hierarchicalCategories = parentCategories.map(parent => {
    const subcategories = childCategories.filter(child => child.parentID === parent.id);
    return {
      ...parent,
      subcategories: subcategories.length > 0 ? subcategories : undefined
    };
  });

  // Sort by catOrder
  const sortedCategories = hierarchicalCategories.sort((a, b) => a.catOrder - b.catOrder);

  // Add static menu items
  

  const finalCategories = [...sortedCategories];
  console.log('🔥 buildCategoryHierarchy: Final hierarchy built with', finalCategories.length, 'total categories');

  return finalCategories;
};

// Provider Props
interface CategorySettingsProviderProps {
  children: ReactNode;
}

// Provider Component
export const CategorySettingsProvider: React.FC<CategorySettingsProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategorySettingsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);

  // Load Category Settings Function
  const loadCategorySettings = useCallback(async (forceRefresh = false) => {
    if (isApiCallInProgress) {
      console.log('🔥 CategorySettingsProvider: API call already in progress, skipping...');
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = loadFromCache<CategorySettingsItem[]>(CACHE_KEYS.CATEGORY_SETTINGS);
      if (cachedData && cachedData.length > 0) {
        console.log('🔥 CategorySettingsProvider: Using cached data, skipping API call');
        setCategories(cachedData);
        setLoading(false);
        setError(null);
        setIsCached(true);
        return;
      }
    }

    try {
      console.log('🔥 CategorySettingsProvider: Starting API call...');
      setIsApiCallInProgress(true);
      setLoading(true);
      setError(null);
      setIsCached(false);

      const apiUrl = API_ENDPOINTS.CATEGORY_SETTING;
      console.log('🔥 CategorySettingsProvider: Fetching from URL:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Cache-Control': 'max-age=3600'
        }
      });

      console.log('🔥 CategorySettingsProvider: API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔥 CategorySettingsProvider: API response data received');

      // Extract categories from the response
      const allCategories = data.category || [];
      console.log('🔥 CategorySettingsProvider: All categories count:', allCategories.length);

      // Build hierarchical structure
      const hierarchicalCategories = buildCategoryHierarchy(allCategories);
      console.log('🔥 CategorySettingsProvider: Hierarchical categories built:', hierarchicalCategories.length);

      // Save to cache
      saveToCache(CACHE_KEYS.CATEGORY_SETTINGS, hierarchicalCategories, CACHE_TTL.CATEGORY_SETTINGS);

      // Update state
      setCategories(hierarchicalCategories);
      setLoading(false);
      setError(null);
      setIsCached(false);

      console.log('🔥 CategorySettingsProvider: Categories set successfully! Count:', hierarchicalCategories.length);

    } catch (err) {
      console.error('🔥 CategorySettingsProvider: Error loading categories:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load categories';
      setError(errorMsg);
      setLoading(false);
      setIsCached(false);
    } finally {
      setIsApiCallInProgress(false);
    }
  }, [isApiCallInProgress]);

  // Load on mount
  useEffect(() => {
    console.log('🔥 CategorySettingsProvider: Component mounted, loading categories...');
    loadCategorySettings();
  }, [loadCategorySettings]);

  // Refetch function
  const refetch = useCallback(() => {
    console.log('🔥 CategorySettingsProvider: Refetch called - forcing fresh data');
    clearCache(CACHE_KEYS.CATEGORY_SETTINGS);
    setCategories([]);
    loadCategorySettings(true);
  }, [loadCategorySettings]);

  // Clear cache function
  const clearCacheData = useCallback(() => {
    console.log('🔥 CategorySettingsProvider: Clear cache called');
    clearCache(CACHE_KEYS.CATEGORY_SETTINGS);
    setCategories([]);
    setLoading(true);
    setError(null);
    setIsCached(false);
  }, []);

  // Invalidate cache function
  const invalidateCache = useCallback(async (): Promise<boolean> => {
    console.log('🔥 CategorySettingsProvider: Invalidate cache called');
    try {
      const success = await invalidateCategorySettingsCache();
      if (success) {
        clearCacheData();
        loadCategorySettings(true);
      }
      return success;
    } catch (error) {
      console.error('🔥 CategorySettingsProvider: Error invalidating cache:', error);
      return false;
    }
  }, [clearCacheData, loadCategorySettings]);

  const value: CategorySettingsContextValue = {
    categories,
    loading,
    error,
    isCached,
    refetch,
    clearCacheData,
    invalidateCache
  };

  return (
    <CategorySettingsContext.Provider value={value}>
      {children}
    </CategorySettingsContext.Provider>
  );
};

// Custom Hook to use the context
export const useCategorySettingsContext = (): CategorySettingsContextValue => {
  const context = useContext(CategorySettingsContext);
  if (context === undefined) {
    throw new Error('useCategorySettingsContext must be used within a CategorySettingsProvider');
  }
  return context;
};

