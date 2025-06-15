
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ESGCategory } from '../../types/esgDD';

interface CategoryBadgeProps {
  category: ESGCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  switch (category) {
    case 'environmental':
      return <Badge className="bg-green-500">Environmental</Badge>;
    case 'social':
      return <Badge className="bg-blue-500">Social</Badge>;
    case 'governance':
      return <Badge className="bg-purple-500">Governance</Badge>;
    default:
      return null;
  }
};
