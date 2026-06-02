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
import { Recycle } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';
import { cn } from '@/lib/utils';

interface WasteManagementTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const FACILITY_TYPES = [
  { id: 'office', label: 'Office', number: 1 },
  { id: 'stores_coco', label: 'Stores (COCO)', number: 2 },
  { id: 'warehouses', label: 'Warehouses', number: 3 },
  { id: 'manufacturing', label: 'Manufacturing Plant', number: 4 },
  { id: 'dark_stores', label: 'Dark Stores', number: 5 },
  { id: 'distribution', label: 'Distribution Center', number: 6 },
];

export const WasteManagementTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: WasteManagementTableProps) => {
  const getFieldKey = (facility: string, field: string) => `waste_detailed_${facility}_${field}`;

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
      onInputChange(getFieldKey(facility, 'waste_generated'), '');
      onInputChange(getFieldKey(facility, 'waste_recycled_pct'), '');
    }
  };

  // Calculate summary values
  const summary = FACILITY_TYPES.reduce(
    (acc, facility) => {
      if (!isNA(facility.id)) {
        const generated = parseFloat(getValue(facility.id, 'waste_generated')) || 0;
        const recycledPct = parseFloat(getValue(facility.id, 'waste_recycled_pct')) || 0;
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

  const avgRecycledPct = summary.facilityCount > 0
    ? (summary.recycledPctSum / summary.facilityCount).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Recycle className="w-4 h-4 text-green-500" />
          Waste Management
          <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
        </CardTitle>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-muted-foreground">Total Waste Generated</p>
            <p className="text-lg font-semibold text-amber-700 dark:text-amber-400">
              {summary.totalGenerated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal">Metric Tonnes</span>
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <p className="text-xs text-muted-foreground">Avg. Waste Recycled</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">
              {avgRecycledPct}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[60px] text-left font-semibold">
                  Sno
                </TableHead>

                <TableHead className="min-w-[300px] text-left font-semibold">
                  Facility Type
                </TableHead>

                <TableHead className="w-[100px] text-center font-semibold">
                  N/A
                </TableHead>

                <TableHead className="w-[280px] text-left font-semibold">
                  Waste Generated
                </TableHead>

                <TableHead className="w-[220px] text-left font-semibold">
                  Waste Recycled (%)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {FACILITY_TYPES.map((facility) => {
                const facilityIsNA = isNA(facility.id);

                return (
                  <TableRow
                    key={facility.id}
                    className={cn(
                      "align-top",
                      facilityIsNA && "bg-muted/20"
                    )}
                  >
                    <TableCell className="text-left text-muted-foreground">
                      <CellNumberBadge
                        kpiNumber={facility.number}
                      />
                    </TableCell>

                    <TableCell className="font-medium text-left">
                      {facility.label}
                    </TableCell>

                    <TableCell className="text-center">
                      <Checkbox
                        checked={facilityIsNA}
                        onCheckedChange={(checked) =>
                          handleNAChange(
                            facility.id,
                            !!checked
                          )
                        }
                        disabled={readOnly}
                        aria-label={`Mark ${facility.label} as not applicable`}
                      />
                    </TableCell>

                    <TableCell className="text-left py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder={facilityIsNA ? "-" : "0"}
                          value={getValue(
                            facility.id,
                            "waste_generated"
                          )}
                          onChange={(e) =>
                            handleChange(
                              facility.id,
                              "waste_generated",
                              e.target.value
                            )
                          }
                          className="w-28 h-8 text-sm"
                          disabled={readOnly || facilityIsNA}
                          min={0}
                          step="0.01"
                        />

                        <span className="text-xs text-muted-foreground">
                          MT
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-left py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder={facilityIsNA ? "-" : "0"}
                          value={getValue(
                            facility.id,
                            "waste_recycled_pct"
                          )}
                          onChange={(e) =>
                            handleChange(
                              facility.id,
                              "waste_recycled_pct",
                              e.target.value
                            )
                          }
                          className="w-20 h-8 text-sm"
                          disabled={readOnly || facilityIsNA}
                          min={0}
                          max={100}
                        />

                        <span className="text-xs text-muted-foreground">
                          %
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="px-4 py-3 bg-green-50 dark:bg-green-950/20 border-t text-sm text-muted-foreground space-y-1">
          <p className="text-xs">
            <strong>Note:</strong> Check "N/A" for facility types that are not applicable to your organization. Include all solid waste, except packaging waste generated including organic, inorganic, and hazardous waste.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
