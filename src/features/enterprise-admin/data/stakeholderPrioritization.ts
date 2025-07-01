import { MaterialTopic } from './frameworkTopics';

// Types for stakeholder prioritization
export interface Stakeholder {
  _id: string;
  name: string;
  organization?: string;
  role?: string;
  type: 'internal' | 'external';
  category: string;
  email?: string;
  prioritizations: StakeholderPrioritization[];
}

export interface StakeholderPrioritization {
  topicId: string;
  businessImpact: number;
  sustainabilityImpact: number;
  comments?: string;
  dateSubmitted: string;
}

export interface StakeholderGroup {
  id: string;
  name: string;
  description?: string;
  topics: string[]; // Array of topic IDs selected for this group
  stakeholders: string[]; // Array of stakeholder IDs included in this group
  status: 'draft' | 'active' | 'completed';
  dateCreated: string;
  dateUpdated?: string;
}

// Mock data for initial stakeholders
export const initialStakeholders: Stakeholder[] = [
  {
    _id: 'stakeholder-1',
    name: 'John Smith',
    organization: 'Internal',
    role: 'Chief Sustainability Officer',
    type: 'internal',
    category: 'Executive',
    email: 'john.smith@company.com',
    prioritizations: []
  },
  {
    _id: 'stakeholder-2',
    name: 'Sarah Johnson',
    organization: 'Internal',
    role: 'Operations Manager',
    type: 'internal',
    category: 'Management',
    email: 'sarah.johnson@company.com',
    prioritizations: []
  },
  {
    _id: 'stakeholder-3',
    name: 'Michael Wong',
    organization: 'GreenEarth NGO',
    role: 'Director',
    type: 'external',
    category: 'NGO',
    email: 'mwong@greenearth.org',
    prioritizations: []
  },
  {
    _id: 'stakeholder-4',
    name: 'Lisa García',
    organization: 'Customer Group',
    role: 'Consumer Advocate',
    type: 'external',
    category: 'Customer',
    email: 'lisa.garcia@customergroup.org',
    prioritizations: []
  }
];

// Initial stakeholder groups
export const initialStakeholderGroups: StakeholderGroup[] = [
  {
    id: 'group-1',
    name: 'Executive Assessment',
    description: 'Internal executive team assessment of material topics',
    topics: ['ghg_emissions', 'energy_management', 'diversity_inclusion', 'data_security', 'business_ethics'],
    stakeholders: ['stakeholder-1', 'stakeholder-2'],
    status: 'active',
    dateCreated: new Date().toISOString()
  },
  {
    id: 'group-2',
    name: 'External Stakeholder Review',
    description: 'External stakeholder assessment of environmental topics',
    topics: ['ghg_emissions', 'water_management', 'biodiversity', 'waste_management'],
    stakeholders: ['stakeholder-3', 'stakeholder-4'],
    status: 'draft',
    dateCreated: new Date().toISOString()
  }
];

// Function to aggregate stakeholder prioritizations into a single value per topic
export const aggregateStakeholderPrioritizations = (
  topicIds: string[],
  stakeholderIds: string[],
  stakeholders: Stakeholder[]
): { [topicId: string]: { businessImpact: number, sustainabilityImpact: number, count: number } } => {
  // Initialize result object with zeros
  const result: { [topicId: string]: { businessImpact: number, sustainabilityImpact: number, count: number } } = {};
  
  topicIds.forEach(topicId => {
    result[topicId] = { businessImpact: 0, sustainabilityImpact: 0, count: 0 };
  });
  
  // Filter stakeholders to those in the group
  const relevantStakeholders = stakeholders.filter(s => stakeholderIds.includes(s._id));
  
  // Sum up the prioritizations
  relevantStakeholders.forEach(stakeholder => {
    stakeholder.prioritizations.forEach(p => {
      // Only consider prioritizations for topics in the group
      if (topicIds.includes(p.topicId)) {
        result[p.topicId].businessImpact += p.businessImpact;
        result[p.topicId].sustainabilityImpact += p.sustainabilityImpact;
        result[p.topicId].count += 1;
      }
    });
  });
  
  // Calculate averages
  Object.keys(result).forEach(topicId => {
    if (result[topicId].count > 0) {
      result[topicId].businessImpact /= result[topicId].count;
      result[topicId].sustainabilityImpact /= result[topicId].count;
    }
  });
  
  return result;
};

// Function to generate prioritized topics with impact scores
export const generatePrioritizedTopics = (
  topics: MaterialTopic[],
  stakeholderGroup: StakeholderGroup,
  stakeholders: Stakeholder[]
): MaterialTopic[] => {
  // Get the aggregated scores
  const aggregatedScores = aggregateStakeholderPrioritizations(
    stakeholderGroup.topics,
    stakeholderGroup.stakeholders,
    stakeholders
  );
  
  // Apply scores to topics
  return topics.map(topic => {
    // If this topic has stakeholder prioritization data, use it
    if (topic.id in aggregatedScores && aggregatedScores[topic.id].count > 0) {
      return {
        ...topic,
        businessImpact: aggregatedScores[topic.id].businessImpact,
        sustainabilityImpact: aggregatedScores[topic.id].sustainabilityImpact
      };
    }
    
    // Otherwise return the original topic
    return topic;
  });
};
