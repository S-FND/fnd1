
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

      const rolePermissions = defaultPermissions[user.role] || {};
      
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
      } else if (user.role === "fandoro_admin") {
        navigate("/fandoro-admin/dashboard");
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
  const isFandoroAdmin = () => user?.role === "fandoro_admin";

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
    hasReadAccess,
    hasWriteAccess
  };
};
