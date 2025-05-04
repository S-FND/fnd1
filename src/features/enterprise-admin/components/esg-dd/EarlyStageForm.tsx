
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay, mockRegulatoryRequirements } from '../../data/esgDD';
import { ArrowLeft, ArrowRight, Plus, Info, RefreshCw } from 'lucide-react';

interface EarlyStageFormProps {
  stage: FundingStage;
  mode: 'automated' | 'manual';
  onBack: () => void;
  onNext: () => void;
}

const EarlyStageForm: React.FC<EarlyStageFormProps> = ({ stage, mode, onBack, onNext }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    registrationNumber: '',
    address: '',
    industry: '',
    country: 'India',
    state: '',
    directors: [''],
    hasHRPolicy: false,
    hasPrivacyPolicy: false,
    legalDisclosures: '',
  });
  const [isDetecting, setIsDetecting] = useState(false);

  const addDirector = () => {
    setCompanyInfo({
      ...companyInfo,
      directors: [...companyInfo.directors, '']
    });
  };

  const updateDirector = (index: number, value: string) => {
    const newDirectors = [...companyInfo.directors];
    newDirectors[index] = value;
    setCompanyInfo({
      ...companyInfo,
      directors: newDirectors
    });
  };

  const isEarlyStage = stage === 'pre_seed' || stage === 'seed' || stage === 'pre_series_a';
  const stageName = fundingStagesDisplay[stage];

  const relevantRegulations = mockRegulatoryRequirements.slice(0, 3);
  
  const handleDetectRegulations = () => {
    setIsDetecting(true);
    // Simulate API call to detect regulations
    setTimeout(() => {
      setIsDetecting(false);
    }, 2000);
  };

  return (
    <Card className={mode === 'automated' ? 'border-primary/20' : ''}>
      <CardHeader className={mode === 'automated' ? 'bg-primary/5' : ''}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ESG Due Diligence - {stageName}</CardTitle>
            <CardDescription>
              {isEarlyStage 
                ? 'Basic ESG compliance assessment for early stage companies' 
                : 'Comprehensive ESG due diligence for growth stage companies'}
            </CardDescription>
          </div>
          {mode === 'automated' && (
            <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
              Automated Process
            </div>
          )}
          {mode === 'manual' && (
            <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              Manual Process
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                value={companyInfo.name} 
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registration-number">Registration Number</Label>
              <Input 
                id="registration-number" 
                value={companyInfo.registrationNumber} 
                onChange={(e) => setCompanyInfo({...companyInfo, registrationNumber: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Registered Address</Label>
              <Textarea 
                id="address" 
                value={companyInfo.address} 
                onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry/Sector</Label>
              <Input 
                id="industry" 
                value={companyInfo.industry} 
                onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                value={companyInfo.state} 
                onChange={(e) => setCompanyInfo({...companyInfo, state: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Directors/Founders</h3>
            <Button type="button" variant="outline" size="sm" onClick={addDirector}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {companyInfo.directors.map((director, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`director-${index}`}>Director/Founder {index + 1}</Label>
              <Input 
                id={`director-${index}`} 
                value={director} 
                onChange={(e) => updateDirector(index, e.target.value)}
              />
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Policies & Disclosures</h3>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hr-policy" 
              checked={companyInfo.hasHRPolicy} 
              onCheckedChange={(checked) => setCompanyInfo({...companyInfo, hasHRPolicy: checked === true})}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="hr-policy">
                HR Policy and Code of Conduct
              </Label>
              <p className="text-sm text-muted-foreground">
                Company has documented HR policies, including anti-harassment and non-discrimination
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy-policy" 
              checked={companyInfo.hasPrivacyPolicy} 
              onCheckedChange={(checked) => setCompanyInfo({...companyInfo, hasPrivacyPolicy: checked === true})}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="privacy-policy">
                Privacy Policy
              </Label>
              <p className="text-sm text-muted-foreground">
                Company has a privacy policy for handling customer/user data
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="legal-disclosures">Legal Disclosures</Label>
            <Textarea 
              id="legal-disclosures" 
              placeholder="Disclose any pending legal notices, complaints, or regulatory issues"
              value={companyInfo.legalDisclosures} 
              onChange={(e) => setCompanyInfo({...companyInfo, legalDisclosures: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Applicable Regulations</h3>
              {mode === 'automated' && (
                <div className="text-sm text-muted-foreground rounded-full bg-muted px-2 py-1 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Auto-detected
                </div>
              )}
            </div>
            
            {mode === 'manual' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDetectRegulations}
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Detect Regulations
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {relevantRegulations.map((reg) => (
              <Card key={reg.id} className={mode === 'automated' ? "bg-primary/5 border-primary/20" : "bg-muted/30"}>
                <CardContent className="p-4">
                  <h4 className="font-medium">{reg.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{reg.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs ${mode === 'automated' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} rounded-full px-2 py-1`}>
                      {reg.category.charAt(0).toUpperCase() + reg.category.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Source: {reg.source}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} variant={mode === 'automated' ? 'default' : 'secondary'}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EarlyStageForm;
