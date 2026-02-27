import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/constants/api';

export const useStockmarketSiteSetting = () => {
  const [StockMarketEnabled, setStockMarketEnabled] = useState(false);
  const [PodcastEnabled, setPodcastEnabled] = useState(false);
  const [RashiEnabled, setRashiEnabled] = useState(false);
  const [LiveNewsHomeEnabled, setLiveNewsHomeEnabled] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CATEGORY_SETTING, {
          cache: 'no-store',
        });

        const json = await res.json();
        console.log('Stockmarket setting json:', json);
        if (json?.setting?.length > 0) {
          setStockMarketEnabled(json.setting[0].stockmarket == 1);
          setPodcastEnabled(json.setting[0].podcast_status == 1);
          setRashiEnabled(json.setting[0].rashi_status == 1);
          // setLiveNewsHomeEnabled(json.setting[0].livetvnews !== '' || json.setting[0].livetvnews !== null);
          setLiveNewsHomeEnabled(json.setting[0].livetvnews);
        }
      } catch (error) {
        console.error('Setting API error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  return { StockMarketEnabled, PodcastEnabled, RashiEnabled,LiveNewsHomeEnabled, loading };
};
