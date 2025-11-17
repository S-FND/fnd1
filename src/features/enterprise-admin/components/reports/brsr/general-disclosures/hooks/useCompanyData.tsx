import { useEffect, useState } from 'react';
import axios from 'axios';

// Types
import { CompanyDetailsData,ProductsServicesData,OperationsData,EmployeesData,CSRDetailsData,TransparencyDisclosuresData,ManagementDisclosuresData,PolicyDisclosure,SectorPolicy,BoardCommittee,DirectorStatement,PrincipleWisePerformanceData } from '../types/company';
import { logger } from '@/hooks/logger';

// Env config
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Use REACT_APP_API_URL if using CRA

// Hook
export const useCompanyData = () => {
  const [data, setData] = useState<{
    details?: CompanyDetailsData;
    productsServices?: ProductsServicesData;
    operations?: OperationsData;
    employees?: EmployeesData;
    csrDetails?: CSRDetailsData;
    transparencyDisclosures?: TransparencyDisclosuresData;
    ManagementDisclosures?:  ManagementDisclosuresData;
    PrincipleWisePerformance?: PrincipleWisePerformanceData
    // Add other transformed sections if needed
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('fandoro-token');
        const userRaw = localStorage.getItem('fandoro-user');
        if (!token || !userRaw) throw new Error("Missing token or user");

        const user = JSON.parse(userRaw);
        const entityId = user?.entityId;
        if (!entityId) throw new Error("Entity ID not found");

        const response = await axios.get(`${API_URL}/company/entity/reportingData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;
        logger.log('result',result);
        if (result.status && result.data) {
          setData({
            details: transformCompanyDetails(result.data),
            productsServices: transformProductsServices(result.data),
            operations: transformOperationsData(result.data),
            employees: transformEmployeesData(result.data),
            csrDetails: transformCSRDetailsData(result.data),
            transparencyDisclosures: transformTransparencyDisclosuresData(result.data),
            ManagementDisclosures: transformManagementData(result.data),
            PrincipleWisePerformance: transformPrincipleWiseData(result.data)

            // Add other sections here if needed
          });
        } else {
          throw new Error(result.message || 'Failed to fetch company data');
        }
      } catch (err: any) {
        // logger.error("Fetch error:", err);
        setError(err);
        if (!data) {
          // logger.warn("USING DUMMY DATA");
          setData({
            details: transformCompanyDetails({}),
            productsServices: transformProductsServices({}),
            operations: transformOperationsData({}),
            employees: transformEmployeesData({}),
            csrDetails: transformCSRDetailsData({}),
            transparencyDisclosures: transformTransparencyDisclosuresData({}),
            ManagementDisclosures: transformManagementData({}),
            PrincipleWisePerformance: transformPrincipleWiseData({}),
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { companyData: data, loading, error };
};

// Transformer
const transformCompanyDetails = (apiData: any): CompanyDetailsData => ({
  cin: apiData.cin || 'Not Available',
  companyName: apiData.company_name || apiData.legal_name || 'Not Available',
  incorporationYear: apiData.incorporation_date?.split('-')[0] || apiData.founded || 'Not Available',
  registeredOffice: apiData.registered_office || apiData.registered_office_address || 'Not Available',
  corporateAddress: apiData.head_office || apiData.head_office_address || 'Not Available',
  email: apiData.email || 'Not Available',
  telephone: apiData.contact_number || 'Not Available',
  website: apiData.website || 'Not Available',
  financialYear: apiData.financial_year || 'Not Available',
  listedOn: apiData.listed_on || 'Not Available',
});

const transformProductsServices = (apiData: any): ProductsServicesData => ({
    businessActivities: apiData.business_activities?.map((activity: any) => ({
      description: activity.description || 'N/A',
      nicCode: activity.nic_code || 'N/A',
      turnoverPercentage: `${activity.turnover_percentage || 0}%`,
    })) || [],
    businessModel: {
      overview: apiData.business_model?.overview || 'Not available',
      segments: apiData.business_model?.segments?.map((segment: any) => ({
        name: segment.name || 'Unnamed Segment',
        services: segment.services || [],
        infrastructure: segment.infrastructure || 'N/A',
      })) || [],
    },
  });

  const transformOperationsData = (apiData: any): OperationsData => ({
    operationalLocations: apiData.operational_locations?.map((loc: any) => ({
      location: loc.location || 'Not Available',
      facilitiesCount: loc.facilities_count || 'Not Available',
      officesCount: loc.offices_count || 'Not Available',
    })) || [],
    keyStatistics: apiData.key_statistics?.map((stat: any) => ({
      parameter: stat.parameter || 'Not Available',
      details: stat.details || 'Not Available',
    })) || [],
    majorLocations: apiData.major_locations?.map((loc: any) => ({
      cityRegion: loc.city_region || 'Not Available',
      facilityType: loc.facility_type || 'Not Available',
      capabilities: loc.capabilities || 'Not Available',
    })) || [],
  });

  const transformEmployeesData = (apiData: any): EmployeesData => ({
    genderStats: apiData.employee_gender_stats?.map((stat: any) => ({
      category: stat.category || 'Not Available',
      permanent: stat.permanent || '0',
      contractual: stat.contractual || '0',
      total: stat.total || '0',
    })) || [],
    functionDistribution: apiData.employee_function_distribution?.map((item: any) => ({
      function: item.function || 'Not Available',
      number: item.number || '0',
      percentage: item.percentage || '0%',
    })) || [],
    logisticsWorkforce: apiData.logistics_workforce?.map((item: any) => ({
      category: item.category || 'Not Available',
      number: item.number || '0',
      changeYoY: item.change_yoy || '0%',
    })) || [],
  });

  const transformCSRDetailsData = (apiData: any): CSRDetailsData => ({
    csrRegistrationNumber: apiData.csr_registration_number || 'Not Available',
    totalSpendingOnCSR: apiData.total_spending_on_csr || 'Not Available',
    csrCommitteeComposition: apiData.csr_committee_composition || 'Not Available',
    csrFocusAreas: apiData.csr_focus_areas?.map((item: any) => ({
      initiative: item.initiative || 'Not Available',
      amount: item.amount || '0',
      impact: item.impact || 'Not Available',
    })) || [],
  });

  const transformTransparencyDisclosuresData = (apiData: any): TransparencyDisclosuresData => ({
    grievances: apiData.transparency_grievances?.map((item: any) => ({
      stakeholderGroup: item.stakeholder_group || 'Not Available',
      filedDuringYear: item.filed_during_year || '0',
      pendingResolution: item.pending_resolution || '0',
      remarks: item.remarks || 'No remarks',
    })) || [],
    materialIssues: apiData.material_responsible_business_issues?.map((item: any) => ({
      materialIssueIdentified: item.material_issue_identified || 'Not Available',
      riskOrOpportunity: item.risk_or_opportunity || 'Not Available',
      rationale: item.rationale || 'Not Available',
      approachToAdaptOrMitigate: item.approach_to_adapt_or_mitigate || 'Not Available',
    })) || [],
  });


  const transformManagementData = (apiData: any): ManagementDisclosuresData => {
    // Fallback if no data
    const defaultData: ManagementDisclosuresData = {
      policyDisclosures: [],
      sectorPolicies: [],
      boardCommittees: [],
      directorStatement: {
        name: '',
        position: '',
        din: '',
        paragraphs: []
      }
    };
  
    if (!apiData) return defaultData;
  
    // Transform policy disclosures
    const policyDisclosures: PolicyDisclosure[] = [
      {
        question: 'Policy formulation approved by Board',
        ethics: apiData.documentgovernances?.code_of_conduct_board?.isApplicable === 'yes' ? 'Yes' : 'No',
        safety: apiData.managementSystems?.ehs_Policy?.isApplicable === 'yes' ? 'Yes' : 'No',
        wellbeing: apiData.managementSystems?.human_resource_policy?.isApplicable === 'yes' ? 'Yes' : 'No',
        stakeholders: apiData.managementSystems?.stakeholder_engagement_plan?.isApplicable === 'yes' ? 'Yes' : 'No',
        humanRights: apiData.managementSystems?.human_rights_policy?.isApplicable === 'yes' ? 'Yes' : 'No',
        environment: apiData.managementSystems?.waste_management_policy?.isApplicable === 'yes' ? 'Yes' : 'No',
        advocacy: apiData.documentgovernances?.whistleblower_policy?.isApplicable === 'yes' ? 'Yes' : 'No',
        inclusiveGrowth: apiData.managementSystems?.diversity_equity_policy?.isApplicable === 'yes' ? 'Yes' : 'No',
        customerValue: apiData.managementSystems?.grievance_mechanism_for_customers?.isApplicable === 'yes' ? 'Yes' : 'No'
      },
      {
        question: 'Policies conforming to standards',
        ethics: apiData.documentgovernances?.code_of_conduct_board?.reason?.includes('standard') ? 'Yes' : 'No',
        safety: apiData.managementSystems?.ehs_Policy?.reason?.includes('standard') ? 'Yes' : 'No',
        wellbeing: apiData.managementSystems?.human_resource_policy?.reason?.includes('standard') ? 'Yes' : 'No',
        stakeholders: apiData.managementSystems?.stakeholder_engagement_plan?.reason?.includes('standard') ? 'Yes' : 'No',
        humanRights: apiData.managementSystems?.human_rights_policy?.reason?.includes('standard') ? 'Yes' : 'No',
        environment: apiData.managementSystems?.waste_management_policy?.reason?.includes('standard') ? 'Yes' : 'No',
        advocacy: apiData.documentgovernances?.whistleblower_policy?.reason?.includes('standard') ? 'Yes' : 'No',
        inclusiveGrowth: apiData.managementSystems?.diversity_equity_policy?.reason?.includes('standard') ? 'Yes' : 'No',
        customerValue: apiData.managementSystems?.grievance_mechanism_for_customers?.reason?.includes('standard') ? 'Yes' : 'No'
      }
    ];
  
    // Transform sector policies
    const sectorPolicies: SectorPolicy[] = [
      {
        name: 'Human Resource Policy',
        keyElements: apiData.managementSystems?.human_resource_policy?.reason || 'Employee welfare and development',
        coverage: 'All employees'
      },
      {
        name: 'Environmental Health & Safety',
        keyElements: apiData.managementSystems?.ehs_Policy?.reason || 'Workplace safety and environmental protection',
        coverage: 'All facilities'
      },
      {
        name: 'Whistleblower Policy',
        keyElements: apiData.documentgovernances?.whistleblower_policy?.reason || 'Reporting unethical behavior',
        coverage: 'All stakeholders'
      }
    ];
  
    // Transform board committees
    const boardCommittees: BoardCommittee[] = [
      {
        name: 'Audit Committee',
        composition: `${apiData.humanResources?.boardDirectors?.total || 3} members`,
        responsibilities: 'Financial oversight and risk management'
      },
      {
        name: 'Nomination Committee',
        composition: `${apiData.humanResources?.keyManagerial?.total || 2} members`,
        responsibilities: 'Board composition and director appointments'
      }
    ];
  
    // Transform director statement
    const directorStatement: DirectorStatement = {
      name: apiData.foundingTeam?.name || 'Board Chairperson',
      position: 'Chairperson',
      din: `DIN: ${apiData.foundingTeam?.past_company_details?.[0]?.pastDesignation || 'XXXXXX'}`,
      paragraphs: [
        "Our governance framework ensures accountability and transparency.",
        `The Board comprises ${apiData.humanResources?.boardDirectors?.total || 5} directors.`,
        "We maintain robust policies across all operational areas."
      ]
    };
  
    return {
      policyDisclosures,
      sectorPolicies,
      boardCommittees,
      directorStatement
    };
  };

  const transformPrincipleWiseData = (apiData: any) => {
    return {
      principle1: {
        title: "Principle 1: Ethics, Transparency and Accountability",
        description: "Our company has established robust governance mechanisms that ensure ethical conduct across all operations.",
        highlights: [
          "Zero confirmed incidents of corruption across all operations",
          "100% of employees received ethics and anti-bribery training",
          "32 stakeholder complaints received, 31 resolved (97% resolution rate)"
        ],
        subsections: [{
          title: "Governance Initiatives",
          content: [
            "Four independent directors serving on the Board's Ethics Committee",
            "Implemented real-time GPS tracking for 100% of fleet",
            "Whistleblower policy extended to all partners"
          ]
        }]
      },
      principle2: {
        title: "Principle 2: Safety and Sustainability of Products & Services",
        description: "Our product development process incorporates life-cycle sustainability assessments.",
        tables: [{
          headers: ["Resource", "Usage", "Reduction", "Benefits"],
          rows: [
            { Resource: "Fuel", Usage: "28.5M liters", Reduction: "12%", Benefits: "18% lower carbon" },
            { Resource: "Water", Usage: "185,000 m³", Reduction: "10%", Benefits: "Better management" }
          ],
          keyField: "Resource"
        }],
        subsections: [{
          title: "Sustainable Initiatives",
          content: [
            "Installed solar panels across 8 facilities",
            "Reduced packaging waste by 25%",
            "40% modal shift from road to rail"
          ]
        }]
      },
      principle3: {
        title: "Principle 3: Employee Well-being",
        description: "We prioritize health, safety, and professional development of our employees.",
        tables: [{
          headers: ["Metric", "Value"],
          rows: [
            { Metric: "Training hours", Value: "32.5 hrs/employee" },
            { Metric: "Safety incidents", Value: "LTIFR: 0.25" }
          ],
          keyField: "Metric"
        }]
      },
      principle4: {
        title: "Principle 4: Stakeholder Engagement",
        description: "We maintain structured engagement with all stakeholder groups.",
        tables: [{
          headers: ["Stakeholder", "Engagement", "Outcomes"],
          rows: [
            { Stakeholder: "Communities", Engagement: "Advisory panels", Outcomes: "Reduced complaints" },
            { Stakeholder: "Suppliers", Engagement: "Training", Outcomes: "Improved compliance" }
          ]
        }]
      },
      principle5: {
        title: "Principle 5: Human Rights",
        description: "Our commitment extends across our entire value chain.",
        highlights: [
          "100% supplier compliance with human rights code",
          "16,450 hours of human rights training"
        ]
      },
      principle6: {
        title: "Principle 6: Environmental Responsibility",
        description: "Comprehensive environmental management systems in place.",
        tables: [{
          headers: ["Parameter", "Current", "Change"],
          rows: [
            { Parameter: "GHG Emissions", Current: "128,500 tCO₂e", Change: "-10%" },
            { Parameter: "Energy Use", Current: "0.42 GJ/ton-km", Change: "-12.5%" }
          ]
        }]
      },
      principle7: {
        title: "Principle 7: Policy Advocacy",
        description: "We engage in policy advocacy to promote sustainability.",
        highlights: [
          "Active in industry coalitions",
          "Contributed to 3 policy white papers"
        ]
      },
      principle8: {
        title: "Principle 8: Inclusive Growth",
        description: "Our CSR programs create sustainable livelihoods.",
        tables: [{
          headers: ["Program", "Beneficiaries", "Impact"],
          rows: [
            { Program: "Skills Training", Beneficiaries: "3,850", Impact: "68% employment" },
            { Program: "Women in Logistics", Beneficiaries: "485", Impact: "82% employed" }
          ]
        }]
      },
      principle9: {
        title: "Principle 9: Customer Value",
        description: "We provide sustainable solutions that create value.",
        highlights: [
          "Customer satisfaction: 4.6/5",
          "94.5% client retention rate"
        ],
        tables: [{
          headers: ["Metric", "Performance"],
          rows: [
            { Metric: "On-time delivery", Performance: "96.8%" },
            { Metric: "Complaint resolution", Performance: "98.2%" }
          ]
        }]
      }
    };
  };
  