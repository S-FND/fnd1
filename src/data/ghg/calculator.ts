
export interface GHGOption {
  value: string;
  label: string;
  co2Factor: number;
}

export interface GHGParameter {
  id: string;
  label: string;
  options?: GHGOption[];
  unit?: string;
}

export interface MonthlyEmissions {
  month: string;
  year: number;
  value: number;
}

export interface YearlyEmissions {
  year: number;
  value: number;
}

export const personalGHGParams: GHGParameter[] = [
  { id: "commute", label: "Daily Commute", options: [
    { value: "public", label: "Public Transport", co2Factor: 0.05 },
    { value: "car_petrol", label: "Car (Petrol)", co2Factor: 0.2 },
    { value: "car_diesel", label: "Car (Diesel)", co2Factor: 0.18 },
    { value: "two_wheeler", label: "Two Wheeler", co2Factor: 0.09 },
    { value: "walking", label: "Walking/Cycling", co2Factor: 0 },
  ]},
  { id: "electricity", label: "Monthly Electricity", unit: "kWh" },
  { id: "flights", label: "Flights per Year", unit: "trips" },
  { id: "diet", label: "Dietary Preference", options: [
    { value: "meat_daily", label: "Meat Daily", co2Factor: 3.3 },
    { value: "meat_weekly", label: "Meat Weekly", co2Factor: 2.5 },
    { value: "vegetarian", label: "Vegetarian", co2Factor: 1.7 },
    { value: "vegan", label: "Vegan", co2Factor: 1.5 },
  ]},
];

// Company GHG Calculation Factors for Logistics Operations
export const logisticsEmissionFactors = {
  // Fuel Factors (kgCO2e per unit)
  fuels: {
    diesel: 2.68,        // kgCO2e per liter
    petrol: 2.31,        // kgCO2e per liter
    cng: 2.54,           // kgCO2e per kg
    lng: 2.87,           // kgCO2e per kg
    lpg: 2.94            // kgCO2e per kg
  },
  
  // Transport Modes (kgCO2e per tonne-km)
  transport: {
    road_freight: 0.11,  // kgCO2e per tonne-km
    rail_freight: 0.03,  // kgCO2e per tonne-km
    sea_freight: 0.015,  // kgCO2e per tonne-km
    air_freight: 1.53,   // kgCO2e per tonne-km
    inland_waterways: 0.031 // kgCO2e per tonne-km
  },
  
  // Warehouse Operations (kgCO2e per unit)
  warehouse: {
    electricity: 0.82,   // kgCO2e per kWh (grid average India)
    natural_gas: 2.02,   // kgCO2e per m3
    water: 0.344,        // kgCO2e per m3
    waste_landfill: 458, // kgCO2e per tonne
    waste_recycled: 21   // kgCO2e per tonne
  },
  
  // Cold Chain (kgCO2e per unit)
  cold_chain: {
    refrigeration: 0.18, // kgCO2e per kWh
    r404a: 3922,         // kgCO2e per kg (GWP)
    r134a: 1430,         // kgCO2e per kg (GWP) 
    r410a: 2088          // kgCO2e per kg (GWP)
  },
  
  // Packaging (kgCO2e per tonne)
  packaging: {
    cardboard: 1040,     // kgCO2e per tonne
    plastic_film: 2060,  // kgCO2e per tonne
    wooden_pallets: 5.26 // kgCO2e per pallet
  }
};

export const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const yearsToShow = [2022, 2023, 2024, 2025];

// Helper functions for emissions calculations
export const calculateMonthlyTotal = (monthlyData: Record<string, Record<string, number>>, month: string): number => {
  let total = 0;
  
  if (!monthlyData[month]) return 0;
  
  Object.values(monthlyData[month]).forEach(value => {
    if (typeof value === 'number' && !isNaN(value)) {
      total += value;
    }
  });
  
  return total;
};

export const calculateYearlyTotal = (monthlyData: Record<string, Record<string, number>>): number => {
  let total = 0;
  
  months.forEach(month => {
    total += calculateMonthlyTotal(monthlyData, month);
  });
  
  return total;
};
