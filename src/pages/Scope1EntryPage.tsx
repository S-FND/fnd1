import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { Scope1Entry, SourceType } from '@/types/scope1-ghg';
import Scope1EntryDialog from '@/features/enterprise-admin/components/ghg/scope1/Scope1EntryDialog';

// Mock team members - replace with actual data from your auth system
const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Patel' },
  { id: '4', name: 'Amit Singh' },
  { id: '5', name: 'Sanjana Reddy' },
];

export const Scope1EntryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { sourceType, entry, month, year } = location.state || {};
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    // Open dialog automatically when page loads
    if (!sourceType && !entry) {
      // No data provided, redirect back
      navigate('/ghg-accounting');
    }
  }, [sourceType, entry, navigate]);

  const handleSave = (savedEntry: Scope1Entry) => {
    // In a real app, this would save to the backend or parent component state
    // For now, we'll show a toast and navigate back
    
    // Get existing entries from localStorage
    const existingDraft = localStorage.getItem(`scope1_draft_${month}_${year}`);
    let draftData = existingDraft ? JSON.parse(existingDraft) : { month, year, entries: [] };
    
    if (entry) {
      // Update existing entry
      draftData.entries = draftData.entries.map((e: Scope1Entry) => 
        e.id === savedEntry.id ? savedEntry : e
      );
      toast({
        title: "Entry Updated",
        description: "The emission entry has been updated successfully.",
      });
    } else {
      // Add new entry
      draftData.entries.push(savedEntry);
      toast({
        title: "Entry Added",
        description: "New emission entry has been added successfully.",
      });
    }
    
    // Save back to localStorage
    localStorage.setItem(`scope1_draft_${month}_${year}`, JSON.stringify(draftData));
    
    // Navigate back
    navigate('/ghg-accounting');
  };

  const handleCancel = () => {
    navigate('/ghg-accounting');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {entry ? 'Edit' : 'Add New'} Scope 1 Emission Entry
          </h1>
          <p className="text-muted-foreground">
            {sourceType ? `${sourceType} Emissions` : 'Direct GHG Emissions'} - {month} {year}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emission Data Entry</CardTitle>
          <CardDescription>
            Fill in the details for the emission source. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Scope1EntryDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                handleCancel();
              }
            }}
            onSave={handleSave}
            entry={entry}
            teamMembers={MOCK_TEAM_MEMBERS}
            currentMonth={month}
            currentYear={year}
            defaultSourceType={sourceType}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope1EntryPage;
