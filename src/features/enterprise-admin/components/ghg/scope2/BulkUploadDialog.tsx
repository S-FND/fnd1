import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from 'xlsx';
import { Scope2Entry, Scope2SourceType, Scope2Category, MeasurementFrequency, DataQuality } from '@/types/scope2-ghg';
import { v4 as uuidv4 } from 'uuid';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (entries: Scope2Entry[]) => void;
  currentMonth: string;
  currentYear: number;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
  onUpload,
  currentMonth,
  currentYear,
}) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const downloadTemplate = () => {
    // Create template data with headers and sample rows
    const templateData = [
      {
        'Facility / Location Name': 'Pune Plant 1',
        'Business Unit / Division': 'Operations – West India',
        'Reporting Period': 'FY 2024–25',
        'Source Type': 'Purchased Electricity',
        'Emission Source Category': 'Grid Electricity',
        'Emission Source Description': 'Electricity purchased from grid',
        'Utility Provider Name': 'MSEDCL',
        'Country / Region': 'India',
        'Grid Emission Factor Source': 'CEA India Baseline 2023',
        'Emission Factor (kg CO₂e/kWh or unit)': 0.82,
        'Activity Data Value (Energy Consumed)': 250000,
        'Activity Data Unit': 'kWh',
        'Scope 2 Category': 'Location-Based',
        'GHG Included': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 205000,
        'Emission (CH₄) (kg)': 12,
        'Emission (N₂O) (kg)': 8,
        'Total Emission (tCO₂e)': 205.02,
        'Calculation Methodology': 'GHG Protocol - Scope 2',
        'Data Source / Meter': 'Electricity bills',
        'Measurement Frequency': 'Monthly',
        'Data Quality / Confidence': 'High',
        'Verifier / Reviewed By': 'Internal Sustainability Team',
        'Emission Source ID / Code': 'S2-ELEC-001',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Plant grid electricity consumption',
      },
      {
        'Facility / Location Name': 'Head Office',
        'Business Unit / Division': 'Corporate',
        'Reporting Period': 'FY 2024–25',
        'Source Type': 'Purchased Electricity',
        'Emission Source Category': 'Renewable PPA',
        'Emission Source Description': 'Electricity from solar PPA',
        'Utility Provider Name': 'GreenVolt Power Pvt Ltd.',
        'Country / Region': 'India',
        'Grid Emission Factor Source': 'Supplier-provided EF',
        'Emission Factor (kg CO₂e/kWh or unit)': 0.05,
        'Activity Data Value (Energy Consumed)': 50000,
        'Activity Data Unit': 'kWh',
        'Scope 2 Category': 'Market-Based',
        'GHG Included': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 2500,
        'Emission (CH₄) (kg)': 0.1,
        'Emission (N₂O) (kg)': 0.05,
        'Total Emission (tCO₂e)': 2.5,
        'Calculation Methodology': 'GHG Protocol - Market-based method',
        'Data Source / Meter': 'Supplier invoices',
        'Measurement Frequency': 'Quarterly',
        'Data Quality / Confidence': 'High',
        'Verifier / Reviewed By': 'Internal Sustainability Team',
        'Emission Source ID / Code': 'S2-ELEC-002',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Solar PPA for head office',
      },
      {
        'Facility / Location Name': 'Food Processing Unit',
        'Business Unit / Division': 'Operations – North India',
        'Reporting Period': 'FY 2024–25',
        'Source Type': 'Purchased Steam',
        'Emission Source Category': 'Imported Steam',
        'Emission Source Description': 'Steam from external supplier',
        'Utility Provider Name': 'SteamCo Industries',
        'Country / Region': 'India',
        'Grid Emission Factor Source': 'Supplier Data (Steam EF)',
        'Emission Factor (kg CO₂e/kWh or unit)': 0.25,
        'Activity Data Value (Energy Consumed)': 10000,
        'Activity Data Unit': 'kWh equivalent',
        'Scope 2 Category': 'Location-Based',
        'GHG Included': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 2500,
        'Emission (CH₄) (kg)': 5,
        'Emission (N₂O) (kg)': 3,
        'Total Emission (tCO₂e)': 2.51,
        'Calculation Methodology': 'GHG Protocol - Steam conversion',
        'Data Source / Meter': 'Supplier invoice',
        'Measurement Frequency': 'Annually',
        'Data Quality / Confidence': 'Medium',
        'Verifier / Reviewed By': 'Facility Manager',
        'Emission Source ID / Code': 'S2-STEAM-003',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Steam used for food sterilization process',
      },
    ];

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scope 2 Emissions');

    // Set column widths
    const colWidths = Array(27).fill({ wch: 20 });
    ws['!cols'] = colWidths;

    // Download file
    XLSX.writeFile(wb, `Scope2_Emissions_Template_${currentMonth}_${currentYear}.xlsx`);

    toast({
      title: "Template Downloaded",
      description: "The Scope 2 emissions template has been downloaded successfully.",
    });
  };

  const validateRow = (row: any, rowIndex: number): { isValid: boolean; error?: string } => {
    // Required fields
    const requiredFields = [
      'Facility / Location Name',
      'Source Type',
      'Utility Provider Name',
      'Activity Data Value (Energy Consumed)',
      'Activity Data Unit',
    ];

    for (const field of requiredFields) {
      if (!row[field] || row[field] === '') {
        return { 
          isValid: false, 
          error: `Row ${rowIndex + 2}: Missing required field "${field}"` 
        };
      }
    }

    // Validate Source Type
    const validSourceTypes = ['Purchased Electricity', 'Purchased Steam', 'Purchased Heat', 'Purchased Cooling'];
    if (!validSourceTypes.includes(row['Source Type'])) {
      return { 
        isValid: false, 
        error: `Row ${rowIndex + 2}: Invalid Source Type. Must be one of: ${validSourceTypes.join(', ')}` 
      };
    }

    // Validate Scope 2 Category
    const validCategories = ['Location-Based', 'Market-Based'];
    if (row['Scope 2 Category'] && !validCategories.includes(row['Scope 2 Category'])) {
      return { 
        isValid: false, 
        error: `Row ${rowIndex + 2}: Invalid Scope 2 Category. Must be: Location-Based or Market-Based` 
      };
    }

    // Validate numeric fields
    if (isNaN(Number(row['Activity Data Value (Energy Consumed)']))) {
      return { 
        isValid: false, 
        error: `Row ${rowIndex + 2}: Activity Data Value must be a number` 
      };
    }

    return { isValid: true };
  };

  const parseFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setErrors(['The uploaded file is empty']);
        return;
      }

      const validationErrors: string[] = [];
      const validEntries: Scope2Entry[] = [];

      jsonData.forEach((row: any, index: number) => {
        const validation = validateRow(row, index);
        
        if (!validation.isValid) {
          validationErrors.push(validation.error!);
        } else {
          // Map Excel columns to Scope2Entry
          const entry: Scope2Entry = {
            id: uuidv4(),
            facilityName: row['Facility / Location Name'] || '',
            businessUnit: row['Business Unit / Division'] || '',
            reportingPeriod: row['Reporting Period'] || `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
            sourceType: row['Source Type'] as Scope2SourceType,
            emissionSourceCategory: row['Emission Source Category'] || '',
            emissionSourceDescription: row['Emission Source Description'] || '',
            utilityProviderName: row['Utility Provider Name'] || '',
            countryRegion: row['Country / Region'] || '',
            gridEmissionFactorSource: row['Grid Emission Factor Source'] || 'CEA India Baseline 2023',
            emissionFactor: Number(row['Emission Factor (kg CO₂e/kWh or unit)']) || 0,
            activityDataValue: Number(row['Activity Data Value (Energy Consumed)']) || 0,
            activityDataUnit: row['Activity Data Unit'] || 'kWh',
            scope2Category: (row['Scope 2 Category'] as Scope2Category) || 'Location-Based',
            ghgIncluded: row['GHG Included'] || 'CO₂, CH₄, N₂O',
            emissionCO2: Number(row['Emission (CO₂) (kg)']) || 0,
            emissionCH4: Number(row['Emission (CH₄) (kg)']) || 0,
            emissionN2O: Number(row['Emission (N₂O) (kg)']) || 0,
            totalEmission: Number(row['Total Emission (tCO₂e)']) || 0,
            calculationMethodology: row['Calculation Methodology'] || 'GHG Protocol - Scope 2',
            dataSource: row['Data Source / Meter'] || '',
            measurementFrequency: (row['Measurement Frequency'] as MeasurementFrequency) || 'Monthly',
            dataQuality: (row['Data Quality / Confidence'] as DataQuality) || 'Medium',
            verifiedBy: row['Verifier / Reviewed By'] || '',
            emissionSourceId: row['Emission Source ID / Code'] || '',
            dataEntryDate: row['Data Entry Date'] || new Date().toISOString().split('T')[0],
            enteredBy: row['Entered By'] || '',
            notes: row['Notes / Comments'] || '',
          };

          validEntries.push(entry);
        }
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors([]);
      onUpload(validEntries);
      onOpenChange(false);

      toast({
        title: "Upload Successful",
        description: `Successfully imported ${validEntries.length} emission entries.`,
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      setErrors(['Error parsing file. Please ensure you are using the correct template format.']);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        setErrors(['Please upload an Excel file (.xlsx, .xls) or CSV file']);
        return;
      }
      parseFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Scope 2 Emissions</DialogTitle>
          <DialogDescription>
            Download the template, fill in your data, and upload it back to add multiple entries at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="space-y-2">
            <h4 className="font-medium">Step 1: Download Template</h4>
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Excel Template
            </Button>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <h4 className="font-medium">Step 2: Upload Completed File</h4>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your Excel file here, or click to browse
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload-scope2"
              />
              <label htmlFor="file-upload-scope2">
                <Button variant="secondary" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Upload Errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.slice(0, 10).map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                  {errors.length > 10 && (
                    <li className="text-sm">...and {errors.length - 10} more errors</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Download the template and fill in your emission data</li>
              <li>Do not modify the column headers</li>
              <li>Required fields: Facility Name, Source Type, Utility Provider, Activity Data Value & Unit</li>
              <li>Source Type: Purchased Electricity, Purchased Steam, Purchased Heat, or Purchased Cooling</li>
              <li>Scope 2 Category: Location-Based or Market-Based</li>
              <li>Numeric values should not contain commas or special characters</li>
              <li>Save your file as Excel (.xlsx) or CSV format</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;