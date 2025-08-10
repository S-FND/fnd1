import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Save, X, Plus } from 'lucide-react';

interface SDGOutcomeMapping {
  id: string;
  sdgTargetNumber: string;
  description: string;
  abcGoal: 'A' | 'B' | 'C';
  stakeholder: string;
  impactThesis: string;
  outputOutcome: string;
  metricSource: string;
  outcomeThreshold: string;
  thresholdSetBy: string;
  targetType: string;
  targetValue: string;
  internalBaseline: string;
  counterfactual: string;
  counterfactualSource: string;
  stakeholderMateriality: 'High' | 'Medium' | 'Low';
  riskLevel?: 'High' | 'Medium' | 'Low';
  riskDescription?: string;
  performanceData?: string;
  targetComparison?: string;
  thresholdComparison?: string;
  peerComparison?: string;
}

const SDGOutcomeMappingPage = () => {
  const [outcomes, setOutcomes] = useState<SDGOutcomeMapping[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<SDGOutcomeMapping>>({});

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
      setOutcomes([...outcomes, newOutcome]);
      setIsAdding(false);
    } else if (editingId) {
      setOutcomes(outcomes.map(o => 
        o.id === editingId ? { ...formData, id: editingId } as SDGOutcomeMapping : o
      ));
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
    setOutcomes(outcomes.filter(o => o.id !== id));
  };

  const updateFormData = (field: keyof SDGOutcomeMapping, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    <div className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
      {/* WHAT Section */}
      <div className="col-span-2 space-y-2">
        <Input
          placeholder="SDG Target #"
          value={data.sdgTargetNumber || ''}
          onChange={(e) => updateFormData('sdgTargetNumber', e.target.value)}
          className="text-xs"
        />
        <Textarea
          placeholder="Description"
          value={data.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          className="text-xs min-h-[60px]"
        />
        <Select value={data.abcGoal} onValueChange={(value) => updateFormData('abcGoal', value)}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="ABC Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* WHO Section */}
      <div className="col-span-1">
        <Textarea
          placeholder="Stakeholder characteristics"
          value={data.stakeholder || ''}
          onChange={(e) => updateFormData('stakeholder', e.target.value)}
          className="text-xs min-h-[120px]"
        />
      </div>

      {/* IF Section */}
      <div className="col-span-1">
        <Textarea
          placeholder="Impact Thesis"
          value={data.impactThesis || ''}
          onChange={(e) => updateFormData('impactThesis', e.target.value)}
          className="text-xs min-h-[120px]"
        />
      </div>

      {/* HOW MUCH Section */}
      <div className="col-span-3 space-y-2">
        <Input
          placeholder="Output or outcome"
          value={data.outputOutcome || ''}
          onChange={(e) => updateFormData('outputOutcome', e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Metric source"
          value={data.metricSource || ''}
          onChange={(e) => updateFormData('metricSource', e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Outcome Threshold"
          value={data.outcomeThreshold || ''}
          onChange={(e) => updateFormData('outcomeThreshold', e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Threshold set by"
          value={data.thresholdSetBy || ''}
          onChange={(e) => updateFormData('thresholdSetBy', e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Target type & value"
          value={data.targetValue || ''}
          onChange={(e) => updateFormData('targetValue', e.target.value)}
          className="text-xs"
        />
      </div>

      {/* CONTRIBUTION Section */}
      <div className="col-span-2 space-y-2">
        <Input
          placeholder="Internal Baseline"
          value={data.internalBaseline || ''}
          onChange={(e) => updateFormData('internalBaseline', e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Counterfactual"
          value={data.counterfactual || ''}
          onChange={(e) => updateFormData('counterfactual', e.target.value)}
          className="text-xs"
        />
        <Input
          placeholder="Source"
          value={data.counterfactualSource || ''}
          onChange={(e) => updateFormData('counterfactualSource', e.target.value)}
          className="text-xs"
        />
      </div>

      {/* IMPORTANCE Section */}
      <div className="col-span-1">
        <Select value={data.stakeholderMateriality} onValueChange={(value) => updateFormData('stakeholderMateriality', value)}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Importance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RISK Section (Optional) */}
      <div className="col-span-1 space-y-2">
        <Select value={data.riskLevel} onValueChange={(value) => updateFormData('riskLevel', value)}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Risk Description (Optional)"
          value={data.riskDescription || ''}
          onChange={(e) => updateFormData('riskDescription', e.target.value)}
          className="text-xs min-h-[60px]"
        />
      </div>

      {/* Actions */}
      <div className="col-span-1 flex flex-col gap-2">
        <Button size="sm" onClick={handleSave} className="text-xs">
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs">
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderDataRow = (outcome: SDGOutcomeMapping) => (
    <div key={outcome.id} className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
      {/* WHAT Section */}
      <div className="col-span-2 space-y-1">
        <div className="text-sm font-medium">{outcome.sdgTargetNumber}</div>
        <div className="text-xs text-muted-foreground">{outcome.description}</div>
        <Badge className={getGoalBadgeColor(outcome.abcGoal)}>{outcome.abcGoal}</Badge>
      </div>

      {/* WHO Section */}
      <div className="col-span-1">
        <div className="text-xs">{outcome.stakeholder}</div>
      </div>

      {/* IF Section */}
      <div className="col-span-1">
        <div className="text-xs">{outcome.impactThesis}</div>
      </div>

      {/* HOW MUCH Section */}
      <div className="col-span-3 space-y-1">
        <div className="text-xs"><strong>Output:</strong> {outcome.outputOutcome}</div>
        <div className="text-xs"><strong>Source:</strong> {outcome.metricSource}</div>
        <div className="text-xs"><strong>Threshold:</strong> {outcome.outcomeThreshold}</div>
        <div className="text-xs"><strong>Set by:</strong> {outcome.thresholdSetBy}</div>
        <div className="text-xs"><strong>Target:</strong> {outcome.targetValue}</div>
      </div>

      {/* CONTRIBUTION Section */}
      <div className="col-span-2 space-y-1">
        <div className="text-xs"><strong>Baseline:</strong> {outcome.internalBaseline}</div>
        <div className="text-xs"><strong>Counterfactual:</strong> {outcome.counterfactual}</div>
        <div className="text-xs"><strong>Source:</strong> {outcome.counterfactualSource}</div>
      </div>

      {/* IMPORTANCE Section */}
      <div className="col-span-1">
        <Badge className={getRiskBadgeColor(outcome.stakeholderMateriality)}>
          {outcome.stakeholderMateriality}
        </Badge>
      </div>

      {/* RISK Section */}
      <div className="col-span-1 space-y-1">
        {outcome.riskLevel && (
          <Badge className={getRiskBadgeColor(outcome.riskLevel)}>
            {outcome.riskLevel}
          </Badge>
        )}
        {outcome.riskDescription && (
          <div className="text-xs text-muted-foreground">{outcome.riskDescription}</div>
        )}
      </div>

      {/* Actions */}
      <div className="col-span-1 flex flex-col gap-2">
        <Button size="sm" variant="outline" onClick={() => handleEdit(outcome)} className="text-xs">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(outcome.id)} className="text-xs">
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>
    </div>
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

      {/* Header explaining the sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outcome Mapping Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-2 text-xs font-medium mb-4">
            <div className="col-span-2 text-center p-2 bg-blue-50 rounded">WHAT</div>
            <div className="col-span-1 text-center p-2 bg-green-50 rounded">WHO</div>
            <div className="col-span-1 text-center p-2 bg-purple-50 rounded">IF</div>
            <div className="col-span-3 text-center p-2 bg-orange-50 rounded">HOW MUCH</div>
            <div className="col-span-2 text-center p-2 bg-yellow-50 rounded">CONTRIBUTION</div>
            <div className="col-span-1 text-center p-2 bg-red-50 rounded">IMPORTANCE</div>
            <div className="col-span-1 text-center p-2 bg-gray-50 rounded">RISK</div>
            <div className="col-span-1 text-center p-2 bg-indigo-50 rounded">ACTIONS</div>
          </div>
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground">
            <div className="col-span-2">SDG Target, Description, ABC Goal</div>
            <div className="col-span-1">Stakeholder characteristics</div>
            <div className="col-span-1">Impact thesis driving your work</div>
            <div className="col-span-3">Output/outcome, metrics, thresholds, targets</div>
            <div className="col-span-2">Internal baseline and counterfactual analysis</div>
            <div className="col-span-1">Stakeholder materiality importance</div>
            <div className="col-span-1">Risk assessment (optional)</div>
            <div className="col-span-1">Edit/Delete actions</div>
          </div>
        </CardContent>
      </Card>

      {/* Add new outcome form */}
      {isAdding && renderFormRow(formData, true)}

      {/* Existing outcomes */}
      <div className="space-y-4">
        {outcomes.map(outcome => 
          editingId === outcome.id 
            ? renderFormRow(formData, true)
            : renderDataRow(outcome)
        )}
      </div>

      {outcomes.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No SDG outcome mappings yet. Add your first one to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SDGOutcomeMappingPage;
