export interface Attendee {
  name: string;
  email: string;
}

export interface EHSTraining {
  id: string;
  name: string;
  description: string;
  clientCompany: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'pending-approval' | 'approved' | 'rejected';
  attendees: Attendee[];
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  trainingType: 'online' | 'offline';
  trainerName?: string;
  assignedVendorId?: string;
  bidOpen?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  recommendedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
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
    name: 'Rajesh Kumar',
    email: 'rajesh@safetyfirst.in',
    companyName: 'SafetyFirst Training Ltd.',
    phone: '+91-98765-43210',
    address: '123 Training Avenue, Mumbai 400001',
    specialties: ['Hazardous Materials Handling', 'Fire Safety', 'Emergency Response'],
    verified: true
  },
  {
    id: 'vendor-2',
    name: 'Priya Sharma',
    email: 'priya@ehsexcellence.in',
    companyName: 'EHS Excellence India Pvt. Ltd.',
    phone: '+91-87654-32109',
    address: '456 Compliance Road, Bangalore 560001',
    specialties: ['Workplace Safety', 'Environmental Compliance', 'Risk Assessment'],
    verified: true
  },
  {
    id: 'vendor-3',
    name: 'Amit Patel',
    email: 'amit@logisticssafety.in',
    companyName: 'Logistics Safety Solutions',
    phone: '+91-76543-21098',
    address: '789 Transport Nagar, Delhi 110001',
    specialties: ['Cargo Handling Safety', 'Driver Safety', 'Warehouse Safety'],
    verified: true
  }
];

const trainingBids: TrainingBid[] = [
  {
    id: 'bid-1',
    trainingId: '2',
    vendorId: 'vendor-1',
    vendorName: 'SafetyFirst Training Ltd.',
    contentFee: 85000,
    trainingFee: 120000,
    travelFee: 25000,
    totalFee: 230000,
    submittedDate: '2025-04-01',
    status: 'pending',
    trainerResumes: [
      {
        trainerId: 'trainer-1',
        name: 'Vikram Singh',
        fileUrl: '/resumes/vikram-singh.pdf'
      }
    ]
  },
  {
    id: 'bid-2',
    trainingId: '2',
    vendorId: 'vendor-3',
    vendorName: 'Logistics Safety Solutions',
    contentFee: 75000,
    trainingFee: 130000,
    travelFee: 20000,
    totalFee: 225000,
    submittedDate: '2025-04-02',
    status: 'pending',
    trainerResumes: [
      {
        trainerId: 'trainer-2',
        name: 'Anita Desai',
        fileUrl: '/resumes/anita-desai.pdf'
      }
    ]
  },
  {
    id: 'bid-3',
    trainingId: '3',
    vendorId: 'vendor-2',
    vendorName: 'EHS Excellence India Pvt. Ltd.',
    contentFee: 60000,
    trainingFee: 90000,
    travelFee: 0,
    totalFee: 150000,
    submittedDate: '2025-04-03',
    status: 'pending',
    trainerResumes: [
      {
        trainerId: 'trainer-3',
        name: 'Deepak Mehta',
        fileUrl: '/resumes/deepak-mehta.pdf'
      }
    ]
  }
];

