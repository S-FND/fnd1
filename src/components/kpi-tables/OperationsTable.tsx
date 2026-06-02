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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Factory, Info } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';
import { cn } from '@/lib/utils';

interface OperationsRow {
  id: string;
  category: string;
  description: string;
}

const OPERATIONS_ROWS: OperationsRow[] = [
  {
    id: 'rented_owned_corporate_office',
    category: 'Rented/Owned Corporate Office',
    description: 'Company-owned or rented corporate office spaces',
  },
  {
    id: 'coworking_corporate_office',
    category: 'Co-working corporate office',
    description: 'Shared/co-working corporate office spaces',
  },
  {
    id: 'owned_manufacturing_units',
    category: 'Owned manufacturing/factory units',
    description: 'Company-owned manufacturing or factory facilities',
  },
  {
    id: 'third_party_manufacturing',
    category: 'Third party manufacturing units',
    description: 'Outsourced/third-party manufacturing facilities',
  },
  {
    id: 'owned_warehouses',
    category: 'Owned warehouses',
    description: 'Company-owned warehouse/storage locations',
  },
  {
    id: 'third_party_logistics',
    category: 'Third party logistics providers including warehouses',
    description: 'Third-party logistics and warehouse partners',
  },
  {
    id: 'coco_stores',
    category: 'Company owned Company Operated (COCO) stores',
    description: 'Stores owned and operated by the company',
  },
  {
    id: 'foco_stores',
    category: 'Franchisee owned Company Operated (FOCO) stores',
    description: 'Stores owned by franchisees but operated by the company',
  },
];

interface OperationsTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

export const OperationsTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: OperationsTableProps) => {
  const getFieldKey = (id: string, field: string) =>
    `operations_${id}_${field}`;

  const getValue = (id: string, field: string) => {
    const key = getFieldKey(id, field);
    return (formData[key] as string) || '';
  };

  const isNA = (id: string) => {
    const key = getFieldKey(id, 'na');
    return formData[key] === 'true' || formData[key] === true;
  };

  const handleChange = (id: string, field: string, value: string) => {
    const key = getFieldKey(id, field);
    onInputChange(key, value);
  };

  const handleNAChange = (id: string, checked: boolean) => {
    const key = getFieldKey(id, 'na');
    onInputChange(key, checked ? 'true' : 'false');

    // Clear values when marking as N/A
    if (checked) {
      onInputChange(getFieldKey(id, 'count'), '');
    }
  };

  // Get MSME classification value
  const msmeValue = (formData['operations_msme_classification'] as string) || '';

  const handleMSMEChange = (value: string) => {
    onInputChange('operations_msme_classification', value);
  };

  return (
    <div className="space-y-6">
      {/* MSME Classification Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Factory className="w-4 h-4 text-esg-social" />
            Udhyam/MSME Certification
            <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CellNumberBadge kpiNumber={1} />
              <span className="text-sm font-medium">Udhyam/MSME Certification classification for the year</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm p-3" side="right">
                  <div className="space-y-2 text-xs">
                    <p className="font-medium">MSME Classification Criteria:</p>
                    <ul className="space-y-1.5">
                      <li><strong>1. Micro</strong> → Plant & Machinery Investment ≤ ₹2.5 Cr & Annual Turnover ≤ ₹10 Cr</li>
                      <li><strong>2. Small</strong> → Plant & Machinery Investment ≤ ₹25 Cr & Annual Turnover ≤ ₹100 Cr</li>
                      <li><strong>3. Medium</strong> → Plant & Machinery Investment ≤ ₹125 Cr & Annual Turnover ≤ ₹500 Cr</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={msmeValue || undefined}
              onValueChange={(value) => handleMSMEChange(value === '__clear__' ? '' : value)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {msmeValue && (
                  <SelectItem value="__clear__" className="text-muted-foreground italic">
                    Clear selection
                  </SelectItem>
                )}
                <SelectItem value="Micro/Small">Micro/Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Operations Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Factory className="w-4 h-4 text-esg-social" />
            Operations
            <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[350px] text-left font-semibold">
                    Category
                  </TableHead>

                  <TableHead className="w-[80px] text-center font-semibold">
                    N/A
                  </TableHead>

                  <TableHead className="w-[120px] text-left font-semibold">
                    Count
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {OPERATIONS_ROWS.map((row, index) => {
                  const rowIsNA = isNA(row.id);

                  // Operations KPIs are numbered 2-9
                  const kpiNumber = index + 2;

                  return (
                    <TableRow
                      key={row.id}
                      className={cn(
                        "align-top",
                        rowIsNA && "bg-muted/20"
                      )}
                    >
                      <TableCell className="font-medium text-left bg-muted/20">
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <CellNumberBadge kpiNumber={kpiNumber} />

                            <span>{row.category}</span>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 mt-0.5 text-muted-foreground cursor-help shrink-0" />
                              </TooltipTrigger>

                              <TooltipContent
                                side="right"
                                className="max-w-xs text-left"
                              >
                                <p>{row.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          <p className="text-xs text-muted-foreground ml-7">
                            {row.description}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-center py-2">
                        <Checkbox
                          checked={rowIsNA}
                          onCheckedChange={(checked) =>
                            handleNAChange(row.id, !!checked)
                          }
                          disabled={readOnly}
                          aria-label={`Mark ${row.category} as not applicable`}
                        />
                      </TableCell>

                      <TableCell className="text-left py-2">
                        <Input
                          type="number"
                          placeholder={rowIsNA ? "-" : "0"}
                          value={getValue(row.id, "count")}
                          onChange={(e) =>
                            handleChange(row.id, "count", e.target.value)
                          }
                          className="w-24 h-8 text-sm"
                          disabled={readOnly || rowIsNA}
                          min={0}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
