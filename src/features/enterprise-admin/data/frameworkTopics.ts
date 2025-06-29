// This file contains material topics from SASB and GRI frameworks

// Common type definitions
export interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact?: number;
  sustainabilityImpact?: number;
  color?: string;
  description: string;
  framework: 'SASB' | 'GRI' | 'Custom';
  industryRelevance: string[]; // Array of industry IDs this topic is relevant to
}

// SASB Material Topics organized by category
export const sasbTopics: MaterialTopic[] = [
  // Environmental Topics
  {
    id: 'ghg_emissions',
    name: 'GHG Emissions',
    category: 'Environment',
    description: 'Management of direct and indirect emissions of greenhouse gases',
    framework: 'SASB',
    industryRelevance: ['energy', 'manufacturing', 'logistics', 'automotive', 'chemicals', 'mining', 'aerospace']
  },
  {
    id: 'air_quality',
    name: 'Air Quality',
    category: 'Environment',
    description: 'Management of air emissions from operations',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'energy', 'chemicals', 'mining', 'automotive']
  },
  {
    id: 'energy_management',
    name: 'Energy Management',
    category: 'Environment',
    description: 'Management of energy consumption and efficiency',
    framework: 'SASB',
    industryRelevance: ['technology', 'manufacturing', 'real_estate', 'retail', 'hospitality', 'logistics']
  },
  {
    id: 'water_management',
    name: 'Water & Wastewater Management',
    category: 'Environment',
    description: 'Management of water withdrawal, consumption, and discharge',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'agriculture', 'food_beverage', 'chemicals', 'hospitality']
  },
  {
    id: 'waste_management',
    name: 'Waste & Hazardous Materials Management',
    category: 'Environment',
    description: 'Management of solid waste and hazardous materials',
    framework: 'SASB',
    industryRelevance: ['healthcare', 'manufacturing', 'chemicals', 'retail', 'hospitality']
  },
  
  // Social Capital Topics
  {
    id: 'human_rights',
    name: 'Human Rights & Community Relations',
    category: 'Social',
    description: 'Management of relationships with communities affected by activities',
    framework: 'SASB',
    industryRelevance: ['mining', 'energy', 'manufacturing', 'agriculture']
  },
  {
    id: 'customer_privacy',
    name: 'Customer Privacy',
    category: 'Social',
    description: 'Management of customer privacy and data security',
    framework: 'SASB',
    industryRelevance: ['technology', 'finance', 'healthcare', 'telecommunications', 'retail']
  },
  {
    id: 'data_security',
    name: 'Data Security',
    category: 'Governance',
    description: 'Management of risks related to collection, retention, and use of sensitive data',
    framework: 'SASB',
    industryRelevance: ['technology', 'finance', 'healthcare', 'telecommunications', 'retail']
  },
  {
    id: 'access_affordability',
    name: 'Access & Affordability',
    category: 'Social',
    description: 'Management of access to and affordability of products and services',
    framework: 'SASB',
    industryRelevance: ['healthcare', 'finance', 'telecommunications', 'education', 'pharmaceuticals']
  },
  
  // Human Capital Topics
  {
    id: 'labor_practices',
    name: 'Labor Practices',
    category: 'Social',
    description: 'Management of labor relations and practices',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'retail', 'logistics', 'hospitality', 'agriculture']
  },
  {
    id: 'employee_health_safety',
    name: 'Employee Health & Safety',
    category: 'Social',
    description: 'Management of workplace health and safety',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'energy', 'mining', 'construction', 'logistics', 'healthcare']
  },
  {
    id: 'diversity_inclusion',
    name: 'Diversity & Inclusion',
    category: 'Social',
    description: 'Management of diversity and inclusion in the workforce',
    framework: 'SASB',
    industryRelevance: ['technology', 'finance', 'media', 'education', 'healthcare', 'professional_services']
  },
  
  // Business Model & Innovation Topics
  {
    id: 'product_design',
    name: 'Product Design & Lifecycle Management',
    category: 'Environment',
    description: 'Management of environmental and social impacts of products',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'technology', 'automotive', 'chemicals', 'consumer_goods']
  },
  {
    id: 'business_resilience',
    name: 'Business Model Resilience',
    category: 'Governance',
    description: 'Management of business model resilience to environmental and social risks',
    framework: 'SASB',
    industryRelevance: ['finance', 'energy', 'manufacturing', 'real_estate', 'technology']
  },
  {
    id: 'supply_chain',
    name: 'Supply Chain Management',
    category: 'Governance',
    description: 'Management of environmental and social risks in the supply chain',
    framework: 'SASB',
    industryRelevance: ['retail', 'manufacturing', 'technology', 'automotive', 'apparel']
  },
  
  // Leadership & Governance Topics
  {
    id: 'business_ethics',
    name: 'Business Ethics',
    category: 'Governance',
    description: 'Management of ethical considerations in business operations',
    framework: 'SASB',
    industryRelevance: ['finance', 'pharmaceuticals', 'healthcare', 'energy', 'defense']
  },
  {
    id: 'competitive_behavior',
    name: 'Competitive Behavior',
    category: 'Governance',
    description: 'Management of anti-competitive practices',
    framework: 'SASB',
    industryRelevance: ['technology', 'telecommunications', 'finance', 'pharmaceuticals', 'media']
  },
  {
    id: 'regulatory_compliance',
    name: 'Regulatory Compliance',
    category: 'Governance',
    description: 'Management of compliance with laws and regulations',
    framework: 'SASB',
    industryRelevance: ['finance', 'healthcare', 'energy', 'pharmaceuticals', 'chemicals']
  },
  {
    id: 'systemic_risk',
    name: 'Systemic Risk Management',
    category: 'Governance',
    description: 'Management of systemic risks resulting from operations',
    framework: 'SASB',
    industryRelevance: ['finance', 'energy', 'technology', 'healthcare']
  }
];

