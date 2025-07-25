
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const mockEnterprises = [
  { id: '1', name: 'Acme Technologies', sector: 'Technology', users: 245, activeUsers: 198, status: 'Active' },
  { id: '2', name: 'Global Manufacturing', sector: 'Manufacturing', users: 367, activeUsers: 302, status: 'Active' },
  { id: '3', name: 'RetailPlus', sector: 'Retail', users: 128, activeUsers: 98, status: 'Active' },
  { id: '4', name: 'HealthFirst', sector: 'Healthcare', users: 412, activeUsers: 350, status: 'Active' },
  { id: '5', name: 'Finance Group', sector: 'Finance', users: 289, activeUsers: 240, status: 'Inactive' }
];

const EnterprisesPage = () => {
  const { isLoading } = useRouteProtection('fandoro_admin');
  const { user, isFandoroAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isFandoroAdmin()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Enterprise Management</h1>
              <p className="text-muted-foreground">
                Manage all enterprise clients registered on the platform.
              </p>
            </div>
            <Button>Add Enterprise</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Enterprises</CardTitle>
              <CardDescription>A list of all registered enterprise clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEnterprises.map((enterprise) => (
                    <TableRow key={enterprise.id}>
                      <TableCell className="font-medium">{enterprise.name}</TableCell>
                      <TableCell>{enterprise.sector}</TableCell>
                      <TableCell>{enterprise.users}</TableCell>
                      <TableCell>{enterprise.activeUsers}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          enterprise.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {enterprise.status}
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

export default EnterprisesPage;
