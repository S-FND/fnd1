import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DynamicYearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  showCurrentYearIndicator?: boolean;
  years?: string[]; // Optional custom years array
}

// Helper function to get current financial year
export const getCurrentFinancialYear = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan

  // Financial year starts in April (month >= 3)
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}-${endYear}`;
};

// Generate default year options (last 5 years)
export const generateYearOptions = (count: number = 5): string[] => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 = Jan

  // Start from current financial year
  let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;

  const years = [];

  // Generate specified number of financial years including current
  for (let i = 0; i < count; i++) {
    const fy = `${startYear - i}-${startYear - i + 1}`;
    years.push(fy);
  }

  return years;
};

const DynamicYearFilter: React.FC<DynamicYearFilterProps> = ({
  selectedYear,
  onYearChange,
  placeholder = "Select Financial Year",
  className = "",
  showCurrentYearIndicator = true,
  years: customYears,
}) => {
  const CURRENT_FINANCIAL_YEAR = getCurrentFinancialYear();
  const yearOptions = customYears || generateYearOptions();

  return (
    <div className={`space-y-2 ${className}`}>
      {/* {label && <Label className="text-sm font-medium">{label}</Label>} */}
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger
          className={`w-[180px] ${selectedYear === CURRENT_FINANCIAL_YEAR && showCurrentYearIndicator ? 'border-green-500 bg-green-50' : ''}`}
        >
          <SelectValue placeholder={placeholder}>
            {selectedYear || placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((year) => {
            const [start, end] = year.split('-');
            const isCurrentYear = year === CURRENT_FINANCIAL_YEAR;
            
            return (
              <SelectItem
                key={year}
                value={year}
                className={isCurrentYear && showCurrentYearIndicator ? 'bg-green-50 font-medium' : ''}
              >
                FY {start}-{end.slice(-2)}
                {isCurrentYear && showCurrentYearIndicator && " (Current)"}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {selectedYear === CURRENT_FINANCIAL_YEAR && showCurrentYearIndicator && (
        <p className="text-xs text-green-600">
          ✓ Current financial year selected
        </p>
      )}
    </div>
  );
};

export default DynamicYearFilter;