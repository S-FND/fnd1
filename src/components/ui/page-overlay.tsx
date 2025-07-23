
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOverlay } from '@/context/OverlayContext';
import { cn } from '@/lib/utils';
import { httpClient } from '@/lib/httpClient';

interface PageOverlayProps {
  children: React.ReactNode;
}

export const PageOverlay: React.FC<PageOverlayProps> = ({ children }) => {
  const { isOverlayActive, isUrlOverlayActive ,getPageAccessList,setPageList} = useOverlay();
  const [shouldShowOverlay, setShouldShowOverlay] = useState(false)
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('fandoro-user') || '{}');
  const userEmail = user?.email;
  const [pageActiveList,setPageActiveList]=useState();

  const getPageAccess = async () => {
    try {
      let pageAccessResponse = await httpClient.get('company/settings/access');
      if (pageAccessResponse['status'] == 200) {
        let pageAccess = pageAccessResponse['data']['data']['data'];
        setPageActiveList(pageAccess)
      }
    } catch (error) {

    }
  }

  useEffect(()=>{
    getPageAccess()
  },[])

  useEffect(() => {
    const exemptEmails = ['shekhar.sharma@eggoz.in','sample@abclogistics.com'];
    if (!pageActiveList || !Array.isArray(pageActiveList)) return;
    // if (exemptEmails.includes(userEmail)) {
    //   setShouldShowOverlay(false);
    // } else {
    //   if (['/company', '/settings'].includes(location.pathname)) {
    //     setShouldShowOverlay(false)
    //   }
    //   else if (location.pathname == '/esg-dd/advanced' || !location.pathname.split('/').includes('esg-dd')) {
    //     console.log("location.pathname", location.pathname)
    //     setShouldShowOverlay(true)
    //   }
    //   else {
    //     setShouldShowOverlay(false)
    //   }
    // }
    let pageAccessData:{feature:string;url:string;enabled:boolean}[]=pageActiveList;
    for(let i=0;i<pageAccessData.length;i++){
      // console.log('pageAccessData',pageAccessData[i]['url'].split('/'))
      // console.log(`location.pathname.split('/')`,location.pathname.split('/'))
      if(location.pathname.split('/').includes(pageAccessData[i]['url'].split('/')[1])){
        // console.log("Overlay",pageAccessData[i]['enabled'])
        setShouldShowOverlay(!pageAccessData[i]['enabled'])
        break;
      }
      else{
        setShouldShowOverlay(!pageAccessData[i]['enabled'])
      }
    }
    
    // console.log('getPageAccessList',)
  }, [location.pathname,pageActiveList])
  // Check if overlay should be active for current URL or globally
  // const shouldShowOverlay = isOverlayActive && (isUrlOverlayActive(location.pathname) || !useOverlay().activeOverlayUrl);
  console.log('shouldShowOverlay', shouldShowOverlay)
  return (
    <div className="relative">
      {children}
      {shouldShowOverlay && (
        <div className={cn(
          "absolute inset-0 z-50",
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
