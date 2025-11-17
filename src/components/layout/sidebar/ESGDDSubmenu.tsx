
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, FileSearch, FileText, LineChart } from 'lucide-react';
import { SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { SidebarSubmenu } from './SidebarSubmenu';
import { useAuth } from '@/context/AuthContext';
import { NavigationItem } from './navigationData';

interface ESGDDSubmenuProps {
  submenu?: NavigationItem[];
  isExpanded: boolean;
  allowedUrls?: string[];
  onToggle: () => void;
}

export const ESGDDSubmenu: React.FC<ESGDDSubmenuProps> = ({
  submenu,
  isExpanded,
  allowedUrls = [],
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

  const submenuItems = [
    { name: "Overview", href: '/esg-dd', icon: BarChart3 },
    { name: "IRL", href: "/esg-dd/irl", icon: FileText },
    { name: "Advanced IRL", href: "/esg-dd/advanced", icon: LineChart },
    { name: "ESG DD Reports", href: '/esg-dd/reports', icon: BarChart3 },
    { name: "ESG CAP", href: "/esg-dd/cap", icon: FileText },
    { name: "Additional DD Details", href: "/esg-dd/additional", icon: LineChart }
  ];

  return (
    <SidebarSubmenu
      name="ESG DD"
      icon={FileSearch}
      isExpanded={isExpanded}
      isActive={isESGDDPath}
      onToggle={onToggle}
    >

      {submenu.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          //Show additional DD Details only for advanced funding stages if applicable
          <SidebarMenuSubItem key={item.href}>
            <SidebarMenuSubButton asChild isActive={location.pathname === item.href}>
              <Link to={item.href}>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      })}

      


      {/* <SidebarMenuSubItem>
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
      )} */}
    </SidebarSubmenu>
  );
};
