import React from 'react';
import { ProtectedRoute } from '@/components/portfolio/ProtectedRoute';
import { PermissionGate } from '@/components/portfolio/PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['supplier']}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supplier Portal</h1>
            <p className="text-muted-foreground">Requests to fulfill and compliance uploads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                1 due tomorrow
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                ESG questionnaire
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                uploaded this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PermissionGate resource="requests" action="read">
            <Card>
              <CardHeader>
                <CardTitle>Active Requests</CardTitle>
                <CardDescription>Complete these requests to maintain compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">ESG Due Diligence Questionnaire</p>
                    <p className="text-sm text-muted-foreground">Due: Tomorrow</p>
                  </div>
                  <Button variant="outline" size="sm">Complete</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Environmental Certificates</p>
                    <p className="text-sm text-muted-foreground">Due: Next week</p>
                  </div>
                  <PermissionGate resource="uploads" action="write">
                    <Button variant="outline" size="sm">Upload</Button>
                  </PermissionGate>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Financial Compliance Report</p>
                    <p className="text-sm text-muted-foreground">Due: In 2 weeks</p>
                  </div>
                  <Button variant="outline" size="sm">Start</Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGate>

          <PermissionGate resource="uploads" action="read">
            <Card>
              <CardHeader>
                <CardTitle>Document Uploads</CardTitle>
                <CardDescription>Upload required compliance documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Drag and drop files here, or click to browse
                  </p>
                  <PermissionGate resource="uploads" action="write">
                    <Button variant="outline">Choose Files</Button>
                  </PermissionGate>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Uploads</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>carbon-footprint-2024.pdf</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>safety-certificate.pdf</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>audit-report-q3.pdf</span>
                      <span className="text-yellow-600">Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PermissionGate>
        </div>
      </div>
    </ProtectedRoute>
  );
};