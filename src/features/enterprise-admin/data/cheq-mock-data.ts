
// Mock data for CheQ.one financial institution

// Company information
export const companyInfo = {
  name: "CheQ.one Financial Services",
  industry: "Financial Services",
  founded: 2012,
  employees: 3850,
  headquarters: "Mumbai, India",
  locations: ["Mumbai", "Bengaluru", "Delhi", "Chennai", "Pune", "Hyderabad"],
  logo: "/assets/cheq-logo.png"
};

// Dashboard analytics cards data
export const analyticsCardsData = [
  {
    title: "Carbon Footprint",
    value: "-18%",
    description: "Year-over-year reduction",
    change: 12,
    color: "text-green-500",
  },
  {
    title: "ESG Score",
    value: "78/100",
    description: "S&P Global ESG Rating",
    change: 4,
    color: "text-blue-500",
  },
  {
    title: "Compliance Rate",
    value: "96%",
    description: "Regulatory compliance",
    change: 3,
    color: "text-amber-500",
  },
];

// Monthly ESG trend data
export const cheqMonthlyTrendData = [
  { month: 'Jan', environmental: 68, social: 72, governance: 78 },
  { month: 'Feb', environmental: 70, social: 73, governance: 79 },
  { month: 'Mar', environmental: 72, social: 74, governance: 80 },
  { month: 'Apr', environmental: 75, social: 76, governance: 81 },
  { month: 'May', environmental: 78, social: 77, governance: 82 },
  { month: 'Jun', environmental: 80, social: 78, governance: 83 }
];

// Sustainability initiatives for CheQ.one
export const cheqInitiatives = [
  {
    title: "Green Fintech Alliance",
    description: "Partnership with fintech companies to develop sustainable financial products",
    status: "In Progress",
    progress: 65,
    dueDate: "2024-08-30"
  },
  {
    title: "Digital Sustainability Program",
    description: "Reducing paper consumption by 90% through digital transformation",
    status: "Completed",
    progress: 100,
    dueDate: "2024-03-15"
  },
  {
    title: "Sustainable Investment Portfolio",
    description: "Increasing ESG-focused investments to 40% of total portfolio",
    status: "In Progress",
    progress: 72,
    dueDate: "2024-09-30"
  },
  {
    title: "Net-Zero Banking Alliance",
    description: "Commitment to align lending portfolios with net-zero emissions by 2050",
    status: "In Progress",
    progress: 35,
    dueDate: "2025-12-31"
  },
];

// ESG KPIs for CheQ.one
export const cheqESGKPIs = [
  {
    id: "green-finance",
    name: "Green Finance Portfolio",
    category: "Environment",
    unit: "Billion INR",
    current: 42,
    target: 100,
    baseline: 15,
    progress: 42,
    impact: "high",
    trend: "increasing"
  },
  {
    id: "carbon-footprint",
    name: "Carbon Footprint",
    category: "Environment",
    unit: "tCO2e",
    current: 9800,
    target: 5000,
    baseline: 12000,
    progress: 54,
    impact: "high",
    trend: "decreasing"
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy Use",
    category: "Environment",
    unit: "%",
    current: 65,
    target: 100,
    baseline: 30,
    progress: 65,
    impact: "medium",
    trend: "increasing"
  },
  {
    id: "digital-adoption",
    name: "Digital Banking Adoption",
    category: "Environment",
    unit: "%",
    current: 78,
    target: 95,
    baseline: 50,
    progress: 82,
    impact: "medium",
    trend: "increasing"
  },
  {
    id: "diversity-management",
    name: "Women in Management",
    category: "Social",
    unit: "%",
    current: 36,
    target: 50,
    baseline: 25,
    progress: 72,
    impact: "high",
    trend: "increasing"
  },
  {
    id: "employee-training",
    name: "ESG Training",
    category: "Social",
    unit: "Hours/employee",
    current: 15,
    target: 24,
    baseline: 8,
    progress: 62,
    impact: "medium",
    trend: "increasing"
  },
  {
    id: "community-investment",
    name: "Community Investment",
    category: "Social",
    unit: "Million INR",
    current: 85,
    target: 150,
    baseline: 45,
    progress: 57,
    impact: "medium",
    trend: "increasing"
  },
  {
    id: "financial-inclusion",
    name: "Financial Inclusion Programs",
    category: "Social",
    unit: "# of programs",
    current: 12,
    target: 20,
    baseline: 5,
    progress: 60,
    impact: "high",
    trend: "increasing"
  },
  {
    id: "board-independence",
    name: "Board Independence",
    category: "Governance",
    unit: "%",
    current: 62,
    target: 75,
    baseline: 50,
    progress: 83,
    impact: "high",
    trend: "stable"
  },
  {
    id: "esg-oversight",
    name: "ESG Risk Oversight",
    category: "Governance",
    unit: "Score",
    current: 8,
    target: 10,
    baseline: 6,
    progress: 80,
    impact: "high",
    trend: "increasing"
  },
  {
    id: "disclosure-quality",
    name: "ESG Disclosure Quality",
    category: "Governance",
    unit: "Score",
    current: 7.5,
    target: 9,
    baseline: 5,
    progress: 83,
    impact: "medium",
    trend: "increasing"
  },
  {
    id: "data-security",
    name: "Data Security Incidents",
    category: "Governance",
    unit: "# incidents",
    current: 2,
    target: 0,
    baseline: 5,
    progress: 60,
    impact: "high",
    trend: "decreasing"
  }
];

