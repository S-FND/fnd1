import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Building, CheckCircle, Circle, ClipboardList, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const mockAuditQuestions = [
  {
    id: 'q1',
    question: 'Does your company have an environmental policy?',
    category: 'Environmental',
    required: true,
    answered: true,
    answer: 'yes',
    attachmentRequired: true,
    attachmentUploaded: true,
  },
  {
    id: 'q2',
    question: 'Do you measure and report greenhouse gas emissions?',
    category: 'Environmental',
    required: true,
    answered: true,
    answer: 'yes',
    attachmentRequired: true,
    attachmentUploaded: false,
  },
  {
    id: 'q3',
    question: 'Do you have waste reduction targets?',
    category: 'Environmental',
    required: false,
    answered: true,
    answer: 'partial',
    attachmentRequired: false,
    attachmentUploaded: false,
  },
  {
    id: 'q4',
    question: 'Do you have a supplier code of conduct?',
    category: 'Governance',
    required: true,
    answered: false,
    answer: null,
    attachmentRequired: true,
    attachmentUploaded: false,
  },
  {
    id: 'q5',
    question: 'Do you have fair labor practices?',
    category: 'Social',
    required: true,
    answered: false,
    answer: null,
    attachmentRequired: false,
    attachmentUploaded: false,
  }
];

const mockSharedAudits = [
  {
    id: 'audit-123',
    title: 'Sustainability Audit 2025',
    companyName: 'Green Manufacturing Corp',
    dueDate: '2025-05-15',
    status: 'not_started',
  },
  {
    id: 'audit-124',
    title: 'Carbon Footprint Assessment',
    companyName: 'EcoTech Industries',
    dueDate: '2025-04-30',
    status: 'in_progress',
    progress: 45,
  },
  {
    id: 'audit-125',
    title: 'Social Responsibility Audit',
    companyName: 'Sustainable Solutions Inc',
    dueDate: '2025-03-20',
    status: 'completed',
    score: 82,
  }
];

