import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Save, Loader2, Upload, X, Download, FileText, Link, Trash2, 
  Eye, AlertCircle, CheckCircle, Clock, XCircle 
} from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';
import { logger } from '@/hooks/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getS3FilePath,extractS3Key } from "@/utils/fileUrl";
// ============ INTERFACES ============
interface FileAnswer {
  _id?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  issueDate?: string;
  expiryDate?: string;
  isUserVerified?: boolean;
  isAdminVerified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  adminComment?: string;
  adminVerifiedAt?: string;
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


// ============ DOCUMENT VERIFICATION HOOK ============
const useDocumentVerification = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentDocToVerify, setCurrentDocToVerify] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem("fandoro-user");
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const getVerificationEndpoint = () => {
    return 'custom-questions/verify';
  };

  const handleCloseModal = useCallback(() => {
    setShowVerifyModal(false);
    setCurrentDocToVerify(null);
  }, []);

  const handleVerifyClick = useCallback((fileDetails: any, questionId: string, questionText: string) => {
    console.log('🎯 [Document Verification] Starting for custom question:', questionText);

    const originalFilePath = fileDetails.filePath || fileDetails.file_path || '';

    if (!originalFilePath) {
      toast.error("No valid file found for verification");
      return;
    }

    const fullFilePath = originalFilePath.startsWith('https://') 
      ? originalFilePath 
      : getS3FilePath(originalFilePath);

    let issueDateInput = "";
    let expiryDateInput = "";

    // Handle date parsing safely
    if (fileDetails.issueDate && fileDetails.issueDate !== 'Not found') {
      const dateParts = fileDetails.issueDate.split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        issueDateInput = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    if (fileDetails.expiryDate && fileDetails.expiryDate !== 'Not found') {
      const dateParts = fileDetails.expiryDate.split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        expiryDateInput = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    const verificationEndpoint = getVerificationEndpoint();

    setCurrentDocToVerify({
      ...fileDetails,
      file_path: fullFilePath,
      questionId,
      questionText,
      issueDateInput,
      expiryDateInput,
      isUserVerified: fileDetails.isUserVerified || false,
      originalFilePath: originalFilePath,
      verificationEndpoint
    });

    setShowVerifyModal(true);
  }, []);

  const handleVerifyAndClose = useCallback(async () => {
    if (!currentDocToVerify) return;

    setLoading(true);
    try {
      const entityId = getUserEntityId();
      if (!entityId) {
        toast.error("User not authenticated");
        return;
      }

      // Format dates for API (DD/MM/YYYY)
      const formatDateForAPI = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };

      const verificationData = {
        entityId,
        _id: currentDocToVerify._id,
        filePath: currentDocToVerify.originalFilePath || currentDocToVerify.filePath,
        questionId: currentDocToVerify.questionId,
        questionText: currentDocToVerify.questionText,
        issueDate: currentDocToVerify.issueDateInput
          ? formatDateForAPI(currentDocToVerify.issueDateInput)
          : currentDocToVerify.issueDate || "",
        expiryDate: currentDocToVerify.expiryDateInput
          ? formatDateForAPI(currentDocToVerify.expiryDateInput)
          : currentDocToVerify.expiryDate || "",
        isUserVerified: true,
        verifiedAt: new Date().toISOString(),
        category: 'custom_questions'
      };

      console.log('📤 Sending verification data:', verificationData);

      const response: any = await httpClient.post(currentDocToVerify.verificationEndpoint, verificationData);

      if (response.data.status === true) {
        toast.success("Document verified successfully!");
        setRefreshTrigger(prev => prev + 1);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      // toast.error(error.message || "Verification failed");
      throw error;
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  }, [currentDocToVerify, handleCloseModal]);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setCurrentDocToVerify((prev: any) => ({
      ...prev,
      isUserVerified: checked,
    }));
  }, []);

  const handleIssueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setCurrentDocToVerify((prev: any) => ({
      ...prev,
      issueDateInput: dateValue,
    }));
  }, []);

  const handleExpiryDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setCurrentDocToVerify((prev: any) => ({
      ...prev,
      expiryDateInput: dateValue,
    }));
  }, []);

  const VerificationModal = (
    <Dialog open={showVerifyModal} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Verify Document</DialogTitle>
          <DialogDescription>
            Verify the document details before submission
          </DialogDescription>
        </DialogHeader>

        {currentDocToVerify && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{currentDocToVerify.questionText || "Document"}</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const viewUrl = currentDocToVerify.file_path;
                    window.open(viewUrl, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Document
                </Button>
                <span className="text-xs text-gray-500">
                  Category: Custom Questions
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={currentDocToVerify.issueDateInput || ""}
                  onChange={handleIssueDateChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={currentDocToVerify.expiryDateInput || ""}
                  onChange={handleExpiryDateChange}
                  required
                  className={!currentDocToVerify.expiryDateInput ? "border-red-500" : ""}
                />
                {!currentDocToVerify.expiryDateInput && (
                  <p className="text-xs text-red-500">Expiry date is required</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm"
                checked={currentDocToVerify.isUserVerified || false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="confirm" className="text-sm">
                I confirm the information is correct
              </Label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleVerifyAndClose}
            disabled={
              loading ||
              !currentDocToVerify?.isUserVerified ||
              !currentDocToVerify?.expiryDateInput
            }
          >
            {loading ? "Verifying..." : "Verify Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    showVerifyModal,
    currentDocToVerify,
    handleVerifyClick,
    VerificationModal,
    refreshTrigger
  };
};

// ============ MAIN COMPONENT ============
const IRLCustomQuestions: React.FC<IRLCustomQuestionsProps> = ({ 
  buttonEnabled,
  tabName = 'custom'
}) => {
  // ============ STATE ============
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, CustomQuestionAnswer>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [fileDetails, setFileDetails] = useState<Record<string, FileAnswer[]>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entityId, setEntityId] = useState<string>('');

  // Use the verification hook
  const { VerificationModal, handleVerifyClick, refreshTrigger } = useDocumentVerification();

  // ============ UTILITY FUNCTIONS ============
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

  const isExpired = (dateString: string | undefined): boolean => {
    if (!dateString || dateString === 'Not found') return false;
    try {
      const [day, month, year] = dateString.split('/').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate < today;
    } catch (error) {
      console.error('Error parsing expiry date:', error);
      return false;
    }
  };

  const shortenFileName = (name: string | undefined) => {
    if (!name) return 'Document';
    if (name.length <= 20) return name;
    return `${name.substring(0, 15)}...${name.substring(name.length - 5)}`;
  };

  // ============ USE EFFECTS ============
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
        const initialFileDetails: Record<string, FileAnswer[]> = {};
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
              // ====== FIXED FILE ANSWER PARSING ======
              if (typeof question.answer === 'object' && question.answer !== null) {
                // Always initialize with empty array
                initialFileDetails[question._id] = [];
                
                // Set status and comments from structured answer
                if (question.answer.status) {
                  initialStatuses[question._id] = question.answer.status;
                }
                if (question.answer.comments) {
                  initialComments[question._id] = question.answer.comments;
                }
                
                // Check if it's a structured answer with files array
                if (question.answer.files && Array.isArray(question.answer.files)) {
                  // New format: { status: "Yes", comments: "", files: [...] }
                  const fileAnswers = question.answer.files as FileAnswer[];
                  const fileNames = fileAnswers.map(f => f.fileName).join(', ');
                  existingAnswer = fileNames;
                  
                  // Process file details with verification info
                  const filesWithDetails = fileAnswers.map(f => ({
                    ...f,
                    filePath: f.filePath || '',
                    fileName: f.fileName || '',
                    issueDate: f.issueDate || '',
                    expiryDate: f.expiryDate || '',
                    isUserVerified: f.isUserVerified || false,
                    isAdminVerified: f.isAdminVerified || false,
                    verificationStatus: f.verificationStatus || 'pending',
                    adminComment: f.adminComment || '',
                    _id: f._id || Math.random().toString(36).substr(2, 9)
                  }));
                  
                  initialFileDetails[question._id] = filesWithDetails;
                  
                } else if (Array.isArray(question.answer)) {
                  // Old format: array of files directly
                  const fileAnswers = question.answer as FileAnswer[];
                  const fileNames = fileAnswers.map(f => f.fileName).join(', ');
                  existingAnswer = fileNames;
                  
                  // Process file details
                  const filesWithDetails = fileAnswers.map(f => ({
                    ...f,
                    filePath: f.filePath || '',
                    fileName: f.fileName || '',
                    issueDate: f.issueDate || '',
                    expiryDate: f.expiryDate || '',
                    isUserVerified: f.isUserVerified || false,
                    isAdminVerified: f.isAdminVerified || false,
                    verificationStatus: f.verificationStatus || 'pending',
                    adminComment: f.adminComment || '',
                    _id: f._id || Math.random().toString(36).substr(2, 9)
                  }));
                  
                  initialFileDetails[question._id] = filesWithDetails;
                  if (!initialStatuses[question._id]) {
                    initialStatuses[question._id] = 'Yes'; // Default for old format
                  }
                  
                } else if (question.answer.filePath) {
                  // Single file object (old format)
                  const fileAnswer = question.answer as FileAnswer;
                  existingAnswer = fileAnswer.fileName || '';
                  
                  const fileDetails = {
                    ...fileAnswer,
                    filePath: fileAnswer.filePath || '',
                    fileName: fileAnswer.fileName || '',
                    issueDate: fileAnswer.issueDate || '',
                    expiryDate: fileAnswer.expiryDate || '',
                    isUserVerified: fileAnswer.isUserVerified || false,
                    isAdminVerified: fileAnswer.isAdminVerified || false,
                    verificationStatus: fileAnswer.verificationStatus || 'pending',
                    adminComment: fileAnswer.adminComment || '',
                    _id: fileAnswer._id || Math.random().toString(36).substr(2, 9)
                  };
                  
                  initialFileDetails[question._id] = [fileDetails];
                  if (!initialStatuses[question._id]) {
                    initialStatuses[question._id] = 'Yes';
                  }
                }
              } else if (typeof question.answer === 'string') {
                // String format - might be JSON or plain string
                existingAnswer = question.answer;
                // Initialize empty files array
                initialFileDetails[question._id] = [];
                
                try {
                  const parsed = JSON.parse(question.answer);
                  if (parsed.status) {
                    initialStatuses[question._id] = parsed.status;
                  }
                  if (parsed.comments) {
                    initialComments[question._id] = parsed.comments;
                  }
                  // Check for files in parsed JSON
                  if (parsed.files && Array.isArray(parsed.files)) {
                    const fileAnswers = parsed.files as FileAnswer[];
                    const filesWithDetails = fileAnswers.map(f => ({
                      ...f,
                      filePath: f.filePath || '',
                      fileName: f.fileName || '',
                      issueDate: f.issueDate || '',
                      expiryDate: f.expiryDate || '',
                      isUserVerified: f.isUserVerified || false,
                      isAdminVerified: f.isAdminVerified || false,
                      verificationStatus: f.verificationStatus || 'pending',
                      adminComment: f.adminComment || '',
                      _id: f._id || Math.random().toString(36).substr(2, 9)
                    }));
                    initialFileDetails[question._id] = filesWithDetails;
                  }
                } catch (e) {
                  initialStatuses[question._id] = 'Yes';
                }
              }
              
              if (!initialStatuses[question._id]) {
                initialStatuses[question._id] = 'Yes';
              }
            } else {
              // For non-file questions
              existingAnswer = question.answer as string;
            }
          } else {
            existingAnswer = question.question_type === 'checkbox' ? [] : '';
            if (question.question_type === 'file') {
              initialStatuses[question._id] = 'Yes';
            }
          }
          
          initialAnswers[question._id] = {
            question_id: question._id,
            answer: existingAnswer,
            files: []
          };
        });
        
        setAnswers(initialAnswers);
        setUploadedFiles(initialFiles);
        setFileDetails(initialFileDetails);
        setStatuses(initialStatuses);
        setComments(initialComments);
        
        setValidationErrors({});
        setTouchedFields({});
      } else {
        throw new Error('Failed to fetch custom questions');
      }
    } catch (err: any) {
      logger.error('Error fetching custom questions:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load custom questions';
      setError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      loadData();
    }
  }, [entityId, refreshTrigger]);

  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter(q => {
      let questionTab: string;
      
      if (Array.isArray(q.tab_name)) {
        questionTab = q.tab_name.length > 0 ? q.tab_name[0] : 'custom';
      } else if (q.tab_name) {
        questionTab = q.tab_name;
      } else {
        questionTab = 'custom';
      }
      
      return questionTab === tabName;
    });
    
    console.log('Filtering questions:', {
      totalQuestions: questions.length,
      tabName,
      filteredCount: filtered.length
    });
    
    return filtered;
  }, [questions, tabName]);

  // ============ SIMPLIFIED VALIDATION FUNCTIONS ============
  const validateFileQuestion = (question: CustomQuestion) => {
    const status = statuses[question._id] || '';
    const files = uploadedFiles[question._id] || [];
    const existingFiles = fileDetails[question._id] || [];
    const comment = comments[question._id] || '';
    
    console.log(`📋 Validating file question ${question._id}:`, {
      status,
      filesCount: files.length,
      existingFilesCount: existingFiles.length,
      comment,
      hasExistingFiles: existingFiles.length > 0
    });
    
    // For drafts: No validation, allow empty
    // For final submit: Only validate if status is "Yes" and no files
    return { isValid: true };
  };

  const validateOtherQuestion = (question: CustomQuestion) => {
    // No validation for drafts - always valid
    return { isValid: true };
  };

  const validateQuestion = (question: CustomQuestion) => {
    if (question.question_type === 'file') {
      return validateFileQuestion(question);
    } else {
      return validateOtherQuestion(question);
    }
  };

  const validateSingleQuestion = (questionId: string) => {
    // Clear validation errors for real-time validation
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const markFieldAsTouched = (questionId: string) => {
    if (!touchedFields[questionId]) {
      setTouchedFields(prev => ({
        ...prev,
        [questionId]: true
      }));
    }
  };

  // FIXED: Simple validation that always returns true for drafts
  const validateAllQuestions = (isDraft = false) => {
    console.log('Validating all questions for:', isDraft ? 'DRAFT' : 'FINAL SUBMIT');
    
    if (isDraft) {
      // No validation for drafts
      setValidationErrors({});
      return true;
    }
    
    // For final submit, only validate file questions with status "Yes"
    const newErrors: Record<string, string> = {};
    
    filteredQuestions.forEach(question => {
      if (question.question_type === 'file') {
        const status = statuses[question._id] || '';
        const files = uploadedFiles[question._id] || [];
        const existingFiles = fileDetails[question._id] || [];
        const comment = comments[question._id] || '';
        
        if (status === 'Yes') {
          if (files.length === 0 && existingFiles.length === 0) {
            newErrors[question._id] = 'At least one file is required when status is "Yes"';
          }
        } else if (status === 'No' || status === 'Not Applicable') {
          if (!comment.trim()) {
            newErrors[question._id] = `Reason is required when status is "${status}"`;
          }
        }
      }
    });
    
    console.log('Validation errors:', newErrors);
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ EVENT HANDLERS ============
  const handleAnswerChange = (questionId: string, value: string | string[] | number | File[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: value
      }
    }));
    
    markFieldAsTouched(questionId);
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
        [questionId]: [...(prev[questionId] || []), ...newFiles]
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
      
      markFieldAsTouched(questionId);
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
    
    markFieldAsTouched(questionId);
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
    
    markFieldAsTouched(questionId);
    validateSingleQuestion(questionId);
  };

  const handleStatusChange = (questionId: string, value: string) => {
    setStatuses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    markFieldAsTouched(questionId);
    validateSingleQuestion(questionId);
  };

  const handleCommentsChange = (questionId: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    markFieldAsTouched(questionId);
    validateSingleQuestion(questionId);
  };

  const handleDeleteExistingFile = async (questionId: string, fileIndex: number) => {
    console.log('handleDeleteExistingFile called:', { questionId, fileIndex });
    
    if (!buttonEnabled) {
      toast.error('You do not have permission to delete files');
      return;
    }
  
    try {
      const currentFiles = fileDetails[questionId] || [];
      
      if (fileIndex < 0 || fileIndex >= currentFiles.length) {
        toast.error('Invalid file index');
        return;
      }
      
      const fileToDelete = currentFiles[fileIndex];
      
      if (!fileToDelete.filePath) {
        toast.error('File path not found');
        return;
      }
  
      // Extract just the path after the S3 domain
      // let filePath = fileToDelete.filePath;
      // if (filePath.startsWith('https://')) {
      //   const url = new URL(filePath);
      //   filePath = url.pathname.substring(1);
      // }
      
      // const encodedFilePath = encodeURIComponent(filePath);
      const filePath = extractS3Key(fileToDelete.filePath);

      const response: any = await httpClient.delete(
        `custom-questions/file?questionId=${questionId}&filePath=${filePath}`
      );
  
      console.log('Delete API response:', response);
  
      if (response.status === 200 && response.data.status) {
        setFileDetails(prev => ({
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

  // ============ FILE VERIFICATION RENDER ============
  const renderFileWithVerification = (fileDetails: FileAnswer, questionId: string, fileIndex: number, questionText: string) => {
    const fileUrl = fileDetails.filePath || '';
    const fileName = fileDetails.fileName || fileUrl.split('/').pop() || 'Document';
    
    const detailsExist = !!fileDetails._id && !fileDetails._id?.startsWith('temp-');
    const isFileExpired = fileDetails.expiryDate && fileDetails.expiryDate !== 'Not found' ? isExpired(fileDetails.expiryDate) : false;
    const isVerified = fileDetails.isUserVerified === true && fileDetails.isAdminVerified === true;
    const isUserVerified = fileDetails.isUserVerified === true;
    const isRejected = fileDetails.verificationStatus === 'rejected';

    return (
      <div key={`${questionId}-${fileIndex}`} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs mb-1">
        <div className="flex items-center gap-2 flex-1">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-blue-600 hover:text-blue-800 underline"
            title={fileName}
            onClick={(e) => {
              e.preventDefault();
              window.open(fileUrl, '_blank');
            }}
          >
            {shortenFileName(fileName)}
          </a>

          <div className="flex items-center gap-1 flex-wrap">
            {isFileExpired && (
              <Badge variant="destructive" className="text-xs py-0 px-1.5">
                Expired
              </Badge>
            )}

            {fileDetails.expiryDate && !isFileExpired && fileDetails.expiryDate !== 'Not found' && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Exp: {fileDetails.expiryDate}
              </span>
            )}

            {isVerified && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800 py-0 px-1.5">
                <CheckCircle className="h-3 w-3 mr-1 inline" />
                Verified
              </Badge>
            )}

            {isRejected && (
              <Badge variant="destructive" className="text-xs py-0 px-1.5">
                <XCircle className="h-3 w-3 mr-1 inline" />
                Rejected
              </Badge>
            )}

            {isUserVerified && !isVerified && (
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 py-0 px-1.5">
                <Clock className="h-3 w-3 mr-1 inline" />
                Pending Admin
              </Badge>
            )}

            {detailsExist && !isVerified && !isRejected && !isUserVerified && !isFileExpired && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerifyClick(fileDetails, questionId, questionText)}
                className="h-6 text-xs py-0 px-2"
                disabled={!buttonEnabled}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Verify
              </Button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDeleteExistingFile(questionId, fileIndex)}
          className="h-5 w-5 p-0 text-red-500 hover:text-red-700 ml-2"
          disabled={!buttonEnabled}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  };

  // ============ FIXED FORM SUBMISSION FUNCTIONS ============
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
            const hasExistingFiles = fileDetails[q._id]?.length > 0;
            
            // Always send file data even if empty
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
            // FIX: Always send answer for non-file questions
            const answerValue = Array.isArray(answer?.answer) 
              ? answer.answer.join(', ') 
              : (answer?.answer || '');
            
            return {
              question_id: q._id,
              answer: answerValue
            };
          }
        });

        console.log('Saving answers array:', answersArray);
        formData.append('answers', JSON.stringify(answersArray));

        filteredQuestions
          .filter(q => q.question_type === 'file' && uploadedFiles[q._id]?.length > 0)
          .forEach(q => {
            const files = uploadedFiles[q._id] || [];
            
            files.forEach((file, index) => {
              formData.append(`${q._id}_files_${index}`, file);
            });
            
            formData.append(`${q._id}_append`, 'true');
          });

        console.log('Sending draft with form data');
        const response: any = await httpClient.post('custom-questions/answers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
          await loadData();
        } else {
          throw new Error(response.data?.message || 'Failed to save draft');
        }
      } else {
        const answersArray = filteredQuestions.map(q => {
          const answer = answers[q._id];
          
          if (q.question_type === 'file') {
            const status = statuses[q._id] || 'Yes';
            const comment = comments[q._id] || '';
            const hasExistingFiles = fileDetails[q._id]?.length > 0;
            
            const answerData = {
              status: status,
              comments: comment,
              files: fileDetails[q._id] || [],
              hasExistingFiles: hasExistingFiles
            };
            
            return {
              question_id: q._id,
              answer: JSON.stringify(answerData)
            };
          } else {
            // FIX: Always send answer for non-file questions
            const answerValue = Array.isArray(answer?.answer) 
              ? answer.answer.join(', ') 
              : (answer?.answer || '');
            
            return {
              question_id: q._id,
              answer: answerValue
            };
          }
        });

        const payload = {
          entity_id: entityId,
          answers: answersArray,
          isDraft: true
        };

        console.log('Saving draft payload:', payload);
        const response: any = await httpClient.post('custom-questions/answers', payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers saved as draft successfully!');
          await loadData();
        } else {
          throw new Error(response.data?.message || 'Failed to save draft');
        }
      }
    } catch (err: any) {
      console.error('Error saving draft:', err);
      logger.error('Error saving draft:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save draft';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    // FIX: Use validation for final submit
    if (!validateAllQuestions(false)) {
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
            const hasExistingFiles = fileDetails[q._id]?.length > 0;
            
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
            // Send answer for non-file questions
            const answerValue = Array.isArray(answer?.answer) 
              ? answer.answer.join(', ') 
              : (answer?.answer || '');
            
            return {
              question_id: q._id,
              answer: answerValue
            };
          }
        });

        console.log('Submitting answers array:', answersArray);
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
          throw new Error(response.data?.message || 'Failed to submit answers');
        }
      } else {
        const answersArray = filteredQuestions.map(q => {
          const answer = answers[q._id];
          
          if (q.question_type === 'file') {
            const status = statuses[q._id] || 'Yes';
            const comment = comments[q._id] || '';
            const hasExistingFiles = fileDetails[q._id]?.length > 0;
            
            const answerData = {
              status: status,
              comments: comment,
              files: fileDetails[q._id] || [],
              hasExistingFiles: hasExistingFiles
            };
            
            return {
              question_id: q._id,
              answer: JSON.stringify(answerData)
            };
          } else {
            const answerValue = Array.isArray(answer?.answer) 
              ? answer.answer.join(', ') 
              : (answer?.answer || '');
            
            return {
              question_id: q._id,
              answer: answerValue
            };
          }
        });

        const payload = {
          entity_id: entityId,
          answers: answersArray,
          isDraft: false
        };

        console.log('Submitting final payload:', payload);
        const response: any = await httpClient.post('custom-questions/answers', payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || 'Custom question answers submitted successfully!');
          await loadData();
        } else {
          throw new Error(response.data?.message || 'Failed to submit answers');
        }
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      logger.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit form';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ============ RENDER FUNCTIONS ============
  const renderQuestionInput = (question: CustomQuestion, index: number) => {
    const answer = answers[question._id]?.answer || '';
    const files = uploadedFiles[question._id] || [];
    const existingFiles = fileDetails[question._id] || [];
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
                <SelectItem value="">Select an option</SelectItem>
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
                            {files.length > 0 || existingFiles.length > 0 
                              ? `${files.length + existingFiles.length} file(s)` 
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
            
            {errorMessage && isTouched && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {errorMessage}
                </p>
              </div>
            )}
            
            {/* Show existing files with verification */}
            {existingFiles.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Existing files ({existingFiles.length}):
                </div>
                <div className="space-y-2">
                  {existingFiles.map((file, index) => (
                    <div key={`existing-${index}`}>
                      {renderFileWithVerification(file, question._id, index, question.question_text)}
                    </div>
                  ))}
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

  // ============ RENDER COMPONENT ============
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
                  const existingFiles = fileDetails[question._id] || [];
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
                            value={answer || undefined}
                            onValueChange={(value) =>
                              handleAnswerChange(question._id, value)
                            }
                            disabled={!buttonEnabled}
                          >
                            <SelectTrigger
                              className={errorMessage && isTouched ? 'border-red-500' : ''}
                            >
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                        
                            <SelectContent>
                              {question.options
                                ?.filter(opt => opt && opt.trim() !== '')
                                .map((option, optionIndex) => (
                                  <SelectItem
                                    key={optionIndex}
                                    value={option}   // ✅ always non-empty
                                  >
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
                                  id={`file-${question._id}`}
                                  multiple
                                />
                            
                                <label
                                  htmlFor={`file-${question._id}`}
                                  className={`cursor-pointer`}
                                >
                                  <div
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs
                                      ${
                                        !buttonEnabled
                                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                          : errorMessage && errorMessage.includes('file') && isTouched
                                          ? 'bg-red-50 text-red-600 border border-red-400'
                                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                      }
                                    `}
                                  >
                                    <Upload className="h-3 w-3" />
                                    Upload
                                  </div>
                                </label>
                              </div>

                                {/* Show existing files with verification */}
                                {existingFiles.map((file, fileIndex) => {
                                  // Create the full S3 URL for the file
                                  const s3FileUrl = getS3FilePath(file.filePath || '');
                                  
                                  const displayFileName = file.fileName?.length > 30 
                                    ? `${file.fileName.substring(0, 25)}...` 
                                    : file.fileName;
                                  
                                  return (
                                    <div key={`existing-${fileIndex}`} className="flex items-center justify-between bg-gray-50 p-1 py-0.5 rounded text-xs">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <a
                                          href={s3FileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="truncate flex-1 text-blue-600 hover:text-blue-800 underline"
                                          title={file.fileName}
                                        >
                                          {displayFileName}
                                        </a>
                                        
                                        {/* Verification badges */}
                                        {file.isUserVerified && file.isAdminVerified && (
                                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 py-0 px-1.5">
                                            <CheckCircle className="h-3 w-3 mr-1 inline" />
                                            Verified
                                          </Badge>
                                        )}
                                        
                                        {file.isUserVerified && !file.isAdminVerified && (
                                          <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 py-0 px-1.5">
                                            <Clock className="h-3 w-3 mr-1 inline" />
                                            Pending Admin
                                          </Badge>
                                        )}
                                        
                                        {file._id && !file._id.startsWith('temp-') && !file.isUserVerified && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleVerifyClick(file, question._id, question.question_text)}
                                            className="h-6 text-xs py-0 px-2"
                                            disabled={!buttonEnabled}
                                          >
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Verify
                                          </Button>
                                        )}
                                        
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

                                {/* Show new files to upload */}
                                {files.map((file, fileIndex) => (
                                  <div key={`new-${fileIndex}`} className="flex items-center justify-between bg-blue-50 p-1 py-0.5 rounded text-xs">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <span className="truncate flex-1 text-blue-700" title={file.name}>
                                        {file.name.length > 30 ? `${file.name.substring(0, 25)}...` : file.name}
                                      </span>
                                      <Badge variant="secondary" className="text-xs py-0 px-1.5">
                                        New
                                      </Badge>
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

      {/* Verification Modal */}
      {VerificationModal}
    </>
  );
};

export default IRLCustomQuestions;