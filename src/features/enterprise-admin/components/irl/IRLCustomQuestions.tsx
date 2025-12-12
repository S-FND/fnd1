import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Upload, X, Download, FileText, Link, Trash2 } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';
import { logger } from '@/hooks/logger';

interface FileAnswer {
  fileName: string;
  filePath: string;
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
  tab_name?: string | string[];
  createdAt?: string;
  updatedAt?: string;
  answer?: string | FileAnswer | FileAnswer[];
  answer_updated_at?: string;
  is_draft?: boolean;
  is_submitted?: boolean;
}

interface CustomQuestionAnswer {
  question_id: string;
  answer: string | string[] | number | File[] | null;
  files?: File[] | null;
}

interface IRLCustomQuestionsProps {
  buttonEnabled: boolean;
  tabName?: string;
}

const getS3FilePath = (file_path: string) =>
  `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

const IRLCustomQuestions: React.FC<IRLCustomQuestionsProps> = ({ 
  buttonEnabled,
  tabName = 'custom'
}) => {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, CustomQuestionAnswer>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [filePaths, setFilePaths] = useState<Record<string, string[]>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({}); // Track touched fields
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entityId, setEntityId] = useState<string>('');

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

  const loadData = async () => {
    if (!entityId) return;
    
    try {
      setIsLoading(true);
      const response: any = await httpClient.get(`custom-questions?entity_id=${entityId}`);
      
      if (response.status === 200) {
        const fetchedQuestions = response.data.data || response.data || [];
        setQuestions(fetchedQuestions);
        
        const initialAnswers: Record<string, CustomQuestionAnswer> = {};
        const initialFiles: Record<string, File[]> = {};
        const initialFilePaths: Record<string, string[]> = {};
        const initialStatuses: Record<string, string> = {};
        const initialComments: Record<string, string> = {};
        
        fetchedQuestions.forEach((question: CustomQuestion) => {
          let existingAnswer: string | string[] = '';
          
          if (question.answer !== undefined && question.answer !== null) {
            if (question.question_type === 'checkbox') {
              if (typeof question.answer === 'string') {
                existingAnswer = question.answer.split(',').map((item: string) => item.trim());
              } else {
                existingAnswer = [];
              }
            } else if (question.question_type === 'file') {
              // Handle file answers - can be single object or array
              if (Array.isArray(question.answer)) {
                // Multiple files as array
                const fileAnswers = question.answer as FileAnswer[];
                const fileNames = fileAnswers.map(f => f.fileName).join(', ');
                existingAnswer = fileNames;
                
                // Store all S3 URLs in filePaths state
                const urls = fileAnswers
                  .filter(f => f.filePath)
                  .map(f => getS3FilePath(f.filePath));
                initialFilePaths[question._id] = urls;
                
                // Check if it's structured answer with status/comments
                if (fileAnswers.length > 0 && typeof fileAnswers[0] === 'object') {
                  const firstFile = fileAnswers[0] as any;
                  if (firstFile.status) initialStatuses[question._id] = firstFile.status;
                  if (firstFile.comments) initialComments[question._id] = firstFile.comments;
                }
              } else if (typeof question.answer === 'object' && question.answer !== null) {
                // SINGLE FILE OBJECT (what your backend returns)
                const fileAnswer = question.answer as FileAnswer;
                existingAnswer = fileAnswer.fileName || '';
                
                // Store the single S3 URL in filePaths state as array with one item
                if (fileAnswer.filePath) {
                  initialFilePaths[question._id] = [getS3FilePath(fileAnswer.filePath)];
                }
                
                // Check if it's structured answer with status/comments
                if ('status' in fileAnswer) {
                  const structured = fileAnswer as any;
                  if (structured.status) initialStatuses[question._id] = structured.status;
                  if (structured.comments) initialComments[question._id] = structured.comments;
                } else {
                  // Regular file object - default status to Yes
                  initialStatuses[question._id] = 'Yes';
                }
              } else if (typeof question.answer === 'string') {
                existingAnswer = question.answer;
                try {
                  const parsed = JSON.parse(question.answer);
                  if (parsed.status) {
                    initialStatuses[question._id] = parsed.status;
                  }
                  if (parsed.comments) {
                    initialComments[question._id] = parsed.comments;
                  }
                } catch (e) {
                  // Not JSON, default to Yes
                  initialStatuses[question._id] = 'Yes';
                }
              }
              
              if (!initialStatuses[question._id]) {
                initialStatuses[question._id] = 'Yes';
              }
            } else {
              // Handle other question types
              existingAnswer = question.answer as string;
            }
          } else {
            // No existing answer
            existingAnswer = question.question_type === 'checkbox' ? [] : '';
            // Default status for file questions
            if (question.question_type === 'file') {
              initialStatuses[question._id] = 'Yes';
            }
          }
          
          initialAnswers[question._id] = {
            question_id: question._id,
            answer: existingAnswer,
            files: [] // Initialize empty array for new uploads
          };
        });
        
        setAnswers(initialAnswers);
        setUploadedFiles(initialFiles);
        setFilePaths(initialFilePaths);
        setStatuses(initialStatuses);
        setComments(initialComments);
        
        // Clear any validation errors on fresh load
        setValidationErrors({});
        setTouchedFields({});
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

  useEffect(() => {
    if (entityId) {
      loadData();
    }
  }, [entityId]);

  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter(q => {
      // Handle tab_name as string or array
      let questionTab: string;
      
      if (Array.isArray(q.tab_name)) {
        // If it's an array, get the first element or default to 'custom'
        questionTab = q.tab_name.length > 0 ? q.tab_name[0] : 'custom';
      } else if (q.tab_name) {
        // If it's a string, use it
        questionTab = q.tab_name;
      } else {
        // If undefined/null, default to 'custom'
        questionTab = 'custom';
      }
      
      return questionTab === tabName;
    });
    
    // Debug logging
    console.log('Filtering questions:', {
      totalQuestions: questions.length,
      tabName,
      filteredCount: filtered.length,
      questionsWithTabs: questions.map(q => {
        let tabValue: string;
        if (Array.isArray(q.tab_name)) {
          tabValue = q.tab_name.length > 0 ? q.tab_name[0] : 'custom (default)';
        } else {
          tabValue = q.tab_name || 'custom (default)';
        }
        return {
          id: q._id,
          text: q.question_text,
          tab_name: tabValue
        };
      })
    });
    
    return filtered;
  }, [questions, tabName]);

  // Real-time validation functions
  const validateFileQuestion = (question: CustomQuestion) => {
    const status = statuses[question._id] || '';
    const files = uploadedFiles[question._id] || [];
    const existingFileUrls = filePaths[question._id] || [];
    const comment = comments[question._id] || '';
    
    if (status === 'Yes') {
      if (files.length === 0 && existingFileUrls.length === 0) {
        return {
          isValid: false,
          message: `At least one file is required when status is "Yes"`
        };
      }
    }
    
    if (status === 'No' || status === 'Not Applicable') {
      if (!comment.trim()) {
        return {
          isValid: false,
          message: `Reason is required when status is "${status}"`
        };
      }
    }
    
    return { isValid: true };
  };

  const validateOtherQuestion = (question: CustomQuestion) => {
    const answer = answers[question._id]?.answer;
    
    if (['text', 'textarea', 'number'].includes(question.question_type)) {
      const stringAnswer = answer as string || '';
      if (!stringAnswer.trim()) {
        return {
          isValid: false,
          message: `This field is required`
        };
      }
    }
    
    if (question.question_type === 'dropdown') {
      const stringAnswer = answer as string || '';
      if (!stringAnswer.trim()) {
        return {
          isValid: false,
          message: `Please select an option`
        };
      }
    }
    
    if (question.question_type === 'checkbox') {
      const arrayAnswer = answer as string[] || [];
      if (arrayAnswer.length === 0) {
        return {
          isValid: false,
          message: `Please select at least one option`
        };
      }
    }
    
    return { isValid: true };
  };

  const validateQuestion = (question: CustomQuestion) => {
    if (question.question_type === 'file') {
      return validateFileQuestion(question);
    } else {
      return validateOtherQuestion(question);
    }
  };

  // Validate a single question (for real-time validation)
  const validateSingleQuestion = (questionId: string) => {
    const question = questions.find(q => q._id === questionId);
    if (!question) return;
    
    const validation: any = validateQuestion(question);
    
    if (!validation.isValid && touchedFields[questionId]) {
      // Only show error if field has been touched
      setValidationErrors(prev => ({
        ...prev,
        [questionId]: validation.message
      }));
    } else {
      // Clear error if valid or field not touched
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Mark field as touched
  const markFieldAsTouched = (questionId: string) => {
    if (!touchedFields[questionId]) {
      setTouchedFields(prev => ({
        ...prev,
        [questionId]: true
      }));
    }
  };

  // Validate all questions (for save/submit)
  const validateAllQuestions = () => {
    const newErrors: Record<string, string> = {};
    
    // questions.forEach(question => {
    //   const validation: any = validateQuestion(question);
    //   if (!validation.isValid) {
    //     newErrors[question._id] = validation.message;
    //     // Mark field as touched when validation fails on save/submit
    //     setTouchedFields(prev => ({
    //       ...prev,
    //       [question._id]: true
    //     }));
    //   }
    // });
    filteredQuestions.forEach(question => {
      const validation: any = validateQuestion(question);
      if (!validation.isValid) {
        newErrors[question._id] = validation.message;
        // Mark field as touched when validation fails on save/submit
        setTouchedFields(prev => ({
          ...prev,
          [question._id]: true
        }));
      }
    });
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnswerChange = (questionId: string, value: string | string[] | number | File[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: value
      }
    }));
    
    // Mark field as touched
    markFieldAsTouched(questionId);
    
    // Run validation for this specific question
    validateSingleQuestion(questionId);
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
      const newFiles = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), ...newFiles] // APPEND new files
      }));
      
      const currentFiles = uploadedFiles[questionId] || [];
      const allFiles = [...currentFiles, ...newFiles];
      const fileNames = allFiles.map(f => f.name).join(', ');
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          files: allFiles,
          answer: fileNames
        }
      }));
      
      // Mark field as touched
      markFieldAsTouched(questionId);
      
      // Run validation for this specific question
      validateSingleQuestion(questionId);
    }
  };

  const handleRemoveFile = (questionId: string, fileIndex: number) => {
    setUploadedFiles(prev => {
      const currentFiles = prev[questionId] || [];
      const updatedFiles = currentFiles.filter((_, index) => index !== fileIndex);
      
      const fileNames = updatedFiles.map(f => f.name).join(', ');
      
      setAnswers(prevAns => ({
        ...prevAns,
        [questionId]: {
          ...prevAns[questionId],
          files: updatedFiles,
          answer: fileNames
        }
      }));
      
      return {
        ...prev,
        [questionId]: updatedFiles
      };
    });
    
    // Mark field as touched
    markFieldAsTouched(questionId);
    
    // Run validation for this specific question
    validateSingleQuestion(questionId);
  };

  const handleRemoveAllFiles = (questionId: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        files: [],
        answer: ''
      }
    }));
    
    // Mark field as touched
    markFieldAsTouched(questionId);
    
    // Run validation for this specific question
    validateSingleQuestion(questionId);
  };

  const handleStatusChange = (questionId: string, value: string) => {
    setStatuses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Mark field as touched
    markFieldAsTouched(questionId);
    
    // Run validation for this specific question
    validateSingleQuestion(questionId);
  };

  const handleCommentsChange = (questionId: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Mark field as touched
    markFieldAsTouched(questionId);
    
    // Run validation for this specific question
    validateSingleQuestion(questionId);
  };

  const handleDeleteExistingFile = async (questionId: string, fileIndex: number) => {
    console.log('handleDeleteExistingFile called:', { questionId, fileIndex });
    
    if (!buttonEnabled) {
      toast.error('You do not have permission to delete files');
      return;
    }
  
    try {
      const currentFileUrls = filePaths[questionId] || [];
      
      if (fileIndex < 0 || fileIndex >= currentFileUrls.length) {
        toast.error('Invalid file index');
        return;
      }
      
      const fileUrlToDelete = currentFileUrls[fileIndex];
      
      if (!fileUrlToDelete) {
        toast.error('File URL not found');
        return;
      }
  
      // Encode the filePath for URL safety
      const encodedFilePath = encodeURIComponent(fileUrlToDelete);
      
      // Send as query parameters
      const response: any = await httpClient.delete(
        `custom-questions/file?questionId=${questionId}&filePath=${encodedFilePath}`
      );
  
      console.log('Delete API response:', response);
  
      if (response.status === 200 && response.data.status) {
        // Update local state to remove the file
        setFilePaths(prev => ({
          ...prev,
          [questionId]: prev[questionId].filter((_, index) => index !== fileIndex)
        }));
        
        toast.success('File deleted successfully');
        
      } else {
        throw new Error(response.data?.message || 'Failed to delete file');
      }
    } catch (err: any) {
      console.error('Error in handleDeleteExistingFile:', err);
      logger.error('Error deleting file:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to delete file');
    }
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

    if (filteredQuestions.length === 0) {
      toast.error('No custom questions found to save.');
      return;
    }

    // Validate all questions before saving
    if (!validateAllQuestions()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const hasFileUploads = filteredQuestions.some(q => 
        q.question_type === 'file' && uploadedFiles[q._id]?.length > 0
      );

      if (hasFileUploads) {
        const formData = new FormData();
        formData.append('entity_id', entityId);
        formData.append('isDraft', 'true');

        const answersArray = filteredQuestions.map(q => {
          const answer = answers[q._id];
          
          if (q.question_type === 'file') {
            const status = statuses[q._id] || 'Yes';
            const comment = comments[q._id] || '';
            const files = uploadedFiles[q._id] || [];
            const hasExistingFiles = filePaths[q._id]?.length > 0;
            
            const answerData = {
              status: status,
              comments: comment,
              hasFile: files.length > 0,
              fileCount: files.length,
              hasExistingFiles: hasExistingFiles  // Add this
            };
            
            return {
              question_id: q._id,
              answer: JSON.stringify(answerData)
            };
          } else {
            return {
              question_id: q._id,
              answer: Array.isArray(answer?.answer) ? answer.answer.join(', ') : answer?.answer || ''
            };
          }
        });

        formData.append('answers', JSON.stringify(answersArray));

        // Add files with proper naming convention
        filteredQuestions
        .filter(q => q.question_type === 'file' && uploadedFiles[q._id]?.length > 0)
        .forEach(q => {
          const files = uploadedFiles[q._id] || [];
          
          // Append each file with index
          files.forEach((file, index) => {
            formData.append(`${q._id}_files_${index}`, file);
          });
          
          // Also send a flag indicating we want to APPEND, not replace
          formData.append(`${q._id}_append`, 'true');
        });

        logger.log('Saving with form data');

        const response: any = await httpClient.post('custom-questions/answers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
          await loadData();
        } else {
          throw new Error('Failed to save draft');
        }
      } else {
        const answersArray = filteredQuestions.map(q => {
          const answer = answers[q._id];
          
          if (q.question_type === 'file') {
            const status = statuses[q._id] || 'Yes';
            const comment = comments[q._id] || '';
            const hasExistingFiles = filePaths[q._id]?.length > 0;
            
            const answerData = {
              status: status,
              comments: comment,
              hasExistingFiles: hasExistingFiles
            };
            
            return {
              question_id: q._id,
              answer: JSON.stringify(answerData)
            };
          } else {
            return {
              question_id: q._id,
              answer: Array.isArray(answer?.answer) ? answer.answer.join(', ') : answer?.answer || ''
            };
          }
        });

        const payload = {
          entity_id: entityId,
          answers: answersArray,
          isDraft: true
        };

        const response: any = await httpClient.post('custom-questions/answers', payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
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
    // Validate all questions before submitting
    if (!validateAllQuestions()) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    if (!buttonEnabled) {
      toast.error('You do not have permission to submit answers');
      return;
    }

    if (!entityId) {
      toast.error('Company profile not found. Please complete your company profile first.');
      return;
    }

    if (filteredQuestions.length === 0) {
      toast.error('No custom questions found to submit.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const hasFileUploads = filteredQuestions.some(q => 
        q.question_type === 'file' && uploadedFiles[q._id]?.length > 0
      );

      if (hasFileUploads) {
        const formData = new FormData();
        formData.append('entity_id', entityId);
        formData.append('isDraft', 'false');

        const answersArray = filteredQuestions.map(q => {
          const answer = answers[q._id];
          
          if (q.question_type === 'file') {
            const status = statuses[q._id] || 'Yes';
            const comment = comments[q._id] || '';
            const files = uploadedFiles[q._id] || [];
            const hasExistingFiles = filePaths[q._id]?.length > 0;
            
            const answerData = {
              status: status,
              comments: comment,
              hasFile: files.length > 0,
              fileCount: files.length,
              hasExistingFiles: hasExistingFiles
            };
            
            return {
              question_id: q._id,
              answer: JSON.stringify(answerData)
            };
          } else {
            return {
              question_id: q._id,
              answer: Array.isArray(answer?.answer) ? answer.answer.join(', ') : answer?.answer || ''
            };
          }
        });

        formData.append('answers', JSON.stringify(answersArray));

        filteredQuestions
          .filter(q => q.question_type === 'file' && uploadedFiles[q._id]?.length > 0)
          .forEach(q => {
            const files = uploadedFiles[q._id] || [];
            
            files.forEach((file, index) => {
              formData.append(`${q._id}_files_${index}`, file);
            });
          });

        const response: any = await httpClient.post('custom-questions/answers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers submitted successfully!');
          await loadData();
        } else {
          throw new Error('Failed to submit answers');
        }
      } else {
        const answersArray = filteredQuestions.map(q => {
          const answer = answers[q._id];
          
          if (q.question_type === 'file') {
            const status = statuses[q._id] || 'Yes';
            const comment = comments[q._id] || '';
            const hasExistingFiles = filePaths[q._id]?.length > 0;
            
            const answerData = {
              status: status,
              comments: comment,
              hasExistingFiles: hasExistingFiles
            };
            
            return {
              question_id: q._id,
              answer: JSON.stringify(answerData)
            };
          } else {
            return {
              question_id: q._id,
              answer: Array.isArray(answer?.answer) ? answer.answer.join(', ') : answer?.answer || ''
            };
          }
        });

        const payload = {
          entity_id: entityId,
          answers: answersArray,
          isDraft: false
        };

        const response: any = await httpClient.post('custom-questions/answers', payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers submitted successfully!');
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

  const renderQuestionInput = (question: CustomQuestion, index: number) => {
    const answer = answers[question._id]?.answer || '';
    const files = uploadedFiles[question._id] || [];
    const existingFileUrls = filePaths[question._id] || [];
    const status = statuses[question._id] || 'Yes';
    const comment = comments[question._id] || '';
    const errorMessage = validationErrors[question._id];
    const isTouched = touchedFields[question._id];
    
    switch (question.question_type) {
      case 'text':
        return (
          <div className="space-y-1">
            <Input
              value={answer as string}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Enter your answer..."
              disabled={!buttonEnabled}
              className={errorMessage && isTouched ? 'border-red-500' : ''}
            />
            {errorMessage && isTouched && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-1">
            <Textarea
              value={answer as string}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Enter your detailed answer..."
              rows={4}
              disabled={!buttonEnabled}
              className={errorMessage && isTouched ? 'border-red-500' : ''}
            />
            {errorMessage && isTouched && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-1">
            <Input
              type="number"
              value={answer as string}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Enter a number..."
              disabled={!buttonEnabled}
              className={errorMessage && isTouched ? 'border-red-500' : ''}
            />
            {errorMessage && isTouched && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-1">
            <Select
              value={answer as string}
              onValueChange={(value) => handleAnswerChange(question._id, value)}
              disabled={!buttonEnabled}
            >
              <SelectTrigger className={errorMessage && isTouched ? 'border-red-500' : ''}>
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
            {errorMessage && isTouched && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <div className={errorMessage && isTouched ? 'border border-red-300 p-3 rounded-md bg-red-50' : ''}>
              {question.options?.map((option:any, optionIndex) => {
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
            {errorMessage && isTouched && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Status Column */}
              <div className="space-y-2">
                <Label className="text-sm font-medium block">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => handleStatusChange(question._id, value)}
                  disabled={!buttonEnabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Attachment Column */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Attachment</Label>
                {status === 'No' || status === 'Not Applicable' ? (
                  <div className="text-sm text-gray-500 italic py-2">
                    No file
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="file"
                          onChange={(e) => {
                            handleFileChange(question._id, e.target.files);
                            e.target.value = '';
                          }}
                          disabled={!buttonEnabled}
                          className="flex-1 opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                          accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                          id={`file-${question._id}`}
                          multiple
                        />
                        <div className={`flex items-center justify-between border rounded-md px-3 py-2 bg-white ${
                          errorMessage && errorMessage.includes('file') && isTouched ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <span className="text-gray-500 text-sm truncate">
                            {files.length > 0 || existingFileUrls.length > 0 
                              ? `${files.length + existingFileUrls.length} file(s)` 
                              : "Upload files"}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => document.getElementById(`file-${question._id}`)?.click()}
                            disabled={!buttonEnabled}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                      {files.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAllFiles(question._id)}
                          disabled={!buttonEnabled}
                          className="text-red-600 hover:text-red-700 h-8 px-2"
                          title="Remove all files"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-xs font-medium text-blue-800 mb-1">
                          New files to upload ({files.length}):
                        </div>
                        <div className="space-y-1">
                          {files.map((file, index) => (
                            <div key={`new-${index}`} className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <FileText className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                <span className="text-blue-700 truncate min-w-0" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-800 text-xs flex-shrink-0"
                                onClick={() => handleRemoveFile(question._id, index)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Company Notes Column */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company Notes</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => handleCommentsChange(question._id, e.target.value)}
                  placeholder="Enter notes..."
                  rows={2}
                  disabled={!buttonEnabled}
                  className={`resize-none min-h-[80px] w-full ${
                    errorMessage && errorMessage.includes('Reason') && isTouched ? 'border-red-500' : ''
                  }`}
                />
              </div>
            </div>
            
            {/* Show validation error below the form section */}
            {errorMessage && isTouched && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {errorMessage}
                </p>
              </div>
            )}
            
            {/* Show existing files */}
            {existingFileUrls.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Existing files ({existingFileUrls.length}):
                </div>
                <div className="space-y-2">
                  {existingFileUrls.map((fileUrl, index) => {
                    const fileName = fileUrl.split('/').pop() || 'Download File';
                    return (
                      <div key={`existing-${index}`} className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700 truncate min-w-0" title={fileName}>
                            {fileName}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 underline text-xs whitespace-nowrap"
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 underline text-xs whitespace-nowrap"
                            onClick={() => {
                              console.log('Delete clicked:', {
                                questionId: question._id,
                                question,
                                fileIndex: index,
                                hasQuestionId: !!question._id
                              });
                              handleDeleteExistingFile(question._id, index);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <Input
              value={answer as string}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Enter your answer..."
              disabled={!buttonEnabled}
              className={errorMessage && isTouched ? 'border-red-500' : ''}
            />
            {errorMessage && isTouched && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        );
    }
  };

  const hasExistingAnswers = filteredQuestions.some(question => question.answer);

  const getSectionTitle = () => {
    const titleMap: Record<string, string> = {
      'company': 'Advanced Company Information',
      'hr': 'Advanced HR Information',
      'business': 'Advanced Business Operations',
      'photographs': 'Advanced Photographs',
      'compliance': 'Advanced Compliance',
      'management': 'Advanced Management',
      'itsecurity': 'Advanced IT Security',
      'facility': 'Advanced Facility Information',
      'governance': 'Advanced Governance',
      'custom': 'Custom Questions'
    };
    return titleMap[tabName] || 'Custom Questions';
  };

  return (
    <>
      {/* Only show title if there are questions for this tab */}
      {filteredQuestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{getSectionTitle()}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Additional questions specific to your company
          </p>
        </div>
      )}

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
      ) : filteredQuestions.length === 0 ? (
        // Don't show empty state - just render nothing
        null
      ) : (
        <div className="overflow-x-auto rounded-lg border mt-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-900">S. No.</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900">Question</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900">Answer</th>
                {filteredQuestions.some(q => q.question_type === 'file') && (
                  <th className="p-3 text-left text-sm font-semibold text-gray-900">Attachment</th>
                )}
                {filteredQuestions.some(q => q.question_type === 'file') && (
                  <th className="p-3 text-left text-sm font-semibold text-gray-900">Company Notes</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuestions
                .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
                .map((question, index) => {
                  const answer = answers[question._id]?.answer || '';
                  const files = uploadedFiles[question._id] || [];
                  const existingFileUrls = filePaths[question._id] || [];
                  const status = statuses[question._id] || 'Yes';
                  const comment = comments[question._id] || '';
                  const errorMessage = validationErrors[question._id];
                  const isTouched = touchedFields[question._id];
                  const isFileQuestion = question.question_type === 'file';

                  return (
                    <tr key={question._id}>
                      <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">
                        {index + 1}
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {question.question_text}
                          {question.question_type === 'file' && (
                            <Badge variant="outline" className="text-xs">
                              File Upload
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {isFileQuestion ? (
                          <Select
                            value={status}
                            onValueChange={(value) => handleStatusChange(question._id, value)}
                            disabled={!buttonEnabled}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : question.question_type === 'text' ? (
                          <Input
                            value={answer as string}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            placeholder="Enter your answer..."
                            disabled={!buttonEnabled}
                            className={errorMessage && isTouched ? 'border-red-500' : ''}
                          />
                        ) : question.question_type === 'textarea' ? (
                          <Textarea
                            value={answer as string}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            placeholder="Enter your detailed answer..."
                            rows={3}
                            disabled={!buttonEnabled}
                            className={errorMessage && isTouched ? 'border-red-500' : ''}
                          />
                        ) : question.question_type === 'number' ? (
                          <Input
                            type="number"
                            value={answer as string}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            placeholder="Enter a number..."
                            disabled={!buttonEnabled}
                            className={errorMessage && isTouched ? 'border-red-500' : ''}
                          />
                        ) : question.question_type === 'dropdown' ? (
                          <Select
                            value={answer as string}
                            onValueChange={(value) => handleAnswerChange(question._id, value)}
                            disabled={!buttonEnabled}
                          >
                            <SelectTrigger className={errorMessage && isTouched ? 'border-red-500' : ''}>
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
                        ) : question.question_type === 'checkbox' ? (
                          <div className="space-y-2">
                            <div className={errorMessage && isTouched ? 'border border-red-300 p-2 rounded-md bg-red-50' : ''}>
                              {question.options?.map((option: any, optionIndex) => {
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
                          </div>
                        ) : (
                          <Input
                            value={answer as string}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            placeholder="Enter your answer..."
                            disabled={!buttonEnabled}
                            className={errorMessage && isTouched ? 'border-red-500' : ''}
                          />
                        )}
                        {errorMessage && isTouched && !isFileQuestion && (
                          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                        )}
                      </td>
                      {isFileQuestion && (
                        <>
                          <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                            {status === 'No' || status === 'Not Applicable' ? (
                              <div className="text-sm text-gray-500 italic py-2">
                                No file
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="file"
                                    onChange={(e) => {
                                      handleFileChange(question._id, e.target.files);
                                      e.target.value = '';
                                    }}
                                    disabled={!buttonEnabled}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                                    id={`file-${question._id}`}
                                    multiple
                                  />
                                  <label
                                    htmlFor={`file-${question._id}`}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-md ${
                                      errorMessage && errorMessage.includes('file') && isTouched 
                                        ? 'border-red-500' 
                                        : 'border-gray-300'
                                    } ${!buttonEnabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                                  >
                                    <Upload className="h-4 w-4" />
                                    Upload Files
                                  </label>
                                </div>

                                {existingFileUrls.map((fileUrl, fileIndex) => {
                                  const fileName = fileUrl.split('/').pop() || 'Download File';
                                  return (
                                    <div key={`existing-${fileIndex}`} className="flex items-center justify-between bg-gray-50 p-1 py-0.5 rounded text-xs">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <a
                                          href={fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="truncate flex-1 text-blue-600 hover:text-blue-800 underline"
                                          title={fileName}
                                        >
                                          {fileName.length > 30 ? `${fileName.substring(0, 25)}...` : fileName}
                                        </a>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteExistingFile(question._id, fileIndex)}
                                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                          disabled={!buttonEnabled}
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}

                                {files.map((file, fileIndex) => (
                                  <div key={`new-${fileIndex}`} className="flex items-center justify-between bg-blue-50 p-1 py-0.5 rounded text-xs">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <span className="truncate flex-1 text-blue-700" title={file.name}>
                                        {file.name.length > 30 ? `${file.name.substring(0, 25)}...` : file.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(question._id, fileIndex)}
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {errorMessage && errorMessage.includes('file') && isTouched && (
                                  <p className="text-xs text-red-500">{errorMessage}</p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-sm text-gray-500">
                            <Textarea
                              value={comment}
                              onChange={(e) => handleCommentsChange(question._id, e.target.value)}
                              placeholder="Enter notes..."
                              rows={2}
                              disabled={!buttonEnabled}
                              className={`resize-none min-h-[80px] w-full ${
                                errorMessage && errorMessage.includes('Reason') && isTouched ? 'border-red-500' : ''
                              }`}
                            />
                            {errorMessage && errorMessage.includes('Reason') && isTouched && (
                              <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Show validation error for file questions below table */}
      {filteredQuestions.some(q => {
        const errorMsg = validationErrors[q._id];
        const isTouched = touchedFields[q._id];
        return q.question_type === 'file' && errorMsg && isTouched;
      }) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          {filteredQuestions
            .filter(q => {
              const errorMsg = validationErrors[q._id];
              const isTouched = touchedFields[q._id];
              return q.question_type === 'file' && errorMsg && isTouched;
            })
            .map(q => (
              <p key={q._id} className="text-sm text-red-600">
                {validationErrors[q._id]}
              </p>
            ))}
        </div>
      )}

      {/* Action buttons - only show if there are questions */}
      {buttonEnabled && filteredQuestions.length > 0 && (
        <div className="flex gap-4 pt-6 border-t mt-6">
          <Button 
            onClick={handleSave} 
            variant="outline" 
            className="flex-1" 
            disabled={saving || filteredQuestions.length === 0}
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
            disabled={saving || filteredQuestions.length === 0}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default IRLCustomQuestions;