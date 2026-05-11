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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method: string | null;
}

interface EnergyConsumptionTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  historicalData?: Record<string, HistoricalValue>;
  readOnly?: boolean;
}

const ENERGY_ROWS = [
  { id: 'office_electricity', category: 'Office', type: 'Electricity', unit: 'kWh' },
  { id: 'office_fuel', category: 'Office', type: 'Fuel', unit: 'Liters' },
  { id: 'warehouse_electricity', category: 'Warehouses', type: 'Electricity', unit: 'kWh' },
  { id: 'warehouse_fuel', category: 'Warehouses', type: 'Fuel', unit: 'Liters' },
  { id: 'store_electricity', category: 'Stores', type: 'Electricity', unit: 'kWh' },
  { id: 'store_fuel', category: 'Stores', type: 'Fuel', unit: 'Liters' },
  { id: 'renewable_solar', category: 'Renewable', type: 'Solar', unit: 'kWh' },
  { id: 'renewable_wind', category: 'Renewable', type: 'Wind', unit: 'kWh' },
  { id: 'renewable_other', category: 'Renewable', type: 'Other', unit: 'kWh' },
];

export const EnergyConsumptionTable = ({
  formData,
  onInputChange,
  historicalData = {},
  readOnly = false,
}: EnergyConsumptionTableProps) => {
  const getFieldKey = (id: string) => `energy_${id}`;

  const getValue = (id: string) => {
    const key = getFieldKey(id);
    return (formData[key] as string) || '';
  };

  const getHistorical = (id: string) => {
    const key = getFieldKey(id);
    return historicalData[key];
  };

  const handleChange = (id: string, value: string) => {
    const key = getFieldKey(id);
    onInputChange(key, value);
  };

  const handleCopyHistorical = (id: string, value: string) => {
    handleChange(id, value);
    toast.success('Historical value copied');
  };

  // Group rows by category
  const groupedRows = ENERGY_ROWS.reduce((acc, row) => {
    if (!acc[row.category]) acc[row.category] = [];
    acc[row.category].push(row);
    return acc;
  }, {} as Record<string, typeof ENERGY_ROWS>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-esg-environmental" />
          Energy Consumption
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[140px]">Location</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[140px]">Value</TableHead>
                <TableHead className="w-[150px]">Previous</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedRows).map(([category, rows]) =>
                rows.map((row, idx) => {
                  const historical = getHistorical(row.id);
                  return (
                    <TableRow key={row.id}>
                      {idx === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          className="align-top font-medium bg-muted/30"
                        >
                          {category}
                        </TableCell>
                      )}
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-xs">{row.type}</Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            placeholder="0"
                            value={getValue(row.id)}
                            onChange={(e) => handleChange(row.id, e.target.value)}
                            className="w-24 h-8 text-sm"
                            disabled={readOnly}
                          />
                          <span className="text-xs text-muted-foreground">{row.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        {historical && historical.value ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleCopyHistorical(row.id, historical.value!)}
                                className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md cursor-pointer hover:bg-primary/20 transition-colors"
                              >
                                <Clock className="w-3 h-3" />
                                <span>{historical.quarter}: {historical.value}</span>
                                <Copy className="w-3 h-3 ml-1" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Click to copy to current field</TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
