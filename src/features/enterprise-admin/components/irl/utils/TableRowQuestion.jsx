import React from 'react';
import { produce } from 'immer';
import { X } from 'lucide-react';
import { toast } from 'sonner';
const TableRowQuestion = ({
  op,
  index,
  fieldError,
  selectedValues,
  setSelectedValues,
  errors,
  setErrors,
  operationNameToKeyMap,
  existingFiles = [],
  setOperations,
  onDeleteFile
}) => {
  const key = operationNameToKeyMap[op.name];
  const field = selectedValues[key] || {};

  const handleStatusChange = (value) => {
    setSelectedValues(
      produce((draft) => {
        draft[key].answer = value;
        draft[key].file = null; // Reset file if needed
      })
    );
  
    setOperations(
      produce((draft) => {
        const item = draft.find((item) => item.name === op.name);
        if (item) {
          item.status = value;
        }
      })
    );
  
    if (errors[key]) {
      setErrors(
        produce((draft) => {
          delete draft[key];
        })
      );
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 10) {
      toast.error("You can upload a maximum of 10 files.");
      e.target.value = null;
      return;
    }
  
    let totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      toast.error("Total file size exceeds 50 MB");
      e.target.value = null;
      return;
    }
  
    setSelectedValues(
      produce((draft) => {
        draft[key].file = files;
        draft[key].fileChange = true;
      })
    );
  };

  const handleNotesChange = (e) => {
    const { value } = e.target;
  
    setSelectedValues(
      produce((draft) => {
        draft[key].reason = value;
      })
    );
  
    setOperations(
      produce((draft) => {
        const item = draft.find((item) => item.name === op.name);
        if (item) {
          item.notes = value;
        }
      })
    );
  };

  // Helper function to shorten file names
  const shortenFileName = (name) => {
    if (!name) return '';
    if (name.length <= 20) return name;
    return `${name.substring(0, 9)}...${name.substring(name.length - 5)}`;
  };

  return (
    <tr key={op.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{index + 1}</td>
      <td className="whitespace-nowrap p-3 text-sm font-medium text-gray-900">{op.name}</td>

      {/* Status */}
      <td className="whitespace-nowrap p-1 text-sm text-gray-500">
        <select
          value={field.answer || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-[80px] border rounded px-2 py-2 py-1.5"
        >
          <option value="">Select status</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {fieldError && fieldError.includes('Please') && (
          <p className="mt-1 text-xs text-red-500">{fieldError}</p>
        )}
      </td>

      {/* Attachment */}
      <td className="whitespace-nowrap p-3 text-sx text-gray-500 min-w-[220px]">
        <div className={`space-y-1 rounded p-0.5 text-[11px] ${fieldError?.includes('upload') ? 'border-red-500' : 'border-gray-200'
          }`}>
          <input
            type="file"
            accept=".ppt,.pptx,.pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="text-xs"
            multiple
          />

          {/* Existing files */}
          {existingFiles.map((fileUrl, i) => {
            const fileName = fileUrl.split('/').pop() || '';
            return (
              <div key={`existing-${i}`} className="flex items-center gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline text-blue-600 hover:text-blue-800 truncate max-w-[120px]"
                  title={fileName}
                >
                  {shortenFileName(fileName)}
                </a>
                <button
                  type="button"
                  onClick={() => onDeleteFile(i, fileUrl)}
                  className="text-red-500 hover:text-red-700 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          {fieldError && fieldError.includes('upload') && (
            <p className="text-xs text-red-500">{fieldError}</p>
          )}
        </div>
      </td>

      {/* Notes */}
      <td className="p-1 text-sm text-gray-500">
        <textarea
          value={field.reason || ""}
          onChange={handleNotesChange}
          placeholder="Enter notes..."
          className={`w-full p-2 border rounded min-h-[80px] ${fieldError?.includes('reason') ? 'border-red-500' : ''}`}
        />
        {fieldError && fieldError.includes('reason') && (
          <p className="text-xs text-red-500 mt-1">{fieldError}</p>
        )}
      </td>
    </tr>
  );
};

export default TableRowQuestion;