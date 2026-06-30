import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, ChevronRight, Clock, Copy, Info, AlertTriangle } from 'lucide-react';
import { KPI, ESGCategory } from '@/types/esg';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HistoricalEntry {
  value: string | null;
  quarter: string;
  confidence?: number;
}

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method: string | null;
}

interface SpreadsheetKPITableProps {
  kpis: KPI[];
  formData: Record<string, string | number | boolean>;
  onInputChange: (kpiId: string, value: string | number | boolean) => void;
  historicalData?: Record<string, HistoricalValue | HistoricalEntry[]>;
  title?: string;
}

// Helper to normalize historical data to array format
const normalizeHistoricalData = (data: HistoricalValue | HistoricalEntry[] | undefined): HistoricalEntry[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // Convert single value to array
  return [{
    value: data.value,
    quarter: data.quarter,
    confidence: data.confidence,
  }];
};

// Get the first (most recent) historical entry
const getFirstHistoricalEntry = (data: HistoricalValue | HistoricalEntry[] | undefined): HistoricalEntry | null => {
  const normalized = normalizeHistoricalData(data);
  return normalized.length > 0 ? normalized[0] : null;
};

// Get last 2 quarters of historical data
const getLast2Quarters = (data: HistoricalValue | HistoricalEntry[] | undefined): HistoricalEntry[] => {
  const normalized = normalizeHistoricalData(data);
  return normalized.slice(0, 2);
};

// ESG colors matching the design system
const esgBgColors: Record<ESGCategory, string> = {
  E: 'bg-esg-environmental/10',
  S: 'bg-esg-social/10',
  G: 'bg-esg-governance/10',
};

const esgBorderColors: Record<ESGCategory, string> = {
  E: 'border-l-esg-environmental',
  S: 'border-l-esg-social',
  G: 'border-l-esg-governance',
};

const esgTextColors: Record<ESGCategory, string> = {
  E: 'text-esg-environmental',
  S: 'text-esg-social',
  G: 'text-esg-governance',
};

const esgLabels: Record<ESGCategory, string> = {
  E: 'Environmental',
  S: 'Social',
  G: 'Governance',
};

const coreLevelColors: Record<number, string> = {
  1: 'bg-destructive text-destructive-foreground',
  2: 'bg-status-warning text-white',
  3: 'bg-muted text-muted-foreground',
};