// Financial services materiality topics
export const cheqMaterialTopics = [
  { 
    id: 'responsible_investing', 
    name: 'Responsible Investing',
    category: 'Governance',
    businessImpact: 9.2, 
    sustainabilityImpact: 9.0,
    color: '#f59e0b',
    description: 'Integrating ESG factors into investment decisions and portfolio management',
    importance: 'High',
    baseline: '30% ESG-integrated AUM (2021)',
    target: '75% ESG-integrated AUM (2030)',
    currentStatus: '52% ESG-integrated AUM',
    progress: 69
  },
  { 
    id: 'financial_inclusion', 
    name: 'Financial Inclusion',
    category: 'Social',
    businessImpact: 8.5, 
    sustainabilityImpact: 9.3,
    color: '#60a5fa',
    description: 'Expanding access to financial services for underserved populations',
    importance: 'High',
    baseline: '2.5M underbanked customers (2021)',
    target: '10M underbanked customers (2030)',
    currentStatus: '5.8M underbanked customers',
    progress: 62
  },
  { 
    id: 'green_finance', 
    name: 'Green Finance',
    category: 'Environment',
    businessImpact: 8.7, 
    sustainabilityImpact: 9.5,
    color: '#22c55e',
    description: 'Financing environmental initiatives and sustainable projects',
    importance: 'High',
    baseline: '₹15B green finance portfolio (2021)',
    target: '₹100B green finance portfolio (2030)',
    currentStatus: '₹42B green finance portfolio',
    progress: 42
  },
  { 
    id: 'climate_risk', 
    name: 'Climate Risk Management',
    category: 'Environment',
    businessImpact: 8.3, 
    sustainabilityImpact: 8.8,
    color: '#22c55e',
    description: 'Assessing and managing climate-related financial risks',
    importance: 'High',
    baseline: '20% portfolio assessed (2021)',
    target: '100% portfolio assessed (2028)',
    currentStatus: '65% portfolio assessed',
    progress: 65
  },
  { 
    id: 'financial_literacy', 
    name: 'Financial Literacy',
    category: 'Social',
    businessImpact: 7.8, 
    sustainabilityImpact: 8.5,
    color: '#60a5fa',
    description: 'Educating customers and communities on financial management',
    importance: 'Medium',
    baseline: '500K people reached (2021)',
    target: '3M people reached (2030)',
    currentStatus: '1.4M people reached',
    progress: 47
  },
  { 
    id: 'data_privacy', 
    name: 'Data Privacy & Security',
    category: 'Governance',
    businessImpact: 9.4, 
    sustainabilityImpact: 8.0,
    color: '#f59e0b',
    description: 'Protecting customer data and preventing cybersecurity incidents',
    importance: 'High',
    baseline: '5 incidents (2021)',
    target: '0 incidents (2026)',
    currentStatus: '2 incidents',
    progress: 60
  },
  { 
    id: 'digital_transformation', 
    name: 'Digital Transformation',
    category: 'Governance',
    businessImpact: 9.0, 
    sustainabilityImpact: 7.5,
    color: '#f59e0b',
    description: 'Implementing digital solutions to reduce environmental footprint',
    importance: 'High',
    baseline: '50% digital processes (2021)',
    target: '95% digital processes (2027)',
    currentStatus: '78% digital processes',
    progress: 82
  },
  { 
    id: 'diversity', 
    name: 'Diversity & Inclusion',
    category: 'Social',
    businessImpact: 8.2, 
    sustainabilityImpact: 8.0,
    color: '#60a5fa',
    description: 'Building an inclusive workforce and leadership team',
    importance: 'Medium',
    baseline: '25% women in leadership (2021)',
    target: '50% women in leadership (2030)',
    currentStatus: '36% women in leadership',
    progress: 72
  }
];

