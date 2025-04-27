
export interface TrainingModule {
  id: number;
  title: string;
  duration: string;
  completion: number;
  category: string;
}

export const trainingModules: TrainingModule[] = [
  { id: 1, title: "ESG Fundamentals", duration: "2 hours", completion: 84, category: "ESG" },
  { id: 2, title: "Carbon Accounting Principles", duration: "3 hours", completion: 67, category: "GHG" },
  { id: 3, title: "Workplace Safety Essentials", duration: "1.5 hours", completion: 92, category: "EHS" },
  { id: 4, title: "BRSR Reporting Requirements", duration: "2.5 hours", completion: 58, category: "Reporting" },
  { id: 5, title: "Chemical Handling Safety", duration: "1 hour", completion: 76, category: "EHS" },
  { id: 6, title: "Sustainable Supply Chain", duration: "2 hours", completion: 45, category: "ESG" },
];
