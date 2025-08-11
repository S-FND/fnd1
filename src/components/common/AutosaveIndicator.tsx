import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutosaveState } from '@/types/portfolio';

interface AutosaveIndicatorProps {
  state: AutosaveState;
  onRetry?: () => void;
  className?: string;
}

export const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({
  state,
  onRetry,
  className,
}) => {
  const getStatusConfig = () => {
    switch (state.status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          className: 'text-blue-600',
          iconClassName: 'animate-spin',
        };
      case 'saved':
        return {
          icon: CheckCircle,
          text: state.lastSaved 
            ? `Saved ${formatRelativeTime(state.lastSaved)}`
            : 'Saved',
          className: 'text-green-600',
          iconClassName: '',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: state.error || 'Save failed',
          className: 'text-red-600',
          iconClassName: '',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  const { icon: Icon, text, className: statusClassName, iconClassName } = config;

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Icon className={cn('h-4 w-4', statusClassName, iconClassName)} />
      <span className={statusClassName}>{text}</span>
      {state.status === 'error' && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 10) return 'just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
}