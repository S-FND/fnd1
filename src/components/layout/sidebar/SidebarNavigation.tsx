
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarNavItem } from './SidebarNavItem';
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
            // Handle stakeholders submenu separately
            if (item.name === 'Stakeholders' && (role === 'admin' || role === 'manager')) {
              return (
                <StakeholdersSubmenu
                  key="stakeholders"
                  isExpanded={expandedMenus.stakeholders || false}
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
                isActive={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
