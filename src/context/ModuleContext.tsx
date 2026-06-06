import { createContext, useContext, useState, ReactNode } from 'react';

type ModuleType = 'mis' | 'escap' | null;

interface ModuleContextValue {
  module: ModuleType;
  setModule: (module: ModuleType) => void;
}

const ModuleContext = createContext<ModuleContextValue | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [module, setModule] = useState<ModuleType>(() => {
    return localStorage.getItem('selectedModule') as ModuleType || null;
  });

  const updateModule = (newModule: ModuleType) => {
    setModule(newModule);
    if (newModule) localStorage.setItem('selectedModule', newModule);
    else localStorage.removeItem('selectedModule');
  };

  return (
    <ModuleContext.Provider value={{ module, setModule: updateModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const ctx = useContext(ModuleContext);
  // ✅ Return a safe default instead of throwing (prevents crash)
  if (!ctx) {
    console.warn('useModule called outside ModuleProvider – using fallback');
    return { module: null, setModule: () => {} };
  }
  return ctx;
};