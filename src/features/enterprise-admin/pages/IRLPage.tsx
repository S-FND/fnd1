import React, { useContext, useEffect, useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { toast } from 'sonner';
import IRLCustomQuestions from '../components/irl/IRLCustomQuestions';

const IRLPage = () => {
  logger.debug('Rendering IRLPage component');
  const { isLoading } = useRouteProtection(['admin', 'manager', 'employee']);
  const { checkPageButtonAccess } = useContext(PageAccessContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { isAuthenticatedStatus } = useAuth();
  const [irlDate, setIrlDate] = useState<string | null>(null);
  const [previousIrlDate, setPreviousIrlDate] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "warning" | "danger" | null>(null);
  const [activeMainTab, setActiveMainTab] = useState("company");
  const [activeSubTab, setActiveSubTab] = useState<Record<string, string>>({});

  useEffect(() => {
    const userData = localStorage.getItem('fandoro-user');
    const user = JSON.parse(userData || '{}');
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  const checkIrlDate = (dateStr: string) => {
    if (!dateStr) return;
    const today = new Date();
    const irl = new Date(dateStr);
    const diffInDays = Math.ceil((irl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 0) {
      setAlertType("danger");
      toast.error(`IRL deadline has passed (${irl.toLocaleDateString()}).`);
    } else if (diffInDays <= 3) {
      setAlertType("warning");
      toast.warning(`IRL deadline in ${diffInDays} day(s): ${irl.toLocaleDateString()}`);
    } else {
      setAlertType("success");
    }
  };

  const alertStyles: Record<string, string> = {
    success: "bg-green-50 border-green-400 text-green-900",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-900",
    danger: "bg-red-50 border-red-400 text-red-900",
  };

  const activeIrlDate = irlDate || previousIrlDate;

  const isExtended = irlDate && previousIrlDate && new Date(irlDate) > new Date(previousIrlDate);

  const handleMainTabChange = (value: string) => {
    setActiveMainTab(value);
    // Initialize sub-tab if not set
    if (!activeSubTab[value]) {
      setActiveSubTab(prev => ({ ...prev, [value]: "standard" }));
    }
  };

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
          <p className="text-muted-foreground">
            Complete the comprehensive information request forms for ESG due diligence.
          </p>
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
                <>
                  Your IRL submission deadline{" "}
                  <b>{new Date(activeIrlDate).toLocaleDateString()}</b> has passed.
                </>
              )}

              {alertType === "warning" && (
                <>
                  Your IRL submission deadline is approaching on{" "}
                  <b>{new Date(activeIrlDate).toLocaleDateString()}</b>.
                </>
              )}

              {alertType === "success" && (
                <>
                  Your IRL submission deadline is{" "}
                  <b>{new Date(activeIrlDate).toLocaleDateString()}</b>. Everything looks good!
                </>
              )}

              {isExtended && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Deadline extended from{" "}
                  <b>{new Date(previousIrlDate!).toLocaleDateString()}</b> to{" "}
                  <b>{new Date(irlDate!).toLocaleDateString()}</b>.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeMainTab} onValueChange={handleMainTabChange} className="space-y-4">
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
            <Tabs value={activeSubTab.company || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, company: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLCompanyInformation buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="company" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="hr">
            <Tabs value={activeSubTab.hr || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, hr: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLHRInformation buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="hr" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="business">
            <Tabs value={activeSubTab.business || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, business: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLBusinessOperations buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="business" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="photographs">
            <Tabs value={activeSubTab.photographs || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, photographs: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLPhotographs buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="photographs" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="compliance">
            <Tabs value={activeSubTab.compliance || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, compliance: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLCompliance buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="compliance" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="management">
            <Tabs value={activeSubTab.management || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, management: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLManagement buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="management" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="itsecurity">
            <Tabs value={activeSubTab.itsecurity || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, itsecurity: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLITSecurity buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="itsecurity" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="facility">
            <Tabs value={activeSubTab.facility || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, facility: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLAdditionalFacility buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="facility" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="governance">
            <Tabs value={activeSubTab.governance || "standard"} onValueChange={(v) => setActiveSubTab(prev => ({ ...prev, governance: v }))}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="custom">Custom Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                <IRLGovernance buttonEnabled={buttonEnabled} />
              </TabsContent>
              <TabsContent value="custom">
                <IRLCustomQuestions buttonEnabled={buttonEnabled} tabName="governance" />
              </TabsContent>
            </Tabs>
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