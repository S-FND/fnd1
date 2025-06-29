
import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
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

  const handleFeatureToggle = (featureId: FeatureId, enabled: boolean) => {
    let newFeatures: FeatureId[];
    
    if (enabled) {
      newFeatures = [...pendingFeatures, featureId];
    } else {
      newFeatures = pendingFeatures.filter(f => f !== featureId);
    }
    
    // Auto-fix dependencies
    const fixedFeatures = autoFixFeatureSelection(newFeatures);
    setPendingFeatures(fixedFeatures);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    const validation = validateFeatureSelection(pendingFeatures);
    
    if (!validation.isValid) {
      toast.error('Please resolve validation errors before saving');
      return;
    }
    
    try {
      await updateFeatures(pendingFeatures);
      setHasChanges(false);
      toast.success('Feature configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save feature configuration');
    }
  };

  const handleResetChanges = () => {
    if (companyFeatures) {
      setPendingFeatures(companyFeatures.activeFeatures);
      setHasChanges(false);
    }
  };

  const validation = validateFeatureSelection(pendingFeatures);
  const availableFeatures = getAvailableFeatures(pendingFeatures);
  const categorizedFeatures = {
    core: getFeaturesByCategory('core'),
    operations: getFeaturesByCategory('operations'),
    reporting: getFeaturesByCategory('reporting'),
    management: getFeaturesByCategory('management')
  };

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Management</h1>
          <p className="text-muted-foreground">
            Configure which features are available for your organization
          </p>
        </div>

        {!validation.isValid && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Configuration Issues:</div>
                {validation.errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Warnings:</div>
                {validation.warnings.map((warning, index) => (
                  <div key={index}>• {warning}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {Object.entries(categorizedFeatures).map(([category, categoryFeatures]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category} Features</CardTitle>
              <CardDescription>
                {category === 'core' && 'Essential application features'}
                {category === 'operations' && 'Business operation and ESG management features'}
                {category === 'reporting' && 'Analytics and reporting capabilities'}
                {category === 'management' && 'Administrative and management tools'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryFeatures.map((feature) => {
                  const isPending = pendingFeatures.includes(feature.id);
                  const isCurrentlyActive = isFeatureActive(feature.id);
                  const isAvailable = availableFeatures.includes(feature.id);
                  const activationDate = companyFeatures?.activationDates[feature.id];
                  
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{feature.name}</h4>
                          {feature.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                          {isCurrentlyActive && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          {!isAvailable && !feature.isDefault && !isPending && (
                            <Badge variant="outline" className="text-gray-500">
                              <Lock className="h-3 w-3 mr-1" />
                              Requires Dependencies
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        
                        {feature.dependencies.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Requires: {feature.dependencies.map(dep => 
                              features.find(f => f.id === dep)?.name
                            ).join(', ')}
                          </div>
                        )}
                        
                        {activationDate && (
                          <div className="text-xs text-muted-foreground">
                            Activated: {new Date(activationDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <Switch
                        checked={isPending}
                        onCheckedChange={(enabled) => handleFeatureToggle(feature.id, enabled)}
                        disabled={feature.isDefault || (!isAvailable && !isPending)}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {hasChanges && (
          <div className="flex gap-2 sticky bottom-4">
            <Button onClick={handleSaveChanges} disabled={!validation.isValid}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleResetChanges}>
              Reset Changes
            </Button>
          </div>
        )}
      </div>
    </UnifiedSidebarLayout>
  );
};

export default FeatureManagementPage;
