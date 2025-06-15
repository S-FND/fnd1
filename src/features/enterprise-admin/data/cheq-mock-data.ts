
export const companyInfo = {
  name: 'Acme Corp',
  industry: 'Technology',
  employees: 1500,
};

export const cheqStakeholders = [
  {
    id: 'stakeholder-1',
    name: 'Alice Johnson',
    organization: 'Acme Corp',
    email: 'alice.johnson@acme.com',
    subcategoryId: 'subcategory-1',
    lastContact: new Date('2023-11-15'),
    engagementLevel: 'high',
    influence: 'high',
  },
  {
    id: 'stakeholder-2',
    name: 'Bob Williams',
    organization: 'GreenTech Solutions',
    email: 'bob.williams@greentech.com',
    subcategoryId: 'subcategory-2',
    lastContact: new Date('2023-11-10'),
    engagementLevel: 'medium',
    influence: 'medium',
  },
  {
    id: 'stakeholder-3',
    name: 'Charlie Brown',
    organization: 'Sustainable Investments Ltd.',
    email: 'charlie.brown@sustainableinvestments.com',
    subcategoryId: 'subcategory-3',
    lastContact: new Date('2023-11-05'),
    engagementLevel: 'low',
    influence: 'low',
  },
  {
    id: 'stakeholder-4',
    name: 'Diana Miller',
    organization: 'EcoFriendly Supplies',
    email: 'diana.miller@ecofriendlysupplies.com',
    subcategoryId: 'subcategory-4',
    lastContact: new Date('2023-10-30'),
    engagementLevel: 'medium',
    influence: 'high',
  },
  {
    id: 'stakeholder-5',
    name: 'Ethan Davis',
    organization: 'Renewable Energy Corp',
    email: 'ethan.davis@renewableenergy.com',
    subcategoryId: 'subcategory-5',
    lastContact: new Date('2023-10-25'),
    engagementLevel: 'high',
    influence: 'medium',
  },
  {
    id: 'stakeholder-6',
    name: 'Fiona White',
    organization: 'Global Sustainability Initiative',
    email: 'fiona.white@globalsustainability.org',
    subcategoryId: 'subcategory-6',
    lastContact: new Date('2023-10-20'),
    engagementLevel: 'low',
    influence: 'low',
  },
  {
    id: 'stakeholder-7',
    name: 'George Black',
    organization: 'Clean Water Foundation',
    email: 'george.black@cleanwaterfoundation.org',
    subcategoryId: 'subcategory-1',
    lastContact: new Date('2023-10-15'),
    engagementLevel: 'medium',
    influence: 'medium',
  },
  {
    id: 'stakeholder-8',
    name: 'Hannah Green',
    organization: 'Carbon Neutral Technologies',
    email: 'hannah.green@carbonneutraltech.com',
    subcategoryId: 'subcategory-2',
    lastContact: new Date('2023-10-10'),
    engagementLevel: 'high',
    influence: 'high',
  },
  {
    id: 'stakeholder-9',
    name: 'Isaac Blue',
    organization: 'Sustainable Agriculture Network',
    email: 'isaac.blue@sustainableagri.net',
    subcategoryId: 'subcategory-3',
    lastContact: new Date('2023-10-05'),
    engagementLevel: 'low',
    influence: 'low',
  },
  {
    id: 'stakeholder-10',
    name: 'Julia Red',
    organization: 'Ethical Sourcing Alliance',
    email: 'julia.red@ethicalsourcing.org',
    subcategoryId: 'subcategory-4',
    lastContact: new Date('2023-09-30'),
    engagementLevel: 'medium',
    influence: 'medium',
  }
];

export const defaultStakeholderSubcategories = [
  {
    id: 'subcategory-1',
    name: 'Board of Directors',
    category: 'internal',
  },
  {
    id: 'subcategory-2',
    name: 'Employees',
    category: 'internal',
  },
  {
    id: 'subcategory-3',
    name: 'Investors',
    category: 'external',
  },
  {
    id: 'subcategory-4',
    name: 'Suppliers',
    category: 'external',
  },
  {
    id: 'subcategory-5',
    name: 'Customers',
    category: 'external',
  },
  {
    id: 'subcategory-6',
    name: 'Regulatory Bodies',
    category: 'external',
  },
];

