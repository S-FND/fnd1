import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, Trash2 } from "lucide-react";
import { GHGSourceTemplate, GHGDataCollection } from '@/types/ghg-source-template';
import { MeasurementFrequency, generatePeriodNames } from '@/types/ghg-data-collection';
import { DataQuality } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';
import FrequencySelector from '@/components/ghg/FrequencySelector';
import { httpClient } from '@/lib/httpClient';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { logger } from '@/hooks/logger';
import EvidenceFileUpload from '@/components/ghg/EvidenceFileUpload';
import { SignedUploadUrl, uploadFilesInParallel } from '@/utils/parallelUploader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DataEntry {
  _id?: string;
  id: string;
  periodName: string;
  date: string;
  activityDataValue: number;
  notes: string;
  evidenceUrls?: string[];
  evidenceFiles?: { url?: string; name?: string; key?: string; type?: string }[];
}

const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Patel' },
  { id: '4', name: 'Amit Singh' },
  { id: '5', name: 'Sanjana Reddy' },
];

export const Scope2DataCollectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { template } = location.state as { template: GHGSourceTemplate };

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
      // alert("Template ID: " + templateId);
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
  }, [templateId]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedFrequency, setSelectedFrequency] = useState<MeasurementFrequency>(template.measurementFrequency);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');

  const [evidenceByEntry, setEvidenceByEntry] = useState<Record<string, File[]>>({});
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<Record<string, number>>({});

  const [uploadStatus, setUploadStatus] =
    useState<Record<string, "uploading" | "done" | "error">>({});

  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    initializeEntries();
  }, [selectedFrequency, template._id]);

  // useEffect(() => {
  //   loadExistingCollections();
  // }, [selectedYear, template._id, selectedFrequency]);

  const loadExistingCollections = () => {
    const key = `scope2_data_collections_${template._id}_${selectedFrequency}_${selectedYear}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      const collections: GHGDataCollection[] = JSON.parse(stored);
      const entries: DataEntry[] = collections.map(c => ({
        id: c._id,
        periodName: c.reportingMonth || '',
        date: c.collectedDate,
        activityDataValue: c.activityDataValue,
        notes: c.notes,
      }));
      setDataEntries(entries);
    }
  };

  const initializeEntries = () => {
    const periods = generatePeriodNames(selectedFrequency);
    const entries: DataEntry[] = periods.map((periodName) => ({
      id: uuidv4(),
      periodName,
      date: new Date().toISOString().split('T')[0],
      activityDataValue: 0,
      notes: '',
      evidenceUrls: [],
    }));
    setDataEntries(entries);
  };

  const handleFrequencyChange = (frequency: MeasurementFrequency) => {
    setSelectedFrequency(frequency);
  };


  const updateEntry = (id: string, field: keyof DataEntry, value: any) => {
    setDataEntries(dataEntries.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const calculateTotalEmissions = () => {
    return dataEntries.reduce((sum, entry) => {
      const emissions = entry.activityDataValue * (template.emissionFactor || 0);
      return sum + emissions;
    }, 0);
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

  const handleSave = async (status: 'Draft' | 'Submitted') => {
    const reportingPeriod = `${selectedFrequency} ${selectedYear}`;

    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const calculatedEmissions = entry.activityDataValue * (template.emissionFactor || 0);
      let files = evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || [];

      return {
        // id: entry.id,
        _id: entry._id || null,
        sourceTemplateId: template._id,
        reportingPeriod,
        reportingMonth: entry.periodName,
        reportingYear: selectedYear,
        collectedDate: entry.date,
        activityDataValue: entry.activityDataValue,
        emissionCO2: calculatedEmissions,
        emissionCH4: 0,
        emissionN2O: 0,
        totalEmission: calculatedEmissions,
        dataQuality,
        collectedBy: 'Current User',
        verifiedBy,
        verificationStatus: 'Pending',
        notes: entry.notes,
        scope: 'Scope2',
        evidenceFiles: (evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || []).map(file => ({ name: file.name, type: file.type })),

      };
    });

    // const key = `scope2_data_collections_${template._id}_${selectedFrequency}_${selectedYear}`;
    // localStorage.setItem(key, JSON.stringify(collections));

    // const statusKey = `scope2_status_${template._id}_${selectedFrequency}_${selectedYear}`;
    // localStorage.setItem(statusKey, status);

    // toast({
    //   title: status === 'Draft' ? "Data Saved" : "Data Submitted",
    //   description: `Activity data has been ${status === 'Draft' ? 'saved as draft' : 'submitted for review'}.`,
    // });

    // navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
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
        toast({
          title: status === 'Draft' ? "Data Saved" : "Data Submitted",
          description: `Activity data has been ${status === 'Draft' ? 'saved as draft' : 'submitted for review'}.`,
        });
        navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
      }
    }
    catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting the data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <UnifiedSidebarLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Collect Activity Data</h1>
              <p className="text-muted-foreground">{template.sourceDescription}</p>
            </div>
          </div>
          <Badge variant="outline">{template.sourceType}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reporting Period & Frequency</CardTitle>
            <CardDescription>Select the frequency and year for data collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FrequencySelector
                value={selectedFrequency}
                onChange={handleFrequencyChange}
                defaultFrequency={template.measurementFrequency}
                disabled={true}
              />
              <div className="space-y-2">
                <Label>Reporting Year</Label>
                <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2022, 2023, 2024, 2025, 2026].map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Data Entries</CardTitle>
                <CardDescription>
                  Enter activity data for each {selectedFrequency.toLowerCase()} period ({dataEntries.length} periods)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataEntries.map((entry, index) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{entry.periodName}</Badge>
                      </div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={entry.date}
                        onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Activity Data ({template.activityDataUnit})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={entry.activityDataValue}
                        onChange={(e) => updateEntry(entry.id, 'activityDataValue', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Emissions (tCO₂e)</Label>
                      <Input
                        type="text"
                        value={(entry.activityDataValue * (template.emissionFactor || 0)).toFixed(2)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label>Notes</Label>
                      <Input
                        value={entry.notes}
                        onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                        placeholder="Optional notes..."
                      />
                    </div>
                  </div>
                  <div className="mt-4">
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

        <Card>
          <CardHeader>
            <CardTitle>Data Quality & Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Quality</Label>
                <Select value={dataQuality} onValueChange={(value: DataQuality) => setDataQuality(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Verified By (Optional)</Label>
                <Select value={verifiedBy} onValueChange={setVerifiedBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select verifier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TEAM_MEMBERS.filter(m => template.assignedVerifiers?.includes(m.id)).map(member => (
                      <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Collection Notes</Label>
              <Textarea
                value={collectionNotes}
                onChange={(e) => setCollectionNotes(e.target.value)}
                placeholder="Add any additional notes about this data collection..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave('Draft')}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button onClick={() => handleSave('Submitted')}>
            <Send className="mr-2 h-4 w-4" />
            Submit for Review
          </Button>
        </div>
      </div>
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
    </UnifiedSidebarLayout>
  );
};

export default Scope2DataCollectionForm;