export const SpreadsheetKPITable = ({ 
  kpis, 
  formData, 
  onInputChange, 
  historicalData = {},
  title
}: SpreadsheetKPITableProps) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Group KPIs by ESG -> Category -> SubCategory
  const groupedKPIs = useMemo(() => {
    const result: Record<ESGCategory, Record<string, Record<string, KPI[]>>> = {
      E: {},
      S: {},
      G: {},
    };
    
    kpis.forEach(kpi => {
      const esg = kpi.esg;
      const category = kpi.category || 'General';
      const subCategory = kpi.subCategory || 'General';
      
      if (!result[esg][category]) {
        result[esg][category] = {};
      }
      if (!result[esg][category][subCategory]) {
        result[esg][category][subCategory] = [];
      }
      result[esg][category][subCategory].push(kpi);
    });
    
    return result;
  }, [kpis]);

  const toggleCategory = (categoryKey: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const handleCopyHistoricalValue = (kpiId: string, value: string) => {
    onInputChange(kpiId, value);
    toast.success('Value copied from last quarter');
  };

  const getConfidenceClass = (confidence: number): string => {
    if (confidence >= 0.85) return 'text-status-success';
    if (confidence >= 0.6) return 'text-status-warning';
    return 'text-muted-foreground';
  };

  const hasDeviation = (kpiId: string, currentValue: string | number | boolean | undefined): boolean => {
    const historicalEntry = getFirstHistoricalEntry(historicalData[kpiId]);
    if (!historicalEntry || !historicalEntry.value || !currentValue) return false;
    
    const curr = Number(currentValue);
    const prev = Number(historicalEntry.value);
    if (isNaN(curr) || isNaN(prev) || prev === 0) return false;
    
    return Math.abs(curr - prev) > prev * 0.5;
  };

  const renderInput = (kpi: KPI) => {
    const currentValue = formData[kpi.id];
    const historicalEntry = getFirstHistoricalEntry(historicalData[kpi.id]);
    const showDeviation = hasDeviation(kpi.id, currentValue);

    if (kpi.metricType === 'Boolean' || kpi.metricType === 'Yes/No') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={currentValue as boolean || false}
            onCheckedChange={(checked) => onInputChange(kpi.id, checked)}
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-xs text-muted-foreground min-w-[24px]">
            {currentValue ? 'Yes' : 'No'}
          </span>
        </div>
      );
    }

    const isNumeric = ['Quantitative', 'Metric Tons', 'Cost in INR Cr', 'Number', 'Currency', 'Percentage'].includes(kpi.metricType);
    const isPercentage = kpi.metricType === 'Percentage';
    
    return (
      <div className="relative flex items-center gap-1">
        <Input
          type={isNumeric ? 'number' : 'text'}
          placeholder={historicalEntry?.value ? `Prev: ${historicalEntry.value}` : '—'}
          value={currentValue as string || ''}
          onChange={(e) => onInputChange(kpi.id, e.target.value)}
          className={cn(
            "h-7 text-sm border-0 bg-transparent focus:bg-background focus:ring-1 focus:ring-primary/50 px-2",
            "placeholder:text-muted-foreground/50 placeholder:italic",
            showDeviation && "ring-1 ring-status-warning/50"
          )}
          min={isPercentage ? 0 : undefined}
          max={isPercentage ? 100 : undefined}
        />
        {isPercentage && <span className="text-xs text-muted-foreground">%</span>}
        {showDeviation && (
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="w-3 h-3 text-status-warning" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Significant change from {historicalEntry?.quarter}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  if (kpis.length === 0) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {title && (
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40px] px-2"></TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Category</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold">Sub-category</TableHead>
              <TableHead className="text-xs font-semibold">KPI Metric</TableHead>
              <TableHead className="w-[50px] text-xs font-semibold text-center">Core</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Enter Value</TableHead>
              <TableHead className="w-[100px] text-xs font-semibold text-center">Last Qtr</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(['E', 'S', 'G'] as ESGCategory[]).map(esg => {
              const categories = groupedKPIs[esg];
              const categoryNames = Object.keys(categories).sort();
              
              if (categoryNames.length === 0) return null;
              
              return categoryNames.map((category, catIdx) => {
                const subCategories = categories[category];
                const subCategoryNames = Object.keys(subCategories).sort();
                const categoryKey = `${esg}-${category}`;
                const isCollapsed = collapsedCategories.has(categoryKey);
                
                // Calculate total rows for this category
                const totalKPIsInCategory = subCategoryNames.reduce(
                  (sum, sc) => sum + subCategories[sc].length, 
                  0
                );
                
                let rowIndex = 0;
                
                return (
                  <>
                    {/* Category Header Row */}
                    <TableRow 
                      key={categoryKey}
                      className={cn(
                        "cursor-pointer hover:bg-muted/50 border-l-4",
                        esgBorderColors[esg],
                        esgBgColors[esg]
                      )}
                      onClick={() => toggleCategory(categoryKey)}
                    >
                      <TableCell className="px-2">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell colSpan={6} className="py-2">
                        <div className="flex items-center gap-3">
                          <span className={cn("text-sm font-medium", esgTextColors[esg])}>
                            {category}
                          </span>
                          <Badge variant="outline" className={cn("text-[10px] h-5", esgTextColors[esg])}>
                            {esgLabels[esg]}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {totalKPIsInCategory} item{totalKPIsInCategory !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* KPI Rows */}
                    {!isCollapsed && subCategoryNames.map((subCategory, subIdx) => {
                      const subCatKPIs = subCategories[subCategory];
                      
                      return subCatKPIs.map((kpi, kpiIdx) => {
                        const historicalEntries = getLast2Quarters(historicalData[kpi.id]);
                        const firstHistorical = historicalEntries[0] || null;
                        const isFirstInSubCat = kpiIdx === 0;
                        rowIndex++;
                        
                        return (
                          <TableRow 
                            key={kpi.id}
                            className={cn(
                              "group hover:bg-muted/30 border-l-4",
                              esgBorderColors[esg],
                              rowIndex % 2 === 0 ? "bg-background" : "bg-muted/10"
                            )}
                          >
                            <TableCell className="px-2"></TableCell>
                            <TableCell className="py-1.5 text-xs text-muted-foreground">
                              {/* Empty - category shown in header */}
                            </TableCell>
                            <TableCell className="py-1.5">
                              {isFirstInSubCat && (
                                <span className="text-xs font-medium text-foreground/80">
                                  {subCategory !== 'General' ? subCategory : ''}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {kpi.name}
                                  {kpi.coreLevel === 1 && <span className="text-destructive ml-0.5">*</span>}
                                </span>
                                {kpi.definition && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button 
                                        type="button" 
                                        className="p-0.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="max-w-xs" side="top">
                                      <div className="space-y-1">
                                        <p className="font-medium text-sm">{kpi.name}</p>
                                        <p className="text-xs text-muted-foreground">{kpi.definition}</p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-1.5 text-center">
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "text-[10px] h-5 w-5 p-0 justify-center",
                                  coreLevelColors[kpi.coreLevel]
                                )}
                              >
                                {kpi.coreLevel}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-1.5">
                              {renderInput(kpi)}
                            </TableCell>
                            <TableCell className="py-1.5">
                              {/* Show last 2 quarters inline */}
                              {historicalEntries.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {historicalEntries.map((entry, idx) => (
                                    entry.value && (
                                      <Tooltip key={`${entry.quarter}-${idx}`}>
                                        <TooltipTrigger asChild>
                                          <button
                                            onClick={() => handleCopyHistoricalValue(kpi.id, entry.value!)}
                                            className={cn(
                                              "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded",
                                              "bg-muted hover:bg-muted/80 transition-colors",
                                              "max-w-full text-left"
                                            )}
                                          >
                                            <span className="font-medium text-muted-foreground shrink-0">
                                              {entry.quarter}:
                                            </span>
                                            <span className="truncate max-w-[45px] text-foreground">
                                              {entry.value}
                                            </span>
                                            <Copy className="w-2.5 h-2.5 shrink-0 opacity-40" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                          <div className="space-y-1">
                                            <p className="text-xs font-medium">{entry.quarter}</p>
                                            <p className="text-xs">Value: {entry.value}</p>
                                            {entry.confidence && (
                                              <p className={cn("text-xs", getConfidenceClass(entry.confidence))}>
                                                Match: {Math.round(entry.confidence * 100)}%
                                              </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">Click to copy</p>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    )
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })}
                  </>
                );
              });
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Footer summary */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <span>{kpis.length} KPIs total</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className={cn("w-2 h-2 rounded-full", "bg-destructive")} />
            Mandatory: {kpis.filter(k => k.coreLevel === 1).length}
          </span>
          <span className="flex items-center gap-1">
            <span className={cn("w-2 h-2 rounded-full", "bg-muted-foreground")} />
            Optional: {kpis.filter(k => k.coreLevel === 2).length}
          </span>
        </div>
      </div>
    </div>
  );
};
