// This file contains material topics from SASB and GRI frameworks

// Common type definitions
export interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
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
    topic: 'GHG Emissions',
    esg: 'Environment',
    description: 'Management of direct and indirect emissions of greenhouse gases',
    framework: 'SASB',
    industryRelevance: ['energy', 'manufacturing', 'logistics', 'automotive', 'chemicals', 'mining', 'aerospace']
  },
  {
    id: 'air_quality',
    topic: 'Air Quality',
    esg: 'Environment',
    description: 'Management of air emissions from operations',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'energy', 'chemicals', 'mining', 'automotive']
  },
  {
    id: 'energy_management',
    topic: 'Energy Management',
    esg: 'Environment',
    description: 'Management of energy consumption and efficiency',
    framework: 'SASB',
    industryRelevance: ['technology', 'manufacturing', 'real_estate', 'retail', 'hospitality', 'logistics']
  },
  {
    id: 'water_management',
    topic: 'Water & Wastewater Management',
    esg: 'Environment',
    description: 'Management of water withdrawal, consumption, and discharge',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'agriculture', 'food_beverage', 'chemicals', 'hospitality']
  },
  {
    id: 'waste_management',
    topic: 'Waste & Hazardous Materials Management',
    esg: 'Environment',
    description: 'Management of solid waste and hazardous materials',
    framework: 'SASB',
    industryRelevance: ['healthcare', 'manufacturing', 'chemicals', 'retail', 'hospitality']
  },
  
  // Social Capital Topics
  {
    id: 'human_rights',
    topic: 'Human Rights & Community Relations',
    esg: 'Social',
    description: 'Management of relationships with communities affected by activities',
    framework: 'SASB',
    industryRelevance: ['mining', 'energy', 'manufacturing', 'agriculture']
  },
  {
    id: 'customer_privacy',
    topic: 'Customer Privacy',
    esg: 'Social',
    description: 'Management of customer privacy and data security',
    framework: 'SASB',
    industryRelevance: ['technology', 'finance', 'healthcare', 'telecommunications', 'retail']
  },
  {
    id: 'data_security',
    topic: 'Data Security',
    esg: 'Governance',
    description: 'Management of risks related to collection, retention, and use of sensitive data',
    framework: 'SASB',
    industryRelevance: ['technology', 'finance', 'healthcare', 'telecommunications', 'retail']
  },
  {
    id: 'access_affordability',
    topic: 'Access & Affordability',
    esg: 'Social',
    description: 'Management of access to and affordability of products and services',
    framework: 'SASB',
    industryRelevance: ['healthcare', 'finance', 'telecommunications', 'education', 'pharmaceuticals']
  },
  
  // Human Capital Topics
  {
    id: 'labor_practices',
    topic: 'Labor Practices',
    esg: 'Social',
    description: 'Management of labor relations and practices',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'retail', 'logistics', 'hospitality', 'agriculture']
  },
  {
    id: 'employee_health_safety',
    topic: 'Employee Health & Safety',
    esg: 'Social',
    description: 'Management of workplace health and safety',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'energy', 'mining', 'construction', 'logistics', 'healthcare']
  },
  {
    id: 'diversity_inclusion',
    topic: 'Diversity & Inclusion',
    esg: 'Social',
    description: 'Management of diversity and inclusion in the workforce',
    framework: 'SASB',
    industryRelevance: ['technology', 'finance', 'media', 'education', 'healthcare', 'professional_services']
  },
  
  // Business Model & Innovation Topics
  {
    id: 'product_design',
    topic: 'Product Design & Lifecycle Management',
    esg: 'Environment',
    description: 'Management of environmental and social impacts of products',
    framework: 'SASB',
    industryRelevance: ['manufacturing', 'technology', 'automotive', 'chemicals', 'consumer_goods']
  },
  {
    id: 'business_resilience',
    topic: 'Business Model Resilience',
    esg: 'Governance',
    description: 'Management of business model resilience to environmental and social risks',
    framework: 'SASB',
    industryRelevance: ['finance', 'energy', 'manufacturing', 'real_estate', 'technology']
  },
  {
    id: 'supply_chain',
    topic: 'Supply Chain Management',
    esg: 'Governance',
    description: 'Management of environmental and social risks in the supply chain',
    framework: 'SASB',
    industryRelevance: ['retail', 'manufacturing', 'technology', 'automotive', 'apparel']
  },
  
  // Leadership & Governance Topics
  {
    id: 'business_ethics',
    topic: 'Business Ethics',
    esg: 'Governance',
    description: 'Management of ethical considerations in business operations',
    framework: 'SASB',
    industryRelevance: ['finance', 'pharmaceuticals', 'healthcare', 'energy', 'defense']
  },
  {
    id: 'competitive_behavior',
    topic: 'Competitive Behavior',
    esg: 'Governance',
    description: 'Management of anti-competitive practices',
    framework: 'SASB',
    industryRelevance: ['technology', 'telecommunications', 'finance', 'pharmaceuticals', 'media']
  },
  {
    id: 'regulatory_compliance',
    topic: 'Regulatory Compliance',
    esg: 'Governance',
    description: 'Management of compliance with laws and regulations',
    framework: 'SASB',
    industryRelevance: ['finance', 'healthcare', 'energy', 'pharmaceuticals', 'chemicals']
  },
  {
    id: 'systemic_risk',
    topic: 'Systemic Risk Management',
    esg: 'Governance',
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
    topic: 'Economic Performance',
    esg: 'Governance',
    description: 'Direct economic value generated and distributed',
    framework: 'GRI',
    industryRelevance: ['finance', 'energy', 'manufacturing', 'technology', 'telecommunications', 'mining']
  },
  {
    id: 'market_presence',
    topic: 'Market Presence',
    esg: 'Governance',
    description: 'Ratios of standard entry level wage compared to local minimum wage',
    framework: 'GRI',
    industryRelevance: ['retail', 'hospitality', 'manufacturing', 'mining']
  },
  {
    id: 'procurement_practices',
    topic: 'Procurement Practices',
    esg: 'Governance',
    description: 'Proportion of spending on local suppliers',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'retail', 'hospitality', 'energy']
  },
  {
    id: 'anti_corruption',
    topic: 'Anti-corruption',
    esg: 'Governance',
    description: 'Operations assessed for risks related to corruption',
    framework: 'GRI',
    industryRelevance: ['finance', 'energy', 'construction', 'defense', 'pharmaceuticals']
  },
  
  // Environmental Topics
  {
    id: 'materials',
    topic: 'Materials',
    esg: 'Environment',
    description: 'Materials used by weight or volume',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'construction', 'chemicals', 'automotive', 'consumer_goods']
  },
  {
    id: 'biodiversity',
    topic: 'Biodiversity',
    esg: 'Environment',
    description: 'Operational sites in or adjacent to protected areas',
    framework: 'GRI',
    industryRelevance: ['energy', 'mining', 'agriculture', 'forestry', 'construction']
  },
  {
    id: 'emissions',
    topic: 'Emissions',
    esg: 'Environment',
    description: 'Direct and indirect greenhouse gas emissions',
    framework: 'GRI',
    industryRelevance: ['energy', 'manufacturing', 'logistics', 'aviation', 'automotive']
  },
  {
    id: 'effluents_waste',
    topic: 'Effluents and Waste',
    esg: 'Environment',
    description: 'Water discharge by quality and destination',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'chemicals', 'mining', 'energy', 'food_beverage']
  },
  
  // Social Topics
  {
    id: 'employment',
    topic: 'Employment',
    esg: 'Social',
    description: 'New employee hires and employee turnover',
    framework: 'GRI',
    industryRelevance: ['all']
  },
  {
    id: 'labor_management',
    topic: 'Labor/Management Relations',
    esg: 'Social',
    description: 'Minimum notice periods regarding operational changes',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'logistics', 'mining', 'energy']
  },
  {
    id: 'training_education',
    topic: 'Training and Education',
    esg: 'Social',
    description: 'Average hours of training per year per employee',
    framework: 'GRI',
    industryRelevance: ['technology', 'finance', 'healthcare', 'education', 'professional_services']
  },
  {
    id: 'non_discrimination',
    topic: 'Non-discrimination',
    esg: 'Social',
    description: 'Incidents of discrimination and corrective actions taken',
    framework: 'GRI',
    industryRelevance: ['all']
  },
  {
    id: 'child_labor',
    topic: 'Child Labor',
    esg: 'Social',
    description: 'Operations and suppliers at risk for incidents of child labor',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'agriculture', 'mining', 'retail', 'apparel']
  },
  {
    id: 'forced_labor',
    topic: 'Forced or Compulsory Labor',
    esg: 'Social',
    description: 'Operations and suppliers at risk for incidents of forced or compulsory labor',
    framework: 'GRI',
    industryRelevance: ['manufacturing', 'agriculture', 'mining', 'logistics', 'construction']
  },
  {
    id: 'local_communities',
    topic: 'Local Communities',
    esg: 'Social',
    description: 'Operations with local community engagement, impact assessments, and development programs',
    framework: 'GRI',
    industryRelevance: ['mining', 'energy', 'construction', 'manufacturing']
  },
  {
    id: 'customer_health_safety',
    topic: 'Customer Health and Safety',
    esg: 'Social',
    description: 'Assessment of the health and safety impacts of product and service categories',
    framework: 'GRI',
    industryRelevance: ['healthcare', 'pharmaceuticals', 'food_beverage', 'consumer_goods', 'automotive']
  },
  {
    id: 'marketing_labeling',
    topic: 'Marketing and Labeling',
    esg: 'Social',
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
  const modifier = categoryModifiers[topic.esg as keyof typeof categoryModifiers];
  
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
      name: topic.topic,
      category: topic.esg,
      framework: topic.framework,
      description: topic.description,
      businessImpact: impacts.businessImpact,
      sustainabilityImpact: impacts.sustainabilityImpact,
      color: topicColors[topic.esg as keyof typeof topicColors]
    };
  });
};
