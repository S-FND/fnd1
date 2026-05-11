import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  History as HistoryIcon, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import { ESGBadge } from '@/components/ESGBadge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HistoricalUpload {
  id: string;
  file_name: string;
  file_size: number;
  quarters_detected: string[];
  rows_detected: number;
  kpis_extracted: number;
  unmatched_count: number;
  status: string;
  created_at: string;
}

interface HistoricalEntry {
  id: string;
  original_kpi_text: string;
  original_value: string | null;
  original_unit: string | null;
  original_esg: string | null;
  original_category: string | null;
  quarter: string;
  matched_kpi_id: string | null;
  match_confidence: number;
  match_method: string | null;
  source_sheet: string | null;
  kpi_master?: {
    name: string;
    esg: string;
    category: string;
  };
}

const QUARTERS = [
  { value: 'all', label: 'All Quarters' },
  { value: "AMJ'24", label: "AMJ'24" },
  { value: "JAS'24", label: "JAS'24" },
  { value: "OND'24", label: "OND'24" },
  { value: "JFM'25", label: "JFM'25" },
  { value: "AMJ'25", label: "AMJ'25" },
  { value: "JAS'25", label: "JAS'25" },
];

const History = () => {
  const { user, effectiveCompanyId } = useAuth();
  const navigate = useNavigate();
  const companyId = effectiveCompanyId || user?.companyId || 'company-1';
  
  const [activeTab, setActiveTab] = useState<'data' | 'uploads'>('data');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [uploads, setUploads] = useState<HistoricalUpload[]>([]);
  const [entries, setEntries] = useState<HistoricalEntry[]>([]);
  const [deleteUploadId, setDeleteUploadId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [companyId, selectedQuarter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load uploads
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('historical_kpi_uploads')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (uploadsError) throw uploadsError;
      setUploads(uploadsData || []);

      // Load entries with master KPI join
      let query = supabase
        .from('historical_kpi_entries')
        .select(`
          *,
          kpi_master (
            name,
            esg,
            category
          )
        `)
        .eq('company_id', companyId)
        .order('quarter', { ascending: false });

      if (selectedQuarter !== 'all') {
        query = query.eq('quarter', selectedQuarter);
      }

      const { data: entriesData, error: entriesError } = await query.limit(500);

      if (entriesError) throw entriesError;
      setEntries(entriesData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load historical data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpload = async () => {
    if (!deleteUploadId) return;
    
    try {
      const { error } = await supabase
        .from('historical_kpi_uploads')
        .delete()
        .eq('id', deleteUploadId);

      if (error) throw error;

      toast.success('Upload deleted successfully');
      setDeleteUploadId(null);
      loadData();
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Failed to delete upload');
    }
  };

  const getConfidenceBadge = (confidence: number, method: string | null) => {
    if (!method || method === 'unmatched') {
      return <Badge variant="outline" className="text-muted-foreground">Unmatched</Badge>;
    }
    if (confidence >= 0.85) {
      return <Badge className="bg-status-success text-white">High</Badge>;
    }
    if (confidence >= 0.6) {
      return <Badge className="bg-status-warning text-white">Medium</Badge>;
    }
    return <Badge variant="outline" className="text-status-warning">Low</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Historical Data"
        subtitle="View and manage your historical ESG data"
        actions={
          <Button variant="outline" onClick={() => navigate('/company/upload-historical')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Upload New File
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'data' | 'uploads')}>
        <TabsList className="mb-6">
          <TabsTrigger value="data">
            <HistoryIcon className="w-4 h-4 mr-2" />
            Historical Data
          </TabsTrigger>
          <TabsTrigger value="uploads">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Uploaded Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          {/* Quarter Filter */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by quarter" />
              </SelectTrigger>
              <SelectContent>
                {QUARTERS.map((q) => (
                  <SelectItem key={q.value} value={q.value}>
                    {q.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {entries.length} entries
            </span>
          </div>

          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No historical data found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/company/upload-historical')}
                >
                  Upload Historical Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quarter</TableHead>
                      <TableHead>KPI (Original)</TableHead>
                      <TableHead>Mapped To</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Badge variant="secondary">{entry.quarter}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="space-y-1">
                            <p className="text-sm font-medium truncate" title={entry.original_kpi_text}>
                              {entry.original_kpi_text}
                            </p>
                            {entry.original_esg && (
                              <ESGBadge category={entry.original_esg as 'E' | 'S' | 'G'} size="sm" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {entry.kpi_master ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                                  <span className="text-sm truncate" title={entry.kpi_master.name}>
                                    {entry.kpi_master.name.slice(0, 40)}...
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-sm">{entry.kpi_master.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground text-sm flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Not mapped
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {entry.original_value || '-'}
                          </span>
                          {entry.original_unit && (
                            <span className="text-xs text-muted-foreground ml-1">
                              {entry.original_unit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getConfidenceBadge(entry.match_confidence, entry.match_method)}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {entry.source_sheet || 'Sheet 1'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="uploads">
          {uploads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No files uploaded yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/company/upload-historical')}
                >
                  Upload Your First File
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {uploads.map((upload) => (
                <Card key={upload.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileSpreadsheet className="w-10 h-10 text-primary" />
                        <div>
                          <h3 className="font-medium">{upload.file_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {formatDate(upload.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold">{upload.kpis_extracted}</p>
                          <p className="text-xs text-muted-foreground">KPIs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-status-success">
                            {upload.kpis_extracted - upload.unmatched_count}
                          </p>
                          <p className="text-xs text-muted-foreground">Matched</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-status-warning">
                            {upload.unmatched_count}
                          </p>
                          <p className="text-xs text-muted-foreground">Unmatched</p>
                        </div>
                        <div className="flex gap-2">
                          {upload.quarters_detected?.map((q) => (
                            <Badge key={q} variant="secondary">{q}</Badge>
                          ))}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setDeleteUploadId(upload.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUploadId} onOpenChange={() => setDeleteUploadId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Upload</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this file and all associated historical data entries.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUpload} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default History;
