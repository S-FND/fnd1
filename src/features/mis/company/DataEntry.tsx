import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isPeriodEditable } from '@/lib/companyAccessControl';
import { EditPausedBanner } from '@/components/EditPausedBanner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mockCompanies } from '@/data/mockData';
// import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RevenueStage, Industry, KPI, ESGCategory, CoreLevel, KPIIndustry, mapIndustryToKPIIndustries, FeatureModule } from '@/types/esg';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyFeatures, QUARTERLY_FEATURES, ANNUAL_FEATURES } from '@/hooks/useCompanyFeatures';
import { useCompanyKPIOverrides } from '@/hooks/useCompanyKPIOverrides';
import { usePendingApprovals } from '@/hooks/usePendingApprovals';
import { PeriodSelector, getAvailableQuarters } from '@/components/PeriodSelector';
import {
  RefreshCw,
  Loader2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  FileEdit,
  Clock,
  Lock,
  ChevronRight,
  Leaf,
  Users,
  Landmark,
  Package,
  PackageOpen,
  Droplets,
  Zap,
  AlertCircle,
  FileText,
  Recycle,
  MessageSquare,
  Award,
  Truck,
  Building2,
  Briefcase,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { downloadCompanyKPITemplate } from '@/lib/companyKPITemplate';
import { getFeatureKPIs } from '@/lib/featureKPITemplate';
import { UploadKPITemplateDialog } from '@/components/UploadKPITemplateDialog';
import { useAuth } from '@/context/AuthContext';
import { httpClient } from '@/lib/httpClient';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';

const REVENUE_STAGES: { value: RevenueStage; label: string }[] = [
  { value: '0-50', label: '0-50 INR Cr' },
  { value: '50-100', label: '50-100 INR Cr' },
  { value: '100-500', label: '100-500 INR Cr' },
  { value: '500+', label: '500+ INR Cr' },
];

// Feature to icon mapping
const FEATURE_ICONS: Record<string, React.ElementType> = {
  businessInformation: Briefcase,
  sourcingFulfillment: Truck,
  social: Users,
  primarySecondaryPackaging: Package,
  fashionMaterials: Package,
  incidentLog: AlertCircle,
  productServiceCertifications: Award,

  operations: Building2,
  certifications: Award,
  governancePolicies: FileText,
  waterManagement: Droplets,
  energyManagement: Zap,
  wasteManagement: Recycle,
  csr: Users,
  externalReporting: FileText,
};

// Get current financial year (April to March)
const getCurrentFinancialYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 3 ? year : year - 1;
};

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

