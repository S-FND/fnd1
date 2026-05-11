import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CellNumberBadge } from './CellNumberBadge';

interface SupplierVendorSectionProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

export const SupplierVendorSection = ({
  formData,
  onInputChange,
  readOnly = false,
}: SupplierVendorSectionProps) => {

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CellNumberBadge kpiNumber={1} />
          <Users className="w-4 h-4 text-esg-social" />
          Suppliers or Vendors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* MSME Supplier Metric */}
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="space-y-3">
              <Label htmlFor="msme_supplier_percentage" className="text-sm font-medium flex items-center gap-1">
                <CellNumberBadge kpiNumber={1} fieldLetter="a" />
                % of spend on MSME suppliers
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Approximate % of your total operating spend that goes to MSME suppliers (exclude corporate service vendors like accounting, HR, legal etc.). E.g: If Rs 100 is spent on OPEX from 10 suppliers, out of which Rs 40 is spent on 2 MSMEs, the % will be 40% and not 20%.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="msme_supplier_percentage"
                  type="number"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  value={formData['msme_supplier_percentage'] as string || ''}
                  onChange={(e) => onInputChange('msme_supplier_percentage', e.target.value)}
                  className="w-32 h-9"
                  disabled={readOnly}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};
