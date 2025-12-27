
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, Send, Upload } from "lucide-react";
import { Scope1Entry, Scope1FormData, SourceType } from '@/types/scope1-ghg';
import Scope1CategoryCard from './Scope1CategoryCard';
import BulkUploadDialog from './BulkUploadDialog';
import MonthYearSelector from '../MonthYearSelector';
// import { useMakerChecker } from '@/hooks/useMakerChecker';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

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
  // const { createApprovalRequest } = useMakerChecker();
  const navigate = useNavigate();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Initialize with sample data for demonstration
  const [entries, setEntries] = useState<Scope1Entry[]>(SAMPLE_ENTRIES);
  const [expandedCategories, setExpandedCategories] = useState<Record<SourceType, boolean>>({
    'Stationary': true,
    'Mobile': false,
    'Fugitive': false,
    'Process': false,
  });
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const toggleCategory = (sourceType: SourceType) => {
    setExpandedCategories(prev => ({
      ...prev,
      [sourceType]: !prev[sourceType],
    }));
  };

  const handleAddNew = (sourceType: SourceType) => {
    navigate(`/ghg-accounting/scope1/entry`, { 
      state: { 
        sourceType, 
        month: selectedMonth, 
        year: selectedYear 
      } 
    });
  };

  const handleEditEntry = (entry: Scope1Entry) => {
    navigate(`/ghg-accounting/scope1/entry`, { 
      state: { 
        entry, 
        month: selectedMonth, 
        year: selectedYear 
      } 
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Entry Deleted",
      description: "The emission entry has been removed.",
      variant: "destructive",
    });
  };

  const handleBulkUpload = (uploadedEntries: Scope1Entry[]) => {
    setEntries(prev => [...prev, ...uploadedEntries]);
    toast({
      title: "Bulk Upload Complete",
      description: `Successfully added ${uploadedEntries.length} emission entries.`,
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
      
      // await createApprovalRequest({
      //   module: 'ghg_accounting',
      //   record_id: recordId,
      //   record_type: 'scope1_emissions',
      //   current_data: formData,
      //   change_summary: `Scope 1 emissions data for ${selectedMonth} ${selectedYear} - ${entries.length} entries totaling ${calculateTotalEmissions()} tCO₂e`,
      //   priority: 'medium',
      // });

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

  const getEntriesBySourceType = (sourceType: SourceType): Scope1Entry[] => {
    return entries.filter(entry => entry.sourceType === sourceType);
  };

  const sourceTypes: SourceType[] = ['Stationary', 'Mobile', 'Fugitive', 'Process'];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {sourceTypes.slice(0, 2).map((type) => {
              const typeEntries = getEntriesBySourceType(type);
              const total = typeEntries.reduce((sum, e) => sum + e.totalEmission, 0);
              return (
                <Card key={type}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{total.toFixed(2)} <span className="text-sm font-normal">tCO₂e</span></div>
                    <div className="text-xs text-muted-foreground">{typeEntries.length} entries</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Category Cards */}
          <div className="space-y-4">
            {sourceTypes.map((sourceType) => (
              <Scope1CategoryCard
                key={sourceType}
                sourceType={sourceType}
                entries={getEntriesBySourceType(sourceType)}
                isExpanded={expandedCategories[sourceType]}
                onToggle={() => toggleCategory(sourceType)}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onAddNew={handleAddNew}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
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

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onUpload={handleBulkUpload}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
      />

    </div>
  );
};

export default NewScope1Form;
