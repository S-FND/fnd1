import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';
import { logger } from '@/hooks/logger';

const facilityItems = [
  {
    key: "consent_to_operate_spcb",
    name: "Consent to Operate granted by State Pollution Control Board (SPCB); Attach the renewal application if CTO is expired or nearing expiration."
  },
  {
    key: "factories_license",
    name: "Factories License issued by Factories Inspectorate"
  },
  {
    key: "bore_well_water_meter_readings",
    name: "Bore well water meter readings (if any)"
  },
  {
    key: "building_stability_certificate",
    name: "Building stability certificate"
  },
  {
    key: "contractor_license_under_cla",
    name: "Contractor's license under Contract Labour Act"
  },
  {
    key: "electrical_inspection_generator_set",
    name: "Approval from Electrical Inspector for operation of Generator set(s) (if any)"
  },
  {
    key: "industrial_standing_order_factory",
    name: "Industrial Standing Order approved from Factory Inspector"
  },
  {
    key: "security_agency_psara_license",
    name: "Security Agency appointed at the facility - PSARA license of the Security Agency (under Private Security Agency Regulation Act)"
  },
  {
    key: "factory_approved_plan_dish",
    name: "Factory Approved Plan by DISH (Dept. of Industrial Safety & Health)"
  },
  {
    key: "environmental_statement_form_v",
    name: "Environmental Statement in Form V"
  },
  {
    key: "air_water_noise_monitoring_records",
    name: "Records of on-site Air, Water and Noise quality monitoring"
  },
  {
    key: "dg_set_maintenance_records",
    name: "DG Set Maintenance records, if applicable"
  },
  {
    key: "drinking_water_analysis_nabl",
    name: "Copy of drinking water analysis records from third party NABL accredited laboratory"
  },
  {
    key: "bore_well_registration_certificate",
    name: "Registration Certificate of bore well (if any)"
  },
  {
    key: "dg_stack_monitoring_report",
    name: "DG Stack monitoring report - two recent analysis reports"
  },
  {
    key: "earth_pits_resistance_reports",
    name: "Recent sample reports of earth pits resistance (connected to all electrical equipment)"
  },
  {
    key: "lightning_arrestor_test_report",
    name: "Test report of lightning arrestor"
  },
  {
    key: "transformer_test_report",
    name: "Transformer test report"
  },
  {
    key: "hvac_refrigerant_refill_records",
    name: "Records for refilling of any refrigerant for maintenance of air conditioning / HVAC system"
  },
  {
    key: "pest_control_records",
    name: "Pest Control Records"
  },
  {
    key: "photograph_dg_set",
    name: "Photograph of the DG set"
  },
  {
    key: "photograph_transformer",
    name: "Photograph of the Transformer"
  },
  {
    key: "photograph_lightening_arrestor_earth_pits",
    name: "Photograph of the Lightening arrestor and earth pits"
  },
  {
    key: "photograph_entire_ppes_kit",
    name: "Photograph of the entire PPE kit"
  },
  {
    key: "name_of_contractors",
    name: "Name of Contractors"
  },
  {
    key: "transportation_checklist",
    name: "Transportation Checklist"
  },
  {
    key: "name_of_refrigerants",
    name: "Name of Refrigerants"
  },
  {
    key: "supplier_code_of_conduct",
    name: "Supplier Code of Conduct"
  },
  {
    key: "partner_selection_criteria_checklist",
    name: "Partner Selection Criteria Checklist"
  }
];

const IRLAdditionalFacility = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  logger.debug('Rendering IRLAdditionalFacility component :: buttonEnabled =', buttonEnabled);
  return (
    <IRLComplianceTable
      title="Facility Information"
      description="Facility Level Compliance - Office, Plant, Warehouse, Distribution Centre"
      items={facilityItems}
      type="default"
      buttonEnabled={buttonEnabled}
    />
  );
};

export default IRLAdditionalFacility;