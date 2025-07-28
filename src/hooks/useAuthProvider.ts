import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Permissions } from '@/types/auth';
import { defaultPermissions } from '@/config/permissions';

export const useAuthProvider = () => {
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
      // Bypass actual authentication call and create a mock user based on email
      // This is temporary and will be replaced with real authentication later
      const mockRole = email.includes('admin') ? 'admin' : 
                      email.includes('supplier') ? 'supplier' :
                      email.includes('vendor') ? 'vendor' :
                      email.includes('unit') ? 'unit_admin' :
                      email.includes('manager') ? 'manager' : 'employee';
      
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        role: mockRole as any,
        companyId: '1',
        locationId: '1',
        unitId: mockRole === 'unit_admin' ? '1' : undefined,
        units: mockRole === 'unit_admin' ? [{ id: '1', name: 'Unit 1', location: 'Location 1', city: 'City 1' }] : undefined,
        supplierInfo: mockRole === 'supplier' ? {
          id: '1',
          name: email.includes('eco') ? 'EcoPackaging Solutions Ltd' : 'GreenTech Manufacturing',
          category: email.includes('eco') ? 'Sustainable Packaging' : 'Green Technology',
          contactPerson: email.split('@')[0],
          auditStatus: 'pending'
        } : undefined
      };
      
      const mockToken = 'mock-token-' + Date.now();
      const rolePermissions = defaultPermissions[mockRole] || {};
      
      setUser(mockUser);
      setToken(mockToken);
      setPermissions(rolePermissions);
      localStorage.setItem("fandoro-user", JSON.stringify(mockUser));
      localStorage.setItem("fandoro-token", mockToken);
      localStorage.setItem("fandoro-permissions", JSON.stringify(rolePermissions));
      
      toast.success("Login successful!");
      redirectBasedOnRole(mockRole);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    // Check if there's a redirect from location state
    const from = location.state?.from;
    
    switch(role) {
      case "admin":
      case "manager":
        // Redirect admin and manager to settings by default
        navigate(from || "/settings");
        break;
      case "unit_admin":
        navigate(from || "/unit-admin/dashboard");
        break;
      case "employee":
        navigate(from || "/employee/dashboard");
        break;
      case "supplier":
        navigate(from || "/supplier/dashboard");
        break;
      case "vendor":
        navigate(from || "/vendor/dashboard");
        break;
      default:
        navigate(from || "/settings");
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
  const isFandoroAdmin = () => false; // Always return false since this role is removed
  const isEnterpriseAdmin = () => user?.role === "admin";

  const hasReadAccess = (feature: string) => {
    if (!permissions || !permissions[feature]) return false;
    return Boolean(permissions[feature].read);
  };

  const hasWriteAccess = (feature: string) => {
    if (!permissions || !permissions[feature]) return false;
    return Boolean(permissions[feature].write);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isCompanyUser,
    isEmployeeUser,
    isUnitAdmin,
    isSupplier,
    isVendor,
    isFandoroAdmin,
    isEnterpriseAdmin,
    hasReadAccess,
    hasWriteAccess
  };
};
