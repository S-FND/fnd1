
import React from 'react';
import ScopeTabContent from './ScopeTabContent';

interface Scope3TabContentProps {
  scope3Data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  detailedEmissionsData: {
    businessTravel: Array<{
      name: string;
      value: number;
      unit: string;
    }>;
    [key: string]: Array<{
      name: string;
      value: number;
      unit: string;
    }>;
  };
  scope3Details: React.ReactNode;
  scopeColor: string;
  monthlyEmissionsData: Array<{
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
  }>;
}

const Scope3TabContent: React.FC<Scope3TabContentProps> = ({
  scope3Data,
  detailedEmissionsData,
  scope3Details,
  scopeColor,
  monthlyEmissionsData,
}) => {
  return (
    <ScopeTabContent
      scopeNumber={3}
      data={scope3Data}
      title="Scope 3: Other Indirect Emissions"
      color={scopeColor}
      description="Other indirect emissions"
      details={scope3Details}
      detailedData={detailedEmissionsData.businessTravel}
      detailedLabels={['Business Travel']}
      chartData={monthlyEmissionsData}
      chartDataKey="scope3"
    />
  );
};

export default Scope3TabContent;
