import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Package, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CellNumberBadge } from './CellNumberBadge';

const PLASTICS_INFO = `1. PET (Polyethylene terephthalate) - Bottles for water and soft drinks
2. HDPE (High-density polyethylene) - Rigid bottles or containers, caps
3. PVC (Polyvinyl chloride) - Shrink wraps or cling film, pipes
4. LDPE (Low-density polyethylene) - Flexible plastic bags, shrink wraps or cling film
5. PP (Polypropylene) - Caps, furniture, hard-shelled luggage, takeaway containers
6. PS (Polystyrene) - Thermocol, takeaway food containers, single-use plates
7. Others - Multi Layered plastics (MLP), which include packets for chips and other snacks.

Check recycling number (1-7) on the package`;
import { useState } from 'react';

interface FoodBPCNutraPackagingDetailedProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const SECONDARY_PACKAGING_FIELDS = [
  { id: 'secondary_total_material', label: 'Total amount of packaging material used for secondary packaging', type: 'number', unit: 'MT', kpiNumber: 5, fieldLetter: 'a' },
];

const SECONDARY_BREAKUP_FIELDS = [
  { id: 'secondary_plastic_virgin', label: 'Plastic (virgin)', type: 'number', unit: 'MT', fieldLetter: 'b' },
  { id: 'secondary_plastic_recycled', label: 'Plastic (recycled)', type: 'number', unit: 'MT', fieldLetter: 'c' },
  { id: 'secondary_paper_virgin', label: 'Paper (virgin)', type: 'number', unit: 'MT', fieldLetter: 'd' },
  { id: 'secondary_paper_recycled', label: 'Paper (recycled)', type: 'number', unit: 'MT', fieldLetter: 'e' },
  { id: 'secondary_metal', label: 'Metal', type: 'number', unit: 'MT', fieldLetter: 'f' },
  { id: 'secondary_glass', label: 'Glass', type: 'number', unit: 'MT', fieldLetter: 'g' },
  { id: 'secondary_plant_based', label: 'Plant based (Hemp, Seaweed, Bamboo etc.), please specify', type: 'text', unit: 'MT', fieldLetter: 'h' },
  { id: 'secondary_others', label: 'Others, please specify', type: 'text', unit: 'MT', fieldLetter: 'i' },
];

const RECYCLABLE_TOOLTIP = 'Can be collected, sorted, and reprocessed into new material using existing, commonly available recycling systems; typically mono-material formats—both virgin and recycled plastics can be recyclable if designed and collected properly.\n\nCommonly recyclable plastics (in most markets): PET, HDPE, LDPE, PP';

const NON_RECYCLABLE_TOOLTIP = 'Cannot be effectively collected, sorted, or reprocessed using existing, commonly available recycling systems; typically multi-layer or mixed-material (MLP) formats where materials cannot be separated at scale.\n\nCommonly non-recyclable materials (in most markets): MLP sachets and laminates (plastic–plastic or plastic–aluminium), metallised films, PVC, PS, heavily inked or contaminated packaging.';

const SECONDARY_RECYCLABILITY_FIELDS = [
  { id: 'secondary_mono_materials', label: 'Recyclable', type: 'number', unit: '%', tooltip: RECYCLABLE_TOOLTIP, fieldLetter: 'j' },
  { id: 'secondary_multi_layered', label: 'Non-Recyclable', type: 'number', unit: '%', tooltip: NON_RECYCLABLE_TOOLTIP, fieldLetter: 'k' },
];


