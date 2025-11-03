import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { Scope3Entry } from '@/types/scope3-ghg';
import { v4 as uuidv4 } from 'uuid';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (entries: Scope3Entry[]) => void;
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
  const [uploading, setUploading] = useState(false);

  const downloadTemplate = () => {
    const template = [
      {
        'Facility / Location Name': 'Corporate Office',
        'Business Unit / Division': 'Procurement',
        'Reporting Period': 'FY 2024–25',
        'Scope 3 Category (GHG Protocol Category 1–15)': 'Category 1 – Purchased Goods and Services',
        'Source Type (Purchased Goods / Transport / Waste / Travel / etc.)': 'Raw Material Purchases',
        'Emission Source Description': 'Purchase of aluminum sheets',
        'Supplier / Service Provider Name': 'AluMines Ltd.',
        'Country / Region': 'India',
        'Activity Data Value': 10000,
        'Activity Data Unit': 'kg',
        'Emission Factor Source': 'India GHG Platform 2023',
        'Emission Factor (kg CO₂e/unit)': 8.24,
        'GHG Included (CO₂, CH₄, N₂O, etc.)': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 82400,
        'Emission (CH₄) (kg)': 20,
        'Emission (N₂O) (kg)': 10,
        'Total Emission (tCO₂e)': 82.43,
        'Calculation Methodology (Spend-based / Activity-based / Hybrid)': 'Activity-based',
        'Data Source (Invoice / Travel Log / Supplier Data / etc.)': 'Supplier invoice',
        'Measurement Frequency': 'Quarterly',
        'Data Quality / Confidence': 'High',
        'Verifier / Reviewed By': 'Procurement Sustainability Team',
        'Emission Source ID / Code': 'S3-CAT1-001',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Primary data received from supplier',
      },
      {
        'Facility / Location Name': 'Distribution Unit',
        'Business Unit / Division': 'Logistics',
        'Reporting Period': 'FY 2024–25',
        'Scope 3 Category (GHG Protocol Category 1–15)': 'Category 4 – Upstream Transportation and Distribution',
        'Source Type (Purchased Goods / Transport / Waste / Travel / etc.)': 'Freight Transport',
        'Emission Source Description': 'Inbound transport of goods by road',
        'Supplier / Service Provider Name': 'XYZ Logistics',
        'Country / Region': 'India',
        'Activity Data Value': 120000,
        'Activity Data Unit': 'tonne-km',
        'Emission Factor Source': 'DEFRA 2024',
        'Emission Factor (kg CO₂e/unit)': 0.105,
        'GHG Included (CO₂, CH₄, N₂O, etc.)': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 12600,
        'Emission (CH₄) (kg)': 15,
        'Emission (N₂O) (kg)': 8,
        'Total Emission (tCO₂e)': 12.62,
        'Calculation Methodology (Spend-based / Activity-based / Hybrid)': 'Activity-based',
        'Data Source (Invoice / Travel Log / Supplier Data / etc.)': 'Logistics records',
        'Measurement Frequency': 'Monthly',
        'Data Quality / Confidence': 'Medium',
        'Verifier / Reviewed By': 'Sustainability Analyst',
        'Emission Source ID / Code': 'S3-CAT4-002',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Covers all supplier deliveries for FY',
      },
      {
        'Facility / Location Name': 'Corporate Office',
        'Business Unit / Division': 'Admin',
        'Reporting Period': 'FY 2024–25',
        'Scope 3 Category (GHG Protocol Category 1–15)': 'Category 6 – Business Travel',
        'Source Type (Purchased Goods / Transport / Waste / Travel / etc.)': 'Employee Air Travel',
        'Emission Source Description': 'Domestic air travel',
        'Supplier / Service Provider Name': 'Air India',
        'Country / Region': 'India',
        'Activity Data Value': 30000,
        'Activity Data Unit': 'passenger-km',
        'Emission Factor Source': 'ICAO 2023',
        'Emission Factor (kg CO₂e/unit)': 0.15,
        'GHG Included (CO₂, CH₄, N₂O, etc.)': 'CO₂, CH₄, N₂O',
        'Emission (CO₂) (kg)': 4500,
        'Emission (CH₄) (kg)': 5,
        'Emission (N₂O) (kg)': 2,
        'Total Emission (tCO₂e)': 4.51,
        'Calculation Methodology (Spend-based / Activity-based / Hybrid)': 'Activity-based',
        'Data Source (Invoice / Travel Log / Supplier Data / etc.)': 'Travel agency data',
        'Measurement Frequency': 'Quarterly',
        'Data Quality / Confidence': 'Medium',
        'Verifier / Reviewed By': 'Admin Department',
        'Emission Source ID / Code': 'S3-CAT6-003',
        'Data Entry Date': '2025-04-30',
        'Entered By': 'Meera Sharma',
        'Notes / Comments': 'Includes both domestic and short-haul trips',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scope 3 Template');
    XLSX.writeFile(wb, `Scope3_Bulk_Upload_Template_${currentMonth}_${currentYear}.xlsx`);

    toast({
      title: "Template Downloaded",
      description: "Fill in the template and upload it to add multiple entries at once.",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const entries: Scope3Entry[] = jsonData.map((row: any) => ({
        id: uuidv4(),
        facilityName: row['Facility / Location Name'] || '',
        businessUnit: row['Business Unit / Division'] || '',
        reportingPeriod: row['Reporting Period'] || '',
        scope3Category: row['Scope 3 Category (GHG Protocol Category 1–15)'] || '',
        sourceType: row['Source Type (Purchased Goods / Transport / Waste / Travel / etc.)'] || '',
        emissionSourceDescription: row['Emission Source Description'] || '',
        supplierName: row['Supplier / Service Provider Name'] || '',
        countryRegion: row['Country / Region'] || '',
        activityDataValue: Number(row['Activity Data Value']) || 0,
        activityDataUnit: row['Activity Data Unit'] || '',
        emissionFactorSource: row['Emission Factor Source'] || '',
        emissionFactor: Number(row['Emission Factor (kg CO₂e/unit)']) || 0,
        ghgIncluded: row['GHG Included (CO₂, CH₄, N₂O, etc.)'] || '',
        emissionCO2: Number(row['Emission (CO₂) (kg)']) || 0,
        emissionCH4: Number(row['Emission (CH₄) (kg)']) || 0,
        emissionN2O: Number(row['Emission (N₂O) (kg)']) || 0,
        totalEmission: Number(row['Total Emission (tCO₂e)']) || 0,
        calculationMethodology: row['Calculation Methodology (Spend-based / Activity-based / Hybrid)'] || 'Activity-based',
        dataSource: row['Data Source (Invoice / Travel Log / Supplier Data / etc.)'] || '',
        measurementFrequency: row['Measurement Frequency'] || 'Monthly',
        dataQuality: row['Data Quality / Confidence'] || 'Medium',
        verifiedBy: row['Verifier / Reviewed By'] || '',
        emissionSourceId: row['Emission Source ID / Code'] || '',
        dataEntryDate: row['Data Entry Date'] || new Date().toISOString().split('T')[0],
        enteredBy: row['Entered By'] || '',
        notes: row['Notes / Comments'] || '',
      }));

      onUpload(entries);
      onOpenChange(false);
      
      toast({
        title: "Upload Successful",
        description: `Successfully imported ${entries.length} entries.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to parse the uploaded file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Scope 3 Emissions</DialogTitle>
          <DialogDescription>
            Download the template, fill it with your data, and upload it back to add multiple entries at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Button onClick={downloadTemplate} className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              The template includes sample data and all required fields for Scope 3 emissions.
            </p>
          </div>

          <div className="border-t pt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload filled template</p>
                <p className="text-xs text-muted-foreground mt-1">Supports Excel (.xlsx) and CSV files</p>
              </div>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
