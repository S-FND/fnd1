
import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'];

interface EnergyItem {
  name: string;
  value: number;
  unit: string;
  percentage: number;
}

interface EnergyConsumptionProps {
  energyData: EnergyItem[];
}

const EnergyConsumption: React.FC<EnergyConsumptionProps> = ({ energyData }) => {
  const totalEnergy = energyData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Energy Consumption</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={energyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {energyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Energy Sources</h4>
          <div className="space-y-3">
            {energyData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span>{item.value.toLocaleString()} {item.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: COLORS[i % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between font-medium">
              <span>Total Energy Consumption:</span>
              <span>
                {totalEnergy.toLocaleString()} MWh
              </span>
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Renewable Energy:</span>
              <span>22%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyConsumption;
