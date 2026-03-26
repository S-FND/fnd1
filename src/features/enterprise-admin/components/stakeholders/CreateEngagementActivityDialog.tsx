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
import { CalendarIcon, Users, Send, Bell, X, Loader2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { httpClient } from '@/lib/httpClient';
import { EngagementActivity, EngagementActivityType, ActivityPurpose, ActivityFrequency } from './types';

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
  existingGroupId?: string;
}

interface ActivityFormData {
  // Group fields
  groupName: string;
  groupDescription: string;
  
  // Activity fields
  title: string;
  type: EngagementActivityType;
  purpose: ActivityPurpose;
  description: string;
  targetStakeholders: string[];
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
  { metric: 'ESG', topic: 'ESG Strategy', category: 'Strategy' },
  { metric: 'Climate', topic: 'Climate Change', category: 'Environment' },
  { metric: 'Sustainability', topic: 'Sustainability Reporting', category: 'Reporting' },
  { metric: 'Supply Chain', topic: 'Supply Chain', category: 'Operations' },
  { metric: 'Governance', topic: 'Governance', category: 'Governance' },
  { metric: 'Human Rights', topic: 'Human Rights', category: 'Social' },
  { metric: 'Community', topic: 'Community Impact', category: 'Social' },
  { metric: 'Environment', topic: 'Environmental Performance', category: 'Environment' },
  { metric: 'Social', topic: 'Social Initiatives', category: 'Social' },
  { metric: 'Risk', topic: 'Risk Management', category: 'Risk' }
];

