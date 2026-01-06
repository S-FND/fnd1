
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FeaturesProvider } from '@/context/FeaturesContext';
// import { SDGProvider } from '@/contexts/SDGContext';
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
import SupplierProfilePage from './pages/supplier/SupplierProfilePage';
import GHGInventoryPage from './pages/supplier/GHGInventoryPage';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorBids from './pages/vendor/VendorBids';
import VendorBidForm from './pages/vendor/VendorBidForm';
import VendorTrainings from './pages/vendor/VendorTrainings';
import ESGPage from './features/enterprise-admin/pages/ESG';
import EmployeeDashboardPage from './features/employee/pages/Dashboard';
import MaterialityPage from './features/enterprise-admin/pages/Materiality';
// import SDGPage from './features/enterprise-admin/pages/SDG';
import PersonalGHGPage from './features/employee/pages/PersonalGHG';
import GHGAccountingPage from './features/enterprise-admin/pages/GHGAccounting';
import UnitGHGAccountingPage from './features/unit-admin/components/ghg/UnitGHGAccountingPage';
import ESGDDPage from './features/enterprise-admin/pages/ESGDD';
import ESGDDReportsPage from './features/enterprise-admin/pages/ESGDDReports';
import ManualESGDDPage from './features/enterprise-admin/pages/ManualESGDD';
import AutomatedESGDDPage from './features/enterprise-admin/pages/AutomatedESGDD';
import ESGCapPage from './features/enterprise-admin/pages/ESGCap';
import IRLPage from './features/enterprise-admin/pages/IRLPage';
// import ProtectedIRLPage from './components/protected/ProtectedIRLPage';
import AdvancedIRLPage from './features/enterprise-admin/pages/AdvancedIRLPage';
import ReportsPage from './features/enterprise-admin/pages/Reports';
import BRSRReport from './features/enterprise-admin/pages/BRSRReport';
import GRIReport from './features/enterprise-admin/pages/GRIReport';
import TCFDReport from './features/enterprise-admin/pages/TCFDReport';
import ImpactReport from './features/enterprise-admin/pages/ImpactReport';
import ActionLogPage from './features/enterprise-admin/pages/ActionLogPage';
import SDGPage from './features/enterprise-admin/pages/SDG';
import StakeholdersOverviewPage from './features/enterprise-admin/pages/stakeholders/StakeholdersOverviewPage';
import ManageStakeholdersPage from './features/enterprise-admin/pages/stakeholders/ManageStakeholdersPage';
import CategoriesPage from './features/enterprise-admin/pages/stakeholders/CategoriesPage';
import EngagementPlanPage from './features/enterprise-admin/pages/stakeholders/EngagementPlanPage';
import StakeholderLoginPage from './features/stakeholder/pages/StakeholderLoginPage';
import ESGManagementPage from './features/enterprise-admin/pages/ESGManagement';
import TeamManagementPage from './features/enterprise-admin/pages/TeamManagement';
import EmployeeDetailsPage from './features/enterprise-admin/components/team/EmployeeDetailsPage';
import CompanyProfilePage from './pages/CompanyProfile';
// import FeatureManagementPage from './pages/FeatureManagement';
import SupplierAuditsPage from './pages/audit/SupplierAuditsPage';
import EHSAuditsPage from './pages/audit/EHSAuditsPage';
import InternalAuditsPage from './pages/audit/InternalAuditsPage';
import Scope1EntryPage from './pages/Scope1EntryPage';
import LMSPage from './pages/LMS';
// import ActionLogPage from './components/action-log/ActionLogPage';
import { Toaster } from 'sonner';
import Scope2EntryPage from './pages/Scope2EntryPage';
import Scope3EntryPage from './pages/Scope3EntryPage';
import Scope4EntryPage from './pages/Scope4EntryPage';
import SourceTemplateForm from './features/enterprise-admin/components/ghg/scope1/SourceTemplateForm';
import DataCollectionForm from './features/enterprise-admin/components/ghg/scope1/DataCollectionForm';
import GHGDataCollection from './pages/GHGDataCollection';
import Scope2SourceTemplateForm from './features/enterprise-admin/components/ghg/scope2/Scope2SourceTemplateForm';
import Scope3SourceTemplateForm from './features/enterprise-admin/components/ghg/scope3/Scope3SourceTemplateForm';
import Scope4SourceTemplateForm from './features/enterprise-admin/components/ghg/scope4/Scope4SourceTemplateForm';
import UnitConverterPage from './pages/UnitConverterPage';
import FeatureManagementPage from './pages/FeatureManagement';
import Scope2DataCollectionForm from './features/enterprise-admin/components/ghg/scope2/Scope2DataCollectionForm';
import VerifierApprovalsPage from './pages/VerifierApprovalsPage';
import Scope3DataCollectionForm from './features/enterprise-admin/components/ghg/scope3/DataCollectionForm';
import Scope4DataCollectionForm from './features/enterprise-admin/components/ghg/scope4/DataCollectionForm';
import VerifierApprovalDetailPage from './pages/VerifierApprovalDetailPage';


