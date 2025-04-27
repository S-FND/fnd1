
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { format } from 'date-fns';
import { TrainingBasicInfo } from './training-form/TrainingBasicInfo';
import { TrainingSchedule } from './training-form/TrainingSchedule';
import { TrainingDetails } from './training-form/TrainingDetails';
import { AttendeesList } from './training-form/AttendeesList';
import { formSchema, type FormValues } from './training-form/types';

interface EHSTrainingFormProps {
  onComplete: () => void;
}

const defaultAttendee = { name: '', email: '' };

const EHSTrainingForm: React.FC<EHSTrainingFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      clientCompany: '',
      startDate: undefined,
      endDate: undefined,
      startTime: '',
      endTime: '',
      duration: '',
      trainingType: "offline",
      status: "scheduled",
      trainerName: '',
      location: '',
      attendees: [defaultAttendee],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Training data:', data);
    
    toast({
      title: "Training created",
      description: `${data.name} for ${data.clientCompany} has been scheduled from ${format(data.startDate, 'MMMM d, yyyy')} to ${format(data.endDate, 'MMMM d, yyyy')}`,
    });
    
    onComplete();
  };

  const handleInviteNew = (index: number) => {
    const attendees = form.getValues('attendees');
    const attendee = attendees[index];
    
    if (attendee && attendee.email) {
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${attendee.email}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TrainingBasicInfo control={form.control} />
        <TrainingSchedule control={form.control} />
        <TrainingDetails control={form.control} />
        <AttendeesList control={form.control} onInviteNew={handleInviteNew} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">Create Training</Button>
        </div>
      </form>
    </Form>
  );
};

export default EHSTrainingForm;
