
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { months, yearsToShow } from '@/data/ghg/calculator';

interface MonthYearSelectorProps {
  selectedMonth: string;
  selectedYear: number;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Label htmlFor="month-select">Month</Label>
        <Select
          value={selectedMonth}
          onValueChange={onMonthChange}
        >
          <SelectTrigger id="month-select">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="year-select">Year</Label>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger id="year-select">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearsToShow.map(year => (
              <SelectItem key={year.toString()} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MonthYearSelector;
