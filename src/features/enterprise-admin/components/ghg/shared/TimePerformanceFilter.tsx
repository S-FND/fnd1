import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { months } from '@/data/ghg/calculator';

export type ViewMode = 'monthly' | 'yearly';

interface TimePeriodFilterProps {
  viewMode: ViewMode;
  selectedMonth?: string;
  selectedYear: string;
  onViewModeChange: (mode: ViewMode) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

/* ✅ Current Financial Year */
const getCurrentFinancialYear = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan

  const startYear = month >= 3 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

/* ✅ Generate FY list */
const generateFinancialYears = (count = 5): string[] => {
  const startYear = Number(getCurrentFinancialYear().split('-')[0]);
  return Array.from({ length: count }, (_, i) => {
    const y = startYear - i;
    return `${y}-${y + 1}`;
  });
};

/* ✅ Financial Year Month Order (Apr → Mar) */
const fyMonthsOrder = [
  'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
];

/* ✅ Safe filtered months */
const financialYearMonths = fyMonthsOrder;

export const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({
  viewMode,
  selectedMonth,
  selectedYear,
  onViewModeChange,
  onMonthChange,
  onYearChange,
}) => {
  const financialYears = generateFinancialYears(5);

  return (
    <div className="flex flex-wrap gap-4 items-end">

      {/* View Mode */}
      <div className="space-y-2">
        <Label>View Mode</Label>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={viewMode === 'yearly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('yearly')}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Month (Monthly only) */}
      {viewMode === 'monthly' && (
        <div className="space-y-2">
          <Label>Month</Label>
          <Select
            value={selectedMonth}
            onValueChange={onMonthChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {financialYearMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Financial Year */}
      <div className="space-y-2">
        <Label>Financial Year</Label>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {financialYears.map((fy) => (
              <SelectItem key={fy} value={fy}>
                FY {fy}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};

export default TimePeriodFilter;
