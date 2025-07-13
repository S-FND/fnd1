import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      // Direct API call using httpClient
      // const response = await httpClient.post('http://localhost:3002/auth/login', {
      //   email,
      //   password
      // });
      
      // console.log('Login API response:', response);
      // toast.success('API call successful!');
      
      // Continue with existing auth flow
      await login(email, password);
    } catch (err: any) {
      console.error('Login API error:', err);
      setError('Failed to login. Please check your credentials.');
      toast.error(`API Error: ${err.message || 'Login failed'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </>
        ) : (
          'Login'
        )}
      </Button>
      
      {import.meta.env.VITE_ENV_NAME !== 'Production' && <div className="text-center text-sm text-muted-foreground">
        <p>Demo Accounts:</p>
        <p className="font-semibold text-primary">fandoro@admin.com / admin123 (Fandoro Super Admin)</p>
        <p>admin@company.com / password (Enterprise Admin)</p>
        <p>unitadmin@company.com / password (Unit Admin)</p>
        <p>manager@company.com / password (Manager)</p>
        <p>employee@company.com / password (Employee)</p>
      </div>}
    </form>
  );
};
