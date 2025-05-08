
export const emissionsByScope = [
  {
    scope: "Scope 1 (Direct)",
    value: 28750,
    color: "bg-blue-500",
    completeness: 85,
    statusColor: "bg-green-500"
  },
  {
    scope: "Scope 2 (Indirect)",
    value: 15280,
    color: "bg-green-500",
    completeness: 92,
    statusColor: "bg-green-500"
  },
  {
    scope: "Scope 3 (Value Chain)",
    value: 89450,
    color: "bg-amber-500",
    completeness: 65,
    statusColor: "bg-amber-500"
  },
  {
    scope: "Scope 4 (Avoided)",
    value: 8970,
    color: "bg-purple-500",
    completeness: 40,
    statusColor: "bg-red-500"
  }
];

export const emissionsTrend = [
  { year: 2019, value: 128750 },
  { year: 2020, value: 112120 },
  { year: 2021, value: 119800 },
  { year: 2022, value: 125950 },
  { year: 2023, value: 133480 }
];

// SCOPE 1: Direct emissions specific to logistics operations
export const scope1Categories = [
  {
    id: "owned_fleet",
    name: "Owned Fleet",
    description: "Direct emissions from company-owned transport vehicles",
    items: [
      { id: "trucks_diesel", name: "Trucks (Diesel)", unit: "liters", emissionFactor: 2.68 },
      { id: "trucks_cng", name: "Trucks (CNG)", unit: "kg", emissionFactor: 2.54 },
      { id: "forklifts_diesel", name: "Forklifts (Diesel)", unit: "liters", emissionFactor: 2.68 },
      { id: "forklifts_electric", name: "Forklifts (Electric)", unit: "kWh", emissionFactor: 0.82 },
      { id: "company_cars", name: "Company Cars", unit: "liters", emissionFactor: 2.31 }
    ]
  },
  {
    id: "stationary_combustion",
    name: "Stationary Combustion",
    description: "Emissions from stationary sources at logistics facilities",
    items: [
      { id: "diesel_generators", name: "Diesel Generators", unit: "liters", emissionFactor: 2.68 },
      { id: "natural_gas_heating", name: "Natural Gas Heating", unit: "m³", emissionFactor: 2.02 },
      { id: "lpg_equipment", name: "LPG for Equipment", unit: "kg", emissionFactor: 2.94 }
    ]
  },
  {
    id: "cargo_handling",
    name: "Cargo Handling Equipment",
    description: "Emissions from equipment used in CFS/ICD operations",
    items: [
      { id: "reach_stackers", name: "Reach Stackers", unit: "liters", emissionFactor: 2.68 },
      { id: "gantry_cranes", name: "Gantry Cranes", unit: "kWh", emissionFactor: 0.82 },
      { id: "terminal_tractors", name: "Terminal Tractors", unit: "liters", emissionFactor: 2.68 }
    ]
  },
  {
    id: "refrigerants",
    name: "Refrigerants",
    description: "Emissions from refrigerant leakage in cold chain logistics",
    items: [
      { id: "r410a", name: "R-410A", unit: "kg", emissionFactor: 2088 },
      { id: "r404a", name: "R-404A", unit: "kg", emissionFactor: 3922 },
      { id: "r134a", name: "R-134A", unit: "kg", emissionFactor: 1430 }
    ]
  }
];

// SCOPE 2: Indirect emissions from purchased energy
export const scope2Categories = [
  {
    id: "electricity",
    name: "Purchased Electricity",
    description: "Emissions from electricity used at logistics facilities",
    items: [
      { id: "warehouse_electricity", name: "Warehouses", unit: "kWh", emissionFactor: 0.82 },
      { id: "cfs_icd_electricity", name: "CFS/ICD Facilities", unit: "kWh", emissionFactor: 0.82 },
      { id: "office_electricity", name: "Office Buildings", unit: "kWh", emissionFactor: 0.82 },
      { id: "ev_charging", name: "EV Charging Stations", unit: "kWh", emissionFactor: 0.82 }
    ]
  },
  {
    id: "purchased_heat_cooling",
    name: "Purchased Heat & Cooling",
    description: "Emissions from purchased heating and cooling",
    items: [
      { id: "district_cooling", name: "District Cooling", unit: "MWh", emissionFactor: 100 },
      { id: "purchased_steam", name: "Purchased Steam", unit: "MWh", emissionFactor: 180 }
    ]
  },
  {
    id: "renewable_energy",
    name: "Renewable Energy",
    description: "Renewable energy purchased for operations",
    items: [
      { id: "solar_ppa", name: "Solar PPA", unit: "kWh", emissionFactor: 0 },
      { id: "renewable_certificates", name: "RECs", unit: "kWh", emissionFactor: 0 }
    ]
  }
];

