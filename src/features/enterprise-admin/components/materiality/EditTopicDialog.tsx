
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
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

interface EditTopicDialogProps {
  topic: MaterialTopic | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: MaterialTopic) => void;
}

const EditTopicDialog: React.FC<EditTopicDialogProps> = ({ topic, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<MaterialTopic>>({});

  React.useEffect(() => {
    if (topic) {
      setFormData(topic);
    }
  }, [topic]);

  const handleSave = () => {
    if (topic && formData.name && formData.description && formData.esg) {
      const updatedTopic: MaterialTopic = {
        ...topic,
        name: formData.name,
        description: formData.description,
        esg: formData.esg,
        businessImpact: formData.businessImpact || topic.businessImpact,
        sustainabilityImpact: formData.sustainabilityImpact || topic.sustainabilityImpact,
        color: getCategoryColor(formData.esg)
      };
      onSave(updatedTopic);
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

  if (!topic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Material Topic</DialogTitle>
          <DialogDescription>
            Make changes to the material topic details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.esg || ''} onValueChange={(value) => setFormData({ ...formData, esg: value })}>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                value={formData.businessImpact || ''}
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
                value={formData.sustainabilityImpact || ''}
                onChange={(e) => setFormData({ ...formData, sustainabilityImpact: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTopicDialog;
