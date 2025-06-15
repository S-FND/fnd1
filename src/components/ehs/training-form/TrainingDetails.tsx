
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingFormData } from './types';

interface TrainingDetailsProps {
  formData: TrainingFormData;
  updateFormData: (updates: Partial<TrainingFormData>) => void;
}

export const TrainingDetails: React.FC<TrainingDetailsProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="trainingType" className="block text-sm font-medium mb-1">Training Type</label>
        <Select 
          value={formData.trainingType} 
          onValueChange={(value: 'online' | 'offline') => updateFormData({ trainingType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select training type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online (LMS based)</SelectItem>
            <SelectItem value="offline">Offline (In-Person)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration</label>
        <Input
          id="duration"
          placeholder="e.g. 2 days, 4 hours"
          value={formData.duration}
          onChange={(e) => updateFormData({ duration: e.target.value })}
        />
      </div>

      {formData.trainingType === "offline" && (
        <div className="md:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
          <Input
            id="location"
            placeholder="Enter training location"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};
