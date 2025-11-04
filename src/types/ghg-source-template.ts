// GHG Source Template - Defines emission sources before data collection
// This separates source definition (Step 1) from data collection (Step 2)

import { MeasurementFrequency, DataQuality } from './scope1-ghg';

export interface GHGSourceTemplate {
  id: string;
  scope: 1 | 2 | 3 | 4;
  templateName: string;
  facilityName: string;
  businessUnit: string;
  sourceCategory: string;
  sourceDescription: string;
  emissionFactorId: string; // References emission factor database
  emissionFactor: number;
  emissionFactorUnit: string;
  emissionFactorSource: string;
  activityDataUnit: string;
  measurementFrequency: MeasurementFrequency;
  assignedDataCollectors: string[]; // User IDs who collect data
  assignedVerifiers: string[]; // User IDs who verify data
  ghgIncluded: string;
  calculationMethodology: string;
  dataSource: string;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
  notes: string;
  
  // Scope-specific fields
  sourceType?: string; // For Scope 1, 2, 3, 4
  fuelSubstanceType?: string; // Scope 1
  utilityProviderName?: string; // Scope 2
  countryRegion?: string; // Scope 2, 3
  gridEmissionFactorSource?: string; // Scope 2
  scope2Category?: 'Location-Based' | 'Market-Based'; // Scope 2
  scope3Category?: string; // Scope 3
  supplierName?: string; // Scope 3
  avoidedEmissionType?: string; // Scope 4
  baselineScenario?: string; // Scope 4
}

export interface GHGDataCollection {
  id: string;
  sourceTemplateId: string; // Links to GHGSourceTemplate
  reportingPeriod: string; // e.g., "FY 2024-25", "Q1 2025", "Jan 2025"
  reportingMonth?: string;
  reportingYear?: number;
  activityDataValue: number;
  emissionCO2: number;
  emissionCH4: number;
  emissionN2O: number;
  totalEmission: number;
  dataQuality: DataQuality;
  collectedDate: string;
  collectedBy: string;
  verifiedBy: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  notes: string;
}

// Helper type for frequency-based data collection
export interface DataCollectionSchedule {
  sourceTemplateId: string;
  frequency: MeasurementFrequency;
  startDate: string;
  expectedCollections: number; // How many data points expected based on frequency
  completedCollections: number; // How many data points actually collected
  nextCollectionDue: string;
}

// Calculate expected number of collections based on frequency and time period
export const calculateExpectedCollections = (
  frequency: MeasurementFrequency,
  startDate: Date,
  endDate: Date
): number => {
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (frequency) {
    case 'Daily':
      return daysDiff;
    case 'Weekly':
      return Math.ceil(daysDiff / 7);
    case 'Monthly':
      return Math.ceil(daysDiff / 30);
    case 'Quarterly':
      return Math.ceil(daysDiff / 90);
    case 'Annually':
      return Math.ceil(daysDiff / 365);
    default:
      return 0;
  }
};

// Get collections needed for a specific month based on frequency
export const getCollectionsForMonth = (frequency: MeasurementFrequency): number => {
  switch (frequency) {
    case 'Daily':
      return 30; // Approximate
    case 'Weekly':
      return 4;
    case 'Monthly':
      return 1;
    case 'Quarterly':
      return 0; // Only collect in specific months
    case 'Annually':
      return 0; // Only collect once per year
    default:
      return 1;
  }
};

// Check if collection is due for given month and frequency
export const isCollectionDueForMonth = (
  frequency: MeasurementFrequency,
  month: string,
  year: number
): boolean => {
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  
  switch (frequency) {
    case 'Daily':
    case 'Weekly':
    case 'Monthly':
      return true; // Always collect
    case 'Quarterly':
      return monthIndex % 3 === 2; // March, June, September, December
    case 'Annually':
      return monthIndex === 2; // March (end of FY)
    default:
      return false;
  }
};
