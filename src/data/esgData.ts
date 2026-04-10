export const SASB_INDUSTRIES = [
  // Technology & Communications
  { id: "tech_sw", name: "Software & IT Services", sasbCode: "TC-SI" },
  { id: "tech_hardware", name: "Hardware", sasbCode: "TC-HW" },
  { id: "tech_telecom", name: "Telecommunication Services", sasbCode: "TC-TL" },
  { id: "tech_internet", name: "Internet Media & Services", sasbCode: "TC-IM" },
  { id: "tech_semiconductor", name: "Semiconductors", sasbCode: "TC-SC" },
  
  // Financials
  { id: "finance_bank", name: "Commercial Banks", sasbCode: "FN-CB" },
  { id: "finance_insurance", name: "Insurance", sasbCode: "FN-IN" },
  { id: "finance_investment", name: "Investment Banking & Brokerage", sasbCode: "FN-IB" },
  { id: "finance_asset", name: "Asset Management & Custody", sasbCode: "FN-AC" },
  { id: "finance_mortgage", name: "Mortgage Finance", sasbCode: "FN-MF" },
  
  // Health Care
  { id: "healthcare_delivery", name: "Health Care Delivery", sasbCode: "HC-DY" },
  { id: "healthcare_distributors", name: "Health Care Distributors", sasbCode: "HC-DI" },
  { id: "healthcare_devices", name: "Medical Equipment & Supplies", sasbCode: "HC-MS" },
  { id: "healthcare_pharma", name: "Pharmaceuticals", sasbCode: "HC-BP" },
  { id: "healthcare_biotech", name: "Biotechnology", sasbCode: "HC-BI" },
  
  // Food & Beverage
  { id: "food_products", name: "Processed Foods", sasbCode: "FB-PF" },
  { id: "food_retail", name: "Food Retailers & Distributors", sasbCode: "FB-FR" },
  { id: "food_beverage", name: "Alcoholic Beverages", sasbCode: "FB-AB" },
  { id: "food_nonalcoholic", name: "Non-Alcoholic Beverages", sasbCode: "FB-NB" },
  { id: "food_restaurants", name: "Restaurants", sasbCode: "FB-RN" },
  { id: "food_agriculture", name: "Agricultural Products", sasbCode: "FB-AG" },
  
  // Consumer Goods
  { id: "consumer_durables", name: "Consumer Durables", sasbCode: "CG-HP" },
  { id: "consumer_appliances", name: "Appliance Manufacturing", sasbCode: "CG-AM" },
  { id: "consumer_building", name: "Building Products & Furnishings", sasbCode: "CG-BF" },
  { id: "consumer_ecommerce", name: "E-Commerce", sasbCode: "CG-EC" },
  { id: "textiles", name: "Apparel, Accessories & Footwear", sasbCode: "CG-AA" },
  { id: "consumer_toys", name: "Toys & Sporting Goods", sasbCode: "CG-TS" },
  { id: "consumer_household", name: "Household & Personal Products", sasbCode: "CG-HP" },
  
  // Extractives & Minerals Processing
  { id: "energy_oil", name: "Oil & Gas - Exploration & Production", sasbCode: "EM-EP" },
  { id: "energy_midstream", name: "Oil & Gas - Midstream", sasbCode: "EM-MD" },
  { id: "energy_refining", name: "Oil & Gas - Refining & Marketing", sasbCode: "EM-RM" },
  { id: "energy_services", name: "Oil & Gas - Services", sasbCode: "EM-SV" },
  { id: "mining_coal", name: "Coal Operations", sasbCode: "EM-CO" },
  { id: "mining_iron", name: "Iron & Steel Producers", sasbCode: "EM-IS" },
  { id: "mining_metals", name: "Metals & Mining", sasbCode: "EM-MM" },
  { id: "construction_materials", name: "Construction Materials", sasbCode: "EM-CM" },
  
  // Infrastructure
  { id: "infra_electric", name: "Electric Utilities & Power Generators", sasbCode: "IF-EU" },
  { id: "infra_gas", name: "Gas Utilities & Distributors", sasbCode: "IF-GU" },
  { id: "infra_water", name: "Water Utilities & Services", sasbCode: "IF-WU" },
  { id: "infra_waste", name: "Waste Management", sasbCode: "IF-WM" },
  { id: "infra_engineering", name: "Engineering & Construction Services", sasbCode: "IF-EN" },
  { id: "infra_real_estate", name: "Real Estate", sasbCode: "IF-RE" },
  
  // Renewable Resources & Alternative Energy
  { id: "renewable_biofuels", name: "Biofuels", sasbCode: "RR-BI" },
  { id: "renewable_forestry", name: "Forestry Management", sasbCode: "RR-FM" },
  { id: "renewable_pulp", name: "Pulp & Paper Products", sasbCode: "RR-PP" },
  { id: "renewable_solar", name: "Solar Technology & Project Developers", sasbCode: "RR-ST" },
  { id: "renewable_wind", name: "Wind Technology & Project Developers", sasbCode: "RR-WT" },
  
  // Resource Transformation
  { id: "manufacturing_aerospace", name: "Aerospace & Defense", sasbCode: "RT-AE" },
  { id: "manufacturing_chemicals", name: "Chemicals", sasbCode: "RT-CH" },
  { id: "manufacturing_containers", name: "Containers & Packaging", sasbCode: "RT-CP" },
  { id: "manufacturing_electrical", name: "Electrical & Electronic Equipment", sasbCode: "RT-EE" },
  { id: "manufacturing_industrial", name: "Industrial Machinery & Goods", sasbCode: "RT-IG" },
  
  // Transportation
  { id: "transport_airlines", name: "Airlines", sasbCode: "TR-AL" },
  { id: "transport_auto", name: "Automobiles", sasbCode: "TR-AU" },
  { id: "transport_autoparts", name: "Auto Parts", sasbCode: "TR-AP" },
  { id: "transport_cargo", name: "Air Freight & Logistics", sasbCode: "TR-AF" },
  { id: "transport_cruise", name: "Cruise Lines", sasbCode: "TR-CL" },
  { id: "transport_marine", name: "Marine Transportation", sasbCode: "TR-MT" },
  { id: "transport_rail", name: "Rail Transportation", sasbCode: "TR-RA" },
  { id: "transport_road", name: "Road Transportation", sasbCode: "TR-RO" },
  
  // Services
  { id: "services_advertising", name: "Advertising & Marketing", sasbCode: "SV-AD" },
  { id: "services_casinos", name: "Casinos & Gaming", sasbCode: "SV-CA" },
  { id: "services_education", name: "Education", sasbCode: "SV-ED" },
  { id: "services_hotels", name: "Hotels & Lodging", sasbCode: "SV-HL" },
  { id: "services_leisure", name: "Leisure Facilities", sasbCode: "SV-LF" },
  { id: "services_media", name: "Media & Entertainment", sasbCode: "SV-ME" },
  { id: "services_professional", name: "Professional & Commercial Services", sasbCode: "SV-PS" },
];

