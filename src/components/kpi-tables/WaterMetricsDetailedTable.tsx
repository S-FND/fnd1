import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Droplets, Plus, Trash2, Building2, Save, CheckCircle2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface WaterFacility {
  id: string;
  type: string;
  waterConsumed: string; // Thousand m³
  freshWaterConsumed: string; // Percentage
  wastewaterGenerated: string; // Thousand m³
  wastewaterRecycled: string; // Percentage
}

interface WaterMetricsDetailedTableProps {
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

export const WaterMetricsDetailedTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: WaterMetricsDetailedTableProps) => {
  // Parse facilities from formData
  const parseFacilities = (): WaterFacility[] => {
    const facilitiesJson = formData['water_detailed_facilities'] as string;
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

  const [facilities, setFacilities] = useState<WaterFacility[]>(parseFacilities);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const saveFacilities = (updatedFacilities: WaterFacility[], triggerSave = false) => {
    setFacilities(updatedFacilities);
    setHasUnsavedChanges(true);
    setShowSaved(false);
    if (triggerSave) {
      onInputChange('water_detailed_facilities', JSON.stringify(updatedFacilities));
    }
  };

  const handleSave = () => {
    onInputChange('water_detailed_facilities', JSON.stringify(facilities));
    setHasUnsavedChanges(false);
    setShowSaved(true);
    toast.success('Water resources data saved successfully');
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleAddFacility = () => {
    if (!selectedFacilityType) return;

    const newFacility: WaterFacility = {
      id: `facility_${Date.now()}`,
      type: selectedFacilityType,
      waterConsumed: '',
      freshWaterConsumed: '',
      wastewaterGenerated: '',
      wastewaterRecycled: '',
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
    field: keyof Omit<WaterFacility, 'id' | 'type'>,
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

  // Calculate totals/averages
  const totalWaterConsumed = facilities.reduce((sum, f) => sum + (parseFloat(f.waterConsumed) || 0), 0);
  const totalWastewaterGenerated = facilities.reduce((sum, f) => sum + (parseFloat(f.wastewaterGenerated) || 0), 0);
  
  // Calculate weighted average for percentages
  const avgFreshWaterConsumed = facilities.length > 0
    ? (facilities.reduce((sum, f) => sum + (parseFloat(f.freshWaterConsumed) || 0), 0) / facilities.length).toFixed(1)
    : '0';
  
  const avgWastewaterRecycled = facilities.length > 0
    ? (facilities.reduce((sum, f) => sum + (parseFloat(f.wastewaterRecycled) || 0), 0) / facilities.length).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            Water Resources
            <Badge variant="outline" className="ml-2 text-xs">
              Annual
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
        {/* Total Summary - Auto Calculated */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-sm">Water & Wastewater Summary</span>
            <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700">
              Auto-calculated
            </Badge>
          </div>
          
          {/* Water Resources Summary */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Water Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Total Water Consumed (Thousand m³)
                </Label>
                <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                  {totalWaterConsumed.toFixed(2)}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  Avg. Fresh Water Consumed (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>% of water used that comes from freshwater sources like municipal supply or groundwater. Please check municipal water bills.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                  {avgFreshWaterConsumed}%
                </div>
              </div>
            </div>
          </div>

          {/* Wastewater Management Summary */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Wastewater Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  Total Wastewater Generation (Thousand m³)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>Water discharged after use in operations, containing impurities from processing or cleaning. Check Effluent Treatment Plant (ETP) / Sewage Treatment Plant (STP) records, if any.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                  {totalWastewaterGenerated.toFixed(2)}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  Avg. Wastewater Recycled (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>% of wastewater that is treated and reused within operations instead of being discharged. Check STP/ETP daily logs, Reuse records (toilets, gardening, cooling).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                  {avgWastewaterRecycled}%
                </div>
              </div>
            </div>
          </div>

          {facilities.length === 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Add facilities below to see the totals
            </p>
          )}
        </div>

        {/* Add Facility Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Facility</Label>
          <p className="text-xs text-muted-foreground">
            Select the facility type for which you want to report water metrics
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
            <Label className="text-sm font-medium">Water & Wastewater by Facility</Label>
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

                  {/* Water Resources */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-blue-600">Water Resources</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Water Consumed (Thousand m³)
                        </Label>
                        <Input
                          type="number"
                          placeholder="Enter water consumed"
                          value={facility.waterConsumed}
                          onChange={(e) =>
                            handleFacilityChange(facility.id, 'waterConsumed', e.target.value)
                          }
                          disabled={readOnly}
                          className="h-9"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          Fresh Water Consumed (%)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p>% of water used that comes from freshwater sources like municipal supply or groundwater. Please check municipal water bills.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={facility.freshWaterConsumed}
                            onChange={(e) =>
                              handleFacilityChange(facility.id, 'freshWaterConsumed', e.target.value)
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

                  {/* Wastewater Management */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-cyan-600">Wastewater Management</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          Wastewater Generation (Thousand m³)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p>Water discharged after use in operations, containing impurities from processing or cleaning. Check Effluent Treatment Plant (ETP) / Sewage Treatment Plant (STP) records, if any.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Enter wastewater generated"
                          value={facility.wastewaterGenerated}
                          onChange={(e) =>
                            handleFacilityChange(facility.id, 'wastewaterGenerated', e.target.value)
                          }
                          disabled={readOnly}
                          className="h-9"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          Wastewater Recycled (%)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p>% of wastewater that is treated and reused within operations instead of being discharged. Check STP/ETP daily logs, Reuse records (toilets, gardening, cooling).</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={facility.wastewaterRecycled}
                            onChange={(e) =>
                              handleFacilityChange(facility.id, 'wastewaterRecycled', e.target.value)
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
      </CardContent>
    </Card>
  );
};
