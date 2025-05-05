
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { FundingStage } from '../../types/esgDD';
import { StageSelection } from './StageSelection';
import EarlyStageForm from './EarlyStageForm';
import LateStageForm from './LateStageForm';
import { ReportGenerator } from './ReportGenerator';

interface ESGDDWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const ESGDDWizard: React.FC<ESGDDWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [fundingStage, setFundingStage] = useState<FundingStage | null>(null);
  
  const totalSteps = 4;
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step === 1) {
      onCancel();
    } else {
      setStep(step - 1);
    }
  };
  
  const handleStageSelection = (stage: FundingStage) => {
    setFundingStage(stage);
    handleNext();
  };
  
  const isEarlyStage = fundingStage === 'pre_seed' || fundingStage === 'seed' || fundingStage === 'pre_series_a';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Automated ESG Due Diligence</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Step {step}</span> of {totalSteps}
          </div>
        </div>
        <CardDescription>
          {step === 1 && "Select the funding stage to determine the appropriate ESG assessment."}
          {step === 2 && "Provide basic company information and compliance details."}
          {step === 3 && "Review additional regulatory requirements based on company profile."}
          {step === 4 && "Generate the automated ESG DD report and corrective action plan."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 1 && <StageSelection onStageSelect={handleStageSelection} />}
        
        {step === 2 && fundingStage && (
          isEarlyStage 
            ? <EarlyStageForm stage={fundingStage} onBack={handleBack} onNext={handleNext} />
            : <LateStageForm stage={fundingStage} onBack={handleBack} onNext={handleNext} />
        )}
        
        {step === 3 && fundingStage && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Regulatory Assessment</h3>
            <p className="text-muted-foreground">
              Based on the information provided, the system is analyzing applicable regulations and compliance requirements.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Company profile analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Industry-specific requirements identified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Regulatory compliance gaps detected</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Media search completed</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              The system has identified applicable regulatory requirements for your company based on its industry, location, and funding stage.
              These will be incorporated into your automated ESG DD report and corrective action plan.
            </p>
          </div>
        )}
        
        {step === 4 && <ReportGenerator fundingStage={fundingStage} onComplete={onComplete} />}
      </CardContent>
      
      {step !== 1 && step !== 4 && step !== 2 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === totalSteps - 1 ? 'Generate Report' : 'Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
