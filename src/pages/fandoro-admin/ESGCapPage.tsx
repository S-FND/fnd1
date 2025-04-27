
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const mockESGCAPItems = [
  { id: '1', title: 'Reduce Carbon Emissions', enterprise: 'Acme Technologies', dueDate: '2024-06-15', status: 'In Progress' },
  { id: '2', title: 'Water Conservation Plan', enterprise: 'Global Manufacturing', dueDate: '2024-07-20', status: 'Not Started' },
  { id: '3', title: 'Diversity & Inclusion Program', enterprise: 'RetailPlus', dueDate: '2024-06-30', status: 'Completed' },
  { id: '4', title: 'Sustainable Supply Chain', enterprise: 'HealthFirst', dueDate: '2024-08-15', status: 'In Progress' },
  { id: '5', title: 'ESG Reporting Framework', enterprise: 'Finance Group', dueDate: '2024-07-10', status: 'In Progress' }
];

const ESGCapPage = () => {
  const { isLoading } = useRouteProtection('fandoro_admin');
  const { user, isFandoroAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isFandoroAdmin()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ESG Corrective Action Plans</h1>
              <p className="text-muted-foreground">
                Manage ESG CAP items for all enterprise clients.
              </p>
            </div>
            <Button>Add CAP Item</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>ESG CAP Items</CardTitle>
              <CardDescription>A list of all ESG corrective action plan items</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Enterprise</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockESGCAPItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.enterprise}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ESGCapPage;
