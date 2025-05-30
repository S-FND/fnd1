import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, FileCheck, Building2, Calendar, 
  GraduationCap, LayoutDashboard, LineChart, 
  Settings, Users, BookOpen, ClipboardCheck, FileSearch,
  FileText, Network, FileUser, Building
} from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarSubmenu } from './SidebarSubmenu';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

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
  
  const adminNavigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Materiality', href: '/materiality', icon: BarChart3 },
    { name: 'ESG Management', href: '/esg', icon: BarChart3 },
    { name: 'ESG DD', href: '/esg-dd', icon: FileSearch },
    { name: 'GHG Accounting', href: '/ghg-accounting', icon: LineChart },
    { name: 'Stakeholders', href: '/stakeholders', icon: Network },
    { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Audit', href: '/audit', icon: FileCheck },
    { name: 'LMS', href: '/lms', icon: GraduationCap },
    { name: 'EHS Trainings', href: '/ehs-trainings', icon: BookOpen },
    { name: 'Unit Management', href: '/units', icon: Building2 },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Company Profile', href: '/company', icon: Building },
  ];

  const unitAdminNavigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Unit GHG Data', href: '/unit/ghg-accounting', icon: LineChart },
    { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'LMS', href: '/lms', icon: GraduationCap },
    { name: 'Team', href: '/team', icon: Users },
  ];

  const employeeNavigationItems = [
    { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Personal Carbon', href: '/personal-ghg', icon: LineChart },
    { name: 'Learning', href: '/lms', icon: GraduationCap },
    { name: 'Profile', href: '/profile', icon: Users },
  ];

  const getNavigationItems = () => {
    if (role === 'admin' || role === 'manager') return adminNavigationItems;
    if (role === 'unit_admin') return unitAdminNavigationItems;
    return employeeNavigationItems;
  };

  const navigationItems = getNavigationItems();
  const isESGDDPath = location.pathname.startsWith('/esg-dd');
  const isReportsPath = location.pathname.startsWith('/reports');
  const isStakeholdersPath = location.pathname.startsWith('/stakeholders');
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            if (item.name === 'ESG DD') {
              return (
                <SidebarSubmenu
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  isExpanded={expandedMenus.esgdd}
                  isActive={isESGDDPath}
                  onToggle={() => toggleMenu('esgdd')}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd'} tooltip="ESG DD Hub">
                      <Link to="/esg-dd" className="w-full">
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/manual'} tooltip="Manual ESG DD">
                      <Link to="/esg-dd/manual" className="w-full">
                        <span>Manual ESG DD</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/automated'} tooltip="Automated ESG DD">
                      <Link to="/esg-dd/automated" className="w-full">
                        <span>Automated ESG DD</span>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/esg-dd/irl'} tooltip="IRL">
                      <Link to="/esg-dd/irl" className="w-full">
                        <FileUser className="h-4 w-4" />
                        <span>IRL</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarSubmenu>
              );
            }
            
            if (item.name === 'Reports') {
              return (
                <SidebarSubmenu
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  isExpanded={expandedMenus.reports}
                  isActive={isReportsPath}
                  onToggle={() => toggleMenu('reports')}
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
                    <SidebarMenuButton asChild isActive={location.pathname === '/reports/gri'} tooltip="GRI Report">
                      <Link to="/reports/gri" className="w-full">
                        <span>GRI Report</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/reports/tcfd'} tooltip="TCFD Report">
                      <Link to="/reports/tcfd" className="w-full">
                        <span>TCFD Report</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/reports/impact'} tooltip="Impact Assessment">
                      <Link to="/reports/impact" className="w-full">
                        <span>Impact Assessment</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarSubmenu>
              );
            }
            
            if (item.name === 'Stakeholders' && (role === 'admin' || role === 'manager')) {
              return (
                <SidebarSubmenu
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  isExpanded={expandedMenus.stakeholders}
                  isActive={isStakeholdersPath}
                  onToggle={() => toggleMenu('stakeholders')}
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
            }
            
            return (
              <SidebarNavItem
                key={item.name}
                icon={item.icon}
                label={item.name}
                href={item.href}
                isActive={location.pathname === item.href}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
