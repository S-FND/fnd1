import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { ESGCapRowActions } from './ESGCapRowActions';

// Helper function to determine the effective status
const getEffectiveStatus = (item: ESGCapItem): ESGCapItem['status'] => {
  const today = new Date();
  const targetDate = new Date(item.targetDate);

  if (targetDate < today && item.status !== 'completed' && !item.actualDate) {
    return 'delayed';
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
      item.status !== "completed" &&
      !item.actualDate
    );
  };

  const rowClassName = `
  transition-colors
  ${effectiveStatus === "completed"
      ? "bg-gray-300 text-gray-500"
      : isOverdue(item)
        ? "text-red-700"
        : ""
    }
`;
  if (compact) {
    return (
      <TableRow className={rowClassName}>
        <TableCell className="text-center font-medium" style={{ padding: "0.3rem" }}>{index + 1}</TableCell>

        {/* Item column with expand/collapse */}
        <TableCell className="font-medium" style={{ padding: "0.3rem" }}>
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

        <TableCell style={{ padding: "0.3rem" }}>{item.targetDate ? new Date(item.actualDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
          : '-'}</TableCell>

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
        <TableCell style={{ padding: "0.3rem" }}>
          <StatusBadge status={effectiveStatus} />
        </TableCell>
        {/* Investor  Status */}
        <TableCell style={{ padding: "0.3rem" }}>
          <StatusBadge status={effectiveStatus} />
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