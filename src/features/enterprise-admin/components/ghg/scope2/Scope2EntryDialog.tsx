import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload } from "lucide-react";
import { 
  Scope2Entry, 
  Scope2SourceType, 
  Scope2Category,
  MeasurementFrequency, 
  DataQuality,
  DEFAULT_EMISSION_FACTORS,
  EMISSION_SOURCE_CATEGORIES,
  UTILITY_TYPES,
  ACTIVITY_UNITS,
  calculateEmissions,
  getCurrentFY,
} from '@/types/scope2-ghg';
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";


interface Scope2EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Scope2Entry) => void;
  entry?: Scope2Entry | null;
  teamMembers: Array<{ id: string; name: string }>;
  currentMonth: string;
  currentYear: number;
  defaultSourceType?: Scope2SourceType;
}

export const Scope2EntryDialog: React.FC<Scope2EntryDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  entry,
  teamMembers,
  currentMonth,
  currentYear,
  defaultSourceType,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Scope2Entry>>({
    reportingPeriod: getCurrentFY(),
    sourceType: defaultSourceType || 'Purchased Electricity',
    scope2Category: 'Location-Based',
    gridEmissionFactorSource: 'CEA India Baseline 2023',
    emissionFactor: 0.82,
    ghgIncluded: 'CO₂, CH₄, N₂O',
    calculationMethodology: 'GHG Protocol - Scope 2',
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
        sourceType: defaultSourceType || 'Purchased Electricity',
        scope2Category: 'Location-Based',
        gridEmissionFactorSource: 'CEA India Baseline 2023',
        emissionFactor: 0.82,
        ghgIncluded: 'CO₂, CH₄, N₂O',
        calculationMethodology: 'GHG Protocol - Scope 2',
        measurementFrequency: 'Monthly',
        dataQuality: 'Medium',
        dataEntryDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [entry, open, defaultSourceType]);

  const handleInputChange = (field: keyof Scope2Entry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUtilityTypeChange = (utilityType: string) => {
    const defaultFactor = DEFAULT_EMISSION_FACTORS[utilityType];
    if (defaultFactor) {
      setFormData(prev => ({
        ...prev,
        gridEmissionFactorSource: defaultFactor.source,
        emissionFactor: defaultFactor.factor,
      }));
    }
  };

  const calculateAndSetEmissions = () => {
    const activityData = Number(formData.activityDataValue) || 0;
    const emissionFactor = Number(formData.emissionFactor) || 0;
    
    if (activityData && emissionFactor) {
      const emissions = calculateEmissions(activityData, emissionFactor);
      setFormData(prev => ({
        ...prev,
        emissionCO2: emissions.co2,
        emissionCH4: emissions.ch4,
        emissionN2O: emissions.n2o,
        totalEmission: emissions.total,
      }));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const completeEntry: Scope2Entry = {
      id: entry?.id || uuidv4(),
      facilityName: formData.facilityName || '',
      businessUnit: formData.businessUnit || '',
      reportingPeriod: formData.reportingPeriod || getCurrentFY(),
      sourceType: formData.sourceType || 'Purchased Electricity',
      emissionSourceCategory: formData.emissionSourceCategory || '',
      emissionSourceDescription: formData.emissionSourceDescription || '',
      utilityProviderName: formData.utilityProviderName || '',
      countryRegion: formData.countryRegion || '',
      gridEmissionFactorSource: formData.gridEmissionFactorSource || '',
      emissionFactor: Number(formData.emissionFactor) || 0,
      activityDataValue: Number(formData.activityDataValue) || 0,
      activityDataUnit: formData.activityDataUnit || 'kWh',
      scope2Category: formData.scope2Category || 'Location-Based',
      ghgIncluded: formData.ghgIncluded || 'CO₂, CH₄, N₂O',
      emissionCO2: Number(formData.emissionCO2) || 0,
      emissionCH4: Number(formData.emissionCH4) || 0,
      emissionN2O: Number(formData.emissionN2O) || 0,
      totalEmission: Number(formData.totalEmission) || 0,
      calculationMethodology: formData.calculationMethodology || 'GHG Protocol - Scope 2',
      dataSource: formData.dataSource || '',
      measurementFrequency: formData.measurementFrequency || 'Monthly',
      dataQuality: formData.dataQuality || 'Medium',
      verifiedBy: formData.verifiedBy || '',
      emissionSourceId: formData.emissionSourceId || '',
      dataEntryDate: formData.dataEntryDate || new Date().toISOString().split('T')[0],
      enteredBy: formData.enteredBy || '',
      notes: formData.notes || '',
    };

    onSave(completeEntry);
    onOpenChange(false);
  };

  const sourceCategories = EMISSION_SOURCE_CATEGORIES[formData.sourceType || 'Purchased Electricity'];
  const activityUnits = ACTIVITY_UNITS[formData.sourceType || 'Purchased Electricity'];
  const utilityTypes = UTILITY_TYPES[formData.sourceType || 'Purchased Electricity'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit' : 'Add New'} Scope 2 Emission Entry</DialogTitle>
          <DialogDescription>
            Fill in the details for the indirect emission source from purchased energy.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility / Location Name *</Label>
                  <Input
                    id="facilityName"
                    value={formData.facilityName || ''}
                    onChange={(e) => handleInputChange('facilityName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessUnit">Business Unit / Division</Label>
                  <Input
                    id="businessUnit"
                    value={formData.businessUnit || ''}
                    onChange={(e) => handleInputChange('businessUnit', e.target.value)}
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
                    onValueChange={(value) => handleInputChange('sourceType', value as Scope2SourceType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purchased Electricity">Purchased Electricity</SelectItem>
                      <SelectItem value="Purchased Steam">Purchased Steam</SelectItem>
                      <SelectItem value="Purchased Heat">Purchased Heat</SelectItem>
                      <SelectItem value="Purchased Cooling">Purchased Cooling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Source Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Source Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emissionSourceCategory">Emission Source Category</Label>
                  <Select
                    value={formData.emissionSourceCategory}
                    onValueChange={(value) => handleInputChange('emissionSourceCategory', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emissionSourceDescription">Emission Source Description</Label>
                  <Input
                    id="emissionSourceDescription"
                    value={formData.emissionSourceDescription || ''}
                    onChange={(e) => handleInputChange('emissionSourceDescription', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilityProviderName">Utility Provider Name *</Label>
                  <Input
                    id="utilityProviderName"
                    value={formData.utilityProviderName || ''}
                    onChange={(e) => handleInputChange('utilityProviderName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countryRegion">Country / Region</Label>
                  <Input
                    id="countryRegion"
                    value={formData.countryRegion || ''}
                    onChange={(e) => handleInputChange('countryRegion', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Activity Data & Emission Factor */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Activity Data & Emission Factor</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="utilityType">Utility Type (for default factors)</Label>
                  <Select onValueChange={handleUtilityTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select to auto-populate factors" />
                    </SelectTrigger>
                    <SelectContent>
                      {utilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scope2Category">Scope 2 Category *</Label>
                  <Select
                    value={formData.scope2Category}
                    onValueChange={(value) => handleInputChange('scope2Category', value as Scope2Category)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Location-Based">Location-Based</SelectItem>
                      <SelectItem value="Market-Based">Market-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityDataValue">Activity Data Value (Energy Consumed) *</Label>
                  <Input
                    id="activityDataValue"
                    type="number"
                    step="0.01"
                    value={formData.activityDataValue || ''}
                    onChange={(e) => handleInputChange('activityDataValue', e.target.value)}
                    onBlur={calculateAndSetEmissions}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityDataUnit">Activity Data Unit *</Label>
                  <Select
                    value={formData.activityDataUnit}
                    onValueChange={(value) => handleInputChange('activityDataUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gridEmissionFactorSource">Grid Emission Factor Source</Label>
                  <Input
                    id="gridEmissionFactorSource"
                    value={formData.gridEmissionFactorSource || ''}
                    onChange={(e) => handleInputChange('gridEmissionFactorSource', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emissionFactor">Emission Factor (kg CO₂e/unit)</Label>
                  <Input
                    id="emissionFactor"
                    type="number"
                    step="0.01"
                    value={formData.emissionFactor || ''}
                    onChange={(e) => handleInputChange('emissionFactor', e.target.value)}
                    onBlur={calculateAndSetEmissions}
                  />
                </div>
              </div>
            </div>

            {/* Emissions Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Emissions Breakdown</h3>
                <Button type="button" variant="outline" size="sm" onClick={calculateAndSetEmissions}>
                  Calculate Emissions
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ghgIncluded">GHG Included</Label>
                  <Input
                    id="ghgIncluded"
                    value={formData.ghgIncluded || ''}
                    onChange={(e) => handleInputChange('ghgIncluded', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emissionCO2">Emission (CO₂) (kg)</Label>
                  <Input
                    id="emissionCO2"
                    type="number"
                    step="0.01"
                    value={formData.emissionCO2 || ''}
                    onChange={(e) => handleInputChange('emissionCO2', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emissionCH4">Emission (CH₄) (kg)</Label>
                  <Input
                    id="emissionCH4"
                    type="number"
                    step="0.01"
                    value={formData.emissionCH4 || ''}
                    onChange={(e) => handleInputChange('emissionCH4', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emissionN2O">Emission (N₂O) (kg)</Label>
                  <Input
                    id="emissionN2O"
                    type="number"
                    step="0.01"
                    value={formData.emissionN2O || ''}
                    onChange={(e) => handleInputChange('emissionN2O', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="totalEmission">Total Emission (tCO₂e)</Label>
                  <Input
                    id="totalEmission"
                    type="number"
                    step="0.01"
                    value={formData.totalEmission || ''}
                    onChange={(e) => handleInputChange('totalEmission', e.target.value)}
                    className="font-bold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Data Quality & Verification */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Data Quality & Verification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calculationMethodology">Calculation Methodology</Label>
                  <Input
                    id="calculationMethodology"
                    value={formData.calculationMethodology || ''}
                    onChange={(e) => handleInputChange('calculationMethodology', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataSource">Data Source / Meter</Label>
                  <Input
                    id="dataSource"
                    value={formData.dataSource || ''}
                    onChange={(e) => handleInputChange('dataSource', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="measurementFrequency">Measurement Frequency</Label>
                  <Select
                    value={formData.measurementFrequency}
                    onValueChange={(value) => {
                      handleInputChange('measurementFrequency', value as MeasurementFrequency);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataQuality">Data Quality / Confidence</Label>
                  <Select
                    value={formData.dataQuality}
                    onValueChange={(value) => handleInputChange('dataQuality', value as DataQuality)}
                  >
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
                  <Label htmlFor="verifiedBy">Verifier / Reviewed By</Label>
                  <Select
                    value={formData.verifiedBy}
                    onValueChange={(value) => handleInputChange('verifiedBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select verifier" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
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
                  />
                </div>
              </div>
            </div>

            {/* Record Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Record Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataEntryDate">Data Entry Date</Label>
                  <Input
                    id="dataEntryDate"
                    type="date"
                    value={formData.dataEntryDate || ''}
                    onChange={(e) => handleInputChange('dataEntryDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enteredBy">Entered By</Label>
                  <Select
                    value={formData.enteredBy}
                    onValueChange={(value) => handleInputChange('enteredBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes / Comments</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {entry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Scope2EntryDialog;
