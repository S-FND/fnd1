
import { LayoutDashboard, BarChart3, FileSearch, LineChart, ClipboardCheck, GraduationCap, Calendar, Users, Building2, Settings, FileText, TreePine, Target, Activity, Shield } from 'lucide-react';
import { FeatureId } from '@/types/features';

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  featureId?: FeatureId;
  submenu?: NavigationItem[];
}

export const getNavigationItems = (role: string): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      featureId: 'dashboard'
    },
    {
      name: "ESG Management",
      href: "/esg",
      icon: BarChart3,
      featureId: 'esg-management',
      submenu: [
        { name: "Overview", href: "/esg", icon: BarChart3 },
        { name: "ESMS", href: "/esg/esms", icon: FileText },
        { name: "ESG Metrics", href: "/esg/metrics", icon: LineChart }
      ]
    }
  ];

  const isAdminRole = ['admin', 'manager', 'unit_admin', 'portfolio_company_admin', 'super_admin'].includes(role);
  if (isAdminRole) {
    baseItems.push(
      {
        name: "Materiality",
        href: "/materiality",
        icon: TreePine,
        featureId: 'materiality'
      },
      {
        name: "SDG",
        href: "/sdg",
        icon: Target,
        featureId: 'sdg',
        submenu: [
          { name: "Overview", href: "/sdg", icon: Target },
          { name: "Strategy Setting", href: "/sdg/strategy", icon: FileText }
        ]
      },
      {
        name: "ESG DD",
        href: "/esg-dd",
        icon: FileSearch,
        featureId: 'esg-dd',
        submenu: [
          { name: "Overview", href: "/esg-dd", icon: FileSearch },
          { name: "Manual Assessment", href: "/esg-dd/manual", icon: FileText },
          { name: "Automated Assessment", href: "/esg-dd/automated", icon: FileText },
          { name: "CAP Management", href: "/esg-dd/cap", icon: FileText },
          { name: "IRL Assessment", href: "/esg-dd/irl", icon: FileText },
          { name: "Reports", href: "/esg-dd/reports", icon: FileText }
        ]
      },
      {
        name: "GHG Accounting",
        href: "/ghg-accounting",
        icon: LineChart,
        featureId: 'ghg-accounting'
      },
      {
        name: "Compliance",
        href: "/compliance",
        icon: ClipboardCheck,
        featureId: 'compliance'
      },
      {
        name: "Audit",
        href: "/audit",
        icon: FileText,
        featureId: 'audit',
        submenu: [
          { name: "Supplier Audits", href: "/audit/supplier", icon: Users },
          { name: "EHS Audits", href: "/audit/ehs", icon: ClipboardCheck },
          { name: "Internal Audits", href: "/audit/internal", icon: Building2 }
        ]
      },
      {
        name: "LMS",
        href: "/lms",
        icon: GraduationCap,
        featureId: 'lms'
      },
      {
        name: "EHS Trainings",
        href: "/ehs-trainings",
        icon: Calendar,
        featureId: 'ehs-trainings'
      },
      {
        name: "Reports",
        href: "/reports",
        icon: FileText,
        featureId: 'reports'
      },
      {
        name: "Stakeholders",
        href: "/stakeholders",
        icon: Users,
        featureId: 'stakeholder-management'
      },
      {
        name: "Units",
        href: "/units",
        icon: Building2,
        featureId: 'unit-management'
      },
      {
        name: "Team Management",
        href: "/team-management",
        icon: Users,
        featureId: 'team-management'
      },
      {
        name: "Action Log",
        href: "/action-log",
        icon: Activity,
        featureId: 'action-log'
      },
      {
        name: "Approvals to be Done",
        href: "/verifier-approvals",
        icon: ClipboardCheck,
        featureId: 'verifier-approvals'
      }
    );

    // Add Settings and Verifier Admin only for admin users
    if (role === 'admin' || role === 'super_admin') {
      baseItems.push(
        {
          name: "Verifier Admin",
          href: "/verifier-admin",
          icon: Shield,
          featureId: 'verifier-admin'
        },
        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
          featureId: 'settings'
        }
      );
    }
  }

  if (role === 'employee') {
    baseItems.push(
      {
        name: "Personal GHG",
        href: "/personal-ghg",
        icon: LineChart,
        featureId: 'ghg-accounting'
      },
      {
        name: "LMS",
        href: "/lms",
        icon: GraduationCap,
        featureId: 'lms'
      },
      {
        name: "EHS Trainings",
        href: "/ehs-trainings",
        icon: Calendar,
        featureId: 'ehs-trainings'
      }
    );
  }

  return baseItems;
};
