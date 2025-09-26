import { LayoutDashboard, BarChart3, FileSearch, LineChart, ClipboardCheck, GraduationCap, Calendar, Users, Building2, Settings, FileText, TreePine, Target, Activity } from 'lucide-react';
import { FeatureId } from '@/types/features';

export interface DetailedNavigationItem {
  id: string; // unique identifier like 'esg-dd.irl.company'
  name: string;
  href?: string; // optional for parent items
  icon?: any;
  featureId?: FeatureId;
  level: 'main' | 'submenu' | 'tab'; // navigation level
  parentId?: string; // parent item id
  children?: DetailedNavigationItem[];
  requiresAuth?: boolean;
  allowedRoles?: string[];
}

// Comprehensive navigation structure including all levels
export const getDetailedNavigationStructure = (): DetailedNavigationItem[] => {
  return [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      featureId: 'dashboard',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor', 'portfolio_team_viewer']
    },
    
    // ESG Management
    {
      id: 'esg-management',
      name: 'ESG Management',
      href: '/esg',
      icon: BarChart3,
      featureId: 'esg-management',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor'],
      children: [
        {
          id: 'esg-management.overview',
          name: 'Overview',
          href: '/esg',
          icon: BarChart3,
          level: 'submenu',
          parentId: 'esg-management'
        },
        {
          id: 'esg-management.esms',
          name: 'ESMS',
          href: '/esg/esms',
          icon: FileText,
          level: 'submenu',
          parentId: 'esg-management'
        },
        {
          id: 'esg-management.metrics',
          name: 'ESG Metrics',
          href: '/esg/metrics',
          icon: LineChart,
          level: 'submenu',
          parentId: 'esg-management'
        }
      ]
    },

    // Materiality
    {
      id: 'materiality',
      name: 'Materiality',
      href: '/materiality',
      icon: TreePine,
      featureId: 'materiality',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor']
    },

    // SDG
    {
      id: 'sdg',
      name: 'SDG',
      href: '/sdg',
      icon: Target,
      featureId: 'sdg',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor'],
      children: [
        {
          id: 'sdg.overview',
          name: 'Overview',
          href: '/sdg',
          icon: Target,
          level: 'submenu',
          parentId: 'sdg'
        },
        {
          id: 'sdg.strategy',
          name: 'Strategy Setting',
          href: '/sdg/strategy',
          icon: FileText,
          level: 'submenu',
          parentId: 'sdg'
        }
      ]
    },

    // ESG DD
    {
      id: 'esg-dd',
      name: 'ESG DD',
      href: '/esg-dd',
      icon: FileSearch,
      featureId: 'esg-dd',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor'],
      children: [
        {
          id: 'esg-dd.overview',
          name: 'Overview',
          href: '/esg-dd',
          icon: FileSearch,
          level: 'submenu',
          parentId: 'esg-dd'
        },
        {
          id: 'esg-dd.manual',
          name: 'Manual Assessment',
          href: '/esg-dd/manual',
          icon: FileText,
          level: 'submenu',
          parentId: 'esg-dd'
        },
        {
          id: 'esg-dd.automated',
          name: 'Automated Assessment',
          href: '/esg-dd/automated',
          icon: FileText,
          level: 'submenu',
          parentId: 'esg-dd'
        },
        {
          id: 'esg-dd.cap',
          name: 'CAP Management',
          href: '/esg-dd/cap',
          icon: FileText,
          level: 'submenu',
          parentId: 'esg-dd'
        },
        {
          id: 'esg-dd.irl',
          name: 'IRL Assessment',
          href: '/esg-dd/irl',
          icon: FileText,
          level: 'submenu',
          parentId: 'esg-dd',
          children: [
            {
              id: 'esg-dd.irl.company',
              name: 'Company',
              href: '/esg-dd/irl#company',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.hr',
              name: 'HR',
              href: '/esg-dd/irl#hr',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.business',
              name: 'Business',
              href: '/esg-dd/irl#business',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.photographs',
              name: 'Photos',
              href: '/esg-dd/irl#photographs',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.compliance',
              name: 'Compliance',
              href: '/esg-dd/irl#compliance',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.management',
              name: 'Management',
              href: '/esg-dd/irl#management',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.itsecurity',
              name: 'IT Security',
              href: '/esg-dd/irl#itsecurity',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.warehouse',
              name: 'Warehouse',
              href: '/esg-dd/irl#warehouse',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.facility',
              name: 'Facility',
              href: '/esg-dd/irl#facility',
              level: 'tab',
              parentId: 'esg-dd.irl'
            },
            {
              id: 'esg-dd.irl.governance',
              name: 'Governance',
              href: '/esg-dd/irl#governance',
              level: 'tab',
              parentId: 'esg-dd.irl'
            }
          ]
        },
        {
          id: 'esg-dd.reports',
          name: 'Reports',
          href: '/esg-dd/reports',
          icon: FileText,
          level: 'submenu',
          parentId: 'esg-dd'
        }
      ]
    },

    // GHG Accounting
    {
      id: 'ghg-accounting',
      name: 'GHG Accounting',
      href: '/ghg-accounting',
      icon: LineChart,
      featureId: 'ghg-accounting',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor']
    },

    // Compliance
    {
      id: 'compliance',
      name: 'Compliance',
      href: '/compliance',
      icon: ClipboardCheck,
      featureId: 'compliance',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor']
    },

    // Audit
    {
      id: 'audit',
      name: 'Audit',
      href: '/audit',
      icon: FileText,
      featureId: 'audit',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor'],
      children: [
        {
          id: 'audit.supplier',
          name: 'Supplier Audits',
          href: '/audit/supplier',
          icon: Users,
          level: 'submenu',
          parentId: 'audit'
        },
        {
          id: 'audit.ehs',
          name: 'EHS Audits',
          href: '/audit/ehs',
          icon: ClipboardCheck,
          level: 'submenu',
          parentId: 'audit'
        },
        {
          id: 'audit.internal',
          name: 'Internal Audits',
          href: '/audit/internal',
          icon: Building2,
          level: 'submenu',
          parentId: 'audit'
        }
      ]
    },

    // LMS
    {
      id: 'lms',
      name: 'LMS',
      href: '/lms',
      icon: GraduationCap,
      featureId: 'lms',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor', 'portfolio_team_viewer']
    },

    // EHS Trainings
    {
      id: 'ehs-trainings',
      name: 'EHS Trainings',
      href: '/ehs-trainings',
      icon: Calendar,
      featureId: 'ehs-trainings',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor', 'portfolio_team_viewer']
    },

    // Reports
    {
      id: 'reports',
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      featureId: 'reports',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor'],
      children: [
        {
          id: 'reports.overview',
          name: 'Overview',
          href: '/reports',
          icon: FileText,
          level: 'submenu',
          parentId: 'reports'
        },
        {
          id: 'reports.brsr',
          name: 'BRSR Report',
          href: '/reports/brsr',
          icon: FileText,
          level: 'submenu',
          parentId: 'reports'
        },
        {
          id: 'reports.gri',
          name: 'GRI Report',
          href: '/reports/gri',
          icon: FileText,
          level: 'submenu',
          parentId: 'reports'
        },
        {
          id: 'reports.tcfd',
          name: 'TCFD Report',
          href: '/reports/tcfd',
          icon: FileText,
          level: 'submenu',
          parentId: 'reports'
        },
        {
          id: 'reports.impact',
          name: 'Impact Report',
          href: '/reports/impact',
          icon: FileText,
          level: 'submenu',
          parentId: 'reports'
        }
      ]
    },

    // Stakeholders
    {
      id: 'stakeholders',
      name: 'Stakeholders',
      href: '/stakeholders',
      icon: Users,
      featureId: 'stakeholder-management',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor'],
      children: [
        {
          id: 'stakeholders.overview',
          name: 'Overview',
          href: '/stakeholders',
          icon: Users,
          level: 'submenu',
          parentId: 'stakeholders'
        },
        {
          id: 'stakeholders.manage',
          name: 'Manage Stakeholders',
          href: '/stakeholders/manage',
          icon: Users,
          level: 'submenu',
          parentId: 'stakeholders'
        },
        {
          id: 'stakeholders.categories',
          name: 'Categories',
          href: '/stakeholders/categories',
          icon: Users,
          level: 'submenu',
          parentId: 'stakeholders'
        },
        {
          id: 'stakeholders.engagement',
          name: 'Engagement Plan',
          href: '/stakeholders/engagement',
          icon: Users,
          level: 'submenu',
          parentId: 'stakeholders'
        }
      ]
    },

    // Units
    {
      id: 'units',
      name: 'Units',
      href: '/units',
      icon: Building2,
      featureId: 'unit-management',
      level: 'main',
      allowedRoles: ['portfolio_company_admin']
    },

    // Team Management
    {
      id: 'team-management',
      name: 'Team Management',
      href: '/team-management',
      icon: Users,
      featureId: 'team-management',
      level: 'main',
      allowedRoles: ['portfolio_company_admin']
    },

    // Action Log
    {
      id: 'action-log',
      name: 'Action Log',
      href: '/action-log',
      icon: Activity,
      featureId: 'action-log',
      level: 'main',
      allowedRoles: ['portfolio_company_admin', 'portfolio_team_editor']
    },

    // Settings
    {
      id: 'settings',
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      featureId: 'settings',
      level: 'main',
      allowedRoles: ['portfolio_company_admin']
    }
  ];
};

// Utility functions
export const flattenNavigationItems = (items: DetailedNavigationItem[]): DetailedNavigationItem[] => {
  const flattened: DetailedNavigationItem[] = [];
  
  const flatten = (navItems: DetailedNavigationItem[]) => {
    navItems.forEach(item => {
      flattened.push(item);
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };
  
  flatten(items);
  return flattened;
};

export const findNavigationItemById = (items: DetailedNavigationItem[], id: string): DetailedNavigationItem | null => {
  const flattened = flattenNavigationItems(items);
  return flattened.find(item => item.id === id) || null;
};

export const getNavigationItemsByLevel = (items: DetailedNavigationItem[], level: 'main' | 'submenu' | 'tab'): DetailedNavigationItem[] => {
  const flattened = flattenNavigationItems(items);
  return flattened.filter(item => item.level === level);
};