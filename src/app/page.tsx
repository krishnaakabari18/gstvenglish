'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import SEOHead from '@/components/SEOHead';
import DynamicSEO from '@/components/DynamicSEO';
import { generateHomeSEO } from '@/utils/seoUtils';
import { useSiteSetting } from '@/hooks/useSiteSetting';
import { useStockmarketSiteSetting } from '@/hooks/useStockmarketSiteSetting';

// 🔥 Critical – load immediately
import BreakingNews from '@/components/BreakingNews';
import TopNews from '@/components/TopNews';

// shared loader (micro-optimization)
const nullLoader = () => null;

// 🟡 Deferred – lazy load (FAST & SAFE)
const ElectionResults = dynamic(
  () => import('@/components/ElectionResults'),
  { ssr: false }
);

const TopVideos = dynamic(
  () => import('@/components/TopVideos'),
  { loading: nullLoader }
);

const LiveNews = dynamic(
  () => import('@/components/LiveNews'),
  { loading: nullLoader }
);

const WebStories = dynamic(
  () => import('@/components/WebStories'),
  { loading: nullLoader }
);

const GSTVSatrang = dynamic(
  () => import('@/components/GSTVSatrang'),
  { ssr: false }
);


const GSTVMagazine = dynamic(
  () => import('@/components/GSTVMagazine'),
  { ssr: false }
);

const TopHomeCategory = dynamic(
  () => import('@/components/TopHomeCategory'),
  { ssr: false }
);
const LiveMatchScore = dynamic(() => import('@/components/LiveMatchScore'), { ssr: false });
const StockMarket = dynamic(() => import('@/components/StockMarket'), { ssr: false });

export default function Home() {
  // ✅ memoized SEO (no recalculation)
  const seoData = useMemo(() => generateHomeSEO(), []);
 
  const { liveScoreEnabled } = useSiteSetting();
  const { StockMarketEnabled, LiveNewsHomeEnabled } =  useStockmarketSiteSetting();

  return (
    <>
      {/* Static SEO Meta Tags */}
      <SEOHead seoData={seoData} pageType="website" />

      {/* Dynamic SEO Meta Tags from API */}
      <DynamicSEO />

      {/* 🔥 1. Breaking News */}
      <BreakingNews />

      {/* 🟡 2. Election Results */}
      <ElectionResults />
      <div className='for-sm'>
        {StockMarketEnabled && <StockMarket />}
      </div>
      {/* 🟡 3. Top Videos */}
      <TopVideos />
       {/* {LiveNewsHomeEnabled && (
         <div style={{ float: 'left', width: '100%' }} className="mt-4"
          dangerouslySetInnerHTML={{ __html: LiveNewsHomeEnabled }}
        />  
      )} */}
      {LiveNewsHomeEnabled && (
        <div className="mt-4" style={{ width: '100%',float: 'left' }}>
          <iframe
            width="100%"
            height="450"
            src={`${LiveNewsHomeEnabled}?autoplay=1&mute=1`}
            title="Live News"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      )}
      {/* 🟡 4. Live News */}
      <LiveNews />

      {/* 🔥 5. Top News */}
      <TopNews />
      <div className='for-sm'>
      {liveScoreEnabled && <LiveMatchScore />}
      </div>
      {/* 🟡 6. Web Stories */}
      <WebStories />
      {/* 🟡 7. GSTV Satrang */}
      {/* <GSTVSatrang /> */}
 

      {/* 🟡 8. GSTV Magazine */}
      <GSTVMagazine />

      {/* 🟡 9. Top Home Category */}
      <TopHomeCategory />
    </>
  );
}
