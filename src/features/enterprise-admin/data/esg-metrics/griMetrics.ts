
import { ESGMetric } from './types';

// GRI Metrics data
export const griMetrics: ESGMetric[] = [
  {
    id: 'gri_305',
    name: 'GRI 305: GHG Emissions',
    description: 'Direct (Scope 1) GHG emissions',
    unit: 'Metric tons of CO2 equivalent',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'climate',
    category: 'Environmental',
    dataType: 'Numeric'
  },
  {
    id: 'gri_302',
    name: 'GRI 302: Energy Consumption',
    description: 'Energy consumption within the organization',
    unit: 'Joules or multiples',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'energy',
    category: 'Environmental',
    dataType: 'Numeric'
  },
  {
    id: 'gri_303',
    name: 'GRI 303: Water and Effluents',
    description: 'Water withdrawal by source',
    unit: 'Megaliters',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'water',
    category: 'Environmental',
    dataType: 'Numeric'
  },
  {
    id: 'gri_306',
    name: 'GRI 306: Waste',
    description: 'Waste by type and disposal method',
    unit: 'Metric tons',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'waste',
    category: 'Environmental',
    dataType: 'Numeric'
  },
  {
    id: 'gri_401',
    name: 'GRI 401: Employment',
    description: 'New employee hires and employee turnover',
    unit: 'Number and rate',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'employeeWellbeing',
    category: 'Social',
    dataType: 'Numeric'
  },
  {
    id: 'gri_403',
    name: 'GRI 403: Occupational Health and Safety',
    description: 'Work-related injuries',
    unit: 'Number and rate',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'employeeWellbeing',
    category: 'Social',
    dataType: 'Numeric'
  },
  {
    id: 'gri_404',
    name: 'GRI 404: Training and Education',
    description: 'Average hours of training per year per employee',
    unit: 'Hours',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'employeeWellbeing',
    category: 'Social',
    dataType: 'Numeric'
  },
  {
    id: 'gri_405',
    name: 'GRI 405: Diversity and Equal Opportunity',
    description: 'Diversity of governance bodies and employees',
    unit: 'Percentage',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'diversity',
    category: 'Social',
    dataType: 'Percentage'
  },
  {
    id: 'gri_413',
    name: 'GRI 413: Local Communities',
    description: 'Operations with local community engagement, impact assessments, and development programs',
    unit: 'Percentage',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'communityEngagement',
    category: 'Social',
    dataType: 'Percentage'
  },
  {
    id: 'gri_205',
    name: 'GRI 205: Anti-corruption',
    description: 'Confirmed incidents of corruption and actions taken',
    unit: 'Number',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'ethics',
    category: 'Governance',
    dataType: 'Numeric'
  },
  {
    id: 'gri_206',
    name: 'GRI 206: Anti-competitive Behavior',
    description: 'Legal actions for anti-competitive behavior, anti-trust, and monopoly practices',
    unit: 'Number',
    source: 'GRI',
    framework: 'GRI Standards',
    relatedTopic: 'ethics',
    category: 'Governance',
    dataType: 'Numeric'
  }
];
