import { useState } from 'react';
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
import { Trash2, Plus, Building2, Recycle, Save, CheckCircle2 } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';
import { toast } from 'sonner';

interface WasteEntry {
  id: string;
  type: string;
  wasteGenerated: string;
  wasteRecycled: string;
}

interface FacilityWaste {
  id: string;
  facilityType: string;
  wasteEntries: WasteEntry[];
}

interface WasteManagementDetailedTableProps {
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

const WASTE_TYPES = [
  { value: 'solid_waste', label: 'Solid Waste' },
  { value: 'organic', label: 'Non-packaging Waste - Organic' },
  { value: 'inorganic', label: 'Non-packaging Waste - Inorganic' },
  { value: 'biomedical', label: 'Non-packaging Waste - Biomedical' },
  { value: 'hazardous', label: 'Non-packaging Waste - Hazardous' },
  { value: 'other', label: 'Non-packaging Waste - Other' },
];

export const WasteManagementDetailedTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: WasteManagementDetailedTableProps) => {
  // Parse facilities from formData
  const parseFacilities = (): FacilityWaste[] => {
    const facilitiesJson = formData['waste_detailed_facilities'] as string;
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

  const [facilities, setFacilities] = useState<FacilityWaste[]>(parseFacilities);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const saveFacilities = (updatedFacilities: FacilityWaste[]) => {
    setFacilities(updatedFacilities);
    setHasUnsavedChanges(true);
    setShowSaved(false);
  };

  const handleSave = () => {
    onInputChange('waste_detailed_facilities', JSON.stringify(facilities));
    setHasUnsavedChanges(false);
    setShowSaved(true);
    toast.success('Waste management data saved successfully');
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleAddFacility = () => {
    if (!selectedFacilityType) return;

    const newFacility: FacilityWaste = {
      id: `facility_${Date.now()}`,
      facilityType: selectedFacilityType,
      wasteEntries: [],
    };

    const updatedFacilities = [...facilities, newFacility];
    saveFacilities(updatedFacilities);
    setSelectedFacilityType('');
  };

  const handleRemoveFacility = (facilityId: string) => {
    const updatedFacilities = facilities.filter((f) => f.id !== facilityId);
    saveFacilities(updatedFacilities);
  };

  const handleAddWasteEntry = (facilityId: string, wasteType: string) => {
    const updatedFacilities = facilities.map((f) => {
      if (f.id === facilityId) {
        const newEntry: WasteEntry = {
          id: `waste_${Date.now()}`,
          type: wasteType,
          wasteGenerated: '',
          wasteRecycled: '',
        };
        return { ...f, wasteEntries: [...f.wasteEntries, newEntry] };
      }
      return f;
    });
    saveFacilities(updatedFacilities);
  };

  const handleRemoveWasteEntry = (facilityId: string, wasteEntryId: string) => {
    const updatedFacilities = facilities.map((f) => {
      if (f.id === facilityId) {
        return {
          ...f,
          wasteEntries: f.wasteEntries.filter((w) => w.id !== wasteEntryId),
        };
      }
      return f;
    });
    saveFacilities(updatedFacilities);
  };

  const handleWasteEntryChange = (
    facilityId: string,
    wasteEntryId: string,
    field: 'wasteGenerated' | 'wasteRecycled',
    value: string
  ) => {
    const updatedFacilities = facilities.map((f) => {
      if (f.id === facilityId) {
        return {
          ...f,
          wasteEntries: f.wasteEntries.map((w) =>
            w.id === wasteEntryId ? { ...w, [field]: value } : w
          ),
        };
      }
      return f;
    });
    saveFacilities(updatedFacilities);
  };

  const getFacilityLabel = (type: string) => {
    return FACILITY_TYPES.find((f) => f.value === type)?.label || type;
  };

  const getWasteTypeLabel = (type: string) => {
    return WASTE_TYPES.find((w) => w.value === type)?.label || type;
  };

  const getAvailableWasteTypes = (facilityId: string) => {
    const facility = facilities.find((f) => f.id === facilityId);
    if (!facility) return WASTE_TYPES;
    const usedTypes = facility.wasteEntries.map((w) => w.type);
    return WASTE_TYPES.filter((wt) => !usedTypes.includes(wt.value));
  };

  // Calculate totals
  const totalWasteGenerated = facilities.reduce((sum, facility) => {
    return (
      sum +
      facility.wasteEntries.reduce((entrySum, entry) => {
        return entrySum + (parseFloat(entry.wasteGenerated) || 0);
      }, 0)
    );
  }, 0);

  const totalRecycledWeight = facilities.reduce((sum, facility) => {
    return (
      sum +
      facility.wasteEntries.reduce((entrySum, entry) => {
        const generated = parseFloat(entry.wasteGenerated) || 0;
        const recycledPct = parseFloat(entry.wasteRecycled) || 0;
        return entrySum + (generated * recycledPct) / 100;
      }, 0)
    );
  }, 0);

  const avgRecycledPercentage =
    totalWasteGenerated > 0
      ? ((totalRecycledWeight / totalWasteGenerated) * 100).toFixed(1)
      : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Recycle className="w-4 h-4 text-green-500" />
            Waste Management (Detailed)
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
        {/* Total Waste Summary - Auto Calculated */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-3">
            <Recycle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-sm">Total Waste Summary</span>
            <Badge
              variant="outline"
              className="text-[10px] bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700"
            >
              Auto-calculated
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Total Waste Generated (Metric Tonnes)
              </Label>
              <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                {totalWasteGenerated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Avg. Waste Recycled (%)
              </Label>
              <div className="h-10 flex items-center px-3 text-lg font-semibold bg-background/80 rounded-md border">
                {avgRecycledPercentage}%
              </div>
            </div>
          </div>
          {facilities.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Add facilities below to see the total waste metrics
            </p>
          )}
        </div>

        {/* Add Facility Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Facility</Label>
          <p className="text-xs text-muted-foreground">
            Select the facility type for which you want to report waste metrics
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
            <Label className="text-sm font-medium">Waste by Facility</Label>
            <div className="space-y-4">
              {facilities.map((facility, facilityIndex) => (
                <div
                  key={facility.id}
                  className="p-4 border rounded-lg bg-muted/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CellNumberBadge kpiNumber={facilityIndex + 1} />
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {getFacilityLabel(facility.facilityType)}
                      </span>
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

                  {/* Waste Type Entries */}
                  {facility.wasteEntries.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-green-200 dark:border-green-800">
                      {facility.wasteEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 bg-background rounded-lg border space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              {getWasteTypeLabel(entry.type)}
                            </span>
                            {!readOnly && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveWasteEntry(facility.id, entry.id)
                                }
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Waste Generated (Metric Tonnes)
                              </Label>
                              <Input
                                type="number"
                                placeholder="Enter waste generated"
                                value={entry.wasteGenerated}
                                onChange={(e) =>
                                  handleWasteEntryChange(
                                    facility.id,
                                    entry.id,
                                    'wasteGenerated',
                                    e.target.value
                                  )
                                }
                                disabled={readOnly}
                                className="h-9"
                                step="0.01"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Waste Recycled (%)
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={entry.wasteRecycled}
                                  onChange={(e) =>
                                    handleWasteEntryChange(
                                      facility.id,
                                      entry.id,
                                      'wasteRecycled',
                                      e.target.value
                                    )
                                  }
                                  disabled={readOnly}
                                  min={0}
                                  max={100}
                                  className="h-9 w-24"
                                />
                                <span className="text-sm text-muted-foreground">
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Waste Type */}
                  {!readOnly && getAvailableWasteTypes(facility.id).length > 0 && (
                    <div className="pt-2">
                      <WasteTypeSelector
                        facilityId={facility.id}
                        availableTypes={getAvailableWasteTypes(facility.id)}
                        onAdd={handleAddWasteEntry}
                      />
                    </div>
                  )}

                  {facility.wasteEntries.length === 0 && (
                    <p className="text-xs text-muted-foreground pl-4">
                      No waste types added. Use the selector above to add waste
                      data.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {facilities.length === 0 && (
          <div className="text-center py-8 border rounded-lg border-dashed bg-muted/20">
            <Building2 className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No facilities added yet. Select a facility type above to get
              started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Sub-component for waste type selection
const WasteTypeSelector = ({
  facilityId,
  availableTypes,
  onAdd,
}: {
  facilityId: string;
  availableTypes: { value: string; label: string }[];
  onAdd: (facilityId: string, wasteType: string) => void;
}) => {
  const [selectedType, setSelectedType] = useState<string>('');

  const handleAdd = () => {
    if (selectedType) {
      onAdd(facilityId, selectedType);
      setSelectedType('');
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={selectedType || undefined} onValueChange={(value) => setSelectedType(value === '__clear__' ? '' : value)}>
        <SelectTrigger className="w-[220px] h-8 text-xs">
          <SelectValue placeholder="Add waste type..." />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-50">
          {selectedType && (
            <SelectItem value="__clear__" className="text-muted-foreground italic">
              Clear selection
            </SelectItem>
          )}
          {availableTypes.map((type) => (
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
        onClick={handleAdd}
        disabled={!selectedType}
        className="h-8 gap-1 text-xs"
      >
        <Plus className="w-3 h-3" />
        Add
      </Button>
    </div>
  );
};
