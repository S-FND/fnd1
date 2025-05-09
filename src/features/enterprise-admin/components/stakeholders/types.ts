
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
