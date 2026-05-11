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
import { Droplets } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

interface WaterManagementTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const WATER_ROWS = [
  { 
    id: 'total_consumed_m3', 
    label: 'Total water consumed', 
    unit: 'Thousand m³',
    definition: 'Total water consumed (m³)'
  },
  { 
    id: 'total_consumed_stress_pct', 
    label: '% consumed in high/extremely high water stress regions', 
    unit: '%',
    definition: '% consumed in high/extremely high water stress regions'
  },
  { 
    id: 'total_discharged_m3', 
    label: 'Total water discharged', 
    unit: 'Thousand m³',
    definition: 'Total water discharged (m³)'
  },
  { 
    id: 'total_discharged_stress_pct', 
    label: '% discharged in high/extremely high water stress regions', 
    unit: '%',
    definition: '% discharged in high/extremely high water stress regions'
  },
];

export const WaterManagementTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: WaterManagementTableProps) => {
  const getFieldKey = (id: string) => `water_mgmt_${id}`;

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
          <Droplets className="w-4 h-4 text-blue-500" />
          Water Resources
          <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[400px]">Metric</TableHead>
                <TableHead className="w-[120px]">Unit</TableHead>
                <TableHead className="w-[200px]">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WATER_ROWS.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center">
                      <CellNumberBadge kpiNumber={index + 1} />
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
                      {row.unit === 'Thousand m³' && (
                        <span className="text-xs text-muted-foreground">k m³</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
