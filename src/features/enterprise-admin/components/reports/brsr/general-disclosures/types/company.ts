// CompanyDetails
export interface CompanyDetailsData {
    cin: string;
    companyName: string;
    incorporationYear: string;
    registeredOffice: string;
    corporateAddress: string;
    email: string;
    telephone: string;
    website: string;
    financialYear: string;
    listedOn: string;
  }

// ProductsServices
  export interface ProductServiceItem {
    description: string;
    nicCode: string;
    turnoverPercentage: string;
  }
  
  export interface BusinessSegment {
    name: string;
    services: string[];
    infrastructure: string;
  }
  
  export interface ProductsServicesData {
    businessActivities: ProductServiceItem[];
    businessModel: {
      overview: string;
      segments: BusinessSegment[];
    };
  }

// Operations Types
export interface OperationalLocation {
    location: string;
    facilitiesCount: string;
    officesCount: string;
  }
  
  export interface KeyStatistic {
    parameter: string;
    details: string;
  }
  
  export interface MajorLocation {
    cityRegion: string;
    facilityType: string;
    capabilities: string;
  }
  
  export interface OperationsData {
    operationalLocations: OperationalLocation[];
    keyStatistics: KeyStatistic[];
    majorLocations: MajorLocation[];
  }  

  // Employees Types
export interface EmployeeGenderStats {
    category: string;
    permanent: string;
    contractual: string;
    total: string;
  }
  
  export interface EmployeeFunctionDistribution {
    function: string;
    number: string;
    percentage: string;
  }
  
  export interface LogisticsWorkforce {
    category: string;
    number: string;
    changeYoY: string;
  }
  
  export interface EmployeesData {
    genderStats: EmployeeGenderStats[];
    functionDistribution: EmployeeFunctionDistribution[];
    logisticsWorkforce: LogisticsWorkforce[];
  }

// CSR Types
  export interface CSRInitiative {
    initiative: string;
    amount: string; // e.g., "4.8"
    impact: string;
  }
  
  export interface CSRDetailsData {
    csrRegistrationNumber: string;
    totalSpendingOnCSR: string;
    csrCommitteeComposition: string;
    csrFocusAreas: CSRInitiative[];
  }

// Transparency Disclosures Types
  export interface Grievance {
    stakeholderGroup: string;
    filedDuringYear: string;
    pendingResolution: string;
    remarks: string;
  }
  
  export interface MaterialIssue {
    materialIssueIdentified: string;
    riskOrOpportunity: string;
    rationale: string;
    approachToAdaptOrMitigate: string;
  }
  
  export interface TransparencyDisclosuresData {
    grievances: Grievance[];
    materialIssues: MaterialIssue[];
  }

  // ManagementDisclosuresData
  export interface PolicyDisclosure {
    question: string;
    ethics: string;
    safety: string;
    wellbeing: string;
    stakeholders: string;
    humanRights: string;
    environment: string;
    advocacy: string;
    inclusiveGrowth: string;
    customerValue: string;
  }
  
  export interface SectorPolicy {
    name: string;
    keyElements: string;
    coverage: string;
  }
  
  export interface BoardCommittee {
    name: string;
    composition: string;
    responsibilities: string;
  }
  
  export interface DirectorStatement {
    name: string;
    position: string;
    din: string;
    paragraphs: string[];
  }
  
  export interface ManagementDisclosuresData {
    policyDisclosures: PolicyDisclosure[];
    sectorPolicies: SectorPolicy[];
    boardCommittees: BoardCommittee[];
    directorStatement: DirectorStatement;
  }

// Principle-wise Performance Types
export interface PrincipleTable {
  headers: string[];
  rows: Array<Record<string, string | number>>;
  keyField?: string;
}

export interface PrincipleItem {
  title: string;
  description: string;
  highlights?: string[];
  tables?: PrincipleTable[];
  subsections?: Array<{
    title: string;
    content: string | string[] | PrincipleTable;
  }>;
}

export interface PrincipleWisePerformanceData {
  principle1: PrincipleItem;
  principle2: PrincipleItem;
  principle3: PrincipleItem;
  principle4: PrincipleItem;
  principle5: PrincipleItem;
  principle6: PrincipleItem;
  principle7: PrincipleItem;
  principle8: PrincipleItem;
  principle9: PrincipleItem;
}