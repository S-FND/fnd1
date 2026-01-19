
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { yearsToShow } from '@/data/ghg/calculator';

export interface MonthlyEmissionsData {
  name: string;
  scope1: number;
  scope2: number;
  scope3: number;
  year:string;
}

interface MonthlyEmissionsTrendProps {
  monthlyData: MonthlyEmissionsData[];
}

const MonthlyEmissionsTrend: React.FC<MonthlyEmissionsTrendProps> = ({ monthlyData }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  console.log('monthlyData', monthlyData);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monthly Emissions Trend</CardTitle>
          <CardDescription>Track emissions across all scopes month by month</CardDescription>
        </div>
        <div className="w-[150px]">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year-selector">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearsToShow.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} tCO₂e`, '']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="scope1" 
                name="Scope 1" 
                stroke="#22c55e" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="scope2" 
                name="Scope 2" 
                stroke="#3b82f6" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="scope3" 
                name="Scope 3" 
                stroke="#f97316" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyEmissionsTrend;
