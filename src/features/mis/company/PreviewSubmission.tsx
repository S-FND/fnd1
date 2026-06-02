import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
// import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { createSubmissionNotification } from '@/hooks/useAdminNotifications';
import { useCompanyFeatures, QUARTERLY_FEATURES, ANNUAL_FEATURES } from '@/hooks/useCompanyFeatures';
import { mockCompanies } from '@/data/mockData';
import { toast } from 'sonner';
import { PeriodSelector } from '@/components/PeriodSelector';
import { isPeriodEditable } from '@/lib/companyAccessControl';
import { FEATURE_FIELD_MAPPINGS, getFeatureKPIs } from '@/lib/featureFieldMapping';
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowLeft,
  FileText,
  Eye,
  Package,
  Briefcase,
  Truck,
  Users,
  Award,
  Building2,
  Droplets,
  Zap,
  Recycle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { httpClient } from '@/lib/httpClient';
import { useAuth } from '@/context/AuthContext';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { all } from 'axios';

// Feature icon mapping
const FEATURE_ICONS: Record<string, React.ElementType> = {
  businessInformation: Briefcase,
  sourcingFulfillment: Truck,
  social: Users,
  primarySecondaryPackaging: Package,
  fashionMaterials: Package,
  incidentLog: AlertCircle,
  productServiceCertifications: Award,
  healthCare: HelpCircle,
  operations: Building2,
  certifications: Award,
  governancePolicies: FileText,
  waterManagement: Droplets,
  energyManagement: Zap,
  wasteManagement: Recycle,
  csr: Users,
  sri: FileText,
  externalReporting: FileText,
};

// Get current financial year
const getCurrentFinancialYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 3 ? year : year - 1;
};

interface KPIEntry {
  kpi_id: string;
  value: string;
  quarter: string;
  year: number;
  submitted_at: string | null;
}

interface FeatureData {
  featureKey: string;
  featureLabel: string;
  featureType: 'quarterly' | 'annual';
  entries: Array<{
    kpiId: string;
    kpiName: string;
    value: string;
  }>;
  filledCount: number;
}

