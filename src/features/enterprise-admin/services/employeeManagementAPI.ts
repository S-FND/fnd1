// services/employeeManagementAPI.ts
import { httpClient } from '@/lib/httpClient';
import { logger } from "@/hooks/logger";

// Get Employee Data
export const fetchEmployeeData = async (userId?: string) => {
  try {
    const url = `subuser${userId ? `?userid=${userId}` : ''}`;
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    logger.error("Error fetching employee data:", error);
    throw error;
  }
};

// Update Employee - uses /subuser/activate endpoint
export const updateEmployee = async (employeeData: any) => {
  try {
    const url = `subuser/activate`;
    const response = await httpClient.post(url, employeeData);
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
  
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (error.message) {
      errorMessage = error.message;
    }
  
    logger.error("Error updating employee:", errorMessage);
    return [null, errorMessage];
  }
};

// Assign URLs to Employee (role endpoint)
export const assignEmployeeUrls = async (subUserId: string, accessList: string[]) => {
  try {
    const url = `subuser/role`;
    const response = await httpClient.post(url, {
      subUserId,
      accessList
    });
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
  
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (error.message) {
      errorMessage = error.message;
    }
  
    logger.error("Error assigning URLs:", errorMessage);
    return [null, errorMessage];
  }
};

// Get URL List
export const fetchUrlList = async (entityType?: string) => {
  try {
    const url = `subuser/urlList${entityType ? `?entityType=${entityType}` : ''}`;
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    logger.error("Error fetching URL list:", error);
    throw error;
  }
};

// Get User Access URLs
export const fetchUserAccess = async (employeeId: string) => {
  try {
    const url = `subuser/access?id=${employeeId}`;
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    logger.error("Error fetching user access:", error);
    throw error;
  }
};

// Get Location Data
export const fetchLocationData = async () => {
  try {
    const url = `company/locations`;
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    logger.error("Error fetching location data:", error);
    throw error;
  }
};

// Create New Employee
export const createEmployee = async (employeeData: any) => {
  try {
    const url = `subuser`;
    const response = await httpClient.post(url, employeeData);
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
  
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (error.message) {
      errorMessage = error.message;
    }
  
    logger.error("Error creating employee:", errorMessage);
    return [null, errorMessage];
  }
};

// Update user access 
export const updateCompanyFeatures = async (
  entityId: string,
  featurePage: { feature: string; adminEnabled: boolean; url: string }[]
) => {
  try {
    const response: any = await httpClient.post(`auth/feature-access`, {
      entityId,
      featurePage,
    });

    return {
      _id: response?.data?._id,
      companyFeaturePageAccess: response?.data?.companyFeaturePageAccess || [],
    };
  } catch (error) {
    logger.error("Error updating company features:", error);
    throw error;
  }
};

// Delete Employee
export const deleteEmployee = async (employeeId: string) => {
  try {
    const response = await httpClient.delete(`subuser/${employeeId}`);
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
    
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    logger.error("Error deleting employee:", errorMessage);
    return [null, errorMessage];
  }
};