
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
import Dashboard from "./pages/Dashboard";
import ESGPage from "./pages/ESG";
import GHGPage from "./pages/GHG";
import PersonalGHGPage from "./pages/PersonalGHG";
import CompliancePage from "./pages/Compliance";
import LMSPage from "./pages/LMS";
import UnitsPage from "./pages/Units";
import EHSTrainingsPage from "./pages/EHSTrainings";
import EHSTrainingDetails from "./pages/EHSTrainingDetails";
import NotFound from "./pages/NotFound";
import AuditDashboardPage from "./pages/audit/AuditDashboardPage";
import AuditChecklistPage from "./pages/audit/AuditChecklistPage";
import SupplierDashboardPage from "./pages/supplier/SupplierDashboardPage";
import SupplierAuditResponsePage from "./pages/supplier/SupplierAuditResponsePage";

// Vendor pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorTrainings from "./pages/vendor/VendorTrainings";
import VendorBids from "./pages/vendor/VendorBids";
import VendorBidForm from "./pages/vendor/VendorBidForm";
import VendorProfile from "./pages/vendor/VendorProfile";

// Fandoro Admin pages
import FandoroAdminDashboardPage from "./pages/fandoro-admin/FandoroAdminDashboardPage";
import EnterprisesPage from "./pages/fandoro-admin/EnterprisesPage";
import ESGCapPage from "./pages/fandoro-admin/ESGCapPage";
import NonCompliancesPage from "./pages/fandoro-admin/NonCompliancesPage";
import ESGRisksPage from "./pages/fandoro-admin/ESGRisksPage";

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
            
            {/* Protected company routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/esg" element={<ProtectedRoute><ESGPage /></ProtectedRoute>} />
            <Route path="/ghg" element={<ProtectedRoute><GHGPage /></ProtectedRoute>} />
            <Route path="/personal-ghg" element={<ProtectedRoute><PersonalGHGPage /></ProtectedRoute>} />
            <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
            <Route path="/lms" element={<ProtectedRoute><LMSPage /></ProtectedRoute>} />
            <Route path="/units" element={<ProtectedRoute><UnitsPage /></ProtectedRoute>} />
            
            {/* EHS Trainings routes */}
            <Route path="/ehs-trainings" element={<ProtectedRoute><EHSTrainingsPage /></ProtectedRoute>} />
            <Route path="/ehs-trainings/:trainingId" element={<ProtectedRoute><EHSTrainingDetails /></ProtectedRoute>} />
            
            {/* Audit routes */}
            <Route path="/audit" element={<ProtectedRoute><AuditDashboardPage /></ProtectedRoute>} />
            <Route path="/audit/checklist" element={<ProtectedRoute><AuditChecklistPage /></ProtectedRoute>} />
            
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
