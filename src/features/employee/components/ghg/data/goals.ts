
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
  }
];
