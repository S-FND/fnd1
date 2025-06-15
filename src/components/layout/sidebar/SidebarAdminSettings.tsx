
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, Settings } from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';

interface SidebarAdminSettingsProps {
  role: string;
}

export const SidebarAdminSettings: React.FC<SidebarAdminSettingsProps> = ({
  role
}) => {
  const location = useLocation();
  
  if (role !== 'admin' && role !== 'manager') {
    return null;
  }
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarNavItem
            icon={Building2}
            label="Company Profile"
            href="/company"
            isActive={location.pathname === '/company'}
          />
          <SidebarNavItem
            icon={Settings}
            label="Settings"
            href="/settings"
            isActive={location.pathname === '/settings'}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
