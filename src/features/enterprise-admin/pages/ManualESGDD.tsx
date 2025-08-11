
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockESGDDReports } from '../data/esgDD';
import { ESGDDReportsList } from '../components/esg-dd/ESGDDReportsList';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Download, Plus, FileText } from 'lucide-react';
import { CardDescription } from '@/components/ui/card';

const ManualESGDDPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    companyName: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    file: null as File | null
  });

  // Filter only manual and uploaded reports
  const filteredReports = mockESGDDReports.filter(
    report => report.type === 'manual' || report.type === 'uploaded'
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadForm({ ...uploadForm, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Uploading report:', uploadForm);
    // In a real app, we would upload the file and create a new report
    setUploadDialogOpen(false);
    // Reset form
    setUploadForm({
      title: '',
      companyName: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      file: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/esg-dd" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to ESG DD
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Manual ESG Due Diligence</h1>
          <p className="text-muted-foreground">
            Create detailed ESG due diligence assessments manually
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ESG Due Diligence Assessment</CardTitle>
          <CardDescription>
            Create a comprehensive manual ESG assessment for suppliers and partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Manual ESG Assessment</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create detailed ESG due diligence assessments with custom questionnaires,
              document uploads, and comprehensive scoring.
            </p>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <Button className="w-full" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Start New Assessment
              </Button>
              <p className="text-xs text-muted-foreground">
                Create comprehensive ESG assessments with detailed questionnaires
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualESGDDPage;
