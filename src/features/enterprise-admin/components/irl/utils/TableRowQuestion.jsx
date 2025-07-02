// TableRowQuestion.jsx

import React from 'react';
import { produce } from 'immer';

const TableRowQuestion = ({
  op,
  index,
  fieldError,
  selectedValues,
  setSelectedValues,
  errors,
  setErrors,
  operationNameToKeyMap,
  existingFiles,
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
  
    // Update operations state in parent
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
    let totalSize = files.reduce((sum, f) => sum + f.size, 0);

    if (totalSize > 50 * 1024 * 1024) {
      alert("Total file size exceeds 50 MB");
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
  
    // Also update operations.notes
    setOperations(
      produce((draft) => {
        const item = draft.find((item) => item.name === op.name);
        if (item) {
          item.notes = value;
        }
      })
    );
  };

  const handleDeleteFile = (fileIndex, isExistingFile = false) => {
    if (isExistingFile) {
      // For existing files (from server)
      if (onDeleteFile) {
        onDeleteFile(key, fileIndex);
      }
    } else {
      // For newly selected files (not yet uploaded)
      setSelectedValues(
        produce((draft) => {
          draft[key].file = draft[key].file.filter((_, idx) => idx !== fileIndex);
          draft[key].fileChange = true;
        })
      );
    }
  };

  return (
    <tr key={op.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{index + 1}</td>
      <td className="whitespace-nowrap p-3 text-sm font-medium text-gray-900">{op.name}</td>

      {/* Status */}
      <td className="whitespace-nowrap p-3 text-sm text-gray-500">
        <select
          value={field.answer || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-[180px] border rounded px-3 py-2"
        >
          <option value="">Select status</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {fieldError && fieldError.includes('status') && (
          <p className="mt-1 text-xs text-red-500">{fieldError}</p>
        )}
      </td>

      {/* Attachment */}
      <td className="whitespace-nowrap p-3 text-sm text-gray-500">
        <div className="space-y-2">
          <input
            type="file"
            accept=".ppt,.pptx,.pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          {field.file?.map((file, idx) => (
            <p key={idx} className="text-xs text-muted-foreground">
              Selected: {file.name}
            </p>
          ))}
          {existingFiles.map((fileUrl, i) => (
            <div key={`existing-${i}`} className="flex items-center gap-2">
            <a
              key={i}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline text-blue-600 hover:text-blue-800 block"
            >
              View Existing File {i + 1}
            </a>
            {/* <button 
                type="button"
                onClick={() => handleDeleteFile(i, true)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                ×
              </button> */}
            </div>
          ))}
          {fieldError && fieldError.includes('File') && (
            <p className="text-xs text-red-500">{fieldError}</p>
          )}
          <p className="text-xs text-gray-500">Max 50MB</p>
        </div>
      </td>

      {/* Notes */}
      <td className="p-3 text-sm text-gray-500">
        <textarea
          value={field.reason || ""}
          onChange={handleNotesChange}
          placeholder="Enter notes..."
          className="w-full p-2 border rounded min-h-[80px]"
        />
        {fieldError && fieldError.includes('Reason') && (
          <p className="text-xs text-red-500 mt-1">{fieldError}</p>
        )}
      </td>
    </tr>
  );
};

export default TableRowQuestion;