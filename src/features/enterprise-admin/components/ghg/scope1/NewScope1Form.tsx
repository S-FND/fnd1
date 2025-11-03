import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Save, Send } from "lucide-react";
import { Scope1Entry, Scope1FormData } from '@/types/scope1-ghg';
import Scope1DataTable from './Scope1DataTable';
import Scope1EntryDialog from './Scope1EntryDialog';
import MonthYearSelector from '../MonthYearSelector';
import { useMakerChecker } from '@/hooks/useMakerChecker';
import { v4 as uuidv4 } from 'uuid';

// Mock team members - replace with actual data from your auth system
const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Patel' },
  { id: '4', name: 'Amit Singh' },
  { id: '5', name: 'Sanjana Reddy' },
];

// Sample data for demonstration
const SAMPLE_ENTRIES: Scope1Entry[] = [
  {
    id: 'sample-1',
    facilityName: 'Pune Plant 1',
    businessUnit: 'Operations – West India',
    reportingPeriod: 'FY 2024–25',
    sourceType: 'Stationary',
    emissionSourceCategory: 'Stationary Combustion',
    emissionSourceDescription: 'Diesel Generator',
    fuelSubstanceType: 'Diesel',
    activityDataValue: 5000,
    activityDataUnit: 'litres',
    emissionFactorSource: 'IPCC 2006',
    emissionFactor: 2.68,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 13400,
    emissionCH4: 45,
    emissionN2O: 22,
    totalEmission: 14.2,
    calculationMethodology: 'GHG Protocol - Direct calculation',
    dataSource: 'Fuel purchase invoice',
    measurementFrequency: 'Monthly',
    dataQuality: 'High',
    verifiedBy: 'Internal Sustainability Team',
    emissionSourceId: 'S1-FUEL-001',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Used during power outages',
  },
  {
    id: 'sample-2',
    facilityName: 'Logistics Fleet',
    businessUnit: 'Distribution',
    reportingPeriod: 'FY 2024–25',
    sourceType: 'Mobile',
    emissionSourceCategory: 'Company Vehicle Fleet',
    emissionSourceDescription: 'Delivery Trucks',
    fuelSubstanceType: 'Diesel',
    activityDataValue: 12000,
    activityDataUnit: 'litres',
    emissionFactorSource: 'DEFRA 2024',
    emissionFactor: 2.68,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 32160,
    emissionCH4: 110,
    emissionN2O: 55,
    totalEmission: 33.8,
    calculationMethodology: 'GHG Protocol - Fleet emissions',
    dataSource: 'Fuel card data',
    measurementFrequency: 'Monthly',
    dataQuality: 'Medium',
    verifiedBy: 'Internal Sustainability Team',
    emissionSourceId: 'S1-MOB-002',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Regular fuel use for deliveries',
  },
  {
    id: 'sample-3',
    facilityName: 'Head Office',
    businessUnit: 'Corporate',
    reportingPeriod: 'FY 2024–25',
    sourceType: 'Fugitive',
    emissionSourceCategory: 'Refrigerant Leakage',
    emissionSourceDescription: 'HVAC System',
    fuelSubstanceType: 'R-410A',
    activityDataValue: 5,
    activityDataUnit: 'kg',
    emissionFactorSource: 'IPCC 2006',
    emissionFactor: 2088,
    ghgIncluded: 'HFCs',
    emissionCO2: 0,
    emissionCH4: 0,
    emissionN2O: 0,
    totalEmission: 10.44,
    calculationMethodology: 'GHG Protocol - Fugitive emission factor',
    dataSource: 'Maintenance record',
    measurementFrequency: 'Annually',
    dataQuality: 'Medium',
    verifiedBy: 'Facility Manager',
    emissionSourceId: 'S1-FUG-003',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Annual top-up recorded',
  },
];

export const NewScope1Form = () => {
  const { toast } = useToast();
  const { createApprovalRequest } = useMakerChecker();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Initialize with sample data for demonstration
  const [entries, setEntries] = useState<Scope1Entry[]>(SAMPLE_ENTRIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Scope1Entry | null>(null);

  const handleAddEntry = (entry: Scope1Entry) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
      toast({
        title: "Entry Updated",
        description: "The emission entry has been updated successfully.",
      });
    } else {
      setEntries(prev => [...prev, entry]);
      toast({
        title: "Entry Added",
        description: "New emission entry has been added successfully.",
      });
    }
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: Scope1Entry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Entry Deleted",
      description: "The emission entry has been removed.",
      variant: "destructive",
    });
  };

  const handleSaveDraft = () => {
    // Save to local storage or database
    const draftData: Scope1FormData = {
      month: selectedMonth,
      year: selectedYear,
      entries,
    };
    
    localStorage.setItem(`scope1_draft_${selectedMonth}_${selectedYear}`, JSON.stringify(draftData));
    
    toast({
      title: "Draft Saved",
      description: `Your Scope 1 data for ${selectedMonth} ${selectedYear} has been saved as draft.`,
    });
  };

  const handleSubmitForApproval = async () => {
    if (entries.length === 0) {
      toast({
        title: "No Data",
        description: "Please add at least one entry before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData: Scope1FormData = {
      month: selectedMonth,
      year: selectedYear,
      entries,
    };

    try {
      const recordId = uuidv4(); // Generate unique ID for this submission
      
      await createApprovalRequest({
        module: 'ghg_accounting',
        record_id: recordId,
        record_type: 'scope1_emissions',
        current_data: formData,
        change_summary: `Scope 1 emissions data for ${selectedMonth} ${selectedYear} - ${entries.length} entries totaling ${calculateTotalEmissions()} tCO₂e`,
        priority: 'medium',
      });

      toast({
        title: "Submitted for Approval",
        description: "Your Scope 1 data has been submitted to the checker for review.",
      });

      // Clear entries after submission
      setEntries([]);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit data for approval. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalEmissions = (): string => {
    const total = entries.reduce((sum, entry) => sum + entry.totalEmission, 0);
    return total.toFixed(2);
  };

  const getTotalEmissionsBySourceType = () => {
    const byType: Record<string, number> = {};
    entries.forEach(entry => {
      byType[entry.sourceType] = (byType[entry.sourceType] || 0) + entry.totalEmission;
    });
    return byType;
  };

  const emissionsByType = getTotalEmissionsBySourceType();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 1: Direct Emissions</CardTitle>
          <CardDescription>
            Record direct GHG emissions from owned or controlled sources for {selectedMonth} {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MonthYearSelector 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entries.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateTotalEmissions()} <span className="text-sm font-normal">tCO₂e</span></div>
              </CardContent>
            </Card>

            {Object.entries(emissionsByType).slice(0, 2).map(([type, value]) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value.toFixed(2)} <span className="text-sm font-normal">tCO₂e</span></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <Button onClick={() => {
              setEditingEntry(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Entry
            </Button>
          </div>

          {/* Data Table */}
          <Scope1DataTable 
            entries={entries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline">
          Import from CSV
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmitForApproval}>
            <Send className="mr-2 h-4 w-4" />
            Submit for Approval
          </Button>
        </div>
      </div>

      {/* Entry Dialog */}
      <Scope1EntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddEntry}
        entry={editingEntry}
        teamMembers={MOCK_TEAM_MEMBERS}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
      />
    </div>
  );
};

export default NewScope1Form;
