'use client';

import { useEffect, useState } from 'react';

const MobileAppPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 768;

      return isMobileDevice || isSmallScreen;
    };

    // Check if user has already seen the prompt
    const hasSeenPrompt = localStorage.getItem('hasSeenAppPrompt');

    if (checkMobile() && !hasSeenPrompt) {
      setIsMobile(true);
      // Show prompt after 2 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAppOpen = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Convert current page URL to app scheme
  const newUrl = window.location.href.replace(/^https:/, 'gstvapp:');

  // Mark as seen
  localStorage.setItem('hasSeenAppPrompt', 'true');

  if (/android/i.test(userAgent)) {
    window.location.href = newUrl;

    setTimeout(() => {
      window.location.href = 'https://onelink.to/43bgxx';
    }, 500);

  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    window.location.href = newUrl;

    setTimeout(() => {
      window.location.href = 'https://onelink.to/43bgxx';
    }, 500);
  }

  setShowPrompt(false);
};


  const handleContinueInBrowser = () => {
    // Mark as seen and close prompt
    localStorage.setItem('hasSeenAppPrompt', 'true');
    setShowPrompt(false);
  };

  const handleBackdropClick = () => {
    setShowPrompt(false);
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`app-prompt-backdrop ${showPrompt ? 'show' : ''}`}
        onClick={handleBackdropClick}
      />

      {/* Mobile App Prompt - Exact UI Match */}
      <div className={`mobile-app-prompt ${showPrompt ? 'show' : ''}`}>
        <div className="app-prompt-content">
          <div className="app-prompt-header">
            <h3>Open In</h3>
          </div>

          <div className="app-options">
            <div className="app-option">
              <div className="app-info">
                <span className="app-name">GSTV News App</span>
              </div>
              <button className="app-button open-btn" onClick={handleAppOpen}>
                Open
              </button>
            </div>

            <div className="app-option">
              <div className="app-info">
                <span className="app-name">Chrome Browser</span>
              </div>
              <button className="app-button continue-btn" onClick={handleContinueInBrowser}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileAppPrompt;