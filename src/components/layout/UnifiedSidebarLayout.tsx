

import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarHeaderComponent } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarAdminSettings } from './sidebar/SidebarAdminSettings';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';

interface UnifiedSidebarLayoutProps {
  children: React.ReactNode;
}

export const UnifiedSidebarLayout: React.FC<UnifiedSidebarLayoutProps> = ({
  children
}) => {
  const { user, logout } = useAuth();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UnifiedSidebar />
        <div className="flex-1">
          {/* Minimal header with just the sidebar trigger */}
          <header className="border-b sticky top-0 z-40 bg-background">
            <div className="flex h-16 items-center px-4 md:px-6">
              <SidebarTrigger />
            </div>
          </header>
          
          <main className="p-4 md:p-6 relative z-10">
            {children}
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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    esgdd: location.pathname.startsWith('/esg-dd'),
    reports: location.pathname.startsWith('/reports'),
    stakeholders: location.pathname.startsWith('/stakeholders')
  });
  
  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  return (
    <Sidebar>
      <SidebarHeaderComponent user={user} />
      
      <SidebarContent>
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
