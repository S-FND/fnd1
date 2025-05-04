
import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const SCOPE_COLORS = {
  scope1: '#22c55e',
  scope2: '#3b82f6',
  scope3: '#f97316'
};

interface ScopePercentage {
  name: string;
  value: number;
  percentage: string;
}

interface MonthlyEmission {
  month: string;
  scope1: number;
  scope2: number;
  scope3: number;
}

interface ScopeOverviewChartsProps {
  scopePercentages: ScopePercentage[];
  monthlyEmissionsData: MonthlyEmission[];
}

export const ScopeOverviewCharts: React.FC<ScopeOverviewChartsProps> = ({
  scopePercentages,
  monthlyEmissionsData
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <h3 className="font-medium">Emissions by Scope</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of CO2e emissions across Scope 1, 2, and 3
        </p>
        <div className="h-[300px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scopePercentages}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={SCOPE_COLORS.scope1} />
                <Cell fill={SCOPE_COLORS.scope2} />
                <Cell fill={SCOPE_COLORS.scope3} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Monthly Emissions</h3>
        <p className="text-sm text-muted-foreground">
          Emissions trend over the last 12 months
        </p>
        <div className="h-[300px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyEmissionsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="scope1" name="Scope 1" stackId="1" stroke={SCOPE_COLORS.scope1} fill={SCOPE_COLORS.scope1} />
              <Area type="monotone" dataKey="scope2" name="Scope 2" stackId="1" stroke={SCOPE_COLORS.scope2} fill={SCOPE_COLORS.scope2} />
              <Area type="monotone" dataKey="scope3" name="Scope 3" stackId="1" stroke={SCOPE_COLORS.scope3} fill={SCOPE_COLORS.scope3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ScopeOverviewCharts;
