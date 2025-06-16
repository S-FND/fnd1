
export type StakeholderCategory = 'internal' | 'external';

export interface StakeholderSubcategory {
  id: string;
  name: string;
  description: string;
  category: StakeholderCategory;
}

export interface Stakeholder {
  id: string;
  name: string;
  organization?: string;
  email?: string;
  phone?: string;
  subcategoryId: string;
  notes?: string;
  engagementLevel?: 'low' | 'medium' | 'high';
  influence?: 'low' | 'medium' | 'high';
  interest?: 'low' | 'medium' | 'high';
  lastContact?: Date;
}

export interface StakeholderFormData {
  name: string;
  organization?: string;
  email?: string;
  phone?: string;
  subcategoryId: string;
  notes?: string;
  engagementLevel?: 'low' | 'medium' | 'high';
  influence?: 'low' | 'medium' | 'high';
  interest?: 'low' | 'medium' | 'high';
}

export type EngagementActivityType = 'newsletter' | 'email' | 'townhall' | 'group_activity' | 'webinar' | 'meeting' | 'survey';

export type ActivityPurpose = 'invite' | 'reminder';

export type ActivityFrequency = 'once' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

export interface EngagementActivity {
  id: string;
  title: string;
  type: EngagementActivityType;
  purpose: ActivityPurpose;
  description: string;
  targetStakeholders: string[]; // stakeholder IDs
  topics: string[]; // topic names or IDs
  scheduledDate?: Date;
  frequency?: ActivityFrequency;
  location?: string; // for physical events
  meetingLink?: string; // for virtual events
  duration?: number; // in minutes
  createdAt: Date;
  createdBy: string;
  status: 'draft' | 'scheduled' | 'sent' | 'completed' | 'cancelled';
}
