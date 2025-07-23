
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
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
import { ArrowLeft, Upload, Download, Plus } from 'lucide-react';

const ManualESGDDPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();
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

  if (!isAuthenticatedStatus() || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/" />;
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
    <div className="min-h-screen">
      <Navbar />
      <UnifiedSidebarLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/esg-dd" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to ESG DD
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Manual ESG Due Diligence</h1>
              <p className="text-muted-foreground">
                Create and manage manually created ESG due diligence reports.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload External Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload External ESG DD Report</DialogTitle>
                    <DialogDescription>
                      Upload an ESG due diligence report created by external consultants or agencies.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          className="col-span-3"
                          value={uploadForm.title}
                          onChange={handleUploadChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="companyName" className="text-right">
                          Company
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          className="col-span-3"
                          value={uploadForm.companyName}
                          onChange={handleUploadChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Report Date
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          className="col-span-3"
                          value={uploadForm.date}
                          onChange={handleUploadChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="col-span-3"
                          value={uploadForm.description}
                          onChange={handleUploadChange as any}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                          Report File
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          className="col-span-3"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Upload Report</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New ESG DD
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Manual & Uploaded ESG DD Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ESGDDReportsList reports={filteredReports} />
            </CardContent>
          </Card>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default ManualESGDDPage;
