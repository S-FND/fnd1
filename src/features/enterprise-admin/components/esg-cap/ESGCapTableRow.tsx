import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { ESGCapRowActions } from './ESGCapRowActions';

// ✅ Updated helper — returns proper status values
const getEffectiveStatus = (item: ESGCapItem): ESGCapItem['status'] => {
  if (!item.targetDate) return item.status;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(item.targetDate);
  targetDate.setHours(0, 0, 0, 0);

  // If past due and not closed by investor → overdue
  if (targetDate < today && item.investorStatus !== 'Closed' && !item.actualDate) {
    return 'overdue';
  }
  
  // If due within 1 month and not closed → due in <1 month
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  oneMonthLater.setHours(0, 0, 0, 0);
  
  if (targetDate >= today && targetDate <= oneMonthLater && item.investorStatus !== 'Closed' && !item.actualDate) {
    return 'due in <1 month';
  }

  return item.status;
};

interface ESGCapTableRowProps {
  item: any;
  index: number;
  onUpdate?: (updatedItem: ESGCapItem) => void;
  buttonEnabled?: boolean;
  setReloadData?: (reload: boolean) => void;
  compact?: boolean;
  finalPlan?: boolean;
}

const truncateText = (text: string, length = 50) =>
  text && text.length > length ? text.slice(0, length) + '...' : text || '-';



export const ESGCapTableRow: React.FC<ESGCapTableRowProps> = ({ item, index, onUpdate, buttonEnabled, setReloadData, compact = false, finalPlan }) => {
  const effectiveStatus = getEffectiveStatus(item);
  const [showFullItem, setShowFullItem] = useState(false);
  const [showFullIssue, setShowFullIssue] = useState(false);
  const [showFullRelatedFinding, setShowFullRelatedFinding] = useState(false);
  // const [showFullEsgLever, setShowFullEsgLever] = useState(false);
  const [showFullMeasures, setShowFullMeasures] = useState(false);
  const [showFullResource, setShowFullResource] = useState(false);
  const [showFullDeliverable, setShowFullDeliverable] = useState(false);
  const [showFullStatusUpdate, setShowFullStatusUpdate] = useState(false);
  const [showFullInvestorStatusUpdate, setShowFullInvestorStatusUpdate] = useState(false);
  const [showFullReviewRemarks, setShowFullReviewRemarks] = useState(false);
  const [showFullImplementationSupport, setShowFullImplementationSupport] = useState(false);
  const [showFullClosureVerified, setShowFullClosureVerified] = useState(false);
  const [showFullRemarks, setShowFullRemarks] = useState(false);

  // Helper function
  const isOverdue = (item: ESGCapItem) => {
    if (!item.targetDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(item.targetDate);
    targetDate.setHours(0, 0, 0, 0);

    return (
      targetDate < today &&
      item.investorStatus !== "Closed" &&  // ✅ Capital C
      !item.actualDate
    );
  };

  const rowClassName = `
  transition-colors
  ${item.investorStatus === "Closed"
      ? "bg-gray-300 text-gray-500"
      : isOverdue(item)
        ? "text-red-700"
        : ""
    }
`;

const parseDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr === '—' || dateStr === '-') return '-';
  
  // Already ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          });
      }
  }
  
  // DD-MMM-YY format (e.g., "30-Dec-23")
  const months: Record<string, string> = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
      'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  const match = dateStr.match(/^(\d{1,2})-([a-zA-Z]{3})-(\d{2,4})$/);
  if (match) {
      const day = match[1].padStart(2, '0');
      const month = months[match[2].toLowerCase()] || '01';
      const year = match[3].length === 2 
          ? (parseInt(match[3]) > 50 ? `19${match[3]}` : `20${match[3]}`) 
          : match[3];
      const isoDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(isoDate.getTime())) {
          return isoDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          });
      }
  }
  
  return '-';
};

