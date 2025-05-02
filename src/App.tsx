
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnhancedDashboard from './pages/EnhancedDashboard';
import Compliance from './pages/Compliance';
import Units from './pages/Units';
import NotFound from './pages/NotFound';
import EHSTrainings from './pages/EHSTrainings';
import EHSTrainingDetails from './pages/EHSTrainingDetails';
import EnhancedEmployeeDashboard from './pages/EnhancedEmployeeDashboard';
import AuditDashboardPage from './pages/audit/AuditDashboardPage';
import AuditChecklistPage from './pages/audit/AuditChecklistPage';
import SupplierDashboardPage from './pages/supplier/SupplierDashboardPage';
import SupplierAuditResponsePage from './pages/supplier/SupplierAuditResponsePage';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorBids from './pages/vendor/VendorBids';
import VendorBidForm from './pages/vendor/VendorBidForm';
import VendorTrainings from './pages/vendor/VendorTrainings';
import FandoroAdminDashboardPage from './pages/fandoro-admin/FandoroAdminDashboardPage';
import EnterprisesPage from './pages/fandoro-admin/EnterprisesPage';
import ESGCapPage from './pages/fandoro-admin/ESGCapPage';
import NonCompliancesPage from './pages/fandoro-admin/NonCompliancesPage';
import ESGRisksPage from './pages/fandoro-admin/ESGRisksPage';
import ESGPage from './features/enterprise-admin/pages/ESG';
import GHGPage from './features/enterprise-admin/pages/GHG';
import EmployeeDashboardPage from './features/employee/pages/Dashboard';
import MaterialityPage from './features/enterprise-admin/pages/Materiality';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Company / Enterprise Admin Routes */}
      <Route path="/dashboard" element={<EnhancedDashboard />} />
      <Route path="/materiality" element={<MaterialityPage />} />
      <Route path="/esg" element={<ESGPage />} />
      <Route path="/ghg" element={<GHGPage />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/units" element={<Units />} />
      <Route path="/ehs-trainings" element={<EHSTrainings />} />
      <Route path="/ehs-trainings/:id" element={<EHSTrainingDetails />} />
      <Route path="/audit" element={<AuditDashboardPage />} />
      <Route path="/audit/:id" element={<AuditChecklistPage />} />
      
      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
      <Route path="/personal-dashboard" element={<EnhancedEmployeeDashboard />} />
      
      {/* Supplier Routes */}
      <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
      <Route path="/supplier/audit-response/:id" element={<SupplierAuditResponsePage />} />
      
      {/* Vendor Routes */}
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/profile" element={<VendorProfile />} />
      <Route path="/vendor/bids" element={<VendorBids />} />
      <Route path="/vendor/bids/new" element={<VendorBidForm />} />
      <Route path="/vendor/trainings" element={<VendorTrainings />} />
      
      {/* Fandoro Admin Routes */}
      <Route path="/fandoro-admin/dashboard" element={<FandoroAdminDashboardPage />} />
      <Route path="/fandoro-admin/enterprises" element={<EnterprisesPage />} />
      <Route path="/fandoro-admin/esg-cap" element={<ESGCapPage />} />
      <Route path="/fandoro-admin/non-compliances" element={<NonCompliancesPage />} />
      <Route path="/fandoro-admin/esg-risks" element={<ESGRisksPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