// SCOPE 3: Value chain emissions for logistics operations
export const scope3Categories = [
  {
    id: "purchased_services",
    name: "Purchased Transport Services",
    description: "Emissions from third-party transportation services",
    items: [
      { id: "road_freight", name: "Road Freight (3PL)", unit: "tonne-km", emissionFactor: 0.11 },
      { id: "rail_freight", name: "Rail Freight", unit: "tonne-km", emissionFactor: 0.03 },
      { id: "sea_freight", name: "Sea Freight", unit: "tonne-km", emissionFactor: 0.015 },
      { id: "air_freight", name: "Air Freight", unit: "tonne-km", emissionFactor: 1.53 }
    ]
  },
  {
    id: "fuel_energy",
    name: "Fuel & Energy Activities",
    description: "Upstream emissions of purchased fuels and energy",
    items: [
      { id: "diesel_wtt", name: "Diesel (Well-to-Tank)", unit: "liters", emissionFactor: 0.62 },
      { id: "petrol_wtt", name: "Petrol (Well-to-Tank)", unit: "liters", emissionFactor: 0.56 },
      { id: "electricity_t&d", name: "Electricity T&D Losses", unit: "kWh", emissionFactor: 0.07 }
    ]
  },
  {
    id: "capital_equipment",
    name: "Capital Equipment",
    description: "Emissions from manufacturing of purchased capital goods",
    items: [
      { id: "trucks", name: "Trucks & Trailers", unit: "units", emissionFactor: 50000 },
      { id: "warehouse_equipment", name: "Warehouse Equipment", unit: "units", emissionFactor: 10000 },
      { id: "it_infrastructure", name: "IT Infrastructure", unit: "spend (INR lakhs)", emissionFactor: 32.5 }
    ]
  },
  {
    id: "packaging",
    name: "Packaging Materials",
    description: "Emissions from production of packaging materials",
    items: [
      { id: "cardboard", name: "Cardboard", unit: "tonnes", emissionFactor: 1040 },
      { id: "plastic_wrap", name: "Plastic Wrap", unit: "tonnes", emissionFactor: 2060 },
      { id: "pallets", name: "Wooden Pallets", unit: "units", emissionFactor: 5.26 }
    ]
  },
  {
    id: "waste_operations",
    name: "Waste From Operations",
    description: "Emissions from waste generated at logistics facilities",
    items: [
      { id: "landfill_waste", name: "Landfill Waste", unit: "tonnes", emissionFactor: 458 },
      { id: "recycled_waste", name: "Recycled Waste", unit: "tonnes", emissionFactor: 21 },
      { id: "hazardous_waste", name: "Hazardous Waste", unit: "tonnes", emissionFactor: 802 }
    ]
  },
  {
    id: "business_travel",
    name: "Business Travel",
    description: "Emissions from employee business travel",
    items: [
      { id: "air_travel_domestic", name: "Air Travel (Domestic)", unit: "passenger-km", emissionFactor: 0.16 },
      { id: "air_travel_international", name: "Air Travel (International)", unit: "passenger-km", emissionFactor: 0.22 },
      { id: "hotel_stays", name: "Hotel Stays", unit: "nights", emissionFactor: 15.4 },
      { id: "taxi_services", name: "Taxi Services", unit: "km", emissionFactor: 0.17 }
    ]
  },
  {
    id: "employee_commuting",
    name: "Employee Commuting",
    description: "Emissions from employees traveling to and from work",
    items: [
      { id: "car_commute", name: "Car Commute", unit: "passenger-km", emissionFactor: 0.17 },
      { id: "two_wheeler", name: "Two Wheeler Commute", unit: "passenger-km", emissionFactor: 0.09 },
      { id: "public_transport", name: "Public Transport", unit: "passenger-km", emissionFactor: 0.04 },
      { id: "company_shuttles", name: "Company Shuttles", unit: "passenger-km", emissionFactor: 0.03 }
    ]
  },
  {
    id: "leased_assets",
    name: "Leased Assets",
    description: "Emissions from leased vehicles, warehouses, and equipment",
    items: [
      { id: "leased_warehouses", name: "Leased Warehouses", unit: "sq.m", emissionFactor: 0.05 },
      { id: "leased_vehicles", name: "Leased Vehicles", unit: "vehicle-km", emissionFactor: 0.17 },
      { id: "leased_equipment", name: "Leased Equipment", unit: "operating hours", emissionFactor: 2.45 }
    ]
  }
];

