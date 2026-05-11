import { Input } from '@/components/ui/input';
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

interface EnergyManagementBasicTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const ENERGY_ROWS = [
  { 
    id: 'office_electricity', 
    label: 'Total energy consumed at Office - Electricity', 
    unit: 'kWh',
    definition: 'Total electricity use at corporate offices (kWh) for the reporting period.'
  },
  { 
    id: 'office_fuel', 
    label: 'Total energy consumed at Office - Fuel', 
    unit: 'kWh',
    definition: 'Total fuel use at corporate offices (kWh equivalent) for the reporting period.'
  },
  { 
    id: 'office_renewable_pct', 
    label: 'Energy % - Renewable Source (Office)', 
    unit: '%',
    definition: 'Percentage of office energy from renewable sources.'
  },
];

export const EnergyManagementBasicTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: EnergyManagementBasicTableProps) => {
  const getFieldKey = (id: string) => `energy_basic_${id}`;

  const getValue = (id: string) => {
    const key = getFieldKey(id);
    return (formData[key] as string) || '';
  };

  const handleChange = (id: string, value: string) => {
    const key = getFieldKey(id);
    onInputChange(key, value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Energy Management
          <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-2 bg-muted/50 border-b">
          <h4 className="text-sm font-medium">Energy Consumption - Office</h4>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[400px]">Sub-Category</TableHead>
                <TableHead className="w-[120px]">Unit</TableHead>
                <TableHead className="w-[200px]">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ENERGY_ROWS.map((row, index) => {
                const kpiNumber = index + 1;
                return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <CellNumberBadge kpiNumber={kpiNumber} fieldLetter="a" />
                      {row.label}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{row.unit}</Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={getValue(row.id)}
                        onChange={(e) => handleChange(row.id, e.target.value)}
                        className="w-32 h-8 text-sm"
                        disabled={readOnly}
                        min={row.unit === '%' ? 0 : undefined}
                        max={row.unit === '%' ? 100 : undefined}
                      />
                      {row.unit === '%' && (
                        <span className="text-xs text-muted-foreground">%</span>
                      )}
                      {row.unit === 'kWh' && (
                        <span className="text-xs text-muted-foreground">kWh</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
