// services/employeeManagementAPI.ts
import axios from "axios";
import { ENV } from "@/config/env";
const API_URL = ENV.API_URL;

// Get Employee Data
export const fetchEmployeeData = async (userId?: string) => {
  try {
    const url = `${API_URL}/subuser${userId ? `?userid=${userId}` : ''}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employee data:", error);
    throw error;
  }
};

// Update Employee - uses /subuser/activate endpoint
export const updateEmployee = async (employeeData: any) => {
  try {
    const url = `${API_URL}/subuser/activate`;
    
    const response = await axios.post(url, employeeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
        'Content-Type': 'application/json',
      },
    });
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
  
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (axios.isAxiosError(error)) {
      errorMessage = error.message;
    }
  
    console.error("Error updating employee:", errorMessage);
    return [null, errorMessage];
  }
};

// Assign URLs to Employee (role endpoint)
export const assignEmployeeUrls = async (subUserId: string, accessList: string[]) => {
  try {
    const url = `${API_URL}/subuser/role`;
    const response = await axios.post(url, {
      subUserId,
      accessList
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
        'Content-Type': 'application/json',
      },
    });
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
  
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (axios.isAxiosError(error)) {
      errorMessage = error.message;
    }
  
    console.error("Error assigning URLs:", errorMessage);
    return [null, errorMessage];
  }
};

// Get URL List
export const fetchUrlList = async (entityType?: string) => {
  try {
    const url = `${API_URL}/subuser/urlList${entityType ? `?entityType=${entityType}` : ''}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching URL list:", error);
    throw error;
  }
};

// Get User Access URLs
export const fetchUserAccess = async (employeeId: string) => {
  try {
    const url = `${API_URL}/subuser/access?id=${employeeId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user access:", error);
    throw error;
  }
};

// Get Location Data
export const fetchLocationData = async () => {
  try {
    const url = `${API_URL}/company/locations`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
};

// Create New Employee
export const createEmployee = async (employeeData: any) => {
  try {
    const url = `${API_URL}/subuser`;
    const response = await axios.post(url, employeeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
        'Content-Type': 'application/json',
      },
    });
    return [response.data, null];
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";
  
    if (error?.response?.data?.message) {
      const raw = error.response.data.message;
      errorMessage = raw.includes(":") ? raw.split(":").pop()?.trim() : raw;
    } else if (axios.isAxiosError(error)) {
      errorMessage = error.message;
    }
  
    console.error("Error creating employee:", errorMessage);
    return [null, errorMessage];
  }
};