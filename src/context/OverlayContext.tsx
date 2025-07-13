
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OverlayContextType {
  isOverlayActive: boolean;
  activeOverlayUrl: string | null;
  toggleOverlay: () => void;
  setOverlayForUrl: (url: string) => void;
  clearOverlay: () => void;
  isUrlOverlayActive: (url: string) => boolean;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};

interface OverlayProviderProps {
  children: ReactNode;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({ children }) => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [activeOverlayUrl, setActiveOverlayUrl] = useState<string | null>(null);

  const toggleOverlay = () => {
    setIsOverlayActive(prev => !prev);
  };

  const setOverlayForUrl = (url: string) => {
    setActiveOverlayUrl(url);
    setIsOverlayActive(true);
  };

  const clearOverlay = () => {
    setActiveOverlayUrl(null);
    setIsOverlayActive(false);
  };

  const isUrlOverlayActive = (url: string) => {
    return isOverlayActive && activeOverlayUrl === url;
  };

  return (
    <OverlayContext.Provider value={{ 
      isOverlayActive, 
      activeOverlayUrl,
      toggleOverlay, 
      setOverlayForUrl,
      clearOverlay,
      isUrlOverlayActive
    }}>
      {children}
    </OverlayContext.Provider>
  );
};
