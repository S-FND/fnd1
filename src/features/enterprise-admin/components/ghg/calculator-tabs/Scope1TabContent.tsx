
import React from 'react';
import ScopeTabContent from './ScopeTabContent';

interface Scope1TabContentProps {
  scope1Data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  detailedEmissionsData: {
    stationaryCombustion: Array<{
      name: string;
      value: number;
      unit: string;
    }>;
    mobileCombustion: Array<{
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
  scope1Details: React.ReactNode;
  scopeColor: string;
}

const Scope1TabContent: React.FC<Scope1TabContentProps> = ({
  scope1Data,
  detailedEmissionsData,
  scope1Details,
  scopeColor,
}) => {
  return (
    <ScopeTabContent
      scopeNumber={1}
      data={scope1Data}
      title="Scope 1: Direct Emissions"
      color={scopeColor}
      description="Direct emissions"
      details={scope1Details}
      detailedData={[
        ...detailedEmissionsData.stationaryCombustion,
        ...detailedEmissionsData.mobileCombustion
      ]}
      detailedLabels={[
        'Stationary Combustion',
        'Mobile Combustion'
      ]}
    />
  );
};

export default Scope1TabContent;
