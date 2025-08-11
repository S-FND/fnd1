
import React, { useState, useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockESGDDReports } from '../data/esgDD';
import { ESGDDReportsList } from '../components/esg-dd/ESGDDReportsList';
import { ArrowLeft, FileSearch, Plus, Search, Eye } from 'lucide-react';

const ESGDDReportsPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter reports by type
  const allReports = mockESGDDReports;
  const manualReports = mockESGDDReports.filter(report => report.type === 'manual');
  const automatedReports = mockESGDDReports.filter(report => report.type === 'automated');

  // Filter reports based on search and status
  const filteredReports = useMemo(() => {
    return allReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (report.summary && report.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allReports, searchTerm, statusFilter]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ESG Due Diligence Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your ESG due diligence reports
          </p>
        </div>
        <Button onClick={() => navigate('/esg-dd')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to ESG DD
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.summary || 'No summary available'}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {report.date}</span>
                    <span>Type: {report.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(report.status)}>
                    {report.status.replace('_', ' ')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reports found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first ESG due diligence assessment to see reports here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ESGDDReportsPage;
