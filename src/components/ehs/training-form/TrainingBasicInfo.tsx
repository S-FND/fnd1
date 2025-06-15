
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TrainingFormData } from './types';

interface TrainingBasicInfoProps {
  formData: TrainingFormData;
  updateFormData: (updates: Partial<TrainingFormData>) => void;
}

export const TrainingBasicInfo: React.FC<TrainingBasicInfoProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Training Name</label>
          <Input
            id="name"
            placeholder="Enter training name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
        </div>
        
        <div>
          <label htmlFor="clientCompany" className="block text-sm font-medium mb-1">Client Company</label>
          <Input
            id="clientCompany"
            placeholder="Enter client company name"
            value={formData.clientCompany}
            onChange={(e) => updateFormData({ clientCompany: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          id="description"
          placeholder="Enter training description"
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
      </div>
    </div>
  );
};
