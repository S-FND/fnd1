import React, { useContext, useEffect, useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, DownloadCloud } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import IRLCompanyInformation from '../components/irl/IRLCompanyInformation';
import IRLHRInformation from '../components/irl/IRLHRInformation';
import IRLBusinessOperations from '../components/irl/IRLBusinessOperations';
import IRLPhotographs from '../components/irl/IRLPhotographs';
import IRLCompliance from '../components/irl/IRLCompliance';
import IRLManagement from '../components/irl/IRLManagement';
import IRLITSecurity from '../components/irl/IRLITSecurity';
import IRLWarehouse from '../components/irl/IRLWarehouse';
import IRLAdditionalFacility from '../components/irl/IRLAdditionalFacility';
import IRLGovernance from '../components/irl/IRLGovernance';
import { logger } from '@/hooks/logger';
import { PageAccessContext } from '@/context/PageAccessContext';
import { httpClient } from '@/lib/httpClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import IRLCustomQuestions from '../components/irl/IRLCustomQuestions';

// Import all question items from each component
// Make sure these are exported from their respective files
// import { companyItems } from '../components/irl/IRLCompanyInformation';
// import { hrItems } from '../components/irl/IRLHRInformation';
import { businessItems } from '../components/irl/IRLBusinessOperations';
// import { photographsItems } from '../components/irl/IRLPhotographs';
import { complianceItems } from '../components/irl/IRLCompliance';
import { managementItems } from '../components/irl/IRLManagement';
import { itSecurityItems } from '../components/irl/IRLITSecurity';
import { facilityItems } from '../components/irl/IRLAdditionalFacility';
import { governanceItems } from '../components/irl/IRLGovernance';

const companyItems = [
  { key: "gstNumber", name: "GST Number" },
  { key: "cinNumber", name: "CIN Number" },
  { key: "industry", name: "Industry" },
  { key: "website", name: "Company Website" },
  { key: "assuranceProviderName", name: "Name of Assurance Provider" },
  { key: "assuranceType", name: "Type of Assurance Obtained" },
  { key: "financialYearReporting", name: "Financial Year for which reporting is being done" },
  { key: "businessActivitiesDescription", name: "Provide description of business activities (accounting for 90% of the turnover)" },
  { key: "registeredOfficeAddress", name: "Registered Office Address" },
  { key: "headOfficeAddress", name: "Head Office Address" },
  
  { key: "legalEntityName", name: "Name of legal entity" },
  { key: "emailId", name: "Email ID" },
  { key: "incorporationDate", name: "Month & Year of Incorporation" },
  { key: "companyName", name: "Name of company/brand" },
  { key: "contactNumber", name: "Contact Number" },
  { key: "paidUpCapital", name: "Paid Up Capital (Rs)" },
  { key: "currentTurnover", name: "Turnover - Current Year (Rs)" },
  { key: "previousTurnover", name: "Turnover - Previous Year (Rs)" },
  { key: "parentCompany", name: "Name of parent company/subsidiaries (if any)" },
  { key: "productsServices", name: "List of products/services" },
  { key: "foundingTeam", name: "About the founding team (Name, educational details, previous work experience)" },
  
  { key: "totalBeneficiaries", name: "Total Beneficiaries/Customer Base" },
  { key: "litigationDetails", name: "Provide details of litigation or financial penalties against Company/Board of Directors/Founders or KMPs, if any?" },
  { key: "facilitiesCompliance", name: "Compliances related to facility management (e-waste, waste management, water management, batteries, fire infra, occupancy certificate, fire NOC)" },
  { key: "labourCompliances", name: "Labour compliances (on-roll, on-contract)" },
  { key: "fireTraining", name: "Fire training" },
  { key: "hrPoliciesTraining", name: "Training on HR policies" },
  { key: "mockDrills", name: "Mock drills" },
  { key: "employeeWellbeingHealthInsurance", name: "Health insurance - % of employees covered" },
  { key: "employeeWellbeingAccidentInsurance", name: "Accident insurance - % of employees covered" },
  { key: "employeeWellbeingMaternityBenefits", name: "Maternity benefits - % of employees covered" },
  { key: "employeeWellbeingPaternityBenefits", name: "Paternity Benefits - % of employees covered" },
  { key: "employeeWellbeingDayCare", name: "Day Care facilities - % of employees covered" },
  { key: "employeeWellbeingLifeInsurance", name: "Life Insurance - % of employees covered" }
];

