import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Permissions } from '@/types/auth';
import { defaultPermissions } from '@/config/permissions';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [token, setToken] = useState<string | null>(null);
  // const [isAuthenticated,setIsAuthenticated]=useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  // let isAuthenticated=false;

  useEffect(() => {
    const storedUser = localStorage.getItem("fandoro-user");
    const storedPermissions = localStorage.getItem("fandoro-permissions");
    const storedToken = localStorage.getItem("fandoro-token");
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPermissions) setPermissions(JSON.parse(storedPermissions));
    if (storedToken) setToken(storedToken);
    setIsLoading(false);
  }, []);
  
  // useEffect(()=>{
  //   console.log("User is here not null",user)
  // },[user])

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL+"/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok || !data.status || !data.user) {
        toast.error(data.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }
      const { user, token,access } = data;

      // 👇 Assign _id to companyId if role is company-type and companyId is missing
      if (
        (user.role === 'admin') &&
        !user.companyId
      ) {
        user.companyId = user._id;
      }

      const rolePermissions = defaultPermissions[user.role] || {};
      setUser(user);
      setToken(token);
      setPermissions(rolePermissions);
      localStorage.setItem("fandoro-user", JSON.stringify(user));
      localStorage.setItem("fandoro-token", token);
      localStorage.setItem("fandoro-permissions", JSON.stringify(rolePermissions));
      localStorage.setItem("fandoro-access", JSON.stringify(access));
      
      toast.success("Login successful!");
      redirectBasedOnRole(user.role);
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
      case "fandoro_admin":
        navigate("/fandoro-admin/dashboard");
        break;
      case "admin":
        navigate(from || "/company"); 
        break;
      case "manager":
        // Redirect admin and manager to settings by default
        navigate(from || "/company");
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
      case "StakeHolder":
        navigate("/stakeholders/dashboard")
      default:
        navigate(from || "/settings");
    }
  };

  const logout = () => {
    // alert("Log out")
    setUser(null);
    setToken(null);
    setPermissions({});
    localStorage.clear();
    localStorage.removeItem("fandoro-user");
    localStorage.removeItem("fandoro-token");
    localStorage.removeItem("fandoro-permissions");
    toast.info("You have been logged out");
    navigate("/");
  };

  const isCompanyUser = () => user?.role === "admin" || user?.role === "manager" || user?.role === "unit_admin";
  const isEmployeeUser = () => user?.role === "employee";
  const isUnitAdmin = () => user?.role === "unit_admin";
  const isSupplier = () => user?.role === "supplier";
  const isVendor = () => user?.role === "vendor";
  const isFandoroAdmin = () => user?.role === "fandoro_admin";
  const isEnterpriseAdmin = () => user?.role === "admin";

  const hasReadAccess = (feature: string) => {
    if (!permissions || !permissions[feature]) return false;
    return Boolean(permissions[feature].read);
  };

  const hasWriteAccess = (feature: string) => {
    if (!permissions || !permissions[feature]) return false;
    return Boolean(permissions[feature].write);
  };

  const isAuthenticatedStatus=(roles:string[])=>{
    const storedUser:User = JSON.parse(localStorage.getItem("fandoro-user"));
    const storedPermissions = localStorage.getItem("fandoro-permissions");
    const storedToken = localStorage.getItem("fandoro-token");
    // console.log('storedUser',storedUser)
    // console.log('storedUser role',storedUser.role)
    if(storedUser && storedToken ){
      if(roles && roles.length>0){
        if(roles.includes(storedUser.role)){
          setIsLoading(false)
          return true;
        }
        else{
          setIsLoading(false)
          return false;
        }
      }
      else{
      setIsLoading(false)
      return true;
      }
    }
    else{
      return false;
    }
  }

  useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem("fandoro-user")))
    setIsLoading(false)
  },[])

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
    hasWriteAccess,
    isAuthenticatedStatus
  };
};