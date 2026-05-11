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
import { TrendingUp, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method: string | null;
}

interface RevenueAnalysisTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  historicalData?: Record<string, HistoricalValue>;
  readOnly?: boolean;
}

const REVENUE_ROWS = [
  { id: 'revenue_period', label: 'Revenue for the Period', unit: 'INR Cr' },
  { id: 'new_customers', label: 'New Customers Acquired', unit: 'Count' },
  { id: 'returning_customers', label: 'Returning Customers', unit: 'Count' },
  { id: 'plastic_per_revenue', label: 'Plastic Used per Cr Revenue', unit: 'MT' },
  { id: 'non_plastic_per_revenue', label: 'Non-Plastic per Cr Revenue', unit: 'MT' },
];

export const RevenueAnalysisTable = ({
  formData,
  onInputChange,
  historicalData = {},
  readOnly = false,
}: RevenueAnalysisTableProps) => {
  const getFieldKey = (id: string) => `revenue_${id}`;

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-esg-governance" />
          Revenue & Analysis
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px]">Metric</TableHead>
                <TableHead className="w-[140px]">Value</TableHead>
                <TableHead className="w-[150px]">Previous</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REVENUE_ROWS.map((row) => {
                const historical = getHistorical(row.id);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="0"
                          value={getValue(row.id)}
                          onChange={(e) => handleChange(row.id, e.target.value)}
                          className="w-28 h-8 text-sm"
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
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
