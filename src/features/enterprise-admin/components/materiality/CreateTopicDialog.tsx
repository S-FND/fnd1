
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

interface CreateTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (topic: MaterialTopic) => void;
}

const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    businessImpact: 5,
    sustainabilityImpact: 5
  });

  const handleCreate = () => {
    if (formData.name && formData.description && formData.category) {
      const newTopic: MaterialTopic = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        businessImpact: formData.businessImpact,
        sustainabilityImpact: formData.sustainabilityImpact,
        framework: 'Custom',
        color: getCategoryColor(formData.category)
      };
      onCreate(newTopic);
      setFormData({
        name: '',
        category: '',
        description: '',
        businessImpact: 5,
        sustainabilityImpact: 5
      });
      onClose();
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Environment': '#22c55e',
      'Social': '#60a5fa',
      'Governance': '#f59e0b'
    };
    return colors[category] || '#94a3b8';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Material Topic</DialogTitle>
          <DialogDescription>
            Add a new custom material topic to your assessment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter topic name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Governance">Governance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the material topic"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="businessImpact">Business Impact (1-10)</Label>
              <Input
                id="businessImpact"
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={formData.businessImpact}
                onChange={(e) => setFormData({ ...formData, businessImpact: parseFloat(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sustainabilityImpact">Sustainability Impact (1-10)</Label>
              <Input
                id="sustainabilityImpact"
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={formData.sustainabilityImpact}
                onChange={(e) => setFormData({ ...formData, sustainabilityImpact: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!formData.name || !formData.category || !formData.description}>
            Create Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
