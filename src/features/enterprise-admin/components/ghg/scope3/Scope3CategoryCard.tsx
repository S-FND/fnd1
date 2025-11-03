import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Scope3Entry, Scope3Category } from '@/types/scope3-ghg';
import Scope3DataTable from './Scope3DataTable';

interface Scope3CategoryCardProps {
  category: Scope3Category;
  entries: Scope3Entry[];
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (entry: Scope3Entry) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const Scope3CategoryCard: React.FC<Scope3CategoryCardProps> = ({
  category,
  entries,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const totalEmissions = entries.reduce((sum, entry) => sum + entry.totalEmission, 0);

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {category}
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • Total: {totalEmissions.toFixed(2)} tCO₂e
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddNew();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <Scope3DataTable
            entries={entries}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default Scope3CategoryCard;
