
export const emissionsByScope = [
  {
    scope: "Scope 1 (Direct)",
    value: 1250,
    color: "bg-blue-500",
    completeness: 85,
    statusColor: "bg-green-500"
  },
  {
    scope: "Scope 2 (Indirect)",
    value: 2780,
    color: "bg-green-500",
    completeness: 92,
    statusColor: "bg-green-500"
  },
  {
    scope: "Scope 3 (Value Chain)",
    value: 5450,
    color: "bg-amber-500",
    completeness: 65,
    statusColor: "bg-amber-500"
  },
  {
    scope: "Scope 4 (Avoided)",
    value: 870,
    color: "bg-purple-500",
    completeness: 40,
    statusColor: "bg-red-500"
  }
];

export const emissionsTrend = [
  { year: 2019, value: 8750 },
  { year: 2020, value: 9120 },
  { year: 2021, value: 9800 },
  { year: 2022, value: 8950 },
  { year: 2023, value: 8200 }
];

export const scope1Categories = [
  {
    id: "fuel_combustion",
    name: "Fuel Combustion",
    description: "Direct emissions from stationary combustion sources",
    items: [
      { id: "natural_gas", name: "Natural Gas", unit: "m³", emissionFactor: 2.02 },
      { id: "diesel", name: "Diesel", unit: "liters", emissionFactor: 2.68 },
      { id: "petrol", name: "Petrol", unit: "liters", emissionFactor: 2.31 },
      { id: "lpg", name: "LPG", unit: "kg", emissionFactor: 2.94 }
    ]
  },
  {
    id: "company_vehicles",
    name: "Company-Owned Vehicles",
    description: "Emissions from company fleet operations",
    items: [
      { id: "petrol_vehicles", name: "Petrol Vehicles", unit: "km", emissionFactor: 0.19 },
      { id: "diesel_vehicles", name: "Diesel Vehicles", unit: "km", emissionFactor: 0.17 },
      { id: "electric_vehicles", name: "Electric Vehicles", unit: "km", emissionFactor: 0.05 }
    ]
  },
  {
    id: "onsite_equipment",
    name: "On-site Equipment",
    description: "Emissions from machinery and equipment",
    items: [
      { id: "generators", name: "Generators", unit: "hours", emissionFactor: 10.2 },
      { id: "forklifts", name: "Forklifts", unit: "hours", emissionFactor: 4.8 }
    ]
  },
  {
    id: "refrigerants",
    name: "Refrigerants",
    description: "Emissions from refrigerant leakage",
    items: [
      { id: "r410a", name: "R-410A", unit: "kg", emissionFactor: 2088 },
      { id: "r134a", name: "R-134A", unit: "kg", emissionFactor: 1430 },
      { id: "r32", name: "R-32", unit: "kg", emissionFactor: 675 }
    ]
  }
];

export const scope2Categories = [
  {
    id: "electricity",
    name: "Purchased Electricity",
    description: "Indirect emissions from purchased electricity",
    items: [
      { id: "grid_electricity", name: "Grid Electricity", unit: "kWh", emissionFactor: 0.42 },
      { id: "renewable_energy", name: "Renewable Energy", unit: "kWh", emissionFactor: 0 }
    ]
  },
  {
    id: "heating",
    name: "Purchased Heating",
    description: "Indirect emissions from purchased heating",
    items: [
      { id: "district_heating", name: "District Heating", unit: "MWh", emissionFactor: 180 }
    ]
  },
  {
    id: "cooling",
    name: "Purchased Cooling",
    description: "Indirect emissions from purchased cooling",
    items: [
      { id: "district_cooling", name: "District Cooling", unit: "MWh", emissionFactor: 100 }
    ]
  }
];

