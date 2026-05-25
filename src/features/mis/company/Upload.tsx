import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ESGBadge, CoreBadge } from '@/components/ESGBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseExcelFile, ParseResult, ParsedKPIData } from '@/lib/excelParser';
import { mockKPIs } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Upload as UploadIcon, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  FileCheck,
  FileWarning,
  Leaf,
  Users,
  Scale,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const { companyName, user, effectiveCompanyId } = useAuth();
  const companyId = effectiveCompanyId || user?.companyId || 'company-1';
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>('all');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
        toast.error('Please select a valid Excel file (.xlsx, .xls, or .csv)');
        return;
      }
      setSelectedFile(file);
      setParseResult(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      const result = await parseExcelFile(selectedFile, mockKPIs);
      setParseResult(result);
      
      if (result.success) {
        if (result.summary.matchedKPIs > 0) {
          toast.success(`Successfully parsed ${result.summary.parsedKPIs} KPIs, matched ${result.summary.matchedKPIs} to master list`);
        } else {
          toast.warning('File parsed but no KPIs matched the master list');
        }
      } else {
        toast.error(result.errors[0] || 'Failed to parse file');
      }
    } catch (error) {
      toast.error('Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportData = async () => {
    if (!parseResult?.data) return;
    
    const matchedItems = parseResult.data.filter(d => d.matchedKpiId && d.value !== undefined && d.value !== null);
    if (matchedItems.length === 0) {
      toast.error('No matched KPIs to import');
      return;
    }
    
    setIsProcessing(true);
    let success = 0;
    let failed = 0;
    
    try {
      for (const item of matchedItems) {
        const { error } = await supabase
          .from('kpi_entries')
          .upsert({
            company_id: companyId,
            kpi_id: item.matchedKpiId!,
            value: String(item.value),
            quarter: 'Q1', // Default quarter for historical imports
            year: new Date().getFullYear(),
            submitted_at: new Date().toISOString(),
          }, {
            onConflict: 'company_id,kpi_id,quarter,year',
          });
        
        if (error) {
          console.error('Import error:', error);
          failed++;
        } else {
          success++;
        }
      }
      
      if (success > 0) {
        toast.success(`Imported ${success} matched KPIs successfully${failed > 0 ? ` (${failed} failed)` : ''}`);
      } else {
        toast.error('Failed to import KPI data');
      }
      navigate('/mis/data-entry');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFilteredData = (): ParsedKPIData[] => {
    if (!parseResult?.data) return [];
    if (activeSheet === 'all') return parseResult.data;
    if (activeSheet === 'matched') return parseResult.data.filter(d => d.matchedKpiId);
    if (activeSheet === 'unmatched') return parseResult.data.filter(d => !d.matchedKpiId);
    return parseResult.data.filter(d => d.sheetName === activeSheet);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) {
      return <Badge variant="default" className="bg-status-success">High Match ({confidence}%)</Badge>;
    } else if (confidence >= 50) {
      return <Badge variant="default" className="bg-status-warning text-foreground">Medium ({confidence}%)</Badge>;
    } else if (confidence > 0) {
      return <Badge variant="outline" className="border-status-warning text-status-warning">Low ({confidence}%)</Badge>;
    }
    return <Badge variant="destructive">No Match</Badge>;
  };

  const getESGIcon = (esg: 'E' | 'S' | 'G' | null) => {
    switch (esg) {
      case 'E': return <Leaf className="w-4 h-4 text-esg-environmental" />;
      case 'S': return <Users className="w-4 h-4 text-esg-social" />;
      case 'G': return <Scale className="w-4 h-4 text-esg-governance" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Upload Historical Data"
        subtitle={`${companyName} • Import previous quarter KPI data`}
      />

      {/* Upload Section */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!selectedFile ? (
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <UploadIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload KPI Data File</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop or click to select an Excel file (.xlsx, .xls, .csv)
              </p>
              <Button variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Select File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!parseResult && (
                    <Button onClick={handleProcessFile} disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Parse File
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleClearFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Parse Result Summary */}
              {parseResult && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold">{parseResult.summary.totalRows}</p>
                    <p className="text-sm text-muted-foreground">Total Rows</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold">{parseResult.summary.parsedKPIs}</p>
                    <p className="text-sm text-muted-foreground">KPIs Found</p>
                  </div>
                  <div className="p-4 rounded-lg bg-status-success/10 text-center">
                    <p className="text-2xl font-bold text-status-success">{parseResult.summary.matchedKPIs}</p>
                    <p className="text-sm text-muted-foreground">Matched</p>
                  </div>
                  <div className="p-4 rounded-lg bg-status-warning/10 text-center">
                    <p className="text-2xl font-bold text-status-warning">{parseResult.summary.unmatchedKPIs}</p>
                    <p className="text-sm text-muted-foreground">Unmatched</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parsed Data View */}
      {parseResult && parseResult.data.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-status-success" />
              Parsed KPI Data
            </CardTitle>
            <Button onClick={handleImportData} disabled={parseResult.summary.matchedKPIs === 0}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Import Matched Data ({parseResult.summary.matchedKPIs})
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSheet} onValueChange={setActiveSheet}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All ({parseResult.data.length})
                </TabsTrigger>
                <TabsTrigger value="matched" className="text-status-success">
                  Matched ({parseResult.summary.matchedKPIs})
                </TabsTrigger>
                <TabsTrigger value="unmatched" className="text-status-warning">
                  Unmatched ({parseResult.summary.unmatchedKPIs})
                </TabsTrigger>
                {parseResult.sheets.map(sheet => (
                  <TabsTrigger key={sheet} value={sheet}>
                    {sheet}
                  </TabsTrigger>
                ))}
              </TabsList>

              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {getFilteredData().map((item, index) => {
                    const matchedKPI = item.matchedKpiId 
                      ? mockKPIs.find(k => k.id === item.matchedKpiId)
                      : null;
                    
                    return (
                      <div 
                        key={`${item.sheetName}-${item.rowIndex}-${index}`}
                        className={`p-4 rounded-lg border ${
                          item.matchedKpiId 
                            ? 'border-status-success/30 bg-status-success/5' 
                            : 'border-border bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {getESGIcon(item.esg)}
                              <span className="font-medium truncate">{item.kpiName}</span>
                              {getConfidenceBadge(item.matchConfidence)}
                            </div>
                            
                            {item.category && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Category: {item.category}
                              </p>
                            )}
                            
                            {matchedKPI && (
                              <div className="flex items-center gap-2 text-sm bg-status-success/10 p-2 rounded">
                                <CheckCircle2 className="w-4 h-4 text-status-success" />
                                <span>Matched to: <strong>{matchedKPI.name}</strong></span>
                                <CoreBadge level={matchedKPI.coreLevel} size="sm" />
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right shrink-0">
                            <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                              <p className="text-xs text-muted-foreground mb-1">Value</p>
                              <p className="font-semibold text-lg">
                                {typeof item.value === 'boolean' 
                                  ? (item.value ? 'Yes' : 'No') 
                                  : item.value || '-'}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Sheet: {item.sheetName}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {parseResult && parseResult.data.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileWarning className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No KPI Data Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any recognizable KPI data in the uploaded file.
              Please ensure your file contains KPI names and values.
            </p>
            <Button variant="outline" onClick={handleClearFile}>
              Try Another File
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Upload;
