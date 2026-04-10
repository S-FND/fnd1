import React, { useContext, useEffect, useState, useMemo } from 'react';
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
import IRLAdditionalFacility from '../components/irl/IRLAdditionalFacility';
import IRLGovernance from '../components/irl/IRLGovernance';
import { logger } from '@/hooks/logger';
import { PageAccessContext } from '@/context/PageAccessContext';
import { httpClient } from '@/lib/httpClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import IRLCustomQuestions from '../components/irl/IRLCustomQuestions';
import { businessItems } from '../components/irl/IRLBusinessOperations';
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
  { key: "businessActivitiesDescription", name: "Provide description of business activities" },
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
  { key: "parentCompany", name: "Name of parent company/subsidiaries" },
  { key: "productsServices", name: "List of products/services" },
  { key: "foundingTeam", name: "About the founding team" },
  { key: "totalBeneficiaries", name: "Total Beneficiaries/Customer Base" },
  { key: "litigationDetails", name: "Provide details of litigation or financial penalties" },
  { key: "facilitiesCompliance", name: "Compliances related to facility management" },
  { key: "labourCompliances", name: "Labour compliances" },
  { key: "fireTraining", name: "Fire training" },
  { key: "hrPoliciesTraining", name: "Training on HR policies" },
  { key: "mockDrills", name: "Mock drills" },
  { key: "employeeWellbeingHealthInsurance", name: "Health insurance" },
  { key: "employeeWellbeingAccidentInsurance", name: "Accident insurance" },
  { key: "employeeWellbeingMaternityBenefits", name: "Maternity benefits" },
  { key: "employeeWellbeingPaternityBenefits", name: "Paternity Benefits" },
  { key: "employeeWellbeingDayCare", name: "Day Care facilities" },
  { key: "employeeWellbeingLifeInsurance", name: "Life Insurance" }
];

const hrItems = [
  { key: "working_hours", name: "Working hours for FTEs" },
  { key: "shift_timing", name: "Shift timing for contract workers" },
  { key: "outsourced_services", name: "Any outsourced services" },
  { key: "facilities_list", name: "List of major facilities" },
  { key: "product_safety", name: "Certifications for product safety" },
  { key: "emergency_incidents", name: "Emergency incidents or accidents" },
  { key: "employees_table", name: "Human Resource Management - Employees" },
  { key: "workers_table", name: "Human Resource Management - Workers" },
  { key: "differently_abled", name: "Differently Abled Personnel" },
  { key: "board_managerial", name: "Key Managerial Positions" },
  { key: "retrenchment_details", name: "Retrenchment or mass dismissal" }
];

