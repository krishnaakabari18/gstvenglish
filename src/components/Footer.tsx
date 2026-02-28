'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAVIGATION } from '@/constants/gujaratiStrings';

export default function Footer() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (route: string) => {
    if (!mounted) return false; // Prevent hydration mismatch
    return path === route || (route === '/' && path === '');
  };

  return (
    <div className="custom-footer">
      <div className="row footer-menu">
        <div className="col-2" style={{ width: '20%' }}>
          <Link href="/" className={isActive('/') ? 'active' : ''}>
            <div className="footer-image">
              <Image
                src="https://www.gstv.in/public/assets/icons/f-home.svg"
                alt="Home"
                width={28}
                height={28}
                unoptimized
              />
            </div>
            <p className="footer-link custom-gujrati-font">{NAVIGATION.HOME}</p>
          </Link>
        </div>
        <div className="col-2" style={{ width: '20%' }}>
          <Link href="/journalist" className={isActive('/journalist') ? 'active' : ''}>
            <div className="footer-image">
              <Image
                src="/assets/icons/journalist_icon.svg"
                alt="Video"
                width={38}
                height={28}
                unoptimized
              />
            </div>
            <p className="footer-link custom-gujrati-font">જર્નાલિસ્ટ</p>
          </Link>
        </div>
        <div className="col-4" style={{ marginTop: '-2px', width: '20%' }}>
          <Link href="/livetv" className={isActive('/livetv') ? 'active' : ''}>
            <div className="footer-image">
              <Image
                src="/assets/icons/ic_live_tv.svg"
                alt="Live TV"
                width={50}
                height={55}
                unoptimized
              />
            </div>
          </Link>
        </div>
        <div className="col-2" style={{ width: '20%' }}>
          <Link href="/epaper" className={isActive('/epaper') ? 'active' : ''}>
            <div className="footer-image">
              <Image
                src="/assets/icons/epaper_icons.svg"
                alt="Search"
                width={28}
                height={28}
                unoptimized
              />
            </div>
            <p className="footer-link custom-gujrati-font">{NAVIGATION.E_PAPER}</p>
          </Link>
        </div>
        <div className="col-2" style={{ width: '20%' }}>
          <Link href="/web-stories" className={isActive('/web-stories') ? 'active' : ''}>
            <div className="footer-image">
              <Image
                src="/assets/icons/footer-webstorys.svg"
                alt="Stories"
                width={28}
                height={28}
                unoptimized
              />
            </div>
            <p className="footer-link custom-gujrati-font">સ્ટોરીઝ</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
