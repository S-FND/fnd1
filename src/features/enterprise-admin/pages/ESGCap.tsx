import React, { useState, useEffect } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  fetchEsgCap,
  esgddChangePlan,
  esgddAcceptPlan,
  updatePlan
} from '../services/esgdd';

interface ESGCapItem {
  id: number;
  item: string;
  measures: string;
  resource: string;
  deliverable: string;
  targetDate: string;
  actualDate: string;
  CS: string;
  status: string;
  category?: string; // Added based on screenshot
}

interface ESGCapData {
  status: boolean;
  finalPlan: boolean;
  plan: ESGCapItem[];
  entityId: string;
}

const ESGCapPage = () => {
  const { isLoading: authLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [esgCap, setEsgCap] = useState<ESGCapData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({
    key: 'targetDate',
    direction: 'asc'
  });

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
      const data:any = await fetchEsgCap(entityId);
      if (data) {
        setEsgCap(data);
      } else {
        toast.error("Failed to load ESG CAP data");
      }
    } catch (error) {
      // toast.error("An error occurred while loading data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityId]);

  const handleAction = async (action: 'requestChange' | 'accept' | 'update') => {
    if (!esgCap) return;

    setLoading(true);
    try {
      let response;
      const payload = {
        entityId: esgCap.entityId,
        plan: esgCap.plan
      };

      switch (action) {
        case 'requestChange':
          response = await esgddChangePlan({
            ...payload,
            changeRequest: { plan: esgCap.plan },
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

      if (response?.[0] || response) {
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
        await loadData();
      } else {
        toast.error(response?.[1] || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred during submission");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedPlan = esgCap?.plan?.slice().sort((a, b) => {
    if (sortConfig.key === 'targetDate') {
      const dateA = new Date(a.targetDate).getTime();
      const dateB = new Date(b.targetDate).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const filteredPlan = sortedPlan?.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.measures.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <Card>
            <CardHeader>
              <CardTitle>ESG CAP Items</CardTitle>
              <CardDescription>
                Manage and track all ESG corrective action items across assessments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="pl-8 w-full p-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 w-12">S.No</th>
                      <th className="text-left p-3">Item</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Measures and/or Corrective Actions</th>
                      <th className="text-left p-3">Resource & Responsibility</th>
                      <th className="text-left p-3">Expected Deliverable</th>
                      <th 
                        className="text-left p-3 cursor-pointer"
                        onClick={() => handleSort('targetDate')}
                      >
                        Target Date {sortConfig.key === 'targetDate' && (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        )}
                      </th>
                      <th className="text-left p-3">CP/CS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlan?.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 font-medium">{item.item}</td>
                        <td className="p-3">{item.category || '-'}</td>
                        <td className="p-3">{item.measures}</td>
                        <td className="p-3">{item.resource}</td>
                        <td className="p-3">{item.deliverable}</td>
                        <td className="p-3">
                          {new Date(item.targetDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="p-3">{item.CS}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                {!esgCap?.finalPlan ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => handleAction('requestChange')}
                      disabled={loading}
                    >
                      Request Change
                    </Button>
                    <Button 
                      onClick={() => handleAction('accept')}
                      disabled={loading}
                    >
                      Accept
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