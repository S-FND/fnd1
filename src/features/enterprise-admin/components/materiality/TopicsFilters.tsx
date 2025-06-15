
import React from 'react';

type Framework = 'SASB' | 'GRI' | 'Custom';

interface TopicsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFrameworks: Framework[];
  onFrameworkChange: (frameworks: Framework[]) => void;
}

const TopicsFilters: React.FC<TopicsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  activeFrameworks,
  onFrameworkChange
}) => {
  const handleFrameworkToggle = (framework: Framework) => {
    if (activeFrameworks.includes(framework)) {
      onFrameworkChange(activeFrameworks.filter(f => f !== framework));
    } else {
      onFrameworkChange([...activeFrameworks, framework]);
    }
  };

  return (
    <div className="mt-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full px-3 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">Frameworks:</span>
        {(['SASB', 'GRI', 'Custom'] as Framework[]).map(framework => (
          <label key={framework} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFrameworks.includes(framework)}
              onChange={() => handleFrameworkToggle(framework)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">{framework}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TopicsFilters;
