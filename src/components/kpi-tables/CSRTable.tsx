import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Heart } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

const IMPLEMENTATION_OPTIONS = [
  { value: 'in_house', label: 'In-house' },
  { value: 'with_ngo', label: 'With an NGO' },
  { value: 'both', label: 'Both In-house and NGO' },
];

interface Initiative {
  id: string;
  description: string;
  impact: string;
}

interface CSRTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | number | boolean) => void;
  readOnly?: boolean;
}

export const CSRTable = ({ 
  formData, 
  onInputChange,
  readOnly = false 
}: CSRTableProps) => {
  // Parse existing initiatives from formData
  const getInitiatives = (): Initiative[] => {
    const stored = formData['csr_initiatives_list'];
    if (typeof stored === 'string' && stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const [initiatives, setInitiatives] = useState<Initiative[]>(getInitiatives);

  const addInitiative = () => {
    const newInitiative: Initiative = {
      id: crypto.randomUUID(),
      description: '',
      impact: '',
    };
    const updated = [...initiatives, newInitiative];
    setInitiatives(updated);
    onInputChange('csr_initiatives_list', JSON.stringify(updated));
  };

  const updateInitiative = (id: string, field: keyof Initiative, value: string) => {
    const updated = initiatives.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    );
    setInitiatives(updated);
    onInputChange('csr_initiatives_list', JSON.stringify(updated));
  };

  const removeInitiative = (id: string) => {
    const updated = initiatives.filter(i => i.id !== id);
    setInitiatives(updated);
    onInputChange('csr_initiatives_list', JSON.stringify(updated));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          Corporate Social Responsibility (CSR)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Spent */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="csr_amount_spent" className="flex items-center">
              <CellNumberBadge kpiNumber={1} />
              Amount Spent (in Rupees)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="csr_amount_spent"
                type="number"
                min="0"
                placeholder="Enter amount..."
                value={formData['csr_amount_spent'] as string || ''}
                onChange={(e) => onInputChange('csr_amount_spent', e.target.value)}
                disabled={readOnly}
                className="pl-8"
              />
            </div>
          </div>

          {/* Program Implementation */}
          <div className="space-y-2">
            <Label htmlFor="csr_implementation" className="flex items-center">
              <CellNumberBadge kpiNumber={2} />
              Program Implementation
            </Label>
            <Select
              value={(formData['csr_implementation'] as string) || undefined}
              onValueChange={(value) => onInputChange('csr_implementation', value === '__clear__' ? '' : value)}
              disabled={readOnly}
            >
              <SelectTrigger id="csr_implementation">
                <SelectValue placeholder="Select implementation type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {formData['csr_implementation'] && (
                  <SelectItem value="__clear__" className="text-muted-foreground italic">
                    Clear selection
                  </SelectItem>
                )}
                {IMPLEMENTATION_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Initiatives Section */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium flex items-center">
                <CellNumberBadge kpiNumber={3} />
                Initiatives in the last year
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Describe the nature of each initiative and its impact
              </p>
            </div>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInitiative}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Initiative
              </Button>
            )}
          </div>

          {initiatives.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4 text-center border rounded-lg bg-muted/20">
              No initiatives added yet. Click "Add Initiative" to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {initiatives.map((initiative, index) => (
                <div 
                  key={initiative.id} 
                  className="p-4 border rounded-lg bg-muted/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Initiative #{index + 1}
                    </span>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInitiative(initiative.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`initiative-desc-${initiative.id}`}>
                        Nature of Initiative
                      </Label>
                      <Textarea
                        id={`initiative-desc-${initiative.id}`}
                        value={initiative.description}
                        onChange={(e) => updateInitiative(initiative.id, 'description', e.target.value)}
                        placeholder="Describe the initiative (e.g., Education support, Healthcare camps, Environmental conservation...)"
                        disabled={readOnly}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`initiative-impact-${initiative.id}`}>
                        Impact
                      </Label>
                      <Textarea
                        id={`initiative-impact-${initiative.id}`}
                        value={initiative.impact}
                        onChange={(e) => updateInitiative(initiative.id, 'impact', e.target.value)}
                        placeholder="Describe the impact (e.g., Number of beneficiaries, outcomes achieved...)"
                        disabled={readOnly}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && initiatives.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInitiative}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
