
import React from 'react';

interface ScopeEmission {
  scope: string;
  value: number;
  description: string;
  percentage: string;
}

interface EmissionsSummaryCardsProps {
  totalEmissions: number;
  scopeEmissions: ScopeEmission[];
}

const EmissionsSummaryCards: React.FC<EmissionsSummaryCardsProps> = ({ totalEmissions, scopeEmissions }) => {
  const colorMap: Record<string, string> = {
    scope1: "bg-green-100 text-green-800 border-green-200",
    scope2: "bg-blue-100 text-blue-800 border-blue-200",
    scope3: "bg-amber-100 text-amber-800 border-amber-200",
    scope4: "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-2">Total Emissions</h3>
        <div className="flex flex-col">
          <span className="text-3xl font-bold mb-1">{totalEmissions.toLocaleString()} tCO₂e</span>
          <span className="text-sm text-muted-foreground">IMR Resources (2025)</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span> Scope 1: {scopeEmissions[0].percentage}
          </span>
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Scope 2: {scopeEmissions[1].percentage}
          </span>
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Scope 3: {scopeEmissions[2].percentage}
          </span>
        </div>
      </div>

      {scopeEmissions.map((emission, index) => (
        <div 
          key={emission.scope} 
          className={`border rounded-lg p-4 shadow-sm ${colorMap[emission.scope]}`}
        >
          <h3 className="text-lg font-medium mb-2">
            {emission.scope === 'scope1' && 'Direct Emissions'}
            {emission.scope === 'scope2' && 'Indirect Energy Emissions'}
            {emission.scope === 'scope3' && 'Value Chain Emissions'}
            {emission.scope === 'scope4' && 'Avoided Emissions'}
          </h3>
          <div className="flex flex-col">
            <span className="text-2xl font-bold mb-1">{emission.value.toLocaleString()} tCO₂e</span>
            <div className="flex justify-between">
              <span className="text-sm">{emission.description}</span>
              <span className="text-sm font-semibold">{emission.percentage}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmissionsSummaryCards;
