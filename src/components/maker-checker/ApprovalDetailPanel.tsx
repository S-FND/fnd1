import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMakerChecker } from '@/hooks/useMakerChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DiffViewer } from './DiffViewer';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ApprovalHistory } from '@/types/maker-checker';

export const ApprovalDetailPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<ApprovalHistory[]>([]);
  
  const { requests, loading, processApproval, getApprovalHistory, calculateDiff } = useMakerChecker();
  
  const request = requests.find(r => r.id === id);

  useEffect(() => {
    if (id) {
      getApprovalHistory(id).then(setHistory);
    }
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject' | 'request_change') => {
    if (!id) return;
    
    if (!comment.trim() && action !== 'approve') {
      toast.error('Please provide a comment for this action');
      return;
    }

    setProcessing(true);
    try {
      await processApproval({
        request_id: id,
        action,
        comment: comment.trim() || undefined
      });
      
      toast.success(`Request ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'revision requested'} successfully`);
      navigate('/approval-inbox');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process approval');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request Not Found</h3>
            <p className="text-muted-foreground mb-4">The approval request you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/approval-inbox')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inbox
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const differences = calculateDiff(request);
  const isOverdue = request.due_at ? new Date(request.due_at) < new Date() : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/approval-inbox')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>
        {isOverdue && (
          <Badge variant="destructive" className="gap-1">
            <Clock className="h-3 w-3" />
            Overdue
          </Badge>
        )}
      </div>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>{request.record_type}</CardTitle>
              <CardDescription>
                Module: {request.module} • Priority: {request.priority}
              </CardDescription>
            </div>
            <Badge variant={
              request.status === 'approved' ? 'default' :
              request.status === 'rejected' ? 'destructive' :
              'secondary'
            }>
              {request.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Submitted:</span>
              <span className="ml-2 font-medium">
                {request.submitted_at ? formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true }) : 'Not submitted'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Due:</span>
              <span className={`ml-2 font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                {request.due_at ? formatDistanceToNow(new Date(request.due_at), { addSuffix: true }) : 'No deadline'}
              </span>
            </div>
          </div>
          
          {request.change_summary && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Change Summary</h4>
                <p className="text-sm text-muted-foreground">{request.change_summary}</p>
              </div>
            </>
          )}

          {request.materiality_flag && (
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">Material Change - Requires careful review</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diff Viewer */}
      <DiffViewer differences={differences} />

      {/* Evidence */}
      {request.evidence_urls && request.evidence_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supporting Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {request.evidence_urls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded hover:bg-muted/50 transition-colors text-sm"
                >
                  📎 Evidence {index + 1}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{entry.action}</span>
                      <Badge variant="outline" className="text-xs">{entry.actor_role}</Badge>
                    </div>
                    {entry.comment && (
                      <p className="text-sm text-muted-foreground mb-2">{entry.comment}</p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Panel */}
      {(request.status === 'pending_review' || request.status === 'in_review') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review Actions</CardTitle>
            <CardDescription>Provide your review decision and comments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comments</label>
              <Textarea
                placeholder="Add your review comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAction('approve')}
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction('request_change')}
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                Request Changes
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction('reject')}
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
