export interface LogTemplate {
  name: string;
  sections: string[];
}

const logTemplates: Record<string, LogTemplate> = {
  "Safety Incident Log": {
    name: "Safety Incident Log",
    sections: [
      "Log Purpose and Scope",
      "Date and Time of Incident",
      "Incident Location Details",
      "Incident Type and Classification",
      "Personnel Involved",
      "Witness Information",
      "Incident Description",
      "Injuries or Damages",
      "Immediate Actions Taken",
      "Root Cause Analysis",
      "Preventive Measures",
      "Follow-up Actions Required",
      "Sign-off and Approval",
      "Attachments and Supporting Documents",
    ],
  },
  "Equipment Maintenance Log": {
    name: "Equipment Maintenance Log",
    sections: [
      "Equipment Identification",
      "Maintenance Date and Time",
      "Type of Maintenance (Preventive/Corrective)",
      "Maintenance Checklist",
      "Parts Replaced or Repaired",
      "Technician Details",
      "Downtime Duration",
      "Cost of Maintenance",
      "Equipment Performance After Maintenance",
      "Next Scheduled Maintenance",
      "Safety Precautions Taken",
      "Remarks and Observations",
      "Authorization and Sign-off",
    ],
  },
  "Energy Consumption Log": {
    name: "Energy Consumption Log",
    sections: [
      "Recording Period",
      "Facility/Department Identification",
      "Meter Reading Details",
      "Electricity Consumption (kWh)",
      "Fuel Consumption (Liters/Units)",
      "Renewable Energy Generation",
      "Peak Demand",
      "Energy Cost",
      "Variance from Previous Period",
      "Weather Conditions",
      "Operational Changes",
      "Conservation Measures Implemented",
      "Recorded By and Verified By",
    ],
  },
  "Training Attendance Log": {
    name: "Training Attendance Log",
    sections: [
      "Training Program Name",
      "Training Date and Duration",
      "Training Location/Platform",
      "Trainer Details",
      "Participant List",
      "Department/Team",
      "Attendance Status",
      "Assessment Results",
      "Certificates Issued",
      "Feedback Summary",
      "Follow-up Actions",
      "Records Filed By",
    ],
  },
  "Waste Generation Log": {
    name: "Waste Generation Log",
    sections: [
      "Date and Time",
      "Waste Category/Type",
      "Source Department/Process",
      "Quantity Generated (Weight/Volume)",
      "Storage Location",
      "Disposal Method",
      "Waste Handler Details",
      "Transportation Details",
      "Compliance with Regulations",
      "Cost of Disposal",
      "Special Handling Requirements",
      "Verification and Sign-off",
    ],
  },
  "Water Usage Log": {
    name: "Water Usage Log",
    sections: [
      "Recording Period",
      "Water Source (Municipal/Groundwater/Other)",
      "Meter Reading",
      "Total Consumption (Cubic Meters)",
      "Department/Process-wise Breakdown",
      "Water Quality Parameters",
      "Discharge Quantity and Quality",
      "Treatment System Performance",
      "Cost Analysis",
      "Conservation Initiatives",
      "Regulatory Compliance Status",
      "Recorded By and Date",
    ],
  },
  "Audit Findings Log": {
    name: "Audit Findings Log",
    sections: [
      "Audit Date and Type",
      "Audit Scope and Areas Covered",
      "Auditor Details",
      "Finding Number",
      "Finding Category (Major/Minor/Observation)",
      "Description of Finding",
      "Evidence and References",
      "Risk Rating",
      "Responsible Person/Department",
      "Corrective Action Required",
      "Target Completion Date",
      "Status of Closure",
      "Verification Details",
      "Sign-off and Approval",
    ],
  },
  "Supplier Performance Log": {
    name: "Supplier Performance Log",
    sections: [
      "Evaluation Period",
      "Supplier Name and ID",
      "Product/Service Category",
      "Quality Performance Metrics",
      "Delivery Performance",
      "Cost Competitiveness",
      "Compliance Status",
      "Sustainability Practices",
      "Communication and Responsiveness",
      "Issue Resolution",
      "Overall Rating",
      "Improvement Areas",
      "Action Items",
      "Next Review Date",
    ],
  },
  "Chemical Inventory Log": {
    name: "Chemical Inventory Log",
    sections: [
      "Chemical Name and CAS Number",
      "Quantity in Stock",
      "Storage Location",
      "Hazard Classification",
      "Supplier Details",
      "Date Received",
      "Expiry Date",
      "Safety Data Sheet (SDS) Reference",
      "Usage Department",
      "Withdrawal Records",
      "Disposal Records",
      "Inspection Date",
      "Regulatory Compliance",
      "Emergency Contact Information",
    ],
  },
  "Stakeholder Engagement Log": {
    name: "Stakeholder Engagement Log",
    sections: [
      "Date of Engagement",
      "Stakeholder Name and Type",
      "Engagement Method (Meeting/Survey/Call)",
      "Purpose of Engagement",
      "Key Discussion Points",
      "Concerns Raised",
      "Commitments Made",
      "Action Items",
      "Responsible Person",
      "Target Completion Date",
      "Follow-up Date",
      "Status Updates",
      "Documentation Attached",
    ],
  },
};

function normalizeLogName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getLogTemplate(logName: string): LogTemplate | null {
  const directMatch = logTemplates[logName];
  if (directMatch) return directMatch;

  const normalizedSearch = normalizeLogName(logName);
  for (const [key, template] of Object.entries(logTemplates)) {
    if (normalizeLogName(key).includes(normalizedSearch) || normalizedSearch.includes(normalizeLogName(key))) {
      return template;
    }
  }

  return null;
}

export { logTemplates };
