
// Re-export all data modules
export * from './sdg/goals';
export * from './compliance/items';
export * from './emissions/data';
export * from './analytics/cards';
export * from './navigation/items';

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

// Export EHS training types and functions
export type { EHSTraining, Attendee, Vendor, TrainingBid } from './ehs/trainings';
export { fetchEHSTrainings, fetchEHSTrainingById, fetchVendorProfile, fetchTrainingBids, fetchVendorTrainings, approveTraining, rejectTraining } from './ehs/trainings';
