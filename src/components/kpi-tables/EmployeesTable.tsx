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
import { Users, Clock, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { CellNumberBadge } from './CellNumberBadge';
import React from 'react';
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

interface EmployeesTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  historicalData?: Record<string, HistoricalValue | HistoricalEntry[]>;
  readOnly?: boolean;
}

interface EmployeeRow {
  id: string;
  label: string;
  metricType: 'Count' | 'INR Cr' | 'Rating' | 'Percentage' | 'eNPS';
  isAuto: boolean;
  section: string;
  subsection: string;
  description?: string;
  mandatory?: boolean;
  measurementPeriod?: 'As of Date' | 'For the Quarter';
}

const WC_FULLTIME_DESC = 'Full-time salaried employees (office, HQ, marketing, R&D, finance). They are usually salaried and work with information rather than physical goods.';
const WC_CONTRACTUAL_DESC = 'Fixed-term, or part-time contractual employees. Usually paid on a pre-defined output or time basis. Not salaried employees.';
const BC_FULLTIME_DESC = 'Full time operational or shop-floor staff who do hands-on, physical, or task-based work essential to producing, packaging or moving the product.';
const BC_CONTRACTUAL_DESC = 'Fixed-term, or part-time contractual employees. Usually paid on a pre-defined output or time basis. Not salaried employees.';
const TOTAL_DESC = 'Sum total for all 3 months of the quarter';

const EMPLOYEE_ROWS: EmployeeRow[] = [
  // White-Collar Employees (excluding C-Level & Board) - MANDATORY - As of Date
  { id: 'wc_male_fulltime', label: 'Male (Full-Time)', metricType: 'Count', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: WC_FULLTIME_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'wc_male_contractual', label: 'Male (Contractual)', metricType: 'Count', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: WC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'wc_male_parttime', label: 'Male (Part-time)', metricType: 'Count', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: WC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'wc_female_fulltime', label: 'Female (Full-Time)', metricType: 'Count', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: WC_FULLTIME_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'wc_female_contractual', label: 'Female (Contractual)', metricType: 'Count', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: WC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'wc_female_parttime', label: 'Female (Part-time)', metricType: 'Count', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: WC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'wc_total_employees', label: 'Total White Collar Employees', metricType: 'Count', isAuto: true, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'Employees', description: TOTAL_DESC },

  // White Collar Wages (excluding C-Level & Board) - MANDATORY - For the Quarter
  { id: 'wc_wages_male', label: 'Male', metricType: 'INR Cr', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'White Collar Wages (excluding C-Level & Board)', description: TOTAL_DESC, mandatory: true, measurementPeriod: 'For the Quarter' },
  { id: 'wc_wages_female', label: 'Female', metricType: 'INR Cr', isAuto: false, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'White Collar Wages (excluding C-Level & Board)', description: TOTAL_DESC, mandatory: true, measurementPeriod: 'For the Quarter' },
  { id: 'wc_total_wages', label: 'Total White Collar Wages', metricType: 'INR Cr', isAuto: true, section: 'White Collar Employees (excluding C-Level & Board)', subsection: 'White Collar Wages (excluding C-Level & Board)' },

  // Blue-Collar Employees - MANDATORY - As of Date
  { id: 'bc_male_fulltime', label: 'Male (Full-Time)', metricType: 'Count', isAuto: false, section: 'Blue-Collar', subsection: 'Employees', description: BC_FULLTIME_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'bc_male_contractual', label: 'Male (Contractual)', metricType: 'Count', isAuto: false, section: 'Blue-Collar', subsection: 'Employees', description: BC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'bc_male_parttime', label: 'Male (Part-time)', metricType: 'Count', isAuto: false, section: 'Blue-Collar', subsection: 'Employees', description: BC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'bc_female_fulltime', label: 'Female (Full-Time)', metricType: 'Count', isAuto: false, section: 'Blue-Collar', subsection: 'Employees', description: BC_FULLTIME_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'bc_female_contractual', label: 'Female (Contractual)', metricType: 'Count', isAuto: false, section: 'Blue-Collar', subsection: 'Employees', description: BC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'bc_female_parttime', label: 'Female (Part-time)', metricType: 'Count', isAuto: false, section: 'Blue-Collar', subsection: 'Employees', description: BC_CONTRACTUAL_DESC, mandatory: true, measurementPeriod: 'As of Date' },
  { id: 'bc_total_employees', label: 'Total Blue-Collar Employees', metricType: 'Count', isAuto: true, section: 'Blue-Collar', subsection: 'Employees', description: TOTAL_DESC },

  // Blue-Collar Wages - MANDATORY - For the Quarter
  { id: 'bc_wages_male', label: 'Male', metricType: 'INR Cr', isAuto: false, section: 'Blue-Collar', subsection: 'Gross Wages', mandatory: true, measurementPeriod: 'For the Quarter' },
  { id: 'bc_wages_female', label: 'Female', metricType: 'INR Cr', isAuto: false, section: 'Blue-Collar', subsection: 'Gross Wages', mandatory: true, measurementPeriod: 'For the Quarter' },
  { id: 'bc_total_wages', label: 'Total Blue-Collar Gross Wages', metricType: 'INR Cr', isAuto: true, section: 'Blue-Collar', subsection: 'Gross Wages' },

  // Overall Totals - Auto calculated
  { id: 'total_employment', label: 'Total Employment (White-Collar + Blue-Collar)', metricType: 'Count', isAuto: true, section: 'Overall', subsection: 'Totals' },
  { id: 'total_wages', label: 'Total Gross Wages (White-Collar + Blue-Collar)', metricType: 'INR Cr', isAuto: true, section: 'Overall', subsection: 'Totals' },

  // Other Metrics - OPTIONAL
  { id: 'enps', label: 'Employee Net Promoter Score (out of 10)', metricType: 'eNPS', isAuto: false, section: 'Other Metrics', subsection: '', description: 'Result based on latest employee sentiment on how likely employees are to recommend the company as a workplace. Enter N/A if not available, or a rating from 0-10.', mandatory: false },
  { id: 'pwd_percentage', label: 'Percentage of PwDs', metricType: 'Percentage', isAuto: false, section: 'Other Metrics', subsection: '', description: '% of persons with disabilities employed (full time & part time)', mandatory: false },
  { id: 'attrition_rate', label: 'Attrition Rate', metricType: 'Percentage', isAuto: false, section: 'Other Metrics', subsection: '', description: '% of full time employees', mandatory: false, measurementPeriod: 'For the Quarter' },
];

