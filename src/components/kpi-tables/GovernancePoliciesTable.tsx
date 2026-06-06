import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { Scale, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CellNumberBadge } from './CellNumberBadge';

interface GovernancePoliciesTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | boolean) => void;
  readOnly?: boolean;
}

const POLICIES = [
  {
    id: 'posh',
    label: 'PoSH (Prevention of Sexual Harassment)',
    description: 'Mandatory under the PoSH Act, 2013. Requires companies with 10+ employees to constitute an Internal Committee (IC) to prevent, prohibit, and redress workplace sexual harassment.'
  },
  {
    id: 'code_of_conduct',
    label: 'Code of Conduct',
    description: 'Internal rules defining acceptable employee behaviour, ethics, compliance with law, anti-bribery, and company values. Often linked to Companies Act, 2013 obligations.'
  },
  {
    id: 'supplier_code_of_conduct',
    label: 'Supplier Code of Conduct',
    description: 'Rules vendors must follow (ethical sourcing, no child labour, fair wages, safe workplaces). Anchored in Child Labour Act, Bonded Labour Act, and Minimum Wages Act.'
  },
  {
    id: 'health_and_safety',
    label: 'Health and Safety',
    description: 'Companies must ensure safe, hygienic, and risk-free workplaces. (Eg: Fire safety related, Workplace Safety)'
  },
  {
    id: 'dei',
    label: 'Diversity, Equity and Inclusion',
    description: 'Policies promoting fair hiring, equal opportunity, and non-discrimination. Anchored in Articles 14–16 of the Indian Constitution and anti-discrimination provisions under labour law.'
  },
  {
    id: 'hr',
    label: 'HR Policy',
    description: 'Covers employee lifecycle matters (recruitment, leave, payroll, benefits, discipline, termination). Guided by Indian Labour Codes, Shops & Establishments Acts, and company-specific rules.'
  },
  {
    id: 'human_rights',
    label: 'Human Rights',
    description: 'Aligns with Constitution of India and labour laws, covering freedom from forced labour, fair wages, and non-discrimination.'
  },
  {
    id: 'esg',
    label: 'ESG Policy',
    description: "Company's framework on Environmental, Social, and Governance performance."
  },
  {
    id: 'environment',
    label: 'Environment Policy',
    description: 'Ensures compliance with Environment Protection Act, Plastic Waste Management Rules and other sustainability laws.'
  },
  {
    id: 'grievance_internal',
    label: 'Grievance Redressal (Internal)',
    description: 'Mechanism for employees to raise workplace complaints (other than PoSH).'
  },
  {
    id: 'grievance_external',
    label: 'Grievance Redressal (External)',
    description: 'Mechanism for suppliers/vendors/customers to lodge complaints with the company.'
  },
  {
    id: 'data_protection',
    label: 'Data Protection and Cyber Security',
    description: 'Required under the new Digital Personal Data Protection Act, 2023 and IT Act, 2000. Safeguards customer and employee personal data.'
  },
];

export const GovernancePoliciesTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: GovernancePoliciesTableProps) => {
  const getFieldKey = (policyId: string, field: string) =>
    `policy_${policyId}_${field}`;

  const getBoolValue = (policyId: string, field: string) => {
    const key = getFieldKey(policyId, field);
    return formData[key] === true || formData[key] === 'true';
  };

  const getStringValue = (policyId: string, field: string) => {
    const key = getFieldKey(policyId, field);
    return (formData[key] as string) || '';
  };

  const handleBoolChange = (policyId: string, field: string, value: boolean) => {
    const key = getFieldKey(policyId, field);
    onInputChange(key, value);
  };

  const handleStringChange = (policyId: string, field: string, value: string) => {
    const key = getFieldKey(policyId, field);
    onInputChange(key, value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="w-4 h-4 text-esg-governance" />
          Governance Policies
          <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[320px] text-left font-semibold">
                  Policy
                </TableHead>

                <TableHead className="w-[180px] text-center font-semibold">
                  In Place
                </TableHead>

                <TableHead className="w-[220px] text-center font-semibold">
                  Employee Training
                </TableHead>

                <TableHead className="w-[220px] text-left font-semibold">
                  Last Update To The Policy (MM/YY)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {POLICIES.map((policy, index) => (
                <TableRow
                  key={policy.id}
                  className="align-top"
                >
                  <TableCell className="font-medium text-left bg-muted/20">
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <CellNumberBadge kpiNumber={index + 1} />

                        <span>{policy.label}</span>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 mt-0.5 text-muted-foreground cursor-help shrink-0" />
                            </TooltipTrigger>

                            <TooltipContent
                              side="right"
                              className="max-w-xs text-left"
                            >
                              <p className="text-sm">
                                {policy.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <p className="text-xs text-muted-foreground ml-7">
                        {policy.description}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {index + 1}a
                      </span>

                      <Switch
                        checked={getBoolValue(
                          policy.id,
                          "in_place"
                        )}
                        onCheckedChange={(checked) =>
                          handleBoolChange(
                            policy.id,
                            "in_place",
                            checked
                          )
                        }
                        disabled={readOnly}
                      />

                      <span className="text-xs text-muted-foreground w-8">
                        {getBoolValue(policy.id, "in_place")
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {index + 1}b
                      </span>

                      <Switch
                        checked={getBoolValue(
                          policy.id,
                          "training"
                        )}
                        onCheckedChange={(checked) =>
                          handleBoolChange(
                            policy.id,
                            "training",
                            checked
                          )
                        }
                        disabled={readOnly}
                      />

                      <span className="text-xs text-muted-foreground w-8">
                        {getBoolValue(policy.id, "training")
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {index + 1}c
                      </span>

                      <Input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={getStringValue(
                          policy.id,
                          "last_update"
                        )}
                        onChange={(e) => {
                          let value = e.target.value.replace(
                            /[^0-9/]/g,
                            ""
                          );

                          // Auto insert slash
                          if (
                            value.length === 2 &&
                            !value.includes("/")
                          ) {
                            value = value + "/";
                          }

                          handleStringChange(
                            policy.id,
                            "last_update",
                            value
                          );
                        }}
                        className="h-8 text-sm w-24"
                        disabled={readOnly}
                      />
                    </div>
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
