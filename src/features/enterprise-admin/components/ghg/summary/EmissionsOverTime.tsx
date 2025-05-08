
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmissionTrendItem {
  year: number;
  value: number;
}

interface EmissionsOverTimeProps {
  emissionsTrend: EmissionTrendItem[];
}

const EmissionsOverTime: React.FC<EmissionsOverTimeProps> = ({ emissionsTrend }) => {
  return (
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
  );
};

export default EmissionsOverTime;
