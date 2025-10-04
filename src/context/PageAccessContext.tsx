import { createContext, useState } from "react";

interface PageAccessContextType {
  pageAccessList: string[];
  setPageAccessList: React.Dispatch<React.SetStateAction<string[]>>;
  checkPageAccess: (page: string) => boolean;
}

export const PageAccessContext = createContext<PageAccessContextType>({
  pageAccessList: [],
  setPageAccessList: () => {},
  checkPageAccess: (page:string) => false,
});

export const PageAccessProvider=({ children }) => {
    const [pageAccessList, setPageAccessList] = useState([]);
    
    const checkPageAccess = (page) => {
        console.log("🔵 Checking access for page:", page);
        return pageAccessList.includes(page);
    }

    return (
        <PageAccessContext.Provider value={{ pageAccessList, setPageAccessList, checkPageAccess }}>
            {children}
        </PageAccessContext.Provider>
    );
};