
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const complianceItems = [
  {
    key: "registration_shops_act",
    name: "Registration under State Shops & Establishment Act (for head office in India)",
  }, {
    key: "building_occupancy_certificate",
    name: "Building Occupancy Certificate issued to the property owner (for head office in India)",
  }, {
    key: "fire_noc_issued",
    name: "Fire NoC (No Objection Certificate), including the fire safety recommendations; If the validity of the NOC has expired or is near to expiration, attach copy of the renewal application.",
  }, {
    key: "records_of_e_Waste",
    name: "Records of E-Waste generated and disposed as per Form-2 of the Rules.",
  }, {
    key: "ewaste_return_annual",
    name: "Annual returns of E-Waste to State Pollution Control Board in Form-3",
  }, {
    key: "Agreement_e_waste_disposal",// assign
    name: "Agreement with authorized vendor for e-waste disposal (if any)",
  }, {
    key: "ewaste_vendor_authorization",// assign
    name: "Copy of authorization of the vendor to whom e-waste is disposed",
  }, {
    key: "Sale_e_waste",// assign
    name: "E-waste sale records (if any)",
  }, {
    key: "epr_authorisation",
    name: "EPR Authorisation from CPCB (if any)",
  }, {
    key: "Epr_registration",// assign
    name: "EPR Registration as brandowner/ producer under E-waste/Plastic Rules",
  }, {
    key: "records_of_disposal_used_battery",
    name: "Records of disposal of used batteries (if any)",
  }, {
    key: "principal_employer_registration",
    name: "Principal Employer Registration under Contract Labour Act (if any)",
  }, {
    key: "ID_cards_labors_and_employees",// assign
    name: "ID cards for labors and employees, Maintenance of records",
  }, {
    key: "group_personal_accident_policy_employee",
    name: "Group Personal Accident Policy for employees (if any physical labour)",
  }, {
    key: "group_personal_accident_policy_services_agencies",
    name: "Group Personal Accident Policy of the manpower supply agencies/ professional services agencies (if any)",
  }, {
    key: "Registration_ESIC_EPFO",// assign
    name: "Registration under ESIC and EPFO",
  }, {
    key: "company_employees_salary_sheet",
    name: "For Company Employees - salary sheet, ESI & EPF payment challans for previous 3 months",
  }, {
    key: "Professional_Services_Agencies",// assign
    name: "For Professional Services Agencies - ESI & EPF payment challans, salary sheet for previous 3 months",
  }, {
    key: "Company_contract_labors_salary_sheet",// assign
    name: "For Contract labors - Salary sheet, OT Pay sheet, ESI and PF payment challans for previous 3 months",
  }, {
    key: "Payment_of_statutory_bonus",// assign
    name: "Records of payment of statutory bonus to employees and contract workers who are earning less than Rs. 21,000 (if any)",
  }, {
    key: "complaints_committee_under_posh",
    name: "Record presenting Composition of Complaints Committee under POSH",
  }, {
    key: "posh_awareness_sessions",// assign
    name: "POSH Awareness sessions records",
  }, {
    key: "Sexual_harassment",// assign
    name: "Record on investigation of complaints related to sexual harassment (if any)",
  }, {
    key: "posh_annual_returns",
    name: "POSH Annual Returns for calendar year 2024",
  }, {
    key: "records_maternity_benefits",
    name: "Records of maternity benefits provided",
  }, {
    key: "Gratuity_liability",// assign
    name: "Insurance policy for gratuity liability (if any)",
  }, {
    key: "Gratuity_paid",// assign
    name: "Records of gratuity paid",
  }, {
    key: "maternity_benefits_annual_returns",
    name: "Maternity Benefits Annual Returns filing",
  }, {
    key: "waste_management_policy",
    name: "Waste Management Policy",
  }, {
    key: "water_management_policy",
    name: "Water Management Policy",
  }, {
    key: "hazardous_waste_management",
    name: "Hazardous Waste Management- storage, disposal, segregation Policy",
  }, {
    key: "FSSAI_certification",// assign
    name: "FSSAI certification (if required)",
  }, {
    key: "FSSAI_license",// assign
    name: "FSSAI license for cafeteria/canteen (if any)",
  }, {
    key: "Maintenance_air_conditioning",// assign
    name: "Records for refilling of any refrigerant for maintenance of air conditioning / HVAC system"
  }
];

const IRLCompliance = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  return (
    <IRLComplianceTable
      title="Compliance"
      description="Upload required compliance documents and records on E&S Legal Compliance"
      items={complianceItems}
      buttonEnabled={buttonEnabled}
    />
  );
};

export default IRLCompliance;
