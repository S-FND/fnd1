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

  // If target date has passed and status is not completed and no actual date, mark as delayed
  if (targetDate < today && item.status !== 'completed' && !item.actualDate) {
    return 'delayed';
  }

  return item.status;
};

interface ESGCapTableRowProps {
  item: ESGCapItem;
  index: number;
  onUpdate?: (updatedItem: ESGCapItem) => void;
  buttonEnabled?: boolean;
}

const truncateText = (text: string, length = 50) =>
  text.length > length ? text.slice(0, length) + '...' : text;



export const ESGCapTableRow: React.FC<ESGCapTableRowProps> = ({ item, index, onUpdate,buttonEnabled }) => {
  const effectiveStatus = getEffectiveStatus(item);

  const [showFullItem, setShowFullItem] = useState(false);
  const [showFullMeasures, setShowFullMeasures] = useState(false);
  const [showFullDeliverable, setShowFullDeliverable] = useState(false);
  const [showFullResource, setShowFullResource] = useState(false);
  
  return (
    <TableRow>
      <TableCell className="text-center font-medium">{index + 1}</TableCell>
      <TableCell className="font-medium" style={{ padding: "0.3rem" }}>
        {showFullItem ? item.item : truncateText(item.item)}
        {item.item.length > 50 && (
          <button
            onClick={() => setShowFullItem(!showFullItem)}
            className="ml-2 text-blue-600 underline text-xs"
          >
            {showFullItem ? "View less" : "View full"}
          </button>
        )}
      </TableCell>
      <TableCell style={{ padding: "0.3rem" }}>
        <CategoryBadge category={item.category} />
      </TableCell>
      <TableCell style={{ padding: "0.3rem" }}>
        <PriorityBadge priority={item.priority} />
      </TableCell>
      <TableCell style={{ padding: "0.3rem" }}> {showFullMeasures ? item.measures : truncateText(item.measures || "")}
        {item.measures && item.measures.length > 50 && (
          <button
            onClick={() => setShowFullMeasures(!showFullMeasures)}
            className="ml-2 text-blue-600 underline text-xs"
          >
            {showFullMeasures ? "View less" : "View full"}
          </button>
        )}</TableCell> {/* Changed from description to measures */}

      <TableCell style={{ padding: "0.3rem" }}>{showFullResource ? item.resource : truncateText(item.resource || "")}
        {item.resource && item.resource.length > 50 && (
          <button
            onClick={() => setShowFullResource(!showFullResource)}
            className="ml-2 text-blue-600 underline text-xs"
          >
            {showFullResource ? "View less" : "View full"}
          </button>
        )}</TableCell>
      <TableCell style={{ padding: "0.3rem" }}>{showFullDeliverable
        ? item.deliverable
        : truncateText(item.deliverable || "")}
        {item.deliverable && item.deliverable.length > 50 && (
          <button
            onClick={() => setShowFullDeliverable(!showFullDeliverable)}
            className="ml-2 text-blue-600 underline text-xs"
          >
            {showFullDeliverable ? "View less" : "View full"}
          </button>
        )}</TableCell>
      <TableCell style={{ padding: "0.3rem" }}>{new Date(item.targetDate).toLocaleDateString()}</TableCell> {/* Changed from deadline to targetDate */}
      <TableCell style={{ padding: "0.3rem" }}>
        {item.CS !== 'none' && (
          <Badge variant="outline" className="font-bold">
            {item.CS}
          </Badge>
        )}
      </TableCell>
      <TableCell style={{ padding: "0.3rem" }}>
        {item.actualDate ? new Date(item.actualDate).toLocaleDateString() : '-'} {/* Changed from actualCompletionDate to actualDate */}
      </TableCell>
      <TableCell style={{ padding: "0.3rem" }}>
        <StatusBadge status={effectiveStatus} />
      </TableCell>
      <TableCell className="text-right" style={{ padding: "0.3rem" }}>
        <ESGCapRowActions item={item} onUpdate={onUpdate || (() => { })} buttonEnabled={buttonEnabled}/>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {effectiveStatus === 'completed' ? 'Completed on time' :
          effectiveStatus === 'in_progress' ? 'Implementation ongoing' :
            effectiveStatus === 'delayed' ? 'Action overdue' :
              effectiveStatus === 'accepted' ? 'CAP accepted' :
                effectiveStatus === 'in_review' ? 'Under review' : 'Awaiting action'}
      </TableCell>
    </TableRow>
  );
};