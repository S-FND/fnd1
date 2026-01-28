import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Scope4Entry } from '@/types/scope4-ghg';
import Scope4EntryDialog from '@/features/enterprise-admin/components/ghg/scope4/Scope4EntryDialog';

const mockTeamMembers = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Singh' },
  { id: '4', name: 'Amit Patel' },
  { id: '5', name: 'Sustainability Team' },
  { id: '6', name: 'External Auditor' },
  { id: '7', name: 'Internal Sustainability Team' }
];

export default function Scope4EntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(true);
  const entry = location.state?.entry as Scope4Entry | undefined;

  useEffect(() => {
    if (!location.state) {
      navigate('/ghg-accounting');
    }
  }, [location.state, navigate]);

  const handleSave = (savedEntry: Scope4Entry) => {
    // Get existing entries from localStorage
    const existingEntries = JSON.parse(localStorage.getItem('scope4Entries') || '[]');
    
    // Update or add the entry
    const entryIndex = existingEntries.findIndex((e: Scope4Entry) => e.id === savedEntry.id);
    if (entryIndex >= 0) {
      existingEntries[entryIndex] = savedEntry;
    } else {
      existingEntries.push(savedEntry);
    }
    
    // Save back to localStorage
    localStorage.setItem('scope4Entries', JSON.stringify(existingEntries));
    
    // Navigate back
    navigate('/ghg-accounting', { state: { activeTab: 'scope4' } });
  };

  const handleCancel = () => {
    navigate('/ghg-accounting', { state: { activeTab: 'scope4' } });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to GHG Accounting
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            {entry ? 'Edit' : 'Add'} Scope 4 Entry
          </h1>
          <p className="text-muted-foreground">
            {entry ? 'Update' : 'Enter'} avoided emissions data
          </p>
        </div>

        <Card className="p-6">
          <Scope4EntryDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) handleCancel();
            }}
            onSave={handleSave}
            entry={entry}
            teamMembers={mockTeamMembers}
          />
        </Card>
      </div>
    </div>
  );
}