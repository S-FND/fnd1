
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { toast as toastS } from 'sonner';

interface EHSTrainingFormProps {
  onComplete: () => void;
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(3, { message: "Training name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  clientCompany: z.string().min(2, { message: "Client company name is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  trainingType: z.enum(["online", "offline"]),
  status: z.enum(["scheduled", "in-progress", "completed"]),
  trainerName: z.string().min(2, { message: "Trainer name is required" }),
  location: z.string().optional().or(z.literal('')),
  attendees: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.string().email({ message: "Invalid email address" }),
    })
  ).min(1, { message: "At least one attendee is required" }),
}).refine(data => {
  // Make sure location is provided for offline trainings
  if (data.trainingType === "offline" && (!data.location || data.location.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Location is required for offline trainings",
  path: ["location"],
}).refine(data => {
  // Make sure end date is after or equal to start date
  return data.endDate >= data.startDate;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

const defaultAttendee = { name: '', email: '' };

const EHSTrainingForm: React.FC<EHSTrainingFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const attendees = form.watch('attendees') || [defaultAttendee];
  const trainingType = form.watch('trainingType');

  const addAttendee = () => {
    form.setValue('attendees', [...attendees, defaultAttendee]);
  };

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      const updatedAttendees = [...attendees];
      updatedAttendees.splice(index, 1);
      form.setValue('attendees', updatedAttendees);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Here you would typically save the data to your backend
    console.log('Training data:', data);
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}`+"/admin/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization : `Bearer ${localStorage.getItem("fandoro-token")}` },
        body: JSON.stringify({ ...data }),
      });
      if (!res.ok) {
        toastS.error("Invalid credentials");
        setIsLoading(false);
        return;
      }
      else{
        toast({
          title: "Training created",
          description: `${data.name} for ${data.clientCompany} has been scheduled from ${format(data.startDate, 'MMMM d, yyyy')} to ${format(data.endDate, 'MMMM d, yyyy')}`,
        });
      }
    } catch (error) {
      console.error("Api call:", error);
      toastS.error("API Call failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
    
    
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
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
            control={form.control}
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
          control={form.control}
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

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
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

          {trainingType === "offline" && (
            <FormField
              control={form.control}
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
        </div>

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
                {attendees.map((_, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="grid gap-4 flex-1 md:grid-cols-2">
                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name={`attendees.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Email address" {...field} />
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
                      onClick={() => removeAttendee(index)}
                      disabled={attendees.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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
