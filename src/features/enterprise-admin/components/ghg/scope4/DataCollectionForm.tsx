import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send } from "lucide-react";
import UnitSelector from '@/components/ghg/UnitSelector';
import { UnitConverterDialog } from '@/components/ghg/UnitConverterDialog';
import FrequencySelector from '@/components/ghg/FrequencySelector';
import { GHGSourceTemplate, GHGDataCollection } from '@/types/ghg-source-template';
import { MeasurementFrequency, generatePeriodNames } from '@/types/ghg-data-collection';
import { DataQuality, calculateEmissions } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';

interface DataEntry {
  id: string;
  periodName: string;
  date: string;
  activityDataValue: number;
  notes: string;
  evidenceUrls?: string[];
  selectedUnit?: string;
}

export const DataCollectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { template, year } = location.state as { template: GHGSourceTemplate; month: string; year: number; };

  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear());
  const [selectedFrequency, setSelectedFrequency] = useState<MeasurementFrequency>(template.measurementFrequency);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [isConverterOpen, setIsConverterOpen] = useState(false);

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
  }, [selectedFrequency, template.id]);

  const updateEntry = (id: string, field: keyof DataEntry, value: any) => {
    setDataEntries(dataEntries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const handleSave = (status: 'draft' | 'submitted') => {
    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const emissions = calculateEmissions(entry.activityDataValue, template.emissionFactor || 0);
      return {
        id: entry.id,
        sourceTemplateId: template.id,
        reportingPeriod: `${selectedFrequency} ${selectedYear}`,
        reportingMonth: entry.periodName,
        reportingYear: selectedYear,
        collectedDate: entry.date,
        activityDataValue: entry.activityDataValue,
        emissionCO2: emissions.co2, emissionCH4: emissions.ch4, emissionN2O: emissions.n2o, totalEmission: emissions.total,
        dataQuality, collectedBy: 'current-user', verifiedBy: verifiedBy || 'Pending', verificationStatus: 'Pending', notes: entry.notes,
      };
    });
    localStorage.setItem(`scope4_data_collections_${template.id}_${selectedFrequency}_${selectedYear}`, JSON.stringify(collections));
    toast({ title: status === 'draft' ? 'Draft Saved' : 'Data Submitted', description: `Activity data ${status === 'draft' ? 'saved as draft' : 'submitted for verification'}` });
    navigate('/ghg-accounting');
  };

  const totalEmissions = dataEntries.reduce((sum, entry) => sum + calculateEmissions(entry.activityDataValue, template.emissionFactor || 0).total, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-3xl font-bold">Scope 4 Data Collection</h1>
          <p className="text-muted-foreground mt-1">{template.sourceDescription} - {template.avoidedEmissionType}</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Reporting Period & Frequency</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FrequencySelector value={selectedFrequency} onChange={setSelectedFrequency} defaultFrequency={template.measurementFrequency} />
          <div className="space-y-2">
            <Label>Reporting Year</Label>
            <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[2023, 2024, 2025, 2026].map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
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
          {dataEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6 space-y-4">
                <Badge variant="secondary">{entry.periodName}</Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UnitSelector label="Activity Data" value={entry.activityDataValue} onChange={(v) => updateEntry(entry.id, 'activityDataValue', v)} baseUnit={template.activityDataUnit} selectedUnit={entry.selectedUnit || template.activityDataUnit} onUnitChange={(u) => updateEntry(entry.id, 'selectedUnit', u)} />
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Avoided Emissions</p>
                    <p className="text-xl font-bold text-green-600">-{calculateEmissions(entry.activityDataValue, template.emissionFactor || 0).total.toFixed(2)} kg CO₂e</p>
                  </div>
                </div>
                <Textarea value={entry.notes} onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)} placeholder="Notes..." />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardContent className="pt-6 flex items-center justify-between">
          <div><p className="text-sm text-muted-foreground">Total Avoided Emissions</p><p className="text-3xl font-bold text-green-600">-{totalEmissions.toFixed(2)} kg CO₂e</p></div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSave('draft')}><Save className="h-4 w-4 mr-2" />Save as Draft</Button>
            <Button onClick={() => handleSave('submitted')}><Send className="h-4 w-4 mr-2" />Submit for Verification</Button>
          </div>
        </CardContent>
      </Card>
      <UnitConverterDialog open={isConverterOpen} onOpenChange={setIsConverterOpen} initialFromUnit={template.activityDataUnit} />
    </div>
  );
};

export default DataCollectionForm;