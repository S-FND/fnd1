
// Array of industries based on LinkedIn's industry categories
export const industries = [
  { id: "logistics", name: "Logistics and Supply Chain" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "technology", name: "Software and Technology" },
  { id: "finance", name: "Financial Services" },
  { id: "healthcare", name: "Healthcare" },
  { id: "retail", name: "Retail and Consumer Goods" },
  { id: "energy", name: "Energy and Utilities" },
  { id: "construction", name: "Construction and Engineering" },
  { id: "agriculture", name: "Agriculture" },
  { id: "automotive", name: "Automotive" },
  { id: "telecommunications", name: "Telecommunications" },
  { id: "hospitality", name: "Hospitality and Tourism" },
  { id: "education", name: "Education" },
  { id: "pharmaceuticals", name: "Pharmaceuticals" },
  { id: "media", name: "Media and Entertainment" },
  { id: "mining", name: "Mining and Metals" },
  { id: "real_estate", name: "Real Estate" },
  { id: "chemicals", name: "Chemicals" },
  { id: "aerospace", name: "Aerospace and Defense" }
];

// Material topics data by industry
export const materialTopicsByIndustry = {
  logistics: [
    { 
      id: 'climate', 
      name: 'Climate Change',
      category: 'Environment',
      businessImpact: 8.5, 
      sustainabilityImpact: 9.2,
      color: '#22c55e',
      description: 'Managing greenhouse gas emissions and adapting to climate risks'
    },
    { 
      id: 'energy', 
      name: 'Energy Management',
      category: 'Environment',
      businessImpact: 7.8, 
      sustainabilityImpact: 8.5,
      color: '#22c55e',
      description: 'Optimizing energy consumption and transitioning to renewable sources'
    },
    { 
      id: 'emissions', 
      name: 'Transport Emissions',
      category: 'Environment',
      businessImpact: 9.0, 
      sustainabilityImpact: 9.5,
      color: '#22c55e',
      description: 'Reducing emissions from transportation and logistics operations'
    },
    { 
      id: 'labor', 
      name: 'Labor Practices',
      category: 'Social',
      businessImpact: 8.0, 
      sustainabilityImpact: 7.5,
      color: '#60a5fa',
      description: 'Ensuring fair labor practices across the supply chain'
    },
    { 
      id: 'safety', 
      name: 'Transport Safety',
      category: 'Social',
      businessImpact: 8.8, 
      sustainabilityImpact: 7.0,
      color: '#60a5fa',
      description: 'Ensuring safety in transportation and logistics operations'
    },
    { 
      id: 'ethics', 
      name: 'Business Ethics',
      category: 'Governance',
      businessImpact: 8.2, 
      sustainabilityImpact: 7.5,
      color: '#f59e0b',
      description: 'Maintaining high ethical standards in business operations'
    },
    { 
      id: 'supplierConduct', 
      name: 'Supplier Conduct',
      category: 'Governance',
      businessImpact: 7.6, 
      sustainabilityImpact: 7.8,
      color: '#f59e0b',
      description: 'Managing supplier relationships and ensuring responsible conduct'
    }
  ],
  manufacturing: [
    { 
      id: 'resource', 
      name: 'Resource Efficiency',
      category: 'Environment',
      businessImpact: 9.0, 
      sustainabilityImpact: 8.8,
      color: '#22c55e',
      description: 'Optimizing use of raw materials and resources'
    },
    { 
      id: 'waste', 
      name: 'Waste Management',
      category: 'Environment',
      businessImpact: 8.2, 
      sustainabilityImpact: 8.5,
      color: '#22c55e',
      description: 'Reducing waste generation and improving recycling'
    },
    { 
      id: 'labor_rights', 
      name: 'Labor Rights',
      category: 'Social',
      businessImpact: 7.8, 
      sustainabilityImpact: 8.0,
      color: '#60a5fa',
      description: 'Protecting worker rights and providing fair compensation'
    },
    { 
      id: 'product_safety', 
      name: 'Product Safety',
      category: 'Social',
      businessImpact: 9.2, 
      sustainabilityImpact: 8.0,
      color: '#60a5fa',
      description: 'Ensuring products are safe for consumers and end-users'
    },
    { 
      id: 'supply_chain', 
      name: 'Supply Chain Transparency',
      category: 'Governance',
      businessImpact: 7.5, 
      sustainabilityImpact: 8.2,
      color: '#f59e0b',
      description: 'Ensuring visibility and accountability across supply chains'
    }
  ],
  technology: [
    { 
      id: 'dataPrivacy', 
      name: 'Data Privacy & Security',
      category: 'Governance',
      businessImpact: 9.5, 
      sustainabilityImpact: 8.5,
      color: '#f59e0b',
      description: 'Protecting user data and ensuring cybersecurity'
    },
    { 
      id: 'digital_ethics', 
      name: 'Digital Ethics & AI',
      category: 'Governance',
      businessImpact: 8.8, 
      sustainabilityImpact: 8.0,
      color: '#f59e0b',
      description: 'Ensuring ethical use of technology and artificial intelligence'
    },
    { 
      id: 'e_waste', 
      name: 'E-Waste Management',
      category: 'Environment',
      businessImpact: 7.0, 
      sustainabilityImpact: 8.5,
      color: '#22c55e',
      description: 'Managing electronic waste and promoting circular economy'
    },
    { 
      id: 'inclusion', 
      name: 'Digital Inclusion',
      category: 'Social',
      businessImpact: 7.5, 
      sustainabilityImpact: 8.0,
      color: '#60a5fa',
      description: 'Bridging the digital divide and ensuring access to technology'
    },
    { 
      id: 'diversity', 
      name: 'Workplace Diversity',
      category: 'Social',
      businessImpact: 8.5, 
      sustainabilityImpact: 7.0,
      color: '#60a5fa',
      description: 'Promoting diversity and inclusion in the workplace'
    }
  ],
  finance: [
    { 
      id: 'responsible_investing', 
      name: 'Responsible Investing',
      category: 'Governance',
      businessImpact: 8.5, 
      sustainabilityImpact: 9.0,
      color: '#f59e0b',
      description: 'Integrating ESG factors into investment decisions'
    },
    { 
      id: 'financial_inclusion', 
      name: 'Financial Inclusion',
      category: 'Social',
      businessImpact: 7.8, 
      sustainabilityImpact: 8.5,
      color: '#60a5fa',
      description: 'Expanding access to financial services for underserved populations'
    },
    { 
      id: 'green_finance', 
      name: 'Green Finance',
      category: 'Environment',
      businessImpact: 8.0, 
      sustainabilityImpact: 9.2,
      color: '#22c55e',
      description: 'Financing environmental initiatives and sustainable projects'
    },
    { 
      id: 'compliance', 
      name: 'Regulatory Compliance',
      category: 'Governance',
      businessImpact: 9.5, 
      sustainabilityImpact: 7.5,
      color: '#f59e0b',
      description: 'Adhering to financial regulations and compliance standards'
    }
  ],
  healthcare: [
    { 
      id: 'patient_privacy', 
      name: 'Patient Privacy',
      category: 'Governance',
      businessImpact: 9.5, 
      sustainabilityImpact: 8.0,
      color: '#f59e0b',
      description: 'Protecting patient data and ensuring privacy'
    },
    { 
      id: 'healthcare_access', 
      name: 'Healthcare Access',
      category: 'Social',
      businessImpact: 8.5, 
      sustainabilityImpact: 9.0,
      color: '#60a5fa',
      description: 'Expanding access to healthcare services'
    },
    { 
      id: 'medical_waste', 
      name: 'Medical Waste',
      category: 'Environment',
      businessImpact: 7.5, 
      sustainabilityImpact: 8.5,
      color: '#22c55e',
      description: 'Managing and reducing medical waste'
    },
    { 
      id: 'drug_pricing', 
      name: 'Drug Pricing & Access',
      category: 'Social',
      businessImpact: 9.0, 
      sustainabilityImpact: 8.8,
      color: '#60a5fa',
      description: 'Ensuring fair pricing and access to medications'
    }
  ],
  retail: [
    { 
      id: 'sustainable_sourcing', 
      name: 'Sustainable Sourcing',
      category: 'Environment',
      businessImpact: 8.5, 
      sustainabilityImpact: 9.0,
      color: '#22c55e',
      description: 'Sourcing products from sustainable and ethical suppliers'
    },
    { 
      id: 'packaging', 
      name: 'Packaging & Waste',
      category: 'Environment',
      businessImpact: 8.0, 
      sustainabilityImpact: 8.8,
      color: '#22c55e',
      description: 'Reducing packaging waste and using sustainable materials'
    },
    { 
      id: 'labor_conditions', 
      name: 'Labor Conditions',
      category: 'Social',
      businessImpact: 8.2, 
      sustainabilityImpact: 8.5,
      color: '#60a5fa',
      description: 'Ensuring fair labor practices in retail operations'
    },
    { 
      id: 'consumer_health', 
      name: 'Consumer Health & Safety',
      category: 'Social',
      businessImpact: 9.0, 
      sustainabilityImpact: 8.0,
      color: '#60a5fa',
      description: 'Ensuring products are safe and healthy for consumers'
    }
  ],
  energy: [
    { 
      id: 'climate_transition', 
      name: 'Climate Transition',
      category: 'Environment',
      businessImpact: 9.5, 
      sustainabilityImpact: 9.8,
      color: '#22c55e',
      description: 'Transitioning to low-carbon energy sources'
    },
    { 
      id: 'water_mgmt', 
      name: 'Water Management',
      category: 'Environment',
      businessImpact: 8.0, 
      sustainabilityImpact: 9.0,
      color: '#22c55e',
      description: 'Managing water resources and reducing water pollution'
    },
    { 
      id: 'biodiversity', 
      name: 'Biodiversity Impact',
      category: 'Environment',
      businessImpact: 7.5, 
      sustainabilityImpact: 9.2,
      color: '#22c55e',
      description: 'Preserving biodiversity and minimizing ecological impacts'
    },
    { 
      id: 'community_relations', 
      name: 'Community Relations',
      category: 'Social',
      businessImpact: 8.2, 
      sustainabilityImpact: 8.0,
      color: '#60a5fa',
      description: 'Building positive relationships with local communities'
    },
    { 
      id: 'operational_safety', 
      name: 'Operational Safety',
      category: 'Social',
      businessImpact: 9.0, 
      sustainabilityImpact: 8.5,
      color: '#60a5fa',
      description: 'Ensuring safety in energy operations and preventing accidents'
    }
  ]
};

