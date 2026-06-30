import { cn } from '@/lib/utils';

interface CellNumberBadgeProps {
  /** KPI number (1, 2, 3...) */
  kpiNumber?: number;
  /** Field letter (a, b, c...) - if provided, combines with kpiNumber */
  fieldLetter?: string;
  /** Legacy: direct display value (for backward compatibility) */
  number?: number | string;
  className?: string;
}

/**
 * Displays a cell reference badge like "1a", "2b", etc.
 * 
 * Usage:
 * - For KPI rows: <CellNumberBadge kpiNumber={1} />
 * - For field rows: <CellNumberBadge kpiNumber={1} fieldLetter="a" />
 * - Legacy: <CellNumberBadge number="A1" />
 */
export const CellNumberBadge = ({ kpiNumber, fieldLetter, number, className }: CellNumberBadgeProps) => {
  // Determine display value
  let displayValue: string | number;
  
  if (kpiNumber !== undefined) {
    if (fieldLetter) {
      displayValue = `${kpiNumber}${fieldLetter}`;
    } else {
      displayValue = kpiNumber;
    }
  } else if (number !== undefined) {
    displayValue = number;
  } else {
    displayValue = '';
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-semibold rounded-full bg-primary/10 text-primary mr-2 flex-shrink-0",
        className
      )}
    >
      {displayValue}
    </span>
  );
};
