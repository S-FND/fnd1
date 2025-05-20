import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Plus, Send, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cheqSuppliers } from '../../data/cheq-mock-data';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_started';
  score?: number;
  lastUpdated: string;
}

const CheQAuditDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Make sure the imported suppliers array conforms to the Supplier interface
  const [suppliers] = useState<Supplier[]>(cheqSuppliers as Supplier[]);
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReminder = (supplierName: string) => {
    toast.success(`Reminder sent to ${supplierName}`);
  };

  const handleStartAudit = (supplierId: string) => {
    toast.success("Audit invitation sent to supplier");
  };
  
  const completedCount = suppliers.filter(s => s.status === 'completed').length;
  const inProgressCount = suppliers.filter(s => s.status === 'in_progress').length;
  const pendingCount = suppliers.filter(s => s.status === 'pending').length;
  const notStartedCount = suppliers.filter(s => s.status === 'not_started').length;
  
  const averageScore = suppliers
    .filter(s => s.score !== undefined)
    .reduce((sum, current) => sum + (current.score || 0), 0) / 
    suppliers.filter(s => s.score !== undefined).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CheQ.one Supplier Audit Dashboard</h1>
        <p className="text-muted-foreground">
          Track and manage sustainability audits for CheQ.one's service providers
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Audit
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              Service providers in audit scope
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}/100</div>
            <p className="text-xs text-muted-foreground">
              Based on {completedCount} completed audits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((completedCount / suppliers.length) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {suppliers.length} audits completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount + notStartedCount}</div>
            <p className="text-xs text-muted-foreground">
              Suppliers yet to complete audits
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Audits</CardTitle>
          <CardDescription>ESG audit status for CheQ.one's technology and service providers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Suppliers ({suppliers.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="not_started">Not Started ({notStartedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <SupplierTable 
                suppliers={filteredSuppliers}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <SupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'completed')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="in_progress" className="mt-4">
              <SupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'in_progress')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <SupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'pending')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="not_started" className="mt-4">
              <SupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'not_started')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface SupplierTableProps {
  suppliers: Supplier[];
  handleSendReminder: (supplierName: string) => void;
  handleStartAudit: (supplierId: string) => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  handleSendReminder,
  handleStartAudit,
}) => {
  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No suppliers match your criteria</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="py-3 px-4 text-left font-medium">Supplier</th>
            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Contact</th>
            <th className="py-3 px-4 text-left font-medium">Category</th>
            <th className="py-3 px-4 text-left font-medium">Status</th>
            <th className="py-3 px-4 text-left font-medium hidden lg:table-cell">Last Updated</th>
            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Score</th>
            <th className="py-3 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{supplier.name}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">{supplier.email}</p>
                </div>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">{supplier.contact}</td>
              <td className="py-3 px-4">{supplier.category}</td>
              <td className="py-3 px-4">
                <StatusBadge status={supplier.status} />
              </td>
              <td className="py-3 px-4 hidden lg:table-cell">{supplier.lastUpdated}</td>
              <td className="py-3 px-4 hidden md:table-cell">
                {supplier.score ? (
                  <ScoreBadge score={supplier.score} />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-right">
                {supplier.status === 'not_started' ? (
                  <Button size="sm" onClick={() => handleStartAudit(supplier.id)}>
                    Start Audit
                  </Button>
                ) : supplier.status === 'pending' ? (
                  <Button size="sm" variant="outline" onClick={() => handleSendReminder(supplier.name)}>
                    <Send className="h-4 w-4 mr-1" />
                    Remind
                  </Button>
                ) : supplier.status === 'in_progress' ? (
                  <Button size="sm" variant="outline" onClick={() => handleSendReminder(supplier.name)}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Check Status
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    View Report
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge: React.FC<{status: string}> = ({status}) => {
  let variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | null
    | undefined = "outline";
  let label = "";
  
  switch (status) {
    case 'completed':
      variant = "default";
      label = "Completed";
      break;
    case 'in_progress':
      variant = "secondary";
      label = "In Progress";
      break;
    case 'pending':
      variant = "outline";
      label = "Pending";
      break;
    case 'not_started':
      variant = "outline";
      label = "Not Started";
      break;
  }
  
  return <Badge variant={variant}>{label}</Badge>;
};

const ScoreBadge: React.FC<{score: number}> = ({score}) => {
  let color = "";
  
  if (score >= 80) {
    color = "text-green-500";
  } else if (score >= 60) {
    color = "text-amber-500";
  } else {
    color = "text-red-500";
  }
  
  return <span className={`font-medium ${color}`}>{score}</span>;
};

export default CheQAuditDashboard;
