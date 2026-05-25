import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
import { Package } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

interface PackagingDetailedTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | boolean) => void;
  readOnly?: boolean;
}

const SECONDARY_PACKAGING_ROWS = [
  { id: 'plastic_mt', label: 'Plastic packaging used', type: 'number', unit: 'Metric Tons', fieldLetter: 'a' },
  { id: 'plastic_cost', label: 'Plastic packaging cost', type: 'number', unit: 'INR Cr', fieldLetter: 'b' },
  { id: 'non_plastic_mt', label: 'Non-plastic packaging used', type: 'number', unit: 'Metric Tons', fieldLetter: 'c' },
  { id: 'non_plastic_cost', label: 'Non-plastic packaging cost', type: 'number', unit: 'INR Cr', fieldLetter: 'd' },
  { id: 'recycled_content_pct', label: 'Recycled content %', type: 'number', unit: '%', fieldLetter: 'e' },
  { id: 'type_description', label: 'Type of secondary packaging used', type: 'text', unit: 'Descriptive', fieldLetter: 'f' },
];

const TERTIARY_PACKAGING_ROWS = [
  { id: 'plastic_mt', label: 'Plastic packaging used', type: 'number', unit: 'Metric Tons', fieldLetter: 'a' },
  { id: 'plastic_cost', label: 'Plastic packaging cost', type: 'number', unit: 'INR Cr', fieldLetter: 'b' },
  { id: 'non_plastic_mt', label: 'Non-plastic packaging used', type: 'number', unit: 'Metric Tons', fieldLetter: 'c' },
  { id: 'non_plastic_cost', label: 'Non-plastic packaging cost', type: 'number', unit: 'INR Cr', fieldLetter: 'd' },
  { id: 'recycled_content_pct', label: 'Recycled content %', type: 'number', unit: '%', fieldLetter: 'e' },
  { id: 'type_description', label: 'Type of tertiary packaging used', type: 'text', unit: 'Descriptive', fieldLetter: 'f' },
];

const WASTE_MANAGEMENT_ROWS = [
  { id: 'plastic_disposed', label: 'Plastic waste disposed', type: 'number', unit: 'Metric Tons', fieldLetter: 'a' },
  { id: 'plastic_recycled', label: 'Plastic waste recycled', type: 'number', unit: 'Metric Tons', fieldLetter: 'b' },
  { id: 'epr_compliance_cost', label: 'EPR compliance cost', type: 'number', unit: 'INR Cr', fieldLetter: 'c' },
  { id: 'non_plastic_disposed', label: 'Non-plastic waste disposed', type: 'number', unit: 'Metric Tons', fieldLetter: 'd' },
  { id: 'non_plastic_recycled', label: 'Non-plastic waste recycled', type: 'number', unit: 'Metric Tons', fieldLetter: 'e' },
];

export const PackagingDetailedTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: PackagingDetailedTableProps) => {
  const getFieldKey = (section: string, id: string) => `pkg_detailed_${section}_${id}`;

  const getValue = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return (formData[key] as string) || '';
  };

  const handleChange = (section: string, id: string, value: string) => {
    const key = getFieldKey(section, id);
    onInputChange(key, value);
  };

  const reportTertiary = formData['pkg_detailed_report_tertiary'] === 'yes';

  const renderSection = (
    title: string, 
    sectionId: string, 
    rows: typeof SECONDARY_PACKAGING_ROWS,
    kpiNumber: number
  ) => (
    <div>
      <div className="px-4 py-2 bg-muted/50 border-b border-t">
        <h4 className="text-sm font-medium flex items-center">
          <CellNumberBadge kpiNumber={kpiNumber} />
          {title}
        </h4>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[350px]">Metric</TableHead>
              <TableHead className="w-[120px]">Unit</TableHead>
              <TableHead className="w-[250px]">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${sectionId}-${row.id}`}>
                <TableCell className="font-medium text-sm">
                  <div className="flex items-center">
                    <CellNumberBadge kpiNumber={kpiNumber} fieldLetter={row.fieldLetter} />
                    {row.label}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{row.unit}</Badge>
                </TableCell>
                <TableCell className="py-2">
                  {row.type === 'text' ? (
                    <Textarea
                      placeholder="Enter description..."
                      value={getValue(sectionId, row.id)}
                      onChange={(e) => handleChange(sectionId, row.id, e.target.value)}
                      className="min-h-[60px] text-sm"
                      disabled={readOnly}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={getValue(sectionId, row.id)}
                        onChange={(e) => handleChange(sectionId, row.id, e.target.value)}
                        className="w-32 h-8 text-sm"
                        disabled={readOnly}
                        min={row.unit === '%' ? 0 : undefined}
                        max={row.unit === '%' ? 100 : undefined}
                      />
                      {row.unit === 'Metric Tons' && (
                        <span className="text-xs text-muted-foreground">MT</span>
                      )}
                      {row.unit === 'INR Cr' && (
                        <span className="text-xs text-muted-foreground">Cr</span>
                      )}
                      {row.unit === '%' && (
                        <span className="text-xs text-muted-foreground">%</span>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-esg-environmental" />
          Packaging Metrics (Detailed)
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {/* Secondary Packaging Section */}
        {renderSection('Secondary Packaging', 'secondary', SECONDARY_PACKAGING_ROWS, 1)}

        {/* Tertiary Packaging Question */}
        <div className="px-4 py-4 bg-blue-50 dark:bg-blue-950/20 border-t border-b">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">
              Do you wish to report on Tertiary Packaging?
            </Label>
            <RadioGroup
              value={formData['pkg_detailed_report_tertiary'] as string || ''}
              onValueChange={(value) => onInputChange('pkg_detailed_report_tertiary', value)}
              className="flex gap-6"
              disabled={readOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tertiary-yes" />
                <Label htmlFor="tertiary-yes" className="font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tertiary-no" />
                <Label htmlFor="tertiary-no" className="font-normal cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Tertiary Packaging Section - Conditional */}
        {reportTertiary && renderSection('Tertiary Packaging', 'tertiary', TERTIARY_PACKAGING_ROWS, 2)}

        {/* Waste Management Section */}
        {renderSection('Waste Management', 'waste', WASTE_MANAGEMENT_ROWS, 3)}
      </CardContent>
    </Card>
  );
};