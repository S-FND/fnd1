
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, Plus, Trash2, Upload, Calculator } from "lucide-react";
import EvidenceFileUpload from '@/components/ghg/EvidenceFileUpload';
import UnitSelector from '@/components/ghg/UnitSelector';
import { UnitConverterDialog } from '@/components/ghg/UnitConverterDialog';
import FrequencySelector from '@/components/ghg/FrequencySelector';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { GHGSourceTemplate, GHGDataCollection } from '@/types/ghg-source-template';
import { MeasurementFrequency, generatePeriodNames } from '@/types/ghg-data-collection';
import { DataQuality } from '@/types/scope1-ghg';
import { calculateEmissions } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';
import { months } from '@/data/ghg/calculator';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { SignedUploadUrl, uploadFilesInParallel } from '@/utils/parallelUploader';
import { start } from 'repl';
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
  { id: '4', name: 'Amit Singh' },
  { id: '5', name: 'Sanjana Reddy' },
];

export const DataCollectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { toast } = useToast();
  const { template, month, year } = location.state as {
    template: GHGSourceTemplate;
    month: string;
    year: number;
  };

  const [selectedMonth, setSelectedMonth] = useState(month || new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear());
  const [selectedFrequency, setSelectedFrequency] = useState<MeasurementFrequency>(template.measurementFrequency);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  const [evidenceByEntry, setEvidenceByEntry] = useState<Record<string, File[]>>({});
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<Record<string, number>>({});

  const [uploadStatus, setUploadStatus] =
    useState<Record<string, "uploading" | "done" | "error">>({});

  const [teamMembers, setTeamMembers] = useState<{ _id: string; name: string }[]>([]);

  const [reloadData, setReloadData] = useState(false);

  const [bulkUploadErrors, setBulkUploadErrors] = useState<string[]>([]);


  const periodNames = generatePeriodNames(selectedFrequency);
  logger.log('periodnames', periodNames)

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

            // const entries: DataEntry[] = data.collectedData.map(c => ({
            //   _id: c._id,
            //   id: c._id,
            //   periodName: c.reportingMonth || '',
            //   date: c.collectedDate,
            //   activityDataValue: c.activityDataValue,
            //   evidenceFiles: c.evidenceFiles ? c.evidenceFiles.map(ef => ({ key: ef.key, name: ef.name, type: ef.type, url: ef.key })) : [],
            //   notes: c.notes,
            // }));

            const entries: DataEntry[] = periodNames.map((p) => {
              let collection = data.collectedData.find((c) => c.reportingMonth == p && c.reportingYear == selectedYear);
              if (collection) {
                return {
                  _id: collection._id,
                  id: collection._id,
                  periodName: collection.reportingMonth || '',
                  date: collection.collectedDate,
                  activityDataValue: collection.activityDataValue,
                  evidenceFiles: collection.evidenceFiles ? collection.evidenceFiles.map(ef => ({ key: ef.key, name: ef.name, type: ef.type, url: ef.key })) : [],
                  notes: collection.notes,
                }
              }
              else {
                return {
                  id: uuidv4(),
                  periodName: p,
                  date: new Date().toISOString().split('T')[0],
                  activityDataValue: 0,
                  notes: '',
                  evidenceUrls: []
                }
              }
            })
            // data.collectedData.map(c => ({
            //   _id: c._id,
            //   id: c._id,
            //   periodName: c.reportingMonth || '',
            //   date: c.collectedDate,
            //   activityDataValue: c.activityDataValue,
            //   evidenceFiles: c.evidenceFiles ? c.evidenceFiles.map(ef => ({ key: ef.key, name: ef.name, type: ef.type, url: ef.key })) : [],
            //   notes: c.notes,
            // }));
            setDataEntries(entries);
          }
        }
      });
    }
  }, [templateId, reloadData,selectedYear]);

  useEffect(() => {
    initializeEntries();
    setVerifiedBy(template.assignedDataCollectors[0])
  }, [selectedFrequency, template._id]);

  // useEffect(() => {
  //   loadExistingCollections();
  // }, [selectedMonth, selectedYear, template._id, selectedFrequency]);

  const loadExistingCollections = () => {
    const key = `scope1_data_collections_${template._id}_${selectedFrequency}_${selectedYear}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      const collections: GHGDataCollection[] = JSON.parse(stored);
      const entries: DataEntry[] = collections.map(c => ({
        id: c._id,
        periodName: c.reportingMonth || '',
        date: c.collectedDate,
        activityDataValue: c.activityDataValue,
        notes: c.notes,
        selectedUnit: template.activityDataUnit,
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
      selectedUnit: template.activityDataUnit,
    }));
    setDataEntries(entries);
  };

  const handleFrequencyChange = (frequency: MeasurementFrequency) => {
    setSelectedFrequency(frequency);
  };

  const removeEntry = (id: string) => {
    setDataEntries(dataEntries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof DataEntry, value: any) => {
    setDataEntries(dataEntries.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const calculateTotalEmissions = () => {
    const totalActivity = dataEntries.reduce((sum, entry) => sum + entry.activityDataValue, 0);
    return calculateEmissions(totalActivity, template.emissionFactor);
  };


  //
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
  // 




  const handleSubmitForReview = async (type = null) => {
    // if (dataEntries.some(e => e.activityDataValue === 0)) {
    //   toast({
    //     title: "Incomplete Data",
    //     description: "Please enter activity data for all entries before submitting.",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    // debugger;
    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor);
      console.log("Evidence for entry:", entry.id, evidenceByEntry, `${templateId}-${entry.periodName}-${selectedYear}`);
      let files = evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || [];

      return {
        _id: entry._id || null,
        sourceTemplateId: template._id,
        reportingPeriod: `${selectedFrequency} ${selectedYear}`,
        reportingMonth: entry.periodName,
        reportingYear: selectedYear,
        activityDataValue: entry.activityDataValue,
        emissionCO2: emissions.co2,
        emissionCH4: emissions.ch4,
        emissionN2O: emissions.n2o,
        totalEmission: emissions.total,
        dataQuality,
        collectedDate: entry.date,
        collectedBy: 'Current User',
        verifiedBy,
        verificationStatus: 'Pending',
        notes: entry.notes,
        scope: 'Scope1',
        evidenceFiles: (evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || []).map(file => ({ name: file.name, type: file.type })),
      };
    });

    // const key = `scope1_data_collections_${template._id}_${selectedFrequency}_${selectedYear}`;
    // localStorage.setItem(key, JSON.stringify(collections));

    // const statusKey = `scope1_status_${template._id}_${selectedFrequency}_${selectedYear}`;
    // localStorage.setItem(statusKey, 'Under Review');

    // toast({
    //   title: "Submitted for Review",
    //   description: "Your data has been submitted and is now under review.",
    // });

    // navigate('/ghg-accounting', { state: { activeTab: 'scope1' } });
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
        setIsBulkUploadOpen(false);
        toast.success(`Activity data has been ${type === 'Draft' ? 'saved as draft' : 'submitted for review'}.`, );
        navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
      }
    }
    catch (error) {
      toast.warning("There was an error submitting the data. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    handleSubmitForReview('draft')
    // const collections: GHGDataCollection[] = dataEntries.map(entry => {
    //   const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor);

    //   return {
    //     _id: entry._id || null,
    //     sourceTemplateId: template._id,
    //     reportingPeriod: `${selectedFrequency} ${selectedYear}`,
    //     reportingMonth: entry.periodName,
    //     reportingYear: selectedYear,
    //     activityDataValue: entry.activityDataValue,
    //     emissionCO2: emissions.co2,
    //     emissionCH4: emissions.ch4,
    //     emissionN2O: emissions.n2o,
    //     totalEmission: emissions.total,
    //     dataQuality,
    //     collectedDate: entry.date,
    //     collectedBy: 'Current User',
    //     verifiedBy,
    //     verificationStatus: 'Pending',
    //     notes: entry.notes,
    //   };
    // });

    // const key = `scope1_data_collections_${template._id}_${selectedFrequency}_${selectedYear}`;
    // localStorage.setItem(key, JSON.stringify(collections));

    // const statusKey = `scope1_status_${template._id}_${selectedFrequency}_${selectedYear}`;
    // localStorage.setItem(statusKey, 'Draft');

    // toast({
    //   title: "Draft Saved",
    //   description: "Your data collection has been saved as draft.",
    // });
  };

  const handleBulkUpload = (entries: DataEntry[]) => {
    debugger;
    dataEntries.map(de => {
      const duplicate = entries.find(e => e.periodName === de.periodName);
      if (duplicate) {
        de.activityDataValue = duplicate.activityDataValue;
        de.notes = duplicate.notes;
      }
      return de;
    });
    setDataEntries(dataEntries.map(de => {
      const duplicate = entries.find(e => e.periodName === de.periodName);
      if (duplicate) {
        de.activityDataValue = duplicate.activityDataValue;
        de.notes = duplicate.notes;
      }
      return de;
    }));
    handleSubmitForReview();
    // setIsBulkUploadOpen(false);
    // toast({
    //   title: "Bulk Upload Complete",
    //   description: `Successfully added ${entries.length} data entries.`,
    // });
  };

  const downloadBulkTemplate = () => {
    const templateData = [{
      'Date': new Date().toISOString().split('T')[0],
      'Activity Value': '',
      'Unit': template.activityDataUnit,
      'Notes': '',
    }];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Collection');
    XLSX.writeFile(wb, `${template.sourceDescription}_DataCollection_Template.xlsx`);
  };

  const totalEmissions = calculateTotalEmissions();

  const getTeamList = async () => {
    try {
      let teamList = await httpClient.get('subuser');
      console.log("teamList", teamList);
      console.log("teamList.data['data']", teamList.data['data']);
      if (teamList && teamList.status === 200) {
        // setTeamMembers(teamList.data);
        if (teamList.data && teamList.data['data'] && Array.isArray(teamList.data['data'])) {
          console.log("teamList.data['data']['subusers']", teamList.data['data'][0]['subuser']);
          setTeamMembers(teamList.data['data'][0]['subuser']);
        }

      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.warning("Could not load team members. Please try again.");
    }
  }

  useEffect(() => {
    getTeamList();
    // toast.success( "Your carbon reduction goal has been created");
  }, [])

  // useEffect(() => {
  //   logger.debug("Data Entries Updated:", evidenceByEntry);
  // }, [evidenceByEntry]);
  const totalEmissionsKg = dataEntries.reduce((sum, entry) => {
    const rowEmissionKg =
      entry.activityDataValue * (template.emissionFactor || 0);
  
    return sum + rowEmissionKg;
  }, 0);
  const totalEmissionsTonnes = totalEmissionsKg / 1000;
  return (
    <UnifiedSidebarLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Data Collection - Scope 1</h1>
            <p className="text-muted-foreground">
              Step 2: Collect activity data for {template.sourceDescription}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Source Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Source Name</p>
                <p className="font-medium">{template.sourceDescription}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Facility</p>
                <p className="font-medium">{template.facilityName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Source Type</p>
                <Badge>{template.sourceType}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emission Factor</p>
                <p className="font-medium">{template.emissionFactor} {template.emissionFactorUnit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activity Unit</p>
                <p className="font-medium">{template.activityDataUnit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Frequency</p>
                <Badge variant="outline">{template.measurementFrequency}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {[2026, 2025, 2024, 2023, 2022].map((startYear) => (
                    <SelectItem key={startYear} value={startYear.toString()}>
                      FY {startYear}–{(startYear + 1).toString().slice(-2)}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activity Data Entries</CardTitle>
                <CardDescription>
                  Enter activity data for each {selectedFrequency.toLowerCase()} period ({dataEntries.length} periods)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsConverterOpen(true)} variant="outline" size="sm">
                  <Calculator className="mr-2 h-4 w-4" />
                  Unit Converter
                </Button>
                <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Upload
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataEntries.map((entry, index) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm">
                      {entry.periodName}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Period {index + 1} of {dataEntries.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <UnitSelector
                      label={`Activity Data`}
                      value={entry.activityDataValue || 0}
                      onChange={(value) => updateEntry(entry.id, 'activityDataValue', value)}
                      baseUnit={template.activityDataUnit}
                      selectedUnit={entry.selectedUnit || template.activityDataUnit}
                      onUnitChange={(unit) => updateEntry(entry.id, 'selectedUnit', unit)}
                      placeholder="Enter value..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Calculated Emissions</Label>
                    <Input
                      value={`${(entry.activityDataValue * template.emissionFactor / 1000).toFixed(3)} tCO₂e`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={entry.notes}
                      onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                      placeholder="Any notes for this entry..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <EvidenceFileUpload
                      value={evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || []}
                      onChange={(files) =>
                        setEvidenceByEntry(prev => ({ ...prev, [`${templateId}-${entry.periodName}-${selectedYear}`]: files }))
                      }
                      label="Evidence (Optional)"
                      description="Upload supporting documents"
                      maxFiles={3}
                      scope={`scope1-${templateId}-${entry.periodName}-${selectedYear}`}
                      uploadedFiles={entry.evidenceFiles}
                      templateId={templateId || undefined}
                      entryId={entry._id}
                      setReloadData={setReloadData}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Activity Data</p>
                <p className="text-2xl font-bold">
                  {dataEntries.reduce((sum, e) => sum + e.activityDataValue, 0).toFixed(2)} {template.activityDataUnit}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">CO₂ Emissions</p>
                <p className="text-2xl font-bold">{(totalEmissions.co2 / 1000).toFixed(3)} t</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">CH₄ Emissions</p>
                <p className="text-2xl font-bold">{(totalEmissions.ch4 / 1000).toFixed(3)} t</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Emissions</p>
                <p className="text-2xl font-bold">{totalEmissions.total.toFixed(3)} tCO₂e</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality & Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Quality</Label>
                <Select value={dataQuality} onValueChange={(val) => setDataQuality(val as DataQuality)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - Primary data, verified</SelectItem>
                    <SelectItem value="Medium">Medium - Secondary data, estimated</SelectItem>
                    <SelectItem value="Low">Low - Extrapolated, proxy data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Verified By (Optional)</Label>
                <Select value={verifiedBy} onValueChange={setVerifiedBy} disabled={true}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select verifier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => <SelectItem key={member._id} value={member._id}>{member.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Collection Notes</Label>
              <Textarea
                value={collectionNotes}
                onChange={(e) => setCollectionNotes(e.target.value)}
                placeholder="Any notes about this data collection..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Emissions</p>
              <p className="text-3xl font-bold">
                {totalEmissionsTonnes.toFixed(2)} T CO₂e
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>

              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>

              <Button onClick={handleSubmitForReview}>
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bulk Upload Data</DialogTitle>
              <DialogDescription>
                Download the template, fill it with your data, and upload it back.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* {JSON.stringify(dataEntries)} */}
              {periodNames.filter(p => !dataEntries.some(
                e => e.periodName === p && e.activityDataValue > 0
              )).length > 0 && (
                  <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <p className="font-medium mb-2">
                      ⚠️ Some periods are missing data
                    </p>

                    <p className="mb-2">
                      Periods marked in <span className="font-semibold text-red-600">red</span> above
                      are not filled. Please provide data for the following period(s):
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {periodNames.filter(p => dataEntries.some(
                        e => e.periodName === p && e.activityDataValue > 0
                      )).map(p => (
                        <span
                          key={p}
                          className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-green-700"
                          style={{ color: 'white' }}
                        >
                          {p}
                        </span>
                      ))}

                      {periodNames.filter(p => !dataEntries.some(
                        e => e.periodName === p && e.activityDataValue > 0
                      )).map(p => (
                        <span
                          key={p}
                          className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              <Button onClick={downloadBulkTemplate} variant="outline" className="w-full">
                Download Template
              </Button>

              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const data = await file.arrayBuffer();
                    const workbook = XLSX.read(data);
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
                    let errorList: string[] = [];

                    jsonData.forEach((row, idx) => {
                      if (!row['Activity Value'] || isNaN(parseFloat(row['Activity Value']))) {
                        errorList.push(`Row ${idx + 2}: Invalid or missing 'Activity Value'`);
                      }
                      if (!row['Period']) {
                        errorList.push(`Row ${idx + 2}: Missing 'Period' value`);
                      }
                      if (row['Period'] && !periodNames.includes(row['Period'])) {
                        errorList.push(`Row ${idx + 2}: 'Period' value '${row['Period']}' is not valid for the selected frequency.`);
                      }
                      if (row['Period'] && dataEntries.some(
                        e => e.periodName === row['Period'] && e.activityDataValue > 0
                      )) {
                        errorList.push(`Row ${idx + 2}: Data for period '${row['Period']}' already exists.`);
                      }
                    });
                    if (errorList.length > 0) {
                      setBulkUploadErrors(errorList);
                      return;
                    }

                    // ✅ Clear errors if valid
                    setBulkUploadErrors([]);


                    const entries: DataEntry[] = jsonData.map((row, idx) => ({
                      id: uuidv4(),
                      periodName: row['Period'] || `Entry ${idx + 1}`,
                      date: row['Date'] || new Date().toISOString().split('T')[0],
                      activityDataValue: parseFloat(row['Activity Value']) || 0,
                      notes: row['Notes'] || '',
                      evidenceUrls: [],
                      selectedUnit: row['Unit'] || template.activityDataUnit,
                      reportingYear: selectedYear,
                    }));

                    handleBulkUpload(entries);
                  } catch (error) {
                    toast.warning("Failed to parse the Excel file.");
                  }
                }}
                className="w-full"
              />

            </div>
            {bulkUploadErrors.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <p className="font-medium mb-2">
                  ❌ Upload Validation Errors
                </p>

                <ul className="list-disc pl-5 space-y-1">
                  {bulkUploadErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>

                <p className="mt-2 text-xs text-red-600">
                  Please fix the above errors and re-upload the file.
                </p>
              </div>
            )}

          </DialogContent>
        </Dialog>

        <UnitConverterDialog
          open={isConverterOpen}
          onOpenChange={setIsConverterOpen}
          initialFromUnit={template.activityDataUnit}
        />

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