export const REVENUE_BANDS = [
  { id: "lt1", label: "< ₹1 Cr", max: 1 },
  { id: "1to5", label: "₹1–5 Cr", max: 5 },
  { id: "5to50", label: "₹5–50 Cr", max: 50 },
  { id: "50to100", label: "₹50–100 Cr", max: 100 },
  { id: "gt100", label: "₹100 Cr+", max: Infinity },
];

interface Metric {
  id: string;
  code: string;
  name: string;
  description: string;
  framework: "SASB" | "GRI" | "IRIS";
  framework_reference: string;
  unit: string;
  recommended_frequency: string;
  default_data_source_examples: string[];
  calculation_formula?: string;
  validation: {
    type: "integer" | "float" | "percentage" | "boolean" | "text" | "file";
    min?: number;
    max?: number;
    required: boolean;
  };
  exposure_impact_score: number; // 1-10, higher = more material
  default_required: boolean;
}

interface MaterialTopic {
  topic: string;
  metrics: Metric[];
}

export function getMaterialTopics(industryId: string): MaterialTopic[] {
  const topics: Record<string, MaterialTopic[]> = {
    tech_sw: [
      {
        topic: "Data Privacy & Security",
        metrics: [
          {
            id: "tech_sw_sasb_cp_01",
            code: "SASB-CP-01",
            name: "Number of data breaches",
            description: "Total number of data breaches involving personally identifiable information (PII)",
            framework: "SASB",
            framework_reference: "TC-SI-230a.1",
            unit: "count",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Security incident logs", "SIEM tools", "Compliance reports"],
            calculation_formula: "Sum of confirmed security breaches involving customer/employee PII",
            validation: {
              type: "integer",
              min: 0,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
          {
            id: "tech_sw_gri_418",
            code: "GRI-418",
            name: "Customer privacy policy",
            description: "Documented policy on customer data privacy and protection measures",
            framework: "GRI",
            framework_reference: "GRI 418-1",
            unit: "doc",
            recommended_frequency: "Annually",
            default_data_source_examples: ["Policy documents", "Legal compliance records", "Board resolutions"],
            validation: {
              type: "file",
              required: true,
            },
            exposure_impact_score: 8,
            default_required: true,
          },
          {
            id: "tech_sw_sasb_cp_02",
            code: "SASB-CP-02",
            name: "Data processing transparency",
            description: "Percentage of products/services with clear data usage disclosures",
            framework: "SASB",
            framework_reference: "TC-SI-220a.5",
            unit: "%",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Product documentation", "Terms of service", "Privacy policies"],
            calculation_formula: "(Products with privacy disclosure / Total products) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: false,
            },
            exposure_impact_score: 7,
            default_required: false,
          },
        ],
      },
      {
        topic: "Product Lifecycle Management",
        metrics: [
          {
            id: "tech_sw_iris_pd_01",
            code: "IRIS-PD-01",
            name: "% products with sustainability label",
            description: "Percentage of software products with documented environmental/social impact metrics",
            framework: "IRIS",
            framework_reference: "IRIS+ PI9931",
            unit: "%",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Product catalogs", "Sustainability reports", "Marketing materials"],
            calculation_formula: "(Products with sustainability metrics / Total active products) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: false,
            },
            exposure_impact_score: 5,
            default_required: false,
          },
        ],
      },
      {
        topic: "Energy & Emissions",
        metrics: [
          {
            id: "tech_sw_sasb_en_01",
            code: "SASB-EN-01",
            name: "Total energy consumption (MWh)",
            description: "Total energy consumed by data centers and office operations",
            framework: "SASB",
            framework_reference: "TC-SI-130a.1",
            unit: "MWh",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Utility bills", "Energy monitoring systems", "Facility management reports"],
            calculation_formula: "Sum of electricity + renewable energy consumed in MWh",
            validation: {
              type: "float",
              min: 0,
              required: false,
            },
            exposure_impact_score: 6,
            default_required: false,
          },
          {
            id: "tech_sw_gri_305",
            code: "GRI-305",
            name: "GHG emissions (Scope 1 & 2)",
            description: "Total greenhouse gas emissions from direct and indirect energy sources",
            framework: "GRI",
            framework_reference: "GRI 305-1, 305-2",
            unit: "tCO2e",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Carbon accounting software", "Energy bills", "Fleet fuel records"],
            calculation_formula: "Scope 1 emissions + Scope 2 emissions in tonnes CO2 equivalent",
            validation: {
              type: "float",
              min: 0,
              required: false,
            },
            exposure_impact_score: 7,
            default_required: false,
          },
        ],
      },
      {
        topic: "Governance & Ethics",
        metrics: [
          {
            id: "tech_sw_gri_205",
            code: "GRI-205",
            name: "Anti-corruption policy",
            description: "Documented anti-corruption and bribery prevention policy",
            framework: "GRI",
            framework_reference: "GRI 205-2",
            unit: "doc",
            recommended_frequency: "Annually",
            default_data_source_examples: ["Corporate governance documents", "Ethics policies", "Board resolutions"],
            validation: {
              type: "file",
              required: true,
            },
            exposure_impact_score: 8,
            default_required: true,
          },
          {
            id: "tech_sw_gri_102",
            name: "Board independence",
            code: "GRI-102",
            description: "Percentage of independent directors on the board",
            framework: "GRI",
            framework_reference: "GRI 102-22",
            unit: "%",
            recommended_frequency: "Annually",
            default_data_source_examples: ["Board composition records", "Annual reports", "Governance disclosures"],
            calculation_formula: "(Number of independent directors / Total board members) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: false,
            },
            exposure_impact_score: 6,
            default_required: false,
          },
        ],
      },
    ],
    textiles: [
      {
        topic: "Worker Health & Safety",
        metrics: [
          {
            id: "textiles_sasb_lb_01",
            code: "SASB-LB-01",
            name: "Workplace incidents per 1,000 workers",
            description: "Rate of recordable workplace incidents including injuries and illnesses",
            framework: "SASB",
            framework_reference: "CG-AA-320a.1",
            unit: "rate",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Safety logs", "Incident reports", "HR records"],
            calculation_formula: "(Total recordable incidents × 1000) / Average number of workers",
            validation: {
              type: "float",
              min: 0,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
          {
            id: "textiles_gri_403",
            code: "GRI-403",
            name: "Worker safety training hours",
            description: "Average hours of safety training per worker per year",
            framework: "GRI",
            framework_reference: "GRI 403-5",
            unit: "hours",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Training records", "LMS data", "HR systems"],
            calculation_formula: "Total safety training hours / Total number of workers",
            validation: {
              type: "float",
              min: 0,
              required: false,
            },
            exposure_impact_score: 7,
            default_required: false,
          },
        ],
      },
      {
        topic: "Material Sourcing",
        metrics: [
          {
            id: "textiles_gri_204",
            code: "GRI-204",
            name: "% sustainably sourced materials",
            description: "Percentage of raw materials from certified sustainable sources",
            framework: "GRI",
            framework_reference: "GRI 204-1",
            unit: "%",
            recommended_frequency: "Annually",
            default_data_source_examples: ["Supply chain records", "Supplier certifications", "Purchase orders"],
            calculation_formula: "(Sustainable material weight / Total material weight) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: false,
            },
            exposure_impact_score: 8,
            default_required: false,
          },
        ],
      },
      {
        topic: "Water Management",
        metrics: [
          {
            id: "textiles_sasb_wm_01",
            code: "SASB-WM-01",
            name: "Total water withdrawal (cubic meters)",
            description: "Total volume of water withdrawn from all sources",
            framework: "SASB",
            framework_reference: "CG-AA-140a.1",
            unit: "m³",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Water meters", "Utility bills", "Facility management reports"],
            calculation_formula: "Sum of water from municipal supply + groundwater + surface water",
            validation: {
              type: "float",
              min: 0,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
        ],
      },
    ],
    food: [
      {
        topic: "Food Safety",
        metrics: [
          {
            id: "food_sasb_fs_01",
            code: "SASB-FS-01",
            name: "Number of food safety recalls",
            description: "Total number of product recalls due to safety or contamination issues",
            framework: "SASB",
            framework_reference: "FB-FR-250a.1",
            unit: "count",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Quality control logs", "Regulatory notifications", "Customer complaints"],
            calculation_formula: "Count of voluntary + mandatory recalls in reporting period",
            validation: {
              type: "integer",
              min: 0,
              required: true,
            },
            exposure_impact_score: 10,
            default_required: true,
          },
        ],
      },
      {
        topic: "Supply Chain Traceability",
        metrics: [
          {
            id: "food_gri_fp_02",
            code: "GRI-FP-02",
            name: "% ingredients from certified sources",
            description: "Percentage of ingredients sourced from certified sustainable/ethical suppliers",
            framework: "GRI",
            framework_reference: "FP2",
            unit: "%",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Supplier certifications", "Procurement data", "Traceability systems"],
            calculation_formula: "(Certified ingredient volume / Total ingredient volume) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: false,
            },
            exposure_impact_score: 7,
            default_required: false,
          },
        ],
      },
    ],
    consumer: [
      {
        topic: "GHG & Energy",
        metrics: [
          {
            id: "consumer_sasb_en_01",
            code: "SASB-EN-01",
            name: "Scope 1 & 2 emissions (tCO2e)",
            description: "Total direct and indirect GHG emissions from operations",
            framework: "SASB",
            framework_reference: "CG-MR-110a.1",
            unit: "tCO2e",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Carbon accounting tools", "Energy consumption data", "Fleet emissions"],
            calculation_formula: "Scope 1 (direct emissions) + Scope 2 (purchased electricity) in tCO2e",
            validation: {
              type: "float",
              min: 0,
              required: false,
            },
            exposure_impact_score: 6,
            default_required: false,
          },
        ],
      },
      {
        topic: "Product Safety",
        metrics: [
          {
            id: "consumer_gri_416",
            code: "GRI-416",
            name: "Product safety incidents",
            description: "Number of incidents of non-compliance with product safety regulations",
            framework: "GRI",
            framework_reference: "GRI 416-2",
            unit: "count",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Quality assurance logs", "Customer complaints", "Regulatory reports"],
            calculation_formula: "Count of product safety violations + customer injury incidents",
            validation: {
              type: "integer",
              min: 0,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
        ],
      },
    ],
    healthcare: [
      {
        topic: "Patient Data Security",
        metrics: [
          {
            id: "healthcare_sasb_hc_01",
            code: "SASB-HC-01",
            name: "HIPAA compliance breaches",
            description: "Number of breaches of protected health information (PHI)",
            framework: "SASB",
            framework_reference: "HC-DY-230a.1",
            unit: "count",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Security incident reports", "HIPAA breach logs", "OCR notifications"],
            calculation_formula: "Count of confirmed PHI breaches affecting 500+ individuals",
            validation: {
              type: "integer",
              min: 0,
              required: true,
            },
            exposure_impact_score: 10,
            default_required: true,
          },
        ],
      },
      {
        topic: "Quality of Care",
        metrics: [
          {
            id: "healthcare_iris_hc_02",
            code: "IRIS-HC-02",
            name: "Patient satisfaction score",
            description: "Average patient satisfaction rating from surveys",
            framework: "IRIS",
            framework_reference: "IRIS+ PI1479",
            unit: "score",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Patient surveys", "HCAHPS scores", "NPS data"],
            calculation_formula: "Average of patient satisfaction scores (1-10 scale)",
            validation: {
              type: "float",
              min: 0,
              max: 10,
              required: false,
            },
            exposure_impact_score: 7,
            default_required: false,
          },
        ],
      },
    ],
    energy: [
      {
        topic: "GHG Emissions",
        metrics: [
          {
            id: "energy_sasb_em_01",
            code: "SASB-EM-01",
            name: "Gross global Scope 1 emissions (tCO2e)",
            description: "Total direct greenhouse gas emissions from oil and gas operations",
            framework: "SASB",
            framework_reference: "EM-EP-110a.1",
            unit: "tCO2e",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Emissions monitoring systems", "Flaring data", "Fugitive emissions calculations"],
            calculation_formula: "Sum of combustion + flaring + venting + fugitive emissions in tCO2e",
            validation: {
              type: "float",
              min: 0,
              required: true,
            },
            exposure_impact_score: 10,
            default_required: true,
          },
        ],
      },
      {
        topic: "Spill Management",
        metrics: [
          {
            id: "energy_sasb_em_02",
            code: "SASB-EM-02",
            name: "Number of hydrocarbon spills",
            description: "Total number of reportable hydrocarbon spills",
            framework: "SASB",
            framework_reference: "EM-EP-160a.2",
            unit: "count",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Incident reports", "Environmental compliance logs", "Spill response records"],
            calculation_formula: "Count of spills >1 barrel or causing environmental harm",
            validation: {
              type: "integer",
              min: 0,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
        ],
      },
    ],
    finance: [
      {
        topic: "Financial Inclusion",
        metrics: [
          {
            id: "finance_iris_fi_01",
            code: "IRIS-FI-01",
            name: "% loans to underserved populations",
            description: "Percentage of loan portfolio serving underbanked or low-income communities",
            framework: "IRIS",
            framework_reference: "IRIS+ PI5263",
            unit: "%",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Loan management system", "Customer demographics", "Portfolio analysis"],
            calculation_formula: "(Loans to underserved / Total loan portfolio value) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: false,
            },
            exposure_impact_score: 7,
            default_required: false,
          },
        ],
      },
      {
        topic: "Systemic Risk Management",
        metrics: [
          {
            id: "finance_sasb_fn_01",
            code: "SASB-FN-01",
            name: "Tier 1 capital ratio",
            description: "Ratio of core equity capital to risk-weighted assets",
            framework: "SASB",
            framework_reference: "FN-CB-550a.1",
            unit: "%",
            recommended_frequency: "Quarterly",
            default_data_source_examples: ["Balance sheet", "Regulatory filings", "Capital adequacy reports"],
            calculation_formula: "(Tier 1 Capital / Risk-Weighted Assets) × 100",
            validation: {
              type: "percentage",
              min: 0,
              max: 100,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
        ],
      },
    ],
    manufacturing: [
      {
        topic: "Air Quality",
        metrics: [
          {
            id: "manufacturing_sasb_mf_01",
            code: "SASB-MF-01",
            name: "Air emissions of pollutants (kg)",
            description: "Total mass of criteria air pollutants emitted (NOx, SOx, VOCs, particulates)",
            framework: "SASB",
            framework_reference: "RT-IG-120a.1",
            unit: "kg",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Emissions monitoring equipment", "Stack testing results", "Environmental reports"],
            calculation_formula: "Sum of NOx + SOx + VOC + PM2.5 + PM10 emissions in kg",
            validation: {
              type: "float",
              min: 0,
              required: true,
            },
            exposure_impact_score: 9,
            default_required: true,
          },
        ],
      },
      {
        topic: "Waste Management",
        metrics: [
          {
            id: "manufacturing_gri_306",
            code: "GRI-306",
            name: "Total hazardous waste generated (tonnes)",
            description: "Total weight of hazardous waste produced during manufacturing",
            framework: "GRI",
            framework_reference: "GRI 306-2",
            unit: "tonnes",
            recommended_frequency: "Monthly",
            default_data_source_examples: ["Waste manifests", "Disposal records", "ERP systems"],
            calculation_formula: "Sum of all hazardous waste streams by weight",
            validation: {
              type: "float",
              min: 0,
              required: true,
            },
            exposure_impact_score: 8,
            default_required: true,
          },
        ],
      },
    ],
  };

  // Return specific industry metrics if available
  if (topics[industryId]) {
    return topics[industryId];
  }

  // Return default universal ESG metrics for industries without specific mappings
  return [
    {
      topic: "Governance & Ethics",
      metrics: [
        {
          id: `${industryId}_gri_102_board`,
          code: "GRI-102",
          name: "Board composition and independence",
          description: "Percentage of independent directors and board diversity metrics",
          framework: "GRI",
          framework_reference: "GRI 102-22, 102-24",
          unit: "%",
          recommended_frequency: "Annually",
          default_data_source_examples: ["Board records", "Annual reports", "Governance documents"],
          calculation_formula: "(Independent directors / Total board members) × 100",
          validation: {
            type: "percentage",
            min: 0,
            max: 100,
            required: false,
          },
          exposure_impact_score: 7,
          default_required: false,
        },
        {
          id: `${industryId}_gri_205_anticorruption`,
          code: "GRI-205",
          name: "Anti-corruption policy and training",
          description: "Documented anti-corruption policy and employee training completion rate",
          framework: "GRI",
          framework_reference: "GRI 205-2",
          unit: "doc",
          recommended_frequency: "Annually",
          default_data_source_examples: ["Policy documents", "Training records", "Ethics compliance reports"],
          validation: {
            type: "file",
            required: true,
          },
          exposure_impact_score: 8,
          default_required: true,
        },
      ],
    },
    {
      topic: "Environmental Management",
      metrics: [
        {
          id: `${industryId}_gri_302_energy`,
          code: "GRI-302",
          name: "Total energy consumption",
          description: "Total energy consumed from all sources in MWh",
          framework: "GRI",
          framework_reference: "GRI 302-1",
          unit: "MWh",
          recommended_frequency: "Monthly",
          default_data_source_examples: ["Utility bills", "Energy monitoring systems", "Facility reports"],
          calculation_formula: "Sum of electricity + fuel + renewable energy in MWh",
          validation: {
            type: "float",
            min: 0,
            required: false,
          },
          exposure_impact_score: 6,
          default_required: false,
        },
        {
          id: `${industryId}_gri_305_emissions`,
          code: "GRI-305",
          name: "GHG emissions (Scope 1 & 2)",
          description: "Total greenhouse gas emissions from direct and energy indirect sources",
          framework: "GRI",
          framework_reference: "GRI 305-1, 305-2",
          unit: "tCO2e",
          recommended_frequency: "Quarterly",
          default_data_source_examples: ["Carbon accounting tools", "Energy data", "Emissions calculators"],
          calculation_formula: "Scope 1 (direct) + Scope 2 (electricity) in tonnes CO2 equivalent",
          validation: {
            type: "float",
            min: 0,
            required: false,
          },
          exposure_impact_score: 7,
          default_required: false,
        },
        {
          id: `${industryId}_gri_306_waste`,
          code: "GRI-306",
          name: "Total waste generated",
          description: "Total weight of waste generated by type and disposal method",
          framework: "GRI",
          framework_reference: "GRI 306-2",
          unit: "tonnes",
          recommended_frequency: "Monthly",
          default_data_source_examples: ["Waste manifests", "Disposal records", "Facility logs"],
          calculation_formula: "Sum of all waste streams by weight",
          validation: {
            type: "float",
            min: 0,
            required: false,
          },
          exposure_impact_score: 6,
          default_required: false,
        },
      ],
    },
    {
      topic: "Labor & Human Rights",
      metrics: [
        {
          id: `${industryId}_gri_403_safety`,
          code: "GRI-403",
          name: "Workplace injury rate",
          description: "Rate of work-related injuries per 200,000 hours worked",
          framework: "GRI",
          framework_reference: "GRI 403-9",
          unit: "rate",
          recommended_frequency: "Monthly",
          default_data_source_examples: ["Safety logs", "Incident reports", "OSHA records"],
          calculation_formula: "(Number of injuries × 200,000) / Total hours worked",
          validation: {
            type: "float",
            min: 0,
            required: true,
          },
          exposure_impact_score: 8,
          default_required: true,
        },
        {
          id: `${industryId}_gri_404_training`,
          code: "GRI-404",
          name: "Average training hours per employee",
          description: "Average hours of professional development training per employee",
          framework: "GRI",
          framework_reference: "GRI 404-1",
          unit: "hours",
          recommended_frequency: "Annually",
          default_data_source_examples: ["Training records", "LMS data", "HR systems"],
          calculation_formula: "Total training hours / Number of employees",
          validation: {
            type: "float",
            min: 0,
            required: false,
          },
          exposure_impact_score: 5,
          default_required: false,
        },
        {
          id: `${industryId}_gri_405_diversity`,
          code: "GRI-405",
          name: "Workforce Diversity by Gender",
          description: "Percentage of female employees in the total workforce",
          framework: "GRI",
          framework_reference: "GRI 405-1",
          unit: "%",
          recommended_frequency: "Annually",
          default_data_source_examples: ["HR records", "Diversity reports", "EEO data"],
          calculation_formula: "(Number of Female Employees / Total Number of Employees) × 100",
          validation: {
            type: "percentage",
            min: 0,
            max: 100,
            required: false,
          },
          exposure_impact_score: 6,
          default_required: false,
        },
      ],
    },
    {
      topic: "Community & Social Impact",
      metrics: [
        {
          id: `${industryId}_gri_413_community`,
          code: "GRI-413",
          name: "Community engagement programs",
          description: "Number and description of community development programs",
          framework: "GRI",
          framework_reference: "GRI 413-1",
          unit: "count",
          recommended_frequency: "Annually",
          default_data_source_examples: ["CSR reports", "Community engagement logs", "Partnership records"],
          calculation_formula: "Count of active community programs",
          validation: {
            type: "integer",
            min: 0,
            required: false,
          },
          exposure_impact_score: 5,
          default_required: false,
        },
        {
          id: `${industryId}_iris_local_employment`,
          code: "IRIS-PI9236",
          name: "Local hiring rate",
          description: "Percentage of employees hired from local community",
          framework: "IRIS",
          framework_reference: "IRIS+ PI9236",
          unit: "%",
          recommended_frequency: "Annually",
          default_data_source_examples: ["HR records", "Recruitment data", "Employee demographics"],
          calculation_formula: "(Local hires / Total employees) × 100",
          validation: {
            type: "percentage",
            min: 0,
            max: 100,
            required: false,
          },
          exposure_impact_score: 4,
          default_required: false,
        },
      ],
    },
  ];
}
