
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, User, FileCheck } from 'lucide-react';

const Login = () => {
  const [loginType, setLoginType] = useState<string>('company');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full eco-gradient flex items-center justify-center">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <h1 className="text-2xl font-bold">Fandoro Enterprise</h1>
          <p className="text-muted-foreground">Sustainability Management Platform</p>
        </div>
        <div className="bg-background p-8 rounded-lg border shadow-sm">
          <div className="space-y-4">
            <Tabs defaultValue="company" onValueChange={setLoginType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Company</span>
                </TabsTrigger>
                <TabsTrigger value="supplier" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Supplier</span>
                </TabsTrigger>
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>Vendor</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="company" className="pt-4">
                <div>
                  <h2 className="text-xl font-semibold">Company Sign In</h2>
                  <p className="text-sm text-muted-foreground mb-4">For company employees and administrators</p>
                  <LoginForm />
                  <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <p>Demo accounts:</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li>Admin: admin@example.com / password</li>
                      <li>Manager: manager@example.com / password</li>
                      <li>Employee: employee@example.com / password</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="supplier" className="pt-4">
                <div>
                  <h2 className="text-xl font-semibold">Supplier Sign In</h2>
                  <p className="text-sm text-muted-foreground mb-4">For supplier companies participating in sustainability audits</p>
                  <LoginForm />
                  <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <p>Demo supplier accounts:</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li>EcoPackaging: supplier.eco@example.com / password</li>
                      <li>GreenTech: supplier.green@example.com / password</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vendor" className="pt-4">
                <div>
                  <h2 className="text-xl font-semibold">Vendor Sign In</h2>
                  <p className="text-sm text-muted-foreground mb-4">For training vendors providing EHS training services</p>
                  <LoginForm />
                  <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <p>Demo vendor accounts:</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li>SafetyFirst: vendor1@example.com / password</li>
                      <li>EHS Excellence: vendor2@example.com / password</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fandoro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
