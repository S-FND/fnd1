import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SDGOutcome {
  id: string;
  what: string;
  who: string;
  abcGoal: 'A' | 'B' | 'C';
  impactThesis: string;
}

const SDGStrategyPage = () => {
  const [outcomes, setOutcomes] = useState<SDGOutcome[]>([
    {
      id: '1',
      what: 'SDG 4: Quality Education - Target 4.7',
      who: 'Local community students and educators',
      abcGoal: 'B',
      impactThesis: 'If we provide comprehensive sustainability education programs, then we believe local communities will develop stronger environmental awareness and sustainable practices.'
    },
    {
      id: '2',
      what: 'SDG 13: Climate Action - Target 13.3',
      who: 'Employees and supply chain partners',
      abcGoal: 'A',
      impactThesis: 'If we implement carbon reduction training and incentive programs, then we believe our workforce will significantly reduce organizational carbon footprint.'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<SDGOutcome>>({});

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      what: '',
      who: '',
      abcGoal: 'B',
      impactThesis: ''
    });
  };

  const handleEdit = (outcome: SDGOutcome) => {
    setEditingId(outcome.id);
    setFormData(outcome);
  };

  const handleSave = () => {
    if (isAdding) {
      const newOutcome: SDGOutcome = {
        id: Date.now().toString(),
        what: formData.what || '',
        who: formData.who || '',
        abcGoal: formData.abcGoal || 'B',
        impactThesis: formData.impactThesis || ''
      };
      setOutcomes([...outcomes, newOutcome]);
      setIsAdding(false);
    } else if (editingId) {
      setOutcomes(outcomes.map(outcome => 
        outcome.id === editingId 
          ? { ...outcome, ...formData } as SDGOutcome
          : outcome
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
    setOutcomes(outcomes.filter(outcome => outcome.id !== id));
  };

  const getGoalBadgeColor = (goal: 'A' | 'B' | 'C') => {
    switch (goal) {
      case 'A': return 'bg-green-500 hover:bg-green-600';
      case 'B': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'C': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getGoalDescription = (goal: 'A' | 'B' | 'C') => {
    switch (goal) {
      case 'A': return 'Baseline Impact';
      case 'B': return 'Meaningful Impact';
      case 'C': return 'Transformational Impact';
      default: return '';
    }
  };

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SDG Strategy Setting</h1>
            <p className="text-muted-foreground">
              Define your most material SDG outcomes, impact goals, and theory of change
            </p>
          </div>
          <Button onClick={handleAdd} disabled={isAdding || editingId !== null}>
            <Plus className="mr-2 h-4 w-4" />
            Add SDG Outcome
          </Button>
        </div>

        {/* Goal Level Definitions */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Goal Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Badge className={getGoalBadgeColor('A')}>A - Act to Avoid Harm</Badge>
                <p className="text-sm text-muted-foreground">
                  Important foundational change that prevents harm and maintains standards
                </p>
              </div>
              <div className="space-y-2">
                <Badge className={getGoalBadgeColor('B')}>B - Benefit Stakeholders</Badge>
                <p className="text-sm text-muted-foreground">
                  Significant positive change that improves conditions and capabilities
                </p>
              </div>
              <div className="space-y-2">
                <Badge className={getGoalBadgeColor('C')}>C - Contribute to Solutions</Badge>
                <p className="text-sm text-muted-foreground">
                  Deep, systemic change that addresses root causes and creates lasting transformation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDG Outcomes Table */}
        <Card>
          <CardHeader>
            <CardTitle>SDG Outcomes Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">WHAT & WHO</TableHead>
                  <TableHead className="w-[15%]">A/B/C GOAL</TableHead>
                  <TableHead className="w-[45%]">IMPACT THESIS</TableHead>
                  <TableHead className="w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outcomes.map((outcome) => (
                  <TableRow key={outcome.id}>
                    <TableCell>
                      {editingId === outcome.id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="SDG goal and target"
                            value={formData.what || ''}
                            onChange={(e) => setFormData({...formData, what: e.target.value})}
                          />
                          <Input
                            placeholder="Stakeholders that experience change"
                            value={formData.who || ''}
                            onChange={(e) => setFormData({...formData, who: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{outcome.what}</p>
                          <p className="text-sm text-muted-foreground">{outcome.who}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === outcome.id ? (
                        <Select
                          value={formData.abcGoal}
                          onValueChange={(value: 'A' | 'B' | 'C') => setFormData({...formData, abcGoal: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A - Act to Avoid Harm</SelectItem>
                            <SelectItem value="B">B - Benefit Stakeholders</SelectItem>
                            <SelectItem value="C">C - Contribute to Solutions</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-1">
                          <Badge className={getGoalBadgeColor(outcome.abcGoal)}>
                            {outcome.abcGoal}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {getGoalDescription(outcome.abcGoal)}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === outcome.id ? (
                        <Textarea
                          placeholder="If we ..., then we believe ... will happen."
                          value={formData.impactThesis || ''}
                          onChange={(e) => setFormData({...formData, impactThesis: e.target.value})}
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm">{outcome.impactThesis}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === outcome.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(outcome)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(outcome.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Add new row */}
                {isAdding && (
                  <TableRow>
                    <TableCell>
                      <div className="space-y-2">
                        <Input
                          placeholder="SDG goal and target"
                          value={formData.what || ''}
                          onChange={(e) => setFormData({...formData, what: e.target.value})}
                        />
                        <Input
                          placeholder="Stakeholders that experience change"
                          value={formData.who || ''}
                          onChange={(e) => setFormData({...formData, who: e.target.value})}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={formData.abcGoal}
                        onValueChange={(value: 'A' | 'B' | 'C') => setFormData({...formData, abcGoal: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A - Act to Avoid Harm</SelectItem>
                          <SelectItem value="B">B - Benefit Stakeholders</SelectItem>
                          <SelectItem value="C">C - Contribute to Solutions</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="If we ..., then we believe ... will happen."
                        value={formData.impactThesis || ''}
                        onChange={(e) => setFormData({...formData, impactThesis: e.target.value})}
                        rows={3}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default SDGStrategyPage;