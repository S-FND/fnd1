import axios from "axios";
import { ENV } from "@/config/env";
const API_URL = ENV.API_URL;

// Get Team Data
export const fetchTeamData = async () => {
  try {
    const url = `${API_URL}/subuser`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ESG DD report:", error);
    throw error;
  }
};

  // Create New Team member
  export const createTeam = async (params: any) => {
    try {
      const url = `${API_URL}/subuser`;
      const response = await axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
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
  
      console.error("Error creating location:", errorMessage);
      return [null, errorMessage];
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
      console.error("Error fetching ESG DD report:", error);
      throw error;
    }
  };

  // Create New Location
export const createLocation = async (params: any) => {
    try {
      const url = `${API_URL}/company/locations`;
      const response = await axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
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
  
      console.error("Error creating location:", errorMessage);
      return [null, errorMessage];
    }
  };

  // Get Subsidiary
export const fetchSubsidiaries = async () => {
  try {
    const url = `${API_URL}/company/subsidiary-company`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching ESG DD report:", error);
    throw error;
  }
};

// Create New Subsidiary
export const createSubsidiary = async (params: any) => {
  try {
    const url = `${API_URL}/company/subsidiary-company`;
    const response = await axios.post(url, params, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
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

    console.error("Error creating location:", errorMessage);
    return [null, errorMessage];
  }
};