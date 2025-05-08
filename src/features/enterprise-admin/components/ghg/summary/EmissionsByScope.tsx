
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';

interface EmissionsByScopeProps {
  emissionsByScope: Array<{
    scope: string;
    value: number;
    color: string;
    statusColor?: string;
    completeness?: number;
  }>;
}

const EmissionsByScope: React.FC<EmissionsByScopeProps> = ({ emissionsByScope }) => {
  const { user } = useAuth();
  const isUnitAdmin = user?.role === 'unit_admin';
  const unitName = isUnitAdmin && user?.units?.find(unit => unit.id === user?.unitId)?.name;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Carbon Emissions by Scope
        </CardTitle>
        <CardDescription>
          {isUnitAdmin 
            ? `Emissions breakdown for ${unitName || 'your unit'}`
            : 'Total enterprise emissions breakdown'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Scope</span>
              <span>tCO₂e</span>
            </div>
            {emissionsByScope.map((item) => (
              <div key={item.scope} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.scope}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${item.color}`}
                    style={{ width: `${(item.value / Math.max(...emissionsByScope.map(e => e.value))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground mt-4">
              <div className="flex justify-between">
                <span>Total Emissions</span>
                <span>{emissionsByScope.reduce((sum, item) => sum + item.value, 0)} tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsByScope;
