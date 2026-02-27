'use client';

import Link from 'next/link';

export default function ProFooter() {
  return (
    <div id="footerMiddle">
      <div className="row align-items-center">
        <div className="col-lg-6 d-flex justify-content-lg-start justify-content-center">
          © Copyright {new Date().getFullYear()} | GSTV. All rights reserved.
        </div>
        <div className="col-lg-6 d-flex justify-content-lg-end justify-content-center">
          <ul className="custom-address-list">
            <li><Link href="/career">કેરીયર</Link></li><span>|</span>
            <li><Link href="/contact-us">કોન્ટેક્ટ અસ</Link></li><span>|</span>
            <li><Link href="/cookie-policy">કુકી પોલિસી</Link></li><span>|</span>
            <li><Link href="/privacy-policy">પ્રાઇવસી પોલિસી</Link></li><span>|</span>
            <li><Link href="/refund-policy">રિફંડ પોલિસી</Link></li><span>|</span>
            <li><Link href="/terms-condition">ટર્મ્સ એંડ કંડિશન</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
