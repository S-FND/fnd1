import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CellNumberBadge } from './CellNumberBadge';
import { FormattedNumberInput } from '@/components/ui/formatted-number-input';
import { formatNumberWithCommas } from '@/lib/formatNumber';

interface HistoricalEntry {
  quarter: string;
  value: string | null;
  confidence?: number;
}

interface BusinessInformationTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  historicalData?: Record<string, HistoricalEntry[]>;
}

const BUSINESS_KPIS = [
  {
    key: 'net_revenue',
    name: 'Net Revenue',
    description: 'Revenue earned from sales after deducting returns, refunds, discounts, and taxes.',
    unit: '₹ Cr',
  },
  {
    key: 'revenue_tier2_plus',
    name: '% of revenue from Tier-2+ markets',
    description: "Tier-2+ markets refer to Niti Aayog's aspirational districts i.e. markets excluding Bengaluru, NCR, Chennai, Hyderabad, Mumbai, Pune, Kolkata, Ahmedabad, Lucknow, Jaipur, Surat, Malappuram, Kozhikode.",
    unit: '%',
  },
  {
    key: 'total_customers_served',
    name: 'No. of total customers served',
    description: null,
    unit: 'Number',
  },
  {
    key: 'unique_female_customers',
    name: '% of unique female customers',
    description: null,
    unit: '%',
  },
];

export const BusinessInformationTable = ({ formData, onInputChange, historicalData = {} }: BusinessInformationTableProps) => {
  console.log('Rendering BusinessInformationTable with formData:', formData);
  console.log('Historical data:', historicalData);
  const handleCopyHistoricalValue = (kpiKey: string, value: string) => {
    onInputChange(kpiKey, value);
    toast.success('Value copied from previous period');
  };

  const getHistoricalEntries = (key: string): HistoricalEntry[] => {
    return historicalData[key] || [];
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Business Information</h3>
        <p className="text-xs text-muted-foreground">
          Enter your quarterly business metrics for the current reporting period.
        </p>
        <div className="rounded-md border overflow-x-auto">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[50px] text-left font-semibold">
                  Sno
                </TableHead>

                <TableHead className="min-w-[350px] text-left font-semibold">
                  KPI Name
                </TableHead>

                <TableHead className="w-[100px] text-left font-semibold">
                  Unit
                </TableHead>

                <TableHead className="w-[180px] text-left font-semibold">
                  Value
                </TableHead>

                <TableHead className="w-[220px] text-left font-semibold">
                  Previous Value
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {BUSINESS_KPIS.map((kpi, index) => {
                const historicalEntries = getHistoricalEntries(kpi.key);
                const kpiNumber = index + 1;

                return (
                  <TableRow key={kpi.key} className="align-top">
                    <TableCell className="text-left text-muted-foreground">
                      <CellNumberBadge kpiNumber={kpiNumber} />
                    </TableCell>

                    <TableCell className="font-medium text-left">
                      <div className="flex items-start gap-2">
                        <span>{kpi.name}</span>

                        {kpi.description && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 mt-0.5 text-muted-foreground cursor-help shrink-0" />
                            </TooltipTrigger>

                            <TooltipContent
                              side="right"
                              className="max-w-xs text-left"
                            >
                              <p>{kpi.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-left text-muted-foreground">
                      {kpi.unit}
                    </TableCell>

                    <TableCell className="text-left">
                      <FormattedNumberInput
                        value={String(formData[kpi.key] || '')}
                        onChange={(value) => onInputChange(kpi.key, value)}
                        placeholder={`Enter ${kpi.unit.toLowerCase()}`}
                        className="w-full"
                      />
                    </TableCell>

                    <TableCell className="text-left">
                      {historicalEntries.length > 0 ? (
                        <div className="flex flex-col gap-1 items-start">
                          {historicalEntries.slice(0, 2).map(
                            (entry, idx) =>
                              entry.value && (
                                <Tooltip key={`${entry.quarter}-${idx}`}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() =>
                                        handleCopyHistoricalValue(
                                          kpi.key,
                                          entry.value!
                                        )
                                      }
                                      className={cn(
                                        "inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md",
                                        "bg-muted hover:bg-muted/80 transition-colors",
                                        "text-left"
                                      )}
                                    >
                                      <span className="font-medium text-muted-foreground">
                                        {entry.quarter}:
                                      </span>

                                      <span className="text-foreground">
                                        {formatNumberWithCommas(entry.value)}
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
                                        {entry.quarter}
                                      </p>

                                      <p className="text-xs">
                                        Value: {entry.value}
                                      </p>

                                      <p className="text-xs text-muted-foreground">
                                        Click to copy
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 p-3 bg-muted/50 rounded-md border border-dashed">
          <strong>Note:</strong> With regards to Tier 2+ markets revenue & % of female customers please provide cumulative for all sales channels (D2C, E-Comm, Q-Comm). If absolute data is not available for third-party channels, please include estimates in the overall percentage.
        </p>
      </div>
    </TooltipProvider>
  );
};
