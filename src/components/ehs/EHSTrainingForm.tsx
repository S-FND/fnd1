import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrainingBasicInfo } from './training-form/TrainingBasicInfo';
import { TrainingDetails } from './training-form/TrainingDetails';
import { TrainingSchedule } from './training-form/TrainingSchedule';
import { AttendeesList } from './training-form/AttendeesList';
import { TrainingFormData } from './training-form/types';
import { useToast } from '@/hooks/use-toast';
import { httpClient } from '@/lib/httpClient';

interface EHSTrainingFormProps {
  onComplete?: () => void;
}

const EHSTrainingForm: React.FC<EHSTrainingFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<TrainingFormData>({
    name: '',
    description: '',
    clientCompany: 'Translog India Ltd.',
    trainingType: 'offline',
    date: '',
    time: '',
    duration: '',
    location: '',
    attendees: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<TrainingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.date || !formData.time || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.attendees.length === 0) {
      toast({
        title: "No Attendees",
        description: "Please add at least one attendee to the training.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const entityId = JSON.parse(localStorage.getItem('fandoro-user') || '{}').entityId;
      if (!entityId) {
        toast({
          title: "Entity ID Missing",
          description: "Cannot submit training without an entity ID.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Convert form data to DTO format
      const trainingData = {
        name: formData.name,
        description: formData.description,
        clientCompany: formData.clientCompany,
        trainingType: formData.trainingType,
        date: formData.date,
        startTime: formData.time,
        duration: formData.duration,
        location: formData.location,
        attendees: formData.attendees,
        entityId
      };

      const response: any = await httpClient.post('ehs/trainings', trainingData);
      
      toast({
        title: "Training Recommendation Submitted",
        description: `${formData.name} has been submitted for approval. You'll be notified once it's reviewed by the management.`,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        clientCompany: 'Translog India Ltd.',
        trainingType: 'offline',
        date: '',
        time: '',
        duration: '',
        location: '',
        attendees: []
      });

      onComplete?.();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit training recommendation. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommend New EHS Training</CardTitle>
        <CardDescription>
          Submit a new training recommendation for review and approval. Once approved, it will be added to the EHS training calendar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TrainingBasicInfo 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <TrainingDetails 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <TrainingSchedule 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <AttendeesList 
            formData={formData} 
            updateFormData={updateFormData} 
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="h-4 w-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Approval Process</p>
                <p className="text-blue-700">
                  This training will be submitted for management approval. Once approved, it will appear in the EHS training calendar and attendees will be notified.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting for Approval...' : 'Submit for Approval'}
            </Button>
            {onComplete && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onComplete}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EHSTrainingForm;