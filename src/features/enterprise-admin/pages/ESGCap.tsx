import React, { useState, useEffect } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ESGCapItem } from '../types/esgDD';
import { ESGCapFilters } from '../components/esg-cap/ESGCapFilters';
import { ESGCapTable } from '../components/esg-cap/ESGCapTable';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  fetchEsgCap,
  esgddChangePlan,
  esgddAcceptPlan,
  updatePlan
} from '../services/esgdd';

interface PlanHistory {
  updateByUserId: string;
  status: string;
  requestPlan: ESGCapItem[];
  createdAt: number;
  userData?: {
    name: string;
    email: string;
  };
}
interface ESGCapData {
  status: boolean;
  finalPlan: boolean;
  plan: ESGCapItem[];
  entityId: string;
  planHistoryDetails?: PlanHistory[];
}

const ESGCapPage = () => {
  const { isLoading: authLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [esgCap, setEsgCap] = useState<ESGCapData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null>(
    { key: 'targetDate', direction: 'asc' }  // Changed from deadline to targetDate
  );

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  const loadData = async () => {
    if (!entityId) return;

    setLoading(true);
    try {
      const data = await fetchEsgCap(entityId);
      console.log('obj_______data_________ect',data);
      if (data?.status) {
        setEsgCap({
          status: data.status,
          finalPlan: data.finalPlan || false,
          plan: data.plan || [],
          entityId: data.entityId,
          planHistoryDetails: data.planHistoryDetails || []
        });
      } else {
        toast.error("Failed to load ESG CAP data");
      }
    } catch (error) {
      toast.error("Error loading CAP data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'requestChange' | 'accept' | 'update') => {
    if (!esgCap) return;
  
    setLoading(true);
    try {
      let response;
      const payload = {
        entityId: esgCap.entityId,
        plan: esgCap.plan.map(item => ({
          id: item.id,
          item: item.item,
          measures: item.measures,
          resource: item.resource,
          deliverable: item.deliverable,
          targetDate: item.targetDate,
          actualDate: item.actualDate,
          CS: item.CS,
          status: item.status,
          category: item.category,
          priority: item.priority
        }))
      };
  
      switch (action) {
        case 'requestChange':
          response = await esgddChangePlan({
            ...payload,
            comment: "Change Request"
          });
          break;
        case 'accept':
          response = await esgddAcceptPlan(payload);
          break;
        case 'update':
          response = await updatePlan(payload);
          break;
      }
  
      if (response?.status) {
        // toast.success(`${action?.charAt(0).toUpperCase() + action.slice(1)} successful`);
        toast.success('Status Update..');
        await loadData();
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred during submission");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityId]);

  // Apply filters and search
  const filteredItems = esgCap?.plan?.filter(item => {
    const matchesSearch =
      item.item?.toLowerCase().includes(searchTerm?.toLowerCase()) ||  // Changed from items to item
      item.measures?.toLowerCase().includes(searchTerm?.toLowerCase()); // Changed from description to measures

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;

    // Handle date fields
    if (sortConfig.key === 'targetDate' || sortConfig.key === 'createdAt' || sortConfig.key === 'actualDate') {
      const dateA = new Date(a[sortConfig.key] || 0).getTime();
      const dateB = new Date(b[sortConfig.key] || 0).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // Handle string fields
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

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
                {esgCap?.finalPlan && <span className="ml-2 text-green-600">(Final Plan)</span>}
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
                {!esgCap?.finalPlan ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleAction('requestChange')}
                      disabled={loading}
                    >
                      Request CAP Change
                    </Button>
                    <Button
                      onClick={() => handleAction('accept')}
                      disabled={loading}
                    >
                      Accept CAP
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleAction('update')}
                    disabled={loading}
                  >
                    Update
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default ESGCapPage;
