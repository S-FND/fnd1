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
import { Zap } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';
import { cn } from '@/lib/utils';

interface EnergyManagementDetailedTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const FACILITY_TYPES = [
  { id: 'office', label: 'Office', letterIndex: 'a' },
  { id: 'stores_coco', label: 'Stores (COCO)', letterIndex: 'b' },
  { id: 'warehouses', label: 'Warehouses (Significant Storage - 50% rented)', letterIndex: 'c' },
  { id: 'manufacturing', label: 'Manufacturing / Production', letterIndex: 'd' },
  { id: 'data_center', label: 'Data Center', letterIndex: 'e' },
  { id: 'retail', label: 'Retail Outlets', letterIndex: 'f' },
  { id: 'distribution', label: 'Distribution Center', letterIndex: 'g' },
];

export const EnergyManagementDetailedTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: EnergyManagementDetailedTableProps) => {
  const getFieldKey = (facility: string, field: string) => `energy_detailed_${facility}_${field}`;

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
      onInputChange(getFieldKey(facility, 'energy_consumed'), '');
      onInputChange(getFieldKey(facility, 'renewable_pct'), '');
    }
  };

  // Calculate summary values
  const summary = FACILITY_TYPES.reduce(
    (acc, facility) => {
      if (!isNA(facility.id)) {
        const energy = parseFloat(getValue(facility.id, 'energy_consumed')) || 0;
        const renewable = parseFloat(getValue(facility.id, 'renewable_pct')) || 0;
        if (energy > 0 || renewable > 0) {
          acc.totalEnergy += energy;
          acc.renewableSum += renewable;
          acc.facilityCount += 1;
        }
      }
      return acc;
    },
    { totalEnergy: 0, renewableSum: 0, facilityCount: 0 }
  );

  const avgRenewable = summary.facilityCount > 0
    ? (summary.renewableSum / summary.facilityCount).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Energy Management
          <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
        </CardTitle>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-muted-foreground">Total Energy Consumed</p>
            <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">
              {summary.totalEnergy.toLocaleString()} <span className="text-sm font-normal">kWh</span>
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <p className="text-xs text-muted-foreground">Avg. Renewable Energy</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">
              {avgRenewable}%
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

                <TableHead className="w-[260px] text-left font-semibold">
                  Energy Consumed
                </TableHead>

                <TableHead className="w-[220px] text-left font-semibold">
                  % Renewable
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {FACILITY_TYPES.map((facility, index) => {
                const facilityIsNA = isNA(facility.id);
                const kpiNumber = index + 1;

                return (
                  <TableRow
                    key={facility.id}
                    className={cn(
                      "align-top",
                      facilityIsNA && "bg-muted/20"
                    )}
                  >
                    <TableCell className="text-left text-muted-foreground">
                      <CellNumberBadge kpiNumber={kpiNumber} />
                    </TableCell>

                    <TableCell className="font-medium text-left">
                      {facility.label}
                    </TableCell>

                    <TableCell className="text-center py-2">
                      <Checkbox
                        checked={facilityIsNA}
                        onCheckedChange={(checked) =>
                          handleNAChange(facility.id, !!checked)
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
                            "energy_consumed"
                          )}
                          onChange={(e) =>
                            handleChange(
                              facility.id,
                              "energy_consumed",
                              e.target.value
                            )
                          }
                          className="w-28 h-8 text-sm"
                          disabled={readOnly || facilityIsNA}
                          min={0}
                        />

                        <span className="text-xs text-muted-foreground">
                          kWh
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
                            "renewable_pct"
                          )}
                          onChange={(e) =>
                            handleChange(
                              facility.id,
                              "renewable_pct",
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

        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border-t text-sm text-muted-foreground">
          <p className="text-xs">
            <strong>Note:</strong> Check "N/A" for facility types that are not applicable to your organization. Warehouses refer to those where company occupies significant area (50%+ rented by company).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