// SCOPE 4: Avoided emissions through innovations in logistics
export const scope4Categories = [
  {
    id: "route_optimization",
    name: "Route Optimization",
    description: "Emissions avoided through efficient routing and load consolidation",
    items: [
      { id: "optimized_routes", name: "Optimized Routes", unit: "km avoided", emissionFactor: 0.11 },
      { id: "load_consolidation", name: "Load Consolidation", unit: "trips avoided", emissionFactor: 85 },
      { id: "backhaul_utilization", name: "Backhaul Utilization", unit: "km avoided", emissionFactor: 0.11 }
    ]
  },
  {
    id: "modal_shift",
    name: "Modal Shift",
    description: "Emissions avoided by shifting from road to rail/water transport",
    items: [
      { id: "road_to_rail", name: "Road to Rail Shift", unit: "tonne-km", emissionFactor: 0.08 },
      { id: "road_to_water", name: "Road to Waterways Shift", unit: "tonne-km", emissionFactor: 0.095 }
    ]
  },
  {
    id: "warehouse_efficiency",
    name: "Warehouse Efficiency",
    description: "Emissions avoided through warehouse energy efficiency",
    items: [
      { id: "led_lighting", name: "LED Lighting Conversion", unit: "kWh saved", emissionFactor: 0.82 },
      { id: "solar_installation", name: "Solar Installation", unit: "kWh generated", emissionFactor: 0.82 },
      { id: "energy_management", name: "Energy Management System", unit: "kWh saved", emissionFactor: 0.82 }
    ]
  },
  {
    id: "packaging_reduction",
    name: "Packaging Reduction",
    description: "Emissions avoided through sustainable packaging solutions",
    items: [
      { id: "reusable_packaging", name: "Reusable Packaging", unit: "tonnes of single-use avoided", emissionFactor: 2060 },
      { id: "packaging_redesign", name: "Packaging Redesign", unit: "volume reduced (%)", emissionFactor: 10.5 }
    ]
  },
  {
    id: "digital_solutions",
    name: "Digital Solutions",
    description: "Emissions avoided through paperless operations",
    items: [
      { id: "e_documentation", name: "E-Documentation", unit: "paper sheets avoided", emissionFactor: 0.006 },
      { id: "blockchain_tracking", name: "Blockchain Tracking", unit: "manual processes avoided", emissionFactor: 5.2 }
    ]
  }
];

export const mockEmployees = [
  {
    id: "emp-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@translogindia.com",
    department: "Operations",
    location: "Mumbai CFS"
  },
  {
    id: "emp-002",
    name: "Priya Singh",
    email: "priya.singh@translogindia.com",
    department: "Supply Chain",
    location: "Delhi ICD"
  },
  {
    id: "emp-003",
    name: "Aditya Patel",
    email: "aditya.patel@translogindia.com",
    department: "Facilities",
    location: "Mumbai CFS"
  },
  {
    id: "emp-004",
    name: "Shreya Gupta",
    email: "shreya.gupta@translogindia.com",
    department: "Procurement",
    location: "Bangalore Logistics Park"
  },
  {
    id: "emp-005",
    name: "Vikram Desai",
    email: "vikram.desai@translogindia.com",
    department: "Logistics",
    location: "Chennai Port Facility"
  },
  {
    id: "emp-006",
    name: "Deepak Nair",
    email: "deepak.nair@translogindia.com",
    department: "3PL Services",
    location: "Hyderabad Hub"
  },
  {
    id: "emp-007",
    name: "Anjali Mehta",
    email: "anjali.mehta@translogindia.com",
    department: "Project Logistics",
    location: "Mumbai HQ"
  }
];

export const mockAssignments = [
  {
    id: "assign-001",
    employeeId: "emp-001",
    scope: "Scope 1",
    category: "Owned Fleet",
    dueDate: "2025-06-15",
    status: "completed"
  },
  {
    id: "assign-002",
    employeeId: "emp-002",
    scope: "Scope 3",
    category: "Purchased Transport Services",
    dueDate: "2025-06-20",
    status: "pending"
  },
  {
    id: "assign-003",
    employeeId: "emp-003",
    scope: "Scope 2",
    category: "Purchased Electricity",
    dueDate: "2025-06-10",
    status: "in-progress"
  },
  {
    id: "assign-004",
    employeeId: "emp-004",
    scope: "Scope 3",
    category: "Packaging Materials",
    dueDate: "2025-06-25",
    status: "pending"
  },
  {
    id: "assign-005",
    employeeId: "emp-005",
    scope: "Scope 1",
    category: "Cargo Handling Equipment",
    dueDate: "2025-06-18",
    status: "in-progress"
  },
  {
    id: "assign-006",
    employeeId: "emp-006",
    scope: "Scope 3",
    category: "Leased Assets",
    dueDate: "2025-06-22",
    status: "pending"
  },
  {
    id: "assign-007",
    employeeId: "emp-007",
    scope: "Scope 4",
    category: "Route Optimization",
    dueDate: "2025-06-30",
    status: "in-progress"
  }
];
