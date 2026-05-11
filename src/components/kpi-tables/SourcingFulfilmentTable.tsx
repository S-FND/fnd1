import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, Plus, Trash2, Handshake, Info, Truck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SupplierVendorSection } from './SupplierVendorSection';
import { VendorMISSection } from './VendorMISSection';
import { CellNumberBadge } from './CellNumberBadge';

interface SourcingFulfilmentTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

export const SourcingFulfilmentTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: SourcingFulfilmentTableProps) => {
  // Parse existing weblinks from formData
  const getWeblinks = (): string[] => {
    const stored = formData['vendor_practices_weblinks'] as string;
    if (!stored) return [''];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
    } catch {
      return stored ? [stored] : [''];
    }
  };

  const [weblinks, setWeblinks] = useState<string[]>(getWeblinks);

  const handleWeblinkChange = (index: number, value: string) => {
    const updated = [...weblinks];
    updated[index] = value;
    setWeblinks(updated);
    // Store as JSON array
    onInputChange('vendor_practices_weblinks', JSON.stringify(updated.filter(Boolean)));
  };

  const addWeblink = () => {
    setWeblinks([...weblinks, '']);
  };

  const removeWeblink = (index: number) => {
    if (weblinks.length === 1) {
      setWeblinks(['']);
      onInputChange('vendor_practices_weblinks', '');
    } else {
      const updated = weblinks.filter((_, i) => i !== index);
      setWeblinks(updated);
      onInputChange('vendor_practices_weblinks', JSON.stringify(updated.filter(Boolean)));
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const vendorPracticesText = (formData['vendor_practices_description'] as string) || '';
  const logisticsInitiativesText = (formData['logistics_carbon_initiatives'] as string) || '';

  return (
    <div className="space-y-6">
      {/* As of Date Disclaimer */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          All data entered in this section should be reported <strong>"As of Date"</strong> (current quarter end). You need to fill this data once. Next quarter onwards, the data shared in the previous quarter will be pre-filled in the cells. Please update in case there are any changes.
        </AlertDescription>
      </Alert>

      {/* Supplier/Vendor Section */}
      <SupplierVendorSection formData={formData} onInputChange={onInputChange} readOnly={readOnly} />
      
      {/* Vendor MIS Section */}
      <VendorMISSection formData={formData} onInputChange={onInputChange} readOnly={readOnly} />

      {/* Logistics Optimization & Carbon Emissions Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CellNumberBadge kpiNumber={3} />
            <Truck className="w-4 h-4 text-esg-environment" />
            Logistics Optimization & Carbon Emissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="logistics_carbon_initiatives" className="text-sm font-medium flex items-center">
            <CellNumberBadge kpiNumber={3} fieldLetter="a" />
            Briefly describe your initiatives towards logistics optimization and reducing carbon emissions.
          </Label>
          <Textarea
            id="logistics_carbon_initiatives"
            placeholder="Describe your logistics optimization initiatives, route optimization, fleet management, carbon emission reduction strategies..."
            value={logisticsInitiativesText}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/).filter(Boolean);
              if (words.length <= 300) {
                onInputChange('logistics_carbon_initiatives', e.target.value);
              }
            }}
            className="min-h-[120px] text-sm"
            disabled={readOnly}
          />
          <p className="text-xs text-muted-foreground text-right">
            {getWordCount(logisticsInitiativesText)} / 300 words
          </p>
        </CardContent>
      </Card>
      
      {/* Vendor Practices Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CellNumberBadge kpiNumber={4} />
            <Handshake className="w-4 h-4 text-esg-social" />
            Vendor Selection & Management Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_practices_description" className="text-sm font-medium flex items-center">
              <CellNumberBadge kpiNumber={4} fieldLetter="a" />
              Briefly mention your good vendor selection or management practices. Say local sourcing, gender lens, inclusive, policies for informal labour or farmers etc.
            </Label>
            <Textarea
              id="vendor_practices_description"
              placeholder="Describe your vendor selection and management practices..."
              value={vendorPracticesText}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                if (words.length <= 300) {
                  onInputChange('vendor_practices_description', e.target.value);
                }
              }}
              className="min-h-[120px] text-sm"
              disabled={readOnly}
            />
            <p className="text-xs text-muted-foreground text-right">
              {getWordCount(vendorPracticesText)} / 300 words
            </p>
          </div>

          {/* Weblinks Section */}
          <div className="space-y-3 pt-2 border-t">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CellNumberBadge kpiNumber={4} fieldLetter="b" />
              <Link2 className="w-4 h-4" />
              Supporting Weblinks (optional)
            </Label>
            <div className="space-y-2">
              {weblinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/policy"
                    value={link}
                    onChange={(e) => handleWeblinkChange(index, e.target.value)}
                    className="flex-1 h-9 text-sm"
                    disabled={readOnly}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeWeblink(index)}
                    disabled={readOnly}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addWeblink}
              disabled={readOnly}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
