'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ViewTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastTrackedPath.current) return;
    lastTrackedPath.current = pathname;

    // Small delay to ensure browser environment is settled
    const timer = setTimeout(() => {
      try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

        fetch('/api/analytics/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer || null : null,
            device: isMobile ? 'mobile' : 'desktop',
          }),
        }).catch(() => {
          // Non-blocking catch
        });
      } catch {
        // Safe silence
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

