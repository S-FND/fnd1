
export interface EmissionLocation {
  name: string;
  scope1: number;
  scope2: number;
  scope3: number;
}

export interface YearlyEmission {
  year: number;
  emissions: number;
}

export const emissionsByLocation: EmissionLocation[] = [
  { name: "Mumbai HQ", scope1: 1200, scope2: 3400, scope3: 5800 },
  { name: "Delhi Branch", scope1: 800, scope2: 2200, scope3: 3600 },
  { name: "Bangalore Tech", scope1: 300, scope2: 1800, scope3: 2400 },
  { name: "Chennai Ops", scope1: 500, scope2: 1400, scope3: 1900 },
];

export const emissionsYearly: YearlyEmission[] = [
  { year: 2018, emissions: 14800 },
  { year: 2019, emissions: 15600 },
  { year: 2020, emissions: 12400 },
  { year: 2021, emissions: 13200 },
  { year: 2022, emissions: 12800 },
  { year: 2023, emissions: 11200 },
];
