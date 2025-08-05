
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ESGCapItem } from '../../types/esgDD';
import { ESGCapReviewDialog } from './ESGCapReviewDialog';

interface ESGCapRowActionsProps {
  item: ESGCapItem;
  onUpdate: (updatedItem: ESGCapItem) => void;
}

export const ESGCapRowActions: React.FC<ESGCapRowActionsProps> = ({ item, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
        Review
      </Button>
      <ESGCapReviewDialog 
        item={item}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};