export const FoodBPCNutraPackagingDetailed = ({
  formData,
  onInputChange,
  readOnly = false,
}: FoodBPCNutraPackagingDetailedProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const getFieldKey = (section: string, id: string) => `food_pkg_detailed_${section}_${id}`;

  const getValue = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return (formData[key] as string) || '';
  };

  const handleChange = (section: string, id: string, value: string) => {
    const key = getFieldKey(section, id);
    onInputChange(key, value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-esg-environmental" />
          Secondary Packaging Metrics
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Secondary Packaging metrics.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
            <h4 className="text-sm font-medium flex items-center">
              <CellNumberBadge kpiNumber={5} />
              Secondary Packaging
            </h4>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[450px]">Metric</TableHead>
                    <TableHead className="w-[100px]">Unit</TableHead>
                    <TableHead className="w-[300px]">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Total material for secondary */}
                  {SECONDARY_PACKAGING_FIELDS.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center">
                          <CellNumberBadge kpiNumber={field.kpiNumber} fieldLetter={field.fieldLetter} />
                          {field.label}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={getValue('secondary', field.id)}
                            onChange={(e) => handleChange('secondary', field.id, e.target.value)}
                            className="w-40 h-9 text-sm"
                            disabled={readOnly}
                          />
                          <span className="text-xs text-muted-foreground">{field.unit}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Breakup header */}
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell colSpan={3} className="font-medium text-sm py-2">
                      Breakup of materials used for secondary packaging
                    </TableCell>
                  </TableRow>
                  
                  {SECONDARY_BREAKUP_FIELDS.map((field) => {
                    const totalMaterial = parseFloat(getValue('secondary', 'secondary_total_material')) || 0;
                    const fieldValue = parseFloat(getValue('secondary_breakup', field.id)) || 0;
                    const percentage = totalMaterial > 0 ? ((fieldValue / totalMaterial) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm pl-8">
                        <div className="flex items-center">
                          <CellNumberBadge kpiNumber={5} fieldLetter={field.fieldLetter} />
                          {field.label}
                        </div>
                      </TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                        <TableCell>
                          {field.type === 'number' ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={getValue('secondary_breakup', field.id)}
                                onChange={(e) => handleChange('secondary_breakup', field.id, e.target.value)}
                                className="w-32 h-9 text-sm"
                                disabled={readOnly}
                                min={0}
                              />
                              <span className="text-xs text-muted-foreground">MT</span>
                              <Badge variant="outline" className="text-xs ml-1">{percentage}%</Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={getValue('secondary_breakup', field.id)}
                                onChange={(e) => handleChange('secondary_breakup', field.id, e.target.value)}
                                className="w-32 h-9 text-sm"
                                disabled={readOnly}
                                min={0}
                              />
                              <span className="text-xs text-muted-foreground">MT</span>
                              <Badge variant="outline" className="text-xs ml-1">{percentage}%</Badge>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {/* Recyclability header */}
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell colSpan={3} className="font-medium text-sm py-2">
                      Recyclability of materials (%)
                    </TableCell>
                  </TableRow>
                  
                  {SECONDARY_RECYCLABILITY_FIELDS.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm pl-8">
                        <div className="flex items-center gap-1.5">
                          <CellNumberBadge kpiNumber={5} fieldLetter={field.fieldLetter} />
                          {field.label}
                          {field.tooltip && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-sm whitespace-pre-line">
                                <p className="text-xs">{field.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={getValue('secondary_recyclability', field.id)}
                            onChange={(e) => handleChange('secondary_recyclability', field.id, e.target.value)}
                            className="w-32 h-9 text-sm"
                            disabled={readOnly}
                            min={0}
                            max={100}
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Nature of plastics used */}
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell colSpan={3} className="font-medium text-sm py-2">
                      <div className="flex items-start gap-1.5">
                        <span>For your top 3-5 packaging SKUs, share: Product name | packaging weight (MT) | plastic type used (#1-7, check description), and % recyclable vs. non-recyclable.</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-sm whitespace-pre-line">
                            <p className="text-xs">{PLASTICS_INFO}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={3} className="py-3">
                      <Textarea
                        placeholder="Example:&#10;Shampoo | 4 MT | HDPE #1 bottle + PP #5 cap | 80% recyclable, 15% non-recyclable (cap/pump)&#10;Granola Bar | 2 MT | LDPE #4 wrapper + BOPP laminate | 0% recyclable (multi-layer packaging)"
                        value={getValue('secondary_plastics', 'nature_details')}
                        onChange={(e) => handleChange('secondary_plastics', 'nature_details', e.target.value)}
                        className="min-h-[120px] text-sm"
                        disabled={readOnly}
                      />
                    </TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