// Default topics (used when no industry is selected)
export const defaultMaterialTopics = [
  { 
    id: 'climate', 
    name: 'Climate Change',
    category: 'Environment',
    businessImpact: 8.5, 
    sustainabilityImpact: 9.2,
    color: '#22c55e',
    description: 'Managing greenhouse gas emissions and adapting to climate risks'
  },
  { 
    id: 'energy', 
    name: 'Energy Management',
    category: 'Environment',
    businessImpact: 7.8, 
    sustainabilityImpact: 8.5,
    color: '#22c55e',
    description: 'Reducing energy consumption and transitioning to renewable sources'
  },
  { 
    id: 'water', 
    name: 'Water Management',
    category: 'Environment',
    businessImpact: 6.5, 
    sustainabilityImpact: 8.0,
    color: '#22c55e',
    description: 'Efficient water usage and preventing water pollution'
  },
  { 
    id: 'waste', 
    name: 'Waste Management',
    category: 'Environment',
    businessImpact: 6.0, 
    sustainabilityImpact: 7.5,
    color: '#22c55e',
    description: 'Reducing waste generation and improving recycling rates'
  },
  { 
    id: 'biodiversity', 
    name: 'Biodiversity',
    category: 'Environment',
    businessImpact: 4.5, 
    sustainabilityImpact: 7.0,
    color: '#22c55e',
    description: 'Preserving biodiversity and minimizing ecological impacts'
  },
  { 
    id: 'diversity', 
    name: 'Diversity & Inclusion',
    category: 'Social',
    businessImpact: 7.5, 
    sustainabilityImpact: 6.5,
    color: '#60a5fa',
    description: 'Promoting diversity and inclusion in the workplace'
  },
  { 
    id: 'laborRights', 
    name: 'Labor Rights',
    category: 'Social',
    businessImpact: 8.0, 
    sustainabilityImpact: 7.8,
    color: '#60a5fa',
    description: 'Protecting worker rights and providing fair compensation'
  },
  { 
    id: 'communityEngagement', 
    name: 'Community Engagement',
    category: 'Social',
    businessImpact: 5.5, 
    sustainabilityImpact: 6.0,
    color: '#60a5fa',
    description: 'Building positive relationships with local communities'
  },
  { 
    id: 'employeeWellbeing', 
    name: 'Employee Wellbeing',
    category: 'Social',
    businessImpact: 7.0, 
    sustainabilityImpact: 5.5,
    color: '#60a5fa',
    description: 'Ensuring employee health, safety, and wellbeing'
  },
  { 
    id: 'ethics', 
    name: 'Business Ethics',
    category: 'Governance',
    businessImpact: 9.0, 
    sustainabilityImpact: 7.5,
    color: '#f59e0b',
    description: 'Maintaining high ethical standards in business operations'
  },
  { 
    id: 'transparency', 
    name: 'Transparency',
    category: 'Governance',
    businessImpact: 8.2, 
    sustainabilityImpact: 7.0,
    color: '#f59e0b',
    description: 'Ensuring transparency in business operations and reporting'
  },
  { 
    id: 'dataPrivacy', 
    name: 'Data Privacy & Security',
    category: 'Governance',
    businessImpact: 8.8, 
    sustainabilityImpact: 6.0,
    color: '#f59e0b',
    description: 'Protecting data privacy and ensuring cybersecurity'
  },
  { 
    id: 'supplierConduct', 
    name: 'Supplier Conduct',
    category: 'Governance',
    businessImpact: 7.2, 
    sustainabilityImpact: 7.8,
    color: '#f59e0b',
    description: 'Managing supplier relationships and ensuring responsible conduct'
  },
];