// Update the suppliers data to ensure 'status' values match the union type
export const cheqSuppliers = [
  {
    id: "sup-001",
    name: "EcoTech Solutions",
    category: "Technology",
    contact: "Sarah Johnson",
    email: "sjohnson@ecotech.com",
    phone: "+1 (555) 123-4567",
    status: "completed" as const,
    score: 92,
    lastUpdated: "2023-11-12"
  },
  {
    id: "sup-002",
    name: "Green Logistics Inc.",
    category: "Transportation",
    contact: "Michael Chen",
    email: "mchen@greenlogistics.com",
    phone: "+1 (555) 234-5678",
    status: "completed" as const,
    score: 85,
    lastUpdated: "2023-11-10"
  },
  {
    id: "sup-003",
    name: "Sustainable Materials Co.",
    category: "Manufacturing",
    contact: "Jessica Smith",
    email: "jsmith@sustainablematerials.com",
    status: "in_progress" as const,
    lastUpdated: "2023-11-15"
  },
  {
    id: "sup-004",
    name: "Cloud Servers Pro",
    category: "Technology",
    contact: "David Williams",
    email: "dwilliams@cloudserverspro.com",
    status: "pending" as const,
    lastUpdated: "2023-11-01"
  },
  {
    id: "sup-005",
    name: "Renewable Energy Partners",
    category: "Energy",
    contact: "Amanda Taylor",
    email: "ataylor@renewableenergy.com",
    phone: "+1 (555) 456-7890",
    status: "not_started" as const,
    lastUpdated: "2023-10-20"
  },
  {
    id: "sup-006",
    name: "Eco Office Supplies",
    category: "Office Equipment",
    contact: "Robert Johnson",
    email: "rjohnson@ecooffice.com",
    status: "completed" as const,
    score: 78,
    lastUpdated: "2023-11-08"
  },
  {
    id: "sup-007",
    name: "Green Building Materials",
    category: "Construction",
    contact: "Lisa Anderson",
    email: "landerson@greenbuildingmaterials.com",
    phone: "+1 (555) 567-8901",
    status: "in_progress" as const,
    lastUpdated: "2023-11-13"
  },
  {
    id: "sup-008",
    name: "Solar Solutions LLC",
    category: "Energy",
    contact: "Mark Wilson",
    email: "mwilson@solarsolutions.com",
    status: "completed" as const,
    score: 95,
    lastUpdated: "2023-11-05"
  },
  {
    id: "sup-009",
    name: "Water Conservation Systems",
    category: "Utilities",
    contact: "Jennifer Brown",
    email: "jbrown@waterconservation.com",
    status: "pending" as const,
    lastUpdated: "2023-10-30"
  },
  {
    id: "sup-010",
    name: "Sustainable Packaging Inc.",
    category: "Packaging",
    contact: "Thomas Garcia",
    email: "tgarcia@sustainablepackaging.com",
    phone: "+1 (555) 678-9012",
    status: "not_started" as const,
    lastUpdated: "2023-10-25"
  },
  {
    id: "sup-011", 
    name: "Zero Waste Catering",
    category: "Food Services",
    contact: "Emily Rodriguez",
    email: "erodriguez@zerowastecatering.com",
    status: "completed" as const,
    score: 88,
    lastUpdated: "2023-11-03"
  },
  {
    id: "sup-012",
    name: "Eco-Friendly Cleaning",
    category: "Facilities",
    contact: "Daniel Martinez",
    email: "dmartinez@ecofriendlycleaning.com",
    phone: "+1 (555) 789-0123",
    status: "in_progress" as const,
    lastUpdated: "2023-11-11"
  }
];

// Adding missing exports for CheQDashboard component
export const analyticsCardsData = [
  {
    title: "ESG Score",
    value: "82/100",
    description: "Overall sustainability rating",
    change: 4,
    color: "text-green-500"
  },
  {
    title: "Carbon Footprint",
    value: "2,850 tCO2e",
    description: "Total emissions for FY 2024",
    change: -12,
    color: "text-blue-500"
  },
  {
    title: "Reporting Coverage",
    value: "95%",
    description: "Data completeness",
    change: 8,
    color: "text-amber-500"
  }
];

export const cheqInitiatives = [
  {
    title: "Digital-Only Client Statements",
    description: "Transitioning all client statements to digital format to reduce paper usage",
    status: "In Progress",
    progress: 75,
    dueDate: "2024-07-30"
  },
  {
    title: "Green Data Centers",
    description: "Converting data centers to renewable energy sources",
    status: "In Progress",
    progress: 40,
    dueDate: "2024-09-15"
  },
  {
    title: "Sustainable Investments Portfolio",
    description: "Launch sustainable investment fund products for clients",
    status: "Completed",
    progress: 100,
    dueDate: "2024-01-20"
  }
];

