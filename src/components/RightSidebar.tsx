'use client';

import { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { UPLOAD_PATHS } from '@/constants/api';
import { useSiteSetting } from '@/hooks/useSiteSetting';
import { useStockmarketSiteSetting } from '@/hooks/useStockmarketSiteSetting';
// import StockMarket from '@/components/StockMarket';


/* -------------------------------------------------------
   Lazy loaded sidebar components (KEEP AS IS)
-------------------------------------------------------- */
const PollSection = dynamic(() => import('./PollSection'), { ssr: false });
const EpaperRightSidebar = dynamic(() => import('./EpaperRightSidebar'), { ssr: false });
const GstvMagazineBox = dynamic(() => import('./GstvMagazineBox'), { ssr: false });
const GSTVSatrangBox = dynamic(() => import('./GSTVSatrangBox'), { ssr: false });
const GstvFastTrack = dynamic(() => import('./GstvFastTrack'), { ssr: false });
const LiveTvSection = dynamic(() => import('./LiveTvSection'), { ssr: false });
const WebStoriesSidebar = dynamic(() => import('./WebStoriesSidebar'), { ssr: false });
const LiveMatchScore = dynamic(() => import('./LiveMatchScore'), { ssr: false });
const StockMarket = dynamic(() => import('./StockMarket'), { ssr: false });

const RightSidebar = () => {
  const pathname = usePathname();

  const isVideoPage = pathname === '/category/videos';
  const isPollPage = pathname === '/poll';
  const { liveScoreEnabled } = useSiteSetting();
  const { StockMarketEnabled } = useStockmarketSiteSetting();
  
  /* -------------------------------------------------------
     Delay heavy sidebar sections (SESSION CACHED)
  -------------------------------------------------------- */
  const [showHeavySections, setShowHeavySections] = useState(false);

  useEffect(() => {
    // If already loaded once → don't delay again
    const cached = sessionStorage.getItem('gstv_sidebar_loaded');

    if (cached === '1') {
      setShowHeavySections(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowHeavySections(true);
      sessionStorage.setItem('gstv_sidebar_loaded', '1');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ----------------- FAST / IMPORTANT SECTIONS ----------------- */}
      <div className='for-lg'>
        {StockMarketEnabled && <StockMarket />}
      </div>
      
      {!isPollPage && <PollSection />}
      {/* ✅ LIVE MATCH SCORE CONDITION */}
      <div className='for-lg'>
        {liveScoreEnabled && <LiveMatchScore />}
      </div>
      <EpaperRightSidebar />

      {/* ----------------- HEAVY SECTIONS (DELAYED ONCE) ----------------- */}
      {showHeavySections && (
        <>
          <GstvFastTrack className="mb-4" />
          <GstvMagazineBox className="mb-4" />
          <GSTVSatrangBox />

          {isVideoPage && <WebStoriesSidebar />}

          <LiveTvSection />
        </>
      )}

      {/* ----------------- DOWNLOAD APP ----------------- */}
      <div className="download-app" style={{ textAlign: 'center' }}>
        <h6
          style={{
            fontSize: '20px',
            fontFamily: '"Hind Vadodara", sans-serif',
            color: '#000',
            marginBottom: '10px'
          }}
        >
          GSTVની એપ્લિકેશન ડાઉનલોડ કરો
        </h6>

        <div className="download-btn clearfix" style={{ display: 'inline-flex', gap: '10px' }}>
          <Link
            href="https://play.google.com/store/apps/details?id=com.tops.gstvapps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${UPLOAD_PATHS.PUBLIC_ASSETS}/images/play-store.png`}
              alt="Play Store"
              loading="lazy"
            />
          </Link>

          <Link
            href="https://apps.apple.com/in/app/gstv-gujarat-samachar/id1609602449"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${UPLOAD_PATHS.PUBLIC_ASSETS}/images/appstore.png`}
              alt="App Store"
              loading="lazy"
            />
          </Link>
        </div>
      </div>

      {/* ----------------- FOOTER LINKS ----------------- */}
      <div className="address">
        <h6>
          <ul className="custom-address-list">
            <li><Link href="/career">કેરીયર</Link></li><span>|</span>
            <li><Link href="/contact-us">કોન્ટેક્ટ અસ</Link></li><span>|</span>
            <li><Link href="/cookie-policy">કુકી પોલિસી</Link></li><span>|</span>
            <li><Link href="/privacy-policy">પ્રાઇવસી પોલિસી</Link></li><span>|</span>
            <li><Link href="/refund-policy">રિફંડ પોલિસી</Link></li><span>|</span>
            <li><Link href="/terms-condition">ટર્મ્સ એંડ કંડિશન</Link></li>
          </ul>
        </h6>

        <h6 className="custom-text">
          <div>
            ડિજાઇન એંડ ડેવલોપેડ બાય <span className="highlight-text">GSTV</span>
          </div>
          <br />
          © Copyright {new Date().getFullYear()} | GSTV. All rights reserved.
        </h6>
      </div>
    </>
  );
};

/* -------------------------------------------------------
   Prevent unnecessary re-renders
-------------------------------------------------------- */
export default memo(RightSidebar);
