import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Save, X, Plus, ArrowRight } from 'lucide-react';
import { useSDG, type SDGOutcomeMapping } from '@/contexts/SDGContext';

const SDGOutcomeMappingPage = () => {
  const { 
    outcomeMappings, 
    addOutcomeMapping, 
    updateOutcomeMapping, 
    deleteOutcomeMapping,
    getUnmappedOutcomes,
    createMappingFromOutcome,
    getMappingCountForOutcome
  } = useSDG();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<SDGOutcomeMapping>>({});
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(null);
  const [selectedInitiatives, setSelectedInitiatives] = useState<Set<string>>(new Set());
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({});
  };

  const handleEdit = (outcome: SDGOutcomeMapping) => {
    setEditingId(outcome.id);
    setFormData(outcome);
  };

  const handleSave = () => {
    if (isAdding) {
      const newOutcome: SDGOutcomeMapping = {
        ...formData,
        id: Date.now().toString(),
      } as SDGOutcomeMapping;
      addOutcomeMapping(newOutcome);
      setIsAdding(false);
    } else if (editingId) {
      updateOutcomeMapping(editingId, formData);
      setEditingId(null);
    }
    setFormData({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    deleteOutcomeMapping(id);
  };

  const updateFormData = (field: keyof SDGOutcomeMapping, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateFromStrategy = (outcome: any) => {
    const newMapping = createMappingFromOutcome(outcome);
    setFormData(newMapping);
    setSelectedInitiativeId(outcome.id);
    setIsAdding(true);
  };

  const handleCreateMappingForInitiative = (initiativeId: string) => {
    const outcome = unmappedOutcomes.find(o => o.id === initiativeId);
    if (outcome) {
      handleCreateFromStrategy(outcome);
    }
  };

  const handleCreateMultipleMappings = () => {
    if (selectedInitiatives.size === 0) return;
    
    // Create mappings for all selected initiatives
    selectedInitiatives.forEach(initiativeId => {
      const outcome = unmappedOutcomes.find(o => o.id === initiativeId);
      if (outcome) {
        const newMapping = createMappingFromOutcome(outcome);
        addOutcomeMapping(newMapping);
      }
    });
    
    setSelectedInitiatives(new Set());
    setIsMultiSelect(false);
  };

  const toggleInitiativeSelection = (initiativeId: string) => {
    const newSelection = new Set(selectedInitiatives);
    if (newSelection.has(initiativeId)) {
      newSelection.delete(initiativeId);
    } else {
      newSelection.add(initiativeId);
    }
    setSelectedInitiatives(newSelection);
  };

  const handleAddAnotherOutcome = () => {
    if (selectedInitiativeId) {
      const outcome = unmappedOutcomes.find(o => o.id === selectedInitiativeId);
      if (outcome) {
        const newMapping = createMappingFromOutcome(outcome);
        setFormData(newMapping);
        setIsAdding(true);
      }
    }
  };

  const unmappedOutcomes = getUnmappedOutcomes();

  const getGoalBadgeColor = (goal: 'A' | 'B' | 'C') => {
    switch (goal) {
      case 'A': return 'bg-red-100 text-red-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadgeColor = (risk: 'High' | 'Medium' | 'Low') => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFormRow = (data: Partial<SDGOutcomeMapping>, isEditing: boolean) => (
    <TableRow>
      <TableCell className="p-2">
        <Input
          placeholder="SDG Target #"
          value={data.sdgTargetNumber || ''}
          onChange={(e) => updateFormData('sdgTargetNumber', e.target.value)}
          className="text-xs w-20"
        />
      </TableCell>
      <TableCell className="p-2">
        <Textarea
          placeholder="Description"
          value={data.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          className="text-xs min-h-[60px] w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Select value={data.abcGoal} onValueChange={(value) => updateFormData('abcGoal', value)}>
          <SelectTrigger className="text-xs w-16">
            <SelectValue placeholder="Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-2">
        <Textarea
          placeholder="Stakeholder characteristics"
          value={data.stakeholder || ''}
          onChange={(e) => updateFormData('stakeholder', e.target.value)}
          className="text-xs min-h-[60px] w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Textarea
          placeholder="Impact Thesis"
          value={data.impactThesis || ''}
          onChange={(e) => updateFormData('impactThesis', e.target.value)}
          className="text-xs min-h-[60px] w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Output or outcome"
          value={data.outputOutcome || ''}
          onChange={(e) => updateFormData('outputOutcome', e.target.value)}
          className="text-xs w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Metric source"
          value={data.metricSource || ''}
          onChange={(e) => updateFormData('metricSource', e.target.value)}
          className="text-xs w-28"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Outcome Threshold"
          value={data.outcomeThreshold || ''}
          onChange={(e) => updateFormData('outcomeThreshold', e.target.value)}
          className="text-xs w-28"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Threshold set by"
          value={data.thresholdSetBy || ''}
          onChange={(e) => updateFormData('thresholdSetBy', e.target.value)}
          className="text-xs w-24"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Target value"
          value={data.targetValue || ''}
          onChange={(e) => updateFormData('targetValue', e.target.value)}
          className="text-xs w-24"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Internal Baseline"
          value={data.internalBaseline || ''}
          onChange={(e) => updateFormData('internalBaseline', e.target.value)}
          className="text-xs w-28"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Counterfactual"
          value={data.counterfactual || ''}
          onChange={(e) => updateFormData('counterfactual', e.target.value)}
          className="text-xs w-28"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Source"
          value={data.counterfactualSource || ''}
          onChange={(e) => updateFormData('counterfactualSource', e.target.value)}
          className="text-xs w-24"
        />
      </TableCell>
      <TableCell className="p-2">
        <Select value={data.stakeholderMateriality} onValueChange={(value) => updateFormData('stakeholderMateriality', value)}>
          <SelectTrigger className="text-xs w-20">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-2">
        <Select value={data.riskLevel} onValueChange={(value) => updateFormData('riskLevel', value)}>
          <SelectTrigger className="text-xs w-20">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Risk Description (Optional)"
          value={data.riskDescription || ''}
          onChange={(e) => updateFormData('riskDescription', e.target.value)}
          className="text-xs w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Performance Data (Optional)"
          value={data.performanceData || ''}
          onChange={(e) => updateFormData('performanceData', e.target.value)}
          className="text-xs w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Target Comparison (Optional)"
          value={data.targetComparison || ''}
          onChange={(e) => updateFormData('targetComparison', e.target.value)}
          className="text-xs w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Threshold Comparison (Optional)"
          value={data.thresholdComparison || ''}
          onChange={(e) => updateFormData('thresholdComparison', e.target.value)}
          className="text-xs w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          placeholder="Peer Comparison (Optional)"
          value={data.peerComparison || ''}
          onChange={(e) => updateFormData('peerComparison', e.target.value)}
          className="text-xs w-32"
        />
      </TableCell>
      <TableCell className="p-2">
        <div className="flex flex-col gap-1">
          <Button size="sm" onClick={handleSave} className="text-xs h-7">
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs h-7">
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderDataRow = (outcome: SDGOutcomeMapping) => (
    <TableRow key={outcome.id}>
      <TableCell className="p-2 text-xs">{outcome.sdgTargetNumber}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.description}</TableCell>
      <TableCell className="p-2">
        <Badge className={getGoalBadgeColor(outcome.abcGoal)}>{outcome.abcGoal}</Badge>
      </TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.stakeholder}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.impactThesis}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.outputOutcome}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.metricSource}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.outcomeThreshold}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.thresholdSetBy}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.targetValue}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.internalBaseline}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.counterfactual}</TableCell>
      <TableCell className="p-2 text-xs">{outcome.counterfactualSource}</TableCell>
      <TableCell className="p-2">
        <Badge className={getRiskBadgeColor(outcome.stakeholderMateriality)}>
          {outcome.stakeholderMateriality}
        </Badge>
      </TableCell>
      <TableCell className="p-2">
        {outcome.riskLevel && (
          <Badge className={getRiskBadgeColor(outcome.riskLevel)}>
            {outcome.riskLevel}
          </Badge>
        )}
      </TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.riskDescription || '-'}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.performanceData || '-'}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.targetComparison || '-'}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.thresholdComparison || '-'}</TableCell>
      <TableCell className="p-2 text-xs max-w-32">{outcome.peerComparison || '-'}</TableCell>
      <TableCell className="p-2">
        <div className="flex flex-col gap-1">
          <Button size="sm" variant="outline" onClick={() => handleEdit(outcome)} className="text-xs h-7">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(outcome.id)} className="text-xs h-7">
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SDG Outcome Mapping</h1>
          <p className="text-muted-foreground">
            Track your SDG initiatives and their progress through comprehensive outcome mapping
          </p>
        </div>
        <Button onClick={handleAdd} disabled={isAdding || editingId !== null}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Outcome
        </Button>
      </div>

      {/* Framework explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SDG Outcome Mapping Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This framework helps you articulate your SDG outcomes, impact thesis, and track progress through comprehensive mapping.
            Performance tracking and risk assessment sections are optional.
          </p>
        </CardContent>
      </Card>

      {/* Strategy initiatives for outcome mapping */}
      {unmappedOutcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Create Outcome Mappings from Strategy Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Each strategy initiative can have multiple outcome mappings. 
              You can create mappings for individual initiatives or select multiple initiatives at once.
            </p>
            
            <div className="flex gap-2 mb-4">
              <Button 
                size="sm" 
                variant={isMultiSelect ? "default" : "outline"}
                onClick={() => {
                  setIsMultiSelect(!isMultiSelect);
                  setSelectedInitiatives(new Set());
                }}
              >
                {isMultiSelect ? "Exit Multi-Select" : "Multi-Select Mode"}
              </Button>
              
              {isMultiSelect && selectedInitiatives.size > 0 && (
                <Button 
                  size="sm" 
                  onClick={handleCreateMultipleMappings}
                  disabled={isAdding || editingId !== null}
                >
                  Create {selectedInitiatives.size} Mappings
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {unmappedOutcomes.map((outcome) => (
                <div key={outcome.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {isMultiSelect && (
                      <input
                        type="checkbox"
                        checked={selectedInitiatives.has(outcome.id)}
                        onChange={() => toggleInitiativeSelection(outcome.id)}
                        className="h-4 w-4"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{outcome.what}</p>
                      <p className="text-sm text-muted-foreground">{outcome.who}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{outcome.abcGoal} Goal</Badge>
                        {getMappingCountForOutcome(outcome.id) > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {getMappingCountForOutcome(outcome.id)} outcome{getMappingCountForOutcome(outcome.id) > 1 ? 's' : ''} mapped
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!isMultiSelect && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCreateMappingForInitiative(outcome.id)}
                        disabled={isAdding || editingId !== null}
                      >
                        Create Mapping
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add another outcome for selected initiative */}
      {selectedInitiativeId && !isAdding && !editingId && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Add another outcome for the same initiative?</p>
                <p className="text-xs text-muted-foreground">Continue mapping outcomes for this SDG initiative</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleAddAnotherOutcome}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Another Outcome
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedInitiativeId(null)}>
                  Done
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs p-2 min-w-20">SDG Target #</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Description</TableHead>
                  <TableHead className="text-xs p-2 min-w-16">ABC Goal</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">WHO (Stakeholder)</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">IF (Impact Thesis)</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Output/Outcome</TableHead>
                  <TableHead className="text-xs p-2 min-w-28">Metric Source</TableHead>
                  <TableHead className="text-xs p-2 min-w-28">Outcome Threshold</TableHead>
                  <TableHead className="text-xs p-2 min-w-24">Threshold Set By</TableHead>
                  <TableHead className="text-xs p-2 min-w-24">Target</TableHead>
                  <TableHead className="text-xs p-2 min-w-28">Internal Baseline</TableHead>
                  <TableHead className="text-xs p-2 min-w-28">Counterfactual</TableHead>
                  <TableHead className="text-xs p-2 min-w-24">CF Source</TableHead>
                  <TableHead className="text-xs p-2 min-w-20">Importance</TableHead>
                  <TableHead className="text-xs p-2 min-w-20">Risk Level</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Risk Description</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Performance Data*</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Target Comparison*</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Threshold Comparison*</TableHead>
                  <TableHead className="text-xs p-2 min-w-32">Peer Comparison*</TableHead>
                  <TableHead className="text-xs p-2 min-w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Add new outcome form */}
                {isAdding && renderFormRow(formData, true)}

                {/* Existing outcomes */}
                {outcomeMappings.map(outcome => 
                  editingId === outcome.id 
                    ? renderFormRow(formData, true)
                    : renderDataRow(outcome)
                )}

                {outcomeMappings.length === 0 && !isAdding && (
                  <TableRow>
                    <TableCell colSpan={21} className="text-center py-8 text-muted-foreground">
                      No SDG outcome mappings yet. Add your first one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        * Optional fields for performance tracking
      </div>
    </div>
  );
};

export default SDGOutcomeMappingPage;
