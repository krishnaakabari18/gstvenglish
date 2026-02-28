'use client';

import Link from 'next/link';
import { POLICY_LINKS } from '@/constants';

export default function ProFooter() {
  return (
    <div id="footerMiddle">
      <div className="row align-items-center">
        <div className="col-lg-6 d-flex justify-content-lg-start justify-content-center">
          © Copyright {new Date().getFullYear()} | GSTV. All rights reserved.
        </div>
        <div className="col-lg-6 d-flex justify-content-lg-end justify-content-center">
          <ul className="custom-address-list">
            <li><Link href="/career">{POLICY_LINKS.CAREER}</Link></li><span>|</span>
            <li><Link href="/contact-us">{POLICY_LINKS.CONTACT_US}</Link></li><span>|</span>
            <li><Link href="/cookie-policy">{POLICY_LINKS.COOKIE_POLICY}</Link></li><span>|</span>
            <li><Link href="/privacy-policy">{POLICY_LINKS.PRIVACY_POLICY}</Link></li><span>|</span>
            <li><Link href="/refund-policy">{POLICY_LINKS.REFUND_POLICY}</Link></li><span>|</span>
            <li><Link href="/terms-condition">{POLICY_LINKS.TERMS_CONDITIONS}</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
