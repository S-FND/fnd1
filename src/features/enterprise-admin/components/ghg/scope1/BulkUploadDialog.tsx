import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from 'xlsx';
import { Scope1Entry, SourceType, MeasurementFrequency, DataQuality } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (entries: Scope1Entry[]) => void;
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
        'Source Type': 'Stationary',
        'Emission Source Category': 'Stationary Combustion',
        'Emission Source Description': 'Diesel Generator',
        'Fuel / Substance Type': 'Diesel',
        'Activity Data Value': 5000,
        'Activity Data Unit': 'litres',
        'Emission Factor Source': 'IPCC 2006',
        'Emission Factor (kg CO₂e/unit)': 2.68,
        'GHG Included': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 13400,
        'Emission (CH₄) (kg)': 45,
        'Emission (N₂O) (kg)': 22,
        'Total Emission (tCO₂e)': 14.2,
        'Calculation Methodology': 'GHG Protocol - Direct calculation',
        'Data Source / Meter': 'Fuel purchase invoice',
        'Measurement Frequency': 'Monthly',
        'Data Quality / Confidence': 'High',
        'Verifier / Reviewed By': 'Internal Sustainability Team',
        'Emission Source ID / Code': 'S1-FUEL-001',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Used during power outages',
      },
      {
        'Facility / Location Name': 'Logistics Fleet',
        'Business Unit / Division': 'Distribution',
        'Reporting Period': 'FY 2024–25',
        'Source Type': 'Mobile',
        'Emission Source Category': 'Company Vehicle Fleet',
        'Emission Source Description': 'Delivery Trucks',
        'Fuel / Substance Type': 'Diesel',
        'Activity Data Value': 12000,
        'Activity Data Unit': 'litres',
        'Emission Factor Source': 'DEFRA 2024',
        'Emission Factor (kg CO₂e/unit)': 2.68,
        'GHG Included': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 32160,
        'Emission (CH₄) (kg)': 110,
        'Emission (N₂O) (kg)': 55,
        'Total Emission (tCO₂e)': 33.8,
        'Calculation Methodology': 'GHG Protocol - Fleet emissions',
        'Data Source / Meter': 'Fuel card data',
        'Measurement Frequency': 'Monthly',
        'Data Quality / Confidence': 'Medium',
        'Verifier / Reviewed By': 'Internal Sustainability Team',
        'Emission Source ID / Code': 'S1-MOB-002',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Regular fuel use for deliveries',
      },
      {
        'Facility / Location Name': 'Head Office',
        'Business Unit / Division': 'Corporate',
        'Reporting Period': 'FY 2024–25',
        'Source Type': 'Fugitive',
        'Emission Source Category': 'Refrigerant Leakage',
        'Emission Source Description': 'HVAC System',
        'Fuel / Substance Type': 'R-410A',
        'Activity Data Value': 5,
        'Activity Data Unit': 'kg',
        'Emission Factor Source': 'IPCC 2006',
        'Emission Factor (kg CO₂e/unit)': 2088,
        'GHG Included': 'HFCs',
        'Emission (CO₂) (kg)': 0,
        'Emission (CH₄) (kg)': 0,
        'Emission (N₂O) (kg)': 0,
        'Total Emission (tCO₂e)': 10.44,
        'Calculation Methodology': 'GHG Protocol - Fugitive emission factor',
        'Data Source / Meter': 'Maintenance record',
        'Measurement Frequency': 'Annually',
        'Data Quality / Confidence': 'Medium',
        'Verifier / Reviewed By': 'Facility Manager',
        'Emission Source ID / Code': 'S1-FUG-003',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Annual top-up recorded',
      },
    ];

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scope 1 Emissions');

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Facility Name
      { wch: 25 }, // Business Unit
      { wch: 15 }, // Reporting Period
      { wch: 12 }, // Source Type
      { wch: 25 }, // Emission Source Category
      { wch: 25 }, // Emission Source Description
      { wch: 20 }, // Fuel/Substance Type
      { wch: 15 }, // Activity Data Value
      { wch: 15 }, // Activity Data Unit
      { wch: 20 }, // Emission Factor Source
      { wch: 20 }, // Emission Factor
      { wch: 20 }, // GHG Included
      { wch: 15 }, // Emission CO2
      { wch: 15 }, // Emission CH4
      { wch: 15 }, // Emission N2O
      { wch: 18 }, // Total Emission
      { wch: 30 }, // Calculation Methodology
      { wch: 25 }, // Data Source
      { wch: 18 }, // Measurement Frequency
      { wch: 20 }, // Data Quality
      { wch: 25 }, // Verifier
      { wch: 20 }, // Emission Source ID
      { wch: 15 }, // Data Entry Date
      { wch: 20 }, // Entered By
      { wch: 30 }, // Notes
    ];
    ws['!cols'] = colWidths;

    // Download file
    XLSX.writeFile(wb, `Scope1_Emissions_Template_${currentMonth}_${currentYear}.xlsx`);

    toast({
      title: "Template Downloaded",
      description: "The Scope 1 emissions template has been downloaded successfully.",
    });
  };

  const validateRow = (row: any, rowIndex: number): { isValid: boolean; error?: string } => {
    // Required fields
    const requiredFields = [
      'Facility / Location Name',
      'Source Type',
      'Fuel / Substance Type',
      'Activity Data Value',
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
    const validSourceTypes = ['Stationary', 'Mobile', 'Fugitive', 'Process'];
    if (!validSourceTypes.includes(row['Source Type'])) {
      return { 
        isValid: false, 
        error: `Row ${rowIndex + 2}: Invalid Source Type. Must be one of: ${validSourceTypes.join(', ')}` 
      };
    }

    // Validate numeric fields
    if (isNaN(Number(row['Activity Data Value']))) {
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
      const validEntries: Scope1Entry[] = [];

      jsonData.forEach((row: any, index: number) => {
        const validation = validateRow(row, index);
        
        if (!validation.isValid) {
          validationErrors.push(validation.error!);
        } else {
          // Map Excel columns to Scope1Entry
          const entry: Scope1Entry = {
            id: uuidv4(),
            facilityName: row['Facility / Location Name'] || '',
            businessUnit: row['Business Unit / Division'] || '',
            reportingPeriod: row['Reporting Period'] || `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
            sourceType: row['Source Type'] as SourceType,
            emissionSourceCategory: row['Emission Source Category'] || '',
            emissionSourceDescription: row['Emission Source Description'] || '',
            fuelSubstanceType: row['Fuel / Substance Type'] || '',
            activityDataValue: Number(row['Activity Data Value']) || 0,
            activityDataUnit: row['Activity Data Unit'] || '',
            emissionFactorSource: row['Emission Factor Source'] || 'IPCC 2006',
            emissionFactor: Number(row['Emission Factor (kg CO₂e/unit)']) || 0,
            ghgIncluded: row['GHG Included'] || 'CO₂, CH₄, N₂O',
            emissionCO2: Number(row['Emission (CO₂) (kg)']) || 0,
            emissionCH4: Number(row['Emission (CH₄) (kg)']) || 0,
            emissionN2O: Number(row['Emission (N₂O) (kg)']) || 0,
            totalEmission: Number(row['Total Emission (tCO₂e)']) || 0,
            calculationMethodology: row['Calculation Methodology'] || 'GHG Protocol - Direct calculation',
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
          <DialogTitle>Bulk Upload Scope 1 Emissions</DialogTitle>
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
                id="file-upload"
              />
              <label htmlFor="file-upload">
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
              <li>Required fields: Facility Name, Source Type, Fuel Type, Activity Data Value & Unit</li>
              <li>Source Type must be: Stationary, Mobile, Fugitive, or Process</li>
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