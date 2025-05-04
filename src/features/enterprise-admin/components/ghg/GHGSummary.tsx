
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { emissionsByScope, emissionsTrend } from './mockData';

export const GHGSummary = () => {
  const { user } = useAuth();
  const isUnitAdmin = user?.role === 'unit_admin';
  const unitName = isUnitAdmin && user?.units?.find(unit => unit.id === user?.unitId)?.name;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Emissions Over Time
            </CardTitle>
            <CardDescription>
              Year-over-year carbon footprint trend
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex items-end">
                    {emissionsTrend.map((item, index) => (
                      <div 
                        key={item.year}
                        className="flex flex-col items-center justify-end h-full flex-1"
                      >
                        <div 
                          className={`w-4/5 ${index === emissionsTrend.length - 1 ? 'bg-primary' : 'bg-muted-foreground/60'}`}
                          style={{ 
                            height: `${(item.value / Math.max(...emissionsTrend.map(e => e.value))) * 100}%`,
                          }}
                        />
                        <span className="text-xs mt-1">{item.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-8 flex items-center justify-between px-2 mt-4">
                  <span className="text-xs text-muted-foreground">Year</span>
                  <span className="text-xs text-muted-foreground">tCO₂e</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Completeness</CardTitle>
          <CardDescription>Current reporting period completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emissionsByScope.map((scope) => (
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
    </div>
  );
};
