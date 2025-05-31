
export interface OfficeSpace {
  location: string;
  type: string;
  address: string;
  geotagLocation: string;
  numberOfSeats: string;
}

export interface OutsourcedService {
  agencyName: string;
  servicesDischarged: string;
  malePersons: string;
  femalePersons: string;
}

export interface LocationDetails {
  locationType: string;
  warehouses: string;
  offices: string;
  distributionCenters: string;
  total: string;
}

export interface CompanyFormData {
  legalEntityName: string;
  emailId: string;
  incorporationDate: string;
  companyName: string;
  contactNumber: string;
  paidUpCapital: string;
  currentTurnover: string;
  previousTurnover: string;
  parentCompany: string;
  productsServices: string;
  foundingTeam: string;
  totalBeneficiaries: string;
  litigationDetails: string;
  workingHours: string;
  shiftTiming: string;
  otHoursCurrent: string;
  otHoursPrevious: string;
  otPayCompensation: string;
  facilitiesList: string;
  productSafetyCertifications: string;
  emergencyIncidents: string;
  esgTeamMembers: string;
  facilitiesCompliance: string;
  labourCompliances: string;
  fireTraining: string;
  hrPoliciesTraining: string;
  mockDrills: string;
  employeeWellbeingHealthInsurance: string;
  employeeWellbeingAccidentInsurance: string;
  employeeWellbeingMaternityBenefits: string;
  employeeWellbeingPaternityBenefits: string;
  employeeWellbeingDayCare: string;
  employeeWellbeingLifeInsurance: string;
  transportationDetails: string;
  youngWorkers: string;
  retrenchmentDetails: string;
  gstNumber: string;
  assuranceProviderName: string;
  assuranceType: string;
  cinNumber: string;
  industry: string;
  registeredOfficeAddress: string;
  headOfficeAddress: string;
  website: string;
  financialYearReporting: string;
  businessActivitiesDescription: string;
}
