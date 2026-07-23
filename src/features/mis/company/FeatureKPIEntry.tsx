import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { FeatureProgressBar } from '@/components/FeatureProgressBar';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAutoSaveKPI } from '@/hooks/useAutoSaveKPI';
import { mockCompanies } from '@/data/mockData';
import { QUARTERLY_FEATURES, ANNUAL_FEATURES, useCompanyFeatures } from '@/hooks/useCompanyFeatures';
import { useCompanyKPIOverrides } from '@/hooks/useCompanyKPIOverrides';
import { KPIHistoryTable } from '@/components/kpi-tables/KPIHistoryTable';
import { PeriodSelector } from '@/components/PeriodSelector';
import { AdditionalCommentsSection } from '@/components/kpi-tables/AdditionalCommentsSection';
import { EditPausedBanner } from '@/components/EditPausedBanner';
import { isPeriodEditable } from '@/lib/companyAccessControl';
import {
  QuarterlyKPITabs,
  CertificationsTable,
  SourcingFulfilmentTable,
  GovernancePoliciesTable,
  OperationsTable,
  SRITable,
} from '@/components/kpi-tables';
import { EnergyManagementDetailedTable } from '@/components/kpi-tables/EnergyManagementDetailedTable';
import { EmployeesTable } from '@/components/kpi-tables/EmployeesTable';
import { LeadershipTable } from '@/components/kpi-tables/LeadershipTable';
import { PackagingDetailedWithTertiary } from '@/components/kpi-tables/PackagingDetailedWithTertiary';
import { FoodBPCNutraPackagingBasic } from '@/components/kpi-tables/FoodBPCNutraPackagingBasic';
import { FoodBPCNutraPackagingDetailed } from '@/components/kpi-tables/FoodBPCNutraPackagingDetailed';
import { FashionPackagingBasic } from '@/components/kpi-tables/FashionPackagingBasic';
import { FashionPackagingDetailed } from '@/components/kpi-tables/FashionPackagingDetailed';
import { IncidentsTable } from '@/components/kpi-tables/IncidentsTable';
import { GrievancesTable } from '@/components/kpi-tables/GrievancesTable';
import { ProductServiceCertificationsTable } from '@/components/kpi-tables/ProductServiceCertificationsTable';
import { CSRTable } from '@/components/kpi-tables/CSRTable';
import { WaterManagementDetailedTable } from '@/components/kpi-tables/WaterManagementDetailedTable';
import { WasteManagementTable } from '@/components/kpi-tables/WasteManagementTable';
import { BusinessInformationTable } from '@/components/kpi-tables/BusinessInformationTable';
import { FashionMaterialsTable } from '@/components/kpi-tables/FashionMaterialsTable';
import { ExternalReportingTable } from '@/components/kpi-tables/ExternalReportingTable';
import { HealthCareTable } from '@/components/kpi-tables/HealthCareTable';
import { KPI, ESGCategory, CoreLevel, RevenueStage, Industry, KPIIndustry, mapIndustryToKPIIndustries, FeatureModule } from '@/types/esg';
import {
  ArrowLeft,
  Loader2,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Info,
  AlertTriangle,
  Calendar,
  Download,
  Upload,
  Send,
  Lock,
} from 'lucide-react';
import { downloadCompanyKPITemplate } from '@/lib/companyKPITemplate';
import { downloadFeatureTemplate, hasFeatureKPIs } from '@/lib/featureKPITemplate';
import { UploadKPITemplateDialog } from '@/components/UploadKPITemplateDialog';
import { UploadFeatureTemplateDialog } from '@/components/UploadFeatureTemplateDialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { httpClient } from '@/lib/httpClient';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';

// Helper to convert database KPI to app KPI type
interface DBKPIMaster {
  id: string;
  name: string;
  esg: string;
  category: string;
  sub_category: string | null;
  metric_type: string | null;
  period: string | null;
  definition: string | null;
  frequency: string | null;
  core_level: string | null;
  revenue_stages: string[] | null;
  industries: string[] | null;
  is_custom: boolean | null;
  created_at: string;
  target_companies: string[] | null;
  feature_module: string | null;
}

const dbToKPI = (row: DBKPIMaster): KPI => {
  const parseCoreLevel = (level: string | null): CoreLevel => {
    if (!level) return 1;
    const normalized = level.toLowerCase();
    if (normalized.includes('mandatory') || normalized.includes('core 1')) return 1;
    return 2; // Everything else maps to Optional
  };

  return {
    id: row.id,
    name: row.name,
    esg: row.esg as ESGCategory,
    category: row.category,
    subCategory: row.sub_category || '',
    metricType: row.metric_type || '',
    period: (row.period === 'Annual' ? 'Annual' : 'Quarterly') as 'Quarterly' | 'Annual',
    definition: row.definition || '',
    frequency: row.frequency || row.period || 'Quarterly',
    revenueStages: (row.revenue_stages || []) as RevenueStage[],
    industries: (row.industries || []) as KPIIndustry[],
    coreLevel: parseCoreLevel(row.core_level),
    createdAt: row.created_at,
    quarter: 'Q4',
    year: 2024,
    targetCompanies: row.target_companies || undefined,
    featureModule: row.feature_module as FeatureModule | undefined,
  };
};

const getCurrentFinancialYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 3 ? year : year - 1;
};

interface HistoricalEntry {
  quarter: string;
  value: string | null;
  confidence: number;
}