// GHG emissions data for CheQ.one
export const cheqEmissionsData = {
  totalEmissions: {
    scope1: 1250,
    scope2: 4600,
    scope3: 8700
  },
  totalAllScopes: 14550,
  scopePercentages: [
    { name: "Scope 1", value: 1250, percentage: "8.6%" },
    { name: "Scope 2", value: 4600, percentage: "31.6%" },
    { name: "Scope 3", value: 8700, percentage: "59.8%" }
  ],
  scope1Data: [
    { name: "Company Vehicles", value: 680 },
    { name: "Generators", value: 320 },
    { name: "Refrigerants", value: 250 }
  ],
  scope2Data: [
    { name: "Purchased Electricity", value: 4150 },
    { name: "District Heating", value: 450 }
  ],
  scope3Data: [
    { name: "Business Travel", value: 1850 },
    { name: "Employee Commuting", value: 2100 },
    { name: "Purchased Goods & Services", value: 2800 },
    { name: "Investments", value: 1950 }
  ],
  monthlyEmissionsData: [
    { month: "Jan", scope1: 110, scope2: 395, scope3: 750 },
    { month: "Feb", scope1: 105, scope2: 390, scope3: 730 },
    { month: "Mar", scope1: 102, scope2: 385, scope3: 725 },
    { month: "Apr", scope1: 98, scope2: 380, scope3: 720 },
    { month: "May", scope1: 95, scope2: 370, scope3: 710 },
    { month: "Jun", scope1: 105, scope2: 380, scope3: 725 }
  ]
};

// Stakeholder data for CheQ.one
export const cheqStakeholders = [
  {
    id: '1',
    name: 'Reserve Bank of India',
    organization: 'Government',
    email: 'contact@rbi.gov.in',
    phone: '+91-22-22610000',
    subcategoryId: 'government',
    engagementLevel: 'high',
    influence: 'high',
    interest: 'high',
    lastContact: new Date('2024-03-10')
  },
  {
    id: '2',
    name: 'SEBI',
    organization: 'Government',
    email: 'sebi@sebi.gov.in',
    phone: '+91-22-26449000',
    subcategoryId: 'government',
    engagementLevel: 'high',
    influence: 'high',
    interest: 'medium',
    lastContact: new Date('2024-02-25')
  },
  {
    id: '3',
    name: 'Institutional Investors Group',
    organization: 'Financial Institutions',
    email: 'info@iig.org',
    phone: '+91-22-23450987',
    subcategoryId: 'investors',
    engagementLevel: 'high',
    influence: 'high',
    interest: 'high',
    lastContact: new Date('2024-04-05')
  },
  {
    id: '4',
    name: 'Dr. Vikram Patel',
    organization: 'Board of Directors',
    email: 'vikram.p@cheq.one',
    subcategoryId: 'board',
    engagementLevel: 'high',
    influence: 'high',
    interest: 'high',
    lastContact: new Date('2024-04-15')
  },
  {
    id: '5',
    name: 'Retail Banking Division',
    organization: 'Internal',
    email: 'retail@cheq.one',
    subcategoryId: 'employees',
    engagementLevel: 'medium',
    influence: 'medium',
    interest: 'high',
    lastContact: new Date('2024-03-28')
  },
  {
    id: '6',
    name: 'Digital Solutions Ltd.',
    organization: 'TechCorp',
    email: 'partnerships@digitalsolutions.com',
    phone: '+91-80-45678912',
    subcategoryId: 'suppliers',
    engagementLevel: 'medium',
    influence: 'medium',
    interest: 'medium',
    lastContact: new Date('2024-03-05')
  },
  {
    id: '7',
    name: 'Financial Inclusion Network',
    organization: 'NGO',
    email: 'contact@fin.org',
    phone: '+91-11-23456789',
    subcategoryId: 'ngos',
    engagementLevel: 'medium',
    influence: 'medium',
    interest: 'high',
    lastContact: new Date('2024-02-18')
  },
  {
    id: '8',
    name: 'Green Banking Media',
    organization: 'Media Outlet',
    email: 'editor@greenbanking.com',
    phone: '+91-22-87654321',
    subcategoryId: 'media',
    engagementLevel: 'low',
    influence: 'medium',
    interest: 'medium',
    lastContact: new Date('2024-01-30')
  }
];

