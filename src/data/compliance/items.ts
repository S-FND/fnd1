
export interface ComplianceItem {
  id: number;
  name: string;
  deadline: string;
  status: string;
  category: string;
}

export const complianceItems: ComplianceItem[] = [
  { id: 1, name: "BRSR Submission", deadline: "2024-06-30", status: "On Track", category: "Reporting" },
  { id: 2, name: "Annual EHS Audit", deadline: "2024-05-15", status: "At Risk", category: "EHS" },
  { id: 3, name: "Companies Act Section 134", deadline: "2024-07-31", status: "On Track", category: "Legal" },
  { id: 4, name: "EPR Documentation", deadline: "2024-04-30", status: "Completed", category: "Environmental" },
  { id: 5, name: "Labour Law Compliance", deadline: "2024-03-31", status: "Completed", category: "Labor" },
];