const PreviewSubmission = () => {
  const { user, companyName, effectiveCompanyId } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const companyId = effectiveCompanyId || user?.company_id || 'company-1';

  useEffect(() => {
    console.log('Auth context values in PreviewSubmission:', { user, effectiveCompanyId, companyId });
  }, [effectiveCompanyId, user]);

  // Period selection from URL params — default to the open period (Q1 2026)
  const selectedQuarter = searchParams.get('quarter') || 'Q1';
  const selectedYear = parseInt(searchParams.get('year') || '2026');
  const currentFY = getCurrentFinancialYear();
  const periodEditable = isPeriodEditable(selectedQuarter, selectedYear);

  // Handle period changes - update URL params
  const handleQuarterChange = useCallback((newQuarter: string) => {
    setSearchParams(prev => {
      prev.set('quarter', newQuarter);
      return prev;
    });
  }, [setSearchParams]);

  const handleYearChange = useCallback((newYear: number) => {
    setSearchParams(prev => {
      prev.set('year', newYear.toString());
      return prev;
    });
  }, [setSearchParams]);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [allEntries, setAllEntries] = useState<KPIEntry[]>([]);
  const [featureData, setFeatureData] = useState<FeatureData[]>([]);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [companyIndustry, setCompanyIndustry] = useState<string | null>(null);

  // Get enabled features
  const { isFeatureEnabled, loading: loadingFeatures } = useCompanyFeatures(companyId);

  // Fetch company industry - fall back to mock data
  useEffect(() => {
    const fetchIndustry = async () => {
      try {
        // const { data } = await supabase
        //   .from('company_profiles')
        //   .select('industry')
        //   .eq('company_id', companyId)
        //   .maybeSingle();
        const data: { data: { industry: string | null } } = await httpClient.get(`mis/company-profiles?companyId=${companyId}`); // Updated to use httpClient

        if (data) {
          setCompanyIndustry(data.data.industry);
        } else {
          // Fallback to mock data
          const mockCompany = mockCompanies.find(c => c.id === companyId);
          if (mockCompany) {
            setCompanyIndustry(mockCompany.industry);
          }
        }
      } catch (error) {
        console.error('Error fetching industry:', error);
        // Fallback to mock data on error
        const mockCompany = mockCompanies.find(c => c.id === companyId);
        if (mockCompany) {
          setCompanyIndustry(mockCompany.industry);
        }
      }
    };
    fetchIndustry();
  }, [companyId]);

  // Get enabled features filtered by industry
  const enabledQuarterlyFeatures = useMemo(() => {
    return QUARTERLY_FEATURES.filter(f => {
      if (!isFeatureEnabled(f.key)) return false;
      if (f.key === 'fashionMaterials' && companyIndustry !== 'Fashion & Lifestyle') return false;
      return true;
    });
  }, [isFeatureEnabled, companyIndustry]);

  const enabledAnnualFeatures = useMemo(() => {
    return ANNUAL_FEATURES.filter(f => isFeatureEnabled(f.key));
  }, [isFeatureEnabled]);

  // Feature to KPI prefix mapping - updated to match actual database KPI patterns
  // IMPORTANT: Governance policies use 'policy_' prefix which must NOT match other features
  // Order doesn't matter since we use explicit categorization logic below
  const FEATURE_KPI_PREFIXES: Record<string, string[]> = useMemo(() => ({
    // Quarterly features
    businessInformation: ['business_info_', 'net_revenue', 'revenue_tier2_plus', 'total_customers_served', 'unique_female_customers', 'unique_incremental_customers'],
    // Sourcing uses specific prefixes - 'vendor_practices_' belongs to sourcing too
    sourcingFulfillment: ['sourcing_', 'supplier_', 'logistics_carbon_', 'msme_supplier_percentage', 'vendor_mis_', 'vendor_count', 'total_vendors', 'active_vendors', 'women_led_vendors', 'women_vendor_pct', 'vendor_practices_'],
    social: ['employees_', 'emp_', 'wages_', 'workforce_', 'leadership_', 'enps', 'diversity_'],
    primarySecondaryPackaging: ['food_pkg_', 'pkg_', 'packaging_', 'epr_'],
    fashionMaterials: ['fashion_pkg_', 'fashion_materials_', 'fashion_total_', 'fashion_sustainable_', 'fashion_recyclable_', 'fashion_non_recyclable_', 'fashion_material_', 'fashion_warehouse_pkg_', 'fashion_packaging_reuse_', 'fashion_primary_pkg_', 'fashion_secondary_pkg_', 'fashion_epr_', 'fashion_waste_expenditure'],
    // Incidents uses 'incident_' prefix only - 'grievance_' is separate from governance
    incidentLog: ['incident_', 'grievance_count', 'grievance_resolved', 'grievance_pending', 'grievance_total', 'has_grievances', 'grievances_data'],
    // Awards & Recognitions - uses founder_awards, media_mentions, other_initiatives
    productServiceCertifications: ['award_', 'recognition_', 'certification_award_', 'founder_awards_list', 'media_mentions_list', 'other_initiatives_list'],
    healthCare: ['healthcare_', 'health_care_', 'doctor_', 'patient_'],
    // Annual features  
    operations: ['operations_'],
    certifications: ['cert_', 'certification_', 'patents_'],
    // Governance policies - 'policy_' prefix is ONLY for governance (e.g., policy_posh_in_place, policy_code_of_conduct_training)
    governancePolicies: ['governance_', 'policy_posh_', 'policy_code_of_conduct_', 'policy_supplier_code_of_conduct_', 'policy_health_and_safety_', 'policy_dei_', 'policy_hr_', 'policy_human_rights_', 'policy_esg_', 'policy_environment_', 'policy_grievance_internal_', 'policy_grievance_external_', 'policy_data_protection_'],
    waterManagement: ['water_detailed_', 'water_consumed', 'fresh_water_', 'wastewater_'],
    energyManagement: ['energy_detailed_', 'energy_consumed', 'renewable_', 'solar_'],
    wasteManagement: ['waste_detailed_', 'waste_generated', 'waste_recycled_', 'recycling_', 'disposal_'],
    csr: ['csr_'],
    sri: ['sri_'],
    externalReporting: ['ext_', 'external_reporting_'],
  }), []);

  // Load all KPI entries - only depends on stable values
  useEffect(() => {
    const loadAllEntries = async () => {
      if (loadingFeatures) return;

      setIsLoading(true);
      try {
        // Load quarterly entries
        // const { data: quarterlyData, error: quarterlyError } = await supabase
        //   .from('kpi_entries')
        //   .select('kpi_id, value, quarter, year, submitted_at')
        //   .eq('company_id', companyId)
        //   .eq('quarter', selectedQuarter)
        //   .eq('year', selectedYear)
        //   .not('value', 'is', null)
        //   .neq('value', '');
        const quarterdata: { data: KPIEntry[] } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&year=${selectedYear}`); // Updated to use httpClient
        // quarter=${selectedQuarter}
        const allEntries = quarterdata.data || [];
        const quarterlyData = allEntries.filter(e => e.quarter === selectedQuarter);

        // if (quarterlyError) throw quarterlyError;

        // Load annual entries
        // const { data: annualData, error: annualError } = await supabase
        //   .from('kpi_entries')
        //   .select('kpi_id, value, quarter, year, submitted_at')
        //   .eq('company_id', companyId)
        //   .eq('quarter', 'FY')
        //   .eq('year', currentFY)
        //   .not('value', 'is', null)
        //   .neq('value', '');

        // const data:{ data: KPIEntry[] } = await httpClient.get(`mis/kpi-entries?companyId=${companyId}&year=${currentFY}`); // Updated to use httpClient
        // &quarter=FY
        const annualData = allEntries.filter(e => e.quarter === 'FY' && e.year === currentFY);
        // data.data;

        const combined = [...(quarterlyData || []), ...(annualData || [])];
        setAllEntries(combined);
      } catch (error) {
        console.error('Error loading entries:', error);
        toast.error('Failed to load KPI data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllEntries();
  }, [companyId, selectedQuarter, selectedYear, currentFY, loadingFeatures]);

  // Get entries for a specific feature - helper function
  const getFeatureEntriesHelper = (
    featureKey: string,
    entries: KPIEntry[],
    type: 'quarterly' | 'annual',
    prefixes: string[]
  ): { entries: Array<{ kpiId: string; kpiName: string; value: string }>; filledCount: number } => {
    const featureEntries: Array<{ kpiId: string; kpiName: string; value: string }> = [];
    const additionalCommentsKey = `${featureKey}_additional_comments`;

    // Governance policy prefixes to exclude from non-governance features
    const governancePolicyPrefixes = [
      'policy_posh_', 'policy_code_of_conduct_', 'policy_supplier_code_of_conduct_',
      'policy_health_and_safety_', 'policy_dei_', 'policy_hr_', 'policy_human_rights_',
      'policy_esg_', 'policy_environment_', 'policy_grievance_internal_',
      'policy_grievance_external_', 'policy_data_protection_', 'governance_'
    ];

    // Certification prefixes - these should ONLY appear under certifications feature
    const certificationPrefixes = ['cert_', 'certification_', 'patents_'];

    entries.forEach(entry => {
      const kpiIdLower = entry.kpi_id.toLowerCase();

      // Skip governance policy entries for non-governance features
      if (featureKey !== 'governancePolicies') {
        const isGovernancePolicy = governancePolicyPrefixes.some(prefix =>
          kpiIdLower.startsWith(prefix.toLowerCase())
        );
        if (isGovernancePolicy) return;
      }

      // Skip certification entries for non-certification features
      // Certifications should ONLY appear under the 'certifications' feature
      if (featureKey !== 'certifications') {
        const isCertification = certificationPrefixes.some(prefix =>
          kpiIdLower.startsWith(prefix.toLowerCase())
        );
        if (isCertification) return;
      }

      const matchesPattern = prefixes.some(prefix =>
        kpiIdLower.startsWith(prefix.toLowerCase()) || kpiIdLower.includes(prefix.toLowerCase())
      );
      const isAdditionalComments = entry.kpi_id === additionalCommentsKey;

      if ((matchesPattern || isAdditionalComments) && entry.value && entry.value.trim() !== '') {
        featureEntries.push({
          kpiId: entry.kpi_id,
          kpiName: formatKpiName(entry.kpi_id),
          value: formatValue(entry.value, entry.kpi_id),
        });
      }
    });

    return { entries: featureEntries, filledCount: featureEntries.length };
  };

  // Build feature data when entries or enabled features change
  useEffect(() => {
    if (isLoading) return;

    const features: FeatureData[] = [];

    // Process quarterly features
    enabledQuarterlyFeatures.forEach(feature => {
      const prefixes = FEATURE_KPI_PREFIXES[feature.key] || [];
      const featureEntries = getFeatureEntriesHelper(feature.key, allEntries, 'quarterly', prefixes);
      features.push({
        featureKey: feature.key,
        featureLabel: feature.label,
        featureType: 'quarterly',
        entries: featureEntries.entries,
        filledCount: featureEntries.filledCount,
      });
    });

    // Process annual features
    enabledAnnualFeatures.forEach(feature => {
      const prefixes = FEATURE_KPI_PREFIXES[feature.key] || [];
      const featureEntries = getFeatureEntriesHelper(feature.key, allEntries, 'annual', prefixes);
      features.push({
        featureKey: feature.key,
        featureLabel: feature.label,
        featureType: 'annual',
        entries: featureEntries.entries,
        filledCount: featureEntries.filledCount,
      });
    });

    setFeatureData(features);
  }, [allEntries, isLoading, enabledQuarterlyFeatures, enabledAnnualFeatures, FEATURE_KPI_PREFIXES]);


  // KPI ID to human-readable label mapping for specialized fields
  const KPI_LABELS: Record<string, string> = {
    // Business Information
    net_revenue: 'Net Revenue',
    revenue_tier2_plus: '% of Revenue from Tier-2+ Markets',
    total_customers_served: 'No. of Total Customers Served',
    unique_female_customers: '% of Unique Female Customers',
    unique_incremental_customers: 'Unique Incremental Customers',

    // Sourcing & Fulfillment
    msme_supplier_percentage: '% of Spend on MSME Suppliers',
    logistics_carbon_initiatives: 'Logistics Optimization & Carbon Emissions Initiatives',
    vendor_practices_description: 'Vendor Selection & Management Practices',
    vendor_practices_weblinks: 'Vendor Practices Weblinks',
    vendor_mis_input_materials_num_vendors: 'Input Materials - Number of Vendors',
    vendor_mis_input_materials_pct_international: 'Input Materials - % International',
    vendor_mis_input_materials_size: 'Input Materials - Business Size',
    vendor_mis_input_materials_dei_factors: 'Input Materials - DEI Factors',
    vendor_mis_manufacturing_num_vendors: 'Manufacturing - Number of Vendors',
    vendor_mis_manufacturing_pct_international: 'Manufacturing - % International',
    vendor_mis_manufacturing_size: 'Manufacturing - Business Size',
    vendor_mis_manufacturing_dei_factors: 'Manufacturing - DEI Factors',
    vendor_mis_packaging_num_vendors: 'Packaging - Number of Vendors',
    vendor_mis_packaging_pct_international: 'Packaging - % International',
    vendor_mis_packaging_size: 'Packaging - Business Size',
    vendor_mis_packaging_dei_factors: 'Packaging - DEI Factors',
    vendor_mis_logistics_warehousing_num_vendors: 'Logistics & Warehousing - Number of Vendors',
    vendor_mis_logistics_warehousing_pct_international: 'Logistics & Warehousing - % International',
    vendor_mis_logistics_warehousing_size: 'Logistics & Warehousing - Business Size',
    vendor_mis_logistics_warehousing_dei_factors: 'Logistics & Warehousing - DEI Factors',
    vendor_mis_stores_clinics_num_vendors: 'Stores / Clinics - Number of Vendors',
    vendor_mis_stores_clinics_pct_international: 'Stores / Clinics - % International',
    vendor_mis_stores_clinics_size: 'Stores / Clinics - Business Size',
    vendor_mis_stores_clinics_dei_factors: 'Stores / Clinics - DEI Factors',

    // Awards & Recognitions
    founder_awards_list: 'Awards and Recognitions',
    media_mentions_list: 'Significant Media Mentions',
    other_initiatives_list: 'Other Initiatives',

    // CSR
    csr_amount_spent: 'CSR Amount Spent (₹)',
    csr_implementation: 'Program Implementation',
    csr_initiatives_list: 'CSR Initiatives',

    // Healthcare
    healthcare_consultations_screenings: 'No. of Doctor Consultations/Patient Screenings',
    healthcare_products_services: 'No. of Healthcare Products/Services Offered',
    healthcare_diseases_addressed: 'Diseases/Conditions Addressed',

    // Employment & Compensation - White Collar
    employees_wc_male_fulltime: 'White-Collar Employees (Male) - Full-Time',
    employees_wc_male_contractual: 'White-Collar Employees (Male) - Contractual',
    employees_wc_male_parttime: 'White-Collar Employees (Male) - Part-Time',
    employees_wc_female_fulltime: 'White-Collar Employees (Female) - Full-Time',
    employees_wc_female_contractual: 'White-Collar Employees (Female) - Contractual',
    employees_wc_female_parttime: 'White-Collar Employees (Female) - Part-Time',
    employees_wc_total_employees: 'Total White-Collar Employees',
    employees_wc_wages_male: 'White-Collar Gross Wages (Male)',
    employees_wc_wages_female: 'White-Collar Gross Wages (Female)',
    employees_wc_total_wages: 'Total White-Collar Gross Wages',

    // Employment & Compensation - Blue Collar
    employees_bc_male_fulltime: 'Blue-Collar Employees (Male) - Full-Time',
    employees_bc_male_contractual: 'Blue-Collar Employees (Male) - Contractual',
    employees_bc_male_parttime: 'Blue-Collar Employees (Male) - Part-Time',
    employees_bc_female_fulltime: 'Blue-Collar Employees (Female) - Full-Time',
    employees_bc_female_contractual: 'Blue-Collar Employees (Female) - Contractual',
    employees_bc_female_parttime: 'Blue-Collar Employees (Female) - Part-Time',
    employees_bc_total_employees: 'Total Blue-Collar Employees',
    employees_bc_wages_male: 'Blue-Collar Gross Wages (Male)',
    employees_bc_wages_female: 'Blue-Collar Gross Wages (Female)',
    employees_bc_total_wages: 'Total Blue-Collar Gross Wages',

    // Employment - Other Metrics
    employees_enps: 'Employee Net Promoter Score (eNPS)',
    employees_attrition_rate: 'Attrition Rate',
    employees_pwd_percentage: '% of Persons with Disabilities',
    employees_total_employment: 'Total Employment',
    employees_total_wages: 'Total Gross Wages',

    // Leadership
    leadership_clevel_total: 'Total C-Level Executives',
    leadership_clevel_female: 'Female C-Level Executives',
    leadership_board_total: 'Total Board Members',
    leadership_board_female: 'Female Board Members',
    leadership_board_independent: 'Independent Board Members',
    leadership_avg_cxo_compensation: 'Avg CXO Compensation',

    // Incidents & Grievances
    incident_posh_cases: 'PoSH - Number of Cases',
    incident_posh_open_cases: 'PoSH - Cases Open/Unresolved',
    incident_posh_impact: 'PoSH - Impact on Business',
    incident_supplier_vendor_cases: 'Supplier/Vendor Issues - Number of Cases',
    incident_supplier_vendor_open_cases: 'Supplier/Vendor Issues - Cases Open/Unresolved',
    incident_supplier_vendor_impact: 'Supplier/Vendor Issues - Impact on Business',
    incident_customer_grievance_cases: 'Customer Grievance - Number of Cases',
    incident_customer_grievance_open_cases: 'Customer Grievance - Cases Open/Unresolved',
    incident_customer_grievance_impact: 'Customer Grievance - Impact on Business',
    incident_employee_grievance_cases: 'Employee Grievance - Number of Cases',
    incident_employee_grievance_open_cases: 'Employee Grievance - Cases Open/Unresolved',
    incident_employee_grievance_impact: 'Employee Grievance - Impact on Business',
    incident_environmental_cases: 'Environmental Incidents - Number of Cases',
    incident_environmental_open_cases: 'Environmental Incidents - Cases Open/Unresolved',
    incident_environmental_impact: 'Environmental Incidents - Impact on Business',
    incident_health_safety_cases: 'Health & Safety - Number of Cases',
    incident_health_safety_open_cases: 'Health & Safety - Cases Open/Unresolved',
    incident_health_safety_impact: 'Health & Safety - Impact on Business',
    incident_security_data_privacy_cases: 'Data/Privacy Breach - Number of Cases',
    incident_security_data_privacy_open_cases: 'Data/Privacy Breach - Cases Open/Unresolved',
    incident_security_data_privacy_impact: 'Data/Privacy Breach - Impact on Business',
    incident_negative_media_cases: 'Negative Media - Number of Cases',
    incident_negative_media_open_cases: 'Negative Media - Cases Open/Unresolved',
    incident_negative_media_impact: 'Negative Media - Impact on Business',
    incident_anti_bribery_corruption_cases: 'Anti-bribery & Corruption - Number of Cases',
    incident_anti_bribery_corruption_open_cases: 'Anti-bribery & Corruption - Cases Open/Unresolved',
    incident_anti_bribery_corruption_impact: 'Anti-bribery & Corruption - Impact on Business',
    incident_other_regulatory_cases: 'Other Regulatory - Number of Cases',
    incident_other_regulatory_open_cases: 'Other Regulatory - Cases Open/Unresolved',
    incident_other_regulatory_impact: 'Other Regulatory - Impact on Business',
    has_grievances: 'Do you have any grievances logged?',
    grievances_data: 'Grievances Details',

    // Operations
    operations_msme_classification: 'MSME/Udhyam Classification',
    operations_rented_owned_corporate_office_count: 'Rented/Owned Corporate Office - Count',
    operations_coworking_corporate_office_count: 'Co-working Corporate Office - Count',
    operations_owned_manufacturing_units_count: 'Owned Manufacturing Units - Count',
    operations_third_party_manufacturing_count: 'Third Party Manufacturing - Count',
    operations_owned_warehouses_count: 'Owned Warehouses - Count',
    operations_third_party_logistics_count: 'Third Party Logistics - Count',
    operations_coco_stores_count: 'COCO Stores - Count',
    operations_foco_stores_count: 'FOCO Stores - Count',

    // Certifications
    cert_ingredient_self_number: 'Ingredient Certifications (Self) - Number',
    cert_ingredient_self_names: 'Ingredient Certifications (Self) - Names',
    cert_ingredient_self_validity: 'Ingredient Certifications (Self) - Validity',
    cert_packaging_self_number: 'Packaging Certifications (Self) - Number',
    cert_packaging_self_names: 'Packaging Certifications (Self) - Names',
    cert_energy_self_number: 'Energy Certifications (Self) - Number',
    cert_production_self_number: 'Production Certifications (Self) - Number',
    cert_quality_self_number: 'Quality Certifications (Self) - Number',
    patents_granted: 'Patents/IPs - Granted',
    patents_filed: 'Patents/IPs - Filed',

    // Governance Policies
    policy_posh_in_place: 'PoSH Policy - In Place',
    policy_posh_training: 'PoSH Policy - Training Conducted',
    policy_code_of_conduct_in_place: 'Code of Conduct - In Place',
    policy_code_of_conduct_training: 'Code of Conduct - Training Conducted',
    policy_supplier_code_of_conduct_in_place: 'Supplier Code of Conduct - In Place',
    policy_health_and_safety_in_place: 'Health & Safety Policy - In Place',
    policy_dei_in_place: 'DEI Policy - In Place',
    policy_hr_in_place: 'HR Policy - In Place',
    policy_data_protection_in_place: 'Data Protection Policy - In Place',

    // Energy Management
    energy_detailed_office_energy_consumed: 'Office - Energy Consumed',
    energy_detailed_office_renewable_pct: 'Office - Renewable Energy %',
    energy_detailed_warehouses_energy_consumed: 'Warehouses - Energy Consumed',
    energy_detailed_manufacturing_energy_consumed: 'Manufacturing - Energy Consumed',

    // Water Management
    water_detailed_office_water_consumed: 'Office - Water Consumed',
    water_detailed_warehouses_water_consumed: 'Warehouses - Water Consumed',
    water_detailed_manufacturing_water_consumed: 'Manufacturing - Water Consumed',

    // Waste Management
    waste_detailed_office_waste_generated: 'Office - Waste Generated',
    waste_detailed_office_waste_recycled_pct: 'Office - Waste Recycled %',
    waste_detailed_warehouses_waste_generated: 'Warehouses - Waste Generated',
    waste_detailed_manufacturing_waste_generated: 'Manufacturing - Waste Generated',

    // Packaging
    food_pkg_basic_approach_current_approach: 'Packaging - Current Approach',
    food_pkg_basic_approach_vision_plans: 'Packaging - Vision & Plans',
    food_pkg_basic_total_total_material_used: 'Total Packaging Material Used',
    food_pkg_basic_total_total_material_recycled: 'Total Packaging Material Recycled',
    food_pkg_basic_compliance_epr_targets_cpcb: 'EPR Targets (CPCB)',
    food_pkg_basic_compliance_epr_compliance_pct: 'EPR Compliance %',

    // Fashion Materials
    fashion_materials_approach_vision: 'Materials - Approach & Vision',
    fashion_total_materials_kg: 'Total Materials Used (kg)',
    fashion_sustainable_materials_pct: 'Sustainable Materials %',
    fashion_recyclable_materials_pct: 'Recyclable Materials %',

    // SRI
    sri_total_beneficiaries_curr: 'Total Beneficiaries (Current)',
    sri_women_beneficiaries_curr: 'Women Beneficiaries (Current)',
    sri_total_jobs_created_curr: 'Total Jobs Created (Current)',
    sri_states_impacted_curr: 'States Impacted (Current)',

    // External Reporting
    ext_beneficiaries: 'Beneficiaries',
    ext_jobs_created: 'Jobs Created',
    ext_enterprise_emissions: 'Enterprise and Emissions',
    ext_development_indicators: 'Development Indicators',
    ext_training_safety: 'Training and Safety',
    ext_social_security: 'Social Security',
    ext_testimonials_other: 'Testimonials and Other',
    ext_progress_milestones: 'Progress and Milestones',
  };

  // Format KPI ID to readable name
  const formatKpiName = (kpiId: string): string => {
    // First check if we have a predefined label
    if (KPI_LABELS[kpiId]) {
      return KPI_LABELS[kpiId];
    }

    // Fall back to auto-formatting with more comprehensive transformations
    return kpiId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      // Fix abbreviations first before they get capitalized incorrectly
      .replace(/\bEmployees Wc /g, 'White-Collar Employees ')
      .replace(/\bEmployees Bc /g, 'Blue-Collar Employees ')
      .replace(/\bWc /g, 'White-Collar ')
      .replace(/\bBc /g, 'Blue-Collar ')
      .replace(/ Wc /g, ' White-Collar ')
      .replace(/ Bc /g, ' Blue-Collar ')
      .replace(/\bWc\b/g, 'White-Collar')
      .replace(/\bBc\b/g, 'Blue-Collar')
      .replace(/\bPct\b/g, '%')
      .replace(/ Pct /g, ' % ')
      .replace(/ Pct$/g, ' %')
      .replace(/\bMt\b/g, 'MT')
      .replace(/\bInr Cr\b/g, 'INR Cr')
      .replace(/\bNum\b/g, 'Number of')
      .replace(/\bEnps\b/g, 'eNPS')
      .replace(/\bPwd\b/g, 'PwD')
      .replace(/\bNa\b/g, 'N/A')
      .replace(/\bEpr\b/g, 'EPR')
      .replace(/\bDei\b/g, 'DEI')
      .replace(/\bMsme\b/g, 'MSME')
      .replace(/\bCoco\b/g, 'COCO')
      .replace(/\bFoco\b/g, 'FOCO')
      .replace(/\bPosh\b/g, 'PoSH')
      .replace(/\bCxo\b/g, 'CXO')
      .replace(/\bSri\b/g, 'SRI')
      .replace(/\bCsr\b/g, 'CSR');
  };

  // Format value for display
  const formatValue = (value: string, kpiId?: string): string => {
    if (value === 'true') return 'Yes';
    if (value === 'false') return 'No';

    // Try to parse JSON arrays (awards, initiatives, etc.)
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) return '-';

        // Handle award entries
        if (kpiId === 'founder_awards_list') {
          return parsed.map((award: any) =>
            `${award.title || 'Award'}${award.year ? ` (${award.year})` : ''}`
          ).join('; ') || '-';
        }

        // Handle media mentions
        if (kpiId === 'media_mentions_list') {
          return parsed.map((mention: any) =>
            `${mention.title || 'Media Mention'}${mention.source ? ` - ${mention.source}` : ''}`
          ).join('; ') || '-';
        }

        // Handle initiatives (CSR or other)
        if (kpiId === 'other_initiatives_list' || kpiId === 'csr_initiatives_list') {
          return `${parsed.length} initiative${parsed.length > 1 ? 's' : ''} documented`;
        }

        // Handle weblinks array
        if (kpiId?.includes('weblinks')) {
          const links = parsed.filter((l: string) => l && l.trim());
          return links.length > 0 ? `${links.length} link(s)` : '-';
        }

        // Generic array handling
        return parsed.join(', ') || '-';
      }
    } catch {
      // Not JSON, return as-is
    }

    // Truncate long text
    if (value.length > 200) {
      return value.substring(0, 197) + '...';
    }

    return value || '-';
  };

  // Toggle feature expansion
  const toggleFeature = (featureKey: string) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(featureKey)) {
        next.delete(featureKey);
      } else {
        next.add(featureKey);
      }
      return next;
    });
  };

  // Expand all features
  const expandAll = () => {
    const allKeys = featureData.map(f => f.featureKey);
    setExpandedFeatures(new Set(allKeys));
  };

  // Collapse all features
  const collapseAll = () => {
    setExpandedFeatures(new Set());
  };

  // Handle submit button click - show confirmation
  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  // Handle final submission
  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();

      // Update submitted_at for quarterly entries
      // const { error: quarterlyError } = await supabase
      //   .from('kpi_entries')
      //   .update({ submitted_at: now })
      //   .eq('company_id', companyId)
      //   .eq('quarter', selectedQuarter)
      //   .eq('year', selectedYear);
      const quarterlyUpdateData = { submitted_at: now };
      let quarterlyResponse = await httpClient.put(`mis/kpi-entries/submit?quarter=${selectedQuarter}&year=${selectedYear}`); // Updated to use httpClient
      console.log('Quarterly submission response:', quarterlyResponse);
      // if (quarterlyError) throw quarterlyError;

      // Update submitted_at for annual entries
      // const { error: annualError } = await supabase
      //   .from('kpi_entries')
      //   .update({ submitted_at: now })
      //   .eq('company_id', companyId)
      //   .eq('quarter', 'FY')
      //   .eq('year', currentFY);
      const annualUpdateData = { submitted_at: now };
      let annualResponse = await httpClient.put(`mis/kpi-entries/submit?quarter=FY&year=${currentFY}`); // Updated to use httpClient
      console.log('Annual submission response:', annualResponse);

      // if (annualError) throw annualError;

      // Create admin notification for submission
      await createSubmissionNotification(
        companyId,
        companyName || 'Unknown Company',
        selectedQuarter,
        selectedYear,
        totalFilled
      );

      setSubmitSuccess(true);
      toast.success('All KPIs submitted successfully!');
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit KPIs');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate overall stats
  const totalFilled = allEntries.length;
  const quarterlyFeatures = featureData.filter(f => f.featureType === 'quarterly');
  const annualFeatures = featureData.filter(f => f.featureType === 'annual');
  const quarterlyFilled = quarterlyFeatures.reduce((sum, f) => sum + f.filledCount, 0);
  const annualFilled = annualFeatures.reduce((sum, f) => sum + f.filledCount, 0);

  if (isLoading || loadingFeatures) {
    return (
      <UnifiedSidebarLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </UnifiedSidebarLayout>
    );
  }

  // Success state after submission
  if (submitSuccess) {
    return (
      <UnifiedSidebarLayout>
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
          <div className="w-20 h-20 rounded-full bg-status-success/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-status-success" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Submission Successful!</h2>
            <p className="text-muted-foreground max-w-md">
              All your KPI data for {selectedQuarter} {selectedYear} and FY {currentFY}-{String(currentFY + 1).slice(-2)} has been submitted successfully for review.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/mis/data-entry')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to KPI Entry
            </Button>
            <Button onClick={() => navigate('/mis/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </UnifiedSidebarLayout>
    );
  }

  return (
    <UnifiedSidebarLayout>
      <div className="text-left mt-2">
        <PageHeader
          title="Preview & Submit"
          subtitle={`Review all KPI data for ${selectedQuarter} ${selectedYear} and AY ${selectedYear}`}
          actions={
            <div className="flex items-center gap-4">
              <PeriodSelector
                quarter={selectedQuarter}
                year={selectedYear}
                onQuarterChange={handleQuarterChange}
                onYearChange={handleYearChange}
                includeAnnual
              />
              <Button variant="ghost" onClick={() => navigate('/mis/data-entry')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to KPI Entry
              </Button>
            </div>
          }
        />
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fields Filled</p>
                <p className="text-2xl font-bold text-left">{totalFilled}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quarterly KPIs</p>
                <p className="text-2xl font-bold text-left">{quarterlyFilled}</p>
                <p className="text-xs text-muted-foreground text-left">{quarterlyFeatures.length} features</p>
              </div>
              <Calendar className="w-8 h-8 text-esg-environment" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual KPIs</p>
                <p className="text-2xl font-bold text-left">{annualFilled}</p>
                <p className="text-xs text-muted-foreground text-left">{annualFeatures.length} features</p>
              </div>
              <CalendarDays className="w-8 h-8 text-esg-social" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <Eye className="w-4 h-4 mr-1" />
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <Button onClick={handleSubmitClick} disabled={isSubmitting || totalFilled === 0 || !periodEditable} title={!periodEditable ? `${selectedQuarter} ${selectedYear} is locked` : undefined}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Submit All KPIs
        </Button>
      </div>

      {totalFilled === 0 && (
        <Alert className="mb-6 text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No KPI data has been entered yet. Please go to KPI Entry and fill in your data before submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Quarterly Features */}
      {quarterlyFeatures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-esg-environment" />
            Quarterly KPIs ({selectedQuarter} {selectedYear})
          </h2>
          <div className="space-y-3">
            {quarterlyFeatures.map(feature => {
              const Icon = FEATURE_ICONS[feature.featureKey] || FileText;
              const isExpanded = expandedFeatures.has(feature.featureKey);
              const hasData = feature.entries.length > 0;

              return (
                <Card key={feature.featureKey} className={cn(!hasData && 'opacity-60')}>
                  <Collapsible open={isExpanded} onOpenChange={() => toggleFeature(feature.featureKey)}>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <Icon className="w-5 h-5 text-primary" />
                            <CardTitle className="text-sm font-medium">{feature.featureLabel}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={hasData ? 'default' : 'secondary'}>
                              {feature.entries.length} fields filled
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 px-4 pb-4">
                        {hasData ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/30">
                                  <TableHead className="w-[40%]">Field</TableHead>
                                  <TableHead className="w-[60%]">Value</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {feature.entries.map((entry, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium text-sm">{entry.kpiName}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      <span className="whitespace-pre-wrap">{entry.value}</span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No data entered for this feature</p>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Annual Features */}
      {annualFeatures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-esg-social" />
            Annual KPIs (FY {currentFY}-{String(currentFY + 1).slice(-2)})
          </h2>
          <div className="space-y-3">
            {annualFeatures.map(feature => {
              const Icon = FEATURE_ICONS[feature.featureKey] || FileText;
              const isExpanded = expandedFeatures.has(feature.featureKey);
              const hasData = feature.entries.length > 0;

              return (
                <Card key={feature.featureKey} className={cn(!hasData && 'opacity-60')}>
                  <Collapsible open={isExpanded} onOpenChange={() => toggleFeature(feature.featureKey)}>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <Icon className="w-5 h-5 text-primary" />
                            <CardTitle className="text-sm font-medium">{feature.featureLabel}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={hasData ? 'default' : 'secondary'}>
                              {feature.entries.length} fields filled
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 px-4 pb-4">
                        {hasData ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/30">
                                  <TableHead className="w-[40%]">Field</TableHead>
                                  <TableHead className="w-[60%]">Value</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {feature.entries.map((entry, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium text-sm">{entry.kpiName}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      <span className="whitespace-pre-wrap">{entry.value}</span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No data entered for this feature</p>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Final Submit Button */}
      <div className="flex justify-center pt-6 border-t">
        <Button size="lg" onClick={handleSubmitClick} disabled={isSubmitting || totalFilled === 0 || !periodEditable} title={!periodEditable ? `${selectedQuarter} ${selectedYear} is locked` : undefined}>
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          Submit All KPIs for Review
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit {totalFilled} KPI entries for {selectedQuarter} {selectedYear} and FY {currentFY}-{String(currentFY + 1).slice(-2)}.
              <br /><br />
              <strong>Quarterly KPIs:</strong> {quarterlyFilled} fields<br />
              <strong>Annual KPIs:</strong> {annualFilled} fields
              <br /><br />
              Once submitted, this data will be sent for review. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Confirm Submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UnifiedSidebarLayout>
  );
};

export default PreviewSubmission;
