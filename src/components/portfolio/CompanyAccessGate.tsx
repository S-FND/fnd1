import React from 'react';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { useCompanyAccessControl } from '@/hooks/useCompanyAccessControl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Building2, Clock, Shield } from 'lucide-react';

interface CompanyAccessGateProps {
  children: React.ReactNode;
}

export const CompanyAccessGate: React.FC<CompanyAccessGateProps> = ({ children }) => {
  const { profile } = usePortfolioAuth();
  const { checkCompanyAccess, isLoading, shouldBypassCompanyApproval } = useCompanyAccessControl();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying company access...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <>{children}</>;
  }

  const accessCheck = checkCompanyAccess(
    profile.portfolio_company_id || undefined,
    profile.portfolio_company?.is_approved,
    profile.portfolio_company?.approval_status
  );

  // If access is granted, show the children
  if (accessCheck.hasAccess) {
    return <>{children}</>;
  }

  // Show company access denied page
  const isDemoBypass = shouldBypassCompanyApproval(profile.portfolio_company_id || undefined);
  const approvalStatus = profile.portfolio_company?.approval_status || 'pending';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            {approvalStatus === 'rejected' ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Clock className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <CardTitle className="text-xl font-semibold">
            {approvalStatus === 'rejected' ? 'Access Denied' : 'Company Approval Required'}
          </CardTitle>
          <CardDescription>
            {accessCheck.reason || 'Your company registration is pending approval'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Company Status</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.portfolio_company?.name || 'Unknown Company'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    approvalStatus === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : approvalStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {approvalStatus === 'rejected' && profile.portfolio_company?.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-red-800">Rejection Reason</h4>
                  <p className="text-sm text-red-700 mt-1">
                    {profile.portfolio_company.rejection_reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-blue-800">What's Next?</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {approvalStatus === 'rejected' 
                    ? 'Please contact your administrator to resolve the issues mentioned above.'
                    : 'Our team is reviewing your company registration. You will receive an email notification once approved.'
                  }
                </p>
              </div>
            </div>
          </div>

          {isDemoBypass && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-orange-800">Demo Mode Available</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Demo mode is enabled for your account. Contact support to access demo features.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.location.href = 'mailto:support@company.com'}
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};