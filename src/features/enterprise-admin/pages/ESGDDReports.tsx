import React, { useState, useEffect } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESGDDReportsList } from '../components/esg-dd/ESGDDReportsList';
import { ArrowLeft, FileSearch, Plus } from 'lucide-react';
import { fetchEsgDDReport } from '../services/esgdd';
import { Loader2 } from 'lucide-react';
import { logger } from '@/hooks/logger';

const getS3FilePath = (file_path) =>
  `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

const ESGDDReportsPage = () => {
  logger.debug('Rendering ESGDDReportsPage component');
  const { isLoading: authLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState(null);
  const [financialYear, setFinancialYear] = useState("");

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

  const entityId = getUserEntityId();

  useEffect(() => {
    if (!entityId) return;
  
    // Calculate financial year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const aprilFirstCurrentYear = new Date(currentYear, 3, 1); // April 1st of current year
    const financialYear = currentDate < aprilFirstCurrentYear
      ? `${currentYear - 1}-${currentYear.toString().slice(-2)}`
      : `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    
    setFinancialYear(financialYear);
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchEsgDDReport(entityId);
        
        if (error) {
          logger.error('Failed to fetch ESG report:', error);
          setPaths({}); // Explicitly set empty object on error
          return;
        }
  
        setPaths(data || {}); // Handle empty/undefined data
      } catch (err) {
        logger.error('Unexpected error:', err);
        setPaths({}); // Ensure empty state on failure
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [entityId]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 /></div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  // Transform the API data to match the expected report format
  const transformReports = (reports) => {
    logger.log('reports',reports);
    if (!reports || (typeof reports === 'object' && Object.keys(reports).length === 0)) {
      return [];
    }
    
    return reports?.map((report, index) => ({
      id: report._id,
      title: report.file_path?.split("/")?.reverse()?.[0] || `Report ${index + 1}`,
      type: 'manual', // Assuming all are manual for now
      date: new Date(report.createdAt).toLocaleDateString(),
      time: new Date(report.createdAt).toLocaleTimeString(),
      fileUrl: getS3FilePath(report.file_path),
      status: 'completed'
    }));
  };

  const allReports = transformReports(paths);
  const manualReports = allReports.filter(report => report.type === 'manual');
  const automatedReports = allReports.filter(report => report.type === 'automated');

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        {/* <div className="flex justify-between items-center">
          <div>
            <Link to="/esg-dd" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to ESG DD
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">ESG DD Reports</h1>
            <p className="text-muted-foreground">
              View and manage all your ESG due diligence reports, both manual and automated.
            </p>
          </div>
          
          <Button asChild>
            <Link to="/esg-dd">
              <Plus className="h-4 w-4 mr-2" />
              New ESG DD
            </Link>
          </Button>
        </div> */}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-primary" />
              ESG Due Diligence Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allReports.length > 0 ? (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Reports ({allReports.length})</TabsTrigger>
                  <TabsTrigger value="manual">Manual ({manualReports.length})</TabsTrigger>
                  <TabsTrigger value="automated">Automated ({automatedReports.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ESGDDReportsList reports={allReports} />
                </TabsContent>
                
                <TabsContent value="manual">
                  <ESGDDReportsList reports={manualReports} />
                </TabsContent>
                
                <TabsContent value="automated">
                  <ESGDDReportsList reports={automatedReports} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No ESG DD reports found.</p>
                <Button asChild className="mt-4">
                  <Link to="/esg-dd">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Report
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default ESGDDReportsPage;