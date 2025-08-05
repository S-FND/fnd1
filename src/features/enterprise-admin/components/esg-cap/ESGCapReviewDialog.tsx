import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ESGCapItem, ESGCapStatus, ESGCapPriority, ESGCategory, ESGCapDealCondition } from '../../types/esgDD';
import { Upload, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ESGCapReviewDialogProps {
  item: ESGCapItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: ESGCapItem) => void;
}

export const ESGCapReviewDialog: React.FC<ESGCapReviewDialogProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState<ESGCapItem>(item);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [actualCompletionDate, setActualCompletionDate] = useState<string>(
    item.status === 'completed' ? new Date().toISOString().split('T')[0] : ''
  );
  const { toast } = useToast();

  const isAccepted = item.status === 'completed';
  
  const handleInputChange = (field: keyof ESGCapItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been selected as proof of completion.`,
      });
    }
  };

  const handleRequestChange = () => {
    onUpdate(formData);
    toast({
      title: "CAP Change Requested",
      description: "Your changes have been submitted for review.",
    });
    onClose();
  };

  const handleAcceptCAP = () => {
    const updatedItem = {
      ...formData,
      status: 'completed' as ESGCapStatus
    };
    onUpdate(updatedItem);
    toast({
      title: "CAP Accepted",
      description: "The corrective action plan item has been accepted and frozen.",
    });
    onClose();
  };

  const handleSave = () => {
    onUpdate(formData);
    toast({
      title: "Changes saved",
      description: "The CAP item has been updated successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review CAP Item</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue">Issue *</Label>
              <Input
                id="issue"
                value={formData.issue}
                onChange={(e) => handleInputChange('issue', e.target.value)}
                disabled={isAccepted}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ESGCategory) => handleInputChange('category', value)}
                disabled={isAccepted}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isAccepted}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="recommendation">Recommendation</Label>
            <Textarea
              id="recommendation"
              value={formData.recommendation}
              onChange={(e) => handleInputChange('recommendation', e.target.value)}
              disabled={isAccepted}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ESGCapPriority) => handleInputChange('priority', value)}
                disabled={isAccepted}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dealCondition">Deal Condition</Label>
              <Select
                value={formData.dealCondition}
                onValueChange={(value: ESGCapDealCondition) => handleInputChange('dealCondition', value)}
                disabled={isAccepted}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CP">Condition Precedent (CP)</SelectItem>
                  <SelectItem value="CS">Condition Subsequent (CS)</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo || ''}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                disabled={isAccepted}
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                disabled={isAccepted}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ESGCapStatus) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.status === 'completed' || isAccepted) && (
              <div>
                <Label htmlFor="actualDate">Actual Completion Date</Label>
                <Input
                  id="actualDate"
                  type="date"
                  value={actualCompletionDate}
                  onChange={(e) => setActualCompletionDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <Label>Proof of Completion</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <label htmlFor="proof-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-muted-foreground">
                      Upload proof of completion
                    </span>
                    <input
                      id="proof-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
                {proofFile && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{proofFile.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};