export const cheqESGKPIs = [
  {
    id: "green-finance",
    name: "Green Finance Portfolio",
    category: "Environment",
    baseline: 500,
    current: 750,
    target: 1000,
    unit: "million USD",
    progress: 75
  },
  {
    id: "carbon-footprint",
    name: "Carbon Footprint Reduction",
    category: "Environment",
    baseline: 3200,
    current: 2850,
    target: 2400,
    unit: "tCO2e",
    progress: 44
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy Use",
    category: "Environment",
    baseline: 40,
    current: 65,
    target: 80,
    unit: "%",
    progress: 63
  },
  {
    id: "diversity-management",
    name: "Management Diversity",
    category: "Social",
    baseline: 28,
    current: 38,
    target: 45,
    unit: "%",
    progress: 59
  },
  {
    id: "financial-inclusion",
    name: "Financial Inclusion Clients",
    category: "Social",
    baseline: 15000,
    current: 27500,
    target: 40000,
    unit: "clients",
    progress: 50
  },
  {
    id: "data-security",
    name: "Data Security Incidents",
    category: "Governance",
    baseline: 5,
    current: 2,
    target: 0,
    unit: "incidents",
    progress: 60
  }
];

export const cheqMonthlyTrendData = [
  { month: "Jan", environmental: 70, social: 65, governance: 75 },
  { month: "Feb", environmental: 72, social: 68, governance: 76 },
  { month: "Mar", environmental: 73, social: 70, governance: 78 },
  { month: "Apr", environmental: 75, social: 73, governance: 80 },
  { month: "May", environmental: 74, social: 75, governance: 82 },
  { month: "Jun", environmental: 76, social: 78, governance: 84 }
];

export const cheqRisks = [
  {
    title: "Climate Transition Risk",
    description: "Risk associated with transition to a low-carbon economy for financial portfolio",
    impact: "High",
    status: "Mitigation plan in place"
  },
  {
    title: "Data Privacy Breach",
    description: "Potential for customer data security incidents",
    impact: "High",
    status: "Active monitoring"
  },
  {
    title: "Financial Inclusion Targets",
    description: "Risk of missing targets for underbanked population services",
    impact: "Medium",
    status: "On track"
  },
  {
    title: "Greenwashing Claims",
    description: "Risk of misrepresentation of sustainability initiatives",
    impact: "Medium",
    status: "Enhanced disclosure process"
  }
];

// Adding missing exports for CheQEHSTrainings component
export const cheqEHSTrainings = [
  {
    id: "ehs-001",
    name: "Office Safety Standards",
    category: "Workplace Safety",
    type: "Mandatory",
    description: "Basic workplace safety procedures for financial services offices",
    assignedEmployees: 450,
    completionRate: 92,
    nextDueDate: "2024-07-15"
  },
  {
    id: "ehs-002",
    name: "Emergency Response",
    category: "Emergency Preparedness",
    type: "Mandatory",
    description: "Procedures for handling emergencies in bank branches and offices",
    assignedEmployees: 380,
    completionRate: 85,
    nextDueDate: "2024-08-20"
  },
  {
    id: "ehs-003",
    name: "Data Center Safety",
    category: "IT Infrastructure",
    type: "Required",
    description: "Safety protocols for data center operations and maintenance",
    assignedEmployees: 60,
    completionRate: 100,
    nextDueDate: "2024-11-10"
  },
  {
    id: "ehs-004",
    name: "Digital Ergonomics",
    category: "Health & Wellbeing",
    type: "Optional",
    description: "Ergonomic practices for remote and office workers in financial services",
    assignedEmployees: 250,
    completionRate: 65,
    nextDueDate: "2024-09-30"
  },
  {
    id: "ehs-005",
    name: "Branch Security",
    category: "Physical Security",
    type: "Mandatory",
    description: "Physical security procedures for retail banking locations",
    assignedEmployees: 180,
    completionRate: 98,
    nextDueDate: "2024-06-28"
  }
];

// Adding missing exports for CheQGHGCalculator component
export const cheqEmissionsData = {
  totalEmissions: {
    scope1: 175,
    scope2: 650,
    scope3: 2025
  },
  totalAllScopes: 2850,
  scopePercentages: [
    { name: "Scope 1", value: 175, percentage: "6%" },
    { name: "Scope 2", value: 650, percentage: "23%" },
    { name: "Scope 3", value: 2025, percentage: "71%" }
  ],
  scope1Data: [
    { name: "Company Vehicles", value: 95 },
    { name: "Natural Gas", value: 60 },
    { name: "Refrigerants", value: 20 }
  ],
  scope2Data: [
    { name: "Purchased Electricity", value: 520 },
    { name: "Steam & Heating", value: 80 },
    { name: "Cooling", value: 50 }
  ],
  scope3Data: [
    { name: "Business Travel", value: 320 },
    { name: "Employee Commuting", value: 285 },
    { name: "Purchased Goods & Services", value: 610 },
    { name: "Investments", value: 760 },
    { name: "Waste", value: 50 }
  ],
  monthlyEmissionsData: [
    { month: "Jan", scope1: 15, scope2: 55, scope3: 170 },
    { month: "Feb", scope1: 14, scope2: 54, scope3: 168 },
    { month: "Mar", scope1: 15, scope2: 56, scope3: 172 },
    { month: "Apr", scope1: 14, scope2: 52, scope3: 165 },
    { month: "May", scope1: 15, scope2: 54, scope3: 170 },
    { month: "Jun", scope1: 15, scope2: 53, scope3: 168 }
  ]
};

