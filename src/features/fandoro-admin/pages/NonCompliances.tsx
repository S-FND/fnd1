
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const mockNonCompliances = [
  { id: '1', title: 'Air Quality Monitoring', enterprise: 'Global Manufacturing', regulation: 'Environmental Protection Act', severity: 'High', status: 'Open' },
  { id: '2', title: 'Hazardous Waste Management', enterprise: 'Acme Technologies', regulation: 'Waste Management Rules', severity: 'High', status: 'In Progress' },
  { id: '3', title: 'Worker Safety Training', enterprise: 'RetailPlus', regulation: 'Occupational Safety Act', severity: 'Medium', status: 'Open' },
  { id: '4', title: 'Emissions Reporting', enterprise: 'Finance Group', regulation: 'Clean Air Act', severity: 'High', status: 'Open' },
  { id: '5', title: 'Water Discharge Permits', enterprise: 'HealthFirst', regulation: 'Water Act', severity: 'Medium', status: 'In Progress' },
];

const NonCompliancesPage = () => {
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
              <h1 className="text-2xl font-bold tracking-tight">Non-Compliances Management</h1>
              <p className="text-muted-foreground">
                Manage regulatory non-compliances for all enterprise clients.
              </p>
            </div>
            <Button>Add Non-Compliance</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Non-Compliances</CardTitle>
              <CardDescription>A list of all regulatory non-compliances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Enterprise</TableHead>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNonCompliances.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.enterprise}</TableCell>
                      <TableCell>{item.regulation}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.severity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
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

export default NonCompliancesPage;
