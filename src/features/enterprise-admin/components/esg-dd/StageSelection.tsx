
import React from 'react';
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';
import { Card } from '@/components/ui/card';

interface StageSelectionProps {
  onStageSelect: (stage: FundingStage) => void;
}

export const StageSelection: React.FC<StageSelectionProps> = ({ onStageSelect }) => {
  const stages: FundingStage[] = [
    'pre_seed',
    'seed',
    'pre_series_a',
    'series_a',
    'series_b',
    'series_c_plus',
    'ipo'
  ];

  const getStageDescription = (stage: FundingStage): string => {
    switch (stage) {
      case 'pre_seed':
        return 'Initial concept validation, very early stage with minimal regulatory exposure';
      case 'seed':
        return 'Product development and early market entry, basic regulatory compliance needed';
      case 'pre_series_a':
        return 'Established product with some traction, growing regulatory requirements';
      case 'series_a':
        return 'Scaling operations, increased regulatory scrutiny across ESG parameters';
      case 'series_b':
        return 'Significant business scale, comprehensive ESG framework required';
      case 'series_c_plus':
        return 'Mature operation with complex operations, advanced ESG practices expected';
      case 'ipo':
        return 'Public market readiness, extensive ESG disclosure and compliance required';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Funding Stage</h3>
      <p className="text-muted-foreground">
        The funding stage determines the appropriate depth and scope of the ESG due diligence assessment.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage) => (
          <Card 
            key={stage}
            className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            onClick={() => onStageSelect(stage)}
          >
            <h4 className="font-semibold">{fundingStagesDisplay[stage]}</h4>
            <p className="text-sm text-muted-foreground mt-1">{getStageDescription(stage)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