const photographsItems = [
  { key: "electrical_main_panel", name: "Electrical main panel" },
  { key: "pantry", name: "Pantry" },
  { key: "working_areas_occupied", name: "Working areas" },
  { key: "emergency_exits", name: "Emergency exits" },
  { key: "overall_office_pictures", name: "Office pictures" },
  { key: "fire_extinguishers_within_office", name: "Fire extinguishers" },
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
  const { isAuthenticatedStatus } = useAuth();
  const [irlDate, setIrlDate] = useState(null);
  const [previousIrlDate, setPreviousIrlDate] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [activeTab, setActiveTab] = useState("company");
  const [customQuestions, setCustomQuestions] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [entityId, setEntityId] = useState('');
  const [enabledItemsMap, setEnabledItemsMap] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);

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

  // Fetch custom questions
  useEffect(() => {
    const fetchCustomQuestions = async () => {
      if (!entityId) return;
      try {
        const res: any = await httpClient.get(`custom-questions?entity_id=${entityId}`);
        if (res.status === 200) {
          const questions = res.data.data || res.data || [];
          const questionsByTab = {};
          questions.forEach((q) => {
            let tab = 'custom';
            if (q.tab_name) {
              if (Array.isArray(q.tab_name) && q.tab_name.length > 0) {
                tab = q.tab_name[0];
              } else if (typeof q.tab_name === 'string' && q.tab_name) {
                tab = q.tab_name;
              }
            }
            if (!questionsByTab[tab]) questionsByTab[tab] = [];
            questionsByTab[tab].push(q);
          });
          setCustomQuestions(questionsByTab);
        }
      } catch (error) {
        logger.error('Error fetching custom questions:', error);
      }
    };
    if (entityId) fetchCustomQuestions();
  }, [entityId]);

  const fetchCompanyConfiguration = async (entityId, category) => {
    try {
      const response: any = await httpClient.get(
        `company-irl/${entityId}/irl-config?category=${encodeURIComponent(category)}`
      );
      if (response?.data?.status === true) {
        const responseData = response.data.data;
        if (responseData?.configuration) {
          return {
            enabledItems: responseData.configuration.enabledItems || [],
            configExists: true,
          };
        }
      }
      return { enabledItems: [], configExists: false };
    } catch (error) {
      console.error('Error fetching configuration:', error);
      return { enabledItems: [], configExists: false };
    }
  };

  // Fetch enabled items
  useEffect(() => {
    const fetchAllEnabledItems = async () => {
      if (!entityId) return;

      const tabToCategory = {
        'compliance': 'compliance',
        'business': 'business_operations',
        'management': 'management',
        'itsecurity': 'it_security',
        'governance': 'governance',
        'facility': 'facility'
      };

      const newEnabledMap = {};
      for (const [tab, category] of Object.entries(tabToCategory)) {
        const result = await fetchCompanyConfiguration(entityId, category);
        if (result.configExists) {
          newEnabledMap[tab] = result.enabledItems;
        } else {
          // If no config exists, set to 'all' to indicate show all items
          newEnabledMap[tab] = 'all';
        }
      }
      
      setEnabledItemsMap(newEnabledMap);
      setConfigLoaded(true);
    };

    fetchAllEnabledItems();
  }, [entityId]);

  useEffect(() => {
    const userData = localStorage.getItem('fandoro-user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isParent === false) {
        const hasAccess = checkPageButtonAccess('/esg-dd/irl');
        setButtonEnabled(hasAccess);
      } else {
        setButtonEnabled(true);
      }
    }
  }, [checkPageButtonAccess]);

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

  const checkIrlDate = (dateStr) => {
    if (!dateStr) {
      console.log('No IRL date set');
      return;
    }
    const today: any = new Date();
    const irl: any = new Date(dateStr);
    const diffInDays = Math.ceil((irl - today) / (1000 * 60 * 60 * 24));
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

  // Get all main items for a tab
  const getMainItemsForTab = (tabName) => {
    switch (tabName) {
      case 'company': return companyItems;
      case 'hr': return hrItems;
      case 'business': return businessItems;
      case 'photographs': return photographsItems;
      case 'compliance': return complianceItems;
      case 'management': return managementItems;
      case 'itsecurity': return itSecurityItems;
      case 'facility': return facilityItems;
      case 'governance': return governanceItems;
      default: return [];
    }
  };

  // Check if a tab has any questions (main + custom)
  const hasTabQuestions = useMemo(() => {
    return (tabName) => {
      // Check main items
      const allMainItems = getMainItemsForTab(tabName);
      const enabledConfig = enabledItemsMap[tabName];
      
      let hasMainQuestions = false;
      
      // Safely check the config
      if (enabledConfig === 'all') {
        // No config exists - show all items
        hasMainQuestions = allMainItems.length > 0;
      } else if (Array.isArray(enabledConfig) && enabledConfig.length === 0) {
        // Config exists but empty array - show NO items
        hasMainQuestions = false;
      } else if (Array.isArray(enabledConfig) && enabledConfig.length > 0) {
        // Config exists with items - has questions if there are enabled items
        hasMainQuestions = true;
      } else {
        // Default case - show all items
        hasMainQuestions = allMainItems.length > 0;
      }

      // Check custom questions
      let hasCustomQuestions = false;
      if (tabName === 'custom') {
        const allCustomQuestions = Object.values(customQuestions).flat();
        hasCustomQuestions = allCustomQuestions.length > 0;
      } else {
        hasCustomQuestions = (customQuestions[tabName] || []).length > 0;
      }

      const result = hasMainQuestions || hasCustomQuestions;
      console.log(`Tab ${tabName}: main=${hasMainQuestions}, custom=${hasCustomQuestions}, result=${result}`);
      return result;
    };
  }, [enabledItemsMap, customQuestions]);

  // Get visible tabs based on which tabs have questions
  const visibleTabs = useMemo(() => {
    if (!configLoaded) return [];
    
    const allTabs = ['company', 'hr', 'business', 'photographs', 'compliance', 
                     'management', 'itsecurity', 'facility', 'governance', 'custom'];
    
    const visible = allTabs.filter(tab => {
      try {
        return hasTabQuestions(tab);
      } catch (error) {
        console.error(`Error checking tab ${tab}:`, error);
        return false;
      }
    });
    
    console.log('Visible tabs:', visible);
    return visible;
  }, [configLoaded, hasTabQuestions]);

  // Update active tab if current tab becomes hidden
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [visibleTabs, activeTab]);

  // Get items for a specific tab (for downloads)
  const getTabItems = (tabName) => {
    const allMainItems = getMainItemsForTab(tabName);
    const enabledConfig = enabledItemsMap[tabName];
    
    let mainItems = [];
    
    if (enabledConfig === 'all') {
      // No config exists - show all items
      mainItems = allMainItems;
    } else if (Array.isArray(enabledConfig) && enabledConfig.length === 0) {
      // Config exists but empty array - show NO items
      mainItems = [];
    } else if (Array.isArray(enabledConfig) && enabledConfig.length > 0) {
      // Config exists with items - filter enabled items
      mainItems = allMainItems.filter(item => enabledConfig.includes(item.key));
    } else {
      // Default - show all items
      mainItems = allMainItems;
    }

    // Get custom questions
    let tabCustomQuestions = [];
    if (tabName === 'custom') {
      const allCustomQuestions = Object.values(customQuestions).flat();
      const mainTabs = ['company', 'hr', 'business', 'photographs', 'compliance',
        'management', 'itsecurity', 'facility', 'governance'];
      tabCustomQuestions = allCustomQuestions.filter((q: any) => {
        if (!q.tab_name) return true;
        if (Array.isArray(q.tab_name)) {
          if (q.tab_name.length === 0) return true;
          if (q.tab_name[0] === 'custom') return true;
          return !mainTabs.includes(q.tab_name[0]);
        }
        if (typeof q.tab_name === 'string') {
          if (q.tab_name === 'custom') return true;
          return !mainTabs.includes(q.tab_name);
        }
        return false;
      });
    } else {
      tabCustomQuestions = customQuestions[tabName] || [];
    }

    const formattedCustom = tabCustomQuestions.map((q, idx) => ({
      key: q.key || `custom_${q._id || idx}`,
      name: q.question_text || q.question || 'Custom Question'
    }));

    return {
      main: mainItems,
      custom: formattedCustom,
      all: [...mainItems, ...formattedCustom]
    };
  };

  // Download current tab
  const handleDownloadCurrentTab = () => {
    try {
      const { all } = getTabItems(activeTab);
      if (all.length === 0) {
        toast.warning('No questions found for this tab');
        return;
      }
      const dataWithSerialNo = all.map((item, index) => ({
        'S. No.': index + 1,
        'Question': item.name,
        'Status': '',
        'Attachment': '',
        'Company Notes': '',
      }));
      const ws = XLSX.utils.json_to_sheet(dataWithSerialNo);
      const wb = XLSX.utils.book_new();
      const tabName = activeTab === 'custom' ? 'Others' : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1));
      XLSX.utils.book_append_sheet(wb, ws, tabName);
      ws['!cols'] = [{ wch: 8 }, { wch: 60 }, { wch: 8 }, { wch: 12 }, { wch: 15 }];
      XLSX.writeFile(wb, `${tabName}_Questions.xlsx`);
      toast.success(`${tabName} template downloaded with ${all.length} questions!`);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  // Download all tabs
  const handleDownloadAllTabs = async () => {
    setDownloading(true);
    try {
      const wb = XLSX.utils.book_new();
      let totalQuestions = 0;
      for (const tab of visibleTabs) {
        const { all } = getTabItems(tab);
        if (all.length > 0) {
          const dataWithSerialNo = all.map((item, index) => ({
            'S. No.': index + 1,
            'Question': item.name,
            'Status': '',
            'Attachment': '',
            'Company Notes': '',
          }));
          const ws = XLSX.utils.json_to_sheet(dataWithSerialNo);
          ws['!cols'] = [{ wch: 8 }, { wch: 60 }, { wch: 8 }, { wch: 12 }, { wch: 15 }];
          const sheetName = tab === 'custom' ? 'Others' : (tab.charAt(0).toUpperCase() + tab.slice(1));
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          totalQuestions += all.length;
        }
      }
      if (totalQuestions === 0) {
        toast.warning('No questions found');
        return;
      }
      XLSX.writeFile(wb, 'All_IRL_Questions.xlsx');
      toast.success(`Downloaded ${totalQuestions} questions across ${visibleTabs.length} tabs!`);
    } catch (error) {
      toast.error('Failed to download all templates');
    } finally {
      setDownloading(false);
    }
  };

  const alertStyles = {
    success: "bg-green-50 border-green-400 text-green-900",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-900",
    danger: "bg-red-50 border-red-400 text-red-900",
  };

  const activeIrlDate = irlDate || previousIrlDate;
  const isExtended = irlDate && previousIrlDate && new Date(irlDate) > new Date(previousIrlDate);

  if (isLoading || !configLoaded) {
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
            <Button variant="outline" size="sm" onClick={handleDownloadCurrentTab} disabled={downloading}>
              <FileSpreadsheet className="h-4 w-4" />
              Download Current Tab
            </Button>
            <Button variant="default" size="sm" onClick={handleDownloadAllTabs} disabled={downloading}>
              <DownloadCloud className="h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download All Tabs'}
            </Button>
          </div>
        </div>

        {alertType && activeIrlDate && (
          <Alert className={alertStyles[alertType]}>
            <Info className="h-5 w-5" />
            <AlertTitle>
              {alertType === "danger" ? "Deadline Missed" : alertType === "warning" ? "Deadline Approaching" : "On Track"}
            </AlertTitle>
            <AlertDescription>
              {alertType === "danger" && (
                <>Your IRL submission deadline <b>{new Date(activeIrlDate).toLocaleDateString()}</b> has passed.</>
              )}
              {alertType === "warning" && (
                <>Your IRL submission deadline is approaching on <b>{new Date(activeIrlDate).toLocaleDateString()}</b>.</>
              )}
              {alertType === "success" && (
                <>Your IRL submission deadline is <b>{new Date(activeIrlDate).toLocaleDateString()}</b>.</>
              )}
              {isExtended && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Deadline extended from <b>{new Date(previousIrlDate).toLocaleDateString()}</b> to{" "}
                  <b>{new Date(irlDate).toLocaleDateString()}</b>.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {visibleTabs.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex flex-wrap gap-2">
              {visibleTabs.includes('company') && <TabsTrigger value="company">Company</TabsTrigger>}
              {visibleTabs.includes('hr') && <TabsTrigger value="hr">HR</TabsTrigger>}
              {visibleTabs.includes('business') && <TabsTrigger value="business">Business</TabsTrigger>}
              {visibleTabs.includes('photographs') && <TabsTrigger value="photographs">Photos</TabsTrigger>}
              {visibleTabs.includes('compliance') && <TabsTrigger value="compliance">Compliance</TabsTrigger>}
              {visibleTabs.includes('management') && <TabsTrigger value="management">Management</TabsTrigger>}
              {visibleTabs.includes('itsecurity') && <TabsTrigger value="itsecurity">IT Security</TabsTrigger>}
              {visibleTabs.includes('facility') && <TabsTrigger value="facility">Facility</TabsTrigger>}
              {visibleTabs.includes('governance') && <TabsTrigger value="governance">Governance</TabsTrigger>}
              {visibleTabs.includes('custom') && <TabsTrigger value="custom">Others</TabsTrigger>}
            </TabsList>

            {visibleTabs.includes('company') && (
              <TabsContent value="company">
                <IRLCompanyInformation buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="company" />
              </TabsContent>
            )}
            {visibleTabs.includes('hr') && (
              <TabsContent value="hr">
                <IRLHRInformation buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="hr" />
              </TabsContent>
            )}
            {visibleTabs.includes('business') && (
              <TabsContent value="business">
                <IRLBusinessOperations buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="business" />
              </TabsContent>
            )}
            {visibleTabs.includes('photographs') && (
              <TabsContent value="photographs">
                <IRLPhotographs buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="photographs" />
              </TabsContent>
            )}
            {visibleTabs.includes('compliance') && (
              <TabsContent value="compliance">
                <IRLCompliance buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="compliance" />
              </TabsContent>
            )}
            {visibleTabs.includes('management') && (
              <TabsContent value="management">
                <IRLManagement buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="management" />
              </TabsContent>
            )}
            {visibleTabs.includes('itsecurity') && (
              <TabsContent value="itsecurity">
                <IRLITSecurity buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="itsecurity" />
              </TabsContent>
            )}
            {visibleTabs.includes('facility') && (
              <TabsContent value="facility">
                <IRLAdditionalFacility buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="facility" />
              </TabsContent>
            )}
            {visibleTabs.includes('governance') && (
              <TabsContent value="governance">
                <IRLGovernance buttonEnabled={buttonEnabled} />
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="governance" />
              </TabsContent>
            )}
            {visibleTabs.includes('custom') && (
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions available for any tab.</p>
          </div>
        )}
      </div>
    </UnifiedSidebarLayout>
  );
};

export default IRLPage;