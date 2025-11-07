import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BulkImportRow } from '@/types/ghg-data-collection';

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

export const BulkDataImport: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const generateBulkImportTemplate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch all active sources to include in template
      const { data: sources, error } = await supabase
        .from('ghg_sources')
        .select('id, source_name, scope, measurement_frequency, activity_unit')
        .eq('is_active', true)
        .order('scope, source_name');

      if (error) throw error;

      if (!sources || sources.length === 0) {
        toast({
          title: "No Sources Found",
          description: "Create emission sources before generating import template.",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content with source examples
      const header = 'Source ID,Source Name,Period Name,Activity Value,Notes\n';
      const examples = sources.slice(0, 3).map(source => {
        // Generate sample period based on frequency
        let samplePeriod = '';
        switch (source.measurement_frequency) {
          case 'Quarterly':
            samplePeriod = 'Q1 (Apr-Jun)';
            break;
          case 'Monthly':
            samplePeriod = 'Apr';
            break;
          case 'Annually':
            samplePeriod = 'FY 2024-25';
            break;
          default:
            samplePeriod = 'Period 1';
        }
        return `${source.id},"${source.source_name}","${samplePeriod}",0,"Add your notes here"`;
      }).join('\n');

      const instructions = `# Bulk Import Template for GHG Activity Data
# Instructions:
# 1. Fill in Activity Value for each period
# 2. Source ID must match existing emission sources
# 3. Period Name must match the frequency defined for the source
# 4. Do not modify Source ID or Source Name columns
# 5. Save and upload this file
#
# Available Sources:
${sources.map(s => `# - ${s.source_name} (ID: ${s.id}, Frequency: ${s.measurement_frequency})`).join('\n')}
#
${header}${examples}`;

      // Create and download file
      const blob = new Blob([instructions], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'ghg-bulk-import-template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Template Downloaded",
        description: "Fill in the template and upload to import data.",
      });
    } catch (error: any) {
      toast({
        title: "Error Generating Template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const parseCSV = (text: string): BulkImportRow[] => {
    const lines = text.trim().split('\n').filter(line => !line.startsWith('#') && line.trim());
    const data: BulkImportRow[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(/(?:"([^"]*?)"|([^,]+))(?:,|$)/g);
      
      if (!matches || matches.length < 4) continue;

      const sourceId = matches[0].replace(/[",]/g, '').trim();
      const periodName = matches[2].replace(/[",]/g, '').trim();
      const activityValue = parseFloat(matches[3].replace(/[",]/g, '').trim());
      const notes = matches[4] ? matches[4].replace(/[",]/g, '').trim() : '';

      if (sourceId && periodName && !isNaN(activityValue)) {
        data.push({
          source_id: sourceId,
          period_name: periodName,
          activity_value: activityValue,
          notes: notes || undefined,
        });
      }
    }

    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('portfolio_company_id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Read and parse CSV
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        throw new Error('No valid data found in CSV');
      }

      // Fetch source details for all source IDs
      const sourceIds = [...new Set(rows.map(r => r.source_id))];
      const { data: sources, error: sourcesError } = await supabase
        .from('ghg_sources')
        .select('id, emission_factor, emission_factor_source, activity_unit, reporting_period')
        .in('id', sourceIds);

      if (sourcesError) throw sourcesError;

      const sourceMap = new Map(sources?.map(s => [s.id, s]) || []);

      // Prepare data entries
      const errors: string[] = [];
      const entries = rows.map((row, index) => {
        const source = sourceMap.get(row.source_id);
        
        if (!source) {
          errors.push(`Row ${index + 2}: Source ID ${row.source_id} not found`);
          return null;
        }

        if (row.activity_value < 0) {
          errors.push(`Row ${index + 2}: Activity value cannot be negative`);
          return null;
        }

        const emissions = (row.activity_value || 0) * (source.emission_factor || 0);

        return {
          source_id: row.source_id,
          portfolio_company_id: profile.portfolio_company_id,
          reporting_period: source.reporting_period,
          period_name: row.period_name,
          activity_value: row.activity_value,
          activity_unit: source.activity_unit,
          emission_factor: source.emission_factor || 0,
          emission_factor_source: source.emission_factor_source,
          calculated_emissions: emissions,
          status: 'submitted',
          data_collection_date: new Date().toISOString().split('T')[0],
          collected_by: user.id,
          notes: row.notes,
          created_by: user.id,
        };
      }).filter(Boolean);

      // Import data in batches
      const batchSize = 50;
      let successful = 0;

      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('ghg_activity_data')
          .upsert(batch, { onConflict: 'source_id,reporting_period,period_name' });

        if (error) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
          successful += batch.length;
        }

        setProgress(((i + batch.length) / entries.length) * 100);
      }

      setResult({
        total: rows.length,
        successful,
        failed: rows.length - successful,
        errors,
      });

      if (successful > 0) {
        toast({
          title: "Import Completed",
          description: `Successfully imported ${successful} out of ${rows.length} records.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
      setResult({
        total: 0,
        successful: 0,
        failed: 0,
        errors: [error.message],
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Data Import
        </CardTitle>
        <CardDescription>
          Import activity data for multiple sources and periods from a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>How to use bulk import:</strong>
            <ol className="list-decimal ml-4 mt-2 space-y-1">
              <li>Download the template CSV file</li>
              <li>Fill in activity values for each source and period</li>
              <li>Save the file and upload it here</li>
              <li>Review the import results and fix any errors</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={generateBulkImportTemplate}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            {importing ? 'Importing...' : 'Upload CSV'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Progress */}
        {importing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Importing data...</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Results */}
        {result && (
          <Card className={result.errors.length > 0 ? 'border-yellow-500' : 'border-green-500'}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Import Results</h4>
                {result.errors.length === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.total}</div>
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Errors ({result.errors.length})
                  </h5>
                  <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-red-600 font-mono text-xs bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkDataImport;
