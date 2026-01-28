import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Send, Upload } from "lucide-react";
import { Scope2Entry, Scope2FormData, Scope2SourceType } from '@/types/scope2-ghg';
import Scope2CategoryCard from './Scope2CategoryCard';
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
const SAMPLE_ENTRIES: Scope2Entry[] = [
  {
    id: 'sample-1',
    facilityName: 'Pune Plant 1',
    businessUnit: 'Operations – West India',
    reportingPeriod: 'FY 2024–25',
    sourceType: 'Purchased Electricity',
    emissionSourceCategory: 'Grid Electricity',
    emissionSourceDescription: 'Electricity purchased from grid',
    utilityProviderName: 'MSEDCL',
    countryRegion: 'India',
    gridEmissionFactorSource: 'CEA India Baseline 2023',
    emissionFactor: 0.82,
    activityDataValue: 250000,
    activityDataUnit: 'kWh',
    scope2Category: 'Location-Based',
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 205000,
    emissionCH4: 12,
    emissionN2O: 8,
    totalEmission: 205.02,
    calculationMethodology: 'GHG Protocol - Scope 2',
    dataSource: 'Electricity bills',
    measurementFrequency: 'Monthly',
    dataQuality: 'High',
    verifiedBy: 'Internal Sustainability Team',
    emissionSourceId: 'S2-ELEC-001',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Plant grid electricity consumption',
  },
  {
    id: 'sample-2',
    facilityName: 'Head Office',
    businessUnit: 'Corporate',
    reportingPeriod: 'FY 2024–25',
    sourceType: 'Purchased Electricity',
    emissionSourceCategory: 'Renewable PPA',
    emissionSourceDescription: 'Electricity from solar PPA',
    utilityProviderName: 'GreenVolt Power Pvt Ltd.',
    countryRegion: 'India',
    gridEmissionFactorSource: 'Supplier-provided EF',
    emissionFactor: 0.05,
    activityDataValue: 50000,
    activityDataUnit: 'kWh',
    scope2Category: 'Market-Based',
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 2500,
    emissionCH4: 0.1,
    emissionN2O: 0.05,
    totalEmission: 2.5,
    calculationMethodology: 'GHG Protocol - Market-based method',
    dataSource: 'Supplier invoices',
    measurementFrequency: 'Quarterly',
    dataQuality: 'High',
    verifiedBy: 'Internal Sustainability Team',
    emissionSourceId: 'S2-ELEC-002',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Solar PPA for head office',
  },
  {
    id: 'sample-3',
    facilityName: 'Food Processing Unit',
    businessUnit: 'Operations – North India',
    reportingPeriod: 'FY 2024–25',
    sourceType: 'Purchased Steam',
    emissionSourceCategory: 'Imported Steam',
    emissionSourceDescription: 'Steam from external supplier',
    utilityProviderName: 'SteamCo Industries',
    countryRegion: 'India',
    gridEmissionFactorSource: 'Supplier Data (Steam EF)',
    emissionFactor: 0.25,
    activityDataValue: 10000,
    activityDataUnit: 'kWh equivalent',
    scope2Category: 'Location-Based',
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 2500,
    emissionCH4: 5,
    emissionN2O: 3,
    totalEmission: 2.51,
    calculationMethodology: 'GHG Protocol - Steam conversion',
    dataSource: 'Supplier invoice',
    measurementFrequency: 'Annually',
    dataQuality: 'Medium',
    verifiedBy: 'Facility Manager',
    emissionSourceId: 'S2-STEAM-003',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Steam used for food sterilization process',
  },
];

export const NewScope2Form = () => {
  const { toast } = useToast();
  // const { createApprovalRequest } = useMakerChecker();
  const navigate = useNavigate();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Initialize with sample data for demonstration
  const [entries, setEntries] = useState<Scope2Entry[]>(SAMPLE_ENTRIES);
  const [expandedCategories, setExpandedCategories] = useState<Record<Scope2SourceType, boolean>>({
    'Purchased Electricity': true,
    'Purchased Steam': false,
    'Purchased Heat': false,
    'Purchased Cooling': false,
  });
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const toggleCategory = (sourceType: Scope2SourceType) => {
    setExpandedCategories(prev => ({
      ...prev,
      [sourceType]: !prev[sourceType],
    }));
  };

  const handleAddNew = (sourceType: Scope2SourceType) => {
    navigate(`/ghg-accounting/scope2/entry`, { 
      state: { 
        sourceType, 
        month: selectedMonth, 
        year: selectedYear 
      } 
    });
  };

  const handleEditEntry = (entry: Scope2Entry) => {
    navigate(`/ghg-accounting/scope2/entry`, { 
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

  const handleBulkUpload = (uploadedEntries: Scope2Entry[]) => {
    setEntries(prev => [...prev, ...uploadedEntries]);
    toast({
      title: "Bulk Upload Complete",
      description: `Successfully added ${uploadedEntries.length} emission entries.`,
    });
  };

  const handleSaveDraft = () => {
    // Save to local storage or database
    const draftData: Scope2FormData = {
      month: selectedMonth,
      year: selectedYear,
      entries,
    };
    
    localStorage.setItem(`scope2_draft_${selectedMonth}_${selectedYear}`, JSON.stringify(draftData));
    
    toast({
      title: "Draft Saved",
      description: `Your Scope 2 data for ${selectedMonth} ${selectedYear} has been saved as draft.`,
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

    const formData: Scope2FormData = {
      month: selectedMonth,
      year: selectedYear,
      entries,
    };

    try {
      const recordId = uuidv4(); // Generate unique ID for this submission
      
      // await createApprovalRequest({
      //   module: 'ghg_accounting',
      //   record_id: recordId,
      //   record_type: 'scope2_emissions',
      //   current_data: formData,
      //   change_summary: `Scope 2 emissions data for ${selectedMonth} ${selectedYear} - ${entries.length} entries totaling ${calculateTotalEmissions()} tCO₂e`,
      //   priority: 'medium',
      // });

      toast({
        title: "Submitted for Approval",
        description: "Your Scope 2 data has been submitted to the checker for review.",
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

  const getEntriesBySourceType = (sourceType: Scope2SourceType): Scope2Entry[] => {
    return entries.filter(entry => entry.sourceType === sourceType);
  };

  const sourceTypes: Scope2SourceType[] = ['Purchased Electricity', 'Purchased Steam', 'Purchased Heat', 'Purchased Cooling'];

  // Calculate location-based and market-based totals
  const locationBasedTotal = entries
    .filter(e => e.scope2Category === 'Location-Based')
    .reduce((sum, entry) => sum + entry.totalEmission, 0);
  const marketBasedTotal = entries
    .filter(e => e.scope2Category === 'Market-Based')
    .reduce((sum, entry) => sum + entry.totalEmission, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 2: Indirect Emissions from Purchased Energy</CardTitle>
          <CardDescription>
            Record indirect GHG emissions from purchased electricity, steam, heat, and cooling for {selectedMonth} {selectedYear}
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

            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Location-Based</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{locationBasedTotal.toFixed(2)} <span className="text-sm font-normal">tCO₂e</span></div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Market-Based</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketBasedTotal.toFixed(2)} <span className="text-sm font-normal">tCO₂e</span></div>
              </CardContent>
            </Card>
          </div>

          {/* Category Cards */}
          <div className="space-y-4">
            {sourceTypes.map((sourceType) => (
              <Scope2CategoryCard
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

export default NewScope2Form;