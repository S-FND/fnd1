
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { ESGCapTableHeader } from './ESGCapTableHeader';
import { ESGCapTableRow } from './ESGCapTableRow';
import { ESGCapEmptyState } from './ESGCapEmptyState';

interface ESGCapTableProps {
  sortedItems: ESGCapItem[];
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
}

export const ESGCapTable: React.FC<ESGCapTableProps> = ({ 
  sortedItems, 
  sortConfig, 
  requestSort 
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
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
            />
          ))}
          
          {sortedItems.length === 0 && <ESGCapEmptyState />}
        </TableBody>
      </Table>
    </div>
  );
};
