
import { CarbonGoal } from '../carbon-goals/types';

export const sampleGoals: CarbonGoal[] = [
  {
    id: '1',
    name: 'Reduce Overall Emissions',
    description: 'Cut my overall carbon footprint',
    targetReduction: 15,
    deadline: '2025-12-31',
    currentProgress: 5,
    category: 'overall',
    emissionScope: 'scope1'
  },
  {
    id: '2',
    name: 'Cut Transportation Impact',
    description: 'Commute by bicycle twice a week',
    targetReduction: 20,
    deadline: '2025-06-30',
    currentProgress: 10,
    category: 'transport',
    emissionScope: 'scope2'
  },
  {
    id: '3',
    name: 'Reduce Food Emissions',
    description: 'Adopt one meat-free day per week',
    targetReduction: 10,
    deadline: '2025-09-30',
    currentProgress: 8,
    category: 'food',
    emissionScope: 'scope3'
  },
  {
    id: '4',
    name: 'Renewable Energy Initiative',
    description: 'Partner with renewable energy providers',
    targetReduction: 25,
    deadline: '2026-03-31',
    currentProgress: 5,
    category: 'home',
    emissionScope: 'scope2'
  },
  {
    id: '5',
    name: 'Supply Chain Emissions',
    description: 'Optimize logistics for lower emissions',
    targetReduction: 15,
    deadline: '2025-12-31',
    currentProgress: 3,
    category: 'overall',
    emissionScope: 'scope3'
  },
  {
    id: '6',
    name: 'Carbon Offset Investments',
    description: 'Invest in verified carbon offset projects',
    targetReduction: 30,
    deadline: '2025-10-31',
    currentProgress: 12,
    category: 'overall',
    emissionScope: 'scope4'
  }
];
