// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { PageOverlay } from '@/components/ui/page-overlay';
// import { SidebarHeaderComponent } from './sidebar/SidebarHeader';
// import { SidebarNavigation } from './sidebar/SidebarNavigation';
// import { SidebarAdminSettings } from './sidebar/SidebarAdminSettings';
// import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
// import { Navbar } from './Navbar';
// import { logger } from '@/hooks/logger';

// interface UnifiedSidebarLayoutProps {
//   children: React.ReactNode;
//   hideSidebar?: boolean;
//   fixedHeight?: boolean; // New prop to control fixed height
// }

// export const UnifiedSidebarLayout: React.FC<UnifiedSidebarLayoutProps> = ({
//   children,
//   hideSidebar = false
// }) => {
//   logger.log('🔵 UnifiedSidebarLayout: Starting to render');
//   const { user, logout } = useAuth();
//   logger.log('User in Layout:', user);
//   logger.log('🔵 UnifiedSidebarLayout: User data:', user);

//   logger.log('🔵 UnifiedSidebarLayout: About to return JSX');
  
//   return (
//     <SidebarProvider defaultOpen={!hideSidebar}>
//       <div className="flex min-h-screen w-full bg-background">
//         {!hideSidebar && <UnifiedSidebar />}
//         <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${hideSidebar ? 'w-full' : ''}`}>
//           <Navbar hideSidebarTrigger={hideSidebar} /> {/* Pass prop to Navbar */}
//           <main className="flex-1 overflow-auto w-full">
//             <PageOverlay>
//               <div className="w-full">
//                 {children}
//               </div>
//             </PageOverlay>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// const UnifiedSidebar: React.FC = () => {
//   const location = useLocation();
//   const { user } = useAuth();
//   const role = user?.role || 'employee';
//   const sidebarContentRef = useRef<HTMLDivElement>(null);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const path = location.pathname.split('/')[1];
  
//   const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
//     esgManagement: path == 'esg',
//     esgdd: path == 'esg-dd',
//     reports: location.pathname.startsWith('/reports'),
//     stakeholders: location.pathname.startsWith('/stakeholders'),
//     sdg: location.pathname.startsWith('/sdg'),
//     audit: location.pathname.startsWith('/audit')
//   });
  
//   // Save scroll position before menu toggle
//   const toggleMenu = (menuKey: string) => {
//     if (sidebarContentRef.current) {
//       setScrollPosition(sidebarContentRef.current.scrollTop);
//     }
    
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuKey]: !prev[menuKey]
//     }));
//   };

//   // Restore scroll position after menu state changes
//   useEffect(() => {
//     if (sidebarContentRef.current && scrollPosition > 0) {
//       setTimeout(() => {
//         if (sidebarContentRef.current) {
//           sidebarContentRef.current.scrollTop = scrollPosition;
//         }
//       }, 0);
//     }
//   }, [expandedMenus, scrollPosition]);

//   useEffect(() => {
//     logger.log("🔵 UnifiedSidebar: Location changed to", location.pathname, location.pathname.startsWith('/esg'));
//     logger.debug("🔵 UnifiedSidebar: Expanded menus state changed:", expandedMenus);
//   }, [expandedMenus]);

//   return (
//     <Sidebar className="border-r border-border bg-sidebar w-80 shrink-0">
//       <SidebarHeaderComponent user={user} />
      
//       <SidebarContent ref={sidebarContentRef} className="px-2">
//         <SidebarNavigation role={role} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
        
//         <SidebarAdminSettings role={role} />
//       </SidebarContent>
      
//       <SidebarUserProfile user={user} />
//     </Sidebar>
//   );
// };

// // Export the unified sidebar as the default layout
// export const SidebarLayout = UnifiedSidebarLayout;
// export default UnifiedSidebarLayout;
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { PageOverlay } from '@/components/ui/page-overlay';
import { SidebarHeaderComponent } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarAdminSettings } from './sidebar/SidebarAdminSettings';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { Navbar } from './Navbar';
import { logger } from '@/hooks/logger';

interface UnifiedSidebarLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
  fixedHeight?: boolean;
}

export const UnifiedSidebarLayout: React.FC<UnifiedSidebarLayoutProps> = ({
  children,
  hideSidebar = false
}) => {
  logger.log('🔵 UnifiedSidebarLayout: Starting to render');
  const { user, logout } = useAuth();
  logger.log('User in Layout:', user);
  logger.log('🔵 UnifiedSidebarLayout: User data:', user);
  logger.log('🔵 UnifiedSidebarLayout: About to return JSX');

  return (
    <SidebarProvider defaultOpen={!hideSidebar}>
      <div className="flex min-h-screen w-full bg-background">
        {!hideSidebar && <UnifiedSidebar />}
        <div
          className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200 ${
            hideSidebar ? 'w-full' : ''
          }`}
          // style={!hideSidebar ? { marginLeft: 'var(--sidebar-width, 20rem)' } : {}}
        >
          <Navbar hideSidebarTrigger={hideSidebar} />
          <main className="flex-1 overflow-auto w-full p-12">
            <div className=" mx-auto  w-full">
              <PageOverlay>
                {children}
              </PageOverlay>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const UnifiedSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'employee';
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const path = location.pathname.split('/')[1];

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    esgManagement: path == 'esg',
    esgdd: path == 'esg-dd',
    reports: location.pathname.startsWith('/reports'),
    stakeholders: location.pathname.startsWith('/stakeholders'),
    sdg: location.pathname.startsWith('/sdg'),
    audit: location.pathname.startsWith('/audit')
  });

  const toggleMenu = (menuKey: string) => {
    if (sidebarContentRef.current) {
      setScrollPosition(sidebarContentRef.current.scrollTop);
    }
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  useEffect(() => {
    if (sidebarContentRef.current && scrollPosition > 0) {
      setTimeout(() => {
        if (sidebarContentRef.current) {
          sidebarContentRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
  }, [expandedMenus, scrollPosition]);

  useEffect(() => {
    logger.log("🔵 UnifiedSidebar: Location changed to", location.pathname);
    logger.debug("🔵 UnifiedSidebar: Expanded menus state changed:", expandedMenus);
  }, [expandedMenus]);

  return (
    <Sidebar className="border-r border-border bg-sidebar fixed top-0 left-0 h-screen shrink-0 z-40">
      <SidebarHeaderComponent user={user} />
      <SidebarContent ref={sidebarContentRef} className="px-2">
        <SidebarNavigation role={role} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
        <SidebarAdminSettings role={role} />
      </SidebarContent>
      <SidebarUserProfile user={user} />
    </Sidebar>
  );
};

export const SidebarLayout = UnifiedSidebarLayout;
export default UnifiedSidebarLayout;