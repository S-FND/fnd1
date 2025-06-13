
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleStakeholders, defaultStakeholderSubcategories } from '../../data/stakeholders';
import { Calendar, Network, Clock, Users, MapPin, ExternalLink } from 'lucide-react';
import { CreateEngagementActivityDialog } from './CreateEngagementActivityDialog';
import { EngagementActivity } from './types';
import { format } from 'date-fns';

const EngagementPlan: React.FC = () => {
  const [activities, setActivities] = useState<EngagementActivity[]>([]);
  
  const highPriorityStakeholders = sampleStakeholders.filter(
    s => s.engagementLevel === 'high' && s.influence === 'high'
  );

  const handleActivityCreated = (activity: EngagementActivity) => {
    setActivities([...activities, activity]);
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
      case 'email':
        return '📧';
      case 'townhall':
        return '🏛️';
      case 'group_activity':
        return '👥';
      case 'webinar':
        return '💻';
      case 'meeting':
        return '🤝';
      case 'survey':
        return '📊';
      default:
        return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stakeholder Engagement Plan</h1>
        <CreateEngagementActivityDialog onActivityCreated={handleActivityCreated} />
      </div>

      {/* Recent Activities */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Engagement Activities</CardTitle>
            <CardDescription>Latest planned and completed stakeholder activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getActivityTypeIcon(activity.type)}</span>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {activity.targetStakeholders.length} stakeholder(s)
                        </span>
                        {activity.scheduledDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(activity.scheduledDate, 'MMM d, yyyy')}
                          </span>
                        )}
                        {activity.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </span>
                        )}
                        {activity.meetingLink && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Virtual
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={activity.purpose === 'invite' ? 'default' : 'outline'}>
                      {activity.purpose === 'invite' ? 'Invite' : 'Reminder'}
                    </Badge>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {activities.length > 5 && (
            <CardFooter>
              <Button variant="outline" className="w-full">View All Activities</Button>
            </CardFooter>
          )}
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Priority Matrix</CardTitle>
            <CardDescription>Organize stakeholders by influence and interest</CardDescription>
          </CardHeader>
          <CardContent className="h-80 relative">
            <div className="absolute inset-0 p-6">
              <div className="grid grid-cols-2 grid-rows-2 h-full border">
                <div className="border-r border-b p-2 bg-amber-50">
                  <div className="mb-2 font-semibold">Keep Satisfied</div>
                  <div className="text-xs">(High influence, Low interest)</div>
                </div>
                <div className="border-b p-2 bg-green-50">
                  <div className="mb-2 font-semibold">Manage Closely</div>
                  <div className="text-xs">(High influence, High interest)</div>
                </div>
                <div className="border-r p-2">
                  <div className="mb-2 font-semibold">Monitor</div>
                  <div className="text-xs">(Low influence, Low interest)</div>
                </div>
                <div className="p-2 bg-blue-50">
                  <div className="mb-2 font-semibold">Keep Informed</div>
                  <div className="text-xs">(Low influence, High interest)</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Based on power/interest grid analysis
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>High Priority Stakeholders</CardTitle>
            <CardDescription>Stakeholders requiring close engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highPriorityStakeholders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="mx-auto h-10 w-10 opacity-50 mb-2" />
                  <p>No high priority stakeholders.</p>
                  <p className="text-sm">Add stakeholders with high engagement and influence.</p>
                </div>
              ) : (
                highPriorityStakeholders.map(stakeholder => {
                  const subcategory = defaultStakeholderSubcategories.find(
                    sc => sc.id === stakeholder.subcategoryId
                  );
                  return (
                    <div key={stakeholder.id} className="flex items-center gap-4 p-4 border rounded-md">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Network className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{stakeholder.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {stakeholder.organization || subcategory?.name}
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <div className={`inline-flex self-end items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-800`}>
                          {subcategory?.category === 'internal' ? 'Internal' : 'External'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last contact: {stakeholder.lastContact ? 
                            new Date(stakeholder.lastContact).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Priority Stakeholders</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Engagement Strategy</CardTitle>
          <CardDescription>How to effectively engage with different stakeholder groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md border-l-4 border-green-400 bg-green-50">
              <h3 className="font-semibold mb-1">Manage Closely (High influence, High interest)</h3>
              <p className="text-sm">These are key stakeholders who should be fully engaged and their support is critical. Regular face-to-face meetings, consistent updates, and integration into decision-making processes.</p>
            </div>
            
            <div className="p-4 rounded-md border-l-4 border-amber-400 bg-amber-50">
              <h3 className="font-semibold mb-1">Keep Satisfied (High influence, Low interest)</h3>
              <p className="text-sm">Keep these stakeholders satisfied but don't overwhelm them with communications. Focus on areas of specific interest, provide targeted updates, and address concerns promptly.</p>
            </div>
            
            <div className="p-4 rounded-md border-l-4 border-blue-400 bg-blue-50">
              <h3 className="font-semibold mb-1">Keep Informed (Low influence, High interest)</h3>
              <p className="text-sm">Keep these stakeholders adequately informed and ensure no major issues are arising. Regular newsletters, website updates, and open channels for questions and feedback.</p>
            </div>
            
            <div className="p-4 rounded-md border-l-4 border-gray-400 bg-gray-50">
              <h3 className="font-semibold mb-1">Monitor (Low influence, Low interest)</h3>
              <p className="text-sm">Monitor these stakeholders but don't overwhelm them with excessive communications. Provide access to general information through websites or annual reports.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementPlan;
