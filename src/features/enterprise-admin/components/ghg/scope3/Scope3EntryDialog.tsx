import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload } from "lucide-react";
import { Scope3Entry, Scope3Category, CalculationMethodology, MeasurementFrequency, DataQuality, calculateEmissions, getCurrentFY, DEFAULT_EMISSION_FACTORS } from '@/types/scope3-ghg';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';


interface Scope3EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Scope3Entry) => void;
  entry?: Scope3Entry;
  defaultCategory?: Scope3Category;
  currentMonth: string;
  currentYear: number;
}

const MOCK_TEAM_MEMBERS = [
  'Meera Sharma',
  'Rajesh Kumar',
  'Priya Patel',
  'Amit Singh',
  'Sanjana Reddy',
];

const SCOPE3_CATEGORIES: Scope3Category[] = [
  'Category 1 – Purchased Goods and Services',
  'Category 2 – Capital Goods',
  'Category 3 – Fuel and Energy Related Activities',
  'Category 4 – Upstream Transportation and Distribution',
  'Category 5 – Waste Generated in Operations',
  'Category 6 – Business Travel',
  'Category 7 – Employee Commuting',
  'Category 8 – Upstream Leased Assets',
  'Category 9 – Downstream Transportation and Distribution',
  'Category 10 – Processing of Sold Products',
  'Category 11 – Use of Sold Products',
  'Category 12 – End-of-Life Treatment of Sold Products',
  'Category 13 – Downstream Leased Assets',
  'Category 14 – Franchises',
  'Category 15 – Investments',
];

