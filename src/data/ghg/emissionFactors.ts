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
  // ========== Category 1: Purchased Goods and Services ==========
  // Metals
  { id: 'ef-s3-cat1-steel', name: 'Steel', category: 'Category 1', factor: 2.1, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Steel production' },
  { id: 'ef-s3-cat1-stainless-steel', name: 'Stainless Steel', category: 'Category 1', factor: 6.15, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Stainless steel production' },
  { id: 'ef-s3-cat1-aluminum', name: 'Aluminum', category: 'Category 1', factor: 8.24, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Primary aluminum production' },
  { id: 'ef-s3-cat1-aluminum-recycled', name: 'Recycled Aluminum', category: 'Category 1', factor: 0.52, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Recycled aluminum production' },
  { id: 'ef-s3-cat1-copper', name: 'Copper', category: 'Category 1', factor: 3.83, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Copper production' },
  { id: 'ef-s3-cat1-brass', name: 'Brass', category: 'Category 1', factor: 3.2, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Brass production' },
  { id: 'ef-s3-cat1-zinc', name: 'Zinc', category: 'Category 1', factor: 3.09, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Zinc production' },
  { id: 'ef-s3-cat1-iron', name: 'Cast Iron', category: 'Category 1', factor: 1.91, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Cast iron production' },
  
  // Plastics & Polymers
  { id: 'ef-s3-cat1-plastic-general', name: 'Plastic (General)', category: 'Category 1', factor: 3.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'General plastic materials' },
  { id: 'ef-s3-cat1-pet', name: 'PET Plastic', category: 'Category 1', factor: 3.15, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Polyethylene terephthalate' },
  { id: 'ef-s3-cat1-hdpe', name: 'HDPE Plastic', category: 'Category 1', factor: 1.93, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'High-density polyethylene' },
  { id: 'ef-s3-cat1-ldpe', name: 'LDPE Plastic', category: 'Category 1', factor: 2.08, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Low-density polyethylene' },
  { id: 'ef-s3-cat1-pvc', name: 'PVC', category: 'Category 1', factor: 2.41, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Polyvinyl chloride' },
  { id: 'ef-s3-cat1-polypropylene', name: 'Polypropylene', category: 'Category 1', factor: 1.98, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Polypropylene plastic' },
  { id: 'ef-s3-cat1-polystyrene', name: 'Polystyrene', category: 'Category 1', factor: 3.43, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Polystyrene plastic' },
  { id: 'ef-s3-cat1-nylon', name: 'Nylon', category: 'Category 1', factor: 8.1, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Nylon/Polyamide' },
  { id: 'ef-s3-cat1-rubber', name: 'Rubber', category: 'Category 1', factor: 3.18, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Rubber products' },
  
  // Paper & Wood
  { id: 'ef-s3-cat1-paper', name: 'Paper', category: 'Category 1', factor: 0.91, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Virgin paper products' },
  { id: 'ef-s3-cat1-recycled-paper', name: 'Recycled Paper', category: 'Category 1', factor: 0.61, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Recycled paper products' },
  { id: 'ef-s3-cat1-cardboard', name: 'Cardboard', category: 'Category 1', factor: 0.94, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Cardboard packaging' },
  { id: 'ef-s3-cat1-timber', name: 'Timber', category: 'Category 1', factor: 0.31, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Wood/timber products' },
  { id: 'ef-s3-cat1-plywood', name: 'Plywood', category: 'Category 1', factor: 0.68, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Plywood sheets' },
  
  // Construction Materials
  { id: 'ef-s3-cat1-cement', name: 'Cement', category: 'Category 1', factor: 0.82, unit: 'kg CO₂e/kg', source: 'IPCC', year: '2006', gases: 'CO₂', description: 'Cement production' },
  { id: 'ef-s3-cat1-concrete', name: 'Concrete', category: 'Category 1', factor: 0.13, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Ready-mix concrete' },
  { id: 'ef-s3-cat1-glass', name: 'Glass', category: 'Category 1', factor: 0.86, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Glass production' },
  { id: 'ef-s3-cat1-bricks', name: 'Bricks', category: 'Category 1', factor: 0.24, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Clay bricks' },
  { id: 'ef-s3-cat1-aggregates', name: 'Aggregates', category: 'Category 1', factor: 0.005, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂', description: 'Sand, gravel, crushed stone' },
  { id: 'ef-s3-cat1-insulation', name: 'Insulation Material', category: 'Category 1', factor: 1.86, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Building insulation' },
  
  // Textiles
  { id: 'ef-s3-cat1-cotton', name: 'Cotton', category: 'Category 1', factor: 8.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Cotton fabric' },
  { id: 'ef-s3-cat1-polyester', name: 'Polyester', category: 'Category 1', factor: 5.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Polyester fabric' },
  { id: 'ef-s3-cat1-wool', name: 'Wool', category: 'Category 1', factor: 12.1, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Wool fabric' },
  { id: 'ef-s3-cat1-leather', name: 'Leather', category: 'Category 1', factor: 17.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Leather products' },
  
  // Chemicals
  { id: 'ef-s3-cat1-chemicals-organic', name: 'Organic Chemicals', category: 'Category 1', factor: 2.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Organic chemical compounds' },
  { id: 'ef-s3-cat1-chemicals-inorganic', name: 'Inorganic Chemicals', category: 'Category 1', factor: 1.8, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Inorganic chemical compounds' },
  { id: 'ef-s3-cat1-fertilizer', name: 'Fertilizer', category: 'Category 1', factor: 4.5, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Fertilizer production' },
  { id: 'ef-s3-cat1-paints', name: 'Paints & Coatings', category: 'Category 1', factor: 2.3, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Paint and coating materials' },
  
  // Electronics & Components
  { id: 'ef-s3-cat1-electronics', name: 'Electronics (General)', category: 'Category 1', factor: 25.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electronic components' },
  { id: 'ef-s3-cat1-batteries', name: 'Batteries', category: 'Category 1', factor: 12.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Battery production' },
  { id: 'ef-s3-cat1-cables', name: 'Electrical Cables', category: 'Category 1', factor: 4.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electrical wiring and cables' },
  
  // Food & Agriculture
  { id: 'ef-s3-cat1-food-meat', name: 'Meat Products', category: 'Category 1', factor: 25.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Meat-based food products' },
  { id: 'ef-s3-cat1-food-dairy', name: 'Dairy Products', category: 'Category 1', factor: 3.2, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Dairy products' },
  { id: 'ef-s3-cat1-food-vegetables', name: 'Vegetables', category: 'Category 1', factor: 0.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Fresh vegetables' },
  { id: 'ef-s3-cat1-food-grains', name: 'Grains & Cereals', category: 'Category 1', factor: 0.8, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Grain products' },
  { id: 'ef-s3-cat1-food-beverages', name: 'Beverages', category: 'Category 1', factor: 0.3, unit: 'kg CO₂e/litre', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Beverage products' },
  
  // Office Supplies & Services
  { id: 'ef-s3-cat1-office-supplies', name: 'Office Supplies', category: 'Category 1', factor: 0.42, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Office supplies (spend-based)' },
  { id: 'ef-s3-cat1-it-services', name: 'IT Services', category: 'Category 1', factor: 0.15, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'IT services (spend-based)' },
  { id: 'ef-s3-cat1-professional-services', name: 'Professional Services', category: 'Category 1', factor: 0.12, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Consulting, legal, etc.' },
  { id: 'ef-s3-cat1-water-supply', name: 'Water Supply', category: 'Category 1', factor: 0.344, unit: 'kg CO₂e/m³', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Municipal water supply' },

  // ========== Category 2: Capital Goods ==========
  { id: 'ef-s3-cat2-machinery', name: 'Industrial Machinery', category: 'Category 2', factor: 10.5, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Heavy industrial machinery' },
  { id: 'ef-s3-cat2-office-equipment', name: 'Office Equipment', category: 'Category 2', factor: 15.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Office furniture and equipment' },
  { id: 'ef-s3-cat2-vehicles', name: 'Vehicles', category: 'Category 2', factor: 7.2, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Vehicle manufacturing' },
  { id: 'ef-s3-cat2-trucks', name: 'Trucks & Heavy Vehicles', category: 'Category 2', factor: 8.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Truck and heavy vehicle manufacturing' },
  { id: 'ef-s3-cat2-buildings', name: 'Building Construction', category: 'Category 2', factor: 0.45, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Construction spend-based' },
  { id: 'ef-s3-cat2-it-hardware', name: 'IT Hardware', category: 'Category 2', factor: 350.0, unit: 'kg CO₂e/unit', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Computers and IT equipment' },
  { id: 'ef-s3-cat2-servers', name: 'Data Center Servers', category: 'Category 2', factor: 1200.0, unit: 'kg CO₂e/unit', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Server equipment' },
  { id: 'ef-s3-cat2-hvac', name: 'HVAC Equipment', category: 'Category 2', factor: 12.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Heating, ventilation, air conditioning' },
  { id: 'ef-s3-cat2-solar-panels', name: 'Solar Panels', category: 'Category 2', factor: 40.0, unit: 'kg CO₂e/m²', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'PV solar panel manufacturing' },
  { id: 'ef-s3-cat2-furniture', name: 'Furniture', category: 'Category 2', factor: 5.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Office and industrial furniture' },

  // ========== Category 3: Fuel and Energy Related Activities ==========
  { id: 'ef-s3-cat3-electricity-td', name: 'Electricity T&D Losses', category: 'Category 3', factor: 0.089, unit: 'kg CO₂e/kWh', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Transmission and distribution losses' },
  { id: 'ef-s3-cat3-electricity-td-india', name: 'Electricity T&D Losses (India)', category: 'Category 3', factor: 0.164, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'India grid T&D losses (~20%)' },
  { id: 'ef-s3-cat3-fuel-extraction', name: 'Fuel Extraction & Processing', category: 'Category 3', factor: 0.25, unit: 'kg CO₂e/kWh', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Upstream fuel emissions' },
  { id: 'ef-s3-cat3-diesel-wtt', name: 'Diesel (Well-to-Tank)', category: 'Category 3', factor: 0.62, unit: 'kg CO₂e/litre', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Diesel upstream emissions' },
  { id: 'ef-s3-cat3-petrol-wtt', name: 'Petrol (Well-to-Tank)', category: 'Category 3', factor: 0.55, unit: 'kg CO₂e/litre', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Petrol upstream emissions' },
  { id: 'ef-s3-cat3-lpg-wtt', name: 'LPG (Well-to-Tank)', category: 'Category 3', factor: 0.32, unit: 'kg CO₂e/litre', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'LPG upstream emissions' },
  { id: 'ef-s3-cat3-natural-gas-wtt', name: 'Natural Gas (Well-to-Tank)', category: 'Category 3', factor: 0.41, unit: 'kg CO₂e/m³', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Natural gas upstream emissions' },
  { id: 'ef-s3-cat3-coal-wtt', name: 'Coal (Well-to-Tank)', category: 'Category 3', factor: 0.38, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Coal mining and transport' },

  // ========== Category 4: Upstream Transportation & Distribution ==========
  { id: 'ef-s3-cat4-road-freight', name: 'Road Freight (HGV)', category: 'Category 4', factor: 0.105, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Heavy goods vehicle' },
  { id: 'ef-s3-cat4-road-freight-light', name: 'Road Freight (LGV)', category: 'Category 4', factor: 0.245, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Light goods vehicle' },
  { id: 'ef-s3-cat4-rail-freight', name: 'Rail Freight', category: 'Category 4', factor: 0.03, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Rail transportation' },
  { id: 'ef-s3-cat4-rail-freight-india', name: 'Rail Freight (India)', category: 'Category 4', factor: 0.022, unit: 'kg CO₂e/tonne-km', source: 'Indian Railways', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Indian railways freight' },
  { id: 'ef-s3-cat4-sea-freight-container', name: 'Sea Freight (Container)', category: 'Category 4', factor: 0.015, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Container ship' },
  { id: 'ef-s3-cat4-sea-freight-bulk', name: 'Sea Freight (Bulk)', category: 'Category 4', factor: 0.008, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Bulk cargo ship' },
  { id: 'ef-s3-cat4-sea-freight-tanker', name: 'Sea Freight (Tanker)', category: 'Category 4', factor: 0.006, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Oil/chemical tanker' },
  { id: 'ef-s3-cat4-air-freight', name: 'Air Freight (Long-haul)', category: 'Category 4', factor: 1.53, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Long-haul air cargo' },
  { id: 'ef-s3-cat4-air-freight-short', name: 'Air Freight (Short-haul)', category: 'Category 4', factor: 2.02, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Short-haul air cargo' },
  { id: 'ef-s3-cat4-inland-waterway', name: 'Inland Waterway', category: 'Category 4', factor: 0.032, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'River/canal transport' },

  // ========== Category 5: Waste Generated in Operations ==========
  { id: 'ef-s3-cat5-landfill-mixed', name: 'Mixed Waste to Landfill', category: 'Category 5', factor: 458, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Mixed MSW landfill' },
  { id: 'ef-s3-cat5-landfill-organic', name: 'Organic Waste to Landfill', category: 'Category 5', factor: 587, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CH₄', description: 'Food/garden waste landfill' },
  { id: 'ef-s3-cat5-landfill-paper', name: 'Paper Waste to Landfill', category: 'Category 5', factor: 1042, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CH₄', description: 'Paper/cardboard landfill' },
  { id: 'ef-s3-cat5-incineration', name: 'Waste Incineration', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, N₂O', description: 'Waste incineration without energy recovery' },
  { id: 'ef-s3-cat5-incineration-energy', name: 'Waste-to-Energy', category: 'Category 5', factor: 12, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, N₂O', description: 'Incineration with energy recovery' },
  { id: 'ef-s3-cat5-recycling-paper', name: 'Paper Recycling', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Paper recycling process' },
  { id: 'ef-s3-cat5-recycling-plastic', name: 'Plastic Recycling', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Plastic recycling process' },
  { id: 'ef-s3-cat5-recycling-metal', name: 'Metal Recycling', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Metal recycling process' },
  { id: 'ef-s3-cat5-recycling-glass', name: 'Glass Recycling', category: 'Category 5', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Glass recycling process' },
  { id: 'ef-s3-cat5-composting', name: 'Composting', category: 'Category 5', factor: 10, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CH₄, N₂O', description: 'Organic waste composting' },
  { id: 'ef-s3-cat5-anaerobic-digestion', name: 'Anaerobic Digestion', category: 'Category 5', factor: 8, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CH₄, N₂O', description: 'Biogas production from waste' },
  { id: 'ef-s3-cat5-wastewater', name: 'Wastewater Treatment', category: 'Category 5', factor: 0.708, unit: 'kg CO₂e/m³', source: 'DEFRA', year: '2024', gases: 'CH₄, N₂O', description: 'Wastewater treatment plant' },
  { id: 'ef-s3-cat5-hazardous', name: 'Hazardous Waste', category: 'Category 5', factor: 250, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Hazardous waste treatment' },
  { id: 'ef-s3-cat5-ewaste', name: 'E-Waste', category: 'Category 5', factor: 150, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electronic waste processing' },

  // ========== Category 6: Business Travel ==========
  { id: 'ef-s3-cat6-air-domestic', name: 'Domestic Flight', category: 'Category 6', factor: 0.255, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Domestic flights (with RF)' },
  { id: 'ef-s3-cat6-air-short', name: 'Short-haul Flight (<3700km)', category: 'Category 6', factor: 0.156, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Short-haul international (with RF)' },
  { id: 'ef-s3-cat6-air-long-economy', name: 'Long-haul Flight (Economy)', category: 'Category 6', factor: 0.148, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Long-haul economy class (with RF)' },
  { id: 'ef-s3-cat6-air-long-business', name: 'Long-haul Flight (Business)', category: 'Category 6', factor: 0.429, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Long-haul business class (with RF)' },
  { id: 'ef-s3-cat6-air-long-first', name: 'Long-haul Flight (First)', category: 'Category 6', factor: 0.591, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Long-haul first class (with RF)' },
  { id: 'ef-s3-cat6-car-petrol-small', name: 'Car (Small Petrol)', category: 'Category 6', factor: 0.149, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Small petrol car' },
  { id: 'ef-s3-cat6-car-petrol-medium', name: 'Car (Medium Petrol)', category: 'Category 6', factor: 0.192, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Medium petrol car' },
  { id: 'ef-s3-cat6-car-petrol-large', name: 'Car (Large Petrol)', category: 'Category 6', factor: 0.282, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Large petrol car' },
  { id: 'ef-s3-cat6-car-diesel', name: 'Car (Diesel)', category: 'Category 6', factor: 0.171, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Average diesel car' },
  { id: 'ef-s3-cat6-car-hybrid', name: 'Car (Hybrid)', category: 'Category 6', factor: 0.120, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Hybrid car' },
  { id: 'ef-s3-cat6-car-ev', name: 'Car (Electric)', category: 'Category 6', factor: 0.047, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electric vehicle (UK grid)' },
  { id: 'ef-s3-cat6-taxi', name: 'Taxi', category: 'Category 6', factor: 0.203, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Taxi/cab travel' },
  { id: 'ef-s3-cat6-rail-national', name: 'Rail (National)', category: 'Category 6', factor: 0.035, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'National rail travel' },
  { id: 'ef-s3-cat6-rail-international', name: 'Rail (International)', category: 'Category 6', factor: 0.006, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'International train (Eurostar)' },
  { id: 'ef-s3-cat6-bus', name: 'Bus', category: 'Category 6', factor: 0.089, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Coach/bus travel' },
  { id: 'ef-s3-cat6-hotel', name: 'Hotel Stay', category: 'Category 6', factor: 25.5, unit: 'kg CO₂e/night', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Average hotel accommodation' },
  { id: 'ef-s3-cat6-hotel-luxury', name: 'Hotel Stay (Luxury)', category: 'Category 6', factor: 45.0, unit: 'kg CO₂e/night', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Luxury hotel' },
  { id: 'ef-s3-cat6-ferry', name: 'Ferry', category: 'Category 6', factor: 0.115, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Ferry travel (foot passenger)' },

  // ========== Category 7: Employee Commuting ==========
  { id: 'ef-s3-cat7-car-petrol', name: 'Car Commute (Petrol)', category: 'Category 7', factor: 0.170, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Personal petrol car' },
  { id: 'ef-s3-cat7-car-diesel', name: 'Car Commute (Diesel)', category: 'Category 7', factor: 0.171, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Personal diesel car' },
  { id: 'ef-s3-cat7-car-ev', name: 'Car Commute (Electric)', category: 'Category 7', factor: 0.047, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electric vehicle commute' },
  { id: 'ef-s3-cat7-motorbike', name: 'Motorbike', category: 'Category 7', factor: 0.114, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Motorbike commute' },
  { id: 'ef-s3-cat7-scooter', name: 'Scooter (Petrol)', category: 'Category 7', factor: 0.072, unit: 'kg CO₂e/km', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Petrol scooter' },
  { id: 'ef-s3-cat7-escooter', name: 'E-Scooter/E-Bike', category: 'Category 7', factor: 0.022, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electric scooter/bike' },
  { id: 'ef-s3-cat7-bus', name: 'Bus', category: 'Category 7', factor: 0.089, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Public bus' },
  { id: 'ef-s3-cat7-metro', name: 'Metro/Subway', category: 'Category 7', factor: 0.033, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Underground/metro rail' },
  { id: 'ef-s3-cat7-local-train', name: 'Local Train', category: 'Category 7', factor: 0.041, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Suburban/local trains' },
  { id: 'ef-s3-cat7-autorickshaw', name: 'Auto-rickshaw', category: 'Category 7', factor: 0.052, unit: 'kg CO₂e/km', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Three-wheeler auto' },
  { id: 'ef-s3-cat7-bicycle', name: 'Bicycle', category: 'Category 7', factor: 0, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'None', description: 'Zero emission cycling' },
  { id: 'ef-s3-cat7-walking', name: 'Walking', category: 'Category 7', factor: 0, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'None', description: 'Zero emission walking' },
  { id: 'ef-s3-cat7-wfh', name: 'Work From Home', category: 'Category 7', factor: 0.52, unit: 'kg CO₂e/day', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Home energy for remote work' },
  { id: 'ef-s3-cat7-carpool', name: 'Carpool (2 persons)', category: 'Category 7', factor: 0.085, unit: 'kg CO₂e/passenger-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Shared car commute' },

  // ========== Category 8: Upstream Leased Assets ==========
  { id: 'ef-s3-cat8-leased-electricity', name: 'Leased Facility Electricity', category: 'Category 8', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity in leased buildings' },
  { id: 'ef-s3-cat8-leased-gas', name: 'Leased Facility Gas', category: 'Category 8', factor: 1.93, unit: 'kg CO₂e/m³', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Natural gas in leased facilities' },
  { id: 'ef-s3-cat8-leased-office', name: 'Leased Office Space', category: 'Category 8', factor: 50, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Office space (area-based)' },
  { id: 'ef-s3-cat8-leased-warehouse', name: 'Leased Warehouse', category: 'Category 8', factor: 30, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Warehouse space (area-based)' },
  { id: 'ef-s3-cat8-leased-retail', name: 'Leased Retail Space', category: 'Category 8', factor: 85, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Retail space (area-based)' },
  { id: 'ef-s3-cat8-leased-vehicle', name: 'Leased Vehicle', category: 'Category 8', factor: 2.68, unit: 'kg CO₂e/litre', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Fuel for leased vehicles' },
  { id: 'ef-s3-cat8-leased-equipment', name: 'Leased Equipment', category: 'Category 8', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity for leased equipment' },

  // ========== Category 9: Downstream Transportation & Distribution ==========
  { id: 'ef-s3-cat9-road-freight', name: 'Road Freight (Downstream)', category: 'Category 9', factor: 0.105, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product distribution by road' },
  { id: 'ef-s3-cat9-road-light', name: 'Light Goods Vehicle', category: 'Category 9', factor: 0.245, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Light delivery vehicles' },
  { id: 'ef-s3-cat9-courier', name: 'Courier Services', category: 'Category 9', factor: 0.52, unit: 'kg CO₂e/package', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Small parcel delivery' },
  { id: 'ef-s3-cat9-rail-freight', name: 'Rail Freight (Downstream)', category: 'Category 9', factor: 0.03, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product distribution by rail' },
  { id: 'ef-s3-cat9-sea-freight', name: 'Sea Freight (Downstream)', category: 'Category 9', factor: 0.015, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product distribution by sea' },
  { id: 'ef-s3-cat9-air-freight', name: 'Air Freight (Downstream)', category: 'Category 9', factor: 1.53, unit: 'kg CO₂e/tonne-km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product distribution by air' },
  { id: 'ef-s3-cat9-retail-storage', name: 'Retail Cold Storage', category: 'Category 9', factor: 0.12, unit: 'kg CO₂e/kg/day', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Refrigerated storage at retail' },
  { id: 'ef-s3-cat9-last-mile', name: 'Last Mile Delivery', category: 'Category 9', factor: 0.181, unit: 'kg CO₂e/parcel', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Final delivery to customer' },

  // ========== Category 10: Processing of Sold Products ==========
  { id: 'ef-s3-cat10-food-processing', name: 'Food Processing', category: 'Category 10', factor: 5.5, unit: 'kg CO₂e/kg', source: 'India GHG Platform', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Food product processing' },
  { id: 'ef-s3-cat10-metal-processing', name: 'Metal Processing', category: 'Category 10', factor: 1.2, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Metal fabrication by customers' },
  { id: 'ef-s3-cat10-chemical-processing', name: 'Chemical Processing', category: 'Category 10', factor: 2.0, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Chemical processing by customers' },
  { id: 'ef-s3-cat10-textile-processing', name: 'Textile Processing', category: 'Category 10', factor: 3.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Textile/garment manufacturing' },
  { id: 'ef-s3-cat10-paper-processing', name: 'Paper Processing', category: 'Category 10', factor: 0.8, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Paper product manufacturing' },
  { id: 'ef-s3-cat10-plastic-processing', name: 'Plastic Processing', category: 'Category 10', factor: 1.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Plastic molding/processing' },
  { id: 'ef-s3-cat10-assembly', name: 'Assembly Operations', category: 'Category 10', factor: 0.5, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product assembly' },

  // ========== Category 11: Use of Sold Products ==========
  { id: 'ef-s3-cat11-electricity-india', name: 'Product Electricity Use (India)', category: 'Category 11', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity consumed by products' },
  { id: 'ef-s3-cat11-electricity-global', name: 'Product Electricity Use (Global)', category: 'Category 11', factor: 0.45, unit: 'kg CO₂e/kWh', source: 'IEA', year: '2022', gases: 'CO₂, CH₄, N₂O', description: 'Global average grid factor' },
  { id: 'ef-s3-cat11-fuel-petrol', name: 'Product Fuel Use (Petrol)', category: 'Category 11', factor: 2.31, unit: 'kg CO₂e/litre', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Petrol fuel consumed by products' },
  { id: 'ef-s3-cat11-fuel-diesel', name: 'Product Fuel Use (Diesel)', category: 'Category 11', factor: 2.68, unit: 'kg CO₂e/litre', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Diesel fuel consumed by products' },
  { id: 'ef-s3-cat11-fuel-gas', name: 'Product Gas Use', category: 'Category 11', factor: 1.93, unit: 'kg CO₂e/m³', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Natural gas consumed by products' },
  { id: 'ef-s3-cat11-refrigerant-r410a', name: 'Product Refrigerant (R-410A)', category: 'Category 11', factor: 2088, unit: 'kg CO₂e/kg', source: 'IPCC', year: '2006', gases: 'HFCs', description: 'R-410A leakage from products' },
  { id: 'ef-s3-cat11-refrigerant-r32', name: 'Product Refrigerant (R-32)', category: 'Category 11', factor: 675, unit: 'kg CO₂e/kg', source: 'IPCC', year: '2006', gases: 'HFCs', description: 'R-32 leakage from products' },
  { id: 'ef-s3-cat11-vehicle-km', name: 'Vehicle Product Use', category: 'Category 11', factor: 0.21, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Average vehicle emissions per km' },

  // ========== Category 12: End-of-Life Treatment of Sold Products ==========
  { id: 'ef-s3-cat12-landfill', name: 'Product Disposal (Landfill)', category: 'Category 12', factor: 458, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Product end-of-life to landfill' },
  { id: 'ef-s3-cat12-incineration', name: 'Product Disposal (Incineration)', category: 'Category 12', factor: 21, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, N₂O', description: 'Product incineration' },
  { id: 'ef-s3-cat12-recycling', name: 'Product Recycling', category: 'Category 12', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Product recycling processing' },
  { id: 'ef-s3-cat12-ewaste', name: 'E-Waste Treatment', category: 'Category 12', factor: 150, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Electronic product disposal' },
  { id: 'ef-s3-cat12-battery', name: 'Battery Disposal', category: 'Category 12', factor: 200, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Battery recycling/disposal' },
  { id: 'ef-s3-cat12-textile', name: 'Textile Disposal', category: 'Category 12', factor: 25, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Textile waste treatment' },
  { id: 'ef-s3-cat12-plastic', name: 'Plastic Product Disposal', category: 'Category 12', factor: 2.53, unit: 'kg CO₂e/kg', source: 'DEFRA', year: '2024', gases: 'CO₂', description: 'Plastic product end-of-life' },
  { id: 'ef-s3-cat12-metal', name: 'Metal Product Disposal', category: 'Category 12', factor: 21, unit: 'kg CO₂e/tonne', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Metal product recycling' },

  // ========== Category 13: Downstream Leased Assets ==========
  { id: 'ef-s3-cat13-leased-electricity', name: 'Downstream Leased Electricity', category: 'Category 13', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity in downstream leases' },
  { id: 'ef-s3-cat13-leased-gas', name: 'Downstream Leased Gas', category: 'Category 13', factor: 1.93, unit: 'kg CO₂e/m³', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Gas in downstream leases' },
  { id: 'ef-s3-cat13-leased-office', name: 'Leased Office (to others)', category: 'Category 13', factor: 50, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Office space leased out' },
  { id: 'ef-s3-cat13-leased-retail', name: 'Leased Retail (to others)', category: 'Category 13', factor: 85, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Retail space leased out' },
  { id: 'ef-s3-cat13-leased-industrial', name: 'Leased Industrial (to others)', category: 'Category 13', factor: 65, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Industrial space leased out' },
  { id: 'ef-s3-cat13-leased-vehicle', name: 'Leased Vehicle (to others)', category: 'Category 13', factor: 0.21, unit: 'kg CO₂e/km', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Vehicles leased to customers' },
  { id: 'ef-s3-cat13-leased-equipment', name: 'Leased Equipment (to others)', category: 'Category 13', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Equipment leased to customers' },

  // ========== Category 14: Franchises ==========
  { id: 'ef-s3-cat14-franchise-electricity', name: 'Franchise Electricity', category: 'Category 14', factor: 0.82, unit: 'kg CO₂e/kWh', source: 'CEA India', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Electricity at franchise locations' },
  { id: 'ef-s3-cat14-franchise-gas', name: 'Franchise Natural Gas', category: 'Category 14', factor: 1.93, unit: 'kg CO₂e/m³', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Gas at franchise locations' },
  { id: 'ef-s3-cat14-franchise-restaurant', name: 'Franchise Restaurant', category: 'Category 14', factor: 120, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Restaurant franchise energy' },
  { id: 'ef-s3-cat14-franchise-retail', name: 'Franchise Retail Store', category: 'Category 14', factor: 85, unit: 'kg CO₂e/m²/year', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Retail franchise energy' },
  { id: 'ef-s3-cat14-franchise-hotel', name: 'Franchise Hotel', category: 'Category 14', factor: 35, unit: 'kg CO₂e/room-night', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Hotel franchise per room' },
  { id: 'ef-s3-cat14-franchise-vehicle', name: 'Franchise Vehicle Fleet', category: 'Category 14', factor: 2.68, unit: 'kg CO₂e/litre', source: 'DEFRA', year: '2024', gases: 'CO₂, CH₄, N₂O', description: 'Franchise vehicle fuel' },
  { id: 'ef-s3-cat14-franchise-waste', name: 'Franchise Waste', category: 'Category 14', factor: 458, unit: 'kg CO₂e/tonne', source: 'IPCC', year: '2006', gases: 'CO₂, CH₄, N₂O', description: 'Waste from franchise locations' },

  // ========== Category 15: Investments ==========
  { id: 'ef-s3-cat15-equity', name: 'Equity Investments (Spend)', category: 'Category 15', factor: 0.4, unit: 'kg CO₂e/INR', source: 'India GHG Platform', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Investment emissions (spend-based)' },
  { id: 'ef-s3-cat15-equity-usd', name: 'Equity Investments (USD)', category: 'Category 15', factor: 0.5, unit: 'kg CO₂e/USD', source: 'PCAF', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Investment emissions per USD' },
  { id: 'ef-s3-cat15-debt', name: 'Debt Investments', category: 'Category 15', factor: 0.3, unit: 'kg CO₂e/INR', source: 'PCAF', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Financed emissions from debt' },
  { id: 'ef-s3-cat15-real-estate', name: 'Real Estate Investment', category: 'Category 15', factor: 50, unit: 'kg CO₂e/m²/year', source: 'PCAF', year: '2023', gases: 'CO₂, CH₄, N₂O', description: 'Property investment emissions' },
  { id: 'ef-s3-cat15-project-finance', name: 'Project Finance', category: 'Category 15', factor: 0.35, unit: 'kg CO₂e/INR', source: 'PCAF', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Project financing emissions' },
  { id: 'ef-s3-cat15-sovereign-bonds', name: 'Sovereign Bonds', category: 'Category 15', factor: 0.25, unit: 'kg CO₂e/INR', source: 'PCAF', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'Government bond emissions' },
  { id: 'ef-s3-cat15-private-equity', name: 'Private Equity', category: 'Category 15', factor: 0.45, unit: 'kg CO₂e/INR', source: 'PCAF', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'PE fund emissions' },
  { id: 'ef-s3-cat15-venture-capital', name: 'Venture Capital', category: 'Category 15', factor: 0.55, unit: 'kg CO₂e/INR', source: 'PCAF', year: '2023', region: 'India', gases: 'CO₂, CH₄, N₂O', description: 'VC investment emissions' },
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