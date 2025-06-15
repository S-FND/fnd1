
// Mock data for selected metrics (in real app, this would come from the metrics manager)
export const mockSelectedMetrics = [
  {
    id: 'giin_ghg',
    name: 'Greenhouse Gas Emissions',
    unit: 'Metric tons of CO2 equivalent',
    category: 'Environmental',
    topicId: 'climate',
    assignedTo: null,
    assignmentLevel: null,
  },
  {
    id: 'giin_water',
    name: 'Water Consumption',
    unit: 'Cubic meters',
    category: 'Environmental',
    topicId: 'water',
    assignedTo: 'John Smith',
    assignmentLevel: 'Organization',
  },
  {
    id: 'giin_diversity',
    name: 'Gender Diversity',
    unit: 'Percentage',
    category: 'Social',
    topicId: 'diversity',
    assignedTo: 'HR Team',
    assignmentLevel: 'Department',
  },
];

// Mock team members and units
export const mockTeamMembers = [
  { id: '1', name: 'John Smith', role: 'ESG Manager', department: 'Sustainability' },
  { id: '2', name: 'Sarah Johnson', role: 'Data Analyst', department: 'Operations' },
  { id: '3', name: 'Mike Chen', role: 'Environmental Specialist', department: 'EHS' },
  { id: '4', name: 'Lisa Davis', role: 'HR Manager', department: 'Human Resources' },
];

export const mockUnits = [
  { id: '1', name: 'Mumbai Office', location: 'Mumbai, Maharashtra' },
  { id: '2', name: 'Delhi Office', location: 'Delhi, India' },
  { id: '3', name: 'Bangalore Office', location: 'Bangalore, Karnataka' },
  { id: '4', name: 'Manufacturing Unit 1', location: 'Pune, Maharashtra' },
];
