import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Scope3Entry } from '@/types/scope3-ghg';

interface Scope3DataTableProps {
  entries: Scope3Entry[];
  onEdit: (entry: Scope3Entry) => void;
  onDelete: (id: string) => void;
}

export const Scope3DataTable: React.FC<Scope3DataTableProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No entries added yet. Click "Add New" to create an entry.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead>Business Unit</TableHead>
            <TableHead>Source Type</TableHead>
            <TableHead>Activity Data</TableHead>
            <TableHead>Emission Factor</TableHead>
            <TableHead>Total Emission (tCO₂e)</TableHead>
            <TableHead>Data Source</TableHead>
            <TableHead>Entered By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.facilityName}</TableCell>
              <TableCell>{entry.businessUnit}</TableCell>
              <TableCell>{entry.sourceType}</TableCell>
              <TableCell>{entry.activityDataValue.toLocaleString()} {entry.activityDataUnit}</TableCell>
              <TableCell>{entry.emissionFactor} kg CO₂e/unit</TableCell>
              <TableCell className="font-semibold">{entry.totalEmission.toFixed(2)}</TableCell>
              <TableCell>{entry.dataSource}</TableCell>
              <TableCell>{entry.enteredBy}</TableCell>
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
    </div>
  );
};

export default Scope3DataTable;