const hrItems = [
  { key: "working_hours", name: "Working hours for FTEs" },
  { key: "shift_timing", name: "Shift timing for contract workers (if any)" },
  { key: "outsourced_services", name: "Any outsourced services through professional services agencies?" },
  { key: "facilities_list", name: "List of major facilities/Units/Departments (Manufacturing, Laboratory, Cafeteria) provided by property owner in the office space (With number of each facility)" },
  { key: "product_safety", name: "Certifications (if any) for product safety" },
  { key: "emergency_incidents", name: "Have the employees (on-roll, contract) been involved in any emergency incidents or accidents occurred in the workplace or during work related activities?" },
  { key: "employees_table", name: "Human Resource Management - Employees" },
  { key: "workers_table", name: "Human Resource Management - Workers" },
  { key: "differently_abled", name: "Human Resource Management - Differently Abled Personnel" },
  { key: "board_managerial", name: "Key Managerial Positions / Board of Directors" },
  { key: "retrenchment_details", name: "Any retrenchment or mass dismissal of employees conducted?" }
];

const photographsItems = [
  { key: "electrical_main_panel", name: "Electrical main panel inside the office" },
  { key: "pantry", name: "Pantry" },
  { key: "working_areas_occupied", name: "Working areas occupied by the Company" },
  { key: "emergency_exits", name: "Emergency exits, emergency signages, warning signages" },
  { key: "overall_office_pictures", name: "General overall office pictures" },
  { key: "fire_extinguishers_within_office", name: "Fire extinguishers and smoke detectors locations" },
  { key: "product_labeling", name: "Product labeling" },
  { key: "app_screenshot", name: "Screenshot of the app" },
  { key: "dashboard_screenshot", name: "Dashboard screenshot" },
  { key: "product_packing", name: "Product packaging" }
];

