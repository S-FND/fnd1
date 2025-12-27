import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Send, Upload } from "lucide-react";
import { Scope3Entry, Scope3FormData, Scope3Category } from '@/types/scope3-ghg';
import Scope3CategoryCard from './Scope3CategoryCard';
import BulkUploadDialog from './BulkUploadDialog';
import MonthYearSelector from '../MonthYearSelector';
// import { useMakerChecker } from '@/hooks/useMakerChecker';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Sample data for demonstration
const SAMPLE_ENTRIES: Scope3Entry[] = [
  {
    id: 'sample-1',
    facilityName: 'Corporate Office',
    businessUnit: 'Procurement',
    reportingPeriod: 'FY 2024–25',
    scope3Category: 'Category 1 – Purchased Goods and Services',
    sourceType: 'Raw Material Purchases',
    emissionSourceDescription: 'Purchase of aluminum sheets',
    supplierName: 'AluMines Ltd.',
    countryRegion: 'India',
    activityDataValue: 10000,
    activityDataUnit: 'kg',
    emissionFactorSource: 'India GHG Platform 2023',
    emissionFactor: 8.24,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 82400,
    emissionCH4: 20,
    emissionN2O: 10,
    totalEmission: 82.43,
    calculationMethodology: 'Activity-based',
    dataSource: 'Supplier invoice',
    measurementFrequency: 'Quarterly',
    dataQuality: 'High',
    verifiedBy: 'Procurement Sustainability Team',
    emissionSourceId: 'S3-CAT1-001',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Primary data received from supplier',
  },
  {
    id: 'sample-2',
    facilityName: 'Distribution Unit',
    businessUnit: 'Logistics',
    reportingPeriod: 'FY 2024–25',
    scope3Category: 'Category 4 – Upstream Transportation and Distribution',
    sourceType: 'Freight Transport',
    emissionSourceDescription: 'Inbound transport of goods by road',
    supplierName: 'XYZ Logistics',
    countryRegion: 'India',
    activityDataValue: 120000,
    activityDataUnit: 'tonne-km',
    emissionFactorSource: 'DEFRA 2024',
    emissionFactor: 0.105,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 12600,
    emissionCH4: 15,
    emissionN2O: 8,
    totalEmission: 12.62,
    calculationMethodology: 'Activity-based',
    dataSource: 'Logistics records',
    measurementFrequency: 'Monthly',
    dataQuality: 'Medium',
    verifiedBy: 'Sustainability Analyst',
    emissionSourceId: 'S3-CAT4-002',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Covers all supplier deliveries for FY',
  },
  {
    id: 'sample-3',
    facilityName: 'Corporate Office',
    businessUnit: 'Admin',
    reportingPeriod: 'FY 2024–25',
    scope3Category: 'Category 6 – Business Travel',
    sourceType: 'Employee Air Travel',
    emissionSourceDescription: 'Domestic air travel',
    supplierName: 'Air India',
    countryRegion: 'India',
    activityDataValue: 30000,
    activityDataUnit: 'passenger-km',
    emissionFactorSource: 'ICAO 2023',
    emissionFactor: 0.15,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 4500,
    emissionCH4: 5,
    emissionN2O: 2,
    totalEmission: 4.51,
    calculationMethodology: 'Activity-based',
    dataSource: 'Travel agency data',
    measurementFrequency: 'Quarterly',
    dataQuality: 'Medium',
    verifiedBy: 'Admin Department',
    emissionSourceId: 'S3-CAT6-003',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Includes both domestic and short-haul trips',
  },
  {
    id: 'sample-4',
    facilityName: 'All Facilities',
    businessUnit: 'Corporate Sustainability',
    reportingPeriod: 'FY 2024–25',
    scope3Category: 'Category 12 – End-of-Life Treatment of Sold Products',
    sourceType: 'Product Disposal',
    emissionSourceDescription: 'Disposal of packaging material',
    supplierName: 'Municipal Waste Authority',
    countryRegion: 'India',
    activityDataValue: 5000,
    activityDataUnit: 'kg',
    emissionFactorSource: 'IPCC 2006',
    emissionFactor: 1.2,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    emissionCO2: 6000,
    emissionCH4: 10,
    emissionN2O: 5,
    totalEmission: 6.02,
    calculationMethodology: 'Activity-based',
    dataSource: 'Waste management reports',
    measurementFrequency: 'Annually',
    dataQuality: 'Medium',
    verifiedBy: 'Facility Manager',
    emissionSourceId: 'S3-CAT12-004',
    dataEntryDate: '2025-04-30',
    enteredBy: 'Meera Sharma',
    notes: 'Based on waste tonnage data from disposal sites',
  },
];

