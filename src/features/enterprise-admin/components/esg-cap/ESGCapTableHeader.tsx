import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ESGCapTableHeaderProps {
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
}

export const ESGCapTableHeader: React.FC<any> = ({ 
  sortConfig, 
  requestSort 
}) => {
  return (
    <TableHeader>
      <TableRow className="bg-[#f1f5f9]">
        {/* S. No */}
        <TableHead className="w-[60px] text-center !text-black">S. No</TableHead>

        {/* 1. Item */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[200px]"
          onClick={() => requestSort('item')}
        >
          Item
          {sortConfig?.key === 'item' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 2. Category */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('category')}
        >
          Category
          {sortConfig?.key === 'category' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 3. Priority */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('priority')}
        >
          Priority
          {sortConfig?.key === 'priority' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 4. Issue */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('issue')}
        >
          Issue
          {sortConfig?.key === 'issue' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 5. Related Finding */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('relatedFinding')}
        >
          Related Finding
          {sortConfig?.key === 'relatedFinding' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 6. ESG Lever */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('esgLever')}
        >
          ESG Lever
          {sortConfig?.key === 'esgLever' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 7. Measures & Corrective Actions */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[200px]"
          onClick={() => requestSort('measures')}
        >
          Measures & Corrective Actions
          {sortConfig?.key === 'measures' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 8. Resource & Responsibility */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('resource')}
        >
          Resource & Responsibility
          {sortConfig?.key === 'resource' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 9. Expected Deliverable */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('deliverable')}
        >
          Expected Deliverable
          {sortConfig?.key === 'deliverable' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 10. Timeline Month */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black text-center"
          onClick={() => requestSort('timelineMonth')}
        >
          Timeline Month
          {sortConfig?.key === 'timelineMonth' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 11. Target Date */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('targetDate')}
        >
          Target Date
          {sortConfig?.key === 'targetDate' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 12. Actual Date */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('actualDate')}
        >
          Actual Date
          {sortConfig?.key === 'actualDate' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 13. CP/CS */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('CS')}
        >
          CP/CS
          {sortConfig?.key === 'CS' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 14. Status */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('status')}
        >
          Status
          {sortConfig?.key === 'status' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 15. Current Status Update */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('statusUpdate')}
        >
          Current Status Update
          {sortConfig?.key === 'statusUpdate' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 16. Review Remarks */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('reviewRemarks')}
        >
          Review Remarks
          {sortConfig?.key === 'reviewRemarks' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 17. Last Review Date */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('lastReviewDate')}
        >
          Last Review Date
          {sortConfig?.key === 'lastReviewDate' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 18. Implementation Support Needed */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]"
          onClick={() => requestSort('implementationSupportNeeded')}
        >
          Implementation Support Needed
          {sortConfig?.key === 'implementationSupportNeeded' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 19. Closure Verified By */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('closureVerifiedBy')}
        >
          Closure Verified By
          {sortConfig?.key === 'closureVerifiedBy' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* 20. Assigned To */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('assignedTo')}
        >
          Assigned To
          {sortConfig?.key === 'assignedTo' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        {/* Actions */}
        <TableHead className="text-right !text-black">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};