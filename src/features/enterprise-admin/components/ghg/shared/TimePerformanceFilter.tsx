import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { months } from '@/data/ghg/calculator';

export type ViewMode = 'monthly' | 'yearly';

interface TimePeriodFilterProps {
  viewMode: ViewMode;
  selectedMonth?: string;
  selectedYear: number;
  onViewModeChange: (mode: ViewMode) => void;
  onMonthChange?: (month: string) => void;
  onYearChange: (year: number) => void;
  availableYears?: number[];
}

export const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({
  viewMode,
  selectedMonth,
  selectedYear,
  onViewModeChange,
  onMonthChange,
  onYearChange,
  availableYears = [2022, 2023, 2024, 2025],
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-end">
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

      {viewMode === 'monthly' && onMonthChange && selectedMonth && (
        <div className="space-y-2">
          <Label>Month</Label>
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Year</Label>
        <Select value={selectedYear.toString()} onValueChange={(val) => onYearChange(parseInt(val))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimePeriodFilter;
