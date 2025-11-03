import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMakerChecker } from '@/hooks/useMakerChecker';
import { Scope4Entry, sampleScope4Data, AvoidedEmissionSourceType } from '@/types/scope4-ghg';
import Scope4CategoryCard from './Scope4CategoryCard';
import Scope4EntryDialog from './Scope4EntryDialog';
import BulkUploadDialog from './BulkUploadDialog';
import { useNavigate } from 'react-router-dom';

const mockTeamMembers = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Singh' },
  { id: '4', name: 'Amit Patel' },
  { id: '5', name: 'Sustainability Team' },
  { id: '6', name: 'External Auditor' },
  { id: '7', name: 'Internal Sustainability Team' }
];

const NewScope4Form: React.FC = () => {
  const [entries, setEntries] = useState<Scope4Entry[]>(sampleScope4Data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Scope4Entry | undefined>();
  const { toast } = useToast();
  const { createApprovalRequest } = useMakerChecker({});
  const navigate = useNavigate();

  const handleAddEntry = () => {
    setSelectedEntry(undefined);
    navigate('/ghg-accounting/scope4/entry');
  };

  const handleEditEntry = (entry: Scope4Entry) => {
    navigate('/ghg-accounting/scope4/entry', { state: { entry } });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast({
      title: "Entry deleted",
      description: "The Scope 4 entry has been removed.",
    });
  };

  const handleSaveEntry = (entry: Scope4Entry) => {
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      const newEntries = [...entries];
      newEntries[existingIndex] = entry;
      setEntries(newEntries);
      toast({
        title: "Entry updated",
        description: "The Scope 4 entry has been updated successfully.",
      });
    } else {
      setEntries([...entries, entry]);
      toast({
        title: "Entry added",
        description: "The Scope 4 entry has been added successfully.",
      });
    }
  };

  const handleBulkUpload = (uploadedEntries: Scope4Entry[]) => {
    setEntries([...entries, ...uploadedEntries]);
    toast({
      title: "Bulk upload successful",
      description: `${uploadedEntries.length} entries have been imported.`,
    });
  };

  const handleSubmitForApproval = async () => {
    if (entries.length === 0) {
      toast({
        title: "No data to submit",
        description: "Please add at least one entry before submitting for approval.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createApprovalRequest({
        module: 'ghg_accounting',
        record_id: `scope4-${Date.now()}`,
        record_type: 'create',
        current_data: entries,
        priority: 'medium'
      });

      toast({
        title: "Submitted for approval",
        description: "Your Scope 4 data has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting for approval.",
        variant: "destructive"
      });
    }
  };

  const sourceTypes: AvoidedEmissionSourceType[] = [
    "Product Use",
    "Product Manufacturing",
    "Product End-of-Life",
    "Transportation",
    "Energy Generation",
    "Other"
  ];

  const totalAvoidedEmissions = entries.reduce((sum, entry) => sum + entry.totalAvoidedEmission, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scope 4: Avoided Emissions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track emissions avoided through your products and services
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Avoided Emissions</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {totalAvoidedEmissions.toFixed(2)} tCO₂e
              </p>
              <p className="text-xs text-muted-foreground">{entries.length} entries</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleAddEntry}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Entry
        </Button>
        <Button variant="outline" onClick={() => setBulkUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
        <Button 
          variant="default" 
          onClick={handleSubmitForApproval}
          className="ml-auto"
        >
          Submit for Approval
        </Button>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {sourceTypes.map((sourceType) => {
          const categoryEntries = entries.filter(e => e.sourceType === sourceType);
          
          if (categoryEntries.length === 0) return null;
          
          return (
            <Scope4CategoryCard
              key={sourceType}
              sourceType={sourceType}
              entries={categoryEntries}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          );
        })}
      </div>

      {entries.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No Scope 4 entries yet</p>
            <Button onClick={handleAddEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Entry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Scope4EntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEntry}
        entry={selectedEntry}
        teamMembers={mockTeamMembers}
      />

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default NewScope4Form;
