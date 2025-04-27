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
