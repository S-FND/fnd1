
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockESGCapItems, mockESGDDReports } from '../data/esgDD';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ESGCapItem, ESGCategory } from '../types/esgDD';
import { ArrowLeft, ArrowDown, ArrowUp, Check, Loader, X } from 'lucide-react';

const ESGCapPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null>(
    { key: 'deadline', direction: 'asc' }
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  // Apply filters and search
  const filteredItems = mockESGCapItems.filter(item => {
    const matchesSearch = 
      item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Sort function
  const requestSort = (key: keyof ESGCapItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Find report title by ID
  const getReportTitle = (reportId: string) => {
    const report = mockESGDDReports.find(r => r.id === reportId);
    return report ? report.title : 'Unknown Report';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: ESGCapItem['status'] }) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Loader className="h-3 w-3 mr-1 animate-spin" /> In Progress
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <X className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  // Category badge component
  const CategoryBadge = ({ category }: { category: ESGCategory }) => {
    switch (category) {
      case 'environmental':
        return <Badge className="bg-green-500">Environmental</Badge>;
      case 'social':
        return <Badge className="bg-blue-500">Social</Badge>;
      case 'governance':
        return <Badge className="bg-purple-500">Governance</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <EnhancedSidebarLayout>
        <div className="space-y-6">
          <div>
            <Link to="/esg-dd" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to ESG DD
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">ESG Corrective Action Plan</h1>
            <p className="text-muted-foreground">
              Track and manage corrective actions from ESG due diligence assessments.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>ESG CAP Items</CardTitle>
              <CardDescription>
                Manage and track all ESG corrective action items across assessments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input 
                    placeholder="Search issues..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => requestSort('issue')}
                      >
                        Issue
                        {sortConfig?.key === 'issue' && (
                          sortConfig.direction === 'asc' ? 
                            <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                            <ArrowDown className="h-4 w-4 inline ml-1" />
                        )}
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Source Report</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => requestSort('deadline')}
                      >
                        Deadline
                        {sortConfig?.key === 'deadline' && (
                          sortConfig.direction === 'asc' ? 
                            <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                            <ArrowDown className="h-4 w-4 inline ml-1" />
                        )}
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deal Condition</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.issue}
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.description.length > 80 
                              ? `${item.description.substring(0, 80)}...` 
                              : item.description
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <CategoryBadge category={item.category} />
                        </TableCell>
                        <TableCell>{getReportTitle(item.reportId)}</TableCell>
                        <TableCell>{new Date(item.deadline).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>
                          {item.dealCondition !== 'none' && (
                            <Badge variant="outline" className="font-bold">
                              {item.dealCondition}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {sortedItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No CAP items found matching the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </EnhancedSidebarLayout>
    </div>
  );
};

export default ESGCapPage;
