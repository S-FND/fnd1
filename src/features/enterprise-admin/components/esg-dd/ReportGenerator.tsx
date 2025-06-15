
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';
import { Progress } from '@/components/ui/progress';
import { Check, Download, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportGeneratorProps {
  fundingStage: FundingStage | null;
  onComplete: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ fundingStage, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [capGenerated, setCapGenerated] = useState(false);
  
  const stageName = fundingStage ? fundingStagesDisplay[fundingStage] : '';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(oldProgress => {
          const newProgress = Math.min(oldProgress + 10, 100);
          if (newProgress === 100) {
            setIsGenerating(false);
            setReportGenerated(true);
            setTimeout(() => setCapGenerated(true), 1000);
          }
          return newProgress;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Automated ESG Due Diligence Report</h3>
      <p className="text-muted-foreground">
        {isGenerating 
          ? `Generating your comprehensive ESG report for ${stageName} funding stage...` 
          : 'Your ESG report has been generated!'}
      </p>
      
      {isGenerating ? (
        <div className="space-y-4">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {progress >= 30 ? <Check className="h-4 w-4 text-green-600" /> : <Loader className="h-4 w-4 animate-spin" />}
              <span>Analyzing company information</span>
            </div>
            <div className="flex items-center gap-2">
              {progress >= 50 ? <Check className="h-4 w-4 text-green-600" /> : <Loader className="h-4 w-4 animate-spin" />}
              <span>Identifying applicable regulations</span>
            </div>
            <div className="flex items-center gap-2">
              {progress >= 70 ? <Check className="h-4 w-4 text-green-600" /> : <Loader className="h-4 w-4 animate-spin" />}
              <span>Assessing compliance gaps</span>
            </div>
            <div className="flex items-center gap-2">
              {progress >= 90 ? <Check className="h-4 w-4 text-green-600" /> : <Loader className="h-4 w-4 animate-spin" />}
              <span>Generating corrective action plan</span>
            </div>
            <div className="flex items-center gap-2">
              {progress >= 100 ? <Check className="h-4 w-4 text-green-600" /> : <Loader className="h-4 w-4 animate-spin" />}
              <span>Finalizing report</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg">ESG DD Report</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Your automated ESG due diligence report is ready.
                </p>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`p-4 ${!capGenerated && 'opacity-70'}`}>
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-4">
                {capGenerated ? (
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Check className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin" />
                  </div>
                )}
                <h4 className="font-semibold text-lg">ESG CAP</h4>
                <p className="text-sm text-muted-foreground text-center">
                  {capGenerated 
                    ? 'Your ESG corrective action plan items have been generated.' 
                    : 'Generating corrective action plan items...'}
                </p>
                <Button className="w-full" disabled={!capGenerated}>
                  View ESG CAP
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center pt-6">
            <Button onClick={onComplete}>
              Complete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
