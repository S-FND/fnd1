import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Clock,
  AlertTriangle,
  Upload,
  RotateCcw,
  X,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;

  // Normalize status
  const normalizedStatus = status.toLowerCase().trim();

  const baseClass =
    "px-2.5 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 whitespace-nowrap border transition-colors duration-200";

  const getBadge = () => {
    switch (normalizedStatus) {
      case 'due-in-this-month':
      case 'due in this month':
        return (
          <Badge
            className={`${baseClass} bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 hover:text-orange-800 hover:border-orange-400`}
          >
            <AlertTriangle className="h-3 w-3 text-orange-500 group-hover:text-orange-600" />
            Due in this Month
          </Badge>
        );

      case 'overdue':
        return (
          <Badge
            className={`${baseClass} bg-red-100 text-red-700 border-red-300 hover:bg-red-200 hover:text-red-800 hover:border-red-400`}
          >
            <X className="h-3 w-3 text-red-500" />
            Overdue
          </Badge>
        );

      case 'partly-submitted':
      case 'partly submitted':
        return (
          <Badge
            className={`${baseClass} bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:text-blue-800 hover:border-blue-400`}
          >
            <Upload className="h-3 w-3 text-blue-500" />
            Partly Submitted
          </Badge>
        );

      case 'submitted-pending-review':
      case 'submitted pending review':
        return (
          <Badge
            className={`${baseClass} bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:text-purple-800 hover:border-purple-400`}
          >
            <Clock className="h-3 w-3 text-purple-500" />
            Submitted Pending Review
          </Badge>
        );

      case 'closed':
        return (
          <Badge
            className={`${baseClass} bg-green-100 text-green-700 border-green-300 hover:bg-green-200 hover:text-green-800 hover:border-green-400`}
          >
            <Check className="h-3 w-3 text-green-500" />
            Closed
          </Badge>
        );

      case 'upcoming':
        return (
          <Badge
            className={`${baseClass} bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-800 hover:border-slate-400`}
          >
            <Clock className="h-3 w-3 text-slate-500" />
            Upcoming
          </Badge>
        );

      default:
        return (
          <Badge
            variant="outline"
            className="px-2.5 py-0.5 text-xs rounded-full transition-colors duration-200 hover:bg-muted"
          >
            {status}
          </Badge>
        );
    }
  };

  return getBadge();
};