const ehsTrainings: EHSTraining[] = [
  {
    id: '9',
    name: 'Chemical Safety & Hazmat Handling for Logistics',
    description: 'Comprehensive training on chemical safety protocols, hazardous materials handling, and emergency response procedures for logistics operations.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-04-30',
    time: '9:00 AM',
    duration: '6 hours',
    location: 'Mumbai CFS Facility, JNPT Area',
    status: 'pending-approval',
    trainingType: 'offline',
    bidOpen: false,
    approvalStatus: 'pending',
    recommendedBy: 'EHS Department',
    submittedDate: '2025-04-12',
    attendees: [
      { name: 'Arvind Patil', email: 'a.patil@translogindia.com' },
      { name: 'Suman Shah', email: 's.shah@translogindia.com' },
      { name: 'Rakesh Kumar', email: 'r.kumar@translogindia.com' },
      { name: 'Neha Gupta', email: 'n.gupta@translogindia.com' },
      { name: 'Mohammed Khan', email: 'm.khan@translogindia.com' },
      { name: 'Priya Sharma', email: 'p.sharma@translogindia.com' },
    ]
  },
  {
    id: '1',
    name: 'Warehouse Safety Training',
    description: 'Comprehensive training on warehouse safety protocols, including material handling, forklift operations, and hazard identification for our logistics facilities.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-04-15',
    time: '10:00 AM',
    duration: '4 hours',
    location: 'Mumbai CFS Facility, JNPT Area',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'Arvind Patil', email: 'a.patil@translogindia.com' },
      { name: 'Suman Shah', email: 's.shah@translogindia.com' },
      { name: 'Rakesh Kumar', email: 'r.kumar@translogindia.com' },
      { name: 'Neha Gupta', email: 'n.gupta@translogindia.com' },
      { name: 'Mohammed Khan', email: 'm.khan@translogindia.com' },
    ]
  },
  {
    id: '2',
    name: 'Hazardous Cargo Handling',
    description: 'Training on proper handling, storage, and transportation of hazardous cargo in line with IMDG Code and ADR regulations for cross-border logistics operations.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-04-22',
    time: '9:30 AM',
    duration: '6 hours',
    location: 'Chennai ICD Facility',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'Venkat Rao', email: 'v.rao@translogindia.com' },
      { name: 'Lakshmi Narayanan', email: 'l.narayanan@translogindia.com' },
      { name: 'Abdul Rahman', email: 'a.rahman@translogindia.com' },
      { name: 'Kavita Krishnan', email: 'k.krishnan@translogindia.com' },
      { name: 'Deepak Sharma', email: 'd.sharma@translogindia.com' },
      { name: 'Priya Patel', email: 'p.patel@translogindia.com' },
    ]
  },
  {
    id: '3',
    name: 'Environmental Compliance for Logistics Operations',
    description: 'Overview of environmental regulations and compliance requirements for multimodal transport operations, container freight stations, and warehouse facilities.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-05-05',
    time: '1:00 PM',
    duration: '3 hours',
    location: 'Virtual Session',
    status: 'scheduled',
    trainingType: 'online',
    bidOpen: true,
    attendees: [
      { name: 'Sanjay Mehta', email: 's.mehta@translogindia.com' },
      { name: 'Priya Singh', email: 'p.singh@translogindia.com' },
      { name: 'Rahul Verma', email: 'r.verma@translogindia.com' },
      { name: 'Anita Gupta', email: 'a.gupta@translogindia.com' },
      { name: 'Vikram Reddy', email: 'v.reddy@translogindia.com' },
    ]
  },
  {
    id: '4',
    name: 'Fire Safety for Logistics Facilities',
    description: 'Comprehensive fire prevention, detection, and emergency response procedures specific to warehouse and container freight station environments.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-04-10',
    time: '11:00 AM',
    duration: '4 hours',
    location: 'Delhi NCR Logistics Park',
    status: 'completed',
    trainingType: 'offline',
    assignedVendorId: 'vendor-1',
    bidOpen: false,
    attendees: [
      { name: 'Amit Kapoor', email: 'a.kapoor@translogindia.com' },
      { name: 'Sunita Agarwal', email: 's.agarwal@translogindia.com' },
      { name: 'Rajiv Kumar', email: 'r.kumar@translogindia.com' },
      { name: 'Pooja Sharma', email: 'p.sharma@translogindia.com' },
      { name: 'Vishal Singh', email: 'v.singh@translogindia.com' },
    ]
  },
  {
    id: '5',
    name: 'Heavy Equipment Operator Safety',
    description: 'Training on safe operation procedures for container handling equipment, reach stackers, forklifts, and other machinery used in CFS/ICD operations.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-05-12',
    time: '9:00 AM',
    duration: '5 hours',
    location: 'Mundra Port Logistics Facility, Gujarat',
    status: 'scheduled',
    trainingType: 'offline',
    assignedVendorId: 'vendor-2',
    bidOpen: false,
    attendees: [
      { name: 'Bharat Patel', email: 'b.patel@translogindia.com' },
      { name: 'Suresh Rajput', email: 's.rajput@translogindia.com' },
      { name: 'Ganesh Yadav', email: 'g.yadav@translogindia.com' },
      { name: 'Ramesh Kumar', email: 'r.kumar2@translogindia.com' },
      { name: 'Sunil Mehra', email: 's.mehra@translogindia.com' },
    ]
  },
  {
    id: '6',
    name: 'Driver Safety & Eco-Driving Techniques',
    description: 'Training on safe driving practices, fatigue management, and eco-driving techniques to reduce fuel consumption and emissions.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-05-20',
    time: '10:00 AM',
    duration: '6 hours',
    location: 'Bangalore Transportation Hub',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'Raju Naidu', email: 'r.naidu@translogindia.com' },
      { name: 'Mohammed Ali', email: 'm.ali@translogindia.com' },
      { name: 'Surinder Singh', email: 's.singh@translogindia.com' },
      { name: 'Prakash Raj', email: 'p.raj@translogindia.com' },
      { name: 'Venkatesh K', email: 'v.k@translogindia.com' },
      { name: 'Ramesh Sharma', email: 'r.sharma@translogindia.com' },
      { name: 'Gurpreet Singh', email: 'g.singh@translogindia.com' },
      { name: 'Syed Ahmed', email: 's.ahmed@translogindia.com' },
    ]
  },
  {
    id: '7',
    name: 'Emergency Response for Chemical Spills',
    description: 'Specialized training on handling chemical spill emergencies in transportation and storage facilities, including containment and cleanup procedures.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-06-02',
    startDate: '2025-06-02',
    endDate: '2025-06-03',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    time: '9:00 AM',
    duration: '2 days',
    location: 'Hyderabad Chemical Logistics Center',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'Rajesh Kumar', email: 'raj.kumar@translogindia.com' },
      { name: 'Srinivas Reddy', email: 's.reddy@translogindia.com' },
      { name: 'Padma Lakshmi', email: 'p.lakshmi@translogindia.com' },
      { name: 'Karthik Rao', email: 'k.rao@translogindia.com' },
      { name: 'Deepika Patel', email: 'd.patel@translogindia.com' },
    ]
  },
  {
    id: '8',
    name: 'ISO 14001 & 45001 Implementation for Logistics Operations',
    description: 'Training on implementing and maintaining environmental management and occupational health & safety management systems in logistics facilities.',
    clientCompany: 'Translog India Ltd.',
    date: '2025-06-10',
    time: '10:00 AM',
    duration: '8 hours',
    location: 'Corporate Training Center, Mumbai',
    status: 'scheduled',
    trainingType: 'offline',
    bidOpen: true,
    attendees: [
      { name: 'Ashok Sharma', email: 'a.sharma@translogindia.com' },
      { name: 'Neelam Gupta', email: 'n.gupta@translogindia.com' },
      { name: 'Vivek Khanna', email: 'v.khanna@translogindia.com' },
      { name: 'Ritu Agarwal', email: 'r.agarwal@translogindia.com' },
      { name: 'Manoj Verma', email: 'm.verma@translogindia.com' },
    ]
  }
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

export const approveTraining = async (trainingId: string, approvedBy: string): Promise<EHSTraining | undefined> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const training = ehsTrainings.find(t => t.id === trainingId);
  if (training) {
    training.status = 'scheduled';
    training.approvalStatus = 'approved';
    training.approvedBy = approvedBy;
    training.approvedDate = new Date().toISOString().split('T')[0];
  }
  return training;
};

export const rejectTraining = async (trainingId: string, rejectionReason: string): Promise<EHSTraining | undefined> => {
  // Simulating API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const training = ehsTrainings.find(t => t.id === trainingId);
  if (training) {
    training.status = 'rejected';
    training.approvalStatus = 'rejected';
    training.rejectionReason = rejectionReason;
  }
  return training;
};
