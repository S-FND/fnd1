
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { emissionsByLocation } from '@/data/mockData';

const EmissionsByLocation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions by Location</CardTitle>
        <CardDescription>GHG emissions breakdown by facility</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={emissionsByLocation}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#22c55e" />
            <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#0ea5e9" />
            <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmissionsByLocation;