function App() {
  return (
    <FeaturesProvider>
      <Toaster
        position="bottom-right"
        richColors
        duration={3000}
        closeButton // ✅ Enables the X/close icon
      />
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Index />} /> */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Login />} />

        {/* Company / Enterprise Admin Routes */}
        <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/company" element={<CompanyProfilePage />} />
        <Route path="/materiality" element={<MaterialityPage />} />
        <Route path="/esg/*" element={<ESGPage />} />
        <Route path="/esg-dd" element={<ESGDDPage />} />
        <Route path="/esg-dd/reports" element={<ESGDDReportsPage />} />
        <Route path="/esg-dd/manual" element={<ManualESGDDPage />} />
        <Route path="/esg-dd/automated" element={<AutomatedESGDDPage />} />
        <Route path="/esg-dd/cap" element={<ESGCapPage />} />
        <Route path="/esg-dd/irl" element={<IRLPage />} />
        <Route path="/esg-dd/advanced" element={<AdvancedIRLPage />}
        />
        <Route path="/ghg-accounting" element={<GHGAccountingPage />} />
        <Route path="/ghg-accounting/scope1/entry" element={<Scope1EntryPage />} />
        <Route path="/ghg-accounting/scope1/define-source" element={<SourceTemplateForm />} />
        <Route path="/ghg-accounting/scope1/collect-data" element={<DataCollectionForm />} />
        <Route path="/ghg-accounting/scope2/entry" element={<Scope2EntryPage />} />
        <Route path="/ghg-accounting/scope2/define-source" element={<Scope2SourceTemplateForm />} />
        <Route path="/ghg-accounting/scope3/entry" element={<Scope3EntryPage />} />
        <Route path="/ghg-accounting/scope3/define-source" element={<Scope3SourceTemplateForm />} />
         <Route path="/ghg-accounting/scope3/collect-data" element={<Scope3DataCollectionForm />} />
        <Route path="/ghg-accounting/scope4/entry" element={<Scope4EntryPage />} />
        <Route path="/ghg-accounting/scope4/define-source" element={<Scope4SourceTemplateForm />} />
        <Route path="/ghg-accounting/scope4/collect-data" element={<Scope4DataCollectionForm />} />
        <Route path="/ghg-data-collection" element={<GHGDataCollection />} />
        <Route path="/ghg-accounting/unit-converter" element={<UnitConverterPage />} />

        <Route path="/ghg-accounting/scope2/collect-data" element={<Scope2DataCollectionForm />} />
        <Route path="/verifier-approvals" element={<VerifierApprovalsPage />} />
         <Route path="/verifier-approvals/:id" element={<VerifierApprovalDetailPage />} />


        <Route path="/compliance" element={<Compliance />} />
        <Route path="/lms" element={<LMSPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/brsr" element={<BRSRReport />} />
        <Route path="/reports/gri" element={<GRIReport />} />
        <Route path="/reports/tcfd" element={<TCFDReport />} />
        <Route path="/reports/impact" element={<ImpactReport />} />
        <Route path="/action-log" element={<ActionLogPage />} />
        {/* Stakeholder Management Routes */}
        <Route path="/stakeholders" element={<StakeholdersOverviewPage />} />
        <Route path="/stakeholders/manage" element={<ManageStakeholdersPage />} />
        <Route path="/stakeholders/categories" element={<CategoriesPage />} />
        <Route path="/stakeholders/engagement" element={<EngagementPlanPage />} />
        <Route path="/stakeholders/dashboard" element={<StakeholderLoginPage />} />

        <Route path="/units" element={<Units />} />
        <Route path="/team-management" element={<TeamManagementPage />} />
        <Route path="/team-management/employee/:employeeId" element={<EmployeeDetailsPage />} />
        <Route path="/ehs-trainings" element={<EHSTrainings />} />
        <Route path="/ehs-trainings/:id" element={<EHSTrainingDetails />} />

        {/* Audit Routes */}
        <Route path="/audit" element={<AuditDashboardPage />} />
        <Route path="/audit/supplier" element={<SupplierAuditsPage />} />
        <Route path="/audit/ehs" element={<EHSAuditsPage />} />
        <Route path="/audit/internal" element={<InternalAuditsPage />} />
        <Route path="/audit/:id" element={<AuditChecklistPage />} />

        <Route path="/settings" element={<FeatureManagementPage />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
        <Route path="/personal-dashboard" element={<EnhancedEmployeeDashboard />} />
        <Route path="/personal-ghg" element={<PersonalGHGPage />} />

        {/* Unit Admin Routes */}
        <Route path="/unit/ghg-accounting" element={<UnitGHGAccountingPage />} />

        {/* Supplier Routes */}
        <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
        <Route path="/supplier/ghg-inventory" element={<GHGInventoryPage />} />
        <Route path="/supplier/profile" element={<SupplierProfilePage />} />
        <Route path="/supplier/audit-response/:id" element={<SupplierAuditResponsePage />} />

        {/* Vendor Routes */}
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/bids" element={<VendorBids />} />
        <Route path="/vendor/bids/new" element={<VendorBidForm />} />
        <Route path="/vendor/trainings" element={<VendorTrainings />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </SDGProvider> */}
    </FeaturesProvider>
  );
}

export default App;
