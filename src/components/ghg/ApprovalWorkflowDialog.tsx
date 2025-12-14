import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Clock, Loader2, AlertTriangle, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface ApprovalWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityDataId: string | null;
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
  const [dataLoading, setDataLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [activityData, setActivityData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);

  useEffect(() => {
    if (open && activityDataId) {
      setComment('');
      loadActivityData();
      loadUserProfile();
    }
  }, [open, activityDataId]);

  const loadActivityData = async () => {
    if (!activityDataId) return;
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('ghg_activity_data')
        .select(`
          *,
          ghg_sources (
            source_name,
            scope,
            category,
            assigned_verifiers,
            facilities (name)
          )
        `)
        .eq('id', activityDataId)
        .maybeSingle();

      if (error) throw error;
      setActivityData(data);
    } catch (error: any) {
      console.error('Error loading activity data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setUserProfile(profile);
      }

      // Also check user_roles for can_approve_actions
      const { data: role } = await supabase
        .from('user_roles')
        .select('can_approve_actions')
        .eq('user_id', user.id)
        .maybeSingle();

      setUserRole(role);
    } catch (error: any) {
      console.error('Error loading user profile:', error);
    }
  };

  const canVerify = () => {
    if (!activityData || !userProfile) return false;
    
    // Allow if user has can_approve_actions permission
    if (userRole?.can_approve_actions) return true;
    
    // Allow if user is in assigned_verifiers list
    const assignedVerifiers = activityData.ghg_sources?.assigned_verifiers || [];
    if (assignedVerifiers.includes(userProfile.user_id)) return true;
    
    // Allow admin roles
    const adminRoles = ['portfolio_company_admin', 'super_admin'];
    if (adminRoles.includes(userProfile.role)) return true;
    
    return false;
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update status to verified
      const { error } = await supabase
        .from('ghg_activity_data')
        .update({
          status: 'verified',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          notes: comment ? `${activityData.notes || ''}\n\n[Verifier Comment - ${new Date().toLocaleDateString()}]: ${comment}` : activityData.notes,
        })
        .eq('id', activityDataId);

      if (error) throw error;

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update status back to pending with comments
      const { error } = await supabase
        .from('ghg_activity_data')
        .update({
          status: 'pending',
          notes: `${activityData.notes || ''}\n\n[REJECTED - ${new Date().toLocaleDateString()}]: ${comment}`,
        })
        .eq('id', activityDataId);

      if (error) throw error;

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
      pending: <Badge variant="outline" className="bg-gray-100"><Clock className="h-3 w-3 mr-1" /> Draft</Badge>,
      submitted: <Badge variant="outline" className="bg-amber-100 text-amber-700"><Clock className="h-3 w-3 mr-1" /> Pending Review</Badge>,
      verified: <Badge variant="outline" className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>,
      approved: <Badge variant="outline" className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>,
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (!activityDataId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review & Approve Activity Data</DialogTitle>
          <DialogDescription>
            Verify the accuracy of submitted activity data before approval
          </DialogDescription>
        </DialogHeader>

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !activityData ? (
          <div className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Activity data not found</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Current Status */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">Current Status</span>
                {getStatusBadge(activityData.status)}
              </div>

              {/* Data Summary */}
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-4">Data Summary</h4>
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
                      <Label className="text-xs text-muted-foreground">Scope</Label>
                      <p className="text-sm font-medium">{activityData.ghg_sources?.scope || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <p className="text-sm font-medium">{activityData.ghg_sources?.category || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Facility</Label>
                      <p className="text-sm font-medium">{activityData.ghg_sources?.facilities?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Activity Value</Label>
                      <p className="text-sm font-medium">
                        {activityData.activity_value || sourceInfo?.activity_value} {activityData.activity_unit || sourceInfo?.activity_unit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Emission Factor</Label>
                      <p className="text-sm font-medium">{activityData.emission_factor} ({activityData.emission_factor_source || 'N/A'})</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Calculated Emissions</Label>
                      <p className="text-sm font-medium text-primary">{(activityData.calculated_emissions / 1000).toFixed(4)} tCO₂e</p>
                    </div>
                  </div>

                  {activityData.notes && (
                    <div className="mt-4">
                      <Label className="text-xs text-muted-foreground">Notes & History</Label>
                      <p className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap mt-1">{activityData.notes}</p>
                    </div>
                  )}

                  {activityData.evidence_urls && activityData.evidence_urls.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-xs text-muted-foreground">Evidence Files</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activityData.evidence_urls.map((url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
                          >
                            <FileText className="h-3 w-3" />
                            Evidence {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verification Comment */}
              {canVerify() && activityData.status === 'submitted' && (
                <div className="space-y-2">
                  <Label htmlFor="comment">Verifier Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add comments about the verification or reasons for rejection (required for rejection)..."
                    rows={4}
                  />
                </div>
              )}

              {!canVerify() && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You do not have permission to verify this data. Only designated verifiers or admins can approve submissions.
                  </AlertDescription>
                </Alert>
              )}

              {activityData.status !== 'submitted' && (
                <Alert>
                  <AlertDescription>
                    This data is not in a reviewable state. Current status: <strong>{activityData.status}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          {canVerify() && activityData?.status === 'submitted' ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Approve
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
