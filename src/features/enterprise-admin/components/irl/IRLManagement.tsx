
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const managementItems = [
  {
    key: "organization_chart",
    name: "Organization chart",
  }, {
    key: "human_resource_policy",
    name: "Human Resource Policy and Procedures Manual",
  }, {
    key: "leave_policy",
    name: "Leave Policy (if any)",
  }, {
    key: "environmental_social_management_system",
    name: "Environmental & Social Management System",
  }, {
    key: "organization_structure_with_esms", // assi
    name: "Organization Structure with identification of personnel in the team assigned responsibilities on implementation of ESMS requirements.",
  }, {
    key: "facility_specific_risk_assessment", // assi
    name: "Facility-specific E&S Risk Assessment",
  }, {
    key: "emergency_preparedness_plan", // assi
    name: "Emergency Preparedness and Response Plan specific to the unit",
  }, {
    key: "ehs_Policy",
    name: "EHS Policy (if any)",
  }, {
    key: "ehs_management_plans", // assi
    name: "EHS Management Plans developed for the business operations (if any)",
  }, {
    key: "first_aid_training",
    name: "First aid training conducted by an authorized first aid training agency to a first aid employee available at onsite- Name and Logs",
  }, {
    key: "first_aid_box_records", // assi
    name: "First aid box consumption records",
  }, {
    key: "code_of_conduct",
    name: "Code of Conduct (if any)",
  }, {
    key: "posh_policy",
    name: "POSH Policy & Procedures",
  }, {
    key: "emergency_evacluation_plan",
    name: "Plan for responding to emergencies (fire floods, cyclones etc). Emergency evacuation plan for office spaces.",
  }, {
    key: "fire_extinguishers_list", // assi
    name: "List of fire extinguishers (in and around office space occupied by Company)",
  }, {
    key: "fire_extinguishers_maintenance",
    name: "Fire extinguishers regular maintenance check list and expiry dates copies and images",
  }, {
    key: "fire_hydrant_standing",
    name: "Fire Hydrant Standing Instructions",
  }, {
    key: "battery_backups_for_emergency",
    name: "Battery Backups for emergency lights on evacuation pathways and Emergency exits",
  }, {
    key: "fire_infrastructure_testing", // assi
    name: "Records of testing of fire infrastructure (fire extinguishers, smoke detectors)",
  }, {
    key: "emergency_mock_drills",
    name: "Records of emergency mock drills (if any)",
  }, {
    key: "sample_appointment_letter_employee",
    name: "Sample appointment letter for employees",
  }, {
    key: "sample_employment_aggreement",
    name: "Sample employment agreement for employees",
  }, {
    key: "latest_holiday_list",
    name: "Latest holiday list",
  }, {
    key: "employee_induction_deck",
    name: "Employee induction deck",
  }, {
    key: "training_calendar_ehs",
    name: "Training Calendar EHS",
  }, {
    key: "employee_training_records",
    name: "Records of EHS trainings (attendance sheet with topic & trainer)",
  }, {
    key: "fire_disasters_training", // assi
    name: "Records of fire and natural disasters training conducted in last six months",
  }, {
    key: "hr_policies_training",
    name: "Training on HR to staff",
  }, {
    key: "posh_training", // assi
    name: "Training on POSH to employees and contract workers",
  }, {
    key: "professional_services_agency_contract",
    name: "Sample contract with professional services agency/ individuals",
  }, {
    key: "grievance_mechanism_for_employees",
    name: "Grievance Redress Mechanism for employees and contract workers",
  }, {
    key: "grievance_mechanism_for_customers",
    name: "Grievance redress mechanism for customers",
  }, {
    key: "office_accidents_records",
    name: "Records of accidents (if any) in office (including fire, electrocution)",
  }, {
    key: "external_grievance_mechanism",
    name: "External Grievance Redress Mechanism",
  }, {
    key: "employee_grievance_register", // assi
    name: "Employee Grievance Register",
  }, {
    key: "external_grievances_register", // assi
    name: "External Grievances Register and records of closure of grievances",
  }, {
    key: "stakeholder_engagement_plan",
    name: "Stakeholder Engagement Plan",
  }, {
    key: "stakeholder_engagement_records",// assi
    name: "Records of stakeholder engagement activities",
  }, {
    key: "esgdd_report",// assi
    name: "Recent ESGDD report",
  }, {
    key: "warehouse_audit_report",// assi
    name: "Sample warehouse audit report",
  }, {
    key: "warehouse_checklist",// assi
    name: "Sample warehouse checklist",
  }, {
    key: "transportation_audit_report",// assi
    name: "Sample transportation audit report",
  }, {
    key: "trem_card",// assi
    name: "TREM Card issued to the transportation",
  }, {
    key: "vehicle_driver_documents",// assi
    name: "Vehicle and driver documents collected (sample)",
  }, {
    key: "waste_takeback_certificate",// assi
    name: "Waste take-back certificate generated by the Company for the product vendors",
  }, {
    key: "warehouse_agreements",// assi
    name: "Sample warehouse agreements and documentation collected",
  }, {
    key: "retrenchment_policy",// assi
    name: "Retrenchment Policy",
  }, {
    key: "hira",// assi
    name: "Hazard Identification and Risk Assessment (HIRA) (if any)",
  }, {
    key: "resource_efficiency_targets",// assi
    name: "Resource efficiency (water, energy, raw material) targets and monitoring program",
  }, {
    key: "quarterly_monitoring_checklist",// assi
    name: "Quarterly Monitoring carried out using a Environmental, Health & Safety, Social & Labour Welfare Monitoring Checklist. (if available)",
  }, {
    key: "es_legal_compliance_tracker",// assi
    name: "E&S Legal Compliance tracker (that presents a list of all permits & approvals obtained for the facility along with their dates of issue and expiry dates. Applications filed for renewal also captured in the tracker)",
  }, {
    key: "collective_bargaining_agreement",// assi
    name: "Do you have a collective bargaining agreement with any worker organization? If yes, please share a copy",
  }, {
    key: "incident_investigation_records",// assi
    name: "Incident Investigation Records for minor and major incidents/accidents",
  }, {
    key: "energy_audit_report",// assi
    name: "Energy Audit Report (if any)",
  }, {
    key: "electrical_safety_audit",// assi
    name: "Electrical Safety Audit Report (if any)",
  }, {
    key: "water_audit_report",// assi
    name: "Water Audit Report (if any)",
  }, {
    key: "hvac_maintenance_reports",// assi
    name: "Third party maintenance of HVAC - maintenance report",
  }, {
    key: "employee_health_check_records",// assi
    name: "Health check records for employees",
  }, {
    key: "job_process_safety_analysis",// assi
    name: "Job/ Process Safety Analysis",
  }, {
    key: "vendor_es_assessment",// assi
    name: "Sample Vendor E&S assessment during onboarding (if any)",
  }, {
    key: "customer_complaints_analysis",// assi
    name: "Weekly analysis report of customer complaints",
  }
];

const IRLManagement = () => {
  return (
    <IRLComplianceTable
      title="Management"
      description="Upload required documents and records on E&S Management Systems"
      items={managementItems}
    />
  );
};

export default IRLManagement;
