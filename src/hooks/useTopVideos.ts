'use client';

import { useState, useEffect } from 'react';
import { fetchTopVideos, NewsItem } from '@/services/newsApi';

interface UseTopVideosReturn {
  videos: NewsItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTopVideos = (): UseTopVideosReturn => {
  const [videos, setVideos] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTopVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchTopVideos();
      console.log(data);
      
      const videoData = data.data?.data || [];
      setVideos(videoData);
      
      console.log(`Top videos loaded: ${videoData.length} items`);
      
    } catch (err) {
      console.error('Error loading top videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopVideos();
  }, []);

  const refetch = () => {
    loadTopVideos();
  };

  return {
    videos,
    loading,
    error,
    refetch
  };
};
