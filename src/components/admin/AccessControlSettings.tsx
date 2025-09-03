import React from 'react';
import { useCompanyAccessControl } from '@/hooks/useCompanyAccessControl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Settings, AlertCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

export const AccessControlSettings: React.FC = () => {
  const {
    accessSettings,
    demoSettings,
    isLoading,
    updateAccessSettings,
    updateDemoSettings,
  } = useCompanyAccessControl();

  const handleToggleCompanyAccess = async (enabled: boolean) => {
    try {
      await updateAccessSettings({ enabled });
    } catch (error) {
      console.error('Error toggling company access:', error);
    }
  };

  const handleToggleDemoMode = async (demo_mode_enabled: boolean) => {
    try {
      await updateAccessSettings({ demo_mode_enabled });
    } catch (error) {
      console.error('Error toggling demo mode:', error);
    }
  };

  const handleToggleDemoAccounts = async (enabled: boolean) => {
    try {
      await updateDemoSettings({ enabled });
    } catch (error) {
      console.error('Error toggling demo accounts:', error);
    }
  };

  const handleToggleDemoBypass = async (bypass_company_approval: boolean) => {
    try {
      await updateDemoSettings({ bypass_company_approval });
    } catch (error) {
      console.error('Error toggling demo bypass:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Access Control Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Company Access Control</CardTitle>
          </div>
          <CardDescription>
            Control whether only approved companies can access the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="company-access-enabled">Enable Company Approval</Label>
              <p className="text-sm text-muted-foreground">
                Require company approval before users can access the application
              </p>
            </div>
            <Switch
              id="company-access-enabled"
              checked={accessSettings?.enabled ?? true}
              onCheckedChange={handleToggleCompanyAccess}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="demo-mode">Global Demo Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Allow all companies to bypass approval (for demonstrations)
                </p>
              </div>
              <Switch
                id="demo-mode"
                checked={accessSettings?.demo_mode_enabled ?? false}
                onCheckedChange={handleToggleDemoMode}
                disabled={!(accessSettings?.enabled ?? true)}
              />
            </div>
          </div>

          {accessSettings?.demo_mode_enabled && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Demo Mode Active</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                All companies can access the application without approval while demo mode is enabled.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <CardTitle>Demo Account Settings</CardTitle>
          </div>
          <CardDescription>
            Configure demo account behavior and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="demo-accounts-enabled">Enable Demo Accounts</Label>
              <p className="text-sm text-muted-foreground">
                Allow demo accounts to be created and used
              </p>
            </div>
            <Switch
              id="demo-accounts-enabled"
              checked={demoSettings?.enabled ?? true}
              onCheckedChange={handleToggleDemoAccounts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="demo-bypass">Demo Bypass Company Approval</Label>
              <p className="text-sm text-muted-foreground">
                Allow demo accounts to bypass company approval requirements
              </p>
            </div>
            <Switch
              id="demo-bypass"
              checked={demoSettings?.bypass_company_approval ?? true}
              onCheckedChange={handleToggleDemoBypass}
              disabled={!(demoSettings?.enabled ?? true)}
            />
          </div>

          <div className="space-y-3">
            <Label>Demo Company IDs</Label>
            <p className="text-sm text-muted-foreground">
              Specific company IDs that should be treated as demo accounts (one per line)
            </p>
            <Textarea
              placeholder="Enter company IDs..."
              value={accessSettings?.demo_company_ids?.join('\n') || ''}
              onChange={(e) => {
                const ids = e.target.value.split('\n').filter(id => id.trim());
                updateAccessSettings({ demo_company_ids: ids });
              }}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Current Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Company Access Control</span>
                <Badge variant={accessSettings?.enabled ? 'default' : 'secondary'}>
                  {accessSettings?.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Global Demo Mode</span>
                <Badge variant={accessSettings?.demo_mode_enabled ? 'destructive' : 'secondary'}>
                  {accessSettings?.demo_mode_enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Demo Accounts</span>
                <Badge variant={demoSettings?.enabled ? 'default' : 'secondary'}>
                  {demoSettings?.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Demo Companies</span>
                <Badge variant="outline">
                  {accessSettings?.demo_company_ids?.length || 0} configured
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};