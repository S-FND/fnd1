import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SpreadsheetKPITable } from './SpreadsheetKPITable';
import { GrievancesTable } from './GrievancesTable';
import { PackagingBasicTable } from './PackagingBasicTable';
import { PackagingDetailedTable } from './PackagingDetailedTable';
import { WaterManagementTable } from './WaterManagementTable';
import { WaterMetricsDetailedTable } from './WaterMetricsDetailedTable';
import { EnergyManagementBasicTable } from './EnergyManagementBasicTable';
import { EnergyManagementDetailedTable } from './EnergyManagementDetailedTable';
import { KPI, ESGCategory } from '@/types/esg';
import { Leaf, Users, Building2, AlertCircle, Layers, AlertTriangle, Droplets, Zap, PackageOpen, Package } from 'lucide-react';
import { useCompanyFeatures } from '@/hooks/useCompanyFeatures';
import { useAuth } from '@/context/AuthContext';
// import { useAuth } from '@/contexts/AuthContext';

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method: string | null;
}

interface QuarterlyKPITabsProps {
  kpis: KPI[];
  formData: Record<string, string | number | boolean>;
  onInputChange: (kpiId: string, value: string | number | boolean) => void;
  historicalData?: Record<string, HistoricalValue>;
  currentQuarter: string;
  currentYear: number;
}

