
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarNavItem } from './SidebarNavItem';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { getNavigationItems } from './navigationData';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu
} from '@/components/ui/sidebar';

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
  const navigationItems = getNavigationItems(role);
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            // Handle special submenu items
            if (item.name === 'ESG DD') {
              return (
                <ESGDDSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.esgdd}
                  onToggle={() => toggleMenu('esgdd')}
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
            
            // Regular navigation items
            return (
              <SidebarNavItem
                key={item.name}
                icon={item.icon}
                label={item.name}
                href={item.href}
                isActive={location.pathname === item.href}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