export const CreateEngagementActivityDialog: React.FC<CreateEngagementActivityDialogProps> = ({
  onActivityCreated,
  stakeholders,
  existingGroupId
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<typeof commonTopics>([]);
  const [customTopic, setCustomTopic] = useState({ metric: '', topic: '', category: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ActivityFormData>({
    defaultValues: {
      groupName: '',
      groupDescription: '',
      title: '',
      type: 'email',
      purpose: 'invite',
      description: '',
      targetStakeholders: [],
      frequency: 'once'
    }
  });

  const watchedType = form.watch('type');
  const watchedPurpose = form.watch('purpose');

  // Create/Update Group - Using correct endpoint
  const createOrUpdateGroup = async (data: ActivityFormData) => {
    // Map stakeholder IDs
    const stakeholderIds = data.targetStakeholders.map(id => {
      const stakeholder = stakeholders.find(s => s.id === id || s._id === id);
      return stakeholder?._id || stakeholder?.id || id;
    });

    // Prepare group data matching your schema
    const groupData: any = {
      groupName: data.groupName,
      groupDescription: data.groupDescription || data.description,
      stakeholders: stakeholderIds,
      topics: selectedTopics.map(t => ({
        metric: t.metric,
        topic: t.topic,
        category: t.category
      }))
    };

    // If updating existing group
    if (existingGroupId) {
      groupData._id = existingGroupId;
    }

    // FIXED: Use correct endpoint for groups (without /activities)
    const response: any = await httpClient.post('stakeholder-engagement-group', groupData);
    return response.data.data;
  };

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create/Update Group
      const group = await createOrUpdateGroup(data);
      
      // Create local activity for UI
      const targetStakeholderIds = data.targetStakeholders.map(id => {
        const stakeholder = stakeholders.find(s => s.id === id || s._id === id);
        return stakeholder?._id || stakeholder?.id || id;
      });

      const newActivity: EngagementActivity = {
        id: group._id || `activity_${Date.now()}`,
        title: data.title,
        type: data.type,
        purpose: data.purpose,
        description: data.description,
        targetStakeholders: targetStakeholderIds,
        topics: selectedTopics.map(t => t.topic),
        scheduledDate: data.scheduledDate,
        frequency: data.frequency,
        location: data.location,
        meetingLink: data.meetingLink,
        duration: data.duration,
        createdAt: new Date(),
        createdBy: 'current_user',
        status: 'draft'
      };

      onActivityCreated(newActivity);
      
      toast.success('Engagement group created successfully');
      
      setOpen(false);
      form.reset();
      setSelectedTopics([]);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create engagement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTopic = (topic: typeof commonTopics[0]) => {
    if (!selectedTopics.some(t => t.topic === topic.topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const addCustomTopic = () => {
    if (customTopic.topic.trim() && !selectedTopics.some(t => t.topic === customTopic.topic)) {
      setSelectedTopics([...selectedTopics, { ...customTopic }]);
      setCustomTopic({ metric: '', topic: '', category: '' });
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setSelectedTopics(selectedTopics.filter(t => t.topic !== topicToRemove));
  };

  const requiresLocation = ['townhall', 'group_activity', 'meeting'].includes(watchedType);
  const requiresMeetingLink = ['webinar', 'meeting'].includes(watchedType);
  const requiresDuration = ['townhall', 'group_activity', 'webinar', 'meeting'].includes(watchedType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" /> Create Engagement Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Stakeholder Engagement Group</DialogTitle>
          <DialogDescription>
            Create a group to manage stakeholder engagement activities
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Group Name - Required for your backend */}
              <FormField
                control={form.control}
                name="groupName"
                rules={{ required: 'Group name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., ESG Stakeholder Group" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Group Description */}
              <FormField
                control={form.control}
                name="groupDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this stakeholder group..."
                        className="min-h-[80px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Details Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-4">Activity Details</h3>
                
                {/* Activity Title */}
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: 'Activity title is required' }}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Activity Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Q4 ESG Update Meeting" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activity Type and Purpose */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="type"
                    rules={{ required: 'Type is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
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

                  <FormField
                    control={form.control}
                    name="purpose"
                    rules={{ required: 'Purpose is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="invite">
                              <div className="flex items-center">
                                <Send className="mr-2 h-4 w-4" />
                                Send Invite
                              </div>
                            </SelectItem>
                            <SelectItem value="reminder">
                              <div className="flex items-center">
                                <Bell className="mr-2 h-4 w-4" />
                                Add Reminder
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Activity Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Activity Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose and agenda of this activity..."
                          className="min-h-[80px]"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stakeholders Selection */}
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
                                  disabled={isSubmitting}
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

              {/* Topics - Matching backend schema */}
              <div className="space-y-3">
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Topics to Discuss
                </FormLabel>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {commonTopics.map((topic) => (
                      <div key={topic.topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={`topic-${topic.topic}`}
                          checked={selectedTopics.some(t => t.topic === topic.topic)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addTopic(topic);
                            } else {
                              removeTopic(topic.topic);
                            }
                          }}
                          disabled={isSubmitting}
                        />
                        <label htmlFor={`topic-${topic.topic}`} className="text-sm cursor-pointer">
                          <span className="font-medium">{topic.topic}</span>
                          <span className="text-xs text-muted-foreground ml-2">({topic.category})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Add Custom Topic</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Metric"
                        value={customTopic.metric}
                        onChange={(e) => setCustomTopic({ ...customTopic, metric: e.target.value })}
                        disabled={isSubmitting}
                      />
                      <Input
                        placeholder="Topic"
                        value={customTopic.topic}
                        onChange={(e) => setCustomTopic({ ...customTopic, topic: e.target.value })}
                        disabled={isSubmitting}
                      />
                      <Input
                        placeholder="Category"
                        value={customTopic.category}
                        onChange={(e) => setCustomTopic({ ...customTopic, category: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={addCustomTopic} 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      disabled={isSubmitting || !customTopic.topic.trim() || !customTopic.metric.trim()}
                    >
                      Add Custom Topic
                    </Button>
                  </div>
                  
                  {selectedTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      {selectedTopics.map((topic) => (
                        <span
                          key={topic.topic}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {topic.topic}
                          <button
                            type="button"
                            onClick={() => removeTopic(topic.topic)}
                            className="ml-1 text-primary/60 hover:text-primary"
                            disabled={isSubmitting}
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
                              disabled={isSubmitting}
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
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
                            <Input 
                              placeholder="e.g., Conference Room A, Zoom" 
                              {...field}
                              disabled={isSubmitting}
                            />
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
                            <Input 
                              placeholder="https://meet.google.com/..." 
                              {...field}
                              disabled={isSubmitting}
                            />
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
                              min={15}
                              max={480}
                              disabled={isSubmitting}
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
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Group
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