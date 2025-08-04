
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check, Loader, X } from 'lucide-react';
import { ESGCapItem } from '../../types/esgDD';

interface StatusBadgeProps {
  status: ESGCapItem['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'in_review':
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <Loader className="h-3 w-3 mr-1" /> In Review
        </Badge>
      );
    case 'accepted':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          <Check className="h-3 w-3 mr-1" /> Accepted
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          <X className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Loader className="h-3 w-3 mr-1 animate-spin" /> In Progress
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <Check className="h-3 w-3 mr-1" /> Completed
        </Badge>
      );
    case 'delayed':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <X className="h-3 w-3 mr-1" /> Delayed
        </Badge>
      );
    default:
      return null;
  }
};
