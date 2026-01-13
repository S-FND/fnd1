import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Building2, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { GHGScopeItem } from '@/pages/VerifierApprovalsPage';

interface ApprovalItem {
  _id: string;
  type: 'ghg_activity' | 'esms_document' | 'esg_metric' | 'esg_dd' | 'sdg';
  module: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedByName?: string;
  submittedAt: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  facility?: string;
  scope?: string;
  category?: string;
  dueDate?: string;
  link?: string;
  assignedVerifierId?: string;
  assignedVerifierName?: string;
  dataCollectionId?: string;
  activityDataValue?: string;
}

interface ReviewApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ApprovalItem | GHGScopeItem | null;
  onApprove: (itemId: string, dataCollectionId: string, comment: string) => Promise<void>;
}

export const ReviewApprovalDialog: React.FC<ReviewApprovalDialogProps> = ({
  open,
  onOpenChange,
  item,
  onApprove,
}) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!item) return;
    
    setLoading(true);
    try {
      await onApprove(item._id, item.dataCollectionId, comment);
      setComment('');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setComment('');
    onOpenChange(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      'GHG': 'bg-orange-100 text-orange-800 border-orange-200',
      'ESG Metrics': 'bg-green-100 text-green-800 border-green-200',
      'ESMS': 'bg-blue-100 text-blue-800 border-blue-200',
      'ESG DD': 'bg-purple-100 text-purple-800 border-purple-200',
      'SDG Metrics': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return colors[module] || 'bg-gray-100 text-gray-800';
  };

  if (!item) return null;
console.log('item-------',item);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Review & Approve Activity Data
          </DialogTitle>
          <DialogDescription>
            Verify the accuracy of submitted activity data before approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Item Details */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={getModuleColor(item.module)}>
                {item.module}
              </Badge>
              <Badge className={getPriorityColor(item['priority'])}>
                {item['priority'].charAt(0).toUpperCase() + item['priority'].slice(1)} Priority
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold text-base">{item.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{item['description']}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {item['facility'] && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{item['facility']}</span>
                </div>
              )}
              {item.scope && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{item.scope}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{item['submittedBy'] || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(item['submittedAt']), 'MMM d, yyyy')}</span>
              </div>
            </div>

            {item['category'] && (
              <div className="text-sm">
                <span className="text-muted-foreground">Category:</span>{' '}
                <span className="font-medium">{item['category']}</span>
              </div>
            )}
            {item['activityDataValue'] && (
              <div className="text-sm">
                <span className="text-muted-foreground">Activity Data Value:</span>{' '}
                <span className="font-medium">{item['activityDataValue']}</span>
              </div>
            )}
          </div>

          {/* Comment Field */}
          <div className="space-y-2">
            <Label htmlFor="approval-comment">Verification Comments (Optional)</Label>
            <Textarea
              id="approval-comment"
              placeholder="Add any comments or notes about this approval..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};