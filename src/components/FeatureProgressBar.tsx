import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface FeatureProgressBarProps {
  totalKPIs: number;
  filledKPIs: number;
  className?: string;
  // These props are kept for backward compatibility but not used in the simplified version
  mandatory?: { total: number; filled: number };
  optional?: { total: number; filled: number };
}

export const FeatureProgressBar = ({ 
  totalKPIs, 
  filledKPIs, 
  className 
}: FeatureProgressBarProps) => {
  const percentage = useMemo(() => {
    if (totalKPIs === 0) return 0;
    return Math.round((filledKPIs / totalKPIs) * 100);
  }, [totalKPIs, filledKPIs]);

  // Color gradient: Red (0-25) → Orange (26-50) → Yellow (51-75) → Green (76-100)
  const getProgressColor = () => {
    if (percentage >= 76) return 'bg-status-success';
    if (percentage >= 51) return 'bg-yellow-500';
    if (percentage >= 26) return 'bg-orange-500';
    return 'bg-status-error';
  };

  const getTextColor = () => {
    if (percentage >= 76) return 'text-status-success';
    if (percentage >= 51) return 'text-yellow-600';
    if (percentage >= 26) return 'text-orange-600';
    return 'text-status-error';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Overall Progress Bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: <span className={cn('font-semibold', getTextColor())}>{filledKPIs}</span> of {totalKPIs} KPIs filled
        </span>
        <span className={cn('font-bold', getTextColor())}>{percentage}%</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            getProgressColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Legend */}
      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
        <span>0%</span>
        <div className="flex gap-4">
          <span className="text-status-error">●</span>
          <span className="text-orange-500">●</span>
          <span className="text-yellow-500">●</span>
          <span className="text-status-success">●</span>
        </div>
        <span>100%</span>
      </div>
    </div>
  );
};
