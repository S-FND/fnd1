import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Scope2Entry, Scope2SourceType } from '@/types/scope2-ghg';
import Scope2DataTable from './Scope2DataTable';

interface Scope2CategoryCardProps {
  sourceType: Scope2SourceType;
  entries: Scope2Entry[];
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (entry: Scope2Entry) => void;
  onDelete: (id: string) => void;
  onAddNew: (sourceType: Scope2SourceType) => void;
}

const CATEGORY_INFO = {
  'Purchased Electricity': {
    title: 'Purchased Electricity',
    description: 'Emissions from purchased electricity from grid or renewable sources',
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  },
  'Purchased Steam': {
    title: 'Purchased Steam',
    description: 'Emissions from purchased steam from external suppliers',
    color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
  },
  'Purchased Heat': {
    title: 'Purchased Heat',
    description: 'Emissions from district heating or purchased heat',
    color: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  },
  'Purchased Cooling': {
    title: 'Purchased Cooling',
    description: 'Emissions from district cooling or chilled water supply',
    color: 'bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800',
  },
};

export const Scope2CategoryCard: React.FC<Scope2CategoryCardProps> = ({
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

  // Calculate location-based and market-based totals
  const locationBased = entries
    .filter(e => e.scope2Category === 'Location-Based')
    .reduce((sum, entry) => sum + entry.totalEmission, 0);
  const marketBased = entries
    .filter(e => e.scope2Category === 'Market-Based')
    .reduce((sum, entry) => sum + entry.totalEmission, 0);

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
            {locationBased > 0 && marketBased > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                LB: {locationBased.toFixed(2)} | MB: {marketBased.toFixed(2)}
              </div>
            )}
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
            <Scope2DataTable 
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

export default Scope2CategoryCard;