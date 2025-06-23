
import React, { useState } from 'react';
import { produce } from 'immer';

const CommonQuestion = ({
  options,
  selectedValues,
  setSelectedValues,
  errors,
  setErrors
}) => {
  const [fileSizeError, setFileSizeError] = useState('');

  const handleRadioChange = (value) => {
    setSelectedValues(
      produce((draft) => {
        draft[options.id].answer = value;
        draft[options.id].file = null;
      })
    );

    if (errors[options.id]) {
      setErrors(
        produce((draft) => {
          delete draft[options.id];
        })
      );
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    let totalSize = 0;

    files.forEach(file => {
      totalSize += file.size;
    });

    if (totalSize > 50 * 1024 * 1024) {
      setFileSizeError('Total file size exceeds 50 MB');
      return;
    }

    setSelectedValues(
      produce((draft) => {
        draft[options.id].file = files;
        draft[options.id].fileChange = true;
      })
    );

    setFileSizeError('');
  };

  const handleInputChange = (e) => {
    const { value } = e.target;

    setSelectedValues(
      produce((draft) => {
        draft[options.id].reason = value;
      })
    );
  };

  const field = selectedValues[options.id];

  return (
    <div className="mb-6">
      <h4>{options.questions}</h4>

      {/* Radio Buttons */}
      <div className="flex gap-4 mb-3">
        <button
          type="button"
          onClick={() => handleRadioChange("yes")}
          className={`px-4 py-2 border rounded ${field.answer === "yes" ? "bg-blue-100 border-blue-500" : ""}`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => handleRadioChange("no")}
          className={`px-4 py-2 border rounded ${field.answer === "no" ? "bg-blue-100 border-blue-500" : ""}`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => handleRadioChange("not-applicable")}
          className={`px-4 py-2 border rounded ${field.answer === "not-applicable" ? "bg-blue-100 border-blue-500" : ""}`}
        >
          Not Applicable
        </button>
      </div>

      {/* Conditional Fields */}
      {field.answer === "yes" && (
        <div className="mb-3">
          <input type="file" multiple onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg" />
          {fileSizeError && <p className="text-red-500 text-sm mt-1">{fileSizeError}</p>}
          <p className="text-xs text-gray-500">Max 50MB</p>
        </div>
      )}

      {(field.answer === "no" || field.answer === "not-applicable") && (
        <div className="mb-3">
          <textarea
            value={field.reason}
            onChange={handleInputChange}
            placeholder="Enter reason..."
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {/* Show existing uploaded files */}
      {Array.isArray(field.file_path) &&
        field.file_path.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
            View Existing File {i + 1}
          </a>
        ))}

      {/* Error message */}
      {errors[options.id] && <p className="text-red-500 text-sm mt-1">{errors[options.id]}</p>}
    </div>
  );
};

export default CommonQuestion;