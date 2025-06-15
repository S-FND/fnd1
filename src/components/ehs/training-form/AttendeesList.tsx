
import React, { useState } from 'react';
import { Mail, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isExistingEmployee } from '@/data/ehs/employees';
import { TrainingFormData } from './types';

interface AttendeesListProps {
  formData: TrainingFormData;
  updateFormData: (updates: Partial<TrainingFormData>) => void;
}

export const AttendeesList: React.FC<AttendeesListProps> = ({ formData, updateFormData }) => {
  // State to track which attendees have non-existing emails
  const [nonExistingEmails, setNonExistingEmails] = useState<{ [key: number]: boolean }>({});

  const handleEmailBlur = (email: string, index: number) => {
    if (email) {
      const isExisting = isExistingEmployee(email);
      
      // Update the state for this specific attendee
      setNonExistingEmails(prev => ({
        ...prev,
        [index]: !isExisting
      }));
    }
  };

  const addAttendee = () => {
    updateFormData({
      attendees: [...formData.attendees, { name: '', email: '' }]
    });
  };

  const removeAttendee = (index: number) => {
    const newAttendees = formData.attendees.filter((_, i) => i !== index);
    updateFormData({ attendees: newAttendees });
  };

  const updateAttendee = (index: number, field: 'name' | 'email', value: string) => {
    const newAttendees = [...formData.attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    updateFormData({ attendees: newAttendees });
  };

  const handleInviteNew = (index: number) => {
    // TODO: Implement invitation logic
    console.log('Invite new attendee at index:', index);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Attendees</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addAttendee}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Attendee
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {formData.attendees.map((attendee, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="grid gap-4 flex-1 md:grid-cols-2">
                    <Input 
                      placeholder="Attendee name" 
                      value={attendee.name}
                      onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                    />
                    
                    <Input 
                      placeholder="Email address" 
                      value={attendee.email}
                      onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                      onBlur={() => handleEmailBlur(attendee.email, index)}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttendee(index)}
                    disabled={formData.attendees.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Show non-existing email alert and invite button conditionally */}
                {nonExistingEmails[index] && attendee.email && (
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
                      onClick={() => handleInviteNew(index)}
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
