import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';

interface UnauthorizedPageProps {
  message?: string;
  showGoBack?: boolean;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  message = "You don't have permission to access this page",
  showGoBack = true,
}) => {
  const navigate = useNavigate();
  const { profile, redirectToDashboard } = usePortfolioAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (profile) {
      redirectToDashboard(profile.role);
    } else {
      navigate('/');
    }
  };

  const handleGoToDashboard = () => {
    if (profile) {
      redirectToDashboard(profile.role);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {message}
          </p>
          
          <div className="space-y-3">
            {showGoBack && (
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            )}
            
            <Button 
              onClick={handleGoToDashboard}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
          
          {profile && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Current role: <span className="font-medium text-foreground">
                  {profile.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};