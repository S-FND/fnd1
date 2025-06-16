
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

export interface WarehouseItem {
  id: number;
  name: string;
  plotArea: string;
  itemsStored: string;
  location: string;
  exclusiveSupplier: string;
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
  esgTeamMembers: string;
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
  // HR-related properties that are still used in Company Information
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
  retrenchmentDetails: string;
}
