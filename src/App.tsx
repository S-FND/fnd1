
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

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

const queryClient = new QueryClient();

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/esg" element={<ESGPage />} />
            <Route path="/ghg" element={<GHGPage />} />
            <Route path="/personal-ghg" element={<PersonalGHGPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/lms" element={<LMSPage />} />
            <Route path="/units" element={<UnitsPage />} />
            
            {/* EHS Trainings routes */}
            <Route path="/ehs-trainings" element={<EHSTrainingsPage />} />
            <Route path="/ehs-trainings/:trainingId" element={<EHSTrainingDetails />} />
            
            {/* Audit routes */}
            <Route path="/audit" element={<AuditDashboardPage />} />
            <Route path="/audit/checklist" element={<AuditChecklistPage />} />
            
            {/* Supplier routes */}
            <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
            <Route path="/supplier/audit/:auditId" element={<SupplierAuditResponsePage />} />
            
            {/* Vendor routes */}
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/trainings" element={<VendorTrainings />} />
            <Route path="/vendor/bids" element={<VendorBids />} />
            <Route path="/vendor/bid/:trainingId" element={<VendorBidForm />} />
            <Route path="/vendor/profile" element={<VendorProfile />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
