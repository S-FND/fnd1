
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OverlayContextType {
  isOverlayActive: boolean;
  toggleOverlay: () => void;
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

  const toggleOverlay = () => {
    setIsOverlayActive(prev => !prev);
  };

  return (
    <OverlayContext.Provider value={{ isOverlayActive, toggleOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};
