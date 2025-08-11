import { useActionLog } from './useActionLog';

/**
 * Custom hook to easily log actions throughout the application
 * This can be used in any component to track user activities
 */
export function useActionLogger() {
  const { logAction } = useActionLog();

  const logDocumentCreate = async (documentName: string, documentId?: string) => {
    return logAction('create', 'document', documentId, documentName, `Created document: ${documentName}`);
  };

  const logDocumentUpdate = async (documentName: string, documentId?: string, changes?: string) => {
    return logAction('update', 'document', documentId, documentName, `Updated document: ${documentName}`, {
      changes
    });
  };

  const logDocumentDelete = async (documentName: string, documentId?: string) => {
    return logAction('delete', 'document', documentId, documentName, `Deleted document: ${documentName}`);
  };

  const logFileUpload = async (fileName: string, fileId?: string, fileSize?: number, mimeType?: string) => {
    return logAction('upload', 'file', fileId, fileName, `Uploaded file: ${fileName}`, {
      file_size: fileSize,
      mime_type: mimeType
    });
  };

  const logFileDownload = async (fileName: string, fileId?: string) => {
    return logAction('download', 'file', fileId, fileName, `Downloaded file: ${fileName}`);
  };

  const logReportGenerate = async (reportType: string, reportId?: string) => {
    return logAction('create', 'report', reportId, reportType, `Generated ${reportType} report`);
  };

  const logPolicyUpdate = async (policyName: string, policyId?: string) => {
    return logAction('update', 'policy', policyId, policyName, `Updated policy: ${policyName}`);
  };

  const logUserAction = async (actionType: 'view' | 'share', entityType: string, entityName: string, entityId?: string) => {
    return logAction(actionType, entityType, entityId, entityName, `${actionType} ${entityType}: ${entityName}`);
  };

  const logESGDataEntry = async (dataType: string, value: any, entityId?: string) => {
    return logAction('create', 'esg_data', entityId, dataType, `Entered ESG data: ${dataType}`, {
      value,
      data_type: dataType
    });
  };

  const logAuditAction = async (auditType: string, action: string, auditId?: string) => {
    return logAction('update', 'audit', auditId, auditType, `${action} audit: ${auditType}`);
  };

  return {
    logAction, // Generic action logger
    logDocumentCreate,
    logDocumentUpdate,
    logDocumentDelete,
    logFileUpload,
    logFileDownload,
    logReportGenerate,
    logPolicyUpdate,
    logUserAction,
    logESGDataEntry,
    logAuditAction
  };
}