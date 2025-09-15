import { CompanyFormData } from './companySchema';

// utils/dataMapping.ts

const fieldMapping = {
    user_id:'user_id',
    name: 'company_name',
    legalName: 'legal_name',
    cin: 'cin',
    incorporationDate: 'incorporation_date',
    registeredOffice: 'registered_office',
    corporateOffice: 'head_office',
    email: 'email',
    phone: 'contact_number',
    industry: 'industry',
    website: 'website',
    founded: 'founded',
    financialYear: 'financial_year',
    listedOn: 'listed_on',
    revenue: 'revenue',
    fundingStage: 'funding_stage',
    employeeStrength: 'employee_strength',
  };

  export const mapApiResponseToFormData = (apiResponse: any): CompanyFormData => {
    const mappedData: Partial<CompanyFormData> = {};
  
    for (const [frontendKey, backendKey] of Object.entries(fieldMapping)) {
      mappedData[frontendKey as keyof CompanyFormData] = apiResponse[backendKey] || '';
    }
    // Include _id from the API response (optional field)
    mappedData.user_id = apiResponse?.user_id?._id || '';
    if (apiResponse?.cin) {
      mappedData.entityId = apiResponse?._id;
    }
    return mappedData as CompanyFormData;
  };
  
  export const mapFormDataToApiPayload = (formData: CompanyFormData) => {
    const reversedMapping = Object.fromEntries(
      Object.entries(fieldMapping).map(([frontendKey, backendKey]) => [backendKey, frontendKey])
    );
  
    const apiPayload: Record<string, any> = {};
  
    for (const [backendKey, frontendKey] of Object.entries(reversedMapping)) {
      apiPayload[backendKey] = formData[frontendKey as keyof CompanyFormData];
    }

    // Include _id in the payload if it exists
    if (formData?.user_id) {
        apiPayload.user_id = formData.user_id;
    }
  
    return apiPayload;
  };