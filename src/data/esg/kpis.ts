
export interface ESGKPI {
  id: string;
  name: string;
  category: string;
  current: number;
  baseline: number;
  target: number;
  unit: string;
  progress: number;
  trend: 'up' | 'down' | 'neutral';
}

export const esgKPIs: ESGKPI[] = [
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    category: 'Environment',
    current: 42,
    baseline: 25,
    target: 75,
    unit: '%',
    progress: 56,
    trend: 'up' as const
  },
  {
    id: 'water-consumption',
    name: 'Water Consumption',
    category: 'Environment',
    current: 3.2,
    baseline: 4.5,
    target: 2.5,
    unit: 'million liters',
    progress: 65,
    trend: 'up' as const
  },
  {
    id: 'carbon-emissions',
    name: 'Carbon Emissions',
    category: 'Environment',
    current: 12500,
    baseline: 18000,
    target: 9000,
    unit: 'tons CO₂e',
    progress: 61,
    trend: 'up' as const
  },
  {
    id: 'waste-diverted',
    name: 'Waste Diversion Rate',
    category: 'Environment',
    current: 68,
    baseline: 50,
    target: 90,
    unit: '%',
    progress: 45,
    trend: 'up' as const
  },
  {
    id: 'diversity-score',
    name: 'Workforce Diversity',
    category: 'Social',
    current: 38,
    baseline: 30,
    target: 50,
    unit: '%',
    progress: 40,
    trend: 'up' as const
  },
  {
    id: 'training-hours',
    name: 'Employee Training',
    category: 'Social',
    current: 15,
    baseline: 8,
    target: 24,
    unit: 'hours/employee',
    progress: 44,
    trend: 'up' as const
  },
  {
    id: 'board-diversity',
    name: 'Board Diversity',
    category: 'Governance',
    current: 30,
    baseline: 20,
    target: 45,
    unit: '%',
    progress: 40,
    trend: 'up' as const
  },
  {
    id: 'ethics-policies',
    name: 'Ethics Policies',
    category: 'Governance',
    current: 85,
    baseline: 70,
    target: 100,
    unit: '%',
    progress: 50,
    trend: 'up' as const
  }
];