// Adding missing exports for CheQLMSOverview component
export const cheqTrainingModules = [
  {
    id: "lms-001",
    title: "ESG Reporting Fundamentals",
    category: "ESG",
    duration: "2 hours",
    completion: 100,
    dueDate: "2024-03-15"
  },
  {
    id: "lms-002",
    title: "Sustainable Finance Principles",
    category: "ESG",
    duration: "3 hours",
    completion: 75,
    dueDate: "2024-06-20"
  },
  {
    id: "lms-003",
    title: "Carbon Accounting for Financial Services",
    category: "GHG",
    duration: "2.5 hours",
    completion: 60,
    dueDate: "2024-06-30"
  },
  {
    id: "lms-004",
    title: "Workplace Health & Safety",
    category: "EHS",
    duration: "1.5 hours",
    completion: 100,
    dueDate: "2024-02-28"
  },
  {
    id: "lms-005",
    title: "Data Privacy & Security",
    category: "Compliance",
    duration: "2 hours",
    completion: 90,
    dueDate: "2024-05-15"
  },
  {
    id: "lms-006",
    title: "Climate Risk Assessment",
    category: "ESG",
    duration: "3.5 hours",
    completion: 0,
    dueDate: "2024-07-30"
  }
];

// Adding missing exports for CheQMateriality component
export const cheqMaterialTopics = [
  { 
    id: "responsible-investing", 
    name: "Responsible Investing",
    category: "Governance",
    businessImpact: 9.2, 
    sustainabilityImpact: 9.0,
    color: "#f59e0b",
    description: "Integrating ESG factors into investment decisions"
  },
  { 
    id: "data-privacy", 
    name: "Data Privacy & Security",
    category: "Governance",
    businessImpact: 9.5, 
    sustainabilityImpact: 7.5,
    color: "#f59e0b",
    description: "Protecting customer data and ensuring information security"
  },
  { 
    id: "financial-inclusion", 
    name: "Financial Inclusion",
    category: "Social",
    businessImpact: 8.0, 
    sustainabilityImpact: 8.5,
    color: "#60a5fa",
    description: "Expanding access to financial services for underbanked populations"
  },
  { 
    id: "green-finance", 
    name: "Green Finance",
    category: "Environment",
    businessImpact: 8.5, 
    sustainabilityImpact: 9.0,
    color: "#22c55e",
    description: "Developing and offering green financial products and services"
  },
  { 
    id: "climate-risk", 
    name: "Climate Risk Management",
    category: "Environment",
    businessImpact: 8.0, 
    sustainabilityImpact: 8.8,
    color: "#22c55e",
    description: "Addressing climate-related risks in financial portfolios"
  },
  { 
    id: "customer-protection", 
    name: "Customer Protection",
    category: "Social",
    businessImpact: 9.0, 
    sustainabilityImpact: 7.8,
    color: "#60a5fa",
    description: "Ensuring fair treatment and protection of financial consumers"
  },
  { 
    id: "ethics-integrity", 
    name: "Ethics & Integrity",
    category: "Governance",
    businessImpact: 9.2, 
    sustainabilityImpact: 8.2,
    color: "#f59e0b",
    description: "Maintaining high ethical standards and business integrity"
  },
  { 
    id: "digital-innovation", 
    name: "Digital Innovation",
    category: "Social",
    businessImpact: 8.6, 
    sustainabilityImpact: 7.0,
    color: "#60a5fa",
    description: "Developing digital solutions that advance sustainable finance"
  },
  { 
    id: "operational-efficiency", 
    name: "Operational Efficiency",
    category: "Environment",
    businessImpact: 7.8, 
    sustainabilityImpact: 7.2,
    color: "#22c55e",
    description: "Reducing environmental footprint of financial operations"
  },
  { 
    id: "talent-development", 
    name: "Talent Development",
    category: "Social",
    businessImpact: 8.2, 
    sustainabilityImpact: 6.8,
    color: "#60a5fa",
    description: "Developing employee skills for sustainable finance"
  }
];

