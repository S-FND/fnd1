
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { Plus, Save, Trash2, FileCheck, FilePlus, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistQuestion {
  id: string;
  question: string;
  category: string;
  weight: number;
  required: boolean;
}

interface ChecklistTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  questions: ChecklistQuestion[];
  createdAt: string;
  lastUpdated?: string;
}

// Initial checklist templates
const initialTemplates: ChecklistTemplate[] = [
  {
    id: 'template-1',
    name: 'Standard Sustainability Audit',
    industry: 'General',
    description: 'A general sustainability audit checklist applicable to most industries',
    createdAt: '2024-03-01',
    lastUpdated: '2024-04-01',
    questions: [
      {
        id: 'q1',
        question: 'Does the supplier have an environmental policy?',
        category: 'Environmental',
        weight: 5,
        required: true
      },
      {
        id: 'q2',
        question: 'Does the supplier measure and report greenhouse gas emissions?',
        category: 'Environmental',
        weight: 4,
        required: true
      },
      {
        id: 'q3',
        question: 'Does the supplier have waste reduction targets?',
        category: 'Environmental',
        weight: 3,
        required: false
      },
      {
        id: 'q4',
        question: 'Does the supplier have a supplier code of conduct?',
        category: 'Governance',
        weight: 4,
        required: true
      },
      {
        id: 'q5',
        question: 'Does the supplier have fair labor practices?',
        category: 'Social',
        weight: 5,
        required: true
      },
      {
        id: 'q6',
        question: 'Does the supplier have diversity and inclusion policies?',
        category: 'Social',
        weight: 3,
        required: false
      },
      {
        id: 'q7',
        question: 'Does the supplier conduct regular sustainability training for employees?',
        category: 'Governance',
        weight: 2,
        required: false
      },
      {
        id: 'q8',
        question: 'Does the supplier have anti-corruption policies?',
        category: 'Governance',
        weight: 5,
        required: true
      },
      {
        id: 'q9',
        question: 'Does the supplier use renewable energy sources?',
        category: 'Environmental',
        weight: 3,
        required: false
      },
      {
        id: 'q10',
        question: 'Does the supplier have water conservation practices?',
        category: 'Environmental',
        weight: 2,
        required: false
      }
    ]
  },
  {
    id: 'template-2',
    name: 'Manufacturing Industry Audit',
    industry: 'Manufacturing',
    description: 'Sustainability audit tailored for manufacturing suppliers',
    createdAt: '2024-02-15',
    questions: [
      {
        id: 'mq1',
        question: 'Does the supplier use energy-efficient manufacturing processes?',
        category: 'Environmental',
        weight: 5,
        required: true
      },
      {
        id: 'mq2',
        question: 'Does the supplier have a materials recycling program?',
        category: 'Environmental',
        weight: 4,
        required: true
      },
      {
        id: 'mq3',
        question: 'Are hazardous materials properly managed and disposed of?',
        category: 'Environmental',
        weight: 5,
        required: true
      },
      {
        id: 'mq4',
        question: 'Does the supplier provide safe working conditions?',
        category: 'Social',
        weight: 5,
        required: true
      }
    ]
  }
];

// Industry options for dropdown
const industryOptions = [
  'General',
  'Manufacturing',
  'Technology',
  'Retail',
  'Food & Beverage',
  'Energy',
  'Construction',
  'Transportation',
  'Healthcare',
  'Financial Services',
  'Other'
];

// Question categories
const questionCategories = [
  'Environmental',
  'Social',
  'Governance',
  'Economic',
  'Other'
];

