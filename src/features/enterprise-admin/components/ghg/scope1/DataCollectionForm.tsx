import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, Plus, Trash2, Upload } from "lucide-react";
import EvidenceFileUpload from '@/components/ghg/EvidenceFileUpload';
import UnitSelector from '@/components/ghg/UnitSelector';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { GHGSourceTemplate, GHGDataCollection, getCollectionsForMonth } from '@/types/ghg-source-template';
import { DataQuality } from '@/types/scope1-ghg';
import { calculateEmissions } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';
import { months } from '@/data/ghg/calculator';

interface DataEntry {
  id: string;
  date: string;
  activityDataValue: number;
  notes: string;
  evidenceUrls?: string[];
  selectedUnit?: string;
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
  const { toast } = useToast();
  const { template, month, year } = location.state as { 
    template: GHGSourceTemplate; 
    month: string; 
    year: number;
  };

  const [selectedMonth, setSelectedMonth] = useState(month || new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear());
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const expectedEntries = getCollectionsForMonth(template.measurementFrequency);

  useEffect(() => {
    // Load existing data collections for this template and period
    loadExistingCollections();
  }, [selectedMonth, selectedYear, template.id]);

  const loadExistingCollections = () => {
    const key = `scope1_data_collections_${template.id}_${selectedMonth}_${selectedYear}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const collections: GHGDataCollection[] = JSON.parse(stored);
      const entries: DataEntry[] = collections.map(c => ({
        id: c.id,
        date: c.collectedDate,
        activityDataValue: c.activityDataValue,
        notes: c.notes,
      }));
      setDataEntries(entries);
    } else {
      // Initialize with empty entries based on frequency
      initializeEntries();
    }
  };

  const initializeEntries = () => {
    const entries: DataEntry[] = [];
    const count = expectedEntries > 0 ? expectedEntries : 1;
    
    for (let i = 0; i < count; i++) {
      entries.push({
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        activityDataValue: 0,
        notes: '',
        evidenceUrls: [],
        selectedUnit: template.activityDataUnit,
      });
    }
    setDataEntries(entries);
  };

  const addEntry = () => {
    setDataEntries([
      ...dataEntries,
      {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        activityDataValue: 0,
        notes: '',
        evidenceUrls: [],
        selectedUnit: template.activityDataUnit,
      },
    ]);
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

  const handleSaveDraft = () => {
    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor);
      
      return {
        id: entry.id,
        sourceTemplateId: template.id,
        reportingPeriod: `${selectedMonth} ${selectedYear}`,
        reportingMonth: selectedMonth,
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
      };
    });

    const key = `scope1_data_collections_${template.id}_${selectedMonth}_${selectedYear}`;
    localStorage.setItem(key, JSON.stringify(collections));

    // Also save status
    const statusKey = `scope1_status_${template.id}_${selectedMonth}_${selectedYear}`;
    localStorage.setItem(statusKey, 'Draft');

    toast({
      title: "Draft Saved",
      description: "Your data collection has been saved as draft.",
    });
  };

  const handleSubmitForReview = () => {
    if (dataEntries.some(e => e.activityDataValue === 0)) {
      toast({
        title: "Incomplete Data",
        description: "Please enter activity data for all entries before submitting.",
        variant: "destructive",
      });
      return;
    }

    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor);
      
      return {
        id: entry.id,
        sourceTemplateId: template.id,
        reportingPeriod: `${selectedMonth} ${selectedYear}`,
        reportingMonth: selectedMonth,
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
      };
    });

    const key = `scope1_data_collections_${template.id}_${selectedMonth}_${selectedYear}`;
    localStorage.setItem(key, JSON.stringify(collections));

    // Update status to Under Review
    const statusKey = `scope1_status_${template.id}_${selectedMonth}_${selectedYear}`;
    localStorage.setItem(statusKey, 'Under Review');

    toast({
      title: "Submitted for Review",
      description: "Your data has been submitted and is now under review.",
    });

    navigate('/ghg-accounting', { state: { activeTab: 'scope1' } });
  };

  const handleBulkUpload = (entries: DataEntry[]) => {
    setDataEntries([...dataEntries, ...entries]);
    setIsBulkUploadOpen(false);
    toast({
      title: "Bulk Upload Complete",
      description: `Successfully added ${entries.length} data entries.`,
    });
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
    XLSX.writeFile(wb, `${template.templateName}_DataCollection_Template.xlsx`);
  };

  const totalEmissions = calculateTotalEmissions();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Data Collection - Scope 1</h1>
          <p className="text-muted-foreground">
            Step 2: Collect activity data for {template.templateName}
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
              <p className="font-medium">{template.templateName}</p>
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Reporting Period</CardTitle>
              <CardDescription>Select the month and year for data collection</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2022, 2023, 2024, 2025].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {expectedEntries > 0 && (
            <p className="text-sm text-muted-foreground">
              Based on <strong>{template.measurementFrequency}</strong> frequency, 
              you need <strong>{expectedEntries}</strong> data point(s) for this month.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Activity Data Entries</CardTitle>
              <CardDescription>Enter activity data for each measurement period</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
              <Button onClick={addEntry} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Entry {index + 1}</h4>
                {dataEntries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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
                    value={entry.evidenceUrls || []}
                    onChange={(urls) => updateEntry(entry.id, 'evidenceUrls', urls)}
                    label="Evidence (Optional)"
                    description="Upload supporting documents"
                    maxFiles={3}
                    scope="scope1"
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
              placeholder="Any notes about this data collection..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

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
                  
                  const entries: DataEntry[] = jsonData.map(row => ({
                    id: uuidv4(),
                    date: row['Date'] || new Date().toISOString().split('T')[0],
                    activityDataValue: parseFloat(row['Activity Value']) || 0,
                    notes: row['Notes'] || '',
                    evidenceUrls: [],
                    selectedUnit: row['Unit'] || template.activityDataUnit,
                  }));
                  
                  handleBulkUpload(entries);
                } catch (error) {
                  toast({
                    title: "Upload Failed",
                    description: "Failed to parse the Excel file.",
                    variant: "destructive",
                  });
                }
              }}
              className="w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataCollectionForm;
