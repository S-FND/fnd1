import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { isUndefined } from "util";

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
  _id: string;
  entityId:string
  name: string;
  email: string;
  role: UserRole;
  isParent:boolean;
  companyId?: string;
  locationId?: string;
  unitId?: string;
  units?: CompanyUnit[];
  supplierInfo?: SupplierInfo;
  vendorInfo?: VendorInfo;
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
  hasReadAccess: (feature: string) => boolean;
  hasWriteAccess: (feature: string) => boolean;
}

interface Permissions {
  [feature: string]: {
    read: boolean;
    write: boolean;
  }
}

const defaultPermissions: Record<UserRole, Permissions> = {
  admin: {
    dashboard: { read: true, write: true },
    esg: { read: true, write: true },
    ghg: { read: true, write: true },
    compliance: { read: true, write: true },
    lms: { read: true, write: true },
    units: { read: true, write: true },
    'ehs-trainings': { read: true, write: true },
    audit: { read: true, write: true },
    team: { read: true, write: true },
    settings: { read: true, write: true }
  },
  manager: {
    dashboard: { read: true, write: true },
    esg: { read: true, write: true },
    ghg: { read: true, write: true },
    compliance: { read: true, write: true },
    lms: { read: true, write: true },
    'ehs-trainings': { read: true, write: false },
    audit: { read: true, write: true },
    team: { read: true, write: true },
    settings: { read: true, write: false }
  },
  unit_admin: {
    dashboard: { read: true, write: false },
    esg: { read: true, write: false },
    ghg: { read: true, write: true },
    compliance: { read: true, write: false },
    lms: { read: true, write: false },
    'ehs-trainings': { read: true, write: false },
    team: { read: true, write: true },
    settings: { read: true, write: false }
  },
  employee: {
    dashboard: { read: true, write: false },
    'personal-ghg': { read: true, write: true },
    lms: { read: true, write: false },
    'ehs-trainings': { read: true, write: false },
    settings: { read: true, write: false }
  },
  supplier: {
    dashboard: { read: true, write: false },
    'supplier-audit': { read: true, write: true },
    settings: { read: true, write: false }
  },
  vendor: {
    dashboard: { read: true, write: false },
    trainings: { read: true, write: false },
    bids: { read: true, write: true },
    profile: { read: true, write: true },
    settings: { read: true, write: false }
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("fandoro-user");
    const storedPermissions = localStorage.getItem("fandoro-permissions");
    const storedToken = localStorage.getItem("fandoro-token");
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPermissions) setPermissions(JSON.parse(storedPermissions));
    if (storedToken) setToken(storedToken);
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      const { user, token } = data;

      const rolePermissions = defaultPermissions[user.role as UserRole] || {};
      
      setUser(user);
      setToken(token);
      setPermissions(rolePermissions);
      localStorage.setItem("fandoro-user", JSON.stringify(user));
      localStorage.setItem("fandoro-token", token);
      localStorage.setItem("fandoro-permissions", JSON.stringify(rolePermissions));
      toast.success("Login successful!");

      if (user.role === "supplier") {
        navigate("/supplier/dashboard");
      } else if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/dashboard");
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
    setToken(null);
    setPermissions({});
    localStorage.removeItem("fandoro-user");
    localStorage.removeItem("fandoro-token");
    localStorage.removeItem("fandoro-permissions");
    toast.info("You have been logged out");
    navigate("/login");
  };

  const isCompanyUser = () => user?.role === "admin" || user?.role === "manager" || user?.role === "unit_admin";
  const isEmployeeUser = () => user?.role === "employee";
  const isUnitAdmin = () => user?.role === "unit_admin";
  const isSupplier = () => user?.role === "supplier";
  const isVendor = () => user?.role === "vendor";
  const isAuthenticatedStatus=()=>Object.keys(JSON.parse(localStorage.getItem("fandoro-user"))).length>0

  const hasReadAccess = (feature: string) => {
    if (!permissions || !permissions[feature]) return false;
    return Boolean(permissions[feature].read);
  };
  const hasWriteAccess = (feature: string) => {
    if (!permissions || !permissions[feature]) return false;
    return Boolean(permissions[feature].write);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: isAuthenticatedStatus(),
      isCompanyUser,
      isEmployeeUser,
      isUnitAdmin,
      isSupplier,
      isVendor,
      hasReadAccess,
      hasWriteAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
