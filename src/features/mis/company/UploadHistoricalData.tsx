import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  FileWarning,
  Info,
  Calendar
} from 'lucide-react';

const YEARS = [2024, 2025] as const;

const QUARTERS = [
  { value: 'Q1', label: 'Q1 (JFM)', months: 'Jan-Mar' },
  { value: 'Q2', label: 'Q2 (AMJ)', months: 'Apr-Jun' },
  { value: 'Q3', label: 'Q3 (JAS)', months: 'Jul-Sep' },
  { value: 'Q4', label: 'Q4 (OND)', months: 'Oct-Dec' },
];

interface ParseSummary {
  rowsDetected: number;
  kpisExtracted: number;
  quartersDetected: string[];
  matchedCount: number;
  unmatchedCount: number;
}

const UploadHistoricalData = () => {
  const { user, effectiveCompanyId } = useAuth();
  const companyId = effectiveCompanyId || user?.companyId || 'company-1';
  
  const [file, setFile] = useState<File | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseSummary, setParseSummary] = useState<ParseSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert Q1/Q2/Q3/Q4 to quarter code format for storage
  const getQuarterCode = (quarter: string, year: number) => {
    const quarterMap: Record<string, string> = {
      'Q1': 'JFM',
      'Q2': 'AMJ', 
      'Q3': 'JAS',
      'Q4': 'OND'
    };
    const shortYear = year.toString().slice(-2);
    return `${quarterMap[quarter]}'${shortYear}`;
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/x-excel',
      ];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.xlsx?$/i)) {
        setError('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setParseSummary(null);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);
    setParseSummary(null);

    try {
      // Step 1: Create upload record
      setUploadProgress(20);
      const { data: uploadRecord, error: createError } = await supabase
        .from('historical_kpi_uploads')
        .insert({
          company_id: companyId,
          file_name: file.name,
          file_size: file.size,
          status: 'processing',
          uploaded_by: user?.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Step 2: Parse Excel file on client side
      setUploadProgress(40);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Extract data from all sheets
      const sheets = workbook.SheetNames.map(name => ({
        name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { 
          header: 1, 
          defval: '',
          blankrows: false 
        }),
      }));

      // Step 3: Upload file to storage
      setUploadProgress(50);
      const filePath = `${companyId}/${uploadRecord.id}/${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('historical-data')
        .upload(filePath, file);

      if (storageError) {
        console.warn('Storage upload failed, continuing with parsing:', storageError);
      }

      // Step 4: Send to edge function for parsing and matching
      setUploadProgress(60);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-historical-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            uploadId: uploadRecord.id,
            companyId,
            fileName: file.name,
            selectedQuarter: getQuarterCode(selectedQuarter, selectedYear),
            selectedYear,
            sheets,
          }),
        }
      );

      setUploadProgress(90);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse file');
      }

      const result = await response.json();
      setUploadProgress(100);
      setParseSummary(result.summary);
      
      toast.success('Historical data uploaded and processed successfully!');
      setFile(null);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      toast.error('Failed to process historical data');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Upload Historical Data"
        subtitle="Import ESG data from previous quarters"
      />

      <div className="grid gap-6 max-w-3xl">
        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Upload your historical ESG data Excel file (any format)</p>
            <p>2. Our system will automatically detect KPIs and quarters</p>
            <p>3. KPIs are matched to the master list using AI</p>
            <p>4. Matched data will appear as reference values when you fill current KPIs</p>
            <div className="flex items-start gap-2 mt-4 p-3 bg-muted rounded-lg">
              <AlertTriangle className="w-4 h-4 text-status-warning mt-0.5 shrink-0" />
              <p className="text-xs">
                Your file doesn't need to follow a specific template. We support various formats 
                with merged cells, multiple sheets, and different column layouts.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Select File</CardTitle>
            <CardDescription>
              Upload an Excel file containing historical ESG/KPI data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file">Excel File (.xlsx, .xls)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click to select or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Period Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Period for this Data
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-xs text-muted-foreground">Year</Label>
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quarter" className="text-xs text-muted-foreground">Quarter</Label>
                  <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                    <SelectTrigger id="quarter">
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUARTERS.map((q) => (
                        <SelectItem key={q.value} value={q.value}>
                          {q.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Data will be uploaded for: <span className="text-primary">{selectedQuarter} {selectedYear}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {QUARTERS.find(q => q.value === selectedQuarter)?.months} {selectedYear}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <FileWarning className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {uploadProgress < 50 ? 'Uploading file...' : 
                   uploadProgress < 90 ? 'Parsing and matching KPIs...' : 
                   'Finalizing...'}
                </p>
              </div>
            )}

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Process
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Parse Summary */}
        {parseSummary && (
          <Card className="border-status-success/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-status-success">
                <CheckCircle2 className="w-5 h-5" />
                Upload Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{parseSummary.rowsDetected}</p>
                  <p className="text-xs text-muted-foreground">Rows Detected</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{parseSummary.kpisExtracted}</p>
                  <p className="text-xs text-muted-foreground">KPIs Extracted</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-status-success">{parseSummary.matchedCount}</p>
                  <p className="text-xs text-muted-foreground">Matched</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-status-warning">{parseSummary.unmatchedCount}</p>
                  <p className="text-xs text-muted-foreground">Unmatched</p>
                </div>
              </div>
              
              {parseSummary.quartersDetected.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Quarters detected:</p>
                  <div className="flex gap-2 flex-wrap">
                    {parseSummary.quartersDetected.map((q) => (
                      <Badge key={q} variant="secondary">{q}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {parseSummary.unmatchedCount > 0 && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-status-warning/10 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-status-warning mt-0.5" />
                  <p className="text-sm text-status-warning">
                    Some KPIs could not be matched to the master list. 
                    You can view them in the History page.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadHistoricalData;
