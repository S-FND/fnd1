
export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "ESG Management", href: "/esg", icon: "BarChart3" },
  { name: "Compliance", href: "/compliance", icon: "ClipboardCheck" },
  { name: "LMS", href: "/lms", icon: "GraduationCap" },
  { name: "EHS Trainings", href: "/ehs-trainings", icon: "Calendar" },
];

export const vendorNavItems: NavItem[] = [
  { name: "Dashboard", href: "/vendor/dashboard", icon: "LayoutDashboard" },
  { name: "Available Trainings", href: "/vendor/trainings", icon: "Calendar" },
  { name: "My Bids", href: "/vendor/bids", icon: "FileText" },
  { name: "Profile", href: "/vendor/profile", icon: "User" },
];
