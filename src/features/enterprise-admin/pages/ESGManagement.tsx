import React, { useState, useEffect } from 'react';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { defaultMaterialTopics } from '../data/materiality';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient';

interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

// Define interfaces matching ESMSPage
interface ESMSDocument {
  id: string;
  title: string;
  subItems?: string[];
  fileChange: boolean;
  isApplicable: string;
  fileNames?: string[];
  fileUrls?: string[];
}

interface ESMSDocumentSection {
  id: string;
  title: string;
  description: string;
  documents: ESMSDocument[];
}

const ESGManagementPage = () => {
  logger.debug('Rendering ESGManagementPage component');
  const { isLoading: isRouteLoading } = useRouteProtection(['admin', 'manager', 'unit_admin', 'employee']);
  const { user, isAuthenticated, isAuthenticatedStatus } = useAuth();
  const [prioritizedTopics, setPrioritizedTopics] = useState<MaterialTopic[]>([]);
  const [esmsProgress, setEsmsProgress] = useState<number | null>(null);
  const [esmsCompletedCount, setEsmsCompletedCount] = useState<number | null>(null);
  const [esmsTotalCount, setEsmsTotalCount] = useState<number | null>(null);
  const [esmsProgressLoading, setEsmsProgressLoading] = useState(true);
  const [esmsProgressError, setEsmsProgressError] = useState<string | null>(null);
  const [complianceCompleted, setComplianceCompleted] = useState<number | null>(null);
  const [policiesCompleted, setPoliciesCompleted] = useState<number | null>(null);

  // State for Metrics
  const [configuredMetrics, setConfiguredMetrics] = useState<number>(0);
  const [materialTopicsCount, setMaterialTopicsCount] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customTopics, setCustomTopics] = useState<number>(0);
  const [finalizedTopics, setFinalizedTopics] = useState<MaterialTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState(false);
  // Function to get entityId from localStorage
  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      logger.error("Error parsing user data for entityId:", error);
      return null;
    }
  };

  // Function to fetch ESMS progress data
  const fetchESMSProgress = async () => {
    const entityId = getUserEntityId();
    if (!entityId) {
      logger.warn("Entity ID not found in localStorage");
      setEsmsProgress(0);
      setEsmsCompletedCount(0);
      setEsmsTotalCount(0);
      setComplianceCompleted(0);
      setPoliciesCompleted(0);
      setEsmsProgressLoading(false);
      return;
    }

    setEsmsProgressLoading(true);
    setEsmsProgressError(null);

    try {
      const response: any = await httpClient.get(`document/esms/${entityId}`);
      if (response.data && response.data.data) {
        const savedData = response.data.data;

        // Define the document sections structure
        const documentSections: ESMSDocumentSection[] = [
          {
            id: 'compliance',
            title: 'Compliance - Registration/Filing/Returns/Reports',
            description: 'Legal compliance documents and regulatory registrations',
            documents: [
              { id: 'env-clearance', title: 'Environmental clearances', fileChange: false, isApplicable: "yes" },
              { id: 'hazard-waste', title: 'Hazardous waste authorizations', fileChange: false, isApplicable: "yes" },
              { id: 'epr-ewaste', title: 'EPR Registration and Filing - E-waste', fileChange: false, isApplicable: "yes" },
              { id: 'epr-used-oil', title: 'EPR Registration and Filing - Used Oil', fileChange: false, isApplicable: "yes" },
              { id: 'epr-plastic', title: 'EPR Registration and Filing - Plastic', fileChange: false, isApplicable: "yes" },
              { id: 'epr-battery', title: 'EPR Registration and Filing - Battery', fileChange: false, isApplicable: "yes" },
              { id: 'epr-tyre', title: 'EPR Registration and Filing - Tyre', fileChange: false, isApplicable: "yes" },
              { id: 'waste-recycling', title: 'Authorized waste recycling/disposal certificates', fileChange: false, isApplicable: "yes" },
              {
                id: 'pollution-consent',
                title: 'State Pollution Control Board Consent',
                subItems: ['Consent to Establish', 'Consent to Operate'],
                fileChange: false,
                isApplicable: "yes"
              },
              { id: 'trem-card', title: 'TREM Card for Transportation', fileChange: false, isApplicable: "yes" },
              { id: 'building-stability', title: 'Building Stability Certificate', fileChange: false, isApplicable: "yes" },
              { id: 'electrical-inspector', title: 'Electrical Inspector for operation of Generator set(s)', fileChange: false, isApplicable: "yes" },
              { id: 'industrial-order', title: 'Industrial Standing Order approved from Factory Inspector', fileChange: false, isApplicable: "yes" },
              { id: 'psara-license', title: 'PSARA license of the Security Agency (under Private Security Agency Regulation Act)', fileChange: false, isApplicable: "yes" },
              { id: 'factory-plan', title: 'Factory Approved Plan by DISH (Dept. of Industrial Safety & Health)', fileChange: false, isApplicable: "yes" },
              { id: 'env-statement', title: 'Environmental Statement in Form V', fileChange: false, isApplicable: "yes" },
              { id: 'esia-reports', title: 'Environmental & Social Impact Assessment (ESIA/EIA) Reports', fileChange: false, isApplicable: "yes" },
              { id: 'bore-well', title: 'Registration Certificate of bore well', fileChange: false, isApplicable: "yes" },
              { id: 'groundwater-license', title: 'Groundwater use license/registration (Central Ground Water Authority)', fileChange: false, isApplicable: "yes" },
              { id: 'factories-license', title: 'Factories Act License', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-principal', title: 'Labor Department Registrations - Principal Employer', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-minimum-wages', title: 'Labor Department Registrations - Minimum wages', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-muster-roll', title: 'Labor Department Registrations - Muster roll', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-accident', title: 'Labor Department Registrations - Accident/incident', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-leave-compliance', title: 'Labor Department Registrations - Leave compliance as per S&E Act', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-holiday-list', title: 'Labor Department Registrations - Holiday List as per S&E Act', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-interstate', title: 'Labor Department Registrations - Inter-state Migrant labor Registration', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-construction', title: 'Labor Department Registrations - Building & Other Construction Workers', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-welfare', title: 'Labor Department Registrations - Labor Welfare Fund', fileChange: false, isApplicable: "yes" },
              { id: 'labor-reg-trade-union', title: 'Labor Department Registrations - Trade Union', fileChange: false, isApplicable: "yes" },
              { id: 'labor-register-overtime', title: 'Labor Department Registers - Overtime', fileChange: false, isApplicable: "yes" },
              { id: 'labor-register-wages', title: 'Labor Department Registers - Wages (including deductions, fines, advances)', fileChange: false, isApplicable: "yes" },
              { id: 'labor-register-attendance', title: 'Labor Department Registers - Muster roll / Attendance', fileChange: false, isApplicable: "yes" },
              { id: 'labor-register-accident', title: 'Labor Department Registers - Accident/incident', fileChange: false, isApplicable: "yes" },
              { id: 'labor-register-maternity', title: 'Labor Department Registers - Maternity Benefit register', fileChange: false, isApplicable: "yes" },
              { id: 'labor-register-grievance', title: 'Labor Department Registers - Grievance Register', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-factory', title: 'Labor Department Annual returns filing - Factory Annual Return (Form 21)', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-minimum-wages', title: 'Labor Department Annual returns filing - Minimum wages', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-muster-roll', title: 'Labor Department Annual returns filing - Muster roll', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-accident', title: 'Labor Department Annual returns filing - Accident/incident', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-contract', title: 'Labor Department Annual returns filing - Contract labor', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-maternity', title: 'Labor Department Annual returns filing - Maternity Benefits', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-interstate', title: 'Labor Department Annual returns filing - Inter-state Migrant labor', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-construction', title: 'Labor Department Annual returns filing - Building & Other Construction Workers', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-welfare', title: 'Labor Department Annual returns filing - Labor Welfare Fund', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-trade-union', title: 'Labor Department Annual returns filing - Trade Union', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-posh', title: 'Labor Department Annual returns filing - POSH', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-gratuity', title: 'Labor Department Annual returns filing - Gratuity', fileChange: false, isApplicable: "yes" },
              { id: 'labor-returns-bonus', title: 'Labor Department Annual returns filing - Payment of Bonus', fileChange: false, isApplicable: "yes" },
              { id: 'display-abstracts', title: 'Display Requirements- Facility - Abstracts of major Acts (Wages, Bonus, Equal Remuneration, Minimum Wage, Child Labour, etc.)', fileChange: false, isApplicable: "yes" },
              { id: 'display-name-address', title: 'Display Requirements- Facility - Name & address of the establishment', fileChange: false, isApplicable: "yes" },
              { id: 'display-working-hours', title: 'Display Requirements- Facility - Working hours', fileChange: false, isApplicable: "yes" },
              { id: 'display-holidays', title: 'Display Requirements- Facility - List of holidays', fileChange: false, isApplicable: "yes" },
              { id: 'display-factory-license', title: 'Display Requirements- Facility - Factory license', fileChange: false, isApplicable: "yes" },
              { id: 'display-fssai', title: 'Display Requirements- Facility - FSSAI License', fileChange: false, isApplicable: "yes" },
              { id: 'display-emergency', title: 'Display Requirements- Facility - Emergency Contacts', fileChange: false, isApplicable: "yes" },
              { id: 'display-grievance', title: 'Display Requirements- Facility - Grievance Redressal Mechanism Policy and Procedure (English and Local language)', fileChange: false, isApplicable: "yes" },
              { id: 'esic-registration', title: 'ESIC Registration', fileChange: false, isApplicable: "yes" },
              { id: 'epfo-registration', title: 'EPFO Registration', fileChange: false, isApplicable: "yes" },
              { id: 'professional-tax', title: 'Professional Tax Registration', fileChange: false, isApplicable: "yes" },
              { id: 'shops-establishment', title: 'Shops and Establishment Registration', fileChange: false, isApplicable: "yes" },
              { id: 'building-occupancy', title: 'Building Occupancy Certificate (BOC)', fileChange: false, isApplicable: "yes" },
              { id: 'fire-noc', title: 'Fire NOC', fileChange: false, isApplicable: "yes" },
              { id: 'fssai-cert', title: 'FSSAI Certification', fileChange: false, isApplicable: "yes" },
              { id: 'cdsco-registration', title: 'CDSCO Registration', fileChange: false, isApplicable: "yes" },
              { id: 'electricity-serc', title: 'Electricity Regulatory Registration - SERC (State Electricity Regulatory Commission)', fileChange: false, isApplicable: "yes" },
              { id: 'electricity-cerc', title: 'Electricity Regulatory Registration - CERC (Central Electricity Regulatory Commission)', fileChange: false, isApplicable: "yes" },
              { id: 'msme-registration', title: 'MSME (Udyam) Registration', fileChange: false, isApplicable: "yes" },
              { id: 'ssi-registration', title: 'National Small-Scale Industries Registration', fileChange: false, isApplicable: "yes" },
              { id: 'iec-certificate', title: 'Importer-Exporter Code Certificate', fileChange: false, isApplicable: "yes" },
              { id: 'trade-license', title: 'Trade License', fileChange: false, isApplicable: "yes" },
              { id: 'legal-metrology', title: 'Legal Metrology Certificate', fileChange: false, isApplicable: "yes" },
              { id: 'bis-certificate', title: 'BIS Certificate', fileChange: false, isApplicable: "yes" },
              { id: 'rohs-certificate', title: 'RoHS Certificate', fileChange: false, isApplicable: "yes" },
            ]
          },
          {
            id: 'policies',
            title: 'Policies/SOPs',
            description: 'Corporate policies and standard operating procedures',
            documents: [
              { id: 'esg-policy', title: 'Environmental, Social, and Governance Policy', fileChange: false, isApplicable: "yes" },
              { id: 'code-conduct', title: 'Code of Conduct and Business Ethics', fileChange: false, isApplicable: "yes" },
              { id: 'ehs-policy', title: 'Environment, Health, Safety (EHS) Policy', fileChange: false, isApplicable: "yes" },
              { id: 'human-rights', title: 'Human Rights and Fair Labor Policy', fileChange: false, isApplicable: "yes" },
              { id: 'equal-opportunity', title: 'Equal Opportunity Policy', fileChange: false, isApplicable: "yes" },
              { id: 'diversity-policy', title: 'Diversity, Equity & Inclusion Policy', fileChange: false, isApplicable: "yes" },
              { id: 'gender-equality', title: 'Gender Equality Policy', fileChange: false, isApplicable: "yes" },
              { id: 'employee-handbook', title: 'Employee Handbook', fileChange: false, isApplicable: "yes" },
              { id: 'hr-policy', title: 'HR Policy and Procedures', fileChange: false, isApplicable: "yes" },
              { id: 'anti-bribery', title: 'Anti-Bribery and Anti-Corruption Policy', fileChange: false, isApplicable: "yes" },
              { id: 'whistleblower', title: 'Whistleblower Policy', fileChange: false, isApplicable: "yes" },
              { id: 'grievance-redressal', title: 'Grievance Redressal Policy', fileChange: false, isApplicable: "yes" },
              { id: 'responsible-sourcing', title: 'Responsible Sourcing & Supply Chain Policy', fileChange: false, isApplicable: "yes" },
              { id: 'stakeholder-engagement', title: 'Stakeholder Engagement Plan', fileChange: false, isApplicable: "yes" },
              { id: 'community-development', title: 'Community Development Policy', fileChange: false, isApplicable: "yes" },
              { id: 'data-privacy', title: 'Data Privacy and Protection Policy', fileChange: false, isApplicable: "yes" },
              { id: 'occupational-health', title: 'Occupational Health and Safety Policy', fileChange: false, isApplicable: "yes" },
              { id: 'energy-management', title: 'Energy Management Policy', fileChange: false, isApplicable: "yes" },
              { id: 'biodiversity-conservation', title: 'Biodiversity Conservation Policy', fileChange: false, isApplicable: "yes" },
              { id: 'waste-management', title: 'Waste Management Policy', fileChange: false, isApplicable: "yes" },
              { id: 'water-resource', title: 'Water Resource Management Policy', fileChange: false, isApplicable: "yes" },
              { id: 'land-acquisition', title: 'Land Acquisition and Resettlement Policy', fileChange: false, isApplicable: "yes" },
              { id: 'child-labor', title: 'Child Labor & Forced Labor Prohibition Policy', fileChange: false, isApplicable: "yes" },
              { id: 'retrenchment-policy', title: 'Retrenchment Policy', fileChange: false, isApplicable: "yes" },
              { id: 'posh-policy', title: 'Prevention of Sexual Harassment (POSH) Policy', fileChange: false, isApplicable: "yes" },
              { id: 'risk-management', title: 'Risk Management Framework (including E&S risks)', fileChange: false, isApplicable: "yes" },
              { id: 'materiality-assessment', title: 'Materiality Assessment Framework', fileChange: false, isApplicable: "yes" },
              { id: 'supplier-code', title: 'Supplier Code of Conduct', fileChange: false, isApplicable: "yes" },
              { id: 'monitoring-sop', title: 'Monitoring & Measurement SOP (for ESG KPIs and compliance tracking)', fileChange: false, isApplicable: "yes" },
              { id: 'record-keeping', title: 'Record Keeping & Documentation SOP', fileChange: false, isApplicable: "yes" },
              { id: 'hira', title: 'Hazard Identification and Risk Assessment (HIRA)', fileChange: false, isApplicable: "yes" },
              { id: 'ppe-usage', title: 'PPE Usage Policy and SOP', fileChange: false, isApplicable: "yes" },
              { id: 'job-safety', title: 'Job/Process Safety Analysis', fileChange: false, isApplicable: "yes" },
              { id: 'legal-compliance', title: 'Legal Compliance Register', fileChange: false, isApplicable: "yes" },
              { id: 'emergency-response', title: 'Emergency Response and Preparedness Plan', fileChange: false, isApplicable: "yes" },
              { id: 'fire-safety', title: 'Fire and Electrical Safety Certificates and SOP', fileChange: false, isApplicable: "yes" },
              { id: 'incident-management', title: 'Incident Management Policy and Register', fileChange: false, isApplicable: "yes" },
              { id: 'first-aid', title: 'First Aid Policy and Consumption Records', fileChange: false, isApplicable: "yes" },
            ]
          }
        ];

        // Update the document sections with the fetched data
        const updatedSections = documentSections.map(section => ({
          ...section,
          documents: section.documents.map(doc => {
            const fieldName = doc.id.replace(/-/g, '_');
            if (savedData[fieldName]) {
              const savedDoc = savedData[fieldName];
              if (Array.isArray(savedDoc.file_path) && savedDoc.file_path.length > 0) {
                return { ...doc, fileChange: true, isApplicable: "yes" };
              } else if (savedDoc.isApplicable === "no") {
                return { ...doc, isApplicable: "no", fileChange: false };
              }
            }
            return doc;
          })
        }));

        // Calculate overall progress
        const allApplicableDocuments = updatedSections.flatMap(section =>
          section.documents.filter(doc => doc.isApplicable === "yes")
        );
        const allUploadedDocuments = allApplicableDocuments.filter(doc => doc.fileChange);
        const calculatedProgress = allApplicableDocuments.length > 0 ?
          (allUploadedDocuments.length / allApplicableDocuments.length) * 100 : 100;

        // Calculate section progress
        const complianceSection = updatedSections.find(s => s.id === 'compliance');
        const policiesSection = updatedSections.find(s => s.id === 'policies');

        const complianceApplicable = complianceSection?.documents.filter(d => d.isApplicable === "yes") || [];
        const complianceUploaded = complianceApplicable.filter(d => d.fileChange);
        const policiesApplicable = policiesSection?.documents.filter(d => d.isApplicable === "yes") || [];
        const policiesUploaded = policiesApplicable.filter(d => d.fileChange);

        setEsmsProgress(calculatedProgress);
        setEsmsCompletedCount(allUploadedDocuments.length);
        setEsmsTotalCount(allApplicableDocuments.length);
        setComplianceCompleted(complianceUploaded.length);
        setPoliciesCompleted(policiesUploaded.length);

      } else {
        setEsmsProgress(0);
        setEsmsCompletedCount(0);
        setEsmsTotalCount(0);
        setComplianceCompleted(0);
        setPoliciesCompleted(0);
      }
    } catch (error) {
      logger.error('Error fetching ESMS progress:', error);
      setEsmsProgressError('Failed to load ESMS progress. Please try again later.');
      setEsmsProgress(0);
      setEsmsCompletedCount(0);
      setEsmsTotalCount(0);
      setComplianceCompleted(0);
      setPoliciesCompleted(0);
    } finally {
      setEsmsProgressLoading(false);
    }
  };

  // Function to fetch Metrics progress data
  const fetchMetricsProgress = async () => {
    const entityId = getUserEntityId();
    if (!entityId) {
      logger.warn("Entity ID not found in localStorage for metrics");
      setConfiguredMetrics(0);
      setMaterialTopicsCount(0);
      setMetricsLoading(false);
      return;
    }

    setMetricsLoading(true);
    setMetricsError(null);

    try {
      const response: any = await httpClient.get(`materiality/${entityId}`);
      if (!entityId) {
        logger.warn("Entity ID not found in localStorage for material topics");
        setFinalizedTopics([]);
        setTopicsLoading(false);
        return;
      }
      setTopicsLoading(true);
      setTopicsError(null);
      if (response.data && response.data) {
        const materialityData = response.data;
        console.log('materialityData', materialityData);
        // Count configured metrics from finalMetrics array
        const configuredCount = materialityData.finalMetrics ? materialityData.finalMetrics.length : 0;
        console.log('configuredCount', configuredCount);
        // Count material topics from finalTopics
        const topicsCount = materialityData.finalTopics ? materialityData.finalTopics.length : 0;
        const customTopics = materialityData.customTopics ? materialityData.customTopics.length : 0;
        setFinalizedTopics(materialityData.finalTopics || []);
        setCustomTopics(customTopics)
        setConfiguredMetrics(configuredCount);
        setMaterialTopicsCount(topicsCount);

        logger.debug('Metrics progress calculated:', {
          configuredMetrics: configuredCount,
          materialTopicsCount: topicsCount,
          finalTopics: materialityData.finalTopics?.length || 0,
          finalMetrics: materialityData.finalMetrics?.length || 0
        });

      } else {
        setFinalizedTopics([]);
        setConfiguredMetrics(0);
        setMaterialTopicsCount(0);
      }
    } catch (error) {
      logger.error('Error fetching metrics progress:', error);
      setMetricsError('Failed to load metrics progress. Please try again later.');
      setFinalizedTopics([]);
      setConfiguredMetrics(0);
      setMaterialTopicsCount(0);
    } finally {
      setMetricsLoading(false);
      setTopicsLoading(false);
    }
  };

  // Calculate metrics status based on meaningful criteria
  const getMetricsStatus = () => {
    if (metricsLoading || metricsError) return 'loading';

    if (materialTopicsCount === 0) {
      return 'no-topics'; // No material topics selected yet
    } else if (configuredMetrics === 0) {
      return 'no-metrics'; // Topics exist but no metrics configured
    } else {
      return 'complete'; // Metrics are configured
    }
  };

  // Get progress percentage for metrics
  const getMetricsProgressPercentage = () => {
    if (materialTopicsCount === 0) return 0;
    return configuredMetrics > 0 ? 100 : 0;
  };

  // Refresh all data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchESMSProgress(), fetchMetricsProgress()]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      logger.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch both ESMS and Metrics progress when component mounts
  useEffect(() => {
    fetchESMSProgress();
    fetchMetricsProgress();
  }, []);

  if (isRouteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading ESG Management Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticatedStatus(['admin', 'manager', 'employee'])) {
    return <Navigate to="/" />;
  }

  const metricsStatus = getMetricsStatus();
  const metricsProgressPercentage = getMetricsProgressPercentage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ESG Management</h1>
          <p className="text-muted-foreground">
            Comprehensive ESG management system overview and navigation
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ESMS Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Environmental & Social Management System (ESMS)</CardTitle>
            </div>
            <CardDescription>
              Complete your ESMS documentation and upload supporting documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              {esmsProgressLoading ? (
                <span className="flex items-center text-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : esmsProgressError ? (
                <span className="text-sm text-red-600">Error</span>
              ) : (
                <Badge variant={esmsProgress !== null && esmsProgress >= 100 ? "default" : "secondary"}>
                  {esmsCompletedCount !== null && esmsTotalCount !== null ? `${esmsCompletedCount}/${esmsTotalCount}` : '0/0'} documents
                </Badge>
              )}
              {complianceCompleted !== null && policiesCompleted !== null && (
                <div className="text-xs text-muted-foreground">
                  <div> Compliance: {complianceCompleted}/71</div>
                  <div> Policies: {policiesCompleted}/38</div>
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${esmsProgress !== null ? esmsProgress : 0}%` }}
              />
            </div>
            <div className="space-y-2 text-sm">
              {esmsProgressLoading ? (
                <span>Loading status...</span>
              ) : esmsProgressError ? (
                <>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Error loading</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {esmsProgress !== null && esmsProgress >= 100 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Complete</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-600">In Progress</span>
                      </>
                    )}
                  </div>

                </>
              )}
            </div>
            <Button asChild className="w-full">
              <Link to="/esg/esms">
                {esmsProgress !== null && esmsProgress >= 100 ? 'Review ESMS' : 'Continue ESMS'}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Metrics Card - IMPROVED VERSION */}
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <CardTitle>ESG Metrics</CardTitle>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-5 w-5" />
                <CardTitle>Management</CardTitle>
              </div>
            </div>
            <CardDescription>
              Configure metrics based on your materiality assessment and manage data collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Configured Metrics</span>
              {metricsLoading ? (
                <span className="flex items-center text-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : metricsError ? (
                <span className="text-sm text-red-600">Error</span>
              ) : (
                // Updated Badge text to show {configuredMetrics}/{customTopicsCount}
                <Badge variant={configuredMetrics >= customTopics ? "default" : "secondary"}>
                  {configuredMetrics}/{customTopics}
                </Badge>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: customTopics > 0 ? `${(configuredMetrics / customTopics) * 100}%` : '0%' }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              {metricsLoading ? (
                <span>Loading status...</span>
              ) : metricsError ? (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Error loading</span>
                </>
              ) : configuredMetrics >= customTopics ? ( // Updated condition
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Complete</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-600">Setup Required</span>
                </>
              )}
            </div>
            <Button asChild className="w-full">
              <Link to="/esg/metrics">
                Configure Metrics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ESMS Completion</p>
                <p className="text-2xl font-bold">
                  {esmsProgress !== null ? `${Math.round(esmsProgress)}%` : '0%'}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Material Topics</p>
                <p className="text-2xl font-bold">{materialTopicsCount}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Configured Metrics</p>
                <p className="text-2xl font-bold">{configuredMetrics}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Material Topics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Material Topics Overview</CardTitle>
          <CardDescription>
            {topicsLoading ? 'Loading...' : `${finalizedTopics.length} finalized topics from your materiality assessment`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topicsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              Loading topics...
            </div>
          ) : topicsError ? (
            <div className="text-center py-8">
              <p className="text-red-600">{topicsError}</p>
            </div>
          ) : finalizedTopics.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {finalizedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center p-3 border rounded-lg border-l-4"
                  style={{ borderLeftColor: topic.color }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{topic.topic}</h4>
                    <p className="text-xs text-muted-foreground">{topic.esg}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Business Impact:</span>
                        <div className="font-medium">{topic.businessImpact.toFixed(1)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sustainability Impact:</span>
                        <div className="font-medium">{topic.sustainabilityImpact.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Complete your materiality assessment to see finalized topics
              </p>
              <Button asChild className="mt-4">
                <Link to="/materiality">
                  Go to Materiality Assessment
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Quickly access frequently used ESG management features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-3 flex flex-col gap-2">
              <Link to="/materiality">
                <FileText className="h-5 w-5" />
                <span>Materiality Assessment</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex flex-col gap-2">
              <Link to="/esg/reports">
                <BarChart3 className="h-5 w-5" />
                <span>ESG Reports</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex flex-col gap-2">
              <Link to="/stakeholders">
                <CheckCircle className="h-5 w-5" />
                <span>Stakeholder Engagement</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex flex-col gap-2">
              <Link to="/esg/compliance">
                <AlertCircle className="h-5 w-5" />
                <span>Compliance Tracking</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ESGManagementPage;