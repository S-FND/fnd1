
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UserRole = "admin" | "manager" | "employee" | "unit_admin";

interface CompanyUnit {
  id: string;
  name: string;
  location: string;
  city: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  locationId: string;
  unitId?: string;
  units?: CompanyUnit[]; // For company admins who can access multiple units
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isCompanyUser: () => boolean;
  isEmployeeUser: () => boolean;
  isUnitAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("fandoro-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - would connect to backend in production
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock authentication logic (replace with actual auth in production)
      if (email && password) {
        let role: UserRole = "employee";
        let units: CompanyUnit[] = [];
        let unitId: string | undefined = undefined;
        
        if (email.includes("admin")) {
          role = "admin";
          // Mock company units for admin users
          units = [
            { id: "unit-1", name: "Manufacturing Plant", location: "Mumbai", city: "Mumbai" },
            { id: "unit-2", name: "R&D Center", location: "Bangalore", city: "Bangalore" },
            { id: "unit-3", name: "Sales Office", location: "Delhi", city: "New Delhi" }
          ];
        } else if (email.includes("manager")) {
          role = "manager";
        } else if (email.includes("unit")) {
          role = "unit_admin";
          unitId = "unit-1";
        }
        
        const user = {
          id: `user-${Date.now()}`,
          name: email.split("@")[0],
          email,
          role,
          companyId: "comp-1",
          locationId: "loc-1",
          unitId,
          units: role === "admin" || role === "manager" ? units : undefined
        };
        
        setUser(user);
        localStorage.setItem("fandoro-user", JSON.stringify(user));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fandoro-user");
    toast.info("You have been logged out");
    navigate("/login");
  };

  // Helper functions to check user roles
  const isCompanyUser = () => {
    return user?.role === "admin" || user?.role === "manager" || user?.role === "unit_admin";
  };

  const isEmployeeUser = () => {
    return user?.role === "employee";
  };

  const isUnitAdmin = () => {
    return user?.role === "unit_admin";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user,
      isCompanyUser,
      isEmployeeUser,
      isUnitAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
