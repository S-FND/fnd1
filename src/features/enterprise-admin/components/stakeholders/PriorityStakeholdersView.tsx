import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Network, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { Stakeholder } from './types';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';

interface PriorityStakeholdersViewProps {
  onBack: () => void;
}

interface ApiStakeholder {
  _id: string;
  name: string;
  organization?: string;
  email: string;
  phone: string;
  subcategoryId: string;
  notes?: string;
  engagementLevel: 'low' | 'medium' | 'high';
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  userId?: any;
  lastContact?: string;
  createdAt?: string;
  updatedAt?: string;
  companyEntityId?: string;
  __v?: number;
}

interface ApiCategory {
  _id: string;
  name: string;
  description?: string;
  category: 'internal' | 'external';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

interface StakeholderSubcategory {
  id: string;
  name: string;
  description: string;
  category: 'internal' | 'external';
}

const PriorityStakeholdersView: React.FC<PriorityStakeholdersViewProps> = ({ onBack }) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [categories, setCategories] = useState<StakeholderSubcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    fetchStakeholders();
    fetchCategories();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.get<ApiStakeholder[]>('stakeholders');
      console.log('Stakeholder list response:', response);
      
      if (Array.isArray(response.data)) {
        const transformedData: Stakeholder[] = response.data.map((item: ApiStakeholder) => ({
          id: item._id,
          name: item.name,
          organization: item.organization || '',
          email: item.email,
          phone: item.phone,
          subcategoryId: item.subcategoryId,
          notes: item.notes || '',
          engagementLevel: item.engagementLevel,
          influence: item.influence,
          interest: item.interest,
          lastContact: item.lastContact ? new Date(item.lastContact) : new Date(),
          userId: typeof item.userId === 'object' ? item.userId?._id : item.userId
        }));
        setStakeholders(transformedData);
        console.log('Transformed stakeholders:', transformedData.length);
      } else {
        console.error('Response data is not an array:', response.data);
        toast.error('Invalid data format received');
      }
    } catch (error: any) {
      console.error('Error fetching stakeholders:', error);
      toast.error(error.response?.data?.message || 'Failed to load stakeholders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await httpClient.get<ApiResponse<ApiCategory[]>>('stakeholder-categories');
      console.log('Categories response:', response);
      
      if (response.data?.status === true && response.data?.data) {
        if (Array.isArray(response.data.data)) {
          const transformedData: StakeholderSubcategory[] = response.data.data.map((item: ApiCategory) => ({
            id: item._id,
            name: item.name,
            description: item.description || '',
            category: item.category
          }));
          setCategories(transformedData);
          console.log('Categories loaded:', transformedData.length);
        }
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error(error.response?.data?.message || 'Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Group stakeholders by priority matrix quadrants
  const groupStakeholdersByPriority = () => {
    const groups = {
      manageClosely: [] as Stakeholder[],    // High influence, High interest
      keepSatisfied: [] as Stakeholder[],    // High influence, Low interest
      keepInformed: [] as Stakeholder[],     // Low influence, High interest
      monitor: [] as Stakeholder[]           // Low influence, Low interest
    };

    stakeholders.forEach(stakeholder => {
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

  const getStakeholderSubcategory = (subcategoryId: string): StakeholderSubcategory | undefined => {
    return categories.find(sc => sc.id === subcategoryId);
  };

  const getEngagementLevelColor = (level?: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getInfluenceColor = (influence?: string) => {
    switch (influence) {
      case 'high':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterestColor = (interest?: string) => {
    switch (interest) {
      case 'high':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'medium':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Never';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
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
                {stakeholder.organization || subcategory?.name || 'No organization'}
              </p>
            </div>
          </div>
          <Badge className={`${
            subcategory?.category === 'internal' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
          }`}>
            {subcategory?.category === 'internal' ? 'Internal' : 'External'}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          {stakeholder.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{stakeholder.email}</span>
            </div>
          )}
          {stakeholder.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{stakeholder.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Last contact: {formatDate(stakeholder.lastContact)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getEngagementLevelColor(stakeholder.engagementLevel)}>
            {stakeholder.engagementLevel ? 
              stakeholder.engagementLevel.charAt(0).toUpperCase() + stakeholder.engagementLevel.slice(1) : 'Unknown'} Engagement
          </Badge>
          <Badge className={getInfluenceColor(stakeholder.influence)}>
            {stakeholder.influence ? 
              stakeholder.influence.charAt(0).toUpperCase() + stakeholder.influence.slice(1) : 'Unknown'} Influence
          </Badge>
          <Badge className={getInterestColor(stakeholder.interest)}>
            {stakeholder.interest ? 
              stakeholder.interest.charAt(0).toUpperCase() + stakeholder.interest.slice(1) : 'Unknown'} Interest
          </Badge>
        </div>

        {stakeholder.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">{stakeholder.notes}</p>
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
    <Card className={`${bgColor} border-l-4 ${borderColor} dark:bg-opacity-20`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <Badge variant="outline" className="ml-2">
            {stakeholders.length}
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {stakeholders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="mx-auto h-8 w-8 opacity-50 mb-2" />
            <p>No stakeholders in this category</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {stakeholders.map(stakeholder => (
              <StakeholderCard key={stakeholder.id} stakeholder={stakeholder} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading stakeholders...</p>
        </div>
      </div>
    );
  }

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
            {stakeholders.length} stakeholders organized by influence and interest levels
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PrioritySection
          title="Manage Closely"
          description="High influence, High interest - Key stakeholders requiring full engagement"
          stakeholders={stakeholderGroups.manageClosely}
          bgColor="bg-green-50 dark:bg-green-950/30"
          borderColor="border-l-green-400 dark:border-l-green-600"
        />

        <PrioritySection
          title="Keep Satisfied"
          description="High influence, Low interest - Keep satisfied without overwhelming"
          stakeholders={stakeholderGroups.keepSatisfied}
          bgColor="bg-amber-50 dark:bg-amber-950/30"
          borderColor="border-l-amber-400 dark:border-l-amber-600"
        />

        <PrioritySection
          title="Keep Informed"
          description="Low influence, High interest - Keep adequately informed"
          stakeholders={stakeholderGroups.keepInformed}
          bgColor="bg-blue-50 dark:bg-blue-950/30"
          borderColor="border-l-blue-400 dark:border-l-blue-600"
        />

        <PrioritySection
          title="Monitor"
          description="Low influence, Low interest - Monitor with minimal communication"
          stakeholders={stakeholderGroups.monitor}
          bgColor="bg-gray-50 dark:bg-gray-900/50"
          borderColor="border-l-gray-400 dark:border-l-gray-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority Matrix Summary</CardTitle>
          <CardDescription>Understanding stakeholder engagement strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Engagement Frequency
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                  <span className="font-medium">Manage Closely:</span>
                  <Badge variant="outline">Weekly/Bi-weekly</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                  <span className="font-medium">Keep Satisfied:</span>
                  <Badge variant="outline">Monthly</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                  <span className="font-medium">Keep Informed:</span>
                  <Badge variant="outline">Quarterly</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <span className="font-medium">Monitor:</span>
                  <Badge variant="outline">Annually</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Communication Methods
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                  <span className="font-medium">Manage Closely:</span>
                  <Badge variant="outline">Face-to-face, Calls</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                  <span className="font-medium">Keep Satisfied:</span>
                  <Badge variant="outline">Targeted Updates</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                  <span className="font-medium">Keep Informed:</span>
                  <Badge variant="outline">Newsletters, Email</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <span className="font-medium">Monitor:</span>
                  <Badge variant="outline">Website, Reports</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stakeholderGroups.manageClosely.length}
                </div>
                <div className="text-xs text-muted-foreground">Manage Closely</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stakeholderGroups.keepSatisfied.length}
                </div>
                <div className="text-xs text-muted-foreground">Keep Satisfied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stakeholderGroups.keepInformed.length}
                </div>
                <div className="text-xs text-muted-foreground">Keep Informed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stakeholderGroups.monitor.length}
                </div>
                <div className="text-xs text-muted-foreground">Monitor</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityStakeholdersView;