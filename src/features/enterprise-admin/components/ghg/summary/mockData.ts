
// Comprehensive emissions data for IMR Resources - Global commodity trading and resource development company
// Data reflects 4 production sites and 2 trading entities across multiple countries

export const companyInfo = {
  name: "IMR Resources",
  headquarters: "Zug, Switzerland",
  established: 2004,
  operations: ["India", "Indonesia", "Mexico", "South Africa", "UAE", "UK"],
  annualTradingVolume: "27 million metric tons",
  businessUnits: [
    {
      name: "IMR Resources India Private Limited",
      location: "Mumbai, India",
      type: "Trading",
      employees: 31,
      established: 2010
    },
    {
      name: "IMR Steel Private Limited",
      location: "Mumbai, India",
      type: "Manufacturing",
      employees: 45,
      established: 2020
    },
    {
      name: "IMR Indonesia Mining",
      location: "Jakarta, Indonesia",
      type: "Mining",
      employees: 120,
      established: 2012
    },
    {
      name: "IMR Mexico Operations",
      location: "Mexico City, Mexico",
      type: "Mining & Processing",
      employees: 85,
      established: 2015
    },
    {
      name: "IMR South Africa",
      location: "Johannesburg, South Africa",
      type: "Mining & Processing",
      employees: 156,
      established: 2011
    },
    {
      name: "IMR Commodities DMCC",
      location: "Dubai, UAE",
      type: "Trading",
      employees: 24,
      established: 2014
    }
  ]
};

// Scope breakdown with more realistic values for a global commodities company
export const emissionsByScope = [
  { 
    scope: "Scope 1 (Direct)", 
    value: 156780, 
    color: "bg-blue-500", 
    completeness: 92, 
    statusColor: "bg-green-500" 
  },
  { 
    scope: "Scope 2 (Indirect)", 
    value: 89320, 
    color: "bg-green-500", 
    completeness: 88, 
    statusColor: "bg-green-500" 
  },
  { 
    scope: "Scope 3 (Value Chain)", 
    value: 1247650, 
    color: "bg-amber-500", 
    completeness: 72, 
    statusColor: "bg-amber-500" 
  },
  { 
    scope: "Scope 4 (Avoided)", 
    value: 34520, 
    color: "bg-purple-500", 
    completeness: 45, 
    statusColor: "bg-red-500" 
  }
];

// Historical emissions trend showing modest progress with some annual fluctuations
export const emissionsTrend = [
  { year: 2019, value: 1578930 },
  { year: 2020, value: 1348710 }, // COVID-19 impact
  { year: 2021, value: 1462540 }, // Recovery
  { year: 2022, value: 1523890 },
  { year: 2023, value: 1493750 }, // Latest year with slight improvement
];

// Country-specific emission factors for electricity
export const countryEmissionFactors = {
  // kgCO2e per kWh
  Switzerland: 0.027, // Low due to hydropower and nuclear
  India: 0.82, // High coal dependence
  Indonesia: 0.761,
  Mexico: 0.494,
  SouthAfrica: 0.937, // Very high due to coal dominance
  UAE: 0.413,
  UK: 0.233, // Lower due to renewables and gas
  Global_Average: 0.475
};

// SCOPE 1: Direct emissions with country-specific emission factors
export const scope1Categories = [
  {
    id: "stationary_combustion",
    name: "Stationary Combustion",
    description: "Direct emissions from fuel combustion in stationary equipment",
    items: [
      { id: "natural_gas_switzerland", name: "Natural Gas (Switzerland HQ)", unit: "m³", emissionFactor: 2.02 },
      { id: "diesel_generators_india", name: "Diesel Generators (India)", unit: "liters", emissionFactor: 2.68 },
      { id: "coal_boilers_indonesia", name: "Coal Boilers (Indonesia)", unit: "tonnes", emissionFactor: 2.42 },
      { id: "lpg_southafrica", name: "LPG (South Africa)", unit: "kg", emissionFactor: 2.94 },
      { id: "natural_gas_mexico", name: "Natural Gas (Mexico)", unit: "m³", emissionFactor: 2.07 }
    ]
  },
  {
    id: "mobile_combustion",
    name: "Mobile Combustion",
    description: "Emissions from company-owned vehicles and mobile machinery",
    items: [
      { id: "mining_vehicles_indonesia", name: "Mining Vehicles (Indonesia)", unit: "liters diesel", emissionFactor: 2.68 },
      { id: "mining_vehicles_southafrica", name: "Mining Vehicles (South Africa)", unit: "liters diesel", emissionFactor: 2.68 },
      { id: "mining_vehicles_mexico", name: "Mining Vehicles (Mexico)", unit: "liters diesel", emissionFactor: 2.68 },
      { id: "company_cars_switzerland", name: "Company Cars (Switzerland)", unit: "liters petrol", emissionFactor: 2.31 },
      { id: "company_cars_india", name: "Company Cars (India)", unit: "liters petrol", emissionFactor: 2.31 },
      { id: "company_cars_uk", name: "Company Cars (UK)", unit: "liters petrol", emissionFactor: 2.31 }
    ]
  },
  {
    id: "process_emissions",
    name: "Process Emissions",
    description: "Direct emissions from industrial processes",
    items: [
      { id: "steel_processing_india", name: "Steel Processing (India)", unit: "tonnes production", emissionFactor: 0.08 },
      { id: "ore_processing_indonesia", name: "Ore Processing (Indonesia)", unit: "tonnes processed", emissionFactor: 0.12 },
      { id: "ore_processing_mexico", name: "Ore Processing (Mexico)", unit: "tonnes processed", emissionFactor: 0.10 },
      { id: "gold_processing_southafrica", name: "Gold Processing (South Africa)", unit: "tonnes processed", emissionFactor: 0.25 }
    ]
  },
  {
    id: "fugitive_emissions",
    name: "Fugitive Emissions",
    description: "Unintended emissions from operations",
    items: [
      { id: "refrigerant_leaks_r134a", name: "Refrigerant Leaks (R-134a)", unit: "kg", emissionFactor: 1430 },
      { id: "refrigerant_leaks_r410a", name: "Refrigerant Leaks (R-410a)", unit: "kg", emissionFactor: 2088 },
      { id: "methane_leaks_indonesia", name: "Methane Leaks (Indonesia Mining)", unit: "kg CH4", emissionFactor: 25 },
      { id: "methane_leaks_southafrica", name: "Methane Leaks (South Africa Mining)", unit: "kg CH4", emissionFactor: 25 },
      { id: "sf6_leaks_substations", name: "SF6 Leaks (Electrical Substations)", unit: "kg", emissionFactor: 22800 }
    ]
  }
];

// SCOPE 2: Indirect emissions with country-specific grid factors
export const scope2Categories = [
  {
    id: "electricity",
    name: "Purchased Electricity",
    description: "Emissions from purchased electricity across global operations",
    items: [
      { id: "hq_switzerland", name: "HQ (Switzerland)", unit: "MWh", emissionFactor: countryEmissionFactors.Switzerland * 1000 },
      { id: "facilities_india", name: "Facilities (India)", unit: "MWh", emissionFactor: countryEmissionFactors.India * 1000 },
      { id: "mining_indonesia", name: "Mining Operations (Indonesia)", unit: "MWh", emissionFactor: countryEmissionFactors.Indonesia * 1000 },
      { id: "mining_mexico", name: "Mining Operations (Mexico)", unit: "MWh", emissionFactor: countryEmissionFactors.Mexico * 1000 },
      { id: "mining_southafrica", name: "Mining Operations (South Africa)", unit: "MWh", emissionFactor: countryEmissionFactors.SouthAfrica * 1000 },
      { id: "office_uae", name: "Trading Office (UAE)", unit: "MWh", emissionFactor: countryEmissionFactors.UAE * 1000 },
      { id: "office_uk", name: "Trading Office (UK)", unit: "MWh", emissionFactor: countryEmissionFactors.UK * 1000 }
    ]
  },
  {
    id: "steam_heat",
    name: "Purchased Steam & Heat",
    description: "Emissions from purchased steam and heat",
    items: [
      { id: "steam_india", name: "Steam (India Steel Plant)", unit: "MWh", emissionFactor: 180 },
      { id: "district_heating_switzerland", name: "District Heating (Switzerland HQ)", unit: "MWh", emissionFactor: 120 },
      { id: "district_heating_uk", name: "District Heating (UK Office)", unit: "MWh", emissionFactor: 165 }
    ]
  },
  {
    id: "cooling",
    name: "Purchased Cooling",
    description: "Emissions from purchased cooling services",
    items: [
      { id: "district_cooling_uae", name: "District Cooling (UAE Office)", unit: "MWh", emissionFactor: 135 },
      { id: "district_cooling_india", name: "District Cooling (India Office)", unit: "MWh", emissionFactor: 145 }
    ]
  }
];

// SCOPE 3: Comprehensive value chain emissions (largest category for a commodity trading company)
export const scope3Categories = [
  {
    id: "purchased_goods",
    name: "Purchased Goods & Services",
    description: "Upstream emissions from purchased products and services",
    items: [
      { id: "iron_ore", name: "Iron Ore Purchases", unit: "tonnes", emissionFactor: 1.1 },
      { id: "manganese_ore", name: "Manganese Ore Purchases", unit: "tonnes", emissionFactor: 1.4 },
      { id: "chrome_ore", name: "Chrome Ore Purchases", unit: "tonnes", emissionFactor: 2.0 },
      { id: "metallurgical_coal", name: "Metallurgical Coal Purchases", unit: "tonnes", emissionFactor: 2.9 },
      { id: "ferroalloys", name: "Ferroalloy Purchases", unit: "tonnes", emissionFactor: 3.8 },
      { id: "office_services", name: "Office Services & Supplies", unit: "thousand USD", emissionFactor: 0.56 }
    ]
  },
  {
    id: "capital_goods",
    name: "Capital Goods",
    description: "Emissions from production of capital goods",
    items: [
      { id: "mining_equipment", name: "Mining Equipment", unit: "thousand USD", emissionFactor: 0.98 },
      { id: "processing_equipment", name: "Processing Equipment", unit: "thousand USD", emissionFactor: 1.2 },
      { id: "it_infrastructure", name: "IT Infrastructure", unit: "thousand USD", emissionFactor: 0.45 },
      { id: "vehicles", name: "Vehicle Fleet Purchases", unit: "thousand USD", emissionFactor: 0.72 },
      { id: "building_construction", name: "Building Construction", unit: "thousand USD", emissionFactor: 0.37 }
    ]
  },
  {
    id: "fuel_energy",
    name: "Fuel & Energy Activities",
    description: "Upstream emissions of purchased fuels and energy",
    items: [
      { id: "wtt_diesel", name: "Well-to-Tank Diesel", unit: "thousand liters", emissionFactor: 620 },
      { id: "wtt_natural_gas", name: "Well-to-Tank Natural Gas", unit: "thousand m³", emissionFactor: 400 },
      { id: "t_and_d_losses_india", name: "Electricity T&D Losses (India)", unit: "MWh", emissionFactor: 75 },
      { id: "t_and_d_losses_indonesia", name: "Electricity T&D Losses (Indonesia)", unit: "MWh", emissionFactor: 70 },
      { id: "t_and_d_losses_mexico", name: "Electricity T&D Losses (Mexico)", unit: "MWh", emissionFactor: 42 },
      { id: "t_and_d_losses_southafrica", name: "Electricity T&D Losses (South Africa)", unit: "MWh", emissionFactor: 85 }
    ]
  },
  {
    id: "transportation_distribution",
    name: "Transportation & Distribution",
    description: "Emissions from transportation and distribution of purchased products",
    items: [
      { id: "sea_freight", name: "Sea Freight (Bulk Carriers)", unit: "tonne-km", emissionFactor: 0.008 },
      { id: "sea_freight_containers", name: "Sea Freight (Container Ships)", unit: "tonne-km", emissionFactor: 0.015 },
      { id: "truck_transport", name: "Truck Transport", unit: "tonne-km", emissionFactor: 0.11 },
      { id: "rail_transport", name: "Rail Transport", unit: "tonne-km", emissionFactor: 0.03 },
      { id: "inland_waterways", name: "Inland Waterway Transport", unit: "tonne-km", emissionFactor: 0.031 },
      { id: "port_operations", name: "Port Operations", unit: "thousand tonnes handled", emissionFactor: 2.54 },
      { id: "warehousing_logistics", name: "Warehousing & Logistics", unit: "thousand m² days", emissionFactor: 0.34 }
    ]
  },
  {
    id: "waste",
    name: "Waste Generated in Operations",
    description: "Emissions from waste disposal and treatment",
    items: [
      { id: "mining_waste_indonesia", name: "Mining Waste (Indonesia)", unit: "tonnes", emissionFactor: 32 },
      { id: "mining_waste_southafrica", name: "Mining Waste (South Africa)", unit: "tonnes", emissionFactor: 35 },
      { id: "processing_waste_india", name: "Processing Waste (India)", unit: "tonnes", emissionFactor: 45 },
      { id: "office_waste_landfill", name: "Office Waste to Landfill", unit: "tonnes", emissionFactor: 458 },
      { id: "office_waste_recycled", name: "Office Waste Recycled", unit: "tonnes", emissionFactor: 21 },
      { id: "hazardous_waste", name: "Hazardous Waste Treatment", unit: "tonnes", emissionFactor: 802 }
    ]
  },
  {
    id: "business_travel",
    name: "Business Travel",
    description: "Emissions from employee business travel",
    items: [
      { id: "short_haul_flights", name: "Short Haul Flights (<3700km)", unit: "thousand passenger-km", emissionFactor: 156 },
      { id: "long_haul_flights", name: "Long Haul Flights (>3700km)", unit: "thousand passenger-km", emissionFactor: 114 },
      { id: "hotel_stays", name: "Hotel Stays", unit: "nights", emissionFactor: 15.4 },
      { id: "rental_cars", name: "Rental Cars", unit: "thousand km", emissionFactor: 170 },
      { id: "taxis", name: "Taxis & Rideshares", unit: "thousand km", emissionFactor: 160 }
    ]
  },
  {
    id: "employee_commuting",
    name: "Employee Commuting",
    description: "Emissions from employees traveling to and from work",
    items: [
      { id: "car_commute", name: "Car Commuting", unit: "thousand km", emissionFactor: 170 },
      { id: "public_transport", name: "Public Transport", unit: "thousand passenger-km", emissionFactor: 40 },
      { id: "motorcycle_commute", name: "Motorcycle Commuting", unit: "thousand km", emissionFactor: 110 },
      { id: "remote_work", name: "Remote Working Energy Use", unit: "thousand days", emissionFactor: 2.1 }
    ]
  },
  {
    id: "leased_assets",
    name: "Upstream Leased Assets",
    description: "Emissions from operation of assets leased by the company",
    items: [
      { id: "leased_offices", name: "Leased Office Space", unit: "thousand m²", emissionFactor: 50 },
      { id: "leased_warehouses", name: "Leased Warehouses", unit: "thousand m²", emissionFactor: 32 },
      { id: "leased_vehicles", name: "Leased Vehicles", unit: "thousand km", emissionFactor: 170 },
      { id: "leased_equipment", name: "Leased Equipment", unit: "thousand operating hours", emissionFactor: 2.45 }
    ]
  },
  {
    id: "downstream_transport",
    name: "Downstream Transportation",
    description: "Emissions from transportation of sold products",
    items: [
      { id: "customer_sea_freight", name: "Customer Sea Freight", unit: "million tonne-km", emissionFactor: 8.0 },
      { id: "customer_rail", name: "Customer Rail Transport", unit: "million tonne-km", emissionFactor: 30.0 },
      { id: "customer_truck", name: "Customer Truck Transport", unit: "million tonne-km", emissionFactor: 110.0 }
    ]
  },
  {
    id: "processing_of_sold_products",
    name: "Processing of Sold Products",
    description: "Emissions from processing of intermediate products by customers",
    items: [
      { id: "steel_manufacturing", name: "Steel Manufacturing from Sold Ore", unit: "thousand tonnes", emissionFactor: 1800 },
      { id: "ferroalloy_processing", name: "Ferroalloy Processing", unit: "thousand tonnes", emissionFactor: 1200 },
      { id: "coal_power", name: "Coal Power Generation", unit: "thousand tonnes", emissionFactor: 2400 }
    ]
  },
  {
    id: "use_of_sold_products",
    name: "Use of Sold Products",
    description: "Emissions from use phase of sold products",
    items: [
      { id: "coal_combustion", name: "Coal Combustion", unit: "thousand tonnes", emissionFactor: 2300 },
      { id: "steel_product_use", name: "Steel Product Use", unit: "thousand tonnes", emissionFactor: 42 }
    ]
  },
  {
    id: "end_of_life",
    name: "End-of-Life Treatment",
    description: "Emissions from disposal and treatment of sold products",
    items: [
      { id: "steel_recycling", name: "Steel Recycling", unit: "thousand tonnes", emissionFactor: 70 },
      { id: "steel_landfill", name: "Steel to Landfill", unit: "thousand tonnes", emissionFactor: 19 }
    ]
  },
  {
    id: "franchises",
    name: "Franchises",
    description: "Emissions from operation of franchises",
    items: [
      { id: "trading_franchises", name: "Trading Franchises", unit: "locations", emissionFactor: 45000 }
    ]
  },
  {
    id: "investments",
    name: "Investments",
    description: "Emissions from operation of investments",
    items: [
      { id: "joint_ventures_mining", name: "Joint Ventures (Mining)", unit: "million USD invested", emissionFactor: 570 },
      { id: "equity_investments", name: "Equity Investments", unit: "million USD invested", emissionFactor: 120 },
      { id: "debt_investments", name: "Debt Investments", unit: "million USD invested", emissionFactor: 50 }
    ]
  }
];

// SCOPE 4: Avoided emissions through innovations
export const scope4Categories = [
  {
    id: "resource_efficiency",
    name: "Resource Efficiency",
    description: "Emissions avoided through resource efficiency innovations",
    items: [
      { id: "ore_beneficiation", name: "Ore Beneficiation", unit: "thousand tonnes processed", emissionFactor: 120 },
      { id: "improved_recovery", name: "Improved Recovery Rates", unit: "% improvement", emissionFactor: 8500 },
      { id: "water_recycling", name: "Water Recycling Systems", unit: "thousand m³ recycled", emissionFactor: 0.34 }
    ]
  },
  {
    id: "transport_efficiency",
    name: "Transport Efficiency",
    description: "Emissions avoided through transportation optimizations",
    items: [
      { id: "route_optimization", name: "Route Optimization", unit: "thousand km avoided", emissionFactor: 0.11 },
      { id: "load_optimization", name: "Load Optimization", unit: "thousand tonnes optimized", emissionFactor: 25 },
      { id: "modal_shift", name: "Modal Shift (Road to Rail)", unit: "thousand tonne-km", emissionFactor: 0.08 }
    ]
  },
  {
    id: "renewable_energy",
    name: "Renewable Energy",
    description: "Emissions avoided through renewable energy implementation",
    items: [
      { id: "solar_indonesia", name: "Solar PV (Indonesia)", unit: "MWh generated", emissionFactor: countryEmissionFactors.Indonesia * 1000 },
      { id: "solar_india", name: "Solar PV (India)", unit: "MWh generated", emissionFactor: countryEmissionFactors.India * 1000 },
      { id: "solar_southafrica", name: "Solar PV (South Africa)", unit: "MWh generated", emissionFactor: countryEmissionFactors.SouthAfrica * 1000 }
    ]
  },
  {
    id: "product_substitution",
    name: "Product Substitution",
    description: "Emissions avoided through low-carbon product alternatives",
    items: [
      { id: "low_carbon_steel", name: "Low Carbon Steel", unit: "thousand tonnes", emissionFactor: 680 },
      { id: "sustainable_metallurgical_inputs", name: "Sustainable Metallurgical Inputs", unit: "thousand tonnes", emissionFactor: 450 }
    ]
  }
];

// Sample monthly data for the current year with realistic seasonal patterns for mining operations
export const monthlyEmissionsData = [
  { name: 'Jan', scope1: 12850, scope2: 7450, scope3: 98540 },
  { name: 'Feb', scope1: 12450, scope2: 7380, scope3: 97650 },
  { name: 'Mar', scope1: 13120, scope2: 7520, scope3: 103450 },
  { name: 'Apr', scope1: 13540, scope2: 7680, scope3: 106780 },
  { name: 'May', scope1: 13950, scope2: 7780, scope3: 108940 },
  { name: 'Jun', scope1: 14250, scope2: 7850, scope3: 110250 },
  { name: 'Jul', scope1: 14850, scope2: 7920, scope3: 112680 },
  { name: 'Aug', scope1: 13950, scope2: 7850, scope3: 109540 },
  { name: 'Sep', scope1: 13250, scope2: 7450, scope3: 106320 },
  { name: 'Oct', scope1: 12850, scope2: 7280, scope3: 101540 },
  { name: 'Nov', scope1: 12380, scope2: 7180, scope3: 97840 },
  { name: 'Dec', scope1: 11340, scope2: 6980, scope3: 94120 }
];

// Data for employee assignments related to GHG data collection
export const mockEmployees = [
  {
    id: "emp-001",
    name: "Richard Miller",
    email: "richard.miller@imrresources.com",
    department: "Sustainability",
    location: "Zug, Switzerland"
  },
  {
    id: "emp-002",
    name: "Priya Sharma",
    email: "priya.sharma@imrresources.com",
    department: "Operations",
    location: "Mumbai, India"
  },
  {
    id: "emp-003",
    name: "Dian Kusuma",
    email: "dian.kusuma@imrresources.com",
    department: "Mining Operations",
    location: "Jakarta, Indonesia"
  },
  {
    id: "emp-004",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@imrresources.com",
    department: "Production",
    location: "Mexico City, Mexico"
  },
  {
    id: "emp-005",
    name: "Thabo Nkosi",
    email: "thabo.nkosi@imrresources.com",
    department: "Mining Operations",
    location: "Johannesburg, South Africa"
  },
  {
    id: "emp-006",
    name: "Ahmed Al-Farsi",
    email: "ahmed.alfarsi@imrresources.com",
    department: "Trading",
    location: "Dubai, UAE"
  },
  {
    id: "emp-007",
    name: "Sarah Williams",
    email: "sarah.williams@imrresources.com",
    department: "Finance",
    location: "London, UK"
  },
  {
    id: "emp-008",
    name: "Zhang Wei",
    email: "zhang.wei@imrresources.com",
    department: "Supply Chain",
    location: "Singapore"
  },
  {
    id: "emp-009",
    name: "Rajiv Kumar",
    email: "rajiv.kumar@imrresources.com",
    department: "Steel Manufacturing",
    location: "Mumbai, India"
  },
  {
    id: "emp-010",
    name: "Elena Petrova",
    email: "elena.petrova@imrresources.com",
    department: "Sustainability",
    location: "Zug, Switzerland"
  }
];

export const mockAssignments = [
  {
    id: "assign-001",
    employeeId: "emp-001",
    scope: "Scope 1",
    category: "Stationary Combustion",
    dueDate: "2025-05-20",
    status: "completed"
  },
  {
    id: "assign-002",
    employeeId: "emp-002",
    scope: "Scope 2",
    category: "Purchased Electricity",
    dueDate: "2025-05-25",
    status: "in-progress"
  },
  {
    id: "assign-003",
    employeeId: "emp-003",
    scope: "Scope 1",
    category: "Process Emissions",
    dueDate: "2025-05-15",
    status: "completed"
  },
  {
    id: "assign-004",
    employeeId: "emp-004",
    scope: "Scope 1",
    category: "Mobile Combustion",
    dueDate: "2025-05-22",
    status: "pending"
  },
  {
    id: "assign-005",
    employeeId: "emp-005",
    scope: "Scope 3",
    category: "Processing of Sold Products",
    dueDate: "2025-06-05",
    status: "in-progress"
  },
  {
    id: "assign-006",
    employeeId: "emp-006",
    scope: "Scope 3",
    category: "Transportation & Distribution",
    dueDate: "2025-05-30",
    status: "pending"
  },
  {
    id: "assign-007",
    employeeId: "emp-007",
    scope: "Scope 3",
    category: "Business Travel",
    dueDate: "2025-05-18",
    status: "completed"
  },
  {
    id: "assign-008",
    employeeId: "emp-008",
    scope: "Scope 3",
    category: "Purchased Goods & Services",
    dueDate: "2025-06-10",
    status: "pending"
  },
  {
    id: "assign-009",
    employeeId: "emp-009",
    scope: "Scope 1",
    category: "Process Emissions",
    dueDate: "2025-05-28",
    status: "in-progress"
  },
  {
    id: "assign-010",
    employeeId: "emp-010",
    scope: "Scope 4",
    category: "Renewable Energy",
    dueDate: "2025-06-15",
    status: "pending"
  }
];

// Location-based emissions data for IMR Resources global operations
export const emissionsByLocation = [
  {
    location: "Switzerland (HQ)",
    scope1: 1580,
    scope2: 520,
    scope3: 25480,
    total: 27580,
    intensity: 1.2, // tCO2e per employee
    employees: 42
  },
  {
    location: "India Operations",
    scope1: 38750,
    scope2: 32450,
    scope3: 285670,
    total: 356870,
    intensity: 4.7,
    employees: 76
  },
  {
    location: "Indonesia Mining",
    scope1: 45820,
    scope2: 18750,
    scope3: 342580,
    total: 407150,
    intensity: 3.4,
    employees: 120
  },
  {
    location: "Mexico Operations",
    scope1: 28450,
    scope2: 12580,
    scope3: 198450,
    total: 239480,
    intensity: 2.8,
    employees: 85
  },
  {
    location: "South Africa Mining",
    scope1: 39750,
    scope2: 22480,
    scope3: 310450,
    total: 372680,
    intensity: 2.4,
    employees: 156
  },
  {
    location: "UAE Trading",
    scope1: 980,
    scope2: 1250,
    scope3: 45780,
    total: 48010,
    intensity: 2.0,
    employees: 24
  },
  {
    location: "UK Trading",
    scope1: 1450,
    scope2: 1290,
    scope3: 39240,
    total: 41980,
    intensity: 2.2,
    employees: 19
  }
];

// Emissions by business activity
export const emissionsByActivity = [
  { activity: "Mining Operations", value: 685480, percentage: 45.9 },
  { activity: "Trading Activities", value: 89990, percentage: 6.0 },
  { activity: "Manufacturing", value: 356870, percentage: 23.9 },
  { activity: "Logistics & Transport", value: 271980, percentage: 18.2 },
  { activity: "Office Operations", value: 89430, percentage: 6.0 }
];

// Product carbon footprints
export const productCarbonFootprints = [
  { product: "Iron Ore", footprint: 0.038, unit: "tCO2e/tonne" },
  { product: "Manganese Ore", footprint: 0.29, unit: "tCO2e/tonne" },
  { product: "Chrome Ore", footprint: 0.18, unit: "tCO2e/tonne" },
  { product: "Metallurgical Coal", footprint: 0.12, unit: "tCO2e/tonne" },
  { product: "Gold", footprint: 28500, unit: "tCO2e/kg" },
  { product: "Steel Products", footprint: 1.8, unit: "tCO2e/tonne" }
];

