import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Shirt, Package, Recycle, FileText, Warehouse } from 'lucide-react';
import { ApproachVisionInput } from './ApproachVisionInput';
import { CellNumberBadge } from './CellNumberBadge';
import { FormattedNumberInput } from '@/components/ui/formatted-number-input';
import { parseFormattedNumber } from '@/lib/formatNumber';

interface FashionMaterialsTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

const RECYCLABLE_TOOLTIP = `Can be collected, sorted, and reprocessed into new fibres, yarns or feedstock using existing, textile recycling systems; typically mono-fibre or single-polymer formats and minimally contaminated.

Commonly recyclable textiles (in most markets): mono-polyester (PET) garments and fibres, certain recyclable cotton, select nylons (where chemical recycling streams exist) and reclaimed wool in dedicated collection streams.`;

const NON_RECYCLABLE_TOOLTIP = `Cannot be effectively collected, sorted, or reprocessed using existing recycling systems, typically multi-fibre blends, coated or laminated fabrics, or heavily contaminated/trimmed garments where materials cannot be separated at scale.

Commonly non-recyclable textiles (in most markets): poly-cotton and polyester-elastane blends, fabrics with PU/PU-laminate or PVC coatings, laminated technical composites, garments with bonded trims or mixed hardware, and heavily soiled or chemically treated textiles.`;

const MATERIAL_TYPES = [
  { key: 'cotton', label: 'Cotton' },
  { key: 'polyester', label: 'Polyester' },
  { key: 'nylon', label: 'Nylon' },
  { key: 'wool', label: 'Wool' },
  { key: 'silk', label: 'Silk' },
  { key: 'linen', label: 'Linen' },
  { key: 'viscose', label: 'Viscose/Rayon' },
  { key: 'elastane', label: 'Elastane/Spandex' },
  { key: 'other', label: 'Other' },
];

const PACKAGING_MATERIALS = [
  { key: 'cardboard', label: 'Cardboard' },
  { key: 'paper', label: 'Paper' },
  { key: 'plastic_recyclable', label: 'Plastic (Recyclable)' },
  { key: 'plastic_non_recyclable', label: 'Plastic (Non-Recyclable)' },
  { key: 'fabric', label: 'Fabric/Cloth' },
  { key: 'other', label: 'Other' },
];

const getWordCount = (text: string): number => {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
};

