
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';
import { SidebarNavItem } from './SidebarNavItem';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { navigationItems } from './navigationData';
import { useAuth } from '@/context/AuthContext';

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

  const getVisibleItems = () => {
    return navigationItems.filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.includes(role);
    });
  };

  const visibleItems = getVisibleItems();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href));

            // Handle special menu items with submenus
            if (item.id === 'esg-dd') {
              return (
                <ESGDDSubmenu
                  key={item.id}
                  isExpanded={expandedMenus.esgdd}
                  onToggle={() => toggleMenu('esgdd')}
                />
              );
            }

            if (item.id === 'reports') {
              return (
                <ReportsSubmenu
                  key={item.id}
                  isExpanded={expandedMenus.reports}
                  onToggle={() => toggleMenu('reports')}
                  role={role}
                />
              );
            }

            if (item.id === 'stakeholders') {
              return (
                <StakeholdersSubmenu
                  key={item.id}
                  isExpanded={expandedMenus.stakeholders}
                  onToggle={() => toggleMenu('stakeholders')}
                  role={role}
                />
              );
            }

            // Regular menu items
            return (
              <SidebarNavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
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
