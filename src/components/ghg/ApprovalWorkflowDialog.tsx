import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApprovalWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityDataId: string;
  sourceInfo?: {
    source_name: string;
    period_name: string;
    activity_value: number;
    activity_unit: string;
  };
  onSuccess?: () => void;
}

export const ApprovalWorkflowDialog: React.FC<ApprovalWorkflowDialogProps> = ({
  open,
  onOpenChange,
  activityDataId,
  sourceInfo,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [activityData, setActivityData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (open) {
      loadActivityData();
      loadUserProfile();
    }
  }, [open, activityDataId]);

  const loadActivityData = async () => {
    try {
    //   const { data, error } = await supabase
    //     .from('ghg_activity_data')
    //     .select(`
    //       *,
    //       ghg_sources (
    //         source_name,
    //         assigned_verifiers
    //       )
    //     `)
    //     .eq('id', activityDataId)
    //     .single();

    //   if (error) throw error;
    let data=[]
      setActivityData(data);
    } catch (error: any) {
      console.error('Error loading activity data:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) return;

    //   const { data, error } = await supabase
    //     .from('user_profiles')
    //     .select('*')
    //     .eq('user_id', user.id)
    //     .single();

    //   if (error) throw error;4
    let data=[]
      setUserProfile(data);
    } catch (error: any) {
      console.error('Error loading user profile:', error);
    }
  };

  const canVerify = () => {
    if (!activityData || !userProfile) return false;
    
    const assignedVerifiers = activityData.ghg_sources?.assigned_verifiers || [];
    return assignedVerifiers.includes(userProfile.user_id);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) throw new Error('User not authenticated');

    //   // Update status to verified
    //   const { error } = await supabase
    //     .from('ghg_activity_data')
    //     .update({
    //       status: 'verified',
    //       verified_by: user.id,
    //       verified_at: new Date().toISOString(),
    //       notes: comment ? `${activityData.notes || ''}\n\n[Verifier Comment]: ${comment}` : activityData.notes,
    //     })
    //     .eq('id', activityDataId);

    //   if (error) throw error;

      toast({
        title: "Data Approved",
        description: "Activity data has been verified and approved.",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) throw new Error('User not authenticated');

    //   // Update status back to pending with comments
    //   const { error } = await supabase
    //     .from('ghg_activity_data')
    //     .update({
    //       status: 'pending',
    //       notes: `${activityData.notes || ''}\n\n[REJECTED - ${new Date().toLocaleDateString()}]: ${comment}`,
    //     })
    //     .eq('id', activityDataId);

    //   if (error) throw error;

      toast({
        title: "Data Rejected",
        description: "Activity data has been sent back for revision.",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <Badge variant="outline" className="bg-gray-100"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>,
      submitted: <Badge variant="outline" className="bg-yellow-100"><Clock className="h-3 w-3 mr-1" /> Submitted</Badge>,
      verified: <Badge variant="outline" className="bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>,
      approved: <Badge variant="outline" className="bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>,
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (!activityData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review & Approve Activity Data</DialogTitle>
          <DialogDescription>
            Verify the accuracy of submitted activity data before approval
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Current Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Current Status</span>
              {getStatusBadge(activityData.status)}
            </div>

            {/* Data Summary */}
            <div className="space-y-4">
              <h4 className="font-semibold">Data Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Source</Label>
                  <p className="text-sm font-medium">{activityData.ghg_sources?.source_name || sourceInfo?.source_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Period</Label>
                  <p className="text-sm font-medium">{activityData.period_name || sourceInfo?.period_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Activity Value</Label>
                  <p className="text-sm font-medium">
                    {activityData.activity_value || sourceInfo?.activity_value} {activityData.activity_unit || sourceInfo?.activity_unit}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Calculated Emissions</Label>
                  <p className="text-sm font-medium">{activityData.calculated_emissions?.toFixed(2)} tCO2e</p>
                </div>
              </div>

              {activityData.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <p className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">{activityData.notes}</p>
                </div>
              )}

              {activityData.evidence_urls && activityData.evidence_urls.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Evidence Files</Label>
                  <div className="space-y-1 mt-2">
                    {activityData.evidence_urls.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline block"
                      >
                        Evidence {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verification Comment */}
            {canVerify() && activityData.status === 'submitted' && (
              <div className="space-y-2">
                <Label htmlFor="comment">Verifier Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add comments about the verification or reasons for rejection..."
                  rows={4}
                />
              </div>
            )}

            {!canVerify() && (
              <Alert>
                <AlertDescription>
                  You are not assigned as a verifier for this source. Only designated verifiers can approve this data.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          {canVerify() && activityData.status === 'submitted' ? (
            <>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={loading}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Request Changes
              </Button>
              <Button
                onClick={handleApprove}
                disabled={loading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve & Verify
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};