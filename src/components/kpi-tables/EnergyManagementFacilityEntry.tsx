import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Plus, Trash2, Building2, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Facility {
  id: string;
  type: string;
  energyConsumed: string;
  renewablePercentage: string;
}

interface EnergyManagementFacilityEntryProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const FACILITY_TYPES = [
  { value: 'office', label: 'Office' },
  { value: 'coco_stores', label: 'COCO Stores' },
  { value: 'other_stores', label: 'Other Stores' },
  { value: 'warehouses', label: 'Warehouses' },
  { value: 'manufacturing_plant', label: 'Manufacturing Plant' },
  { value: 'dark_stores', label: 'Dark Stores' },
];

export const EnergyManagementFacilityEntry = ({
  formData,
  onInputChange,
  readOnly = false,
}: EnergyManagementFacilityEntryProps) => {
  // Parse facilities from formData
  const parseFacilities = (): Facility[] => {
    const facilitiesJson = formData['energy_detailed_facilities'] as string;
    if (facilitiesJson) {
      try {
        const parsed = JSON.parse(facilitiesJson);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const [facilities, setFacilities] = useState<Facility[]>(parseFacilities);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const ghgInitiative = (formData['energy_detailed_ghg_initiative'] as string) || '';
  const ghgReduced = (formData['energy_detailed_ghg_reduced'] as string) || '';

  const saveFacilities = (updatedFacilities: Facility[]) => {
    setFacilities(updatedFacilities);
    setHasUnsavedChanges(true);
    setShowSaved(false);
  };

  const handleSave = () => {
    onInputChange('energy_detailed_facilities', JSON.stringify(facilities));
    setHasUnsavedChanges(false);
    setShowSaved(true);
    toast.success('Energy management data saved successfully');
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleAddFacility = () => {
    if (!selectedFacilityType) return;

    const newFacility: Facility = {
      id: `facility_${Date.now()}`,
      type: selectedFacilityType,
      energyConsumed: '',
      renewablePercentage: '',
    };

    const updatedFacilities = [...facilities, newFacility];
    saveFacilities(updatedFacilities);
    setSelectedFacilityType('');
  };

  const handleRemoveFacility = (facilityId: string) => {
    const updatedFacilities = facilities.filter((f) => f.id !== facilityId);
    saveFacilities(updatedFacilities);
  };

  const handleFacilityChange = (
    facilityId: string,
    field: 'energyConsumed' | 'renewablePercentage',
    value: string
  ) => {
    const updatedFacilities = facilities.map((f) =>
      f.id === facilityId ? { ...f, [field]: value } : f
    );
    saveFacilities(updatedFacilities);
  };

  const getFacilityLabel = (type: string) => {
    return FACILITY_TYPES.find((f) => f.value === type)?.label || type;
  };

  // Calculate total energy consumption from all facilities
  const totalEnergyConsumed = facilities.reduce((sum, facility) => {
    const energy = parseFloat(facility.energyConsumed) || 0;
    return sum + energy;
  }, 0);

  // Calculate weighted average renewable percentage
  const totalRenewableEnergy = facilities.reduce((sum, facility) => {
    const energy = parseFloat(facility.energyConsumed) || 0;
    const renewablePct = parseFloat(facility.renewablePercentage) || 0;
    return sum + (energy * renewablePct / 100);
  }, 0);
  const avgRenewablePercentage = totalEnergyConsumed > 0 
    ? (totalRenewableEnergy / totalEnergyConsumed * 100).toFixed(1) 
    : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Energy Management (Detailed)
            <Badge variant="outline" className="ml-2 text-xs">
              Quarterly
            </Badge>
          </CardTitle>
          {!readOnly && facilities.length > 0 && (
            <Button
              type="button"
              variant={showSaved ? "outline" : "default"}
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges && !showSaved}
              className="gap-2"
            >
              {showSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Energy Summary - Auto Calculated */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-sm">Total Energy Consumption Summary</span>
            <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700">
              Auto-calculated
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Total Energy Consumed (kWh)</Label>
              <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                {totalEnergyConsumed.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Avg. Renewable Energy (%)</Label>
              <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                {avgRenewablePercentage}%
              </div>
            </div>
          </div>
          {facilities.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Add facilities below to see the total energy consumption
            </p>
          )}
        </div>

        {/* Add Facility Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Facility</Label>
          <p className="text-xs text-muted-foreground">
            Select the facility type for which you want to report energy metrics
          </p>
          <div className="flex gap-3">
            <Select
              value={selectedFacilityType || undefined}
              onValueChange={(value) => setSelectedFacilityType(value === '__clear__' ? '' : value)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {selectedFacilityType && (
                  <SelectItem value="__clear__" className="text-muted-foreground italic">
                    Clear selection
                  </SelectItem>
                )}
                {FACILITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFacility}
              disabled={!selectedFacilityType || readOnly}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Facility
            </Button>
          </div>
        </div>

        {/* Facilities List */}
        {facilities.length > 0 && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Energy Consumption by Facility</Label>
            <div className="space-y-3">
              {facilities.map((facility, index) => (
                <div
                  key={facility.id}
                  className="p-4 border rounded-lg bg-muted/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {getFacilityLabel(facility.type)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFacility(facility.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Total Energy Consumed (kWh)
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter energy consumed"
                        value={facility.energyConsumed}
                        onChange={(e) =>
                          handleFacilityChange(facility.id, 'energyConsumed', e.target.value)
                        }
                        disabled={readOnly}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Renewable Energy (%)
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="0"
                          value={facility.renewablePercentage}
                          onChange={(e) =>
                            handleFacilityChange(
                              facility.id,
                              'renewablePercentage',
                              e.target.value
                            )
                          }
                          disabled={readOnly}
                          min={0}
                          max={100}
                          className="h-9 w-24"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {facilities.length === 0 && (
          <div className="text-center py-8 border rounded-lg border-dashed bg-muted/20">
            <Building2 className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No facilities added yet. Select a facility type above to get started.
            </p>
          </div>
        )}

        {/* GHG Emissions Section */}
        <div className="border-t pt-6 space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Are you adopting any GHG Emissions reduction initiatives?
            </Label>
            <RadioGroup
              value={ghgInitiative}
              onValueChange={(value) => onInputChange('energy_detailed_ghg_initiative', value)}
              disabled={readOnly}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ghg-yes" />
                <Label htmlFor="ghg-yes" className="font-normal cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ghg-no" />
                <Label htmlFor="ghg-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {ghgInitiative === 'yes' && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
              <Label className="text-sm">GHG Emissions Reduced/Avoided (tCO₂e)</Label>
              <Input
                type="number"
                placeholder="Enter emissions reduced/avoided"
                value={ghgReduced}
                onChange={(e) => onInputChange('energy_detailed_ghg_reduced', e.target.value)}
                disabled={readOnly}
                className="w-64"
              />
              <p className="text-xs text-muted-foreground">
                Enter the total GHG emissions reduced or avoided in tonnes of CO₂ equivalent
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
