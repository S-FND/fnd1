
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Share2, Eye, Users, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock audit templates
const mockAuditTemplates = [
  {
    id: 'template-1',
    name: 'General Sustainability Audit',
    description: 'Comprehensive sustainability assessment covering environmental, social, and governance aspects.',
    questionCount: 25,
    lastUpdated: '2025-03-15',
    categories: ['Environmental', 'Social', 'Governance'],
  },
  {
    id: 'template-2',
    name: 'Manufacturing Industry ESG',
    description: 'Specialized audit for manufacturing companies focusing on industry-specific sustainability metrics.',
    questionCount: 30,
    lastUpdated: '2025-03-22',
    categories: ['Environmental', 'Labor', 'Supply Chain'],
  },
  {
    id: 'template-3',
    name: 'Carbon Footprint Assessment',
    description: 'Assessment focused on greenhouse gas emissions and reduction strategies.',
    questionCount: 18,
    lastUpdated: '2025-04-01',
    categories: ['GHG Emissions', 'Energy', 'Transportation'],
  },
];

// Mock suppliers list
const mockSuppliers = [
  {
    id: 'sup-1',
    name: 'EcoPackaging Solutions',
    category: 'Packaging',
    email: 'contact@ecopackaging.com',
    contactPerson: 'Jane Smith',
  },
  {
    id: 'sup-2',
    name: 'GreenTech Materials',
    category: 'Raw Materials',
    email: 'info@greentech.com',
    contactPerson: 'Mike Johnson',
  },
  {
    id: 'sup-3',
    name: 'Sustainable Logistics Inc',
    category: 'Logistics',
    email: 'operations@sustainable-logistics.com',
    contactPerson: 'Sarah Brown',
  },
  {
    id: 'sup-4',
    name: 'Eco Energy Solutions',
    category: 'Energy',
    email: 'support@ecoenergy.com',
    contactPerson: 'David Chen',
  },
  {
    id: 'sup-5',
    name: 'BioTech Materials',
    category: 'Raw Materials',
    email: 'info@biotech.com',
    contactPerson: 'Lisa Wong',
  },
];

// Mock shared audits
const mockSharedAudits = [
  {
    id: 'shared-1',
    templateId: 'template-1',
    templateName: 'General Sustainability Audit',
    supplierName: 'EcoPackaging Solutions',
    supplierId: 'sup-1',
    sharedDate: '2025-03-18',
    dueDate: '2025-05-15',
    status: 'completed',
    score: 82,
  },
  {
    id: 'shared-2',
    templateId: 'template-2',
    templateName: 'Manufacturing Industry ESG',
    supplierName: 'GreenTech Materials',
    supplierId: 'sup-2',
    sharedDate: '2025-03-25',
    dueDate: '2025-04-30',
    status: 'in_progress',
    progress: 45,
  },
  {
    id: 'shared-3',
    templateId: 'template-1',
    templateName: 'General Sustainability Audit',
    supplierName: 'Sustainable Logistics Inc',
    supplierId: 'sup-3',
    sharedDate: '2025-04-01',
    dueDate: '2025-05-01',
    status: 'not_started',
  },
];

