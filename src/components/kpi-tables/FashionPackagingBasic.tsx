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
import { Shirt, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ApproachVisionInput } from './ApproachVisionInput';
import { CellNumberBadge } from './CellNumberBadge';

interface FashionPackagingBasicProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

// Total Materials - KPI 1
const TOTAL_MATERIALS_FIELDS = [
  { id: 'textile_amount', label: 'Textile (define relevant Units)', type: 'text', unit: 'Units', fieldLetter: 'a' },
  { id: 'plastic_amount', label: 'Plastic', type: 'number', unit: 'MT', fieldLetter: 'b' },
  { id: 'others_amount', label: 'Others - specify, with units', type: 'text', unit: 'Units', fieldLetter: 'c' },
];

// Waste & Recyclability - KPI 2
const WASTE_RECYCLABILITY_FIELDS = [
  { id: 'textile_waste_pct', label: '% of textile waste generated during manufacturing (as % of total textile)', type: 'number', unit: '%', fieldLetter: 'a' },
  { id: 'post_manufacturing_waste_pct', label: 'Estimated % of post manufacturing waste such as returns, unsold inventory etc.', type: 'number', unit: '%', fieldLetter: 'b' },
];

// KPI 2 continued - Textile Recyclability sub-fields
const TEXTILE_RECYCLABILITY_FIELDS = [
  { id: 'mono_materials_pct', label: 'Mono materials', type: 'number', unit: '%', fieldLetter: 'c' },
  { id: 'mixed_materials_pct', label: 'Mixed materials', type: 'number', unit: '%', fieldLetter: 'd' },
  { id: 'others_pct', label: 'Others', type: 'text', unit: '%', fieldLetter: 'e' },
];

// Type of textile materials sourced - KPI 3
const TEXTILE_TYPES_FIELDS = [
  { id: 'polyester_pct', label: 'Polyester', type: 'number', unit: '%', fieldLetter: 'a' },
  { id: 'nylon_pct', label: 'Nylon (Polyamide)', type: 'number', unit: '%', fieldLetter: 'b' },
  { id: 'acrylic_pct', label: 'Acrylic', type: 'number', unit: '%', fieldLetter: 'c' },
  { id: 'spandex_pct', label: 'Spandex (Elastane/Lycra)', type: 'number', unit: '%', fieldLetter: 'd' },
  { id: 'polypropylene_pct', label: 'Polypropylene', type: 'number', unit: '%', fieldLetter: 'e' },
  { id: 'cotton_pct', label: 'Cotton', type: 'number', unit: '%', fieldLetter: 'f' },
  { id: 'others_pct', label: 'Others', type: 'text', unit: '%', fieldLetter: 'g' },
];

// Warehouse Packaging - KPI 4
const WAREHOUSE_PACKAGING_FIELDS = [
  { id: 'warehouse_total_material', label: 'Total amount of packaging material used for warehouse packaging', type: 'number', unit: 'MT', fieldLetter: 'a' },
];

const WAREHOUSE_BREAKUP_FIELDS = [
  { id: 'warehouse_plastic_virgin', label: 'Plastic (virgin)', type: 'number', unit: '%', fieldLetter: 'b' },
  { id: 'warehouse_plastic_recycled', label: 'Plastic (recycled)', type: 'number', unit: '%', fieldLetter: 'c' },
  { id: 'warehouse_paper_paperboard', label: 'Paper/ Paperboard', type: 'number', unit: '%', fieldLetter: 'd' },
  { id: 'warehouse_others', label: 'Others, please specify', type: 'text', unit: '%', fieldLetter: 'e' },
];

// Primary Packaging - KPI 5
const PRIMARY_PACKAGING_FIELDS = [
  { id: 'primary_total_material', label: 'Total amount of packaging material used for primary packaging', type: 'number', unit: 'MT', fieldLetter: 'a' },
];

