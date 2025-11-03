export type Scope3Category = 
  | 'Category 1 – Purchased Goods and Services'
  | 'Category 2 – Capital Goods'
  | 'Category 3 – Fuel and Energy Related Activities'
  | 'Category 4 – Upstream Transportation and Distribution'
  | 'Category 5 – Waste Generated in Operations'
  | 'Category 6 – Business Travel'
  | 'Category 7 – Employee Commuting'
  | 'Category 8 – Upstream Leased Assets'
  | 'Category 9 – Downstream Transportation and Distribution'
  | 'Category 10 – Processing of Sold Products'
  | 'Category 11 – Use of Sold Products'
  | 'Category 12 – End-of-Life Treatment of Sold Products'
  | 'Category 13 – Downstream Leased Assets'
  | 'Category 14 – Franchises'
  | 'Category 15 – Investments';

export type CalculationMethodology = 'Spend-based' | 'Activity-based' | 'Hybrid';
export type MeasurementFrequency = 'Monthly' | 'Quarterly' | 'Annually';
export type DataQuality = 'High' | 'Medium' | 'Low';

export interface Scope3Entry {
  id: string;
  facilityName: string;
  businessUnit: string;
  reportingPeriod: string;
  scope3Category: Scope3Category;
  sourceType: string;
  emissionSourceDescription: string;
  supplierName: string;
  countryRegion: string;
  activityDataValue: number;
  activityDataUnit: string;
  emissionFactorSource: string;
  emissionFactor: number;
  ghgIncluded: string;
  emissionCO2: number;
  emissionCH4: number;
  emissionN2O: number;
  totalEmission: number;
  calculationMethodology: CalculationMethodology;
  dataSource: string;
  measurementFrequency: MeasurementFrequency;
  dataQuality: DataQuality;
  verifiedBy: string;
  emissionSourceId: string;
  dataEntryDate: string;
  enteredBy: string;
  notes: string;
}

export interface Scope3FormData {
  month: string;
  year: number;
  entries: Scope3Entry[];
}

// Default emission factors by category
export const DEFAULT_EMISSION_FACTORS: Record<Scope3Category, { source: string; factor: number; unit: string }> = {
  'Category 1 – Purchased Goods and Services': { source: 'India GHG Platform 2023', factor: 8.24, unit: 'kg CO₂e/kg' },
  'Category 2 – Capital Goods': { source: 'India GHG Platform 2023', factor: 10.5, unit: 'kg CO₂e/kg' },
  'Category 3 – Fuel and Energy Related Activities': { source: 'DEFRA 2024', factor: 0.25, unit: 'kg CO₂e/kWh' },
  'Category 4 – Upstream Transportation and Distribution': { source: 'DEFRA 2024', factor: 0.105, unit: 'kg CO₂e/tonne-km' },
  'Category 5 – Waste Generated in Operations': { source: 'IPCC 2006', factor: 1.2, unit: 'kg CO₂e/kg' },
  'Category 6 – Business Travel': { source: 'ICAO 2023', factor: 0.15, unit: 'kg CO₂e/passenger-km' },
  'Category 7 – Employee Commuting': { source: 'DEFRA 2024', factor: 0.12, unit: 'kg CO₂e/passenger-km' },
  'Category 8 – Upstream Leased Assets': { source: 'India GHG Platform 2023', factor: 0.82, unit: 'kg CO₂e/kWh' },
  'Category 9 – Downstream Transportation and Distribution': { source: 'DEFRA 2024', factor: 0.105, unit: 'kg CO₂e/tonne-km' },
  'Category 10 – Processing of Sold Products': { source: 'India GHG Platform 2023', factor: 5.5, unit: 'kg CO₂e/kg' },
  'Category 11 – Use of Sold Products': { source: 'IPCC 2006', factor: 0.3, unit: 'kg CO₂e/kWh' },
  'Category 12 – End-of-Life Treatment of Sold Products': { source: 'IPCC 2006', factor: 1.2, unit: 'kg CO₂e/kg' },
  'Category 13 – Downstream Leased Assets': { source: 'India GHG Platform 2023', factor: 0.82, unit: 'kg CO₂e/kWh' },
  'Category 14 – Franchises': { source: 'DEFRA 2024', factor: 0.5, unit: 'kg CO₂e/unit' },
  'Category 15 – Investments': { source: 'India GHG Platform 2023', factor: 0.4, unit: 'kg CO₂e/INR' },
};

export const calculateEmissions = (
  activityData: number,
  emissionFactor: number
): { co2: number; ch4: number; n2o: number; total: number } => {
  const totalKg = activityData * emissionFactor;
  // Approximate breakdown (CO2 ~99%, CH4 ~0.5%, N2O ~0.5%)
  const co2 = totalKg * 0.99;
  const ch4 = totalKg * 0.005;
  const n2o = totalKg * 0.005;
  const total = totalKg / 1000; // Convert to tCO₂e
  
  return { co2, ch4, n2o, total };
};

export const getCurrentFY = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Indian FY starts from April (month 3 in 0-indexed)
  if (month >= 3) {
    return `FY ${year}–${(year + 1).toString().slice(-2)}`;
  } else {
    return `FY ${year - 1}–${year.toString().slice(-2)}`;
  }
};
