
import { 
  BarChart3, FileCheck, Building2, Calendar, 
  GraduationCap, LayoutDashboard, LineChart, 
  Settings, Users, BookOpen, ClipboardCheck, FileSearch,
  FileText, Network
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

export const adminNavigationItems: NavigationItem[] = [
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
];

export const unitAdminNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Unit GHG Data', href: '/unit/ghg-accounting', icon: LineChart },
  { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'LMS', href: '/lms', icon: GraduationCap },
  { name: 'Team', href: '/team', icon: Users },
];

export const employeeNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
  { name: 'Personal Carbon', href: '/personal-ghg', icon: LineChart },
  { name: 'Learning', href: '/lms', icon: GraduationCap },
  { name: 'Profile', href: '/profile', icon: Users },
];

export const getNavigationItems = (role: string): NavigationItem[] => {
  if (role === 'admin' || role === 'manager') return adminNavigationItems;
  if (role === 'unit_admin') return unitAdminNavigationItems;
  return employeeNavigationItems;
};
