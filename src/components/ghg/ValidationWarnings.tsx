import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { ValidationResult } from '@/utils/dataQualityValidation';

interface ValidationWarningsProps {
  validationResult: ValidationResult | null;
  periodName?: string;
}

export const ValidationWarnings: React.FC<ValidationWarningsProps> = ({
  validationResult,
  periodName,
}) => {
  if (!validationResult || validationResult.warnings.length === 0) {
    return null;
  }

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-2">
      {validationResult.warnings.map((warning, index) => (
        <Alert key={index} variant={getVariant(warning.severity)} className="py-3">
          <div className="flex gap-2">
            {getIcon(warning.severity)}
            <div className="flex-1 space-y-1">
              <AlertDescription className="text-sm">
                {periodName && <span className="font-semibold">{periodName}: </span>}
                {warning.message}
              </AlertDescription>
              {warning.suggestedAction && (
                <AlertDescription className="text-xs text-muted-foreground">
                  💡 {warning.suggestedAction}
                </AlertDescription>
              )}
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};