import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Permissions } from '@/types/auth';
import { defaultPermissions } from '@/config/permissions';
import { logger } from './logger';
import { PageAccessContext } from '@/context/PageAccessContext';

export const useAuthProvider = () => {
  const {setPageAccessList,setUserRole,pageAccessList}=useContext(PageAccessContext)
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [token, setToken] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [effectiveCompanyId, setEffectiveCompanyId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isFandoro, setIsFandoro] = useState<boolean>(false);
  const [isCompanyReadOnly, setIsCompanyReadOnly] = useState<boolean>(false);
  // const [isAuthenticated,setIsAuthenticated]=useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  // let isAuthenticated=false;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("fandoro-user");
      const storedPermissions = localStorage.getItem("fandoro-permissions");
      const storedToken = localStorage.getItem("fandoro-token");
  
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
        setEffectiveCompanyId(JSON.parse(storedUser).company_id || '');
      }
  
      if (storedPermissions && storedPermissions !== "undefined") {
        setPermissions(JSON.parse(storedPermissions));
      }
  
      if (storedToken) setToken(storedToken);
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  
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
      const { user, token,access,roleMenu=[] } = data;

      // 👇 Assign _id to companyId if role is company-type and companyId is missing
      if (
        (user.role === 'admin') &&
        !user.companyId
      ) {
        user.companyId = user._id;
      }

      const investorCheck = await fetch(`${import.meta.env.VITE_API_URL}/auth/investor-by-email?email=${encodeURIComponent(user.email)}`);
      const investorData = await investorCheck.json();
      if (investorData.exists) {
        localStorage.setItem("fandoro-admin", investorData.investor.investorEmail);
      }

      const rolePermissions = defaultPermissions[user.role] || {};
      setUser(user);
      setEffectiveCompanyId(user.companyId || user.company_id || '');
      setToken(token);
      setPermissions(rolePermissions);
      localStorage.setItem("fandoro-user", JSON.stringify(user));
      localStorage.setItem("fandoro-token", token);
      localStorage.setItem("fandoro-permissions", JSON.stringify(rolePermissions));
      localStorage.setItem("fandoro-access", JSON.stringify(access));
      logger.debug("Login successful, user:", user);
      setUserRole(user.role);
      if(!user.isParent) {
        logger.debug("Individual user detected, setting roleMenu:", roleMenu);
        localStorage.setItem("fandoro-team-access", JSON.stringify(roleMenu));
        setPageAccessList(roleMenu);
      }
      
      toast.success("Login successful!");
      redirectBasedOnRole(user.role);
    } catch (error) {
      logger.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    // Check if there's a redirect from location state
    const from = location.state?.from;
    let employeeNavigateUrl = "/employee/dashboard"; // Default for employee
    if(role == 'employee'){
      let teamAccess = localStorage.getItem("fandoro-team-access");
      if(teamAccess){
        let teamAccessList = JSON.parse(teamAccess);
        let dashboardAccess = teamAccessList.find((item) => item.accessLevel !== 'no_access' && item.url && item.url !== 'N/A');
        if(dashboardAccess && dashboardAccess.url){
          employeeNavigateUrl = dashboardAccess.url;
        }
      }
    }

      const investorEmailStored = localStorage.getItem("fandoro-admin");
      const isInvestorEmailExists = !!investorEmailStored;
    
    switch(role) {
      case "fandoro_admin":
        navigate("/fandoro-admin/dashboard");
        break;
      case "admin":
        if (isInvestorEmailExists) {
          navigate("/esg-dd/cap");
        } else {
          navigate("/company");
        }
        break;
      case "manager":
        // Redirect admin and manager to settings by default
        navigate(from || "/company");
        break;
      case "unit_admin":
        navigate(from || "/unit-admin/dashboard");
        break;
      case "employee":
        navigate(from || employeeNavigateUrl);
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
    setUserRole(null);
    setPageAccessList([]);
    setUser(null);
    setToken(null);
    setPermissions({});
    localStorage.clear();
    localStorage.removeItem("fandoro-user");
    localStorage.removeItem("fandoro-token");
    localStorage.removeItem("fandoro-permissions");
    toast.info("You have been logged out");
    // navigate("/");
    setTimeout(() => navigate("/"), 0);
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

  const isAuthenticatedStatus = (roles: string[]) => {
    let storedUser: User | null = null;
  
    try {
      const data = localStorage.getItem("fandoro-user");
      if (data && data !== "undefined") {
        storedUser = JSON.parse(data);
      }
    } catch {}
  
    const storedToken = localStorage.getItem("fandoro-token");
  
    if (storedUser && storedToken) {
      if (roles?.length > 0) {
        return roles.includes(storedUser.role);
      }
      return true;
    }
  
    return false;
  };

  useEffect(() => {
    try {
      const data = localStorage.getItem("fandoro-user");
      if (data && data !== "undefined") {
        setUser(JSON.parse(data));
      }
    } catch {}
  
    setIsLoading(false);
  }, []);

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
    isAuthenticatedStatus,
    companyName, effectiveCompanyId, isAdmin, isFandoro, isCompanyReadOnly
  };
};