export const EmployeesTable = ({
  formData,
  onInputChange,
  historicalData = {},
  readOnly = false,
}: EmployeesTableProps) => {
  const getFieldKey = (id: string) => `employees_${id}`;

  const getValue = (id: string) => {
    const key = getFieldKey(id);
    return (formData[key] as string) || '';
  };

  const parseNum = (val: string) => parseFloat(val) || 0;

  // Calculate auto totals
  const getAutoTotal = (id: string): string => {
    if (id === 'wc_total_employees') {
      const maleFulltime = parseNum(getValue('wc_male_fulltime'));
      const maleContractual = parseNum(getValue('wc_male_contractual'));
      const maleParttime = parseNum(getValue('wc_male_parttime'));
      const femaleFulltime = parseNum(getValue('wc_female_fulltime'));
      const femaleContractual = parseNum(getValue('wc_female_contractual'));
      const femaleParttime = parseNum(getValue('wc_female_parttime'));
      return (maleFulltime + maleContractual + maleParttime + femaleFulltime + femaleContractual + femaleParttime).toString();
    }
    if (id === 'wc_total_wages') {
      const maleWages = parseNum(getValue('wc_wages_male'));
      const femaleWages = parseNum(getValue('wc_wages_female'));
      return (maleWages + femaleWages).toFixed(2);
    }
    if (id === 'bc_total_employees') {
      const maleFulltime = parseNum(getValue('bc_male_fulltime'));
      const maleContractual = parseNum(getValue('bc_male_contractual'));
      const maleParttime = parseNum(getValue('bc_male_parttime'));
      const femaleFulltime = parseNum(getValue('bc_female_fulltime'));
      const femaleContractual = parseNum(getValue('bc_female_contractual'));
      const femaleParttime = parseNum(getValue('bc_female_parttime'));
      return (maleFulltime + maleContractual + maleParttime + femaleFulltime + femaleContractual + femaleParttime).toString();
    }
    if (id === 'bc_total_wages') {
      const maleWages = parseNum(getValue('bc_wages_male'));
      const femaleWages = parseNum(getValue('bc_wages_female'));
      return (maleWages + femaleWages).toFixed(2);
    }
    if (id === 'total_employment') {
      const wcTotal = parseNum(getAutoTotal('wc_total_employees'));
      const bcTotal = parseNum(getAutoTotal('bc_total_employees'));
      return (wcTotal + bcTotal).toString();
    }
    if (id === 'total_wages') {
      const wcWages = parseNum(getAutoTotal('wc_total_wages'));
      const bcWages = parseNum(getAutoTotal('bc_total_wages'));
      return (wcWages + bcWages).toFixed(2);
    }
    return '0';
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

  const getMetricPlaceholder = (metricType: string) => {
    switch (metricType) {
      case 'Count': return '0';
      case 'INR Cr': return '0.00';
      case 'Rating': return '-100 to 100';
      case 'eNPS': return 'N/A or 0-10';
      case 'Percentage': return '0.0';
      default: return '';
    }
  };

  const getMetricUnit = (metricType: string) => {
    switch (metricType) {
      case 'INR Cr': return '₹ Cr';
      case 'Percentage': return '%';
      default: return '';
    }
  };

  // Group rows by section and subsection
  const groupedRows: Record<string, Record<string, EmployeeRow[]>> = {};
  EMPLOYEE_ROWS.forEach(row => {
    if (!groupedRows[row.section]) groupedRows[row.section] = {};
    const subsectionKey = row.subsection || '_default';
    if (!groupedRows[row.section][subsectionKey]) groupedRows[row.section][subsectionKey] = [];
    groupedRows[row.section][subsectionKey].push(row);
  });

  const sectionOrder = ['White Collar Employees (excluding C-Level & Board)', 'Blue-Collar', 'Overall', 'Other Metrics'];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-4 h-4 text-esg-social" />
          Employment & Wages
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <TableBody>
            {sectionOrder.map((section) => {
              const subsections = groupedRows[section];
              if (!subsections) return null;

              return (
                <tbody key={section}>
                  {/* Section Header */}
                  <TableRow className="bg-muted/40">
                    <TableCell
                      colSpan={4}
                      className="py-2 text-left font-semibold"
                    >
                      {section}
                    </TableCell>
                  </TableRow>

                  {Object.entries(subsections).map(([subsection, rows]) => (
                    <React.Fragment key={`${section}-${subsection}`}>

                      {/* Subsection Header */}
                      {subsection !== "_default" && (
                        <TableRow className="bg-muted/20">
                          <TableCell
                            colSpan={4}
                            className="py-2 pl-6 text-left text-sm font-medium text-muted-foreground"
                          >
                            {subsection}
                          </TableCell>
                        </TableRow>
                      )}

                      {rows.map((row, rowIndex) => {
                        const historical = getHistorical(row.id);

                        return (
                          <TableRow key={row.id} className="align-top">
                            <TableCell className="text-left">
                              {row.label}
                            </TableCell>

                            <TableCell className="text-left">
                              <Badge variant="secondary">
                                {row.metricType}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-left">
                              <Input
                                value={getValue(row.id)}
                                onChange={(e) =>
                                  handleChange(row.id, e.target.value)
                                }
                              />
                            </TableCell>

                            <TableCell className="text-left">
                              {historical?.value || "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              );
            })}
          </TableBody>
        </div>
      </CardContent>
    </Card>
  );
};