const DataEntry = () => {
  const { user, companyName, effectiveCompanyId, isAdmin, isFandoro, isCompanyReadOnly } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = effectiveCompanyId || user?.company_id || 'company-1';
  // Get company's default values
  const company = mockCompanies.find(c => c.id === companyId);

  useEffect(() => {
    console.log('Auth context values in DataEntry:', { user, effectiveCompanyId, companyId });
  }, [effectiveCompanyId, user]);

  // Get enabled features for this company
  const { isFeatureEnabled, loading: loadingFeatures, getEnabledFeatures } = useCompanyFeatures(companyId);

  // Get KPI overrides for this company
  const { getEffectiveCoreLevel } = useCompanyKPIOverrides(companyId);

  // Get pending approvals for this company
  const { createRequest, getCompanyPendingRequest } = usePendingApprovals();
  const pendingRequest = getCompanyPendingRequest(companyId);

  // Period selection state - read from URL params if available.
  // Default to the open period (Q1 / JFM 2026); all 2025 periods are locked.
  const urlQuarter = searchParams.get('quarter');
  const urlYear = searchParams.get('year');
  const selectedQuarter = urlQuarter || 'Q1';
  const selectedYear = urlYear ? parseInt(urlYear) : 2026;
  const currentFY = getCurrentFinancialYear();
  const periodLocked = !isPeriodEditable(selectedQuarter, selectedYear);
  const readOnly = isCompanyReadOnly || periodLocked;

  // Handle quarter/year change - update URL params
  const handleQuarterChange = (newQuarter: string) => {
    navigate(`/mis/data-entry?quarter=${newQuarter}&year=${selectedYear}`, { replace: true });
  };

  const handleYearChange = (newYear: number) => {
    navigate(`/mis/data-entry?quarter=${selectedQuarter}&year=${newYear}`, { replace: true });
  };

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isLoadingKPIs, setIsLoadingKPIs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Revenue stage change confirmation dialog
  const [showRevenueChangeDialog, setShowRevenueChangeDialog] = useState(false);
  const [newRevenueStage, setNewRevenueStage] = useState<RevenueStage | null>(null);

  // Submission status tracking
  const [quarterlySubmittedAt, setQuarterlySubmittedAt] = useState<string | null>(null);
  const [annualSubmittedAt, setAnnualSubmittedAt] = useState<string | null>(null);


  // All KPIs from database
  const [allKPIs, setAllKPIs] = useState<KPI[]>([]);

  // Filled KPI IDs for tracking completion
  const [filledKPIIds, setFilledKPIIds] = useState<Set<string>>(new Set());

  // Selection state
  const [selectedRevenueStage, setSelectedRevenueStage] = useState<RevenueStage>(company?.revenueStage || '0-50');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(company?.industry || 'Beauty & Personal Care');

  // Pending selection (before submit)
  const [pendingRevenueStage, setPendingRevenueStage] = useState<RevenueStage>(company?.revenueStage || '0-50');

  // Load KPIs from database
  useEffect(() => {
    const loadKPIs = async () => {
      try {
        // const { data, error } = await supabase
        //   .from('kpi_master')
        //   .select('*')
        //   .order('created_at', { ascending: true });
        const data = await httpClient.get('mis/kpi-masters');

        if (!data.status || data.status !== 200) throw new Error('Failed to load KPIs');

        if (data.data) {
          const mappedKPIs = (data.data as DBKPIMaster[]).map(dbToKPI);
          setAllKPIs(mappedKPIs);
        }
      } catch (error) {
        console.error('Error loading KPIs:', error);
      } finally {
        setIsLoadingKPIs(false);
      }
    };

    loadKPIs();
  }, []);

  // Load company profile from database - fall back to mock data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // const { data, error } = await supabase
        //   .from('company_profiles')
        //   .select('revenue_stage, industry')
        //   .eq('company_id', companyId)
        //   .maybeSingle();
        const data: {
          data: {
            revenue_stage: RevenueStage;
            industry: Industry;
          },
          status: number;

        } = await httpClient.get(`mis/company-profiles?companyId=${companyId}`)

        if (!data.status || data.status !== 200) throw new Error('Failed to load company profile');

        if (data.data) {
          const revenueStage = data.data.revenue_stage as RevenueStage;
          const industry = data.data.industry as Industry;
          setSelectedRevenueStage(revenueStage);
          setSelectedIndustry(industry);
          setPendingRevenueStage(revenueStage);
        } else {
          // Fallback to mock data for companies not yet in database
          const mockCompany = mockCompanies.find(c => c.id === companyId);
          if (mockCompany) {
            setSelectedRevenueStage(mockCompany.revenueStage as RevenueStage);
            setSelectedIndustry(mockCompany.industry as Industry);
            setPendingRevenueStage(mockCompany.revenueStage as RevenueStage);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to mock data on error
        const mockCompany = mockCompanies.find(c => c.id === companyId);
        if (mockCompany) {
          setSelectedRevenueStage(mockCompany.revenueStage as RevenueStage);
          setSelectedIndustry(mockCompany.industry as Industry);
          setPendingRevenueStage(mockCompany.revenueStage as RevenueStage);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [companyId]);

  // Load filled KPI entries to track completion
  // useEffect(() => {
  //   const loadEntries = async () => {
  //     if (allKPIs.length === 0) return;

  //     try {
  //       // Load quarterly entries
  //       // const { data: quarterlyData } = await supabase
  //       //   .from('kpi_entries')
  //       //   .select('kpi_id, submitted_at')
  //       //   .eq('company_id', companyId)
  //       //   .eq('quarter', selectedQuarter)
  //       //   .eq('year', selectedYear);

  //       // Load annual entries
  //       // const { data: annualData } = await supabase
  //       //   .from('kpi_entries')
  //       //   .select('kpi_id, submitted_at')
  //       //   .eq('company_id', companyId)
  //       //   .eq('quarter', 'FY')
  //       //   .eq('year', currentFY);

  //       const data = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=${selectedQuarter}&year=${selectedYear}`);
  //       const annualDataResponse = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=FY&year=${currentFY}`)
  //       const quarterlyData = data.data as { kpi_id: string; submitted_at: string }[];
  //       const annualData = annualDataResponse.data as { kpi_id: string; submitted_at: string }[];
  //       const filledIds = new Set<string>();
  //       let latestQuarterlySubmit: string | null = null;
  //       let latestAnnualSubmit: string | null = null;

  //       quarterlyData?.forEach(entry => {
  //         filledIds.add(entry.kpi_id);
  //         if (entry.submitted_at && (!latestQuarterlySubmit || entry.submitted_at > latestQuarterlySubmit)) {
  //           latestQuarterlySubmit = entry.submitted_at;
  //         }
  //       });

  //       annualData?.forEach(entry => {
  //         filledIds.add(entry.kpi_id);
  //         if (entry.submitted_at && (!latestAnnualSubmit || entry.submitted_at > latestAnnualSubmit)) {
  //           latestAnnualSubmit = entry.submitted_at;
  //         }
  //       });

  //       setFilledKPIIds(filledIds);
  //       setQuarterlySubmittedAt(latestQuarterlySubmit);
  //       setAnnualSubmittedAt(latestAnnualSubmit);
  //     } catch (error) {
  //       console.error('Error loading entries:', error);
  //     } finally {
  //       setIsLoadingEntries(false);
  //     }
  //   };

  //   loadEntries();
  // }, [companyId, allKPIs, selectedQuarter, selectedYear, currentFY]);

  // Load filled KPI entries to track completion
  useEffect(() => {
    const loadEntries = async () => {
      if (allKPIs.length === 0) {
        setIsLoadingEntries(false); // FIX: was never reaching finally block due to early return, causing stuck loader
        return;
      }

      try {
        const data = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=${selectedQuarter}&year=${selectedYear}`);
        const annualDataResponse = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=FY&year=${currentFY}`)
        const quarterlyData = data.data as { kpi_id: string; submitted_at: string }[];
        const annualData = annualDataResponse.data as { kpi_id: string; submitted_at: string }[];
        const filledIds = new Set<string>();
        let latestQuarterlySubmit: string | null = null;
        let latestAnnualSubmit: string | null = null;

        quarterlyData?.forEach(entry => {
          filledIds.add(entry.kpi_id);
          if (entry.submitted_at && (!latestQuarterlySubmit || entry.submitted_at > latestQuarterlySubmit)) {
            latestQuarterlySubmit = entry.submitted_at;
          }
        });

        annualData?.forEach(entry => {
          filledIds.add(entry.kpi_id);
          if (entry.submitted_at && (!latestAnnualSubmit || entry.submitted_at > latestAnnualSubmit)) {
            latestAnnualSubmit = entry.submitted_at;
          }
        });

        setFilledKPIIds(filledIds);
        setQuarterlySubmittedAt(latestQuarterlySubmit);
        setAnnualSubmittedAt(latestAnnualSubmit);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setIsLoadingEntries(false);
      }
    };

    loadEntries();
  }, [companyId, allKPIs, selectedQuarter, selectedYear, currentFY]);


  // Filter KPIs based on current selection and enabled features
  const applicableKPIs = useMemo(() => {
    const kpiIndustries = mapIndustryToKPIIndustries(selectedIndustry);
    const enabledQuarterlyFeatures = getEnabledFeatures('quarterly');
    const enabledAnnualFeatures = getEnabledFeatures('annual');

    return allKPIs.filter(kpi => {
      // Check revenue stage and industry applicability
      const matchesProfile = kpi.revenueStages.includes(selectedRevenueStage) &&
        kpi.industries.some(ind => kpiIndustries.includes(ind));

      if (!matchesProfile) return false;

      // Check if KPI is company-specific
      if (kpi.targetCompanies && kpi.targetCompanies.length > 0) {
        if (!kpi.targetCompanies.includes(companyId)) return false;
      }

      // Check if the feature module is enabled
      if (kpi.featureModule) {
        const enabledFeatures = kpi.period === 'Annual' ? enabledAnnualFeatures : enabledQuarterlyFeatures;
        if (!enabledFeatures.includes(kpi.featureModule)) return false;
      }

      return true;
    }).map(kpi => {
      // Apply effective core level (considering admin overrides)
      const effectiveLevel = getEffectiveCoreLevel(kpi);
      if (effectiveLevel !== kpi.coreLevel) {
        return { ...kpi, coreLevel: effectiveLevel };
      }
      return kpi;
    });
  }, [allKPIs, selectedRevenueStage, selectedIndustry, companyId, getEnabledFeatures, getEffectiveCoreLevel]);

  // Split KPIs by period
  const quarterlyKPIs = useMemo(() =>
    applicableKPIs.filter(kpi => kpi.period === 'Quarterly'),
    [applicableKPIs]
  );

  const annualKPIs = useMemo(() =>
    applicableKPIs.filter(kpi => kpi.period === 'Annual'),
    [applicableKPIs]
  );

  // Check if revenue stage selection has changed
  const hasSelectionChanged = pendingRevenueStage !== selectedRevenueStage;

  const handleApplySelection = () => {
    setNewRevenueStage(pendingRevenueStage);
    setShowRevenueChangeDialog(true);
  };

  const handleConfirmRevenueChange = async () => {
    if (!newRevenueStage) return;

    setIsSaving(true);
    try {
      const success = await createRequest(
        companyId,
        companyName || company?.name || 'Unknown Company',
        selectedRevenueStage,
        newRevenueStage
      );

      if (success) {
        toast.success('Revenue stage change request submitted for approval');
        setShowRevenueChangeDialog(false);
        setPendingRevenueStage(selectedRevenueStage);
      } else {
        toast.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSelectionChange = () => {
    setPendingRevenueStage(selectedRevenueStage);
    setShowRevenueChangeDialog(false);
  };

  // Handle download all KPIs template
  const handleDownloadAllKPIs = async () => {
    setIsDownloadingTemplate(true);
    try {
      await downloadCompanyKPITemplate({
        companyId,
        companyName: companyName || 'Company',
        quarter: selectedQuarter,
        year: selectedYear,
        type: 'all', // Download all KPIs (both quarterly and annual)
      });
      toast.success('Complete KPI template downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // Handle successful upload - reload entries and history
  const handleUploadSuccess = async () => {
    try {
      // Reload ALL quarterly entries to properly track all quarters
      // const { data: allQuarterlyData } = await supabase
      //   .from('kpi_entries')
      //   .select('kpi_id, quarter')
      //   .eq('company_id', companyId)
      //   .eq('year', selectedYear)
      //   .in('quarter', ['Q1', 'Q2', 'Q3', 'Q4'])
      //   .not('value', 'is', null);

      // Reload annual entries
      // const { data: annualData } = await supabase
      //   .from('kpi_entries')
      //   .select('kpi_id')
      //   .eq('company_id', companyId)
      //   .eq('quarter', 'FY')
      //   .eq('year', currentFY)
      //   .not('value', 'is', null);

      const data = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&year=${selectedYear}&quarter=in.(Q1,Q2,Q3,Q4)`);
      const annualDataResponse = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&quarter=FY&year=${currentFY}`)
      const allQuarterlyData = data.data as { kpi_id: string; quarter: string }[];
      const annualData = annualDataResponse.data as { kpi_id: string }[];

      const allFilledIds = new Set<string>();
      allQuarterlyData?.forEach(e => allFilledIds.add(e.kpi_id));
      annualData?.forEach(e => allFilledIds.add(e.kpi_id));
      setFilledKPIIds(allFilledIds);

      toast.success('Data uploaded successfully! View your data on the Dashboard.');
    } catch (error) {
      console.error('Error reloading entries:', error);
    }
  };

  // Calculate filled count using feature template keys (matching kpi_entries.kpi_id text keys)
  const featureFilledCounts = useMemo(() => {
    const counts: Record<string, { filled: number; total: number }> = {};
    [...QUARTERLY_FEATURES, ...ANNUAL_FEATURES].forEach(feature => {
      if (!isFeatureEnabled(feature.key)) return;
      const kpis = getFeatureKPIs(feature.key);
      const filled = kpis.filter(kpi => filledKPIIds.has(kpi.key)).length;
      counts[feature.key] = { filled, total: kpis.length };
    });
    return counts;
  }, [filledKPIIds, isFeatureEnabled]);

  const totalFilledFromTemplates = Object.values(featureFilledCounts).reduce((sum, c) => sum + c.filled, 0);
  const totalKPIsFromTemplates = Object.values(featureFilledCounts).reduce((sum, c) => sum + c.total, 0);
  const filledCount = totalFilledFromTemplates;
  const progress = totalKPIsFromTemplates > 0 ? (totalFilledFromTemplates / totalKPIsFromTemplates) * 100 : 0;

  // Get enabled features
  const enabledQuarterlyFeatures = QUARTERLY_FEATURES.filter(f => isFeatureEnabled(f.key));
  const enabledAnnualFeatures = ANNUAL_FEATURES.filter(f => isFeatureEnabled(f.key));

  // Calculate actual KPI counts from feature templates
  const quarterlyKPICount = useMemo(() => {
    return enabledQuarterlyFeatures.reduce((sum, feature) => {
      const kpis = getFeatureKPIs(feature.key);
      return sum + kpis.length;
    }, 0);
  }, [enabledQuarterlyFeatures]);

  const annualKPICount = useMemo(() => {
    return enabledAnnualFeatures.reduce((sum, feature) => {
      const kpis = getFeatureKPIs(feature.key);
      return sum + kpis.length;
    }, 0);
  }, [enabledAnnualFeatures]);

  const isLoading = false
  // isLoadingProfile || isLoadingEntries || isLoadingKPIs;

  if (isLoading) {
    return (
      <UnifiedSidebarLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </UnifiedSidebarLayout >
    );
  }

  return (
    <UnifiedSidebarLayout>      <PageHeader
      title="KPI Data Entry"
      subtitle={`${selectedQuarter} ${selectedYear}`}
      actions={
        <div className="flex items-center gap-4">
          {/* Download All KPIs Button */}
          <Button
            variant="outline"
            onClick={handleDownloadAllKPIs}
            disabled={isDownloadingTemplate}
          >
            {isDownloadingTemplate ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download Template
          </Button>

          {/* Upload All KPIs Button */}
          <Button
            variant="outline"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reporting Period:</span>
            <PeriodSelector
              quarter={selectedQuarter}
              year={selectedYear}
              onQuarterChange={handleQuarterChange}
              onYearChange={handleYearChange}
            />
          </div>
        </div>
      }
    />

      {/* Company Profile Card */}
      {/* Read-only banner — period-aware (locked for everything except Q1 2026) */}
      {periodLocked ? (
        <EditPausedBanner quarter={selectedQuarter} year={selectedYear} className="mb-4" />
      ) : readOnly && (
        <Card className="border-status-warning/30 bg-status-warning/5 mb-4">
          <CardContent className="p-3 flex items-center gap-3">
            <Lock className="w-4 h-4 text-status-warning shrink-0" />
            <p className="text-xs font-medium text-status-warning">
              View Only — Your company's data entry is currently locked. Contact Fireside Ventures if you need to make changes.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-start">Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="revenue-stage" className="text-xs">Revenue Stage (INR Crores)</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={pendingRevenueStage}
                  onValueChange={(value: RevenueStage) => setPendingRevenueStage(value)}
                  disabled={!!pendingRequest}
                >
                  <SelectTrigger id="revenue-stage" className="bg-background">
                    <SelectValue placeholder="Select revenue stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {REVENUE_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {pendingRequest && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 shrink-0">
                    <Clock className="w-3 h-3 mr-1" />
                    In Review
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <Label htmlFor="industry" className="flex items-center gap-1 text-xs">
                Industry
                <Lock className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="industry"
                value={selectedIndustry}
                disabled
                className="bg-muted cursor-not-allowed h-9 text-sm"
              />
            </div>

            <Button
              onClick={handleApplySelection}
              disabled={!hasSelectionChanged || isSaving || !!pendingRequest}
              className="shrink-0"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Request Change
            </Button>
          </div>

          {pendingRequest && (
            <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Your request to change from {pendingRequest.current_stage} to {pendingRequest.requested_stage} is pending approval.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Revenue Change Confirmation Dialog */}
      <AlertDialog open={showRevenueChangeDialog} onOpenChange={setShowRevenueChangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Revenue Stage Change</AlertDialogTitle>
            <AlertDialogDescription>
              You are requesting to change your revenue stage from <strong>{selectedRevenueStage}</strong> to <strong>{newRevenueStage}</strong>.
              <br /><br />
              This change requires approval from Fireside Admin. Your current KPIs will remain unchanged until the request is approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSelectionChange} disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRevenueChange} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overall Completion Progress Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-start">Overall Completion Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              {quarterlySubmittedAt ? (
                <Badge variant="default" className="bg-esg-e/20 text-esg-e border-esg-e/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Submitted
                </Badge>
              ) : filledCount > 0 ? (
                <Badge variant="outline" className="border-status-warning/50 text-status-warning">
                  <FileEdit className="w-3 h-3 mr-1" />
                  In Progress
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground">
                  Not Started
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{filledCount}/{totalKPIsFromTemplates} KPIs</span>
          </div>

          {quarterlySubmittedAt && (
            <p className="text-xs text-muted-foreground mb-2">
              Last submitted: {new Date(quarterlySubmittedAt).toLocaleString()}
            </p>
          )}

          <Progress value={progress} className="h-2" />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <div className="ml-auto flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <CalendarDays className="w-3 h-3 mr-1" />
                Quarterly: {quarterlyKPICount}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Annual: {annualKPICount}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Features */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Quarterly KPIs ({selectedQuarter} {selectedYear})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {enabledQuarterlyFeatures.map(feature => {
            const Icon = FEATURE_ICONS[feature.key] || Briefcase;
            const counts = featureFilledCounts[feature.key] || { filled: 0, total: 0 };
            const pct = counts.total > 0 ? Math.round((counts.filled / counts.total) * 100) : 0;

            return (
              <Card
                key={feature.key}
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => navigate(`/mis/kpi-entry?tab=quarterly&feature=${feature.key}&quarter=${selectedQuarter}&year=${selectedYear}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{feature.label}</p>
                        <p className="text-xs text-muted-foreground">{counts.filled}/{counts.total} filled</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <Progress value={pct} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Annual Features */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Annual KPIs (FY {selectedYear})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {enabledAnnualFeatures.map(feature => {
            const Icon = FEATURE_ICONS[feature.key] || Briefcase;
            const counts = featureFilledCounts[feature.key] || { filled: 0, total: 0 };
            const pct = counts.total > 0 ? Math.round((counts.filled / counts.total) * 100) : 0;

            return (
              <Card
                key={feature.key}
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => navigate(`/mis/kpi-entry?tab=annual&feature=${feature.key}&quarter=Q4&year=${selectedYear}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{feature.label}</p>
                        <p className="text-xs text-muted-foreground">{counts.filled}/{counts.total} filled</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <Progress value={pct} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      {/* Upload Dialog */}
      <UploadKPITemplateDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        companyId={companyId}
        quarter={selectedQuarter}
        year={selectedYear}
        onSuccess={handleUploadSuccess}
      />
    </UnifiedSidebarLayout>
  );
};

export default DataEntry;
