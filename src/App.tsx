
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { Suspense, ReactNode } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";

// Enterprise Admin Pages
import EnterpriseAdminDashboardPage from "./features/enterprise-admin/pages/Dashboard";
import ESGPage from "./pages/ESG";
import GHGPage from "./pages/GHG";
import CompliancePage from "./pages/Compliance";
import LMSPage from "./pages/LMS";
import UnitsPage from "./pages/Units";
import EHSTrainingsPage from "./pages/EHSTrainings";
import EHSTrainingDetails from "./pages/EHSTrainingDetails";
import NotFound from "./pages/NotFound";
import AuditDashboardPage from "./pages/audit/AuditDashboardPage";
import AuditChecklistPage from "./pages/audit/AuditChecklistPage";

// Employee Pages
import EmployeeDashboardPage from "./features/employee/pages/Dashboard";
import PersonalGHGPage from "./pages/PersonalGHG";

// Unit Admin Pages
import UnitAdminDashboardPage from "./features/unit-admin/pages/Dashboard";

// Supplier pages
import SupplierDashboardPage from "./features/supplier/pages/Dashboard";
import SupplierAuditResponsePage from "./pages/supplier/SupplierAuditResponsePage";

// Vendor pages
import VendorDashboard from "./features/vendor/pages/Dashboard";
import VendorTrainings from "./pages/vendor/VendorTrainings";
import VendorBids from "./pages/vendor/VendorBids";
import VendorBidForm from "./pages/vendor/VendorBidForm";
import VendorProfile from "./pages/vendor/VendorProfile";

// Fandoro Admin pages
import FandoroAdminDashboardPage from "./features/fandoro-admin/pages/Dashboard";
import EnterprisesPage from "./features/fandoro-admin/pages/Enterprises";
import ESGCapPage from "./features/fandoro-admin/pages/ESGCap";
import NonCompliancesPage from "./features/fandoro-admin/pages/NonCompliances";
import ESGRisksPage from "./features/fandoro-admin/pages/ESGRisks";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Enterprise/Company Admin routes */}
            <Route path="/dashboard" element={<ProtectedRoute><EnterpriseAdminDashboardPage /></ProtectedRoute>} />
            <Route path="/esg" element={<ProtectedRoute><ESGPage /></ProtectedRoute>} />
            <Route path="/ghg" element={<ProtectedRoute><GHGPage /></ProtectedRoute>} />
            <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
            <Route path="/lms" element={<ProtectedRoute><LMSPage /></ProtectedRoute>} />
            <Route path="/units" element={<ProtectedRoute><UnitsPage /></ProtectedRoute>} />
            
            {/* EHS Trainings routes */}
            <Route path="/ehs-trainings" element={<ProtectedRoute><EHSTrainingsPage /></ProtectedRoute>} />
            <Route path="/ehs-trainings/:trainingId" element={<ProtectedRoute><EHSTrainingDetails /></ProtectedRoute>} />
            
            {/* Audit routes */}
            <Route path="/audit" element={<ProtectedRoute><AuditDashboardPage /></ProtectedRoute>} />
            <Route path="/audit/checklist" element={<ProtectedRoute><AuditChecklistPage /></ProtectedRoute>} />
            
            {/* Employee routes */}
            <Route path="/employee/dashboard" element={<ProtectedRoute><EmployeeDashboardPage /></ProtectedRoute>} />
            <Route path="/personal-ghg" element={<ProtectedRoute><PersonalGHGPage /></ProtectedRoute>} />
            
            {/* Unit Admin routes */}
            <Route path="/unit-admin/dashboard" element={<ProtectedRoute><UnitAdminDashboardPage /></ProtectedRoute>} />
            
            {/* Supplier routes */}
            <Route path="/supplier/dashboard" element={<ProtectedRoute><SupplierDashboardPage /></ProtectedRoute>} />
            <Route path="/supplier/audit/:auditId" element={<ProtectedRoute><SupplierAuditResponsePage /></ProtectedRoute>} />
            
            {/* Vendor routes */}
            <Route path="/vendor/dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/trainings" element={<ProtectedRoute><VendorTrainings /></ProtectedRoute>} />
            <Route path="/vendor/bids" element={<ProtectedRoute><VendorBids /></ProtectedRoute>} />
            <Route path="/vendor/bid/:trainingId" element={<ProtectedRoute><VendorBidForm /></ProtectedRoute>} />
            <Route path="/vendor/profile" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
            
            {/* Fandoro Admin routes */}
            <Route path="/fandoro-admin/dashboard" element={<ProtectedRoute><FandoroAdminDashboardPage /></ProtectedRoute>} />
            <Route path="/fandoro-admin/enterprises" element={<ProtectedRoute><EnterprisesPage /></ProtectedRoute>} />
            <Route path="/fandoro-admin/esg-cap" element={<ProtectedRoute><ESGCapPage /></ProtectedRoute>} />
            <Route path="/fandoro-admin/non-compliances" element={<ProtectedRoute><NonCompliancesPage /></ProtectedRoute>} />
            <Route path="/fandoro-admin/esg-risks" element={<ProtectedRoute><ESGRisksPage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
