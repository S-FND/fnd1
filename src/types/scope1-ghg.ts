export type SourceType = 'Stationary' | 'Mobile' | 'Fugitive' | 'Process';

export type MeasurementFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

export type DataQuality = 'High' | 'Medium' | 'Low';

export interface Scope1Entry {
  id: string;
  facilityName: string;
  businessUnit: string;
  reportingPeriod: string;
  sourceType: SourceType;
  emissionSourceCategory: string;
  emissionSourceDescription: string;
  fuelSubstanceType: string;
  activityDataValue: number;
  activityDataUnit: string;
  emissionFactorSource: string;
  emissionFactor: number;
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
}

export interface Scope1FormData {
  month: string;
  year: number;
  entries: Scope1Entry[];
}

// Default values for auto-populated fields
export const DEFAULT_EMISSION_FACTORS: Record<string, { source: string; factor: number; unit: string }> = {
  'Diesel': { source: 'IPCC 2006', factor: 2.68, unit: 'kg CO₂e/litre' },
  'Petrol': { source: 'IPCC 2006', factor: 2.31, unit: 'kg CO₂e/litre' },
  'Natural Gas': { source: 'IPCC 2006', factor: 1.93, unit: 'kg CO₂e/m³' },
  'LPG': { source: 'IPCC 2006', factor: 1.51, unit: 'kg CO₂e/litre' },
  'Coal': { source: 'IPCC 2006', factor: 2.42, unit: 'kg CO₂e/kg' },
  'R-410A': { source: 'IPCC 2006', factor: 2088, unit: 'kg CO₂e/kg' },
  'R-404A': { source: 'IPCC 2006', factor: 3922, unit: 'kg CO₂e/kg' },
  'R-134a': { source: 'IPCC 2006', factor: 1430, unit: 'kg CO₂e/kg' },
  'HFC-134a': { source: 'IPCC 2006', factor: 1430, unit: 'kg CO₂e/kg' },
};

export const EMISSION_SOURCE_CATEGORIES = {
  'Stationary': [
    'Stationary Combustion - Boilers',
    'Stationary Combustion - Generators',
    'Stationary Combustion - Heaters',
    'Stationary Combustion - Furnaces',
  ],
  'Mobile': [
    'Company Vehicle Fleet',
    'Delivery Trucks',
    'Forklifts',
    'Material Handling Equipment',
  ],
  'Fugitive': [
    'Refrigerant Leakage',
    'Fire Suppression Systems',
    'Industrial Gas Leakage',
  ],
  'Process': [
    'Chemical Reactions',
    'Industrial Processes',
    'Manufacturing Emissions',
  ],
};

export const FUEL_SUBSTANCE_TYPES: Record<SourceType, string[]> = {
  'Stationary': ['Diesel', 'Natural Gas', 'LPG', 'Coal', 'Fuel Oil', 'Biomass'],
  'Mobile': ['Diesel', 'Petrol', 'CNG', 'LPG', 'Electricity'],
  'Fugitive': ['R-410A', 'R-404A', 'R-134a', 'HFC-134a', 'SF6', 'CO2'],
  'Process': ['Various Process Gases', 'Chemical Feedstocks'],
};

export const ACTIVITY_UNITS: Record<SourceType, string[]> = {
  'Stationary': ['litres', 'm³', 'kg', 'tonnes', 'kWh'],
  'Mobile': ['litres', 'km', 'kWh'],
  'Fugitive': ['kg', 'tonnes'],
  'Process': ['kg', 'tonnes', 'units'],
};

// Helper function to calculate emissions
export const calculateEmissions = (
  activityData: number,
  emissionFactor: number,
  co2Percentage: number = 0.95,
  ch4Percentage: number = 0.03,
  n2oPercentage: number = 0.02
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