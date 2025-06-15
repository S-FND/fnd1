
import { FeatureId, FeatureValidationResult } from '@/types/features';
import { features } from '@/data/features';

export const useFeatureValidation = () => {
  const validateFeatureSelection = (selectedFeatures: FeatureId[]): FeatureValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const requiredAdditions: FeatureId[] = [];
    const requiredRemovals: FeatureId[] = [];

    // Check dependencies
    selectedFeatures.forEach(featureId => {
      const feature = features.find(f => f.id === featureId);
      if (!feature) return;

      feature.dependencies.forEach(depId => {
        if (!selectedFeatures.includes(depId)) {
          errors.push(`${feature.name} requires ${features.find(f => f.id === depId)?.name}`);
          requiredAdditions.push(depId);
        }
      });
    });

    // Check for orphaned dependents - when removing a feature, warn about dependent features
    const featuresToRemove = features
      .filter(f => f.isDefault ? false : !selectedFeatures.includes(f.id))
      .map(f => f.id);

    featuresToRemove.forEach(featureId => {
      const feature = features.find(f => f.id === featureId);
      if (!feature) return;

      const dependents = features.filter(f => f.dependencies.includes(featureId));
      dependents.forEach(dependent => {
        if (selectedFeatures.includes(dependent.id)) {
          warnings.push(`Removing ${feature.name} will also remove ${dependent.name}`);
          requiredRemovals.push(dependent.id);
        }
      });
    });

    // Ensure default features are included
    const defaultFeatures = features.filter(f => f.isDefault).map(f => f.id);
    defaultFeatures.forEach(defaultFeature => {
      if (!selectedFeatures.includes(defaultFeature)) {
        requiredAdditions.push(defaultFeature);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      requiredAdditions: [...new Set(requiredAdditions)],
      requiredRemovals: [...new Set(requiredRemovals)]
    };
  };

  const autoFixFeatureSelection = (selectedFeatures: FeatureId[]): FeatureId[] => {
    const validation = validateFeatureSelection(selectedFeatures);
    
    // Add required dependencies
    let fixedFeatures = [...selectedFeatures, ...validation.requiredAdditions];
    
    // Remove orphaned dependents
    fixedFeatures = fixedFeatures.filter(f => !validation.requiredRemovals.includes(f));
    
    return [...new Set(fixedFeatures)];
  };

  const getAvailableFeatures = (currentFeatures: FeatureId[]): FeatureId[] => {
    // Return features that can be enabled based on current selection
    return features
      .filter(feature => {
        // Always allow default features
        if (feature.isDefault) return true;
        
        // Check if all dependencies are met
        return feature.dependencies.every(depId => currentFeatures.includes(depId));
      })
      .map(f => f.id);
  };

  return {
    validateFeatureSelection,
    autoFixFeatureSelection,
    getAvailableFeatures
  };
};