// Supplier Audit data for CheQ.one
export const cheqSuppliers = [
  {
    id: 'sup-1',
    name: 'CloudSecure Technologies',
    category: 'IT Services',
    contact: 'Rahul Sharma',
    email: 'rahul@cloudsecure.com',
    phone: '+91-80-26548790',
    status: 'completed',
    score: 87,
    lastUpdated: '2024-03-20'
  },
  {
    id: 'sup-2',
    name: 'FinTech Solutions Inc',
    category: 'Financial Technology',
    contact: 'Priya Mehta',
    email: 'priya@fintechsolutions.com',
    phone: '+91-22-40987654',
    status: 'in_progress',
    lastUpdated: '2024-04-10'
  },
  {
    id: 'sup-3',
    name: 'SecureID Verification',
    category: 'Identity Services',
    contact: 'Vikram Singh',
    email: 'vikram@secureid.com',
    phone: '+91-124-4567890',
    status: 'pending',
    lastUpdated: '2024-04-05'
  },
  {
    id: 'sup-4',
    name: 'Digital Marketing Partners',
    category: 'Marketing Services',
    contact: 'Neha Gupta',
    email: 'neha@dmp.com',
    phone: '+91-80-23456789',
    status: 'not_started',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'sup-5',
    name: 'NextGen Payment Systems',
    category: 'Payment Solutions',
    contact: 'Arjun Reddy',
    email: 'arjun@nextgenpay.com',
    phone: '+91-40-98765432',
    status: 'completed',
    score: 92,
    lastUpdated: '2024-02-28'
  },
  {
    id: 'sup-6',
    name: 'Sustainable Office Solutions',
    category: 'Office Supplies',
    contact: 'Aisha Patel',
    email: 'aisha@sustainableoffice.com',
    phone: '+91-22-34567890',
    status: 'pending',
    lastUpdated: '2024-03-25'
  },
  {
    id: 'sup-7',
    name: 'EcoDatacenter Services',
    category: 'Data Center',
    contact: 'Rajiv Kumar',
    email: 'rajiv@ecodatacenter.com',
    phone: '+91-80-12345678',
    status: 'completed',
    score: 79,
    lastUpdated: '2024-03-05'
  }
];

// Training and LMS data for CheQ.one
export const cheqTrainingModules = [
  {
    id: 'trn-001',
    title: 'Anti-Money Laundering Essentials',
    category: 'Compliance',
    description: 'Core training on AML regulations and compliance procedures',
    duration: '2 hours',
    completion: 100,
    dueDate: '2024-02-15'
  },
  {
    id: 'trn-002',
    title: 'ESG in Financial Services',
    category: 'ESG',
    description: 'Overview of ESG factors in banking and investment decisions',
    duration: '3 hours',
    completion: 85,
    dueDate: '2024-05-30'
  },
  {
    id: 'trn-003',
    title: 'Sustainable Finance Products',
    category: 'ESG',
    description: 'Deep dive into green bonds, sustainable loans, and ESG investments',
    duration: '2.5 hours',
    completion: 65,
    dueDate: '2024-06-15'
  },
  {
    id: 'trn-004',
    title: 'Cyber Security Awareness',
    category: 'EHS',
    description: 'Critical security practices for protecting customer data',
    duration: '1.5 hours',
    completion: 100,
    dueDate: '2024-03-10'
  },
  {
    id: 'trn-005',
    title: 'Workplace Safety for Financial Institutions',
    category: 'EHS',
    description: 'Guidelines for maintaining safe office environments',
    duration: '1 hour',
    completion: 90,
    dueDate: '2024-04-20'
  },
  {
    id: 'trn-006',
    title: 'Climate Risk Assessment',
    category: 'ESG',
    description: 'Methods for evaluating climate risks in lending and investment portfolios',
    duration: '4 hours',
    completion: 40,
    dueDate: '2024-07-15'
  },
  {
    id: 'trn-007',
    title: 'Financial Inclusion Principles',
    category: 'ESG',
    description: 'Strategies for increasing access to banking services for underserved populations',
    duration: '2 hours',
    completion: 0,
    dueDate: '2024-08-10'
  },
  {
    id: 'trn-008',
    title: 'Digital Banking Carbon Footprint',
    category: 'GHG',
    description: 'Understanding and reducing carbon impact of digital banking operations',
    duration: '1.5 hours',
    completion: 20,
    dueDate: '2024-08-30'
  }
];

