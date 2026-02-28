'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NAVIGATION } from '@/constants';

const LiveTvSection: React.FC = () => {
  const router = useRouter();

  const handleLiveTvClick = () => {
    router.push('/livetv');
  };

  return (
    <div className="gstv-live-tv-section">
      <div className="blogs-head-bar first">
        <h3 className="blog-category">{NAVIGATION.LIVE_TV}</h3>
      </div>
      <div className="live-tv-content" onClick={handleLiveTvClick} style={{ cursor: 'pointer' }}>
        <img
          src="/images/livetv.jpeg"
          alt="GSTV લાઇવ ટીવી"
          className="live-tv-image"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>
    </div>
  );
};

export default LiveTvSection;