// Helper to parse JSON array from formData
const parseJsonArray = (value: string | number | boolean | undefined): string[] => {
  if (!value || typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const FashionMaterialsTable = ({ formData, onInputChange, readOnly = false }: FashionMaterialsTableProps) => {
  const reuseNoteText = (formData['fashion_packaging_reuse_note'] as string) || '';
  
  // Approach and Vision state
  const approachVisionText = (formData['fashion_materials_approach_vision'] as string) || '';
  const approachWeblinks = parseJsonArray(formData['fashion_materials_weblinks']);
  const approachDocuments = parseJsonArray(formData['fashion_materials_documents']);

  const handleWeblinksChange = (links: string[]) => {
    onInputChange('fashion_materials_weblinks', JSON.stringify(links));
  };

  const handleDocumentsChange = (docs: string[]) => {
    onInputChange('fashion_materials_documents', JSON.stringify(docs));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Approach and Vision */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={1} />
              <Shirt className="w-4 h-4 text-esg-environment" />
              Approach and Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ApproachVisionInput
              label="Current approach, policy, challenges, achievements, certifications towards sustainable materials and packaging"
              textareaValue={approachVisionText}
              onTextareaChange={(value) => onInputChange('fashion_materials_approach_vision', value)}
              weblinks={approachWeblinks}
              onWeblinksChange={handleWeblinksChange}
              documents={approachDocuments}
              onDocumentsChange={handleDocumentsChange}
              maxWords={300}
              readOnly={readOnly}
              tooltip="You need to fill this data once. Next quarter onwards, the data shared in the previous quarter will be pre-filled in the cells. Please update in case there are any changes."
            />
            <ApproachVisionInput
              label="Vision and plans towards sustainable packaging"
              textareaValue={(formData['fashion_materials_vision_plans'] as string) || ''}
              onTextareaChange={(value) => onInputChange('fashion_materials_vision_plans', value)}
              weblinks={parseJsonArray(formData['fashion_materials_vision_weblinks'])}
              onWeblinksChange={(links) => onInputChange('fashion_materials_vision_weblinks', JSON.stringify(links))}
              documents={parseJsonArray(formData['fashion_materials_vision_documents'])}
              onDocumentsChange={(docs) => onInputChange('fashion_materials_vision_documents', JSON.stringify(docs))}
              maxWords={300}
              readOnly={readOnly}
              tooltip="You need to fill this data once. Next quarter onwards, the data shared in the previous quarter will be pre-filled in the cells. Please update in case there are any changes."
            />
          </CardContent>
        </Card>

        {/* Total Amount of Materials Used */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={2} />
              <Package className="w-4 h-4 text-esg-environment" />
              Total Amount of Materials Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fashion_total_materials_mt" className="text-sm flex items-center">
                  <CellNumberBadge kpiNumber={2} fieldLetter="a" />
                  Total Materials Used (meters)
                </Label>
                <FormattedNumberInput
                  id="fashion_total_materials_mt"
                  value={String(formData['fashion_total_materials_mt'] || '')}
                  onChange={(value) => onInputChange('fashion_total_materials_mt', value)}
                  placeholder="Enter total in meters"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fashion_sustainable_materials_pct" className="text-sm flex items-center">
                  <CellNumberBadge kpiNumber={2} fieldLetter="b" />
                  Sustainable Materials (%)
                </Label>
                <FormattedNumberInput
                  id="fashion_sustainable_materials_pct"
                  value={String(formData['fashion_sustainable_materials_pct'] || '')}
                  onChange={(value) => onInputChange('fashion_sustainable_materials_pct', value)}
                  placeholder="Enter %"
                  disabled={readOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recyclability of Textile Materials */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={3} />
              <Recycle className="w-4 h-4 text-esg-environment" />
              Recyclability of Textile Materials (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="fashion_recyclable_materials_pct" className="text-sm flex items-center">
                    <CellNumberBadge kpiNumber={3} fieldLetter="a" />
                    Recyclable Materials
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-sm whitespace-pre-line">
                      <p className="text-xs">{RECYCLABLE_TOOLTIP}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="fashion_recyclable_materials_pct"
                  type="text"
                  value={String(formData['fashion_recyclable_materials_pct'] || '')}
                  onChange={(e) => onInputChange('fashion_recyclable_materials_pct', e.target.value)}
                  placeholder="Enter %"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="fashion_non_recyclable_materials_pct" className="text-sm flex items-center">
                    <CellNumberBadge kpiNumber={3} fieldLetter="b" />
                    Non-Recyclable Materials
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-sm whitespace-pre-line">
                      <p className="text-xs">{NON_RECYCLABLE_TOOLTIP}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="fashion_non_recyclable_materials_pct"
                  type="text"
                  value={String(formData['fashion_non_recyclable_materials_pct'] || '')}
                  onChange={(e) => onInputChange('fashion_non_recyclable_materials_pct', e.target.value)}
                  placeholder="Enter %"
                  disabled={readOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type of Textile Materials Sourced */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={4} />
              <Recycle className="w-4 h-4 text-esg-environment" />
              Type of Textile Materials Sourced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Material Type</TableHead>
                    <TableHead className="w-[150px]">Value (meters)</TableHead>
                    <TableHead className="w-[100px]">Percentage (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MATERIAL_TYPES.map((material, index) => {
                    const totalMaterials = parseFloat(parseFormattedNumber(String(formData['fashion_total_materials_mt'] || '0'))) || 0;
                    const materialMT = parseFloat(parseFormattedNumber(String(formData[`fashion_material_${material.key}_mt`] || '0'))) || 0;
                    const autoPercentage = totalMaterials > 0 ? ((materialMT / totalMaterials) * 100).toFixed(2) : '-';
                    const fieldLetter = String.fromCharCode(97 + index); // a, b, c, d...
                    
                    return (
                      <TableRow key={material.key}>
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center">
                            <CellNumberBadge kpiNumber={4} fieldLetter={fieldLetter} />
                            {material.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormattedNumberInput
                            value={String(formData[`fashion_material_${material.key}_mt`] || '')}
                            onChange={(value) => onInputChange(`fashion_material_${material.key}_mt`, value)}
                            placeholder="meters"
                            className="w-28"
                            disabled={readOnly}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {autoPercentage !== '-' ? `${autoPercentage}%` : '-'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Packaging */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={5} />
              <Warehouse className="w-4 h-4 text-esg-environment" />
              Warehouse Packaging
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Breakup of Materials Used (%)</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Material Type</TableHead>
                      <TableHead className="w-[150px]">Value (MT)</TableHead>
                      <TableHead className="w-[100px]">Percentage (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PACKAGING_MATERIALS.map((material, index) => {
                      const fieldLetter = String.fromCharCode(97 + index);
                      const totalWarehouse = PACKAGING_MATERIALS.reduce((sum, m) => {
                        return sum + (parseFloat(parseFormattedNumber(String(formData[`fashion_warehouse_pkg_${m.key}_mt`] || '0'))) || 0);
                      }, 0);
                      const materialMT = parseFloat(parseFormattedNumber(String(formData[`fashion_warehouse_pkg_${material.key}_mt`] || '0'))) || 0;
                      const autoPercentage = totalWarehouse > 0 ? ((materialMT / totalWarehouse) * 100).toFixed(2) : '-';
                      return (
                        <TableRow key={material.key}>
                          <TableCell className="font-medium text-sm">
                            <div className="flex items-center">
                              <CellNumberBadge kpiNumber={5} fieldLetter={fieldLetter} />
                              {material.label}
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormattedNumberInput
                              value={String(formData[`fashion_warehouse_pkg_${material.key}_mt`] || '')}
                              onChange={(value) => onInputChange(`fashion_warehouse_pkg_${material.key}_mt`, value)}
                              placeholder="MT"
                              className="w-28"
                              disabled={readOnly}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {autoPercentage !== '-' ? `${autoPercentage}%` : '-'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fashion_packaging_reuse_note" className="text-sm font-medium">
                Note on Reuse of Packaging Materials
              </Label>
              <Textarea
                id="fashion_packaging_reuse_note"
                placeholder="Describe your practices for reusing packaging materials..."
                value={reuseNoteText}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                  if (words.length <= 300) {
                    onInputChange('fashion_packaging_reuse_note', e.target.value);
                  }
                }}
                className="min-h-[100px] text-sm"
                disabled={readOnly}
              />
              <p className="text-xs text-muted-foreground text-right">
                {getWordCount(reuseNoteText)} / 300 words
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Primary Packaging */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={6} />
              <Package className="w-4 h-4 text-esg-environment" />
              Primary Packaging
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Breakup of Materials Used (%)</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Material Type</TableHead>
                      <TableHead className="w-[150px]">Value (MT)</TableHead>
                      <TableHead className="w-[100px]">Percentage (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PACKAGING_MATERIALS.map((material, index) => {
                      const fieldLetter = String.fromCharCode(97 + index);
                      const totalPrimary = PACKAGING_MATERIALS.reduce((sum, m) => {
                        return sum + (parseFloat(parseFormattedNumber(String(formData[`fashion_primary_pkg_${m.key}_mt`] || '0'))) || 0);
                      }, 0);
                      const materialMT = parseFloat(parseFormattedNumber(String(formData[`fashion_primary_pkg_${material.key}_mt`] || '0'))) || 0;
                      const autoPercentage = totalPrimary > 0 ? ((materialMT / totalPrimary) * 100).toFixed(2) : '-';
                      return (
                        <TableRow key={material.key}>
                          <TableCell className="font-medium text-sm">
                            <div className="flex items-center">
                              <CellNumberBadge kpiNumber={6} fieldLetter={fieldLetter} />
                              {material.label}
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormattedNumberInput
                              value={String(formData[`fashion_primary_pkg_${material.key}_mt`] || '')}
                              onChange={(value) => onInputChange(`fashion_primary_pkg_${material.key}_mt`, value)}
                              placeholder="MT"
                              className="w-28"
                              disabled={readOnly}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {autoPercentage !== '-' ? `${autoPercentage}%` : '-'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={7} />
              <FileText className="w-4 h-4 text-esg-governance" />
              Compliance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fashion_epr_target" className="text-sm flex items-center">
                  <CellNumberBadge kpiNumber={7} fieldLetter="a" />
                  EPR Targets (MT)
                </Label>
                <Input
                  id="fashion_epr_target"
                  type="text"
                  value={String(formData['fashion_epr_target'] || '')}
                  onChange={(e) => onInputChange('fashion_epr_target', e.target.value)}
                  placeholder="Enter tonnes"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fashion_epr_compliance_pct" className="text-sm flex items-center">
                  <CellNumberBadge kpiNumber={7} fieldLetter="b" />
                  Compliance to EPR (%)
                </Label>
                <Input
                  id="fashion_epr_compliance_pct"
                  type="text"
                  value={String(formData['fashion_epr_compliance_pct'] || '')}
                  onChange={(e) => onInputChange('fashion_epr_compliance_pct', e.target.value)}
                  placeholder="Enter %"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fashion_waste_expenditure" className="text-sm flex items-center">
                  <CellNumberBadge kpiNumber={7} fieldLetter="c" />
                  Waste Initiative Expenditure (INR Cr)
                </Label>
                <Input
                  id="fashion_waste_expenditure"
                  type="text"
                  value={String(formData['fashion_waste_expenditure'] || '')}
                  onChange={(e) => onInputChange('fashion_waste_expenditure', e.target.value)}
                  placeholder="Enter INR Cr"
                  disabled={readOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Packaging */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CellNumberBadge kpiNumber={8} />
              <Package className="w-4 h-4 text-esg-environment" />
              Secondary Packaging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Breakup of Materials for Secondary Packaging (%)</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Material Type</TableHead>
                      <TableHead className="w-[150px]">Value (MT)</TableHead>
                      <TableHead className="w-[100px]">Percentage (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PACKAGING_MATERIALS.map((material, index) => {
                      const fieldLetter = String.fromCharCode(97 + index);
                      const totalSecondary = PACKAGING_MATERIALS.reduce((sum, m) => {
                        return sum + (parseFloat(parseFormattedNumber(String(formData[`fashion_secondary_pkg_${m.key}_mt`] || '0'))) || 0);
                      }, 0);
                      const materialMT = parseFloat(parseFormattedNumber(String(formData[`fashion_secondary_pkg_${material.key}_mt`] || '0'))) || 0;
                      const autoPercentage = totalSecondary > 0 ? ((materialMT / totalSecondary) * 100).toFixed(2) : '-';
                      return (
                        <TableRow key={material.key}>
                          <TableCell className="font-medium text-sm">
                            <div className="flex items-center">
                              <CellNumberBadge kpiNumber={8} fieldLetter={fieldLetter} />
                              {material.label}
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormattedNumberInput
                              value={String(formData[`fashion_secondary_pkg_${material.key}_mt`] || '')}
                              onChange={(value) => onInputChange(`fashion_secondary_pkg_${material.key}_mt`, value)}
                              placeholder="MT"
                              className="w-28"
                              disabled={readOnly}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {autoPercentage !== '-' ? `${autoPercentage}%` : '-'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
