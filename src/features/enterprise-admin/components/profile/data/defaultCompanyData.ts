
import { CompanyFormData } from '../schemas/companySchema';

export const defaultCompanyData: CompanyFormData = {
  name: 'Translog India Ltd.',
  legalName: 'Translog India Ltd.',
  cin: 'L63030MH1995PLC089758',
  founded: '1995',
  incorporationDate: 'October 1995',
  registeredOffice: 'Translog House, Plot No. 84, Sector 44, Gurugram - 122003, Haryana, India',
  corporateOffice: 'Translog Towers, 14th Floor, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India',
  email: 'investor.relations@translogindia.com',
  phone: '+91-22-66780800',
  website: 'https://www.translogindia.com',
  financialYear: '2023-24',
  listedOn: 'National Stock Exchange of India (NSE) and Bombay Stock Exchange (BSE)',
  revenue: '₹2,500 Cr',
  fundingStage: 'Public Listed',
  employeeStrength: '2,500+',
  industry: 'Logistics & Transportation',
};

export const keyMetrics = {
  totalLocations: 15,
  cities: 8,
  states: 12,
  sustainability: 'ESG Compliant',
  stockExchanges: 2
};

export const founders = [
  { name: 'Rajesh Kumar', title: 'Chairman & Managing Director', experience: '25+ years in Logistics' },
  { name: 'Priya Singh', title: 'Executive Director', experience: '20+ years in Operations' }
];
