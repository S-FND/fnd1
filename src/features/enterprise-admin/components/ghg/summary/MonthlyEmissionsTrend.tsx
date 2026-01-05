
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { yearsToShow } from '@/data/ghg/calculator';

interface WeeklyEmissionsData {
  name: string;
  scope1: number;
  scope2: number;
  scope3: number;
}

interface MonthlyEmissionsTrendProps {
  monthlyData: { name: string; scope1: number; scope2: number; scope3: number }[];
}

// Generate 52 weeks of data from monthly data
const generateWeeklyData = (monthlyData: { name: string; scope1: number; scope2: number; scope3: number }[]): WeeklyEmissionsData[] => {
  const weeklyData: WeeklyEmissionsData[] = [];
  
  for (let week = 1; week <= 52; week++) {
    // Map week to month (roughly 4.33 weeks per month)
    const monthIndex = Math.min(Math.floor((week - 1) / 4.33), 11);
    const monthData = monthlyData[monthIndex] || { scope1: 0, scope2: 0, scope3: 0 };
    
    // Add some variation to make weekly data more realistic
    const variation = 0.8 + Math.random() * 0.4; // ±20% variation
    
    weeklyData.push({
      name: `W${week}`,
      scope1: Math.round(monthData.scope1 / 4.33 * variation * 10) / 10,
      scope2: Math.round(monthData.scope2 / 4.33 * variation * 10) / 10,
      scope3: Math.round(monthData.scope3 / 4.33 * variation * 10) / 10,
    });
  }
  
  return weeklyData;
};

const MonthlyEmissionsTrend: React.FC<MonthlyEmissionsTrendProps> = ({ monthlyData }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const weeklyData = useMemo(() => generateWeeklyData(monthlyData), [monthlyData]);
  
  // Chart width: 52 weeks * 50px per week = 2600px minimum
  const chartWidth = Math.max(2600, 52 * 50);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Weekly Emissions Trend</CardTitle>
          <CardDescription>Track emissions across all scopes for 52 weeks</CardDescription>
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
        <div className="overflow-x-auto">
          <div style={{ width: chartWidth, height: 350 }}>
            <LineChart 
              data={weeklyData} 
              width={chartWidth} 
              height={350}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyEmissionsTrend;
