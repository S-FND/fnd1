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
import { ArrowLeft, Save, Send, Plus, Trash2, Upload, Download, Calculator } from "lucide-react";
import EvidenceFileUpload from '@/components/ghg/EvidenceFileUpload';
import UnitSelector from '@/components/ghg/UnitSelector';
import { UnitConverterDialog } from '@/components/ghg/UnitConverterDialog';
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
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const expectedEntries = getCollectionsForMonth(template.measurementFrequency);

  useEffect(() => {
    loadExistingCollections();
  }, [selectedMonth, selectedYear, template.id]);

  const loadExistingCollections = () => {
    const key = `scope3_data_collections_${template.id}_${selectedMonth}_${selectedYear}`;
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
    setDataEntries(dataEntries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, field: keyof DataEntry, value: any) => {
    setDataEntries(dataEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSave = (status: 'draft' | 'submitted') => {
    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const emissions = calculateEmissions(
        entry.activityDataValue,
        template.emissionFactor || 0
      );

      return {
        id: entry.id,
        sourceTemplateId: template.id,
        reportingPeriod: `${selectedMonth} ${selectedYear}`,
        reportingMonth: selectedMonth,
        reportingYear: selectedYear,
        collectedDate: entry.date,
        activityDataValue: entry.activityDataValue,
        emissionCO2: emissions.co2,
        emissionCH4: emissions.ch4,
        emissionN2O: emissions.n2o,
        totalEmission: emissions.total,
        dataQuality,
        collectedBy: 'current-user',
        verifiedBy: verifiedBy || 'Pending',
        verificationStatus: status === 'submitted' ? 'Pending' : 'Pending',
        notes: entry.notes,
      };
    });

    const key = `scope3_data_collections_${template.id}_${selectedMonth}_${selectedYear}`;
    localStorage.setItem(key, JSON.stringify(collections));

    toast({
      title: status === 'draft' ? 'Draft Saved' : 'Data Submitted',
      description: `Activity data ${status === 'draft' ? 'saved as draft' : 'submitted for verification'}`,
    });

    navigate('/ghg-accounting');
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const newEntries: DataEntry[] = jsonData.map((row) => ({
          id: uuidv4(),
          date: row.Date || new Date().toISOString().split('T')[0],
          activityDataValue: parseFloat(row['Activity Value']) || 0,
          notes: row.Notes || '',
          evidenceUrls: [],
          selectedUnit: template.activityDataUnit,
        }));

        setDataEntries(newEntries);
        setIsBulkUploadOpen(false);
        
        toast({
          title: "Data Imported",
          description: `${newEntries.length} entries imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse Excel file",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      { Date: '2024-01-01', 'Activity Value': 0, Notes: '' }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Entry');
    XLSX.writeFile(workbook, `${template.sourceDescription}_template.xlsx`);
  };

  const totalEmissions = dataEntries.reduce((sum, entry) => {
    const emissions = calculateEmissions(
      entry.activityDataValue,
      template.emissionFactor || 0
    );
    return sum + emissions.total;
  }, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Scope 3 Data Collection</h1>
            <p className="text-muted-foreground mt-1">
              {template.sourceDescription} - {template.scope3Category}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsConverterOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Unit Converter
          </Button>
          <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Template
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Period</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label>Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Data Entries</CardTitle>
              <CardDescription>
                Expected entries for {template.measurementFrequency}: {expectedEntries > 0 ? expectedEntries : 'Variable'}
              </CardDescription>
            </div>
            <Button onClick={addEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {dataEntries.map((entry, index) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Entry {index + 1}</CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                  />
                </div>

                <UnitSelector
                  label={`Activity Data (${template.sourceType})`}
                  value={entry.activityDataValue}
                  onChange={(value) => updateEntry(entry.id, 'activityDataValue', value)}
                  baseUnit={template.activityDataUnit}
                  selectedUnit={entry.selectedUnit || template.activityDataUnit}
                  onUnitChange={(unit) => updateEntry(entry.id, 'selectedUnit', unit)}
                  placeholder="Enter value"
                />

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={entry.notes}
                    onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                    placeholder="Add any relevant notes or context"
                  />
                </div>

                <div>
                  <Label>Evidence Files</Label>
                  <EvidenceFileUpload
                    value={entry.evidenceUrls || []}
                    onChange={(urls) => updateEntry(entry.id, 'evidenceUrls', urls)}
                    scope="scope3"
                  />
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Calculated Emissions</p>
                  <p className="text-2xl font-bold">
                    {calculateEmissions(
                      entry.activityDataValue,
                      template.emissionFactor || 0
                    ).total.toFixed(2)} kg CO₂e
                  </p>
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
          <div>
            <Label>Data Quality</Label>
            <Select value={dataQuality} onValueChange={(value: DataQuality) => setDataQuality(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High - Direct measurement</SelectItem>
                <SelectItem value="Medium">Medium - Calculated from reliable data</SelectItem>
                <SelectItem value="Low">Low - Estimated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Verified By</Label>
            <Select value={verifiedBy} onValueChange={setVerifiedBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select verifier" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Collection Notes</Label>
            <Textarea
              value={collectionNotes}
              onChange={(e) => setCollectionNotes(e.target.value)}
              placeholder="Add any general notes about this data collection period"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Emissions for Period</p>
              <p className="text-3xl font-bold">{totalEmissions.toFixed(2)} kg CO₂e</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {dataEntries.length} Entries
            </Badge>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => handleSave('draft')}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={() => handleSave('submitted')}>
              <Send className="h-4 w-4 mr-2" />
              Submit for Verification
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Data</DialogTitle>
            <DialogDescription>
              Upload an Excel file with columns: Date, Activity Value, Notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleBulkUpload}
            />
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              Download Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UnitConverterDialog
        open={isConverterOpen}
        onOpenChange={setIsConverterOpen}
        initialFromUnit={template.activityDataUnit}
      />
    </div>
  );
};

export default DataCollectionForm;