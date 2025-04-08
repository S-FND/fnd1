
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UserRole = "admin" | "manager" | "employee" | "unit_admin" | "supplier" | "vendor";

interface CompanyUnit {
  id: string;
  name: string;
  location: string;
  city: string;
}

interface SupplierInfo {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  auditStatus?: "pending" | "in_progress" | "completed";
}

interface VendorInfo {
  id: string;
  companyName: string;
  specialties: string[];
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
  supplierInfo?: SupplierInfo; // For supplier users
  vendorInfo?: VendorInfo; // For vendor users
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
  isSupplier: () => boolean;
  isVendor: () => boolean;
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
        let supplierInfo: SupplierInfo | undefined = undefined;
        let vendorInfo: VendorInfo | undefined = undefined;
        
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
        } else if (email.includes("supplier")) {
          role = "supplier";
          supplierInfo = {
            id: `supplier-${Date.now()}`,
            name: email.includes("eco") ? "EcoPackaging Solutions" : 
                  email.includes("green") ? "GreenTech Materials" : "Sustainable Logistics Inc",
            category: email.includes("eco") ? "Packaging" : 
                     email.includes("green") ? "Raw Materials" : "Logistics",
            contactPerson: email.split("@")[0],
            auditStatus: "pending"
          };
        } else if (email.includes("vendor")) {
          role = "vendor";
          vendorInfo = {
            id: email.includes("vendor1") ? "vendor-1" : "vendor-2",
            companyName: email.includes("vendor1") ? "SafetyFirst Training Ltd." : "EHS Excellence Corp",
            specialties: email.includes("vendor1") 
              ? ["Chemical Handling", "Fire Safety", "Emergency Response"]
              : ["Workplace Safety", "Environmental Compliance", "Risk Assessment"]
          };
        }
        
        const user = {
          id: `user-${Date.now()}`,
          name: email.split("@")[0],
          email,
          role,
          companyId: "comp-1",
          locationId: "loc-1",
          unitId,
          units: role === "admin" || role === "manager" ? units : undefined,
          supplierInfo: role === "supplier" ? supplierInfo : undefined,
          vendorInfo: role === "vendor" ? vendorInfo : undefined
        };
        
        setUser(user);
        localStorage.setItem("fandoro-user", JSON.stringify(user));
        toast.success("Login successful!");
        
        // Redirect based on role
        if (role === "supplier") {
          navigate("/supplier/dashboard");
        } else if (role === "vendor") {
          navigate("/vendor/dashboard");
        } else {
          navigate("/dashboard");
        }
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
  
  const isSupplier = () => {
    return user?.role === "supplier";
  };

  const isVendor = () => {
    return user?.role === "vendor";
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
      isUnitAdmin,
      isSupplier,
      isVendor
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