const FeatureKPIEntry = () => {
  const { user, companyName, effectiveCompanyId, isAdmin, isFandoro, isCompanyReadOnly } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const companyId = effectiveCompanyId || user?.company_id;

  useEffect(() => {
    console.log('Auth context values in FeatureKPIEntry:', { user, effectiveCompanyId, companyId });
  }, [effectiveCompanyId, user]);
  const featureKey = searchParams.get('feature') || '';
  const tabType = searchParams.get('tab') as 'quarterly' | 'annual' || 'quarterly';
  const isAnnual = tabType === 'annual';

  // Read quarter/year from URL params if available.
  // Default to the open period (Q1 / JFM 2026) so company users land on the editable quarter.
  const urlQuarter = searchParams.get('quarter');
  const urlYear = searchParams.get('year');

  // Period selection state - initialize from URL params
  const selectedQuarter = urlQuarter || (isAnnual ? 'Q4' : 'Q1');
  const selectedYear = urlYear ? parseInt(urlYear) : (isAnnual ? 2025 : 2026);

  // For annual KPIs, use the URL year param or fall back to FY 2025 (FY 2026 not yet open).
  const currentFY = isAnnual
    ? (urlYear ? parseInt(urlYear) : 2025)
    : getCurrentFinancialYear();

  // For data fetching, use selected quarter/year
  const currentQuarter = selectedQuarter;
  const currentYear = selectedYear;

  // Period-aware read-only: only Q1 2026 (quarterly) is editable. Everything else
  // — all 2025 periods, FY 2025, FY 2026 — is locked for everyone.
  // We also still respect the company-level role lock from AuthContext.
  const periodToCheck = isAnnual ? 'FY' : currentQuarter;
  const yearToCheck = isAnnual ? currentFY : currentYear;
  const periodLocked = !isPeriodEditable(periodToCheck, yearToCheck);
  let unlockIds: string[] = ['NEWME', 'SUPTAILS', 'RIPPLR', 'ILUVIA', 'GOODBUG', 'TERRACTIV', 'SAMMMMBT'];
  // const readOnly = user && (user.misCompanyId == 'NEWME' || unlockIds.includes(user.misCompanyId)) ? false : isCompanyReadOnly || periodLocked;
  // We can comment this because the feature isn't ready yet to handle closed submissions.
  const readOnly = true;


  // Handle quarter change - update URL and redirect if needed
  const handleQuarterChange = useCallback((newQuarter: string) => {
    // If we're on an annual feature and switching away from Q4, redirect to data-entry page
    if (isAnnual && newQuarter !== 'Q4') {
      // Annual features are only available in Q4 - redirect to data entry
      navigate(`/mis/data-entry?quarter=${newQuarter}&year=${selectedYear}`);
      return;
    }
    // Update URL with new quarter, keeping the rest of the params
    navigate(`/mis/kpi-entry?tab=${tabType}&feature=${featureKey}&quarter=${newQuarter}&year=${selectedYear}`);
  }, [isAnnual, navigate, tabType, featureKey, selectedYear]);

  // Handle year change - update URL
  const handleYearChange = useCallback((newYear: number) => {
    navigate(`/mis/kpi-entry?tab=${tabType}&feature=${featureKey}&quarter=${selectedQuarter}&year=${newYear}`);
  }, [navigate, tabType, featureKey, selectedQuarter]);

  // Find feature info
  const featureInfo = [...QUARTERLY_FEATURES, ...ANNUAL_FEATURES].find(f => f.key === featureKey);

  // Check if feature is marked as optional for this company
  const { isFeatureOptional } = useCompanyFeatures(companyId);
  const isCurrentFeatureOptional = isFeatureOptional(featureKey);

  // Get KPI overrides for this company
  const { getEffectiveCoreLevel, isLoading: isLoadingOverrides } = useCompanyKPIOverrides(companyId);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [allKPIs, setAllKPIs] = useState<KPI[]>([]);
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  const [historicalData, setHistoricalData] = useState<Record<string, HistoricalEntry[]>>({});
  const [companyProfile, setCompanyProfile] = useState<{ revenueStage: RevenueStage; industry: Industry } | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset form data when feature/period changes - but only set loading if we have KPIs to fetch
  useEffect(() => {
    setFormData({});
    setCollapsedCategories(new Set());
    setLastSaved(null);
    setHasUnsavedChanges(false);
    // Only set loading to true if we have KPIs loaded, otherwise loadEntries will handle it
    if (allKPIs.length > 0) {
      setIsLoading(true);
    }
  }, [featureKey, currentQuarter, currentYear, allKPIs.length]);

  // Auto-initialize governance ref (moved after queueSave declaration below)
  const hasInitializedGovRef = useRef(false);

  // Auto-save hook - pass featureKey for Sourcing & Fulfillment cross-quarter pre-fill
  const { queueSave } = useAutoSaveKPI({
    companyId,
    quarter: currentQuarter,
    year: isAnnual ? currentFY : currentYear,
    isAnnual,
    debounceMs: 1500,
    featureKey,
  });

  // Auto-initialize governance policy boolean fields so "No" counts as a response
  useEffect(() => {
    if (featureKey !== 'governancePolicies' || isLoading || hasInitializedGovRef.current) return;

    const GOVERNANCE_POLICIES = [
      'posh', 'code_of_conduct', 'supplier_code_of_conduct', 'health_and_safety',
      'dei', 'hr', 'human_rights', 'esg', 'environment',
      'grievance_internal', 'grievance_external', 'data_protection',
    ];
    const BOOL_FIELDS = ['in_place', 'training'];

    let needsSave = false;
    const updates: Record<string, boolean> = {};

    for (const policy of GOVERNANCE_POLICIES) {
      for (const field of BOOL_FIELDS) {
        const key = `policy_${policy}_${field}`;
        if (formData[key] === undefined) {
          updates[key] = false;
          needsSave = true;
        }
      }
    }

    if (needsSave) {
      hasInitializedGovRef.current = true;
      setFormData(prev => ({ ...prev, ...updates }));
      Object.entries(updates).forEach(([key, value]) => {
        queueSave(key, value);
      });
    } else {
      hasInitializedGovRef.current = true;
    }
  }, [featureKey, isLoading, formData, queueSave]);

  // Reset governance initialization flag when feature changes
  useEffect(() => {
    hasInitializedGovRef.current = false;
  }, [featureKey, currentQuarter, currentYear]);

  // Load company profile - fall back to mock data if not in database
  useEffect(() => {
    const loadProfile = async () => {
      // const { data, error } = await supabase
      //   .from('company_profiles')
      //   .select('revenue_stage, industry')
      //   .eq('company_id', companyId)
      //   .maybeSingle();
      // debugger;
      const data: {
        data: {
          revenue_stage: RevenueStage;
          industry: Industry;
        },
        status: number;

      } = await httpClient.get(`mis/company-profiles?companyId=${companyId}`)

      if (!data.status || data.status !== 200) throw new Error('Failed to load company profile');



      if (data && data.data) {
        setCompanyProfile({
          revenueStage: data.data.revenue_stage as RevenueStage,
          industry: data.data.industry as Industry,
        });
      } else {
        // Fallback to mock data for companies not yet in database
        const mockCompany = mockCompanies.find(c => c.id === companyId);
        if (mockCompany) {
          setCompanyProfile({
            revenueStage: mockCompany.revenueStage as RevenueStage,
            industry: mockCompany.industry as Industry,
          });
        }
      }
    };
    if (companyId) {
      loadProfile();
    }
  }, [companyId]);

  // Load KPIs from database
  useEffect(() => {
    const loadKPIs = async () => {
      try {
        // const { data, error } = await supabase
        //   .from('kpi_master')
        //   .select('*')
        //   .order('created_at', { ascending: true });
        const data: { data: DBKPIMaster[]; } = await httpClient.get('mis/kpi-masters');
        // debugger;
        if (data) {
          const mappedKPIs = (data.data as DBKPIMaster[]).map(dbToKPI);
          setAllKPIs(mappedKPIs);
        }
      } catch (error) {
        console.error('Error loading KPIs:', error);
      }
    };

    loadKPIs();
  }, []);

  // Load saved KPI entries (with pre-fill from last year for annual KPIs or previous quarter for Sourcing & Fulfillment)
  useEffect(() => {
    const loadEntries = async () => {
      // If no KPIs loaded yet, wait for them
      if (allKPIs.length === 0) {
        return;
      }

      setIsLoading(true);

      try {
        // For annual KPIs, determine the target year
        const targetYear = isAnnual ? currentFY : currentYear;
        const targetQuarter = isAnnual ? 'FY' : currentQuarter;

        // const { data, error } = await supabase
        //   .from('kpi_entries')
        //   .select('kpi_id, value')
        //   .eq('company_id', companyId)
        //   .eq('quarter', targetQuarter)
        //   .eq('year', targetYear);
        const data: { data: { kpi_id: string; value: string | null }[]; error?: any } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=${targetQuarter}&year=${targetYear}`);

        // if (error) throw error;

        if (data && data.data.length > 0) {
          const entries: Record<string, string | number | boolean> = {};
          data.data.forEach(entry => {
            if (entry.value !== null) {
              if (entry.value === 'true') {
                entries[entry.kpi_id] = true;
              } else if (entry.value === 'false') {
                entries[entry.kpi_id] = false;
              } else {
                entries[entry.kpi_id] = entry.value;
              }
            }
          });
          setFormData(entries);
        }
        // } else if (isAnnual) {
        //   // For annual KPIs with no current data, try to pre-fill from last year
        //   const lastYear = currentFY - 1;
        //   // const { data: lastYearData, error: lastYearError } = await supabase
        //   //   .from('kpi_entries')
        //   //   .select('kpi_id, value')
        //   //   .eq('company_id', companyId)
        //   //   .eq('quarter', 'FY')
        //   //   .eq('year', lastYear);
        //   const lastYearData: { data: { kpi_id: string; value: string | null }[]; error?: any } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=FY&year=${lastYear}`);

        //   if (lastYearData && lastYearData.data.length > 0) {
        //     const entries: Record<string, string | number | boolean> = {};
        //     lastYearData.data.forEach(entry => {
        //       if (entry.value !== null) {
        //         if (entry.value === 'true') {
        //           entries[entry.kpi_id] = true;
        //         } else if (entry.value === 'false') {
        //           entries[entry.kpi_id] = false;
        //         } else {
        //           entries[entry.kpi_id] = entry.value;
        //         }
        //       }
        //     });
        //     setFormData(entries);
        //     // Mark as having unsaved changes since this is pre-filled data
        //     if (Object.keys(entries).length > 0) {
        //       setHasUnsavedChanges(true);
        //     }
        //   } else {
        //     setFormData({});
        //   }
        // } else if (!isAnnual && currentQuarter === 'Q1' && currentYear === 2026) {
        //   // Q1 2026 (JFM 2026) is the newly opened quarter. If the company has
        //   // no entries yet for this period, pre-fill from the same KPIs they
        //   // submitted in Q4 2025 (OND 2025) so they only need to update changes.
        //   // const { data: prevQData, error: prevQErr } = await supabase
        //   //   .from('kpi_entries')
        //   //   .select('kpi_id, value')
        //   //   .eq('company_id', companyId)
        //   //   .eq('quarter', 'Q4')
        //   //   .eq('year', 2025);
        //   const prevQData: { data: { kpi_id: string; value: string | null }[]; error?: any } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=Q4&year=2025`);

        //   if (prevQData && prevQData.data.length > 0) {
        //     const entries: Record<string, string | number | boolean> = {};
        //     prevQData.data.forEach(entry => {
        //       if (entry.value !== null) {
        //         if (entry.value === 'true') entries[entry.kpi_id] = true;
        //         else if (entry.value === 'false') entries[entry.kpi_id] = false;
        //         else entries[entry.kpi_id] = entry.value;
        //       }
        //     });
        //     setFormData(entries);
        //     // Mark dirty so the company sees their pre-filled data persists on save.
        //     if (Object.keys(entries).length > 0) {
        //       setHasUnsavedChanges(true);
        //     }
        //   } else {
        //     setFormData({});
        //   }
        // } else if (featureKey === 'sourcingFulfillment' && (!data || data.data.length === 0)) {
        //   // For Sourcing & Fulfillment with no current quarter data, pre-fill from previous quarter in same FY
        //   // Quarter order: Q1, Q2, Q3, Q4. Current year is Apr-Mar FY.
        //   const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
        //   const currentQIndex = quarterOrder.indexOf(currentQuarter);

        //   // Try previous quarters in reverse order (most recent first)
        //   let preFillData: Record<string, string | number | boolean> = {};

        //   for (let i = currentQIndex - 1; i >= 0; i--) {
        //     const prevQuarter = quarterOrder[i];
        //     // const { data: prevData, error: prevError } = await supabase
        //     //   .from('kpi_entries')
        //     //   .select('kpi_id, value')
        //     //   .eq('company_id', companyId)
        //     //   .eq('quarter', prevQuarter)
        //     //   .eq('year', currentYear)
        //     //   .like('kpi_id', '%vendor_%')
        //     //   .or('kpi_id.like.%msme_%,kpi_id.like.%logistics_%,kpi_id.like.%sourcing_%');
        //     const prevData: { data: { kpi_id: string; value: string | null }[]; error?: any } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=${prevQuarter}&year=${currentYear}&kpi_id=vendor_%25&or=kpi_id.like.%25msme_%25,kpi_id.like.%25logistics_%25,kpi_id.like.%25sourcing_%25`);

        //     if (prevData && prevData.data.length > 0) {
        //       prevData.data.forEach(entry => {
        //         if (entry.value !== null && !preFillData[entry.kpi_id]) {
        //           if (entry.value === 'true') {
        //             preFillData[entry.kpi_id] = true;
        //           } else if (entry.value === 'false') {
        //             preFillData[entry.kpi_id] = false;
        //           } else {
        //             preFillData[entry.kpi_id] = entry.value;
        //           }
        //         }
        //       });
        //       // Found data from a previous quarter, use it
        //       if (Object.keys(preFillData).length > 0) {
        //         break;
        //       }
        //     }
        //   }

        //   if (Object.keys(preFillData).length > 0) {
        //     setFormData(preFillData);
        //     setHasUnsavedChanges(true);
        //   } else {
        //     setFormData({});
        //   }
        // } 
        else {
          // Clear form data if no entries found for this period
          setFormData({});
        }
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [companyId, allKPIs.length, isAnnual, currentFY, currentQuarter, currentYear, featureKey]);

  // Load historical data (from both historical_kpi_entries and kpi_entries for previous quarters)
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (allKPIs.length === 0) return;

      try {
        const historicalMap: Record<string, HistoricalEntry[]> = {};

        // 1. Load from historical_kpi_entries table (AI-matched historical uploads)
        // const { data: historicalData, error: historicalError } = await supabase
        //   .from('historical_kpi_entries')
        //   .select('matched_kpi_id, original_value, quarter, match_confidence')
        //   .eq('company_id', companyId)
        //   .not('matched_kpi_id', 'is', null)
        //   .order('quarter', { ascending: false });
        const historicalData: { data: { matched_kpi_id: string; original_value: string | null; quarter: string; match_confidence: number | null }[]; error?: any } = await httpClient.get(`mis/historical-kpi-entries?companyId=${companyId}&matched_kpi_id=not.is.null&order=quarter.desc`);


        // if (historicalError) throw historicalError;

        if (historicalData && historicalData.data.length > 0) {
          for (const entry of historicalData.data) {
            if (entry.matched_kpi_id && entry.original_value) {
              if (!historicalMap[entry.matched_kpi_id]) {
                historicalMap[entry.matched_kpi_id] = [];
              }
              historicalMap[entry.matched_kpi_id].push({
                quarter: entry.quarter,
                value: entry.original_value,
                confidence: entry.match_confidence || 0,
              });
            }
          }
        }

        // 2. Also load from kpi_entries for previous quarters (uploaded template data)
        // Get previous quarter entries (not the current one being edited)
        const previousEntries: { data: { kpi_id: string; value: string | null; quarter: string; year: number }[]; error?: any } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&value=not.is.null&order=year.desc`);
        // const { data: previousEntries, error: previousError } = await supabase
        //   .from('kpi_entries')
        //   .select('kpi_id, value, quarter, year')
        //   .eq('company_id', companyId)
        //   .not('value', 'is', null)
        //   .order('year', { ascending: false })
        // .order('quarter', { ascending: false });

        // if (previousError) throw previousError;

        if (previousEntries && previousEntries.data.length > 0) {
          for (const entry of previousEntries.data) {
            // Skip current period entries
            const isCurrentPeriod = isAnnual
              ? entry.quarter === 'FY' && entry.year === currentFY
              : entry.quarter === currentQuarter && entry.year === currentYear;

            if (isCurrentPeriod) continue;

            if (entry.kpi_id && entry.value) {
              if (!historicalMap[entry.kpi_id]) {
                historicalMap[entry.kpi_id] = [];
              }

              // Check if this quarter already exists
              const quarterLabel = entry.quarter === 'FY'
                ? `FY ${entry.year}-${(entry.year + 1).toString().slice(-2)}`
                : `${entry.quarter} ${entry.year}-${(entry.year + 1).toString().slice(-2)}`;

              const exists = historicalMap[entry.kpi_id].some(h => h.quarter === quarterLabel);
              if (!exists) {
                historicalMap[entry.kpi_id].push({
                  quarter: quarterLabel,
                  value: entry.value,
                  confidence: 1, // Direct entries have 100% confidence
                });
              }
            }
          }

          // Sort each KPI's historical entries by quarter (most recent first)
          Object.keys(historicalMap).forEach(kpiId => {
            historicalMap[kpiId].sort((a, b) => {
              // Extract year from quarter string for sorting
              const getYearFromQuarter = (q: string) => {
                const match = q.match(/(\d{4})/);
                return match ? parseInt(match[1]) : 0;
              };
              const getQFromQuarter = (q: string) => {
                if (q.startsWith('FY')) return 5; // FY comes after Q4
                const qMatch = q.match(/Q(\d)/);
                return qMatch ? parseInt(qMatch[1]) : 0;
              };
              const yearA = getYearFromQuarter(a.quarter);
              const yearB = getYearFromQuarter(b.quarter);
              if (yearB !== yearA) return yearB - yearA;
              return getQFromQuarter(b.quarter) - getQFromQuarter(a.quarter);
            });
            // Keep only last 2 quarters
            historicalMap[kpiId] = historicalMap[kpiId].slice(0, 2);
          });
        }

        setHistoricalData(historicalMap);
      } catch (error) {
        console.error('Error loading historical data:', error);
      }
    };

    loadHistoricalData();
  }, [companyId, allKPIs, isAnnual, currentFY, currentQuarter, currentYear]);

  // Map feature keys to ESG categories or feature modules
  const getFeatureFilter = (feature: string): { esg?: ESGCategory; featureModule?: string; category?: string } => {
    const featureMap: Record<string, { esg?: ESGCategory; featureModule?: string; category?: string }> = {
      // Quarterly features
      environmental: { esg: 'E' },
      social: { esg: 'S' },
      governance: { esg: 'G' },

      packaging: { featureModule: 'packaging' },
      packagingBasic: { featureModule: 'packagingBasic' },
      packagingDetailed: { featureModule: 'packagingDetailed' },
      primarySecondaryPackaging: { featureModule: 'primarySecondaryPackaging' },
      waterDetailed: { featureModule: 'waterDetailed' },
      energyDetailed: { featureModule: 'energyDetailed' },
      wasteDetailed: { featureModule: 'wasteDetailed' },
      incidentLog: { featureModule: 'incidentLog' },
      policies: { featureModule: 'policies' },

      productServiceCertifications: { featureModule: 'productServiceCertifications' },
      csr: { featureModule: 'csr' },
      // Annual features
      certifications: { featureModule: 'certifications' },
      sourcingFulfillment: { featureModule: 'sourcingFulfillment' },
      operations: { featureModule: 'operations' },
      governancePolicies: { featureModule: 'governancePolicies' },
      sri: { featureModule: 'sri' },
    };
    console.log('Feature filter for', feature, ':', featureMap[feature]);
    return featureMap[feature] || {};
  };

  // Filter applicable KPIs
  const applicableKPIs = useMemo(() => {
    if (!companyProfile) return [];

    const kpiIndustries = mapIndustryToKPIIndustries(companyProfile.industry);
    const featureFilter = getFeatureFilter(featureKey);

    // Specialized feature modules that contain mixed quarterly/annual KPIs
    const specializedModules = [
      'packagingBasic', 'packagingDetailed', 'primarySecondaryPackaging', 'waterDetailed', 'energyDetailed',
      'wasteDetailed', 'incidentLog', 'policies', 'grievances',
      'certifications', 'sourcingFulfillment', 'operations', 'governancePolicies', 'sri',
      'productServiceCertifications', 'csr'
    ];


    // Categories to INCLUDE in Social/Employment and Wages feature - includes Leadership
    const allowedSocialCategories = ['Employees', 'Leadership'];

    const isSpecializedModule = featureFilter.featureModule && specializedModules.includes(featureFilter.featureModule);

    // Auto-calculated fields - these will be shown but not editable
    const autoCalculatedFields = [
      'Total White-Collar Gross Wages',
      'Total White-Collar Employees',
      'Total Blue-Collar Gross Wages',
      'Total Blue-Collar Employees'
    ];

    return allKPIs.filter(kpi => {
      if (!Array.isArray(kpi.industries)) {
        kpi.industries = JSON.parse(kpi.industries as unknown as string) as KPIIndustry[];
      }
      // Check revenue stage and industry
      const matchesProfile = kpi.revenueStages.includes(companyProfile.revenueStage) &&
        kpi.industries.some(ind => kpiIndustries.includes(ind));

      if (!matchesProfile) return false;

      // Check company-specific
      if (kpi.targetCompanies && kpi.targetCompanies.length > 0) {
        if (!kpi.targetCompanies.includes(companyId)) return false;
      }

      // Filter by feature - ESG category OR feature module
      if (featureFilter.esg) {
        // For ESG-based features (Environmental, Social, Governance)
        // Apply period filter for ESG-based features
        if (isAnnual && kpi.period !== 'Annual') return false;
        if (!isAnnual && kpi.period !== 'Quarterly') return false;

        // Only include KPIs that match the ESG AND don't have a specific feature module assigned
        if (kpi.esg !== featureFilter.esg) return false;
        if (kpi.featureModule && !['environmental', 'social', 'governance'].includes(kpi.featureModule)) {
          return false; // This KPI belongs to a specialized module
        }

        // For Social feature, only include specific categories (Employees + Leadership)
        if (featureFilter.esg === 'S' && !allowedSocialCategories.includes(kpi.category)) {
          return false;
        }
      } else if (featureFilter.featureModule) {
        // For specialized feature modules
        const matchesModule = kpi.featureModule === featureFilter.featureModule;

        // Special case: Water Metrics (Detailed) should include Water Management category
        const isWaterDetailedWithWaterMgmt = featureFilter.featureModule === 'waterDetailed' &&
          (kpi.category === 'Water Management' || kpi.featureModule === 'waterDetailed');

        // Special case: Energy Management (Detailed) should include Energy Consumption category
        const isEnergyDetailedWithEnergy = featureFilter.featureModule === 'energyDetailed' &&
          (kpi.category === 'Energy Consumption' || kpi.featureModule === 'energyDetailed');

        if (!matchesModule && !isWaterDetailedWithWaterMgmt && !isEnergyDetailedWithEnergy) {
          return false;
        }
      } else {
        // Fallback - apply period filter
        if (isAnnual && kpi.period !== 'Annual') return false;
        if (!isAnnual && kpi.period !== 'Quarterly') return false;
      }

      return true;
    }).map(kpi => {
      // Apply effective core level (considering overrides)
      const effectiveLevel = getEffectiveCoreLevel(kpi);
      if (effectiveLevel !== kpi.coreLevel) {
        return { ...kpi, coreLevel: effectiveLevel };
      }
      return kpi;
    });
  }, [allKPIs, companyProfile, isAnnual, companyId, featureKey, getEffectiveCoreLevel]);

  // Handle input change with auto-save (disabled in read-only mode)
  const handleInputChange = useCallback((kpiId: string, value: string | number | boolean) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [kpiId]: value }));
    queueSave(kpiId, value);
    setLastSaved(new Date());
    setHasUnsavedChanges(true);
  }, [queueSave, readOnly]);

  // Manual save handler
  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const quarter = isAnnual ? 'FY' : currentQuarter;
      const year = isAnnual ? currentFY : currentYear;

      // Save all current form data entries
      const entries = Object.entries(formData).map(([kpi_id, value]) => ({
        company_id: companyId,
        kpi_id,
        value: String(value),
        quarter,
        year,
      }));

      if (entries.length > 0) {
        // const { error } = await supabase
        //   .from('kpi_entries')
        //   .upsert(entries, { onConflict: 'company_id,kpi_id,quarter,year' });
        const data = await httpClient.post('mis/kpi-entries/upsert', { entries, onConflict: 'company_id,kpi_id,quarter,year' });

        // if (error) throw error;
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success('Data saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit handler - saves and navigates to preview page
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const quarter = isAnnual ? 'FY' : currentQuarter;
      const year = isAnnual ? currentFY : currentYear;

      // Save all current form data entries first
      const entries = Object.entries(formData).map(([kpi_id, value]) => ({
        company_id: companyId,
        kpi_id,
        value: String(value),
        quarter,
        year,
      }));

      if (entries.length > 0) {
        const dataCreate = await httpClient.post('msi/kpi-entries/upsert', { entries, onConflict: 'company_id,kpi_id,quarter,year' });

        // if (error) throw error;
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success('Data saved! Redirecting to preview...');

      // Navigate to preview page with current period params
      navigate(`/mis/preview-submit?quarter=${currentQuarter}&year=${currentYear}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const handleCopyHistoricalValue = (kpiId: string, value: string) => {
    handleInputChange(kpiId, value);
    toast.success('Value copied from historical data');
  };

  // Handle template download - use feature-specific template if available
  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      // Check if this feature has custom KPI definitions for simplified template
      if (hasFeatureKPIs(featureKey)) {
        downloadFeatureTemplate({
          featureKey,
          featureLabel: featureInfo?.label || featureKey,
          companyName: companyName || 'Company',
          quarter: isAnnual ? 'FY' : currentQuarter,
          year: isAnnual ? currentFY : currentYear,
        });
        toast.success('Template downloaded successfully');
      } else {
        // Fall back to the master KPI template
        await downloadCompanyKPITemplate({
          companyId,
          companyName: companyName || 'Company',
          quarter: isAnnual ? 'FY' : currentQuarter,
          year: isAnnual ? currentFY : currentYear,
          type: isAnnual ? 'annual' : 'quarterly',
          featureModule: featureKey,
        });
        toast.success('Template downloaded successfully');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle successful upload - reload entries
  const handleUploadSuccess = async () => {
    // Reload KPI entries
    try {
      // const { data, error } = await supabase
      //   .from('kpi_entries')
      //   .select('kpi_id, value')
      //   .eq('company_id', companyId)
      //   .eq('quarter', isAnnual ? 'FY' : currentQuarter)
      //   .eq('year', isAnnual ? currentFY : currentYear);
      const data: { data: { kpi_id: string; value: string | null }[]; error?: any } = await httpClient.get(`msi/kpi-entries?companyId=${companyId}&quarter=${isAnnual ? 'FY' : currentQuarter}&year=${isAnnual ? currentFY : currentYear}`);

      if (data) {
        const entries: Record<string, string | number | boolean> = {};
        data.data.forEach(entry => {
          if (entry.value !== null) {
            if (entry.value === 'true') {
              entries[entry.kpi_id] = true;
            } else if (entry.value === 'false') {
              entries[entry.kpi_id] = false;
            } else {
              entries[entry.kpi_id] = entry.value;
            }
          }
        });
        setFormData(entries);
      }
    } catch (error) {
      console.error('Error reloading entries:', error);
    }
  };

  // Group KPIs by category for display
  const groupedKPIs = useMemo(() => {
    const result: Record<string, Record<string, KPI[]>> = {};

    applicableKPIs.forEach(kpi => {
      const category = kpi.category || 'General';
      const subCategory = kpi.subCategory || 'General';

      if (!result[category]) {
        result[category] = {};
      }
      if (!result[category][subCategory]) {
        result[category][subCategory] = [];
      }
      result[category][subCategory].push(kpi);
    });

    return result;
  }, [applicableKPIs]);

  // Auto-calculated field names for display
  const autoCalculatedFieldNames = [
    'Total White-Collar Gross Wages',
    'Total White-Collar Employees',
    'Total Blue-Collar Gross Wages',
    'Total Blue-Collar Employees'
  ];

  // Calculate auto-calculated values based on form data
  const calculatedValues = useMemo(() => {
    const values: Record<string, number> = {};

    // Find the KPIs for male and female values to sum them
    const findKPIValueByNamePart = (namePart: string): number => {
      const matchingKPI = allKPIs.find(kpi => kpi.name.toLowerCase().includes(namePart.toLowerCase()));
      if (matchingKPI && formData[matchingKPI.id]) {
        const val = parseFloat(String(formData[matchingKPI.id]));
        return isNaN(val) ? 0 : val;
      }
      return 0;
    };

    // Total White-Collar Employees = Male + Female
    const wcMale = findKPIValueByNamePart('white-collar employees (male)') || findKPIValueByNamePart('white collar employees (male)');
    const wcFemale = findKPIValueByNamePart('white-collar employees (female)') || findKPIValueByNamePart('white collar employees (female)');
    values['Total White-Collar Employees'] = wcMale + wcFemale;

    // Total Blue-Collar Employees = Male + Female
    const bcMale = findKPIValueByNamePart('blue-collar employees (male)') || findKPIValueByNamePart('blue collar employees (male)');
    const bcFemale = findKPIValueByNamePart('blue-collar employees (female)') || findKPIValueByNamePart('blue collar employees (female)');
    values['Total Blue-Collar Employees'] = bcMale + bcFemale;

    // Total White-Collar Gross Wages = Male + Female
    const wcWagesMale = findKPIValueByNamePart('white-collar gross wages (male)') || findKPIValueByNamePart('white collar gross wages (male)');
    const wcWagesFemale = findKPIValueByNamePart('white-collar gross wages (female)') || findKPIValueByNamePart('white collar gross wages (female)');
    values['Total White-Collar Gross Wages'] = wcWagesMale + wcWagesFemale;

    // Total Blue-Collar Gross Wages = Male + Female
    const bcWagesMale = findKPIValueByNamePart('blue-collar gross wages (male)') || findKPIValueByNamePart('blue collar gross wages (male)');
    const bcWagesFemale = findKPIValueByNamePart('blue-collar gross wages (female)') || findKPIValueByNamePart('blue collar gross wages (female)');
    values['Total Blue-Collar Gross Wages'] = bcWagesMale + bcWagesFemale;

    return values;
  }, [allKPIs, formData]);

  // Check if a KPI is auto-calculated
  const isAutoCalculated = (kpiName: string): boolean => {
    return autoCalculatedFieldNames.includes(kpiName);
  };

  // Define KPIs as sub-categories (groups of fields) - each sub-category is a KPI
  // A KPI is considered "filled" if at least one of its fields has a value
  interface KPIGroup {
    name: string;
    mandatory: boolean;
    fields: string[];
    excludeFromProgress?: boolean;
  }

  const getKPIGroupsForFeature = (feature: string): KPIGroup[] => {
    const kpiGroupsMap: Record<string, KPIGroup[]> = {
      // Social / Employment & Compensation - 11 KPI groups (8 Employees + 3 Leadership)
      social: [
        // EmployeesTable - White Collar section (1 KPI group for all WC employees)
        { name: 'White-Collar Employees', mandatory: true, fields: ['employees_wc_male_fulltime', 'employees_wc_male_contractual', 'employees_wc_male_parttime', 'employees_wc_female_fulltime', 'employees_wc_female_contractual', 'employees_wc_female_parttime'] },
        { name: 'White-Collar Gross Wages', mandatory: true, fields: ['employees_wc_wages_male', 'employees_wc_wages_female'] },
        // EmployeesTable - Blue Collar section (1 KPI group for all BC employees)
        { name: 'Blue-Collar Employees', mandatory: true, fields: ['employees_bc_male_fulltime', 'employees_bc_male_contractual', 'employees_bc_male_parttime', 'employees_bc_female_fulltime', 'employees_bc_female_contractual', 'employees_bc_female_parttime'] },
        { name: 'Blue-Collar Gross Wages', mandatory: true, fields: ['employees_bc_wages_male', 'employees_bc_wages_female'] },
        // EmployeesTable - Totals
        { name: 'Overall Employment Totals', mandatory: true, excludeFromProgress: true, fields: ['employees_total_employment', 'employees_total_wages'] },
        // EmployeesTable - Other Metrics (each is a separate KPI)
        { name: 'eNPS', mandatory: false, fields: ['employees_enps'] },
        { name: 'PwD Percentage', mandatory: false, fields: ['employees_pwd_percentage'] },
        { name: 'Attrition Rate', mandatory: false, fields: ['employees_attrition_rate'] },
        // LeadershipTable - 3 KPI groups (C-Level, Board, Compensation)
        { name: 'C-Level', mandatory: true, fields: ['leadership_clevel_total', 'leadership_clevel_female'] },
        { name: 'Board', mandatory: true, fields: ['leadership_board_total', 'leadership_board_female', 'leadership_board_independent'] },
        { name: 'Compensation', mandatory: false, fields: ['leadership_avg_cxo_compensation', 'leadership_avg_employee_comp'] },
      ],
      // Sourcing & Fulfillment - 4 KPI groups (matching feature field mapping)
      sourcingFulfillment: [
        { name: 'MSME Suppliers', mandatory: true, fields: ['msme_supplier_percentage'] },
        { name: 'Vendor MIS', mandatory: true, fields: ['vendor_mis_input_materials_num_vendors', 'vendor_mis_input_materials_pct_international', 'vendor_mis_input_materials_size', 'vendor_mis_input_materials_dei_factors', 'vendor_mis_manufacturing_num_vendors', 'vendor_mis_manufacturing_pct_international', 'vendor_mis_manufacturing_size', 'vendor_mis_manufacturing_dei_factors', 'vendor_mis_packaging_num_vendors', 'vendor_mis_packaging_pct_international', 'vendor_mis_packaging_size', 'vendor_mis_packaging_dei_factors', 'vendor_mis_logistics_warehousing_num_vendors', 'vendor_mis_logistics_warehousing_pct_international', 'vendor_mis_logistics_warehousing_size', 'vendor_mis_logistics_warehousing_dei_factors', 'vendor_mis_stores_clinics_num_vendors', 'vendor_mis_stores_clinics_pct_international', 'vendor_mis_stores_clinics_size', 'vendor_mis_stores_clinics_dei_factors'] },
        { name: 'Logistics Optimization & Carbon Emissions', mandatory: true, excludeFromProgress: true, fields: ['logistics_carbon_initiatives'] },
        { name: 'Vendor Selection & Management Practices', mandatory: true, excludeFromProgress: true, fields: ['vendor_practices_description', 'vendor_practices_weblinks'] },
      ],
      businessInformation: [
        { name: 'Net Revenue', mandatory: true, fields: ['net_revenue'] },
        { name: 'Revenue from Tier-2+ Markets', mandatory: true, fields: ['revenue_tier2_plus'] },
        { name: 'Total Customers Served', mandatory: true, fields: ['total_customers_served'] },
        { name: 'Female Customers Percentage', mandatory: true, fields: ['unique_female_customers'] },
      ],
      incidentLog: [
        // 10 Incident Categories (3 KPIs each: cases, open_cases, impact)
        { name: 'PoSH', mandatory: true, fields: ['incident_posh_cases', 'incident_posh_open_cases', 'incident_posh_impact'] },
        { name: 'Supplier or Vendor Issues', mandatory: true, fields: ['incident_supplier_vendor_cases', 'incident_supplier_vendor_open_cases', 'incident_supplier_vendor_impact'] },
        { name: 'Customer Grievance', mandatory: true, fields: ['incident_customer_grievance_cases', 'incident_customer_grievance_open_cases', 'incident_customer_grievance_impact'] },
        { name: 'Employee Grievance', mandatory: true, fields: ['incident_employee_grievance_cases', 'incident_employee_grievance_open_cases', 'incident_employee_grievance_impact'] },
        { name: 'Environmental Incidents', mandatory: true, fields: ['incident_environmental_cases', 'incident_environmental_open_cases', 'incident_environmental_impact'] },
        { name: 'Health & Safety Incidents', mandatory: true, fields: ['incident_health_safety_cases', 'incident_health_safety_open_cases', 'incident_health_safety_impact'] },
        { name: 'Security Incident (Data & Privacy Breach)', mandatory: true, fields: ['incident_security_data_privacy_cases', 'incident_security_data_privacy_open_cases', 'incident_security_data_privacy_impact'] },
        { name: 'Negative Media Cases', mandatory: true, fields: ['incident_negative_media_cases', 'incident_negative_media_open_cases', 'incident_negative_media_impact'] },
        { name: 'Anti-bribery & corruption', mandatory: true, fields: ['incident_anti_bribery_corruption_cases', 'incident_anti_bribery_corruption_open_cases', 'incident_anti_bribery_corruption_impact'] },
        { name: 'Other regulatory fines or legal liabilities', mandatory: true, fields: ['incident_other_regulatory_cases', 'incident_other_regulatory_open_cases', 'incident_other_regulatory_impact'] },
        // Grievances Details section
        { name: 'Grievances Details', mandatory: true, fields: ['has_grievances', 'grievances_data'] },
      ],
      operations: [
        // MSME Classification
        { name: 'MSME Classification', mandatory: true, fields: ['operations_msme_classification'] },
        // Operations categories from OperationsTable
        { name: 'Rented/Owned Corporate Office', mandatory: true, fields: ['operations_rented_owned_corporate_office_count', 'operations_rented_owned_corporate_office_na'] },
        { name: 'Co-working Corporate Office', mandatory: false, fields: ['operations_coworking_corporate_office_count', 'operations_coworking_corporate_office_na'] },
        { name: 'Owned Manufacturing Units', mandatory: true, fields: ['operations_owned_manufacturing_units_count', 'operations_owned_manufacturing_units_na'] },
        { name: 'Third Party Manufacturing', mandatory: true, fields: ['operations_third_party_manufacturing_count', 'operations_third_party_manufacturing_na'] },
        { name: 'Owned Warehouses', mandatory: true, fields: ['operations_owned_warehouses_count', 'operations_owned_warehouses_na'] },
        { name: 'Third Party Logistics', mandatory: true, fields: ['operations_third_party_logistics_count', 'operations_third_party_logistics_na'] },
        { name: 'COCO Stores', mandatory: false, fields: ['operations_coco_stores_count', 'operations_coco_stores_na'] },
        { name: 'FOCO Stores', mandatory: false, fields: ['operations_foco_stores_count', 'operations_foco_stores_na'] },
      ],
      governancePolicies: [
        { name: 'PoSH Policy', mandatory: true, fields: ['policy_posh_in_place', 'policy_posh_training', 'policy_posh_last_update'] },
        { name: 'Code of Conduct', mandatory: true, fields: ['policy_code_of_conduct_in_place', 'policy_code_of_conduct_training', 'policy_code_of_conduct_last_update'] },
        { name: 'Supplier Code of Conduct', mandatory: true, fields: ['policy_supplier_code_of_conduct_in_place', 'policy_supplier_code_of_conduct_training', 'policy_supplier_code_of_conduct_last_update'] },
        { name: 'Health & Safety', mandatory: true, fields: ['policy_health_and_safety_in_place', 'policy_health_and_safety_training', 'policy_health_and_safety_last_update'] },
        { name: 'DEI Policy', mandatory: true, fields: ['policy_dei_in_place', 'policy_dei_training', 'policy_dei_last_update'] },
        { name: 'HR Policy', mandatory: true, fields: ['policy_hr_in_place', 'policy_hr_training', 'policy_hr_last_update'] },
        { name: 'Human Rights', mandatory: false, fields: ['policy_human_rights_in_place', 'policy_human_rights_training', 'policy_human_rights_last_update'] },
        { name: 'ESG Policy', mandatory: false, fields: ['policy_esg_in_place', 'policy_esg_training', 'policy_esg_last_update'] },
        { name: 'Environment Policy', mandatory: false, fields: ['policy_environment_in_place', 'policy_environment_training', 'policy_environment_last_update'] },
        { name: 'Internal Grievance', mandatory: true, fields: ['policy_grievance_internal_in_place', 'policy_grievance_internal_training', 'policy_grievance_internal_last_update'] },
        { name: 'External Grievance', mandatory: true, fields: ['policy_grievance_external_in_place', 'policy_grievance_external_training', 'policy_grievance_external_last_update'] },
        { name: 'Data Protection', mandatory: true, fields: ['policy_data_protection_in_place', 'policy_data_protection_training', 'policy_data_protection_last_update'] },
      ],
      certifications: [
        // 7 KPI groups: 6 certification categories (Self+Supplier combined) + 1 Patents
        { name: 'Ingredient Certifications', mandatory: true, fields: ['cert_ingredient_self_number', 'cert_ingredient_self_names', 'cert_ingredient_self_validity', 'cert_ingredient_self_comments', 'cert_ingredient_self_na', 'cert_ingredient_supplier_number', 'cert_ingredient_supplier_names', 'cert_ingredient_supplier_validity', 'cert_ingredient_supplier_comments', 'cert_ingredient_supplier_na'] },
        { name: 'Packaging Certifications', mandatory: true, fields: ['cert_packaging_self_number', 'cert_packaging_self_names', 'cert_packaging_self_validity', 'cert_packaging_self_comments', 'cert_packaging_self_na', 'cert_packaging_supplier_number', 'cert_packaging_supplier_names', 'cert_packaging_supplier_validity', 'cert_packaging_supplier_comments', 'cert_packaging_supplier_na'] },
        { name: 'Energy Certifications', mandatory: true, fields: ['cert_energy_self_number', 'cert_energy_self_names', 'cert_energy_self_validity', 'cert_energy_self_comments', 'cert_energy_self_na', 'cert_energy_supplier_number', 'cert_energy_supplier_names', 'cert_energy_supplier_validity', 'cert_energy_supplier_comments', 'cert_energy_supplier_na'] },
        { name: 'Production Certifications', mandatory: true, fields: ['cert_production_self_number', 'cert_production_self_names', 'cert_production_self_validity', 'cert_production_self_comments', 'cert_production_self_na', 'cert_production_supplier_number', 'cert_production_supplier_names', 'cert_production_supplier_validity', 'cert_production_supplier_comments', 'cert_production_supplier_na'] },
        { name: 'Quality Certifications', mandatory: true, fields: ['cert_quality_self_number', 'cert_quality_self_names', 'cert_quality_self_validity', 'cert_quality_self_comments', 'cert_quality_self_na', 'cert_quality_supplier_number', 'cert_quality_supplier_names', 'cert_quality_supplier_validity', 'cert_quality_supplier_comments', 'cert_quality_supplier_na'] },
        { name: 'Company Standards', mandatory: false, fields: ['cert_company_standards_self_number', 'cert_company_standards_self_names', 'cert_company_standards_self_validity', 'cert_company_standards_self_comments', 'cert_company_standards_self_na', 'cert_company_standards_supplier_number', 'cert_company_standards_supplier_names', 'cert_company_standards_supplier_validity', 'cert_company_standards_supplier_comments', 'cert_company_standards_supplier_na'] },
        { name: 'Patents/IPs', mandatory: false, fields: ['patents_granted', 'patents_filed'] },
      ],
      csr: [
        { name: 'CSR Spending', mandatory: true, fields: ['csr_amount_spent'] },
        { name: 'Implementation', mandatory: true, fields: ['csr_implementation'] },
        // Initiatives field must contain at least one initiative with non-empty description to be considered filled
        { name: 'Initiatives in the Last Year', mandatory: true, fields: ['csr_initiatives_list'] },
      ],
      // SRI - 8 categories matching IMPACT_CATEGORIES in SRITable
      sri: [
        { name: 'Beneficiaries', mandatory: true, fields: ['sri_total_beneficiaries_curr', 'sri_women_beneficiaries_curr', 'sri_msme_status_curr', 'sri_sector_curr'] },
        { name: 'Jobs Created', mandatory: true, fields: ['sri_total_jobs_created_curr', 'sri_jobs_male_curr', 'sri_jobs_female_curr', 'sri_formal_jobs_curr', 'sri_informal_jobs_curr', 'sri_skilled_jobs_curr', 'sri_unskilled_jobs_curr', 'sri_construction_jobs_curr', 'sri_short_term_jobs_curr', 'sri_contractual_jobs_curr'] },
        { name: 'Enterprise & Emissions', mandatory: false, fields: ['sri_women_led_curr', 'sri_co2_scope1_curr', 'sri_co2_scope2_curr', 'sri_emissions_initiatives_curr', 'sri_product_programs_curr'] },
        { name: 'Development Indicators', mandatory: true, fields: ['sri_states_impacted_curr', 'sri_cities_impacted_curr', 'sri_villages_impacted_curr', 'sri_northeast_cities_curr', 'sri_aspirational_districts_curr', 'sri_sc_st_obc_impacted_curr', 'sri_farmers_impacted_curr', 'sri_women_farmers_curr', 'sri_women_entrepreneurs_curr', 'sri_health_camps_curr', 'sri_students_trained_curr', 'sri_rd_investment_curr', 'sri_other_output_curr'] },
        { name: 'Training & Safety', mandatory: false, fields: ['sri_vocational_training_curr', 'sri_safety_sessions_curr', 'sri_ohs_coverage_curr', 'sri_ppe_compliance_curr', 'sri_ergonomics_compliance_curr', 'sri_health_checkups_curr'] },
        { name: 'Social Security', mandatory: false, fields: ['sri_grievances_resolved_curr', 'sri_social_security_coverage_curr', 'sri_wage_increase_curr', 'sri_upskilling_programs_curr'] },
        { name: 'Testimonials & Other', mandatory: false, excludeFromProgress: true, fields: ['sri_testimonials_curr', 'sri_other_impact_curr'] },
        { name: 'Progress & Milestones', mandatory: false, fields: ['sri_stores_locations_curr', 'sri_distribution_network_curr', 'sri_product_lines_curr', 'sri_total_capacity_curr', 'sri_total_occupancy_curr', 'sri_customers_pedigree_curr', 'sri_business_model_curr', 'sri_revenue_mix_curr', 'sri_monthly_revenue_curr', 'sri_cost_savings_curr', 'sri_profitability_ratios_curr', 'sri_liquidity_ratios_curr', 'sri_working_capital_ratios_curr', 'sri_policies_sops_curr'] },
      ],
      // Energy Management - 7 facility types
      energyManagement: [
        { name: 'Office', mandatory: true, fields: ['energy_detailed_office_energy_consumed', 'energy_detailed_office_renewable_pct', 'energy_detailed_office_na'] },
        { name: 'Stores (COCO)', mandatory: true, fields: ['energy_detailed_stores_coco_energy_consumed', 'energy_detailed_stores_coco_renewable_pct', 'energy_detailed_stores_coco_na'] },
        { name: 'Warehouses', mandatory: true, fields: ['energy_detailed_warehouses_energy_consumed', 'energy_detailed_warehouses_renewable_pct', 'energy_detailed_warehouses_na'] },
        { name: 'Manufacturing / Production', mandatory: true, fields: ['energy_detailed_manufacturing_energy_consumed', 'energy_detailed_manufacturing_renewable_pct', 'energy_detailed_manufacturing_na'] },
        { name: 'Data Center', mandatory: false, fields: ['energy_detailed_data_center_energy_consumed', 'energy_detailed_data_center_renewable_pct', 'energy_detailed_data_center_na'] },
        { name: 'Retail Outlets', mandatory: false, fields: ['energy_detailed_retail_energy_consumed', 'energy_detailed_retail_renewable_pct', 'energy_detailed_retail_na'] },
        { name: 'Distribution Center', mandatory: false, fields: ['energy_detailed_distribution_energy_consumed', 'energy_detailed_distribution_renewable_pct', 'energy_detailed_distribution_na'] },
      ],
      // Water Management - 6 facility types (same structure as Energy Management)
      waterManagement: [
        { name: 'Office', mandatory: true, fields: ['water_detailed_office_water_consumed', 'water_detailed_office_fresh_water_pct', 'water_detailed_office_wastewater_generated', 'water_detailed_office_wastewater_recycled_pct', 'water_detailed_office_na'] },
        { name: 'Stores (COCO)', mandatory: true, fields: ['water_detailed_stores_coco_water_consumed', 'water_detailed_stores_coco_fresh_water_pct', 'water_detailed_stores_coco_wastewater_generated', 'water_detailed_stores_coco_wastewater_recycled_pct', 'water_detailed_stores_coco_na'] },
        { name: 'Warehouses', mandatory: true, fields: ['water_detailed_warehouses_water_consumed', 'water_detailed_warehouses_fresh_water_pct', 'water_detailed_warehouses_wastewater_generated', 'water_detailed_warehouses_wastewater_recycled_pct', 'water_detailed_warehouses_na'] },
        { name: 'Manufacturing Plant', mandatory: true, fields: ['water_detailed_manufacturing_water_consumed', 'water_detailed_manufacturing_fresh_water_pct', 'water_detailed_manufacturing_wastewater_generated', 'water_detailed_manufacturing_wastewater_recycled_pct', 'water_detailed_manufacturing_na'] },
        { name: 'Dark Stores', mandatory: false, fields: ['water_detailed_dark_stores_water_consumed', 'water_detailed_dark_stores_fresh_water_pct', 'water_detailed_dark_stores_wastewater_generated', 'water_detailed_dark_stores_wastewater_recycled_pct', 'water_detailed_dark_stores_na'] },
        { name: 'Distribution Center', mandatory: false, fields: ['water_detailed_distribution_water_consumed', 'water_detailed_distribution_fresh_water_pct', 'water_detailed_distribution_wastewater_generated', 'water_detailed_distribution_wastewater_recycled_pct', 'water_detailed_distribution_na'] },
      ],
      // Waste Management - 6 facility types (same structure as Energy Management)
      wasteManagement: [
        { name: 'Office', mandatory: true, fields: ['waste_detailed_office_waste_generated', 'waste_detailed_office_waste_recycled_pct', 'waste_detailed_office_na'] },
        { name: 'Stores (COCO)', mandatory: true, fields: ['waste_detailed_stores_coco_waste_generated', 'waste_detailed_stores_coco_waste_recycled_pct', 'waste_detailed_stores_coco_na'] },
        { name: 'Warehouses', mandatory: true, fields: ['waste_detailed_warehouses_waste_generated', 'waste_detailed_warehouses_waste_recycled_pct', 'waste_detailed_warehouses_na'] },
        { name: 'Manufacturing Plant', mandatory: true, fields: ['waste_detailed_manufacturing_waste_generated', 'waste_detailed_manufacturing_waste_recycled_pct', 'waste_detailed_manufacturing_na'] },
        { name: 'Dark Stores', mandatory: false, fields: ['waste_detailed_dark_stores_waste_generated', 'waste_detailed_dark_stores_waste_recycled_pct', 'waste_detailed_dark_stores_na'] },
        { name: 'Distribution Center', mandatory: false, fields: ['waste_detailed_distribution_waste_generated', 'waste_detailed_distribution_waste_recycled_pct', 'waste_detailed_distribution_na'] },
      ],
      // External Reporting - 8 KPI groups
      externalReporting: [
        { name: 'Beneficiaries', mandatory: true, fields: ['ext_beneficiaries'] },
        { name: 'Jobs created', mandatory: true, fields: ['ext_jobs_created'] },
        { name: 'Enterprise and emissions', mandatory: true, fields: ['ext_enterprise_emissions'] },
        { name: 'Development Indicators', mandatory: true, fields: ['ext_development_indicators'] },
        { name: 'Training and safety', mandatory: true, fields: ['ext_training_safety'] },
        { name: 'Social security', mandatory: true, fields: ['ext_social_security'] },
        { name: 'Testimonials and other', mandatory: true, fields: ['ext_testimonials_other'] },
        { name: 'Progress and milestones', mandatory: true, fields: ['ext_progress_milestones'] },
      ],
      // Materials & Packaging (Fashion) - 8 KPI groups
      fashionMaterials: [
        { name: 'Approach and Vision', mandatory: true, excludeFromProgress: true, fields: ['fashion_materials_approach_vision', 'fashion_materials_weblinks', 'fashion_materials_documents', 'fashion_materials_vision_plans'] },
        { name: 'Total Amount of Materials Used', mandatory: true, fields: ['fashion_total_materials_mt', 'fashion_sustainable_materials_pct'] },
        { name: 'Recyclability of Textile Materials', mandatory: true, fields: ['fashion_recyclable_materials_pct', 'fashion_non_recyclable_materials_pct'] },
        { name: 'Type of Textile Materials Sourced', mandatory: true, fields: ['fashion_material_cotton_mt', 'fashion_material_polyester_mt', 'fashion_material_nylon_mt', 'fashion_material_wool_mt', 'fashion_material_silk_mt', 'fashion_material_linen_mt', 'fashion_material_viscose_mt', 'fashion_material_elastane_mt', 'fashion_material_other_mt'] },
        { name: 'Warehouse Packaging', mandatory: true, excludeFromProgress: true, fields: ['fashion_warehouse_pkg_cardboard_pct', 'fashion_warehouse_pkg_paper_pct', 'fashion_warehouse_pkg_plastic_recyclable_pct', 'fashion_warehouse_pkg_plastic_non_recyclable_pct', 'fashion_warehouse_pkg_fabric_pct', 'fashion_warehouse_pkg_other_pct', 'fashion_packaging_reuse_note'] },
        { name: 'Primary Packaging', mandatory: true, excludeFromProgress: true, fields: ['fashion_primary_pkg_cardboard_pct', 'fashion_primary_pkg_paper_pct', 'fashion_primary_pkg_plastic_recyclable_pct', 'fashion_primary_pkg_plastic_non_recyclable_pct', 'fashion_primary_pkg_fabric_pct', 'fashion_primary_pkg_other_pct'] },
        { name: 'Compliance Details', mandatory: true, fields: ['fashion_epr_target', 'fashion_epr_compliance_pct', 'fashion_waste_expenditure'] },
        { name: 'Secondary Packaging', mandatory: true, excludeFromProgress: true, fields: ['fashion_secondary_pkg_cardboard_pct', 'fashion_secondary_pkg_paper_pct', 'fashion_secondary_pkg_plastic_recyclable_pct', 'fashion_secondary_pkg_plastic_non_recyclable_pct', 'fashion_secondary_pkg_fabric_pct', 'fashion_secondary_pkg_other_pct'] },
      ],
      // HealthCare - 3 KPI groups
      healthCare: [
        { name: 'Consultations & Screenings', mandatory: true, fields: ['healthcare_consultations_screenings'] },
        { name: 'Products & Services', mandatory: true, fields: ['healthcare_products_services'] },
        { name: 'Diseases Addressed', mandatory: true, excludeFromProgress: true, fields: ['healthcare_diseases_addressed'] },
      ],
      // Awards & Recognitions - 3 KPI groups
      productServiceCertifications: [
        { name: 'Awards and Recognitions', mandatory: true, fields: ['founder_awards_list'] },
        { name: 'Media Mentions', mandatory: true, fields: ['media_mentions_list'] },
        { name: 'Other Initiatives', mandatory: false, fields: ['other_initiatives_list'] },
      ],
      // Primary & Secondary Packaging - 5 KPI groups for Food/BPC/Nutra
      primarySecondaryPackaging: [
        // Primary (FoodBPCNutraPackagingBasic)
        { name: 'Approach & Vision', mandatory: true, excludeFromProgress: true, fields: ['food_pkg_basic_approach_current_approach', 'food_pkg_basic_approach_vision_plans', 'food_pkg_basic_approach_current_approach_weblinks', 'food_pkg_basic_approach_vision_plans_weblinks'] },
        { name: 'Total Packaging', mandatory: true, fields: ['food_pkg_basic_total_total_material_used', 'food_pkg_basic_total_total_material_recycled'] },
        { name: 'Compliance Details', mandatory: true, fields: ['food_pkg_basic_compliance_epr_targets_cpcb', 'food_pkg_basic_compliance_epr_compliance_pct', 'food_pkg_basic_compliance_voluntary_plastic_neutrality', 'food_pkg_basic_compliance_epr_partner_name', 'food_pkg_basic_compliance_waste_expenditure'] },
        { name: 'Primary Packaging', mandatory: true, fields: ['food_pkg_basic_primary_primary_total_material', 'food_pkg_basic_primary_breakup_primary_plastic_virgin', 'food_pkg_basic_primary_breakup_primary_plastic_recycled', 'food_pkg_basic_primary_breakup_primary_paper_virgin', 'food_pkg_basic_primary_breakup_primary_paper_recycled', 'food_pkg_basic_primary_recyclability_primary_mono_materials', 'food_pkg_basic_primary_recyclability_primary_multi_layered'] },
        // Secondary + Tertiary combined (FoodBPCNutraPackagingDetailed)
        { name: 'Secondary & Tertiary Packaging', mandatory: true, fields: ['food_pkg_detailed_secondary_secondary_total_material', 'food_pkg_detailed_secondary_breakup_secondary_plastic_virgin', 'food_pkg_detailed_secondary_breakup_secondary_plastic_recycled', 'food_pkg_detailed_secondary_breakup_secondary_paper_virgin', 'food_pkg_detailed_secondary_breakup_secondary_paper_recycled', 'food_pkg_detailed_secondary_recyclability_secondary_mono_materials', 'food_pkg_detailed_secondary_recyclability_secondary_multi_layered', 'food_pkg_detailed_secondary_plastics_nature_details', 'food_pkg_tertiary_total_material', 'food_pkg_tertiary_breakup_plastic_virgin', 'food_pkg_tertiary_breakup_plastic_recycled', 'food_pkg_tertiary_breakup_paper_virgin', 'food_pkg_tertiary_breakup_paper_recycled'] },
      ],
    };
    return kpiGroupsMap[feature] || [];
  };

  // Helper to check if a value is filled
  const isFieldFilled = (value: string | number | boolean | undefined, fieldKey?: string): boolean => {
    if (value === undefined || value === null || value === '') return false;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return false;

      // Check for JSON arrays (e.g., awards, initiatives lists)
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            // Empty array is not filled
            if (parsed.length === 0) return false;

            // Special handling for CSR initiatives - must have at least one initiative with a non-empty description
            if (fieldKey === 'csr_initiatives_list') {
              return parsed.some((item: any) => {
                if (typeof item === 'object' && item !== null) {
                  // Check if description field has meaningful content
                  const description = item.description || '';
                  return typeof description === 'string' && description.trim().length > 0;
                }
                return false;
              });
            }

            // Array with empty objects is not filled
            if (parsed.every((item: any) => {
              if (typeof item === 'object' && item !== null) {
                // Check if all values are empty strings
                return Object.values(item).every(v => v === '' || v === undefined || v === null);
              }
              return false;
            })) return false;
            return true;
          }
        } catch {
          // Not valid JSON, treat as regular string
        }
      }
    }
    return true;
  };

  // Check if a KPI group is filled (at least one field has a value)
  const isKPIGroupFilled = (group: KPIGroup): boolean => {
    return group.fields.some(fieldKey => isFieldFilled(formData[fieldKey], fieldKey));
  };

  // Calculate progress for the feature with mandatory/optional breakdown
  const progressData = useMemo(() => {
    const kpiGroups = getKPIGroupsForFeature(featureKey);

    // Use KPI groups if this is a specialized table feature
    if (kpiGroups.length > 0) {
      const trackableGroups = kpiGroups.filter(g => !g.excludeFromProgress);
      const filledCount = trackableGroups.filter(isKPIGroupFilled).length;

      return {
        totalKPIs: trackableGroups.length,
        filledKPIs: filledCount,
      };
    }

    // Default: use applicableKPIs from database
    const filledCount = applicableKPIs.filter(kpi => isFieldFilled(formData[kpi.id])).length;

    return {
      totalKPIs: applicableKPIs.length,
      filledKPIs: filledCount,
    };
  }, [applicableKPIs, formData, featureKey]);

  // Check if this is an annual feature with a structured table
  const isStructuredAnnualFeature = isAnnual && ['certifications', 'sourcingFulfillment', 'operations', 'governancePolicies', 'sri', 'csr', 'waterManagement', 'energyManagement', 'wasteManagement', 'externalReporting'].includes(featureKey);

  // Incident log uses the standard SpreadsheetKPITable like other features

  // Check if this is the packaging detailed feature which needs tertiary toggle
  const isPackagingDetailedFeature = featureKey === 'packagingDetailed';

  // Get tertiary KPIs for packaging detailed view
  const tertiaryKPIs = useMemo(() => {
    if (!isPackagingDetailedFeature || !companyProfile) return [];

    const kpiIndustries = mapIndustryToKPIIndustries(companyProfile.industry);

    return allKPIs.filter(kpi => {
      // Must be in packagingTertiary module
      if (kpi.featureModule !== 'packagingTertiary') return false;

      // Check revenue stage and industry
      const matchesProfile = kpi.revenueStages.includes(companyProfile.revenueStage) &&
        kpi.industries.some(ind => kpiIndustries.includes(ind));

      return matchesProfile;
    });
  }, [allKPIs, companyProfile, isPackagingDetailedFeature]);

  // ESG colors
  const esgColors: Record<ESGCategory, { bg: string; border: string; text: string }> = {
    E: { bg: 'bg-esg-environmental/10', border: 'border-l-esg-environmental', text: 'text-esg-environmental' },
    S: { bg: 'bg-esg-social/10', border: 'border-l-esg-social', text: 'text-esg-social' },
    G: { bg: 'bg-esg-governance/10', border: 'border-l-esg-governance', text: 'text-esg-governance' },
  };

  const coreLevelColors: Record<number, string> = {
    1: 'bg-destructive text-destructive-foreground',
    2: 'bg-status-warning text-white',
    3: 'bg-muted text-muted-foreground',
  };

  // if (isLoading) {
  //   return (
  //     <UnifiedSidebarLayout>
  //       <div className="flex items-center justify-center h-64">
  //         <Loader2 className="w-8 h-8 animate-spin text-primary" />
  //       </div>
  //     </UnifiedSidebarLayout>
  //   );
  // }

  const renderInput = (kpi: KPI) => {
    const currentValue = formData[kpi.id];

    // Check if this is an auto-calculated field
    if (isAutoCalculated(kpi.name)) {
      const calculatedValue = calculatedValues[kpi.name] || 0;
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={calculatedValue}
            disabled
            className="h-8 text-sm bg-muted/50 font-medium"
          />
          <Badge variant="outline" className="text-[10px] whitespace-nowrap bg-primary/10 text-primary border-primary/30">
            Auto
          </Badge>
        </div>
      );
    }

    if (kpi.metricType === 'Boolean' || kpi.metricType === 'Yes/No') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={currentValue as boolean || false}
            onCheckedChange={(checked) => handleInputChange(kpi.id, checked)}
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-xs text-muted-foreground min-w-[24px]">
            {currentValue ? 'Yes' : 'No'}
          </span>
        </div>
      );
    }

    const isNumeric = ['Quantitative', 'Metric Tons', 'Cost in INR Cr', 'Number', 'Currency', 'Percentage'].includes(kpi.metricType);
    const isPercentage = kpi.metricType === 'Percentage';

    return (
      <div className="relative flex items-center gap-1">
        <Input
          type={isNumeric ? 'number' : 'text'}
          placeholder="Enter value..."
          value={currentValue as string || ''}
          onChange={(e) => handleInputChange(kpi.id, e.target.value)}
          className="h-8 text-sm"
          min={isPercentage ? 0 : undefined}
          max={isPercentage ? 100 : undefined}
        />
        {isPercentage && <span className="text-xs text-muted-foreground">%</span>}
      </div>
    );
  };

  useEffect(() => {
    console.log('Recalculating values with groupedKPIs:', groupedKPIs);
  }, [groupedKPIs]);

  return (
    <UnifiedSidebarLayout fixedHeight={isAnnual}>
      <PageHeader
        title={featureInfo?.label || featureKey}
        subtitle={
          <span>
            {featureInfo && 'description' in featureInfo && featureInfo.description && (
              <span className="text-muted-foreground">{featureInfo.description}</span>
            )}
            {featureInfo && 'description' in featureInfo && featureInfo.description && isAnnual && ' • '}
            {isAnnual && <span className="text-muted-foreground">Jan-Dec {currentFY}</span>}
          </span>
        }
        actions={
          <div className="flex items-center gap-4">
            {/* Period Selector - only for quarterly features */}
            {!isAnnual && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Period:</span>
                <PeriodSelector
                  quarter={selectedQuarter}
                  year={selectedYear}
                  onQuarterChange={handleQuarterChange}
                  onYearChange={handleYearChange}
                />
              </div>
            )}

            {/* Year Selector and Quarter Selector for Annual KPIs */}
            {isAnnual && (
              <div className="flex items-center gap-4">
                {/* Quarter selector - allows user to switch quarters (will redirect if not Q4) */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Quarter:</span>
                  <PeriodSelector
                    quarter={selectedQuarter}
                    year={selectedYear}
                    onQuarterChange={handleQuarterChange}
                    onYearChange={handleYearChange}
                    showIcon={false}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Annual Year:</span>
                  <select
                    value={currentFY}
                    onChange={(e) => {
                      const newYear = parseInt(e.target.value);
                      navigate(`/company/kpi-entry?tab=annual&feature=${featureKey}&quarter=Q4&year=${newYear}`);
                    }}
                    className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value={2024}>Jan-Dec 2024</option>
                    <option value={2025}>Jan-Dec 2025</option>
                  </select>
                </div>
              </div>
            )}
            {!readOnly && (
              <div className="flex items-center gap-2">
                {/* Download Template Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download Template
                </Button>

                {/* Upload Template Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Data
                </Button>
              </div>
            )}

            <div className="flex items-center gap-3">
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                  Auto-saved
                </div>
              )}

              <Button variant="outline" size="sm" onClick={() => navigate('/mis/data-entry')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        }
      />

      {/* {readOnly && <EditPausedBanner quarter={periodToCheck} year={yearToCheck} className="mb-4" />} */}

      {/* Annual notice for annual KPIs */}
      {isAnnual && (
        <Card className="border-primary/20 bg-primary/5 mb-4">
          <CardContent className="p-3 flex items-center gap-2 flex-wrap">
            <Info className="w-4 h-4 text-primary shrink-0" />

            <p className="text-xs">
              <span className="font-medium">
                Annual KPIs - Jan-Dec {currentFY}
              </span>

              <span className="text-muted-foreground ml-2">
                You need to fill this data once. Going forward, the data shared in the previous period will be pre-filled in the cells. Please update in case there are any changes. Data is auto-saved as you enter.
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Feature Progress Bar */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <FeatureProgressBar
            totalKPIs={progressData.totalKPIs}
            filledKPIs={progressData.filledKPIs}
          />
        </CardContent>
      </Card>

      {/* Read-only banner */}
      {readOnly && (
        <Card className="border-orange-200 bg-orange-50 mb-4">
          <CardContent className="p-3 flex items-center gap-3">
            <Lock className="w-4 h-4 text-orange-300 shrink-0" />
            <p className="text-xs font-medium text-orange-300">
              View Only — Your company's data entry is currently locked. Contact Fireside Ventures if you need to make changes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Wrap tables in a read-only container when locked */}
      <div className={readOnly ? 'pointer-events-none text-left opacity-75' : ''}>
        {/* Custom feature tables */}
        {featureKey === 'businessInformation' ? (
          <BusinessInformationTable formData={formData} onInputChange={handleInputChange} historicalData={historicalData} />
        ) : featureKey === 'sourcingFulfillment' ? (
          <SourcingFulfilmentTable formData={formData} onInputChange={handleInputChange} />
        ) : featureKey === 'fashionMaterials' ? (
          <FashionMaterialsTable formData={formData} onInputChange={handleInputChange} />
        ) : featureKey === 'incidentLog' ? (
          <div className="space-y-4">
            <IncidentsTable formData={formData} onInputChange={handleInputChange} />
            <GrievancesTable formData={formData} onInputChange={handleInputChange} />
          </div>
        ) : featureKey === 'productServiceCertifications' ? (
          <ProductServiceCertificationsTable formData={formData} onInputChange={handleInputChange} />
        ) : featureKey === 'primarySecondaryPackaging' && companyProfile ? (
          // Primary & Secondary Packaging - uses Food/BPC/Nutra packaging components for ALL industries
          // Fashion-specific materials go in the separate "Materials & Packaging (Fashion)" feature
          <div className="space-y-4">
            <FoodBPCNutraPackagingBasic formData={formData} onInputChange={handleInputChange} />
            <FoodBPCNutraPackagingDetailed formData={formData} onInputChange={handleInputChange} />
          </div>
        ) : featureKey === 'social' ? (
          <div className="space-y-4">
            <EmployeesTable formData={formData} onInputChange={handleInputChange} historicalData={historicalData} />
            <LeadershipTable formData={formData} onInputChange={handleInputChange} historicalData={historicalData} startingKpiNumber={8} />
          </div>
        ) : featureKey === 'healthCare' ? (
          <HealthCareTable formData={formData} onInputChange={handleInputChange} />
        ) : isStructuredAnnualFeature ? (
          <div className="space-y-4">
            {featureKey === 'certifications' && (
              <CertificationsTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'sourcingFulfillment' && (
              <SourcingFulfilmentTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'operations' && (
              <OperationsTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'governancePolicies' && (
              <GovernancePoliciesTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'sri' && (
              <SRITable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'csr' && (
              <CSRTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'waterManagement' && (
              <WaterManagementDetailedTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'energyManagement' && (
              <EnergyManagementDetailedTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'wasteManagement' && (
              <WasteManagementTable formData={formData} onInputChange={handleInputChange} />
            )}
            {featureKey === 'externalReporting' && (
              <ExternalReportingTable formData={formData} onInputChange={handleInputChange} />
            )}
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[40px] px-2"></TableHead>
                  <TableHead className="w-[180px] text-xs font-semibold">Category</TableHead>
                  <TableHead className="text-xs font-semibold">KPI Metric</TableHead>
                  <TableHead className="w-[80px] text-xs font-semibold text-center">Category</TableHead>
                  <TableHead className="w-[180px] text-xs font-semibold">Enter Value</TableHead>
                  <TableHead className="w-[160px] text-xs font-semibold">Historical Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedKPIs).map(([category, subCategories]) => {
                  const categoryKey = category;
                  const isCollapsed = collapsedCategories.has(categoryKey);
                  const allKPIsInCategory = Object.values(subCategories).flat();
                  const firstKPI = allKPIsInCategory[0];
                  const esg = firstKPI?.esg || 'G';
                  const colors = esgColors[esg];

                  let rowIndex = 0;

                  return (
                    <>
                      {/* Category Header */}
                      <TableRow
                        key={categoryKey}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50 border-l-4",
                          colors.border,
                          colors.bg
                        )}
                        onClick={() => toggleCategory(categoryKey)}
                      >
                        <TableCell className="px-2">
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell colSpan={5} className="py-2">
                          <div className="flex items-center gap-3">
                            <span className={cn("text-sm font-medium", colors.text)}>
                              {category}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {allKPIsInCategory.length} items
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* KPI Rows */}
                      {!isCollapsed && Object.entries(subCategories).map(([subCategory, kpis]) =>
                        kpis.map((kpi, kpiIdx) => {
                          const historical = historicalData[kpi.id] || [];
                          const isFirstInSubCat = kpiIdx === 0;
                          rowIndex++;

                          return (
                            <TableRow
                              key={kpi.id}
                              className={cn(
                                "group hover:bg-muted/30 border-l-4",
                                colors.border,
                                rowIndex % 2 === 0 ? "bg-background" : "bg-muted/10"
                              )}
                            >
                              <TableCell className="px-2"></TableCell>
                              <TableCell className="py-2">
                                {isFirstInSubCat && subCategory !== 'General' && (
                                  <span className="text-xs font-medium text-foreground/80">
                                    {subCategory}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {kpi.name}
                                    {kpi.coreLevel === 1 && <span className="text-destructive ml-0.5">*</span>}
                                  </span>
                                  {kpi.definition && (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button
                                          type="button"
                                          className="p-0.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="max-w-xs" side="top">
                                        <div className="space-y-1">
                                          <p className="font-medium text-sm">{kpi.name}</p>
                                          <p className="text-xs text-muted-foreground">{kpi.definition}</p>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-2 text-center">
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0.5",
                                    coreLevelColors[kpi.coreLevel]
                                  )}
                                >
                                  {kpi.coreLevel === 1 ? 'Mandatory' : 'Optional'}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2">
                                {renderInput(kpi)}
                              </TableCell>
                              <TableCell className="py-2">
                                <KPIHistoryTable entries={historical} />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>

            {/* Footer summary */}
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>{applicableKPIs.length} KPIs total</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Mandatory: {applicableKPIs.filter(k => k.coreLevel === 1).length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Optional: {applicableKPIs.filter(k => k.coreLevel === 2).length}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>{/* end read-only wrapper */}

      {/* Additional Comments Section - shown for all features */}
      <AdditionalCommentsSection
        featureKey={featureKey}
        value={(formData[`${featureKey}_additional_comments`] as string) || ''}
        onChange={(value) => readOnly ? undefined : handleInputChange(`${featureKey}_additional_comments`, value)}
      />

      {/* Save/Submit Actions */}
      {!readOnly && (
        <div className="flex items-center justify-between pt-4 pb-2 border-t border-border mt-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{progressData.filledKPIs}/{progressData.totalKPIs} filled</span>
            {lastSaved && (
              <>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-status-success" />
                  Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving}
              className="bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary font-medium"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1.5" />
              )}
              Save Draft
            </Button>
          </div>
        </div>
      )}

      {/* Upload Dialog - use feature-specific dialog if available */}
      {hasFeatureKPIs(featureKey) ? (
        <UploadFeatureTemplateDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          companyId={companyId}
          quarter={isAnnual ? 'FY' : currentQuarter}
          year={isAnnual ? currentFY : currentYear}
          featureKey={featureKey}
          featureLabel={featureInfo?.label || featureKey}
          onSuccess={handleUploadSuccess}
        />
      ) : (
        <UploadKPITemplateDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          companyId={companyId}
          quarter={isAnnual ? 'FY' : currentQuarter}
          year={isAnnual ? currentFY : currentYear}
          onSuccess={handleUploadSuccess}
        />
      )}
    </UnifiedSidebarLayout>
  );
};

export default FeatureKPIEntry;
