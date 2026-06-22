import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ESGCapItem } from '../../types/esgDD';

interface ESGCapScoringProps {
  items: ESGCapItem[];
  onFilterChange?: (filterKey: string | null) => void;
  activeFilter?: string | null;
}

export const ESGCapScoring: React.FC<ESGCapScoringProps> = ({ items, onFilterChange, activeFilter }) => {

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

  // Helper: Check if target date is in current month (monthly basis, not date-wise)
  const isInCurrentMonth = (targetDate?: string): boolean => {
    if (!targetDate) return false;
    const today = new Date();
    const target = new Date(targetDate);
    return target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear();
  };

  // Helper: Get effective status from companyStatus (normalizes different formats)
  const getEffectiveCompanyStatus = (item: ESGCapItem): string => {
    const companyStatus = (item.companyStatus || '').toLowerCase().trim();
    const investorStatus = (item.investorStatus || '').toLowerCase().trim();

    if (investorStatus === 'closed' || companyStatus === 'closed') {
      return 'closed';
    }

    if (companyStatus === 'partly-submitted' || companyStatus === 'partly submitted') {
      return 'partly-submitted';
    }
    if (companyStatus === 'submitted-pending-review' || companyStatus === 'submitted pending review') {
      return 'submitted-pending-review';
    }
    if (companyStatus === 're-submit-required' || companyStatus === 're-submit required' || companyStatus === 're-submit-Required') {
      return 're-submit-Required';
    }
    if (companyStatus === 'overdue') {
      return 'overdue';
    }

    if (!item.targetDate) return '';

    const today = new Date();
    const target = new Date(item.targetDate);

    if (target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear()) {
      return 'due-in-this-month';
    }

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    if (target < today) {
      return 'overdue';
    }

    return 'upcoming';
  };

  // Helper: Get investor status (use investorStatus field or derive)
  const getInvestorStatus = (item: ESGCapItem): string => {
    if (item.investorStatus && item.investorStatus.trim() !== '') {
      return item.investorStatus.toLowerCase();
    }

    const companyStatus = (item.companyStatus || '').toLowerCase();
    if (companyStatus === 'closed') {
      return 'closed';
    }
    if (companyStatus === 'partly-submitted' || companyStatus === 'partly submitted') {
      return 'partly-submitted';
    }
    if (companyStatus === 'submitted-pending-review' || companyStatus === 'submitted pending review') {
      return 'submitted-pending-review';
    }
    if (companyStatus === 're-submit-required' || companyStatus === 're-submit required' || companyStatus === 're-submit-Required') {
      return 're-submit-requested';
    }

    if (companyStatus === 'overdue' && (item.priority === 'High' || item.priority === 'high')) {
      return 'high-priority-overdue';
    }

    return '';
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
  const complianceScore = Math.round(safeProgress);

  // ✅ Metrics using filteredItems (ONLY CP and CS)

  const dueThisMonthCount = filteredItems.filter(
    item => {
      const effectiveStatus = getEffectiveCompanyStatus(item);
      return effectiveStatus === 'due-in-this-month' &&
        getInvestorStatus(item) !== 'closed';
    }
  ).length;

  const overdueCount = filteredItems.filter(
    item => getEffectiveCompanyStatus(item) === 'overdue'
  ).length;

  const partlySubmittedCount = filteredItems.filter(
    item => getInvestorStatus(item) === 'partly-submitted'
  ).length;

  const resubmitRequestedCount = filteredItems.filter(
    item => (item.investorStatus || '').toLowerCase() === 're-submit-requested'
  ).length;

  const submittedPendingReviewCount = filteredItems.filter(
    item => getInvestorStatus(item) === 'submitted-pending-review'
  ).length;

  const closedCount = filteredItems.filter(
    item => getInvestorStatus(item) === 'closed'
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
    // Toggle: if same filter is active, clear it; otherwise set it
    if (activeFilter === filterKey) {
      onFilterChange?.(null);
    } else {
      onFilterChange?.(filterKey);
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ Single Card with 7 items in one line */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardContent className="py-3">
          <div className="grid grid-cols-7 gap-2">
            {/* 1. Compliance Score - STATIC */}
            <div className="text-center p-2 rounded-lg bg-green-50 cursor-default">
              <div className="text-lg font-bold text-green-600">{complianceScore}%</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Compliance Score</div>
            </div>

            {/* 2. Due This Month - CLICKABLE TOGGLE */}
            <div
              className={getCardClass('due-in-this-month', "bg-orange-50")}
              onClick={() => handleFilterToggle('due-in-this-month')}
            >
              <div className="text-lg font-bold text-orange-600">{dueThisMonthCount}</div>
              <div className="text-[10px] text-orange-600 font-medium leading-tight">Due This Month</div>
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