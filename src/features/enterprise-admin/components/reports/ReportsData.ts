
interface Report {
  id: string;
  title: string;
  description: string;
  path: string;
}

export const reportsData: Report[] = [
  {
    id: 'brsr',
    title: 'BRSR Report',
    description: 'Business Responsibility and Sustainability Report - Comprehensive ESG disclosure framework for Indian companies.',
    path: '/reports/brsr',
  },
  {
    id: 'gri',
    title: 'GRI Report',
    description: 'Global Reporting Initiative - International standards for sustainability reporting.',
    path: '/reports/gri',
  },
  {
    id: 'tcfd',
    title: 'TCFD Report',
    description: 'Task Force on Climate-related Financial Disclosures - Framework for climate-related financial risk disclosures.',
    path: '/reports/tcfd',
  },
  {
    id: 'esrs',
    title: 'ESRS Report',
    description: 'European Sustainability Reporting Standards - EU framework for comprehensive sustainability disclosures.',
    path: '/reports/esrs',
  },
  {
    id: 'impact',
    title: 'Impact Assessment',
    description: 'Comprehensive analysis of environmental and social impacts of business activities.',
    path: '/reports/impact',
  },
];
