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
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: ESGCapItem) => void;
  buttonEnabled?: boolean;
}

export const ESGCapReviewDialog: React.FC<ESGCapReviewDialogProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate,
  buttonEnabled
}) => {
  const [formData, setFormData] = useState<any>(item);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const { toast } = useToast();

  const isAccepted = item.status === 'completed';

  const handleInputChange = (field: keyof any, value: any) => {
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review CAP Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 1. Item */}
          <div>
            <Label htmlFor="item">Item *</Label>
            <Textarea
              id="item"
              value={formData.item}
              onChange={(e) => handleInputChange('item', e.target.value)}
              disabled={isAccepted}
              rows={3}
              placeholder="Enter CAP item description"
            />
          </div>

          {/* 2. Category & 3. Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ESGCategory) => handleInputChange('category', value)}
                disabled={isAccepted}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ESGCapPriority) => handleInputChange('priority', value)}
                disabled={isAccepted}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Issue & 5. Related Finding */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue">Issue</Label>
              <Textarea
                id="issue"
                value={formData.issue || ''}
                onChange={(e) => handleInputChange('issue', e.target.value)}
                disabled={isAccepted}
                rows={3}
                placeholder="Describe the issue"
              />
            </div>
            <div>
              <Label htmlFor="relatedFinding">Related Finding</Label>
              <Textarea
                id="relatedFinding"
                value={formData.relatedFinding || ''}
                onChange={(e) => handleInputChange('relatedFinding', e.target.value)}
                disabled={isAccepted}
                rows={3}
                placeholder="Related audit findings"
              />
            </div>
          </div>

          {/* 6. ESG Lever */}
          {/* <div>
            <Label htmlFor="esgLever">ESG Lever</Label>
            <Input
              id="esgLever"
              value={formData.esgLever || ''}
              onChange={(e) => handleInputChange('esgLever', e.target.value)}
              disabled={isAccepted}
              placeholder="e.g., Policy, Training, Technology"
            />
          </div> */}

          {/* 7. Measures */}
          <div>
            <Label htmlFor="measures">Measures & Corrective Actions *</Label>
            <Textarea
              id="measures"
              value={formData.measures}
              onChange={(e) => handleInputChange('measures', e.target.value)}
              disabled={isAccepted}
              rows={3}
              placeholder="Describe the corrective actions to be taken"
            />
          </div>

          {/* 8. Resource & 9. Deliverable */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resource">Resource & Responsibility</Label>
              <Textarea
                id="resource"
                value={formData.resource || ''}
                onChange={(e) => handleInputChange('resource', e.target.value)}
                disabled={isAccepted}
                rows={2}
                placeholder="Who is responsible?"
              />
            </div>
            <div>
              <Label htmlFor="deliverable">Expected Deliverable</Label>
              <Textarea
                id="deliverable"
                value={formData.deliverable || ''}
                onChange={(e) => handleInputChange('deliverable', e.target.value)}
                disabled={isAccepted}
                rows={2}
                placeholder="What will be delivered?"
              />
            </div>
          </div>

          {/* 10. Timeline Month & 11. Target Date & 12. Actual Date */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timelineMonth">Timeline (Months)</Label>
              <Input
                id="timelineMonth"
                type="number"
                min="0"
                value={formData.timelineMonth || ''}
                onChange={(e) => handleInputChange('timelineMonth', e.target.value ? Number(e.target.value) : undefined)}
                disabled={isAccepted}
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate || ''}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                disabled={isAccepted}
              />
            </div>
            <div>
              <Label htmlFor="actualDate">Actual Date</Label>
              <Input
                id="actualDate"
                type="date"
                value={formData.actualDate || ''}
                onChange={(e) => handleInputChange('actualDate', e.target.value)}
              />
            </div>
          </div>

          {/* 13. CP/CS & 14. Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="CS">CP/CS</Label>
              <Select
                value={formData.CS}
                onValueChange={(value: ESGCapDealCondition) => handleInputChange('CS', value)}
                disabled={isAccepted}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CP">CP</SelectItem>
                  <SelectItem value="CS">CS</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ESGCapStatus) => handleInputChange('status', value)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 15. Current Status Update */}
          <div>
            <Label htmlFor="statusUpdate">Current Status Update</Label>
            <Textarea
              id="statusUpdate"
              value={formData.statusUpdate || ''}
              onChange={(e) => handleInputChange('statusUpdate', e.target.value)}
              rows={2}
              placeholder="Latest update on this action item"
            />
          </div>

          {/* 16. Review Remarks & 17. Last Review Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviewRemarks">Review Remarks</Label>
              <Textarea
                id="reviewRemarks"
                value={formData.reviewRemarks || ''}
                onChange={(e) => handleInputChange('reviewRemarks', e.target.value)}
                rows={2}
                placeholder="Reviewer comments"
              />
            </div>
            <div>
              <Label htmlFor="lastReviewDate">Last Review Date</Label>
              <Input
                id="lastReviewDate"
                type="date"
                value={formData.lastReviewDate || ''}
                onChange={(e) => handleInputChange('lastReviewDate', e.target.value)}
              />
            </div>
          </div>

          {/* 18. Implementation Support & 19. Closure Verified */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="implementationSupportNeeded">Implementation Support Needed</Label>
              <Textarea
                id="implementationSupportNeeded"
                value={formData.implementationSupportNeeded || ''}
                onChange={(e) => handleInputChange('implementationSupportNeeded', e.target.value)}
                rows={2}
                placeholder="What support is required?"
              />
            </div>
            <div>
              <Label htmlFor="closureVerifiedBy">Closure Verified By</Label>
              <Input
                id="closureVerifiedBy"
                value={formData.closureVerifiedBy || ''}
                onChange={(e) => handleInputChange('closureVerifiedBy', e.target.value)}
                placeholder="Name of verifier"
              />
            </div>
          </div>

          {/* 20. Assigned To & 21. Remarks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo || ''}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                disabled={isAccepted}
                placeholder="Person responsible"
              />
            </div>
          </div>

          {/* Proof of Completion */}
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

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={!buttonEnabled}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!buttonEnabled}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};