
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Building2 } from 'lucide-react';

interface AssignmentModeSelectorProps {
  assignmentMode: 'individual' | 'unit';
  onModeChange: (mode: 'individual' | 'unit') => void;
}

const AssignmentModeSelector: React.FC<AssignmentModeSelectorProps> = ({
  assignmentMode,
  onModeChange
}) => {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">Assignment Level:</label>
      <Select value={assignmentMode} onValueChange={onModeChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Individual Assignment
            </div>
          </SelectItem>
          <SelectItem value="unit">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Unit Assignment
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssignmentModeSelector;
