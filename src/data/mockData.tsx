import { BarChart, LineChart, PieChart } from "lucide-react";

// ESG KPIs
export const esgKPIs = [
  { id: 1, category: "Environment", name: "Carbon Footprint", unit: "tCO2e", target: 5000, current: 6200, progress: 82 },
  { id: 2, category: "Environment", name: "Water Usage", unit: "kL", target: 20000, current: 18500, progress: 92 },
  { id: 3, category: "Environment", name: "Renewable Energy", unit: "%", target: 50, current: 32, progress: 64 },
  { id: 4, category: "Social", name: "Gender Diversity", unit: "%", target: 45, current: 38, progress: 84 },
  { id: 5, category: "Social", name: "Training Hours", unit: "hrs/employee", target: 40, current: 28, progress: 70 },
  { id: 6, category: "Governance", name: "Compliance Score", unit: "%", target: 100, current: 92, progress: 92 },
];

// SDG Goals
export const sdgGoals = [
  { id: 7, name: "No Poverty", number: 1, progress: 45 },
  { id: 8, name: "Zero Hunger", number: 2, progress: 38 },
  { id: 9, name: "Good Health and Well-being", number: 3, progress: 67 },
  { id: 10, name: "Quality Education", number: 4, progress: 82 },
  { id: 11, name: "Gender Equality", number: 5, progress: 73 },
  { id: 13, name: "Climate Action", number: 13, progress: 61 },
  { id: 14, name: "Life Below Water", number: 14, progress: 54 },
];

// GHG Emissions Data
export const emissionsByLocation = [
  { name: "Mumbai HQ", scope1: 1200, scope2: 3400, scope3: 5800 },
  { name: "Delhi Branch", scope1: 800, scope2: 2200, scope3: 3600 },
  { name: "Bangalore Tech", scope1: 300, scope2: 1800, scope3: 2400 },
  { name: "Chennai Ops", scope1: 500, scope2: 1400, scope3: 1900 },
];

export const emissionsYearly = [
  { year: 2018, emissions: 14800 },
  { year: 2019, emissions: 15600 },
  { year: 2020, emissions: 12400 },
  { year: 2021, emissions: 13200 },
  { year: 2022, emissions: 12800 },
  { year: 2023, emissions: 11200 },
];

// Learning Management System
export const trainingModules = [
  { id: 1, title: "ESG Fundamentals", duration: "2 hours", completion: 84, category: "ESG" },
  { id: 2, title: "Carbon Accounting Principles", duration: "3 hours", completion: 67, category: "GHG" },
  { id: 3, title: "Workplace Safety Essentials", duration: "1.5 hours", completion: 92, category: "EHS" },
  { id: 4, title: "BRSR Reporting Requirements", duration: "2.5 hours", completion: 58, category: "Reporting" },
  { id: 5, title: "Chemical Handling Safety", duration: "1 hour", completion: 76, category: "EHS" },
  { id: 6, title: "Sustainable Supply Chain", duration: "2 hours", completion: 45, category: "ESG" },
];

// Compliance Items
export const complianceItems = [
  { id: 1, name: "BRSR Submission", deadline: "2024-06-30", status: "On Track", category: "Reporting" },
  { id: 2, name: "Annual EHS Audit", deadline: "2024-05-15", status: "At Risk", category: "EHS" },
  { id: 3, name: "Companies Act Section 134", deadline: "2024-07-31", status: "On Track", category: "Legal" },
  { id: 4, name: "EPR Documentation", deadline: "2024-04-30", status: "Completed", category: "Environmental" },
  { id: 5, name: "Labour Law Compliance", deadline: "2024-03-31", status: "Completed", category: "Labor" },
];

// Navigation Items
export const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "ESG Management", href: "/esg", icon: "BarChart3" },
  { id: "GHG Accounting", href: "/ghg", icon: "LineChart" },
  { name: "Compliance", href: "/compliance", icon: "ClipboardCheck" },
  { name: "LMS", href: "/lms", icon: "GraduationCap" },
  { name: "EHS Trainings", href: "/ehs-trainings", icon: "Calendar" },
];

// Vendor Navigation Items
export const vendorNavItems = [
  { name: "Dashboard", href: "/vendor/dashboard", icon: "LayoutDashboard" },
  { name: "Available Trainings", href: "/vendor/trainings", icon: "Calendar" },
  { name: "My Bids", href: "/vendor/bids", icon: "FileText" },
  { name: "Profile", href: "/vendor/profile", icon: "User" },
];

