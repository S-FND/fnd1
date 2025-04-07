import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Mail, MoreHorizontal, Search, UserCheck, X, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_started';
  score?: number;
  lastUpdated: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'EcoPackaging Solutions',
    category: 'Packaging',
    contact: 'Jane Smith',
    email: 'jane@ecopackaging.com',
    status: 'completed',
    score: 82,
    lastUpdated: '2024-03-15'
  },
  {
    id: 'sup-2',
    name: 'GreenTech Materials',
    category: 'Raw Materials',
    contact: 'Mike Johnson',
    email: 'mike@greentech.com',
    status: 'in_progress',
    lastUpdated: '2024-03-28'
  },
  {
    id: 'sup-3',
    name: 'Sustainable Logistics Inc',
    category: 'Logistics',
    contact: 'Sarah Brown',
    email: 'sarah@sustainable-logistics.com',
    status: 'pending',
    lastUpdated: '2024-04-01'
  },
  {
    id: 'sup-4',
    name: 'Eco Energy Solutions',
    category: 'Energy',
    contact: 'David Chen',
    email: 'david@ecoenergy.com',
    status: 'not_started',
    lastUpdated: '2024-03-10'
  },
  {
    id: 'sup-5',
    name: 'BioTech Materials',
    category: 'Raw Materials',
    contact: 'Lisa Wong',
    email: 'lisa@biotech.com',
    status: 'pending',
    lastUpdated: '2024-03-22'
  }
];

const AuditDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterSuppliers = (status: string) => {
    if (status === 'all') return suppliers;
    return suppliers.filter(supplier => supplier.status === status);
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReminder = (supplierName: string) => {
    toast.success(`Reminder sent to ${supplierName}`);
  };

  const handleStartAudit = (supplierId: string) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === supplierId ? { ...supplier, status: 'pending' } : supplier
    ));
    toast.success("Audit invitation sent to supplier");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Audit Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track sustainability audits for your suppliers
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button asChild>
            <Link to="/audit/checklist">
              <ClipboardList className="mr-2 h-4 w-4" />
              Audit Checklists
            </Link>
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Audit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Audit Summary</CardTitle>
          <CardDescription>Overview of supplier sustainability compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
                <p className="text-xs text-muted-foreground">All registered suppliers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.filter(s => s.status === 'completed').length}</div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="text-green-500 h-3 w-3" />
                  <span className="text-xs text-muted-foreground">Fully compliant</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.filter(s => s.status === 'in_progress').length}</div>
                <div className="flex items-center gap-1">
                  <Clock className="text-blue-500 h-3 w-3" />
                  <span className="text-xs text-muted-foreground">Currently being audited</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.filter(s => s.score).length > 0 
                    ? Math.round(suppliers.reduce((acc, curr) => acc + (curr.score || 0), 0) / suppliers.filter(s => s.score).length) 
                    : '-'}
                </div>
                <p className="text-xs text-muted-foreground">Out of 100 points</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Audits</CardTitle>
          <CardDescription>Track and manage supplier sustainability audits</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Suppliers</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="not_started">Not Started</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Supplier</th>
                        <th className="h-10 px-4 text-left font-medium">Category</th>
                        <th className="h-10 px-4 text-left font-medium">Contact</th>
                        <th className="h-10 px-4 text-left font-medium">Status</th>
                        <th className="h-10 px-4 text-left font-medium">Last Updated</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map(supplier => (
                          <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 font-medium">{supplier.name}</td>
                            <td className="p-4">{supplier.category}</td>
                            <td className="p-4">{supplier.contact}</td>
                            <td className="p-4">{getStatusBadge(supplier.status)}</td>
                            <td className="p-4">{supplier.lastUpdated}</td>
                            <td className="p-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => toast.success(`Viewing audit for ${supplier.name}`)}>
                                    View Audit
                                  </DropdownMenuItem>
                                  {supplier.status === 'not_started' && (
                                    <DropdownMenuItem onClick={() => handleStartAudit(supplier.id)}>
                                      Start Audit
                                    </DropdownMenuItem>
                                  )}
                                  {(supplier.status === 'pending' || supplier.status === 'in_progress') && (
                                    <DropdownMenuItem onClick={() => handleSendReminder(supplier.name)}>
                                      Send Reminder
                                    </DropdownMenuItem>
                                  )}
                                  {supplier.status === 'completed' && (
                                    <DropdownMenuItem onClick={() => toast.success(`Downloading report for ${supplier.name}`)}>
                                      Download Report
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="h-24 text-center">
                            No suppliers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Supplier</th>
                        <th className="h-10 px-4 text-left font-medium">Category</th>
                        <th className="h-10 px-4 text-left font-medium">Score</th>
                        <th className="h-10 px-4 text-left font-medium">Last Updated</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.filter(s => s.status === 'completed').map(supplier => (
                        <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 font-medium">{supplier.name}</td>
                          <td className="p-4">{supplier.category}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={supplier.score} className="h-2 w-20" />
                              <span>{supplier.score}/100</span>
                            </div>
                          </td>
                          <td className="p-4">{supplier.lastUpdated}</td>
                          <td className="p-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => toast.success(`Downloading report for ${supplier.name}`)}>
                              Download Report
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="in_progress" className="mt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Supplier</th>
                        <th className="h-10 px-4 text-left font-medium">Category</th>
                        <th className="h-10 px-4 text-left font-medium">Contact</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.filter(s => s.status === 'in_progress').map(supplier => (
                        <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 font-medium">{supplier.name}</td>
                          <td className="p-4">{supplier.category}</td>
                          <td className="p-4">{supplier.contact}</td>
                          <td className="p-4 text-right">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleSendReminder(supplier.name)}>
                              <Mail className="h-4 w-4 mr-1" /> Reminder
                            </Button>
                            <Button size="sm" onClick={() => toast.success(`Viewing audit for ${supplier.name}`)}>
                              View Progress
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Supplier</th>
                        <th className="h-10 px-4 text-left font-medium">Category</th>
                        <th className="h-10 px-4 text-left font-medium">Contact</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.filter(s => s.status === 'pending').map(supplier => (
                        <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 font-medium">{supplier.name}</td>
                          <td className="p-4">{supplier.category}</td>
                          <td className="p-4">{supplier.contact}</td>
                          <td className="p-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => handleSendReminder(supplier.name)}>
                              <Mail className="h-4 w-4 mr-1" /> Send Reminder
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="not_started" className="mt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Supplier</th>
                        <th className="h-10 px-4 text-left font-medium">Category</th>
                        <th className="h-10 px-4 text-left font-medium">Contact</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.filter(s => s.status === 'not_started').map(supplier => (
                        <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 font-medium">{supplier.name}</td>
                          <td className="p-4">{supplier.category}</td>
                          <td className="p-4">{supplier.contact}</td>
                          <td className="p-4 text-right">
                            <Button size="sm" onClick={() => handleStartAudit(supplier.id)}>
                              Start Audit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditDashboard;
