import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Scope2Entry } from '@/types/scope2-ghg';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Scope2DataTableProps {
  entries: Scope2Entry[];
  onEdit: (entry: Scope2Entry) => void;
  onDelete: (id: string) => void;
}

export const Scope2DataTable: React.FC<Scope2DataTableProps> = ({
  entries,
  onEdit,
  onDelete,
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No entries yet. Click "Add New Entry" to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Facility Name</TableHead>
            <TableHead>Business Unit</TableHead>
            <TableHead>Source Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Activity Data</TableHead>
            <TableHead className="text-right">Emission Factor</TableHead>
            <TableHead className="text-right">Total Emission (tCO₂e)</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.facilityName}</TableCell>
              <TableCell>{entry.businessUnit}</TableCell>
              <TableCell>{entry.sourceType}</TableCell>
              <TableCell>{entry.utilityProviderName}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  entry.scope2Category === 'Location-Based' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {entry.scope2Category}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {entry.activityDataValue.toLocaleString()} {entry.activityDataUnit}
              </TableCell>
              <TableCell className="text-right">{entry.emissionFactor}</TableCell>
              <TableCell className="text-right font-semibold">{entry.totalEmission.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  entry.dataQuality === 'High' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : entry.dataQuality === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {entry.dataQuality}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default Scope2DataTable;