// Dashboard Analytics Cards
export interface AnalyticsCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.FC;
  description: string;
  color: string;
}

export const analyticsCards = [
  { 
    title: "ESG Score", 
    value: "78/100", 
    change: 5.2, 
    icon: BarChart, 
    description: "Overall ESG performance", 
    color: "bg-green-50 text-green-700" 
  },
  { 
    title: "Carbon Footprint", 
    value: "11,200 tCO2e", 
    change: -8.4, 
    icon: LineChart, 
    description: "Annual emissions", 
    color: "bg-blue-50 text-blue-700" 
  },
  { 
    title: "Compliance Rate", 
    value: "92%", 
    change: 2.1, 
    icon: PieChart, 
    description: "Regulatory adherence", 
    color: "bg-amber-50 text-amber-700" 
  },
];

// Personal GHG Calculator Parameters
export const personalGHGParams = [
  { id: "commute", label: "Daily Commute", options: [
    { value: "public", label: "Public Transport", co2Factor: 0.05 },
    { value: "car_petrol", label: "Car (Petrol)", co2Factor: 0.2 },
    { value: "car_diesel", label: "Car (Diesel)", co2Factor: 0.18 },
    { value: "two_wheeler", label: "Two Wheeler", co2Factor: 0.09 },
    { value: "walking", label: "Walking/Cycling", co2Factor: 0 },
  ]},
  { id: "electricity", label: "Monthly Electricity", unit: "kWh" },
  { id: "flights", label: "Flights per Year", unit: "trips" },
  { id: "diet", label: "Dietary Preference", options: [
    { value: "meat_daily", label: "Meat Daily", co2Factor: 3.3 },
    { value: "meat_weekly", label: "Meat Weekly", co2Factor: 2.5 },
    { value: "vegetarian", label: "Vegetarian", co2Factor: 1.7 },
    { value: "vegan", label: "Vegan", co2Factor: 1.5 },
  ]},
];

interface Attendee {
  name: string;
  email: string;
}

interface EHSTraining {
  id: string;
  name: string;
  description: string;
  clientCompany: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  attendees: Attendee[];
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  trainingType: 'online' | 'offline';
  trainerName?: string;
  assignedVendorId?: string;
  bidOpen?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string;
  address: string;
  specialties: string[];
  verified: boolean;
}

export interface TrainingBid {
  id: string;
  trainingId: string;
  vendorId: string;
  vendorName: string;
  contentFee: number;
  trainingFee: number;
  travelFee: number;
  totalFee: number;
  submittedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  trainerResumes: {
    trainerId: string;
    name: string;
    fileUrl: string;
  }[];
}

const vendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'John Clark',
    email: 'vendor1@example.com',
    companyName: 'SafetyFirst Training Ltd.',
    phone: '+1-555-111-2233',
    address: '123 Training Ave, Safety City',
    specialties: ['Chemical Handling', 'Fire Safety', 'Emergency Response'],
    verified: true
  },
  {
    id: 'vendor-2',
    name: 'Sarah Johnson',
    email: 'vendor2@example.com',
    companyName: 'EHS Excellence Corp',
    phone: '+1-555-444-5566',
    address: '456 Compliance Road, Quality Town',
    specialties: ['Workplace Safety', 'Environmental Compliance', 'Risk Assessment'],
    verified: true
  }
];

const trainingBids: TrainingBid[] = [
  {
    id: 'bid-1',
    trainingId: '2',
    vendorId: 'vendor-1',
    vendorName: 'SafetyFirst Training Ltd.',
    contentFee: 1500,
    trainingFee: 2500,
    travelFee: 800,
    totalFee: 4800,
    submittedDate: '2025-04-01',
    status: 'pending',
    trainerResumes: [
      {
        trainerId: 'trainer-1',
        name: 'Robert Smith',
        fileUrl: '/resumes/robert-smith.pdf'
      }
    ]
  }
];

