import axios from "axios";
import { ENV } from "@/config/env";
import {
  mapApiResponseToFormData,
  mapFormDataToApiPayload,
} from "../components/profile/schemas/dataMapping";
import { CompanyFormData } from "../components/profile/schemas/companySchema";

const API_URL = ENV.API_URL;

const getUserEntityId = () => {
  try {
    const user = localStorage.getItem("fandoro-user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser?.entityId || null;
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

const entityId = getUserEntityId();

export const fetchProfileData = async (): Promise<CompanyFormData> => {
  try {
    const response = await axios.get(`${API_URL}/company/entity`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    // Map API response to frontend schema
    return mapApiResponseToFormData(response.data.data);
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw error;
  }
};

export const updateProfileData = async (formData: CompanyFormData) => {
  try {
    // Map frontend data to backend payload
    const apiPayload = mapFormDataToApiPayload(formData);
    // Determine HTTP method based on the presence of user_id in the payload
    const httpMethod = entityId ? "put" : "post";
    const endpoint = `${API_URL}/company/entity`;

    const response = await axios({
      method: httpMethod,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
        "Content-Type": "application/json",
      },
      data: apiPayload,
    });

    if (!response.data.status) {
      throw new Error(response.data.message || "Failed to update company data");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating company data:", error);
    throw error;
  }
};
// Fetch company data and transform it
export const fetchCompanyData = async (): Promise<CompanyFormData> => {
  try {
    const response = await axios.get(`${API_URL}/company/entity`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    // Map API response to frontend schema
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw error;
  }
};

// Update company data and transform it
export const updateCompanyData = async (formData: any) => {
  try {
    const httpMethod = entityId ? "put" : "post";
    const endpoint = `${API_URL}/company/entity`;

    const response = await axios({
      method: httpMethod,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
        "Content-Type": "application/json",
      },
      data: formData,
    });

    if (!response.data.status) {
      throw new Error(response.data.message || "Failed to update company data");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating company data:", error);
    throw error;
  }
};

// Get HR Data
export const fetchHrData = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/company/hr"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw error;
  }
};

// Save or Submit HR Data
export const updateHrData = async (
  // entityId: string,
  payload: any
) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/company/hr`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating HR data:", error);
    throw error;
  }
};

// Get Bo Data
export const fetchBoData = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/document/bo"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

// Save or Submit BO Data
export const updateBoData = async (
  // entityId: string,
  payload: {
    // isDraft: boolean;
    data: any;
  }
) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/document/bo/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating BO data:", error);
    throw error;
  }
};

//fetchfacilitiesData
export const fetchfacilitiesData = async (): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/company/facilities"; // Base path known by the client
    const url = `${API_URL}${baseUrl}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw error;
  }
};

// services/companyApi.ts
// export const fetchComplianceData = async (entityId: string, type: string) => {
//   const response = await fetch(`/api/compliance?entityId=${entityId}&type=${type}`);
//   if (!response.ok) throw new Error(`Failed to fetch ${type} data`);
//   return response.json();
// };

export const fetchComplianceData = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/document/lc"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const updateComplianceData = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/document/lc/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};
//Management
export const fetchManagementData = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/document/ms"; // Base path known by the client updateManagementData
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const updateManagementData = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/document/ms/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};
//IT Security
export const fetchITSecurityData = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/document/it"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};
export const updateITSecurityData = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/document/it/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};
//Facility
export const fetchFacilityData = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/company/facilities"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const updateFacilityData = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/company/facilities/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const fetchHoPhotographs = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/document/ho_photograph"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const updateHoPhotographs = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/document/ho_photograph`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const fetchProductPhotographs = async (
  entityId: string
): Promise<CompanyFormData> => {
  try {
    const baseUrl = "/document/product_photograph"; // Base path known by the client
    const url = `${API_URL}${baseUrl}/${entityId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};

export const updateProductPhotographs = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/document/product_photograph`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Document data:", error);
    throw error;
  }
};