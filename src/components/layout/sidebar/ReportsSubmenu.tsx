
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { SidebarSubmenu } from './SidebarSubmenu';

interface ReportsSubmenuProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReportsSubmenu: React.FC<ReportsSubmenuProps> = ({
  isExpanded,
  onToggle
}) => {
  const location = useLocation();
  const isReportsPath = location.pathname.startsWith('/reports');

  return (
    <SidebarSubmenu
      name="Reports"
      icon={FileText}
      isExpanded={isExpanded}
      isActive={isReportsPath}
      onToggle={onToggle}
    >
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/reports'} tooltip="Reports Hub">
          <Link to="/reports" className="w-full">
            <span>Overview</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/reports/brsr'} tooltip="BRSR Report">
          <Link to="/reports/brsr" className="w-full">
            <span>BRSR Report</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/reports/esrs'} tooltip="ESRS Report">
          <Link to="/reports/esrs" className="w-full">
            <span>ESRS Report</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarSubmenu>
  );
};
