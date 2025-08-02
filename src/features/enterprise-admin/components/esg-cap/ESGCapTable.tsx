
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { ESGCapTableHeader } from './ESGCapTableHeader';
import { ESGCapTableRow } from './ESGCapTableRow';
import { ESGCapEmptyState } from './ESGCapEmptyState';
import { ESGCapScoring } from './ESGCapScoring';

interface ESGCapTableProps {
  sortedItems: ESGCapItem[];
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
  onItemUpdate?: (updatedItem: ESGCapItem) => void;
}

export const ESGCapTable: React.FC<ESGCapTableProps> = ({ 
  sortedItems, 
  sortConfig, 
  requestSort,
  onItemUpdate 
}) => {
  return (
    <div className="space-y-6">
      <div className="border rounded-md overflow-auto">
        <div className="min-w-[1200px]">
          <Table>
            <ESGCapTableHeader 
              sortConfig={sortConfig} 
              requestSort={requestSort} 
            />
            <TableBody>
              {sortedItems.map((item, index) => (
                <ESGCapTableRow 
                  key={item.id} 
                  item={item} 
                  index={index}
                  onUpdate={onItemUpdate}
                />
              ))}
              
              {sortedItems.length === 0 && <ESGCapEmptyState />}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {sortedItems.length > 0 && <ESGCapScoring items={sortedItems} />}
    </div>
  );
};
