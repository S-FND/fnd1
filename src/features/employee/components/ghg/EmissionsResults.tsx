
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface EmissionsResultsProps {
  calculatedEmissions: number;
  onRecalculate: () => void;
  personalEmissionsData: Array<{
    month: string;
    value: number;
  }>;
}

const EmissionsResults: React.FC<EmissionsResultsProps> = ({
  calculatedEmissions,
  onRecalculate,
  personalEmissionsData
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Carbon Footprint</CardTitle>
          <CardDescription>
            Annual emissions based on your lifestyle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="text-4xl font-bold">{calculatedEmissions} tonnes</div>
            <div className="text-sm text-muted-foreground mt-2">CO₂ equivalent per year</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div>Your footprint</div>
              <div>Global average: 4.8 tonnes</div>
            </div>
            <Progress value={calculatedEmissions / 4.8 * 100} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium">Transport</div>
              <div className="text-2xl font-bold">{(calculatedEmissions * 0.3).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">tonnes (30%)</div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium">Home</div>
              <div className="text-2xl font-bold">{(calculatedEmissions * 0.25).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">tonnes (25%)</div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium">Food</div>
              <div className="text-2xl font-bold">{(calculatedEmissions * 0.3).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">tonnes (30%)</div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium">Shopping</div>
              <div className="text-2xl font-bold">{(calculatedEmissions * 0.15).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">tonnes (15%)</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Emission Trends</CardTitle>
          <CardDescription>
            Your carbon footprint over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={personalEmissionsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Reduction Suggestions</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-100 p-1 text-xs text-green-600">-0.5t</span>
                <span>Switch to public transportation twice a week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-100 p-1 text-xs text-green-600">-0.3t</span>
                <span>Reduce meat consumption by 30%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full bg-green-100 p-1 text-xs text-green-600">-0.2t</span>
                <span>Use renewable energy for home electricity</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center md:col-span-2">
        <Button variant="outline" onClick={onRecalculate}>Recalculate</Button>
      </div>
    </div>
  );
};

export default EmissionsResults;
