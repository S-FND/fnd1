
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarHeaderComponent } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarAdminSettings } from './sidebar/SidebarAdminSettings';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { Navbar } from './Navbar';

interface UnifiedSidebarLayoutProps {
  children: React.ReactNode;
}

export const UnifiedSidebarLayout: React.FC<UnifiedSidebarLayoutProps> = ({
  children
}) => {
  const { user, logout } = useAuth();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <UnifiedSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-full">
              {children}
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
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    esgManagement: location.pathname.startsWith('/esg'),
    esgdd: location.pathname.startsWith('/esg-dd'),
    reports: location.pathname.startsWith('/reports'),
    stakeholders: location.pathname.startsWith('/stakeholders'),
    audit: location.pathname.startsWith('/audit')
  });
  
  // Save scroll position before menu toggle
  const toggleMenu = (menuKey: string) => {
    if (sidebarContentRef.current) {
      setScrollPosition(sidebarContentRef.current.scrollTop);
    }
    
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Restore scroll position after menu state changes
  useEffect(() => {
    if (sidebarContentRef.current && scrollPosition > 0) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        if (sidebarContentRef.current) {
          sidebarContentRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
  }, [expandedMenus, scrollPosition]);

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeaderComponent user={user} />
      
      <SidebarContent ref={sidebarContentRef} className="px-2">
        <SidebarNavigation role={role} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
        
        <SidebarAdminSettings role={role} />
      </SidebarContent>
      
      <SidebarUserProfile user={user} />
    </Sidebar>
  );
};

// Export the unified sidebar as the default layout
export const SidebarLayout = UnifiedSidebarLayout;
export default UnifiedSidebarLayout;
