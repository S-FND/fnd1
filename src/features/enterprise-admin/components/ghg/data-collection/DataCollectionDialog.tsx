import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
import { Save, Download, Upload } from "lucide-react";
import { GHGSource, PeriodDataEntry, generatePeriodNames } from '@/types/ghg-data-collection';
import { downloadCSVTemplate, parseCSVData, exportToCSV, validateFrequencyData } from '@/utils/csvHelpers';
import { UnitSelector } from '@/components/ghg/UnitSelector';
import { EvidenceFileUpload } from '@/components/ghg/EvidenceFileUpload';
import { validateActivityValue, ValidationResult } from '@/utils/dataQualityValidation';
import { ValidationWarnings } from '@/components/ghg/ValidationWarnings';

interface DataCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: GHGSource | null;
  onSuccess?: () => void;
}

export const DataCollectionDialog: React.FC<DataCollectionDialogProps> = ({
  open,
  onOpenChange,
  source,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [periodData, setPeriodData] = useState<PeriodDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<Map<string, any>>(new Map());
  const [validationResults, setValidationResults] = useState<Map<number, ValidationResult>>(new Map());
  const [validating, setValidating] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (source && open) {
      initializePeriodData();
      loadExistingData();
    }
  }, [source, open]);

  const initializePeriodData = () => {
    if (!source) return;
    
    const periods = generatePeriodNames(source.measurement_frequency);
    setPeriodData(
      periods.map(period => ({
        period_name: period,
        activity_value: 0,
        notes: '',
        evidenceUrls: [],
        selectedUnit: source.activity_unit,
      }))
    );
  };

  const loadExistingData = async () => {
    if (!source) return;

    try {
      // const { data, error } = await supabase
      //   .from('ghg_activity_data')
      //   .select('*')
      //   .eq('source_id', source.id)
      //   .eq('reporting_period', source.reporting_period);

      // if (error) throw error;
      let data=[]
      const dataMap = new Map();
      data?.forEach(item => {
        dataMap.set(item.period_name, item);
      });
      setExistingData(dataMap);

      // Update period data with existing values
      setPeriodData(prev =>
        prev.map(p => {
          const existing = dataMap.get(p.period_name);
          return existing
            ? {
                period_name: p.period_name,
                activity_value: existing.activity_value,
                notes: existing.notes || '',
                evidenceUrls: existing.evidence_urls || [],
                selectedUnit: source?.activity_unit || '',
              }
            : p;
        })
      );
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handleValueChange = async (index: number, value: number) => {
    setPeriodData(prev => {
      const newData = [...prev];
      newData[index].activity_value = value;
      return newData;
    });

    // Validate the value
    if (value > 0 && source) {
      setValidating(true);
      try {
        const result = await validateActivityValue(
          source.id,
          periodData[index].period_name,
          value,
          source.activity_unit
        );
        setValidationResults(prev => {
          const newResults = new Map(prev);
          newResults.set(index, result);
          return newResults;
        });
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setValidating(false);
      }
    } else {
      setValidationResults(prev => {
        const newResults = new Map(prev);
        newResults.delete(index);
        return newResults;
      });
    }
  };

  const handleNotesChange = (index: number, notes: string) => {
    setPeriodData(prev => {
      const newData = [...prev];
      newData[index].notes = notes;
      return newData;
    });
  };

  const handleUnitChange = (index: number, unit: string) => {
    setPeriodData(prev => {
      const newData = [...prev];
      newData[index].selectedUnit = unit;
      return newData;
    });
  };

  const handleEvidenceChange = (index: number, urls: string[]) => {
    setPeriodData(prev => {
      const newData = [...prev];
      newData[index].evidenceUrls = urls;
      return newData;
    });
  };

  const calculateEmissions = (activityValue: number): number => {
    if (!source?.emission_factor) return 0;
    return activityValue * source.emission_factor;
  };

  const handleSave = async () => {
    if (!source) return;

    setLoading(true);
    try {
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) throw new Error('User not authenticated');

      // const { data: profile } = await supabase
      //   .from('user_profiles')
      //   .select('portfolio_company_id')
      //   .eq('user_id', user.id)
      //   .single();

      // if (!profile) throw new Error('User profile not found');

      // Prepare data entries for upsert
      const entries = periodData
        .filter(p => p.activity_value > 0)
        .map(p => {
          const existing = existingData.get(p.period_name);
          const emissions = calculateEmissions(p.activity_value);

          return {
            id: existing?.id,
            source_id: source.id,
            // portfolio_company_id: profile.portfolio_company_id,
            reporting_period: source.reporting_period,
            period_name: p.period_name,
            activity_value: p.activity_value,
            activity_unit: source.activity_unit,
            emission_factor: source.emission_factor || 0,
            emission_factor_source: source.emission_factor_source,
            calculated_emissions: emissions,
            data_collection_date: new Date().toISOString().split('T')[0],
            // collected_by: user.id,
            notes: p.notes,
            evidence_urls: p.evidenceUrls || [],
            status: 'submitted', // Set to submitted for approval workflow
            // created_by: user.id,
          };
        });

      // const { error } = await supabase
      //   .from('ghg_activity_data')
      //   .upsert(entries, { onConflict: 'source_id,reporting_period,period_name' });

      // if (error) throw error;

      toast({
        title: "Data Saved Successfully",
        description: `Saved ${entries.length} period(s) of activity data.`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error Saving Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!source) return;

    downloadCSVTemplate(
      source.measurement_frequency,
      'Activity Value',
      source.activity_unit,
      `${source.source_name}-template.csv`
    );

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded.",
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !source) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSVData(text);

      const validation = validateFrequencyData(parsedData, source.measurement_frequency);

      if (!validation.valid) {
        toast({
          title: "Import Failed",
          description: validation.message,
          variant: "destructive",
        });
        return;
      }

      setPeriodData(prev =>
        prev.map(p => {
          const imported = parsedData.find(d => d.period === p.period_name);
          return imported
            ? { ...p, activity_value: imported.value }
            : p;
        })
      );

      toast({
        title: "Data Imported",
        description: `Successfully imported ${parsedData.length} periods of data.`,
      });
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportData = () => {
    if (!source) return;

    const exportData = periodData.map(p => ({
      period: p.period_name,
      value: p.activity_value,
    }));

    exportToCSV(
      exportData,
      'Activity Value',
      source.activity_unit,
      `${source.source_name}-data.csv`
    );

    toast({
      title: "Data Exported",
      description: "Activity data has been exported to CSV.",
    });
  };

  const totalEmissions = periodData.reduce(
    (sum, p) => sum + calculateEmissions(p.activity_value),
    0
  );

  const completedPeriods = periodData.filter(p => p.activity_value > 0).length;

  if (!source) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Data Collection: {source.source_name}</DialogTitle>
          <DialogDescription>
            Enter activity data for {source.measurement_frequency.toLowerCase()} periods in {source.reporting_period}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Source Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Scope:</span>
                    <Badge className="ml-2" variant="outline">{source.scope}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium">{source.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unit:</span>
                    <p className="font-medium">{source.activity_unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <p className="font-medium">{source.measurement_frequency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
              >
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                style={{ display: 'none' }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={completedPeriods === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Period Data Entry */}
            <div className="space-y-4">
              <h3 className="font-semibold">Period-wise Activity Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {periodData.map((period, index) => (
                  <Card key={index} className={existingData.has(period.period_name) ? 'border-primary' : ''}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-semibold">{period.period_name}</Label>
                        {existingData.has(period.period_name) && (
                          <Badge variant="secondary" className="text-xs">Saved</Badge>
                        )}
                      </div>
                      
                      <UnitSelector
                        label="Activity Value"
                        value={period.activity_value}
                        onChange={(value) => handleValueChange(index, value)}
                        baseUnit={source.activity_unit}
                        selectedUnit={period.selectedUnit || source.activity_unit}
                        onUnitChange={(unit) => handleUnitChange(index, unit)}
                        placeholder="0.00"
                      />

                      {period.activity_value > 0 && source.emission_factor && (
                        <div className="text-xs text-muted-foreground">
                          ≈ {(calculateEmissions(period.activity_value) / 1000).toFixed(3)} tCO₂e
                        </div>
                      )}

                      <div>
                        <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
                        <Textarea
                          value={period.notes}
                          onChange={(e) => handleNotesChange(index, e.target.value)}
                          placeholder="Add notes..."
                          rows={2}
                          className="text-sm"
                        />
                      </div>

                      <EvidenceFileUpload
                        value={period.evidenceUrls || []}
                        onChange={(urls) => handleEvidenceChange(index, urls)}
                        label="Evidence Files"
                        description="Upload supporting documents (optional)"
                        maxFiles={3}
                        scope={`period-${index}`}
                      />

                      {/* Validation Warnings */}
                      <ValidationWarnings
                        validationResult={validationResults.get(index) || null}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary */}
            {completedPeriods > 0 && (
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Periods Completed</p>
                      <p className="text-2xl font-bold text-primary">
                        {completedPeriods} / {periodData.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Activity</p>
                      <p className="text-2xl font-bold">
                        {periodData.reduce((sum, p) => sum + p.activity_value, 0).toFixed(2)} {source.activity_unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Emissions</p>
                      <p className="text-2xl font-bold text-primary">
                        {(totalEmissions / 1000).toFixed(3)} tCO₂e
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || completedPeriods === 0}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataCollectionDialog;