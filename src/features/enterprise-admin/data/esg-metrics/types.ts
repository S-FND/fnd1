
// Define the types for ESG metrics
export interface ESGMetric {
  id: string;
  name: string;
  description: string;
  unit: string;
  source: 'GIIN' | 'GRI' | 'Custom';
  framework: string;
  relatedTopic: string;
  category: 'Environmental' | 'Social' | 'Governance';
  dataType: 'Numeric' | 'Percentage' | 'Text' | 'Boolean';
}

export interface ESGMetricWithTracking extends ESGMetric {
  baselineDate?: string;
  baselineValue?: string | number | boolean;
  targetDate?: string;
  targetValue?: string | number | boolean;
  collectionFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually' | 'Never';
  dataPoints: {
    date: string;
    value: string | number | boolean;
  }[];
  isSelected: boolean;
}
