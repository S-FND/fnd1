
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const EmissionsTrends = () => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Emissions Trend</CardTitle>
        <CardDescription>Total GHG emissions over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={[
              { year: '2018', value: 14800 },
              { year: '2019', value: 15600 },
              { year: '2020', value: 12400 },
              { year: '2021', value: 13200 },
              { year: '2022', value: 12800 },
              { year: '2023', value: 11200 },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmissionsTrends;
