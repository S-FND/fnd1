import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { AlertTriangle, Info } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

interface IncidentsTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | boolean) => void;
  readOnly?: boolean;
}

const INCIDENT_CATEGORIES = [
  {
    id: 'posh',
    label: 'PoSH',
    description: 'Mandatory under the PoSH Act, 2013. Requires companies with 10+ employees to constitute an Internal Committee (IC) to prevent, prohibit, and redress workplace sexual harassment. This also includes POCSO.'
  },
  {
    id: 'supplier_vendor',
    label: 'Supplier or Vendor Issues',
    description: 'Breach of contract, non-compliance with labour/environmental law, late payments.'
  },
  {
    id: 'customer_grievance',
    label: 'Customer Grievance',
    description: 'Complaints from consumers regarding product/service quality, safety, or mis-selling.'
  },
  {
    id: 'employee_grievance',
    label: 'Employee Grievance',
    description: 'Specific issues raised by employees (e.g., wages, working conditions, discrimination). Needs time-bound resolution under Indian labour law.'
  },
  {
    id: 'environmental',
    label: 'Environmental Incidents',
    description: 'Pollution, hazardous waste disposal, notices from CPCB.'
  },
  {
    id: 'health_safety',
    label: 'Health & Safety Incidents',
    description: 'Workplace accidents, injuries, or occupational diseases that must be reported.'
  },
  {
    id: 'security_data_privacy',
    label: 'Security Incident (Data & Privacy Breach)',
    description: 'Any unauthorised access, leakage, or misuse of data must be reported to authorities under DPDP Act and CERT-In guidelines.'
  },
  {
    id: 'negative_media',
    label: 'Negative Media Cases',
    description: 'Adverse news coverage (labour strikes, environmental harm, fraud, consumer safety issues) that impacts brand reputation.'
  },
  {
    id: 'anti_bribery_corruption',
    label: 'Anti-bribery & corruption',
    description: 'Policies and practices in place to prevent bribery and other corrupt or unethical business conduct.'
  },
  {
    id: 'other_regulatory',
    label: 'Other regulatory fines or legal liabilities',
    description: 'Penalties imposed by Indian regulators (Labour Dept., Pollution Control Boards, MCA, Consumer Courts etc.) for non-compliance.'
  },
];

const IMPACT_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const IncidentsTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: IncidentsTableProps) => {
  const getFieldKey = (categoryId: string, field: string) => `incident_${categoryId}_${field}`;

  const getValue = (categoryId: string, field: string): string | undefined => {
    const key = getFieldKey(categoryId, field);
    const value = formData[key] as string;
    // Return undefined for empty/null values so Select shows placeholder
    return value && value.trim() !== '' ? value : undefined;
  };

  const handleChange = (categoryId: string, field: string, value: string | undefined) => {
    const key = getFieldKey(categoryId, field);
    // Store empty string in formData for cleared values
    onInputChange(key, value ?? '');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-esg-governance" />
            Incidents and Grievances
            <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[220px] text-left font-semibold">
                  Category
                </TableHead>

                <TableHead className="w-[140px] text-left font-semibold">
                  <div className="flex flex-col">
                    <span>Number of Cases</span>

                    <span className="text-xs font-normal text-muted-foreground italic">
                      (For the Quarter)
                    </span>
                  </div>
                </TableHead>

                <TableHead className="w-[160px] text-left font-semibold">
                  <div className="flex flex-col">
                    <span>Cases Open/Unresolved</span>

                    <span className="text-xs font-normal text-muted-foreground italic">
                      (As of Date)
                    </span>
                  </div>
                </TableHead>

                <TableHead className="w-[140px] text-left font-semibold">
                  <div className="flex flex-col">
                    <span>Impact on Business</span>

                    <span className="text-xs font-normal text-muted-foreground italic">
                      (High/Medium/Low)
                    </span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {INCIDENT_CATEGORIES.map((category, index) => {
                const kpiNumber = index + 1;

                return (
                  <TableRow key={category.id} className="align-top">
                    <TableCell className="font-medium text-left">
                      <div className="flex items-start gap-2">
                        <CellNumberBadge kpiNumber={kpiNumber} />

                        <span>{category.label}</span>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 mt-0.5 text-muted-foreground cursor-help shrink-0" />
                          </TooltipTrigger>

                          <TooltipContent
                            side="right"
                            className="max-w-xs text-left"
                          >
                            <p>{category.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>

                    <TableCell className="py-2 text-left">
                      <div className="flex items-center gap-2">
                        <CellNumberBadge
                          kpiNumber={kpiNumber}
                          fieldLetter="a"
                        />

                        <Input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={getValue(category.id, 'cases')}
                          onChange={(e) =>
                            handleChange(
                              category.id,
                              'cases',
                              e.target.value
                            )
                          }
                          className="w-20 h-8 text-sm"
                          disabled={readOnly}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-2 text-left">
                      <div className="flex items-center gap-2">
                        <CellNumberBadge
                          kpiNumber={kpiNumber}
                          fieldLetter="b"
                        />

                        <Input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={getValue(category.id, 'open_cases')}
                          onChange={(e) =>
                            handleChange(
                              category.id,
                              'open_cases',
                              e.target.value
                            )
                          }
                          className="w-20 h-8 text-sm"
                          disabled={readOnly}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-2 text-left">
                      <div className="flex items-center gap-2">
                        <CellNumberBadge
                          kpiNumber={kpiNumber}
                          fieldLetter="c"
                        />

                        <Select
                          key={`impact-${category.id}-${getValue(category.id, 'impact') ?? 'empty'}`}
                          value={getValue(category.id, 'impact')}
                          onValueChange={(value) =>
                            handleChange(
                              category.id,
                              'impact',
                              value === '__clear__'
                                ? undefined
                                : value
                            )
                          }
                          disabled={readOnly}
                        >
                          <SelectTrigger className="w-28 h-8 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>

                          <SelectContent className="bg-background z-50">
                            {getValue(category.id, 'impact') && (
                              <SelectItem
                                value="__clear__"
                                className="text-muted-foreground italic"
                              >
                                Clear selection
                              </SelectItem>
                            )}

                            {IMPACT_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
