
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Building, CheckCircle, Circle, ClipboardList, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditProgress, setAuditProgress] = useState<number>(
    user?.supplierInfo?.auditStatus === 'completed' ? 100 :
    user?.supplierInfo?.auditStatus === 'in_progress' ? 45 : 0
  );

  const handleStartAudit = () => {
    setAuditProgress(15);
    toast.success("Audit process started. Please complete all sections.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.supplierInfo?.name}! Manage your sustainability audits and profile here.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Review and update your company information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                <p>{user?.supplierInfo?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p>{user?.supplierInfo?.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Person</h3>
                <p>{user?.supplierInfo?.contactPerson}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Edit Profile</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Audit</CardTitle>
          <CardDescription>Current audit status and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Completion Progress</div>
              <div className="text-sm text-muted-foreground">{auditProgress}%</div>
            </div>
            <Progress value={auditProgress} className="h-2" />
          </div>

          {auditProgress === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <ClipboardList className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Active Audit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have any active sustainability audits. Click below to start the process.
              </p>
              <Button onClick={handleStartAudit}>Start Audit Process</Button>
            </div>
          ) : (
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="environmental">Environmental</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Company Information</h4>
                      <p className="text-sm text-muted-foreground">Basic company details completed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sustainability Policy</h4>
                      <p className="text-sm text-muted-foreground">Upload your sustainability policy document</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Management Systems</h4>
                      <p className="text-sm text-muted-foreground">Provide details on your management systems</p>
                    </div>
                  </div>
                </div>
                <Button>Continue General Section</Button>
              </TabsContent>
              
              <TabsContent value="environmental" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Carbon Footprint</h4>
                      <p className="text-sm text-muted-foreground">Report your annual carbon emissions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Waste Management</h4>
                      <p className="text-sm text-muted-foreground">Describe your waste management practices</p>
                    </div>
                  </div>
                </div>
                <Button>Start Environmental Section</Button>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Labor Practices</h4>
                      <p className="text-sm text-muted-foreground">Details on workforce and labor practices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Community Engagement</h4>
                      <p className="text-sm text-muted-foreground">Report on community involvement</p>
                    </div>
                  </div>
                </div>
                <Button>Start Social Section</Button>
              </TabsContent>

              <TabsContent value="governance" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Business Ethics</h4>
                      <p className="text-sm text-muted-foreground">Describe your ethical business practices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Anti-Corruption Policies</h4>
                      <p className="text-sm text-muted-foreground">Provide details on anti-corruption measures</p>
                    </div>
                  </div>
                </div>
                <Button>Start Governance Section</Button>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents & Certifications</CardTitle>
          <CardDescription>Upload and manage your sustainability documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">ISO 14001 Certification</p>
                  <p className="text-xs text-muted-foreground">Environmental Management System</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upload</Button>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Carbon Disclosure Report</p>
                  <p className="text-xs text-muted-foreground">Annual GHG emissions report</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upload</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Sustainability Policy</p>
                  <p className="text-xs text-muted-foreground">Company sustainability policy document</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upload</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDashboard;
