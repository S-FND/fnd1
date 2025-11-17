import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Scope1Entry } from '@/types/scope1-ghg';
import { Badge } from "@/components/ui/badge";

interface Scope1DataTableProps {
  entries: Scope1Entry[];
  onEdit: (entry: Scope1Entry) => void;
  onDelete: (id: string) => void;
}

export const Scope1DataTable: React.FC<Scope1DataTableProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No entries yet. Click "Add New Entry" to begin.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Facility</TableHead>
            <TableHead className="w-[130px]">Business Unit</TableHead>
            <TableHead className="w-[100px]">Source Type</TableHead>
            <TableHead className="w-[180px]">Emission Source</TableHead>
            <TableHead className="w-[120px]">Fuel Type</TableHead>
            <TableHead className="w-[100px] text-right">Activity</TableHead>
            <TableHead className="w-[80px]">Unit</TableHead>
            <TableHead className="w-[100px] text-right">Emission Factor</TableHead>
            <TableHead className="w-[100px] text-right">Total (tCO₂e)</TableHead>
            <TableHead className="w-[120px]">Data Quality</TableHead>
            <TableHead className="w-[120px]">Entered By</TableHead>
            <TableHead className="w-[120px]">Verified By</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.facilityName}</TableCell>
              <TableCell>{entry.businessUnit}</TableCell>
              <TableCell>
                <Badge variant="outline">{entry.sourceType}</Badge>
              </TableCell>
              <TableCell className="text-sm">{entry.emissionSourceDescription}</TableCell>
              <TableCell>{entry.fuelSubstanceType}</TableCell>
              <TableCell className="text-right">{entry.activityDataValue.toLocaleString()}</TableCell>
              <TableCell>{entry.activityDataUnit}</TableCell>
              <TableCell className="text-right">{entry.emissionFactor}</TableCell>
              <TableCell className="text-right font-semibold">{entry.totalEmission.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={entry.dataQuality === 'High' ? 'default' : entry.dataQuality === 'Medium' ? 'secondary' : 'outline'}>
                  {entry.dataQuality}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{entry.enteredBy}</TableCell>
              <TableCell className="text-sm">{entry.verifiedBy || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)}>
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

export default Scope1DataTable;