// Add this helper function inside the component or outside
const getInvestorStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: "outline" | "default" | "secondary" | "destructive"; className?: string }> = {
    "under review": { label: "Under Review", variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    "reviewed with comments": { label: "Reviewed with Comments", variant: "outline", className: "bg-blue-100 text-blue-800 border-blue-300" },
    "closed": { label: "Closed", variant: "default", className: "bg-green-600 text-white" },
    "deferred": { label: "Deferred", variant: "secondary", className: "bg-gray-200 text-gray-700 border-gray-300" }
  };
  const config = statusMap[status?.toLowerCase()] || { label: status || '-', variant: "outline", className: "bg-gray-100 text-gray-600" };
  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
};


  if (compact) {
    return (
      <TableRow className={rowClassName}>
        <TableCell className="text-center font-medium" style={{ padding: "0.3rem" }}>{index + 1}</TableCell>

        {/* Item column with expand/collapse */}
        <TableCell className="font-medium text-left" style={{ padding: "0.3rem" }}>
          {showFullItem ? item.item : truncateText(item.item, 50)}
          {item.item && item.item.length > 50 && (
            <button onClick={() => setShowFullItem(!showFullItem)} className="ml-2 text-blue-600 underline text-xs">
              {showFullItem ? "View less" : "View full"}
            </button>
          )}
        </TableCell>

        <TableCell style={{ padding: "0.3rem" }}>
          <PriorityBadge priority={item.priority} />
        </TableCell>

        <TableCell style={{ padding: "0.3rem" }}>
          {parseDisplayDate(item.targetDate)}
        </TableCell>
        {/* Issue column with expand/collapse */}
        {/* <TableCell className="font-medium" style={{ padding: "0.3rem" }}>
          {showFullIssue ? item.issue : truncateText(item.issue, 50)}
          {item.issue && item.issue.length > 50 && (
            <button onClick={() => setShowFullIssue(!showFullIssue)} className="ml-2 text-blue-600 underline text-xs">
              {showFullIssue ? "View less" : "View full"}
            </button>
          )}
        </TableCell> */}

        {/* Measures column with expand/collapse
        <TableCell>
          {showFullMeasures ? item.measures : truncateText(item.measures, 50)}
          {item.measures && item.measures.length > 50 && (
            <button onClick={() => setShowFullMeasures(!showFullMeasures)} className="ml-2 text-blue-600 underline text-xs">
              {showFullMeasures ? "View less" : "View full"}
            </button>
          )}
        </TableCell> */}

        {/* Measures column with expand/collapse */}
        {/* <TableCell className="font-medium" style={{ padding: "0.3rem" }}>
          {showFullDeliverable ? item.deliverable : truncateText(item.deliverable, 50)}
          {item.deliverable && item.deliverable.length > 50 && (
            <button onClick={() => setShowFullDeliverable(!showFullMeasures)} className="ml-2 text-blue-600 underline text-xs">
              {showFullMeasures ? "View less" : "View full"}
            </button>
          )}
        </TableCell> */}

        {/*  Status */}
        <TableCell>
            {item.status ? <StatusBadge status={item.status} /> : '—'}
        </TableCell>
        {/* Investor  Status */}
        <TableCell style={{ padding: "0.3rem" }}>
          {item.investorStatus ? getInvestorStatusBadge(item.investorStatus) : '-'}
        </TableCell>

        <TableCell style={{ padding: "0.3rem" }}>{item.actualDate ? new Date(item.actualDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
          : '-'}</TableCell>

        {/* Progress Percentage */}
        {/* <TableCell className="font-medium" style={{ padding: "0.3rem" }}>{item.progressPercentage ? `${item.progressPercentage}%` : '-'}</TableCell> */}

        {/* Actions */}
        <TableCell className="text-right" style={{ padding: "0.3rem" }}>
          <ESGCapRowActions item={item} onUpdate={onUpdate || (() => { })} buttonEnabled={buttonEnabled} finalPlan={finalPlan} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="text-center font-medium">{index + 1}</TableCell>

      {/* 1. Item */}
      <TableCell className="font-medium" style={{ padding: "0.3rem" }}>
        {showFullItem ? item.item : truncateText(item.item, 50)}
        {item.item && item.item.length > 50 && (
          <button onClick={() => setShowFullItem(!showFullItem)} className="ml-2 text-blue-600 underline text-xs">
            {showFullItem ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 2. Category */}
      <TableCell style={{ padding: "0.3rem" }}>
        <CategoryBadge category={item.category} />
      </TableCell>

      {/* 3. Priority */}
      <TableCell style={{ padding: "0.3rem" }}>
        <PriorityBadge priority={item.priority} />
      </TableCell>

      {/* 4. Issue */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullIssue ? item.issue : truncateText(item.issue, 50)}
        {item.issue && item.issue.length > 50 && (
          <button onClick={() => setShowFullIssue(!showFullIssue)} className="ml-2 text-blue-600 underline text-xs">
            {showFullIssue ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 5. Related Finding */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullRelatedFinding ? item.relatedFinding : truncateText(item.relatedFinding, 50)}
        {item.relatedFinding && item.relatedFinding.length > 50 && (
          <button onClick={() => setShowFullRelatedFinding(!showFullRelatedFinding)} className="ml-2 text-blue-600 underline text-xs">
            {showFullRelatedFinding ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 6. ESG Lever */}
      {/* <TableCell style={{ padding: "0.3rem" }}>
        {showFullEsgLever ? item.esgLever : truncateText(item.esgLever, 50)}
        {item.esgLever && item.esgLever.length > 50 && (
          <button onClick={() => setShowFullEsgLever(!showFullEsgLever)} className="ml-2 text-blue-600 underline text-xs">
            {showFullEsgLever ? "View less" : "View full"}
          </button>
        )}
      </TableCell> */}

      {/* 7. Measures */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullMeasures ? item.measures : truncateText(item.measures, 50)}
        {item.measures && item.measures.length > 50 && (
          <button onClick={() => setShowFullMeasures(!showFullMeasures)} className="ml-2 text-blue-600 underline text-xs">
            {showFullMeasures ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 8. Resource */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullResource ? item.resource : truncateText(item.resource, 50)}
        {item.resource && item.resource.length > 50 && (
          <button onClick={() => setShowFullResource(!showFullResource)} className="ml-2 text-blue-600 underline text-xs">
            {showFullResource ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 9. Deliverable */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullDeliverable ? item.deliverable : truncateText(item.deliverable, 50)}
        {item.deliverable && item.deliverable.length > 50 && (
          <button onClick={() => setShowFullDeliverable(!showFullDeliverable)} className="ml-2 text-blue-600 underline text-xs">
            {showFullDeliverable ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 10. Timeline Month */}
      <TableCell style={{ padding: "0.3rem" }}>{item.timelineMonth || '-'}</TableCell>

      {/* 11. Target Date */}
      <TableCell style={{ padding: "0.3rem" }}>{item.targetDate ? new Date(item.actualDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
        : '-'}</TableCell>

      {/* 11.1 Progress Percentage */}
      <TableCell style={{ padding: "0.3rem" }}>{item.progressPercentage ? `${item.progressPercentage}%` : '-'}</TableCell>

      {/* 12. Actual Date */}
      <TableCell style={{ padding: "0.3rem" }}>{item.actualDate ? new Date(item.actualDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
        : '-'}</TableCell>

      {/* 13. CP/CS */}
      <TableCell style={{ padding: "0.3rem" }}>
        {item.CS && item.CS !== 'none' && (
          <Badge variant="outline" className="font-bold">
            {item.CS}
          </Badge>
        )}
      </TableCell>

      {/* 14. Status */}
      <TableCell style={{ padding: "0.3rem" }}>
        <StatusBadge status={effectiveStatus} />
      </TableCell>

      {/* 15. Current Status Update */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullStatusUpdate ? item.statusUpdate : truncateText(item.statusUpdate, 50)}
        {item.statusUpdate && item.statusUpdate.length > 50 && (
          <button onClick={() => setShowFullStatusUpdate(!showFullStatusUpdate)} className="ml-2 text-blue-600 underline text-xs">
            {showFullStatusUpdate ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 15. Current Status Update */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullInvestorStatusUpdate ? item.investorStatusUpdate : truncateText(item.investorStatusUpdate, 50)}
        {item.investorStatusUpdate && item.investorStatusUpdate.length > 50 && (
          <button onClick={() => setShowFullInvestorStatusUpdate(!showFullStatusUpdate)} className="ml-2 text-blue-600 underline text-xs">
            {showFullInvestorStatusUpdate ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 16. Review Remarks */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullReviewRemarks ? item.reviewRemarks : truncateText(item.reviewRemarks, 50)}
        {item.reviewRemarks && item.reviewRemarks.length > 50 && (
          <button onClick={() => setShowFullReviewRemarks(!showFullReviewRemarks)} className="ml-2 text-blue-600 underline text-xs">
            {showFullReviewRemarks ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 17. Last Review Date */}
      <TableCell style={{ padding: "0.3rem" }}>{item.lastReviewDate ? new Date(item.actualDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
        : '-'}</TableCell>

      {/* 18. Implementation Support Needed */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullImplementationSupport ? item.implementationSupportNeeded : truncateText(item.implementationSupportNeeded, 50)}
        {item.implementationSupportNeeded && item.implementationSupportNeeded.length > 50 && (
          <button onClick={() => setShowFullImplementationSupport(!showFullImplementationSupport)} className="ml-2 text-blue-600 underline text-xs">
            {showFullImplementationSupport ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 19. Closure Verified By */}
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullClosureVerified ? item.closureVerifiedBy : truncateText(item.closureVerifiedBy, 50)}
        {item.closureVerifiedBy && item.closureVerifiedBy.length > 50 && (
          <button onClick={() => setShowFullClosureVerified(!showFullClosureVerified)} className="ml-2 text-blue-600 underline text-xs">
            {showFullClosureVerified ? "View less" : "View full"}
          </button>
        )}
      </TableCell>

      {/* 20. Assigned To */}
      <TableCell style={{ padding: "0.3rem" }}>{item.assignedTo || '-'}</TableCell>

      {/* 21. Remarks
      <TableCell style={{ padding: "0.3rem" }}>
        {showFullRemarks ? item.remarks : truncateText(item.remarks, 50)}
        {item.remarks && item.remarks.length > 50 && (
          <button onClick={() => setShowFullRemarks(!showFullRemarks)} className="ml-2 text-blue-600 underline text-xs">
            {showFullRemarks ? "View less" : "View full"}
          </button>
        )}
      </TableCell> */}

      {/* Actions */}
      <TableCell className="text-right" style={{ padding: "0.3rem" }}>
        <ESGCapRowActions item={item} onUpdate={onUpdate || (() => { })} buttonEnabled={buttonEnabled} setReloadData={setReloadData} finalPlan={finalPlan} />
      </TableCell>
    </TableRow>
  );
};