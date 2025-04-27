
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormValues } from './types';

interface TrainingDetailsProps {
  control: Control<FormValues>;
}

export const TrainingDetails: React.FC<TrainingDetailsProps> = ({ control }) => {
  const trainingType = useWatch({
    control,
    name: 'trainingType',
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FormField
        control={control}
        name="trainingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Training Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select training type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="online">Online (LMS based)</SelectItem>
                <SelectItem value="offline">Offline (In-Person)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="trainerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trainer Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter trainer name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {trainingType === "offline" && (
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter training location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 2 days, 4 hours" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
