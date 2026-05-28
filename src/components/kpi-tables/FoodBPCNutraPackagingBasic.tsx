import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PackageOpen, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ApproachVisionInput } from './ApproachVisionInput';
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
interface FoodBPCNutraPackagingBasicProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}
const TOTAL_PACKAGING_FIELDS = [{
  id: 'total_material_used',
  label: 'Total amount of packaging material used',
  type: 'number',
  unit: 'MT',
  fieldLetter: 'a'
}, {
  id: 'total_material_recycled',
  label: 'Total amount of packaging material recycled',
  type: 'number',
  unit: 'MT',
  fieldLetter: 'b'
}];
const COMPLIANCE_FIELDS = [{
  id: 'epr_targets_cpcb',
  label: 'EPR Targets as Defined by CPCB (Target based on last completed FY (April-March))',
  type: 'text',
  unit: 'MT',
  tooltip: 'Plastic waste collection and recycling targets i.e. Extended Producer Responsibility (EPR) targets assigned by Central Pollution Control Board (CPCB)',
  fieldLetter: 'a'
}, {
  id: 'epr_compliance_pct',
  label: 'Compliance to EPR targets defined above',
  type: 'text',
  unit: '%',
  tooltip: '% compliance to target defined above',
  fieldLetter: 'b'
}, {
  id: 'voluntary_plastic_neutrality',
  label: 'Voluntary Plastic Neutrality Initiatives',
  type: 'text',
  unit: '%',
  tooltip: '% of packaging waste managed through offset, recovery, or reduction initiatives, if EPR is not applicable',
  fieldLetter: 'c'
}, {
  id: 'epr_partner_name',
  label: 'Name of EPR/ Voluntary Plastic Neutrality/ program partner(s)',
  type: 'text',
  unit: 'Optional',
  tooltip: 'E.g. Recykal, Recircle etc',
  fieldLetter: 'd'
}, {
  id: 'waste_expenditure',
  label: 'Expenditure incurred to manage waste-related initiatives (For the Quarter)',
  type: 'number',
  unit: 'INR Cr',
  tooltip: 'Total spend on managing plastic and other waste, including EPR fees, recycling, voluntary initiatives like redesigning, take back program etc.',
  fieldLetter: 'e'
}];
const PRIMARY_PACKAGING_FIELDS = [{
  id: 'primary_total_material',
  label: 'Total amount of packaging material used for primary packaging',
  type: 'number',
  unit: 'MT',
  tooltip: 'Packaging that directly touches and protects the product. Examples: bottle, tube, jar, blister pack, sachet.',
  fieldLetter: 'a'
}];
const PRIMARY_BREAKUP_FIELDS = [{
  id: 'primary_plastic_virgin',
  label: 'Plastic (virgin)',
  type: 'number',
  unit: 'MT',
  tooltip: 'Packaging material made directly from natural resources that has never been used or processed before.',
  fieldLetter: 'b'
}, {
  id: 'primary_plastic_recycled',
  label: 'Plastic (recycled)',
  type: 'number',
  unit: 'MT',
  tooltip: 'Material made from waste that has already been used (by consumers or factories), then collected, cleaned, and reprocessed into new packaging.',
  fieldLetter: 'c'
}, {
  id: 'primary_paper_virgin',
  label: 'Paper (virgin)',
  type: 'number',
  unit: 'MT',
  fieldLetter: 'd'
}, {
  id: 'primary_paper_recycled',
  label: 'Paper (recycled)',
  type: 'number',
  unit: 'MT',
  fieldLetter: 'e'
}, {
  id: 'primary_metal',
  label: 'Metal',
  type: 'number',
  unit: 'MT',
  fieldLetter: 'f'
}, {
  id: 'primary_glass',
  label: 'Glass',
  type: 'number',
  unit: 'MT',
  fieldLetter: 'g'
}, {
  id: 'primary_plant_based',
  label: 'Plant based (Hemp, Seaweed, Bamboo etc.), please specify',
  type: 'text',
  unit: 'MT',
  fieldLetter: 'h'
}, {
  id: 'primary_others',
  label: 'Others, please specify',
  type: 'text',
  unit: 'MT',
  fieldLetter: 'i'
}];
const PRIMARY_RECYCLABILITY_FIELDS = [{
  id: 'primary_mono_materials',
  label: 'Recyclable',
  type: 'number',
  unit: '%',
  tooltip: 'Can be collected, sorted, and reprocessed into new material using existing, commonly available recycling systems; typically mono-material formats—both virgin and recycled plastics can be recyclable if designed and collected properly.\n\nCommonly recyclable plastics (in most markets): PET, HDPE, LDPE, PP',
  fieldLetter: 'j'
}, {
  id: 'primary_multi_layered',
  label: 'Non-Recyclable',
  type: 'number',
  unit: '%',
  tooltip: 'Cannot be effectively collected, sorted, or reprocessed using existing, commonly available recycling systems; typically multi-layer or mixed-material (MLP) formats where materials cannot be separated at scale.\n\nCommonly non-recyclable materials (in most markets): MLP sachets and laminates (plastic–plastic or plastic–aluminium), metallised films, PVC, PS, heavily inked or contaminated packaging.',
  fieldLetter: 'k'
}];
export const FoodBPCNutraPackagingBasic = ({
  formData,
  onInputChange,
  readOnly = false
}: FoodBPCNutraPackagingBasicProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['approach', 'total', 'compliance', 'primary']));
  const getFieldKey = (section: string, id: string) => `food_pkg_basic_${section}_${id}`;
  const getValue = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return formData[key] as string || '';
  };
  const handleChange = (section: string, id: string, value: string) => {
    const key = getFieldKey(section, id);
    onInputChange(key, value);
  };

  // Helper functions for weblinks and documents
  const getWeblinks = (fieldId: string): string[] => {
    const key = `food_pkg_basic_approach_${fieldId}_weblinks`;
    const value = formData[key] as string;
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const setWeblinks = (fieldId: string, links: string[]) => {
    const key = `food_pkg_basic_approach_${fieldId}_weblinks`;
    onInputChange(key, JSON.stringify(links));
  };
  const getDocuments = (fieldId: string): string[] => {
    const key = `food_pkg_basic_approach_${fieldId}_documents`;
    const value = formData[key] as string;
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const setDocuments = (fieldId: string, docs: string[]) => {
    const key = `food_pkg_basic_approach_${fieldId}_documents`;
    onInputChange(key, JSON.stringify(docs));
  };
  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };
  const renderField = (section: string, field: {
    id: string;
    label: string;
    type: string;
    unit?: string;
    maxWords?: number;
  }) => {
    if (field.type === 'textarea') {
      return <Textarea placeholder={`Enter details${field.maxWords ? ` (max ${field.maxWords} words)` : ''}...`} value={getValue(section, field.id)} onChange={e => handleChange(section, field.id, e.target.value)} className="min-h-[120px] text-sm" disabled={readOnly} />;
    } else if (field.type === 'number') {
      return <div className="flex items-center gap-2">
          <Input type="number" placeholder="0" value={getValue(section, field.id)} onChange={e => handleChange(section, field.id, e.target.value)} className="w-40 h-9 text-sm" disabled={readOnly} min={field.unit === '%' ? 0 : undefined} max={field.unit === '%' ? 100 : undefined} />
          {field.unit && <span className="text-xs text-muted-foreground">{field.unit}</span>}
        </div>;
    } else {
      return <Input type="text" placeholder="Enter value..." value={getValue(section, field.id)} onChange={e => handleChange(section, field.id, e.target.value)} className="h-9 text-sm" disabled={readOnly} />;
    }
  };
  const renderSection = (title: string, sectionId: string, fields: Array<{
    id: string;
    label: string;
    type: string;
    unit?: string;
    maxWords?: number;
    tooltip?: string;
    fieldLetter?: string;
  }>, kpiNumber?: number) => <Collapsible open={openSections.has(sectionId)} onOpenChange={() => toggleSection(sectionId)}>
      <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
        <h4 className="text-sm font-medium flex items-center">
          {kpiNumber && <CellNumberBadge kpiNumber={kpiNumber} />}
          {title}
        </h4>
        {openSections.has(sectionId) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
              {fields.map(field => <TableRow key={`${sectionId}-${field.id}`}>
                  <TableCell className="font-medium text-sm align-top py-3">
                    <div className="flex items-center gap-1.5">
                      {kpiNumber && field.fieldLetter && <CellNumberBadge kpiNumber={kpiNumber} fieldLetter={field.fieldLetter} />}
                      {field.label}
                      {field.tooltip && <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-sm">
                            <p className="text-xs">{field.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>}
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-3">
                    <Badge variant="secondary" className="text-xs">{field.unit || 'Text'}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {renderField(sectionId, field)}
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>;
  return <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PackageOpen className="w-4 h-4 text-esg-environmental" />
          Packaging Metrics
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">All metrics except Secondary / Tertiary Packaging. </p>
      </CardHeader>
      <CardContent className="p-0 space-y-0">
        {/* Approach & Vision Section - Enhanced with weblinks and documents */}
        <Collapsible open={openSections.has('approach')} onOpenChange={() => toggleSection('approach')}>
          <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
            <h4 className="text-sm font-medium flex items-center">
              <CellNumberBadge kpiNumber={1} />
              Approach & Vision
            </h4>
            {openSections.has('approach') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-2 space-y-6">
              {/* Current Approach Field */}
              <ApproachVisionInput 
                label="Current approach, policy, challenges, achievements, certifications towards sustainable packaging" 
                textareaValue={getValue('approach', 'current_approach')} 
                onTextareaChange={value => handleChange('approach', 'current_approach', value)} 
                weblinks={getWeblinks('current_approach')} 
                onWeblinksChange={links => setWeblinks('current_approach', links)} 
                documents={getDocuments('current_approach')} 
                onDocumentsChange={docs => setDocuments('current_approach', docs)} 
                maxWords={300} 
                readOnly={readOnly}
                tooltip="You need to fill this data once. Next quarter onwards, the data shared in the previous quarter will be pre-filled in the cells. Please update in case there are any changes."
              />
              
              {/* Vision & Plans Field */}
              <ApproachVisionInput 
                label="Vision and plans towards sustainable packaging" 
                textareaValue={getValue('approach', 'vision_plans')} 
                onTextareaChange={value => handleChange('approach', 'vision_plans', value)} 
                weblinks={getWeblinks('vision_plans')} 
                onWeblinksChange={links => setWeblinks('vision_plans', links)} 
                documents={getDocuments('vision_plans')} 
                onDocumentsChange={docs => setDocuments('vision_plans', docs)} 
                maxWords={300} 
                readOnly={readOnly}
                tooltip="You need to fill this data once. Next quarter onwards, the data shared in the previous quarter will be pre-filled in the cells. Please update in case there are any changes."
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Total Packaging Section */}
        {renderSection('Total Packaging', 'total', TOTAL_PACKAGING_FIELDS, 2)}
        
        {/* Compliance Details Section */}
        {renderSection('Compliance Details', 'compliance', COMPLIANCE_FIELDS, 3)}
        
        {/* Primary Packaging Section */}
        <Collapsible open={openSections.has('primary')} onOpenChange={() => toggleSection('primary')}>
          <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
            <h4 className="text-sm font-medium flex items-center">
              <CellNumberBadge kpiNumber={4} />
              Primary Packaging
            </h4>
            {openSections.has('primary') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
                  {/* Total material for primary */}
                  {PRIMARY_PACKAGING_FIELDS.map(field => <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center gap-1.5">
                          <CellNumberBadge kpiNumber={4} fieldLetter={field.fieldLetter} />
                          {field.label}
                          {field.tooltip && <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-sm">
                                <p className="text-xs">{field.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input type="number" placeholder="0" value={getValue('primary', field.id)} onChange={e => handleChange('primary', field.id, e.target.value)} className="w-40 h-9 text-sm" disabled={readOnly} />
                          <span className="text-xs text-muted-foreground">{field.unit}</span>
                        </div>
                      </TableCell>
                    </TableRow>)}
                  
                  {/* Breakup header */}
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell colSpan={3} className="font-medium text-sm py-2">
                      Breakup of materials used for primary packaging
                    </TableCell>
                  </TableRow>
                  
                  {PRIMARY_BREAKUP_FIELDS.map(field => {
                    const totalMaterial = parseFloat(getValue('primary', 'primary_total_material')) || 0;
                    const fieldValue = parseFloat(getValue('primary_breakup', field.id)) || 0;
                    const percentage = totalMaterial > 0 ? ((fieldValue / totalMaterial) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium text-sm pl-8">
                          <div className="flex items-center gap-1.5">
                            <CellNumberBadge kpiNumber={4} fieldLetter={field.fieldLetter} />
                            {field.label}
                            {field.tooltip && <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-sm">
                                  <p className="text-xs">{field.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>}
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                        <TableCell>
                          {field.type === 'number' ? (
                            <div className="flex items-center gap-2">
                              <Input type="number" placeholder="0" value={getValue('primary_breakup', field.id)} onChange={e => handleChange('primary_breakup', field.id, e.target.value)} className="w-32 h-9 text-sm" disabled={readOnly} min={0} />
                              <span className="text-xs text-muted-foreground">MT</span>
                              <Badge variant="outline" className="text-xs ml-1">{percentage}%</Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input type="number" placeholder="0" value={getValue('primary_breakup', field.id)} onChange={e => handleChange('primary_breakup', field.id, e.target.value)} className="w-32 h-9 text-sm" disabled={readOnly} min={0} />
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
                  
                  {PRIMARY_RECYCLABILITY_FIELDS.map(field => <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm pl-8">
                        <div className="flex items-center gap-1.5">
                          <CellNumberBadge kpiNumber={4} fieldLetter={field.fieldLetter} />
                          {field.label}
                          {field.tooltip && <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-sm whitespace-pre-line">
                                <p className="text-xs">{field.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input type="number" placeholder="0" value={getValue('primary_recyclability', field.id)} onChange={e => handleChange('primary_recyclability', field.id, e.target.value)} className="w-32 h-9 text-sm" disabled={readOnly} min={0} max={100} />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                      </TableCell>
                    </TableRow>)}
                  
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>;
};