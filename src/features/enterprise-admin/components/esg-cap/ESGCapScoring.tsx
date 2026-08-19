import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ESGCapItem } from '../../types/esgDD';
import { ComplianceGraphModal } from './ComplianceGraphModal';
import { getEffectiveStatus } from '@/utils/esgStatus';
interface ESGCapScoringProps {
  items: ESGCapItem[];
  onFilterChange?: (filterKey: string | null) => void;
  activeFilter?: string | null;
  complianceScore?: number;
  entityId: string;
}

export const ESGCapScoring: React.FC<ESGCapScoringProps> = ({ items, onFilterChange, activeFilter, complianceScore, entityId }) => {
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
    return getEffectiveStatus(item);
  };

  // Check if item is closed
  const isClosed = (item: ESGCapItem): boolean => {
    return getInvestorStatus(item) === 'closed';
  };

  // ✅ Metrics using filteredItems (ONLY CP and CS)
  const dueThisMonthCount = filteredItems.filter(
    item => {
      const effectiveStatus = getEffectiveStatus(item);
      return effectiveStatus === 'due-in-this-month' && !isClosed(item);
    }
  ).length;

  const overdueCount = filteredItems.filter(
    item => getEffectiveStatus(item) === 'overdue' && !isClosed(item)
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

  const getCSCategory = (item: ESGCapItem) => {
    const CUTOFF_DATE = new Date('2026-06-30T23:59:59.999');
  
    if (!item.targetDate) {
      return null;
    }
  
    const targetDate = new Date(item.targetDate);
  
    if (isNaN(targetDate.getTime())) {
      return null;
    }
  
    // IMPORTANT:
    // Do NOT use investor status here.
    // Only company status is considered.
    const companyStatus = normalize(item.companyStatus ?? item.status);
  
    // =====================================================
    // GET LATEST uploadedAt
    // =====================================================
  
    const uploadedDates = (item.completionIndicators || [])
      .map(indicator => indicator.uploadedAt)
      .filter(Boolean)
      .map(date => new Date(date as string))
      .filter(date => !isNaN(date.getTime()));
  
    const updatedDate =
      uploadedDates.length > 0
        ? new Date(
            Math.max(...uploadedDates.map(date => date.getTime()))
          )
        : null;
  
    // =====================================================
    // GET SUBMIT DATE
    // =====================================================
  
    const submitDate = getSubmitDate(item);
  
    // =====================================================
    // TARGET DATE <= 30 JUNE 2026
    // =====================================================
  
    if (targetDate <= CUTOFF_DATE) {
  
      // ---------------------------------------------------
      // Submitted / Closed + uploaded date
      // ---------------------------------------------------
  
      if (
        updatedDate &&
        (companyStatus === 'submitted' || companyStatus === 'closed')
      ) {
  
        // Same month or before target month = ON TIME
        //
        // Example:
        // Target  : 24 June
        // Uploaded: 26 June
        // Month difference = 0
        //
        // Business rule => ON TIME
        const months = getMonthDifference(
          targetDate,
          updatedDate
        );
  
        if (months <= 0) {
          return 'ontime';
        }
  
        if (months === 1) {
          return 'buffer1';
        }
  
        if (months === 2) {
          return 'buffer2';
        }
  
        if (months === 3) {
          return 'buffer3';
        }
  
        if (months > 3) {
          return 'over3';
        }
      }
  
      // ---------------------------------------------------
      // No uploadedAt but submitted/closed
      // ---------------------------------------------------
  
      if (
        !updatedDate &&
        (companyStatus === 'submitted' || companyStatus === 'closed')
      ) {
        return 'ontime';
      }
  
      // ---------------------------------------------------
      // NOT COMPLETED
      // ---------------------------------------------------
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const cleanTargetDate = new Date(targetDate);
      cleanTargetDate.setHours(0, 0, 0, 0);
  
      // Target is still in future
      if (cleanTargetDate > today) {
        return 'upcoming';
      }
  
      const months = getMonthDifference(
        cleanTargetDate,
        today
      );
  
      if (months <= 3) {
        return 'under3';
      }
  
      return 'over3';
    }
  
    // =====================================================
    // TARGET DATE > 30 JUNE 2026
    // =====================================================
  
    if (submitDate) {
  
      // Submitted on/before target
      if (
        (companyStatus === 'submitted' || companyStatus === 'closed') &&
        submitDate <= targetDate
      ) {
        return 'ontime';
      }
  
      // Submitted after target
      const months = getMonthDifference(
        targetDate,
        submitDate
      );
  
      // IMPORTANT:
      // Same calendar month = ON TIME
      if (months <= 0) {
        return 'ontime';
      }
  
      if (months === 1) {
        return 'buffer1';
      }
  
      if (months === 2) {
        return 'buffer2';
      }
  
      if (months === 3) {
        return 'buffer3';
      }
  
      if (months > 3) {
        return 'over3';
      }
  
      return null;
    }
  
    // =====================================================
    // NOT SUBMITTED
    // =====================================================
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const cleanTargetDate = new Date(targetDate);
    cleanTargetDate.setHours(0, 0, 0, 0);
  
    // FUTURE TARGET DATE
    if (cleanTargetDate > today) {
      return 'upcoming';
    }
  
    // TARGET DATE PASSED
    const months = getMonthDifference(
      cleanTargetDate,
      today
    );
  
    if (months <= 3) {
      return 'under3';
    }
  
    return 'over3';
  };

  // Helper: check if company status is "submitted"
  const isCompanySubmitted = (item: ESGCapItem): boolean => {
    return normalize(item.companyStatus ?? item.status) === 'submitted';
  };

  // Counts for the two new columns (using existing getCSCount for 'over3')
  const getCompletedOver3Count = (priority: 'High' | 'Medium' | 'Low') => {
    return csItems.filter(item => {
      if ((item.priority || 'Medium') !== priority) return false;
      if (getCSCategory(item) !== 'over3') return false;
      return isCompanySubmitted(item);
    }).length;
  };

  const getNotCompletedOver3Count = (priority: 'High' | 'Medium' | 'Low') => {
    return csItems.filter(item => {
      if ((item.priority || 'Medium') !== priority) return false;
      if (getCSCategory(item) !== 'over3') return false;
      return !isCompanySubmitted(item);
    }).length;
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
      | 'upcoming'
  ) => {
    return csItems.filter(item => {
      if ((item.priority || 'Medium') !== priority) {
        return false;
      }
  
      return getCSCategory(item) === type;
    }).length;
  };

  // const debugCSItems = csItems.map(item => {
  //   const targetDate = item.targetDate
  //     ? new Date(item.targetDate)
  //     : null;
  
  //   const uploadedDates = (item.completionIndicators || [])
  //     .map(indicator => indicator.uploadedAt)
  //     .filter(Boolean)
  //     .map(date => new Date(date as string))
  //     .filter(date => !isNaN(date.getTime()));
  
  //   const updatedDate =
  //     uploadedDates.length > 0
  //       ? new Date(
  //           Math.max(
  //             ...uploadedDates.map(date => date.getTime())
  //           )
  //         )
  //       : null;
  
  //   const submitDate = getSubmitDate(item);
  
  //   const today = new Date();
  
  //   today.setHours(0, 0, 0, 0);
  
  //   const monthsFromToday =
  //     targetDate && !isNaN(targetDate.getTime())
  //       ? getMonthDifference(today, targetDate)
  //       : null;
  
  //   const monthsFromTarget =
  //     targetDate &&
  //     !isNaN(targetDate.getTime()) &&
  //     submitDate
  //       ? getMonthDifference(targetDate, submitDate)
  //       : null;
  
  //   return {
  //     item: item.item,
  //     priority: item.priority,
  
  //     // Dates
  //     today: today.toISOString().split('T')[0],
  //     targetDate:
  //       targetDate && !isNaN(targetDate.getTime())
  //         ? targetDate.toISOString().split('T')[0]
  //         : null,
  
  //     latestUploadedAt:
  //       updatedDate?.toISOString() || null,
  
  //     submitDate:
  //       submitDate?.toISOString() || null,
  
  //     // Status
  //     companyStatus: normalize(item.companyStatus),
  
  //     // Calculations
  //     monthsFromToday,
  //     monthsFromTarget,
  
  //     // Final result
  //     category: getCSCategory(item),
  //   };
  // });
  
  // console.table(debugCSItems);

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

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-slate-100">

                {/* =========================================================
                    HEADER
                ========================================================= */}
                <div className="grid grid-cols-[0.8fr_1.5fr_1.7fr_1.2fr_0.9fr_0.9fr_0.8fr] items-center bg-emerald-50/70 px-3 py-2.5">

                  {/* Priority */}
                  <div className="text-[10px] font-semibold uppercase tracking-wide">
                    Priority
                  </div>

                  {/* Completed in Time */}
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide">
                    Completed in Time
                  </div>

                  {/* Completed in Buffer Time */}
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide">
                    Completed in Buffer Time
                  </div>

                  {/* Not Completed / Completed After Buffer Time */}
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide">
                    Completed After Buffer Time
                  </div>
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide">
                    Overdue
                  </div>

                  {/* Upcoming */}
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide">
                    Upcoming
                  </div>

                  {/* Total */}
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide">
                    Total
                  </div>

                </div>


                {/* =========================================================
                    HIGH
                ========================================================= */}
                <div className="grid grid-cols-[0.8fr_1.5fr_1.7fr_1.2fr_0.9fr_0.9fr_0.8fr] items-center border-t border-slate-100 px-3 py-2.5">

                  {/* Priority */}
                  <div className="text-xs font-bold text-red-600">
                    High
                  </div>

                  {/* Completed in Time */}
                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "ontime")}
                  </div>

                  {/* Completed in Buffer Time */}
                  <div className="text-center text-xs font-semibold">
                    {getCSCount("High", "buffer1") +
                      getCSCount("High", "buffer2") +
                      getCSCount("High", "buffer3")}
                  </div>

                  {/* Not Completed / Completed After Buffer Time */}
                  <div className="text-center text-xs font-bold">
                    {getCompletedOver3Count("High")}
                  </div>
                  <div className="text-center text-xs font-bold text-red-600">
                    {getNotCompletedOver3Count("High")}
                  </div>

                  {/* Upcoming */}
                  <div className="text-center text-xs font-bold text-gray-600">
                    {getCSCount("High", "upcoming")}
                  </div>

                  {/* Total */}
                  <div className="text-center text-xs font-bold">
                    {getCSCount("High", "ontime") +
                      getCSCount("High", "buffer1") +
                      getCSCount("High", "buffer2") +
                      getCSCount("High", "buffer3") +
                      getCSCount("High", "under3") +
                      getNotCompletedOver3Count("High") +
                      getCompletedOver3Count("High") +
                      getCSCount("High", "upcoming")}
                  </div>

                </div>


                {/* =========================================================
                    MEDIUM
                ========================================================= */}
                <div className="grid grid-cols-[0.8fr_1.5fr_1.7fr_1.2fr_0.9fr_0.9fr_0.8fr] items-center border-t border-slate-100 px-3 py-2.5">

                  {/* Priority */}
                  <div className="text-xs font-bold text-amber-600">
                    Medium
                  </div>

                  {/* Completed in Time */}
                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "ontime")}
                  </div>

                  {/* Completed in Buffer Time */}
                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Medium", "buffer1") +
                      getCSCount("Medium", "buffer2") +
                      getCSCount("Medium", "buffer3")}
                  </div>

                  {/* Not Completed / Completed After Buffer Time */}
                  <div className="text-center text-xs font-bold">
                    {getCompletedOver3Count("Medium")}
                  </div>
                  <div className="text-center text-xs font-bold text-red-600">
                    {getNotCompletedOver3Count("Medium")}
                  </div>

                  {/* Upcoming */}
                  <div className="text-center text-xs font-bold text-gray-600">
                    {getCSCount("Medium", "upcoming")}
                  </div>

                  {/* Total */}
                  <div className="text-center text-xs font-bold">
                    {getCSCount("Medium", "ontime") +
                      getCSCount("Medium", "buffer1") +
                      getCSCount("Medium", "buffer2") +
                      getCSCount("Medium", "buffer3") +
                      getCSCount("Medium", "under3") +
                      getNotCompletedOver3Count("Medium") +
                      getCompletedOver3Count("Medium") +
                      getCSCount("Medium", "upcoming")}
                  </div>
                </div>


                {/* =========================================================
                    LOW
                ========================================================= */}
                <div className="grid grid-cols-[0.8fr_1.5fr_1.7fr_1.2fr_0.9fr_0.9fr_0.8fr] items-center border-t border-slate-100 px-3 py-2.5">

                  {/* Priority */}
                  <div className="text-xs font-bold text-slate-500">
                    Low
                  </div>

                  {/* Completed in Time */}
                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "ontime")}
                  </div>

                  {/* Completed in Buffer Time */}
                  <div className="text-center text-xs font-semibold">
                    {getCSCount("Low", "buffer1") +
                      getCSCount("Low", "buffer2") +
                      getCSCount("Low", "buffer3")}
                  </div>

                  {/* Not Completed / Completed After Buffer Time */}
                  <div className="text-center text-xs font-bold">
                    {getCompletedOver3Count("Low")}
                  </div>
                  <div className="text-center text-xs font-bold text-red-600">
                    {getNotCompletedOver3Count("Low")}
                  </div>

                  {/* Upcoming */}
                  <div className="text-center text-xs font-bold text-gray-600">
                    {getCSCount("Low", "upcoming")}
                  </div>

                  {/* Total */}
                  <div className="text-center text-xs font-bold">
                    {getCSCount("Low", "ontime") +
                      getCSCount("Low", "buffer1") +
                      getCSCount("Low", "buffer2") +
                      getCSCount("Low", "buffer3") +
                      getCSCount("Low", "under3") +
                      getNotCompletedOver3Count("Low") +
                      getCompletedOver3Count("Low") +
                      getCSCount("Low", "upcoming")}
                  </div>

                </div>


                {/* =========================================================
                    TOTAL
                ========================================================= */}
                <div className="grid grid-cols-[0.8fr_1.5fr_1.7fr_1.2fr_0.9fr_0.9fr_0.8fr] items-center border-t border-emerald-200 bg-emerald-50 px-3 py-2.5">

                  {/* Priority */}
                  <div className="text-xs font-bold text-emerald-700">
                    Total
                  </div>

                  {/* Completed in Time */}
                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "ontime") +
                      getCSCount("Medium", "ontime") +
                      getCSCount("Low", "ontime")}
                  </div>

                  {/* Completed in Buffer Time */}
                  <div className="text-center text-xs font-bold text-emerald-700">
                    {getCSCount("High", "buffer1") +
                      getCSCount("High", "buffer2") +
                      getCSCount("High", "buffer3") +
                      getCSCount("Medium", "buffer1") +
                      getCSCount("Medium", "buffer2") +
                      getCSCount("Medium", "buffer3") +
                      getCSCount("Low", "buffer1") +
                      getCSCount("Low", "buffer2") +
                      getCSCount("Low", "buffer3")}
                  </div>

                  
                  {/* Completed After Buffer total */}
                  <div className="text-center text-xs font-bold">
                    {getCompletedOver3Count("High") +
                    getCompletedOver3Count("Medium") +
                    getCompletedOver3Count("Low")}
                  </div>
                  {/* Not Completed total */}
                  <div className="text-center text-xs font-bold text-red-600">
                    {getNotCompletedOver3Count("High") +
                    getNotCompletedOver3Count("Medium") +
                    getNotCompletedOver3Count("Low")}
                  </div>

                   {/* Upcoming */}
                   <div className="text-center text-xs font-bold text-gray-600">
                    {getCSCount("High", "upcoming") +
                      getCSCount("Medium", "upcoming") +
                      getCSCount("Low", "upcoming")}
                  </div>

                  {/* Total */}
                  <div className="flex justify-center">
                    <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                      {getCSCount("High", "ontime") +
                        getCSCount("High", "buffer1") +
                        getCSCount("High", "buffer2") +
                        getCSCount("High", "buffer3") +
                        getCSCount("High", "under3") +
                        getCSCount("High", "over3") +
                        getCSCount("High", "upcoming") +
                        getCSCount("Medium", "ontime") +
                        getCSCount("Medium", "buffer1") +
                        getCSCount("Medium", "buffer2") +
                        getCSCount("Medium", "buffer3") +
                        getCSCount("Medium", "under3") +
                        getCSCount("Medium", "over3") +
                        getCSCount("Medium", "upcoming") +
                        getCSCount("Low", "ontime") +
                        getCSCount("Low", "buffer1") +
                        getCSCount("Low", "buffer2") +
                        getCSCount("Low", "buffer3") +
                        getCSCount("Low", "under3") +
                        getCSCount("Low", "over3") +
                        getCSCount("Low", "upcoming")}
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