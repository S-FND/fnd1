export type Scope2SourceType = 'Purchased Electricity' | 'Purchased Steam' | 'Purchased Heat' | 'Purchased Cooling';

export type Scope2Category = 'Location-Based' | 'Market-Based';

export type MeasurementFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

export type DataQuality = 'High' | 'Medium' | 'Low';

export interface Scope2Entry {
  id: string;
  facilityName: string;
  businessUnit: string;
  reportingPeriod: string;
  sourceType: Scope2SourceType;
  emissionSourceCategory: string;
  emissionSourceDescription: string;
  utilityProviderName: string;
  countryRegion: string;
  gridEmissionFactorSource: string;
  emissionFactor: number;
  activityDataValue: number;
  activityDataUnit: string;
  scope2Category: Scope2Category;
  ghgIncluded: string;
  emissionCO2: number;
  emissionCH4: number;
  emissionN2O: number;
  totalEmission: number;
  calculationMethodology: string;
  dataSource: string;
  measurementFrequency: MeasurementFrequency;
  dataQuality: DataQuality;
  verifiedBy: string;
  emissionSourceId: string;
  dataEntryDate: string;
  enteredBy: string;
  notes: string;
  evidenceUrls?: string[];
}

export interface Scope2FormData {
  month: string;
  year: number;
  entries: Scope2Entry[];
}

// Default values for auto-populated fields
export const DEFAULT_EMISSION_FACTORS: Record<string, { source: string; factor: number; unit: string }> = {
  'Grid Electricity (India)': { source: 'CEA India Baseline 2023', factor: 0.82, unit: 'kg CO₂e/kWh' },
  'Grid Electricity (US)': { source: 'EPA eGRID 2021', factor: 0.42, unit: 'kg CO₂e/kWh' },
  'Grid Electricity (EU)': { source: 'EEA 2021', factor: 0.25, unit: 'kg CO₂e/kWh' },
  'Solar PPA': { source: 'Supplier-provided EF', factor: 0.05, unit: 'kg CO₂e/kWh' },
  'Wind PPA': { source: 'Supplier-provided EF', factor: 0.02, unit: 'kg CO₂e/kWh' },
  'Steam': { source: 'Supplier Data (Steam EF)', factor: 0.25, unit: 'kg CO₂e/kWh equivalent' },
  'District Heat': { source: 'District Heating Provider', factor: 0.15, unit: 'kg CO₂e/kWh' },
  'District Cooling': { source: 'District Cooling Provider', factor: 0.10, unit: 'kg CO₂e/kWh' },
};

export const EMISSION_SOURCE_CATEGORIES = {
  'Purchased Electricity': [
    'Grid Electricity',
    'Renewable PPA',
    'Green Tariff',
    'Mixed Supply',
  ],
  'Purchased Steam': [
    'Imported Steam',
    'District Steam',
    'Industrial Steam',
  ],
  'Purchased Heat': [
    'District Heating',
    'Industrial Heat',
  ],
  'Purchased Cooling': [
    'District Cooling',
    'Chilled Water Supply',
  ],
};

export const UTILITY_TYPES: Record<Scope2SourceType, string[]> = {
  'Purchased Electricity': ['Grid Electricity (India)', 'Grid Electricity (US)', 'Grid Electricity (EU)', 'Solar PPA', 'Wind PPA'],
  'Purchased Steam': ['Steam'],
  'Purchased Heat': ['District Heat'],
  'Purchased Cooling': ['District Cooling'],
};

export const ACTIVITY_UNITS: Record<Scope2SourceType, string[]> = {
  'Purchased Electricity': ['kWh', 'MWh', 'GWh'],
  'Purchased Steam': ['kWh equivalent', 'tonnes', 'kg'],
  'Purchased Heat': ['kWh', 'MWh', 'GJ'],
  'Purchased Cooling': ['kWh', 'MWh', 'ton-hours'],
};

// Helper function to calculate emissions
export const calculateEmissions = (
  activityData: number,
  emissionFactor: number,
  co2Percentage: number = 0.98,
  ch4Percentage: number = 0.015,
  n2oPercentage: number = 0.005
): { co2: number; ch4: number; n2o: number; total: number } => {
  const totalEmissionKg = activityData * emissionFactor;
  const co2 = totalEmissionKg * co2Percentage;
  const ch4 = totalEmissionKg * ch4Percentage;
  const n2o = totalEmissionKg * n2oPercentage;
  const total = totalEmissionKg / 1000; // Convert to tonnes

  return { co2, ch4, n2o, total };
};

// Get current financial year in format "FY YYYY-YY"
export const getCurrentFY = (): string => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  // Assuming FY starts in April (month 3)
  if (month >= 3) {
    return `FY ${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    return `FY ${year - 1}-${year.toString().slice(-2)}`;
  }
};
