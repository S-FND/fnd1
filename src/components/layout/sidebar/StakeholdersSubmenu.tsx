
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Network } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
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
      icon={Network}
      isExpanded={isExpanded}
      isActive={isStakeholdersPath}
      onToggle={onToggle}
    >
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/stakeholders'} tooltip="Overview">
          <Link to="/stakeholders" className="w-full">
            <span>Overview</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/stakeholders/manage'} tooltip="Manage Stakeholders">
          <Link to="/stakeholders/manage" className="w-full">
            <span>Manage Stakeholders</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/stakeholders/categories'} tooltip="Categories">
          <Link to="/stakeholders/categories" className="w-full">
            <span>Categories</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/stakeholders/engagement'} tooltip="Engagement Plan">
          <Link to="/stakeholders/engagement" className="w-full">
            <span>Engagement Plan</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarSubmenu>
  );
};
