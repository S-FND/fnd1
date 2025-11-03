import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Scope4Entry } from '@/types/scope4-ghg';

interface Scope4DataTableProps {
  entries: Scope4Entry[];
  onEdit: (entry: Scope4Entry) => void;
  onDelete: (id: string) => void;
}

const Scope4DataTable: React.FC<Scope4DataTableProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead>Business Unit</TableHead>
            <TableHead>Source Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Product Output</TableHead>
            <TableHead>Total Avoided (tCO₂e)</TableHead>
            <TableHead>Verification Status</TableHead>
            <TableHead>Entered By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No entries yet
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.facilityName}</TableCell>
                <TableCell>{entry.businessUnit}</TableCell>
                <TableCell>{entry.sourceType}</TableCell>
                <TableCell className="max-w-xs truncate">{entry.emissionDescription}</TableCell>
                <TableCell>{entry.productOutput.toLocaleString()} {entry.activityDataUnit}</TableCell>
                <TableCell className="font-semibold">{entry.totalAvoidedEmission.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    entry.verificationStatus === 'Verified' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : entry.verificationStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {entry.verificationStatus}
                  </span>
                </TableCell>
                <TableCell>{entry.enteredBy}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Scope4DataTable;
