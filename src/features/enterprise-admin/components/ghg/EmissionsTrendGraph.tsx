
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, 
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { months } from '@/data/ghg/calculator';

interface EmissionData {
  name: string;
  value: number;
}

interface TrendGraphProps {
  monthlyData: EmissionData[];
  yearlyData: EmissionData[];
  title?: string;
  description?: string;
}

const EmissionsTrendGraph: React.FC<TrendGraphProps> = ({ 
  monthlyData, 
  yearlyData,
  title = "Emissions Trend", 
  description = "Monthly and yearly emissions data" 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tCO₂e`, 'Emissions']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Monthly Emissions" 
                  stroke="hsl(var(--primary))" 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="yearly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tCO₂e`, 'Emissions']} />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Yearly Emissions" 
                  fill="hsl(var(--primary))" 
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmissionsTrendGraph;
