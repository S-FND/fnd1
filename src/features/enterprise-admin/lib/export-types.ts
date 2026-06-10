export type ReportType = "summary" | "detailed";
export type StatusFilter = "Total" | "Closed" | "Due <1 Month" | "Overdue" | "Submitted" | "Upcoming";
export type DateField = "target" | "created" | "submitted";

export interface ExportFilters {
  reportType: ReportType;
  statuses: StatusFilter[];
  priorities: ("High" | "Medium" | "Low")[];
  categories: ("CP" | "CS")[];
  dateField: DateField;
  dateFrom: string;
  dateTo: string;
  includeCompany: boolean;
  includeDashboard: boolean;
  includeCharts: boolean;
  includeItems: boolean;
  includeAttachments: boolean;
  includeComments: boolean;
}

export const defaultFilters: ExportFilters = {
  reportType: "detailed",
  statuses: [],
  priorities: [],
  categories: [],
  dateField: "target",
  dateFrom: "",
  dateTo: "",
  includeCompany: true,
  includeDashboard: true,
  includeCharts: true,
  includeItems: true,
  includeAttachments: true,
  includeComments: true,
};