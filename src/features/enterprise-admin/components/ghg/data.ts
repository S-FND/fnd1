
// Scope 1 Emissions Data by Source
export const scope1Data = [
  { name: 'Stationary Combustion', value: 560, percentage: 28 },
  { name: 'Mobile Combustion', value: 480, percentage: 24 },
  { name: 'Process Emissions', value: 320, percentage: 16 },
  { name: 'Fugitive Emissions', value: 640, percentage: 32 },
];

// Scope 2 Emissions Data by Source
export const scope2Data = [
  { name: 'Purchased Electricity', value: 1200, percentage: 60 },
  { name: 'Purchased Heat', value: 400, percentage: 20 },
  { name: 'Purchased Steam', value: 200, percentage: 10 },
  { name: 'Purchased Cooling', value: 200, percentage: 10 },
];

// Scope 3 Emissions Data by Source
export const scope3Data = [
  { name: 'Purchased Goods & Services', value: 3200, percentage: 40 },
  { name: 'Capital Goods', value: 800, percentage: 10 },
  { name: 'Fuel & Energy Related', value: 640, percentage: 8 },
  { name: 'Transportation & Distribution', value: 1600, percentage: 20 },
  { name: 'Waste Generated', value: 240, percentage: 3 },
  { name: 'Business Travel', value: 400, percentage: 5 },
  { name: 'Employee Commuting', value: 720, percentage: 9 },
  { name: 'Leased Assets', value: 400, percentage: 5 },
];

// Detailed subcategory emissions
export const detailedEmissionsData = {
  stationaryCombustion: [
    { name: 'Natural Gas', value: 320, unit: 'tCO2e' },
    { name: 'Diesel Generators', value: 180, unit: 'tCO2e' },
    { name: 'LPG', value: 60, unit: 'tCO2e' },
  ],
  mobileCombustion: [
    { name: 'Company Vehicles', value: 280, unit: 'tCO2e' },
    { name: 'Aircraft', value: 200, unit: 'tCO2e' },
  ],
  purchasedElectricity: [
    { name: 'Office Buildings', value: 450, unit: 'tCO2e' },
    { name: 'Manufacturing', value: 600, unit: 'tCO2e' },
    { name: 'Data Centers', value: 150, unit: 'tCO2e' },
  ],
  businessTravel: [
    { name: 'Air Travel', value: 250, unit: 'tCO2e' },
    { name: 'Train Travel', value: 50, unit: 'tCO2e' },
    { name: 'Hotel Stays', value: 70, unit: 'tCO2e' },
    { name: 'Car Rentals', value: 30, unit: 'tCO2e' },
  ],
};

// Monthly emissions data
export const monthlyEmissionsData = [
  { month: 'Jan', scope1: 200, scope2: 350, scope3: 800 },
  { month: 'Feb', scope1: 180, scope2: 320, scope3: 780 },
  { month: 'Mar', scope1: 190, scope2: 330, scope3: 820 },
  { month: 'Apr', scope1: 210, scope2: 310, scope3: 790 },
  { month: 'May', scope1: 220, scope2: 300, scope3: 810 },
  { month: 'Jun', scope1: 230, scope2: 330, scope3: 850 },
  { month: 'Jul', scope1: 250, scope2: 350, scope3: 900 },
  { month: 'Aug', scope1: 260, scope2: 380, scope3: 920 },
  { month: 'Sep', scope1: 240, scope2: 360, scope3: 880 },
  { month: 'Oct', scope1: 230, scope2: 350, scope3: 860 },
  { month: 'Nov', scope1: 220, scope2: 330, scope3: 830 },
  { month: 'Dec', scope1: 210, scope2: 340, scope3: 810 },
];

// Energy consumption data
export const energyData = [
  { name: 'Electricity', value: 5800, unit: 'MWh', percentage: 65 },
  { name: 'Natural Gas', value: 2200, unit: 'MWh', percentage: 25 },
  { name: 'Diesel', value: 450, unit: 'MWh', percentage: 5 },
  { name: 'Other Fuels', value: 450, unit: 'MWh', percentage: 5 },
];

export const totalEmissions = {
  scope1: scope1Data.reduce((sum, item) => sum + item.value, 0),
  scope2: scope2Data.reduce((sum, item) => sum + item.value, 0),
  scope3: scope3Data.reduce((sum, item) => sum + item.value, 0),
};

export const totalAllScopes = totalEmissions.scope1 + totalEmissions.scope2 + totalEmissions.scope3;

export const scopePercentages = [
  { name: 'Scope 1', value: totalEmissions.scope1, percentage: ((totalEmissions.scope1 / totalAllScopes) * 100).toFixed(1) },
  { name: 'Scope 2', value: totalEmissions.scope2, percentage: ((totalEmissions.scope2 / totalAllScopes) * 100).toFixed(1) },
  { name: 'Scope 3', value: totalEmissions.scope3, percentage: ((totalEmissions.scope3 / totalAllScopes) * 100).toFixed(1) },
];

export const SCOPE_COLORS = {
  scope1: '#22c55e',
  scope2: '#3b82f6',
  scope3: '#f97316'
};
