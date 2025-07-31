import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';
interface LoginFormProps {
  onForgotPassword?: () => void; // Make it optional if needed
}
export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
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
      // For demo purposes, skip API call and use mock authentication
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials.');
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="email">Email</Label>
        {/* You can leave the right side empty if there's nothing like "Forgot password" */}
        <span></span>
      </div>
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
          {/* <a href="#" className="text-xs text-primary hover:underline">
            Forgot password?
          </a> */}
          {onForgotPassword && (
            <Button 
              variant="link" 
              type="button" 
              onClick={onForgotPassword}
              className="px-0 text-xs text-primary hover:underline h-auto"
            >
              Forgot password?
            </Button>
          )}
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
