
// Re-export all data modules
export * from './sdg/goals';
export * from './compliance/items';
export * from './emissions/data';
export * from './analytics/cards';
export * from './navigation/items';

// Create mock functions to match the original mockData exports
export const fetchEHSTrainings = () => {
  return [
    { 
      id: '1', 
      name: 'Safety Procedures Training', 
      date: '2024-05-15', 
      time: '10:00 AM',
      duration: '2 hours',
      status: 'scheduled',
      clientCompany: 'ABC Corp',
      location: 'Mumbai Office',
      trainingType: 'offline',
      attendees: [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Smith' }]
    },
    { 
      id: '2', 
      name: 'Hazardous Materials Handling', 
      date: '2024-05-20', 
      startDate: '2024-05-20',
      endDate: '2024-05-21',
      time: '2:00 PM',
      status: 'in-progress',
      clientCompany: 'XYZ Industries',
      location: 'Delhi Branch',
      trainingType: 'offline',
      attendees: [{ id: '3', name: 'Mike Johnson' }, { id: '4', name: 'Sarah Williams' }]
    },
    { 
      id: '3', 
      name: 'Fire Safety', 
      date: '2024-06-10',
      time: '9:00 AM',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      status: 'completed',
      clientCompany: 'LMN Solutions',
      trainingType: 'online',
      attendees: [{ id: '5', name: 'David Brown' }, { id: '6', name: 'Emily Davis' }]
    }
  ];
};

export const fetchEHSTrainingById = (id: string) => {
  const trainings = fetchEHSTrainings();
  return trainings.find(training => training.id === id);
};

export const fetchTrainingBids = (trainingId?: string, vendorId?: string) => {
  const bids = [
    { 
      id: '1', 
      trainingId: '1', 
      vendorId: 'v1', 
      totalFee: 5000, 
      submittedDate: '2024-04-10', 
      status: 'pending' 
    },
    { 
      id: '2', 
      trainingId: '2', 
      vendorId: 'v1', 
      totalFee: 7500, 
      submittedDate: '2024-04-12', 
      status: 'accepted' 
    },
    { 
      id: '3', 
      trainingId: '3', 
      vendorId: 'v2', 
      totalFee: 6200, 
      submittedDate: '2024-04-15', 
      status: 'rejected' 
    }
  ];

  if (trainingId && vendorId) {
    return bids.filter(bid => bid.trainingId === trainingId && bid.vendorId === vendorId);
  } else if (trainingId) {
    return bids.filter(bid => bid.trainingId === trainingId);
  } else if (vendorId) {
    return bids.filter(bid => bid.vendorId === vendorId);
  } else {
    return bids;
  }
};

export const fetchVendorTrainings = (vendorId?: string) => {
  const trainings = [
    {
      id: '1',
      name: 'Safety Procedures Training',
      description: 'Basic safety protocols for industrial settings',
      date: '2024-05-15',
      time: '10:00 AM',
      duration: '2 hours',
      location: 'Mumbai Office',
      bidOpen: true,
      assignedVendorId: null,
      attendees: [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Smith' }]
    },
    {
      id: '2',
      name: 'Hazardous Materials Handling',
      description: 'Advanced training for chemical safety',
      date: '2024-05-20',
      time: '2:00 PM',
      duration: '4 hours',
      location: 'Delhi Branch',
      bidOpen: false,
      assignedVendorId: 'v1',
      attendees: [{ id: '3', name: 'Mike Johnson' }, { id: '4', name: 'Sarah Williams' }]
    },
    {
      id: '3',
      name: 'Fire Safety',
      description: 'Emergency protocols and fire prevention',
      date: '2024-06-10',
      time: '9:00 AM',
      duration: '3 hours',
      location: 'Online',
      bidOpen: false,
      assignedVendorId: 'v2',
      attendees: [{ id: '5', name: 'David Brown' }, { id: '6', name: 'Emily Davis' }]
    }
  ];

  if (vendorId) {
    return trainings.filter(training => 
      training.bidOpen || training.assignedVendorId === vendorId
    );
  } else {
    return trainings;
  }
};

export const fetchVendorProfile = (vendorId: string) => {
  return {
    id: vendorId,
    companyName: 'EcoSafe Training Solutions',
    name: 'Rajiv Kumar',
    email: 'rajiv@ecosafe.com',
    phone: '+91 98765 43210',
    address: '123 Green Tower, Andheri East, Mumbai 400069',
    verified: true,
    specialties: ['EHS Training', 'Safety Audits', 'Compliance Consulting', 'Risk Assessment']
  };
};

// esgKPIs
export const esgKPIs = [
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    category: 'Environmental',
    current: 42,
    baseline: 25,
    target: 60,
    unit: '%',
    progress: 70,
    trend: 'up' as const,
  },
  {
    id: 'water-consumption',
    name: 'Water Consumption',
    category: 'Environmental',
    current: 3.2,
    baseline: 4.5,
    target: 3.0,
    unit: 'million liters',
    progress: 87,
    trend: 'down' as const,
  },
  {
    id: 'carbon-emissions',
    name: 'Carbon Emissions',
    category: 'Environmental',
    current: 12800,
    baseline: 15600,
    target: 10000,
    unit: 'tCO2e',
    progress: 50,
    trend: 'down' as const,
  },
  {
    id: 'diversity-score',
    name: 'Diversity Score',
    category: 'Social',
    current: 72,
    baseline: 60,
    target: 80,
    unit: '%',
    progress: 60,
    trend: 'up' as const,
  },
  {
    id: 'employee-training',
    name: 'Employee Training',
    category: 'Social',
    current: 28,
    baseline: 20,
    target: 40,
    unit: 'hours/year',
    progress: 40,
    trend: 'up' as const,
  },
  {
    id: 'waste-recycling',
    name: 'Waste Recycling',
    category: 'Environmental',
    current: 68,
    baseline: 50,
    target: 80,
    unit: '%',
    progress: 60,
    trend: 'up' as const,
  },
  {
    id: 'board-independence',
    name: 'Board Independence',
    category: 'Governance',
    current: 72,
    baseline: 65,
    target: 75,
    unit: '%',
    progress: 70,
    trend: 'up' as const,
  }
];

// personalGHGParams
export const personalGHGParams = [
  {
    id: 'commute',
    label: 'Daily Commute',
    options: [
      { value: 'car', label: 'Car (Petrol/Diesel)', co2Factor: 0.12 },
      { value: 'ev', label: 'Electric Vehicle', co2Factor: 0.05 },
      { value: 'public', label: 'Public Transport', co2Factor: 0.03 },
      { value: 'bicycle', label: 'Bicycle/Walking', co2Factor: 0 },
    ],
  },
  {
    id: 'electricity',
    label: 'Monthly Electricity',
    unit: 'kWh',
  },
  {
    id: 'flights',
    label: 'Annual Flights',
    unit: 'round trips',
  },
  {
    id: 'diet',
    label: 'Diet Pattern',
    options: [
      { value: 'meat', label: 'Meat Heavy', co2Factor: 3.3 },
      { value: 'balanced', label: 'Balanced', co2Factor: 2.5 },
      { value: 'vegetarian', label: 'Vegetarian', co2Factor: 1.7 },
      { value: 'vegan', label: 'Vegan', co2Factor: 1.5 },
    ],
  }
];

// trainingModules
export const trainingModules = [
  {
    id: 1,
    title: 'ESG Fundamentals',
    category: 'ESG',
    completion: 100,
    duration: '2 hours',
  },
  {
    id: 2,
    title: 'Carbon Accounting Basics',
    category: 'GHG',
    completion: 75,
    duration: '3 hours',
  },
  {
    id: 3,
    title: 'Environmental Compliance',
    category: 'EHS',
    completion: 50,
    duration: '4 hours',
  },
  {
    id: 4,
    title: 'Sustainability Reporting',
    category: 'ESG',
    completion: 25,
    duration: '2.5 hours',
  },
  {
    id: 5,
    title: 'Scope 3 Emissions',
    category: 'GHG',
    completion: 0,
    duration: '3.5 hours',
  },
  {
    id: 6,
    title: 'Workplace Safety',
    category: 'EHS',
    completion: 100,
    duration: '1.5 hours',
  },
];
