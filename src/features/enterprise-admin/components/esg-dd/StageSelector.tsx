
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface StageSelectorProps {
  onStageSelect: (stage: FundingStage) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onStageSelect }) => {
  const stages: FundingStage[] = ['pre_seed', 'seed', 'pre_series_a', 'series_a', 'series_b', 'series_c_plus', 'ipo'];
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Select Funding Stage</CardTitle>
        <CardDescription className="text-center">
          Choose the funding stage of the target company to customize the ESG due diligence process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <Button
              key={stage}
              variant="outline"
              className="flex flex-col items-center justify-center h-32 hover:border-primary hover:bg-primary/5"
              onClick={() => onStageSelect(stage)}
            >
              <span className="text-lg font-semibold">{fundingStagesDisplay[stage]}</span>
              <ArrowRight className="mt-2 h-5 w-5" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StageSelector;
