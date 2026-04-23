export interface PolicyTemplate {
  name: string;
  sections: string[];
}

export const policyTemplates: Record<string, PolicyTemplate> = {
  "POSH Policy": {
    name: "Prevention of Sexual Harassment (POSH) Policy",
    sections: [
      "Introduction",
      "Policy Statement",
      "Definition of Sexual Harassment",
      "Complaint Procedure",
      "Informal complaints mechanism",
      "Formal complaints mechanism",
      "Overview of the POSH Act, 2013",
      "Internal Complaints Committee (ICC)",
      "Sanctions and disciplinary measures",
      "Awareness and Training",
      "Implementation of the Policy",
      "Monitoring and Evaluation"
    ]
  },
  "Risk Management Policy": {
    name: "Risk Management Policy",
    sections: [
      "Introduction",
      "Legal Framework",
      "Risk Management Process",
      "Risk Identification",
      "Internal or External Risk Factors",
      "Risk Assessment",
      "Risk Matrix",
      "Risk Register",
      "Risk Scenario",
      "Risk Mitigation",
      "Risk Monitoring",
      "Communication and Reporting",
      "Compliance",
      "Risk Management Committee",
      "Training and Awareness",
      "Policy Review",
      "Policy Implementation",
      "Disciplinary Actions"
    ]
  },
  "Disclosure Policy": {
    name: "Disclosure Policy",
    sections: [
      "Purpose",
      "Scope",
      "Laws and Regulations",
      "Roles and Responsibility",
      "Types of Disclosures",
      "Timing and Frequency",
      "Confidentiality and Data Protection",
      "External Communications",
      "Internal Communications",
      "Training",
      "Enforcement and Consequences",
      "Policy Review",
      "Disciplinary Actions"
    ]
  },
  "Budget Policies": {
    name: "Budget Policy",
    sections: [
      "Introduction",
      "Budget Preparation Process",
      "Timeline",
      "Responsibilities",
      "Budget Guidelines",
      "Assumptions",
      "Budget Approval Process",
      "Budget Review",
      "Budget Approval",
      "Budget Monitoring and Control",
      "Monthly Reporting",
      "Budget Adjustments",
      "Cost Control Measures",
      "Review or Revisions",
      "Disciplinary Actions",
      "Laws and Regulations"
    ]
  },
  "Non-disclosure Agreements": {
    name: "Non-Disclosure Agreement",
    sections: [
      "Both parties names and addresses",
      "Purpose",
      "Definition of Confidential Information",
      "Responsibilities of the Recipient",
      "Exclusions from Confidential Information",
      "Laws",
      "Penalties",
      "Terms and Conditions",
      "Disciplinary actions"
    ]
  },
  "Cyber Security Policy": {
    name: "Cyber Security Policy",
    sections: [
      "Introduction",
      "Purpose",
      "Scope",
      "Information Classification",
      "Roles and Responsibilities",
      "Access Control",
      "Awareness and Training",
      "Laws and Regulations",
      "Disciplinary action"
    ]
  },
  "Diversity Policy": {
    name: "Diversity Policy",
    sections: [
      "Introduction",
      "Purpose",
      "Scope",
      "Equal Employment Opportunity (Policy Applications)",
      "Recruitment and Hiring (Policy Applications)",
      "Promotion, Transfer and Training (Policy Applications)",
      "During Employment (Policy Applications)",
      "Disciplinary actions",
      "Complaint Filing Procedures",
      "Policy Review"
    ]
  },
  "Whistle Blower Policy": {
    name: "Whistle Blower Policy",
    sections: [
      "Introduction",
      "Purpose",
      "Scope",
      "Reporting Mechanisms",
      "Roles and responsibilities",
      "Confidentiality and Non-Retaliation",
      "Investigation Process",
      "Records and Reports",
      "Training",
      "Policy Review",
      "Legal Protection"
    ]
  },
  "ESOP Policy": {
    name: "Employee Stock Option Plan (ESOP) Policy",
    sections: [
      "Introduction",
      "Purpose",
      "Employees Eligibility",
      "ESOP Committee",
      "ESOP Contribution",
      "Vesting",
      "Withdrawal and Distributions",
      "Termination",
      "Tax Implications",
      "Legal Framework",
      "Communication"
    ]
  },
  "Code of Conduct": {
    name: "Code of Conduct (Directors, Senior Executives and Employees)",
    sections: [
      "Introduction",
      "Purpose",
      "Scope",
      "Key Principles",
      "Legal and Regulatory Compliance",
      "Honesty and Integrity",
      "Conflicts of Interest",
      "Protection of Company Assets",
      "Confidentiality",
      "Respectful Workplace",
      "Anti-Corruption and Bribery",
      "Fair Competition",
      "Political Contributions and Charitable Donations",
      "Health, Safety, and Environment",
      "Social Responsibility",
      "Laws and Regulations",
      "Reporting Procedure for Code of Conduct Violations",
      "Protection from Retaliation",
      "Consequences of Non-Compliance",
      "Training and Awareness",
      "Supervision",
      "Acknowledgment Form"
    ]
  },
  "Customer Support / Grievance Policy": {
    name: "Customer Support and Grievance Policy",
    sections: [
      "Introduction",
      "Purpose",
      "Scope",
      "Definitions",
      "Grievance Procedures",
      "Contact Information",
      "Situations to file grievances",
      "Confidentiality",
      "Non-Retaliation",
      "Rights of Employees Facing Allegations",
      "Records",
      "Consequences",
      "Laws and Regulations"
    ]
  },
  "IT Policies - Data Governance & Information Security": {
    name: "IT Policies - Data Governance and Information Security Policy",
    sections: [
      "Introduction",
      "Purpose",
      "Scope",
      "Roles and Responsibilities",
      "Data Governance Team",
      "Data Stewards",
      "Data Governance Committee",
      "Data Users",
      "Data Classification",
      "Data Security and Protection",
      "Data Quality and Integrity",
      "Data Collection and Usage",
      "Data Privacy and Compliance",
      "Training and Awareness",
      "Monitoring and Enforcement",
      "Disciplinary Actions",
      "Laws and Regulations",
      "Policy Review",
      "Information Classification and Handling",
      "System Security",
      "Application Security",
      "Physical Security",
      "Incident Management",
      "Business Continuity and Disaster Recovery",
      "Employee Training and Awareness",
      "Mobile Devices and Remote Working",
      "Compliance and Auditing",
      "Vendor Management",
      "Information Security Incidents and Breach Notification",
      "Laws and Regulations",
      "Disciplinary Actions",
      "Policy Acknowledgement"
    ]
  },
  "Intellectual Property Rights Policy": {
    name: "Intellectual Property License Agreement",
    sections: [
      "Introduction",
      "Grant of License",
      "Licensee's Obligations",
      "Consideration",
      "Intellectual Property Rights",
      "Term And Termination",
      "Confidentiality",
      "Indemnification",
      "Limitation of Liability",
      "Disciplinary Actions",
      "Miscellaneous"
    ]
  },
  "HR Manuals / Employee Handbook": {
    name: "HR Manual and Employee Handbook",
    sections: [
      "Welcome Message",
      "Welcome Letter",
      "Introduction to the Company",
      "Introduction",
      "Mission and Values",
      "Mission and Vision",
      "Company History",
      "Organizational Structure",
      "Brief Company History",
      "Organizational Structure",
      "Company Culture",
      "Attendance and Punctuality",
      "Equal Employment Opportunity (EEO) Policy",
      "Dress Code",
      "Anti-Discrimination and Harassment Policy",
      "Code of Conduct and Ethics",
      "Workplace Safety",
      "Confidentiality and Data Security",
      "Drug and Alcohol Policy",
      "Use of Company Property",
      "Job Posting and Advertising",
      "IT and Software Usage",
      "Applicant Screening and Selection",
      "Security Measures",
      "Interview Process and Techniques",
      "Disciplinary Actions",
      "Background Checks and Reference Checks",
      "Changes to the Employee Handbook",
      "Employment Offers and Contracts",
      "Notification of Changes",
      "New Employee Orientation",
      "Acknowledgment of Receipt",
      "Introduction to Company Policies and Procedures",
      "Feedback and Clarification",
      "Completion of Necessary Documentation",
      "Non-Retroactive Changes",
      "Employee Benefits",
      "Contact Information",
      "Health Insurance",
      "Employee Handbook Acknowledgment",
      "Retirement Savings Plan (if applicable)",
      "Paid Time Off (PTO)",
      "Casual Leave",
      "Annual Leave",
      "Sick Leave",
      "Maternity Leave",
      "Paternity Leave",
      "Unpaid Leave",
      "Travel Reimbursement",
      "Termination Process",
      "Resignation Process",
      "Probation Period",
      "Grievance and Conflict Resolution",
      "Reporting Complaints",
      "Conflict Mediation",
      "Whistleblower Protection",
      "Disciplinary Actions",
      "Laws and Regulations",
      "Manual Review and Revision",
      "Communication of Policy Changes",
      "Timeline for Communication",
      "Training and Awareness",
      "Access to Updated HR Manual",
      "Archiving Previous Versions",
      "Tracking and Documentation",
      "Policy Review and Responsibility",
      "Policy Approval",
      "Performance Reviews",
      "Bonuses and Incentives",
      "Salary Advances",
      "Employee Recognition Programs",
      "Provident Fund",
      "Statutory Deductions",
      "Pay Structure",
      "Work Hours",
      "Remote Work Policy (if applicable)",
      "Flexible Work Arrangements",
      "Overtime",
      "Employee Training Opportunities",
      "Continuing Education",
      "Professional Development",
      "Safety",
      "Emergency Evacuation",
      "Communication Channels",
      "Email Usage",
      "Internet Usage",
      "Social Media Policy",
      "Laws and Regulations",
      "At-Will Employment"
    ]
  },
  "Non-competition/Non-solicitation Agreements": {
    name: "Non-Competition and Non-Solicitation Agreement",
    sections: [
      "Introduction",
      "Non-Competition Obligations",
      "Non-Solicitation of Employees",
      "Non-Solicitation of Clients/Customers",
      "Non-Solicitation of Vendors/Suppliers",
      "Confidentiality and Non-Disclosure",
      "No Disparagement",
      "Return of Company Property",
      "Return of Company Property",
      "Confidentiality Obligations",
      "Injunctive Relief",
      "Return of Company Property",
      "Reasonable Restrictions",
      "Disciplinary Actions",
      "Confidentiality",
      "Severability",
      "Governing Law and Jurisdiction",
      "Entire Agreement",
      "Laws and Regulations",
      "Disciplinary Actions",
      "Laws and Regulations",
      "Disciplinary Actions",
      "Entire Agreement"
    ]
  }
};

// Helper function to normalize policy names for matching
export function normalizePolicyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "")
    .trim();
}

// Get policy template by name (with fuzzy matching)
export function getPolicyTemplate(policyName: string): PolicyTemplate | null {
  const normalized = normalizePolicyName(policyName);
  
  // Direct match
  for (const [key, template] of Object.entries(policyTemplates)) {
    if (normalizePolicyName(key) === normalized) {
      return template;
    }
  }
  
  // Partial match
  for (const [key, template] of Object.entries(policyTemplates)) {
    if (normalizePolicyName(key).includes(normalized) || normalized.includes(normalizePolicyName(key))) {
      return template;
    }
  }
  
  return null;
}


// 0
// Introduction

// String
// 1
// Purpose

// String
// 2
// Scope

// String
// 3
// Definitions

// String
// 4
// Roles and Responsibilities

// String
// 5
// Policy Statements / Guidelines

// String
// 6
// Procedures / Implementation

// String
// 7
// Monitoring and Compliance

// String
// 8
// Review and Revision

// String

// 9
// Disciplinary Actions

