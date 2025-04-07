
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileCheck, AlertCircle, Circle, CheckCircle, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock audit template shared with the supplier
const mockSharedAuditTemplate = {
  id: 'audit-123',
  title: 'Sustainability Audit 2025',
  description: 'Annual sustainability assessment for all suppliers',
  companyName: 'Green Manufacturing Corp',
  industry: 'Manufacturing',
  questions: [
    {
      id: 'q1',
      question: 'Does your company have an environmental policy?',
      category: 'Environmental',
      required: true,
      weight: 10,
      answerType: 'yes_no_partial',
      attachmentRequired: true,
    },
    {
      id: 'q2',
      question: 'Do you measure and report greenhouse gas emissions?',
      category: 'Environmental',
      required: true,
      weight: 15,
      answerType: 'yes_no_partial',
      attachmentRequired: true,
    },
    {
      id: 'q3',
      question: 'Do you have waste reduction targets?',
      category: 'Environmental',
      required: false,
      weight: 8,
      answerType: 'yes_no_partial',
      attachmentRequired: false,
    },
    {
      id: 'q4',
      question: 'Do you have a supplier code of conduct?',
      category: 'Governance',
      required: true,
      weight: 12,
      answerType: 'yes_no_partial',
      attachmentRequired: true,
    },
    {
      id: 'q5',
      question: 'Do you have fair labor practices?',
      category: 'Social',
      required: true,
      weight: 15,
      answerType: 'yes_no_partial',
      attachmentRequired: false,
    }
  ]
};

interface Question {
  id: string;
  question: string;
  category: string;
  required: boolean;
  weight: number;
  answerType: string;
  attachmentRequired: boolean;
  answer?: 'yes' | 'partial' | 'no' | null;
  attachmentUploaded?: boolean;
}

const SupplierAuditResponse: React.FC = () => {
  const { user } = useAuth();
  const [auditTemplate, setAuditTemplate] = useState(mockSharedAuditTemplate);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the shared audit template from the API
    // For now, transform the mock template questions to add response fields
    const preparedQuestions = auditTemplate.questions.map(q => ({
      ...q,
      answer: null,
      attachmentUploaded: false
    }));
    
    setQuestions(preparedQuestions);
  }, [auditTemplate]);

  const handleAnswerChange = (questionId: string, answer: 'yes' | 'partial' | 'no') => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ));
  };

  const handleAttachmentUpload = (questionId: string) => {
    // In real app, handle file upload
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, attachmentUploaded: true } : q
    ));
    
    toast.success("Document uploaded successfully");
  };

  const calculateProgress = () => {
    if (questions.length === 0) return 0;
    
    const answeredQuestions = questions.filter(q => q.answer !== null).length;
    const requiredAttachments = questions.filter(q => q.attachmentRequired).length;
    const uploadedAttachments = questions.filter(q => q.attachmentUploaded).length;
    
    // Weight answers as 70% and attachments as 30% of total progress
    const answerProgress = (answeredQuestions / questions.length) * 70;
    const attachmentProgress = requiredAttachments > 0 
      ? (uploadedAttachments / requiredAttachments) * 30
      : 30;
      
    return Math.round(answerProgress + attachmentProgress);
  };

  const calculateScore = () => {
    if (questions.length === 0) return 0;
    
    const totalWeight = questions.reduce((acc, q) => acc + q.weight, 0);
    let earnedPoints = 0;
    
    questions.forEach(q => {
      if (q.answer === 'yes') {
        earnedPoints += q.weight;
      } else if (q.answer === 'partial') {
        earnedPoints += q.weight * 0.5;
      }
    });
    
    return Math.round((earnedPoints / totalWeight) * 100);
  };

  const handleSaveProgress = () => {
    // In a real app, this would save to the database
    toast.success("Progress saved successfully");
  };

  const handleSubmitAudit = () => {
    setIsSubmitting(true);
    
    // Validate all required questions are answered
    const unansweredRequired = questions.filter(q => q.required && q.answer === null);
    const missingAttachments = questions.filter(q => 
      q.attachmentRequired && q.answer !== null && !q.attachmentUploaded
    );
    
    if (unansweredRequired.length > 0 || missingAttachments.length > 0) {
      toast.error("Please complete all required questions and upload all required documents");
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would submit the audit to the database
    setTimeout(() => {
      toast.success("Audit submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  // Display the appropriate icon based on question status
  const getQuestionStatusIcon = (question: Question) => {
    if (question.answer === null) {
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
        <h1 className="text-2xl font-bold tracking-tight">Shared Audit: {auditTemplate.title}</h1>
        <p className="text-muted-foreground">
          From {auditTemplate.companyName} • Complete this audit for sustainability assessment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Details</CardTitle>
          <CardDescription>{auditTemplate.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Completion Progress</div>
              <div className="text-sm text-muted-foreground">{calculateProgress()}%</div>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
              <p>{auditTemplate.companyName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
              <p>{auditTemplate.industry}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Your Company</h3>
              <p>{user?.supplierInfo?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Score</h3>
              <p className="font-semibold">{calculateScore()}/100</p>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {questions.map(question => (
                <div key={question.id} className="border rounded-md p-4">
                  <div className="flex items-start gap-3">
                    {getQuestionStatusIcon(question)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{question.question}</h4>
                        {question.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{question.category}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Weight: {question.weight}</span>
                      </div>
                      
                      <div className="mt-2 space-y-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={question.answer === 'yes' ? 'default' : 'outline'}
                            className="rounded-full"
                            onClick={() => handleAnswerChange(question.id, 'yes')}
                          >
                            Yes
                          </Button>
                          <Button 
                            size="sm" 
                            variant={question.answer === 'partial' ? 'default' : 'outline'}
                            className="rounded-full"
                            onClick={() => handleAnswerChange(question.id, 'partial')}
                          >
                            Partial
                          </Button>
                          <Button 
                            size="sm" 
                            variant={question.answer === 'no' ? 'default' : 'outline'}
                            className="rounded-full"
                            onClick={() => handleAnswerChange(question.id, 'no')}
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
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAttachmentUpload(question.id)}
                              >
                                Upload Supporting Document
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={handleSaveProgress}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Progress
                </Button>
                <Button 
                  onClick={handleSubmitAudit} 
                  disabled={calculateProgress() < 100 || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Audit"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {questions.filter(q => q.answer === null || (q.attachmentRequired && !q.attachmentUploaded)).map(question => (
                <div key={question.id} className="border rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{question.question}</h4>
                        {question.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{question.category}</span>
                      </div>
                      
                      {question.answer === null ? (
                        <div className="mt-2">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-full"
                              onClick={() => handleAnswerChange(question.id, 'yes')}
                            >
                              Yes
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-full"
                              onClick={() => handleAnswerChange(question.id, 'partial')}
                            >
                              Partial
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-full"
                              onClick={() => handleAnswerChange(question.id, 'no')}
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      ) : question.attachmentRequired && !question.attachmentUploaded && (
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAttachmentUpload(question.id)}
                          >
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
              {questions.filter(q => 
                q.answer !== null && (!q.attachmentRequired || q.attachmentUploaded)
              ).map(question => (
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
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <div className="text-sm">
            This audit was provided by <span className="font-semibold">{auditTemplate.companyName}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveProgress}>Save Draft</Button>
            <Button 
              onClick={handleSubmitAudit}
              disabled={calculateProgress() < 100 || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Audit"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupplierAuditResponse;
