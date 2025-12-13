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
import { ArrowLeft, Save, Send, Plus, Trash2 } from "lucide-react";
import { GHGSourceTemplate, GHGDataCollection, getCollectionsForMonth } from '@/types/ghg-source-template';
import { DataQuality } from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { httpClient } from '@/lib/httpClient';

interface DataEntry {
  id: string;
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

  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality>('Medium');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');

  const expectedEntries = getCollectionsForMonth(template.measurementFrequency);

  useEffect(() => {
    loadExistingCollections();
  }, [selectedMonth, selectedYear, template._id]);

  const loadExistingCollections = () => {
    const key = `scope2_data_collections_${template._id}_${selectedMonth}_${selectedYear}`;
    const stored = null
    // localStorage.getItem(key);

    if (stored) {
      const collections: GHGDataCollection[] = JSON.parse(stored);
      const entries: DataEntry[] = collections.map(c => ({
        id: c._id,
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
      });
    }
    setDataEntries(entries);
  };

  const handleAddEntry = () => {
    setDataEntries([...dataEntries, {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      activityDataValue: 0,
      notes: '',
      evidenceUrls: [],
    }]);
  };

  const handleRemoveEntry = (id: string) => {
    if (dataEntries.length > 1) {
      setDataEntries(dataEntries.filter(e => e.id !== id));
    }
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

  const handleSave = async (status: 'Draft' | 'Submitted') => {
    const reportingPeriod = `${selectedMonth} ${selectedYear}`;

    const collections: GHGDataCollection[] = dataEntries.map(entry => {
      const calculatedEmissions = entry.activityDataValue * (template.emissionFactor || 0);

      return {
        sourceTemplateId: template._id,
        reportingPeriod,
        reportingMonth: selectedMonth,
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
    console.log('Saving collections:', collections);
    const key = `scope2_data_collections_${template._id}_${selectedMonth}_${selectedYear}`;
    // localStorage.setItem(key, JSON.stringify(collections));

    const statusKey = `scope2_status_${template._id}_${selectedMonth}_${selectedYear}`;
    // localStorage.setItem(statusKey, status);

    try {
      // Simulate API call
      let dataSubmissionResponse = await httpClient.post('ghg-accounting/collect-ghg-data',
        collections
      );
      if (dataSubmissionResponse.status === 201) {
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

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Facility</div>
              <div className="text-lg font-semibold">{template.facilityName}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Activity Unit</div>
              <div className="text-lg font-semibold">{template.activityDataUnit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Emissions</div>
              <div className="text-lg font-semibold">{calculateTotalEmissions().toFixed(2)} tCO₂e</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Data Entries</CardTitle>
                <CardDescription>
                  Expected entries for {template.measurementFrequency}: {expectedEntries}
                </CardDescription>
              </div>
              <Button onClick={handleAddEntry} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataEntries.map((entry, index) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2">
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
                    <div className="col-span-2">
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
                    <div className="col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEntry(entry.id)}
                        disabled={dataEntries.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
    </UnifiedSidebarLayout>
  );
};

export default Scope2DataCollectionForm;