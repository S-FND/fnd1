
import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockESGCapItems, mockESGDDReports } from '../data/esgDD';
import { ESGCapItem } from '../types/esgDD';
import { ESGCapFilters } from '../components/esg-cap/ESGCapFilters';
import { ESGCapTable } from '../components/esg-cap/ESGCapTable';

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

  return (
    <div className="min-h-screen">
      <UnifiedSidebarLayout>
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
          
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>ESG CAP Items</CardTitle>
              <CardDescription>
                Manage and track all ESG corrective action items across assessments.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-shrink-0 mb-4">
                <ESGCapFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                />
              </div>
              
              <div className="flex-1 overflow-auto">
                <ESGCapTable 
                  sortedItems={sortedItems} 
                  sortConfig={sortConfig} 
                  requestSort={requestSort} 
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
                <Button variant="outline">
                  Request CAP Change
                </Button>
                <Button>
                  Accept CAP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default ESGCapPage;
