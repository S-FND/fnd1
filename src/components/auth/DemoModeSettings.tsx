import React from 'react';
import { useCompanyAccessControl } from '@/hooks/useCompanyAccessControl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Settings2 } from 'lucide-react';

interface DemoModeSettingsProps {
  className?: string;
}

export const DemoModeSettings: React.FC<DemoModeSettingsProps> = ({ className }) => {
  const {
    accessSettings,
    demoSettings,
    isLoading,
    updateAccessSettings,
    updateDemoSettings,
  } = useCompanyAccessControl();

  const handleToggleDemoMode = async (demo_mode_enabled: boolean) => {
    try {
      await updateAccessSettings({ demo_mode_enabled });
    } catch (error) {
      console.error('Error toggling demo mode:', error);
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
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            <CardTitle>Demo Mode</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          <CardTitle>Demo Mode</CardTitle>
        </div>
        <CardDescription>
          Quick toggle for demo and testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="quick-demo-mode">Enable Demo Mode</Label>
            <p className="text-sm text-muted-foreground">
              Allow all companies to bypass approval requirements
            </p>
          </div>
          <Switch
            id="quick-demo-mode"
            checked={accessSettings?.demo_mode_enabled ?? false}
            onCheckedChange={handleToggleDemoMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="demo-bypass-approval">Demo Bypass Approval</Label>
            <p className="text-sm text-muted-foreground">
              Allow demo accounts to skip company approval
            </p>
          </div>
          <Switch
            id="demo-bypass-approval"
            checked={demoSettings?.bypass_company_approval ?? true}
            onCheckedChange={handleToggleDemoBypass}
            disabled={!(demoSettings?.enabled ?? true)}
          />
        </div>

        {accessSettings?.demo_mode_enabled && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Demo Mode Active</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              All users can access the application without company approval while demo mode is enabled.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">Current Status</span>
          <div className="flex gap-2">
            <Badge variant={accessSettings?.demo_mode_enabled ? 'destructive' : 'secondary'}>
              {accessSettings?.demo_mode_enabled ? 'Demo Active' : 'Production'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};