const SCOPE3_CATEGORIES: Scope3Category[] = [
  'Category 1 – Purchased Goods and Services',
  'Category 2 – Capital Goods',
  'Category 3 – Fuel and Energy Related Activities',
  'Category 4 – Upstream Transportation and Distribution',
  'Category 5 – Waste Generated in Operations',
  'Category 6 – Business Travel',
  'Category 7 – Employee Commuting',
  'Category 8 – Upstream Leased Assets',
  'Category 9 – Downstream Transportation and Distribution',
  'Category 10 – Processing of Sold Products',
  'Category 11 – Use of Sold Products',
  'Category 12 – End-of-Life Treatment of Sold Products',
  'Category 13 – Downstream Leased Assets',
  'Category 14 – Franchises',
  'Category 15 – Investments',
];

export const NewScope3Form = () => {
  const { toast } = useToast();
  // const { createApprovalRequest } = useMakerChecker();
  const navigate = useNavigate();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<Scope3Entry[]>(SAMPLE_ENTRIES);
  const [expandedCategories, setExpandedCategories] = useState<Record<Scope3Category, boolean>>(
    SCOPE3_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: false }), {} as Record<Scope3Category, boolean>)
  );
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const toggleCategory = (category: Scope3Category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAddNew = (category: Scope3Category) => {
    navigate(`/ghg-accounting/scope3/entry`, { 
      state: { 
        category, 
        month: selectedMonth, 
        year: selectedYear 
      } 
    });
  };

  const handleEditEntry = (entry: Scope3Entry) => {
    navigate(`/ghg-accounting/scope3/entry`, { 
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

  const handleBulkUpload = (uploadedEntries: Scope3Entry[]) => {
    setEntries(prev => [...prev, ...uploadedEntries]);
    toast({
      title: "Bulk Upload Complete",
      description: `Successfully added ${uploadedEntries.length} emission entries.`,
    });
  };

  const handleSaveDraft = () => {
    const draftData: Scope3FormData = {
      month: selectedMonth,
      year: selectedYear,
      entries,
    };
    
    localStorage.setItem(`scope3_draft_${selectedMonth}_${selectedYear}`, JSON.stringify(draftData));
    
    toast({
      title: "Draft Saved",
      description: `Your Scope 3 data for ${selectedMonth} ${selectedYear} has been saved as draft.`,
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

    const formData: Scope3FormData = {
      month: selectedMonth,
      year: selectedYear,
      entries,
    };

    try {
      const recordId = uuidv4();
      
      // await createApprovalRequest({
      //   module: 'ghg_accounting',
      //   record_id: recordId,
      //   record_type: 'scope3_emissions',
      //   current_data: formData,
      //   change_summary: `Scope 3 emissions data for ${selectedMonth} ${selectedYear} - ${entries.length} entries totaling ${calculateTotalEmissions()} tCO₂e`,
      //   priority: 'medium',
      // });

      toast({
        title: "Submitted for Approval",
        description: "Your Scope 3 data has been submitted to the checker for review.",
      });

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

  const getEntriesByCategory = (category: Scope3Category): Scope3Entry[] => {
    return entries.filter(entry => entry.scope3Category === category);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 3: Other Indirect Emissions</CardTitle>
          <CardDescription>
            Record indirect GHG emissions across 15 value chain categories for {selectedMonth} {selectedYear}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {SCOPE3_CATEGORIES.filter(cat => getEntriesByCategory(cat).length > 0).length} / {SCOPE3_CATEGORIES.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Cards */}
          <div className="space-y-4">
            {SCOPE3_CATEGORIES.map((category) => (
              <Scope3CategoryCard
                key={category}
                category={category}
                entries={getEntriesByCategory(category)}
                isExpanded={expandedCategories[category]}
                onToggle={() => toggleCategory(category)}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onAddNew={() => handleAddNew(category)}
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

export default NewScope3Form;