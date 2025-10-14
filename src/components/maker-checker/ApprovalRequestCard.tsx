import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApprovalRequest } from '@/types/maker-checker';
import { formatDistanceToNow } from 'date-fns';
import { Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ApprovalRequestCardProps {
  request: ApprovalRequest;
  onView: (request: ApprovalRequest) => void;
  onApprove?: (request: ApprovalRequest) => void;
  onReject?: (request: ApprovalRequest) => void;
  showActions?: boolean;
}

const STATUS_CONFIG = {
  draft: { label: 'Draft', variant: 'secondary' as const, icon: Clock },
  pending_review: { label: 'Pending Review', variant: 'default' as const, icon: Clock },
  in_review: { label: 'In Review', variant: 'default' as const, icon: Clock },
  approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle2 },
  published: { label: 'Published', variant: 'default' as const, icon: CheckCircle2 },
  rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
  revision_requested: { label: 'Revision Requested', variant: 'secondary' as const, icon: AlertCircle }
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', variant: 'secondary' as const },
  medium: { label: 'Medium', variant: 'default' as const },
  high: { label: 'High', variant: 'default' as const },
  critical: { label: 'Critical', variant: 'destructive' as const }
};

const MODULE_LABELS: Record<string, string> = {
  esg_metrics: 'ESG Metrics',
  esg_cap: 'ESG CAP',
  ghg_accounting: 'GHG Accounting',
  brsr_report: 'BRSR Report',
  esg_dd: 'ESG Due Diligence'
};

export const ApprovalRequestCard: React.FC<ApprovalRequestCardProps> = ({
  request,
  onView,
  onApprove,
  onReject,
  showActions = false
}) => {
  const statusConfig = STATUS_CONFIG[request.status];
  const priorityConfig = PRIORITY_CONFIG[request.priority];
  const StatusIcon = statusConfig.icon;

  const isOverdue = request.due_at && new Date(request.due_at) < new Date() && 
    (request.status === 'pending_review' || request.status === 'in_review');

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{MODULE_LABELS[request.module]}</Badge>
            <Badge variant={statusConfig.variant}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
            <Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>
            {request.materiality_flag && (
              <Badge variant="destructive">Material</Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>

          <div>
            <p className="font-medium text-sm">{request.record_type}</p>
            {request.change_summary && (
              <p className="text-sm text-muted-foreground mt-1">{request.change_summary}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {request.submitted_at && (
              <span>
                Submitted {formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })}
              </span>
            )}
            {request.due_at && (
              <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                Due {formatDistanceToNow(new Date(request.due_at), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(request)}>
            View
          </Button>
          {showActions && (request.status === 'pending_review' || request.status === 'in_review') && (
            <>
              {onApprove && (
                <Button size="sm" variant="default" onClick={() => onApprove(request)}>
                  Approve
                </Button>
              )}
              {onReject && (
                <Button size="sm" variant="destructive" onClick={() => onReject(request)}>
                  Reject
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
