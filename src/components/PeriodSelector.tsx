import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
const QUARTERS_WITH_ANNUAL = ['Q1', 'Q2', 'Q3', 'Q4', 'Annual'] as const;
const YEARS = [2023, 2024, 2025, 2026] as const;

interface PeriodSelectorProps {
  quarter: string;
  year: number;
  onQuarterChange: (quarter: string) => void;
  onYearChange: (year: number) => void;
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
  includeAnnual?: boolean;
}

export const PeriodSelector = ({
  quarter,
  year,
  onQuarterChange,
  onYearChange,
  className = '',
  showIcon = true,
  disabled = false,
  includeAnnual = false,
}: PeriodSelectorProps) => {
  const quarterOptions = includeAnnual ? QUARTERS_WITH_ANNUAL : QUARTERS;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Calendar className="w-4 h-4 text-muted-foreground" />}
      <Select value={quarter} onValueChange={onQuarterChange} disabled={disabled}>
        <SelectTrigger className="w-28 h-9">
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent>
          {quarterOptions.map(q => (
            <SelectItem key={q} value={q}>{q}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year.toString()} onValueChange={(v) => onYearChange(parseInt(v))} disabled={disabled}>
        <SelectTrigger className="w-24 h-9">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map(y => (
            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Helper to get display label for a period
export const getPeriodLabel = (quarter: string, year: number): string => {
  return `${quarter} ${year}`;
};

// Helper to get previous quarters (for historical reference)
export const getPreviousQuarters = (currentQuarter: string, currentYear: number, count: number = 2): Array<{ quarter: string; year: number }> => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const results: Array<{ quarter: string; year: number }> = [];
  
  let qIdx = quarters.indexOf(currentQuarter);
  let yr = currentYear;
  
  for (let i = 0; i < count; i++) {
    qIdx--;
    if (qIdx < 0) {
      qIdx = 3;
      yr--;
    }
    results.push({ quarter: quarters[qIdx], year: yr });
  }
  
  return results;
};

// Available quarters for company to fill (current + 2 previous)
export const getAvailableQuarters = (): Array<{ quarter: string; year: number; label: string }> => {
  // 2025 cycle is closed; only Q1 2026 (JFM 2026) is open for editing.
  return [
    { quarter: 'Q1', year: 2025, label: 'Q1 2025 (Jan-Mar)' },
    { quarter: 'Q2', year: 2025, label: 'Q2 2025 (Apr-Jun)' },
    { quarter: 'Q3', year: 2025, label: 'Q3 2025 (Jul-Sep)' },
    { quarter: 'Q4', year: 2025, label: 'Q4 2025 (Oct-Dec)' },
    { quarter: 'Q1', year: 2026, label: 'Q1 2026 (Jan-Mar)' },
  ];
};

// Get annual year label for Jan-Dec (not financial year)
export const getAnnualYearLabel = (year: number): string => {
  return `Jan-Dec ${year}`;
};
