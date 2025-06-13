
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Network, Mail, Phone, Calendar } from 'lucide-react';
import { sampleStakeholders, defaultStakeholderSubcategories } from '../../data/stakeholders';
import { Stakeholder } from './types';

interface PriorityStakeholdersViewProps {
  onBack: () => void;
}

const PriorityStakeholdersView: React.FC<PriorityStakeholdersViewProps> = ({ onBack }) => {
  // Group stakeholders by priority matrix quadrants
  const groupStakeholdersByPriority = () => {
    const groups = {
      manageClosely: [] as Stakeholder[],    // High influence, High interest
      keepSatisfied: [] as Stakeholder[],    // High influence, Low interest
      keepInformed: [] as Stakeholder[],     // Low influence, High interest
      monitor: [] as Stakeholder[]           // Low influence, Low interest
    };

    sampleStakeholders.forEach(stakeholder => {
      const isHighInfluence = stakeholder.influence === 'high';
      const isHighInterest = stakeholder.interest === 'high';

      if (isHighInfluence && isHighInterest) {
        groups.manageClosely.push(stakeholder);
      } else if (isHighInfluence && !isHighInterest) {
        groups.keepSatisfied.push(stakeholder);
      } else if (!isHighInfluence && isHighInterest) {
        groups.keepInformed.push(stakeholder);
      } else {
        groups.monitor.push(stakeholder);
      }
    });

    return groups;
  };

  const stakeholderGroups = groupStakeholdersByPriority();

  const getStakeholderSubcategory = (subcategoryId: string) => {
    return defaultStakeholderSubcategories.find(sc => sc.id === subcategoryId);
  };

  const getEngagementLevelColor = (level?: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StakeholderCard: React.FC<{ stakeholder: Stakeholder }> = ({ stakeholder }) => {
    const subcategory = getStakeholderSubcategory(stakeholder.subcategoryId);
    
    return (
      <div className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Network className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{stakeholder.name}</h4>
              <p className="text-sm text-muted-foreground">
                {stakeholder.organization || subcategory?.name}
              </p>
            </div>
          </div>
          <Badge className={`${subcategory?.category === 'internal' ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'}`}>
            {subcategory?.category === 'internal' ? 'Internal' : 'External'}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          {stakeholder.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              {stakeholder.email}
            </div>
          )}
          {stakeholder.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {stakeholder.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Last contact: {stakeholder.lastContact ? 
              new Date(stakeholder.lastContact).toLocaleDateString() : 'Never'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getEngagementLevelColor(stakeholder.engagementLevel)}>
            {stakeholder.engagementLevel?.charAt(0).toUpperCase() + stakeholder.engagementLevel?.slice(1)} Engagement
          </Badge>
          <Badge variant="outline">
            {stakeholder.influence?.charAt(0).toUpperCase() + stakeholder.influence?.slice(1)} Influence
          </Badge>
          <Badge variant="outline">
            {stakeholder.interest?.charAt(0).toUpperCase() + stakeholder.interest?.slice(1)} Interest
          </Badge>
        </div>

        {stakeholder.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">{stakeholder.notes}</p>
          </div>
        )}
      </div>
    );
  };

  const PrioritySection: React.FC<{ 
    title: string; 
    description: string; 
    stakeholders: Stakeholder[]; 
    bgColor: string;
    borderColor: string;
  }> = ({ title, description, stakeholders, bgColor, borderColor }) => (
    <Card className={`${bgColor} border-l-4 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="text-sm font-medium">
          {stakeholders.length} stakeholder{stakeholders.length !== 1 ? 's' : ''}
        </div>
      </CardHeader>
      <CardContent>
        {stakeholders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="mx-auto h-8 w-8 opacity-50 mb-2" />
            <p>No stakeholders in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stakeholders.map(stakeholder => (
              <StakeholderCard key={stakeholder.id} stakeholder={stakeholder} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Priority Stakeholders Matrix</h1>
          <p className="text-muted-foreground">
            All stakeholders organized by influence and interest levels
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PrioritySection
          title="Manage Closely"
          description="High influence, High interest - Key stakeholders requiring full engagement"
          stakeholders={stakeholderGroups.manageClosely}
          bgColor="bg-green-50"
          borderColor="border-l-green-400"
        />

        <PrioritySection
          title="Keep Satisfied"
          description="High influence, Low interest - Keep satisfied without overwhelming"
          stakeholders={stakeholderGroups.keepSatisfied}
          bgColor="bg-amber-50"
          borderColor="border-l-amber-400"
        />

        <PrioritySection
          title="Keep Informed"
          description="Low influence, High interest - Keep adequately informed"
          stakeholders={stakeholderGroups.keepInformed}
          bgColor="bg-blue-50"
          borderColor="border-l-blue-400"
        />

        <PrioritySection
          title="Monitor"
          description="Low influence, Low interest - Monitor with minimal communication"
          stakeholders={stakeholderGroups.monitor}
          bgColor="bg-gray-50"
          borderColor="border-l-gray-400"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority Matrix Summary</CardTitle>
          <CardDescription>Understanding stakeholder engagement strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Engagement Frequency</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Manage Closely:</span>
                  <span className="font-medium">Weekly/Bi-weekly</span>
                </div>
                <div className="flex justify-between">
                  <span>Keep Satisfied:</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Keep Informed:</span>
                  <span className="font-medium">Quarterly</span>
                </div>
                <div className="flex justify-between">
                  <span>Monitor:</span>
                  <span className="font-medium">Annually</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Communication Methods</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Manage Closely:</span>
                  <span className="font-medium">Face-to-face, Calls</span>
                </div>
                <div className="flex justify-between">
                  <span>Keep Satisfied:</span>
                  <span className="font-medium">Targeted Updates</span>
                </div>
                <div className="flex justify-between">
                  <span>Keep Informed:</span>
                  <span className="font-medium">Newsletters, Email</span>
                </div>
                <div className="flex justify-between">
                  <span>Monitor:</span>
                  <span className="font-medium">Website, Reports</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityStakeholdersView;