const AuditSupplierSharing: React.FC = () => {
  const [templates, setTemplates] = useState(mockAuditTemplates);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [sharedAudits, setSharedAudits] = useState(mockSharedAudits);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>('');

  const filteredSharedAudits = sharedAudits.filter(audit => 
    audit.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAllSuppliers = () => {
    if (selectedSuppliers.length === suppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(suppliers.map(s => s.id));
    }
  };

  const handleSelectSupplier = (supplierId: string) => {
    if (selectedSuppliers.includes(supplierId)) {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    } else {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
    }
  };

  const handleShareAudit = () => {
    if (!selectedTemplate) {
      toast.error("Please select an audit template");
      return;
    }
    
    if (selectedSuppliers.length === 0) {
      toast.error("Please select at least one supplier");
      return;
    }
    
    if (!dueDate) {
      toast.error("Please set a due date");
      return;
    }
    
    // In a real app, this would create the shared audits in the database
    const selectedTemplateObj = templates.find(t => t.id === selectedTemplate);
    
    // Create new shared audits
    const newSharedAudits = selectedSuppliers.map(supplierId => {
      const supplier = suppliers.find(s => s.id === supplierId);
      return {
        id: `shared-${Date.now()}-${supplierId}`,
        templateId: selectedTemplate,
        templateName: selectedTemplateObj?.name || '',
        supplierName: supplier?.name || '',
        supplierId,
        sharedDate: new Date().toISOString().split('T')[0],
        dueDate,
        status: 'not_started',
      };
    });
    
    setSharedAudits([...sharedAudits, ...newSharedAudits]);
    
    // Reset form
    setSelectedTemplate(null);
    setSelectedSuppliers([]);
    setDueDate('');
    
    toast.success(`Audit shared with ${selectedSuppliers.length} suppliers`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Share Audit with Suppliers</CardTitle>
          <CardDescription>
            Select an audit template and share with your suppliers for completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <Label htmlFor="template">Select Audit Template</Label>
              <Select value={selectedTemplate || ''} onValueChange={setSelectedTemplate}>
                <SelectTrigger id="template" className="w-full">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedTemplate && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  {templates.find(t => t.id === selectedTemplate)?.description}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Select Suppliers</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAllSuppliers}
                >
                  {selectedSuppliers.length === suppliers.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="flex items-center space-x-2 p-3">
                    <Checkbox 
                      id={supplier.id} 
                      checked={selectedSuppliers.includes(supplier.id)}
                      onCheckedChange={() => handleSelectSupplier(supplier.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={supplier.id} className="font-medium cursor-pointer">
                        {supplier.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{supplier.category}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {supplier.contactPerson}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <Button onClick={handleShareAudit} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Selected Suppliers
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Shared Audits</CardTitle>
            <CardDescription>
              Track the status of audits shared with suppliers
            </CardDescription>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shared audits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium">Audit Template</th>
                    <th className="h-10 px-4 text-left font-medium">Supplier</th>
                    <th className="h-10 px-4 text-left font-medium">Shared Date</th>
                    <th className="h-10 px-4 text-left font-medium">Due Date</th>
                    <th className="h-10 px-4 text-left font-medium">Status</th>
                    <th className="h-10 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSharedAudits.length > 0 ? (
                    filteredSharedAudits.map(audit => (
                      <tr key={audit.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{audit.templateName}</td>
                        <td className="p-4">{audit.supplierName}</td>
                        <td className="p-4">{audit.sharedDate}</td>
                        <td className="p-4">{audit.dueDate}</td>
                        <td className="p-4">{getStatusBadge(audit.status)}</td>
                        <td className="p-4 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Audit Details</AlertDialogTitle>
                                <AlertDialogDescription asChild>
                                  <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-sm font-medium">Supplier</p>
                                        <p className="text-sm">{audit.supplierName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Template</p>
                                        <p className="text-sm">{audit.templateName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Status</p>
                                        <p className="text-sm">{getStatusBadge(audit.status)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Due Date</p>
                                        <p className="text-sm">{audit.dueDate}</p>
                                      </div>
                                    </div>
                                    
                                    {audit.status === 'completed' && (
                                      <div>
                                        <p className="text-sm font-medium">Score</p>
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg font-semibold">{audit.score}/100</span>
                                          {audit.score >= 70 && (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {audit.status === 'in_progress' && (
                                      <div>
                                        <p className="text-sm font-medium">Progress</p>
                                        <p className="text-sm">{audit.progress}% completed</p>
                                      </div>
                                    )}
                                    
                                    <div className="mt-2">
                                      <p className="text-sm">
                                        This audit was shared on {audit.sharedDate} and is due by {audit.dueDate}.
                                      </p>
                                    </div>
                                    
                                    <div className="flex justify-center mt-4">
                                      <Button>
                                        View Full Response
                                      </Button>
                                    </div>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="h-24 text-center">
                        No shared audits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditSupplierSharing;
