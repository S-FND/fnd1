
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const managementItems = [
  "Organization chart",
  "Human Resource Policy and Procedures Manual",
  "Leave Policy (if any)",
  "Environmental & Social Management System",
  "Organization Structure with identification of personnel in the team assigned responsibilities on implementation of ESMS requirements.",
  "Facility-specific E&S Risk Assessment",
  "Emergency Preparedness and Response Plan specific to the unit",
  "EHS Policy (if any)",
  "EHS Management Plans developed for the business operations (if any)",
  "First aid training conducted by an authorized first aid training agency to a first aid employee available at onsite- Name and Logs",
  "First aid box consumption records",
  "Code of Conduct (if any)",
  "POSH Policy & Procedures",
  "Plan for responding to emergencies (fire floods, cyclones etc). Emergency evacuation plan for office spaces.",
  "List of fire extinguishers (in and around office space occupied by Company)",
  "Fire extinguishers regular maintenance check list and expiry dates copies and images",
  "Fire Hydrant Standing Instructions",
  "Battery Backups for emergency lights on evacuation pathways and Emergency exits",
  "Records of testing of fire infrastructure (fire extinguishers, smoke detectors)",
  "Records of emergency mock drills (if any)",
  "Sample appointment letter for employees",
  "Sample employment agreement for employees",
  "Latest holiday list",
  "Employee induction deck",
  "Training Calendar EHS",
  "Records of EHS trainings (attendance sheet with topic & trainer)",
  "Records of fire and natural disasters training conducted in last six months",
  "Training on HR to staff",
  "Training on POSH to employees and contract workers",
  "",
  "Sample contract with professional services agency/ individuals",
  "Grievance Redress Mechanism for employees and contract workers",
  "Grievance redress mechanism for customers",
  "Records of accidents (if any) in office (including fire, electrocution)",
  "External Grievance Redress Mechanism",
  "Employee Grievance Register",
  "External Grievances Register and records of closure of grievances",
  "Stakeholder Engagement Plan",
  "Records of stakeholder engagement activities",
  "Recent ESGDD report",
  "Sample warehouse audit report",
  "Sample warehouse checklist",
  "Sample transportation audit report",
  "TREM Card issued to the transportation",
  "Vehicle and driver documents collected (sample)",
  "Waste take-back certificate generated by the Company for the product vendors",
  "Sample warehouse agreements and documentation collected",
  "Retrenchment Policy",
  "Hazard Identification and Risk Assessment (HIRA) (if any)",
  "Resource efficiency (water, energy, raw material) targets and monitoring program",
  "Quarterly Monitoring carried out using a Environmental, Health & Safety, Social & Labour Welfare Monitoring Checklist. (if available)",
  "E&S Legal Compliance tracker (that presents a list of all permits & approvals obtained for the facility along with their dates of issue and expiry dates. Applications filed for renewal also captured in the tracker)",
  "Do you have a collective bargaining agreement with any worker organization? If yes, please share a copy",
  "Incident Investigation Records for minor and major incidents/accidents",
  "Energy Audit Report (if any)",
  "Electrical Safety Audit Report (if any)",
  "Water Audit Report (if any)",
  "Third party maintenance of HVAC - maintenance report",
  "Health check records for employees",
  "Job/ Process Safety Analysis",
  "Sample Vendor E&S assessment during onboarding (if any)",
  "Weekly analysis report of customer complaints"
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
