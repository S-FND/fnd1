import React, { useState } from 'react';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  const { login, register, isLoading } = usePortfolioAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isRegistering) {
        await register(email, password, inviteCode, fullName);
        toast.success('Registration successful! Please check your email.');
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isRegistering ? 'Create Account' : 'Login'}</CardTitle>
          <CardDescription>
            {isRegistering ? 'Join your portfolio company' : 'Access your dashboard'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isRegistering && (
              <Input
                placeholder="Invite Code (optional)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};