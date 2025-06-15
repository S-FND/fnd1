
import React from 'react';
import ScopeTabContent from './ScopeTabContent';

interface Scope2TabContentProps {
  scope2Data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  detailedEmissionsData: {
    purchasedElectricity: Array<{
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
  scope2Details: React.ReactNode;
  scopeColor: string;
}

const Scope2TabContent: React.FC<Scope2TabContentProps> = ({
  scope2Data,
  detailedEmissionsData,
  scope2Details,
  scopeColor,
}) => {
  return (
    <ScopeTabContent
      scopeNumber={2}
      data={scope2Data}
      title="Scope 2: Indirect Emissions from Energy"
      color={scopeColor}
      description="Indirect emissions from energy"
      details={scope2Details}
      detailedData={detailedEmissionsData.purchasedElectricity}
      detailedLabels={['Purchased Electricity']}
      additionalMetrics={[
        { label: 'Location-based Emissions', value: '2,100 tCO2e' },
        { label: 'Market-based Emissions', value: '2,000 tCO2e' }
      ]}
    />
  );
};

export default Scope2TabContent;
