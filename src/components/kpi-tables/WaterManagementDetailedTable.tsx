import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';
interface WaterManagementDetailedTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const FACILITY_TYPES = [
  { id: 'office', label: 'Office' },
  { id: 'stores_coco', label: 'Stores (COCO)' },
  { id: 'warehouses', label: 'Warehouses' },
  { id: 'manufacturing', label: 'Manufacturing Plant' },
  { id: 'dark_stores', label: 'Dark Stores' },
  { id: 'distribution', label: 'Distribution Center' },
];

export const WaterManagementDetailedTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: WaterManagementDetailedTableProps) => {
  const getFieldKey = (facility: string, field: string) => `water_detailed_${facility}_${field}`;

  const getValue = (facility: string, field: string) => {
    const key = getFieldKey(facility, field);
    return (formData[key] as string) || '';
  };

  const isNA = (facility: string) => {
    const key = getFieldKey(facility, 'na');
    return formData[key] === 'true' || formData[key] === true;
  };

  const handleChange = (facility: string, field: string, value: string) => {
    const key = getFieldKey(facility, field);
    onInputChange(key, value);
  };

  const handleNAChange = (facility: string, checked: boolean) => {
    const key = getFieldKey(facility, 'na');
    onInputChange(key, checked ? 'true' : 'false');
    
    // Clear values when marking as N/A
    if (checked) {
      onInputChange(getFieldKey(facility, 'water_consumed'), '');
      onInputChange(getFieldKey(facility, 'fresh_water_pct'), '');
      onInputChange(getFieldKey(facility, 'wastewater_generated'), '');
      onInputChange(getFieldKey(facility, 'wastewater_recycled_pct'), '');
    }
  };

  // Calculate summary values for Water Resources
  const waterSummary = FACILITY_TYPES.reduce(
    (acc, facility) => {
      if (!isNA(facility.id)) {
        const consumed = parseFloat(getValue(facility.id, 'water_consumed')) || 0;
        const freshPct = parseFloat(getValue(facility.id, 'fresh_water_pct')) || 0;
        if (consumed > 0 || freshPct > 0) {
          acc.totalConsumed += consumed;
          acc.freshPctSum += freshPct;
          acc.facilityCount += 1;
        }
      }
      return acc;
    },
    { totalConsumed: 0, freshPctSum: 0, facilityCount: 0 }
  );

  // Calculate summary values for Wastewater Management
  const wastewaterSummary = FACILITY_TYPES.reduce(
    (acc, facility) => {
      if (!isNA(facility.id)) {
        const generated = parseFloat(getValue(facility.id, 'wastewater_generated')) || 0;
        const recycledPct = parseFloat(getValue(facility.id, 'wastewater_recycled_pct')) || 0;
        if (generated > 0 || recycledPct > 0) {
          acc.totalGenerated += generated;
          acc.recycledPctSum += recycledPct;
          acc.facilityCount += 1;
        }
      }
      return acc;
    },
    { totalGenerated: 0, recycledPctSum: 0, facilityCount: 0 }
  );

  const avgFreshWaterPct = waterSummary.facilityCount > 0 
    ? (waterSummary.freshPctSum / waterSummary.facilityCount).toFixed(1) 
    : '0';

  const avgWastewaterRecycledPct = wastewaterSummary.facilityCount > 0 
    ? (wastewaterSummary.recycledPctSum / wastewaterSummary.facilityCount).toFixed(1) 
    : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          Water Management
          <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
        </CardTitle>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground">Total Water Consumed</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              {waterSummary.totalConsumed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal">Thousand m³</span>
            </p>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-950/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
            <p className="text-xs text-muted-foreground">Avg. Fresh Water Consumed</p>
            <p className="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
              {avgFreshWaterPct}%
            </p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-950/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
            <p className="text-xs text-muted-foreground">Total Wastewater Generation</p>
            <p className="text-lg font-semibold text-teal-700 dark:text-teal-400">
              {wastewaterSummary.totalGenerated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal">Thousand m³</span>
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <p className="text-xs text-muted-foreground">Avg. Wastewater Recycled</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">
              {avgWastewaterRecycledPct}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[200px]">Facility Type</TableHead>
                <TableHead className="w-[60px] text-center">N/A</TableHead>
                <TableHead className="w-[160px]">Water Consumed (Thousand m³)</TableHead>
                <TableHead className="w-[120px]">Fresh Water (%)</TableHead>
                <TableHead className="w-[160px]">Wastewater Generation (Thousand m³)</TableHead>
                <TableHead className="w-[120px]">Wastewater Recycled (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FACILITY_TYPES.map((facility, index) => {
                const facilityIsNA = isNA(facility.id);
                const kpiNumber = index + 1;
                return (
                  <TableRow 
                    key={facility.id}
                    className={facilityIsNA ? 'bg-muted/20' : ''}
                  >
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center">
                        <CellNumberBadge kpiNumber={kpiNumber} />
                        {facility.label}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={facilityIsNA}
                        onCheckedChange={(checked) => handleNAChange(facility.id, !!checked)}
                        disabled={readOnly}
                        aria-label={`Mark ${facility.label} as not applicable`}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        placeholder={facilityIsNA ? '-' : '0'}
                        value={getValue(facility.id, 'water_consumed')}
                        onChange={(e) => handleChange(facility.id, 'water_consumed', e.target.value)}
                        className="w-28 h-8 text-sm"
                        disabled={readOnly || facilityIsNA}
                        min={0}
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder={facilityIsNA ? '-' : '0'}
                          value={getValue(facility.id, 'fresh_water_pct')}
                          onChange={(e) => handleChange(facility.id, 'fresh_water_pct', e.target.value)}
                          className="w-16 h-8 text-sm"
                          disabled={readOnly || facilityIsNA}
                          min={0}
                          max={100}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        placeholder={facilityIsNA ? '-' : '0'}
                        value={getValue(facility.id, 'wastewater_generated')}
                        onChange={(e) => handleChange(facility.id, 'wastewater_generated', e.target.value)}
                        className="w-28 h-8 text-sm"
                        disabled={readOnly || facilityIsNA}
                        min={0}
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder={facilityIsNA ? '-' : '0'}
                          value={getValue(facility.id, 'wastewater_recycled_pct')}
                          onChange={(e) => handleChange(facility.id, 'wastewater_recycled_pct', e.target.value)}
                          className="w-16 h-8 text-sm"
                          disabled={readOnly || facilityIsNA}
                          min={0}
                          max={100}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border-t text-sm text-muted-foreground space-y-1">
          <p className="text-xs">
            <strong>Note:</strong> Check "N/A" for facility types that are not applicable to your organization. Please only mention for facilities where there is significant water usage. Fresh water refers to water from municipal supply or groundwater sources.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Data sources: Municipal water bills, groundwater extraction records, ETP/STP logs, water reuse logs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
