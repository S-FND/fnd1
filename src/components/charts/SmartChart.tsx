import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface DataPoint {
  [key: string]: any;
}

interface SmartChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisKey?: string;
  title?: string;
  unit?: string;
  height?: number;
  className?: string;
}

// Smart chart selection logic
const analyzeData = (data: DataPoint[], dataKey: string, xAxisKey?: string) => {
  if (!data || data.length === 0) return { type: 'none', reason: 'No data available' };
  
  const values = data.map(d => d[dataKey]).filter(v => v !== null && v !== undefined);
  if (values.length === 0) return { type: 'none', reason: 'No valid values' };
  
  // Check data types
  const numericValues = values.filter(v => !isNaN(Number(v)));
  const isAllNumeric = numericValues.length === values.length;
  
  if (!isAllNumeric) {
    // If we have categorical data, use pie chart for composition
    if (data.length <= 10) {
      return { type: 'pie', reason: 'Categorical data with small dataset' };
    }
    return { type: 'bar', reason: 'Categorical data' };
  }
  
  // For numeric data, analyze patterns
  const sortedData = [...data].sort((a, b) => {
    if (xAxisKey) {
      const aVal = new Date(a[xAxisKey]).getTime();
      const bVal = new Date(b[xAxisKey]).getTime();
      return aVal - bVal;
    }
    return 0;
  });
  
  // Check if it's time series data
  const hasDateField = xAxisKey && data.every(d => {
    const date = new Date(d[xAxisKey]);
    return !isNaN(date.getTime());
  });
  
  // Check for trends
  const numericData = sortedData.map(d => Number(d[dataKey])).filter(v => !isNaN(v));
  let trend = 0;
  if (numericData.length > 1) {
    const firstHalf = numericData.slice(0, Math.floor(numericData.length / 2));
    const secondHalf = numericData.slice(Math.floor(numericData.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    trend = (secondAvg - firstAvg) / firstAvg;
  }
  
  // Decision logic
  if (hasDateField) {
    if (data.length >= 3) {
      if (Math.abs(trend) > 0.1) {
        return { type: 'line', reason: 'Time series with clear trend' };
      } else {
        return { type: 'area', reason: 'Time series with stable values' };
      }
    } else {
      return { type: 'bar', reason: 'Time series with few data points' };
    }
  }
  
  // For non-time series numeric data
  if (data.length <= 5) {
    return { type: 'bar', reason: 'Small dataset works best with bars' };
  } else if (data.length <= 15) {
    return { type: 'line', reason: 'Medium dataset with line for trends' };
  } else {
    return { type: 'area', reason: 'Large dataset with area for density' };
  }
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export const SmartChart: React.FC<SmartChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'month',
  title,
  unit = '',
  height = 250,
  className = ''
}) => {
  const analysis = analyzeData(data, dataKey, xAxisKey);
  
  if (analysis.type === 'none') {
    return (
      <div className={`flex items-center justify-center h-[${height}px] text-muted-foreground ${className}`}>
        <div className="text-center">
          <div className="text-sm">{analysis.reason}</div>
          <div className="text-xs mt-1">No visualization available</div>
        </div>
      </div>
    );
  }
  
  const tooltipFormatter = (value: any) => [
    `${value}${unit ? ` ${unit}` : ''}`, 
    title || dataKey
  ];
  
  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 20, bottom: 5 }
  };
  
  const renderChart = () => {
    switch (analysis.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={COLORS[0]} 
              strokeWidth={2}
              dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: COLORS[0], strokeWidth: 2 }}
            />
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={COLORS[0]} 
              fill={COLORS[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
        
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey={dataKey} fill={COLORS[0]} />
          </BarChart>
        );
        
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
          </PieChart>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
      {/* Analysis info for development */}
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Chart type: {analysis.type} • {analysis.reason}
      </div>
    </div>
  );
};

export default SmartChart;