const PRIMARY_BREAKUP_FIELDS = [
  { id: 'primary_plastic_virgin', label: 'Plastic (virgin)', type: 'number', unit: '%', fieldLetter: 'b' },
  { id: 'primary_plastic_recycled', label: 'Plastic (recycled)', type: 'number', unit: '%', fieldLetter: 'c' },
  { id: 'primary_paper_virgin', label: 'Paper (virgin)', type: 'number', unit: '%', fieldLetter: 'd' },
  { id: 'primary_paper_recycled', label: 'Paper (recycled)', type: 'number', unit: '%', fieldLetter: 'e' },
  { id: 'primary_fabric', label: 'Fabric', type: 'number', unit: '%', fieldLetter: 'f' },
  { id: 'primary_others', label: 'Others, please specify', type: 'text', unit: '%', fieldLetter: 'g' },
];

// Compliance Details - KPI 6
const COMPLIANCE_FIELDS = [
  { id: 'epr_targets_cpcb', label: 'EPR Targets as Defined by CPCB (Target based on last completed FY (April-March))', type: 'text', unit: 'MT', fieldLetter: 'a' },
  { id: 'epr_compliance_pct', label: 'Compliance to EPR targets defined above', type: 'text', unit: '%', fieldLetter: 'b' },
  { id: 'voluntary_plastic_neutrality', label: 'Voluntary Plastic Neutrality Initiatives (% of materials being recycled, if EPR is not applicable)', type: 'text', unit: '%', fieldLetter: 'c' },
  { id: 'epr_partner_name', label: 'Name of EPR/ Voluntary Plastic Neutrality partner (optional)', type: 'text', unit: 'Optional', fieldLetter: 'd' },
  { id: 'packaging_reduction_programs', label: 'Packaging reduction or take back programs - give details', type: 'textarea', maxWords: 300, fieldLetter: 'e' },
];

