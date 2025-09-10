import React from 'react';

interface HighlightDiffProps {
  current: string;
  original?: string;
}

export const HighlightDiff = ({ current, original }: HighlightDiffProps) => {
  if (!original || current === original) {
    return <span>{current}</span>;
  }

  return (
    <span className="relative group">
      <span className="text-green-600 bg-green-50 px-1 rounded">{current}</span>
      <span className="absolute hidden group-hover:block -bottom-6 left-0 text-xs text-red-600 line-through bg-red-50 px-1 rounded whitespace-nowrap z-10">
        {original}
      </span>
    </span>
  );
};