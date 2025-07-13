import axios from "axios";
import { ENV } from "@/config/env";
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


// Get ESG DD Report
export const fetchEsgDDReport = async (entityId: string) => {
  try {
    const url = `${API_URL}/company/entity/esdd-report/${entityId}`;
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
// Get ESG CAP
export const fetchEsgCap = async (entityId: string) => {
    try {
      const url = `${API_URL}/esgdd/escap/${entityId}`;
    //   const url = `http://stage-enterprise-api.fandoro.com/esgdd/escap/${entityId}`;
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
// Post ESG CAP
export const esgddChangePlan = async (
    payload: any
) => {
    try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/esgdd/escap/change-request`, payload, {
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
export const esgddAcceptPlan = async (
    payload: any
) => {
    try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/esgdd/escap/accept-plan`, payload, {
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
export const updatePlan = async (
    payload: any
) => {
    try {
    const token = localStorage.getItem("fandoro-token");

    const response = await axios.post(`${API_URL}/esgdd/escap/update-plan-details`, payload, {
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