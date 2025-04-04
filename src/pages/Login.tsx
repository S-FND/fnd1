
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full eco-gradient flex items-center justify-center">
            <span className="text-white text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold">EcoNexus Enterprise</h1>
          <p className="text-muted-foreground">Sustainability Management Platform</p>
        </div>
        <div className="bg-background p-8 rounded-lg border shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Sign In</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
            </div>
            <LoginForm />
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EcoNexus. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
