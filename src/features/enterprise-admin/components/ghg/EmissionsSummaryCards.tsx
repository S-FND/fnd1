
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { companyInfo } from './summary/mockData';

interface ScopeEmissionTotal {
  scope: string;
  value: number;
  description: string;
  percentage: string;
}

interface EmissionsSummaryCardsProps {
  totalEmissions: number;
  scopeEmissions: ScopeEmissionTotal[];
}

const EmissionsSummaryCards: React.FC<EmissionsSummaryCardsProps> = ({
  totalEmissions,
  scopeEmissions
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Total Emissions</CardTitle>
          <CardDescription>{companyInfo.name} carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmissions.toLocaleString()} tCO2e</div>
          <p className="text-sm text-muted-foreground">-1.9% from previous year</p>
        </CardContent>
      </Card>
      
      {scopeEmissions.map((scope) => (
        <Card key={scope.scope}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{`Scope ${scope.scope.slice(-1)}`}</CardTitle>
            <CardDescription>{scope.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scope.value.toLocaleString()} tCO2e
            </div>
            <p className="text-sm text-muted-foreground">
              {scope.percentage}% of total emissions
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmissionsSummaryCards;
