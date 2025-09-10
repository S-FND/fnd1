import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';
import { httpClient } from '@/lib/httpClient';

interface ExcelUploadProps {
  onMetricsImported: (metrics: ESGMetricWithTracking[]) => void;
  onDataImported: (entries: any[]) => void;
  materialTopics: any[];
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onMetricsImported, onDataImported, materialTopics }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResults, setUploadResults] = useState<{ metrics: number; entries: number } | null>(null);

  const downloadTemplate = () => {
    // Create sample Excel template
    const metricsTemplate = [
      {
        'Metric Name': 'Greenhouse Gas Emissions',
        'Description': 'Total GHG emissions in metric tons CO2 equivalent',
        'Unit': 'Metric tons CO2e',
        'Data Type': 'Numeric',
        'Collection Frequency': 'Monthly',
        'Category': 'Environmental',
        'Material Topic': 'climate',
        'Framework': 'GIIN IRIS+',
        'Source': 'Custom'
      },
      {
        'Metric Name': 'Employee Diversity',
        'Description': 'Percentage of women in leadership positions',
        'Unit': 'Percentage',
        'Data Type': 'Percentage',
        'Collection Frequency': 'Quarterly',
        'Category': 'Social',
        'Material Topic': 'diversity',
        'Framework': 'Custom',
        'Source': 'Custom'
      }
    ];

    const dataTemplate = [
      {
        'Metric Name': 'Greenhouse Gas Emissions',
        'Value': '150.5',
        'Date': '2024-01-31',
        'Financial Year': '2024',
        'Notes': 'Q1 emissions data'
      },
      {
        'Metric Name': 'Employee Diversity',
        'Value': '45.2',
        'Date': '2024-03-31',
        'Financial Year': '2024',
        'Notes': 'Q1 diversity metrics'
      }
    ];

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    const metricsWS = XLSX.utils.json_to_sheet(metricsTemplate);
    const dataWS = XLSX.utils.json_to_sheet(dataTemplate);
    
    XLSX.utils.book_append_sheet(wb, metricsWS, "Metrics Configuration");
    XLSX.utils.book_append_sheet(wb, dataWS, "Data Entries");
    
    // Add instructions sheet
    const instructions = [
      { Instruction: 'ESG Metrics Excel Template Instructions' },
      { Instruction: '' },
      { Instruction: 'Sheet 1: Metrics Configuration' },
      { Instruction: '- Define your ESG metrics with required fields' },
      { Instruction: '- Data Type: Numeric, Percentage, Text, Boolean, Dropdown, Radio, Table' },
      { Instruction: '- Collection Frequency: Daily, Weekly, Monthly, Quarterly, Bi-Annually, Annually' },
      { Instruction: '- Category: Environmental, Social, Governance' },
      { Instruction: '' },
      { Instruction: 'Sheet 2: Data Entries' },
      { Instruction: '- Enter actual data values for your metrics' },
      { Instruction: '- Metric Name must match exactly from Sheet 1' },
      { Instruction: '- Date format: YYYY-MM-DD' },
      { Instruction: '- Value should match the data type of the metric' }
    ];
    
    const instructionsWS = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(wb, instructionsWS, "Instructions");
    
    XLSX.writeFile(wb, "ESG_Metrics_Template.xlsx");
    toast.success('Excel template downloaded successfully');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    
    try {
      console.log("Uploading file:", file);
      let formData = new FormData();
      formData.append('file', file);
      formData.append(`data`, 'data');
        // formData.set('file', fileToUpload)

        for (let [key, value] of formData.entries()) {
          console.log('Console for Entries',key, value);
        }
      let fileUploadResponse = await httpClient.post('materiality/upload-metricsConfig-file', formData )
      console.log("fileUploadResponse", fileUploadResponse);
      // const data = await file.arrayBuffer();
      // const workbook = XLSX.read(data);
      
      // let importedMetrics: ESGMetricWithTracking[] = [];
      // let importedEntries: any[] = [];
      
      // Process Metrics Configuration sheet
      // if (workbook.SheetNames.includes('Metrics Configuration')) {
      //   const metricsSheet = workbook.Sheets['Metrics Configuration'];
      //   const metricsData = XLSX.utils.sheet_to_json(metricsSheet);
        
      //   importedMetrics = metricsData.map((row: any, index: number) => ({
      //     id: `imported_${Date.now()}_${index}`,
      //     name: row['Metric Name'] || '',
      //     description: row['Description'] || '',
      //     unit: row['Unit'] || '',
      //     source: row['Source'] || 'Custom',
      //     framework: row['Framework'] || 'Custom',
      //     relatedTopic: row['Material Topic'] || '',
      //     category: row['Category'] || 'Environmental',
      //     dataType: row['Data Type'] || 'Numeric',
      //     collectionFrequency: row['Collection Frequency'] || 'Monthly',
      //     dataPoints: [],
      //     isSelected: true
      //   })) as ESGMetricWithTracking[];
      // }
      
      // Process Data Entries sheet
      // if (workbook.SheetNames.includes('Data Entries')) {
      //   const dataSheet = workbook.Sheets['Data Entries'];
      //   const entriesData = XLSX.utils.sheet_to_json(dataSheet);
        
      //   importedEntries = entriesData.map((row: any, index: number) => ({
      //     id: `imported_entry_${Date.now()}_${index}`,
      //     metricName: row['Metric Name'] || '',
      //     value: row['Value'] || '',
      //     date: row['Date'] || new Date().toISOString().split('T')[0],
      //     financialYear: row['Financial Year'] || new Date().getFullYear().toString(),
      //     notes: row['Notes'] || ''
      //   }));
      // }
      
      // Import the data
      // if (importedMetrics.length > 0) {
      //   onMetricsImported(importedMetrics);
      // }
      
      // if (importedEntries.length > 0) {
      //   onDataImported(importedEntries);
      // }
      
      // setUploadResults({
      //   metrics: importedMetrics.length,
      //   entries: importedEntries.length
      // });
      
      // setUploadStatus('success');
      // toast.success(`Successfully imported ${importedMetrics.length} metrics and ${importedEntries.length} data entries`);
      
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setUploadStatus('error');
      toast.error('Error processing Excel file. Please check the format and try again.');
    }
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Excel Import/Export
        </CardTitle>
        <CardDescription>
          Download template, fill with your ESG metrics and data, then upload to auto-populate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={downloadTemplate}
            variant="outline"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          
          <div className="flex-1">
            <Label htmlFor="excel-upload" className="sr-only">Upload Excel file</Label>
            <Input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploadStatus === 'uploading'}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
          </div>
        </div>
        
        {uploadStatus === 'uploading' && (
          <div className="flex items-center gap-2 text-blue-600">
            <Upload className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing Excel file...</span>
          </div>
        )}
        
        {uploadStatus === 'success' && uploadResults && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Import Successful!</p>
              <div className="flex gap-4 mt-1">
                <Badge variant="secondary">{uploadResults.metrics} metrics imported</Badge>
                <Badge variant="secondary">{uploadResults.entries} data entries imported</Badge>
              </div>
            </div>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">Failed to import Excel file. Please check the format and try again.</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Excel file should contain "Metrics Configuration" and "Data Entries" sheets</p>
          <p>• Use the downloaded template as a reference for correct column names</p>
          <p>• Data entries will be matched to metrics by name</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelUpload;