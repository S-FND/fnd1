import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle,History, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';
import { httpClient } from '@/lib/httpClient';
// import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExcelUploadProps {
  onMetricsImported: (metrics: ESGMetricWithTracking[]) => void;
  onDataImported: (entries: any[]) => void;
  materialTopics: any[];
}
interface UploadHistory {
  id: string;
  fileName: string;
  uploadDate: string;
  metricsCount: number;
  entriesCount: number;
  status: 'success' | 'error';
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onMetricsImported, onDataImported, materialTopics }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResults, setUploadResults] = useState<{ metrics: number; entries: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [data, setData] = useState<any>({
    files: [],
    configdata: [],
    entryData: []
  });
  const [fileCountData, setFileCountData] = useState<{fileName:string;
    configCount:number;
    entryCount:number;}[]>(null);
  
  // Initialize with sample data
  const [uploadHistory, setUploadHistory] = useState<String[]>([]);

  // Load upload history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('esgUploadHistory');
    let historyToLoad: UploadHistory[] = [];
    
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        historyToLoad = Array.isArray(history) && history.length > 0 ? history : [];
      } catch (error) {
        console.error('Error loading upload history:', error);
        historyToLoad = [];
      }
    }
    
    // If no existing history or empty history, load sample data
    if (historyToLoad.length === 0) {
      const sampleHistory: UploadHistory[] = [
        {
          id: 'sample_001',
          fileName: 'ESG_Q4_2024_Final.xlsx',
          uploadDate: '2024-01-15T14:30:00Z',
          metricsCount: 25,
          entriesCount: 120,
          status: 'success'
        },
        {
          id: 'sample_002',
          fileName: 'Environmental_Metrics_Dec2024.xlsx',
          uploadDate: '2024-01-10T09:15:00Z',
          metricsCount: 12,
          entriesCount: 85,
          status: 'success'
        },
        {
          id: 'sample_003',
          fileName: 'Social_Governance_Data.xlsx',
          uploadDate: '2024-01-08T16:45:00Z',
          metricsCount: 18,
          entriesCount: 67,
          status: 'success'
        },
        {
          id: 'sample_004',
          fileName: 'GHG_Emissions_Q3_2024.xlsx',
          uploadDate: '2024-01-05T11:20:00Z',
          metricsCount: 8,
          entriesCount: 45,
          status: 'success'
        },
        {
          id: 'sample_005',
          fileName: 'Incomplete_Data_Template.xlsx',
          uploadDate: '2024-01-03T13:10:00Z',
          metricsCount: 0,
          entriesCount: 0,
          status: 'error'
        },
        {
          id: 'sample_006',
          fileName: 'Diversity_Inclusion_Metrics.xlsx',
          uploadDate: '2023-12-28T10:30:00Z',
          metricsCount: 15,
          entriesCount: 92,
          status: 'success'
        },
        {
          id: 'sample_007',
          fileName: 'Corrupted_File_Upload.xlsx',
          uploadDate: '2023-12-25T14:00:00Z',
          metricsCount: 0,
          entriesCount: 0,
          status: 'error'
        },
        {
          id: 'sample_008',
          fileName: 'Energy_Consumption_Annual.xlsx',
          uploadDate: '2023-12-20T09:45:00Z',
          metricsCount: 22,
          entriesCount: 156,
          status: 'success'
        }
      ];
      historyToLoad = sampleHistory;
    }
    
    // setUploadHistory(historyToLoad);
  }, []);

  // Save upload history to localStorage whenever it changes (but not for sample data)
  // useEffect(() => {
  //   if (uploadHistory.length > 0 && !uploadHistory[0].id.startsWith('sample_')) {
  //     localStorage.setItem('esgUploadHistory', JSON.stringify(uploadHistory));
  //   }
  // }, [uploadHistory]);

  // const addToHistory = (fileName: string, metricsCount: number, entriesCount: number, status: 'success' | 'error') => {
  //   const historyEntry: UploadHistory = {
  //     id: `upload_${Date.now()}`,
  //     fileName,
  //     uploadDate: new Date().toISOString(),
  //     metricsCount,
  //     entriesCount,
  //     status
  //   };
    
  //   setUploadHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Keep last 50 uploads
  // };
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
      if(fileUploadResponse.status == 201){
        setUploadStatus('success');
        toast.success('File uploaded successfully');
        getFileUploadHistory();
      }
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

  const getFileUploadHistory= async () => {
    // Fetch upload history from backend if needed
    // For now, using local state
    
    try {
      let fileUploadHistory=await httpClient.get('materiality/metrics-config-file-list');
    console.log("fileUploadHistory", fileUploadHistory);
    if(fileUploadHistory.status == 200){
      setData(fileUploadHistory['data']['data']);
      setUploadHistory(fileUploadHistory['data']['data']['files']);
    }
    } catch (error) {
      console.error('Error fetching upload history:', error);
      toast.error('Failed to load upload history' );
      
    }
  }

  useEffect(() => {
    if(data){
      const result = data.files.map(fileName => {
        // Count configdata groupedMetrics for this file
        let configCount = 0;
        data.configdata.forEach(config => {
          config.groupedMetrics.forEach(group => {
            if (group.uploadedFileName === fileName) {
              configCount += 1; // count the group itself
            }
          });
        });
      
        // Count entryData groupedMetrics for this file
        let entryCount = 0;
        data.entryData.forEach(entry => {
          entry.groupedMetrics.forEach(group => {
            if (group.uploadedFileName === fileName) {
              entryCount += 1; // count the group itself
            }
          });
        });
      
        return {
          fileName,
          configCount,
          entryCount
        };
      });
      console.log("result", result);
      setFileCountData(result);
    }
    
  }, [data]);
  useEffect(() => {
    getFileUploadHistory();
  }, []);

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

          <Button 
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex-1"
          >
            <History className="h-4 w-4 mr-2" />
            View Upload History
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
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Upload History Archive
            </DialogTitle>
            <DialogDescription>
              View all previous Excel file uploads and their import results
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] w-full">
            {uploadHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upload history found</p>
                <p className="text-sm text-muted-foreground">Upload an Excel file to see it appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadHistory.map((upload,index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg ${
                       true
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="font-medium">{`${upload?.split('.')[0].split('_')[0]}.${upload.split('.')[1]}`}</span>
                          <Badge 
                            variant={true  ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            Success
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(Number(upload.split('.')[0].split('_')[1])).toLocaleDateString()} at{' '}
                            {new Date(Number(upload.split('.')[0].split('_')[1])).toLocaleTimeString()}
                          </div>
                        </div>
                        
                        {fileCountData && fileCountData.length>0 && (
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">
                              {fileCountData.find((f)=>f.fileName == upload)?.configCount} metrics imported
                            </Badge>
                            <Badge variant="secondary">
                              {fileCountData.find((f)=>f.fileName == upload)?.entryCount} data entries imported
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      { true ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {uploadHistory.length} upload{uploadHistory.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={() => setShowHistory(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExcelUpload;