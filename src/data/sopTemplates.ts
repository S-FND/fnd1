export interface SOPTemplate {
  name: string;
  sections: string[];
}

const sopTemplates: Record<string, SOPTemplate> = {
  "Energy Consumption Monitoring": {
    name: "Energy Consumption Monitoring SOP",
    sections: [
      "Purpose and Scope",
      "Responsibilities",
      "Definitions and Abbreviations",
      "Monitoring Frequency and Schedule",
      "Data Collection Methods",
      "Meter Reading Procedures",
      "Data Recording and Documentation",
      "Energy Consumption Calculation Methods",
      "Anomaly Detection and Reporting",
      "Data Verification and Quality Control",
      "Monthly Reporting Format",
      "Records Retention",
      "References and Related Documents",
    ],
  },
  "Data Breach Response": {
    name: "Data Breach Response SOP",
    sections: [
      "Purpose and Scope",
      "Definitions",
      "Roles and Responsibilities",
      "Detection and Identification Procedures",
      "Initial Response Actions (First 24 Hours)",
      "Containment Measures",
      "Investigation and Assessment",
      "Notification Requirements",
      "Communication Protocols",
      "Remediation Steps",
      "Post-Incident Review",
      "Documentation Requirements",
      "Training and Awareness",
      "References and Regulatory Compliance",
    ],
  },
  "Workplace Safety Inspection": {
    name: "Workplace Safety Inspection SOP",
    sections: [
      "Purpose and Scope",
      "Responsibilities",
      "Inspection Frequency and Schedule",
      "Pre-Inspection Preparation",
      "Inspection Checklist Items",
      "Safety Equipment Verification",
      "Hazard Identification Procedures",
      "Documentation and Recording",
      "Corrective Action Process",
      "Follow-up Inspection Requirements",
      "Incident Reporting",
      "Training Requirements",
      "Records Retention",
    ],
  },
  "Waste Management": {
    name: "Waste Management SOP",
    sections: [
      "Purpose and Scope",
      "Definitions and Waste Categories",
      "Responsibilities",
      "Waste Segregation Procedures",
      "Collection Schedule and Methods",
      "Storage Requirements",
      "Hazardous Waste Handling",
      "Documentation and Record Keeping",
      "Waste Disposal Methods",
      "Vendor Management",
      "Monitoring and Reporting",
      "Emergency Procedures",
      "Training Requirements",
      "Compliance and Regulations",
    ],
  },
  "Supplier Assessment": {
    name: "Supplier Assessment and Audit SOP",
    sections: [
      "Purpose and Scope",
      "Supplier Selection Criteria",
      "Initial Assessment Process",
      "Documentation Requirements",
      "On-site Audit Procedures",
      "Sustainability Evaluation Criteria",
      "Labor Practices Assessment",
      "Quality Standards Verification",
      "Scoring and Rating System",
      "Non-Compliance Handling",
      "Re-assessment Schedule",
      "Supplier Development Program",
      "Records Management",
      "Continuous Improvement",
    ],
  },
  "Employee Training": {
    name: "Employee Training and Development SOP",
    sections: [
      "Purpose and Scope",
      "Training Needs Assessment",
      "Training Program Development",
      "Roles and Responsibilities",
      "Training Schedule and Calendar",
      "Training Delivery Methods",
      "Attendance Tracking",
      "Assessment and Evaluation",
      "Certification Procedures",
      "Records Maintenance",
      "Effectiveness Measurement",
      "Continuous Improvement",
      "Budget and Resources",
    ],
  },
  "Emissions Monitoring": {
    name: "GHG Emissions Monitoring SOP",
    sections: [
      "Purpose and Scope",
      "Emission Sources Identification",
      "Monitoring Equipment and Calibration",
      "Data Collection Procedures",
      "Calculation Methodologies",
      "Quality Assurance/Quality Control",
      "Reporting Requirements",
      "Records Management",
      "Compliance Verification",
      "Corrective Actions",
      "Annual Review and Update",
    ],
  },
  "Incident Investigation": {
    name: "Incident Investigation and Root Cause Analysis SOP",
    sections: [
      "Purpose and Scope",
      "Incident Classification",
      "Immediate Response Actions",
      "Investigation Team Formation",
      "Evidence Collection and Preservation",
      "Witness Interviews",
      "Root Cause Analysis Methods",
      "Corrective Action Development",
      "Implementation and Follow-up",
      "Documentation Requirements",
      "Lessons Learned",
      "Communication and Reporting",
    ],
  },
};

function normalizeSOPName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getSOPTemplate(sopName: string): SOPTemplate | null {
  const directMatch = sopTemplates[sopName];
  if (directMatch) return directMatch;

  const normalizedSearch = normalizeSOPName(sopName);
  for (const [key, template] of Object.entries(sopTemplates)) {
    if (normalizeSOPName(key).includes(normalizedSearch) || normalizedSearch.includes(normalizeSOPName(key))) {
      return template;
    }
  }

  return null;
}

export { sopTemplates };
