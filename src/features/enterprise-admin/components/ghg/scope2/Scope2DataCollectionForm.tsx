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
import { ArrowLeft, Save, Send, Trash2 } from "lucide-react";
import { GHGSourceTemplate, GHGDataCollection } from '@/types/ghg-source-template';
import { MeasurementFrequency, generatePeriodNames } from '@/types/ghg-data-collection';
import { DataQuality } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';
import FrequencySelector from '@/components/ghg/FrequencySelector';

interface DataEntry {
  id: string;
  periodName: string;
  date: string;
  activityDataValue: number;
  notes: string;
  evidenceUrls?: string[];
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

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedFrequency, setSelectedFrequency] = useState<MeasurementFrequency>(template.measurementFrequency);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');

  useEffect(() => {
    initializeEntries();
  }, [selectedFrequency, template.id]);

  useEffect(() => {
    loadExistingCollections();
  }, [selectedYear, template.id, selectedFrequency]);

  const loadExistingCollections = () => {
    const key = `scope2_data_collections_${template.id}_${selectedFrequency}_${selectedYear}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const collections: GHGDataCollection[] = JSON.parse(stored);
      const entries: DataEntry[] = collections.map(c => ({
        id: c.id,
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

  const handleSave = (status: 'Draft' | 'Submitted') => {
    const reportingPeriod = `${selectedFrequency} ${selectedYear}`;
    
    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const calculatedEmissions = entry.activityDataValue * (template.emissionFactor || 0);
      
      return {
        id: entry.id,
        sourceTemplateId: template.id,
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
      };
    });

    const key = `scope2_data_collections_${template.id}_${selectedFrequency}_${selectedYear}`;
    localStorage.setItem(key, JSON.stringify(collections));

    const statusKey = `scope2_status_${template.id}_${selectedFrequency}_${selectedYear}`;
    localStorage.setItem(statusKey, status);

    toast({
      title: status === 'Draft' ? "Data Saved" : "Data Submitted",
      description: `Activity data has been ${status === 'Draft' ? 'saved as draft' : 'submitted for review'}.`,
    });

    navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
  };

  return (
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
  );
};

export default Scope2DataCollectionForm;
