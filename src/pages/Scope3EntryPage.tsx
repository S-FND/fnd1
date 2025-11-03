import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scope3EntryDialog } from '@/features/enterprise-admin/components/ghg/scope3/Scope3EntryDialog';
import { Scope3Entry, Scope3Category } from '@/types/scope3-ghg';

const Scope3EntryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { entry, category, month, year } = location.state || {};

  const handleSave = (savedEntry: Scope3Entry) => {
    // In a real app, this would save to the backend
    console.log('Saved entry:', savedEntry);
    navigate('/ghg-accounting');
  };

  const handleClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      navigate('/ghg-accounting');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Scope3EntryDialog
        open={isDialogOpen}
        onOpenChange={handleClose}
        onSave={handleSave}
        entry={entry}
        defaultCategory={category as Scope3Category}
        currentMonth={month || new Date().toLocaleString('en-US', { month: 'long' })}
        currentYear={year || new Date().getFullYear()}
      />
    </div>
  );
};

export default Scope3EntryPage;
