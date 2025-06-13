
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ESMSSection {
  id: string;
  title: string;
  description: string;
  content?: string;
  documents?: string[];
  isCompleted: boolean;
}

const ESMSPage: React.FC = () => {
  const [sections, setSections] = useState<ESMSSection[]>([
    { id: 'intro', title: 'Introduction of Company', description: 'Company overview and background', content: '', documents: [], isCompleted: false },
    { id: 'value-driver', title: 'ESG Value Driver', description: 'Key ESG value propositions', content: '', documents: [], isCompleted: false },
    { id: 'applicability', title: 'Applicability of ESG on the Company (ESG Rationale)', description: 'Why ESG matters for the organization', content: '', documents: [], isCompleted: false },
    { id: 'impact', title: 'Our Impact', description: 'Organization\'s ESG impact statement', content: '', documents: [], isCompleted: false },
    { id: 'esmp-overview', title: 'Overview of the ESMP', description: 'Environmental and Social Management Plan overview', content: '', documents: [], isCompleted: false },
    { id: 'adoption', title: 'ESMP Adoption and revision', description: 'Adoption process and revision procedures', content: '', documents: [], isCompleted: false },
    { id: 'communication', title: 'Communication and Disclosure', description: 'ESG communication strategy', content: '', documents: [], isCompleted: false },
    { id: 'policy', title: 'ESG policy', description: 'Formal ESG policy document', content: '', documents: [], isCompleted: false },
    { id: 'scope', title: 'Scope of ESG policy', description: 'ESG policy coverage and boundaries', content: '', documents: [], isCompleted: false },
    { id: 'standards', title: 'Applicable ESG Standards', description: 'Relevant ESG standards and frameworks', content: '', documents: [], isCompleted: false },
    { id: 'framework', title: 'ESG Implementation Framework', description: 'Framework for ESG implementation', content: '', documents: [], isCompleted: false },
    { id: 'incidents', title: 'E&S accidents, incidents, breaches, and anomalies', description: 'Environmental and Social incident management', content: '', documents: [], isCompleted: false },
    { id: 'emergency', title: 'Emergency Preparedness', description: 'Emergency response procedures', content: '', documents: [], isCompleted: false },
    { id: 'stakeholder-engagement', title: 'Stakeholder identification and engagement', description: 'Stakeholder management approach', content: '', documents: [], isCompleted: false },
    { id: 'grievance', title: 'Grievance Redressal Mechanism (GRM)', description: 'Grievance handling procedures', content: '', documents: [], isCompleted: false },
    { id: 'training', title: 'Training and capacity building', description: 'ESG training and development programs', content: '', documents: [], isCompleted: false },
    { id: 'resources', title: 'Resource allocation', description: 'ESG resource planning and allocation', content: '', documents: [], isCompleted: false },
    { id: 'review', title: 'ESG Management system review', description: 'System review and improvement processes', content: '', documents: [], isCompleted: false },
    { id: 'disclosure', title: 'Information Disclosure', description: 'ESG information disclosure practices', content: '', documents: [], isCompleted: false },
    { id: 'recordkeeping', title: 'Recordkeeping', description: 'ESG data and document management', content: '', documents: [], isCompleted: false },
    { id: 'operational', title: 'Operational Framework for ESG integration', description: 'Operational ESG integration approach', content: '', documents: [], isCompleted: false },
  ]);

  const annexures = [
    'Annexure A – E&S Principles',
    'Annexure B – List of Applicable National Regulations (illustrative)',
    'Annexure C – Incident/Accident reporting format',
    'Annexure D – Format for E&S Annual reporting',
    'Annexure E – Brief on Data Privacy',
    'Annexure F.1 – Internal Grievance Redressal Mechanism',
    'Annexure F.2 – External Communication Mechanism (ECM)',
    'Annexure G – Pro Forma E&S KPI\'s for periodic MIS Reporting',
    'Annexure H – RASCI Matrix on ESG responsibility & accountability',
    'Annexure I – ESG Monitoring and Engagement Calendar',
    'Annexure J – Impact Potential and Impact Tracking Format',
    'Annexure K – ESG Risk Opportunity Assessment & Impact',
    'Annexure L – Supplier & contractor selection and management process',
    'Annexure M – Sales and Distribution partner selection and management',
    'Annexure N – Marketing partner selection and management'
  ];

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<string>('');

  const handleEditSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    setEditingSection(sectionId);
    setTempContent(section?.content || '');
  };

  const handleSaveSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, content: tempContent, isCompleted: tempContent.trim().length > 0 }
        : section
    ));
    setEditingSection(null);
    setTempContent('');
    toast.success('Section updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setTempContent('');
  };

  const handleFileUpload = (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, documents: [...(section.documents || []), fileName] }
          : section
      ));
      toast.success(`Document "${fileName}" uploaded successfully`);
    }
  };

  const completedSections = sections.filter(s => s.isCompleted).length;
  const totalSections = sections.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Environmental and Social Management System (ESMS)</h1>
        <p className="text-muted-foreground">
          Comprehensive ESG management framework and documentation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ESMS Completion Progress</CardTitle>
          <CardDescription>
            {completedSections} of {totalSections} sections completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(completedSections / totalSections) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round((completedSections / totalSections) * 100)}% complete
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={section.isCompleted ? 'default' : 'secondary'}>
                    {section.isCompleted ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Complete
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 mr-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingSection === section.id ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`content-${section.id}`}
                      value={tempContent}
                      onChange={(e) => setTempContent(e.target.value)}
                      placeholder={`Enter content for ${section.title}...`}
                      rows={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveSection(section.id)}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {section.content ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap">{section.content}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No content added yet</p>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditSection(section.id)}
                    >
                      {section.content ? 'Edit Content' : 'Add Content'}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        id={`upload-${section.id}`}
                        className="hidden"
                        onChange={(e) => handleFileUpload(section.id, e)}
                        accept=".pdf,.doc,.docx,.xlsx,.xls"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById(`upload-${section.id}`)?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>

                  {section.documents && section.documents.length > 0 && (
                    <div>
                      <Label>Uploaded Documents:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {section.documents.map((doc, idx) => (
                          <Badge key={idx} variant="outline">
                            <FileText className="w-3 h-3 mr-1" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Annexures</CardTitle>
            <CardDescription>Supporting documents and templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {annexures.map((annexure, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{annexure}</span>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ESMSPage;
