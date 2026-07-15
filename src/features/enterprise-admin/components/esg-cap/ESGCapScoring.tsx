import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ESGCapItem } from '../../types/esgDD';

interface ESGCapScoringProps {
  items: ESGCapItem[];
  onFilterChange?: (filterKey: string | null) => void;
  activeFilter?: string | null;
  complianceScore?: number; // Optional prop for compliance score
}

export const ESGCapScoring: React.FC<ESGCapScoringProps> = ({ items, onFilterChange, activeFilter, complianceScore }) => {

  // ✅ FILTER: Only include CP and CS items for card counting (exclude ESG_Roadmap)
  const filteredItems = items.filter(
    item => item.dealCondition === 'CP' || item.dealCondition === 'CS'
  );

  // Priority weightages for compliance score
  const priorityWeights = {
    High: 2,
    Medium: 1,
    Low: 0.5
  };

  const totalItems = filteredItems.length;
  const baseWeight = totalItems > 0 ? 100 / totalItems : 0;

  const totalWeightage = filteredItems.reduce((sum, item) => {
    const priority = item.priority || 'Medium';
    const weight = priorityWeights[priority] || priorityWeights.Medium;
    return sum + (baseWeight * weight);
  }, 0);

  // 🔥 Helper: Normalize status for consistent comparison
  const normalize = (s?: string) => (s ?? '').trim().toLowerCase();

  // Helper: Check if target date is in current month
  const isInCurrentMonth = (targetDate?: string): boolean => {
    if (!targetDate) return false;
    const today = new Date();
    const target = new Date(targetDate);
    return target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear();
  };

  // 🔥 FIXED: Get effective status - INVESTOR STATUS TAKES PRIORITY
  const getEffectiveCompanyStatus = (item: ESGCapItem): string => {
    const companyStatus = normalize(item.companyStatus ?? item.status);
    const investorStatus = normalize(item.investorStatus);

    // 🔥 1. INVESTOR STATUS TAKES PRIORITY - CHECK FIRST
    if (investorStatus === 'closed') {
      return 'closed';
    }
    if (investorStatus === 're-submit-requested' || investorStatus === 're-submit requested') {
      return 're-submit-requested';
    }
    if (investorStatus === 'partly-submitted' || investorStatus === 'partly submitted') {
      return 'partly-submitted';
    }
    if ((companyStatus === 'submitted' || companyStatus === 'submitted-pending-review') &&
      (investorStatus === 'under-review' || investorStatus === 'under review')) {
      return 'submitted-pending-review';
    }

    // 2. Check company status (only if investor status is not closed or overriding)
    if (companyStatus === 'closed') {
      return 'closed';
    }
    if (companyStatus === 'partly-submitted' || companyStatus === 'partly submitted') {
      return 'partly-submitted';
    }
    if (companyStatus === 'submitted' || companyStatus === 'submitted') {
      return 'submitted';
    }
    if ((companyStatus === 'submitted' || companyStatus === 'submitted-pending-review') &&
      (investorStatus === 'under-review' || investorStatus === 'under review')) {
      return 'submitted-pending-review';
    }
    if (companyStatus === 're-submit-required' || companyStatus === 're-submit required') {
      return 're-submit-requested';
    }
    if (companyStatus === 'overdue') {
      return 'overdue';
    }

    // 3. If no target date, return empty
    if (!item.targetDate) return '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(item.targetDate);
    target.setHours(0, 0, 0, 0);

    if (target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear()) {
      return 'due-in-this-month';
    }

    if (target < today) {
      return 'overdue';
    }

    return 'upcoming';
  };

  // 🔥 FIXED: Get investor status - INVESTOR STATUS TAKES PRIORITY
  const getInvestorStatus = (item: ESGCapItem): string => {
    const investorStatus = normalize(item.investorStatus);
    const companyStatus = normalize(item.companyStatus ?? item.status);

    // 🔥 1. Check investor status FIRST (handles both formats)
    if (investorStatus === 'closed') {
      return 'closed';
    }
    if (investorStatus === 're-submit-requested' || investorStatus === 're-submit requested') {
      return 're-submit-requested';
    }
    if (investorStatus === 'partly-submitted' || investorStatus === 'partly submitted') {
      return 'partly-submitted';
    }
    if (investorStatus === 'submitted-pending-review' || investorStatus === 'submitted pending review') {
      return 'submitted-pending-review';
    }

    // 2. Check company status (only if investor status is not set)
    if (companyStatus === 'closed') {
      return 'closed';
    }
    if (companyStatus === 'partly-submitted' || companyStatus === 'partly submitted') {
      return 'partly-submitted';
    }
    if (companyStatus === 'submitted-pending-review' || companyStatus === 'submitted pending review') {
      return 'submitted-pending-review';
    }
    if (companyStatus === 're-submit-required' || companyStatus === 're-submit required') {
      return 're-submit-requested';
    }

    // 3. Check high priority overdue
    if (companyStatus === 'overdue' &&
      (normalize(item.priority) === 'high' || normalize(item.priority) === 'high priority')) {
      return 'high-priority-overdue';
    }

    // 4. Return the effective status
    return getEffectiveCompanyStatus(item);
  };

  // Check if item is closed
  const isClosed = (item: ESGCapItem): boolean => {
    return getInvestorStatus(item) === 'closed';
  };

  // Completed weightage for compliance score
  const completedWeightage = filteredItems
    .filter(isClosed)
    .reduce((sum, item) => {
      const priority = item.priority || 'Medium';
      const weight = priorityWeights[priority] || priorityWeights.Medium;
      return sum + (baseWeight * weight);
    }, 0);

  const progressPercentage = totalWeightage > 0
    ? (completedWeightage / totalWeightage) * 100
    : 0;

  const safeProgress = Math.max(0, Math.min(100, progressPercentage));
  // const complianceScore = Math.round(safeProgress);

  // ✅ Metrics using filteredItems (ONLY CP and CS)
  const dueThisMonthCount = filteredItems.filter(
    item => {
      const effectiveStatus = getEffectiveCompanyStatus(item);
      return effectiveStatus === 'due-in-this-month' && !isClosed(item);
    }
  ).length;

  const overdueCount = filteredItems.filter(
    item => getEffectiveCompanyStatus(item) === 'overdue' && !isClosed(item)
  ).length;

  const partlySubmittedCount = filteredItems.filter(
    item => getInvestorStatus(item) === 'partly-submitted'
  ).length;

  const resubmitRequestedCount = filteredItems.filter(
    item => getInvestorStatus(item) === 're-submit-requested'
  ).length;

  const submittedPendingReviewCount = filteredItems.filter(
    item => {
      const companyStatus = normalize(item.companyStatus ?? item.status);
      console.log('companyStatus', companyStatus);
      const investorStatus = normalize(item.investorStatus);
      // Company has submitted AND investor hasn't closed it yet
      return (companyStatus === 'submitted') &&
        (investorStatus === "under-review" ||
          investorStatus === "under review");
    }
  ).length;

  const closedCount = filteredItems.filter(
    item => isClosed(item)
  ).length;

  // Helper to style active card
  const getCardClass = (filterKey: string | null, defaultBg: string, isStatic: boolean = false) => {
    const baseClass = "text-center p-2 rounded-lg transition-all";
    if (isStatic) {
      return `${baseClass} ${defaultBg} cursor-default`;
    }
    const clickableClass = "cursor-pointer hover:shadow-md hover:scale-105";
    if (activeFilter === filterKey) {
      return `${baseClass} ${clickableClass} ring-2 ring-primary bg-primary/10 shadow-lg`;
    }
    return `${baseClass} ${clickableClass} ${defaultBg}`;
  };

  // ✅ Single click toggle: click to filter, click again to clear
  const handleFilterToggle = (filterKey: string | null, isStatic: boolean = false) => {
    if (isStatic) return;
    if (activeFilter === filterKey) {
      onFilterChange?.(null);
    } else {
      onFilterChange?.(filterKey);
    }
  };

  const getComplianceRating = (score: number = 0) => {
    if (score >= 85) {
      return { grade: "AA", label: "On Track", color: "text-green-600" };
    }
    if (score >= 70) {
      return { grade: "A", label: "Stable", color: "text-emerald-600" };
    }
    if (score >= 55) {
      return { grade: "BB", label: "Needs Attention", color: "text-yellow-600" };
    }
    if (score >= 40) {
      return { grade: "B", label: "At Risk", color: "text-orange-600" };
    }

    return { grade: "C", label: "Critical", color: "text-red-600" };
  };

  const complianceRating = getComplianceRating(complianceScore ?? 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-3">
          <div className="grid grid-cols-7 gap-2">
            {/* 1. Compliance Score - STATIC */}
            <div className="text-center p-2 rounded-lg bg-green-50 cursor-default">
              <div className="flex flex-col items-center p-0 rounded-lg bg-green-50 cursor-default">
                {/* Top row: left (grade+label) | divider | right (score) */}
                <div className="flex items-center w-full">
                  {/* Left: grade + label stacked & centered */}
                  <div className="flex-1 flex flex-col items-center justify-center pr-2">
                    <div className={`text-xm font-bold ${complianceRating.color}`}>
                      {complianceRating.grade}
                    </div>
                    
                  </div>

                  {/* Vertical divider */}
                  <div className="w-px h-5 bg-gray-200" />

                  {/* Right: score */}
                  <div className="flex-1 flex items-center justify-center pl-2">
                    <div className="text-2xl font-bold text-green-600">
                      {complianceScore?.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Bottom label */}
                <div className="text-[10px] text-muted-foreground mt-0">
                <div className={`text-[10px] ${complianceRating.color} truncate`}>
                      {complianceRating.label}
                    </div>
                  Compliance Score
                </div>
              </div>
            </div>

            {/* 2. Due This Month - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('due-in-this-month', "bg-orange-50")}
              onClick={() => handleFilterToggle('due-in-this-month')}
            >
              <div className="text-lg font-bold text-orange-600">{dueThisMonthCount}</div>
              <div className="text-[10px] text-orange-600 font-medium leading-tight">Due in this Month</div>
            </div>

            {/* 3. Overdue - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('overdue', "bg-red-50")}
              onClick={() => handleFilterToggle('overdue')}
            >
              <div className="text-lg font-bold text-red-600">{overdueCount}</div>
              <div className="text-[10px] text-red-600 font-medium leading-tight">Overdue</div>
            </div>

            {/* 4. Partly Submitted - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('partly-submitted', "bg-blue-50")}
              onClick={() => handleFilterToggle('partly-submitted')}
            >
              <div className="text-lg font-bold text-blue-600">{partlySubmittedCount}</div>
              <div className="text-[10px] text-blue-600 font-medium leading-tight">Partly Submitted</div>
            </div>

            {/* 5. Re-submit Requested - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('re-submit-requested', "bg-amber-50")}
              onClick={() => handleFilterToggle('re-submit-requested')}
            >
              <div className="text-lg font-bold text-amber-600">{resubmitRequestedCount}</div>
              <div className="text-[10px] text-amber-600 font-medium leading-tight">Re-submit Requested</div>
            </div>

            {/* 6. Submitted Pending Review - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('submitted-pending-review', "bg-purple-50")}
              onClick={() => handleFilterToggle('submitted-pending-review')}
            >
              <div className="text-lg font-bold text-purple-600">{submittedPendingReviewCount}</div>
              <div className="text-[10px] text-purple-600 font-medium leading-tight">Submitted Pending Review</div>
            </div>

            {/* 7. Closed - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('closed', "bg-green-50")}
              onClick={() => handleFilterToggle('closed')}
            >
              <div className="text-lg font-bold text-green-600">{closedCount}</div>
              <div className="text-[10px] text-green-600 font-medium leading-tight">Closed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};