import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Scope1Entry, SourceType } from '@/types/scope1-ghg';
import Scope1DataTable from './Scope1DataTable';

interface Scope1CategoryCardProps {
  sourceType: SourceType;
  entries: Scope1Entry[];
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (entry: Scope1Entry) => void;
  onDelete: (id: string) => void;
  onAddNew: (sourceType: SourceType) => void;
}

const CATEGORY_INFO = {
  'Stationary': {
    title: 'Stationary Combustion',
    description: 'Emissions from fixed equipment like boilers, generators, and heaters',
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  },
  'Mobile': {
    title: 'Mobile Combustion',
    description: 'Emissions from company vehicles, fleet, and mobile equipment',
    color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  },
  'Fugitive': {
    title: 'Fugitive Emissions',
    description: 'Refrigerant leakage, fire suppression systems, and gas leakage',
    color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
  },
  'Process': {
    title: 'Process Emissions',
    description: 'Emissions from chemical reactions and industrial processes',
    color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
  },
};

export const Scope1CategoryCard: React.FC<Scope1CategoryCardProps> = ({
  sourceType,
  entries,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const info = CATEGORY_INFO[sourceType];
  const totalEmissions = entries.reduce((sum, entry) => sum + entry.totalEmission, 0);

  return (
    <Card className={`${info.color} transition-all`}>
      <CardHeader 
        className="cursor-pointer hover:bg-background/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 mt-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 mt-1 flex-shrink-0" />
            )}
            <div className="flex-1">
              <CardTitle>{info.title}</CardTitle>
              <CardDescription className="mt-1">{info.description}</CardDescription>
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-sm text-muted-foreground">{entries.length} entries</div>
            <div className="text-lg font-bold">{totalEmissions.toFixed(2)} tCO₂e</div>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onAddNew(sourceType);
              }}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {sourceType} Entry
            </Button>
          </div>
          
          {entries.length > 0 ? (
            <Scope1DataTable 
              entries={entries}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No {sourceType.toLowerCase()} entries yet. Click "Add {sourceType} Entry" to get started.
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default Scope1CategoryCard;