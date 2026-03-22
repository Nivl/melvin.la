'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { MdScreenRotation } from 'react-icons/md';

import { useMediaQuery } from '#hooks/useMediaQuery';

const PORTRAIT_QUERY = '(max-width: 767px) and (orientation: portrait)';

type LandscapeGuardProps = {
  children: React.ReactNode;
};

/**
 * Renders a fullscreen overlay on portrait-mode phones (< 768px wide)
 * prompting the user to rotate their device. The overlay disappears
 * automatically once landscape orientation is detected.
 */
export function LandscapeGuard({
  children,
}: LandscapeGuardProps): React.JSX.Element {
  const t = useTranslations('beatmaker.rotate');
  const showOverlay = useMediaQuery(PORTRAIT_QUERY);

  // Disable body scroll while the overlay is visible.
  useEffect(() => {
    if (!showOverlay) {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [showOverlay]);

  return (
    <>
      {children}
      {showOverlay && (
        <div className="bg-background/95 fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
          <MdScreenRotation className="text-primary cls-to-landscape-rotation text-7xl" />
          <p className="text-foreground text-xl font-semibold">{t('title')}</p>
          <p className="text-sm">{t('message')}</p>
        </div>
      )}
    </>
  );
}