export const Scope3EntryDialog: React.FC<Scope3EntryDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  entry,
  defaultCategory,
  currentMonth,
  currentYear,
}) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Array<{ id: string; name: string; code?: string; location?: string }>>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [formData, setFormData] = useState<Partial<Scope3Entry>>({
    facilityName: '',
    businessUnit: '',
    reportingPeriod: getCurrentFY(),
    scope3Category: defaultCategory || 'Category 1 – Purchased Goods and Services',
    sourceType: '',
    emissionSourceDescription: '',
    supplierName: '',
    countryRegion: 'India',
    activityDataValue: 0,
    activityDataUnit: '',
    emissionFactorSource: DEFAULT_EMISSION_FACTORS[defaultCategory || 'Category 1 – Purchased Goods and Services'].source,
    emissionFactor: DEFAULT_EMISSION_FACTORS[defaultCategory || 'Category 1 – Purchased Goods and Services'].factor,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    calculationMethodology: 'Activity-based',
    dataSource: '',
    measurementFrequency: 'Monthly',
    dataQuality: 'High',
    verifiedBy: '',
    emissionSourceId: '',
    dataEntryDate: new Date().toISOString().split('T')[0],
    enteredBy: '',
    notes: '',
  });


  // Fetch facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const { data, error } = await supabase
          .from('facilities')
          .select('id, name, code, location')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setFacilities(data || []);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast({
          title: "Error Loading Facilities",
          description: "Could not load facilities. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingFacilities(false);
      }
    };

    if (open) {
      fetchFacilities();
    }
  }, [open, toast]);

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else if (defaultCategory) {
      const defaults = DEFAULT_EMISSION_FACTORS[defaultCategory];
      setFormData(prev => ({
        ...prev,
        scope3Category: defaultCategory,
        emissionFactorSource: defaults.source,
        emissionFactor: defaults.factor,
        activityDataUnit: defaults.unit.replace('kg CO₂e/', ''),
      }));
    }
  }, [entry, defaultCategory]);

  const handleCategoryChange = (category: Scope3Category) => {
    const defaults = DEFAULT_EMISSION_FACTORS[category];
    setFormData(prev => ({
      ...prev,
      scope3Category: category,
      emissionFactorSource: defaults.source,
      emissionFactor: defaults.factor,
      activityDataUnit: defaults.unit.replace('kg CO₂e/', ''),
    }));
  };


  const handleSave = () => {
    const emissions = calculateEmissions(
      formData.activityDataValue || 0,
      formData.emissionFactor || 0
    );

    const newEntry: Scope3Entry = {
      id: entry?.id || uuidv4(),
      facilityName: formData.facilityName || '',
      businessUnit: formData.businessUnit || '',
      reportingPeriod: formData.reportingPeriod || getCurrentFY(),
      scope3Category: formData.scope3Category as Scope3Category,
      sourceType: formData.sourceType || '',
      emissionSourceDescription: formData.emissionSourceDescription || '',
      supplierName: formData.supplierName || '',
      countryRegion: formData.countryRegion || 'India',
      activityDataValue: formData.activityDataValue || 0,
      activityDataUnit: formData.activityDataUnit || '',
      emissionFactorSource: formData.emissionFactorSource || '',
      emissionFactor: formData.emissionFactor || 0,
      ghgIncluded: formData.ghgIncluded || 'CO₂, CH₄, N₂O',
      emissionCO2: emissions.co2,
      emissionCH4: emissions.ch4,
      emissionN2O: emissions.n2o,
      totalEmission: emissions.total,
      calculationMethodology: formData.calculationMethodology as CalculationMethodology,
      dataSource: formData.dataSource || '',
      measurementFrequency: formData.measurementFrequency as MeasurementFrequency,
      dataQuality: formData.dataQuality as DataQuality,
      verifiedBy: formData.verifiedBy || '',
      emissionSourceId: formData.emissionSourceId || '',
      dataEntryDate: formData.dataEntryDate || new Date().toISOString().split('T')[0],
      enteredBy: formData.enteredBy || '',
      notes: formData.notes || '',
    };

    onSave(newEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit' : 'Add'} Scope 3 Emission Entry</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Facility / Location Name</Label>
            <Select
              value={formData.facilityName}
              onValueChange={(value) => setFormData({ ...formData, facilityName: value })}
              disabled={loadingFacilities}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingFacilities ? "Loading facilities..." : "Select facility..."} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="Other">
                  <span className="font-medium">Other</span>
                </SelectItem>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.name}>
                    <div className="flex flex-col">
                      <span className="font-medium">{facility.name}</span>
                      {(facility.code || facility.location) && (
                        <span className="text-xs text-muted-foreground">
                          {facility.code && `${facility.code}`}
                          {facility.code && facility.location && ' • '}
                          {facility.location && facility.location}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Business Unit / Division</Label>
            <Input
              value={formData.businessUnit}
              onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
            />
          </div>

          <div>
            <Label>Reporting Period</Label>
            <Input
              value={formData.reportingPeriod}
              onChange={(e) => setFormData({ ...formData, reportingPeriod: e.target.value })}
            />
          </div>

          <div>
            <Label>Scope 3 Category</Label>
            <Select value={formData.scope3Category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPE3_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Source Type</Label>
            <Input
              value={formData.sourceType}
              onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
              placeholder="e.g., Raw Material Purchases"
            />
          </div>

          <div>
            <Label>Emission Source Description</Label>
            <Input
              value={formData.emissionSourceDescription}
              onChange={(e) => setFormData({ ...formData, emissionSourceDescription: e.target.value })}
            />
          </div>

          <div>
            <Label>Supplier / Service Provider Name</Label>
            <Input
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
            />
          </div>

          <div>
            <Label>Country / Region</Label>
            <Input
              value={formData.countryRegion}
              onChange={(e) => setFormData({ ...formData, countryRegion: e.target.value })}
            />
          </div>

          <div>
            <Label>Activity Data Value</Label>
            <Input
              type="number"
              value={formData.activityDataValue}
              onChange={(e) => setFormData({ ...formData, activityDataValue: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label>Activity Data Unit</Label>
            <Input
              value={formData.activityDataUnit}
              onChange={(e) => setFormData({ ...formData, activityDataUnit: e.target.value })}
            />
          </div>

          <div>
            <Label>Emission Factor Source</Label>
            <Input
              value={formData.emissionFactorSource}
              onChange={(e) => setFormData({ ...formData, emissionFactorSource: e.target.value })}
            />
          </div>

          <div>
            <Label>Emission Factor (kg CO₂e/unit)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.emissionFactor}
              onChange={(e) => setFormData({ ...formData, emissionFactor: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label>GHG Included</Label>
            <Input
              value={formData.ghgIncluded}
              onChange={(e) => setFormData({ ...formData, ghgIncluded: e.target.value })}
            />
          </div>

          <div>
            <Label>Calculation Methodology</Label>
            <Select value={formData.calculationMethodology} onValueChange={(v) => setFormData({ ...formData, calculationMethodology: v as CalculationMethodology })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activity-based">Activity-based</SelectItem>
                <SelectItem value="Spend-based">Spend-based</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data Source</Label>
            <Input
              value={formData.dataSource}
              onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
              placeholder="e.g., Supplier invoice"
            />
          </div>

          <div>
            <Label>Measurement Frequency</Label>
            <Select 
              value={formData.measurementFrequency} 
              onValueChange={(v) => {
                setFormData({ ...formData, measurementFrequency: v as MeasurementFrequency });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data Quality / Confidence</Label>
            <Select value={formData.dataQuality} onValueChange={(v) => setFormData({ ...formData, dataQuality: v as DataQuality })}>
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

          <div>
            <Label>Verifier / Reviewed By</Label>
            <Select value={formData.verifiedBy} onValueChange={(v) => setFormData({ ...formData, verifiedBy: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select verifier" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member} value={member}>{member}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Emission Source ID / Code</Label>
            <Input
              value={formData.emissionSourceId}
              onChange={(e) => setFormData({ ...formData, emissionSourceId: e.target.value })}
            />
          </div>

          <div>
            <Label>Data Entry Date</Label>
            <Input
              type="date"
              value={formData.dataEntryDate}
              onChange={(e) => setFormData({ ...formData, dataEntryDate: e.target.value })}
            />
          </div>

          <div>
            <Label>Entered By</Label>
            <Select value={formData.enteredBy} onValueChange={(v) => setFormData({ ...formData, enteredBy: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member} value={member}>{member}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Notes / Comments</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Scope3EntryDialog;
