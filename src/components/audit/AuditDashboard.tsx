import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AuditSummaryStats from './AuditSummaryStats';
import AuditActions from './AuditActions';
import AuditSupplierTable from './AuditSupplierTable';

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
      supplier.id === supplierId ? { ...supplier, status: 'pending' as const } : supplier
    ));
    toast.success("Audit invitation sent to supplier");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Audit Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track sustainability audits for your suppliers
        </p>
      </div>

      <AuditActions 
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Audit Summary</CardTitle>
          <CardDescription>Overview of supplier sustainability compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditSummaryStats suppliers={suppliers} />
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
              <AuditSupplierTable 
                suppliers={filteredSuppliers}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <AuditSupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'completed')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="in_progress" className="mt-4">
              <AuditSupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'in_progress')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <AuditSupplierTable 
                suppliers={filteredSuppliers.filter(s => s.status === 'pending')}
                handleSendReminder={handleSendReminder}
                handleStartAudit={handleStartAudit}
              />
            </TabsContent>

            <TabsContent value="not_started" className="mt-4">
              <AuditSupplierTable 
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

export default AuditDashboard;
