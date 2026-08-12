import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ESGCapItem } from '../../types/esgDD';
import { ComplianceGraphModal } from './ComplianceGraphModal';
interface ESGCapScoringProps {
  items: ESGCapItem[];
  onFilterChange?: (filterKey: string | null) => void;
  activeFilter?: string | null;
  complianceScore?: number;
  entityId: string;
}

export const ESGCapScoring: React.FC<ESGCapScoringProps> = ({ items, onFilterChange, activeFilter, complianceScore, entityId }) => {
  console.log('items----->', items);
  const [modalOpen, setModalOpen] = useState(false);

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
    if (score >= 81) {
      return { grade: "AA", label: "On Track", color: "text-green-600" };
    }
    if (score >= 61) {
      return { grade: "A", label: "Stable", color: "text-emerald-600" };
    }
    if (score >= 41) {
      return { grade: "BB", label: "Needs Attention", color: "text-yellow-600" };
    }
    if (score >= 21) {
      return { grade: "B", label: "At Risk", color: "text-orange-600" };
    }

    return { grade: "C", label: "Critical", color: "text-red-600" };
  };

  const complianceRating = getComplianceRating(complianceScore ?? 0);

  const csItems = filteredItems.filter(
    item => item.dealCondition === 'CS'
  );

  // Get submit date for a CS item
  const getSubmitDate = (item: any): Date | null => {
    // 1. Get latest uploadedAt from completionIndicators
    const uploadedDates = (item.completionIndicators || [])
      .map(indicator => indicator.uploadedAt)
      .filter(Boolean)
      .map(date => new Date(date as string))
      .filter(date => !isNaN(date.getTime()));

    if (uploadedDates.length > 0) {
      return new Date(
        Math.max(...uploadedDates.map(date => date.getTime()))
      );
    }

    // 2. If no uploadedAt and company is submitted,
    //    use item's createdAt
    if (normalize(item.companyStatus) === 'submitted') {
      if (item.createdAt) {
        const createdDate = new Date(item.createdAt);

        if (!isNaN(createdDate.getTime())) {
          return createdDate;
        }
      }
    }

    return null;
  };

  const getMonthDifference = (
    startDate: Date,
    endDate: Date
  ): number => {
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );
  };

  const getCSCount = (
    priority: 'High' | 'Medium' | 'Low',
    type:
      | 'ontime'
      | 'buffer1'
      | 'buffer2'
      | 'buffer3'
      | 'under3'
      | 'over3'
  ) => {
    return csItems.filter(item => {

      if ((item.priority || 'Medium') !== priority) {
        return false;
      }

      if (!item.targetDate) {
        return false;
      }

      const targetDate = new Date(item.targetDate);

      if (isNaN(targetDate.getTime())) {
        return false;
      }

      const submitDate = getSubmitDate(item);

      // -----------------------------------------
      // SUBMITTED
      // -----------------------------------------
      if (submitDate) {
        const months = getMonthDifference(
          targetDate,
          submitDate
        );

        switch (type) {
          case 'ontime':
            return months <= 0;

          case 'buffer1':
            return months === 1;

          case 'buffer2':
            return months === 2;

          case 'buffer3':
            return months === 3;

          case 'under3':
            return false;

          case 'over3':
            return months > 3;

          default:
            return false;
        }
      }

      // -----------------------------------------
      // NOT SUBMITTED
      // -----------------------------------------
      const today = new Date();

      const months = getMonthDifference(
        targetDate,
        today
      );

      // Target date has not passed
      if (months <= 0) {
        return false;
      }

      // Not submitted + overdue <= 3 months
      if (type === 'under3') {
        return months >= 1 && months <= 3;
      }

      // Not submitted + overdue > 3 months
      if (type === 'over3') {
        return months > 3;
      }

      return false;
    }).length;
  };

  // const debugCSItems = csItems.map(item => {
  //   const submitDate = getSubmitDate(item);

  //   if (!item.targetDate) {
  //     return {
  //       item: item.item,
  //       priority: item.priority,
  //       targetDate: null,
  //       submitDate,
  //       result: "NO TARGET DATE",
  //     };
  //   }

  //   const targetDate = new Date(item.targetDate);

  //   const endDate = submitDate || new Date();

  //   const months = getMonthDifference(targetDate, endDate);

  //   let category = "";

  //   if (submitDate) {
  //     if (months <= 0) category = "Completed in Time";
  //     else if (months === 1) category = "Buffer 1";
  //     else if (months === 2) category = "Buffer 2";
  //     else if (months === 3) category = "Buffer 3";
  //     else category = ">3 Buffer";
  //   } else {
  //     if (months > 3) category = "Not completed >3 Buffer";
  //     else category = "NOT CLASSIFIED";
  //   }

  //   return {
  //     item: item.item,
  //     priority: item.priority,
  //     targetDate: item.targetDate,
  //     submitDate: submitDate?.toISOString() || null,
  //     companyStatus: item.companyStatus,
  //     createdAt: item.createdAt,
  //     months,
  //     category,
  //   };
  // });

  // console.table(debugCSItems);

  const [animatedCSCount, setAnimatedCSCount] = useState(0);

  useEffect(() => {
    const target = csItems.length;
    let current = 0;

    const duration = 800;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      current = Math.floor(target * progress);
      setAnimatedCSCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [csItems.length]);

  const getPriorityTotal = (
    priority: "High" | "Medium" | "Low"
  ) => {
    return csItems.filter(
      item => (item.priority || "Medium") === priority
    ).length;
  };

  return (
    <>
      <div className="space-y-4">

        {/* ========================= UPPER SECTION ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">

          {/* Compliance Score */}
          <Card className="md:col-span-3 h-full border-2 border-green-100">
            <CardContent className="p-3 h-full">
              <div
                className="h-full min-h-[130px] rounded-lg bg-green-50
                 cursor-pointer flex flex-col items-center justify-center"
                onClick={() => setModalOpen(true)}
              >
                <div
                  className={`text-7xl font-bold leading-none ${complianceRating.color}`}
                >
                  {complianceRating.grade}
                </div>

                <div
                  className={`mt-1 text-xs font-medium ${complianceRating.color}`}
                >
                  {complianceRating.label}
                </div>

                <div className="w-10 h-px bg-green-200 my-3" />

                <div className="mt-1 text-[15px] font-bold text-muted-foreground">
                  Compliance Score
                </div>
              </div>
            </CardContent>
          </Card>


          {/* CS Items */}
          <Card className="md:col-span-9 border border-emerald-100 shadow-sm">
            <CardContent className="p-4">

              {/* Header */}
              {/* <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    CS Items
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Compliance & sustainability performance
                  </p>
                </div>

                <div className="rounded-full bg-emerald-200 px-2 py-1">
                  <span className="text-[11px] text-emerald-700">
                    <span
                      key={csItems.length}
                      className="inline-block font-bold animate-in fade-in zoom-in duration-300"
                    >
                      {animatedCSCount}
                    </span>
                  </span>
                </div>
              </div> */}

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-emerald-100">

                {/* Header */}
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center bg-emerald-50/70 px-3 py-2.5">

                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Priority
                  </div>

                  <div className="text-center text-[10px] font-semibold text-emerald-600">
                    Completed in Time ssss
                  </div>

                  <div className="text-center text-[10px] font-semibold text-lime-600">
                    Completed within 1 Buffer Time
                  </div>

                  <div className="text-center text-[10px] font-semibold text-yellow-600">
                    Completed within 2 Buffer Time
                  </div>

                  <div className="text-center text-[10px] font-semibold text-orange-600">
                    Completed within 3 Buffer Time
                  </div>

                  <div className="text-center text-[10px] font-semibold text-amber-600">
                    Not completed &lt;3 Buffer Time
                  </div>

                  <div className="text-center text-[10px] font-semibold text-red-600">
                    Not completed &gt;3 Buffer Time
                  </div>

                  <div className="text-center text-[10px] font-bold text-emerald-700">
                    Total
                  </div>

                </div>


                {/* HIGH */}
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center border-t border-slate-100 px-3 py-2.5 hover:bg-emerald-50/30">

                  <div className="text-xs font-bold text-red-600">
                    High
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "ontime")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "buffer1")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "buffer2")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "buffer3")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "under3")}
                  </div>

                  <div className="text-center text-xs font-bold text-red-600">
                    {getCSCount("High", "over3")}
                  </div>

                  <div className="text-center text-xs font-bold">
                    {getPriorityTotal("High")}
                  </div>

                </div>


                {/* MEDIUM */}
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center border-t border-slate-100 px-3 py-2.5 hover:bg-emerald-50/30">

                  <div className="text-xs font-bold text-amber-600">
                    Medium
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "ontime")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "buffer1")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "buffer2")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "buffer3")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "under3")}
                  </div>

                  <div className="text-center text-xs font-bold text-red-600">
                    {getCSCount("Medium", "over3")}
                  </div>

                  <div className="text-center text-xs font-bold">
                    {getPriorityTotal("Medium")}
                  </div>

                </div>


                {/* LOW */}
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center border-t border-slate-100 px-3 py-2.5 hover:bg-emerald-50/30">

                  <div className="text-xs font-bold text-slate-500">
                    Low
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "ontime")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "buffer1")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "buffer2")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "buffer3")}
                  </div>

                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "under3")}
                  </div>

                  <div className="text-center text-xs font-bold text-red-600">
                    {getCSCount("Low", "over3")}
                  </div>

                  <div className="text-center text-xs font-bold">
                    {getPriorityTotal("Low")}
                  </div>

                </div>

                {/* TOTAL */}
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center border-t border-emerald-200 bg-emerald-50 px-3 py-2.5">

                  <div className="text-xs font-bold text-emerald-700">
                    Total
                  </div>

                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "ontime") +
                      getCSCount("Medium", "ontime") +
                      getCSCount("Low", "ontime")}
                  </div>

                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "buffer1") +
                      getCSCount("Medium", "buffer1") +
                      getCSCount("Low", "buffer1")}
                  </div>

                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "buffer2") +
                      getCSCount("Medium", "buffer2") +
                      getCSCount("Low", "buffer2")}
                  </div>

                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "buffer3") +
                      getCSCount("Medium", "buffer3") +
                      getCSCount("Low", "buffer3")}
                  </div>

                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "under3") +
                      getCSCount("Medium", "under3") +
                      getCSCount("Low", "under3")}
                  </div>

                  <div className="text-center text-xs font-bold text-red-600">
                    {getCSCount("High", "over3") +
                      getCSCount("Medium", "over3") +
                      getCSCount("Low", "over3")}
                  </div>

                  {/* Overall Total */}
                  <div className="flex justify-center">
                    <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                      {animatedCSCount}
                    </span>
                  </div>

                </div>

              </div>

            </CardContent>
          </Card>

        </div>


        {/* =====================================
            DOWN PART - EXISTING BOXES
            ===================================== */}
        <Card>
          <CardContent className="py-3">
            <div className="grid grid-cols-6 gap-2">

              {/* Due This Month */}
              <div
                className={getCardClass(
                  'due-in-this-month',
                  "bg-orange-50"
                )}
                onClick={() =>
                  handleFilterToggle('due-in-this-month')
                }
              >
                <div className="text-lg font-bold text-orange-600">
                  {dueThisMonthCount}
                </div>
                <div className="text-[10px] text-orange-600 font-medium leading-tight">
                  Due in this Month
                </div>
              </div>

              {/* Overdue */}
              <div
                className={getCardClass(
                  'overdue',
                  "bg-red-50"
                )}
                onClick={() =>
                  handleFilterToggle('overdue')
                }
              >
                <div className="text-lg font-bold text-red-600">
                  {overdueCount}
                </div>
                <div className="text-[10px] text-red-600 font-medium leading-tight">
                  Overdue
                </div>
              </div>

              {/* Partly Submitted */}
              <div
                className={getCardClass(
                  'partly-submitted',
                  "bg-blue-50"
                )}
                onClick={() =>
                  handleFilterToggle('partly-submitted')
                }
              >
                <div className="text-lg font-bold text-blue-600">
                  {partlySubmittedCount}
                </div>
                <div className="text-[10px] text-blue-600 font-medium leading-tight">
                  Partly Submitted
                </div>
              </div>

              {/* Re-submit Requested */}
              <div
                className={getCardClass(
                  're-submit-requested',
                  "bg-amber-50"
                )}
                onClick={() =>
                  handleFilterToggle('re-submit-requested')
                }
              >
                <div className="text-lg font-bold text-amber-600">
                  {resubmitRequestedCount}
                </div>
                <div className="text-[10px] text-amber-600 font-medium leading-tight">
                  Re-submit Requested
                </div>
              </div>

              {/* Submitted Pending Review */}
              <div
                className={getCardClass(
                  'submitted-pending-review',
                  "bg-purple-50"
                )}
                onClick={() =>
                  handleFilterToggle('submitted-pending-review')
                }
              >
                <div className="text-lg font-bold text-purple-600">
                  {submittedPendingReviewCount}
                </div>
                <div className="text-[10px] text-purple-600 font-medium leading-tight">
                  Submitted Pending Review
                </div>
              </div>

              {/* Closed */}
              <div
                className={getCardClass(
                  'closed',
                  "bg-green-50"
                )}
                onClick={() =>
                  handleFilterToggle('closed')
                }
              >
                <div className="text-lg font-bold text-green-600">
                  {closedCount}
                </div>
                <div className="text-[10px] text-green-600 font-medium leading-tight">
                  Closed
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

      <ComplianceGraphModal
        entityId={entityId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};