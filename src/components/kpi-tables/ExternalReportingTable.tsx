import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CellNumberBadge } from './CellNumberBadge';

interface ExternalReportingTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (kpiId: string, value: string | number | boolean) => void;
}

const EXTERNAL_REPORTING_KPIS = [
  { 
    id: 'ext_beneficiaries', 
    name: 'Beneficiaries', 
    description: 'Number of beneficiaries impacted by company activities',
    unit: 'Text'
  },
  { 
    id: 'ext_jobs_created', 
    name: 'Jobs created', 
    description: 'Number of jobs created directly or indirectly',
    unit: 'Text'
  },
  { 
    id: 'ext_enterprise_emissions', 
    name: 'Enterprise and emissions', 
    description: 'Enterprise-level emissions data and environmental impact',
    unit: 'Text'
  },
  { 
    id: 'ext_development_indicators', 
    name: 'Development Indicators', 
    description: 'Key development indicators and metrics',
    unit: 'Text'
  },
  { 
    id: 'ext_training_safety', 
    name: 'Training and safety', 
    description: 'Training programs and safety measures implemented',
    unit: 'Text'
  },
  { 
    id: 'ext_social_security', 
    name: 'Social security', 
    description: 'Social security provisions for employees',
    unit: 'Text'
  },
  { 
    id: 'ext_testimonials_other', 
    name: 'Testimonials and other', 
    description: 'Testimonials and other relevant information',
    unit: 'Text'
  },
  { 
    id: 'ext_progress_milestones', 
    name: 'Progress and milestones', 
    description: 'Progress updates and key milestones achieved',
    unit: 'Text'
  },
];

export const ExternalReportingTable = ({ formData, onInputChange }: ExternalReportingTableProps) => {
  return (
    <TooltipProvider>
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[50px] text-xs font-semibold text-center">S.No</TableHead>
              <TableHead className="w-[250px] text-xs font-semibold">Metric</TableHead>
              <TableHead className="text-xs font-semibold">Enter Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXTERNAL_REPORTING_KPIS.map((kpi, index) => {
              const kpiNumber = index + 1;
              return (
              <TableRow key={kpi.id} className="hover:bg-muted/30">
                <TableCell className="text-center text-sm text-muted-foreground">
                  <CellNumberBadge kpiNumber={kpiNumber} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">{kpi.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <Textarea
                    value={formData[kpi.id]?.toString() || ''}
                    onChange={(e) => onInputChange(kpi.id, e.target.value)}
                    placeholder={`Enter ${kpi.name.toLowerCase()}...`}
                    className="min-h-[80px] text-sm resize-y"
                  />
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};
