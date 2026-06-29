'use client';

import { useStockmarketSiteSetting } from '@/hooks/useStockmarketSiteSetting';

export default function WhatsappJoinBanner() {
  const { whatsappChannelLink } = useStockmarketSiteSetting();

  if (!whatsappChannelLink) return null;

  return (
    <a
      href={whatsappChannelLink}
      target="_blank"
      rel="noopener noreferrer"
      className="wab-wrap"
    >
      {/* Text */}
      <div className="wab-text custom-gujrati-font">
        <strong>GSTV</strong>ની <strong>Whatsapp</strong> ચેનલમાં જોડાવા માટે આ લિંક પર ક્લિક કરો
       
      </div>

      {/* WhatsApp icon */}

      <div>
         <span className="wab-link">{whatsappChannelLink}</span>
        <span className='wab-icon'><svg viewBox="0 0 32 32" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="17" r="12" fill="#25D366"/>
          <path
            fill="#fff"
            d="M16.002 7.2c-4.854 0-8.8 3.946-8.8 8.8 0 1.55.404 3.004 1.11 4.264L7.2 24.8l4.648-1.094A8.758 8.758 0 0016.002 24.8c4.854 0 8.8-3.946 8.8-8.8s-3.946-8.8-8.8-8.8zm0 16.08a7.256 7.256 0 01-3.692-1.012l-.264-.156-2.756.648.694-2.68-.17-.276A7.24 7.24 0 018.722 16c0-4.02 3.26-7.28 7.28-7.28 4.02 0 7.28 3.26 7.28 7.28 0 4.022-3.26 7.28-7.28 7.28zm3.992-5.458c-.22-.11-1.298-.64-1.5-.712-.202-.074-.348-.11-.496.11-.148.22-.572.712-.702.858-.128.148-.258.166-.478.056-.22-.11-.928-.342-1.768-1.09-.654-.582-1.096-1.302-1.224-1.522-.128-.22-.014-.338.096-.448.098-.098.22-.256.33-.384.11-.128.146-.22.22-.366.074-.148.036-.276-.018-.386-.056-.11-.496-1.196-.68-1.636-.178-.43-.36-.372-.496-.378l-.422-.008c-.148 0-.386.056-.588.276-.202.22-.77.752-.77 1.832 0 1.08.788 2.124.898 2.272.11.148 1.55 2.366 3.756 3.318.524.226.934.362 1.254.462.526.168 1.006.144 1.384.088.422-.062 1.298-.53 1.482-1.042.182-.512.182-.952.128-1.042-.054-.09-.2-.144-.42-.254z"
          />
        </svg>
        </span>
      </div>

      <style>{`
        .wab-wrap {
          display: block;
          align-items: flex-end;
          justify-content: space-between;
          background: linear-gradient(135deg, #fff8f0 0%, #fdf0e8 100%);
          border: 1px solid #e8ddd0;
          border-radius: 12px;
          padding: 14px 14px 14px 16px;
          margin-bottom: 14px;
          text-decoration: none !important;
          gap: 10px;
          transition: box-shadow 0.2s;
          float:left;
        }

        .wab-wrap:hover {
          box-shadow: 0 3px 12px rgba(0,0,0,0.10);
        }

        .wab-text {
          font-size: 17px;
          font-weight: 600;
          color: #222;
          line-height: 1.5;
          flex: 1;
        }

        .wab-link {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #850E00;
          text-decoration: underline;
          word-break: break-all;
          font-family: monospace;
          float: left;
          width: 80%;
        }

        .wab-icon {
          flex-shrink: 0;
          background: #fff;
          border-radius: 10px;
          padding: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          float:right;
        }
      `}</style>
    </a>
  );
}
