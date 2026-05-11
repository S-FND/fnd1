import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, AlertTriangle, Info, FileWarning } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const STAKEHOLDER_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'employee', label: 'Employee' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'regulator', label: 'Regulator' },
  { value: 'internal_other', label: 'Internal (Others)' },
  { value: 'external_other', label: 'External (Others)' },
];

const INCIDENT_TYPES = [
  { id: 'food_safety', label: 'Food Safety', color: 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-400' },
  { id: 'posh', label: 'PoSH (Sexual Harassment)', color: 'bg-purple-50 hover:bg-purple-100 border-l-4 border-l-purple-400' },
  { id: 'health_safety', label: 'Health & Safety', color: 'bg-orange-50 hover:bg-orange-100 border-l-4 border-l-orange-400' },
  { id: 'environmental', label: 'Environmental', color: 'bg-green-50 hover:bg-green-100 border-l-4 border-l-green-400' },
  { id: 'security', label: 'Security', color: 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-400' },
  { id: 'regulatory', label: 'Regulatory/Legal Liabilities', color: 'bg-amber-50 hover:bg-amber-100 border-l-4 border-l-amber-400' },
  { id: 'other', label: 'Other Incidents', color: 'bg-slate-50 hover:bg-slate-100 border-l-4 border-l-slate-400' },
];

interface Grievance {
  id: string;
  stakeholder: string;
  details: string;
}

interface IncidentsAndGrievancesEntryProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | number | boolean) => void;
  readOnly?: boolean;
}

export const IncidentsAndGrievancesEntry = ({ 
  formData, 
  onInputChange,
  readOnly = false 
}: IncidentsAndGrievancesEntryProps) => {
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

  // Incident log helpers
  const getFieldKey = (incidentId: string, field: string) => `incident_${incidentId}_${field}`;

  const getNumberValue = (incidentId: string, field: string) => {
    const key = getFieldKey(incidentId, field);
    return (formData[key] as string) || '';
  };

  const getBoolValue = (incidentId: string, field: string) => {
    const key = getFieldKey(incidentId, field);
    return formData[key] === true || formData[key] === 'true';
  };

  const handleNumberChange = (incidentId: string, field: string, value: string) => {
    const key = getFieldKey(incidentId, field);
    onInputChange(key, value);
  };

  const handleBoolChange = (incidentId: string, field: string, value: boolean) => {
    const key = getFieldKey(incidentId, field);
    onInputChange(key, value);
  };

  return (
    <div className="space-y-6">
      {/* Incidents Log Section */}
      <Card>
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-red-500" />
              Incident Log
              <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Record all incidents that occurred during the quarter
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px]">Type</TableHead>
                  <TableHead className="w-[80px]">Cases</TableHead>
                  <TableHead className="w-[100px]">Resolved</TableHead>
                  <TableHead className="w-[100px]">Board Informed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {INCIDENT_TYPES.map((incident) => (
                  <TableRow key={incident.id} className={incident.color}>
                    <TableCell className="font-medium py-3">{incident.label}</TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={getNumberValue(incident.id, 'cases')}
                        onChange={(e) => handleNumberChange(incident.id, 'cases', e.target.value)}
                        className="w-16 h-8 text-sm"
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={getBoolValue(incident.id, 'resolved')}
                          onCheckedChange={(checked) => handleBoolChange(incident.id, 'resolved', checked)}
                          disabled={readOnly}
                        />
                        <span className="text-xs text-muted-foreground">
                          {getBoolValue(incident.id, 'resolved') ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={getBoolValue(incident.id, 'board_informed')}
                          onCheckedChange={(checked) => handleBoolChange(incident.id, 'board_informed', checked)}
                          disabled={readOnly}
                        />
                        <span className="text-xs text-muted-foreground">
                          {getBoolValue(incident.id, 'board_informed') ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Service Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Customer Service Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="open_customer_service_requests">
                % of open customer service requests (For the quarter)
              </Label>
              <Input
                id="open_customer_service_requests"
                type="number"
                min="0"
                max="100"
                placeholder="Enter percentage..."
                value={formData['open_customer_service_requests'] as string || ''}
                onChange={(e) => onInputChange('open_customer_service_requests', e.target.value)}
                disabled={readOnly}
                className="max-w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg_tat">
                Avg TAT (Turnaround Time)
              </Label>
              <Input
                id="avg_tat"
                type="text"
                placeholder="e.g., 24 hours, 2 days..."
                value={formData['avg_tat'] as string || ''}
                onChange={(e) => onInputChange('avg_tat', e.target.value)}
                disabled={readOnly}
                className="max-w-[200px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grievances Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Grievances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Disclaimer */}
          <Alert variant="default" className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Mention only those complaints are to be considered as Grievances - where any 3rd party is involved.
            </AlertDescription>
          </Alert>

          {/* Main Question */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
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
    </div>
  );
};
