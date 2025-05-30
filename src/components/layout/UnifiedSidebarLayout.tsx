
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider, 
  SidebarTrigger
} from '@/components/ui/sidebar';
import { SidebarHeaderComponent } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarAdminSettings } from './sidebar/SidebarAdminSettings';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';

interface UnifiedSidebarLayoutProps {
  children: React.ReactNode;
}

export const UnifiedSidebarLayout: React.FC<UnifiedSidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UnifiedSidebar />
        <div className="flex-1">
          <div className="flex h-16 items-center justify-between px-4 md:px-6 border-b">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
              {/* Additional header components can go here */}
            </div>
          </div>
          <main className="p-4 md:p-6">
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
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  return (
    <Sidebar>
      <SidebarHeaderComponent user={user} />
      
      <SidebarContent>
        <SidebarNavigation 
          role={role} 
          expandedMenus={expandedMenus} 
          toggleMenu={toggleMenu} 
        />
        
        <SidebarAdminSettings role={role} />
      </SidebarContent>
      
      <SidebarUserProfile user={user} />
    </Sidebar>
  );
};

// Export the unified sidebar as the default layout
export const SidebarLayout = UnifiedSidebarLayout;

export default UnifiedSidebarLayout;
