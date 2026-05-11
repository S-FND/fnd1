import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KPI } from '@/types/esg';

interface PackagingDetailedWithTertiaryProps {
  secondaryKPIs: KPI[];
  tertiaryKPIs: KPI[];
  formData: Record<string, string | number | boolean>;
  onInputChange: (kpiId: string, value: string | number | boolean) => void;
  readOnly?: boolean;
}

export const PackagingDetailedWithTertiary = ({
  secondaryKPIs,
  tertiaryKPIs,
  formData,
  onInputChange,
  readOnly = false
}: PackagingDetailedWithTertiaryProps) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  
  // Check if user wants to report tertiary packaging
  const reportTertiary = formData['report_tertiary_packaging'] === 'yes' || formData['report_tertiary_packaging'] === true;

  const handleTertiaryToggle = (value: string) => {
    onInputChange('report_tertiary_packaging', value);
  };

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

  // Group KPIs by category and sub-category
  const groupKPIs = (kpis: KPI[]) => {
    const result: Record<string, Record<string, KPI[]>> = {};
    
    kpis.forEach(kpi => {
      const category = kpi.category || 'General';
      const subCategory = kpi.subCategory || 'General';
      
      if (!result[category]) {
        result[category] = {};
      }
      if (!result[category][subCategory]) {
        result[category][subCategory] = [];
      }
      result[category][subCategory].push(kpi);
    });
    
    return result;
  };

  const groupedSecondary = useMemo(() => groupKPIs(secondaryKPIs), [secondaryKPIs]);
  const groupedTertiary = useMemo(() => groupKPIs(tertiaryKPIs), [tertiaryKPIs]);

  const coreLevelColors: Record<number, string> = {
    1: 'bg-destructive text-destructive-foreground',
    2: 'bg-status-warning text-white',
    3: 'bg-muted text-muted-foreground',
  };

  const renderInput = (kpi: KPI) => {
    const currentValue = formData[kpi.id];

    if (kpi.metricType === 'Boolean' || kpi.metricType === 'Yes/No') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={currentValue as boolean || false}
            onCheckedChange={(checked) => onInputChange(kpi.id, checked)}
            disabled={readOnly}
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
          placeholder="Enter value..."
          value={currentValue as string || ''}
          onChange={(e) => onInputChange(kpi.id, e.target.value)}
          disabled={readOnly}
          className="h-8 text-sm"
          min={isPercentage ? 0 : undefined}
          max={isPercentage ? 100 : undefined}
        />
        {isPercentage && <span className="text-xs text-muted-foreground">%</span>}
      </div>
    );
  };

  const renderKPITable = (groupedKPIs: Record<string, Record<string, KPI[]>>, title: string) => {
    const totalKPIs = Object.values(groupedKPIs).reduce(
      (acc, subCats) => acc + Object.values(subCats).reduce((a, kpis) => a + kpis.length, 0), 
      0
    );

    if (totalKPIs === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No {title.toLowerCase()} KPIs available for your company profile.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="bg-muted/50 px-4 py-2 border-b">
          <h3 className="font-medium text-sm">{title} ({totalKPIs} metrics)</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[40px] px-2"></TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Sub-Category</TableHead>
              <TableHead className="text-xs font-semibold">KPI Metric</TableHead>
              <TableHead className="w-[50px] text-xs font-semibold text-center">Core</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Enter Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedKPIs).map(([category, subCategories]) => {
              const categoryKey = `${title}-${category}`;
              const isCollapsed = collapsedCategories.has(categoryKey);
              const allKPIsInCategory = Object.values(subCategories).flat();
              
              let rowIndex = 0;
              
              return (
                <>
                  {/* Category Header */}
                  <TableRow 
                    key={categoryKey}
                    className="cursor-pointer hover:bg-muted/50 border-l-4 border-l-esg-environmental bg-esg-environmental/10"
                    onClick={() => toggleCategory(categoryKey)}
                  >
                    <TableCell className="px-2">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell colSpan={4} className="py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-esg-environmental">
                          {category}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {allKPIsInCategory.length} items
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* KPI Rows */}
                  {!isCollapsed && Object.entries(subCategories).map(([subCategory, kpis]) => 
                    kpis.map((kpi, kpiIdx) => {
                      const isFirstInSubCat = kpiIdx === 0;
                      rowIndex++;
                      
                      return (
                        <TableRow 
                          key={kpi.id}
                          className={cn(
                            "group hover:bg-muted/30 border-l-4 border-l-esg-environmental",
                            rowIndex % 2 === 0 ? "bg-background" : "bg-muted/10"
                          )}
                        >
                          <TableCell className="px-2"></TableCell>
                          <TableCell className="py-2">
                            {isFirstInSubCat && subCategory !== 'General' && (
                              <span className="text-xs font-medium text-foreground/80">
                                {subCategory}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{kpi.name}</span>
                              {kpi.definition && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs">
                                    <p className="text-xs">{kpi.definition}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2">
                            <Badge 
                              variant="secondary" 
                              className={cn("text-[10px] px-1.5", coreLevelColors[kpi.coreLevel])}
                            >
                              {kpi.coreLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2">
                            {renderInput(kpi)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Secondary Packaging */}
      {renderKPITable(groupedSecondary, 'Secondary Packaging')}

      {/* Tertiary Packaging Toggle */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Tertiary Packaging Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Do you wish to report on Tertiary Packaging?
            </Label>
            <RadioGroup
              value={reportTertiary ? 'yes' : (formData['report_tertiary_packaging'] === 'no' ? 'no' : '')}
              onValueChange={handleTertiaryToggle}
              disabled={readOnly}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tertiary-yes" />
                <Label htmlFor="tertiary-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tertiary-no" />
                <Label htmlFor="tertiary-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Tertiary Packaging KPIs - shown only when Yes is selected */}
      {reportTertiary && tertiaryKPIs.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {renderKPITable(groupedTertiary, 'Tertiary Packaging')}
        </div>
      )}
    </div>
  );
};
