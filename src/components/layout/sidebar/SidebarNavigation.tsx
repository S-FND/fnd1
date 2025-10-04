
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';
import { SidebarNavItem } from './SidebarNavItem';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ESGManagementSubmenu } from './ESGManagementSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { AuditSubmenu } from './AuditSubmenu';
// import { SDGSubmenu } from './SDGSubmenu';
import { getNavigationItems } from './navigationData';
import { useAuth } from '@/context/AuthContext';
import { PageAccessContext } from '@/context/PageAccessContext';

interface SidebarNavigationProps {
  role: string;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (menuKey: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  role,
  expandedMenus,
  toggleMenu
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const { pageAccessList, checkPageAccess ,setPageAccessList } = useContext(PageAccessContext);
  const visibleItems = getNavigationItems(role);
  
  useEffect(() => {
    console.log("🔵 SidebarNavigation: Checking page access for role:", pageAccessList);
    console.log("🔵 SidebarNavigation: Current user checkPageAccess:", checkPageAccess('/admin'));
  }, []);

  useEffect(() => {
    let userData = user;
    console.log('🔵 SidebarNavigation: User data:', userData);
    let localStorageData = JSON.parse(localStorage.getItem('fandoro-user'));
    console.log('🔵 SidebarNavigation: LocalStorage user data:', localStorageData);
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href));

            // Handle special menu items with submenus
            if (item.name === 'ESG Management') {
              return (
                <ESGManagementSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.esgManagement}
                  onToggle={() => toggleMenu('esgManagement')}
                />
              );
            }

            if (item.name === 'ESG DD') {
              return (
                <ESGDDSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.esgdd}
                  onToggle={() => toggleMenu('esgdd')}
                />
              );
            }

            if (item.name === 'Audit') {
              return (
                <AuditSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.audit}
                  onToggle={() => toggleMenu('audit')}
                />
              );
            }

            if (item.name === 'Reports') {
              return (
                <ReportsSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.reports}
                  onToggle={() => toggleMenu('reports')}
                />
              );
            }

            if (item.name === 'Stakeholders') {
              return (
                <StakeholdersSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.stakeholders}
                  onToggle={() => toggleMenu('stakeholders')}
                  role={role}
                />
              );
            }

            // if (item.name === 'SDG') {
            //   return (
            //     <SDGSubmenu
            //       key={item.name}
            //       isExpanded={expandedMenus.sdg}
            //       onToggle={() => toggleMenu('sdg')}
            //     />
            //   );
            // }

            // Regular menu items
            return (
              <SidebarNavItem
                key={item.name}
                icon={item.icon}
                label={item.name}
                href={item.href}
                isActive={isActive}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
