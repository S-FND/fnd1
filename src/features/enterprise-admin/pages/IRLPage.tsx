
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
  const { isLoading } = useRouteProtection(['admin', 'manager','employee']);
  const {checkPageButtonAccess}=useContext(PageAccessContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();
  const [irlDate, setIrlDate] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "warning" | "danger" | null>(null);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    // const hasAccess = checkPageButtonAccess('/esg-dd/irl');
    // setButtonEnabled(hasAccess);
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
      try {
        const res = await httpClient.get("company/entity");
        const data = res?.data as any;
        if (res.status === 200 && data?.data?.irl_date) {
          setIrlDate(data?.data.irl_date);
          checkIrlDate(data?.data.irl_date);
        }
      } catch (err) {
        console.error("Failed to fetch IRL date:", err);
      }
    };
  
    fetchIrlDate();
  }, []);

  const checkIrlDate = (dateStr: string) => {
    const today = new Date();
    const irl = new Date(dateStr);
  
    // Example: Show alert if IRL date is within 3 days or has passed
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


  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
          <p className="text-muted-foreground">
            Complete the comprehensive information request forms for ESG due diligence.
          </p>
        </div>

        {alertType && (
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
                <>Your IRL submission deadline <b>{new Date(irlDate!).toLocaleDateString()}</b> has passed.</>
              )}
              {alertType === "warning" && (
                <>Your IRL submission deadline is approaching on <b>{new Date(irlDate!).toLocaleDateString()}</b>.</>
              )}
              {alertType === "success" && (
                <>Your IRL submission deadline is <b>{new Date(irlDate!).toLocaleDateString()}</b>. Everything looks good!</>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="photographs">Photos</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="itsecurity">IT Security</TabsTrigger>
            {/* <TabsTrigger value="warehouse">Warehouse</TabsTrigger> */}
            <TabsTrigger value="facility">Facility</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="custom">custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <IRLCompanyInformation buttonEnabled={buttonEnabled} />
          </TabsContent>
          
          <TabsContent value="hr">
            <IRLHRInformation buttonEnabled={buttonEnabled} />
          </TabsContent>

          <TabsContent value="business">
            <IRLBusinessOperations buttonEnabled={buttonEnabled} />
          </TabsContent>

          <TabsContent value="photographs">
            <IRLPhotographs buttonEnabled={buttonEnabled} />
          </TabsContent>

          <TabsContent value="compliance">
            <IRLCompliance buttonEnabled={buttonEnabled} />
          </TabsContent>

          <TabsContent value="management">
            <IRLManagement buttonEnabled={buttonEnabled}/>
          </TabsContent>

          <TabsContent value="itsecurity">
            <IRLITSecurity buttonEnabled={buttonEnabled} />
          </TabsContent>

          {/* <TabsContent value="warehouse">
            <IRLWarehouse />
          </TabsContent> */}

          <TabsContent value="facility">
            <IRLAdditionalFacility buttonEnabled={buttonEnabled} />
          </TabsContent>

          <TabsContent value="governance">
            <IRLGovernance buttonEnabled={buttonEnabled} />
          </TabsContent>

          <TabsContent value="custom">
            <IRLCustomQuestions buttonEnabled={buttonEnabled} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default IRLPage;
