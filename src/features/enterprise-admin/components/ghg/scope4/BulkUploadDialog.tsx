import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Scope4Entry, getCurrentFY, defaultEmissionFactorSource } from '@/types/scope4-ghg';
import * as XLSX from 'xlsx';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (entries: Scope4Entry[]) => void;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
  onUpload
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const templateData = [
      {
        "Facility / Location Name": "R&D Center, Pune",
        "Business Unit / Division": "Sustainable Products Division",
        "Reporting Period": getCurrentFY(),
        "Avoided Emission Source Type": "Product Use",
        "Avoided Emission Description": "Energy-efficient refrigerators replacing standard models",
        "Comparative Baseline Scenario": "Conventional refrigerator (250 kWh/year)",
        "Functional Unit": "1 unit",
        "Reference Standard or Study": "LCA Report 2024",
        "Product or Service Output": 10000,
        "Activity Data Unit": "units",
        "Baseline Emission Factor (kg CO₂e/unit)": 250,
        "Project Emission Factor (kg CO₂e/unit)": 150,
        "Avoided Emission per Unit (kg CO₂e/unit)": 100,
        "Total Avoided Emission (tCO₂e)": 1000,
        "Methodology Used": "Comparative LCA",
        "Emission Factor Source": "Ecoinvent 3.9",
        "Data Source": "Internal test data",
        "Data Quality / Confidence": "High",
        "Verifier / Reviewed By": "Sustainability Team",
        "Verification Status": "Verified",
        "Data Entry Date": "2025-04-30",
        "Entered By": "Meera Sharma",
        "Notes / Comments": "Calculated based on 10-year product lifetime"
      },
      {
        "Facility / Location Name": "Manufacturing Plant, Chennai",
        "Business Unit / Division": "Clean Energy Division",
        "Reporting Period": getCurrentFY(),
        "Avoided Emission Source Type": "Energy Generation",
        "Avoided Emission Description": "Solar panels supplied to customers",
        "Comparative Baseline Scenario": "Grid electricity (coal-based)",
        "Functional Unit": "1 kWh",
        "Reference Standard or Study": "ISO 14040:2006",
        "Product or Service Output": 5000000,
        "Activity Data Unit": "kWh",
        "Baseline Emission Factor (kg CO₂e/unit)": 0.82,
        "Project Emission Factor (kg CO₂e/unit)": 0.02,
        "Avoided Emission per Unit (kg CO₂e/unit)": 0.80,
        "Total Avoided Emission (tCO₂e)": 4000,
        "Methodology Used": "Project-Based",
        "Emission Factor Source": "CEA India 2023",
        "Data Source": "Customer installation data",
        "Data Quality / Confidence": "High",
        "Verifier / Reviewed By": "External Auditor",
        "Verification Status": "Verified",
        "Data Entry Date": "2025-04-30",
        "Entered By": "Rajesh Kumar",
        "Notes / Comments": "Based on 25-year panel lifetime"
      },
      {
        "Facility / Location Name": "Distribution Center, Delhi",
        "Business Unit / Division": "Logistics Optimization",
        "Reporting Period": getCurrentFY(),
        "Avoided Emission Source Type": "Transportation",
        "Avoided Emission Description": "Route optimization software for customers",
        "Comparative Baseline Scenario": "Traditional routing (15 km/delivery)",
        "Functional Unit": "1 delivery",
        "Reference Standard or Study": "GHG Protocol 2024",
        "Product or Service Output": 50000,
        "Activity Data Unit": "deliveries",
        "Baseline Emission Factor (kg CO₂e/unit)": 2.5,
        "Project Emission Factor (kg CO₂e/unit)": 1.8,
        "Avoided Emission per Unit (kg CO₂e/unit)": 0.7,
        "Total Avoided Emission (tCO₂e)": 35,
        "Methodology Used": "Activity-Based",
        "Emission Factor Source": "DEFRA 2024",
        "Data Source": "Customer fleet data",
        "Data Quality / Confidence": "Medium",
        "Verifier / Reviewed By": "Internal Sustainability Team",
        "Verification Status": "Verified",
        "Data Entry Date": "2025-04-30",
        "Entered By": "Priya Singh",
        "Notes / Comments": "Based on customer-reported savings"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scope 4 Template");
    
    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 40 },
      { wch: 40 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 20 },
      { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 20 },
      { wch: 15 }, { wch: 20 }, { wch: 30 }
    ];

    XLSX.writeFile(wb, "Scope4_BulkUpload_Template.xlsx");
    
    toast({
      title: "Template downloaded",
      description: "Fill in the template and upload it back.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const entries: Scope4Entry[] = jsonData.map((row: any, index) => ({
        id: `bulk-${Date.now()}-${index}`,
        facilityName: row["Facility / Location Name"] || '',
        businessUnit: row["Business Unit / Division"] || '',
        reportingPeriod: row["Reporting Period"] || getCurrentFY(),
        sourceType: row["Avoided Emission Source Type"] || 'Product Use',
        emissionDescription: row["Avoided Emission Description"] || '',
        baselineScenario: row["Comparative Baseline Scenario"] || '',
        functionalUnit: row["Functional Unit"] || '',
        referenceStandard: row["Reference Standard or Study"] || '',
        productOutput: parseFloat(row["Product or Service Output"]) || 0,
        activityDataUnit: row["Activity Data Unit"] || '',
        baselineEmissionFactor: parseFloat(row["Baseline Emission Factor (kg CO₂e/unit)"]) || 0,
        projectEmissionFactor: parseFloat(row["Project Emission Factor (kg CO₂e/unit)"]) || 0,
        avoidedEmissionPerUnit: parseFloat(row["Avoided Emission per Unit (kg CO₂e/unit)"]) || 0,
        totalAvoidedEmission: parseFloat(row["Total Avoided Emission (tCO₂e)"]) || 0,
        methodology: row["Methodology Used"] || 'Comparative LCA',
        emissionFactorSource: row["Emission Factor Source"] || defaultEmissionFactorSource,
        dataSource: row["Data Source"] || '',
        dataQuality: row["Data Quality / Confidence"] || 'Medium',
        verifiedBy: row["Verifier / Reviewed By"] || '',
        verificationStatus: row["Verification Status"] || 'Pending',
        dataEntryDate: row["Data Entry Date"] || new Date().toISOString().split('T')[0],
        enteredBy: row["Entered By"] || '',
        notes: row["Notes / Comments"] || ''
      }));

      onUpload(entries);
      onOpenChange(false);
      setFile(null);
      
      toast({
        title: "Upload successful",
        description: `${entries.length} entries have been imported.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing the file. Please check the format.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Scope 4 Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50">
            <FileSpreadsheet className="h-8 w-8 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Download Template</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Download the Excel template with sample data and all required columns
              </p>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <Upload className="h-8 w-8 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Upload Filled Template</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Upload your completed Excel or CSV file
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
