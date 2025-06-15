
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EmissionSource {
  name: string;
  value: number;
  percentage?: number;
}

interface TopEmissionsSourcesProps {
  scope1Data: EmissionSource[];
  scope2Data: EmissionSource[];
  scope3Data: EmissionSource[];
}

const TopEmissionSources: React.FC<TopEmissionsSourcesProps> = ({
  scope1Data,
  scope2Data,
  scope3Data
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top Emission Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Scope 1 Top Sources</h4>
            <div className="space-y-1">
              {scope1Data.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.value} tCO2e</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Scope 2 Top Sources</h4>
            <div className="space-y-1">
              {scope2Data.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.value} tCO2e</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Scope 3 Top Sources</h4>
            <div className="space-y-1">
              {scope3Data.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.value} tCO2e</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopEmissionSources;
