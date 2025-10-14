import { logger } from "@/hooks/logger";
import { createContext, useEffect, useState } from "react";

export interface PageAccessItem {
  menuItem: string;          // e.g. "Dashboard"
  menuItemId: string;        // e.g. "dashboard" or "esg-management.overview"
  url: string;               // e.g. "/dashboard"
  navigationType?: string;   // e.g. "Main Menu", "Submenu", optional if sometimes missing
  parentId?: string | null;  // e.g. "esg-management" for submenu items
  level?: 'main' | 'submenu' | string;  // main or submenu, optional if missing
  hasChildren?: boolean;     // true if it has submenus
  accessLevel?: string;      // e.g. "read", "write"
}


interface PageAccessContextType {
  pageAccessList: PageAccessItem[];
  setPageAccessList: React.Dispatch<React.SetStateAction<PageAccessItem[]>>;
  checkPageButtonAccess: (page: string) => boolean;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
  userRole: string | null;
}

export const PageAccessContext = createContext<PageAccessContextType>({
  pageAccessList: [],
  setPageAccessList: () => { },
  checkPageButtonAccess: (page: string) => false,
  setUserRole: () => {  },
  userRole: null
});

export const PageAccessProvider = ({ children }) => {
  const [pageAccessList, setPageAccessList] = useState<PageAccessItem[]>(() => {
    const saved = localStorage.getItem('fandoro-team-access');
    return saved ? JSON.parse(saved) : [];
  });

  const [userRole, setUserRole] = useState<string>(() => {
    const savedUser = localStorage.getItem('fandoro-user');
    logger.debug("🔵 Loaded user for role:", savedUser);
    logger.debug("🔵 User role is:", savedUser ? JSON.parse(savedUser).role : null);
    return savedUser ? JSON.parse(savedUser).role : null;
  });
  
  const checkPageButtonAccess = (page) => {
    logger.log("🔵 Checking access for page:", page);
    let filtered = pageAccessList.find(p => p.url === page && p.accessLevel)?.accessLevel; 
    if(filtered && !['read','no_access'].includes(filtered)){
      logger.log(`✅ Access granted for page: ${page} with access level: ${filtered}`);
      return true;
    }
    else{
      return false
    }
    // return pageAccessList.includes(page);
  }

  useEffect(() => {
    logger.debug("🔵 Role changed to localStorage:", userRole);
  }, [userRole]);

  useEffect(() => {
    logger.debug("🔵 Page access list changed, saving to localStorage:", pageAccessList);
    // localStorage.setItem('fandoro-team-access', JSON.stringify(pageAccessList));
  }, [pageAccessList]);

  return (
    <PageAccessContext.Provider value={{ pageAccessList, setPageAccessList, checkPageButtonAccess,setUserRole,userRole }}>
      {children}
    </PageAccessContext.Provider>
  );
};