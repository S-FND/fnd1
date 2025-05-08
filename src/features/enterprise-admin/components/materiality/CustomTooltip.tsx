
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-xs">Business Impact: {payload[0].payload.businessImpact}</p>
        <p className="text-xs">Sustainability Impact: {payload[0].payload.sustainabilityImpact}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