// EHS training data for CheQ.one
export const cheqEHSTrainings = [
  {
    id: 'ehs-001',
    name: 'Data Center Safety Protocols',
    description: 'Safety procedures for data center operations and maintenance',
    type: 'Mandatory',
    category: 'Facility Safety',
    assignedEmployees: 125,
    completionRate: 94,
    nextDueDate: '2024-06-15'
  },
  {
    id: 'ehs-002',
    name: 'Ergonomics for Banking Professionals',
    description: 'Workstation setup and practices to prevent repetitive strain injuries',
    type: 'Required',
    category: 'Workplace Health',
    assignedEmployees: 2800,
    completionRate: 78,
    nextDueDate: '2024-05-30'
  },
  {
    id: 'ehs-003',
    name: 'Emergency Response for Branch Locations',
    description: 'Procedures for handling emergencies at branch offices',
    type: 'Mandatory',
    category: 'Emergency Preparedness',
    assignedEmployees: 1450,
    completionRate: 86,
    nextDueDate: '2024-07-10'
  },
  {
    id: 'ehs-004',
    name: 'Mental Health First Aid',
    description: 'Recognizing and responding to mental health challenges in the workplace',
    type: 'Optional',
    category: 'Wellness',
    assignedEmployees: 950,
    completionRate: 62,
    nextDueDate: '2024-08-20'
  },
  {
    id: 'ehs-005',
    name: 'Sustainable Office Practices',
    description: 'Reducing environmental footprint in daily operations',
    type: 'Required',
    category: 'Environmental',
    assignedEmployees: 3200,
    completionRate: 71,
    nextDueDate: '2024-06-30'
  },
  {
    id: 'ehs-006',
    name: 'Physical Security Awareness',
    description: 'Maintaining security in banking premises and preventing unauthorized access',
    type: 'Mandatory',
    category: 'Security',
    assignedEmployees: 3500,
    completionRate: 92,
    nextDueDate: '2024-05-15'
  }
];

// Risk data for CheQ.one
export const cheqRisks = [
  {
    id: 'risk-001',
    title: 'Climate Transition Risk',
    category: 'Environmental',
    description: 'Financial impacts due to transition to a low-carbon economy',
    likelihood: 'High',
    impact: 'High',
    mitigation: 'Portfolio diversification, stress testing climate scenarios',
    status: 'Monitoring'
  },
  {
    id: 'risk-002',
    title: 'Data Security Breach',
    category: 'Governance',
    description: 'Unauthorized access to customer financial data',
    likelihood: 'Medium',
    impact: 'High',
    mitigation: 'Enhanced cybersecurity protocols, regular penetration testing',
    status: 'Mitigated'
  },
  {
    id: 'risk-003',
    title: 'Regulatory Non-Compliance',
    category: 'Governance',
    description: 'Failure to comply with new ESG disclosure requirements',
    likelihood: 'Medium',
    impact: 'Medium',
    mitigation: 'Regulatory tracking system, compliance training',
    status: 'Active'
  },
  {
    id: 'risk-004',
    title: 'Financed Emissions Exposure',
    category: 'Environmental',
    description: 'Carbon-intensive assets in loan portfolio becoming stranded',
    likelihood: 'Medium',
    impact: 'High',
    mitigation: 'Portfolio carbon accounting, gradual transition planning',
    status: 'Active'
  },
  {
    id: 'risk-005',
    title: 'Talent Retention',
    category: 'Social',
    description: 'Losing skilled employees due to inadequate ESG commitments',
    likelihood: 'Medium',
    impact: 'Medium',
    mitigation: 'Enhanced ESG strategy, improved employee engagement programs',
    status: 'Monitoring'
  },
  {
    id: 'risk-006',
    title: 'Greenwashing Allegations',
    category: 'Governance',
    description: 'Accusations of misleading sustainability claims',
    likelihood: 'Low',
    impact: 'High',
    mitigation: 'Third-party verification of ESG claims, transparent reporting',
    status: 'Monitoring'
  }
];