const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditProgress, setAuditProgress] = useState<number>(
    user?.supplierInfo?.auditStatus === 'completed' ? 100 :
    user?.supplierInfo?.auditStatus === 'in_progress' ? 45 : 0
  );
  const [auditQuestions, setAuditQuestions] = useState(mockAuditQuestions);
  const [sharedAudits, setSharedAudits] = useState(mockSharedAudits);
  
  const calculateAuditProgress = () => {
    if (auditQuestions.length === 0) return 0;
    const answeredQuestions = auditQuestions.filter(q => q.answered).length;
    const requiredAttachments = auditQuestions.filter(q => q.attachmentRequired).length;
    const uploadedAttachments = auditQuestions.filter(q => q.attachmentUploaded).length;
    
    const answerProgress = (answeredQuestions / auditQuestions.length) * 70;
    const attachmentProgress = requiredAttachments > 0 
      ? (uploadedAttachments / requiredAttachments) * 30
      : 30;
      
    return Math.round(answerProgress + attachmentProgress);
  };

  const handleStartAudit = () => {
    setAuditProgress(15);
    toast.success("Audit process started. Please complete all sections.");
  };

  const getQuestionStatusIcon = (question: any) => {
    if (!question.answered) {
      return <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />;
    }
    
    if (question.attachmentRequired && !question.attachmentUploaded) {
      return <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />;
    }
    
    if (question.answer === 'yes') {
      return <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />;
    }
    
    if (question.answer === 'partial') {
      return <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />;
    }
    
    return <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.supplierInfo?.name}! Manage your sustainability audits and profile here.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Review and update your company information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                <p>{user?.supplierInfo?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p>{user?.supplierInfo?.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Person</h3>
                <p>{user?.supplierInfo?.contactPerson}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Edit Profile</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Audits</CardTitle>
          <CardDescription>Sustainability audits shared by your client companies</CardDescription>
        </CardHeader>
        <CardContent>
          {sharedAudits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No audits have been shared with you yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedAudits.map(audit => (
                <div key={audit.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{audit.title}</h3>
                      <p className="text-sm text-muted-foreground">From {audit.companyName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs">Due: {audit.dueDate}</span>
                        {audit.status === 'not_started' && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Not Started</span>
                        )}
                        {audit.status === 'in_progress' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">In Progress</span>
                        )}
                        {audit.status === 'completed' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                        )}
                      </div>
                    </div>
                    <Button asChild>
                      <Link to={`/supplier/audit/${audit.id}`}>
                        {audit.status === 'not_started' ? 'Start Audit' : 
                         audit.status === 'in_progress' ? 'Continue' : 'View Results'}
                      </Link>
                    </Button>
                  </div>
                  
                  {audit.status === 'in_progress' && audit.progress && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{audit.progress}%</span>
                      </div>
                      <Progress value={audit.progress} className="h-1.5" />
                    </div>
                  )}
                  
                  {audit.status === 'completed' && audit.score && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Score: <span className="font-medium">{audit.score}/100</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Completing these audits helps your clients assess your sustainability practices.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Audit</CardTitle>
          <CardDescription>Current audit status and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Completion Progress</div>
              <div className="text-sm text-muted-foreground">{calculateAuditProgress()}%</div>
            </div>
            <Progress value={calculateAuditProgress()} className="h-2" />
          </div>

          {auditProgress === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <ClipboardList className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Active Audit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have any active sustainability audits. Click below to start the process.
              </p>
              <Button onClick={handleStartAudit}>Start Audit Process</Button>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Questions</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {auditQuestions.map(question => (
                  <div key={question.id} className="border rounded-md p-4">
                    <div className="flex items-start gap-3">
                      {getQuestionStatusIcon(question)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{question.question}</h4>
                          {question.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{question.category}</span>
                        </div>
                        
                        {question.answered ? (
                          <div className="mt-2 space-y-3">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant={question.answer === 'yes' ? 'default' : 'outline'}
                                className="rounded-full"
                              >
                                Yes
                              </Button>
                              <Button 
                                size="sm" 
                                variant={question.answer === 'partial' ? 'default' : 'outline'}
                                className="rounded-full"
                              >
                                Partial
                              </Button>
                              <Button 
                                size="sm" 
                                variant={question.answer === 'no' ? 'default' : 'outline'}
                                className="rounded-full"
                              >
                                No
                              </Button>
                            </div>
                            
                            {question.attachmentRequired && (
                              <div>
                                {question.attachmentUploaded ? (
                                  <div className="flex items-center gap-2 text-sm text-green-600">
                                    <FileCheck className="h-4 w-4" /> Documentation uploaded
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline">
                                    Upload Supporting Document
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="rounded-full">Yes</Button>
                              <Button size="sm" variant="outline" className="rounded-full">Partial</Button>
                              <Button size="sm" variant="outline" className="rounded-full">No</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mt-6">
                  <Button variant="outline" className="mr-2">Save Progress</Button>
                  <Button disabled={calculateAuditProgress() < 100}>Submit Audit</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                {auditQuestions.filter(q => !q.answered || (q.attachmentRequired && !q.attachmentUploaded)).map(question => (
                  <div key={question.id} className="border rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{question.question}</h4>
                          {question.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                          )}
                        </div>
                        
                        {!question.answered ? (
                          <div className="mt-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="rounded-full">Yes</Button>
                              <Button size="sm" variant="outline" className="rounded-full">Partial</Button>
                              <Button size="sm" variant="outline" className="rounded-full">No</Button>
                            </div>
                          </div>
                        ) : question.attachmentRequired && !question.attachmentUploaded && (
                          <div className="mt-2">
                            <Button size="sm" variant="outline">
                              Upload Supporting Document
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {auditQuestions.filter(q => q.answered && (!q.attachmentRequired || q.attachmentUploaded)).map(question => (
                  <div key={question.id} className="border rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{question.question}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Answer: <span className="font-medium capitalize">{question.answer}</span>
                        </p>
                        {question.attachmentUploaded && (
                          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                            <FileCheck className="h-4 w-4" /> Documentation uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents & Certifications</CardTitle>
          <CardDescription>Upload and manage your sustainability documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">ISO 14001 Certification</p>
                  <p className="text-xs text-muted-foreground">Environmental Management System</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upload</Button>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Carbon Disclosure Report</p>
                  <p className="text-xs text-muted-foreground">Annual GHG emissions report</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upload</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Sustainability Policy</p>
                  <p className="text-xs text-muted-foreground">Company sustainability policy document</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upload</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDashboard;
