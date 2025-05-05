
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

export const ESGCapEmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={11} className="text-center py-6">
        No CAP items found matching the current filters.
      </TableCell>
    </TableRow>
  );
};
