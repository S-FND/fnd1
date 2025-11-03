export type AvoidedEmissionSourceType = 
  | "Product Use"
  | "Product Manufacturing"
  | "Product End-of-Life"
  | "Transportation"
  | "Energy Generation"
  | "Other";

export type MethodologyUsed =
  | "Comparative LCA"
  | "Baseline and Credit"
  | "Project-Based"
  | "Activity-Based"
  | "Other";

export type DataQuality = "High" | "Medium" | "Low";

export type VerificationStatus = "Verified" | "Pending" | "Not Verified";

export interface Scope4Entry {
  id: string;
  facilityName: string;
  businessUnit: string;
  reportingPeriod: string;
  sourceType: AvoidedEmissionSourceType;
  emissionDescription: string;
  baselineScenario: string;
  functionalUnit: string;
  referenceStandard: string;
  productOutput: number;
  activityDataUnit: string;
  baselineEmissionFactor: number;
  projectEmissionFactor: number;
  avoidedEmissionPerUnit: number;
  totalAvoidedEmission: number;
  methodology: MethodologyUsed;
  emissionFactorSource: string;
  dataSource: string;
  dataQuality: DataQuality;
  verifiedBy: string;
  verificationStatus: VerificationStatus;
  dataEntryDate: string;
  enteredBy: string;
  notes: string;
}

export const defaultEmissionFactorSource = "Ecoinvent 3.9 / IPCC 2024";

export const getCurrentFY = (): string => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 0-indexed
  
  if (currentMonth >= 4) {
    return `FY ${currentYear}–${(currentYear + 1).toString().slice(-2)}`;
  } else {
    return `FY ${currentYear - 1}–${currentYear.toString().slice(-2)}`;
  }
};

export const calculateAvoidedEmissionPerUnit = (
  baseline: number,
  project: number
): number => {
  return baseline - project;
};

export const calculateTotalAvoidedEmission = (
  output: number,
  avoidedPerUnit: number
): number => {
  return (output * avoidedPerUnit) / 1000; // Convert kg to tonnes
};

export const sampleScope4Data: Scope4Entry[] = [
  {
    id: "1",
    facilityName: "R&D Center, Pune",
    businessUnit: "Sustainable Products Division",
    reportingPeriod: getCurrentFY(),
    sourceType: "Product Use",
    emissionDescription: "Energy-efficient refrigerators replacing standard models",
    baselineScenario: "Conventional refrigerator (250 kWh/year)",
    functionalUnit: "1 unit",
    referenceStandard: "LCA Report 2024",
    productOutput: 10000,
    activityDataUnit: "units",
    baselineEmissionFactor: 250,
    projectEmissionFactor: 150,
    avoidedEmissionPerUnit: 100,
    totalAvoidedEmission: 1000,
    methodology: "Comparative LCA",
    emissionFactorSource: "Ecoinvent 3.9",
    dataSource: "Internal test data",
    dataQuality: "High",
    verifiedBy: "Sustainability Team",
    verificationStatus: "Verified",
    dataEntryDate: "2025-04-30",
    enteredBy: "Meera Sharma",
    notes: "Calculated based on 10-year product lifetime"
  },
  {
    id: "2",
    facilityName: "Manufacturing Plant, Chennai",
    businessUnit: "Clean Energy Division",
    reportingPeriod: getCurrentFY(),
    sourceType: "Energy Generation",
    emissionDescription: "Solar panels supplied to customers",
    baselineScenario: "Grid electricity (coal-based)",
    functionalUnit: "1 kWh",
    referenceStandard: "ISO 14040:2006",
    productOutput: 5000000,
    activityDataUnit: "kWh",
    baselineEmissionFactor: 0.82,
    projectEmissionFactor: 0.02,
    avoidedEmissionPerUnit: 0.80,
    totalAvoidedEmission: 4000,
    methodology: "Project-Based",
    emissionFactorSource: "CEA India 2023",
    dataSource: "Customer installation data",
    dataQuality: "High",
    verifiedBy: "External Auditor",
    verificationStatus: "Verified",
    dataEntryDate: "2025-04-30",
    enteredBy: "Rajesh Kumar",
    notes: "Based on 25-year panel lifetime"
  },
  {
    id: "3",
    facilityName: "Distribution Center, Delhi",
    businessUnit: "Logistics Optimization",
    reportingPeriod: getCurrentFY(),
    sourceType: "Transportation",
    emissionDescription: "Route optimization software for customers",
    baselineScenario: "Traditional routing (15 km/delivery)",
    functionalUnit: "1 delivery",
    referenceStandard: "GHG Protocol 2024",
    productOutput: 50000,
    activityDataUnit: "deliveries",
    baselineEmissionFactor: 2.5,
    projectEmissionFactor: 1.8,
    avoidedEmissionPerUnit: 0.7,
    totalAvoidedEmission: 35,
    methodology: "Activity-Based",
    emissionFactorSource: "DEFRA 2024",
    dataSource: "Customer fleet data",
    dataQuality: "Medium",
    verifiedBy: "Internal Sustainability Team",
    verificationStatus: "Verified",
    dataEntryDate: "2025-04-30",
    enteredBy: "Priya Singh",
    notes: "Based on customer-reported savings"
  }
];