// Tab configuration with icons and labels
const TAB_CONFIG = {
  environmental: {
    label: 'Environmental',
    icon: Leaf,
    color: 'text-esg-environmental',
    bgColor: 'bg-esg-environmental/10',
  },
  social: {
    label: 'Social',
    icon: Users,
    color: 'text-esg-social',
    bgColor: 'bg-esg-social/10',
  },
  governance: {
    label: 'Governance',
    icon: Building2,
    color: 'text-esg-governance',
    bgColor: 'bg-esg-governance/10',
  },
  incidentLog: {
    label: 'Incidents and Grievances',
    icon: AlertCircle,
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
  },
  grievances: {
    label: 'Grievances',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
  },
  packagingBasic: {
    label: 'Packaging (Basic)',
    icon: PackageOpen,
    color: 'text-esg-environmental',
    bgColor: 'bg-esg-environmental/10',
  },
  packagingDetailed: {
    label: 'Packaging (Detailed)',
    icon: Package,
    color: 'text-esg-environmental',
    bgColor: 'bg-esg-environmental/10',
  },
  waterDetailed: {
    label: 'Water (Detailed)',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  energyDetailed: {
    label: 'Energy (Detailed)',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  core2: {
    label: 'Core 2',
    icon: Layers,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  core3: {
    label: 'Core 3',
    icon: Layers,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

// Keywords to identify incident log KPIs (combines policies and incidents)
const INCIDENT_LOG_KEYWORDS = [
  // Incident-related
  'incident', 'incidents', 'accident', 'accidents', 'injury', 'injuries',
  'fatality', 'fatalities', 'grievance', 'grievances', 'complaint', 'complaints',
  'violation', 'violations', 'breach', 'breaches', 'issue', 'issues',
  'resolved', 'logged', 'reported', 'cases', 'dispute', 'disputes',
  // Policy-related
  'policy', 'policies', 'whistleblower', 'anti-corruption', 'anti-bribery',
  'code of conduct', 'ethics', 'compliance', 'guidelines', 'framework',
  'certification', 'certified', 'accreditation', 'iso', 'standard'
];

// Keywords for KPIs that should be in Governance (even if ESG is 'S')
const GOVERNANCE_OVERRIDE_KEYWORDS = [
  'leadership', 'leader', 'ceo', 'cfo', 'cto', 'coo', 'founder', 'director',
  'board', 'executive', 'management team', 'c-suite',
  'intellectual property', 'ip', 'patent', 'trademark', 'copyright'
];

// Keywords for KPIs that should be excluded from Environmental tab (handled by feature modules)
const PACKAGING_EXCLUSION_KEYWORDS = [
  'packaging', 'package', 'plastic packaging', 'primary packaging', 'secondary packaging',
  'tertiary packaging', 'recyclable plastic', 'recycled plastic', 'non-recyclable plastic',
  'epr', 'epr compliance', 'plastic waste'
];

export const QuarterlyKPITabs = ({
  kpis,
  formData,
  onInputChange,
  historicalData = {},
  currentQuarter,
  currentYear,
}: QuarterlyKPITabsProps) => {
  const { user } = useAuth();
  const companyId = user?.companyId || 'company-1';
  const { isFeatureEnabled } = useCompanyFeatures(companyId);
  const [activeTab, setActiveTab] = useState<string>('environmental');

  // Categorize KPIs into different tabs
  const categorizedKPIs = useMemo(() => {
    const result: Record<string, KPI[]> = {
      environmental: [],
      social: [],
      governance: [],
      incidentLog: [],
      core2: [],
      core3: [],
    };

    kpis.forEach((kpi) => {
      const nameLower = kpi.name.toLowerCase();
      const categoryLower = (kpi.category || '').toLowerCase();
      const subCategoryLower = (kpi.subCategory || '').toLowerCase();
      const definitionLower = (kpi.definition || '').toLowerCase();
      const searchText = `${nameLower} ${categoryLower} ${subCategoryLower} ${definitionLower}`;

      // Optional KPIs (coreLevel 2) go to their own tab
      if (kpi.coreLevel === 2) {
        result.core2.push(kpi);
        return;
      }

      // Check for incident log KPIs (combines policies and incidents)
      if (INCIDENT_LOG_KEYWORDS.some((keyword) => searchText.includes(keyword))) {
        result.incidentLog.push(kpi);
        return;
      }

      // Check for governance-override KPIs (leadership, IP) before ESG categorization
      if (GOVERNANCE_OVERRIDE_KEYWORDS.some((keyword) => searchText.includes(keyword))) {
        result.governance.push(kpi);
        return;
      }
      // Skip packaging-related KPIs from Environmental (they go to dedicated feature modules)
      if (kpi.esg === 'E' && PACKAGING_EXCLUSION_KEYWORDS.some((keyword) => searchText.includes(keyword))) {
        return; // Skip - handled by Packaging Metrics feature modules
      }

      // Categorize by ESG type
      switch (kpi.esg) {
        case 'E':
          result.environmental.push(kpi);
          break;
        case 'S':
          result.social.push(kpi);
          break;
        case 'G':
          result.governance.push(kpi);
          break;
        default:
          result.environmental.push(kpi);
      }
    });

    return result;
  }, [kpis]);

  // Get available tabs (only show tabs that have KPIs, plus custom feature tabs if enabled)
  const availableTabs = useMemo(() => {
    const tabs = Object.entries(categorizedKPIs)
      .filter(([, kpiList]) => kpiList.length > 0)
      .map(([key]) => key);
    
    // Add feature-based tabs if enabled (these are custom UI, not KPI-driven)
    if (isFeatureEnabled('grievances') && !tabs.includes('grievances')) {
      tabs.push('grievances');
    }
    if (isFeatureEnabled('packagingBasic') && !tabs.includes('packagingBasic')) {
      tabs.push('packagingBasic');
    }
    if (isFeatureEnabled('packagingDetailed') && !tabs.includes('packagingDetailed')) {
      tabs.push('packagingDetailed');
    }
    if (isFeatureEnabled('waterDetailed') && !tabs.includes('waterDetailed')) {
      tabs.push('waterDetailed');
    }
    if (isFeatureEnabled('energyDetailed') && !tabs.includes('energyDetailed')) {
      tabs.push('energyDetailed');
    }
    
    return tabs;
  }, [categorizedKPIs, isFeatureEnabled]);

  // Set initial active tab to first available
  useMemo(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  // Check if any feature-based tabs are enabled
  const hasFeatureTabs = isFeatureEnabled('grievances') || 
                          isFeatureEnabled('packagingBasic') || 
                          isFeatureEnabled('packagingDetailed') ||
                          isFeatureEnabled('waterDetailed') ||
                          isFeatureEnabled('energyDetailed');

  // Show message only if no KPIs and custom features are also disabled
  if (kpis.length === 0 && !hasFeatureTabs) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No quarterly KPIs available for the selected profile.
      </div>
    );
  }

  // Define tab order for display
  const tabOrder = ['environmental', 'social', 'governance', 'incidentLog', 'packagingBasic', 'packagingDetailed', 'waterDetailed', 'energyDetailed', 'grievances', 'core2', 'core3'];
  const orderedTabs = tabOrder.filter(tab => availableTabs.includes(tab));

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b border-border mb-6">
        <TabsList className="h-auto p-0 bg-transparent gap-0">
          {orderedTabs.map((tabKey) => {
            const config = TAB_CONFIG[tabKey as keyof typeof TAB_CONFIG];
            const Icon = config.icon;
            const isCustomTab = ['grievances', 'packagingBasic', 'packagingDetailed', 'waterDetailed', 'energyDetailed'].includes(tabKey);
            const count = isCustomTab ? null : (categorizedKPIs[tabKey]?.length || 0);
            const isActive = activeTab === tabKey;

            return (
              <TabsTrigger
                key={tabKey}
                value={tabKey}
                className={`
                  relative flex items-center gap-2 px-4 py-3 rounded-none border-b-2 
                  transition-all duration-200
                  ${isActive 
                    ? 'border-primary bg-transparent text-foreground font-medium' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                  data-[state=active]:shadow-none
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? config.color : 'text-muted-foreground'}`} />
                <span>{config.label}</span>
                {count !== null && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs h-5 min-w-[24px] justify-center ${isActive ? config.bgColor + ' border-0' : 'bg-muted/50'}`}
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {orderedTabs.map((tabKey) => {
        const config = TAB_CONFIG[tabKey as keyof typeof TAB_CONFIG];
        const tabKPIs = categorizedKPIs[tabKey] || [];
        const isCustomFeatureTab = ['grievances', 'packagingBasic', 'packagingDetailed', 'waterDetailed', 'energyDetailed'].includes(tabKey);

        return (
          <TabsContent key={tabKey} value={tabKey} className="mt-0">
            {tabKey === 'grievances' ? (
              <GrievancesTable formData={formData} onInputChange={onInputChange} />
            ) : tabKey === 'packagingBasic' ? (
              <PackagingBasicTable formData={formData} onInputChange={onInputChange} />
            ) : tabKey === 'packagingDetailed' ? (
              <PackagingDetailedTable formData={formData} onInputChange={onInputChange} />
            ) : tabKey === 'waterDetailed' ? (
              <WaterMetricsDetailedTable formData={formData} onInputChange={onInputChange} />
            ) : tabKey === 'energyDetailed' ? (
              <EnergyManagementDetailedTable formData={formData} onInputChange={onInputChange} />
            ) : (
              <SpreadsheetKPITable
                kpis={tabKPIs}
                formData={formData}
                onInputChange={onInputChange}
                historicalData={historicalData}
                title={`${config.label} • ${currentQuarter} ${currentYear}`}
              />
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
