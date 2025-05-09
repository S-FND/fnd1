
// Define the type for the form data structure
export type CategoryData = Record<string, number>;
export type MonthlyData = Record<string, CategoryData>;
export type YearlyData = Record<string, MonthlyData>;

export interface EmissionCalculationProps {
  categoryId: string;
  itemId: string;
  formData: YearlyData;
  selectedMonth: string;
  selectedYear: string;
}

export interface CategoryItemsProps {
  selectedCategory: string;
  formData: YearlyData;
  selectedMonth: string;
  selectedYear: string;
  onValueChange: (categoryId: string, itemId: string, value: string) => void;
}

export interface EmissionsSummaryPanelProps {
  monthlyTotal: number;
  yearlyTotal: number;
  selectedMonth: string;
  selectedYear: number | string;
}
