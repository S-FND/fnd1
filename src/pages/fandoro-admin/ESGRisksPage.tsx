
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const mockESGRisks = [
  { id: '1', title: 'Carbon Emissions Exceedance', enterprise: 'Global Manufacturing', category: 'Environmental', riskIndex: 85, impact: 'High' },
  { id: '2', title: 'Supply Chain Labor Issues', enterprise: 'RetailPlus', category: 'Social', riskIndex: 78, impact: 'High' },
  { id: '3', title: 'Board Diversity Gap', enterprise: 'Finance Group', category: 'Governance', riskIndex: 72, impact: 'Medium' },
  { id: '4', title: 'Water Stress Exposure', enterprise: 'Acme Technologies', category: 'Environmental', riskIndex: 70, impact: 'High' },
  { id: '5', title: 'Data Privacy Concerns', enterprise: 'HealthFirst', category: 'Governance', riskIndex: 68, impact: 'Medium' },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Environmental':
      return 'bg-green-100 text-green-800';
    case 'Social':
      return 'bg-blue-100 text-blue-800';
    case 'Governance':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ESGRisksPage = () => {
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
              <h1 className="text-2xl font-bold tracking-tight">ESG Risks Management</h1>
              <p className="text-muted-foreground">
                Manage ESG risks for all enterprise clients.
              </p>
            </div>
            <Button>Add ESG Risk</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>ESG Risks</CardTitle>
              <CardDescription>A list of all ESG risks across enterprises</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Enterprise</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Risk Index</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockESGRisks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-medium">{risk.title}</TableCell>
                      <TableCell>{risk.enterprise}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(risk.category)}`}>
                          {risk.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          risk.riskIndex > 80 ? 'text-red-600' : 
                          risk.riskIndex > 70 ? 'text-amber-600' : 
                          'text-yellow-600'
                        }`}>
                          {risk.riskIndex}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          risk.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {risk.impact}
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

export default ESGRisksPage;
