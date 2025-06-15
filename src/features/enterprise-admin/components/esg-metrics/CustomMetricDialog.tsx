
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomMetricForm {
  name: string;
  description: string;
  unit: string;
  dataType: 'Numeric' | 'Percentage' | 'Text' | 'Boolean';
}

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

interface CustomMetricDialogProps {
  isEdit: boolean;
  selectedTopic: MaterialTopic | undefined;
  customMetricForm: CustomMetricForm;
  setCustomMetricForm: React.Dispatch<React.SetStateAction<CustomMetricForm>>;
  onSave: () => void;
  onCancel: () => void;
}

const CustomMetricDialog: React.FC<CustomMetricDialogProps> = ({
  isEdit,
  selectedTopic,
  customMetricForm,
  setCustomMetricForm,
  onSave,
  onCancel
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Metric' : 'Add Custom Metric'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Modify the metric details' : `Create a custom metric for ${selectedTopic?.name}`}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Metric Name *</label>
          <Input 
            value={customMetricForm.name} 
            onChange={(e) => setCustomMetricForm(prev => ({...prev, name: e.target.value}))} 
            placeholder="Enter metric name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input 
            value={customMetricForm.description} 
            onChange={(e) => setCustomMetricForm(prev => ({...prev, description: e.target.value}))} 
            placeholder="Describe the metric"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit of Measurement</label>
          <Input 
            value={customMetricForm.unit} 
            onChange={(e) => setCustomMetricForm(prev => ({...prev, unit: e.target.value}))} 
            placeholder="e.g., kg, %, hours, USD"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Type</label>
          <Select 
            value={customMetricForm.dataType} 
            onValueChange={(value: any) => setCustomMetricForm(prev => ({...prev, dataType: value}))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Numeric">Numeric</SelectItem>
              <SelectItem value="Percentage">Percentage</SelectItem>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Boolean">Yes/No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEdit ? 'Save Changes' : 'Add Metric'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default CustomMetricDialog;
