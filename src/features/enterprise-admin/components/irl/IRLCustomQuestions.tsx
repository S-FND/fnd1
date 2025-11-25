// src/components/irl/IRLCustomQuestions.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2 } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';
import { logger } from '@/hooks/logger';

interface CustomQuestion {
  _id: string;
  question_text: string;
  question_type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'file' | 'number';
  options?: string[];
  entity_id: string;
  createdAt?: string;
  updatedAt?: string;
  // Add these fields from your API response
  answer?: string;
  answer_updated_at?: string;
  is_draft?: boolean;
  is_submitted?: boolean;
}

interface CustomQuestionAnswer {
  question_id: string;
  answer: string | string[] | number | File | null;
}

interface IRLCustomQuestionsProps {
  buttonEnabled: boolean;
}

const IRLCustomQuestions: React.FC<IRLCustomQuestionsProps> = ({ 
  buttonEnabled 
}) => {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, CustomQuestionAnswer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entityId, setEntityId] = useState<string>('');

  // Get user entity ID from localStorage (following your pattern)
  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      logger.error("Error parsing user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const entityIdFromStorage = getUserEntityId();
    if (entityIdFromStorage) {
      setEntityId(entityIdFromStorage);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!entityId) {
          setError('Please complete your company profile in the Administration section before submitting IRL details.');
          setIsLoading(false);
          return;
        }

        const response: any = await httpClient.get(`custom-questions?entity_id=${entityId}`);
        
        if (response.status === 200) {
          const fetchedQuestions = response.data.data || response.data || [];
          setQuestions(fetchedQuestions);
          
          // FIX: Initialize answers with existing answers from API response
          const initialAnswers: Record<string, CustomQuestionAnswer> = {};
          fetchedQuestions.forEach((question: CustomQuestion) => {
            let existingAnswer: string | string[] | null = '';
            
            // If there's an existing answer, use it
            if (question.answer !== undefined && question.answer !== null) {
              if (question.question_type === 'checkbox') {
                // For checkbox questions, split the comma-separated answer back to array
                existingAnswer = question.answer ? question.answer.split(',').map((item: string) => item.trim()) : [];
              } else {
                existingAnswer = question.answer;
              }
            } else {
              // No existing answer, initialize based on question type
              existingAnswer = question.question_type === 'checkbox' ? [] : '';
            }
            
            initialAnswers[question._id] = {
              question_id: question._id,
              answer: existingAnswer
            };
          });
          
          setAnswers(initialAnswers);
          logger.log('Initialized answers:', initialAnswers);
        } else {
          throw new Error('Failed to fetch custom questions');
        }
      } catch (err: any) {
        logger.error('Error fetching custom questions:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load custom questions';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (entityId) {
      loadData();
    }
  }, [entityId]);

  const handleAnswerChange = (questionId: string, value: string | string[] | number | File) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: value
      }
    }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const currentAnswers = answers[questionId]?.answer as string[] || [];
    let newAnswers: string[];

    if (checked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter(item => item !== option);
    }

    handleAnswerChange(questionId, newAnswers);
  };

  const handleFileChange = (questionId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      handleAnswerChange(questionId, files[0]);
    }
  };

  const buildAnswersPayload = (isDraft = false) => ({
    entity_id: entityId,
    answers: Object.values(answers).map(answer => ({
      question_id: answer.question_id,
      answer: Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer
    })),
    isDraft: isDraft
  });

  const handleSave = async () => {
    if (!buttonEnabled) {
      toast.error('You do not have permission to save answers');
      return;
    }

    if (!entityId) {
      toast.error('Company profile not found. Please complete your company profile first.');
      return;
    }

    if (questions.length === 0) {
      toast.error('No custom questions found to save.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = buildAnswersPayload(true);
      logger.log('Saving draft with payload:', payload);
      
      const response: any = await httpClient.post('custom-questions/answers', payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
        logger.log('Draft saved:', response);
      } else {
        throw new Error('Failed to save draft');
      }
    } catch (err: any) {
      logger.error('Error saving draft:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save draft';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!buttonEnabled) {
      toast.error('You do not have permission to submit answers');
      return;
    }

    if (!entityId) {
      toast.error('Company profile not found. Please complete your company profile first.');
      return;
    }

    if (questions.length === 0) {
      toast.error('No custom questions found to submit.');
      return;
    }

    // Basic validation - check if all questions have answers
    const unansweredQuestions = questions.filter(question => {
      const answer = answers[question._id]?.answer;
      return answer === '' || answer === null || answer === undefined || 
             (Array.isArray(answer) && answer.length === 0);
    });

    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions before submitting.`);
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = buildAnswersPayload(false);
      logger.log('Submitting answers with payload:', payload);
      
      const response: any = await httpClient.post('custom-questions/answers', payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Custom question answers submitted successfully!');
        logger.log('Form submitted:', response);
      } else {
        throw new Error('Failed to submit answers');
      }
    } catch (err: any) {
      logger.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit form';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionInput = (question: CustomQuestion, index: number) => {
    const answer = answers[question._id]?.answer || '';

    switch (question.question_type) {
      case 'text':
        return (
          <Input
            value={answer as string}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Enter your answer..."
            disabled={!buttonEnabled}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={answer as string}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Enter your detailed answer..."
            rows={4}
            disabled={!buttonEnabled}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={answer as string}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Enter a number..."
            disabled={!buttonEnabled}
          />
        );

      case 'dropdown':
        return (
          <Select
            value={answer as string}
            onValueChange={(value) => handleAnswerChange(question._id, value)}
            disabled={!buttonEnabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, optionIndex) => (
                <SelectItem key={optionIndex} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => {
              const isChecked = Array.isArray(answer) ? answer.includes(option) : false;
              return (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question._id}-${optionIndex}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(question._id, option, checked as boolean)
                    }
                    disabled={!buttonEnabled}
                  />
                  <Label htmlFor={`${question._id}-${optionIndex}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => handleFileChange(question._id, e.target.files)}
              disabled={!buttonEnabled}
            />
            {answer && typeof answer === 'string' && answer !== '' && (
              <p className="text-sm text-green-600">
                File previously uploaded: {answer}
              </p>
            )}
          </div>
        );

      default:
        return (
          <Input
            value={answer as string}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Enter your answer..."
            disabled={!buttonEnabled}
          />
        );
    }
  };

  const getQuestionTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      text: 'Short Text',
      textarea: 'Long Text',
      dropdown: 'Dropdown',
      checkbox: 'Multiple Choice',
      file: 'File Upload',
      number: 'Number'
    };
    return typeMap[type] || type;
  };

  // Check if any questions have existing answers
  const hasExistingAnswers = questions.some(question => question.answer);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Questions</CardTitle>
        <CardDescription>
          {hasExistingAnswers 
            ? 'Review and update your answers to the custom questions'
            : 'Please provide answers to the custom questions specific to your company'
          }
        </CardDescription>
        {/* {hasExistingAnswers && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            ✓ You have previously submitted answers to these questions
          </div>
        )} */}
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2">Loading custom questions...</span>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-blue-500 font-medium text-sm bg-blue-50 p-3 rounded-md">
              {error}
            </p>
            {error.includes('complete your company profile') && (
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => window.location.href = '/administration'}
              >
                Go to Administration
              </Button>
            )}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              There are no custom questions assigned to your company at this time.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Custom questions can be created in the Administration section.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {questions
                .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
                .map((question, index) => (
                  <div key={question._id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium">
                          {index + 1}. {question.question_text}
                        </Label>
                        {/* {question.answer && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            Previously Answered
                          </Badge>
                        )} */}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* <Badge variant="secondary" className="text-xs"> // hidebatch type
                          {getQuestionTypeDisplay(question.question_type)}
                        </Badge> */}
                        {question.options && question.options.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {question.options.length} option{question.options.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    {renderQuestionInput(question, index)}
                  </div>
                ))}
            </div>

            {buttonEnabled && (
              <div className="flex gap-4 pt-6 border-t">
                <Button 
                  onClick={handleSave} 
                  variant="outline" 
                  className="flex-1" 
                  disabled={saving || questions.length === 0}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1" 
                  disabled={saving || questions.length === 0}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit All Answers'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IRLCustomQuestions;