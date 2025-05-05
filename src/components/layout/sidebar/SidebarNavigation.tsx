import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, FileCheck, Building2, Calendar, 
  GraduationCap, LayoutDashboard, LineChart, 
  Settings, Users, BookOpen, ClipboardCheck, FileSearch
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
    { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
    { name: 'Audit', href: '/audit', icon: FileCheck },
    { name: 'LMS', href: '/lms', icon: GraduationCap },
    { name: 'EHS Trainings', href: '/ehs-trainings', icon: BookOpen },
    { name: 'Unit Management', href: '/units', icon: Building2 },
    { name: 'Team', href: '/team', icon: Users },
  ];

  const unitAdminNavigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Unit GHG Data', href: '/unit/ghg-accounting', icon: LineChart },
    { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
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
