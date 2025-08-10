
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface CustomMetricForm {
  name: string;
  description: string;
  unit: string;
  dataType: 'Numeric' | 'Percentage' | 'Text' | 'Boolean' | 'Dropdown' | 'Radio' | 'Table';
  collectionFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually';
  showOnDashboard: boolean;
  inputFormat: {
    options: string[];
    tableColumns: string[];
    tableRows: number;
  };
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
  const addOption = () => {
    setCustomMetricForm(prev => ({
      ...prev,
      inputFormat: {
        ...prev.inputFormat,
        options: [...prev.inputFormat.options, '']
      }
    }));
  };

  const removeOption = (index: number) => {
    setCustomMetricForm(prev => ({
      ...prev,
      inputFormat: {
        ...prev.inputFormat,
        options: prev.inputFormat.options.filter((_, i) => i !== index)
      }
    }));
  };

  const updateOption = (index: number, value: string) => {
    setCustomMetricForm(prev => ({
      ...prev,
      inputFormat: {
        ...prev.inputFormat,
        options: prev.inputFormat.options.map((option, i) => i === index ? value : option)
      }
    }));
  };

  const addTableColumn = () => {
    setCustomMetricForm(prev => ({
      ...prev,
      inputFormat: {
        ...prev.inputFormat,
        tableColumns: [...prev.inputFormat.tableColumns, '']
      }
    }));
  };

  const removeTableColumn = (index: number) => {
    setCustomMetricForm(prev => ({
      ...prev,
      inputFormat: {
        ...prev.inputFormat,
        tableColumns: prev.inputFormat.tableColumns.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTableColumn = (index: number, value: string) => {
    setCustomMetricForm(prev => ({
      ...prev,
      inputFormat: {
        ...prev.inputFormat,
        tableColumns: prev.inputFormat.tableColumns.map((column, i) => i === index ? value : column)
      }
    }));
  };

  const showInputFormatConfig = ['Dropdown', 'Radio', 'Table'].includes(customMetricForm.dataType);

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
          <Textarea 
            value={customMetricForm.description} 
            onChange={(e) => setCustomMetricForm(prev => ({...prev, description: e.target.value}))} 
            placeholder="Describe the metric"
            rows={3}
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
              <SelectItem value="Dropdown">Dropdown</SelectItem>
              <SelectItem value="Radio">Radio Buttons</SelectItem>
              <SelectItem value="Table">Table</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Collection Frequency</label>
          <Select 
            value={customMetricForm.collectionFrequency} 
            onValueChange={(value: any) => setCustomMetricForm(prev => ({...prev, collectionFrequency: value}))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Bi-Annually">Bi-Annually</SelectItem>
              <SelectItem value="Annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Show on Dashboard</label>
          <RadioGroup 
            value={customMetricForm.showOnDashboard ? "yes" : "no"} 
            onValueChange={(value) => setCustomMetricForm(prev => ({...prev, showOnDashboard: value === "yes"}))}
            className="flex flex-row gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="dashboard-yes" />
              <label htmlFor="dashboard-yes" className="text-sm">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="dashboard-no" />
              <label htmlFor="dashboard-no" className="text-sm">No</label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-1">
            Choose whether this metric should be displayed as a graph on the ESG dashboard
          </p>
        </div>
        
        {/* Input Format Configuration */}
        {showInputFormatConfig && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-sm">Input Format Configuration</h4>
            
            {(customMetricForm.dataType === 'Dropdown' || customMetricForm.dataType === 'Radio') && (
              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <div className="space-y-2">
                  {customMetricForm.inputFormat.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
            
            {customMetricForm.dataType === 'Table' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Table Columns</label>
                  <div className="space-y-2">
                    {customMetricForm.inputFormat.tableColumns.map((column, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={column}
                          onChange={(e) => updateTableColumn(index, e.target.value)}
                          placeholder={`Column ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTableColumn(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTableColumn}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Column
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Rows</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={customMetricForm.inputFormat.tableRows}
                    onChange={(e) => setCustomMetricForm(prev => ({
                      ...prev,
                      inputFormat: {
                        ...prev.inputFormat,
                        tableRows: parseInt(e.target.value) || 1
                      }
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
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
