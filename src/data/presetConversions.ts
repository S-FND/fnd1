export interface PresetConversion {
  id: string;
  name: string;
  from_unit: string;
  to_unit: string;
  description: string;
  category: string;
}

export const PRESET_CONVERSIONS: PresetConversion[] = [
  // Fuel - Diesel
  {
    id: 'diesel-l-gal',
    name: 'Diesel: Liters to Gallons',
    from_unit: 'L',
    to_unit: 'gal',
    description: 'Common diesel fuel volume conversion',
    category: 'Fuel - Diesel',
  },
  {
    id: 'diesel-kg-tonnes',
    name: 'Diesel: Kilograms to Tonnes',
    from_unit: 'kg',
    to_unit: 'tonnes',
    description: 'Diesel fuel mass conversion',
    category: 'Fuel - Diesel',
  },
  // Fuel - Gasoline
  {
    id: 'gasoline-l-gal',
    name: 'Gasoline: Liters to Gallons',
    from_unit: 'L',
    to_unit: 'gal',
    description: 'Common gasoline volume conversion',
    category: 'Fuel - Gasoline',
  },
  {
    id: 'gasoline-kg-tonnes',
    name: 'Gasoline: Kilograms to Tonnes',
    from_unit: 'kg',
    to_unit: 'tonnes',
    description: 'Gasoline mass conversion',
    category: 'Fuel - Gasoline',
  },
  // Natural Gas
  {
    id: 'natgas-m3-therms',
    name: 'Natural Gas: Cubic Meters to Therms',
    from_unit: 'm³',
    to_unit: 'therms',
    description: 'Natural gas volume to energy conversion',
    category: 'Natural Gas',
  },
  {
    id: 'natgas-kwh-gj',
    name: 'Natural Gas: kWh to GJ',
    from_unit: 'kWh',
    to_unit: 'GJ',
    description: 'Natural gas energy conversion',
    category: 'Natural Gas',
  },
  {
    id: 'natgas-m3-ft3',
    name: 'Natural Gas: Cubic Meters to Cubic Feet',
    from_unit: 'm³',
    to_unit: 'ft³',
    description: 'Natural gas volume conversion',
    category: 'Natural Gas',
  },
  // Electricity
  {
    id: 'electricity-kwh-mwh',
    name: 'Electricity: kWh to MWh',
    from_unit: 'kWh',
    to_unit: 'MWh',
    description: 'Common electricity consumption conversion',
    category: 'Electricity',
  },
  {
    id: 'electricity-mwh-gj',
    name: 'Electricity: MWh to GJ',
    from_unit: 'MWh',
    to_unit: 'GJ',
    description: 'Electricity to thermal energy conversion',
    category: 'Electricity',
  },
  {
    id: 'electricity-kwh-gj',
    name: 'Electricity: kWh to GJ',
    from_unit: 'kWh',
    to_unit: 'GJ',
    description: 'Electricity energy conversion',
    category: 'Electricity',
  },
  // Coal
  {
    id: 'coal-kg-tonnes',
    name: 'Coal: Kilograms to Tonnes',
    from_unit: 'kg',
    to_unit: 'tonnes',
    description: 'Coal mass conversion',
    category: 'Coal',
  },
  {
    id: 'coal-lb-tonnes',
    name: 'Coal: Pounds to Tonnes',
    from_unit: 'lb',
    to_unit: 'tonnes',
    description: 'Coal mass conversion (imperial)',
    category: 'Coal',
  },
  // LPG
  {
    id: 'lpg-kg-l',
    name: 'LPG: Kilograms to Liters',
    from_unit: 'kg',
    to_unit: 'L',
    description: 'LPG mass to volume conversion',
    category: 'LPG',
  },
  {
    id: 'lpg-kg-tonnes',
    name: 'LPG: Kilograms to Tonnes',
    from_unit: 'kg',
    to_unit: 'tonnes',
    description: 'LPG mass conversion',
    category: 'LPG',
  },
  // Emissions
  {
    id: 'emissions-kg-tonnes',
    name: 'Emissions: kg CO₂e to tonnes CO₂e',
    from_unit: 'kg CO₂e',
    to_unit: 'tonnes CO₂e',
    description: 'Standard emissions reporting conversion',
    category: 'Emissions',
  },
  {
    id: 'emissions-g-kg',
    name: 'Emissions: g CO₂e to kg CO₂e',
    from_unit: 'g CO₂e',
    to_unit: 'kg CO₂e',
    description: 'Small emissions to standard unit',
    category: 'Emissions',
  },
];