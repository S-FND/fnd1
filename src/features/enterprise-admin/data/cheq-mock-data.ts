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
