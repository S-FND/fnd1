
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';

interface StageSelectorProps {
  onStageSelect: (stage: FundingStage) => void;
  mode: 'automated' | 'manual';
}

const StageSelector: React.FC<StageSelectorProps> = ({ onStageSelect, mode }) => {
  const fundingStages: FundingStage[] = [
    'pre_seed',
    'seed',
    'pre_series_a',
    'series_a',
    'series_b',
    'series_c_plus',
    'ipo'
  ];
  
  const earlyStages = fundingStages.slice(0, 3);
  const lateStages = fundingStages.slice(3);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Funding Stage</CardTitle>
        <CardDescription>
          Choose the funding stage of the company for appropriate due diligence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Early Stage Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {earlyStages.map((stage) => (
              <button
                key={stage}
                onClick={() => onStageSelect(stage)}
                className={`p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-colors ${
                  mode === 'automated' ? 'border-primary/20 bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="font-medium">{fundingStagesDisplay[stage]}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stage === 'pre_seed' ? 'Initial concept stage' : 
                   stage === 'seed' ? 'Early product development' : 
                   'Preparing for Series A'}
                </div>
                {mode === 'automated' && (
                  <div className="mt-2 text-xs px-2 py-1 rounded bg-primary/10 text-primary inline-block">
                    Automated available
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Growth Stage Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {lateStages.map((stage) => (
              <button
                key={stage}
                onClick={() => onStageSelect(stage)}
                className={`p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-colors ${
                  mode === 'automated' && ['series_a', 'series_b'].includes(stage) 
                    ? 'border-primary/20 bg-primary/5' 
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium">{fundingStagesDisplay[stage]}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stage === 'series_a' ? 'Product-market fit' : 
                   stage === 'series_b' ? 'Scaling operations' : 
                   stage === 'series_c_plus' ? 'Expansion phase' : 
                   'Public offering preparation'}
                </div>
                {mode === 'automated' && ['series_a', 'series_b'].includes(stage) && (
                  <div className="mt-2 text-xs px-2 py-1 rounded bg-primary/10 text-primary inline-block">
                    Automated available
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StageSelector;
