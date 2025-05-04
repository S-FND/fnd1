
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'];

interface EmissionSource {
  name: string;
  value: number;
  percentage: number;
}

interface ScopeEmissionsChartProps {
  data: EmissionSource[];
  title: string;
  color: string;
}

const ScopeEmissionsChart: React.FC<ScopeEmissionsChartProps> = ({ data, title, color }) => {
  const totalEmissions = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        <Badge style={{ backgroundColor: color }}>
          {totalEmissions.toLocaleString()} tCO2e
        </Badge>
      </div>
      <div className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="grid grid-cols-4 text-sm">
              <div className="col-span-2 flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{item.name}</span>
              </div>
              <div className="text-right">{item.value.toLocaleString()} tCO2e</div>
              <div className="text-right">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScopeEmissionsChart;
