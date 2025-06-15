
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const complianceItems = [
  "Registration under State Shops & Establishment Act (for head office in India)",
  "Building Occupancy Certificate issued to the property owner (for head office in India)",
  "Fire NoC (No Objection Certificate), including the fire safety recommendations; If the validity of the NOC has expired or is near to expiration, attach copy of the renewal application.",
  "Records of E-Waste generated and disposed as per Form-2 of the Rules.",
  "Annual returns of E-Waste to State Pollution Control Board in Form-3",
  "Agreement with authorized vendor for e-waste disposal (if any)",
  "Copy of authorization of the vendor to whom e-waste is disposed",
  "E-waste sale records (if any)",
  "EPR Authorisation from CPCB (if any)",
  "EPR Registration as brandowner/ producer under E-waste/Plastic Rules",
  "Records of disposal of used batteries (if any)",
  "Principal Employer Registration under Contract Labour Act (if any)",
  "ID cards for labors and employees, Maintenance of records",
  "Group Personal Accident Policy for employees (if any physical labour)",
  "Group Personal Accident Policy of the manpower supply agencies/ professional services agencies (if any)",
  "Registration under ESIC and EPFO",
  "For Company Employees - salary sheet, ESI & EPF payment challans for previous 3 months",
  "For Professional Services Agencies - ESI & EPF payment challans, salary sheet for previous 3 months",
  "For Contract labors - Salary sheet, OT Pay sheet, ESI and PF payment challans for previous 3 months",
  "Records of payment of statutory bonus to employees and contract workers who are earning less than Rs. 21,000 (if any)",
  "Record presenting Composition of Complaints Committee under POSH",
  "POSH Awareness sessions records",
  "Record on investigation of complaints related to sexual harassment (if any)",
  "POSH Annual Returns for calendar year 2024",
  "Records of maternity benefits provided",
  "Insurance policy for gratuity liability (if any)",
  "Records of gratuity paid",
  "Maternity Benefits Annual Returns filing",
  "Waste Management Policy",
  "Water Management Policy",
  "Hazardous Waste Management- storage, disposal, segregation Policy",
  "FSSAI certification (if required)",
  "FSSAI license for cafeteria/canteen (if any)",
  "Records for refilling of any refrigerant for maintenance of air conditioning / HVAC system"
];

const IRLCompliance = () => {
  return (
    <IRLComplianceTable
      title="Compliance"
      description="Upload required compliance documents and records on E&S Legal Compliance"
      items={complianceItems}
    />
  );
};

export default IRLCompliance;
