
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOverlay } from '@/context/OverlayContext';
import { cn } from '@/lib/utils';

interface PageOverlayProps {
  children: React.ReactNode;
}

export const PageOverlay: React.FC<PageOverlayProps> = ({ children }) => {
  const { isOverlayActive, isUrlOverlayActive } = useOverlay();
  const location = useLocation();
  
  // Check if overlay should be active for current URL or globally
  const shouldShowOverlay = isOverlayActive && (isUrlOverlayActive(location.pathname) || !useOverlay().activeOverlayUrl);

  return (
    <div className="relative">
      {children}
      {shouldShowOverlay && (
        <div className={cn(
          "absolute inset-0 z-30 top-16",
          "bg-background/80 backdrop-blur-sm",
          "flex items-center justify-center",
          "border-2 border-dashed border-muted-foreground/50"
        )}>
          <div className="text-center p-6 bg-card rounded-lg shadow-lg border">
            <div className="text-2xl font-semibold text-muted-foreground mb-2">
              Feature Disabled
            </div>
            <p className="text-sm text-muted-foreground">
              This feature has been deactivated by the administrator
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
