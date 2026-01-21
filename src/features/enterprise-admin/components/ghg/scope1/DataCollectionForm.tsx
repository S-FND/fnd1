  import React, { useState, useEffect, useMemo, useCallback } from 'react';
  import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";
  import { Badge } from "@/components/ui/badge";
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
  import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
  import { httpClient } from '@/lib/httpClient';
  import { logger } from '@/hooks/logger';
  import { SignedUploadUrl, uploadFilesInParallel } from '@/utils/parallelUploader';
  import { toast } from 'sonner';

  // Extended VerificationStatus to include 'Draft'
  type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'Draft';

  // Extended GHGDataCollection type to include 'Draft' status
  interface ExtendedGHGDataCollection extends Omit<GHGDataCollection, 'verificationStatus' | 'verificationComments'> {
    verificationStatus: VerificationStatus;
    verificationComments?: string;
  }

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
    verificationStatus?: VerificationStatus;
    verificationComments?: string;
  }

  export const verificationStatusStyles: Record<VerificationStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    Verified: 'bg-green-100 text-green-800 border border-green-300',
    Rejected: 'bg-red-100 text-red-800 border border-red-300',
    Draft: 'bg-gray-100 text-gray-800 border border-gray-300',
  };

  export const DataCollectionForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { template, month, year } = location.state as {
      template: GHGSourceTemplate;
      month: string;
      year: string;
    };

    const getCurrentFinancialYear = (): string => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0 = Jan

      // Financial year starts in April (month >= 3)
      const startYear = month >= 3 ? year : year - 1;
      const endYear = startYear + 1;

      return `${startYear}-${endYear}`;
    };

    const [selectedMonth, setSelectedMonth] = useState(month || new Date().toLocaleString('en-US', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState<string>(getCurrentFinancialYear());
    const [selectedFrequency, setSelectedFrequency] = useState<MeasurementFrequency>(template.measurementFrequency);
    const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
    const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
    const [verifiedBy, setVerifiedBy] = useState<string>('');
    const [collectionNotes, setCollectionNotes] = useState('');
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [isConverterOpen, setIsConverterOpen] = useState(false);
    const [evidenceByEntry, setEvidenceByEntry] = useState<Record<string, File[]>>({});
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [uploadStatus, setUploadStatus] = useState<Record<string, "uploading" | "done" | "error">>({});
    const [teamMembers, setTeamMembers] = useState<{ _id: string; name: string }[]>([]);
    const [reloadData, setReloadData] = useState(false);
    const [bulkUploadErrors, setBulkUploadErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const [params] = useSearchParams();
    const templateId = params.get('templateId');

    // Memoize period names to prevent unnecessary recalculations
    const periodNames = useMemo(() => 
      generatePeriodNames(selectedFrequency), 
      [selectedFrequency]
    );

    const getTemplateData = async (templateId: string) => {
      try {
        let response = await httpClient.get(`ghg-accounting/${templateId}/ghg-data-collection?financialYear=${selectedYear}`);
        logger.debug("Template data response:", response);
        if (response.status === 200) {
          return response.data as { collectedData: ExtendedGHGDataCollection[], templateDetails: GHGSourceTemplate };
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
        toast.warning("Failed to fetch template data");
      }
      return null;
    };

    // Initialize entries function - memoized
    const initializeEntries = useCallback(() => {
      const periods = generatePeriodNames(selectedFrequency);
      const entries: DataEntry[] = periods.map((periodName) => ({
        id: uuidv4(),
        periodName,
        date: new Date().toISOString().split('T')[0],
        activityDataValue: 0,
        notes: '',
        evidenceUrls: [],
        selectedUnit: template.activityDataUnit,
        verificationStatus: 'Pending',
      }));
      setDataEntries(entries);
      setIsInitialized(true);
    }, [selectedFrequency, template.activityDataUnit]);

    useEffect(() => {
      setIsInitialized(false);
    }, [selectedYear]);

    // Main data fetching effect - FIXED VERSION
    useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
        if (!templateId) {
          // If no templateId, initialize empty entries
          if (isMounted && !isInitialized) {
            initializeEntries();
          }
          return;
        }

        try {
          setIsLoading(true);
          const data = await getTemplateData(templateId);
          
          if (!isMounted) return;
          
          if (data) {
            logger.debug("Fetched template data:", data);
            
            // Set team members from template verifiers
            if (data.templateDetails?.verifiers && data.templateDetails.verifiers.length > 0) {
              const members = data.templateDetails.verifiers.map((verifier: any) => ({
                _id: verifier._id,
                name: verifier.name
              }));
              if (isMounted) {
                setTeamMembers(members);
              }
            }
            
            // Set frequency from template
            if (data.templateDetails?.measurementFrequency) {
              setSelectedFrequency(data.templateDetails.measurementFrequency);
            }
            if (data.collectedData[0]?.dataQuality && !isInitialized) {
              setDataQuality(data.collectedData[0].dataQuality as DataQuality);
            }
            if (data.collectedData[0]?.collectionNotes && !isInitialized) {
              setCollectionNotes(data.collectedData[0].collectionNotes);
            }
            
            
            if (data.collectedData && data.collectedData.length > 0) {
              const entries: DataEntry[] = periodNames.map(p => {
                const collection = data.collectedData.find(
                  c => c.reportingMonth === p && c.reportingYear === selectedYear
                );
                
                if (collection) {
                  return {
                    _id: collection._id,
                    id: collection._id || uuidv4(),
                    periodName: p,
                    date: collection.collectedDate,
                    activityDataValue: collection.activityDataValue,
                    notes: collection.notes || '',
                    evidenceFiles: collection.evidenceFiles?.map(ef => ({
                      key: ef.key,
                      name: ef.name,
                      type: ef.type,
                      url: ef.key
                    })) || [],
                    verificationStatus: collection.verificationStatus || 'Pending',
                    selectedUnit: template.activityDataUnit,
                    verificationComments: collection.verificationComments,
                  };
                }

                
                // Empty row for missing month
                return {
                  id: uuidv4(),
                  periodName: p,
                  date: new Date().toISOString().split('T')[0],
                  activityDataValue: 0,
                  notes: '',
                  verificationStatus: 'Pending',
                  selectedUnit: template.activityDataUnit
                };
              });
              
              if (isMounted) {
                setDataEntries(entries);
                setIsInitialized(true);
              }
            } else {
              if (!data.collectedData || data.collectedData.length === 0) {
                initializeEntries();
                return;
              }
              // Only initialize empty entries when NO data exists
              if (isMounted && !isInitialized) {
                initializeEntries();
              }
            }
          } else {
            // If fetch failed or returned null
            if (isMounted && !isInitialized) {
              initializeEntries();
            }
          }
        } catch (error) {
          console.error("Error in fetchData:", error);
          if (isMounted && !isInitialized) {
            initializeEntries();
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [templateId, reloadData, selectedYear]); // Removed problematic dependencies

    // Initialize verifiedBy when teamMembers are set
    useEffect(() => {
      if (teamMembers.length > 0 && !verifiedBy) {
        setVerifiedBy(teamMembers[0]._id);
      }
    }, [teamMembers, verifiedBy]);

    // Handle frequency changes
    useEffect(() => {
      if (isInitialized) {
        // Only reinitialize if frequency changes and we have data
        initializeEntries();
      }
    }, [selectedFrequency]); // Only run when frequency changes

    const handleFrequencyChange = (frequency: MeasurementFrequency) => {
      setSelectedFrequency(frequency);
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
    };

    const handleSubmitForReview = async (type: string | null = null) => {
      // Check if any entry has activity data
      const hasActivityData = dataEntries.some(e => e.activityDataValue > 0);
      if (!hasActivityData) {
        toast.warning("Please enter activity data for at least one entry before submitting.");
        return;
      }

      // Determine verification status
      const verificationStatus: VerificationStatus = type === 'draft' ? 'Draft' : 'Pending';

      const collections: ExtendedGHGDataCollection[] = dataEntries
        .filter(entry => entry.activityDataValue > 0) // Only include entries with data
        .map(entry => {
          const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor);
          let files = evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || [];

          return {
            _id: entry._id || undefined,
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
            collectionNotes,
            collectedDate: entry.date,
            collectedBy: 'Current User',
            verifiedBy: verifiedBy || undefined,
            verificationStatus: verificationStatus,
            notes: entry.notes,
            scope: 'Scope1',
            evidenceFiles: files.map(file => ({ 
              name: file.name, 
              type: file.type 
            })),
          };
        });

      try {
        let dataSubmissionResponse = await httpClient.post(
          'ghg-accounting/collect-ghg-data',
          collections
        );
        
        if (dataSubmissionResponse.status === 201) {
          // Upload evidence files if any
          if (Object.keys(evidenceByEntry).length > 0 && dataSubmissionResponse.data['getUploadUrls']) {
            await Promise.all(
              Object.keys(evidenceByEntry).map(entryKey =>
                startEvidenceUpload(entryKey, dataSubmissionResponse.data['getUploadUrls'])
              )
            );
          }
          
          setIsBulkUploadOpen(false);
          toast.success(`Activity data has been ${type === 'draft' ? 'saved as draft' : 'submitted for review'}.`);
          
          // Store active tab and navigate back
          sessionStorage.setItem('activeTab', 'scope1');
          navigate(-1);
        }
      } catch (error: any) {
        console.error("Error submitting data:", error);
        toast.warning(error.response?.data?.message || "There was an error submitting the data. Please try again.");
      }
    };

    const handleSaveDraft = () => {
      handleSubmitForReview('draft');
    };

    const handleBulkUpload = async (entries: DataEntry[]) => {
      const updatedEntries = dataEntries.map(de => {
        const duplicate = entries.find(e => e.periodName === de.periodName);
        if (duplicate) {
          return {
            ...de,
            activityDataValue: duplicate.activityDataValue,
            notes: duplicate.notes,
            date: duplicate.date || de.date
          };
        }
        return de;
      });
      
      setDataEntries(updatedEntries);
      setIsBulkUploadOpen(false);
      await saveBulkUpload(updatedEntries);
      toast.success("Data imported successfully. Please review and submit.");
    };

    const saveBulkUpload = async (entries: DataEntry[]) => {
      try {
        const hasData = entries.some(e => e.activityDataValue > 0);
        if (!hasData) {
          toast.warning("No data to save");
          return;
        }
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        const collectedBy = user?.name || 'Current User';
        const payload: ExtendedGHGDataCollection[] = entries
          .filter(e => e.activityDataValue > 0)
          .map(entry => {
            const emissions = calculateEmissions(
              entry.activityDataValue,
              template.emissionFactor
            );
    
            const files =
              evidenceByEntry[
                `${templateId}-${entry.periodName}-${selectedYear}`
              ] || [];
    
            return {
              _id: entry._id || undefined,
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
              collectionNotes,
              collectedDate: entry.date,
              collectedBy: collectedBy,
              verifiedBy: verifiedBy || undefined,
              verificationStatus: "Pending", // 🔥 ALWAYS Pending
              notes: entry.notes,
              scope: "Scope2",
              evidenceFiles: files.map(f => ({
                name: f.name,
                type: f.type
              }))
            };
          });
    
        await httpClient.post(
          "ghg-accounting/collect-ghg-data",
          payload
        );
        navigate(-1);
        toast.success("Bulk upload saved successfully");
      } catch (error: any) {
        console.error("Bulk save error:", error);
        toast.error(
          error.response?.data?.message || "Failed to save bulk data"
        );
      }
    };
    const downloadBulkTemplate = () => {
      const templateData = periodNames.map(periodName => {
        const existingEntry = dataEntries.find(e => e.periodName === periodName);
        return {
          'Period': periodName,
          'Date': existingEntry?.date || new Date().toISOString().split('T')[0],
          'Activity Value': existingEntry?.activityDataValue || '',
          'Unit': template.activityDataUnit,
          'Notes': existingEntry?.notes || '',
        };
      });

      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Collection');
      XLSX.writeFile(wb, `${template.sourceDescription}_DataCollection_Template.xlsx`);
    };

    const totalEmissions = calculateTotalEmissions();
    const totalEmissionsKg = dataEntries.reduce((sum, entry) => {
      const rowEmissionKg = entry.activityDataValue * (template.emissionFactor || 0);
      return sum + rowEmissionKg;
    }, 0);
    const totalEmissionsTonnes = totalEmissionsKg / 1000;

    // Get current verifier name for display
    const currentVerifierName = useMemo(() => {
      if (!verifiedBy) return "";
      const verifier = teamMembers.find(m => m._id === verifiedBy);
      return verifier ? verifier.name : "";
    }, [verifiedBy, teamMembers]);

    if (isLoading && !isInitialized) {
      return (
        <UnifiedSidebarLayout>
          <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading data collection form...</p>
              </div>
            </div>
          </div>
        </UnifiedSidebarLayout>
      );
    }

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
                  <p className="text-sm text-muted-foreground">Emission Source Description</p>
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
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Financial Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => {
                        const start = new Date().getFullYear() - i;
                        const fy = `${start}-${start + 1}`;
                        return (
                          <SelectItem key={fy} value={fy}>
                            FY {start}-{(start + 1).toString().slice(-2)}
                          </SelectItem>
                        );
                      })}
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
                      {entry.verificationStatus && (
                        <Badge
                          variant="secondary"
                          className={`text-sm ${verificationStatusStyles[entry.verificationStatus] || ''}`}
                        >
                          {entry.verificationStatus}
                        </Badge>
                      )}
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
                      {entry.verificationComments && (
                          <div className='text-left'> 
                            <Badge variant="secondary" className="text-600 border-600">Verifier comment</Badge>
                            &nbsp;
                            <span
                              className=" cursor-help text-sm"
                              title={entry.verificationComments} // 👈 view full on hover
                            >
                              {entry.verificationComments}
                            </span>

                            {entry.verificationComments.length > 30 && (
                              <span className="text-xs text-muted-foreground">View more</span>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="space-y-2">
                      <EvidenceFileUpload
                        value={evidenceByEntry[`${templateId}-${entry.periodName}-${selectedYear}`] || []}
                        onChange={(files) =>
                          setEvidenceByEntry(prev => ({ 
                            ...prev, 
                            [`${templateId}-${entry.periodName}-${selectedYear}`]: files 
                          }))
                        }
                        label="Evidence (Optional)"
                        description="Upload supporting documents"
                        maxFiles={5}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  <p className="text-sm text-muted-foreground">N₂O Emissions</p>
                  <p className="text-2xl font-bold">{(totalEmissions.n2o / 1000).toFixed(3)} t</p>
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
                      <SelectValue placeholder="Select data quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High - Primary data, verified</SelectItem>
                      <SelectItem value="Medium">Medium - Secondary data, estimated</SelectItem>
                      <SelectItem value="Low">Low - Extrapolated, proxy data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Verified By </Label>
                  <Select 
                    value={verifiedBy || "placeholder"} 
                    onValueChange={(value) => {
                      if (value !== "placeholder") {
                        setVerifiedBy(value);
                      }
                    }}
                    disabled={teamMembers.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {teamMembers.length === 0 
                          ? "No verifiers available" 
                          : currentVerifierName || "Select verifier..."
                        }
                      </SelectValue>
                    </SelectTrigger>
                    {teamMembers.length > 0 && (
                      <SelectContent>
                        <SelectItem value="placeholder" disabled className="text-muted-foreground">
                          Select verifier...
                        </SelectItem>
                        {teamMembers.map((member) => 
                          <SelectItem key={member._id} value={member._id}>{member.name}</SelectItem>
                        )}
                      </SelectContent>
                    )}
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

                <Button onClick={() => handleSubmitForReview()}>
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
                        if (row['Activity Value'] === undefined || row['Activity Value'] === '') {
                          errorList.push(`Row ${idx + 2}: Missing 'Activity Value'`);
                        } else if (isNaN(parseFloat(row['Activity Value']))) {
                          errorList.push(`Row ${idx + 2}: Invalid 'Activity Value' (must be a number)`);
                        }
                        if (!row['Period']) {
                          errorList.push(`Row ${idx + 2}: Missing 'Period' value`);
                        }
                        if (row['Period'] && !periodNames.includes(row['Period'])) {
                          errorList.push(`Row ${idx + 2}: 'Period' value '${row['Period']}' is not valid for the selected frequency.`);
                        }
                      });
                      
                      if (errorList.length > 0) {
                        setBulkUploadErrors(errorList);
                        return;
                      }

                      // Clear errors if valid
                      setBulkUploadErrors([]);

                      const entries: DataEntry[] = jsonData.map((row, idx) => ({
                        id: uuidv4(),
                        periodName: row['Period'] || `Entry ${idx + 1}`,
                        date: row['Date'] || new Date().toISOString().split('T')[0],
                        activityDataValue: parseFloat(row['Activity Value']) || 0,
                        notes: row['Notes'] || '',
                        selectedUnit: row['Unit'] || template.activityDataUnit,
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
                  File Upload will be in progress. Don't close this dialog.
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