export const scope3Categories = [
  {
    id: "purchased_goods",
    name: "Purchased Goods & Services",
    description: "Emissions from production of purchased goods",
    items: [
      { id: "raw_materials", name: "Raw Materials", unit: "tonnes", emissionFactor: 2.5 },
      { id: "packaging", name: "Packaging", unit: "tonnes", emissionFactor: 3.2 },
      { id: "office_supplies", name: "Office Supplies", unit: "spend (USD)", emissionFactor: 0.45 }
    ]
  },
  {
    id: "capital_goods",
    name: "Capital Goods",
    description: "Emissions from production of capital goods",
    items: [
      { id: "machinery", name: "Machinery", unit: "spend (USD)", emissionFactor: 0.65 },
      { id: "buildings", name: "Buildings", unit: "spend (USD)", emissionFactor: 0.38 },
      { id: "it_equipment", name: "IT Equipment", unit: "spend (USD)", emissionFactor: 0.42 }
    ]
  },
  {
    id: "transportation",
    name: "Transportation & Distribution",
    description: "Upstream and downstream transportation",
    items: [
      { id: "upstream_road", name: "Upstream Road Freight", unit: "tonne-km", emissionFactor: 0.11 },
      { id: "upstream_air", name: "Upstream Air Freight", unit: "tonne-km", emissionFactor: 1.53 },
      { id: "downstream_transport", name: "Downstream Transportation", unit: "tonne-km", emissionFactor: 0.09 }
    ]
  },
  {
    id: "waste",
    name: "Waste Generated",
    description: "Emissions from waste disposal and treatment",
    items: [
      { id: "landfill", name: "Landfill Waste", unit: "tonnes", emissionFactor: 458 },
      { id: "recycling", name: "Recycling", unit: "tonnes", emissionFactor: 21 },
      { id: "incineration", name: "Incineration", unit: "tonnes", emissionFactor: 102 }
    ]
  },
  {
    id: "business_travel",
    name: "Business Travel",
    description: "Emissions from employee business trips",
    items: [
      { id: "flights", name: "Flights", unit: "passenger-km", emissionFactor: 0.18 },
      { id: "hotel_stays", name: "Hotel Stays", unit: "nights", emissionFactor: 15.4 },
      { id: "rental_cars", name: "Rental Cars", unit: "km", emissionFactor: 0.17 }
    ]
  },
  {
    id: "employee_commuting",
    name: "Employee Commuting",
    description: "Emissions from employee travel to work",
    items: [
      { id: "car_commute", name: "Car Commute", unit: "passenger-km", emissionFactor: 0.17 },
      { id: "public_transport", name: "Public Transport", unit: "passenger-km", emissionFactor: 0.04 },
      { id: "remote_working", name: "Remote Working", unit: "days", emissionFactor: 2.1 }
    ]
  },
  {
    id: "use_of_products",
    name: "Use of Sold Products",
    description: "Emissions from product use by customers",
    items: [
      { id: "energy_consuming", name: "Energy-Consuming Products", unit: "units", emissionFactor: 125 },
      { id: "fuel_consuming", name: "Fuel-Consuming Products", unit: "units", emissionFactor: 750 }
    ]
  },
  {
    id: "end_of_life",
    name: "End-of-Life Treatment",
    description: "Emissions from product disposal",
    items: [
      { id: "product_disposal", name: "Product Disposal", unit: "tonnes", emissionFactor: 380 },
      { id: "packaging_disposal", name: "Packaging Disposal", unit: "tonnes", emissionFactor: 40 }
    ]
  }
];

export const scope4Categories = [
  {
    id: "renewable_energy_products",
    name: "Renewable Energy Products",
    description: "Emissions avoided through renewable energy products",
    items: [
      { id: "solar_panels", name: "Solar Panels", unit: "kWh generated", emissionFactor: 0.42 },
      { id: "wind_turbines", name: "Wind Turbines", unit: "kWh generated", emissionFactor: 0.42 }
    ]
  },
  {
    id: "circular_economy",
    name: "Circular Economy Initiatives",
    description: "Emissions avoided through circular economy",
    items: [
      { id: "recycled_materials", name: "Recycled Materials", unit: "tonnes", emissionFactor: 2.1 },
      { id: "refurbished_products", name: "Refurbished Products", unit: "units", emissionFactor: 78 }
    ]
  },
  {
    id: "efficiency_innovations",
    name: "Efficiency Innovations",
    description: "Emissions avoided through efficiency improvements",
    items: [
      { id: "energy_efficient", name: "Energy Efficient Products", unit: "units", emissionFactor: 85 },
      { id: "process_optimization", name: "Process Optimization", unit: "instances", emissionFactor: 125 }
    ]
  },
  {
    id: "substitution",
    name: "Product Substitution",
    description: "Emissions avoided through alternative products",
    items: [
      { id: "low_carbon_alt", name: "Low-Carbon Alternatives", unit: "units", emissionFactor: 120 },
      { id: "digital_services", name: "Digital Services", unit: "instances", emissionFactor: 30 }
    ]
  }
];

export const mockEmployees = [
  {
    id: "emp-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@company.com",
    department: "Operations",
    location: "Mumbai HQ"
  },
  {
    id: "emp-002",
    name: "Priya Singh",
    email: "priya.singh@company.com",
    department: "Supply Chain",
    location: "Delhi Branch"
  },
  {
    id: "emp-003",
    name: "Aditya Patel",
    email: "aditya.patel@company.com",
    department: "Facilities",
    location: "Mumbai HQ"
  },
  {
    id: "emp-004",
    name: "Shreya Gupta",
    email: "shreya.gupta@company.com",
    department: "Procurement",
    location: "Bangalore Tech"
  },
  {
    id: "emp-005",
    name: "Vikram Desai",
    email: "vikram.desai@company.com",
    department: "Logistics",
    location: "Chennai Ops"
  }
];

export const mockAssignments = [
  {
    id: "assign-001",
    employeeId: "emp-001",
    scope: "Scope 1",
    category: "Fuel Combustion",
    dueDate: "2023-06-15",
    status: "completed"
  },
  {
    id: "assign-002",
    employeeId: "emp-002",
    scope: "Scope 3",
    category: "Transportation & Distribution",
    dueDate: "2023-06-20",
    status: "pending"
  },
  {
    id: "assign-003",
    employeeId: "emp-003",
    scope: "Scope 2",
    category: "Purchased Electricity",
    dueDate: "2023-06-10",
    status: "in-progress"
  },
  {
    id: "assign-004",
    employeeId: "emp-004",
    scope: "Scope 3",
    category: "Purchased Goods & Services",
    dueDate: "2023-06-25",
    status: "pending"
  }
];
