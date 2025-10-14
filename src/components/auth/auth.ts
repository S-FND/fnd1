import axios from "axios";
import { ENV } from "@/config/env";
import { logger } from "@/hooks/logger";

const API_URL = ENV.API_URL;

// Type definitions
interface User {
  id: number;
  email: string;
  first_name: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status?: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Helper functions
const getAuthHeader = () => {
  const token = localStorage.getItem("fandoro-token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const handleApiError = (error: unknown): ApiResponse<never> => {
  if (axios.isAxiosError(error)) {
    logger.error("API Error:", error.response?.data || error.message);
    return {
      error: error.response?.data?.message || error.message,
      status: false,
    };
  }
  logger.error("Unexpected error:", error);
  return {
    error: "An unexpected error occurred",
    status: false,
  };
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  entityType: string;
  isInvestor: boolean;
  termsAccepted: boolean;
}): Promise<ApiResponse<User>> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: {
        Accept: "application/json",
        Authorization: "Basic fandoro",
      },
    });
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email }, {
      headers: {
        Accept: "application/json",
        Authorization: "Basic fandoro",
      },
    });
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyOtp = async (email: string, otp: string): Promise<ApiResponse<{ verified: boolean }>> => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp }, {
      headers: {
        Accept: "application/json",
        Authorization: "Basic fandoro",
      },
    });
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  password: string
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/reset-password`,
      { email, otp, password },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Basic fandoro",
        },
      }
    );
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyEmail = async (
  email: string,
  emailVerified: boolean
): Promise<ApiResponse<{ verified: boolean }>> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify-email`,
      { email, emailVerified },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Basic fandoro",
        },
      }
    );
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyEmailOtp = async (
  email: string,
  otp: string,
  emailVerified: boolean
): Promise<ApiResponse<{ verified: boolean }>> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify-email-otp`,
      { email, otp, emailVerified },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Basic fandoro",
        },
      }
    );
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const checkBlockedStatus = async (email: string): Promise<ApiResponse<{ blocked: boolean }>> => {
  try {
    const response = await axios.post(`${API_URL}/auth/blocked-status`, { email });
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

// Token management
export const refreshToken = async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = async (): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, getAuthHeader());
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

// User management
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());
    return { data: response.data, status: true };
  } catch (error) {
    return handleApiError(error);
  }
};