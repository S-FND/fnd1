
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface KPI {
  id: string;
  name: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface MaterialKPIsProps {
  kpis: KPI[];
}

const MaterialKPIs: React.FC<MaterialKPIsProps> = ({ kpis }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.id}>
          <CardHeader className="pb-2">
            <div className="text-xs font-medium text-muted-foreground">
              {kpi.category}
            </div>
            <CardTitle className="text-base">{kpi.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {kpi.current} {kpi.unit}
              </span>
              <span className="text-sm text-muted-foreground">
                Target: {kpi.target} {kpi.unit}
              </span>
            </div>
            <Progress value={kpi.progress} className="h-2" />
            <div className="text-xs text-right text-muted-foreground">
              {kpi.progress}% of target
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MaterialKPIs;