const AuditChecklist: React.FC = () => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>(initialTemplates);
  const [activeTemplate, setActiveTemplate] = useState<ChecklistTemplate | null>(templates[0]);
  const [newQuestion, setNewQuestion] = useState<Partial<ChecklistQuestion>>({
    question: '',
    category: 'Environmental',
    weight: 3,
    required: false
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  
  // Form for creating new template
  const form = useForm<{
    name: string;
    industry: string;
    description: string;
  }>({
    defaultValues: {
      name: '',
      industry: 'General',
      description: ''
    }
  });

  // Handle creating a new template
  const handleCreateTemplate = (data: { name: string; industry: string; description: string }) => {
    const newTemplate: ChecklistTemplate = {
      id: `template-${Date.now()}`,
      name: data.name,
      industry: data.industry,
      description: data.description,
      questions: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTemplates([...templates, newTemplate]);
    setActiveTemplate(newTemplate);
    setIsCreatingTemplate(false);
    form.reset();
    toast.success('Template created successfully');
  };

  // Handle adding a new question to the active template
  const handleAddQuestion = () => {
    if (!activeTemplate) return;
    if (!newQuestion.question) {
      toast.error('Question text cannot be empty');
      return;
    }
    
    const question: ChecklistQuestion = {
      id: `q-${Date.now()}`,
      question: newQuestion.question || '',
      category: newQuestion.category || 'Environmental',
      weight: newQuestion.weight || 3,
      required: newQuestion.required || false
    };
    
    const updatedTemplate = {
      ...activeTemplate,
      questions: [...activeTemplate.questions, question],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setTemplates(templates.map(t => 
      t.id === activeTemplate.id ? updatedTemplate : t
    ));
    
    setActiveTemplate(updatedTemplate);
    setNewQuestion({
      question: '',
      category: 'Environmental',
      weight: 3,
      required: false
    });
    setIsAddingQuestion(false);
    toast.success('Question added successfully');
  };

  // Handle deleting a question
  const handleDeleteQuestion = (questionId: string) => {
    if (!activeTemplate) return;
    
    const updatedQuestions = activeTemplate.questions.filter(q => q.id !== questionId);
    const updatedTemplate = {
      ...activeTemplate,
      questions: updatedQuestions,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setTemplates(templates.map(t => 
      t.id === activeTemplate.id ? updatedTemplate : t
    ));
    
    setActiveTemplate(updatedTemplate);
    toast.success('Question deleted successfully');
  };

  // Handle saving the entire template
  const handleSaveTemplate = () => {
    if (!activeTemplate) return;
    
    const updatedTemplate = {
      ...activeTemplate,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setTemplates(templates.map(t => 
      t.id === activeTemplate.id ? updatedTemplate : t
    ));
    
    toast.success('Template saved successfully');
  };

  // Calculate percentage of questions by category
  const calculateCategoryPercentage = (category: string) => {
    if (!activeTemplate || activeTemplate.questions.length === 0) return 0;
    
    const categoryQuestions = activeTemplate.questions.filter(q => q.category === category);
    return Math.round((categoryQuestions.length / activeTemplate.questions.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Audit Checklist</h1>
        <p className="text-muted-foreground">
          Create and manage sustainability audit checklists for your suppliers
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Templates List */}
        <Card className="w-full md:w-80 flex-shrink-0">
          <CardHeader>
            <CardTitle>Audit Templates</CardTitle>
            <CardDescription>Select or create a template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => setIsCreatingTemplate(true)}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              New Template
            </Button>
            
            <Separator className="my-4" />
            
            {templates.map(template => (
              <div 
                key={template.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  activeTemplate?.id === template.id ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
                onClick={() => setActiveTemplate(template)}
              >
                <div className="font-medium">{template.name}</div>
                <div className="flex justify-between items-center mt-1">
                  <Badge variant="outline">{template.industry}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {template.questions.length} questions
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Template Content */}
        <div className="flex-1">
          {isCreatingTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Template</CardTitle>
                <CardDescription>Define a new audit template</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateTemplate)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Technology Industry Audit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industryOptions.map(industry => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of the audit template" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreatingTemplate(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Create Template
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : activeTemplate ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{activeTemplate.name}</CardTitle>
                  <CardDescription>
                    {activeTemplate.industry} · {activeTemplate.questions.length} Questions
                  </CardDescription>
                </div>
                <Button onClick={handleSaveTemplate}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="questions">
                  <TabsList className="mb-4">
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions" className="space-y-4">
                    {/* Questions List */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50%]">Question</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeTemplate.questions.length > 0 ? (
                            activeTemplate.questions.map(question => (
                              <TableRow key={question.id}>
                                <TableCell className="font-medium">{question.question}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{question.category}</Badge>
                                </TableCell>
                                <TableCell>{question.weight}</TableCell>
                                <TableCell>
                                  {question.required ? (
                                    <Badge className="bg-green-100 text-green-800">Yes</Badge>
                                  ) : (
                                    <Badge variant="outline">No</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                No questions added yet. Add your first question below.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Add Question Form */}
                    {isAddingQuestion ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Add New Question</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <FormLabel>Question Text</FormLabel>
                              <Input
                                value={newQuestion.question || ''}
                                onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                                placeholder="e.g., Does the supplier have an environmental policy?"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <FormLabel>Category</FormLabel>
                                <Select
                                  value={newQuestion.category || 'Environmental'}
                                  onValueChange={value => setNewQuestion({...newQuestion, category: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {questionCategories.map(category => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <FormLabel>Weight (1-5)</FormLabel>
                                <div className="pt-2">
                                  <Slider
                                    min={1}
                                    max={5}
                                    step={1}
                                    value={[newQuestion.weight || 3]}
                                    onValueChange={value => setNewQuestion({...newQuestion, weight: value[0]})}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-end gap-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="required"
                                    checked={newQuestion.required || false}
                                    onChange={e => setNewQuestion({...newQuestion, required: e.target.checked})}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <label htmlFor="required">Required</label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAddingQuestion(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="button" onClick={handleAddQuestion}>
                                Add Question
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Button onClick={() => setIsAddingQuestion(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="overview" className="space-y-4">
                    {/* Template Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Template Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2">
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                              <dd>{activeTemplate.name}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                              <dd>{activeTemplate.industry}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                              <dd>{activeTemplate.description}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                              <dd>{activeTemplate.createdAt}</dd>
                            </div>
                            {activeTemplate.lastUpdated && (
                              <div className="flex flex-col">
                                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                                <dd>{activeTemplate.lastUpdated}</dd>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Total Questions</dt>
                              <dd>{activeTemplate.questions.length}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Required Questions</dt>
                              <dd>{activeTemplate.questions.filter(q => q.required).length}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Category Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {questionCategories.map(category => {
                            const percentage = calculateCategoryPercentage(category);
                            if (percentage === 0) return null;
                            
                            return (
                              <div key={category} className="mb-4">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">{category}</span>
                                  <span className="text-sm">{percentage}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {activeTemplate.questions.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No questions added yet. Add questions to see category distribution.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Export as PDF
                          </Button>
                          <Button variant="outline">
                            <FileCheck className="mr-2 h-4 w-4" />
                            Send to Suppliers
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Select a template from the list or create a new one to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditChecklist;
