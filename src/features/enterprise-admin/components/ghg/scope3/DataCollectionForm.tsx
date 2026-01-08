import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, Upload, Download, Calculator } from "lucide-react";
import EvidenceFileUpload from '@/components/ghg/EvidenceFileUpload';
import UnitSelector from '@/components/ghg/UnitSelector';
import { UnitConverterDialog } from '@/components/ghg/UnitConverterDialog';
import FrequencySelector from '@/components/ghg/FrequencySelector';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { GHGSourceTemplate, GHGDataCollection } from '@/types/ghg-source-template';
import { MeasurementFrequency, generatePeriodNames } from '@/types/ghg-data-collection';
import { DataQuality, calculateEmissions } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient';
import { SignedUploadUrl, uploadFilesInParallel } from '@/utils/parallelUploader';
import { toast } from 'sonner';

interface DataEntry {
  _id?: string;
  id: string;
  periodName: string;
  date: string;
  activityDataValue: number;
  notes: string;
  evidenceUrls?: string[];
  selectedUnit?: string;
  evidenceFiles?: { url?: string; name?: string; key?: string; type?: string }[];
}

const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Patel' },
];

export const DataCollectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { toast } = useToast();
  const { template, year } = location.state as { template: GHGSourceTemplate; month: string; year: number; };

  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear());
  const [selectedFrequency, setSelectedFrequency] = useState<MeasurementFrequency>(template.measurementFrequency);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [evidenceByEntry, setEvidenceByEntry] = useState<Record<string, File[]>>({});
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<Record<string, number>>({});

  const [uploadStatus, setUploadStatus] =
    useState<Record<string, "uploading" | "done" | "error">>({});

  const [reloadData, setReloadData] = useState(false);

  const [params] = useSearchParams();
  const templateId = params.get('templateId');

  const getTemplateData = async (templateId: string) => {
    try {
      let response = await httpClient.get(`ghg-accounting/${templateId}/ghg-data-collection`);
      logger.debug("Template data response:", response);
      if (response.status === 200) {
        return response.data as { collectedData: GHGDataCollection[], templateDetails: GHGSourceTemplate };
      }
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
    return null;
  };


  useEffect(() => {
    if (templateId) {
      // Fetch template details using templateId if needed
      // For now, we assume template is passed via location.state
      getTemplateData(templateId).then(data => {
        if (data) {
          logger.debug("Fetched template data:", data);
          // You can set the fetched data to state variables here
          // setTemplate(data.templateDetails);
          // setDataEntries(...) based on data.collectedData
          if (data.templateDetails && data.templateDetails.measurementFrequency) {
            setSelectedFrequency(data.templateDetails.measurementFrequency);
          }
          if (data.collectedData && data.collectedData.length > 0) {
            data
            const entries: DataEntry[] = data.collectedData.map(c => ({
              _id: c._id,
              id: c._id,
              periodName: c.reportingMonth || '',
              date: c.collectedDate,
              evidenceFiles: c.evidenceFiles ? c.evidenceFiles.map(ef => ({ key: ef.key, name: ef.name, type: ef.type, url: ef.key })) : [],

              activityDataValue: c.activityDataValue,

              notes: c.notes,
            }));
            setDataEntries(entries);
          }
        }
      });
    }
  }, [templateId,selectedYear]);

  useEffect(() => {
    const periods = generatePeriodNames(selectedFrequency);
    setDataEntries(periods.map((periodName) => ({
      id: uuidv4(),
      periodName,
      date: new Date().toISOString().split('T')[0],
      activityDataValue: 0,
      notes: '',
      evidenceUrls: [],
      selectedUnit: template.activityDataUnit,
    })));
  }, [selectedFrequency, template._id]);

  const updateEntry = (id: string, field: keyof DataEntry, value: any) => {
    setDataEntries(dataEntries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const startEvidenceUpload = async (
    entryKey: string,
    signedUrls: SignedUploadUrl[]
  ) => {
    const files = evidenceByEntry[entryKey] || [];
    if (!files.length) return;

    setIsFileUploadOpen(true);

    await uploadFilesInParallel(
      entryKey,
      files,
      signedUrls,
      3, // concurrency (2–4 is ideal)
      (key, percent) =>
        setUploadProgress(p => ({ ...p, [key]: percent })),
      (key, status) =>
        setUploadStatus(s => ({ ...s, [key]: status }))
    );

    setIsFileUploadOpen(false);
  }

  const handleSave = async (status: 'draft' | 'submitted') => {
    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor || 0);
      let files = evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || [];
      return {
        scope: 'Scope3',
        _id: entry._id,
        sourceTemplateId: template._id,
        reportingPeriod: `${selectedFrequency} ${selectedYear}`,
        reportingMonth: entry.periodName,
        reportingYear: selectedYear,
        collectedDate: entry.date,
        activityDataValue: entry.activityDataValue,
        emissionCO2: emissions.co2, emissionCH4: emissions.ch4, emissionN2O: emissions.n2o, totalEmission: emissions.total,
        dataQuality, collectedBy: 'current-user', verifiedBy: verifiedBy || 'Pending', verificationStatus: 'Pending', notes: entry.notes,
        evidenceFiles: (evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || []).map(file => ({ name: file.name, type: file.type })),

      };
    });
    try {
      // Simulate API call
      let dataSubmissionResponse = await httpClient.post('ghg-accounting/collect-ghg-data',
        collections
      );
      if (dataSubmissionResponse.status === 201) {
        await Promise.all(
          Object.keys(evidenceByEntry).map(entryKey =>
            startEvidenceUpload(entryKey, dataSubmissionResponse.data['getUploadUrls'])
          )
        );
        toast.success(`Activity data has been ${status === 'draft' ? 'saved as draft' : 'submitted for review'}.`);
        navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
      }
    }
    catch (error) {
      toast.warning("There was an error submitting the data. Please try again.");
    }
    // localStorage.setItem(`scope3_data_collections_${template._id}_${selectedFrequency}_${selectedYear}`, JSON.stringify(collections));
    // toast({ title: status === 'draft' ? 'Draft Saved' : 'Data Submitted', description: `Activity data ${status === 'draft' ? 'saved as draft' : 'submitted for verification'}` });
    // navigate('/ghg-accounting');
  };

  const totalEmissions = dataEntries.reduce((sum, entry) => sum + calculateEmissions(entry.activityDataValue, template.emissionFactor || 0).total, 0);

  return (
    <UnifiedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-3xl font-bold">Scope 3 Data Collection</h1>
            <p className="text-muted-foreground mt-1">{template.sourceDescription} - {template.scope3Category}</p>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Reporting Period & Frequency</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FrequencySelector value={selectedFrequency} onChange={setSelectedFrequency} defaultFrequency={template.measurementFrequency} disabled={true} />
            <div className="space-y-2">
              <Label>Reporting Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[2026, 2025, 2024, 2023, 2022].map((startYear) => (
                      <SelectItem key={startYear} value={startYear.toString()}>
                        FY {startYear}–{(startYear + 1).toString().slice(-2)}
                      </SelectItem>
                    ))}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Data Entries</CardTitle>
            <CardDescription>Enter activity data for each {selectedFrequency.toLowerCase()} period ({dataEntries.length} periods)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataEntries.map((entry, index) => (
              <Card key={entry.id}>
                <CardContent className="pt-6 space-y-4">
                  <Badge variant="secondary">{entry.periodName}</Badge>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UnitSelector label="Activity Data" value={entry.activityDataValue} onChange={(v) => updateEntry(entry.id, 'activityDataValue', v)} baseUnit={template.activityDataUnit} selectedUnit={entry.selectedUnit || template.activityDataUnit} onUnitChange={(u) => updateEntry(entry.id, 'selectedUnit', u)} />
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Calculated Emissions</p>
                      <p className="text-xl font-bold">{calculateEmissions(entry.activityDataValue, template.emissionFactor || 0).total.toFixed(2)} t CO₂e</p>
                    </div>
                  </div>
                  <Textarea value={entry.notes} onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)} placeholder="Notes..." />
                  <div>
                    {/* <Label>Evidence (Optional)</Label> */}
                    <EvidenceFileUpload
                      value={evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || []}
                      onChange={(files) =>
                        setEvidenceByEntry(prev => ({ ...prev, [`${templateId}-${entry.periodName}-${selectedYear}`]: files }))
                      }
                      label="Evidence (Optional)"
                      description="Upload supporting documents"
                      maxFiles={3}
                      scope={`scope2-${templateId}-${entry.periodName}-${selectedYear}`}
                      uploadedFiles={entry.evidenceFiles}
                      templateId={templateId || undefined}
                      entryId={entry._id}
                      setReloadData={setReloadData}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="pt-6 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Emissions</p><p className="text-3xl font-bold">{totalEmissions.toFixed(2)} T CO₂e</p></div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleSave('draft')}><Save className="h-4 w-4 mr-2" />Save as Draft</Button>
              <Button onClick={() => handleSave('submitted')}><Send className="h-4 w-4 mr-2" />Submit for Verification</Button>
            </div>
          </CardContent>
        </Card>
        <UnitConverterDialog open={isConverterOpen} onOpenChange={setIsConverterOpen} initialFromUnit={template.activityDataUnit} />
        {/* File Upload Dialog */}
        <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>File Upload</DialogTitle>
              <DialogDescription>
                File Upload will be in progress.Don't close this dialog.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {Object.keys(uploadProgress).map((key) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">
                      {key.split("-").slice(-1)[0]}
                    </span>
                    <span>{uploadProgress[key]}%</span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded">
                    <div
                      className={`h-2 rounded transition-all ${uploadStatus[key] === "error"
                        ? "bg-destructive"
                        : uploadStatus[key] === "done"
                          ? "bg-green-600"
                          : "bg-primary"
                        }`}
                      style={{ width: `${uploadProgress[key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default DataCollectionForm;