
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Check, AlertCircle } from 'lucide-react';
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';
import ESGCapTable from './ESGCapTable';

interface ReportGeneratorProps {
  stage: FundingStage;
  onBack: () => void;
  onFinish: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ stage, onBack, onFinish }) => {
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
      <Card>
        <CardHeader>
          <CardTitle>Generate ESG Due Diligence Report</CardTitle>
          <CardDescription>
            Review findings and generate a comprehensive ESG Due Diligence report
          </CardDescription>
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
            <h3 className="text-lg font-semibold">Report Sections</h3>
            
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
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-green-200 bg-green-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">ESG Due Diligence Report Generated</h3>
              <p className="text-center text-muted-foreground">
                The report has been generated successfully and the ESG CAP items have been created.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Preview Report
                </Button>
                <Button>
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
            <Button onClick={onFinish}>
              Finish
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {isGenerated && (
        <ESGCapTable />
      )}
    </div>
  );
};

export default ReportGenerator;
