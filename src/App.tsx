
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
import NotFound from "./pages/NotFound";
import AuditDashboardPage from "./pages/audit/AuditDashboardPage";
import AuditChecklistPage from "./pages/audit/AuditChecklistPage";
import SupplierDashboardPage from "./pages/supplier/SupplierDashboardPage";
import SupplierAuditResponsePage from "./pages/supplier/SupplierAuditResponsePage";

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
            
            {/* Audit routes */}
            <Route path="/audit" element={<AuditDashboardPage />} />
            <Route path="/audit/checklist" element={<AuditChecklistPage />} />
            
            {/* Supplier routes */}
            <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
            <Route path="/supplier/audit/:auditId" element={<SupplierAuditResponsePage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