const IRLPage = () => {
  logger.debug('Rendering IRLPage component');
  const { isLoading } = useRouteProtection(['admin', 'manager', 'employee']);
  const { checkPageButtonAccess } = useContext(PageAccessContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { user, isAuthenticated, isAuthenticatedStatus } = useAuth();
  const [irlDate, setIrlDate] = useState<string | null>(null);
  const [previousIrlDate, setPreviousIrlDate] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "warning" | "danger" | null>(null);
  const [activeTab, setActiveTab] = useState("company");
  const [customQuestions, setCustomQuestions] = useState<Record<string, any[]>>({});
  const [downloading, setDownloading] = useState(false);
  const [entityId, setEntityId] = useState<string>('');
  const [enabledItemsMap, setEnabledItemsMap] = useState<Record<string, string[]>>({});

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      logger.error("Error parsing user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const entityIdFromStorage = getUserEntityId();
    if (entityIdFromStorage) {
      setEntityId(entityIdFromStorage);
    }
  }, []);

  // Fetch custom questions for each tab
  useEffect(() => {
    const fetchCustomQuestions = async () => {
      if (!entityId) return; // Make sure entityId exists

      try {
        const res: any = await httpClient.get(`custom-questions?entity_id=${entityId}`);
        console.log('Custom questions API response:', res.data);

        if (res.status === 200) {
          const questions = res.data.data || res.data || [];

          // Organize questions by tab
          const questionsByTab: Record<string, any[]> = {};

          questions.forEach((q: any) => {
            // Determine which tab this question belongs to
            let tab = 'custom'; // Default tab

            if (q.tab_name) {
              // If tab_name exists and is an array
              if (Array.isArray(q.tab_name) && q.tab_name.length > 0) {
                tab = q.tab_name[0];
              }
              // If tab_name is a string
              else if (typeof q.tab_name === 'string' && q.tab_name) {
                tab = q.tab_name;
              }
            }

            // Initialize array for this tab if it doesn't exist
            if (!questionsByTab[tab]) {
              questionsByTab[tab] = [];
            }

            // Add question to its tab
            questionsByTab[tab].push(q);
          });

          console.log('Questions organized by tab:', questionsByTab);
          setCustomQuestions(questionsByTab);
        }
      } catch (error) {
        logger.error('Error fetching custom questions:', error);
      }
    };

    if (entityId) {
      fetchCustomQuestions();
    }
  }, [entityId]);

  // Add this function after your imports and before the component
  const fetchCompanyConfiguration = async (entityId: string, category: string) => {
    try {
      const response: any = await httpClient.get(
        `company-irl/${entityId}/irl-config?category=${encodeURIComponent(category)}`
      );

      if (response?.data?.status === true) {
        const responseData = response.data.data;

        if (responseData === null) {
          return {
            enabledItems: [],
            configExists: false,
          };
        } else if (responseData?.configuration === null || responseData?.configuration === undefined) {
          return {
            enabledItems: [],
            configExists: false
          };
        } else {
          return {
            enabledItems: responseData?.configuration?.enabledItems || [],
            configExists: true,
          };
        }
      }

      return {
        enabledItems: [],
        configExists: false,
      };
    } catch (error) {
      console.error('Error fetching company configuration:', error);
      return {
        enabledItems: [],
        configExists: false,
      };
    }
  };

  // Fetch enabled items for all tabs when entityId is available
  useEffect(() => {
    const fetchAllEnabledItems = async () => {
      if (!entityId) return;

      const tabToCategory: Record<string, string> = {
        'compliance': 'compliance',
        'business': 'business_operations',
        'management': 'management',
        'itsecurity': 'it_security',
        'governance': 'governance',
        'facility': 'facility'
      };

      const newEnabledMap: Record<string, string[]> = {};

      // Fetch for each tab that has configuration
      for (const [tab, category] of Object.entries(tabToCategory)) {
        const result = await fetchCompanyConfiguration(entityId, category);
        if (result.configExists) {
          newEnabledMap[tab] = result.enabledItems;
          console.log(`Enabled items for ${tab}:`, result.enabledItems);
        }
      }

      setEnabledItemsMap(newEnabledMap);
    };

    fetchAllEnabledItems();
  }, [entityId]);

  useEffect(() => {
    const userData = localStorage.getItem('fandoro-user');
    const user = JSON.parse(userData);
    if (user.isParent === false) {
      const hasAccess = checkPageButtonAccess('/esg-dd/irl');
      setButtonEnabled(hasAccess);
    } else {
      setButtonEnabled(true);
    }
  }, []);

  useEffect(() => {
    const fetchIrlDate = async () => {
      const res: any = await httpClient.get("company/entity");
      const data = res?.data?.data;

      if (res.status === 200) {
        setIrlDate(data?.irl_date ? data.irl_date.split("T")[0] : "");
        setPreviousIrlDate(data?.previous_irl_date || null);
        checkIrlDate(data?.irl_date);
      }
    };

    fetchIrlDate();
  }, []);

  const checkIrlDate = (dateStr: string) => {
    const today = new Date();
    const irl = new Date(dateStr);

    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const irlAtMidnight = new Date(irl.getFullYear(), irl.getMonth(), irl.getDate());

    const diffInDays = Math.ceil((irlAtMidnight.getTime() - todayAtMidnight.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      setAlertType("danger");
      toast.error(`IRL deadline has passed (${irl.toLocaleDateString()}).`);
    } else if (diffInDays <= 3) {
      setAlertType("warning");
      toast.warning(`IRL deadline in ${diffInDays} day(s): ${irl.toLocaleDateString()}`);
    } else {
      setAlertType("success");
    }
  };

  // Helper function to get items for a specific tab
  const getTabItems = (tabName: string) => {
    let allMainItems: any[] = [];

    // First, get ALL possible items for this tab
    switch (tabName) {
      case 'company':
        allMainItems = companyItems || [];
        break;
      case 'hr':
        allMainItems = hrItems || [];
        break;
      case 'business':
        allMainItems = businessItems || [];
        break;
      case 'photographs':
        allMainItems = photographsItems || [];
        break;
      case 'compliance':
        allMainItems = complianceItems || [];
        break;
      case 'management':
        allMainItems = managementItems || [];
        break;
      case 'itsecurity':
        allMainItems = itSecurityItems || [];
        break;
      case 'facility':
        allMainItems = facilityItems || [];
        break;
      case 'governance':
        allMainItems = governanceItems || [];
        break;
      case 'custom':
        allMainItems = [];
        break;
      default:
        allMainItems = [];
    }

    // Get enabled items for this tab from the map
    const enabledItems = enabledItemsMap[tabName] || [];

    // Filter main items to only include enabled ones
    // If no enabled items configured (empty array), show all items
    const mainItems = enabledItems.length > 0
      ? allMainItems.filter(item => enabledItems.includes(item.key))
      : allMainItems;

    // Get custom questions for this tab (rest of your existing code remains the same)
    let tabCustomQuestions: any[] = [];

    if (tabName === 'custom') {
      // Get all custom questions that belong to the custom tab
      const allCustomQuestions = Object.values(customQuestions).flat();

      // Filter to only include questions that belong to custom tab
      const mainTabs = ['company', 'hr', 'business', 'photographs', 'compliance',
        'management', 'itsecurity', 'facility', 'governance'];

      tabCustomQuestions = allCustomQuestions.filter((q: any) => {
        // If no tab_name, include in custom tab
        if (!q.tab_name) return true;

        // If tab_name is an array
        if (Array.isArray(q.tab_name)) {
          if (q.tab_name.length === 0) return true;
          if (q.tab_name[0] === 'custom') return true;
          return !mainTabs.includes(q.tab_name[0]);
        }

        // If tab_name is a string
        if (typeof q.tab_name === 'string') {
          if (q.tab_name === 'custom') return true;
          return !mainTabs.includes(q.tab_name);
        }

        return false;
      });

      console.log(`Custom tab found ${tabCustomQuestions.length} questions`);
    } else {
      // For non-custom tabs, get questions that exactly match this tab
      tabCustomQuestions = customQuestions[tabName] || [];
    }

    // Format custom questions to match the same structure as main items
    const formattedCustom = tabCustomQuestions.map((q: any, idx: number) => ({
      key: q.key || `custom_${q._id || idx}`,
      name: q.question_text || q.question || 'Custom Question'
    }));

    return {
      main: mainItems,
      custom: formattedCustom,
      all: [...mainItems, ...formattedCustom]
    };
  };

  // Download current tab only
  const handleDownloadCurrentTab = () => {
    try {
      const { all } = getTabItems(activeTab);

      if (all.length === 0) {
        toast.warning('No questions found for this tab');
        return;
      }

      const dataWithSerialNo = all.map((item, index) => ({
        'S. No.': index + 1,
        // 'Key': item.key,
        'Question': item.name,
        'Status': '',
        'Attachment': '',
        'Company Notes': '',
      }));

      const ws = XLSX.utils.json_to_sheet(dataWithSerialNo);
      const wb = XLSX.utils.book_new();
      const tabName = activeTab === 'custom' ? 'Others' : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1));
      XLSX.utils.book_append_sheet(wb, ws, tabName);

      ws['!cols'] = [
        { wch: 8 },
        { wch: 60 },
        { wch: 8 },
        { wch: 12 },
        { wch: 15 },
      ];

      XLSX.writeFile(wb, `${tabName}_Questions.xlsx`);
      toast.success(`${tabName} template downloaded with ${all.length} questions!`);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  // Download all tabs in one Excel file with multiple sheets
  const handleDownloadAllTabs = async () => {
    setDownloading(true);
    try {
      const tabs = [
        'company', 'hr', 'business', 'photographs', 'compliance',
        'management', 'itsecurity', 'facility', 'governance', 'custom'
      ];

      const wb = XLSX.utils.book_new();
      let totalQuestions = 0;

      // Create a sheet for each tab
      for (const tab of tabs) {
        const { all } = getTabItems(tab);

        if (all.length > 0) {
          const dataWithSerialNo = all.map((item, index) => ({
            'S. No.': index + 1,
            // 'Key': item.key,
            'Question': item.name,
            'Status': '',
            'Attachment': '',
            'Company Notes': '',
          }));

          const ws = XLSX.utils.json_to_sheet(dataWithSerialNo);

          // Set column widths
          ws['!cols'] = [
            { wch: 8 },
            { wch: 60 },
            { wch: 8 },
            { wch: 12 },
            { wch: 15 },
          ];

          const sheetName = tab === 'custom' ? 'Others' :
            (tab.charAt(0).toUpperCase() + tab.slice(1));
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          totalQuestions += all.length;
        }
      }

      if (totalQuestions === 0) {
        toast.warning('No questions found');
        return;
      }

      // Download the workbook
      XLSX.writeFile(wb, 'All_IRL_Questions.xlsx');
      toast.success(`Downloaded ${totalQuestions} questions across ${tabs.length} tabs!`);
    } catch (error) {
      toast.error('Failed to download all templates');
    } finally {
      setDownloading(false);
    }
  };

  const alertStyles: Record<string, string> = {
    success: "bg-green-50 border-green-400 text-green-900",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-900",
    danger: "bg-red-50 border-red-400 text-red-900",
  };

  const activeIrlDate = irlDate || previousIrlDate;
  const isExtended = irlDate && previousIrlDate && new Date(irlDate) > new Date(previousIrlDate);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
            <p className="text-muted-foreground">
              Complete the comprehensive information request forms for ESG due diligence.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCurrentTab}
              className="flex items-center gap-2"
              disabled={downloading}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download Current Tab
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadAllTabs}
              className="flex items-center gap-2"
              disabled={downloading}
            >
              <DownloadCloud className="h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download All Tabs'}
            </Button>
          </div>
        </div>

        {alertType && activeIrlDate && (
          <Alert className={alertStyles[alertType]}>
            <Info className="h-5 w-5" />
            <AlertTitle>
              {alertType === "danger"
                ? "Deadline Missed"
                : alertType === "warning"
                  ? "Deadline Approaching"
                  : "On Track"}
            </AlertTitle>
            <AlertDescription>
              {alertType === "danger" && (
                <>Your IRL submission deadline <b>{new Date(activeIrlDate).toLocaleDateString()}</b> has passed.</>
              )}
              {alertType === "warning" && (
                <>Your IRL submission deadline is approaching on <b>{new Date(activeIrlDate).toLocaleDateString()}</b>.</>
              )}
              {alertType === "success" && (
                <>Your IRL submission deadline is <b>{new Date(activeIrlDate).toLocaleDateString()}</b>. Everything looks good!</>
              )}
              {isExtended && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Deadline extended from <b>{new Date(previousIrlDate!).toLocaleDateString()}</b> to{" "}
                  <b>{new Date(irlDate!).toLocaleDateString()}</b>.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="company" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="photographs">Photos</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="itsecurity">IT Security</TabsTrigger>
            <TabsTrigger value="facility">Facility</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="custom">Others</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <IRLCompanyInformation buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="company" />
          </TabsContent>

          <TabsContent value="hr">
            <IRLHRInformation buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="hr" />
          </TabsContent>

          <TabsContent value="business">
            <IRLBusinessOperations buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="business" />
          </TabsContent>

          <TabsContent value="photographs">
            <IRLPhotographs buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="photographs" />
          </TabsContent>

          <TabsContent value="compliance">
            <IRLCompliance buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="compliance" />
          </TabsContent>

          <TabsContent value="management">
            <IRLManagement buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="management" />
          </TabsContent>

          <TabsContent value="itsecurity">
            <IRLITSecurity buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="itsecurity" />
          </TabsContent>

          <TabsContent value="facility">
            <IRLAdditionalFacility buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="facility" />
          </TabsContent>

          <TabsContent value="governance">
            <IRLGovernance buttonEnabled={buttonEnabled} />
            <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="governance" />
          </TabsContent>

          <TabsContent value="custom">
            <IRLCustomQuestions buttonEnabled={buttonEnabled} />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default IRLPage;