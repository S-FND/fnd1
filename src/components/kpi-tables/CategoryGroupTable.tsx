import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Copy, Info } from 'lucide-react';
import { KPI, ESGCategory } from '@/types/esg';
import { toast } from 'sonner';
import { CoreBadge } from '@/components/ESGBadge';

interface HistoricalValue {
  value: string | null;
  quarter: string;
  confidence: number;
  method: string | null;
}

interface CategoryGroupTableProps {
  category: string;
  kpis: KPI[];
  formData: Record<string, string | number | boolean>;
  onInputChange: (kpiId: string, value: string | number | boolean) => void;
  historicalData?: Record<string, HistoricalValue>;
}

// ESG colors
const esgColors: Record<ESGCategory, string> = {
  E: 'bg-esg-environmental text-white',
  S: 'bg-esg-social text-white',
  G: 'bg-esg-governance text-white',
};

const esgLabels: Record<ESGCategory, string> = {
  E: 'Environmental',
  S: 'Social',
  G: 'Governance',
};

export const CategoryGroupTable = ({ 
  category, 
  kpis, 
  formData, 
  onInputChange, 
  historicalData = {} 
}: CategoryGroupTableProps) => {
  // Group KPIs by sub-category
  const groupedBySubCategory = useMemo(() => {
    const grouped: Record<string, KPI[]> = {};
    kpis.forEach(kpi => {
      const subCat = kpi.subCategory || 'General';
      if (!grouped[subCat]) {
        grouped[subCat] = [];
      }
      grouped[subCat].push(kpi);
    });
    return grouped;
  }, [kpis]);

  const subCategories = Object.keys(groupedBySubCategory).sort();
  
  // Get the ESG type for this category (use first KPI's ESG)
  const esgType = kpis.length > 0 ? kpis[0].esg : 'E';

  const handleCopyHistoricalValue = (kpiId: string, value: string) => {
    onInputChange(kpiId, value);
    toast.success('Historical value copied');
  };

  const renderKPIInput = (kpi: KPI) => {
    const currentValue = formData[kpi.id];
    const historical = historicalData[kpi.id];

    if (kpi.metricType === 'Boolean' || kpi.metricType === 'Yes/No') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={currentValue as boolean || false}
            onCheckedChange={(checked) => onInputChange(kpi.id, checked)}
          />
          <span className="text-sm text-muted-foreground">
            {currentValue ? 'Yes' : 'No'}
          </span>
        </div>
      );
    }

    if (kpi.metricType === 'Percentage') {
      return (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={currentValue as string || ''}
            onChange={(e) => onInputChange(kpi.id, e.target.value)}
            className="w-20 h-8 text-sm"
          />
          <span className="text-muted-foreground text-sm">%</span>
        </div>
      );
    }

    const isNumeric = ['Quantitative', 'Metric Tons', 'Cost in INR Cr', 'Number', 'Currency'].includes(kpi.metricType);
    
    return (
      <Input
        type={isNumeric ? 'number' : 'text'}
        placeholder={kpi.metricType || 'Enter value'}
        value={currentValue as string || ''}
        onChange={(e) => onInputChange(kpi.id, e.target.value)}
        className="h-8 text-sm min-w-[120px]"
      />
    );
  };

  if (kpis.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {category}
            <Badge className={`text-xs ${esgColors[esgType]}`}>
              {esgLabels[esgType]}
            </Badge>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {kpis.length} KPI{kpis.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">Sub-category</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead className="w-[60px]">Level</TableHead>
                <TableHead className="w-[180px]">Value</TableHead>
                <TableHead className="w-[120px]">Historical</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.map(subCat => {
                const subCatKPIs = groupedBySubCategory[subCat];
                return subCatKPIs.map((kpi, idx) => {
                  const historical = historicalData[kpi.id];
                  return (
                    <TableRow key={kpi.id} className="hover:bg-muted/30">
                      {idx === 0 ? (
                        <TableCell 
                          rowSpan={subCatKPIs.length} 
                          className="font-medium bg-muted/20 border-r"
                        >
                          {subCat}
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {kpi.name}
                            {kpi.coreLevel === 1 && <span className="text-destructive ml-0.5">*</span>}
                          </span>
                          {kpi.definition && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button" className="p-0.5 rounded hover:bg-muted transition-colors">
                                  <Info className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-xs" side="top">
                                <p className="text-sm text-muted-foreground">{kpi.definition}</p>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CoreBadge level={kpi.coreLevel} size="sm" />
                      </TableCell>
                      <TableCell>
                        {renderKPIInput(kpi)}
                      </TableCell>
                      <TableCell>
                        {historical && historical.value && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleCopyHistoricalValue(kpi.id, historical.value!)}
                                className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                              >
                                <Clock className="w-3 h-3" />
                                <span className="truncate max-w-[60px]">{historical.value}</span>
                                <Copy className="w-3 h-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{historical.quarter}: {historical.value}</p>
                              <p className="text-xs text-muted-foreground">Click to copy</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
