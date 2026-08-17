import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  FileCheck,
  X
} from 'lucide-react';
import { 
  parseKPITemplateUpload, 
  saveKPIEntriesFromTemplate,
  ParsedKPIEntry 
} from '@/lib/companyKPITemplate';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { httpClient } from '@/lib/httpClient';

interface UploadKPITemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  quarter: string;
  year: number;
  onSuccess?: () => void;
}

type UploadStep = 'select' | 'preview' | 'uploading' | 'complete';

export const UploadKPITemplateDialog = ({
  open,
  onOpenChange,
  companyId,
  quarter,
  year,
  onSuccess,
}: UploadKPITemplateDialogProps) => {
  const [step, setStep] = useState<UploadStep>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedEntries, setParsedEntries] = useState<ParsedKPIEntry[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [quarterCounts, setQuarterCounts] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('select');
    setSelectedFile(null);
    setParsedEntries([]);
    setParseErrors([]);
    setTotalRows(0);
    setQuarterCounts({});
    setUploadProgress(0);
    setUploadResult(null);
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const result = await parseKPITemplateUpload(file);
      setParsedEntries(result.entries);
      setParseErrors(result.errors);
      setTotalRows(result.totalRows);
      setQuarterCounts(result.quarterCounts);
      setStep('preview');
    } catch (error) {
      toast.error('Failed to parse file');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (parsedEntries.length === 0) {
      toast.error("No valid entries to upload");
      return;
    }
  
    setStep("uploading");
    setIsProcessing(true);
  
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
  
      // 🔥 Map to the exact DTO expected by the backend
      const entries = parsedEntries.map(entry => ({
        company_id: companyId,
        kpi_id: entry.kpiId,           // use the correct key from parsed data
        value: entry.value,            // must be a string
        quarter: entry.quarter,        // 👈 use the parsed quarter (not the prop!)
        year: year                     // use the prop year (or entry.year if provided)
      }));
  
      // Remove any entries where quarter is missing
      const validEntries = entries.filter(e => e.quarter);
      if (validEntries.length === 0) {
        toast.error("No entries with a valid quarter found");
        setStep("preview");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", selectedFile!);
      formData.append("entries", JSON.stringify(validEntries));
  
      const { data } = await httpClient.post(
        "mis/kpi-entries/upsert",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      clearInterval(progressInterval);
      setUploadProgress(100);
  
      setUploadResult({
        success: data?.length ?? validEntries.length,
        failed: 0,
      });
  
      setStep("complete");
      toast.success(`Successfully uploaded ${validEntries.length} KPI entries`);
      onSuccess?.();
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      toast.error("Failed to upload entries");
      setStep("preview");
    } finally {
      setIsProcessing(false);
    }
  };

  // Group entries by quarter first, then by feature
  const groupedByQuarter = parsedEntries.reduce((acc, entry) => {
    const qKey = entry.quarter || 'Q4';
    if (!acc[qKey]) acc[qKey] = [];
    acc[qKey].push(entry);
    return acc;
  }, {} as Record<string, ParsedKPIEntry[]>);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Upload KPI Data Template
          </DialogTitle>
          <DialogDescription>
            Upload your filled KPI template. Q4 data will populate current fields, Q1-Q3 data will appear as historical reference values.
          </DialogDescription>
        </DialogHeader>

        {/* Step: Select File */}
        {step === 'select' && (
          <div className="py-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".xlsx,.xls"
              className="hidden"
            />
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                "hover:border-primary hover:bg-primary/5",
                isProcessing && "pointer-events-none opacity-50"
              )}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Processing file...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Excel files only (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileCheck className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {totalRows} rows found • {parsedEntries.length} valid entries
                </p>
                {Object.entries(quarterCounts).some(([_, count]) => count > 0) && (
                  <div className="flex gap-2 mt-1">
                    {Object.entries(quarterCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([quarter, count]) => (
                        <Badge key={quarter} variant="outline" className="text-xs">
                          {quarter}: {count}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setStep('select'); setSelectedFile(null); }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Errors */}
            {parseErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-1">{parseErrors.length} issues found:</p>
                  <ul className="text-xs list-disc pl-4 max-h-20 overflow-auto">
                    {parseErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {parseErrors.length > 5 && (
                      <li>...and {parseErrors.length - 5} more</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview of entries */}
            {parsedEntries.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Preview ({parsedEntries.length} entries):</p>
                <ScrollArea className="h-48 border rounded-lg">
                  <div className="p-3 space-y-3">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => {
                      const entries = groupedByQuarter[quarter] || [];
                      if (entries.length === 0) return null;
                      
                      return (
                        <div key={quarter}>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={quarter === 'Q4' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {quarter}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {entries.length} entries
                              {quarter === 'Q4' && ' → Current fields'}
                              {quarter !== 'Q4' && ' → Previous values'}
                            </span>
                          </div>
                          <div className="space-y-1 ml-2">
                            {entries.slice(0, 3).map((entry, i) => (
                              <div 
                                key={i}
                                className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
                              >
                                <span className="truncate flex-1">{entry.kpiName || entry.kpiId}</span>
                                <Badge variant="outline" className="ml-2 shrink-0">
                                  {entry.value}
                                </Badge>
                              </div>
                            ))}
                            {entries.length > 3 && (
                              <p className="text-xs text-muted-foreground pl-2">
                                ...and {entries.length - 3} more
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {/* Step: Uploading */}
        {step === 'uploading' && (
          <div className="py-8 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-medium">Uploading entries...</p>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {Math.round(uploadProgress)}% complete
            </p>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && uploadResult && (
          <div className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-status-success" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Upload Complete!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {uploadResult.success} entries saved successfully
                  {uploadResult.failed > 0 && `, ${uploadResult.failed} failed`}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'select' && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={parsedEntries.length === 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {parsedEntries.length} Entries 2nd
              </Button>
            </>
          )}
          
          {step === 'complete' && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
