// utils/FloatingButtonsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FloatingButtonsContextType {
  showButtons: boolean;
  setShowButtons: (show: boolean) => void;
  onSaveDraft: () => void;
  onFinalSubmit: () => void;
  setActions: (saveDraft: () => void, finalSubmit: () => void) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isDisabled: boolean;
  setIsDisabled: (disabled: boolean) => void;
}

const FloatingButtonsContext = createContext<FloatingButtonsContextType | undefined>(undefined);

export const FloatingButtonsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [onSaveDraft, setOnSaveDraft] = useState<() => void>(() => {});
  const [onFinalSubmit, setOnFinalSubmit] = useState<() => void>(() => {});
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const setActions = (saveDraft: () => void, finalSubmit: () => void) => {
    setOnSaveDraft(() => saveDraft);
    setOnFinalSubmit(() => finalSubmit);
  };

  return (
    <FloatingButtonsContext.Provider
      value={{
        showButtons,
        setShowButtons,
        onSaveDraft,
        onFinalSubmit,
        setActions,
        isLoading,
        setIsLoading,
        isDisabled,
        setIsDisabled
      }}
    >
      {children}
    </FloatingButtonsContext.Provider>
  );
};

export const useFloatingButtons = () => {
  const context = useContext(FloatingButtonsContext);
  if (!context) {
    throw new Error('useFloatingButtons must be used within FloatingButtonsProvider');
  }
  return context;
};