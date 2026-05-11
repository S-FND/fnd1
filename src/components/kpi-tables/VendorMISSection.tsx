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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ChevronDown, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CellNumberBadge } from './CellNumberBadge';

interface VendorMISSectionProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const VENDOR_CATEGORIES = [
  { id: 'input_materials', label: 'Input Materials', letterIndex: 'a' },
  { id: 'manufacturing', label: 'Manufacturing', letterIndex: 'b' },
  { id: 'packaging', label: 'Packaging', letterIndex: 'c' },
  { id: 'logistics_warehousing', label: 'Logistics & Warehousing', letterIndex: 'd' },
  { id: 'stores_clinics', label: 'Stores / Clinics', letterIndex: 'e' },
];

const SIZE_OPTIONS = [
  { value: 'mnc_large', label: 'MNC / Large Corporates' },
  { value: 'sme', label: 'SME' },
  { value: 'micro', label: 'Micro Enterprises' },
  { value: 'informal', label: 'Informal or Individuals' },
];

const DEI_OPTIONS = [
  { value: 'gender', label: 'Gender' },
  { value: 'low_income', label: 'Low Income' },
  { value: 'rural_remote', label: 'Rural or Remote Areas' },
  { value: 'others', label: 'Others' },
];

export const VendorMISSection = ({
  formData,
  onInputChange,
  readOnly = false,
}: VendorMISSectionProps) => {
  const getFieldKey = (category: string, field: string) =>
    `vendor_mis_${category}_${field}`;

  const getValue = (category: string, field: string): string => {
    const key = getFieldKey(category, field);
    return (formData[key] as string) || '';
  };

  const handleChange = (category: string, field: string, value: string) => {
    const key = getFieldKey(category, field);
    onInputChange(key, value);
  };

  const getSelectedDEI = (category: string): string[] => {
    const value = getValue(category, 'dei_factors');
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').filter(Boolean);
    }
  };

  const toggleDEI = (category: string, deiValue: string) => {
    const current = getSelectedDEI(category);
    const updated = current.includes(deiValue)
      ? current.filter((v) => v !== deiValue)
      : [...current, deiValue];
    handleChange(category, 'dei_factors', JSON.stringify(updated));
  };

  const getDEILabel = (category: string): string => {
    const selected = getSelectedDEI(category);
    if (selected.length === 0) return 'Select factors...';
    const labels = selected.map(
      (v) => DEI_OPTIONS.find((o) => o.value === v)?.label || v
    );
    if (labels.length <= 2) return labels.join(', ');
    return `${labels.length} selected`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CellNumberBadge kpiNumber={2} />
          <Building2 className="w-4 h-4 text-esg-social" />
          Vendor MIS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-2 bg-muted/50 border-b">
          <p className="text-sm text-muted-foreground">
            For each category, provide vendor details. Mark as "Not Applicable" if managed in-house.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Category</TableHead>
                <TableHead className="w-[160px]">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span>Number of significant Vendors/Suppliers</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">"Significant" = vendors accounting for more than 10% dependence in a category</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-xs font-normal text-muted-foreground">
                      (N/A if in-house)
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex flex-col">
                    <span>% International</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      (by value)
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <span>Typical nature of businesses</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Mark what most businesses in the given category represent</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <span>DEI Factors</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Mark what most businesses in the given category represent</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VENDOR_CATEGORIES.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium bg-muted/30">
                    <div className="flex items-center">
                      <CellNumberBadge kpiNumber={2} fieldLetter={category.letterIndex} />
                      {category.label}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="text"
                      placeholder="N/A or count"
                      value={getValue(category.id, 'num_vendors')}
                      onChange={(e) =>
                        handleChange(category.id, 'num_vendors', e.target.value)
                      }
                      className="h-8 text-sm w-24"
                      disabled={readOnly}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={getValue(category.id, 'pct_international')}
                        onChange={(e) =>
                          handleChange(category.id, 'pct_international', e.target.value)
                        }
                        className="w-16 h-8 text-sm"
                        disabled={readOnly}
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Select
                      value={getValue(category.id, 'size') || undefined}
                      onValueChange={(value) => handleChange(category.id, 'size', value === '__clear__' ? '' : value)}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="h-8 text-sm w-[160px]">
                        <SelectValue placeholder="Select size..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {getValue(category.id, 'size') && (
                          <SelectItem value="__clear__" className="text-muted-foreground italic">
                            Clear selection
                          </SelectItem>
                        )}
                        {SIZE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-2">
                    <Popover>
                      <PopoverTrigger asChild disabled={readOnly}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-sm w-[160px] justify-between font-normal"
                          disabled={readOnly}
                        >
                          <span className="truncate">{getDEILabel(category.id)}</span>
                          <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-2 bg-background z-50" align="start">
                        <div className="space-y-2">
                          {DEI_OPTIONS.map((option) => {
                            const isSelected = getSelectedDEI(category.id).includes(option.value);
                            return (
                              <div
                                key={option.value}
                                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                onClick={() => toggleDEI(category.id, option.value)}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleDEI(category.id, option.value)}
                                  disabled={readOnly}
                                />
                                <span className="text-sm">{option.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
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
