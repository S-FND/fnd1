
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormValues } from './types';

interface TrainingBasicInfoProps {
  control: Control<FormValues>;
}

export const TrainingBasicInfo: React.FC<TrainingBasicInfoProps> = ({ control }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter training name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="clientCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Company</FormLabel>
              <FormControl>
                <Input placeholder="Enter client company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter training description" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
