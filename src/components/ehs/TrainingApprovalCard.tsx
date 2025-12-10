import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Clock, MapPin, BookOpen } from 'lucide-react';
import { EHSTraining } from './training-form/types/ehsTraining.types';
import { httpClient } from '@/lib/httpClient';
interface TrainingApprovalCardProps {
  training: EHSTraining;
  onApprovalChange: () => void;
}

const TrainingApprovalCard: React.FC<TrainingApprovalCardProps> = ({ 
  training, 
  onApprovalChange 
}) => {
  const handleApprove = async () => {
    const trainingId = training.id || (training as any)._id;
    if (!trainingId) {
      console.error('Training ID is undefined');
      return;
    }
    try {
      await httpClient.patch(`ehs/trainings/${trainingId}/status`, { status: 'approved' });
      onApprovalChange();
    } catch (error) {
      console.error('Error approving training:', error);
    }
  };

  const handleReject = async () => {
    const trainingId = training.id || (training as any)._id;

    try {
      await httpClient.patch(`ehs/trainings/${trainingId}/status`, { status: 'rejected' });
      onApprovalChange();
    } catch (error) {
      console.error('Error rejecting training:', error);
    }
  };

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{training.name}</CardTitle>
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Pending Approval
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Building className="h-3.5 w-3.5" />
          <span>{training.clientCompany}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{training.attendees.length} attendees</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{training.trainingType === 'online' ? 'Online (LMS)' : 'Offline (In-Person)'}</span>
        </div>
        {training.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{training.location}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">{training.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="default" onClick={handleApprove} className="flex-1">
          Approve
        </Button>
        <Button variant="outline" onClick={handleReject} className="flex-1">
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrainingApprovalCard;