import React, { useState, useEffect, useContext } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Folder, FileDown } from 'lucide-react';
import { ESGCapItem } from '../types/esgDD';
import { ESGCapFilters } from '../components/esg-cap/ESGCapFilters';
import { ESGCapTable } from '../components/esg-cap/ESGCapTable';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { CategoryBadge } from '../components/esg-cap/CategoryBadge';
import { HighlightDiff } from '@/components/esg-cap/HighlightDiff';
import { Badge } from '@/components/ui/badge';
import { ESGCapPriority } from '../types/esgDD';
import { cn } from '@/lib/utils';
import { AlertsPanel } from '@/components/esg-cap/AlertsPanel';
import { useESGCAPAlerts } from '@/hooks/useESGCAPAlerts';
import { History } from "lucide-react";

import {
  fetchEsgCap,
  esgddChangePlan,
  esgddAcceptPlan,
  updatePlan
} from '../services/esgdd';
import { logger } from '@/hooks/logger';
import { PageAccessContext } from '@/context/PageAccessContext';
import Loader from '@/components/ui/loader';
import { set } from 'date-fns';
import { ESGCapScoring } from '../components/esg-cap/ESGCapScoring';
import AuditDrawer, { AuditLog } from '../components/esg-cap/AuditDrawer';
import { httpClient } from '@/lib/httpClient';
import AssessmentTypeDialog from '@/features/mis/company/Assessmenttypedialog';
import ESGCapDocumentsDialog from '../components/esg-cap/ESGCapDocumentsDialog';
import { ExportDrawer } from './ExportDrawer';

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

  const ExpandableText = ({ text, length = 50 }: { text: string; length?: number }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    if (text.length <= length) {
      return <span>{text}</span>;
    }

    return (
      <span>
        {expanded ? text : text.slice(0, length) + "..."}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-blue-600 hover:underline text-xs"
        >
          {expanded ? "View less" : "View full"}
        </button>
      </span>
    );
  };

  const StatusBadge: React.FC<{ status: string; highlight?: boolean }> = ({ status, highlight }) => {
    const statusColor = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      delayed: "bg-red-100 text-red-800",
      accepted: "bg-emerald-100 text-emerald-800",
      in_review: "bg-gray-100 text-gray-800",
      pending: "bg-amber-100 text-amber-800"
    }[status] || "bg-gray-100 text-gray-800";

    return <Badge className={`${statusColor} ${highlight ? "border-2 border-yellow-500" : ""}`}>{status}</Badge>;
  };


  interface PriorityBadgeProps {
    priority?: ESGCapPriority;
  }

  const getPriorityStyles = (priority: ESGCapPriority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-400 text-black';
      case 'low':
        return 'bg-gray-300 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  };


  const SortableHeader = ({ field, title }: { field: keyof ESGCapItem; title: string }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 whitespace-nowrap !text-black"
      onClick={() => requestSort(field)}
    >
      {title}
      {sortConfig?.key === field && (
        sortConfig.direction === "asc" ? (
          <ArrowUp className="h-4 w-4 inline ml-1" />
        ) : (
          <ArrowDown className="h-4 w-4 inline ml-1" />
        )
      )}
    </TableHead>
  );

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow className="bg-[#f1f5f9] font-medium">
            <TableHead className="w-[60px] text-center !text-black">S. No</TableHead>
            <SortableHeader field="item" title="Item" />
            <TableHead className="!text-black">Category</TableHead>
            <SortableHeader field="priority" title="Priority" />
            <TableHead className="!text-black">Measures and/or Corrective Actions</TableHead>
            <TableHead className="!text-black">Resource & Responsibility</TableHead>
            <TableHead className="!text-black">Expected Deliverable</TableHead>
            <SortableHeader field="targetDate" title="Target Date" />
            <TableHead className="!text-black">CP/CS</TableHead>
            <TableHead className="!text-black">Actual Date</TableHead>
            <TableHead className="!text-black">Status</TableHead>
            <TableHead className="!text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedItems.map((item, index) => {
            const itemId = item.id || `temp-${index}`;
            const originalItem = originalPlan.find(i => i.id === item.id);
            const changedFields = getChangedFields(item, originalItem);
            const hasChanges = Object.values(changedFields).some(Boolean);

            return (
              <TableRow
                key={itemId}
                className={cn(
                  "hover:bg-gray-50 transition-colors",
                  hasChanges && "bg-yellow-50"
                )}
              >
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>

                <TableCell className={changedFields.item ? "border-l-4 border-yellow-500" : ""}>
                  <ExpandableText text={item.item || ""} />
                </TableCell>

                <TableCell>
                  <CategoryBadge
                    category={item.category}
                  />
                </TableCell>

                <TableCell className={`${changedFields.priority ? "border-l-4 border-yellow-500" : ""} px-2 py-1 text-center`}>
                  <span className={`${getPriorityStyles(item.priority)} px-2 py-1 rounded text-sm whitespace-nowrap`}>
                    {item.priority || ""}
                  </span>
                </TableCell>

                <TableCell className={changedFields.measures ? "border-l-4 border-yellow-500" : ""}>
                  <ExpandableText text={item.measures || ""} />
                </TableCell>

                <TableCell className={changedFields.resource ? "border-l-4 border-yellow-500" : ""}>
                  <ExpandableText text={item.resource || ""} />
                </TableCell>

                <TableCell className={changedFields.deliverable ? "border-l-4 border-yellow-500" : ""}>
                  <ExpandableText text={item.deliverable || ""} />
                </TableCell>

                <TableCell className={changedFields.targetDate ? "border-l-4 border-yellow-500" : ""}>
                  <span className="whitespace-nowrap">{formatDate(item.targetDate) || `Invalid Date`}</span>
                </TableCell>

                <TableCell className={changedFields.CS ? "border-l-4 border-yellow-500" : ""}>
                  {item.CS || "-"}
                </TableCell>

                <TableCell className={changedFields.actualDate ? "border-l-4 border-yellow-500" : ""}>
                  <span className="whitespace-nowrap">{formatDate(item.actualDate) || "-"}</span>
                </TableCell>

                <TableCell>
                  <StatusBadge status={item.status} highlight={changedFields.status} />
                </TableCell>

                <TableCell>
                  {hasChanges ? (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(changedFields).map(([field, hasChanged]) =>
                        hasChanged && (
                          <button
                            key={field}
                            onClick={() => onRevertField(String(itemId), field as keyof ESGCapItem)}
                            className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors whitespace-nowrap"
                          >
                            {field}
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No changes</span>
                  )}
                </TableCell>

                <TableCell>
                  {hasChanges && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRevertItem(String(itemId))}
                      className="whitespace-nowrap"
                    >
                      Revert
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const ESGCapPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'employee']);
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
  const { checkPageButtonAccess } = useContext(PageAccessContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading ...")
  const [reloadData, setReloadData] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ESGCapItem | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(["CP – Conditions Precedent", "CS – Conditions Subsequent", "ESG Roadmap", "Other Items"])
  );
  const [assesmentTypeOpen, setAssessmentTypeOpen] = useState(false);
  const [docsDialogOpen, setDocsDialogOpen] = useState(false);
  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) newSet.delete(groupName);
      else newSet.add(groupName);
      return newSet;
    });
  };
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [cardFilter, setCardFilter] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('fandoro-user');
    const user = JSON.parse(userData);
    if (user.isParent === false) {
      const hasAccess = checkPageButtonAccess('/esg-dd/cap');
      setButtonEnabled(hasAccess);
    } else {
      setButtonEnabled(true);
    }
  }, []);

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      logger.error("Error parsing user ", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  const loadData = async () => {
    if (!entityId) return;

    setLoading(true);
    setLoadingMessage("Loading")
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

        if (data.planHistoryDetails?.length > 0) {
          setOriginalPlan(data.planHistoryDetails[0].requestPlan || []);
        }
      } else {
        toast.error("Failed to load ESG CAP data");
      }
    } catch (error) {
      // toast.error("Error loading CAP data");
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isPlanFinalized = esgCap?.finalPlan === true;

  const handleAction = async (action: 'requestChange' | 'accept' | 'update') => {
    if (!esgCap || !esgCap?.entityId) return;

    setLoading(true);
    setLoadingMessage("Processing data ...")
    try {
      let response;
      let finalData: any;

      switch (action) {
        case 'requestChange':
          const isFounder = user?.entityType === 2;
          let updatedComparePlan = esgCap.comparePlan;

          if (!updatedComparePlan) {
            updatedComparePlan = {
              founderPlan: isFounder ? esgCap.plan : [],
              investorPlan: isFounder ? [] : esgCap.plan,
              founderPlanLastUpdate: isFounder ? Date.now() : null,
              investorPlanLastUpdate: isFounder ? null : Date.now()
            };
          } else {
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

          logger.log("RequestChange Payload:", finalData);
          response = await esgddChangePlan(finalData);
          break;

        case 'accept':
          const acceptIsFounder = user?.entityType === 2;
          let acceptComparePlan = esgCap.comparePlan;

          if (!acceptComparePlan) {
            acceptComparePlan = {
              founderPlan: acceptIsFounder ? esgCap.plan : [],
              investorPlan: acceptIsFounder ? [] : esgCap.plan,
              founderPlanLastUpdate: acceptIsFounder ? Date.now() : null,
              investorPlanLastUpdate: acceptIsFounder ? null : Date.now()
            };
          } else {
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
          logger.log("Accept Payload:", finalData);
          response = await esgddAcceptPlan(finalData);
          break;

        case 'update':
          const updateIsFounder = user?.entityType === 2;
          let updateComparePlan = esgCap.comparePlan;

          if (!updateComparePlan) {
            updateComparePlan = {
              founderPlan: updateIsFounder ? esgCap.plan : [],
              investorPlan: updateIsFounder ? [] : esgCap.plan,
              founderPlanLastUpdate: updateIsFounder ? Date.now() : null,
              investorPlanLastUpdate: updateIsFounder ? null : Date.now()
            };
          } else {
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
          response = await updatePlan(finalData);
          break;
      }
      if (response) {
        toast.success("Successfully Submitted!");
        await loadData();
      }
    } catch (error) {
      toast.error("An error occurred during submission");
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityId, reloadData]);

  const alerts = useESGCAPAlerts(esgCap?.plan || [], originalPlan, esgCap?.finalPlan || false);

  const filteredItems = esgCap?.plan?.filter(item => {
    const itemTitle = item?.item || '';
    const itemMeasures = item?.measures || '';
    const itemStatus = item?.status || '';
    const itemCategory = item?.category || '';
    const investorStatus = item?.investorStatus || '';

    const matchesSearch = itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemMeasures.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || itemCategory === categoryFilter;

    const getDateStatus = (item: ESGCapItem) => {
      if (!item.targetDate) return " ";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const target = new Date(item.targetDate);
      target.setHours(0, 0, 0, 0);

      if (
        target.getMonth() === today.getMonth() &&
        target.getFullYear() === today.getFullYear()
      ) {
        return "due in this month";
      }

      if (target < today) {
        return "overdue";
      }

      return "upcoming";
    };

    let matchesCardFilter = true;

    if (cardFilter) {
      if (cardFilter === "closed") {
        matchesCardFilter =
          investorStatus?.toLowerCase() === "closed";
      }
      else if (cardFilter === "submitted") {
        matchesCardFilter =
        itemStatus?.toLowerCase() === "submitted";
      }
      else {
        matchesCardFilter =
          investorStatus?.toLowerCase() !== "closed" &&
          itemStatus?.toLowerCase() !== "submitted" &&
          getDateStatus(item) === cardFilter;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesCardFilter;
  }) || [];

  const isOverdue = (item: ESGCapItem) => {
    if (!item.targetDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(item.targetDate);
    targetDate.setHours(0, 0, 0, 0);

    return (
      targetDate < today &&
      item.investorStatus !== "closed" &&
      !item.actualDate
    );
  };


  const sortedItems = [...filteredItems].sort((a, b) => {
    // 1. overdue items on top
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // 2. completed items at bottom
    const aCompleted = a.investorStatus === "closed";
    const bCompleted = b.investorStatus === "closed";

    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;

    // 3. normal sorting
    if (!sortConfig) return 0;

    if (
      sortConfig.key === "targetDate" ||
      sortConfig.key === "createdAt" ||
      sortConfig.key === "actualDate"
    ) {
      const dateA = new Date(a[sortConfig.key] || 0).getTime();
      const dateB = new Date(b[sortConfig.key] || 0).getTime();

      return sortConfig.direction === "asc"
        ? dateA - dateB
        : dateB - dateA;
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }

    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  const requestSort = (key: keyof ESGCapItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRevertItem = (itemId: string) => {
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

  const handleRevertField = (itemId: string, field: keyof ESGCapItem) => {
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

  const toggleComparisonView = () => {
    if (showComparisonView) {
      setShowComparisonView(false);
    } else if (originalPlan.length > 0) {
      setShowComparisonView(true);
    } else {
      toast.warning("No previous version to compare with");
    }
  };

  const shouldDisableAcceptButton = () => {
    if (isPlanFinalized) return true;
    if (!esgCap || !esgCap.founderPlanFinalStatus) return false;
    if (user?.entityType === 2 && esgCap.founderPlanFinalStatus === true) {
      return true;
    }
    if (user?.entityType === 1 && esgCap.investorPlanFinalStatus) {
      return true;
    }
    return false;
  };

  const shouldDisableRequestButton = () => {
    return loading || !buttonEnabled || isPlanFinalized;
  };

  // useEffect(() => {
  //   if(user && user.misCompanyId) {
  //     setAssessmentTypeOpen(true);
  //   }
  // }, [user]);

  if (isLoading) {
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
        plan: prev.plan.map((item, index) => {
          // use id when available
          if (item.id && updatedItem.id) {
            return String(item.id) === String(updatedItem.id)
              ? updatedItem
              : item;
          }

          // fallback unique comparison for items without id
          const isSameItem =
            item.item === updatedItem.item &&
            item.CS === updatedItem.CS &&
            item.measures === updatedItem.measures;

          return isSameItem ? updatedItem : item;
        })
      };
    });
  };

  const handleReview = (item: ESGCapItem) => {
    setSelectedItem(item);
    setReviewDialogOpen(true);
  };

  const investorEmailStored = localStorage.getItem("fandoro-admin");
  const isInvestorEmailExists = !!investorEmailStored;

  const groupedItems = sortedItems.reduce(
    (acc: Record<string, ESGCapItem[]>, item) => {
      let groupKey = "Other Items";

      if (item.dealCondition === "CP") {
        groupKey = "CP – Conditions Precedent";
      } else if (item.dealCondition === "CS") {
        groupKey = "CS – Conditions Subsequent";
      } else if (item.dealCondition === "ESG_Roadmap") {
        groupKey = "ESG Roadmap";
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }

      acc[groupKey].push(item);

      return acc;
    },
    {
      "CP – Conditions Precedent": [],
      "CS – Conditions Subsequent": [],
      "ESG Roadmap": [],
      "Other Items": [],
    }
  );
  const getAuditLogs = async () => {
    let logs = await httpClient.get('audit');
    console.log("audit logs ", logs);
    if (logs?.status == 200) {
      setLogs(logs.data['data']);
    }
  }

  useEffect(() => {
    getAuditLogs();
  }, []);

  const userData = JSON.parse(localStorage.getItem('fandoro-user') || '{}');
  const companyName = userData?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Loader show={loading} text={loadingMessage} />
      <UnifiedSidebarLayout>
        <Card className="shadow-lg border-0">
          {/* <CardHeader className="border-b">
              <CardDescription className="text-sm">
                <h1 className="text-3xl font-bold tracking-tight">ESG Corrective Action Plan</h1>
                <p className="mt-1">
                  Track and manage corrective actions from ESG due diligence assessments.
                </p>
              </CardDescription>
            </CardHeader> */}
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <ESGCapFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
              {/* <div className="flex justify-end mb-2"> */}
              {/* <Button
                variant="outline"
                onClick={() => setAuditOpen(true)}
                className="flex items-center gap-2" // comment for production
              >
                <History className="w-4 h-4" />
                Audit Logs
              </Button> */}
             
              <Button
                variant="outline"
                onClick={() => setDocsDialogOpen(true)}
                className="flex items-center gap-2 justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <Folder className="w-4 h-4" />
                Uploads
              </Button>

              <Button
                variant="outline"
                onClick={() => setDrawer(true)}
                className="flex items-center gap-2 justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <FileDown className="h-4 w-4" /> Export 
              </Button>
            </div>
            {/* Filters Section */}


            {/* Alerts Panel - MOVED OUTSIDE the filters container */}
            {!isInvestorEmailExists && esgCap?.plan && esgCap.plan.length > 0 && (
              <div className="mb-6">
                <AlertsPanel
                  overdueItems={alerts.overdueItems}
                  approachingDeadlines={alerts.approachingDeadlines}
                  onItemClick={handleReview}
                  finalPlan={esgCap?.finalPlan}
                />
              </div>
            )}

            {/* {sortedItems.length > 0 && (
              <div className="mt-6 py-4"> */}
            <ESGCapScoring items={esgCap?.plan || []}
              onFilterChange={setCardFilter}
              activeFilter={cardFilter}
            />
            {/* </div>
            )} */}
            <div className="space-y-4  mt-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No items match the current filters.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setCardFilter(null);
                    }}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                Object.entries(groupedItems)
                  .filter(([_, items]) => items.length > 0)
                  .map(([groupName, items]) => {
                    const isCollapsed = collapsedGroups.has(groupName);
                    return (
                      <div key={groupName} className="border rounded-lg overflow-hidden bg-white">
                        <div
                          className="px-4 py-3 border-b bg-slate-50 cursor-pointer flex justify-between items-center hover:bg-slate-100"
                          onClick={() => toggleGroup(groupName)}
                        >
                          <h2 className="text-lg font-semibold text-slate-800">{groupName}</h2>
                          <span className="text-slate-500">{isCollapsed ? '▼' : '▶'}</span>
                        </div>
                        {/* Content - only shown when expanded */}
                        {!isCollapsed && (
                          <div className="overflow-x-auto">
                            {showComparisonView ? (
                              <ComparePlanView
                                currentPlan={items}
                                originalPlan={originalPlan.filter(original => {
                                  if (groupName === "CP – Conditions Precedent") return original.dealCondition === "CP";
                                  if (groupName === "CS – Conditions Subsequent") return original.dealCondition === "CS";
                                  if (groupName === "ESG Roadmap") return original.dealCondition === "ESG_Roadmap";
                                  return original.dealCondition !== "CP" && original.dealCondition !== "CS" && original.dealCondition !== "ESG_Roadmap";
                                })}
                                onRevertItem={handleRevertItem}
                                onRevertField={handleRevertField}
                                showComparisonView={showComparisonView}
                              />
                            ) : (
                              <ESGCapTable
                                sortedItems={items}
                                sortConfig={sortConfig}
                                requestSort={requestSort}
                                onItemUpdate={handleUpdateItem}
                                buttonEnabled={buttonEnabled}
                                finalPlan={isPlanFinalized}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>

            {/* Action Buttons */}
            {/* <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleAction('requestChange')}
                disabled={shouldDisableRequestButton()}
                className="hover:bg-amber-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Request CAP Change
              </Button>
              <Button
                onClick={() => handleAction('accept')}
                disabled={loading || !buttonEnabled || shouldDisableAcceptButton()}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Accept CAP
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </UnifiedSidebarLayout>
      <AuditDrawer open={auditOpen} onClose={() => setAuditOpen(false)} logs={logs} />
      <AssessmentTypeDialog />
      <ESGCapDocumentsDialog
        open={docsDialogOpen}
        onClose={() => setDocsDialogOpen(false)}
        entityId={entityId}
      />
      <ExportDrawer open={drawer} onClose={() => setDrawer(false)} items={esgCap?.plan || []} entityName={{companyName}} />

    </div>
  );
};

export default ESGCapPage;

// isOpenStatus={assesmentTypeOpen}
//         onClose={() => setAssessmentTypeOpen(false)}
//         onProceed={(type: "mis" | "escap") => {
//           console.log("Selected:", type);
//           setAssessmentTypeOpen(false);
//         }}