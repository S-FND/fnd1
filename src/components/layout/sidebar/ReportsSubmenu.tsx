
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
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
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/reports'}>
          <Link to="/reports">
            <span>Overview</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/reports/brsr'}>
          <Link to="/reports/brsr">
            <span>BRSR Report</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/reports/esrs'}>
          <Link to="/reports/esrs">
            <span>ESRS Report</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarSubmenu>
  );
};
