
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, Building, Clock, MapPin, BookOpen, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { EHSTraining, approveTraining, rejectTraining } from '@/data/ehs/trainings';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TrainingApprovalCardProps {
  training: EHSTraining;
  onApprovalChange: () => void;
}

const TrainingApprovalCard: React.FC<TrainingApprovalCardProps> = ({ training, onApprovalChange }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveTraining(training.id, user?.name || 'Admin');
      toast({
        title: "Training Approved",
        description: `${training.name} has been approved and added to the EHS calendar.`,
      });
      onApprovalChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve training. Please try again.",
        variant: "destructive",
      });
    }
    setIsApproving(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this training.",
        variant: "destructive",
      });
      return;
    }

    setIsRejecting(true);
    try {
      await rejectTraining(training.id, rejectionReason);
      toast({
        title: "Training Rejected",
        description: `${training.name} has been rejected.`,
      });
      setShowRejectDialog(false);
      setRejectionReason('');
      onApprovalChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject training. Please try again.",
        variant: "destructive",
      });
    }
    setIsRejecting(false);
  };

  return (
    <Card className="border-l-4 border-l-amber-400 bg-amber-50/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {training.name}
            </CardTitle>
            <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 border-amber-300">
              Pending Approval
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Training Details</h4>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Company:</span>
              <span>{training.clientCompany}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date:</span>
              <span>{new Date(training.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Time:</span>
              <span>{training.time} ({training.duration})</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span>{training.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Type:</span>
              <span>{training.trainingType === 'online' ? 'Online (LMS)' : 'Offline (In-Person)'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Attendees:</span>
              <span>{training.attendees.length} employees</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-2">Description</h4>
          <p className="text-sm">{training.description}</p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-2">Submission Details</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Recommended by:</span>
              <span>{training.recommendedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Submitted on:</span>
              <span>{training.submittedDate ? new Date(training.submittedDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApprove} 
            disabled={isApproving}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isApproving ? 'Approving...' : 'Approve Training'}
          </Button>
          
          <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                <X className="h-4 w-4 mr-2" />
                Reject Training
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Training Recommendation</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting "{training.name}". This feedback will help improve future training recommendations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={isRejecting || !rejectionReason.trim()}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject Training'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingApprovalCard;
