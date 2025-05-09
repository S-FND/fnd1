
import React from 'react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md text-sm">
        <p className="font-medium mb-1">{data.name}</p>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.color }}
          ></div>
          <span>{data.category}</span>
          {data.framework && (
            <span className="bg-gray-100 text-gray-700 text-xs px-1.5 rounded-sm">
              {data.framework}
            </span>
          )}
        </div>
        {data.description && (
          <p className="text-xs text-gray-600 mb-2">{data.description}</p>
        )}
        <div className="grid grid-cols-2 gap-2 border-t pt-2 mt-1">
          <div>
            <div className="text-xs text-gray-500">Business Impact</div>
            <div className="font-medium">{data.businessImpact.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Sustainability Impact</div>
            <div className="font-medium">{data.sustainabilityImpact.toFixed(1)}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
