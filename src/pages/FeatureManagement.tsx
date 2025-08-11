import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeaturesContext';
import { useFeatureValidation } from '@/hooks/useFeatureValidation';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { features, getFeaturesByCategory } from '@/data/features';
import { FeatureId } from '@/types/features';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Info, Lock } from 'lucide-react';

const FeatureManagementPage = () => {
  const { isLoading } = useRouteProtection(['admin']);
  const { user, isAuthenticated } = useAuth();
  const { companyFeatures, isFeatureActive, updateFeatures } = useFeatures();
  const { validateFeatureSelection, autoFixFeatureSelection, getAvailableFeatures } = useFeatureValidation();
  
  const [pendingFeatures, setPendingFeatures] = useState<FeatureId[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    if (companyFeatures) {
      setPendingFeatures(companyFeatures.activeFeatures);
    }
  }, [companyFeatures]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const validation = validateFeatureSelection(pendingFeatures);
  const available = getAvailableFeatures(pendingFeatures);

  const handleFeatureToggle = (featureId: FeatureId, checked: boolean) => {
    const newFeatures = checked 
      ? [...pendingFeatures, featureId]
      : pendingFeatures.filter(id => id !== featureId);
    
    setPendingFeatures(newFeatures);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!validation.isValid) {
      toast.error("Please fix validation issues before saving");
      return;
    }

    try {
      await updateFeatures(pendingFeatures);
      setHasChanges(false);
      toast.success("Features updated successfully");
    } catch (error) {
      toast.error("Failed to update features");
    }
  };

  const handleResetChanges = () => {
    if (companyFeatures) {
      setPendingFeatures(companyFeatures.activeFeatures);
      setHasChanges(false);
    }
  };

  const handleAutoFix = () => {
    const fixedFeatures = autoFixFeatureSelection(pendingFeatures);
    setPendingFeatures(fixedFeatures);
    setHasChanges(true);
    toast.success("Features auto-fixed");
  };

  const groupedFeatures = {
    core: getFeaturesByCategory('core'),
    operations: getFeaturesByCategory('operations'),
    reporting: getFeaturesByCategory('reporting'),
    management: getFeaturesByCategory('management')
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Management</h1>
        <p className="text-muted-foreground">
          Configure which features are available for your organization
        </p>
      </div>

      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {validation.errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {validation.requiredAdditions.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Some features require dependencies to be enabled.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAutoFix}
              className="ml-4"
            >
              Auto Fix
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Features</CardTitle>
            <CardDescription>
              Manage {category} related functionality for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryFeatures.map((feature) => {
                const isEnabled = pendingFeatures.includes(feature.id);
                const isAvailable = available.includes(feature.id);
                
                return (
                  <div
                    key={feature.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      !isAvailable ? 'opacity-50 bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{feature.name}</h3>
                        {isEnabled && isAvailable && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                      {feature.dependencies && feature.dependencies.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Requires: {feature.dependencies.map(dep => 
                              features.find(f => f.id === dep)?.name
                            ).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                      disabled={!isAvailable}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {hasChanges && (
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSaveChanges} disabled={!validation.isValid}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleResetChanges}>
            Reset Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeatureManagementPage;