// Comprehensive Emission Factor Database
// Sources: IPCC 2006, DEFRA 2024, EPA, CEA India, ICAO, India GHG Platform

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  factor: number;
  unit: string;
  source: string;
  year: string;
  region?: string;
  description?: string;
  gases: string;
}

// SCOPE 1 EMISSION FACTORS
export const scope1EmissionFactors: EmissionFactor[] = [
  // Stationary Combustion - Fuels
  { id: 'ef-s1-diesel', name: 'Diesel', category: 'Stationary', factor: 2.68, unit: 'kg CO₂e/litre', source: 'IPCC 2006', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Diesel fuel combustion' },
  { id: 'ef-s1-petrol', name: 'Petrol/Gasoline', category: 'Stationary', factor: 2.31, unit: 'kg CO₂e/litre', source: 'IPCC 2006', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Petrol/Gasoline combustion' },
  { id: 'ef-s1-natural-gas', name: 'Natural Gas', category: 'Stationary', factor: 1.93, unit: 'kg CO₂e/m³', source: 'IPCC 2006', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Natural gas combustion' },
  { id: 'ef-s1-lpg', name: 'LPG', category: 'Stationary', factor: 1.51, unit: 'kg CO₂e/litre', source: 'IPCC 2006', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Liquified petroleum gas' },
  { id: 'ef-s1-coal', name: 'Coal', category: 'Stationary', factor: 2.42, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Coal combustion' },
  { id: 'ef-s1-fuel-oil', name: 'Fuel Oil', category: 'Stationary', factor: 3.19, unit: 'kg CO₂e/litre', source: 'DEFRA 2024', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Heavy fuel oil' },
  { id: 'ef-s1-biomass', name: 'Biomass', category: 'Stationary', factor: 0.39, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'CH₄, N₂O', description: 'Biomass combustion (biogenic CO₂ excluded)' },

  // Mobile Combustion
  { id: 'ef-s1-mobile-diesel', name: 'Diesel (Mobile)', category: 'Mobile', factor: 2.68, unit: 'kg CO₂e/litre', source: 'DEFRA 2024', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Diesel for vehicles' },
  { id: 'ef-s1-mobile-petrol', name: 'Petrol (Mobile)', category: 'Mobile', factor: 2.31, unit: 'kg CO₂e/litre', source: 'DEFRA 2024', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Petrol for vehicles' },
  { id: 'ef-s1-cng', name: 'CNG', category: 'Mobile', factor: 2.02, unit: 'kg CO₂e/kg', source: 'DEFRA 2024', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Compressed natural gas' },
  { id: 'ef-s1-ev', name: 'Electricity (EV)', category: 'Mobile', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India 2023', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electric vehicle charging (India grid)' },

  // Fugitive Emissions - Refrigerants
  { id: 'ef-s1-r410a', name: 'R-410A', category: 'Fugitive', factor: 2088, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'HFCs', description: 'R-410A refrigerant leakage (GWP)' },
  { id: 'ef-s1-r404a', name: 'R-404A', category: 'Fugitive', factor: 3922, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'HFCs', description: 'R-404A refrigerant leakage (GWP)' },
  { id: 'ef-s1-r134a', name: 'R-134a', category: 'Fugitive', factor: 1430, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'HFCs', description: 'R-134a refrigerant leakage (GWP)' },
  { id: 'ef-s1-hfc134a', name: 'HFC-134a', category: 'Fugitive', factor: 1430, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'HFCs', description: 'HFC-134a leakage (GWP)' },
  { id: 'ef-s1-r22', name: 'R-22', category: 'Fugitive', factor: 1810, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'HCFCs', description: 'R-22 refrigerant leakage (GWP)' },
  { id: 'ef-s1-sf6', name: 'SF6', category: 'Fugitive', factor: 22800, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'SF6', description: 'Sulfur hexafluoride leakage (GWP)' },
  { id: 'ef-s1-co2-gas', name: 'CO₂ (Gas)', category: 'Fugitive', factor: 1, unit: 'kg CO₂e/kg', source: 'IPCC 2006', year: '2006', gases: 'CO₂', description: 'Carbon dioxide gas leakage' },
];

// SCOPE 2 EMISSION FACTORS
export const scope2EmissionFactors: EmissionFactor[] = [
  // Grid Electricity by Region
  { id: 'ef-s2-grid-india', name: 'Grid Electricity (India)', category: 'Purchased Electricity', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India Baseline', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Indian grid average' },
  { id: 'ef-s2-grid-us', name: 'Grid Electricity (US)', category: 'Purchased Electricity', factor: 0.42, unit: 'kg CO₂e/kWh', source: 'EPA eGRID', year: '2021', region: 'USA', gases: 'CO₂, CH₄, N₂O', description: 'US grid average' },
  { id: 'ef-s2-grid-eu', name: 'Grid Electricity (EU)', category: 'Purchased Electricity', factor: 0.25, unit: 'kg CO₂e/kWh', source: 'EEA', year: '2021', region: 'EU', gases: 'CO₂, CH₄, N₂O', description: 'EU grid average' },
  { id: 'ef-s2-grid-uk', name: 'Grid Electricity (UK)', category: 'Purchased Electricity', factor: 0.21, unit: 'kg CO₂e/kWh', source: 'DEFRA', year: '2024', region: 'UK', gases: 'CO₂, CH₄, N₂O', description: 'UK grid average' },
  { id: 'ef-s2-grid-china', name: 'Grid Electricity (China)', category: 'Purchased Electricity', factor: 0.58, unit: 'kg CO₂e/kWh', source: 'IEA', year: '2022', region: 'China', gases: 'CO₂, CH₄, N₂O', description: 'China grid average' },
  
  // Renewable Energy
  { id: 'ef-s2-solar-ppa', name: 'Solar PPA', category: 'Purchased Electricity', factor: 0.05, unit: 'kg CO₂e/kWh', source: 'Supplier-provided EF', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Solar power purchase agreement' },
  { id: 'ef-s2-wind-ppa', name: 'Wind PPA', category: 'Purchased Electricity', factor: 0.02, unit: 'kg CO₂e/kWh', source: 'Supplier-provided EF', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Wind power purchase agreement' },
  { id: 'ef-s2-hydro-ppa', name: 'Hydro PPA', category: 'Purchased Electricity', factor: 0.03, unit: 'kg CO₂e/kWh', source: 'Supplier-provided EF', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Hydropower purchase agreement' },

  // Steam, Heat, Cooling
  { id: 'ef-s2-steam', name: 'Steam', category: 'Purchased Steam', factor: 0.25, unit: 'kg CO₂e/kWh equivalent', source: 'Supplier Data', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Imported steam' },
  { id: 'ef-s2-district-heat', name: 'District Heat', category: 'Purchased Heat', factor: 0.15, unit: 'kg CO₂e/kWh', source: 'District Heating Provider', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'District heating systems' },
  { id: 'ef-s2-district-cooling', name: 'District Cooling', category: 'Purchased Cooling', factor: 0.10, unit: 'kg CO₂e/kWh', source: 'District Cooling Provider', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'District cooling systems' },
];

// SCOPE 3 EMISSION FACTORS
export const scope3EmissionFactors: EmissionFactor[] = [
  // Category 1: Purchased Goods and Services
  { id: 'ef-s3-cat1-steel', name: 'Steel', category: 'Category 1', factor: 2.1, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Steel production' },
  { id: 'ef-s3-cat1-aluminum', name: 'Aluminum', category: 'Category 1', factor: 8.24, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Aluminum production' },
  { id: 'ef-s3-cat1-plastic', name: 'Plastic', category: 'Category 1', factor: 3.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Plastic materials' },
  { id: 'ef-s3-cat1-paper', name: 'Paper', category: 'Category 1', factor: 0.91, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Paper products' },
  { id: 'ef-s3-cat1-cement', name: 'Cement', category: 'Category 1', factor: 0.82, unit: 'kg CO₂e/kg', source: 'IPCC', year: '2006', gases: 'CO₂', description: 'Cement production' },

  // Category 2: Capital Goods
  { id: 'ef-s3-cat2-machinery', name: 'Machinery', category: 'Category 2', factor: 10.5, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Industrial machinery' },
  { id: 'ef-s3-cat2-vehicles', name: 'Vehicles', category: 'Category 2', factor: 7.2, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Vehicle manufacturing' },
  { id: 'ef-s3-cat2-buildings', name: 'Building Construction', category: 'Category 2', factor: 0.45, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Construction spend-based' },

  // Category 3: Fuel and Energy Related Activities
  { id: 'ef-s3-cat3-electricity-td', name: 'Electricity T&D Losses', category: 'Category 3', factor: 0.089, unit: 'kg CO₂e/kWh', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Transmission and distribution losses' },
  { id: 'ef-s3-cat3-fuel-extraction', name: 'Fuel Extraction & Processing', category: 'Category 3', factor: 0.25, unit: 'kg CO₂e/kWh', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Upstream fuel emissions' },

  // Category 4: Upstream Transportation
  { id: 'ef-s3-cat4-road-freight', name: 'Road Freight', category: 'Category 4', factor: 0.105, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Road transportation' },
  { id: 'ef-s3-cat4-rail-freight', name: 'Rail Freight', category: 'Category 4', factor: 0.03, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Rail transportation' },
  { id: 'ef-s3-cat4-sea-freight', name: 'Sea Freight', category: 'Category 4', factor: 0.015, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Sea transportation' },
  { id: 'ef-s3-cat4-air-freight', name: 'Air Freight', category: 'Category 4', factor: 1.53, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Air cargo' },

  // Category 5: Waste
  { id: 'ef-s3-cat5-landfill', name: 'Waste to Landfill', category: 'Category 5', factor: 458, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Landfill disposal' },
  { id: 'ef-s3-cat5-incineration', name: 'Waste Incineration', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, N₂O', description: 'Waste incineration' },
  { id: 'ef-s3-cat5-recycling', name: 'Waste Recycling', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Recycling process' },

  // Category 6: Business Travel
  { id: 'ef-s3-cat6-air-domestic', name: 'Air Travel (Domestic)', category: 'Category 6', factor: 0.15, unit: 'kg CO₂e/passenger-km', source: 'ICAO', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Domestic flights' },
  { id: 'ef-s3-cat6-air-short', name: 'Air Travel (Short-haul)', category: 'Category 6', factor: 0.16, unit: 'kg CO₂e/passenger-km', source: 'ICAO', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Short-haul international' },
  { id: 'ef-s3-cat6-air-long', name: 'Air Travel (Long-haul)', category: 'Category 6', factor: 0.12, unit: 'kg CO₂e/passenger-km', source: 'ICAO', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Long-haul international' },
  { id: 'ef-s3-cat6-car-petrol', name: 'Car Travel (Petrol)', category: 'Category 6', factor: 0.17, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Petrol car business travel' },
  { id: 'ef-s3-cat6-car-diesel', name: 'Car Travel (Diesel)', category: 'Category 6', factor: 0.18, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Diesel car business travel' },
  { id: 'ef-s3-cat6-rail', name: 'Rail Travel', category: 'Category 6', factor: 0.04, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Train travel' },
  { id: 'ef-s3-cat6-hotel', name: 'Hotel Stay', category: 'Category 6', factor: 25.5, unit: 'kg CO₂e/night', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Hotel accommodation' },

  // Category 7: Employee Commuting
  { id: 'ef-s3-cat7-public-transport', name: 'Public Transport', category: 'Category 7', factor: 0.05, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Bus/metro commute' },
  { id: 'ef-s3-cat7-car-commute', name: 'Car Commute', category: 'Category 7', factor: 0.17, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Personal car commute' },
  { id: 'ef-s3-cat7-bike', name: 'Motorbike', category: 'Category 7', factor: 0.09, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Motorbike commute' },
  { id: 'ef-s3-cat7-wfh', name: 'Work From Home', category: 'Category 7', factor: 0.52, unit: 'kg CO₂e/day', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Home energy use for remote work' },

  // Category 8: Upstream Leased Assets
  { id: 'ef-s3-cat8-leased-facility', name: 'Leased Facility Electricity', category: 'Category 8', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity in leased buildings' },

  // Category 9: Downstream Transportation
  { id: 'ef-s3-cat9-road-freight', name: 'Road Freight (Downstream)', category: 'Category 9', factor: 0.105, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product distribution by road' },
  { id: 'ef-s3-cat9-courier', name: 'Courier Services', category: 'Category 9', factor: 0.52, unit: 'kg CO₂e/package', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Small parcel delivery' },

  // Category 10: Processing of Sold Products
  { id: 'ef-s3-cat10-food-processing', name: 'Food Processing', category: 'Category 10', factor: 5.5, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Food product processing' },

  // Category 11: Use of Sold Products
  { id: 'ef-s3-cat11-product-electricity', name: 'Product Electricity Use', category: 'Category 11', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity consumed by products' },
  { id: 'ef-s3-cat11-product-fuel', name: 'Product Fuel Use', category: 'Category 11', factor: 2.31, unit: 'kg CO₂e/litre', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Fuel consumed by products' },

  // Category 12: End-of-Life Treatment
  { id: 'ef-s3-cat12-product-disposal', name: 'Product Disposal', category: 'Category 12', factor: 1.2, unit: 'kg CO₂e/kg', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Product end-of-life disposal' },

  // Category 13: Downstream Leased Assets
  { id: 'ef-s3-cat13-leased-electricity', name: 'Downstream Leased Electricity', category: 'Category 13', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity in downstream leases' },

  // Category 14: Franchises
  { id: 'ef-s3-cat14-franchise-ops', name: 'Franchise Operations', category: 'Category 14', factor: 0.5, unit: 'kg CO₂e/unit', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Franchise operational emissions' },

  // Category 15: Investments
  { id: 'ef-s3-cat15-equity', name: 'Equity Investments', category: 'Category 15', factor: 0.4, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Investment emissions (spend-based)' },
];

// SCOPE 4 EMISSION FACTORS (Avoided Emissions)
export const scope4EmissionFactors: EmissionFactor[] = [
  { id: 'ef-s4-renewable-energy', name: 'Renewable Energy vs Grid', category: 'Renewable Energy', factor: 0.77, unit: 'kg CO₂e/kWh avoided', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Grid displacement by renewable energy' },
  { id: 'ef-s4-efficient-product', name: 'Energy-efficient Product', category: 'Product Use', factor: 100, unit: 'kg CO₂e/unit avoided', source: 'LCA Report', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Energy savings over product lifetime' },
  { id: 'ef-s4-circular-economy', name: 'Circular Economy', category: 'Waste Reduction', factor: 2.5, unit: 'kg CO₂e/kg avoided', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Avoided virgin material production' },
  { id: 'ef-s4-carbon-capture', name: 'Carbon Capture & Storage', category: 'Carbon Removal', factor: 1, unit: 'kg CO₂e/kg', source: 'IPCC', year: '2006', gases: 'CO₂', description: 'Direct CO₂ capture and storage' },
];

// Helper functions to search and filter emission factors
export const getEmissionFactorsByScope = (scope: 1 | 2 | 3 | 4): EmissionFactor[] => {
  switch (scope) {
    case 1: return scope1EmissionFactors;
    case 2: return scope2EmissionFactors;
    case 3: return scope3EmissionFactors;
    case 4: return scope4EmissionFactors;
    default: return [];
  }
};

export const getEmissionFactorsByCategory = (scope: 1 | 2 | 3 | 4, category: string): EmissionFactor[] => {
  const factors = getEmissionFactorsByScope(scope);
  return factors.filter(ef => ef.category === category);
};

export const searchEmissionFactors = (scope: 1 | 2 | 3 | 4, searchTerm: string): EmissionFactor[] => {
  const factors = getEmissionFactorsByScope(scope);
  const term = searchTerm.toLowerCase();
  return factors.filter(ef => 
    ef.name.toLowerCase().includes(term) || 
    ef.description?.toLowerCase().includes(term) ||
    ef.category.toLowerCase().includes(term)
  );
};

export const getEmissionFactorById = (id: string): EmissionFactor | undefined => {
  const allFactors = [
    ...scope1EmissionFactors,
    ...scope2EmissionFactors,
    ...scope3EmissionFactors,
    ...scope4EmissionFactors,
  ];
  return allFactors.find(ef => ef.id === id);
};
