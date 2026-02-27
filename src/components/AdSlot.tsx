'use client';

import { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  slotId: string;
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ slotId, className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const displayedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // 1️⃣ Block SSR output
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2️⃣ Run GPT only AFTER mount
  useEffect(() => {
    if (
      mounted &&
      !displayedRef.current &&
      window.googletag?.cmd
    ) {
      window.googletag.cmd.push(() => {
        window.googletag.display(slotId);
      });
      displayedRef.current = true;
    }
  }, [mounted, slotId]);

  // 🔥 CRITICAL LINE
  if (!mounted) return null;

  return (
    <div className={`text-center pb-2 ${className}`}>
      <div id={slotId} ref={adRef}></div>
    </div>
  );
};

export default AdSlot;
