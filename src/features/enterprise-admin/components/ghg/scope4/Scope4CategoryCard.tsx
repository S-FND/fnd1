import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Scope4Entry, AvoidedEmissionSourceType } from '@/types/scope4-ghg';
import Scope4DataTable from './Scope4DataTable';
import { Button } from "@/components/ui/button";

interface Scope4CategoryCardProps {
  sourceType: AvoidedEmissionSourceType;
  entries: Scope4Entry[];
  onEdit: (entry: Scope4Entry) => void;
  onDelete: (id: string) => void;
}

const Scope4CategoryCard: React.FC<Scope4CategoryCardProps> = ({
  sourceType,
  entries,
  onEdit,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAvoidedEmissions = entries.reduce((sum, entry) => sum + entry.totalAvoidedEmission, 0);
  const entryCount = entries.length;

  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {sourceType}
              <span className="text-sm font-normal text-muted-foreground">
                ({entryCount} {entryCount === 1 ? 'entry' : 'entries'})
              </span>
            </CardTitle>
            <p className="text-2xl font-bold text-primary mt-2">
              {totalAvoidedEmissions.toFixed(2)} tCO₂e avoided
            </p>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Scope4DataTable 
            entries={entries}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default Scope4CategoryCard;
