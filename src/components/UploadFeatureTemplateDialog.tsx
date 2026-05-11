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
  parseFeatureTemplateUpload, 
  saveFeatureEntriesFromTemplate,
  ParsedFeatureEntry 
} from '@/lib/featureKPITemplate';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UploadFeatureTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  quarter: string;
  year: number;
  featureKey: string;
  featureLabel: string;
  onSuccess?: () => void;
}

type UploadStep = 'select' | 'preview' | 'uploading' | 'complete';

export const UploadFeatureTemplateDialog = ({
  open,
  onOpenChange,
  companyId,
  quarter,
  year,
  featureKey,
  featureLabel,
  onSuccess,
}: UploadFeatureTemplateDialogProps) => {
  const [step, setStep] = useState<UploadStep>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedEntries, setParsedEntries] = useState<ParsedFeatureEntry[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
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
      const result = await parseFeatureTemplateUpload(file, featureKey);
      setParsedEntries(result.entries);
      setParseErrors(result.errors);
      setTotalRows(result.totalRows);
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
      toast.error('No valid entries to upload');
      return;
    }

    setStep('uploading');
    setIsProcessing(true);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await saveFeatureEntriesFromTemplate(parsedEntries, companyId, quarter, year);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      setStep('complete');

      if (result.success > 0) {
        toast.success(`Successfully uploaded ${result.success} KPI entries`);
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Failed to upload entries');
      console.error(error);
      setStep('preview');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Upload {featureLabel} Data
          </DialogTitle>
          <DialogDescription>
            Upload your filled template for {featureLabel} - {quarter} {year}
          </DialogDescription>
        </DialogHeader>

        {/* Step: Select File */}
        {step === 'select' && (
          <div className="py-6">
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
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                "hover:border-primary hover:bg-primary/5",
                isProcessing && "pointer-events-none opacity-50"
              )}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Processing file...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">
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
              <FileCheck className="w-6 h-6 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {totalRows} rows found • {parsedEntries.length} valid entries
                </p>
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
                  <p className="font-medium mb-1 text-sm">{parseErrors.length} issues found:</p>
                  <ul className="text-xs list-disc pl-4 max-h-16 overflow-auto">
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
                <ScrollArea className="h-40 border rounded-lg">
                  <div className="p-3 space-y-2">
                    {parsedEntries.map((entry, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded gap-2"
                      >
                        <span className="text-xs text-muted-foreground w-6">{entry.sno}</span>
                        <span className="truncate flex-1 text-xs">{entry.kpiName}</span>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {entry.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {/* Step: Uploading */}
        {step === 'uploading' && (
          <div className="py-6 space-y-4">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-medium text-sm">Uploading entries...</p>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">
              {Math.round(uploadProgress)}% complete
            </p>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && uploadResult && (
          <div className="py-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-status-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-status-success" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold">Upload Complete!</p>
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
                Upload {parsedEntries.length} Entries
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
