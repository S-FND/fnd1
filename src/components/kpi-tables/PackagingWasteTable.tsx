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
import { Package, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method: string | null;
}

interface PackagingWasteTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  historicalData?: Record<string, HistoricalValue>;
  readOnly?: boolean;
}

const PACKAGING_SECTIONS = [
  {
    title: 'Plastic Packaging',
    id: 'plastic',
    rows: [
      { id: 'primary', label: 'Primary Packaging', unit: 'MT' },
      { id: 'secondary', label: 'Secondary Packaging', unit: 'MT' },
      { id: 'tertiary', label: 'Tertiary Packaging', unit: 'MT' },
    ],
  },
  {
    title: 'Non-Plastic Packaging',
    id: 'non_plastic',
    rows: [
      { id: 'primary', label: 'Primary Packaging', unit: 'MT' },
      { id: 'secondary', label: 'Secondary Packaging', unit: 'MT' },
      { id: 'tertiary', label: 'Tertiary Packaging', unit: 'MT' },
    ],
  },
  {
    title: 'Plastic Waste',
    id: 'plastic_waste',
    rows: [
      { id: 'disposed', label: 'Disposed', unit: 'MT' },
      { id: 'recycled', label: 'Recycled', unit: 'MT' },
      { id: 'epr_cost', label: 'EPR Compliance Cost', unit: 'INR Cr' },
    ],
  },
  {
    title: 'Non-Plastic Waste',
    id: 'non_plastic_waste',
    rows: [
      { id: 'disposed', label: 'Disposed', unit: 'MT' },
      { id: 'recycled', label: 'Recycled', unit: 'MT' },
    ],
  },
];

export const PackagingWasteTable = ({
  formData,
  onInputChange,
  historicalData = {},
  readOnly = false,
}: PackagingWasteTableProps) => {
  const getFieldKey = (section: string, id: string) => `packaging_${section}_${id}`;

  const getValue = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return (formData[key] as string) || '';
  };

  const getHistorical = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return historicalData[key];
  };

  const handleChange = (section: string, id: string, value: string) => {
    const key = getFieldKey(section, id);
    onInputChange(key, value);
  };

  const handleCopyHistorical = (section: string, id: string, value: string) => {
    handleChange(section, id, value);
    toast.success('Historical value copied');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-esg-environmental" />
          Packaging & Waste
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {PACKAGING_SECTIONS.map((section) => (
          <div key={section.id}>
            <div className="px-4 py-2 bg-muted/50 border-b border-t">
              <h4 className="text-sm font-medium">{section.title}</h4>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Type</TableHead>
                    <TableHead className="w-[140px]">Value</TableHead>
                    <TableHead className="w-[150px]">Previous</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.rows.map((row) => {
                    const historical = getHistorical(section.id, row.id);
                    return (
                      <TableRow key={`${section.id}-${row.id}`}>
                        <TableCell className="font-medium">{row.label}</TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              placeholder="0"
                              value={getValue(section.id, row.id)}
                              onChange={(e) => handleChange(section.id, row.id, e.target.value)}
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
                                  onClick={() => handleCopyHistorical(section.id, row.id, historical.value!)}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
