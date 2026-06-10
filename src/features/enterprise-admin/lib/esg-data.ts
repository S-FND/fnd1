export type Priority = "High" | "Medium" | "Low";
export type Category = "CP" | "CS";
export type CompanyStatus = "Submitted" | "Overdue" | "Pending" | "In Progress" | "Closed";
export type InvestorStatus = "Closed" | "Under Review" | "Pending" | "Rejected" | "Approved";

export interface CAPItem {
  id: number;
  category: Category;
  name: string;
  priority: Priority;
  targetDate: string;     // ISO
  companyStatus: CompanyStatus;
  investorStatus: InvestorStatus;
  completedOn?: string;   // ISO
  owner: string;
  remarks?: string;
  createdAt: string;
  submittedAt?: string;
}

export const company = {
  name: "NewMe Asia Pvt Ltd",
  registration: "U72900KA2019PTC123456",
  sector: "Consumer Goods",
  industry: "Sustainable Personal Care",
  country: "India",
  hq: "Bengaluru, Karnataka",
  project: "ESG DD — Series B Financing",
  investor: "Fireside Ventures",
  reportingPeriod: "Q4 2025 — Q1 2026",
  generatedBy: "Suman Joshi (sj@newme.asia)",
};

export const capItems: CAPItem[] = [
  { id: 1, category: "CP", name: "ESG Roadmap Adoption via Board Resolution", priority: "High", targetDate: "2025-12-04", companyStatus: "Submitted", investorStatus: "Closed", completedOn: "2025-12-04", owner: "CEO Office", remarks: "Board resolution circulated and signed.", createdAt: "2025-10-01", submittedAt: "2025-12-01" },
  { id: 2, category: "CS", name: "Environmental Compliance — PCB Certifications", priority: "High", targetDate: "2026-01-04", companyStatus: "Submitted", investorStatus: "Under Review", owner: "EHS Lead", remarks: "Awaiting investor sign-off.", createdAt: "2025-10-12", submittedAt: "2026-01-02" },
  { id: 3, category: "CS", name: "Extended Producer Responsibility (EPR)", priority: "High", targetDate: "2026-01-04", companyStatus: "Overdue", investorStatus: "Pending", owner: "Supply Chain", remarks: "EPR registration pending CPCB portal updates.", createdAt: "2025-10-12" },
  { id: 4, category: "CS", name: "Supplier Code of Conduct Rollout", priority: "Medium", targetDate: "2026-02-15", companyStatus: "In Progress", investorStatus: "Pending", owner: "Procurement", remarks: "50% suppliers signed.", createdAt: "2025-11-01" },
  { id: 5, category: "CS", name: "Grievance Redressal Mechanism (POSH)", priority: "High", targetDate: "2026-01-20", companyStatus: "Submitted", investorStatus: "Approved", completedOn: "2026-01-18", owner: "HR Head", createdAt: "2025-10-22", submittedAt: "2026-01-15" },
  { id: 6, category: "CS", name: "Energy Audit — Bengaluru Facility", priority: "Medium", targetDate: "2026-03-10", companyStatus: "Pending", investorStatus: "Pending", owner: "Operations", createdAt: "2025-12-01" },
  { id: 7, category: "CS", name: "Water Consumption Baseline Study", priority: "Low", targetDate: "2026-04-30", companyStatus: "Pending", investorStatus: "Pending", owner: "EHS Lead", createdAt: "2025-12-15" },
  { id: 8, category: "CP", name: "Whistleblower Policy Adoption", priority: "High", targetDate: "2025-12-20", companyStatus: "Submitted", investorStatus: "Closed", completedOn: "2025-12-18", owner: "Legal", createdAt: "2025-10-05", submittedAt: "2025-12-17" },
  { id: 9, category: "CS", name: "Scope 1 & 2 GHG Inventory", priority: "High", targetDate: "2026-02-28", companyStatus: "In Progress", investorStatus: "Under Review", owner: "Sustainability", createdAt: "2025-11-15" },
  { id: 10, category: "CS", name: "Diversity, Equity & Inclusion Policy", priority: "Medium", targetDate: "2026-02-10", companyStatus: "Submitted", investorStatus: "Under Review", owner: "HR Head", createdAt: "2025-11-02", submittedAt: "2026-02-05" },
  { id: 11, category: "CS", name: "Hazardous Waste Disposal Records", priority: "High", targetDate: "2026-01-15", companyStatus: "Overdue", investorStatus: "Pending", owner: "EHS Lead", remarks: "Vendor change in progress.", createdAt: "2025-10-30" },
  { id: 12, category: "CS", name: "Anti-Bribery & Corruption Training", priority: "Medium", targetDate: "2026-03-31", companyStatus: "In Progress", investorStatus: "Pending", owner: "Compliance", createdAt: "2025-12-05" },
  { id: 13, category: "CS", name: "Cybersecurity Risk Assessment", priority: "High", targetDate: "2026-02-20", companyStatus: "Submitted", investorStatus: "Under Review", owner: "CTO Office", createdAt: "2025-11-20", submittedAt: "2026-02-18" },
  { id: 14, category: "CS", name: "Vendor ESG Self-Assessment Forms", priority: "Low", targetDate: "2026-05-15", companyStatus: "Pending", investorStatus: "Pending", owner: "Procurement", createdAt: "2026-01-05" },
  { id: 15, category: "CS", name: "Health & Safety Committee Charter", priority: "Medium", targetDate: "2026-02-25", companyStatus: "Submitted", investorStatus: "Approved", completedOn: "2026-02-22", owner: "EHS Lead", createdAt: "2025-11-25", submittedAt: "2026-02-20" },
  { id: 16, category: "CS", name: "Plastic Neutrality Action Plan", priority: "High", targetDate: "2026-01-10", companyStatus: "Overdue", investorStatus: "Pending", owner: "Sustainability", remarks: "Aggregator onboarding delayed.", createdAt: "2025-10-25" },
  { id: 17, category: "CS", name: "Board Diversity Disclosure", priority: "Medium", targetDate: "2026-03-05", companyStatus: "Submitted", investorStatus: "Under Review", owner: "Company Secretary", createdAt: "2025-12-10", submittedAt: "2026-03-01" },
  { id: 18, category: "CS", name: "Customer Data Privacy Notice Update", priority: "Medium", targetDate: "2026-02-12", companyStatus: "Submitted", investorStatus: "Approved", completedOn: "2026-02-10", owner: "Legal", createdAt: "2025-11-12", submittedAt: "2026-02-08" },
  { id: 19, category: "CS", name: "Renewable Energy PPA Evaluation", priority: "Low", targetDate: "2026-06-30", companyStatus: "Pending", investorStatus: "Pending", owner: "Operations", createdAt: "2026-01-15" },
  { id: 20, category: "CS", name: "Quarterly ESG KPI Reporting Cadence", priority: "Medium", targetDate: "2026-03-15", companyStatus: "In Progress", investorStatus: "Under Review", owner: "Sustainability", createdAt: "2025-12-20" },
  { id: 21, category: "CS", name: "Child Labour Policy & Audit", priority: "High", targetDate: "2026-02-28", companyStatus: "Submitted", investorStatus: "Under Review", owner: "HR Head", createdAt: "2025-11-28", submittedAt: "2026-02-25" },
  { id: 22, category: "CS", name: "Living Wage Benchmark Study", priority: "Low", targetDate: "2026-05-31", companyStatus: "Pending", investorStatus: "Pending", owner: "HR Head", createdAt: "2026-01-10" },
  { id: 23, category: "CS", name: "Climate Risk Scenario Analysis", priority: "Medium", targetDate: "2026-04-15", companyStatus: "Pending", investorStatus: "Pending", owner: "Sustainability", createdAt: "2026-01-20" },
  { id: 24, category: "CS", name: "Independent Director Onboarding", priority: "Medium", targetDate: "2026-03-20", companyStatus: "In Progress", investorStatus: "Pending", owner: "Company Secretary", createdAt: "2025-12-22" },
  { id: 25, category: "CS", name: "Product Lifecycle Assessment Pilot", priority: "Low", targetDate: "2026-06-15", companyStatus: "Pending", investorStatus: "Pending", owner: "R&D", createdAt: "2026-01-25" },
  { id: 26, category: "CS", name: "Internal Audit Charter Refresh", priority: "Medium", targetDate: "2026-03-25", companyStatus: "Submitted", investorStatus: "Approved", completedOn: "2026-03-20", owner: "Internal Audit", createdAt: "2025-12-28", submittedAt: "2026-03-18" },
  { id: 27, category: "CS", name: "Stakeholder Materiality Assessment", priority: "Medium", targetDate: "2026-04-30", companyStatus: "Pending", investorStatus: "Pending", owner: "Sustainability", createdAt: "2026-02-01" },
  { id: 28, category: "CS", name: "Tax Transparency Report", priority: "Low", targetDate: "2026-05-15", companyStatus: "Pending", investorStatus: "Pending", owner: "Finance", createdAt: "2026-02-10" },
];

export const TODAY = new Date("2026-06-04");

export function summarize(items: CAPItem[]) {
  const total = items.length;
  const closed = items.filter(i => i.investorStatus === "Closed").length;
  const submitted = items.filter(i => i.companyStatus === "Submitted").length;
  const overdue = items.filter(i => i.companyStatus === "Overdue").length;
  const dueSoon = items.filter(i => {
    if (i.companyStatus === "Submitted" || i.investorStatus === "Closed") return false;
    const d = new Date(i.targetDate).getTime() - TODAY.getTime();
    const days = d / 86400000;
    return days >= 0 && days <= 30;
  }).length;
  const upcoming = items.filter(i => {
    const d = (new Date(i.targetDate).getTime() - TODAY.getTime()) / 86400000;
    return d > 30 && i.investorStatus !== "Closed";
  }).length;
  return { total, closed, submitted, overdue, dueSoon, upcoming };
}

export function daysRemaining(iso: string) {
  return Math.round((new Date(iso).getTime() - TODAY.getTime()) / 86400000);
}