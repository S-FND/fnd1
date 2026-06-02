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
import { UserCheck, Clock, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { CellNumberBadge } from './CellNumberBadge';
import React from 'react';
import { cn } from '@/lib/utils';

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method?: string | null;
}

interface HistoricalEntry {
  quarter: string;
  value: string | null;
  confidence?: number;
}

interface LeadershipTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  historicalData?: Record<string, HistoricalValue | HistoricalEntry[]>;
  readOnly?: boolean;
  /** Starting KPI number (for continuation from previous sections) */
  startingKpiNumber?: number;
}

const CLEVEL_DESC = 'Founders or Senior executive leaders. Examples: CEO, CFO, COO, CMO, CPO, CTO.';
const COMPENSATION_DESC = 'Combining salary, performance-linked incentives, and equity. As reported in financial statements.';

// Base KPI numbers (will be offset by startingKpiNumber)
const LEADERSHIP_ROWS = [
  // C-Level first (KPI 1 relative)
  { id: 'clevel_total', category: 'C-Level', subcategory: 'Total Executives', field: 'count', description: CLEVEL_DESC, mandatory: true, relativeKpi: 1, fieldLetter: 'a' },
  { id: 'clevel_female', category: 'C-Level', subcategory: 'Female Executives', field: 'count', description: CLEVEL_DESC, mandatory: true, relativeKpi: 1, fieldLetter: 'b' },
  // Board second (KPI 2 relative)
  { id: 'board_total', category: 'Board', subcategory: 'Total Members', field: 'count', mandatory: true, relativeKpi: 2, fieldLetter: 'a' },
  { id: 'board_female', category: 'Board', subcategory: 'Female Members', field: 'count', mandatory: true, relativeKpi: 2, fieldLetter: 'b' },
  { id: 'board_independent', category: 'Board', subcategory: 'Independent Members', field: 'count', mandatory: true, relativeKpi: 2, fieldLetter: 'c' },
  // Compensation (KPI 3 relative)
  { id: 'avg_cxo_compensation', category: 'Compensation', subcategory: 'Average CXO Compensation', field: 'inr_cr', description: COMPENSATION_DESC, mandatory: false, relativeKpi: 3, fieldLetter: 'a' },
  { id: 'avg_employee_comp', category: 'Compensation', subcategory: 'Average Employee Compensation', field: 'inr_lakhs', description: 'Auto-calculated: Total Gross Wages / Total Employees', mandatory: false, isAuto: true, relativeKpi: 3, fieldLetter: 'b' },
];

export const LeadershipTable = ({
  formData,
  onInputChange,
  historicalData = {},
  readOnly = false,
  startingKpiNumber = 0,
}: LeadershipTableProps) => {
  const getFieldKey = (id: string) => `leadership_${id}`;
  const getEmployeeFieldKey = (id: string) => `employees_${id}`;

  const getValue = (id: string) => {
    const key = getFieldKey(id);
    return (formData[key] as string) || '';
  };

  const parseNum = (val: string | number | boolean | undefined) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || 0;
    return 0;
  };

  // Calculate average employee compensation from employees table data
  const getAvgEmployeeComp = (): string => {
    // Get total wages from employees table (WC + BC)
    const wcWagesMale = parseNum(formData[getEmployeeFieldKey('wc_wages_male')]);
    const wcWagesFemale = parseNum(formData[getEmployeeFieldKey('wc_wages_female')]);
    const bcWagesMale = parseNum(formData[getEmployeeFieldKey('bc_wages_male')]);
    const bcWagesFemale = parseNum(formData[getEmployeeFieldKey('bc_wages_female')]);
    const totalWagesCr = wcWagesMale + wcWagesFemale + bcWagesMale + bcWagesFemale;

    // Get total employees from employees table
    const wcMaleFulltime = parseNum(formData[getEmployeeFieldKey('wc_male_fulltime')]);
    const wcMaleContractual = parseNum(formData[getEmployeeFieldKey('wc_male_contractual')]);
    const wcMaleParttime = parseNum(formData[getEmployeeFieldKey('wc_male_parttime')]);
    const wcFemaleFulltime = parseNum(formData[getEmployeeFieldKey('wc_female_fulltime')]);
    const wcFemaleContractual = parseNum(formData[getEmployeeFieldKey('wc_female_contractual')]);
    const wcFemaleParttime = parseNum(formData[getEmployeeFieldKey('wc_female_parttime')]);
    const bcMaleFulltime = parseNum(formData[getEmployeeFieldKey('bc_male_fulltime')]);
    const bcMaleContractual = parseNum(formData[getEmployeeFieldKey('bc_male_contractual')]);
    const bcMaleParttime = parseNum(formData[getEmployeeFieldKey('bc_male_parttime')]);
    const bcFemaleFulltime = parseNum(formData[getEmployeeFieldKey('bc_female_fulltime')]);
    const bcFemaleContractual = parseNum(formData[getEmployeeFieldKey('bc_female_contractual')]);
    const bcFemaleParttime = parseNum(formData[getEmployeeFieldKey('bc_female_parttime')]);

    const totalEmployees = wcMaleFulltime + wcMaleContractual + wcMaleParttime +
      wcFemaleFulltime + wcFemaleContractual + wcFemaleParttime +
      bcMaleFulltime + bcMaleContractual + bcMaleParttime +
      bcFemaleFulltime + bcFemaleContractual + bcFemaleParttime;

    if (totalEmployees === 0) return '-';

    // Convert Cr to Lakhs (1 Cr = 100 Lakhs), then divide by employees
    const totalWagesLakhs = totalWagesCr * 100;
    const avgCompLakhs = totalWagesLakhs / totalEmployees;
    return avgCompLakhs.toFixed(2);
  };

  // Helper to normalize historical data - handles both array and object formats
  const getHistorical = (id: string): HistoricalValue | null => {
    const key = getFieldKey(id);
    const data = historicalData[key];
    if (!data) return null;

    // If it's an array, return the first entry
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      const first = data[0];
      return {
        value: first.value,
        quarter: first.quarter,
        confidence: first.confidence || 0,
        method: null,
      };
    }

    // If it's already a single object
    return data;
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
  const groupedRows = LEADERSHIP_ROWS.reduce((acc, row) => {
    if (!acc[row.category]) acc[row.category] = [];
    acc[row.category].push(row);
    return acc;
  }, {} as Record<string, typeof LEADERSHIP_ROWS>);

  const getUnit = (field: string) => {
    if (field === 'inr_cr') return 'INR Cr';
    if (field === 'inr_lakhs') return 'INR L';
    return '';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-esg-governance" />
          Leadership & Compensation
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[160px] text-left font-semibold">
                  Category
                </TableHead>

                <TableHead className="min-w-[320px] text-left font-semibold">
                  Metric
                </TableHead>

                <TableHead className="w-[180px] text-left font-semibold">
                  Value
                </TableHead>

                <TableHead className="w-[240px] text-left font-semibold">
                  Previous Value
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.entries(groupedRows).map(([category, rows]) => (
                <React.Fragment key={category}>
                  {rows.map((row, idx) => {
                    const historical = getHistorical(row.id);

                    const isAutoField = row.isAuto;

                    const displayValue =
                      isAutoField && row.id === "avg_employee_comp"
                        ? getAvgEmployeeComp()
                        : getValue(row.id);

                    return (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "align-top",
                          isAutoField && "bg-amber-50/50"
                        )}
                      >
                        {/* CATEGORY */}
                        {idx === 0 && (
                          <TableCell
                            rowSpan={rows.length}
                            className="align-top font-medium bg-muted/30 text-left"
                          >
                            {category}
                          </TableCell>
                        )}

                        {/* METRIC */}
                        <TableCell className="text-left">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                              <CellNumberBadge
                                kpiNumber={startingKpiNumber + row.relativeKpi}
                                fieldLetter={row.fieldLetter}
                              />

                              <span className="font-medium">
                                {row.subcategory}
                              </span>

                              {row.description && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 mt-0.5 text-muted-foreground cursor-help shrink-0" />
                                  </TooltipTrigger>

                                  <TooltipContent
                                    side="right"
                                    className="max-w-xs text-left"
                                  >
                                    <p className="text-xs">
                                      {row.description}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {isAutoField && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-amber-50 text-amber-700 border-amber-200"
                                >
                                  Auto
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* VALUE */}
                        <TableCell className="text-left">
                          {isAutoField ? (
                            <div className="w-28 h-8 flex items-center px-3 text-sm font-medium bg-muted/50 rounded-md border">
                              {displayValue}
                              {displayValue !== "-" &&
                                getUnit(row.field) &&
                                ` ${getUnit(row.field)}`}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                placeholder="0"
                                value={getValue(row.id)}
                                onChange={(e) =>
                                  handleChange(row.id, e.target.value)
                                }
                                className="w-24 h-8 text-sm"
                                disabled={readOnly}
                              />

                              {getUnit(row.field) && (
                                <span className="text-xs text-muted-foreground">
                                  {getUnit(row.field)}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>

                        {/* PREVIOUS */}
                        <TableCell className="text-left">
                          {!isAutoField &&
                            historical &&
                            historical.value ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyHistorical(
                                      row.id,
                                      historical.value
                                    )
                                  }
                                  className={cn(
                                    "inline-flex items-center gap-1",
                                    "text-[10px] px-2 py-1 rounded-md",
                                    "bg-muted hover:bg-muted/80",
                                    "transition-colors text-left"
                                  )}
                                >
                                  <span className="font-medium text-muted-foreground">
                                    {historical.quarter}:
                                  </span>

                                  <span className="text-foreground">
                                    {historical.value}
                                  </span>

                                  <Copy className="w-2.5 h-2.5 opacity-40" />
                                </button>
                              </TooltipTrigger>

                              <TooltipContent
                                side="left"
                                className="text-left"
                              >
                                <div className="space-y-1">
                                  <p className="text-xs font-medium">
                                    {historical.quarter}
                                  </p>

                                  <p className="text-xs">
                                    Value: {historical.value}
                                  </p>

                                  <p className="text-xs text-muted-foreground">
                                    Click to copy
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
