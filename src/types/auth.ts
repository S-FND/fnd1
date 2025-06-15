
export type UserRole = "fandoro_admin" | "admin" | "manager" | "employee" | "unit_admin" | "supplier" | "vendor";

export interface CompanyUnit {
  id: string;
  name: string;
  location: string;
  city: string;
}

export interface SupplierInfo {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  auditStatus?: "pending" | "in_progress" | "completed";
}

export interface VendorInfo {
  id: string;
  companyName: string;
  specialties: string[];
}

export interface CompanyInfo {
  id: string;
  name: string;
  fundingStage?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  locationId: string;
  unitId?: string;
  units?: CompanyUnit[];
  company?: CompanyInfo;
  supplierInfo?: SupplierInfo;
  vendorInfo?: VendorInfo;
}

export interface Permissions {
  [feature: string]: {
    read: boolean;
    write: boolean;
  }
}

export interface AuthContextType {
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
  isFandoroAdmin: () => boolean;
  isEnterpriseAdmin: () => boolean;
  hasReadAccess: (feature: string) => boolean;
  hasWriteAccess: (feature: string) => boolean;
}