// GRI Material Topics organized by category
export const griTopics: MaterialTopic[] = [
  // Economic Topics
  {
    id: 'economic_performance',
    name: 'Economic Performance',
    category: 'Governance',
    description: 'Direct economic value generated and distributed',
    framework: 'GRI',
    industryRelevance: ['finance', 'energy', 'manufacturing', 'technology', 'telecommunications', 'mining']
  },
  {
    id: 'market_presence',
    name: 'Market Presence',
    category: 'Governance',
    description: 'Ratios of standard entry level wage compared to local minimum wage',
    framework: 'GRI',
    industryRelevance: ['retail', 'hospitality', 'manufacturing', 'mining']
  },
  {
    id: 'procurement_practices',
    name: 'Procurement Practices',
    category: 'Governance',
    description: 'Proportion of spending on local suppliers',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'retail', 'hospitality', 'energy']
  },
  {
    id: 'anti_corruption',
    name: 'Anti-corruption',
    category: 'Governance',
    description: 'Operations assessed for risks related to corruption',
    framework: 'GRI',
    industryRelevance: ['finance', 'energy', 'construction', 'defense', 'pharmaceuticals']
  },
  
  // Environmental Topics
  {
    id: 'materials',
    name: 'Materials',
    category: 'Environment',
    description: 'Materials used by weight or volume',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'construction', 'chemicals', 'automotive', 'consumer_goods']
  },
  {
    id: 'biodiversity',
    name: 'Biodiversity',
    category: 'Environment',
    description: 'Operational sites in or adjacent to protected areas',
    framework: 'GRI',
    industryRelevance: ['energy', 'mining', 'agriculture', 'forestry', 'construction']
  },
  {
    id: 'emissions',
    name: 'Emissions',
    category: 'Environment',
    description: 'Direct and indirect greenhouse gas emissions',
    framework: 'GRI',
    industryRelevance: ['energy', 'manufacturing', 'logistics', 'aviation', 'automotive']
  },
  {
    id: 'effluents_waste',
    name: 'Effluents and Waste',
    category: 'Environment',
    description: 'Water discharge by quality and destination',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'chemicals', 'mining', 'energy', 'food_beverage']
  },
  
  // Social Topics
  {
    id: 'employment',
    name: 'Employment',
    category: 'Social',
    description: 'New employee hires and employee turnover',
    framework: 'GRI',
    industryRelevance: ['all']
  },
  {
    id: 'labor_management',
    name: 'Labor/Management Relations',
    category: 'Social',
    description: 'Minimum notice periods regarding operational changes',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'logistics', 'mining', 'energy']
  },
  {
    id: 'training_education',
    name: 'Training and Education',
    category: 'Social',
    description: 'Average hours of training per year per employee',
    framework: 'GRI',
    industryRelevance: ['technology', 'finance', 'healthcare', 'education', 'professional_services']
  },
  {
    id: 'non_discrimination',
    name: 'Non-discrimination',
    category: 'Social',
    description: 'Incidents of discrimination and corrective actions taken',
    framework: 'GRI',
    industryRelevance: ['all']
  },
  {
    id: 'child_labor',
    name: 'Child Labor',
    category: 'Social',
    description: 'Operations and suppliers at risk for incidents of child labor',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'agriculture', 'mining', 'retail', 'apparel']
  },
  {
    id: 'forced_labor',
    name: 'Forced or Compulsory Labor',
    category: 'Social',
    description: 'Operations and suppliers at risk for incidents of forced or compulsory labor',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'agriculture', 'mining', 'logistics', 'construction']
  },
  {
    id: 'local_communities',
    name: 'Local Communities',
    category: 'Social',
    description: 'Operations with local community engagement, impact assessments, and development programs',
    framework: 'GRI',
    industryRelevance: ['mining', 'energy', 'construction', 'manufacturing']
  },
  {
    id: 'customer_health_safety',
    name: 'Customer Health and Safety',
    category: 'Social',
    description: 'Assessment of the health and safety impacts of product and service categories',
    framework: 'GRI',
    industryRelevance: ['healthcare', 'pharmaceuticals', 'food_beverage', 'consumer_goods', 'automotive']
  },
  {
    id: 'marketing_labeling',
    name: 'Marketing and Labeling',
    category: 'Social',
    description: 'Requirements for product and service information and labeling',
    framework: 'GRI',
    industryRelevance: ['food_beverage', 'pharmaceuticals', 'consumer_goods', 'chemicals']
  }
];

