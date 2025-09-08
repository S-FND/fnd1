import React, { useState, useEffect } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
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

interface ComparePlan {
  founderPlan: ESGCapItem[];
  investorPlan: ESGCapItem[];
  founderPlanLastUpdate: number;
  investorPlanLastUpdate: number;
}

interface FinalAcceptance {
  founderAcceptance: boolean;
  investorAcceptance: boolean;
}

interface ESGCapData {
  status: boolean;
  finalPlan: boolean;
  plan: ESGCapItem[];
  entityId: string;
  planHistoryDetails?: PlanHistory[];
  comparePlan?: ComparePlan;
  finalAcceptance?: FinalAcceptance;
  founderPlanFinalStatus?: boolean;
  investorPlanFinalStatus?: boolean;
}

// Add this component for comparison view
const ComparePlanView = ({
  currentPlan,
  originalPlan,
  onRevertItem,
  onRevertField,
  showComparisonView
}: {
  currentPlan: ESGCapItem[];
  originalPlan: ESGCapItem[];
  onRevertItem: (itemId: string) => void;
  onRevertField: (itemId: string, field: keyof ESGCapItem) => void;
  showComparisonView: boolean;
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ESGCapItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  const requestSort = (key: keyof ESGCapItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getChangedFields = (currentItem: ESGCapItem, originalItem?: ESGCapItem) => {
    if (!originalItem) return {};

    const changes: Record<string, boolean> = {};
    (Object.keys(currentItem) as Array<keyof ESGCapItem>).forEach((key) => {
      changes[key] = JSON.stringify(currentItem[key]) !== JSON.stringify(originalItem[key]);
    });
    return changes;
  };

  const sortedItems = [...currentPlan].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // For dates
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      return sortConfig.direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const SortableHeader = ({
    field,
    title
  }: {
    field: keyof ESGCapItem;
    title: string;
  }) => (
    <th
      className="p-3 text-left cursor-pointer hover:bg-muted/50"
      onClick={() => requestSort(field)}
    >
      {title}
      {sortConfig?.key === field && (
        sortConfig.direction === 'asc' ?
          <ArrowUp className="h-4 w-4 inline ml-1" /> :
          <ArrowDown className="h-4 w-4 inline ml-1" />
      )}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100" style={{ fontWeight: 500 }}>
            <th className="p-3 text-left w-[60px]" style={{ fontWeight: 500 }}>S. No</th>
            <SortableHeader field="item" title="Item" />
            <th className="p-3 text-left">Category</th>
            <SortableHeader field="priority" title="Priority" />
            <th className="p-3 text-left">Measures and/or Corrective Actions</th>
            <th className="p-3 text-left">Resource & Responsibility</th>
            {/* <th className="p-3 text-left">Expected Deliverable</th> */}
            <SortableHeader field="targetDate" title="Target Date" />
            <th className="p-3 text-left">CP/CS</th>
            <th className="p-3 text-left">Actual Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Changes</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => {
            // Ensure we have a proper ID for comparison
            const itemId = item.id || `temp-${index}`;
            const originalItem = originalPlan.find(i => i.id === item.id);
            const changedFields = getChangedFields(item, originalItem);
            const hasChanges = Object.values(changedFields).some(Boolean);

            return (
              <tr
                key={itemId}
                className={`border-t ${hasChanges ? "bg-yellow-50" : ""}`}
              >
                <td className="p-3 text-center">{index + 1}</td>

                <td className={`p-3 ${changedFields.item ? "border-l-4 border-yellow-500" : ""} check`}>
                  {item.item}
                </td>

                <td className={`p-3 ${changedFields.category ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.category || ''}
                </td>

                <td className={`p-3 ${changedFields.priority ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.priority || ''}
                </td>

                <td className={`p-3 ${changedFields.measures ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.measures || ''}
                </td>

                <td className={`p-3 ${changedFields.resource ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.resource || ''}
                </td>

                {/* <td className={`p-3 ${changedFields.deliverable ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.deliverable || ''}
                </td> */}

                <td className={`p-3 ${changedFields.targetDate ? "border-l-4 border-yellow-500" : ""}`}>
                  {formatDate(item.targetDate)}
                </td>

                <td className={`p-3 ${changedFields.CS ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.CS || ''}
                </td>

                <td className={`p-3 ${changedFields.actualDate ? "border-l-4 border-yellow-500" : ""}`}>
                  {formatDate(item.actualDate)}
                </td>

                <td className={`p-3 ${changedFields.status ? "border-l-4 border-yellow-500" : ""}`}>
                  {item.status}
                </td>

                <td className="p-3">
                  {hasChanges ? (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(changedFields).map(([field, hasChanged]) => (
                        hasChanged && (
                          <button
                            key={field}
                            onClick={() => onRevertField(String(itemId), field as keyof ESGCapItem)}
                            className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                            title={`Revert ${field} to original`}
                          >
                            {field}
                          </button>
                        )
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No changes</span>
                  )}
                </td>

                <td className="p-3 space-x-2">
                  {hasChanges && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRevertItem(String(itemId))}
                    >
                      Revert
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ESGCapPage = () => {
  const { isLoading: authLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated, isAuthenticatedStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [esgCap, setEsgCap] = useState<ESGCapData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null>(
    { key: 'targetDate', direction: 'asc' }
  );
  const [showComparisonView, setShowComparisonView] = useState(false);
  const [originalPlan, setOriginalPlan] = useState<ESGCapItem[]>([]);

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user ", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  const loadData = async () => {
    if (!entityId) return;

    setLoading(true);
    try {
      const data = await fetchEsgCap(entityId);
      if (data?.status) {
        setEsgCap({
          status: data.status,
          finalPlan: data.finalPlan || false,
          plan: data.plan || [],
          entityId: data.entityId,
          planHistoryDetails: data.planHistoryDetails || [],
          comparePlan: data.comparePlan,
          finalAcceptance: data.finalAcceptance,
          founderPlanFinalStatus: data.founderPlanFinalStatus,
          investorPlanFinalStatus: data.investorPlanFinalStatus,
        });

        // Set original plan if we have history
        if (data.planHistoryDetails?.length > 0) {
          setOriginalPlan(data.planHistoryDetails[0].requestPlan || []);
        }
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
    if (!esgCap || !esgCap?.entityId) return;

    setLoading(true);
    try {
      let response;
      let finalData: any;

      switch (action) {
        case 'requestChange':
          // Get current user type to determine which plan to update in comparePlan
          const isFounder = user?.entityType === 2;

          // Create the updated comparePlan for the request
          let updatedComparePlan = esgCap.comparePlan;

          // If comparePlan doesn't exist, create it
          if (!updatedComparePlan) {
            updatedComparePlan = {
              founderPlan: isFounder ? esgCap.plan : [],
              investorPlan: isFounder ? [] : esgCap.plan,
              founderPlanLastUpdate: isFounder ? Date.now() : null,
              investorPlanLastUpdate: isFounder ? null : Date.now()
            };
          } else {
            // If comparePlan exists, update the appropriate plan based on user type
            updatedComparePlan = {
              ...updatedComparePlan,
              ...(isFounder
                ? {
                  founderPlan: esgCap.plan,
                  founderPlanLastUpdate: Date.now()
                }
                : {
                  investorPlan: esgCap.plan,
                  investorPlanLastUpdate: Date.now()
                }
              )
            };
          }

          finalData = {
            entityId: esgCap.entityId,
            changeRequest: {
              plan: esgCap.plan,
              comment: "Change Request"
            },
            comparePlan: updatedComparePlan
          };

          console.log("RequestChange Payload:", finalData);
          response = await esgddChangePlan(finalData);
          break;

        case 'accept':
          // Get current user type to determine which plan to update in comparePlan
          const acceptIsFounder = user?.entityType === 2;

          // Create the updated comparePlan for acceptance
          let acceptComparePlan = esgCap.comparePlan;

          // If comparePlan doesn't exist, create it
          if (!acceptComparePlan) {
            acceptComparePlan = {
              founderPlan: acceptIsFounder ? esgCap.plan : [],
              investorPlan: acceptIsFounder ? [] : esgCap.plan,
              founderPlanLastUpdate: acceptIsFounder ? Date.now() : null,
              investorPlanLastUpdate: acceptIsFounder ? null : Date.now()
            };
          } else {
            // If comparePlan exists, update the appropriate plan based on user type
            acceptComparePlan = {
              ...acceptComparePlan,
              ...(acceptIsFounder
                ? {
                  founderPlan: esgCap.plan,
                  founderPlanLastUpdate: Date.now()
                }
                : {
                  investorPlan: esgCap.plan,
                  investorPlanLastUpdate: Date.now()
                }
              )
            };
          }

          finalData = {
            entityId: esgCap.entityId,
            plan: esgCap.plan,
            comparePlan: acceptComparePlan
          };
          console.log("Accept Payload:", finalData);
          response = await esgddAcceptPlan(finalData);
          break;

        case 'update':
          // For update action, we still need to include comparePlan data
          const updateIsFounder = user?.entityType === 2;

          let updateComparePlan = esgCap.comparePlan;

          // If comparePlan doesn't exist, create it
          if (!updateComparePlan) {
            updateComparePlan = {
              founderPlan: updateIsFounder ? esgCap.plan : [],
              investorPlan: updateIsFounder ? [] : esgCap.plan,
              founderPlanLastUpdate: updateIsFounder ? Date.now() : null,
              investorPlanLastUpdate: updateIsFounder ? null : Date.now()
            };
          } else {
            // If comparePlan exists, update the appropriate plan based on user type
            updateComparePlan = {
              ...updateComparePlan,
              ...(updateIsFounder
                ? {
                  founderPlan: esgCap.plan,
                  founderPlanLastUpdate: Date.now()
                }
                : {
                  investorPlan: esgCap.plan,
                  investorPlanLastUpdate: Date.now()
                }
              )
            };
          }

          finalData = {
            entityId: esgCap.entityId,
            plan: esgCap.plan,
            comparePlan: updateComparePlan
          };
          // console.log("Update Payload:", finalData);
          response = await updatePlan(finalData);
          break;
      }
      if (response) {
        toast.success("Successfully Submitted!");
        await loadData();
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
      item.item?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item.measures?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;

    if (sortConfig.key === 'targetDate' || sortConfig.key === 'createdAt' || sortConfig.key === 'actualDate') {
      const dateA = new Date(a[sortConfig.key] || 0).getTime();
      const dateB = new Date(b[sortConfig.key] || 0).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

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

  // Handle revert to original item
  const handleRevertItem = (itemId: string) => {
    // Use proper ID handling with fallback
    const originalItem = originalPlan.find(item => String(item.id) === itemId);
    if (originalItem) {
      setEsgCap(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          plan: prev.plan.map(item =>
            String(item.id) === itemId ? originalItem : item
          )
        };
      });
      toast.success(`Item "${originalItem.item}" reverted to original`);
    }
  };

  // Handle revert specific field
  const handleRevertField = (itemId: string, field: keyof ESGCapItem) => {
    // Use proper ID handling with fallback
    const originalItem = originalPlan.find(item => String(item.id) === itemId);
    if (originalItem && field in originalItem) {
      setEsgCap(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          plan: prev.plan.map(item =>
            String(item.id) === itemId ? { ...item, [field]: originalItem[field] } : item
          )
        };
      });
      toast.success(`Field "${field}" reverted to original`);
    }
  };

  // Toggle comparison view
  const toggleComparisonView = () => {
    if (showComparisonView) {
      setShowComparisonView(false);
    } else if (originalPlan.length > 0) {
      setShowComparisonView(true);
    } else {
      toast.warning("No previous version to compare with");
    }
  };

  // Check if accept button should be disabled
  const shouldDisableAcceptButton = () => {
    if (!esgCap || !esgCap.founderPlanFinalStatus) return false;
    // Disable accept button if founder has already accepted
    if (user?.entityType === 2 && esgCap.founderPlanFinalStatus === true) {
      return true;
    }

    // Disable accept button if investor has already accepted
    if (user?.entityType === 1 && esgCap.investorPlanFinalStatus) {
      return true;
    }

    return false;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }
  if (!isAuthenticatedStatus) {
    return <Navigate to="/" />;
  }

  const handleUpdateItem = (updatedItem: ESGCapItem) => {
    setEsgCap(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        plan: prev.plan.map(item =>
          String(item.id) === String(updatedItem.id) ? updatedItem : item
        )
      };
    });
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
                {esgCap?.finalPlan && <span className="ml-2 text-green-600">(Final Plan)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-shrink-0">
                  <ESGCapFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                  />
                </div>

                <div className="flex gap-2">
                  {originalPlan.length > 0 && (
                    <Button
                      variant={showComparisonView ? "default" : "outline"}
                      onClick={toggleComparisonView}
                      className={showComparisonView ? "border-purple-500 text-purple-500" : ""}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      <ArrowRight className="h-4 w-4 mr-1" />
                      {showComparisonView ? "Exit Comparison" : "Compare Changes"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {showComparisonView ? (
                  <ComparePlanView
                    currentPlan={esgCap?.plan || []}
                    originalPlan={originalPlan}
                    onRevertItem={handleRevertItem}
                    onRevertField={handleRevertField}
                    showComparisonView={showComparisonView}
                  />
                ) : (
                  <ESGCapTable
                    sortedItems={sortedItems}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    onItemUpdate={handleUpdateItem}
                  />
                )}
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
                      disabled={loading || shouldDisableAcceptButton()}
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