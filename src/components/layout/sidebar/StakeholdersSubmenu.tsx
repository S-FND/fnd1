
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { SidebarSubmenu } from './SidebarSubmenu';

interface StakeholdersSubmenuProps {
  isExpanded: boolean;
  onToggle: () => void;
  role: string;
}

export const StakeholdersSubmenu: React.FC<StakeholdersSubmenuProps> = ({
  isExpanded,
  onToggle,
  role
}) => {
  const location = useLocation();
  const isStakeholdersPath = location.pathname.startsWith('/stakeholders');

  if (!(role === 'admin' || role === 'manager')) {
    return null;
  }

  return (
    <SidebarSubmenu
      name="Stakeholders"
      icon={Users}
      isExpanded={isExpanded}
      isActive={isStakeholdersPath}
      onToggle={onToggle}
    >
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/stakeholders'}>
          <Link to="/stakeholders">
            <span>Overview</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/stakeholders/manage'}>
          <Link to="/stakeholders/manage">
            <span>Manage Stakeholders</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/stakeholders/categories'}>
          <Link to="/stakeholders/categories">
            <span>Categories</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/stakeholders/engagement'}>
          <Link to="/stakeholders/engagement">
            <span>Engagement Plan</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/stakeholders/login'}>
          <Link to="/stakeholders/login">
            <span>Stakeholder Login</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarSubmenu>
  );
};
