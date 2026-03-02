'use client';

import { LOCK_SCREEN } from '@/constants/gujaratiStrings';

interface LockScreenProps {
  userId: number;    // 0 or user id
}

export default function LockScreen({ userId }: LockScreenProps) {
  return (
    <div className="lockNewsDetail">
      <div className="lockNewsOverly">&nbsp;</div>

      <div className="lockFlexSec">
        {/* Lock Icon */}
        <div className="lockNews_icon">
          <hr />
          <img
            className="lock_icon"
            src="/assets/images/lock-icon.svg"
            alt="Lock Icon"
          />
        </div>

        {/* Banner */}
        <div className="lockNews_banner">
          <img
            className="lock_banner"
            src="/assets/images/lockNews_banner.png"
            alt="Lock News Banner"
          />
        </div>

        {/* Message */}
        <div className="lockNews_line">
          {userId !== 0 ? (
            <>
              {LOCK_SCREEN.READ_FULL_NEWS}{' '}
              <a href="/payment">{LOCK_SCREEN.READ_ON_WEBSITE}</a>
            </>
          ) : (
            <>
              {LOCK_SCREEN.PREMIUM_MEMBERSHIP}{' '}
              <a href="/login">{LOCK_SCREEN.LOGIN_NOW}</a>
            </>
          )}
        </div>

        {/* Buy Now */}
        <div className="lockNews_line buynowlockbtn">
          <a href="/payment" tabIndex={0}>
            {LOCK_SCREEN.VIEW_PLANS}
          </a>
        </div>

        {/* App Download */}
        <div className="lockNews_apps">
          <img
            className="lockQr_code_image"
            src="/assets/images/qr-code.png"
            alt="QR Code"
          />

          <div className="lockQr_code_right">
            <span className="appDownload_line">
              {LOCK_SCREEN.SCAN_QR_DOWNLOAD}
            </span>

            <a
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.tops.gstvapps"
              rel="noopener noreferrer"
            >
              <img
                className="lock_icon"
                src="/assets/images/playstore.svg"
                alt="Play Store"
              />
            </a>

            <a
              target="_blank"
              href="https://apps.apple.com/in/app/gstv-gujarat-samachar/id1609602449"
              rel="noopener noreferrer"
            >
              <img
                className="lock_icon"
                src="/assets/images/playstore-ios.svg"
                alt="App Store"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
