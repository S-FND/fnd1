
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
import ESGPage from './features/enterprise-admin/pages/ESG';
import EmployeeDashboardPage from './features/employee/pages/Dashboard';
import MaterialityPage from './features/enterprise-admin/pages/Materiality';
import PersonalGHGPage from './features/employee/pages/PersonalGHG';
import GHGAccountingPage from './features/enterprise-admin/pages/GHGAccounting';
import UnitGHGAccountingPage from './features/unit-admin/components/ghg/UnitGHGAccountingPage';
import ESGDueDiligencePage from './features/enterprise-admin/pages/ESGDueDiligence';
import ESGCapPage from './features/enterprise-admin/pages/ESGCap';

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
      <Route path="/esg-due-diligence" element={<ESGDueDiligencePage />} />
      <Route path="/esg-cap" element={<ESGCapPage />} />
      <Route path="/ghg-accounting" element={<GHGAccountingPage />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/units" element={<Units />} />
      <Route path="/ehs-trainings" element={<EHSTrainings />} />
      <Route path="/ehs-trainings/:id" element={<EHSTrainingDetails />} />
      <Route path="/audit" element={<AuditDashboardPage />} />
      <Route path="/audit/:id" element={<AuditChecklistPage />} />
      
      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
      <Route path="/personal-dashboard" element={<EnhancedEmployeeDashboard />} />
      <Route path="/personal-ghg" element={<PersonalGHGPage />} />
      
      {/* Unit Admin Routes */}
      <Route path="/unit/ghg-accounting" element={<UnitGHGAccountingPage />} />
      
      {/* Supplier Routes */}
      <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
      <Route path="/supplier/audit-response/:id" element={<SupplierAuditResponsePage />} />
      
      {/* Vendor Routes */}
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/profile" element={<VendorProfile />} />
      <Route path="/vendor/bids" element={<VendorBids />} />
      <Route path="/vendor/bids/new" element={<VendorBidForm />} />
      <Route path="/vendor/trainings" element={<VendorTrainings />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
