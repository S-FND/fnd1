
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Check, AlertCircle, Bot, ClipboardList } from 'lucide-react';
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';
import ESGCapTable from './ESGCapTable';

interface ReportGeneratorProps {
  stage: FundingStage;
  mode: 'automated' | 'manual';
  onBack: () => void;
  onFinish: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ stage, mode, onBack, onFinish }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card className={mode === 'automated' ? 'border-primary/20' : ''}>
        <CardHeader className={mode === 'automated' ? 'bg-primary/5' : ''}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generate ESG Due Diligence Report</CardTitle>
              <CardDescription>
                Review findings and generate a comprehensive ESG Due Diligence report
              </CardDescription>
            </div>
            {mode === 'automated' && (
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center">
                <Bot className="h-3 w-3 mr-1" />
                Automated Process
              </div>
            )}
            {mode === 'manual' && (
              <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center">
                <ClipboardList className="h-3 w-3 mr-1" />
                Manual Process
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Company Name</div>
                <div className="font-medium mt-1">GreenTech Solutions</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Funding Stage</div>
                <div className="font-medium mt-1">{fundingStagesDisplay[stage]}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Industry</div>
                <div className="font-medium mt-1">CleanTech</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Due Date</div>
                <div className="font-medium mt-1">May 10, 2024</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Report Sections</h3>
              {mode === 'automated' && (
                <div className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Auto-generated content
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Executive Summary</span>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Company Details</span>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Regulatory Compliance Assessment</span>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Key Findings & Recommendations</span>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>ESG Corrective Action Plan</span>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>
          
          {!isGenerated ? (
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleGenerate}
                disabled={isGenerating}
                variant={mode === 'automated' ? 'default' : 'secondary'}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full" />
                    {mode === 'automated' ? 'Auto-Generating Report...' : 'Generating Report...'}
                  </>
                ) : (
                  <>
                    {mode === 'automated' ? 'Auto-Generate Report' : 'Generate Report'}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className={`flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg ${
              mode === 'automated' 
                ? 'border-primary/20 bg-primary/5' 
                : 'border-green-200 bg-green-50'
            }`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                mode === 'automated' ? 'bg-primary/20' : 'bg-green-100'
              }`}>
                <Check className={`h-6 w-6 ${mode === 'automated' ? 'text-primary' : 'text-green-600'}`} />
              </div>
              <h3 className="text-lg font-medium">ESG Due Diligence Report Generated</h3>
              <p className="text-center text-muted-foreground">
                {mode === 'automated' 
                  ? 'The report and CAP items have been auto-generated based on AI analysis.' 
                  : 'The report has been generated successfully and the ESG CAP items have been created.'}
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Preview Report
                </Button>
                <Button variant={mode === 'automated' ? 'default' : 'secondary'}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={isGenerating}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {isGenerated && (
            <Button onClick={onFinish} variant={mode === 'automated' ? 'default' : 'secondary'}>
              Finish
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {isGenerated && (
        <div className="pt-6">
          <h2 className="text-xl font-bold mb-4">ESG Corrective Action Plan</h2>
          <ESGCapTable />
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