const ehsTrainings: EHSTraining[] = [
  {
    id: '1',
    name: 'Workplace Safety Training',
    description: 'Comprehensive training on workplace safety protocols, including emergency procedures and hazard identification.',
    clientCompany: 'ABC Corp',
    date: '2025-04-15',
    time: '10:00 AM',
    duration: '3 hours',
    location: 'Client HQ, New York',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'John Smith', email: 'john.smith@abccorp.com' },
      { name: 'Jane Doe', email: 'jane.doe@abccorp.com' },
      { name: 'Robert Johnson', email: 'robert.j@abccorp.com' },
    ]
  },
  {
    id: '2',
    name: 'Chemical Handling',
    description: 'Training on proper handling, storage, and disposal of hazardous chemicals in industrial settings.',
    clientCompany: 'XYZ Industries',
    date: '2025-04-22',
    time: '9:30 AM',
    duration: '4 hours',
    location: 'XYZ Manufacturing Plant',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'Michael Brown', email: 'm.brown@xyzind.com' },
      { name: 'Sarah Wilson', email: 's.wilson@xyzind.com' },
      { name: 'David Lee', email: 'd.lee@xyzind.com' },
      { name: 'Emily Chen', email: 'e.chen@xyzind.com' },
    ]
  },
  {
    id: '3',
    name: 'Environmental Compliance',
    description: 'Overview of environmental regulations and compliance requirements for manufacturing operations.',
    clientCompany: 'GreenTech Solutions',
    date: '2025-05-05',
    time: '1:00 PM',
    duration: '2 hours',
    location: 'Virtual Session',
    status: 'scheduled',
    trainingType: 'online',
    bidOpen: true,
    attendees: [
      { name: 'Thomas Green', email: 't.green@greentech.com' },
      { name: 'Lisa Park', email: 'l.park@greentech.com' },
    ]
  },
  {
    id: '4',
    name: 'Fire Safety Training',
    description: 'Training on fire prevention, detection, and emergency response procedures.',
    clientCompany: 'Urban Development Corp',
    date: '2025-04-10',
    time: '11:00 AM',
    duration: '2.5 hours',
    location: 'Urban Development HQ',
    status: 'completed',
    trainingType: 'offline',
    assignedVendorId: 'vendor-1',
    bidOpen: false,
    attendees: [
      { name: 'Mark Taylor', email: 'm.taylor@udc.com' },
      { name: 'Anna Martin', email: 'a.martin@udc.com' },
      { name: 'Kevin White', email: 'k.white@udc.com' },
    ]
  },
  {
    id: '5',
    name: 'Machine Operator Safety',
    description: 'Training on safe operation procedures for industrial machinery and equipment.',
    clientCompany: 'Precision Manufacturing Inc',
    date: '2025-05-12',
    time: '9:00 AM',
    duration: '5 hours',
    location: 'Precision Factory, Chicago',
    status: 'scheduled',
    trainingType: 'offline',
    assignedVendorId: 'vendor-2',
    bidOpen: false,
    attendees: [
      { name: 'Confidential', email: 'employee1@precision.com' },
      { name: 'Confidential', email: 'employee2@precision.com' },
      { name: 'Confidential', email: 'employee3@precision.com' },
      { name: 'Confidential', email: 'employee4@precision.com' },
      { name: 'Confidential', email: 'employee5@precision.com' },
    ]
  },
];

export const fetchEHSTrainings = async (): Promise<EHSTraining[]> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ehsTrainings;
};

export const fetchEHSTrainingById = async (id: string): Promise<EHSTraining | undefined> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return ehsTrainings.find(training => training.id === id);
};

export const fetchVendorProfile = async (vendorId: string): Promise<Vendor | undefined> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return vendors.find(vendor => vendor.id === vendorId);
};

export const fetchTrainingBids = async (trainingId?: string, vendorId?: string): Promise<TrainingBid[]> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredBids = [...trainingBids];
  
  if (trainingId) {
    filteredBids = filteredBids.filter(bid => bid.trainingId === trainingId);
  }
  
  if (vendorId) {
    filteredBids = filteredBids.filter(bid => bid.vendorId === vendorId);
  }
  
  return filteredBids;
};

export const fetchVendorTrainings = async (vendorId: string): Promise<EHSTraining[]> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return trainings that are either:
  // 1. Open for bidding (bidOpen is true) - for all vendors
  // 2. Assigned to this specific vendor
  return ehsTrainings.filter(training => (
    (training.bidOpen === true) || (training.assignedVendorId === vendorId)
  ));
};
