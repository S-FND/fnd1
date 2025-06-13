
import React from 'react';
import { Input } from '@/components/ui/input';
import { TrainingFormData } from './types';

interface TrainingScheduleProps {
  formData: TrainingFormData;
  updateFormData: (updates: Partial<TrainingFormData>) => void;
}

export const TrainingSchedule: React.FC<TrainingScheduleProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => updateFormData({ date: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => updateFormData({ time: e.target.value })}
        />
      </div>
    </div>
  );
};
