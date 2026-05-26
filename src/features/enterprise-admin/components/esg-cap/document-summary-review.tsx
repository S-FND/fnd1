import React, { useEffect, useState } from "react";
import { Eye, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { httpClient } from "@/lib/httpClient";

interface ValidationScores {
  relevance: number;
  policyCompleteness: number;
  regulatoryAlignment: number;
  structure: number;
  authenticity: number;
}

export interface IDocumentValidation {
  _id?: string;
  actionItemId: string;
  entityId: string;
  documentId?: string | null;
  s3Link: string;
  fileName: string;
  status: "draft" | "final";
  overallScore: number;
  improvementPercentage: number;
  confidence: number;
  valid: boolean;
  scores: ValidationScores;
  missingSections: string[];
  issues: string[];
  suggestedImprovements: SuggestedImprovement[];
  summary?: string;
  rawResponse?: any;
  version: number;
  aiInsights?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

type SuggestedImprovement = {
  section: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
};

type Props = {
  open: boolean;
  files: {
    filename: string;
    mimetype: string;
    size: number;
    s3Link: string;
    status: 'Accepted' | 'Rejected' | 'Pending';
    reason?: string;
    aiSummary: IDocumentValidation;
  }[];
  onClose: () => void;
  onDeleteFile?: (fileName: string, validationDocId?: string) => Promise<void>;
};

export default function DocumentSummaryDialog({
  open,
  files,
  onClose,
  onDeleteFile,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState<"Accepted" | "Rejected" | null>(null);
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    file: typeof files[0];
    idx: number;
  } | null>(null);
  useEffect(() => {
    if (open && files.length > 0) {
      const file = files[selectedIndex];
      if (file.status === "Accepted" || file.status === "Rejected") {
        setStatus(file.status);
      } else {
        setStatus(null);
      }
      setReason(file.reason || "");
    }
  }, [open, selectedIndex, files]);

  useEffect(() => {
    if (!open) {
      setStatus(null);
      setReason("");
      setDeleting(null);
      setConfirmDelete(null);
    }
  }, [open]);

  if (!open) return null;

  const selectedFile = files[selectedIndex];
  const ai = selectedFile?.aiSummary;

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    const { file, idx } = confirmDelete;
    setConfirmDelete(null);
    setDeleting(file.filename);

    try {
      if (onDeleteFile) {
        await onDeleteFile(file.filename, file.aiSummary?._id);
      } else {
        const queryParams = new URLSearchParams({
          fileName: file.filename,
          actionItemId: file.aiSummary?.actionItemId || '',
          validationDocId: file.aiSummary?._id || '',
        }).toString();
        await httpClient.delete(`esgdd/escap/delete-file-esgcap?${queryParams}`);
      }

      toast.success("Document deleted");
      window.location.reload();
      if (files.length === 1) {
        onClose();
      } else {
        const newIndex = idx === selectedIndex ? Math.max(0, idx - 1) : selectedIndex;
        setSelectedIndex(newIndex);
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.message || "Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  const handleView = async (doc: { filename: string; s3Link: string }) => {
    try {
      const getSignedUrl = await httpClient.get(
        'esgdd/escap/uploaded/evidence-files/signed-urls?key=' + doc.filename
      );
      if (getSignedUrl.data) {
        window.open(getSignedUrl.data['signedUrl']);
      }
    } catch (error) {
      console.error("View error:", error);
      toast("Failed to view document");
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-lg font-semibold">No Documents Found</p>
          <p className="text-sm text-gray-500 mt-2">
            There are no uploaded documents for this item.
          </p>
          <button onClick={onClose} className="mt-4 px-4 py-2 border rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Modal Backdrop – click outside closes */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        {/* Modal Content – prevents closing when clicking inside */}
        <div
          className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl flex relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* LEFT PANEL */}
          <div className="w-1/3 border-r p-4 overflow-y-auto" style={{ textAlign: "left" }}>
            <p className="font-semibold mb-3">Documents</p>
            {files.map((file, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
                  idx === selectedIndex
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div onClick={() => setSelectedIndex(idx)} className="flex-1">
                  <div className="relative group max-w-[200px]">
                    <p className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {file.filename}
                    </p>
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded z-50 whitespace-nowrap">
                      {file.filename}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{file.status || "Pending"}</p>
                  {file.reason && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      Reason: {file.reason}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(file);
                    }}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="View Document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete({ file, idx });
                    }}
                    disabled={deleting === file.filename}
                    className="p-2 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                    title="Delete Document"
                  >
                    {deleting === file.filename ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="w-2/3 p-6 overflow-y-auto" style={{ textAlign: "left" }}>
            <h2 className="text-lg font-semibold">{selectedFile?.filename}</h2>
            {ai && (
              <>
                {/* <div className="border border-red-300 bg-red-50 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-red-700">
                    {ai.valid ? "✅ Validation Passed" : "⚠️ Validation Failed"}
                  </p>
                  <div className="mt-2 text-sm space-y-1">
                    <p><b>Overall Score:</b> {ai.overallScore ?? "-"}%</p>
                    <p><b>Improvement Needed:</b> {ai.improvementPercentage ?? "-"}%</p>
                    <p><b>Confidence:</b> {ai.confidence ?? "-"}%</p>
                  </div>
                </div>
                {ai.scores && (
                  <div className="border rounded-xl p-4 mt-4 bg-gray-50">
                    <p className="font-semibold mb-2">Score Breakdown</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(ai.scores).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}</span>
                          <span>{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {ai.missingSections?.length ? (
                  <div className="mt-4">
                    <p className="text-red-600 font-semibold mb-2">Missing Sections</p>
                    <div className="flex flex-wrap gap-2">
                      {ai.missingSections.map((sec, i) => (
                        <span key={i} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          {sec.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {ai.issues?.length ? (
                  <div className="mt-4">
                    <p className="font-semibold">Issues</p>
                    <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
                      {ai.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ) : null} */}
                {ai.suggestedImprovements?.length ? (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Suggested Improvements</p>
                    <div className="space-y-2">
                      {ai.suggestedImprovements.map((imp, i) => (
                        <div key={i} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between">
                            <p className="font-medium">{imp.section}</p>
                            <span className="text-xs text-red-600">{imp.priority}</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{imp.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            )}
            <div className="mt-6 border-t pt-4">
              <p className="font-semibold mb-2">Status</p>
              <div className="flex gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  status === "Accepted" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  ✅ Accepted
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                }`}>
                  🔄 Re-Submit 
                </span>
              </div>
              {status === "Rejected" && (
                <textarea
                  className="w-full mt-3 border rounded-lg p-2"
                  placeholder="Enter reason..."
                  disabled
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" style={{ textAlign: "left" }}>
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{confirmDelete.file.filename}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}