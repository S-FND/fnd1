import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Upload, X, Download } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';
import { logger } from '@/hooks/logger';

interface FileAnswer {
  fileName: string;
  filePath: string; // This is the relative path
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

interface CustomQuestion {
  _id: string;
  question_text: string;
  question_type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'file' | 'number';
  options?: string[];
  entity_id: string;
  createdAt?: string;
  updatedAt?: string;
  answer?: string | FileAnswer;
  answer_updated_at?: string;
  is_draft?: boolean;
  is_submitted?: boolean;
}

interface CustomQuestionAnswer {
  question_id: string;
  answer: string | string[] | number | File | null;
  file?: File | null;
}

interface IRLCustomQuestionsProps {
  buttonEnabled: boolean;
}

// S3 URL builder function
const getS3FilePath = (file_path: string) =>
  `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

const IRLCustomQuestions: React.FC<IRLCustomQuestionsProps> = ({ 
  buttonEnabled 
}) => {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, CustomQuestionAnswer>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const [filePaths, setFilePaths] = useState<Record<string, string[]>>({}); // Store S3 URLs for each question
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entityId, setEntityId] = useState<string>('');

  // Get user entity ID from localStorage
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
          
          const initialAnswers: Record<string, CustomQuestionAnswer> = {};
          const initialFiles: Record<string, File | null> = {};
          const initialFilePaths: Record<string, string[]> = {};
          
          fetchedQuestions.forEach((question: CustomQuestion) => {
            let existingAnswer: string | string[] = '';
            
            if (question.answer !== undefined && question.answer !== null) {
              if (question.question_type === 'checkbox') {
                // Handle checkbox answers (array)
                if (typeof question.answer === 'string') {
                  existingAnswer = question.answer.split(',').map((item: string) => item.trim());
                } else {
                  existingAnswer = [];
                }
              } else if (question.question_type === 'file') {
                // Handle file answers
                if (typeof question.answer === 'object' && question.answer !== null) {
                  const fileAnswer = question.answer as FileAnswer;
                  existingAnswer = fileAnswer.fileName || '';
                  
                  // Store the S3 URL in filePaths state (like compliance component)
                  if (fileAnswer.filePath) {
                    initialFilePaths[question._id] = [getS3FilePath(fileAnswer.filePath)];
                  }
                } else if (typeof question.answer === 'string') {
                  existingAnswer = question.answer;
                } else {
                  existingAnswer = '';
                }
              } else {
                // Handle text, textarea, dropdown, number answers
                existingAnswer = question.answer as string;
              }
            } else {
              // No existing answer
              existingAnswer = question.question_type === 'checkbox' ? [] : '';
            }
            
            initialAnswers[question._id] = {
              question_id: question._id,
              answer: existingAnswer,
              file: null
            };
          });
          
          setAnswers(initialAnswers);
          setUploadedFiles(initialFiles);
          setFilePaths(initialFilePaths);
          logger.log('Initialized answers:', initialAnswers);
          logger.log('Initialized file paths:', initialFilePaths);
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
      const file = files[0];
      setUploadedFiles(prev => ({
        ...prev,
        [questionId]: file
      }));
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          file: file,
          answer: file.name
        }
      }));
    }
  };

  const handleRemoveFile = (questionId: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [questionId]: null
    }));
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        file: null,
        answer: ''
      }
    }));
  };

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
      // Check if there are file uploads
      const hasFileUploads = questions.some(q => 
        q.question_type === 'file' && uploadedFiles[q._id]
      );

      if (hasFileUploads) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('entity_id', entityId);
        formData.append('isDraft', 'true');

        // Build answers array including file questions with empty answers
        const answersArray = questions.map(q => {
          const answer = answers[q._id];
          if (q.question_type === 'file') {
            // For file questions, send empty string
            return {
              question_id: q._id,
              answer: ''
            };
          } else {
            return {
              question_id: q._id,
              answer: Array.isArray(answer?.answer) ? answer.answer.join(', ') : answer?.answer || ''
            };
          }
        });

        formData.append('answers', JSON.stringify(answersArray));

        // Add file answers
        questions
          .filter(q => q.question_type === 'file' && uploadedFiles[q._id])
          .forEach(q => {
            const file = uploadedFiles[q._id];
            if (file) {
              formData.append(`${q._id}_file`, file);
            }
          });

        const response: any = await httpClient.post('custom-questions/answers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
          // Refresh data to get updated file info
          await loadData();
        } else {
          throw new Error('Failed to save draft');
        }
      } else {
        // Use JSON for non-file answers
        const payload = {
          entity_id: entityId,
          answers: Object.values(answers)
            .filter(answer => {
              const question = questions.find(q => q._id === answer.question_id);
              return question?.question_type !== 'file';
            })
            .map(answer => ({
              question_id: answer.question_id,
              answer: Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer
            })),
          isDraft: true
        };

        const response: any = await httpClient.post('custom-questions/answers', payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
          // Refresh data
          await loadData();
        } else {
          throw new Error('Failed to save draft');
        }
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

    // Validation - check if all questions have answers
    const unansweredQuestions = questions.filter(question => {
      const answer = answers[question._id]?.answer;
      if (question.question_type === 'file') {
        // For file questions, check if file is uploaded OR if there's an existing file path
        const hasExistingFile = filePaths[question._id]?.length > 0;
        return !uploadedFiles[question._id] && !hasExistingFile;
      }
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
      // Check if there are file uploads
      const hasFileUploads = questions.some(q => 
        q.question_type === 'file' && uploadedFiles[q._id]
      );

      if (hasFileUploads) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('entity_id', entityId);
        formData.append('isDraft', 'false');

        // Build answers array including file questions with empty answers
        const answersArray = questions.map(q => {
          const answer = answers[q._id];
          if (q.question_type === 'file') {
            // For file questions, send empty string
            return {
              question_id: q._id,
              answer: ''
            };
          } else {
            return {
              question_id: q._id,
              answer: Array.isArray(answer?.answer) ? answer.answer.join(', ') : answer?.answer || ''
            };
          }
        });

        formData.append('answers', JSON.stringify(answersArray));

        // Add file answers
        questions
          .filter(q => q.question_type === 'file' && uploadedFiles[q._id])
          .forEach(q => {
            const file = uploadedFiles[q._id];
            if (file) {
              formData.append(`${q._id}_file`, file);
            }
          });

        const response: any = await httpClient.post('custom-questions/answers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers submitted successfully!');
          // Refresh data to get updated file info
          await loadData();
        } else {
          throw new Error('Failed to submit answers');
        }
      } else {
        // Use JSON for non-file answers
        const payload = {
          entity_id: entityId,
          answers: Object.values(answers)
            .filter(answer => {
              const question = questions.find(q => q._id === answer.question_id);
              return question?.question_type !== 'file';
            })
            .map(answer => ({
              question_id: answer.question_id,
              answer: Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer
            })),
          isDraft: false
        };

        const response: any = await httpClient.post('custom-questions/answers', payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers submitted successfully!');
          // Refresh data
          await loadData();
        } else {
          throw new Error('Failed to submit answers');
        }
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

  // Helper function to refresh data
  const loadData = async () => {
    if (!entityId) return;
    
    try {
      setIsLoading(true);
      const response: any = await httpClient.get(`custom-questions?entity_id=${entityId}`);
      
      if (response.status === 200) {
        const fetchedQuestions = response.data.data || response.data || [];
        setQuestions(fetchedQuestions);
        
        const initialFilePaths: Record<string, string[]> = {};
        
        fetchedQuestions.forEach((question: CustomQuestion) => {
          if (question.question_type === 'file' && question.answer) {
            if (typeof question.answer === 'object' && question.answer !== null) {
              const fileAnswer = question.answer as FileAnswer;
              if (fileAnswer.filePath) {
                initialFilePaths[question._id] = [getS3FilePath(fileAnswer.filePath)];
              }
            }
          }
        });
        
        setFilePaths(initialFilePaths);
      }
    } catch (err: any) {
      logger.error('Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to shorten file names
  const shortenFileName = (name: string) => {
    if (name.length <= 20) return name;
    return `${name.substring(0, 9)}...${name.substring(name.length - 5)}`;
  };

  const renderQuestionInput = (question: CustomQuestion, index: number) => {
    const answer = answers[question._id]?.answer || '';
    const file = uploadedFiles[question._id];
    const existingFileUrls = filePaths[question._id] || [];

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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={(e) => handleFileChange(question._id, e.target.files)}
                disabled={!buttonEnabled}
                className="flex-1"
                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
              />
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFile(question._id)}
                  disabled={!buttonEnabled}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {file && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Selected: {file.name}
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
            )}
            
            {/* Display existing files from S3 */}
            {existingFileUrls.map((fileUrl, i) => {
              const fileName = fileUrl.split('/').pop() || 'Download File';
              return (
                // <div key={`existing-${i}`} className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-200">
                  <div className="flex items-center gap-2">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate flex-1 text-blue-600 hover:text-blue-800 underline"
                      title={fileName}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(fileUrl, '_blank');
                      }}
                    >
                      {shortenFileName(fileName)}
                    </a>
                    <button
                      type="button"
                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                // </div>
              );
            })}
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
                        {question.question_type === 'file' && (
                          <Badge variant="outline" className="text-xs">
                            File Upload
                          </Badge>
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