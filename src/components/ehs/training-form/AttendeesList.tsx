
import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Mail, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { isExistingEmployee } from '@/data/ehs/employees';
import { FormValues } from './types';

interface AttendeesListProps {
  control: Control<FormValues>;
  onInviteNew: (index: number) => void;
}

const defaultAttendee = { name: '', email: '' };

export const AttendeesList: React.FC<AttendeesListProps> = ({ control, onInviteNew }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendees"
  });

  const handleEmailBlur = (email: string, index: number) => {
    if (email && !isExistingEmployee(email)) {
      console.log('Email not found in employee list:', email);
      onInviteNew(index);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Attendees</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append(defaultAttendee)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Attendee
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="grid gap-4 flex-1 md:grid-cols-2">
                    <FormField
                      control={control}
                      name={`attendees.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Attendee name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`attendees.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Email address" 
                              {...field} 
                              onBlur={() => {
                                field.onBlur();
                                handleEmailBlur(field.value, index);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {field.email && !isExistingEmployee(field.email) && (
                  <div className="flex items-center justify-between pl-2">
                    <Alert variant="default" className="bg-muted">
                      <AlertDescription className="text-sm">
                        This email is not in the employee list.
                      </AlertDescription>
                    </Alert>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => onInviteNew(index)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Send Invitation
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
