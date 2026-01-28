/**
 * Data Quality Validation Utility
 * Detects anomalies and validates data quality for GHG activity data
 */

// import { supabase } from "@/integrations/supabase/client";

export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  severity: 'info' | 'warning' | 'error';
}

export interface ValidationWarning {
  type: 'anomaly_high' | 'anomaly_low' | 'missing_data' | 'suspicious_pattern' | 'out_of_range';
  message: string;
  severity: 'info' | 'warning' | 'error';
  suggestedAction?: string;
}

interface HistoricalStats {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  count: number;
}

/**
 * Calculate statistical measures for historical data
 */
const calculateStats = (values: number[]): HistoricalStats => {
  if (values.length === 0) {
    return { mean: 0, stdDev: 0, min: 0, max: 0, count: 0 };
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    stdDev,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
  };
};

/**
 * Fetch historical data for anomaly detection
 */
const fetchHistoricalData = async (sourceId: string, periodName: string): Promise<number[]> => {
  try {
    // const { data, error } = await supabase
    //   .from('ghg_activity_data')
    //   .select('activity_value')
    //   .eq('source_id', sourceId)
    //   .eq('period_name', periodName)
    //   .order('created_at', { ascending: false })
    //   .limit(12); // Last 12 entries for trend analysis

    // if (error) throw error;
    let data=[]
    return data?.map(d => d.activity_value) || [];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

/**
 * Validate single activity value against historical data
 */
export const validateActivityValue = async (
  sourceId: string,
  periodName: string,
  activityValue: number,
  activityUnit: string
): Promise<ValidationResult> => {
  const warnings: ValidationWarning[] = [];

  // Basic validation
  if (activityValue < 0) {
    warnings.push({
      type: 'out_of_range',
      message: 'Activity value cannot be negative',
      severity: 'error',
      suggestedAction: 'Enter a positive value',
    });
    return { isValid: false, warnings, severity: 'error' };
  }

  if (activityValue === 0) {
    warnings.push({
      type: 'missing_data',
      message: 'Activity value is zero - is this expected?',
      severity: 'info',
      suggestedAction: 'Confirm that no activity occurred in this period',
    });
  }

  // Fetch historical data for comparison
  const historicalValues = await fetchHistoricalData(sourceId, periodName);

  if (historicalValues.length < 3) {
    // Not enough data for statistical analysis
    return { isValid: true, warnings, severity: 'info' };
  }

  const stats = calculateStats(historicalValues);

  // Anomaly detection using Z-score (statistical outlier detection)
  const zScore = stats.stdDev > 0 ? Math.abs((activityValue - stats.mean) / stats.stdDev) : 0;

  // High deviation (Z-score > 2 means 95% confidence of anomaly)
  if (zScore > 2) {
    const percentDiff = ((activityValue - stats.mean) / stats.mean) * 100;
    
    if (activityValue > stats.mean) {
      warnings.push({
        type: 'anomaly_high',
        message: `Value is ${Math.abs(percentDiff).toFixed(0)}% higher than historical average (${stats.mean.toFixed(2)} ${activityUnit})`,
        severity: 'warning',
        suggestedAction: 'Verify data accuracy and provide notes explaining the increase',
      });
    } else {
      warnings.push({
        type: 'anomaly_low',
        message: `Value is ${Math.abs(percentDiff).toFixed(0)}% lower than historical average (${stats.mean.toFixed(2)} ${activityUnit})`,
        severity: 'warning',
        suggestedAction: 'Verify data accuracy and provide notes explaining the decrease',
      });
    }
  }

  // Extreme outlier detection (Z-score > 3 means 99.7% confidence)
  if (zScore > 3) {
    warnings.push({
      type: 'suspicious_pattern',
      message: 'This value is an extreme outlier compared to historical data',
      severity: 'error',
      suggestedAction: 'Double-check measurement accuracy and units. Consider re-measuring if possible.',
    });
  }

  // Range validation (outside historical min/max by significant margin)
  if (activityValue > stats.max * 1.5) {
    warnings.push({
      type: 'out_of_range',
      message: `Value exceeds historical maximum (${stats.max.toFixed(2)} ${activityUnit}) by 50%+`,
      severity: 'warning',
      suggestedAction: 'Verify equipment readings and calculation methods',
    });
  }

  const maxSeverity = warnings.reduce((max, w) => {
    if (w.severity === 'error') return 'error';
    if (w.severity === 'warning' && max !== 'error') return 'warning';
    return max;
  }, 'info' as 'info' | 'warning' | 'error');

  return {
    isValid: maxSeverity !== 'error',
    warnings,
    severity: maxSeverity,
  };
};

/**
 * Validate multiple period entries in bulk
 */
export const validateBulkData = async (
  sourceId: string,
  periodEntries: Array<{ period_name: string; activity_value: number }>,
  activityUnit: string
): Promise<Map<string, ValidationResult>> => {
  const results = new Map<string, ValidationResult>();

  // Validate each period
  for (const entry of periodEntries) {
    if (entry.activity_value > 0) {
      const result = await validateActivityValue(
        sourceId,
        entry.period_name,
        entry.activity_value,
        activityUnit
      );
      results.set(entry.period_name, result);
    }
  }

  // Check for suspicious patterns across periods (e.g., all zeros, all identical values)
  const nonZeroValues = periodEntries.filter(e => e.activity_value > 0).map(e => e.activity_value);
  
  if (nonZeroValues.length > 3) {
    const allIdentical = nonZeroValues.every(val => val === nonZeroValues[0]);
    
    if (allIdentical) {
      periodEntries.forEach(entry => {
        const existing = results.get(entry.period_name) || { isValid: true, warnings: [], severity: 'info' };
        existing.warnings.push({
          type: 'suspicious_pattern',
          message: 'Multiple periods have identical values - verify data accuracy',
          severity: 'warning',
          suggestedAction: 'Confirm that measurements are correct and not copied',
        });
        results.set(entry.period_name, existing);
      });
    }
  }

  return results;
};

/**
 * Get data quality score (0-100)
 */
export const calculateDataQualityScore = (validationResult: ValidationResult): number => {
  if (validationResult.warnings.length === 0) return 100;

  let score = 100;
  
  validationResult.warnings.forEach(warning => {
    switch (warning.severity) {
      case 'error':
        score -= 30;
        break;
      case 'warning':
        score -= 15;
        break;
      case 'info':
        score -= 5;
        break;
    }
  });

  return Math.max(0, score);
};