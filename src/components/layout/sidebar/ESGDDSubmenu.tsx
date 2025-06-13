
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import { SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
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
  
  // Define funding stages that require Additional DD Details (using enum values)
  const advancedFundingStages = [
    'series_b',
    'series_c', 
    'series_d_plus',
    'pre_ipo',
    'public_listed'
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
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd'}>
          <Link to="/esg-dd">
            <span>Overview</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/irl'}>
          <Link to="/esg-dd/irl">
            <span>IRL</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/advanced'}>
          <Link to="/esg-dd/advanced">
            <span>Advanced IRL</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/reports'}>
          <Link to="/esg-dd/reports">
            <span>ESG DD Reports</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/cap'}>
          <Link to="/esg-dd/cap">
            <span>ESG CAP</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      {showAdditionalDD && (
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/additional'}>
            <Link to="/esg-dd/additional">
              <span>Additional DD Details</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      )}
    </SidebarSubmenu>
  );
};
