import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Scope1Entry, 
  SourceType, 
  MeasurementFrequency, 
  DataQuality, 
  DEFAULT_EMISSION_FACTORS,
  EMISSION_SOURCE_CATEGORIES,
  FUEL_SUBSTANCE_TYPES,
  ACTIVITY_UNITS,
  calculateEmissions,
  getCurrentFY
} from '@/types/scope1-ghg';
import { v4 as uuidv4 } from 'uuid';

interface Scope1EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Scope1Entry) => void;
  entry?: Scope1Entry | null;
  teamMembers: Array<{ id: string; name: string }>;
  currentMonth: string;
  currentYear: number;
}

export const Scope1EntryDialog: React.FC<Scope1EntryDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  entry,
  teamMembers,
  currentMonth,
  currentYear,
}) => {
  const [formData, setFormData] = useState<Partial<Scope1Entry>>({
    reportingPeriod: getCurrentFY(),
    emissionFactorSource: 'IPCC 2006',
    emissionFactor: 0,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    calculationMethodology: 'GHG Protocol - Direct calculation',
    measurementFrequency: 'Monthly',
    dataQuality: 'Medium',
    dataEntryDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData({
        reportingPeriod: getCurrentFY(),
        emissionFactorSource: 'IPCC 2006',
        emissionFactor: 0,
        ghgIncluded: 'CO₂, CH₄, N₂O',
        calculationMethodology: 'GHG Protocol - Direct calculation',
        measurementFrequency: 'Monthly',
        dataQuality: 'Medium',
        dataEntryDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [entry, open]);

  const handleInputChange = (field: keyof Scope1Entry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFuelTypeChange = (fuelType: string) => {
    const defaultFactor = DEFAULT_EMISSION_FACTORS[fuelType];
    if (defaultFactor) {
      setFormData(prev => ({
        ...prev,
        fuelSubstanceType: fuelType,
        emissionFactorSource: defaultFactor.source,
        emissionFactor: defaultFactor.factor,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fuelSubstanceType: fuelType,
      }));
    }
  };

  const handleCalculateEmissions = () => {
    if (formData.activityDataValue && formData.emissionFactor) {
      const emissions = calculateEmissions(formData.activityDataValue, formData.emissionFactor);
      setFormData(prev => ({
        ...prev,
        emissionCO2: emissions.co2,
        emissionCH4: emissions.ch4,
        emissionN2O: emissions.n2o,
        totalEmission: emissions.total,
      }));
    }
  };

  useEffect(() => {
    handleCalculateEmissions();
  }, [formData.activityDataValue, formData.emissionFactor]);

  const handleSave = () => {
    const completeEntry: Scope1Entry = {
      id: entry?.id || uuidv4(),
      facilityName: formData.facilityName || '',
      businessUnit: formData.businessUnit || '',
      reportingPeriod: formData.reportingPeriod || getCurrentFY(),
      sourceType: formData.sourceType || 'Stationary',
      emissionSourceCategory: formData.emissionSourceCategory || '',
      emissionSourceDescription: formData.emissionSourceDescription || '',
      fuelSubstanceType: formData.fuelSubstanceType || '',
      activityDataValue: formData.activityDataValue || 0,
      activityDataUnit: formData.activityDataUnit || '',
      emissionFactorSource: formData.emissionFactorSource || 'IPCC 2006',
      emissionFactor: formData.emissionFactor || 0,
      ghgIncluded: formData.ghgIncluded || 'CO₂, CH₄, N₂O',
      emissionCO2: formData.emissionCO2 || 0,
      emissionCH4: formData.emissionCH4 || 0,
      emissionN2O: formData.emissionN2O || 0,
      totalEmission: formData.totalEmission || 0,
      calculationMethodology: formData.calculationMethodology || 'GHG Protocol - Direct calculation',
      dataSource: formData.dataSource || '',
      measurementFrequency: formData.measurementFrequency || 'Monthly',
      dataQuality: formData.dataQuality || 'Medium',
      verifiedBy: formData.verifiedBy || '',
      emissionSourceId: formData.emissionSourceId || `S1-${formData.sourceType?.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      dataEntryDate: formData.dataEntryDate || new Date().toISOString().split('T')[0],
      enteredBy: formData.enteredBy || '',
      notes: formData.notes || '',
    };

    onSave(completeEntry);
    onOpenChange(false);
  };

  const sourceTypeOptions: SourceType[] = ['Stationary', 'Mobile', 'Fugitive', 'Process'];
  const frequencyOptions: MeasurementFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];
  const qualityOptions: DataQuality[] = ['High', 'Medium', 'Low'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit' : 'Add New'} Scope 1 Entry</DialogTitle>
          <DialogDescription>
            Enter details for {currentMonth} {currentYear} emissions data
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="facilityName">Facility / Location Name *</Label>
            <Input
              id="facilityName"
              value={formData.facilityName || ''}
              onChange={(e) => handleInputChange('facilityName', e.target.value)}
              placeholder="e.g., Pune Plant 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessUnit">Business Unit / Division *</Label>
            <Input
              id="businessUnit"
              value={formData.businessUnit || ''}
              onChange={(e) => handleInputChange('businessUnit', e.target.value)}
              placeholder="e.g., Operations - West India"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportingPeriod">Reporting Period</Label>
            <Input
              id="reportingPeriod"
              value={formData.reportingPeriod || ''}
              onChange={(e) => handleInputChange('reportingPeriod', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceType">Source Type *</Label>
            <Select
              value={formData.sourceType}
              onValueChange={(value) => handleInputChange('sourceType', value as SourceType)}
            >
              <SelectTrigger id="sourceType">
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                {sourceTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emissionSourceCategory">Emission Source Category *</Label>
            <Select
              value={formData.emissionSourceCategory}
              onValueChange={(value) => handleInputChange('emissionSourceCategory', value)}
            >
              <SelectTrigger id="emissionSourceCategory">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {formData.sourceType && EMISSION_SOURCE_CATEGORIES[formData.sourceType]?.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emissionSourceDescription">Emission Source Description *</Label>
            <Input
              id="emissionSourceDescription"
              value={formData.emissionSourceDescription || ''}
              onChange={(e) => handleInputChange('emissionSourceDescription', e.target.value)}
              placeholder="e.g., Diesel Generator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelSubstanceType">Fuel / Substance Type *</Label>
            <Select
              value={formData.fuelSubstanceType}
              onValueChange={handleFuelTypeChange}
            >
              <SelectTrigger id="fuelSubstanceType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {formData.sourceType && FUEL_SUBSTANCE_TYPES[formData.sourceType]?.map(fuel => (
                  <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityDataValue">Activity Data Value *</Label>
            <Input
              id="activityDataValue"
              type="number"
              value={formData.activityDataValue || ''}
              onChange={(e) => handleInputChange('activityDataValue', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityDataUnit">Activity Data Unit *</Label>
            <Select
              value={formData.activityDataUnit}
              onValueChange={(value) => handleInputChange('activityDataUnit', value)}
            >
              <SelectTrigger id="activityDataUnit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {formData.sourceType && ACTIVITY_UNITS[formData.sourceType]?.map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emissionFactorSource">Emission Factor Source</Label>
            <Input
              id="emissionFactorSource"
              value={formData.emissionFactorSource || ''}
              onChange={(e) => handleInputChange('emissionFactorSource', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emissionFactor">Emission Factor (kg CO₂e/unit)</Label>
            <Input
              id="emissionFactor"
              type="number"
              step="0.01"
              value={formData.emissionFactor || ''}
              onChange={(e) => handleInputChange('emissionFactor', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ghgIncluded">GHG Included</Label>
            <Input
              id="ghgIncluded"
              value={formData.ghgIncluded || ''}
              onChange={(e) => handleInputChange('ghgIncluded', e.target.value)}
            />
          </div>

          {/* Calculated Emissions */}
          <div className="col-span-2 grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <Label className="text-xs">CO₂ (kg)</Label>
              <Input value={formData.emissionCO2?.toFixed(2) || '0.00'} disabled />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CH₄ (kg)</Label>
              <Input value={formData.emissionCH4?.toFixed(2) || '0.00'} disabled />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">N₂O (kg)</Label>
              <Input value={formData.emissionN2O?.toFixed(2) || '0.00'} disabled />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Total (tCO₂e)</Label>
              <Input 
                value={formData.totalEmission?.toFixed(2) || '0.00'} 
                disabled 
                className="font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calculationMethodology">Calculation Methodology</Label>
            <Input
              id="calculationMethodology"
              value={formData.calculationMethodology || ''}
              onChange={(e) => handleInputChange('calculationMethodology', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataSource">Data Source / Meter *</Label>
            <Input
              id="dataSource"
              value={formData.dataSource || ''}
              onChange={(e) => handleInputChange('dataSource', e.target.value)}
              placeholder="e.g., Fuel purchase invoice"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurementFrequency">Measurement Frequency *</Label>
            <Select
              value={formData.measurementFrequency}
              onValueChange={(value) => handleInputChange('measurementFrequency', value as MeasurementFrequency)}
            >
              <SelectTrigger id="measurementFrequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(freq => (
                  <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataQuality">Data Quality / Confidence *</Label>
            <Select
              value={formData.dataQuality}
              onValueChange={(value) => handleInputChange('dataQuality', value as DataQuality)}
            >
              <SelectTrigger id="dataQuality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualityOptions.map(quality => (
                  <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enteredBy">Entered By *</Label>
            <Select
              value={formData.enteredBy}
              onValueChange={(value) => handleInputChange('enteredBy', value)}
            >
              <SelectTrigger id="enteredBy">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verifiedBy">Verifier / Reviewed By</Label>
            <Select
              value={formData.verifiedBy}
              onValueChange={(value) => handleInputChange('verifiedBy', value)}
            >
              <SelectTrigger id="verifiedBy">
                <SelectValue placeholder="Select verifier (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-</SelectItem>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emissionSourceId">Emission Source ID / Code</Label>
            <Input
              id="emissionSourceId"
              value={formData.emissionSourceId || ''}
              onChange={(e) => handleInputChange('emissionSourceId', e.target.value)}
              placeholder="Auto-generated"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataEntryDate">Data Entry Date</Label>
            <Input
              id="dataEntryDate"
              type="date"
              value={formData.dataEntryDate || ''}
              onChange={(e) => handleInputChange('dataEntryDate', e.target.value)}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="notes">Notes / Comments</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional information or context"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {entry ? 'Update' : 'Add'} Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Scope1EntryDialog;
