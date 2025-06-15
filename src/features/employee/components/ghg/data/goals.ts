
import { CarbonGoal } from '../carbon-goals/types';

export const sampleGoals: CarbonGoal[] = [
  {
    id: '1',
    name: 'Reduce Direct Emissions',
    description: 'Cut emissions from company vehicles and facilities',
    targetReduction: 20,
    deadline: '2025-12-31',
    currentProgress: 8,
    category: 'overall',
    emissionScope: 'scope1'
  },
  {
    id: '2',
    name: 'Vehicle Fleet Electrification',
    description: 'Convert 30% of company vehicles to electric',
    targetReduction: 25,
    deadline: '2026-06-30',
    currentProgress: 10,
    category: 'transport',
    emissionScope: 'scope1'
  },
  {
    id: '3',
    name: 'Renewable Energy Transition',
    description: 'Switch to 100% renewable energy sources',
    targetReduction: 40,
    deadline: '2025-09-30',
    currentProgress: 15,
    category: 'home',
    emissionScope: 'scope2'
  },
  {
    id: '4',
    name: 'Energy Efficiency Improvements',
    description: 'Upgrade lighting and HVAC systems',
    targetReduction: 15,
    deadline: '2025-03-31',
    currentProgress: 5,
    category: 'home',
    emissionScope: 'scope2'
  },
  {
    id: '5',
    name: 'Supply Chain Optimization',
    description: 'Engage suppliers to reduce their emissions',
    targetReduction: 18,
    deadline: '2026-12-31',
    currentProgress: 4,
    category: 'overall',
    emissionScope: 'scope3'
  },
  {
    id: '6',
    name: 'Business Travel Reduction',
    description: 'Implement virtual meetings where possible',
    targetReduction: 30,
    deadline: '2025-10-31',
    currentProgress: 20,
    category: 'transport',
    emissionScope: 'scope3'
  },
  {
    id: '7',
    name: 'Product Carbon Footprint',
    description: 'Redesign products to reduce customer emissions',
    targetReduction: 25,
    deadline: '2026-06-30',
    currentProgress: 10,
    category: 'shopping',
    emissionScope: 'scope3'
  },
  {
    id: '8',
    name: 'Carbon Offset Program',
    description: 'Invest in verified carbon sequestration projects',
    targetReduction: 35,
    deadline: '2025-12-31',
    currentProgress: 15,
    category: 'overall',
    emissionScope: 'scope4'
  },
  {
    id: '9',
    name: 'Customer Emissions Avoidance',
    description: 'Help customers avoid emissions through green products',
    targetReduction: 30,
    deadline: '2026-03-31',
    currentProgress: 12,
    category: 'overall',
    emissionScope: 'scope4'
  }
];
