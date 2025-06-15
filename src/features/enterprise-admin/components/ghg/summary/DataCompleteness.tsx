
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletenessItem {
  scope: string;
  completeness: number;
  statusColor: string;
}

interface DataCompletenessProps {
  completenessData: CompletenessItem[];
}

const DataCompleteness: React.FC<DataCompletenessProps> = ({ completenessData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Completeness</CardTitle>
        <CardDescription>Current reporting period completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completenessData.map((scope) => (
            <div key={scope.scope} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${scope.statusColor}`}></div>
                <span>{scope.scope}</span>
              </div>
              <span className="text-sm text-muted-foreground">{scope.completeness}% complete</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCompleteness;