export const FashionPackagingBasic = ({
  formData,
  onInputChange,
  readOnly = false,
}: FashionPackagingBasicProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['approach', 'materials', 'waste', 'textile_types', 'warehouse', 'primary', 'compliance'])
  );

  const getFieldKey = (section: string, id: string) => `fashion_pkg_basic_${section}_${id}`;

  const getValue = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return (formData[key] as string) || '';
  };

  const handleChange = (section: string, id: string, value: string) => {
    const key = getFieldKey(section, id);
    onInputChange(key, value);
  };

  // Helper functions for weblinks and documents
  const getWeblinks = (fieldId: string): string[] => {
    const key = `fashion_pkg_basic_approach_${fieldId}_weblinks`;
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
    const key = `fashion_pkg_basic_approach_${fieldId}_weblinks`;
    onInputChange(key, JSON.stringify(links));
  };

  const getDocuments = (fieldId: string): string[] => {
    const key = `fashion_pkg_basic_approach_${fieldId}_documents`;
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
    const key = `fashion_pkg_basic_approach_${fieldId}_documents`;
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

  const renderField = (section: string, field: { id: string; label: string; type: string; unit?: string; maxWords?: number }) => {
    if (field.type === 'textarea') {
      return (
        <Textarea
          placeholder={`Enter details (max ${field.maxWords} words)...`}
          value={getValue(section, field.id)}
          onChange={(e) => handleChange(section, field.id, e.target.value)}
          className="min-h-[120px] text-sm"
          disabled={readOnly}
        />
      );
    } else if (field.type === 'number') {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="0"
            value={getValue(section, field.id)}
            onChange={(e) => handleChange(section, field.id, e.target.value)}
            className="w-40 h-9 text-sm"
            disabled={readOnly}
            min={field.unit === '%' ? 0 : undefined}
            max={field.unit === '%' ? 100 : undefined}
          />
          <span className="text-xs text-muted-foreground">{field.unit}</span>
        </div>
      );
    } else {
      return (
        <Input
          type="text"
          placeholder="Enter value..."
          value={getValue(section, field.id)}
          onChange={(e) => handleChange(section, field.id, e.target.value)}
          className="h-9 text-sm"
          disabled={readOnly}
        />
      );
    }
  };

  const renderSection = (
    title: string,
    sectionId: string,
    fields: Array<{ id: string; label: string; type: string; unit?: string; maxWords?: number; fieldLetter?: string }>,
    kpiNumber: number
  ) => (
    <Collapsible open={openSections.has(sectionId)} onOpenChange={() => toggleSection(sectionId)}>
      <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
        <h4 className="text-sm font-medium flex items-center">
          <CellNumberBadge kpiNumber={kpiNumber} />
          {title}
        </h4>
        {openSections.has(sectionId) ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
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
              {fields.map((field) => (
                <TableRow key={`${sectionId}-${field.id}`}>
                  <TableCell className="font-medium text-sm align-top py-3">
                    <div className="flex items-center">
                      <CellNumberBadge kpiNumber={kpiNumber} fieldLetter={field.fieldLetter} />
                      {field.label}
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-3">
                    <Badge variant="secondary" className="text-xs">{field.unit || 'Text'}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {renderField(sectionId, field)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderBreakupSection = (
    title: string,
    sectionId: string,
    totalFields: Array<{ id: string; label: string; type: string; unit?: string; fieldLetter?: string }>,
    breakupFields: Array<{ id: string; label: string; type: string; unit?: string; fieldLetter?: string }>,
    noteField?: boolean,
    kpiNumber?: number
  ) => (
    <Collapsible open={openSections.has(sectionId)} onOpenChange={() => toggleSection(sectionId)}>
      <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
        <h4 className="text-sm font-medium flex items-center">
          {kpiNumber && <CellNumberBadge kpiNumber={kpiNumber} />}
          {title}
        </h4>
        {openSections.has(sectionId) ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
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
              {/* Total material */}
              {totalFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center">
                      {kpiNumber && <CellNumberBadge kpiNumber={kpiNumber} fieldLetter={field.fieldLetter} />}
                      {field.label}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={getValue(sectionId, field.id)}
                        onChange={(e) => handleChange(sectionId, field.id, e.target.value)}
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
                  Breakup of materials used (%)
                </TableCell>
              </TableRow>
              
              {breakupFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium text-sm pl-8">
                    <div className="flex items-center">
                      {kpiNumber && <CellNumberBadge kpiNumber={kpiNumber} fieldLetter={field.fieldLetter} />}
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
                          value={getValue(`${sectionId}_breakup`, field.id)}
                          onChange={(e) => handleChange(`${sectionId}_breakup`, field.id, e.target.value)}
                          className="w-32 h-9 text-sm"
                          disabled={readOnly}
                          min={0}
                          max={100}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    ) : (
                      <Input
                        type="text"
                        placeholder="Specify type and %..."
                        value={getValue(`${sectionId}_breakup`, field.id)}
                        onChange={(e) => handleChange(`${sectionId}_breakup`, field.id, e.target.value)}
                        className="h-9 text-sm"
                        disabled={readOnly}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Reuse notes for warehouse */}
              {noteField && (
                <>
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell colSpan={3} className="font-medium text-sm py-2">
                      Notes on reuse of packaging materials
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="py-3">
                      <Textarea
                        placeholder="Add notes on reuse of packaging materials..."
                        value={getValue(sectionId, 'reuse_notes')}
                        onChange={(e) => handleChange(sectionId, 'reuse_notes', e.target.value)}
                        className="min-h-[80px] text-sm"
                        disabled={readOnly}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shirt className="w-4 h-4 text-esg-environmental" />
          Sustainable Materials MIS
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          All metrics except Secondary Packaging. Secondary Packaging is available under Packaging Metrics (Detailed).
        </p>
      </CardHeader>
      <CardContent className="p-0 space-y-0">
        {/* Approach & Vision Section - Enhanced with weblinks and documents */}
        <Collapsible open={openSections.has('approach')} onOpenChange={() => toggleSection('approach')}>
          <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
            <h4 className="text-sm font-medium">Approach & Vision</h4>
            {openSections.has('approach') ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-2 space-y-6">
              {/* Current Approach Field */}
              <ApproachVisionInput
                label="Current approach, policy, challenges, achievements, certifications towards sustainable materials"
                textareaValue={getValue('approach', 'current_approach')}
                onTextareaChange={(value) => handleChange('approach', 'current_approach', value)}
                weblinks={getWeblinks('current_approach')}
                onWeblinksChange={(links) => setWeblinks('current_approach', links)}
                documents={getDocuments('current_approach')}
                onDocumentsChange={(docs) => setDocuments('current_approach', docs)}
                maxWords={300}
                readOnly={readOnly}
              />
              
              {/* Vision & Plans Field */}
              <ApproachVisionInput
                label="Vision and plans towards sustainable materials"
                textareaValue={getValue('approach', 'vision_plans')}
                onTextareaChange={(value) => handleChange('approach', 'vision_plans', value)}
                weblinks={getWeblinks('vision_plans')}
                onWeblinksChange={(links) => setWeblinks('vision_plans', links)}
                documents={getDocuments('vision_plans')}
                onDocumentsChange={(docs) => setDocuments('vision_plans', docs)}
                maxWords={300}
                readOnly={readOnly}
              />
              
              {/* Circularity Programs - just textarea */}
              <div className="space-y-2 py-3">
                <label className="text-sm font-medium">Circularity or take back programs - give details</label>
                <Textarea
                  placeholder="Enter details (max 300 words)..."
                  value={getValue('approach', 'circularity_programs')}
                  onChange={(e) => handleChange('approach', 'circularity_programs', e.target.value)}
                  className="min-h-[120px] text-sm"
                  disabled={readOnly}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Total Amount of Materials Used Section - KPI 1 */}
        {renderSection('Total Amount of Materials Used', 'materials', TOTAL_MATERIALS_FIELDS, 1)}
        {/* Waste & Recyclability Section - KPI 2 */}
        <Collapsible open={openSections.has('waste')} onOpenChange={() => toggleSection('waste')}>
          <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
            <h4 className="text-sm font-medium flex items-center">
              <CellNumberBadge kpiNumber={2} />
              Waste & Recyclability of Textile Materials
            </h4>
            {openSections.has('waste') ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
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
                  {WASTE_RECYCLABILITY_FIELDS.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center">
                          <CellNumberBadge kpiNumber={2} fieldLetter={field.fieldLetter} />
                          {field.label}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{field.unit}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={getValue('waste', field.id)}
                            onChange={(e) => handleChange('waste', field.id, e.target.value)}
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
                  
                  {/* Recyclability header */}
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell colSpan={3} className="font-medium text-sm py-2">
                      Recyclability of textile materials (%)
                    </TableCell>
                  </TableRow>
                  
                  {TEXTILE_RECYCLABILITY_FIELDS.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium text-sm pl-8">
                        <div className="flex items-center">
                          <CellNumberBadge kpiNumber={2} fieldLetter={field.fieldLetter} />
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
                              value={getValue('waste_recyclability', field.id)}
                              onChange={(e) => handleChange('waste_recyclability', field.id, e.target.value)}
                              className="w-32 h-9 text-sm"
                              disabled={readOnly}
                              min={0}
                              max={100}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        ) : (
                          <Input
                            type="text"
                            placeholder="Specify and %..."
                            value={getValue('waste_recyclability', field.id)}
                            onChange={(e) => handleChange('waste_recyclability', field.id, e.target.value)}
                            className="h-9 text-sm"
                            disabled={readOnly}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Type of Textile Materials Sourced - KPI 3 */}
        {renderSection('Type of Textile Materials Sourced', 'textile_types', TEXTILE_TYPES_FIELDS, 3)}
        
        {/* Warehouse Packaging Section - KPI 4 */}
        {renderBreakupSection('Warehouse Packaging', 'warehouse', WAREHOUSE_PACKAGING_FIELDS, WAREHOUSE_BREAKUP_FIELDS, true, 4)}
        
        {/* Primary Packaging Section - KPI 5 */}
        {renderBreakupSection('Primary Packaging', 'primary', PRIMARY_PACKAGING_FIELDS, PRIMARY_BREAKUP_FIELDS, false, 5)}
        
        {/* Compliance Details Section - KPI 6 */}
        {renderSection('Compliance Details', 'compliance', COMPLIANCE_FIELDS, 6)}
      </CardContent>
    </Card>
  );
};
