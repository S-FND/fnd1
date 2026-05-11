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
import { Textarea } from '@/components/ui/textarea';
import { PackageOpen } from 'lucide-react';

interface PackagingBasicTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const PACKAGING_ROWS = [
  { id: 'virgin_recyclable_type', label: 'Type of virgin recyclable plastic used', type: 'text', unit: 'Descriptive' },
  { id: 'virgin_recyclable_mt', label: 'Virgin Recyclable Plastic used', type: 'number', unit: 'Metric Tons' },
  { id: 'virgin_recyclable_cost', label: 'Virgin Recyclable Plastic used', type: 'number', unit: 'Cost in INR Cr' },
  { id: 'virgin_non_recyclable_type', label: 'Type of virgin non-recyclable plastic used', type: 'text', unit: 'Descriptive' },
  { id: 'virgin_non_recyclable_mt', label: 'Virgin Non-recyclable Plastic used', type: 'number', unit: 'Metric Tons' },
  { id: 'virgin_non_recyclable_cost', label: 'Virgin Non-recyclable Plastic used', type: 'number', unit: 'Cost in INR Cr' },
  { id: 'recycled_type_supplier', label: 'Type of recycled plastic & details of supplier', type: 'text', unit: 'Descriptive' },
  { id: 'recycled_mt', label: 'Recycled Plastic used', type: 'number', unit: 'Metric Tons' },
  { id: 'recycled_cost', label: 'Recycled Plastic used', type: 'number', unit: 'Cost in INR Cr' },
];

export const PackagingBasicTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: PackagingBasicTableProps) => {
  const getFieldKey = (id: string) => `pkg_basic_${id}`;

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
          <PackageOpen className="w-4 h-4 text-esg-environmental" />
          Packaging Metrics (Basic) - Plastic Packaging
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-2 bg-muted/50 border-b">
          <h4 className="text-sm font-medium">Primary Packaging</h4>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[350px]">Sub-Category</TableHead>
                <TableHead className="w-[120px]">Metric Type</TableHead>
                <TableHead className="w-[250px]">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PACKAGING_ROWS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-sm">{row.label}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{row.unit}</Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    {row.type === 'text' ? (
                      <Textarea
                        placeholder="Enter description..."
                        value={getValue(row.id)}
                        onChange={(e) => handleChange(row.id, e.target.value)}
                        className="min-h-[60px] text-sm"
                        disabled={readOnly}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="0"
                          value={getValue(row.id)}
                          onChange={(e) => handleChange(row.id, e.target.value)}
                          className="w-32 h-8 text-sm"
                          disabled={readOnly}
                        />
                        {row.unit === 'Metric Tons' && (
                          <span className="text-xs text-muted-foreground">MT</span>
                        )}
                        {row.unit === 'Cost in INR Cr' && (
                          <span className="text-xs text-muted-foreground">Cr</span>
                        )}
                      </div>
                    )}
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
