
import { httpClient } from '@/lib/httpClient';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface OverlayContextType {
  isOverlayActive: boolean;
  activeOverlayUrl: string | null;
  toggleOverlay: () => void;
  setOverlayForUrl: (url: string) => void;
  setPageList:(pageList)=>void
  clearOverlay: () => void;
  isUrlOverlayActive: (url: string) => boolean;
  getPageAccessList:()=>[]
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
  const [pageActiveList,setPageActiveList]=useState(null);

  const toggleOverlay = () => {
    setIsOverlayActive(prev => !prev);
  };

  const setOverlayForUrl = (url: string) => {
    setActiveOverlayUrl(url);
    setIsOverlayActive(true);
  };
  
  const setPageList = (pageList:[]) => {
    setPageActiveList(pageList)
  };

  const getPageAccessList = () => {
    return pageActiveList
  };

  const clearOverlay = () => {
    setActiveOverlayUrl(null);
    setIsOverlayActive(false);
  };

  const isUrlOverlayActive = (url: string) => {
    return isOverlayActive && activeOverlayUrl === url;
  };

  const getPageAccess = async () => {
    try {
      console.log("Calling from Overlay cintext")
      let pageAccessResponse = await httpClient.get('company/settings/access');
      if (pageAccessResponse['status'] == 200) {
        let pageAccess = pageAccessResponse['data']['data']['data'];
        setPageActiveList(pageAccess)
      }
    } catch (error) {

    }
  }

  useEffect(()=>{
    if (!pageActiveList) {
      getPageAccess();
    }
  },[pageActiveList])

  useEffect(()=>{
    console.log('pageActiveList',pageActiveList)
  },[pageActiveList])

  return (
    <OverlayContext.Provider value={{ 
      isOverlayActive, 
      activeOverlayUrl,
      toggleOverlay, 
      setOverlayForUrl,
      clearOverlay,
      isUrlOverlayActive,
      setPageList,
      getPageAccessList
    }}>
      {children}
    </OverlayContext.Provider>
  );
};
