import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from 'react-hook-form';
import { CalendarIcon, Users, Send, Bell, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { EngagementActivity, EngagementActivityType, ActivityPurpose, ActivityFrequency } from './types';

// Update the interface to accept stakeholders prop
interface CreateEngagementActivityDialogProps {
  onActivityCreated: (activity: EngagementActivity) => void;
  stakeholders: Array<{
    id: string;
    _id?: string;
    name: string;
    organization?: string;
    email?: string;
    phone?: string;
  }>;
}

interface ActivityFormData {
  title: string;
  type: EngagementActivityType;
  purpose: ActivityPurpose;
  description: string;
  targetStakeholders: string[];
  topics: string[];
  scheduledDate?: Date;
  frequency?: ActivityFrequency;
  location?: string;
  meetingLink?: string;
  duration?: number;
}

const activityTypes = [
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'email', label: 'Email' },
  { value: 'townhall', label: 'Town Hall' },
  { value: 'group_activity', label: 'Group Activity' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'survey', label: 'Survey' }
];

const frequencies = [
  { value: 'once', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' }
];

const commonTopics = [
  'ESG Strategy',
  'Climate Change',
  'Sustainability Reporting',
  'Supply Chain',
  'Governance',
  'Human Rights',
  'Community Impact',
  'Environmental Performance',
  'Social Initiatives',
  'Risk Management'
];

export const CreateEngagementActivityDialog: React.FC<CreateEngagementActivityDialogProps> = ({
  onActivityCreated,
  stakeholders // Add this prop
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');

  const form = useForm<ActivityFormData>({
    defaultValues: {
      title: '',
      type: 'email',
      purpose: 'invite',
      description: '',
      targetStakeholders: [],
      topics: [],
      frequency: 'once'
    }
  });

  const watchedType = form.watch('type');
  const watchedPurpose = form.watch('purpose');

  const onSubmit = (data: ActivityFormData) => {
    // Make sure we're using the correct ID (id or _id)
    const targetStakeholderIds = data.targetStakeholders.map(id => {
      const stakeholder = stakeholders.find(s => s.id === id || s._id === id);
      return stakeholder?._id || stakeholder?.id || id;
    });

    const newActivity: EngagementActivity = {
      id: `activity_${Date.now()}`,
      ...data,
      targetStakeholders: targetStakeholderIds,
      topics: selectedTopics,
      createdAt: new Date(),
      createdBy: 'current_user',
      status: 'draft'
    };

    onActivityCreated(newActivity);
    
    if (data.purpose === 'invite') {
      toast.success(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} invitation scheduled for ${data.targetStakeholders.length} stakeholder(s)`);
    } else {
      toast.success(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} reminder added to calendar`);
    }
    
    setOpen(false);
    form.reset();
    setSelectedTopics([]);
  };

  const addCustomTopic = () => {
    if (customTopic.trim() && !selectedTopics.includes(customTopic.trim())) {
      setSelectedTopics([...selectedTopics, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const requiresLocation = ['townhall', 'group_activity', 'meeting'].includes(watchedType);
  const requiresMeetingLink = ['webinar', 'meeting'].includes(watchedType);
  const requiresDuration = ['townhall', 'group_activity', 'webinar', 'meeting'].includes(watchedType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" /> Create Engagement Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Engagement Activity</DialogTitle>
          <DialogDescription>
            Plan stakeholder engagement activities and send invites or calendar reminders
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Q4 ESG Update Meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activityTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Purpose */}
              <FormField
                control={form.control}
                name="purpose"
                rules={{ required: 'Purpose is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="invite">
                          <div className="flex items-center">
                            <Send className="mr-2 h-4 w-4" />
                            Send Invite to Stakeholders
                          </div>
                        </SelectItem>
                        <SelectItem value="reminder">
                          <div className="flex items-center">
                            <Bell className="mr-2 h-4 w-4" />
                            Add Calendar Reminder for Company
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose and agenda of this activity..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Stakeholders - Now using props.stakeholders instead of sampleStakeholders */}
              <FormField
                control={form.control}
                name="targetStakeholders"
                rules={{ required: 'Select at least one stakeholder' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Target Stakeholders * ({stakeholders.length} available)
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                        {stakeholders.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No stakeholders available
                          </p>
                        ) : (
                          stakeholders.map((stakeholder) => {
                            const stakeholderId = stakeholder.id || stakeholder._id;
                            return (
                              <div key={stakeholderId} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`stakeholder-${stakeholderId}`}
                                  checked={field.value?.includes(stakeholderId)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...(field.value || []), stakeholderId]);
                                    } else {
                                      field.onChange(field.value?.filter(id => id !== stakeholderId));
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`stakeholder-${stakeholderId}`}
                                  className="text-sm cursor-pointer flex-1 hover:text-primary"
                                >
                                  {stakeholder.name} 
                                  {stakeholder.organization && (
                                    <span className="text-muted-foreground ml-1">({stakeholder.organization})</span>
                                  )}
                                </label>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Topics */}
              <div className="space-y-3">
                <FormLabel>Topics to Discuss</FormLabel>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {commonTopics.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={`topic-${topic}`}
                          checked={selectedTopics.includes(topic)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTopics([...selectedTopics, topic]);
                            } else {
                              setSelectedTopics(selectedTopics.filter(t => t !== topic));
                            }
                          }}
                        />
                        <label htmlFor={`topic-${topic}`} className="text-sm cursor-pointer">
                          {topic}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom topic..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addCustomTopic} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  
                  {selectedTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      {selectedTopics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {topic}
                          <button
                            type="button"
                            onClick={() => setSelectedTopics(selectedTopics.filter(t => t !== topic))}
                            className="ml-1 text-primary/60 hover:text-primary"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Fields */}
              {(requiresLocation || requiresMeetingLink || requiresDuration) && (
                <div className="grid grid-cols-2 gap-4">
                  {requiresLocation && (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Conference Room A, Zoom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {requiresMeetingLink && (
                    <FormField
                      control={form.control}
                      name="meetingLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://meet.google.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {requiresDuration && (
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="60" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {watchedPurpose === 'invite' ? (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Schedule & Send Invites
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Add to Calendar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};