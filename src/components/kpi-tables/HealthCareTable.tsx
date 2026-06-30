import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, Info } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

interface HealthCareTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | number | boolean) => void;
  readOnly?: boolean;
}

const HEALTHCARE_KPIS = [
  { 
    key: 'healthcare_consultations_screenings', 
    name: 'No. of doctor consultations/patient screenings', 
    unit: 'Number',
    description: 'Total number of doctor consultations or patient screenings conducted during this period',
    type: 'number' as const,
  },
  { 
    key: 'healthcare_products_services', 
    name: 'No. of healthcare products/services offered', 
    unit: 'Number',
    description: 'Count of healthcare products or services offered by the company',
    type: 'number' as const,
  },
  { 
    key: 'healthcare_diseases_addressed', 
    name: 'Diseases/conditions addressed', 
    unit: 'Text',
    description: 'List of diseases or health conditions addressed by your products/services',
    type: 'text' as const,
  },
];

export const HealthCareTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: HealthCareTableProps) => {
  const getValue = (key: string) => (formData[key] as string) || '';

  const handleChange = (key: string, value: string) => {
    onInputChange(key, value);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-esg-social" />
            HealthCare Metrics
            <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 [&>th]:text-left">
                  <TableHead className="w-[50px] text-center text-xs font-semibold">Sno</TableHead>
                  <TableHead className="text-xs font-semibold">KPI Metric</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold">Unit</TableHead>
                  <TableHead className="w-[300px] text-xs font-semibold">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HEALTHCARE_KPIS.map((kpi, index) => (
                  <TableRow key={kpi.key} className="hover:bg-muted/30">
                    <TableCell className="text-center text-sm font-medium text-muted-foreground">
                      <CellNumberBadge kpiNumber={index + 1} />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{kpi.name}</span>
                        {kpi.description && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="text-xs">{kpi.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{kpi.unit}</Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      {kpi.type === 'text' ? (
                        <Textarea
                          placeholder="Enter details..."
                          value={getValue(kpi.key)}
                          onChange={(e) => handleChange(kpi.key, e.target.value)}
                          className="min-h-[80px] text-sm"
                          disabled={readOnly}
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="0"
                          value={getValue(kpi.key)}
                          onChange={(e) => handleChange(kpi.key, e.target.value)}
                          className="w-full h-8 text-sm"
                          disabled={readOnly}
                          min={0}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
