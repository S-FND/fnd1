
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FeaturesProvider } from '@/context/FeaturesContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
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
import ESGDDPage from './features/enterprise-admin/pages/ESGDD';
import ESGDDReportsPage from './features/enterprise-admin/pages/ESGDDReports';
import ManualESGDDPage from './features/enterprise-admin/pages/ManualESGDD';
import AutomatedESGDDPage from './features/enterprise-admin/pages/AutomatedESGDD';
import ESGCapPage from './features/enterprise-admin/pages/ESGCap';
import IRLPage from './features/enterprise-admin/pages/IRLPage';
import ReportsPage from './features/enterprise-admin/pages/Reports';
import BRSRReport from './features/enterprise-admin/pages/BRSRReport';
import GRIReport from './features/enterprise-admin/pages/GRIReport';
import TCFDReport from './features/enterprise-admin/pages/TCFDReport';
import ImpactReport from './features/enterprise-admin/pages/ImpactReport';
import StakeholdersOverviewPage from './features/enterprise-admin/pages/stakeholders/StakeholdersOverviewPage';
import ManageStakeholdersPage from './features/enterprise-admin/pages/stakeholders/ManageStakeholdersPage';
import CategoriesPage from './features/enterprise-admin/pages/stakeholders/CategoriesPage';
import EngagementPlanPage from './features/enterprise-admin/pages/stakeholders/EngagementPlanPage';
import ESGManagementPage from './features/enterprise-admin/pages/ESGManagement';
import TeamManagementPage from './features/enterprise-admin/pages/TeamManagement';
import CompanyProfilePage from './pages/CompanyProfile';
import FeatureManagementPage from './pages/FeatureManagement';

function App() {
  return (
    <FeaturesProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Routes with Sidebar Layout */}
        <Route path="/dashboard" element={<UnifiedSidebarLayout><EnhancedDashboard /></UnifiedSidebarLayout>} />
        <Route path="/company" element={<UnifiedSidebarLayout><CompanyProfilePage /></UnifiedSidebarLayout>} />
        <Route path="/materiality" element={<UnifiedSidebarLayout><MaterialityPage /></UnifiedSidebarLayout>} />
        <Route path="/esg" element={<UnifiedSidebarLayout><ESGPage /></UnifiedSidebarLayout>} />
        <Route path="/esg-dd" element={<UnifiedSidebarLayout><ESGDDPage /></UnifiedSidebarLayout>} />
        <Route path="/esg-dd/reports" element={<UnifiedSidebarLayout><ESGDDReportsPage /></UnifiedSidebarLayout>} />
        <Route path="/esg-dd/manual" element={<UnifiedSidebarLayout><ManualESGDDPage /></UnifiedSidebarLayout>} />
        <Route path="/esg-dd/automated" element={<UnifiedSidebarLayout><AutomatedESGDDPage /></UnifiedSidebarLayout>} />
        <Route path="/esg-dd/cap" element={<UnifiedSidebarLayout><ESGCapPage /></UnifiedSidebarLayout>} />
        <Route path="/esg-dd/irl" element={<UnifiedSidebarLayout><IRLPage /></UnifiedSidebarLayout>} />
        <Route path="/ghg-accounting" element={<UnifiedSidebarLayout><GHGAccountingPage /></UnifiedSidebarLayout>} />
        <Route path="/compliance" element={<UnifiedSidebarLayout><Compliance /></UnifiedSidebarLayout>} />
        <Route path="/reports" element={<UnifiedSidebarLayout><ReportsPage /></UnifiedSidebarLayout>} />
        <Route path="/reports/brsr" element={<UnifiedSidebarLayout><BRSRReport /></UnifiedSidebarLayout>} />
        <Route path="/reports/gri" element={<UnifiedSidebarLayout><GRIReport /></UnifiedSidebarLayout>} />
        <Route path="/reports/tcfd" element={<UnifiedSidebarLayout><TCFDReport /></UnifiedSidebarLayout>} />
        <Route path="/reports/impact" element={<UnifiedSidebarLayout><ImpactReport /></UnifiedSidebarLayout>} />
        
        {/* Stakeholder Management Routes */}
        <Route path="/stakeholders" element={<UnifiedSidebarLayout><StakeholdersOverviewPage /></UnifiedSidebarLayout>} />
        <Route path="/stakeholders/manage" element={<UnifiedSidebarLayout><ManageStakeholdersPage /></UnifiedSidebarLayout>} />
        <Route path="/stakeholders/categories" element={<UnifiedSidebarLayout><CategoriesPage /></UnifiedSidebarLayout>} />
        <Route path="/stakeholders/engagement" element={<UnifiedSidebarLayout><EngagementPlanPage /></UnifiedSidebarLayout>} />
        
        <Route path="/units" element={<UnifiedSidebarLayout><Units /></UnifiedSidebarLayout>} />
        <Route path="/team-management" element={<UnifiedSidebarLayout><TeamManagementPage /></UnifiedSidebarLayout>} />
        <Route path="/ehs-trainings" element={<UnifiedSidebarLayout><EHSTrainings /></UnifiedSidebarLayout>} />
        <Route path="/ehs-trainings/:id" element={<UnifiedSidebarLayout><EHSTrainingDetails /></UnifiedSidebarLayout>} />
        <Route path="/audit" element={<UnifiedSidebarLayout><AuditDashboardPage /></UnifiedSidebarLayout>} />
        <Route path="/audit/:id" element={<UnifiedSidebarLayout><AuditChecklistPage /></UnifiedSidebarLayout>} />
        <Route path="/settings" element={<UnifiedSidebarLayout><FeatureManagementPage /></UnifiedSidebarLayout>} />
        
        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<UnifiedSidebarLayout><EmployeeDashboardPage /></UnifiedSidebarLayout>} />
        <Route path="/personal-dashboard" element={<UnifiedSidebarLayout><EnhancedEmployeeDashboard /></UnifiedSidebarLayout>} />
        <Route path="/personal-ghg" element={<UnifiedSidebarLayout><PersonalGHGPage /></UnifiedSidebarLayout>} />
        
        {/* Unit Admin Routes */}
        <Route path="/unit/ghg-accounting" element={<UnifiedSidebarLayout><UnitGHGAccountingPage /></UnifiedSidebarLayout>} />
        
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
    </FeaturesProvider>
  );
}

export default App;
