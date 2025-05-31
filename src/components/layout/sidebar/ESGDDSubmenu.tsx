
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { SidebarSubmenu } from './SidebarSubmenu';
import { useAuth } from '@/context/AuthContext';

interface ESGDDSubmenuProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ESGDDSubmenu: React.FC<ESGDDSubmenuProps> = ({
  isExpanded,
  onToggle
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const isESGDDPath = location.pathname.startsWith('/esg-dd');

  // Get company funding stage from user context or default to empty
  const companyFundingStage = user?.company?.fundingStage || '';
  
  // Define funding stages that require Additional DD Details
  const advancedFundingStages = [
    'Series B',
    'Series C', 
    'Series D+',
    'Pre-IPO',
    'Public Listed'
  ];
  
  const showAdditionalDD = advancedFundingStages.includes(companyFundingStage);

  return (
    <SidebarSubmenu
      name="ESG DD"
      icon={FileSearch}
      isExpanded={isExpanded}
      isActive={isESGDDPath}
      onToggle={onToggle}
    >
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd'} tooltip="ESG DD Hub">
          <Link to="/esg-dd" className="w-full">
            <span>Overview</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/irl'} tooltip="Information Request List">
          <Link to="/esg-dd/irl" className="w-full">
            <span>IRL</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/reports'} tooltip="ESG DD Reports">
          <Link to="/esg-dd/reports" className="w-full">
            <span>ESG DD Reports</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/cap'} tooltip="ESG CAP">
          <Link to="/esg-dd/cap" className="w-full">
            <span>ESG CAP</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {showAdditionalDD && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/additional'} tooltip="Additional DD Details">
            <Link to="/esg-dd/additional" className="w-full">
              <span>Additional DD Details</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarSubmenu>
  );
};
