
export interface IRLFormData {
  id?: string;
  // Basic Company Information
  legalEntityName: string;
  emailId: string;
  incorporationMonth: string;
  incorporationYear: string;
  companyBrandName: string;
  contactNumber: string;
  paidUpCapital: string;
  currentYearTurnover: string;
  previousYearTurnover: string;
  parentCompanySubsidiaries: string;
  productsServices: string[];
  
  // Founding Team
  foundingTeam: {
    name: string;
    education: string;
    workExperience: string;
  }[];
  
  // Office Space Details
  officeSpaces: {
    location: string;
    type: 'Coworking' | 'Leased' | 'WFH';
    address: string;
    geotagLocation: string;
    numberOfSeats: string;
  }[];
  
  // Beneficiaries and Legal
  totalBeneficiaries: string;
  litigationDetails: string;
  
  // Working Hours
  workingHoursFTE: string;
  shiftTimingContractWorkers: string;
  totalOTHoursCurrent: string;
  totalOTHoursPrevious: string;
  totalOTPayCurrent: string;
  totalOTPayPrevious: string;
  
  // Outsourced Services
  outsourcedServices: {
    agencyName: string;
    servicesProvided: string;
    malePersons: string;
    femalePersons: string;
  }[];
  
  // Facilities
  facilitiesDetails: string;
  productSafetyCertifications: string;
  emergencyIncidents: string;
  
  // ESG Management Team
  esgManagement: {
    facilityManagement: string;
    labourCompliances: string;
    fireTraining: string;
    hrPoliciesTraining: string;
    mockDrills: string;
  };
  
  // Locations
  nationalWarehouses: string;
  nationalOffices: string;
  nationalDCs: string;
  internationalWarehouses: string;
  internationalOffices: string;
  internationalDCs: string;
  
  // Employee Well-being
  wellbeingMeasures: {
    healthInsurance: string;
    accidentInsurance: string;
    maternityBenefits: string;
    paternityBenefits: string;
    dayCareFacilities: string;
    lifeInsurance: string;
  };
  
  // Transportation
  transportationDetails: string;
  youngWorkersDetails: string;
  retrenchmentDetails: string;
  
  // Meta information
  createdAt?: string;
  updatedAt?: string;
  status: 'draft' | 'submitted';
}