// Utility function to get topics by industry
export const getTopicsByIndustry = (industryId: string, frameworks: ('SASB' | 'GRI' | 'Custom')[] = ['SASB', 'GRI', 'Custom']): MaterialTopic[] => {
  const topics: MaterialTopic[] = [];
  
  // If we're including SASB topics
  if (frameworks.includes('SASB')) {
    const relevantSasbTopics = sasbTopics.filter(topic => 
      topic.industryRelevance.includes(industryId) || 
      topic.industryRelevance.includes('all')
    );
    topics.push(...relevantSasbTopics);
  }
  
  // If we're including GRI topics
  if (frameworks.includes('GRI')) {
    const relevantGriTopics = griTopics.filter(topic => 
      topic.industryRelevance.includes(industryId) || 
      topic.industryRelevance.includes('all')
    );
    topics.push(...relevantGriTopics);
  }
  
  // If we're including custom topics and they exist for this industry
  if (frameworks.includes('Custom') && industryId in materialTopicsByIndustry) {
    const customTopics = materialTopicsByIndustry[industryId as keyof typeof materialTopicsByIndustry].map(topic => ({
      ...topic,
      framework: 'Custom' as const,
      industryRelevance: [industryId]
    }));
    topics.push(...customTopics);
  }
  
  return topics;
};

// Import the existing materiality data to reference it
import { materialTopicsByIndustry } from './materiality';

// Utility function to combine topics from multiple industries
export const getCombinedTopics = (industryIds: string[], frameworks: ('SASB' | 'GRI' | 'Custom')[] = ['SASB', 'GRI', 'Custom']): MaterialTopic[] => {
  // Use a Map to deduplicate topics by id
  const topicsMap = new Map<string, MaterialTopic>();
  
  industryIds.forEach(industryId => {
    const industryTopics = getTopicsByIndustry(industryId, frameworks);
    industryTopics.forEach(topic => {
      if (!topicsMap.has(topic.id)) {
        // First time seeing this topic
        topicsMap.set(topic.id, { ...topic });
      } else {
        // Combine with existing topic (e.g., update industryRelevance)
        const existingTopic = topicsMap.get(topic.id)!;
        if (!existingTopic.industryRelevance.includes(industryId)) {
          existingTopic.industryRelevance.push(industryId);
        }
        
        // If the topic has impact scores, average them
        if (topic.businessImpact && existingTopic.businessImpact) {
          existingTopic.businessImpact = (existingTopic.businessImpact + topic.businessImpact) / 2;
        }
        if (topic.sustainabilityImpact && existingTopic.sustainabilityImpact) {
          existingTopic.sustainabilityImpact = (existingTopic.sustainabilityImpact + topic.sustainabilityImpact) / 2;
        }
      }
    });
  });
  
  return Array.from(topicsMap.values());
};

// Define colors for topics by category
export const topicColors = {
  'Environment': '#22c55e', // green
  'Social': '#60a5fa',     // blue
  'Governance': '#f59e0b'  // amber
};

// Utility function to calculate initial business and sustainability impact values
export const calculateInitialImpacts = (topic: MaterialTopic): { businessImpact: number, sustainabilityImpact: number } => {
  // If the topic already has impact values, use them
  if (topic.businessImpact !== undefined && topic.sustainabilityImpact !== undefined) {
    return {
      businessImpact: topic.businessImpact,
      sustainabilityImpact: topic.sustainabilityImpact
    };
  }
  
  // Otherwise, calculate based on category and framework
  const baseValues = {
    'SASB': { business: 7.0, sustainability: 6.5 },
    'GRI': { business: 6.5, sustainability: 7.0 },
    'Custom': { business: 7.0, sustainability: 7.0 }
  };
  
  const categoryModifiers = {
    'Environment': { business: 0.0, sustainability: 1.5 },
    'Social': { business: 0.5, sustainability: 1.0 },
    'Governance': { business: 1.5, sustainability: 0.0 }
  };
  
  const base = baseValues[topic.framework];
  const modifier = categoryModifiers[topic.category as keyof typeof categoryModifiers];
  
  // Add some randomness to make the matrix more interesting
  const randomVariation = () => (Math.random() - 0.5) * 2;
  
  return {
    businessImpact: Math.min(10, Math.max(1, base.business + modifier.business + randomVariation())),
    sustainabilityImpact: Math.min(10, Math.max(1, base.sustainability + modifier.sustainability + randomVariation()))
  };
};

// Generate matrix data with impact values for visualization
export const generateMatrixData = (topics: MaterialTopic[]): any[] => {
  return topics.map(topic => {
    // Calculate impacts if not already present
    const impacts = calculateInitialImpacts(topic);
    
    return {
      x: impacts.businessImpact,
      y: impacts.sustainabilityImpact,
      z: 100,
      name: topic.name,
      category: topic.category,
      framework: topic.framework,
      description: topic.description,
      businessImpact: impacts.businessImpact,
      sustainabilityImpact: impacts.sustainabilityImpact,
      color: topicColors[topic.category as keyof typeof topicColors]
    };
  });
};
