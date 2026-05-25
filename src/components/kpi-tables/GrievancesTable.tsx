import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

const STAKEHOLDER_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'employee', label: 'Employee' },
  { value: 'regulator', label: 'Regulator' },
  { value: 'internal_other', label: 'Internal (Others)' },
  { value: 'external_other', label: 'External (Others)' },
];

interface Grievance {
  id: string;
  stakeholder: string;
  details: string;
}

interface GrievancesTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | number | boolean) => void;
  readOnly?: boolean;
}

export const GrievancesTable = ({ 
  formData, 
  onInputChange,
  readOnly = false 
}: GrievancesTableProps) => {
  // Parse existing grievances from formData
  const getGrievances = (): Grievance[] => {
    const stored = formData['grievances_list'];
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

  const [grievances, setGrievances] = useState<Grievance[]>(getGrievances);

  const hasGrievances = formData['has_grievances'] === 'yes' || formData['has_grievances'] === true;

  const handleHasGrievancesChange = (value: string) => {
    onInputChange('has_grievances', value);
    if (value === 'no') {
      setGrievances([]);
      onInputChange('grievances_list', '');
    }
  };

  const addGrievance = () => {
    const newGrievance: Grievance = {
      id: crypto.randomUUID(),
      stakeholder: '',
      details: '',
    };
    const updated = [...grievances, newGrievance];
    setGrievances(updated);
    onInputChange('grievances_list', JSON.stringify(updated));
  };

  const updateGrievance = (id: string, field: 'stakeholder' | 'details', value: string) => {
    const updated = grievances.map(g => 
      g.id === id ? { ...g, [field]: value } : g
    );
    setGrievances(updated);
    onInputChange('grievances_list', JSON.stringify(updated));
  };

  const removeGrievance = (id: string) => {
    const updated = grievances.filter(g => g.id !== id);
    setGrievances(updated);
    onInputChange('grievances_list', JSON.stringify(updated));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Grievances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Question */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <CellNumberBadge kpiNumber={11} />
            Do you have any grievances logged?
          </Label>
          <RadioGroup
            value={formData['has_grievances'] === 'yes' || formData['has_grievances'] === true ? 'yes' : 
                   formData['has_grievances'] === 'no' || formData['has_grievances'] === false ? 'no' : ''}
            onValueChange={handleHasGrievancesChange}
            disabled={readOnly}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="grievances-yes" />
              <Label htmlFor="grievances-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="grievances-no" />
              <Label htmlFor="grievances-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Grievance Details - shown when Yes is selected */}
        {hasGrievances && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Grievance Details</Label>
              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGrievance}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Grievance
                </Button>
              )}
            </div>

            {grievances.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Click "Add Grievance" to add details of logged grievances.
              </p>
            ) : (
              <div className="space-y-4">
                {grievances.map((grievance, index) => (
                  <div 
                    key={grievance.id} 
                    className="p-4 border rounded-lg bg-muted/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Grievance #{index + 1}
                      </span>
                      {!readOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGrievance(grievance.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`stakeholder-${grievance.id}`}>
                          Stakeholder Type
                        </Label>
                        <Select
                          value={grievance.stakeholder || undefined}
                          onValueChange={(value) => updateGrievance(grievance.id, 'stakeholder', value === '__clear__' ? '' : value)}
                          disabled={readOnly}
                        >
                          <SelectTrigger id={`stakeholder-${grievance.id}`}>
                            <SelectValue placeholder="Select stakeholder" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border z-50">
                            {grievance.stakeholder && (
                              <SelectItem value="__clear__" className="text-muted-foreground italic">
                                Clear selection
                              </SelectItem>
                            )}
                            {STAKEHOLDER_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`details-${grievance.id}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`details-${grievance.id}`}
                          value={grievance.details}
                          onChange={(e) => updateGrievance(grievance.id, 'details', e.target.value)}
                          placeholder="Describe the grievance in detail..."
                          disabled={readOnly}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!readOnly && grievances.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGrievance}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add More
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
